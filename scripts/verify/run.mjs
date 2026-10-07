import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildApp, controlledBuildEnv, exportGitRef, relativeToRepo } from './lib/build.mjs';
import { serveStatic } from './lib/serve.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const suitesDir = path.join(repoRoot, 'scripts/verify/suites');
const artifactsDir = path.join(repoRoot, 'dist/verify');
const SUITE_TIMEOUT_MS = 6 * 60 * 1000;

const SUITES = [
  { name: 'content', needs: [] },
  { name: 'product-details', needs: ['app', 'reference'] },
  { name: 'home-cart', needs: ['app'] },
  { name: 'compare', needs: ['app'] },
  { name: 'compare-store', needs: [] },
  { name: 'search', needs: ['app'] },
  { name: 'cart', needs: ['app'] },
  { name: 'favorites', needs: ['app'] },
  { name: 'checkout', needs: ['app'] },
  { name: 'order', needs: ['app'] },
  { name: 'form-unconfigured', needs: ['app'] },
  { name: 'info', needs: ['app'] },
  { name: 'contacts', needs: ['app'] },
  { name: 'account', needs: ['app'] },
];

const KNOWN_DRIFT = {
  favorites: ['shell: comparison specimen 3 unchanged'],
};

function parseArgs(argv) {
  const options = { reference: 'HEAD', keepArtifacts: false, suites: [] };
  for (const arg of argv) {
    if (arg.startsWith('--reference=')) options.reference = arg.slice('--reference='.length);
    else if (arg === '--keep-artifacts') options.keepArtifacts = true;
    else if (arg.startsWith('--')) throw new Error(`Unknown option ${arg}`);
    else options.suites.push(arg);
  }
  const known = new Set(SUITES.map((suite) => suite.name));
  const unknown = options.suites.filter((name) => !known.has(name));
  if (unknown.length > 0) {
    throw new Error(`Unknown suite(s): ${unknown.join(', ')}. Available: ${[...known].join(', ')}`);
  }
  return options;
}

function runSuite(suite, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(suitesDir, `${suite.name}.mjs`)], {
      cwd: repoRoot,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    const timer = setTimeout(() => {
      output += `\nRunner timeout after ${SUITE_TIMEOUT_MS} ms`;
      child.kill();
    }, SUITE_TIMEOUT_MS);
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.on('exit', (code) => {
      clearTimeout(timer);
      resolve({ output, code });
    });
  });
}

function evaluateSuite(name, { output, code }) {
  const result = [...output.matchAll(/^RESULT (\d+)\/(\d+)$/gm)].pop();
  const failures = [...output.matchAll(/^FAIL (.*)$/gm)].map((match) => match[1].trim());
  const drift = KNOWN_DRIFT[name] ?? [];
  const isKnown = (failure) =>
    drift.some((known) => failure === known || failure.startsWith(`${known} — `));
  const knownFailures = failures.filter(isKnown);
  const newFailures = failures.filter((failure) => !isKnown(failure));
  const passed = result ? Number(result[1]) : 0;
  const total = result ? Number(result[2]) : 0;
  const aborted =
    !result || total === 0 || (code !== 0 && code !== null && newFailures.length === 0);
  return {
    name,
    passed,
    total,
    knownFailures,
    newFailures,
    aborted,
    green: !aborted && newFailures.length === 0,
  };
}

const options = parseArgs(process.argv.slice(2));
const selected = SUITES.filter(
  (suite) => options.suites.length === 0 || options.suites.includes(suite.name),
);
const needs = new Set(selected.flatMap((suite) => suite.needs));

rmSync(artifactsDir, { recursive: true, force: true });
mkdirSync(path.join(artifactsDir, 'logs'), { recursive: true });
const emptyEnvDir = path.join(artifactsDir, 'empty-env');
const servers = [];
const suiteEnv = { ...controlledBuildEnv() };

try {
  if (needs.has('app')) {
    const appDir = path.join(artifactsDir, 'app');
    const mode = await buildApp({ sourceRoot: repoRoot, outDir: appDir, envDir: emptyEnvDir });
    console.log(`Built working tree → ${relativeToRepo(repoRoot, appDir)} (${mode})`);
    const server = await serveStatic(appDir);
    servers.push(server);
    suiteEnv.GOODCALL_VERIFY_BASE = server.base;
  }
  if (needs.has('reference')) {
    const sourceDir = path.join(artifactsDir, 'reference-src');
    const referenceDir = path.join(artifactsDir, 'reference-app');
    const sha = await exportGitRef({ repoRoot, ref: options.reference, targetDir: sourceDir });
    const mode = await buildApp({
      sourceRoot: sourceDir,
      outDir: referenceDir,
      envDir: emptyEnvDir,
    });
    console.log(
      `Built reference ${options.reference} (${sha.slice(0, 12)}) → ${relativeToRepo(repoRoot, referenceDir)} (${mode})`,
    );
    rmSync(sourceDir, { recursive: true, force: true });
    const server = await serveStatic(referenceDir);
    servers.push(server);
    suiteEnv.GOODCALL_VERIFY_REFERENCE_BASE = server.base;
  }

  const summaries = [];
  for (const suite of selected) {
    const outDir = path.join(artifactsDir, 'suites', suite.name);
    const run = await runSuite(suite, { ...suiteEnv, GOODCALL_VERIFY_OUT: outDir });
    writeFileSync(path.join(artifactsDir, 'logs', `${suite.name}.log`), run.output);
    const summary = evaluateSuite(suite.name, run);
    summaries.push(summary);
    const status = summary.aborted ? 'ABORTED' : summary.green ? 'PASS' : 'FAIL';
    console.log(`${suite.name}: ${summary.passed}/${summary.total} ${status}`);
    for (const failure of summary.newFailures) console.log(`   FAIL ${failure}`);
    for (const failure of summary.knownFailures) console.log(`   known baseline drift: ${failure}`);
    if (summary.aborted) console.log(run.output.slice(-1500));
  }

  const red = summaries.filter((summary) => !summary.green);
  console.log('');
  console.log(
    red.length === 0
      ? `All ${summaries.length} selected gate(s) green.`
      : `Gate(s) not green: ${red.map((summary) => summary.name).join(', ')}`,
  );
  process.exitCode = red.length === 0 ? 0 : 1;
} finally {
  for (const server of servers) server.close();
  if (options.keepArtifacts) {
    console.log(`Artifacts kept in ${relativeToRepo(repoRoot, artifactsDir)}`);
  } else {
    rmSync(artifactsDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}

import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const MOCK_SUPABASE_HOST = 'mock-goodcall.supabase.co';
export const MOCK_SUPABASE_URL = `https://${MOCK_SUPABASE_HOST}`;
export const MOCK_SUPABASE_PUBLISHABLE_KEY = 'mock-publishable-key';

const viteBuildScript = fileURLToPath(new URL('./vite-build.mjs', import.meta.url));

export function controlledBuildEnv() {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (!/^VITE_/i.test(key)) env[key] = value;
  }
  env.VITE_DADATA_TOKEN = '';
  env.VITE_SUPABASE_URL = MOCK_SUPABASE_URL;
  env.VITE_SUPABASE_PUBLISHABLE_KEY = MOCK_SUPABASE_PUBLISHABLE_KEY;
  return env;
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`${command} ${args.join(' ')} failed (${code})\n${output}`));
    });
  });
}

export async function buildApp({ sourceRoot, outDir, envDir }) {
  mkdirSync(envDir, { recursive: true });
  const output = await run(process.execPath, [viteBuildScript, sourceRoot, outDir, envDir], {
    cwd: sourceRoot,
    env: controlledBuildEnv(),
  });
  const mode = output.split(/\r?\n/).find((line) => line.startsWith('Build env:'));
  if (!mode) throw new Error(`Build did not report its environment mode\n${output}`);
  return mode;
}

export async function exportGitRef({ repoRoot, ref, targetDir }) {
  const sha = execFileSync('git', ['rev-parse', '--verify', `${ref}^{commit}`], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim();
  mkdirSync(targetDir, { recursive: true });
  await new Promise((resolve, reject) => {
    const archive = spawn('git', ['archive', '--format=tar', sha], {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    const extract = spawn('tar', ['-xf', '-'], {
      cwd: targetDir,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    archive.stdout.pipe(extract.stdin);
    archive.on('error', reject);
    extract.on('error', reject);
    extract.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Extracting ${ref} failed (${code})`));
    });
  });
  return sha;
}

export function relativeToRepo(repoRoot, target) {
  return path.relative(repoRoot, target).replaceAll('\\', '/');
}

import { mkdirSync } from 'node:fs';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Run suites through "npm run verify".`);
  }
  return value;
}

export function appBase() {
  return requireEnv('GOODCALL_VERIFY_BASE');
}

export function referenceBase() {
  return requireEnv('GOODCALL_VERIFY_REFERENCE_BASE');
}

export function outputDir() {
  const dir = requireEnv('GOODCALL_VERIFY_OUT');
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function report(results) {
  console.log(results.join('\n'));
  const passed = results.filter((line) => line.startsWith('PASS')).length;
  console.log(`RESULT ${passed}/${results.length}`);
}

export function reportCounts(passed, failures) {
  for (const failure of failures) console.log(`FAIL ${failure}`);
  console.log(`RESULT ${passed}/${passed + failures.length}`);
}

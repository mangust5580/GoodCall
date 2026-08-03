import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import process from 'process';
import { spawnSync } from 'child_process';

describe('Comment Checker', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = path.join(os.tmpdir(), `check-comments-test-${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  function runChecker(files: Record<string, string>) {
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(testDir, filePath);
      const dir = path.dirname(fullPath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fullPath, content, 'utf-8');
    }

    const result = spawnSync('node', [
      path.join(process.cwd(), 'scripts/check-comments.mjs'),
      testDir,
    ]);

    return {
      exitCode: result.status,
      stdout: result.stdout?.toString() || '',
      stderr: result.stderr?.toString() || '',
    };
  }

  it('detects TypeScript line comment', () => {
    const result = runChecker({
      'test.ts': 'const x = 1; ' + String.fromCharCode(47, 47) + ' inline\nconst y = 2;',
    });
    expect(result.exitCode).toBe(1);
  });

  it('detects TypeScript block comment', () => {
    const result = runChecker({
      'test.ts':
        'const x = 1;\n' +
        String.fromCharCode(47, 42) +
        ' block ' +
        String.fromCharCode(42, 47) +
        '\nconst y = 2;',
    });
    expect(result.exitCode).toBe(1);
  });

  it('detects TypeScript JSDoc', () => {
    const result = runChecker({
      'test.ts':
        String.fromCharCode(47, 42, 42) +
        '\n * JSDoc\n ' +
        String.fromCharCode(42, 47) +
        '\nfunction foo() {}',
    });
    expect(result.exitCode).toBe(1);
  });

  it('ignores string containing https://', () => {
    const result = runChecker({
      'test.ts': `const url = 'https://example.com';
const x = 1;`,
    });
    expect(result.exitCode).toBe(0);
  });

  it('detects SCSS line comment', () => {
    const result = runChecker({
      'style.scss': '.class {\n  color: red; ' + String.fromCharCode(47, 47) + ' comment\n}',
    });
    expect(result.exitCode).toBe(1);
  });

  it('detects SCSS block comment', () => {
    const result = runChecker({
      'style.scss':
        String.fromCharCode(47, 42) +
        ' comment ' +
        String.fromCharCode(42, 47) +
        '\n.class { color: red; }',
    });
    expect(result.exitCode).toBe(1);
  });

  it('ignores SCSS selectors with asterisk', () => {
    const result = runChecker({
      'style.scss': '* { margin: 0; }\n.class { color: red; }',
    });
    expect(result.exitCode).toBe(0);
  });

  it('detects YAML comment', () => {
    const result = runChecker({
      'config.yaml': 'name: Test\n' + String.fromCharCode(35) + ' comment\nversion: 1',
    });
    expect(result.exitCode).toBe(1);
  });

  it('ignores YAML without comments', () => {
    const result = runChecker({
      'config.yaml': 'name: Test\nversion: 1',
    });
    expect(result.exitCode).toBe(0);
  });

  it('detects HTML comment', () => {
    const result = runChecker({
      'index.html':
        '<html>\n' +
        String.fromCharCode(60, 33, 45, 45) +
        ' comment ' +
        String.fromCharCode(45, 45, 62) +
        '\n<body>Content</body>\n</html>',
    });
    expect(result.exitCode).toBe(1);
  });

  it('passes clean TypeScript file', () => {
    const result = runChecker({
      'clean.ts': `export function add(a: number, b: number): number {
  return a + b;
}`,
    });
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('No authored comments found');
  });

  it('ignores files in node_modules', () => {
    const result = runChecker({
      'node_modules/dep/index.ts': `// comment
const x = 1;`,
      'src/index.ts': `const x = 1;`,
    });
    expect(result.exitCode).toBe(0);
  });

  it('ignores files in dist', () => {
    const result = runChecker({
      'dist/app.js': `// comment
var x = 1;`,
      'src/index.ts': `const x = 1;`,
    });
    expect(result.exitCode).toBe(0);
  });

  it('ignores package-lock.json', () => {
    const result = runChecker({
      'package-lock.json': `// should be ignored`,
      'src/index.ts': `const x = 1;`,
    });
    expect(result.exitCode).toBe(0);
  });
});

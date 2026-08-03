import { describe, it, expect, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { validateBuildArtifact } from '../scripts/build-validation.mjs';

describe('Build Validator', () => {
  let tempDir: string | null = null;

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true });
      } catch (_e: unknown) {
        void _e;
      }
      tempDir = null;
    }
  });

  function createTempDir(name: string): string {
    const dir = path.join(os.tmpdir(), `goodcall-test-${name}-${Date.now()}`);
    fs.mkdirSync(dir, { recursive: true });
    tempDir = dir;
    return dir;
  }

  it('passes validation for valid artifact', () => {
    const testDir = createTempDir('valid-artifact');
    fs.writeFileSync(path.join(testDir, 'index.html'), '<html>/GoodCall/</html>');
    fs.writeFileSync(
      path.join(testDir, '404.html'),
      '<html><script>window.location.href = "/GoodCall/";</script></html>'
    );
    fs.writeFileSync(path.join(testDir, '.nojekyll'), '');

    const result = validateBuildArtifact(testDir);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when index.html missing', () => {
    const testDir = createTempDir('missing-index');
    fs.writeFileSync(path.join(testDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '.nojekyll'), '');

    const result = validateBuildArtifact(testDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('index.html'))).toBe(true);
  });

  it('fails when 404.html missing', () => {
    const testDir = createTempDir('missing-404');
    fs.writeFileSync(path.join(testDir, 'index.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '.nojekyll'), '');

    const result = validateBuildArtifact(testDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('404.html'))).toBe(true);
  });

  it('fails when .nojekyll missing', () => {
    const testDir = createTempDir('missing-nojekyll');
    fs.writeFileSync(path.join(testDir, 'index.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '404.html'), '<html></html>');

    const result = validateBuildArtifact(testDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('.nojekyll'))).toBe(true);
  });

  it('fails when source map present', () => {
    const testDir = createTempDir('with-sourcemap');
    const assetsDir = path.join(testDir, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, 'index.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '.nojekyll'), '');
    fs.writeFileSync(path.join(assetsDir, 'app.js.map'), '{}');

    const result = validateBuildArtifact(testDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('.map'))).toBe(true);
  });

  it('fails when MSW worker present', () => {
    const testDir = createTempDir('with-msw');
    fs.writeFileSync(path.join(testDir, 'index.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '.nojekyll'), '');
    fs.writeFileSync(path.join(testDir, 'mockServiceWorker.js'), 'console.log("MSW");');

    const result = validateBuildArtifact(testDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('MSW'))).toBe(true);
  });

  it('fails when duplicated base present', () => {
    const testDir = createTempDir('duplicated-base');
    fs.writeFileSync(path.join(testDir, 'index.html'), '<html>/GoodCall/GoodCall/</html>');
    fs.writeFileSync(path.join(testDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '.nojekyll'), '');

    const result = validateBuildArtifact(testDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('duplicated'))).toBe(true);
  });

  it('fails when localhost URL present', () => {
    const testDir = createTempDir('localhost-url');
    fs.writeFileSync(path.join(testDir, 'index.html'), '<html>http://localhost:3000</html>');
    fs.writeFileSync(path.join(testDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(testDir, '.nojekyll'), '');

    const result = validateBuildArtifact(testDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('localhost'))).toBe(true);
  });

  it('fails when dist directory does not exist', () => {
    const nonExistentDir = path.join(os.tmpdir(), `nonexistent-${Date.now()}`);
    const result = validateBuildArtifact(nonExistentDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('does not exist'))).toBe(true);
  });
});

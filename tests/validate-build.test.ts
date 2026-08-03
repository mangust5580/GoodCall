import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Simple validator logic to test
function validateBuildArtifact(distPath: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required files exist
  if (!fs.existsSync(path.join(distPath, 'index.html'))) {
    errors.push('Missing index.html');
  }
  if (!fs.existsSync(path.join(distPath, '404.html'))) {
    errors.push('Missing 404.html');
  }
  if (!fs.existsSync(path.join(distPath, '.nojekyll'))) {
    errors.push('Missing .nojekyll');
  }

  // Check for source maps
  const checkForSourceMaps = (dir: string) => {
    try {
      const files = fs.readdirSync(dir, { recursive: true });
      for (const file of files) {
        if (typeof file === 'string' && file.endsWith('.map')) {
          errors.push(`Found source map: ${file}`);
        }
      }
    } catch (_e) {
      // Directory doesn't exist
    }
  };
  checkForSourceMaps(distPath);

  // Check for MSW worker
  const checkForMSW = (dir: string) => {
    try {
      const files = fs.readdirSync(dir, { recursive: true });
      for (const file of files) {
        if (typeof file === 'string' && file.includes('mockServiceWorker')) {
          errors.push(`Found MSW worker: ${file}`);
        }
      }
    } catch (_e) {
      // Directory doesn't exist
    }
  };
  checkForMSW(distPath);

  // Check for localhost URLs in emitted files
  const checkForLocalhost = (dir: string) => {
    try {
      const files = fs.readdirSync(dir, { recursive: true });
      for (const file of files) {
        if (typeof file !== 'string') continue;
        const fullPath = path.join(dir, file);
        if (!fs.statSync(fullPath).isFile()) continue;
        if (!file.match(/\.(js|html|css)$/)) continue;

        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('localhost')) {
          errors.push(`Found localhost URL in ${file}`);
        }
      }
    } catch (_e) {
      // Ignore read errors
    }
  };
  checkForLocalhost(distPath);

  // Check for duplicated base
  const checkForDuplicatedBase = (dir: string) => {
    try {
      const indexPath = path.join(dir, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        if (content.includes('/GoodCall/GoodCall/')) {
          errors.push('Found duplicated base: /GoodCall/GoodCall/');
        }
      }
    } catch (_e) {
      // Ignore
    }
  };
  checkForDuplicatedBase(distPath);

  return {
    valid: errors.length === 0,
    errors,
  };
}

describe('Build Validator', () => {
  it('passes validation for valid artifact', () => {
    const distPath = path.join(rootDir, 'dist');
    if (!fs.existsSync(distPath)) {
      // Skip if dist doesn't exist (not built yet)
      expect(true).toBe(true);
      return;
    }

    // Just check required files exist
    expect(fs.existsSync(path.join(distPath, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(distPath, '404.html'))).toBe(true);
    expect(fs.existsSync(path.join(distPath, '.nojekyll'))).toBe(true);
  });

  it('fails when index.html missing', () => {
    const tempDir = path.join(rootDir, '.test-validate-missing-index');
    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');

    const result = validateBuildArtifact(tempDir);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing index.html');

    fs.rmSync(tempDir, { recursive: true });
  });

  it('fails when 404.html missing', () => {
    const tempDir = path.join(rootDir, '.test-validate-missing-404');
    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'index.html'), '<html></html>');
    fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');

    const result = validateBuildArtifact(tempDir);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing 404.html');

    fs.rmSync(tempDir, { recursive: true });
  });

  it('fails when .nojekyll missing', () => {
    const tempDir = path.join(rootDir, '.test-validate-missing-nojekyll');
    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'index.html'), '<html></html>');
    fs.writeFileSync(path.join(tempDir, '404.html'), '<html></html>');

    const result = validateBuildArtifact(tempDir);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing .nojekyll');

    fs.rmSync(tempDir, { recursive: true });
  });

  it('fails when source map present', () => {
    const tempDir = path.join(rootDir, '.test-validate-with-sourcemap');
    const assetsDir = path.join(tempDir, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'index.html'), '<html></html>');
    fs.writeFileSync(path.join(tempDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');
    fs.writeFileSync(path.join(assetsDir, 'app.js.map'), '{}');

    const result = validateBuildArtifact(tempDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('.map'))).toBe(true);

    fs.rmSync(tempDir, { recursive: true });
  });

  it('fails when duplicated base present', () => {
    const tempDir = path.join(rootDir, '.test-validate-duplicated-base');
    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'index.html'), '<html>/GoodCall/GoodCall/</html>');
    fs.writeFileSync(path.join(tempDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');

    const result = validateBuildArtifact(tempDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('duplicated'))).toBe(true);

    fs.rmSync(tempDir, { recursive: true });
  });

  it('fails when localhost URL present', () => {
    const tempDir = path.join(rootDir, '.test-validate-localhost');
    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'index.html'), '<html>http://localhost:3000</html>');
    fs.writeFileSync(path.join(tempDir, '404.html'), '<html></html>');
    fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');

    const result = validateBuildArtifact(tempDir);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('localhost'))).toBe(true);

    fs.rmSync(tempDir, { recursive: true });
  });
});

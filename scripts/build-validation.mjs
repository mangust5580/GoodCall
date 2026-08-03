import fs from 'fs';
import path from 'path';

export function validateBuildArtifact(distPath) {
  const errors = [];

  if (!fs.existsSync(distPath)) {
    errors.push('dist directory does not exist');
    return { valid: false, errors };
  }

  const requiredFiles = ['index.html', '404.html', '.nojekyll'];
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(distPath, file))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  try {
    const scanRecursive = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanRecursive(fullPath);
        } else if (entry.name.endsWith('.map')) {
          errors.push(`Found source map: ${path.relative(distPath, fullPath)}`);
        }
      }
    };
    scanRecursive(distPath);
  } catch (e) {
    errors.push(`Error scanning for source maps: ${e.message}`);
  }

  try {
    const scanRecursive = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanRecursive(fullPath);
        } else if (entry.name.includes('mockServiceWorker')) {
          errors.push(`Found MSW worker: ${path.relative(distPath, fullPath)}`);
        }
      }
    };
    scanRecursive(distPath);
  } catch (e) {
    errors.push(`Error scanning for MSW: ${e.message}`);
  }

  try {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      if (content.includes('localhost')) {
        errors.push('Found localhost URL in index.html');
      }
    }
  } catch (e) {
    errors.push(`Error scanning HTML: ${e.message}`);
  }

  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    try {
      const content = fs.readFileSync(indexPath, 'utf-8');
      if (content.includes('/GoodCall/GoodCall/')) {
        errors.push('Found duplicated base: /GoodCall/GoodCall/');
      }
    } catch (_e) {}
  }

  const fallbackPath = path.join(distPath, '404.html');
  if (fs.existsSync(fallbackPath)) {
    try {
      const content = fs.readFileSync(fallbackPath, 'utf-8');
      if (
        content.includes("window.location.href = './'") ||
        content.includes('window.location.href = "../"')
      ) {
        errors.push('Fallback redirects to relative path instead of app entry');
      }
      if (!content.includes('/GoodCall/')) {
        errors.push('Fallback does not reference /GoodCall/ base');
      }
    } catch (_e) {}
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

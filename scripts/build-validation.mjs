import fs from 'fs';
import path from 'path';

/**
 * Production validator for build artifacts.
 * Ensures dist contains all required files for GitHub Pages deployment.
 */
export function validateBuildArtifact(distPath) {
  const errors = [];

  // Must exist
  if (!fs.existsSync(distPath)) {
    errors.push('dist directory does not exist');
    return { valid: false, errors };
  }

  // Required files
  const requiredFiles = ['index.html', '404.html', '.nojekyll'];
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(distPath, file))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  // Scan for source maps (recursive)
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

  // Scan for MSW worker (recursive)
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

  // Scan HTML files for dev URLs (JS bundles may have false positives from deps)
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

  // Check for duplicated base
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    try {
      const content = fs.readFileSync(indexPath, 'utf-8');
      if (content.includes('/GoodCall/GoodCall/')) {
        errors.push('Found duplicated base: /GoodCall/GoodCall/');
      }
    } catch (_e) {
      // Ignore read errors
    }
  }

  // Check fallback generation
  const fallbackPath = path.join(distPath, '404.html');
  if (fs.existsSync(fallbackPath)) {
    try {
      const content = fs.readFileSync(fallbackPath, 'utf-8');
      // Must redirect to /GoodCall/ entry, not attempted missing URL
      if (
        content.includes("window.location.href = './'") ||
        content.includes('window.location.href = "../"')
      ) {
        errors.push('Fallback redirects to relative path instead of app entry');
      }
      if (!content.includes('/GoodCall/')) {
        errors.push('Fallback does not reference /GoodCall/ base');
      }
    } catch (_e) {
      // Ignore read errors
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

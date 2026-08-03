import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BUILD_CONFIG } from '../build-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function generateFallbackHTML(base, storageKey, timeoutMs) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirecting...</title>
    <script>
      (function () {
        const attemptedPathname = window.location.pathname;
        const attemptedSearch = window.location.search;
        const attemptedHash = window.location.hash;

        if (!attemptedPathname.startsWith('${base}')) {
          console.error('Invalid 404 path');
          window.location.href = '${base}';
          throw new Error('Invalid redirect attempt');
        }

        const redirectData = {
          pathname: attemptedPathname,
          search: attemptedSearch,
          hash: attemptedHash,
          timestamp: Date.now()
        };
        sessionStorage.setItem('${storageKey}', JSON.stringify(redirectData));

        window.location.href = '${base}';
      })();
    </script>
  </head>
  <body>
    <p>Redirecting to application...</p>
  </body>
</html>`;
}

function preparePages() {
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');
  const notFoundPath = path.join(distPath, '404.html');
  const noJekyllPath = path.join(distPath, '.nojekyll');

  if (!fs.existsSync(distPath)) {
    throw new Error(`dist directory not found at ${distPath}`);
  }

  if (!fs.existsSync(indexPath)) {
    throw new Error(`index.html not found at ${indexPath}`);
  }

  const base = BUILD_CONFIG.production.base;
  const storageKey = BUILD_CONFIG.fallback.storageKey;
  const timeoutMs = BUILD_CONFIG.fallback.timeoutMs;

  const fallbackHtml = generateFallbackHTML(base, storageKey, timeoutMs);

  fs.writeFileSync(notFoundPath, fallbackHtml, 'utf-8');
  console.log(`✓ Created 404.html at ${notFoundPath}`);

  fs.writeFileSync(noJekyllPath, '', 'utf-8');
  console.log(`✓ Created .nojekyll at ${noJekyllPath}`);
}

preparePages();

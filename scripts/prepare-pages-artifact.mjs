import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');
const noJekyllPath = path.join(distPath, '.nojekyll');

function preparePages() {
  if (!fs.existsSync(distPath)) {
    throw new Error(`dist directory not found at ${distPath}`);
  }

  if (!fs.existsSync(indexPath)) {
    throw new Error(`index.html not found at ${indexPath}`);
  }

  let indexContent = fs.readFileSync(indexPath, 'utf-8');

  const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirecting...</title>
    <script>
      (function () {
        // Extract attempted URL from 404 handler
        const attemptedPathname = window.location.pathname;
        const attemptedSearch = window.location.search;
        const attemptedHash = window.location.hash;

        // Validate that URL is under /GoodCall/ to prevent external redirects
        if (!attemptedPathname.startsWith('/GoodCall/')) {
          console.error('Invalid 404 path');
          window.location.href = '/GoodCall/';
          throw new Error('Invalid redirect attempt');
        }

        // Store in sessionStorage for SPA to restore
        const redirectData = {
          pathname: attemptedPathname,
          search: attemptedSearch,
          hash: attemptedHash,
          timestamp: Date.now()
        };
        sessionStorage.setItem('__goodcall_redirect', JSON.stringify(redirectData));

        // Redirect to SPA entry point (existing /GoodCall/index.html)
        window.location.href = '/GoodCall/';
      })();
    </script>
  </head>
  <body>
    <p>Redirecting to application...</p>
  </body>
</html>`;

  fs.writeFileSync(notFoundPath, fallbackHtml, 'utf-8');
  console.log(`✓ Created 404.html at ${notFoundPath}`);

  fs.writeFileSync(noJekyllPath, '', 'utf-8');
  console.log(`✓ Created .nojekyll at ${noJekyllPath}`);
}

preparePages();

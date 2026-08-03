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
        const path = window.location.pathname.replace(/^\\/GoodCall/, '');
        const search = window.location.search;
        const hash = window.location.hash;
        window.history.replaceState(null, '', '/GoodCall/' + path.slice(1) + search + hash);
        window.location.href = '/GoodCall/' + path.slice(1) + search + hash;
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

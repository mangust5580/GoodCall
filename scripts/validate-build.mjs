import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');

const REQUIRED_FILES = ['index.html', '404.html', '.nojekyll'];
const FORBIDDEN_FILES = ['mockServiceWorker.js'];
const FORBIDDEN_IN_HTML = [
  /sourcemap|\.map/gi,
  /import\.meta\.env\.DEV/g,
  /http:\/\/localhost/gi,
  /\/GoodCall\/\/GoodCall/gi,
];

function validateBuild() {
  console.log('\n🔍 Validating build artifact...\n');

  let hasErrors = false;

  for (const file of REQUIRED_FILES) {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`✗ Missing required file: ${file}`);
      hasErrors = true;
    } else {
      console.log(`✓ Found ${file}`);
    }
  }

  for (const file of FORBIDDEN_FILES) {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      console.error(`✗ Found forbidden file in dist: ${file}`);
      hasErrors = true;
    }
  }

  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf-8');

    for (const pattern of FORBIDDEN_IN_HTML) {
      if (pattern.test(indexContent)) {
        console.error(`✗ Found forbidden pattern in index.html: ${pattern}`);
        hasErrors = true;
      }
    }

    const baseMatches = indexContent.match(/base:\s*['"]([^'"]+)['"]/);
    if (!baseMatches || baseMatches[1] !== '/GoodCall/') {
      console.log('ℹ Note: Verify base path is correctly configured');
    }
  }

  const walk = (dir, isRoot = true) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'node_modules' || file.startsWith('.')) continue;
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walk(filePath, false);
      } else if (file.endsWith('.html')) {
        const content = fs.readFileSync(filePath, 'utf-8');

        const assetMatches = content.match(/(?:href|src)=["']([^"']+)["']/g) || [];
        for (const match of assetMatches) {
          const url = match.match(/["']([^"']+)["']/)[1];
          if (url.startsWith('/GoodCall/') || !url.startsWith('/') || url.startsWith('http')) {
            continue;
          }
        }
      }
    }
  };

  walk(distPath);

  if (hasErrors) {
    console.error('\n✗ Build validation failed\n');
    process.exit(1);
  } else {
    console.log('\n✓ Build validation passed\n');
  }
}

validateBuild();

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function getFileSizes(filePath) {
  const stats = fs.statSync(filePath);
  const raw = stats.size;
  const gzipped = zlib.gzipSync(fs.readFileSync(filePath)).length;
  return { raw, gzipped };
}

function reportSizes() {
  if (!fs.existsSync(distPath)) {
    console.error(`✗ dist directory not found at ${distPath}`);
    process.exit(1);
  }

  const jsFiles = [];
  const cssFiles = [];

  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith('.js')) {
        jsFiles.push(filePath);
      } else if (file.endsWith('.css')) {
        cssFiles.push(filePath);
      }
    }
  }

  walk(distPath);

  let totalRaw = 0;
  let totalGzipped = 0;

  console.log('\n📦 Bundle Sizes Report\n');

  if (jsFiles.length > 0) {
    console.log('JavaScript:');
    for (const file of jsFiles) {
      const { raw, gzipped } = getFileSizes(file);
      const relative = path.relative(distPath, file);
      console.log(`  ${relative}`);
      console.log(`    Raw:     ${formatBytes(raw)}`);
      console.log(`    Gzipped: ${formatBytes(gzipped)}`);
      totalRaw += raw;
      totalGzipped += gzipped;
    }
  }

  if (cssFiles.length > 0) {
    console.log('\nStylesheets:');
    for (const file of cssFiles) {
      const { raw, gzipped } = getFileSizes(file);
      const relative = path.relative(distPath, file);
      console.log(`  ${relative}`);
      console.log(`    Raw:     ${formatBytes(raw)}`);
      console.log(`    Gzipped: ${formatBytes(gzipped)}`);
      totalRaw += raw;
      totalGzipped += gzipped;
    }
  }

  console.log('\nTotal:');
  console.log(`  Raw:     ${formatBytes(totalRaw)}`);
  console.log(`  Gzipped: ${formatBytes(totalGzipped)}\n`);
}

reportSizes();

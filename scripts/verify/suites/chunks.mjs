import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

import { appChunksFile, appDir, referenceChunksFile, reportCounts } from '../lib/suite.mjs';

const INFO_PAGES_DIR = 'src/pages/info/';
const INFO_ROUTES_MODULE = 'src/app/routes/InfoRoutes.tsx';

let passed = 0;
const failures = [];
function check(condition, message) {
  if (condition) passed += 1;
  else failures.push(message);
}

const readReport = (file) => JSON.parse(readFileSync(file, 'utf8'));
const isInfoModule = (id) => id.startsWith(INFO_PAGES_DIR) || id === INFO_ROUTES_MODULE;
const kB = (bytes) => `${(bytes / 1000).toFixed(2)} kB`;

function staticClosure(report, entry) {
  const byFile = new Map(report.chunks.map((chunk) => [chunk.fileName, chunk]));
  const seen = new Map();
  const queue = [entry];
  while (queue.length > 0) {
    const chunk = queue.pop();
    if (seen.has(chunk.fileName)) continue;
    seen.set(chunk.fileName, chunk);
    for (const file of chunk.imports) queue.push(byFile.get(file));
  }
  return [...seen.values()];
}

function infoBytes(chunks) {
  return chunks
    .flatMap((chunk) => chunk.modules)
    .filter((module) => isInfoModule(module.id))
    .reduce((sum, module) => sum + module.renderedLength, 0);
}

const app = readReport(appChunksFile());
const reference = readReport(referenceChunksFile());
const html = readFileSync(path.join(appDir(), 'index.html'), 'utf8');

const entries = app.chunks.filter((chunk) => chunk.isEntry);
check(entries.length === 1, `exactly one entry chunk (found ${entries.length})`);
const [entry] = entries;
const initial = staticClosure(app, entry);
const initialFiles = new Set(initial.map((chunk) => chunk.fileName));

const initialInfo = initial.flatMap((chunk) =>
  chunk.modules.filter((module) => isInfoModule(module.id)).map((module) => module.id),
);
check(
  initialInfo.length === 0,
  `no Info module in the entry or its static imports (found ${initialInfo.join(', ')})`,
);

const pageModules = readdirSync(INFO_PAGES_DIR)
  .filter((file) => file.endsWith('Page.tsx'))
  .map((file) => `${INFO_PAGES_DIR}${file}`);
check(pageModules.length === 8, `eight Info page modules exist (found ${pageModules.length})`);

const lazy = app.chunks.filter((chunk) => !initialFiles.has(chunk.fileName));
const lazyModuleIds = new Set(lazy.flatMap((chunk) => chunk.modules.map((module) => module.id)));
for (const id of [INFO_ROUTES_MODULE, ...pageModules]) {
  check(lazyModuleIds.has(id), `${id} is in a lazily loaded chunk`);
}

const routesChunk = app.chunks.find((chunk) => chunk.facadeModule === INFO_ROUTES_MODULE);
check(routesChunk?.isDynamicEntry === true, 'InfoRoutes.tsx is the facade of a dynamic entry');
check(
  routesChunk !== undefined &&
    initial.some((chunk) => chunk.dynamicImports.includes(routesChunk.fileName)),
  'the initial chunks import the Info chunk only dynamically',
);

const infoChunks = lazy.filter((chunk) => chunk.modules.some((module) => isInfoModule(module.id)));
for (const chunk of infoChunks) {
  check(!html.includes(chunk.fileName), `index.html does not load or preload ${chunk.fileName}`);
}

const cssAssets = app.assets.filter((asset) => asset.fileName.endsWith('.css'));
check(cssAssets.length === 1, `exactly one CSS asset (found ${cssAssets.length})`);
check(
  cssAssets.length === 1 && html.includes(cssAssets[0].fileName),
  'index.html links the CSS asset',
);
check(
  app.chunks.every((chunk) => chunk === entry || chunk.importedCss.length === 0),
  'no CSS is split into lazy chunks',
);

const lazyInfoBytes = infoBytes(infoChunks);
check(lazyInfoBytes > 0, 'the lazy chunks carry the Info module code');

const referenceEntry = reference.chunks.find((chunk) => chunk.isEntry);
const referenceInitialInfoBytes = infoBytes(staticClosure(reference, referenceEntry));
if (referenceInitialInfoBytes > 0) {
  check(
    entry.bytes < referenceEntry.bytes,
    `entry shrinks against the unsplit reference (${kB(entry.bytes)} vs ${kB(referenceEntry.bytes)})`,
  );
} else {
  console.log('INFO reference entry is already split; entry delta reported only');
}

const gzipBytes = (fileName) =>
  gzipSync(readFileSync(path.join(appDir(), fileName)), { level: 9 }).byteLength;
console.log(
  `INFO entry ${entry.fileName} ${kB(entry.bytes)} raw / ${kB(gzipBytes(entry.fileName))} gzip`,
);
console.log(
  `INFO reference entry ${referenceEntry.fileName} ${kB(referenceEntry.bytes)} raw (delta ${kB(entry.bytes - referenceEntry.bytes)})`,
);
for (const chunk of infoChunks) {
  console.log(
    `INFO lazy ${chunk.fileName} ${kB(chunk.bytes)} raw / ${kB(gzipBytes(chunk.fileName))} gzip, Info modules before minification ${kB(infoBytes([chunk]))}`,
  );
}
for (const asset of cssAssets) {
  console.log(
    `INFO css ${asset.fileName} ${kB(asset.bytes)} raw / ${kB(gzipBytes(asset.fileName))} gzip`,
  );
}

reportCounts(passed, failures);

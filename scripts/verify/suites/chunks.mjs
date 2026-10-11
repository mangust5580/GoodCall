import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

import { appChunksFile, appDir, referenceChunksFile, reportCounts } from '../lib/suite.mjs';

const INFO_PAGES_DIR = 'src/pages/info/';
const INFO_ROUTES_MODULE = 'src/app/routes/InfoRoutes.tsx';
const REFERENCE_DIR = 'src/reference/';
const REFERENCE_SURFACE_MODULE = 'src/reference/ReferenceSurface.tsx';
const ACCOUNT_FLOW_MODULE = 'src/app/routes/AccountFlowRoutes.tsx';
const HEAVY_FIELD_MODULES = ['src/components/ui/DateField.tsx', 'src/components/ui/PhoneField.tsx'];
const HEAVY_FIELD_PACKAGES = [
  'react-day-picker',
  'date-fns',
  '@date-fns/tz',
  '@maskito/core',
  '@maskito/react',
];
const ACCOUNT_FLOW_PAGE_DIRS = [
  'src/pages/checkout/',
  'src/pages/order-confirmation/',
  'src/pages/account/',
];
const ACCOUNT_FLOW_SEAMS = [
  'src/app/routes/AccountRoutes.tsx',
  'src/app/routes/CheckoutRoute.tsx',
  'src/app/routes/OrderConfirmationRoute.tsx',
];
const BLOG_FLOW_MODULE = 'src/app/routes/BlogFlowRoutes.tsx';
const BLOG_PAGES_DIR = 'src/pages/blog/';
const BLOG_FLOW_SEAMS = [
  'src/app/routes/BlogRoute.tsx',
  'src/app/routes/BlogArticleRoute.tsx',
  'src/app/routes/blogLinks.ts',
];

let passed = 0;
const failures = [];
function check(condition, message) {
  if (condition) passed += 1;
  else failures.push(message);
}

const readReport = (file) => JSON.parse(readFileSync(file, 'utf8'));
const isInfoModule = (id) => id.startsWith(INFO_PAGES_DIR) || id === INFO_ROUTES_MODULE;
const isReferenceModule = (id) => id.startsWith(REFERENCE_DIR);
const isAccountFlowModule = (id) =>
  id === ACCOUNT_FLOW_MODULE ||
  ACCOUNT_FLOW_SEAMS.includes(id) ||
  ACCOUNT_FLOW_PAGE_DIRS.some((dir) => id.startsWith(dir));
const isBlogFlowModule = (id) =>
  id === BLOG_FLOW_MODULE || BLOG_FLOW_SEAMS.includes(id) || id.startsWith(BLOG_PAGES_DIR);
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

function moduleBytes(chunks, matches) {
  return chunks
    .flatMap((chunk) => chunk.modules)
    .filter((module) => matches(module.id))
    .reduce((sum, module) => sum + module.renderedLength, 0);
}

const infoBytes = (chunks) => moduleBytes(chunks, isInfoModule);
const referenceBytes = (chunks) => moduleBytes(chunks, isReferenceModule);
const accountFlowBytes = (chunks) => moduleBytes(chunks, isAccountFlowModule);
const blogFlowBytes = (chunks) => moduleBytes(chunks, isBlogFlowModule);
const packageOf = (id) => id.match(/node_modules\/((?:@[^/]+\/)?[^/]+)\//)?.[1];
const isHeavyFieldModule = (id) =>
  HEAVY_FIELD_MODULES.includes(id) ||
  /^@daypicker\/|^react-day-picker$|^date-fns$|^@date-fns\/|^@maskito\//.test(packageOf(id) ?? '');
const heavyFieldBytes = (chunks) => moduleBytes(chunks, isHeavyFieldModule);

const app = readReport(appChunksFile());
const reference = readReport(referenceChunksFile());
const html = readFileSync(path.join(appDir(), 'index.html'), 'utf8');

const entries = app.chunks.filter((chunk) => chunk.isEntry);
check(entries.length === 1, `exactly one entry chunk (found ${entries.length})`);
const [entry] = entries;
const initial = staticClosure(app, entry);
const initialFiles = new Set(initial.map((chunk) => chunk.fileName));
check(
  initial.length === 1,
  `the entry has no statically imported shared chunks (initial JS files: ${initial.map((chunk) => chunk.fileName).join(', ')})`,
);
check(!html.includes('modulepreload'), 'index.html has no modulepreload links');

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

const initialReference = initial.flatMap((chunk) =>
  chunk.modules.filter((module) => isReferenceModule(module.id)).map((module) => module.id),
);
check(
  initialReference.length === 0,
  `no ?reference= module in the entry or its static imports (found ${initialReference.join(', ')})`,
);

const referenceModules = readdirSync(REFERENCE_DIR)
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => `${REFERENCE_DIR}${file}`);
for (const id of referenceModules) {
  check(lazyModuleIds.has(id), `${id} is in a lazily loaded chunk`);
}

const surfaceChunk = app.chunks.find((chunk) => chunk.facadeModule === REFERENCE_SURFACE_MODULE);
check(
  surfaceChunk?.isDynamicEntry === true,
  'ReferenceSurface.tsx is the facade of a dynamic entry',
);
check(
  surfaceChunk !== undefined &&
    initial.some((chunk) => chunk.dynamicImports.includes(surfaceChunk.fileName)),
  'the initial chunks import the reference chunk only dynamically',
);

const referenceChunks = lazy.filter((chunk) =>
  chunk.modules.some((module) => isReferenceModule(module.id)),
);
for (const chunk of referenceChunks) {
  check(!html.includes(chunk.fileName), `index.html does not load or preload ${chunk.fileName}`);
}

const initialAccountFlow = initial.flatMap((chunk) =>
  chunk.modules.filter((module) => isAccountFlowModule(module.id)).map((module) => module.id),
);
check(
  initialAccountFlow.length === 0,
  `no Checkout/Order/Account module in the entry or its static imports (found ${initialAccountFlow.join(', ')})`,
);

const accountFlowPages = ACCOUNT_FLOW_PAGE_DIRS.flatMap((dir) =>
  readdirSync(dir)
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => `${dir}${file}`),
);
for (const id of [ACCOUNT_FLOW_MODULE, ...ACCOUNT_FLOW_SEAMS, ...accountFlowPages]) {
  check(lazyModuleIds.has(id), `${id} is in a lazily loaded chunk`);
}

const accountFlowChunk = app.chunks.find((chunk) => chunk.facadeModule === ACCOUNT_FLOW_MODULE);
check(
  accountFlowChunk?.isDynamicEntry === true,
  'AccountFlowRoutes.tsx is the facade of a dynamic entry',
);
check(
  accountFlowChunk !== undefined &&
    initial.some((chunk) => chunk.dynamicImports.includes(accountFlowChunk.fileName)),
  'the initial chunks import the Checkout/Order/Account chunk only dynamically',
);

const accountFlowChunks = lazy.filter((chunk) =>
  chunk.modules.some((module) => isAccountFlowModule(module.id)),
);
for (const chunk of accountFlowChunks) {
  check(!html.includes(chunk.fileName), `index.html does not load or preload ${chunk.fileName}`);
}
check(
  accountFlowChunks.every((chunk) => chunk.importedCss.length === 0),
  'the Checkout/Order/Account chunks carry no CSS',
);

const initialBlogFlow = initial.flatMap((chunk) =>
  chunk.modules.filter((module) => isBlogFlowModule(module.id)).map((module) => module.id),
);
check(
  initialBlogFlow.length === 0,
  `no Blog module in the entry or its static imports (found ${initialBlogFlow.join(', ')})`,
);
const blogFlowSources = [
  BLOG_FLOW_MODULE,
  ...BLOG_FLOW_SEAMS,
  ...readdirSync(BLOG_PAGES_DIR)
    .filter((file) => /\.tsx?$/.test(file))
    .map((file) => `${BLOG_PAGES_DIR}${file}`),
];
for (const id of blogFlowSources) {
  check(lazyModuleIds.has(id), `${id} is in a lazily loaded chunk`);
}
const blogFlowChunk = app.chunks.find((chunk) => chunk.facadeModule === BLOG_FLOW_MODULE);
check(
  blogFlowChunk?.isDynamicEntry === true,
  'BlogFlowRoutes.tsx is the facade of a dynamic entry',
);
check(
  blogFlowChunk !== undefined &&
    initial.some((chunk) => chunk.dynamicImports.includes(blogFlowChunk.fileName)),
  'the initial chunks import the Blog chunk only dynamically',
);
const blogFlowChunks = lazy.filter((chunk) =>
  chunk.modules.some((module) => isBlogFlowModule(module.id)),
);
for (const chunk of blogFlowChunks) {
  check(!html.includes(chunk.fileName), `index.html does not load or preload ${chunk.fileName}`);
}
check(
  blogFlowChunks.every((chunk) => chunk.importedCss.length === 0),
  'the Blog chunks carry no CSS',
);
check(blogFlowBytes(blogFlowChunks) > 0, 'the lazy chunks carry the Blog module code');

const initialHeavy = initial.flatMap((chunk) =>
  chunk.modules.filter((module) => isHeavyFieldModule(module.id)).map((module) => module.id),
);
check(
  initialHeavy.length === 0,
  `no DateField/PhoneField module or DayPicker/date-fns/Maskito package in the entry or its static imports (found ${initialHeavy.length}: ${initialHeavy.slice(0, 5).join(', ')})`,
);
for (const id of HEAVY_FIELD_MODULES) {
  check(lazyModuleIds.has(id), `${id} is in a lazily loaded chunk`);
}
const lazyPackages = new Set([...lazyModuleIds].map(packageOf).filter(Boolean));
for (const name of HEAVY_FIELD_PACKAGES) {
  check(lazyPackages.has(name), `${name} is in a lazily loaded chunk`);
}
const heavyChunks = lazy.filter((chunk) =>
  chunk.modules.some((module) => isHeavyFieldModule(module.id)),
);
for (const chunk of heavyChunks) {
  check(!html.includes(chunk.fileName), `index.html does not load or preload ${chunk.fileName}`);
}
check(
  heavyChunks.every((chunk) => chunk.importedCss.length === 0),
  'the DateField/PhoneField chunks carry no CSS',
);

const cssAssets = app.assets.filter((asset) => asset.fileName.endsWith('.css'));
const linkedCss = cssAssets.filter((asset) => html.includes(asset.fileName));
check(
  linkedCss.length === 1 &&
    JSON.stringify(entry.importedCss) === JSON.stringify([linkedCss[0].fileName]),
  `index.html links exactly the entry CSS (${linkedCss.map((asset) => asset.fileName).join(', ')})`,
);
check(
  infoChunks.every((chunk) => chunk.importedCss.length === 0),
  'the Info chunks carry no CSS',
);
check(
  app.chunks.every(
    (chunk) => chunk === entry || chunk.importedCss.length === 0 || referenceChunks.includes(chunk),
  ),
  'only the reference chunk carries lazy CSS',
);

const lazyInfoBytes = infoBytes(infoChunks);
check(lazyInfoBytes > 0, 'the lazy chunks carry the Info module code');
check(referenceBytes(referenceChunks) > 0, 'the lazy chunks carry the ?reference= module code');
check(
  accountFlowBytes(accountFlowChunks) > 0,
  'the lazy chunks carry the Checkout/Order/Account module code',
);

const referenceEntry = reference.chunks.find((chunk) => chunk.isEntry);
const referenceInitial = staticClosure(reference, referenceEntry);
if (
  infoBytes(referenceInitial) > 0 ||
  referenceBytes(referenceInitial) > 0 ||
  accountFlowBytes(referenceInitial) > 0 ||
  heavyFieldBytes(referenceInitial) > 0 ||
  blogFlowBytes(referenceInitial) > 0
) {
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
for (const chunk of referenceChunks) {
  console.log(
    `INFO lazy ${chunk.fileName} ${kB(chunk.bytes)} raw / ${kB(gzipBytes(chunk.fileName))} gzip, reference modules before minification ${kB(referenceBytes([chunk]))}`,
  );
}
for (const chunk of accountFlowChunks) {
  console.log(
    `INFO lazy ${chunk.fileName} ${kB(chunk.bytes)} raw / ${kB(gzipBytes(chunk.fileName))} gzip, Checkout/Order/Account modules before minification ${kB(accountFlowBytes([chunk]))}`,
  );
}
for (const chunk of blogFlowChunks) {
  console.log(
    `INFO lazy ${chunk.fileName} ${kB(chunk.bytes)} raw / ${kB(gzipBytes(chunk.fileName))} gzip, Blog modules before minification ${kB(blogFlowBytes([chunk]))}`,
  );
}
for (const chunk of heavyChunks) {
  console.log(
    `INFO heavy fields in ${chunk.fileName} ${kB(chunk.bytes)} raw / ${kB(gzipBytes(chunk.fileName))} gzip, DateField/PhoneField modules and packages before minification ${kB(heavyFieldBytes([chunk]))}`,
  );
}
for (const chunk of lazy.filter((c) => !c.isDynamicEntry)) {
  console.log(
    `INFO shared ${chunk.fileName} ${kB(chunk.bytes)} raw / ${kB(gzipBytes(chunk.fileName))} gzip`,
  );
}
for (const asset of cssAssets) {
  console.log(
    `INFO css ${asset.fileName} ${kB(asset.bytes)} raw / ${kB(gzipBytes(asset.fileName))} gzip`,
  );
}

reportCounts(passed, failures);

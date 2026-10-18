import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import sharp from 'sharp';

import { launchBrowser, sleep } from '../lib/browser.mjs';
import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { CATEGORIES, PRODUCTS } from '../lib/catalog.mjs';
import { appBase, outputDir, reportCounts } from '../lib/suite.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const require = createRequire(path.join(ROOT, 'package.json'));
const { createServer } = await import(pathToFileURL(require.resolve('vite')).href);

const BASE_KEY = 'products/smartphones/apple-iphone-15-pro/natural-titanium/hero-v1';
const PILOT_PATH = `${BASE_KEY}-640.png`;
const PILOT_ALT = 'Apple iPhone 15 Pro, Натуральный титан';
const PUBLIC_PREFIX = `https://${MOCK_SUPABASE_HOST}/storage/v1/object/public/catalog-media/`;
const WIDTHS = [320, 640, 1024];
const CART_KEY = 'goodcall.cart.v1';

let passed = 0;
const failures = [];
function check(condition, message) {
  if (condition) passed += 1;
  else failures.push(message);
}

const srcSetOf = (extension) =>
  WIDTHS.map((width) => `${PUBLIC_PREFIX}${BASE_KEY}-${width}.${extension} ${width}w`).join(', ');

const server = await createServer({
  root: ROOT,
  configFile: path.join(ROOT, 'vite.config.ts'),
  envDir: path.join(outputDir(), 'empty-env'),
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { catalogRemotePicture } = await server.ssrLoadModule(
    '/src/pages/catalog/catalogRemotePicture.ts',
  );
  const { Picture } = await server.ssrLoadModule('/src/components/media/Picture.tsx');
  const { productThumbnail } = await server.ssrLoadModule(
    '/src/assets/media/product-details/productThumbnailMedia.ts',
  );
  const { createElement } = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const publicUrl = (key) => `${PUBLIC_PREFIX}${key}`;

  const source = catalogRemotePicture(PILOT_PATH, publicUrl);
  check(source !== undefined, 'adapter maps the hero-v1-640.png contract path');
  check(
    JSON.stringify(Object.keys(source?.sources ?? {})) === '["avif","webp"]',
    `adapter source order avif, webp: ${JSON.stringify(Object.keys(source?.sources ?? {}))}`,
  );
  check(source?.sources.avif === srcSetOf('avif'), 'adapter AVIF srcset 320/640/1024');
  check(source?.sources.webp === srcSetOf('webp'), 'adapter WebP srcset 320/640/1024');
  check(source?.img.src === publicUrl(PILOT_PATH), 'adapter PNG fallback src is the row object');
  check(source?.img.srcset === srcSetOf('png'), 'adapter PNG fallback srcset 320/640/1024');
  check(source?.img.w === 640 && source?.img.h === 640, 'adapter intrinsic 640x640');

  for (const rejected of [
    'home/airpods-recommendation.png',
    `${BASE_KEY}-640.webp`,
    `${BASE_KEY}-320.png`,
    `${BASE_KEY}-1024.png`,
    `/${PILOT_PATH}`,
    `${PILOT_PATH}?v=2`,
    'products/smartphones/apple-iphone-15-pro/hero-v1-640.png',
    'products/smartphones/apple-iphone-15-pro/natural-titanium/hero-v0-640.png',
    'products/smartphones/Apple-iPhone/natural-titanium/hero-v1-640.png',
    'products/smartphones/../natural-titanium/x/hero-v1-640.png',
    'https://example.com/products/smartphones/a/b/hero-v1-640.png',
  ]) {
    check(catalogRemotePicture(rejected, publicUrl) === undefined, `adapter rejects ${rejected}`);
  }

  const markup = renderToStaticMarkup(
    createElement(Picture, { source, alt: PILOT_ALT, sizes: '240px', className: 'card-image' }),
  );
  const order = [...markup.matchAll(/<(source|img)\b[^>]*>/g)].map((match) =>
    match[1] === 'img' ? 'img' : /type="([^"]+)"/.exec(match[0])?.[1],
  );
  check(
    markup.startsWith('<picture>') && markup.endsWith('</picture>'),
    'Picture renders <picture>',
  );
  check(
    JSON.stringify(order) === '["image/avif","image/webp","img"]',
    `markup order AVIF → WebP → img: ${JSON.stringify(order)}`,
  );
  check((markup.match(/sizes="240px"/g) ?? []).length === 3, 'sizes on both sources and img');
  check(markup.includes(`srcSet="${srcSetOf('png')}"`), 'img carries the PNG srcset');
  check(markup.includes(`src="${publicUrl(PILOT_PATH)}"`), 'img src is the 640 PNG');
  check(
    /<img[^>]*width="640"[^>]*/.test(markup) && /<img[^>]*height="640"/.test(markup),
    'img width/height 640',
  );
  check(markup.includes(`alt="${PILOT_ALT}"`), 'img alt from data');
  check(
    markup.includes('loading="lazy"') && markup.includes('decoding="async"'),
    'img lazy + async',
  );

  const local = productThumbnail('iphone-15-128');
  const localMarkup = renderToStaticMarkup(
    createElement(Picture, { source: local, alt: 'local', sizes: '240px' }),
  );
  check(
    local !== undefined && Object.keys(local.sources).length > 0,
    'vite-imagetools ?picture source still resolves',
  );
  check(
    !/<img[^>]*srcSet=/.test(localMarkup) && localMarkup.startsWith('<picture>'),
    'local ?picture img has no srcset (unchanged markup)',
  );
} finally {
  await server.close();
}

const SMARTPHONES = CATEGORIES.find((category) => category.slug === 'smartphones');
const PILOT = PRODUCTS.find((product) => product.slug === 'iphone-15-pro-128');
const LEGACY = PRODUCTS.find((product) => product.slug === 'xiaomi-14-256');
const LOCAL = PRODUCTS.find((product) => product.slug === 'galaxy-s24-128');
const IMAGE_ROWS = [
  { id: 'img-pilot', product_id: PILOT.id, storage_path: PILOT_PATH, alt: PILOT_ALT, position: 0 },
  {
    id: 'img-legacy',
    product_id: LEGACY.id,
    storage_path: 'legacy/xiaomi-14.png',
    alt: 'Xiaomi 14',
    position: 0,
  },
];
const FORMAT_TYPES = { avif: 'image/avif', webp: 'image/webp', png: 'image/png' };
const imageBytes = new Map();

async function objectBytes(key) {
  const match = /-(\d+)\.(avif|webp|png)$/.exec(key);
  const width = Number(match?.[1] ?? 64);
  const extension = match?.[2] ?? 'png';
  const cacheKey = `${width}.${extension}`;
  if (!imageBytes.has(cacheKey)) {
    const base = sharp({
      create: { width, height: width, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    });
    const encoded =
      extension === 'avif' ? base.avif() : extension === 'webp' ? base.webp() : base.png();
    imageBytes.set(cacheKey, await encoded.toBuffer());
  }
  return { body: imageBytes.get(cacheKey), type: FORMAT_TYPES[extension] };
}

function restRows(url) {
  const table = url.pathname.split('/').pop();
  const params = url.searchParams;
  if (table === 'categories') {
    return params.get('slug') === 'eq.smartphones' ? [{ id: SMARTPHONES.id }] : [];
  }
  if (table === 'products') {
    return PRODUCTS.filter(
      (product) => product.is_active && `eq.${product.category_id}` === params.get('category_id'),
    ).sort((a, b) => b.popularity_score - a.popularity_score || a.slug.localeCompare(b.slug));
  }
  if (table === 'product_images') {
    const ids = params.get('product_id') ?? '';
    return IMAGE_ROWS.filter((row) => ids.includes(row.product_id));
  }
  return [];
}

const storageRequests = [];
let storageMissing = false;
const browser = await launchBrowser();
const cdp = await browser.newPage();
const { send } = cdp;
const pageErrors = [];
const cors = [
  { name: 'Access-Control-Allow-Origin', value: '*' },
  { name: 'Access-Control-Allow-Headers', value: '*' },
  { name: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
];

cdp.onEvent(async (message) => {
  if (message.method === 'Runtime.exceptionThrown') {
    pageErrors.push(message.params.exceptionDetails.text);
  }
  if (message.method !== 'Fetch.requestPaused') return;
  const { requestId, request } = message.params;
  if (request.method === 'OPTIONS') {
    send('Fetch.fulfillRequest', { requestId, responseCode: 204, responseHeaders: cors });
    return;
  }
  const url = new URL(request.url);
  if (url.pathname.startsWith('/storage/v1/object/public/catalog-media/')) {
    const key = decodeURIComponent(
      url.pathname.slice('/storage/v1/object/public/catalog-media/'.length),
    );
    storageRequests.push(key);
    if (storageMissing || !key.startsWith(BASE_KEY)) {
      send('Fetch.fulfillRequest', {
        requestId,
        responseCode: 404,
        responseHeaders: cors,
        body: '',
      });
      return;
    }
    const { body, type } = await objectBytes(key);
    send('Fetch.fulfillRequest', {
      requestId,
      responseCode: 200,
      responseHeaders: [...cors, { name: 'Content-Type', value: type }],
      body: body.toString('base64'),
    });
    return;
  }
  const accept = request.headers.Accept ?? request.headers.accept ?? '';
  const rows = restRows(url);
  const body = JSON.stringify(accept.includes('vnd.pgrst.object') ? (rows[0] ?? null) : rows);
  send('Fetch.fulfillRequest', {
    requestId,
    responseCode: 200,
    responseHeaders: [...cors, { name: 'Content-Type', value: 'application/json' }],
    body: Buffer.from(body).toString('base64'),
  });
});

async function evaluate(expression) {
  const response = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.result?.exceptionDetails) {
    throw new Error(`${expression}\n${JSON.stringify(response.result.exceptionDetails)}`);
  }
  return response.result?.result?.value;
}

async function waitFor(expression, label, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return true;
    await sleep(100);
  }
  failures.push(`timeout: ${label}`);
  return false;
}

const cardExpression = (title) =>
  `[...document.querySelectorAll('.product-card')].find((card) => card.querySelector('.product-card__title')?.textContent.trim() === ${JSON.stringify(title)})`;

await send('Page.enable');
await send('Runtime.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: `*${MOCK_SUPABASE_HOST}*` }] });
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 1600,
  deviceScaleFactor: 1,
  mobile: false,
});

const BASE = appBase();

async function openCatalog() {
  await send('Page.navigate', { url: `${BASE}#/catalog/smartphones` });
  return waitFor(
    `${cardExpression(PILOT.name)}?.querySelector('picture img')?.complete`,
    'pilot card picture loaded',
  );
}

if (await openCatalog()) {
  const pilot = await evaluate(`(() => {
    const card = ${cardExpression(PILOT.name)};
    const picture = card.querySelector('.product-card__media picture');
    const img = picture.querySelector('img');
    return {
      order: [...picture.children].map((node) => node.tagName === 'IMG' ? 'img' : node.getAttribute('type')),
      avif: picture.querySelector('source[type="image/avif"]').getAttribute('srcset'),
      webp: picture.querySelector('source[type="image/webp"]').getAttribute('srcset'),
      sizes: [...picture.children].map((node) => node.getAttribute('sizes')),
      src: img.getAttribute('src'),
      srcset: img.getAttribute('srcset'),
      width: img.getAttribute('width'),
      height: img.getAttribute('height'),
      alt: img.getAttribute('alt'),
      loading: img.getAttribute('loading'),
      className: img.className,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
    };
  })()`);
  check(
    JSON.stringify(pilot.order) === '["image/avif","image/webp","img"]',
    `browser pilot order: ${JSON.stringify(pilot.order)}`,
  );
  check(pilot.avif === srcSetOf('avif'), 'browser pilot AVIF srcset');
  check(pilot.webp === srcSetOf('webp'), 'browser pilot WebP srcset');
  check(
    pilot.sizes.every((value) => value === '240px'),
    'browser pilot sizes 240px',
  );
  check(pilot.src === `${PUBLIC_PREFIX}${PILOT_PATH}`, 'browser pilot PNG src');
  check(pilot.srcset === srcSetOf('png'), 'browser pilot PNG srcset');
  check(pilot.width === '640' && pilot.height === '640', 'browser pilot width/height');
  check(pilot.alt === PILOT_ALT, 'browser pilot alt from product_images.alt');
  check(pilot.loading === 'lazy', 'browser pilot lazy');
  check(pilot.className === 'product-card__image', 'browser pilot keeps card image class');
  check(
    pilot.currentSrc.startsWith(`${PUBLIC_PREFIX}${BASE_KEY}-`) &&
      pilot.currentSrc.endsWith('.avif'),
    `browser selects AVIF: ${pilot.currentSrc}`,
  );
  check(pilot.naturalWidth > 0, 'browser decoded the selected rendition');
  check(
    !storageRequests.some(
      (key) => key.startsWith(BASE_KEY) && (key.endsWith('.png') || key.endsWith('.webp')),
    ),
    `AVIF-capable browser fetches no WebP/PNG: ${JSON.stringify(storageRequests)}`,
  );

  const legacy = await evaluate(`(() => {
    const img = ${cardExpression(LEGACY.name)}.querySelector('.product-card__image');
    return { inPicture: img.parentElement.tagName === 'PICTURE', src: img.getAttribute('src'), srcset: img.getAttribute('srcset') };
  })()`);
  check(
    !legacy.inPicture &&
      legacy.src === `${PUBLIC_PREFIX}legacy/xiaomi-14.png` &&
      legacy.srcset === null,
    `non-contract storage_path keeps plain img: ${JSON.stringify(legacy)}`,
  );

  const local = await evaluate(`(() => {
    const img = ${cardExpression(LOCAL.name)}.querySelector('.product-card__image');
    const picture = img.parentElement;
    return {
      inPicture: picture.tagName === 'PICTURE',
      remote: [...picture.querySelectorAll('source')].some((node) => node.srcset.includes(${JSON.stringify(MOCK_SUPABASE_HOST)})),
      srcset: img.getAttribute('srcset'),
    };
  })()`);
  check(
    local.inPicture && !local.remote && local.srcset === null,
    `product without image row keeps local ?picture thumbnail: ${JSON.stringify(local)}`,
  );

  await evaluate(`localStorage.removeItem(${JSON.stringify(CART_KEY)})`);
  await evaluate(`${cardExpression(PILOT.name)}.querySelector('.product-card__cart').click()`);
  await sleep(300);
  const line = await evaluate(
    `JSON.parse(localStorage.getItem(${JSON.stringify(CART_KEY)}) ?? '{"lines":[]}').lines.find((entry) => entry.productSlug === 'iphone-15-pro-128')`,
  );
  check(
    line?.image?.kind === 'url' && line.image.src === `${PUBLIC_PREFIX}${PILOT_PATH}`,
    `cart persists kind:'url' with the 640 PNG: ${JSON.stringify(line?.image)}`,
  );
  await evaluate(`localStorage.removeItem(${JSON.stringify(CART_KEY)})`);
}

storageMissing = true;
storageRequests.length = 0;
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Page.navigate', { url: 'about:blank' });
await sleep(200);
await send('Page.navigate', { url: `${BASE}#/catalog/smartphones` });
if (
  await waitFor(
    `${cardExpression(PILOT.name)}?.querySelector('picture img')?.complete`,
    'pilot picture settles on missing objects',
  )
) {
  const missing = await evaluate(`(() => {
    const card = ${cardExpression(PILOT.name)};
    const img = card.querySelector('picture img');
    return { naturalWidth: img.naturalWidth, title: card.querySelector('.product-card__title').textContent.trim(), cards: document.querySelectorAll('.product-card').length };
  })()`);
  check(
    missing.naturalWidth === 0 && missing.title === PILOT.name && missing.cards > 1,
    `missing objects leave the card and grid intact: ${JSON.stringify(missing)}`,
  );
}

check(pageErrors.length === 0, `no page errors: ${JSON.stringify(pageErrors)}`);

await cdp.close();
await browser.close();
reportCounts(passed, failures);

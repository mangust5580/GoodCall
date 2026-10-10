import { register } from 'node:module';

import { launchBrowser, sleep } from '../lib/browser.mjs';
import {
  CATEGORIES as CATALOG_CATEGORIES,
  HOME_POPULAR_PRODUCTS,
  PRODUCTS as CATALOG_ROWS,
} from '../lib/catalog.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';

register(new URL('../lib/ts-hook.mjs', import.meta.url));
const { HOME_PRODUCTS } = await import(
  new URL('../../../src/pages/home/homeFixtures.ts', import.meta.url).href
);
const { formatPrice } = await import(
  new URL('../../../src/commerce/format.ts', import.meta.url).href
);

const OUT = outputDir();
const BASE = appBase();
const MOCK_HOST = 'mock-goodcall.supabase.co';
const KEY = 'goodcall.cart.v1';
const results = [];
let failLive = false;
let homeFeed = 'fallback';
const heldHomeRequests = [];
const AIRPODS_ROW = CATALOG_ROWS.find((row) => row.slug === 'airpods-pro-2-usb-c');
const RECOMMENDATION_IMAGES = [
  {
    id: 'rec-img-1',
    product_id: AIRPODS_ROW.id,
    storage_path: 'home/airpods-recommendation.png',
    alt: 'AirPods Pro 2 (USB-C)',
    position: 1,
  },
];

const CATEGORY = { id: 'cat-smartphones' };
const PRODUCTS = [
  {
    id: 'p1',
    category_id: 'cat-smartphones',
    slug: 'galaxy-s24-128',
    name: 'Samsung Galaxy S24 128 ГБ, Фиолетовый',
    brand: 'Samsung',
    price: 75990,
    old_price: 89990,
    rating: 4.6,
    review_count: 866,
    is_new: false,
    popularity_score: 96,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'p2',
    category_id: 'cat-smartphones',
    slug: 'iphone-15-128',
    name: 'Apple iPhone 15 128 ГБ, Розовый',
    brand: 'Apple',
    price: 79990,
    old_price: 84990,
    rating: 4.7,
    review_count: 1976,
    is_new: false,
    popularity_score: 90,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'p3',
    category_id: 'cat-smartphones',
    slug: 'xiaomi-14-256',
    name: 'Xiaomi 14 12/256 ГБ, Чёрный',
    brand: 'Xiaomi',
    price: 69990,
    old_price: null,
    rating: 4.7,
    review_count: 742,
    is_new: true,
    popularity_score: 80,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];

function homeFeedRows(u, table) {
  if (table === 'categories' && !u.searchParams.has('slug')) return CATALOG_CATEGORIES;
  if (table === 'home_popular_products') return HOME_POPULAR_PRODUCTS;
  const ids = u.searchParams.get('id');
  if (table === 'products' && ids?.startsWith('in.(')) {
    return CATALOG_ROWS.filter((row) => ids.includes(row.id) && row.is_active);
  }
  if (table === 'product_images') {
    return RECOMMENDATION_IMAGES.filter((image) =>
      (u.searchParams.get('product_id') ?? '').includes(image.product_id),
    );
  }
  return undefined;
}

function mockBody(url, accept) {
  const u = new URL(url);
  const table = u.pathname.split('/').pop();
  const homeRows = homeFeed === 'fallback' ? undefined : homeFeedRows(u, table);
  if (homeRows !== undefined) {
    return accept.includes('vnd.pgrst.object') ? (homeRows[0] ?? null) : homeRows;
  }
  let rows = [];
  if (table === 'categories')
    rows = u.searchParams.get('slug') === 'eq.smartphones' ? [CATEGORY] : [];
  if (table === 'products') {
    const slug = u.searchParams.get('slug');
    rows = slug
      ? PRODUCTS.filter((p) => `eq.${p.slug}` === slug).map((p) => ({
          ...p,
          categories: { slug: 'smartphones', name: 'Смартфоны' },
        }))
      : PRODUCTS;
  }
  if (accept.includes('vnd.pgrst.object')) return rows[0] ?? null;
  return rows;
}

const browser = await launchBrowser();
const cdp = await browser.newPage();
const { send } = cdp;
const consoleErrors = [];
cdp.onEvent(async (msg) => {
  if (msg.method === 'Fetch.requestPaused') {
    const { requestId, request } = msg.params;
    if (failLive) {
      send('Fetch.failRequest', { requestId, errorReason: 'Failed' });
      return;
    }
    const accept = request.headers.Accept ?? request.headers.accept ?? '';
    if (
      homeFeed === 'hold' &&
      request.method !== 'OPTIONS' &&
      new URL(request.url).pathname.endsWith('/home_popular_products')
    ) {
      heldHomeRequests.push(requestId);
      return;
    }
    if (request.method === 'OPTIONS') {
      send('Fetch.fulfillRequest', { requestId, responseCode: 204, responseHeaders: cors() });
      return;
    }
    const body = JSON.stringify(mockBody(request.url, accept));
    send('Fetch.fulfillRequest', {
      requestId,
      responseCode: 200,
      responseHeaders: [...cors(), { name: 'Content-Type', value: 'application/json' }],
      body: Buffer.from(body).toString('base64'),
    });
  }
  if (msg.method === 'Runtime.exceptionThrown')
    consoleErrors.push(msg.params.exceptionDetails.text);
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error')
    consoleErrors.push(msg.params.args.map((a) => a.value).join(' '));
});
function cors() {
  return [
    { name: 'Access-Control-Allow-Origin', value: '*' },
    { name: 'Access-Control-Allow-Headers', value: '*' },
    { name: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
  ];
}
async function evaluate(expression) {
  const res = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (res.result?.exceptionDetails)
    throw new Error(`${expression}\n${JSON.stringify(res.result.exceptionDetails)}`);
  return res.result?.result?.value;
}
async function waitFor(expression, label, timeout = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await sleep(100);
  }
  throw new Error(`timeout: ${label}`);
}
function check(name, ok, detail = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}
async function go(hash) {
  await evaluate(`location.hash = ${JSON.stringify(hash)}`);
  await sleep(300);
}
async function reload() {
  await send('Page.reload', {});
  await sleep(1200);
}
const badge = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/cart"] .site-header__badge')?.textContent ?? null`,
  );
const cartName = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/cart"]')?.getAttribute('aria-label')`,
  );
const mobileBadge = () =>
  evaluate(
    `document.querySelector('.mobile-action-bar__link[href="#/cart"] .mobile-action-bar__badge')?.textContent ?? null`,
  );
const stored = () => evaluate(`localStorage.getItem('${KEY}')`);
const click = (selector) =>
  evaluate(
    `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error('missing ' + ${JSON.stringify(selector)}); el.click(); return true; })()`,
  );
const overflow = () =>
  evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);

await send('Runtime.enable');
await send('Page.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: `*${MOCK_HOST}*` }] });
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);

await evaluate(
  `localStorage.setItem('goodcall.verify.marker', 'untouched-marker'); localStorage.removeItem('${KEY}')`,
);
await reload();
check('fresh: badge 0 (Shell zero convention)', (await badge()) === '0', `badge=${await badge()}`);
check('fresh: cart link accessible name', (await cartName()) === 'Корзина: 0', await cartName());
await go('#/cart');
await waitFor(`document.querySelector('#cart-empty-title')`, 'empty cart');
check(
  'fresh: #/cart shows accepted empty state',
  await evaluate(`document.querySelector('h1')?.textContent === 'Корзина пуста'`),
);

await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'live catalog');
const S24 = 'Samsung Galaxy S24 128 ГБ, Фиолетовый';
check(
  'catalog: live add buttons enabled',
  await evaluate(`[...document.querySelectorAll('.product-card__cart')].every((b) => !b.disabled)`),
);
await click(`button[aria-label="В корзину: ${S24}"]`);
await sleep(150);
check('catalog: add → badge 1', (await badge()) === '1', `badge=${await badge()}`);
const s24Card = `[...document.querySelectorAll('.product-card')].find((c) => c.querySelector('.product-card__title')?.textContent === ${JSON.stringify(S24)})`;
check(
  'catalog: card stepper shows shared qty 1',
  (await evaluate(`${s24Card}.querySelector('.ui-stepper output')?.textContent`)) === '1',
);
check(
  'catalog: polite status announcement',
  (
    await evaluate(`document.querySelector('.catalog-grid + p[role="status"]')?.textContent`)
  )?.includes(S24),
);
await evaluate(
  `${s24Card}.querySelector('.ui-stepper button[aria-label="Увеличить количество"]').click()`,
);
await sleep(150);
check('catalog: stepper + → badge 2', (await badge()) === '2', `badge=${await badge()}`);
check(
  'catalog: focus not moved by add',
  await evaluate(
    `document.activeElement === document.body || document.activeElement?.closest('.product-card') !== null`,
  ),
);
check('catalog: persisted', (await stored())?.includes('"galaxy-s24-128"'));
await go('#/cart');
await waitFor(`document.querySelector('.cart-line')`, 'cart line');
check(
  'cart: catalog line title + qty 2',
  await evaluate(
    `document.querySelector('.cart-line__title')?.textContent === ${JSON.stringify(S24)} && document.querySelector('.cart-line .ui-stepper output')?.textContent === '2'`,
  ),
);
await go('#/');
await go('#/catalog/smartphones');
await waitFor(`${s24Card}?.querySelector('.ui-stepper output')`, 'stepper after nav');
check(
  'catalog: nav away/back keeps stepper qty 2',
  (await evaluate(`${s24Card}.querySelector('.ui-stepper output').textContent`)) === '2',
);

await go('#/product/iphone-15-128');
await waitFor(`document.querySelector('.product-purchase__cart')`, 'pd ready');
const I15 = 'Apple iPhone 15 128 ГБ, Розовый';
const X14 = 'Xiaomi 14 12/256 ГБ, Чёрный';
const storedIds = () =>
  evaluate(`JSON.parse(localStorage.getItem('${KEY}')).lines.map((l) => l.id + ':' + l.quantity)`);
check(
  'pd: production PD has no colour/memory controls (canonical contract)',
  (await evaluate(`document.querySelectorAll('main input[type=radio]').length`)) === 0,
);
for (let i = 0; i < 2; i += 1)
  await evaluate(
    `document.querySelector('.product-purchase__cart-row .ui-stepper button:last-child').click()`,
  );
await sleep(100);
check(
  'pd: quantity set to 3',
  (await evaluate(`document.querySelector('.product-purchase__cart-row output').textContent`)) ===
    '3',
);
await click('.product-purchase__cart');
await sleep(150);
check('pd: add qty 3 → badge 5', (await badge()) === '5', `badge=${await badge()}`);
check(
  'pd: status announcement (canonical title, no variant text)',
  (await evaluate(`document.querySelector('.product-purchase p[role="status"]')?.textContent`)) ===
    `Товар добавлен в корзину: ${I15}. В корзине: 3 шт.`,
);
await click('.product-purchase__cart');
await sleep(150);
check(
  'pd: second add merges into the canonical line → badge 8',
  (await badge()) === '8' &&
    JSON.stringify(await storedIds()) === JSON.stringify(['galaxy-s24-128:2', 'iphone-15-128:6']),
  JSON.stringify(await storedIds()),
);
await go('#/product/galaxy-s24-128');
await waitFor(
  `document.querySelector('h1')?.textContent === ${JSON.stringify(S24)} && document.querySelector('.product-purchase__cart')`,
  'pd s24',
);
await click('.product-purchase__cart');
await sleep(150);
check(
  'pd: PD add of a Catalog-added product merges into the Catalog line → badge 9',
  (await badge()) === '9' &&
    JSON.stringify(await storedIds()) === JSON.stringify(['galaxy-s24-128:3', 'iphone-15-128:6']),
  JSON.stringify(await storedIds()),
);
await go('#/product/xiaomi-14-256');
await waitFor(
  `document.querySelector('h1')?.textContent === ${JSON.stringify(X14)} && document.querySelector('.product-purchase__cart')`,
  'pd x14',
);
await evaluate(
  `document.querySelector('.product-purchase__cart-row .ui-stepper button:last-child').click()`,
);
await sleep(100);
await click('.product-purchase__cart');
await sleep(150);
check('pd: different product → badge 11', (await badge()) === '11', `badge=${await badge()}`);
check(
  'pd: 3 distinct canonical stored lines',
  JSON.stringify(await storedIds()) ===
    JSON.stringify(['galaxy-s24-128:3', 'iphone-15-128:6', 'xiaomi-14-256:2']),
  JSON.stringify(await storedIds()),
);

await go('#/cart');
await waitFor(`document.querySelectorAll('.cart-line').length === 3`, 'three lines');
const lineInfo = await evaluate(
  `[...document.querySelectorAll('.cart-line')].map((l) => [l.querySelector('.cart-line__title').textContent, l.querySelector('.cart-line__variant')?.textContent ?? '', l.querySelector('output').textContent, Boolean(l.querySelector('picture')), Boolean(l.querySelector('img'))].join(' | '))`,
);
check(
  'cart: PD lines rendered canonically (title, no variant, qty, covered products render a picture)',
  lineInfo.includes(`${S24} |  | 3 | true | true`) &&
    lineInfo.includes(`${I15} |  | 6 | true | true`) &&
    lineInfo.includes(`${X14} |  | 2 | true | true`),
  JSON.stringify(lineInfo),
);
check(
  'cart: line prices from live rows',
  (await evaluate(
    `[...document.querySelectorAll('.cart-line')].map((l) => l.querySelector('.cart-line__total').textContent.replace(/\\s/g, '')).join('|')`,
  )) === '227970₽|479940₽|139980₽',
  await evaluate(
    `[...document.querySelectorAll('.cart-line')].map((l) => l.querySelector('.cart-line__total').textContent.replace(/\\s/g, '')).join('|')`,
  ),
);
check(
  'cart: chip shows 11 units',
  (await evaluate(`document.querySelector('.cart-items__header')?.textContent`))?.includes('11'),
);
await evaluate(
  `document.querySelectorAll('.cart-line')[0].querySelector('.ui-stepper button:last-child').click()`,
);
await sleep(150);
check('cart: qty + → badge 12', (await badge()) === '12', `badge=${await badge()}`);
await evaluate(
  `document.querySelectorAll('.cart-line')[0].querySelector('.cart-line__remove').click()`,
);
await sleep(150);
check('cart: remove line → badge 8', (await badge()) === '8', `badge=${await badge()}`);
await reload();
await waitFor(`document.querySelectorAll('.cart-line').length === 2`, 'restore after reload');
check('persistence: reload restores 2 lines, badge 8', (await badge()) === '8');
check(
  'persistence: totals valid',
  (await evaluate(`document.querySelector('.cart-summary__row--total dd')?.textContent`))?.replace(
    /\s/g,
    '',
  ) === '619920₽',
  await evaluate(`document.querySelector('.cart-summary__row--total dd')?.textContent`),
);
const x14Line = `[...document.querySelectorAll('.cart-line')].find((l) => l.querySelector('.cart-line__title').textContent === ${JSON.stringify(X14)})`;
await evaluate(`${x14Line}.querySelector('.ui-stepper button:first-child').click()`);
await sleep(150);
check(
  'cart: Cart stepper stays min=1 (decrement disabled at 1, line kept)',
  (await evaluate(`${x14Line}.querySelector('output').textContent`)) === '1' &&
    (await evaluate(`${x14Line}.querySelector('.ui-stepper button:first-child').disabled`)) ===
      true &&
    (await badge()) === '7',
  `badge=${await badge()}`,
);
await evaluate(`document.querySelector('.cart-items__toolbar input[type=checkbox]').click()`);
await sleep(150);
check(
  'cart: toggle all off → nothing selected message',
  (await evaluate(`document.querySelector('.cart-summary__empty')?.textContent`)) ===
    'Не выбрано ни одного товара',
);
check(
  'cart: remove selected disabled with none selected',
  await evaluate(`document.querySelector('.cart-items__remove-selected').disabled`),
);
await evaluate(`document.querySelectorAll('.cart-line input[type=checkbox]')[0].click()`);
await sleep(100);
await click('.cart-items__remove-selected');
await sleep(150);
check(
  'cart: remove selected removes 1 line',
  (await evaluate(`document.querySelectorAll('.cart-line').length`)) === 1,
);
await evaluate(`document.querySelector('.cart-line__remove').click()`);
await sleep(200);
check(
  'cart: removing last line → empty state',
  await evaluate(`document.querySelector('h1')?.textContent === 'Корзина пуста'`),
);
check('cart: badge 0 after emptying', (await badge()) === '0');
check(
  'cart: empty-state focus to h1',
  await evaluate(`document.activeElement?.id === 'cart-empty-title'`),
);

for (const [label, value] of [
  ['malformed JSON', '{bad'],
  ['foreign shape', '{"lines":[{"id":1}]}'],
  [
    'invalid qty',
    '{"lines":[{"id":"x","productSlug":"x","title":"x","image":{"kind":"catalog-fallback"},"price":1,"quantity":500,"selected":true}]}',
  ],
]) {
  await evaluate(`localStorage.setItem('${KEY}', ${JSON.stringify(value)})`);
  await reload();
  await waitFor(`document.querySelector('#cart-empty-title')`, `empty after ${label}`);
  check(
    `corrupt storage (${label}): empty, no crash, key cleared`,
    (await badge()) === '0' && (await stored()) === null,
  );
}
await evaluate(
  `localStorage.setItem('${KEY}', ${JSON.stringify(JSON.stringify({ lines: [{ id: 'iphone-15-128|pink|128', productSlug: 'iphone-15-128', title: 'Apple iPhone 15 128 ГБ, Розовый', variant: 'Розовый · 128 ГБ', image: { kind: 'product-details', colourId: 'pink' }, price: 79990, oldPrice: 84990, quantity: 1, selected: true }] }))})`,
);
await reload();
await waitFor(`document.querySelector('.cart-line')`, 'legacy line');
check(
  'legacy variant-key line stays parseable and rendered (not rewritten)',
  (await evaluate(`document.querySelector('.cart-line__variant')?.textContent`)) ===
    'Розовый · 128 ГБ' &&
    (await badge()) === '1' &&
    JSON.parse(await stored()).lines[0].id === 'iphone-15-128|pink|128',
);
await evaluate(`localStorage.removeItem('${KEY}')`);
await reload();
check(
  'unrelated localStorage untouched',
  (await evaluate(`localStorage.getItem('goodcall.verify.marker')`)) === 'untouched-marker',
);
await evaluate(`localStorage.removeItem('goodcall.verify.marker')`);

await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'live catalog 2');
await click(`button[aria-label="В корзину: ${S24}"]`);
await go('#/product/iphone-15-128');
await waitFor(`document.querySelector('.product-purchase__cart')`, 'pd ready 2');
await click('.product-purchase__cart');
await sleep(150);
await go('#/cart');
for (const [w, h, mobile] of [
  [1440, 900, false],
  [1024, 800, false],
  [768, 1000, true],
  [390, 844, true],
  [320, 640, true],
]) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile,
  });
  const pages = {};
  for (const hash of ['#/cart', '#/catalog/smartphones', '#/product/iphone-15-128']) {
    await go(hash);
    await sleep(500);
    pages[hash] = await overflow();
  }
  const mb = w < 768 ? await mobileBadge() : await badge();
  check(
    `responsive ${w}: no horizontal overflow; badge visible`,
    Object.values(pages).every((v) => v <= 0) && mb === '2',
    `${JSON.stringify(pages)} badge=${mb}`,
  );
}
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
await evaluate(`localStorage.removeItem('${KEY}')`);
await reload();
await go('#/cart');
await waitFor(`document.querySelector('#cart-empty-title')`, 'empty 390');
check('responsive 390: empty cart no overflow', (await overflow()) <= 0);
check(
  'mobile action bar accessible name',
  (await evaluate(
    `document.querySelector('.mobile-action-bar__link[href="#/cart"]').getAttribute('aria-label')`,
  )) === 'Корзина: 0',
);
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

failLive = true;
await reload();
await go('#/catalog/smartphones');
await waitFor(
  `document.querySelector('main.route-status:not([aria-busy]) .route-status__actions button')`,
  'catalog failure state',
  20000,
);
check(
  'failure: catalog shows RouteStatus, no product cards or cart actions',
  (await evaluate(`document.querySelectorAll('.product-card, .product-card__cart').length`)) ===
    0 &&
    (await evaluate(`document.querySelector('h1')?.textContent`)) === 'Товары временно недоступны',
);
check('failure: cart untouched', (await stored()) === null && (await badge()) === '0');
check(
  'failure: no stepper shown',
  (await evaluate(`document.querySelectorAll('.ui-stepper').length`)) === 0,
);

failLive = false;
await reload();
await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'live catalog for thumbnails');
const catalogImages = await evaluate(
  `Object.fromEntries([...document.querySelectorAll('.catalog-grid .product-card')].map((c) => [c.querySelector('.product-card__link')?.getAttribute('href') ?? c.querySelector('.product-card__title').textContent, c.querySelector('img').getAttribute('src')]))`,
);
check(
  'thumb: live catalog covered cards → local heroes',
  (catalogImages['#/product/galaxy-s24-128'] ?? '').includes(
    'product-details-galaxy-s24-128-hero-front-gallery',
  ) &&
    (catalogImages['#/product/iphone-15-128'] ?? '').includes(
      'product-details-gallery-pink-hero-front-gallery',
    ) &&
    (catalogImages['#/product/xiaomi-14-256'] ?? '').includes(
      'product-details-xiaomi-14-256-hero-front-gallery',
    ),
  JSON.stringify(Object.keys(catalogImages)),
);
await send('Page.navigate', { url: `${BASE}?reference=catalog` });
await sleep(1500);
const referenceCatalog = await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card img')].map((i) => i.getAttribute('src'))`,
);
const referenceCatalog2 = await evaluate(`(() => ({
  count: document.querySelector('.catalog-page__count')?.textContent.replace(/\\s/g, ' ').trim(),
  pages: [...document.querySelectorAll('.catalog-page__pagination .ui-pagination__item:not(.ui-pagination__item--arrow)')].map((b) => b.textContent),
  legends: [...document.querySelectorAll('.catalog-page__sidebar legend')].map((l) => l.textContent),
  quick: [...document.querySelectorAll('.catalog-page__quick-filter')].map((b) => b.textContent),
  xiaomi: [...document.querySelectorAll('.catalog-page__sidebar .catalog-filters__option')].map((o) => o.textContent.replace(/\\s/g, ' ')).find((o) => o.startsWith('Xiaomi')),
}))()`);
check(
  'reference catalog: specimen count, 65 pages, Серия/Диагональ, all 7 quick chips, fixture counts',
  referenceCatalog2.count === '2 546 товаров' &&
    referenceCatalog2.pages.includes('65') &&
    referenceCatalog2.legends.includes('Серия') &&
    referenceCatalog2.legends.includes('Диагональ') &&
    referenceCatalog2.quick.length === 7 &&
    referenceCatalog2.quick.includes('Новинки') &&
    referenceCatalog2.quick.includes('Хиты продаж') &&
    referenceCatalog2.xiaomi === 'Xiaomi830',
  JSON.stringify(referenceCatalog2),
);
check(
  'thumb: ?reference=catalog keeps the fixture SVG only',
  referenceCatalog.length > 0 &&
    referenceCatalog.every((src) => src.includes('phone-back') && !src.includes('product-details')),
  String(referenceCatalog.length),
);

const B1_CART =
  '{"lines":[{"id":"pixel-8-128","productSlug":"pixel-8-128","title":"Google Pixel 8 128 ГБ, Обсидиан","image":{"kind":"catalog-fallback"},"price":53990,"quantity":1,"selected":true},{"id":"realme-gt6-256","productSlug":"realme-gt6-256","title":"realme GT 6 12/256 ГБ, Серебристый","image":{"kind":"catalog-fallback"},"price":44990,"quantity":1,"selected":true},{"id":"oneplus-12-256","productSlug":"oneplus-12-256","title":"OnePlus 12 12/256 ГБ, Сланец","image":{"kind":"url","src":"https://mock-goodcall.supabase.co/storage/v1/object/public/catalog-media/stub/oneplus-live.webp"},"price":64990,"quantity":1,"selected":true},{"id":"iphone-15-128|pink|128","productSlug":"iphone-15-128","title":"Apple iPhone 15 128 ГБ, Розовый","variant":"Розовый · 128 ГБ","image":{"kind":"product-details","colourId":"pink"},"price":79990,"quantity":1,"selected":true},{"id":"iphone-15-128|black|128","productSlug":"iphone-15-128","title":"Apple iPhone 15 128 ГБ, Чёрный","variant":"Чёрный · 128 ГБ","image":{"kind":"product-details","colourId":"black"},"price":79990,"quantity":1,"selected":true},{"id":"iphone-15-128|blue|128","productSlug":"iphone-15-128","title":"Apple iPhone 15 128 ГБ, Голубой","variant":"Голубой · 128 ГБ","image":{"kind":"product-details","colourId":"blue"},"price":79990,"quantity":1,"selected":true}]}';
const B1_EXPECT = {
  'Google Pixel 8 128 ГБ, Обсидиан': (src) =>
    src.includes('product-details-pixel-8-128-hero-front-gallery'),
  'realme GT 6 12/256 ГБ, Серебристый': (src) => src.includes('phone-back'),
  'OnePlus 12 12/256 ГБ, Сланец': (src) =>
    src ===
    'https://mock-goodcall.supabase.co/storage/v1/object/public/catalog-media/stub/oneplus-live.webp',
  'Apple iPhone 15 128 ГБ, Розовый': (src) =>
    src.includes('product-details-gallery-pink-hero-front-gallery'),
  'Apple iPhone 15 128 ГБ, Чёрный': (src) =>
    src.includes('product-details-gallery-hero-front-gallery'),
  'Apple iPhone 15 128 ГБ, Голубой': (src) =>
    src.includes('product-details-gallery-blue-hero-front-gallery'),
};
const b1Mismatches = (images) =>
  Object.entries(B1_EXPECT)
    .filter(([title, ok]) => !ok(images[title] ?? ''))
    .map(([title]) => [title, (images[title] ?? '').slice(0, 70)]);
const cartLineImages = () =>
  evaluate(
    `Object.fromEntries([...document.querySelectorAll('.cart-line')].map((l) => [l.querySelector('.cart-line__title').textContent, l.querySelector('img').getAttribute('src')]))`,
  );
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);
await evaluate(`localStorage.setItem('${KEY}', ${JSON.stringify(B1_CART)})`);
await reload();
await go('#/cart');
await waitFor(`document.querySelectorAll('.cart-line').length === 6`, 'b1 cart lines');
let b1Images = await cartLineImages();
check(
  'b1 cart: url / colour / local hero / SVG precedence (incl. legacy black, blue)',
  b1Mismatches(b1Images).length === 0,
  JSON.stringify(b1Mismatches(b1Images)),
);
check('b1 cart: stored JSON unchanged by render', (await stored()) === B1_CART);
await reload();
await go('#/cart');
await waitFor(`document.querySelectorAll('.cart-line').length === 6`, 'b1 cart reload');
b1Images = await cartLineImages();
check(
  'b1 cart: reload keeps stored JSON and rendering',
  (await stored()) === B1_CART && b1Mismatches(b1Images).length === 0,
);
check(
  'b1 cart: stored kinds unchanged',
  JSON.stringify(JSON.parse(await stored()).lines.map((l) => l.image.kind)) ===
    JSON.stringify([
      'catalog-fallback',
      'catalog-fallback',
      'url',
      'product-details',
      'product-details',
      'product-details',
    ]),
);
await evaluate(`localStorage.removeItem('${KEY}')`);

const spaces = (value) => value?.replace(/\s/g, ' ') ?? null;
const recommendationCards = () =>
  evaluate(`[...document.querySelectorAll('.cart-recommendations .product-card')].map((card) => ({
    title: card.querySelector('.product-card__title')?.textContent.trim() ?? null,
    href: card.querySelector('.product-card__title a')?.getAttribute('href') ?? null,
    price: card.querySelector('.product-price')?.textContent.replace(/\\s/g, ' ') ?? null,
    oldPrice: card.querySelector('.product-price-old')?.textContent.replace(/\\s/g, ' ') ?? null,
    badge: card.querySelector('.product-card__badge')?.textContent.trim() ?? null,
    imageSrc: card.querySelector('img')?.getAttribute('src') ?? null,
    picture: Boolean(card.querySelector('picture')),
    rating: card.querySelectorAll('.product-rating, [class*="rating"]').length,
    controls: card.querySelectorAll('button, input, select, [role="button"]').length,
    links: card.querySelectorAll('a').length,
    focusable: card.querySelectorAll('a[href], button, input, [tabindex]').length,
  }))`);
const recommendationSection = () =>
  evaluate(`(() => {
    const section = document.querySelector('.cart-recommendations');
    const heading = section?.querySelector('h2');
    return {
      count: document.querySelectorAll('.cart-recommendations').length,
      heading: heading?.textContent.trim() ?? null,
      labelledBy: section?.getAttribute('aria-labelledby') === heading?.id,
      afterBenefits: section?.previousElementSibling?.classList.contains('cart-page__benefits') ?? false,
      grid: Boolean(section?.querySelector('.cart-recommendations__grid')),
    };
  })()`);
const fallbackExpected = HOME_PRODUCTS.map((product) => ({
  title: product.title,
  price: spaces(product.price),
  oldPrice: spaces(product.oldPrice ?? null),
  badge: product.badge ?? null,
}));
const readyRows = HOME_POPULAR_PRODUCTS.map((row) =>
  CATALOG_ROWS.find((product) => product.id === row.product_id),
);
const readyExpected = readyRows.map((row) => ({
  title: row.name,
  price: spaces(formatPrice(row.price)),
  oldPrice: row.old_price === null ? null : spaces(formatPrice(row.old_price)),
}));
const sameText = (cards, expected) =>
  cards.length === expected.length &&
  cards.every(
    (card, index) =>
      card.title === expected[index].title &&
      card.price === expected[index].price &&
      card.oldPrice === expected[index].oldPrice &&
      (expected[index].badge === undefined || card.badge === expected[index].badge),
  );
const inert = (cards) =>
  cards.every((card) => card.rating === 0 && card.controls === 0 && card.focusable === card.links);
const POPULATED_CART = JSON.stringify({
  lines: [
    {
      id: 'iphone-15-128',
      productSlug: 'iphone-15-128',
      title: 'Apple iPhone 15 128 ГБ, Розовый',
      image: { kind: 'catalog-fallback' },
      price: 79990,
      oldPrice: 84990,
      quantity: 1,
      selected: true,
    },
  ],
});

homeFeed = 'fallback';
await evaluate(`localStorage.removeItem('${KEY}')`);
await reload();
await go('#/cart');
await waitFor(`document.querySelector('#cart-empty-title')`, 'recommendations empty fallback');
await waitFor(
  `document.querySelectorAll('.cart-recommendations .product-card').length > 0`,
  'fallback recommendations',
);
await sleep(600);
let recCards = await recommendationCards();
let recSection = await recommendationSection();
check(
  'recommendations fallback (backend unavailable): Home fixtures in order, no links',
  sameText(recCards, fallbackExpected) && recCards.every((card) => card.href === null),
  JSON.stringify(
    recCards.map((card) => [card.title, card.price, card.oldPrice, card.badge, card.href]),
  ),
);
check(
  'recommendations fallback: no rating, actions or extra focus targets',
  inert(recCards) && recCards.every((card) => card.links === 0),
  JSON.stringify(recCards.map((card) => [card.rating, card.controls, card.focusable])),
);
check(
  'recommendations empty cart: h2 heading, after benefits, once',
  recSection.count === 1 &&
    recSection.heading === 'Вам может понравиться' &&
    recSection.labelledBy &&
    recSection.afterBenefits &&
    recSection.grid,
  JSON.stringify(recSection),
);
check(
  'recommendations: Cart-only fixture cards (MacBook Air M2, 41 990 ₽ watch) gone',
  !recCards.some((card) => /MacBook Air 13 M2|41 990/.test(`${card.title} ${card.price}`)),
);

failLive = true;
await reload();
await go('#/cart');
await waitFor(
  `document.querySelectorAll('.cart-recommendations .product-card').length > 0`,
  'failure recommendations',
);
await sleep(800);
recCards = await recommendationCards();
check(
  'recommendations backend failure: Home fixtures, no links, inert',
  sameText(recCards, fallbackExpected) &&
    recCards.every((card) => card.href === null) &&
    inert(recCards) &&
    (await evaluate(`document.querySelector('#cart-empty-title') !== null`)),
);
failLive = false;

homeFeed = 'hold';
heldHomeRequests.length = 0;
await reload();
await go('#/cart');
await waitFor(
  `document.querySelectorAll('.cart-recommendations .product-card').length > 0`,
  'held recommendations',
);
await sleep(800);
recCards = await recommendationCards();
const heldCount = heldHomeRequests.length;
check(
  'recommendations while loading (request held): Home fixtures, no links',
  heldCount > 0 &&
    sameText(recCards, fallbackExpected) &&
    recCards.every((card) => card.href === null) &&
    inert(recCards),
  `held=${heldCount}`,
);
homeFeed = 'ready';
for (const requestId of heldHomeRequests.splice(0)) {
  await send('Fetch.fulfillRequest', {
    requestId,
    responseCode: 200,
    responseHeaders: [...cors(), { name: 'Content-Type', value: 'application/json' }],
    body: Buffer.from(JSON.stringify(HOME_POPULAR_PRODUCTS)).toString('base64'),
  });
}
await waitFor(
  `[...document.querySelectorAll('.cart-recommendations .product-card__title')][0]?.textContent.trim() === ${JSON.stringify(readyRows[0].name)}`,
  'held request released',
);
recCards = await recommendationCards();
check(
  'recommendations: released request swaps to the live curation',
  sameText(recCards, readyExpected),
  JSON.stringify(recCards.map((card) => card.title)),
);

await go('#/');
await waitFor(
  `document.querySelectorAll('.home-products .product-card').length === ${readyRows.length} && document.querySelector('.home-products .product-card__title')?.textContent.trim() === ${JSON.stringify(readyRows[0].name)}`,
  'home ready curation',
);
const homeCards = await evaluate(
  `[...document.querySelectorAll('.home-products .product-card')].map((card) => ({ title: card.querySelector('.product-card__title').textContent.trim(), href: card.querySelector('.product-card__title a')?.getAttribute('href') ?? null, badge: card.querySelector('.product-card__badge')?.textContent.trim() ?? null, imageSrc: card.querySelector('img')?.getAttribute('src') ?? null, picture: Boolean(card.querySelector('picture')) }))`,
);
await go('#/cart');
await waitFor(
  `document.querySelector('.cart-recommendations .product-card__title')?.textContent.trim() === ${JSON.stringify(readyRows[0].name)}`,
  'cart ready curation',
);
recCards = await recommendationCards();
check(
  'recommendations ready: five live products in feed order with live prices',
  readyRows.length === 5 && sameText(recCards, readyExpected),
  JSON.stringify(recCards.map((card) => [card.title, card.price, card.oldPrice])),
);
check(
  'recommendations ready: links and badges match the Home curation',
  JSON.stringify(recCards.map((card) => [card.title, card.href, card.badge])) ===
    JSON.stringify(homeCards.map((card) => [card.title, card.href, card.badge])) &&
    recCards.some((card) => card.href !== null) &&
    recCards.every(
      (card, index) => card.href === null || card.href === `#/product/${readyRows[index].slug}`,
    ),
  JSON.stringify({ cart: recCards.map((card) => [card.href, card.badge]), home: homeCards }),
);
check(
  'recommendations ready: no rating, actions; links only on titles',
  inert(recCards) && recCards.every((card) => card.links === (card.href === null ? 0 : 1)),
  JSON.stringify(recCards.map((card) => [card.rating, card.controls, card.links])),
);
const READY_MEDIA = {
  'iphone-15-128': { picture: true, file: 'product-details-gallery-pink-hero-front-gallery' },
  'galaxy-s24-128': { picture: true, file: 'product-details-galaxy-s24-128-hero-front-gallery' },
  'redmi-note-13-pro-256': { picture: true, file: 'home-device-smartphone-card' },
  'airpods-pro-2-usb-c': { picture: false, file: 'home/airpods-recommendation.png' },
  'apple-watch-series-9-45': {
    picture: true,
    file: 'product-details-gallery-apple-watch-s9-black-gallery',
  },
};
const readyCard = (slug) => recCards[readyRows.findIndex((row) => row.slug === slug)];
const mediaMatches = (slug) =>
  readyCard(slug)?.picture === READY_MEDIA[slug].picture &&
  (readyCard(slug).imageSrc ?? '').includes(READY_MEDIA[slug].file);
const mediaEvidence = JSON.stringify(
  recCards.map((card, index) => [readyRows[index].slug, card.imageSrc, card.picture]),
);
check(
  'recommendations ready: feed covers URL, thumbnail and artwork image cases',
  readyRows.length === Object.keys(READY_MEDIA).length &&
    readyRows.every((row) => Object.hasOwn(READY_MEDIA, row.slug)),
  JSON.stringify(readyRows.map((row) => row.slug)),
);
check(
  'recommendations ready: backend image URL wins without a picture source (AirPods)',
  mediaMatches(AIRPODS_ROW.slug),
  mediaEvidence,
);
check(
  'recommendations ready: no URL -> registered slug thumbnail (iPhone 15, Galaxy S24, Watch S9)',
  ['iphone-15-128', 'galaxy-s24-128', 'apple-watch-series-9-45'].every(mediaMatches) &&
    recCards.every((card) => !(card.imageSrc ?? '').includes('home-device-watch-card')),
  mediaEvidence,
);
check(
  'recommendations ready: no URL and no thumbnail -> category artwork (Redmi Note 13 Pro)',
  mediaMatches('redmi-note-13-pro-256'),
  mediaEvidence,
);
check(
  'recommendations ready: every card image equals the Home popular card image',
  recCards.length === homeCards.length &&
    recCards.every(
      (card, index) =>
        card.imageSrc !== null &&
        card.imageSrc === homeCards[index].imageSrc &&
        card.picture === homeCards[index].picture,
    ),
  JSON.stringify({
    cart: recCards.map((card) => card.imageSrc),
    home: homeCards.map((card) => card.imageSrc),
  }),
);
const firstLinked = recCards.findIndex((card) => card.href !== null);
await click(
  `.cart-recommendations .product-card:nth-child(${firstLinked + 1}) .product-card__title a`,
);
await waitFor(
  `location.hash === ${JSON.stringify(recCards[firstLinked].href)} && document.querySelector('h1')?.textContent === ${JSON.stringify(recCards[firstLinked].title)}`,
  'recommendation PDP link',
);
check('recommendations ready: title link opens the product page', true);

await evaluate(`localStorage.setItem('${KEY}', ${JSON.stringify(POPULATED_CART)})`);
await reload();
await go('#/cart');
await waitFor(`document.querySelector('.cart-line')`, 'populated cart with recommendations');
await waitFor(
  `document.querySelector('.cart-recommendations .product-card__title')?.textContent.trim() === ${JSON.stringify(readyRows[0].name)}`,
  'populated ready curation',
);
recSection = await recommendationSection();
check(
  'recommendations populated cart: after benefits, once, same live curation',
  recSection.count === 1 &&
    recSection.afterBenefits &&
    recSection.heading === 'Вам может понравиться' &&
    sameText(await recommendationCards(), readyExpected),
  JSON.stringify(recSection),
);

const recGeometry = [];
for (const [w, h, mobile] of [
  [1440, 900, false],
  [1024, 800, false],
  [768, 1000, true],
  [390, 844, true],
  [320, 640, true],
]) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile,
  });
  await sleep(400);
  recGeometry.push(
    await evaluate(`(() => {
      const section = document.querySelector('.cart-recommendations').getBoundingClientRect();
      const cards = [...document.querySelectorAll('.cart-recommendations .product-card')].map((card) => card.getBoundingClientRect());
      const overlap = cards.some((a, i) => cards.some((b, j) => j > i && a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1));
      const outside = cards.some((card) => card.left < section.left - 1 || card.right > section.right + 1);
      const clipped = [...document.querySelectorAll('.cart-recommendations .product-card__title, .cart-recommendations .product-price')].some((el) => el.scrollWidth > el.clientWidth + 1);
      return { w: ${w}, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, cards: cards.length, overlap, outside, clipped };
    })()`),
  );
}
check(
  'recommendations responsive 1440/1024/768/390/320: no overflow, overlap or clipping',
  recGeometry.every(
    (entry) =>
      entry.overflow <= 0 &&
      entry.cards === 5 &&
      !entry.overlap &&
      !entry.outside &&
      !entry.clipped,
  ),
  JSON.stringify(recGeometry),
);
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
homeFeed = 'fallback';
await evaluate(`localStorage.removeItem('${KEY}')`);

check('no uncaught errors', consoleErrors.length === 0, consoleErrors.join(' ; '));
await cdp.close();
await browser.close();
report(results);

import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';

const OUT = outputDir();
const BASE = appBase();
const MOCK_HOST = 'mock-goodcall.supabase.co';
const KEY = 'goodcall.cart.v1';
const results = [];
let failLive = false;

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

function mockBody(url, accept) {
  const u = new URL(url);
  const table = u.pathname.split('/').pop();
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
await sleep(1500);
check(
  'fallback: no live links',
  (await evaluate(`document.querySelectorAll('.product-card__link').length`)) === 0,
);
check(
  'fallback: add buttons natively disabled',
  await evaluate(
    `[...document.querySelectorAll('.product-card__cart')].length > 0 && [...document.querySelectorAll('.product-card__cart')].every((b) => b.disabled)`,
  ),
);
await evaluate(`document.querySelector('.product-card__cart').click()`);
await sleep(150);
check('fallback: click does not enter cart', (await stored()) === null && (await badge()) === '0');
check(
  'fallback: no stepper shown',
  (await evaluate(`document.querySelectorAll('.catalog-grid .ui-stepper').length`)) === 0,
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

check('no uncaught errors', consoleErrors.length === 0, consoleErrors.join(' ; '));
await cdp.close();
await browser.close();
report(results);

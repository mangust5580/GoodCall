import { register } from 'node:module';
import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';

register(new URL('../lib/ts-hook.mjs', import.meta.url));
const { formatUnitCount } = await import(
  new URL('../../../src/commerce/cart/cartPricing.ts', import.meta.url).href
);
const { CATALOG_PRODUCTS } = await import(
  new URL('../../../src/pages/catalog/catalogProducts.ts', import.meta.url).href
);

const OUT = outputDir();
const BASE = appBase();
const MOCK_HOST = 'mock-goodcall.supabase.co';
const KEY = 'goodcall.cart.v1';
const results = [];
let failLive = false;
let catalogRows = false;

const row = (slug, name, brand, price, oldPrice, pop) => ({
  id: `id-${slug}`,
  category_id: 'cat-smartphones',
  slug,
  name,
  brand,
  price,
  old_price: oldPrice,
  rating: 4.6,
  review_count: 100,
  is_new: false,
  popularity_score: pop,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
});
const PRODUCTS = [
  row(
    'iphone-15-pro-128',
    'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
    'Apple',
    109990,
    124990,
    100,
  ),
  row('iphone-15-128', 'Apple iPhone 15 128 ГБ, Розовый', 'Apple', 79990, 84990, 99),
  row('galaxy-s24-256', 'Samsung Galaxy S24 256 ГБ, Фиолетовый', 'Samsung', 75990, null, 98),
  ...Array.from({ length: 12 }, (_, i) =>
    row(
      `iphone-14-128-v${i + 1}`,
      `Apple iPhone 14 128 ГБ, Цвет ${i + 1}`,
      'Apple',
      60000 + i * 1000,
      null,
      50 - i,
    ),
  ),
];

const CATALOG_ROWS = [
  ['iphone-15-pro-128', 'Apple iPhone 15 Pro 128 ГБ, Натуральный титан', 109990, 124990, 4.9],
  ['cat-galaxy-s24', 'Samsung Galaxy S24 128 ГБ, Фиолетовый', 75990, null, 4.8],
  ['cat-xiaomi-14', 'Xiaomi 14 12/256 ГБ, Чёрный', 64990, 69990, 4.7],
  ['cat-pixel-8', 'Google Pixel 8 128 ГБ, Обсидиан', 53990, null, 4.6],
  ['cat-redmi-note', 'Xiaomi Redmi Note 13 Pro 256 ГБ, Синий', 29990, 32990, 4.4],
  ['cat-poco-x6', 'POCO X6 256 ГБ, Чёрный', 30000, null, 4.3],
  ['cat-realme-c67', 'realme C67 128 ГБ, Зелёный', 15000, null, 4.1],
  ['cat-tecno-spark', 'Tecno Spark 20 128 ГБ, Золотой', 14990, 16990, 3.8],
  ['cat-infinix-hot', 'Infinix Hot 40 256 ГБ, Серебристый', 12990, null, 3.5],
  ['cat-honor-x8b', 'HONOR X8b 128 ГБ, Изумрудный', 19990, null, 4.0],
  ['cat-nothing-2a', 'Nothing Phone (2a) 256 ГБ, Чёрный', 32990, null, 4.5],
  ['cat-vivo-y36', 'vivo Y36 128 ГБ, Розовый', 17990, null, 4.2],
  ['cat-oppo-a79', 'OPPO A79 256 ГБ, Лиловый', 21990, 23990, 4.4],
  ['cat-galaxy-a15', 'Samsung Galaxy A15 128 ГБ, Сланец', 16990, null, 3.9],
  ['cat-iphone-13', 'Apple iPhone 13 128 ГБ, Розовый', 59990, null, 4.8],
  ['cat-motorola-edge', 'Motorola Edge 40 256 ГБ', 34990, null, null],
].map(([slug, name, price, oldPrice, rating], index) => ({
  ...row(slug, name, name.split(' ')[0], price, oldPrice, 200 - index),
  rating,
}));

function mockBody(url, accept) {
  const u = new URL(url);
  const table = u.pathname.split('/').pop();
  let rows = [];
  if (table === 'categories')
    rows = u.searchParams.get('slug') === 'eq.smartphones' ? [{ id: 'cat-smartphones' }] : [];
  if (table === 'products') {
    const slug = u.searchParams.get('slug');
    rows = slug
      ? PRODUCTS.filter((p) => `eq.${p.slug}` === slug).map((p) => ({
          ...p,
          categories: { slug: 'smartphones', name: 'Смартфоны' },
        }))
      : catalogRows
        ? CATALOG_ROWS
        : PRODUCTS;
  }
  if (table === 'product_images')
    rows = (u.searchParams.get('product_id') ?? '').includes('id-iphone-15-pro-128')
      ? [
          {
            id: 'img-pro',
            product_id: 'id-iphone-15-pro-128',
            storage_path: 'stub/pro-live.webp',
            alt: 'Apple iPhone 15 Pro',
            position: 1,
          },
        ]
      : [];
  if (accept.includes('vnd.pgrst.object')) return rows[0] ?? null;
  return rows;
}

const browser = await launchBrowser();
const cdp = await browser.newPage();
const { send } = cdp;
const consoleErrors = [];
const cors = () => [
  { name: 'Access-Control-Allow-Origin', value: '*' },
  { name: 'Access-Control-Allow-Headers', value: '*' },
  { name: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
];
cdp.onEvent((msg) => {
  if (msg.method === 'Fetch.requestPaused') {
    const { requestId, request } = msg.params;
    if (failLive) {
      send('Fetch.failRequest', { requestId, errorReason: 'Failed' });
      return;
    }
    if (request.method === 'OPTIONS') {
      send('Fetch.fulfillRequest', { requestId, responseCode: 204, responseHeaders: cors() });
      return;
    }
    const accept = request.headers.Accept ?? request.headers.accept ?? '';
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
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
async function go(hash) {
  await evaluate(`location.hash = ${JSON.stringify(hash)}`);
  await sleep(350);
}
async function reload() {
  await send('Page.reload', {});
  await sleep(1200);
}
async function viewport(width, height, mobile) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await sleep(250);
}
const badge = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/cart"] .site-header__badge')?.textContent ?? null`,
  );
const mobileBadge = () =>
  evaluate(
    `document.querySelector('.mobile-action-bar__link[href="#/cart"] .mobile-action-bar__badge')?.textContent ?? null`,
  );
const stored = () => evaluate(`localStorage.getItem('${KEY}')`);
const storedLines = () =>
  evaluate(
    `JSON.parse(localStorage.getItem('${KEY}') ?? '{"lines":[]}').lines.map((l) => l.id + ':' + l.quantity)`,
  );
const overflow = () =>
  evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
const clearCart = async () => {
  await evaluate(`localStorage.removeItem('${KEY}')`);
  await reload();
};
const I15 = 'Apple iPhone 15 128 ГБ, Розовый';
const I15PRO = 'Apple iPhone 15 Pro 128 ГБ, Натуральный титан';
const rowOf = (title) =>
  `[...document.querySelectorAll('.search-row')].find((r) => r.querySelector('.search-row__title')?.textContent === ${JSON.stringify(title)})`;
const cardOf = (title) =>
  `[...document.querySelectorAll('.search-results .product-card')].find((c) => c.querySelector('.product-card__title')?.textContent === ${JSON.stringify(title)})`;
const status = () =>
  evaluate(`document.querySelector('main.search-page > p[role="status"]')?.textContent ?? ''`);

const GRAMMAR = [
  [0, '0 товаров'],
  [1, '1 товар'],
  [2, '2 товара'],
  [3, '3 товара'],
  [4, '4 товара'],
  [5, '5 товаров'],
  [11, '11 товаров'],
  [21, '21 товар'],
  [22, '22 товара'],
  [25, '25 товаров'],
  [2546, '2 546 товаров'],
];
const grammar = GRAMMAR.map(([value]) => formatUnitCount(value).replace(/\s/g, ' '));
check(
  'catalog count: formatUnitCount ru-RU inflection matrix (0/1/2/3/4/5/11/21/22/25/2 546)',
  JSON.stringify(grammar) === JSON.stringify(GRAMMAR.map(([, text]) => text)),
  JSON.stringify(grammar),
);

await send('Runtime.enable');
await send('Page.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: `*${MOCK_HOST}*` }] });
await viewport(1440, 900, false);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);
await evaluate(`localStorage.setItem('goodcall.verify.marker', 'keep')`);
await clearCart();

await go('#/search?q=iphone');
await waitFor(`document.querySelector('.search-row__link')`, 'live search rows');
check(
  'A search: 1440 renders desktop rows (faceted)',
  await evaluate(
    `document.querySelectorAll('.search-row').length === 12 && Boolean(document.querySelector('.search-filters'))`,
  ),
);
check(
  'A search: live row add enabled',
  await evaluate(
    `[...document.querySelectorAll('.search-row .product-action--cart')].every((b) => !b.disabled)`,
  ),
);
check(
  'A search: add placed under price in right column',
  await evaluate(
    `(() => { const r = ${rowOf(I15)}; const a = r.querySelector('.search-row__aside'); return a && a.firstElementChild.classList.contains('search-row__prices') && a.lastElementChild.classList.contains('search-row__actions'); })()`,
  ),
);
await evaluate(`window.__searchImg = ${rowOf(I15)}.querySelector('img').getAttribute('src')`);
await evaluate(`${rowOf(I15)}.querySelector('.product-action--cart').click()`);
await sleep(150);
check('A search: add → badge 1', (await badge()) === '1', `badge=${await badge()}`);
check(
  'A search: shared stepper appears with 1',
  (await evaluate(`${rowOf(I15)}.querySelector('.ui-stepper output')?.textContent`)) === '1',
);
check(
  'A search: add button kept after add (Catalog pattern)',
  await evaluate(`Boolean(${rowOf(I15)}.querySelector('.product-action--cart'))`),
);
check('A search: status announcement', (await status()).includes(I15), await status());
check(
  'A search: focus not moved into status',
  await evaluate(`document.activeElement?.getAttribute('role') !== 'status'`),
);
await go('#/cart');
await waitFor(`document.querySelector('.cart-line')`, 'cart line');
const cartLine = await evaluate(
  `(() => { const l = document.querySelector('.cart-line'); return [l.querySelector('.cart-line__title').textContent, l.querySelector('.cart-line__total').textContent.replace(/\\s/g, ''), l.querySelector('.cart-line__old')?.textContent.replace(/\\s/g, '') ?? '', l.querySelector('img').getAttribute('src').includes('product-details-gallery-pink-hero-front-gallery'), JSON.parse(localStorage.getItem('goodcall.cart.v1')).lines[0].image.kind === 'catalog-fallback'].join('|'); })()`,
);
check(
  'A cart: same title/price/old price; stored kind catalog-fallback, rendered local hero',
  cartLine === `${I15}|79990₽|84990₽|true|true`,
  cartLine,
);
check(
  'A search row: covered product uses local hero thumbnail',
  ((await evaluate('window.__searchImg')) ?? '').includes(
    'product-details-gallery-pink-hero-front-gallery',
  ),
  await evaluate('window.__searchImg'),
);

await go('#/search?q=iphone');
await waitFor(`${rowOf(I15)}?.querySelector('.ui-stepper')`, 'row stepper');
await evaluate(`${rowOf(I15)}.querySelector('.ui-stepper button:last-child').click()`);
await sleep(150);
check('B shared: Search + → badge 2', (await badge()) === '2');
await go('#/cart');
await waitFor(`document.querySelector('.cart-line')`, 'cart line 2');
await evaluate(`document.querySelector('.cart-line .ui-stepper button:last-child').click()`);
await sleep(150);
check('B shared: Cart + → badge 3', (await badge()) === '3');
await go('#/search?q=iphone');
await waitFor(`${rowOf(I15)}?.querySelector('.ui-stepper output')`, 'row qty');
check(
  'B shared: Search shows Cart-mutated qty 3',
  (await evaluate(`${rowOf(I15)}.querySelector('.ui-stepper output').textContent`)) === '3',
);
check(
  'B shared: no Search-local copy (single stored line)',
  JSON.stringify(await storedLines()) === JSON.stringify(['iphone-15-128:3']),
  JSON.stringify(await storedLines()),
);

await clearCart();
await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'live catalog');
await evaluate(`document.querySelector('button[aria-label="В корзину: ${I15PRO}"]').click()`);
await sleep(150);
await go('#/search?q=iphone');
await waitFor(`${rowOf(I15PRO)}`, 'pro row');
check(
  'C merge: Search row reflects Catalog add (qty 1)',
  (await evaluate(`${rowOf(I15PRO)}.querySelector('.ui-stepper output')?.textContent`)) === '1',
);
await evaluate(`${rowOf(I15PRO)}.querySelector('.product-action--cart').click()`);
await sleep(150);
check(
  'C merge: one canonical line, summed qty 2',
  JSON.stringify(await storedLines()) === JSON.stringify(['iphone-15-pro-128:2']),
  JSON.stringify(await storedLines()),
);
await go('#/product/iphone-15-128');
await waitFor(`document.querySelector('.product-purchase__cart')`, 'pd');
await evaluate(`document.querySelector('.product-purchase__cart').click()`);
await sleep(150);
await go('#/search?q=iphone');
await waitFor(`${rowOf(I15)}`, 'i15 row');
check(
  'C merge: PD add uses canonical identity (one iphone-15-128 line) and the Search row reflects it as stepper 1',
  JSON.stringify(await storedLines()) ===
    JSON.stringify(['iphone-15-pro-128:2', 'iphone-15-128:1']) &&
    (await evaluate(`${rowOf(I15)}.querySelector('.ui-stepper output')?.textContent`)) === '1',
  JSON.stringify(await storedLines()),
);
check('G regression: PD variant add works, badge 3', (await badge()) === '3');

await reload();
await waitFor(`${rowOf(I15PRO)}?.querySelector('.ui-stepper output')`, 'restore');
check(
  'D persistence: Search reload restores qty 2',
  (await evaluate(`${rowOf(I15PRO)}.querySelector('.ui-stepper output').textContent`)) === '2' &&
    (await badge()) === '3',
);
await go('#/cart');
await waitFor(`document.querySelectorAll('.cart-line').length === 2`, 'cart restore');
check('D persistence: Cart shows both lines after reload', true);

await go('#/search?q=iphone');
await waitFor(`document.querySelector('.search-row')`, 'rows p1');
check(
  'F search: summary count 14',
  (await evaluate(`document.querySelector('.search-page__summary')?.textContent`))?.includes('14'),
);
check(
  'F search: pagination present (2 pages)',
  await evaluate(`Boolean(document.querySelector('.search-workspace__pagination'))`),
);
await go('#/search?q=iphone&page=2');
await waitFor(`document.querySelectorAll('.search-row').length === 2`, 'page 2');
check('F search: page 2 shows 2 rows', true);
await go('#/search?q=iphone&sort=cheap');
await waitFor(`document.querySelector('.search-row')`, 'sorted');
check(
  'F search: sort cheap puts cheapest first',
  (await evaluate(`document.querySelector('.search-row__title').textContent`)) ===
    'Apple iPhone 14 128 ГБ, Цвет 1',
);
await go('#/search?q=ГБ');
await waitFor(`document.querySelectorAll('.search-row').length === 12`, 'ГБ rows');
await evaluate(
  `(() => { const byLegend = (t) => [...document.querySelectorAll('.search-filters__group')].find((g) => g.querySelector('legend')?.textContent.includes(t)); byLegend('Бренд').querySelectorAll('input[type=checkbox]')[0].click(); const mem = [...byLegend('Встроенная память').querySelectorAll('label')].find((l) => l.textContent.includes('256')); mem.querySelector('input').click(); })()`,
);
await sleep(150);
await evaluate(
  `[...document.querySelectorAll('.search-filters__actions button')].find((b) => b.textContent.includes('Применить')).click()`,
);
await sleep(250);
check(
  'F search: filtered-empty state',
  await evaluate(`Boolean(document.querySelector('.search-filtered-empty'))`),
);
await evaluate(`document.querySelector('.search-filtered-empty__reset').click()`);
await sleep(250);
check(
  'F search: filters reset restores rows',
  (await evaluate(`document.querySelectorAll('.search-row').length`)) === 12,
);
await go('#/search?q=zzzz');
await sleep(300);
check(
  'F search: no-results',
  (await evaluate(`document.querySelector('.search-empty__title')?.textContent`)) ===
    'Ничего не найдено',
);
await go('#/search');
await sleep(300);
check(
  'F search: no-query',
  (await evaluate(`document.querySelector('.search-empty__title')?.textContent`)) ===
    'Введите запрос',
);

await viewport(390, 844, true);
await go('#/search?q=iphone');
await waitFor(`document.querySelector('.search-results .product-card')`, 'mobile cards');
check(
  'H 390: horizontal cards (no rows)',
  await evaluate(
    `document.querySelectorAll('.search-row').length === 0 && document.querySelectorAll('.search-results .product-card--horizontal').length === 12`,
  ),
);
check(
  'H 390: Catalog-added line shows shared stepper 2 in card',
  (await evaluate(`${cardOf(I15PRO)}.querySelector('.ui-stepper output')?.textContent`)) === '2',
);
check(
  'H 390: live card add enabled',
  await evaluate(
    `[...document.querySelectorAll('.search-results .product-card__cart')].every((b) => !b.disabled)`,
  ),
);
await evaluate(`${cardOf(I15)}.querySelector('.product-card__cart').click()`);
await sleep(150);
check(
  'H 390: card add increments the shared canonical PD-added line → stepper 2 (one stored line), mobile badge 4',
  (await evaluate(`${cardOf(I15)}.querySelector('.ui-stepper output')?.textContent`)) === '2' &&
    JSON.stringify(await storedLines()) ===
      JSON.stringify(['iphone-15-pro-128:2', 'iphone-15-128:2']) &&
    (await mobileBadge()) === '4',
  `mobileBadge=${await mobileBadge()}`,
);
check('H 390: status announcement on mobile layout', (await status()).includes(I15));

const widths = [
  [1440, 900, false],
  [1024, 800, false],
  [1023, 800, false],
  [768, 1000, true],
  [390, 844, true],
  [320, 640, true],
];
for (const [w, h, m] of widths) {
  await viewport(w, h, m);
  const pages = {};
  for (const hash of [
    '#/search?q=iphone',
    '#/cart',
    '#/catalog/smartphones',
    '#/product/iphone-15-128',
  ]) {
    await go(hash);
    await sleep(450);
    pages[hash] = await overflow();
  }
  await go('#/search?q=iphone');
  await sleep(400);
  const collide = await evaluate(`(() => {
    const scope = document.querySelector('.search-row') ? '.search-row' : '.search-results .product-card';
    const items = [...document.querySelectorAll(scope)];
    return items.filter((it) => { const box = it.getBoundingClientRect(); return [...it.querySelectorAll('.ui-stepper, .product-action--cart, .product-card__cart')].some((c) => { const b = c.getBoundingClientRect(); return b.right > box.right + 0.5 || b.left < box.left - 0.5 || b.width < 30; }); }).length;
  })()`);
  const layout = await evaluate(
    `document.querySelector('.search-row') ? 'rows' : (document.querySelector('.search-results .product-card') ? 'cards' : 'none')`,
  );
  check(
    `H ${w}: no overflow; controls inside cards; layout=${layout}`,
    Object.values(pages).every((v) => v <= 0) &&
      collide === 0 &&
      layout === (w >= 1024 ? 'rows' : 'cards'),
    `${JSON.stringify(pages)} collide=${collide}`,
  );
}

await viewport(1440, 900, false);
await go('#/cart');
await waitFor(`document.querySelector('.cart-line')`, 'cart');
while (await evaluate(`Boolean(document.querySelector('.cart-line__remove'))`)) {
  await evaluate(`document.querySelector('.cart-line__remove').click()`);
  await sleep(150);
}
check(
  'G regression: Cart remove all → empty state, badge 0',
  (await evaluate(`document.querySelector('h1')?.textContent`)) === 'Корзина пуста' &&
    (await badge()) === '0',
);
await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'catalog 2');
await evaluate(`document.querySelector('.catalog-grid .product-card__cart').click()`);
await sleep(150);
check(
  'G regression: Catalog add → stepper + badge 1',
  (await evaluate(`document.querySelector('.catalog-grid .ui-stepper output')?.textContent`)) ===
    '1' && (await badge()) === '1',
);
await clearCart();

await viewport(1440, 900, false);
await go('#/search?q=iphone');
await waitFor(`document.querySelectorAll('.search-row__link').length > 0`, 'live rows');
const rowImages = await evaluate(
  `Object.fromEntries([...document.querySelectorAll('.search-row')].map((r) => [r.querySelector('.search-row__title').textContent, r.querySelector('img').getAttribute('src')]))`,
);
check(
  'thumb row: covered product → local hero',
  (rowImages[I15] ?? '').includes('product-details-gallery-pink-hero-front-gallery'),
  rowImages[I15],
);
check(
  'thumb row: live product_images URL wins over local hero',
  (rowImages[I15PRO] ?? '').endsWith('/storage/v1/object/public/catalog-media/stub/pro-live.webp'),
  rowImages[I15PRO],
);
check(
  'thumb row: uncovered products keep fallback',
  Object.entries(rowImages)
    .filter(([title]) => title.startsWith('Apple iPhone 14'))
    .every(([, src]) => src.includes('phone-back')),
);
const rowGeometry = await evaluate(
  `[...document.querySelectorAll('.search-row')].map((r) => { const m = r.querySelector('.search-row__media').getBoundingClientRect(); const i = r.querySelector('.search-row__image').getBoundingClientRect(); return [m.width, m.height, i.width, i.height, i.left - m.left, i.top - m.top].map(Math.round).join('x'); })`,
);
check(
  'thumb row: picture and img rows share identical media geometry',
  new Set(rowGeometry).size === 1,
  JSON.stringify([...new Set(rowGeometry)]),
);
await viewport(390, 844, true);
await go('#/search?q=iphone');
await waitFor(`${cardOf(I15)}`, 'mobile cards');
const cardImages = await evaluate(
  `Object.fromEntries([...document.querySelectorAll('.search-results .product-card')].map((c) => [c.querySelector('.product-card__title').textContent, c.querySelector('img').getAttribute('src')]))`,
);
check(
  'thumb card: covered product → local hero',
  (cardImages[I15] ?? '').includes('product-details-gallery-pink-hero-front-gallery'),
  cardImages[I15],
);
check(
  'thumb card: live URL wins; uncovered keeps fallback',
  (cardImages[I15PRO] ?? '').includes('/storage/v1/object/public/') &&
    Object.entries(cardImages)
      .filter(([title]) => title.startsWith('Apple iPhone 14'))
      .every(([, src]) => src.includes('phone-back')),
);
check(
  'thumb card: no page overflow at 390',
  (await evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`)) <=
    0,
);
await viewport(1440, 900, false);

await viewport(1440, 900, false);
catalogRows = true;
await reload();
await go('#/catalog/smartphones');
await waitFor(
  `document.querySelector('.catalog-page__count')?.textContent.includes('16')`,
  'live catalog count',
);
const catalogState = () =>
  evaluate(`(() => ({
    count: document.querySelector('.catalog-page__count').textContent.replace(/\\s/g, ' ').trim(),
    titles: [...document.querySelectorAll('.catalog-grid .product-card__title')].map((t) => t.textContent),
    empty: document.querySelector('.catalog-page__results .empty-state h3')?.textContent ?? null,
    pages: [...document.querySelectorAll('.catalog-page__pagination .ui-pagination__item:not(.ui-pagination__item--arrow)')].map((b) => b.textContent),
    current: document.querySelector('.catalog-page__pagination [aria-current="page"]')?.textContent ?? null,
    quick: [...document.querySelectorAll('.catalog-page__quick-filter')].map((b) => [b.textContent, b.getAttribute('aria-pressed')]),
  }))()`);
const clickQuick = (label) =>
  evaluate(
    `[...document.querySelectorAll('.catalog-page__quick-filter')].find((b) => b.textContent === ${JSON.stringify(label)}).click()`,
  );
const sidebarOption = (scope, label) =>
  `[...document.querySelectorAll('${scope} .ui-choice')].find((l) => l.querySelector('.catalog-filters__option-name, .ui-visually-hidden')?.textContent === ${JSON.stringify(label)})`;
const toggleSidebar = async (label) => {
  await evaluate(
    `${sidebarOption('.catalog-page__sidebar', label)}.querySelector('input').click()`,
  );
  await sleep(150);
};
const toggleColour = async (scope, label) => {
  await evaluate(
    `[...document.querySelectorAll('${scope} .catalog-filters__swatch')].find((s) => s.textContent.trim().split(' (')[0] === ${JSON.stringify(label)}).querySelector('input').click()`,
  );
  await sleep(150);
};
const resetSidebar = async () => {
  await evaluate(
    `document.querySelector('.catalog-page__sidebar .catalog-filters__reset').click()`,
  );
  await sleep(150);
};
const setPrice = async (label, value) => {
  await evaluate(
    `document.querySelector('.catalog-page__sidebar input[aria-label="${label}: значение"]').focus()`,
  );
  await sleep(50);
  await evaluate(`(() => {
    const input = document.querySelector('.catalog-page__sidebar input[aria-label="${label}: значение"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '${value}');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(50);
  await evaluate(
    `document.querySelector('.catalog-page__sidebar input[aria-label="${label}: значение"]').blur()`,
  );
  await sleep(200);
};
const countOf = (state) => Number(state.count.replace(/\D/g, ''));

let state = await catalogState();
check('catalog live: truthful count 16', countOf(state) === 16, state.count);
check(
  'catalog live: 2 truthful pages, 12 on page 1',
  JSON.stringify(state.pages) === JSON.stringify(['1', '2']) && state.titles.length === 12,
  JSON.stringify(state.pages),
);
const pageOne = state.titles;
await evaluate(
  `[...document.querySelectorAll('.catalog-page__pagination .ui-pagination__item')].find((b) => b.textContent === '2').click()`,
);
await sleep(200);
state = await catalogState();
check(
  'catalog live: page 2 has the remaining 4, no repeats',
  state.titles.length === 4 &&
    state.titles.every((t) => !pageOne.includes(t)) &&
    state.current === '2',
  JSON.stringify(state.titles),
);
await clickQuick('Все смартфоны');
await sleep(150);
state = await catalogState();
check(
  'catalog live: quick change resets to page 1',
  state.current === '1' && state.titles.length === 12,
);

check(
  'catalog live: unsupported controls hidden',
  JSON.stringify(state.quick.map(([label]) => label)) ===
    JSON.stringify([
      'Все смартфоны',
      'Со скидкой',
      'До 15 000 ₽',
      '15 000 – 30 000 ₽',
      '30 000 ₽ и выше',
    ]) &&
    !(await evaluate(
      `[...document.querySelectorAll('.catalog-page__sidebar legend')].some((l) => ['Серия', 'Диагональ'].includes(l.textContent))`,
    )),
  JSON.stringify(state.quick),
);
const brandOptions = await evaluate(
  `[...document.querySelectorAll('.catalog-page__sidebar fieldset:first-of-type .catalog-filters__option')].map((o) => o.textContent.replace(/\\s/g, ' '))`,
);
check(
  'catalog live: brand options and counts are live',
  brandOptions.includes('Все бренды16') &&
    brandOptions.includes('Apple2') &&
    brandOptions.includes('Samsung2') &&
    brandOptions.includes('Xiaomi2') &&
    !brandOptions.some((o) => o.includes('830')),
  JSON.stringify(brandOptions),
);
const memoryOptions = await evaluate(
  `[...document.querySelectorAll('.catalog-page__sidebar fieldset')].find((f) => f.querySelector('legend')?.textContent === 'Память').querySelectorAll('.catalog-filters__option-name').length`,
);
check('catalog live: memory options only 128 and 256', memoryOptions === 2);
const colourGroup = (scope) =>
  `[...document.querySelectorAll('${scope} fieldset')].find((f) => f.querySelector('legend')?.textContent === 'Цвет')`;
const colourFacet = (scope) =>
  evaluate(`(() => {
    const group = ${colourGroup(scope)};
    return {
      swatches: [...group.querySelectorAll('.catalog-filters__swatch')].map((s) => [s.querySelector('.ui-visually-hidden').textContent, s.querySelector('.catalog-filters__swatch-dot').className.split('--')[1], s.querySelector('input').type]),
      rows: [...group.querySelectorAll('.catalog-filters__colour-rows .ui-choice')].map((l) => [l.querySelector('.catalog-filters__option-name').textContent, l.querySelector('.catalog-filters__option-count').textContent, l.querySelector('input')?.type ?? null, Boolean(l.querySelector('.catalog-filters__swatch-dot'))]),
      more: group.querySelector('.catalog-filters__more')?.getAttribute('aria-expanded') ?? null,
    };
  })()`);
const expandColours = async (scope) => {
  await evaluate(`${colourGroup(scope)}.querySelector('.catalog-filters__more').click()`);
  await sleep(150);
};
const colourCounts = (facet) =>
  Object.fromEntries([
    ...facet.swatches.map(([label]) => [
      label.split(' (')[0],
      Number(label.split(' (')[1]?.replace(')', '')),
    ]),
    ...facet.rows.map(([name, count]) => [name, Number(count)]),
  ]);
const expectedColourCounts = {};
for (const product of CATALOG_ROWS) {
  const index = product.name.lastIndexOf(',');
  if (index !== -1) {
    const colour = product.name.slice(index + 1).trim();
    expectedColourCounts[colour] = (expectedColourCounts[colour] ?? 0) + 1;
  }
}
const expectedColourNames = Object.keys(expectedColourCounts).sort();
const PALETTE_SWATCHES = {
  Чёрный: 'black',
  Розовый: 'pink',
  Зелёный: 'green',
  Золотой: 'gold',
  Синий: 'blue',
  Фиолетовый: 'violet',
};

const collapsedColours = await colourFacet('.catalog-page__sidebar');
check(
  'catalog live colour: collapsed shows 7 options (count desc, then name) and a real «Показать ещё»',
  collapsedColours.swatches.length + collapsedColours.rows.length === 7 &&
    collapsedColours.more === 'false' &&
    JSON.stringify(collapsedColours.swatches.map(([label]) => label)) ===
      JSON.stringify(['Чёрный (3)', 'Розовый (2)', 'Зелёный (1)', 'Золотой (1)']) &&
    JSON.stringify(collapsedColours.rows.map(([name]) => name)) ===
      JSON.stringify(['Изумрудный', 'Лиловый', 'Натуральный титан']),
  JSON.stringify(collapsedColours),
);
await expandColours('.catalog-page__sidebar');
const sidebarColours = await colourFacet('.catalog-page__sidebar');
const sidebarCounts = colourCounts(sidebarColours);
check(
  'catalog live colour: every parseable live colour is exposed after expansion',
  expectedColourNames.length === 12 &&
    sidebarColours.more === 'true' &&
    JSON.stringify(Object.keys(sidebarCounts).sort()) === JSON.stringify(expectedColourNames) &&
    [
      'Чёрный',
      'Розовый',
      'Обсидиан',
      'Натуральный титан',
      'Серебристый',
      'Лиловый',
      'Изумрудный',
      'Сланец',
    ].every((colour) => colour in sidebarCounts),
  JSON.stringify(Object.keys(sidebarCounts)),
);
check(
  'catalog live colour: palette colours keep the existing swatch path',
  sidebarColours.swatches.length === 6 &&
    sidebarColours.swatches.every(
      ([label, dot, type]) => PALETTE_SWATCHES[label.split(' (')[0]] === dot && type === 'checkbox',
    ),
  JSON.stringify(sidebarColours.swatches),
);
check(
  'catalog live colour: non-palette colours render text checkbox rows without a fake swatch',
  JSON.stringify(sidebarColours.rows.map(([name]) => name)) ===
    JSON.stringify([
      'Изумрудный',
      'Лиловый',
      'Натуральный титан',
      'Обсидиан',
      'Серебристый',
      'Сланец',
    ]) && sidebarColours.rows.every(([, , type, dot]) => type === 'checkbox' && !dot),
  JSON.stringify(sidebarColours.rows),
);
check(
  'catalog live colour: counts match the mock source set',
  expectedColourNames.every((colour) => sidebarCounts[colour] === expectedColourCounts[colour]),
  JSON.stringify(sidebarCounts),
);
const colourRowsLayout = await evaluate(`(() => {
  const group = ${colourGroup('.catalog-page__sidebar')};
  const swatches = group.querySelector('.catalog-filters__swatches').getBoundingClientRect();
  const rows = group.querySelector('.catalog-filters__colour-rows').getBoundingClientRect();
  return { gap: rows.top - swatches.bottom, overflow: group.scrollWidth - group.clientWidth };
})()`);
check(
  'catalog live colour: mixed swatches and rows stack without overlap or overflow',
  colourRowsLayout.gap >= 4 && colourRowsLayout.gap <= 16 && colourRowsLayout.overflow <= 0,
  JSON.stringify(colourRowsLayout),
);

await toggleSidebar('Samsung');
state = await catalogState();
check(
  'catalog live: brand filter narrows grid and count',
  countOf(state) === 2 &&
    state.titles.every((t) => t.startsWith('Samsung')) &&
    state.pages.length === 0,
  JSON.stringify(state.titles),
);
const firstCartButton = await evaluate(
  `Boolean(document.querySelector('.catalog-grid .product-card__cart:not([disabled])'))`,
);
await evaluate(`localStorage.removeItem('${KEY}')`);
await evaluate(`document.querySelector('.catalog-grid .product-card__cart').click()`);
await sleep(150);
check(
  'catalog live: filtered card keeps the cart seam',
  firstCartButton &&
    JSON.parse((await evaluate(`localStorage.getItem('${KEY}')`)) ?? '{"lines":[]}').lines
      .length === 1,
);
await evaluate(`localStorage.removeItem('${KEY}')`);
await resetSidebar();

await toggleSidebar('256 ГБ');
state = await catalogState();
check(
  'catalog live: memory 256 (12/256 counts as 256)',
  countOf(state) === 7 && state.titles.includes('Xiaomi 14 12/256 ГБ, Чёрный'),
  `${state.count} ${JSON.stringify(state.titles)}`,
);
await resetSidebar();

await toggleColour('.catalog-page__sidebar', 'Чёрный');
state = await catalogState();
check(
  'catalog live: colour filter (Чёрный → 3); uncoloured product does not crash',
  countOf(state) === 3 && state.titles.every((t) => t.endsWith(', Чёрный')),
  state.count,
);
await resetSidebar();

await toggleSidebar('Обсидиан');
state = await catalogState();
check(
  'catalog live colour: non-palette Обсидиан filters to its exact products',
  countOf(state) === 1 &&
    JSON.stringify(state.titles) === JSON.stringify(['Google Pixel 8 128 ГБ, Обсидиан']),
  JSON.stringify(state.titles),
);
await resetSidebar();

await toggleColour('.catalog-page__sidebar', 'Розовый');
state = await catalogState();
check(
  'catalog live colour: palette Розовый filters to its exact products',
  countOf(state) === 2 && state.titles.every((t) => t.endsWith(', Розовый')),
  JSON.stringify(state.titles),
);
await resetSidebar();

await toggleSidebar('Лиловый');
state = await catalogState();
check(
  'catalog live colour: Лиловый stays distinct from Фиолетовый',
  countOf(state) === 1 && state.titles[0] === 'OPPO A79 256 ГБ, Лиловый',
  JSON.stringify(state.titles),
);
await resetSidebar();

await toggleSidebar('Сланец');
const slateChecked = await evaluate(
  `${sidebarOption('.catalog-page__sidebar', 'Сланец')}.querySelector('input').checked`,
);
await resetSidebar();
state = await catalogState();
check(
  'catalog live colour: reset clears a selected non-palette colour and restores 16',
  slateChecked &&
    countOf(state) === 16 &&
    !(await evaluate(
      `${sidebarOption('.catalog-page__sidebar', 'Сланец')}?.querySelector('input').checked ?? false`,
    )),
  state.count,
);
await resetSidebar();

await evaluate(
  `[...document.querySelectorAll('.catalog-page__sidebar .ui-choice')].find((l) => l.textContent.includes('Рейтинг 4,5 и выше')).querySelector('input').click()`,
);
await sleep(150);
state = await catalogState();
check('catalog live: rating ≥ 4.5 → 6', countOf(state) === 6, state.count);
await resetSidebar();

await setPrice('Цена от', '60000');
state = await catalogState();
check('catalog live: price from 60 000 → 3', countOf(state) === 3, state.count);
await resetSidebar();

for (const [label, expected] of [
  ['Со скидкой', 5],
  ['До 15 000 ₽', 2],
  ['15 000 – 30 000 ₽', 6],
  ['30 000 ₽ и выше', 8],
]) {
  await clickQuick(label);
  await sleep(150);
  state = await catalogState();
  check(`catalog live: quick «${label}» → ${expected}`, countOf(state) === expected, state.count);
}
const boundaries = await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card__title')].map((t) => t.textContent)`,
);
check(
  'catalog live: 30 000 belongs to «30 000 ₽ и выше»',
  boundaries.includes('POCO X6 256 ГБ, Чёрный'),
);
await clickQuick('15 000 – 30 000 ₽');
await sleep(150);
check(
  'catalog live: 15 000 belongs to the middle band',
  (
    await evaluate(
      `[...document.querySelectorAll('.catalog-grid .product-card__title')].map((t) => t.textContent)`,
    )
  ).includes('realme C67 128 ГБ, Зелёный'),
);

await toggleSidebar('Samsung');
await toggleColour('.catalog-page__sidebar', 'Золотой');
state = await catalogState();
check(
  'catalog live: empty state with no grid and no pagination',
  countOf(state) === 0 &&
    state.empty === 'Ничего не найдено' &&
    state.titles.length === 0 &&
    state.pages.length === 0,
  JSON.stringify(state),
);
await evaluate(`document.querySelector('.catalog-page__results .empty-state button').click()`);
await sleep(150);
state = await catalogState();
check(
  'catalog live: empty-state reset restores filters, quick chip and page',
  countOf(state) === 16 && state.current === '1' && state.quick[0][1] === 'true',
  JSON.stringify(state.quick),
);
await clickQuick('Со скидкой');
await toggleSidebar('Apple');
await resetSidebar();
state = await catalogState();
check(
  'catalog live: sidebar reset also resets the quick filter',
  countOf(state) === 16 && state.quick[0][1] === 'true',
);

await viewport(390, 844, true);
await go('#/catalog/smartphones');
await sleep(300);
await evaluate(`document.querySelector('.catalog-filter-trigger').click()`);
await waitFor(`document.querySelector('.catalog-filter-dialog')`, 'catalog dialog');
const dialog = await evaluate(`(() => ({
  legends: [...document.querySelectorAll('.catalog-filter-dialog legend')].map((l) => l.textContent),
  brands: [...document.querySelectorAll('.catalog-filter-dialog fieldset:first-of-type .catalog-filters__option')].map((o) => o.textContent.replace(/\\s/g, ' ')),
}))()`);
check(
  'catalog live mobile: dialog has the same live groups and options',
  !dialog.legends.includes('Серия') &&
    !dialog.legends.includes('Диагональ') &&
    JSON.stringify(dialog.brands.slice(0, 8)) === JSON.stringify(brandOptions.slice(0, 8)),
  JSON.stringify(dialog),
);
await evaluate(
  `${sidebarOption('.catalog-filter-dialog', 'Samsung')}.querySelector('input').click()`,
);
await sleep(100);
await evaluate(
  `[...document.querySelectorAll('.catalog-filter-dialog__action')].find((b) => b.textContent === 'Показать').click()`,
);
await sleep(250);
state = await catalogState();
check(
  'catalog live mobile: applying the dialog filters the results',
  countOf(state) === 2 &&
    (await evaluate(
      `document.documentElement.scrollWidth - document.documentElement.clientWidth`,
    )) <= 0,
  state.count,
);

await evaluate(`document.querySelector('.catalog-filter-trigger').click()`);
await waitFor(`document.querySelector('.catalog-filter-dialog')`, 'catalog dialog');
await expandColours('.catalog-filter-dialog');
const dialogColours = await colourFacet('.catalog-filter-dialog');
const dialogLayout = await evaluate(`(() => {
  const dialog = document.querySelector('.catalog-filter-dialog');
  const group = ${colourGroup('.catalog-filter-dialog')};
  const box = dialog.getBoundingClientRect();
  const clipped = [...group.querySelectorAll('.catalog-filters__swatch, .catalog-filters__colour-rows .ui-choice')].some((el) => {
    const rect = el.getBoundingClientRect();
    return rect.left < box.left - 0.5 || rect.right > box.right + 0.5 || rect.width === 0;
  });
  return { clipped, overflow: dialog.scrollWidth - dialog.clientWidth, page: document.documentElement.scrollWidth - document.documentElement.clientWidth };
})()`);
check(
  'catalog live mobile colour: dialog exposes the same live colours, swatches and fallback rows',
  JSON.stringify(dialogColours.swatches) === JSON.stringify(sidebarColours.swatches) &&
    JSON.stringify(dialogColours.rows) === JSON.stringify(sidebarColours.rows),
  JSON.stringify(dialogColours),
);
check(
  'catalog live mobile colour: no clipped colour controls, no horizontal overflow at 390',
  !dialogLayout.clipped && dialogLayout.overflow <= 0 && dialogLayout.page <= 0,
  JSON.stringify(dialogLayout),
);
await evaluate(
  `${sidebarOption('.catalog-filter-dialog', 'Samsung')}.querySelector('input').click()`,
);
await sleep(100);
await evaluate(
  `${sidebarOption('.catalog-filter-dialog', 'Натуральный титан')}.querySelector('input').click()`,
);
await sleep(100);
await evaluate(
  `[...document.querySelectorAll('.catalog-filter-dialog__action')].find((b) => b.textContent === 'Показать').click()`,
);
await sleep(250);
state = await catalogState();
check(
  'catalog live mobile colour: applying a non-palette colour filters the results',
  countOf(state) === 1 && state.titles[0] === 'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
  JSON.stringify(state.titles),
);
await clickQuick('Со скидкой');
await sleep(150);
await evaluate(`document.querySelector('.catalog-filter-trigger').click()`);
await waitFor(`document.querySelector('.catalog-filter-dialog')`, 'catalog dialog');
await evaluate(
  `[...document.querySelectorAll('.catalog-filter-dialog__action')].find((b) => b.textContent === 'Сбросить').click()`,
);
await sleep(100);
const draftCleared = await evaluate(
  `![...document.querySelectorAll('.catalog-filter-dialog input[type="checkbox"]')].some((i) => i.checked && !i.closest('.ui-choice')?.textContent.includes('Все бренды'))`,
);
await evaluate(
  `[...document.querySelectorAll('.catalog-filter-dialog__action')].find((b) => b.textContent === 'Показать').click()`,
);
await sleep(250);
state = await catalogState();
check(
  'catalog live mobile colour: dialog reset clears the colour draft; external quick chip stays as shown',
  draftCleared &&
    countOf(state) === 5 &&
    state.quick.find(([label]) => label === 'Со скидкой')[1] === 'true',
  `${state.count} ${JSON.stringify(state.quick)}`,
);
await viewport(1440, 900, false);
const CATALOG_HASH = '#/catalog/smartphones';
const urlQuery = () =>
  evaluate(
    `location.hash.includes('?') ? location.hash.slice(location.hash.indexOf('?') + 1) : ''`,
  );
const expectQuery = (entries) => new URLSearchParams(entries).toString();
const navIndex = () => evaluate(`navigation.currentEntry.index`);
const navLength = () => evaluate(`navigation.entries().length`);
const freshHistory = async () => {
  await send('Page.resetNavigationHistory', {});
  await sleep(100);
};
const goCatalog = async (query) => {
  await go(query === '' ? CATALOG_HASH : `${CATALOG_HASH}?${query}`);
  await sleep(150);
};
const appliedUi = () =>
  evaluate(`(() => {
    const sidebar = document.querySelector('.catalog-page__sidebar');
    const checked = [...sidebar.querySelectorAll('input[type="checkbox"]:checked')]
      .map((input) => {
        const label = input.closest('.ui-choice, .catalog-filters__swatch');
        return (label.querySelector('.catalog-filters__option-name') ?? label.querySelector('.ui-visually-hidden'))?.textContent.split(' (')[0];
      })
      .filter((label) => label !== 'Все бренды');
    return {
      checked,
      from: sidebar.querySelector('input[aria-label="Цена от: значение"]').value.replace(/\\s/g, ''),
      to: sidebar.querySelector('input[aria-label="Цена до: значение"]').value.replace(/\\s/g, ''),
      sort: document.querySelector('.catalog-page__sort').textContent,
    };
  })()`);
const pressedQuick = (state) => state.quick.find(([, pressed]) => pressed === 'true')?.[0];
const chooseSort = async (label) => {
  await evaluate(
    `document.querySelector('.catalog-page__sort').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))`,
  );
  await waitFor(`document.querySelector('.ui-select-content__item')`, 'sort options');
  await sleep(150);
  await evaluate(
    `[...document.querySelectorAll('.ui-select-content__item')].find((i) => i.textContent === ${JSON.stringify(label)}).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))`,
  );
  await sleep(250);
};
const clickPage = async (label) => {
  await evaluate(
    `[...document.querySelectorAll('.catalog-page__pagination .ui-pagination__item')].find((b) => b.textContent === ${JSON.stringify(label)}).click()`,
  );
  await sleep(200);
};

await goCatalog(
  'brand=Apple&brand=Samsung&memory=128&colour=%D0%9D%D0%B0%D1%82%D1%83%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D1%82%D0%B8%D1%82%D0%B0%D0%BD&colour=Розовый&rating=4.5&price_from=50000&price_to=200000&quick=over-30000&sort=cheap&page=3',
);
const directQuery = await urlQuery();
let urlState = await catalogState();
let ui = await appliedUi();
check(
  'catalog url: direct URL applies every param (Cyrillic + space colour, %20 form)',
  countOf(urlState) === 2 &&
    JSON.stringify(urlState.titles) ===
      JSON.stringify([
        'Apple iPhone 13 128 ГБ, Розовый',
        'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
      ]) &&
    JSON.stringify([...ui.checked].sort()) ===
      JSON.stringify(
        ['128 ГБ', 'Apple', 'Samsung', 'Натуральный титан', 'Розовый', 'Рейтинг 4,5 и выше'].sort(),
      ) &&
    ui.from === '50000' &&
    ui.to === '200000' &&
    ui.sort === 'Сначала дешевле' &&
    pressedQuick(urlState) === '30 000 ₽ и выше',
  JSON.stringify({ urlState, ui }),
);
check(
  'catalog url: out-of-range page renders clamped without rewriting the URL',
  urlState.pages.length === 0 && urlState.titles.length === 2 && (await urlQuery()) === directQuery,
  directQuery,
);

await reload();
await waitFor(
  `document.querySelector('.catalog-page__count')?.textContent.replace(/\\s/g, ' ') === '2 товара'`,
  'catalog url reload',
);
const reloadedState = await catalogState();
const reloadedUi = await appliedUi();
check(
  'catalog url: reload / shared link restores the same applied state',
  JSON.stringify(reloadedState.titles) === JSON.stringify(urlState.titles) &&
    JSON.stringify([...reloadedUi.checked].sort()) === JSON.stringify([...ui.checked].sort()) &&
    reloadedUi.sort === ui.sort &&
    reloadedUi.from === ui.from &&
    (await urlQuery()) === directQuery,
  JSON.stringify(reloadedUi),
);

for (const [query, expected, detail] of [
  ['sort=popular', { sort: 'Сначала популярные', count: 16 }],
  ['sort=cheap', { sort: 'Сначала дешевле', count: 16 }],
  ['sort=expensive', { sort: 'Сначала дороже', count: 16 }],
  ['sort=rating', { sort: 'По рейтингу', count: 16 }],
  ['sort=price-asc', { sort: 'Сначала популярные', count: 16 }],
  ['sort=price-desc', { sort: 'Сначала популярные', count: 16 }],
  ['sort=x', { sort: 'Сначала популярные', count: 16 }],
  ['quick=new', { quick: 'Все смартфоны', count: 16 }],
  ['quick=bestsellers', { quick: 'Все смартфоны', count: 16 }],
  ['quick=zzz', { quick: 'Все смартфоны', count: 16 }],
  ['quick=discounted', { quick: 'Со скидкой', count: 5 }],
  ['page=abc', { page: '1', count: 16 }],
  ['page=0', { page: '1', count: 16 }],
  ['page=-1', { page: '1', count: 16 }],
  ['page=1.5', { page: '1', count: 16 }],
  ['page=2', { page: '2', count: 16 }],
  ['brand=Nokia', { checked: [], count: 16 }],
  ['colour=Красный', { checked: [], count: 16 }],
  ['memory=64&memory=abc', { checked: [], count: 16 }],
  ['rating=5&rating=x', { checked: [], count: 16 }],
  ['price_from=abc&price_to=zzz', { from: '3000', to: '250000', count: 16 }],
  ['price_from=100', { from: '3000', count: 16 }],
  ['price_to=999999', { to: '250000', count: 16 }],
  ['price_from=60000&price_to=20000', { from: '20000', to: '60000', count: 7 }],
  ['price_from=20499', { from: '20000', count: 10 }],
  ['brand=Apple&brand=Apple', { checked: ['Apple'], count: 2 }],
]) {
  await goCatalog(query);
  const s = await catalogState();
  const u = await appliedUi();
  const ok =
    countOf(s) === expected.count &&
    (expected.sort === undefined || u.sort === expected.sort) &&
    (expected.quick === undefined || pressedQuick(s) === expected.quick) &&
    (expected.page === undefined || s.current === expected.page) &&
    (expected.checked === undefined ||
      JSON.stringify(u.checked) === JSON.stringify(expected.checked)) &&
    (expected.from === undefined || u.from === expected.from) &&
    (expected.to === undefined || u.to === expected.to) &&
    expectQuery(await urlQuery()) === expectQuery(query);
  check(
    `catalog url parse: ${query}`,
    ok,
    `${detail ?? ''} ${JSON.stringify({ s: s.count, current: s.current, u })}`,
  );
}

await goCatalog(
  'utm=keep&brand=Nokia&brand=Apple&colour=%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9&memory=64&rating=5&rating=4.5&price_from=abc&price_to=999999&quick=new&sort=price-asc&page=1.5',
);
check(
  'catalog url: combined invalid URL resolves to valid values only',
  countOf(await catalogState()) === 2,
);
await freshHistory();
await clickQuick('Со скидкой');
await sleep(200);
check(
  'catalog url: next write cleans invalid Catalog params and preserves the unrelated key',
  (await urlQuery()) ===
    expectQuery([
      ['utm', 'keep'],
      ['brand', 'Apple'],
      ['rating', '4.5'],
      ['quick', 'discounted'],
    ]) && countOf(await catalogState()) === 1,
  await urlQuery(),
);

await goCatalog('utm=keep');
await freshHistory();
const startIndex = await navIndex();
await toggleSidebar('Samsung');
const afterBrand = [await urlQuery(), await navIndex()];
await toggleSidebar('Apple');
await toggleSidebar('Натуральный титан');
await clickQuick('Со скидкой');
await sleep(150);
await chooseSort('Сначала дороже');
const serialized = await urlQuery();
check(
  'catalog url: UI writes a minimal, ordered query with repeated keys and + for spaces',
  afterBrand[0] ===
    expectQuery([
      ['utm', 'keep'],
      ['brand', 'Samsung'],
    ]) &&
    serialized ===
      expectQuery([
        ['utm', 'keep'],
        ['brand', 'Samsung'],
        ['brand', 'Apple'],
        ['colour', 'Натуральный титан'],
        ['quick', 'discounted'],
        ['sort', 'expensive'],
      ]) &&
    serialized.includes('+') &&
    countOf(await catalogState()) === 1,
  serialized,
);
check(
  'catalog url: checkbox, quick chip and sort each push exactly one history entry',
  afterBrand[1] === startIndex + 1 && (await navIndex()) === startIndex + 5,
  `${startIndex} ${afterBrand[1]} ${await navIndex()}`,
);

await resetSidebar();
check(
  'catalog url: sidebar reset clears filters, quick and page but keeps the non-default sort',
  (await urlQuery()) ===
    expectQuery([
      ['utm', 'keep'],
      ['sort', 'expensive'],
    ]) &&
    countOf(await catalogState()) === 16 &&
    (await appliedUi()).sort === 'Сначала дороже',
  await urlQuery(),
);

await goCatalog('');
check(
  'catalog url: default state emits no Catalog params',
  (await urlQuery()) === '' &&
    countOf(await catalogState()) === 16 &&
    !(await evaluate(`location.hash.includes('?')`)),
);
await freshHistory();
await toggleSidebar('Samsung');
await toggleSidebar('Samsung');
check(
  'catalog url: toggling back to defaults omits quick=all, sort=popular, page=1, price and empty lists',
  (await urlQuery()) === '',
  await urlQuery(),
);

const pageResetCases = [
  ['brand checkbox', async () => toggleSidebar('Apple'), 'push'],
  ['price input', async () => setPrice('Цена от', '5000'), 'replace'],
  ['quick chip', async () => clickQuick('До 15 000 ₽'), 'push'],
  ['sort', async () => chooseSort('По рейтингу'), 'push'],
];
for (const [label, action, mode] of pageResetCases) {
  await goCatalog('page=2');
  await freshHistory();
  const before = await navIndex();
  await action();
  await sleep(200);
  const query = await urlQuery();
  const after = await navIndex();
  check(
    `catalog url: ${label} removes page and uses ${mode}`,
    !new URLSearchParams(query).has('page') &&
      query !== '' &&
      after === (mode === 'push' ? before + 1 : before),
    `${query} ${before}→${after}`,
  );
}
await goCatalog('page=2&quick=discounted&sort=rating');
await freshHistory();
await resetSidebar();
check(
  'catalog url: reset from page 2 removes page and quick, keeps sort',
  (await urlQuery()) === expectQuery([['sort', 'rating']]),
  await urlQuery(),
);
await goCatalog(
  'sort=rating&brand=Samsung&colour=%D0%97%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B9&quick=discounted',
);
await evaluate(`document.querySelector('.catalog-page__results .empty-state button').click()`);
await sleep(200);
check(
  'catalog url: empty-state reset keeps the non-default sort',
  (await urlQuery()) === expectQuery([['sort', 'rating']]) && countOf(await catalogState()) === 16,
  await urlQuery(),
);

await goCatalog('');
await freshHistory();
const pageIndex = await navIndex();
await clickPage('2');
check(
  'catalog url: pagination pushes page=2, and page 1 removes it',
  (await urlQuery()) === 'page=2' && (await navIndex()) === pageIndex + 1,
  await urlQuery(),
);
await clickPage('1');
check(
  'catalog url: page 1 is omitted',
  (await urlQuery()) === '' && (await navIndex()) === pageIndex + 2,
);

await goCatalog('');
await freshHistory();
const sliderIndex = await navIndex();
await evaluate(`document.querySelector('.catalog-page__sidebar [role="slider"]').focus()`);
for (let step = 0; step < 6; step += 1) {
  await evaluate(
    `document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))`,
  );
  await sleep(60);
}
await sleep(200);
check(
  'catalog url: six slider steps replace in place (no history spam)',
  (await urlQuery()) === 'price_from=9000' &&
    (await navIndex()) === sliderIndex &&
    (await navLength()) === 1,
  `${await urlQuery()} ${await navIndex()} ${await navLength()}`,
);

await goCatalog('');
await freshHistory();
await toggleSidebar('Apple');
await chooseSort('Сначала дешевле');
await clickQuick('Со скидкой');
await sleep(150);
const historyLength = await navLength();
await evaluate('history.back()');
await sleep(400);
urlState = await catalogState();
ui = await appliedUi();
check(
  'catalog url: Back restores the previous applied state from the URL',
  (await urlQuery()) ===
    expectQuery([
      ['brand', 'Apple'],
      ['sort', 'cheap'],
    ]) &&
    JSON.stringify(urlState.titles) ===
      JSON.stringify([
        'Apple iPhone 13 128 ГБ, Розовый',
        'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
      ]) &&
    pressedQuick(urlState) === 'Все смартфоны' &&
    ui.sort === 'Сначала дешевле' &&
    JSON.stringify(ui.checked) === JSON.stringify(['Apple']),
  JSON.stringify({ q: await urlQuery(), urlState, ui }),
);
await evaluate('history.back()');
await sleep(400);
ui = await appliedUi();
check(
  'catalog url: second Back restores popular sort',
  (await urlQuery()) === 'brand=Apple' && ui.sort === 'Сначала популярные',
  await urlQuery(),
);
await evaluate('history.forward()');
await sleep(400);
await sleep(200);
check(
  'catalog url: Forward restores cheap sort without synthetic history writes',
  (await urlQuery()) ===
    expectQuery([
      ['brand', 'Apple'],
      ['sort', 'cheap'],
    ]) &&
    (await appliedUi()).sort === 'Сначала дешевле' &&
    (await navLength()) === historyLength,
  `${await urlQuery()} ${await navLength()}/${historyLength}`,
);

await goCatalog('');
await freshHistory();
await setPrice('Цена от', '12000');
await chooseSort('Сначала дешевле');
await clickPage('2');
const beforePdp = await urlQuery();
const beforePdpState = await catalogState();
await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card')].find((c) => c.querySelector('.product-card__title')?.textContent === 'Apple iPhone 15 Pro 128 ГБ, Натуральный титан').querySelector('.product-card__title a').click()`,
);
await waitFor(`location.hash.startsWith('#/product/')`, 'catalog → PDP');
await sleep(600);
const pdpHash = await evaluate('location.hash');
await evaluate('history.back()');
await waitFor(`location.hash.startsWith('#/catalog/smartphones')`, 'PDP → catalog');
await waitFor(
  `document.querySelector('.catalog-page__count')?.textContent.replace(/\\s/g, ' ').startsWith('16 ')`,
  'catalog live after Back',
);
await sleep(300);
const afterPdpState = await catalogState();
const afterPdpUi = await appliedUi();
check(
  'catalog url: Catalog → PDP → Back restores filters, sort, page and results',
  beforePdp ===
    expectQuery([
      ['price_from', '12000'],
      ['sort', 'cheap'],
      ['page', '2'],
    ]) &&
    pdpHash === '#/product/iphone-15-pro-128' &&
    (await urlQuery()) === beforePdp &&
    afterPdpState.current === '2' &&
    JSON.stringify(afterPdpState.titles) === JSON.stringify(beforePdpState.titles) &&
    afterPdpUi.from === '12000' &&
    afterPdpUi.sort === 'Сначала дешевле',
  JSON.stringify({ beforePdp, pdpHash, after: await urlQuery(), afterPdpState }),
);

await viewport(390, 844, true);
await goCatalog('page=2');
await freshHistory();
const dialogIndex = await navIndex();
await evaluate(`document.querySelector('.catalog-filter-trigger').click()`);
await waitFor(`document.querySelector('.catalog-filter-dialog')`, 'catalog dialog');
await evaluate(
  `${sidebarOption('.catalog-filter-dialog', 'Samsung')}.querySelector('input').click()`,
);
await sleep(100);
const draftQuery = await urlQuery();
await evaluate(
  `[...document.querySelectorAll('.catalog-filter-dialog__action')].find((b) => b.textContent === 'Сбросить').click()`,
);
await sleep(100);
const resetDraftQuery = await urlQuery();
await evaluate(
  `${sidebarOption('.catalog-filter-dialog', 'Apple')}.querySelector('input').click()`,
);
await sleep(100);
await evaluate(
  `[...document.querySelectorAll('.catalog-filter-dialog__action')].find((b) => b.textContent === 'Показать').click()`,
);
await sleep(300);
check(
  'catalog url mobile: dialog draft and draft reset do not write the URL; Показать writes once and drops page',
  draftQuery === 'page=2' &&
    resetDraftQuery === 'page=2' &&
    (await urlQuery()) === 'brand=Apple' &&
    (await navIndex()) === dialogIndex + 1 &&
    countOf(await catalogState()) === 2,
  `${draftQuery} ${resetDraftQuery} ${await urlQuery()} ${await navIndex()}`,
);
await clickQuick('Со скидкой');
await sleep(200);
await evaluate(`document.querySelector('.catalog-filter-trigger').click()`);
await waitFor(`document.querySelector('.catalog-filter-dialog')`, 'catalog dialog');
await evaluate(
  `[...document.querySelectorAll('.catalog-filter-dialog__action')].find((b) => b.textContent === 'Сбросить').click()`,
);
await sleep(100);
await evaluate(
  `[...document.querySelectorAll('.catalog-filter-dialog__action')].find((b) => b.textContent === 'Показать').click()`,
);
await sleep(300);
urlState = await catalogState();
check(
  'catalog url mobile: dialog reset + Показать keeps the external quick chip and pushes once',
  (await urlQuery()) === 'quick=discounted' &&
    countOf(urlState) === 5 &&
    pressedQuick(urlState) === 'Со скидкой' &&
    (await navIndex()) === dialogIndex + 3 &&
    (await evaluate(
      `document.documentElement.scrollWidth - document.documentElement.clientWidth`,
    )) <= 0,
  `${await urlQuery()} ${await navIndex()}`,
);
await viewport(1440, 900, false);
await goCatalog('');

failLive = true;
await reload();
await go(`${CATALOG_HASH}?brand=Apple&quick=discounted&sort=cheap&page=3`);
await sleep(1500);
urlState = await catalogState();
check(
  'catalog url: specimen fallback ignores Catalog params and leaves the URL untouched',
  urlState.count === '2 546 товаров' &&
    pressedQuick(urlState) === 'Все смартфоны' &&
    urlState.quick.length === 7 &&
    (await appliedUi()).sort === 'Сначала популярные' &&
    (await urlQuery()) === 'brand=Apple&quick=discounted&sort=cheap&page=3',
  JSON.stringify(urlState),
);
failLive = false;
await go(CATALOG_HASH);
catalogRows = false;
await reload();

const i15Row = PRODUCTS.find((product) => product.slug === 'iphone-15-128');
const i15LiveOldPrice = i15Row.old_price;
const fixtureBadge = (slug) => CATALOG_PRODUCTS.find((product) => product.id === slug).badge;
const catalogBadges = () =>
  evaluate(
    `Object.fromEntries([...document.querySelectorAll('.catalog-grid .product-card')].map((c) => [c.querySelector('.product-card__title').textContent, c.querySelector('.catalog-badge') ? [c.querySelector('.catalog-badge').textContent, c.querySelector('.catalog-badge').className] : null]))`,
  );
const searchRowBadges = () =>
  evaluate(
    `Object.fromEntries([...document.querySelectorAll('.search-row')].map((r) => [r.querySelector('.search-row__title').textContent, r.querySelector('.search-row__badge .ui-chip') ? [r.querySelector('.search-row__badge .ui-chip').textContent, r.querySelector('.search-row__badge .ui-chip').className] : null]))`,
  );
const searchCardBadges = () =>
  evaluate(
    `Object.fromEntries([...document.querySelectorAll('.search-results .product-card')].map((c) => [c.querySelector('.product-card__title').textContent, c.querySelector('.product-card__badge .ui-chip') ? [c.querySelector('.product-card__badge .ui-chip').textContent, c.querySelector('.product-card__badge .ui-chip').className] : null]))`,
  );
const openLiveCatalog = async () => {
  await go(CATALOG_HASH);
  await waitFor(
    `document.querySelector('.catalog-page__count')?.textContent.replace(/\s/g, ' ') === ${JSON.stringify(formatUnitCount(PRODUCTS.length).replace(/\s/g, ' '))}`,
    'live catalog for badges',
  );
};
const openPdpBadge = async () => {
  await go('#/product/iphone-15-128');
  await waitFor(
    `document.querySelector('.product-purchase .product-details-badge')?.textContent.startsWith('-')`,
    'pdp sale badge',
  );
  return evaluate(
    `document.querySelector('.product-purchase .product-details-badge')?.textContent ?? null`,
  );
};

i15Row.old_price = 89990;
await reload();
const pdpBadge = await openPdpBadge();
await openLiveCatalog();
let liveCatalogBadges = await catalogBadges();
await go('#/search?q=iphone');
await waitFor(`document.querySelector('.search-row__link')`, 'live search rows for badges');
const liveSearchRows = await searchRowBadges();
await evaluate(`${rowOf(I15)}.querySelector('.product-action--cart').click()`);
await sleep(150);
await go('#/cart');
await waitFor(`document.querySelector('.cart-line__discount .ui-chip')`, 'cart discount chip');
const cartBadge = await evaluate(
  `document.querySelector('.cart-line__discount .ui-chip').textContent`,
);
await viewport(390, 844, true);
await go('#/search?q=iphone');
await waitFor(`${cardOf(I15)}`, 'live search cards for badges');
const liveSearchCards = await searchCardBadges();
await viewport(1440, 900, false);
check(
  'sale badge: changed live old_price → PDP, Catalog, Search rows, Search cards and Cart agree',
  pdpBadge === '-11%' &&
    pdpBadge !== fixtureBadge('iphone-15-128') &&
    liveCatalogBadges[I15]?.[0] === pdpBadge &&
    liveSearchRows[I15]?.[0] === pdpBadge &&
    liveSearchCards[I15]?.[0] === pdpBadge &&
    cartBadge === pdpBadge,
  JSON.stringify({
    pdpBadge,
    catalog: liveCatalogBadges[I15],
    rows: liveSearchRows[I15],
    cards: liveSearchCards[I15],
    cartBadge,
  }),
);
check(
  'sale badge: derived sale keeps the sale tone on Catalog and Search',
  liveCatalogBadges[I15]?.[1].includes('catalog-badge--sale') &&
    liveSearchRows[I15]?.[1].includes('ui-chip--danger') &&
    liveSearchCards[I15]?.[1].includes('ui-chip--danger'),
);
check(
  'sale badge: Новинка preserved on Catalog and Search despite a live old_price',
  fixtureBadge('iphone-15-pro-128') === 'Новинка' &&
    liveCatalogBadges[I15PRO]?.[0] === 'Новинка' &&
    liveCatalogBadges[I15PRO]?.[1].includes('catalog-badge--new') &&
    liveSearchRows[I15PRO]?.[0] === 'Новинка' &&
    liveSearchRows[I15PRO]?.[1].includes('ui-chip--brand') &&
    liveSearchCards[I15PRO]?.[0] === 'Новинка',
  JSON.stringify([liveCatalogBadges[I15PRO], liveSearchRows[I15PRO]]),
);
check(
  'sale badge: products without a sale presentation get no fabricated badge',
  liveCatalogBadges['Samsung Galaxy S24 256 ГБ, Фиолетовый'] === null &&
    liveSearchRows['Apple iPhone 14 128 ГБ, Цвет 1'] === null,
);

i15Row.old_price = null;
await clearCart();
await openLiveCatalog();
liveCatalogBadges = await catalogBadges();
await go('#/search?q=iphone');
await waitFor(`document.querySelector('.search-row__link')`, 'live search rows without old price');
const noOldPriceRows = await searchRowBadges();
await goCatalog('quick=discounted');
await sleep(300);
const discountedTitles = await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card__title')].map((t) => t.textContent)`,
);
check(
  'sale badge: no valid live old_price → no sale percentage fabricated (Catalog, Search)',
  liveCatalogBadges[I15] === null && noOldPriceRows[I15] === null,
  JSON.stringify([liveCatalogBadges[I15], noOldPriceRows[I15]]),
);
check(
  'discounted quick filter: still price-based (old_price > price), unchanged semantics',
  JSON.stringify(discountedTitles) === JSON.stringify([I15PRO]),
  JSON.stringify(discountedTitles),
);

i15Row.old_price = i15LiveOldPrice;
await go(CATALOG_HASH);
await reload();
await openLiveCatalog();
liveCatalogBadges = await catalogBadges();
check(
  'sale badge: snapshot old_price restores the derived -6% (matches PDP semantics)',
  liveCatalogBadges[I15]?.[0] === (await openPdpBadge()),
  JSON.stringify(liveCatalogBadges[I15]),
);
await go('#/');
await sleep(400);
const placeholders = {};
for (const [width, height, mobile] of [
  [1440, 900, false],
  [390, 844, true],
]) {
  await viewport(width, height, mobile);
  placeholders[width] = await evaluate(
    `document.querySelector('.site-header__search input')?.getAttribute('placeholder') ?? null`,
  );
}
await viewport(1440, 900, false);
check(
  'header: production search placeholder «Поиск товаров» at 1440 and 390',
  placeholders[1440] === 'Поиск товаров' && placeholders[390] === 'Поиск товаров',
  JSON.stringify(placeholders),
);
await evaluate(
  `(() => { const input = document.querySelector('.site-header__search input'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(input, 'pixel'); input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); })()`,
);
await sleep(500);
check(
  'header: production search submit still routes to #/search?q=…',
  (await evaluate(`location.hash`)) === '#/search?q=pixel',
  await evaluate(`location.hash`),
);
await send('Page.navigate', { url: `${BASE}?reference=catalog` });
await sleep(1500);
check(
  'header: reference SiteHeader keeps its default desktop placeholder',
  (await evaluate(
    `document.querySelector('.site-header__search input')?.getAttribute('placeholder') ?? null`,
  )) === 'Поиск среди 50 000+ товаров',
);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);

failLive = true;
await reload();
await go('#/search?q=iphone');
await sleep(1500);
check(
  'E fallback: fixture results render (desktop rows)',
  (await evaluate(`document.querySelectorAll('.search-row').length`)) > 0 &&
    (await evaluate(`document.querySelectorAll('.search-row__link').length`)) === 0,
);
check(
  'E fallback: row add natively disabled, no stepper',
  await evaluate(
    `[...document.querySelectorAll('.search-row .product-action--cart')].every((b) => b.disabled) && document.querySelectorAll('.search-row .ui-stepper').length === 0`,
  ),
);
await evaluate(`document.querySelector('.search-row .product-action--cart').click()`);
await sleep(150);
check('E fallback: click → no cart mutation', (await stored()) === null && (await badge()) === '0');
await viewport(390, 844, true);
await go('#/search?q=iphone');
await sleep(600);
check(
  'E fallback: mobile card add disabled, no stepper',
  await evaluate(
    `document.querySelectorAll('.search-results .product-card__cart').length > 0 && [...document.querySelectorAll('.search-results .product-card__cart')].every((b) => b.disabled) && document.querySelectorAll('.search-results .ui-stepper').length === 0`,
  ),
);
check(
  'unrelated localStorage untouched',
  (await evaluate(`localStorage.getItem('goodcall.verify.marker')`)) === 'keep',
);
await evaluate(`localStorage.removeItem('goodcall.verify.marker')`);
check('no uncaught errors', consoleErrors.length === 0, consoleErrors.join(' ; '));

await cdp.close();
await browser.close();
report(results);

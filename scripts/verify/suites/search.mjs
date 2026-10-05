import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';

const OUT = outputDir();
const BASE = appBase();
const MOCK_HOST = 'mock-goodcall.supabase.co';
const KEY = 'goodcall.cart.v1';
const results = [];
let failLive = false;

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

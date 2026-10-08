import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';

const OUT = outputDir();
const BASE = appBase();
const MOCK_HOST = 'mock-goodcall.supabase.co';
const FAV = 'goodcall.favorites.v1';
const CART = 'goodcall.cart.v1';
const results = [];
let failLive = false;

const row = (slug, name, price, oldPrice, pop) => ({
  id: `id-${slug}`,
  category_id: 'cat-smartphones',
  slug,
  name,
  brand: name.split(' ')[0],
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
  row('iphone-15-pro-128', 'Apple iPhone 15 Pro 128 ГБ, Натуральный титан', 109990, 124990, 100),
  row('iphone-15-128', 'Apple iPhone 15 128 ГБ, Розовый', 79990, 84990, 99),
  row('galaxy-s24-256', 'Samsung Galaxy S24 256 ГБ, Фиолетовый', 75990, null, 98),
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
  return accept.includes('vnd.pgrst.object') ? (rows[0] ?? null) : rows;
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
const favBadge = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/favorites"] .site-header__badge')?.textContent ?? null`,
  );
const favName = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/favorites"]')?.getAttribute('aria-label') ?? null`,
  );
const cartBadge = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/cart"] .site-header__badge')?.textContent ?? null`,
  );
const compareBadge = () =>
  evaluate(
    `[...document.querySelectorAll('.site-header__action')].find((a) => a.textContent.includes('Сравнение'))?.querySelector('.site-header__badge')?.textContent ?? null`,
  );
const favItems = () =>
  evaluate(`JSON.parse(localStorage.getItem('${FAV}') ?? '{"items":[]}').items`);
const cartLines = () =>
  evaluate(
    `JSON.parse(localStorage.getItem('${CART}') ?? '{"lines":[]}').lines.map((l) => l.id + ':' + l.quantity)`,
  );
const overflow = () =>
  evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
const I15 = 'Apple iPhone 15 128 ГБ, Розовый';
const PRO = 'Apple iPhone 15 Pro 128 ГБ, Натуральный титан';
const GAL = 'Samsung Galaxy S24 256 ГБ, Фиолетовый';
const catalogHeart = (t) =>
  `[...document.querySelectorAll('.catalog-grid .product-card')].find((c) => c.querySelector('.product-card__title')?.textContent === ${JSON.stringify(t)})?.querySelector('.product-card__favorite')`;
const favCard = (t) =>
  `[...document.querySelectorAll('.favorites-grid .product-card')].find((c) => c.querySelector('.product-card__title')?.textContent === ${JSON.stringify(t)})`;
const favStatus = () =>
  evaluate(`document.querySelector('main.favorites-page > p[role="status"]')?.textContent ?? ''`);

await send('Runtime.enable');
await send('Page.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: `*${MOCK_HOST}*` }] });
await viewport(1440, 900, false);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);
await evaluate(
  `localStorage.removeItem('${FAV}'); localStorage.removeItem('${CART}'); localStorage.setItem('goodcall.verify.marker', 'keep')`,
);
await reload();

check(
  'shell: fresh favourites count 0',
  (await favBadge()) === '0' && (await favName()) === 'Избранное: 0',
  `${await favBadge()} / ${await favName()}`,
);
const compareBeforeFavorites = await compareBadge();
check(
  'shell: favourites link is #/favorites',
  await evaluate(`Boolean(document.querySelector('.site-header__action[href="#/favorites"]'))`),
);

await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'live catalog');
check(
  'catalog: live hearts enabled',
  await evaluate(
    `[...document.querySelectorAll('.catalog-grid .product-card__favorite')].every((b) => !b.disabled)`,
  ),
);
await evaluate(`${catalogHeart(I15)}.click()`);
await sleep(120);
check(
  'catalog: ♥ on → aria-pressed true + remove label',
  await evaluate(
    `${catalogHeart(I15)}.getAttribute('aria-pressed') === 'true' && ${catalogHeart(I15)}.getAttribute('aria-label') === 'Убрать из избранного: ${I15}'`,
  ),
);
check('catalog: shell count 1', (await favBadge()) === '1');
await evaluate(`${catalogHeart(PRO)}.click()`);
await sleep(120);
check('catalog: second ♥ → count 2', (await favBadge()) === '2');
const compareAfterFavorites = await compareBadge();
check(
  'shell: favourite actions do not change the comparison count',
  compareBeforeFavorites !== null && compareAfterFavorites === compareBeforeFavorites,
  `${compareBeforeFavorites} → ${compareAfterFavorites}`,
);
await reload();
await waitFor(`document.querySelector('.product-card__link')`, 'catalog reload');
check(
  'persistence: reload keeps both pressed, count 2',
  (await favBadge()) === '2' &&
    (await evaluate(
      `${catalogHeart(I15)}.getAttribute('aria-pressed') === 'true' && ${catalogHeart(PRO)}.getAttribute('aria-pressed') === 'true'`,
    )),
);
const catalogImg = await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card')].find((c) => c.querySelector('.product-card__title')?.textContent === ${JSON.stringify(I15)}).querySelector('img').getAttribute('src')`,
);

await go('#/favorites');
await waitFor(`document.querySelector('.favorites-grid')`, 'favorites grid');
const order = await evaluate(
  `[...document.querySelectorAll('.favorites-grid .product-card__title')].map((t) => t.textContent)`,
);
check(
  'page: newest first order',
  JSON.stringify(order) === JSON.stringify([PRO, I15]),
  JSON.stringify(order),
);
const i15Card = await evaluate(
  `(() => { const c = ${favCard(I15)}; return [c.querySelector('.product-price').textContent.replace(/\\s/g, ''), c.querySelector('.product-price-old')?.textContent.replace(/\\s/g, ''), c.querySelector('img').getAttribute('src').includes('product-details-gallery-pink-hero-front-gallery'), c.querySelector('.product-card__favorite').getAttribute('aria-pressed'), Boolean(c.querySelector('.product-rating'))].join('|'); })()`,
);
check(
  'page: same title/price/old, fallback item renders local hero, ♥ pressed, no rating',
  i15Card === '79990₽|84990₽|true|true|false',
  i15Card,
);
check(
  'catalog: covered product uses local hero thumbnail',
  catalogImg.includes('product-details-gallery-pink-hero-front-gallery'),
  catalogImg,
);
check(
  'page: h1 + count chip "2 товара" + lead',
  await evaluate(
    `document.querySelectorAll('h1').length === 1 && document.querySelector('.favorites-page__title-row')?.textContent.includes('2 товара') && document.querySelector('.favorites-page__lead')?.textContent === 'Товары, которые вы добавили в избранное.'`,
  ),
);
check(
  'page: ul aria-label + li items',
  await evaluate(
    `document.querySelector('ul.favorites-grid')?.getAttribute('aria-label') === 'Товары в избранном' && document.querySelectorAll('ul.favorites-grid > li').length === 2`,
  ),
);
check(
  'page: I15 card links to product (specimen)',
  await evaluate(
    `${favCard(I15)}.querySelector('.product-card__link')?.getAttribute('href') === '#/product/iphone-15-128'`,
  ),
);

await evaluate(`${favCard(I15)}.querySelector('.product-card__link').click()`);
await waitFor(
  `document.querySelector('h1')?.textContent === ${JSON.stringify(I15)} && document.querySelector('.product-gallery__favorite')`,
  'pd',
);
check(
  'Favorites link opens the canonical PD',
  (await evaluate(`location.hash`)) === '#/product/iphone-15-128',
);
check(
  'PD: ♥ pressed for Catalog favourite',
  (await evaluate(
    `document.querySelector('.product-gallery__favorite').getAttribute('aria-pressed')`,
  )) === 'true',
);
check(
  'PD: production has no colour/memory controls; ♥ stays pressed, one entry per canonical slug',
  (await evaluate(`document.querySelectorAll('main input[type=radio]').length`)) === 0 &&
    (await evaluate(
      `document.querySelector('.product-gallery__favorite').getAttribute('aria-pressed')`,
    )) === 'true' &&
    (await favItems()).filter((i) => i.slug === 'iphone-15-128').length === 1,
);
await evaluate(`document.querySelector('.product-gallery__favorite').click()`);
await sleep(120);
check('PD: ♥ off → count 1', (await favBadge()) === '1');
await go('#/catalog/smartphones');
await waitFor(`${catalogHeart(I15)}`, 'catalog 2');
check(
  'Catalog reflects PD removal',
  (await evaluate(`${catalogHeart(I15)}.getAttribute('aria-pressed')`)) === 'false',
);
await go('#/product/iphone-15-128');
await waitFor(`document.querySelector('.product-gallery__favorite')`, 'pd 2');
await evaluate(`document.querySelector('.product-gallery__favorite').click()`);
await sleep(120);
const pdItem = (await favItems())[0];
check(
  'PD: ♥ on persists live product name + listing image (not variant)',
  pdItem.slug === 'iphone-15-128' &&
    pdItem.title === I15 &&
    pdItem.image.kind === 'catalog-fallback' &&
    pdItem.price === 79990 &&
    pdItem.oldPrice === 84990,
  JSON.stringify(pdItem),
);

await go('#/favorites');
await waitFor(`${favCard(I15)}`, 'fav i15');
await evaluate(`${favCard(I15)}.querySelector('.product-card__cart').click()`);
await sleep(150);
check(
  'fav→cart: stepper 1, cart badge 1',
  (await evaluate(`${favCard(I15)}.querySelector('.ui-stepper output')?.textContent`)) === '1' &&
    (await cartBadge()) === '1',
);
check(
  'fav→cart: announcement',
  (await favStatus()).includes(`Товар добавлен в корзину: ${I15}`),
  await favStatus(),
);
await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'catalog 3');
await evaluate(`document.querySelector('button[aria-label="В корзину: ${I15}"]').click()`);
await sleep(120);
await go('#/search?q=iphone 15 128');
await waitFor(`document.querySelector('.search-row')`, 'search');
await evaluate(
  `[...document.querySelectorAll('.search-row')].find((r) => r.querySelector('.search-row__title').textContent === ${JSON.stringify(I15)}).querySelector('.product-action--cart').click()`,
);
await sleep(120);
check(
  'fav→cart: Catalog + Search merge into one line qty 3',
  JSON.stringify(await cartLines()) === JSON.stringify(['iphone-15-128:3']),
  JSON.stringify(await cartLines()),
);
check('fav→cart: favourite remains after cart adds', (await favBadge()) === '2');
await go('#/favorites');
await waitFor(`${favCard(I15)}`, 'fav i15 2');
check(
  'page: stepper reflects shared cart qty 3',
  (await evaluate(`${favCard(I15)}.querySelector('.ui-stepper output')?.textContent`)) === '3',
);

await evaluate(
  `(() => { const b = ${favCard(PRO)}.querySelector('.product-card__favorite'); b.focus(); b.click(); })()`,
);
await sleep(200);
check(
  'page remove: count 1, announcement, focus → h1',
  (await favBadge()) === '1' &&
    (await favStatus()) === `Товар удалён из избранного: ${PRO}` &&
    (await evaluate(`document.activeElement?.id`)) === 'favorites-title',
  `focus=${await evaluate(`document.activeElement?.id`)}`,
);
await evaluate(
  `(() => { const b = ${favCard(I15)}.querySelector('.product-card__favorite'); b.focus(); b.click(); })()`,
);
await sleep(200);
const empty = await evaluate(
  `(() => { const e = document.querySelector('.favorites-empty'); return e && [e.querySelector('h2').textContent, e.querySelector('.empty-state__message').textContent, [...e.querySelectorAll('a')].map((a) => a.getAttribute('href') + '=' + a.textContent).join(',')].join('|'); })()`,
);
check(
  'empty: state, copy and links',
  empty ===
    'В избранном пока пусто|Нажимайте ♥ на карточках товаров, чтобы сохранить их здесь.|#/catalog/smartphones=Перейти в каталог,#/=На главную',
  empty,
);
check(
  'empty: no chip/lead, h1 kept, focus → h1, count 0',
  (await evaluate(
    `!document.querySelector('.favorites-page__title-row .ui-chip') && !document.querySelector('.favorites-page__lead') && document.querySelector('h1').textContent === 'Избранное' && document.activeElement?.id === 'favorites-title'`,
  )) && (await favBadge()) === '0',
);
check(
  'empty: cart unaffected by favourite removal',
  JSON.stringify(await cartLines()) === JSON.stringify(['iphone-15-128:3']),
);
await evaluate(`document.querySelector('.favorites-empty a').click()`);
await sleep(400);
check(
  'empty: catalog link navigates',
  (await evaluate(`location.hash`)) === '#/catalog/smartphones',
);

const cartBefore = await evaluate(`localStorage.getItem('${CART}')`);
const valid2 = JSON.stringify({
  items: [
    { slug: 'galaxy-s24-256', title: GAL, image: { kind: 'catalog-fallback' }, price: 75990 },
    {
      slug: 'iphone-15-128',
      title: I15,
      image: { kind: 'catalog-fallback' },
      price: 79990,
      oldPrice: 84990,
    },
  ],
});
await evaluate(`localStorage.setItem('${FAV}', ${JSON.stringify(valid2)})`);
await reload();
await go('#/favorites');
await waitFor(`document.querySelector('.favorites-grid')`, 'valid restore');
check(
  'storage: valid v1 restores stored order',
  JSON.stringify(
    await evaluate(
      `[...document.querySelectorAll('.favorites-grid .product-card__title')].map((t) => t.textContent)`,
    ),
  ) === JSON.stringify([GAL, I15]),
);
const bad = {
  'malformed JSON': '{bad',
  'wrong shape': '{"lines":[]}',
  'duplicate slug': JSON.stringify({
    items: [
      { slug: 'x', title: 'X', image: { kind: 'catalog-fallback' }, price: 1 },
      { slug: 'x', title: 'X', image: { kind: 'catalog-fallback' }, price: 1 },
    ],
  }),
  'malformed item': JSON.stringify({
    items: [
      { slug: 'x', title: 'X', image: { kind: 'product-details', colourId: 'pink' }, price: -1 },
    ],
  }),
};
for (const [label, value] of Object.entries(bad)) {
  await evaluate(`localStorage.setItem('${FAV}', ${JSON.stringify(value)})`);
  await reload();
  await sleep(300);
  check(
    `storage: ${label} → empty, key cleared, no crash`,
    (await favBadge()) === '0' && (await evaluate(`localStorage.getItem('${FAV}')`)) === null,
  );
}
check(
  'storage: cart key untouched by favourites',
  (await evaluate(`localStorage.getItem('${CART}')`)) === cartBefore,
);
check(
  'storage: unrelated key untouched',
  (await evaluate(`localStorage.getItem('goodcall.verify.marker')`)) === 'keep',
);

await evaluate(`localStorage.removeItem('${CART}')`);
await reload();
await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'catalog regress');
await evaluate(`document.querySelector('button[aria-label="В корзину: ${PRO}"]').click()`);
await sleep(120);
check('regression: Catalog cart add → stepper + badge 1', (await cartBadge()) === '1');
for (const t of [I15, PRO, GAL]) {
  await evaluate(`${catalogHeart(t)}.click()`);
  await sleep(80);
}
await go('#/product/iphone-15-128');
await waitFor(`document.querySelector('.product-purchase__cart')`, 'pd cart');
await evaluate(`document.querySelector('.product-purchase__cart').click()`);
await sleep(120);
check(
  'regression: PD cart add uses canonical identity (own canonical line, no variant key)',
  JSON.stringify(await cartLines()) === JSON.stringify(['iphone-15-pro-128:1', 'iphone-15-128:1']),
  JSON.stringify(await cartLines()),
);

for (const [w, h, m] of [
  [1440, 900, false],
  [1024, 800, false],
  [768, 1000, true],
  [390, 844, true],
  [320, 640, true],
]) {
  await viewport(w, h, m);
  const pages = {};
  for (const hash of [
    '#/favorites',
    '#/catalog/smartphones',
    '#/product/iphone-15-128',
    '#/cart',
  ]) {
    await go(hash);
    await sleep(450);
    pages[hash] = await overflow();
  }
  await go('#/favorites');
  await sleep(350);
  const cols = await evaluate(
    `getComputedStyle(document.querySelector('.favorites-grid')).gridTemplateColumns.split(' ').length`,
  );
  const spill = await evaluate(
    `[...document.querySelectorAll('.favorites-grid .product-card')].filter((c) => { const b = c.getBoundingClientRect(); return [...c.querySelectorAll('.ui-stepper, .product-card__cart, .product-card__favorite')].some((x) => { const r = x.getBoundingClientRect(); return r.right > b.right + 12 || r.left < b.left - 12; }); }).length`,
  );
  const badgeOk =
    w < 768
      ? (await evaluate(
          `document.querySelector('.mobile-action-bar__link[href="#/favorites"] .mobile-action-bar__badge')?.textContent`,
        )) === '3'
      : (await favBadge()) === '3';
  check(
    `responsive ${w}: no overflow, ${cols} cols, controls inside, badge 3`,
    Object.values(pages).every((v) => v <= 0) && spill === 0 && badgeOk,
    `${JSON.stringify(pages)} spill=${spill}`,
  );
}
await evaluate(`localStorage.removeItem('${FAV}')`);
for (const [w, h, m] of [
  [390, 844, true],
  [320, 640, true],
  [1440, 900, false],
]) {
  await viewport(w, h, m);
  await reload();
  await go('#/favorites');
  await waitFor(`document.querySelector('.favorites-empty')`, 'empty resp');
  check(`responsive empty ${w}: no overflow`, (await overflow()) <= 0);
}
check(
  'shell mobile: favourites accessible name',
  (await evaluate(
    `document.querySelector('.mobile-action-bar__link[href="#/favorites"]')?.getAttribute('aria-label')`,
  )) === 'Избранное: 0',
  String(
    await evaluate(
      `document.querySelector('.mobile-action-bar__link[href="#/favorites"]')?.getAttribute('aria-label')`,
    ),
  ),
);

failLive = true;
await reload();
await go('#/catalog/smartphones');
await sleep(1500);
check(
  'fallback: catalog ♥ disabled',
  await evaluate(
    `document.querySelectorAll('.product-card__link').length === 0 && [...document.querySelectorAll('.catalog-grid .product-card__favorite')].every((b) => b.disabled)`,
  ),
);
await evaluate(`document.querySelector('.catalog-grid .product-card__favorite').click()`);
await sleep(120);
check(
  'fallback: nothing persisted',
  (await evaluate(`localStorage.getItem('${FAV}')`)) === null && (await favBadge()) === '0',
);
await send('Page.navigate', { url: `${BASE}?reference=product-details` });
await sleep(1500);
check(
  'reference PD: ♥ disabled (no local fake state)',
  await evaluate(`document.querySelector('.product-gallery__favorite')?.disabled === true`),
);
const B1_FAV =
  '{"items":[{"slug":"pixel-8-128","title":"Google Pixel 8 128 ГБ, Обсидиан","image":{"kind":"catalog-fallback"},"price":53990},{"slug":"realme-gt6-256","title":"realme GT 6 12/256 ГБ, Серебристый","image":{"kind":"catalog-fallback"},"price":44990},{"slug":"oneplus-12-256","title":"OnePlus 12 12/256 ГБ, Сланец","image":{"kind":"url","src":"https://mock-goodcall.supabase.co/storage/v1/object/public/catalog-media/stub/oneplus-live.webp"},"price":64990}]}';
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
const favImages = () =>
  evaluate(
    `Object.fromEntries([...document.querySelectorAll('.favorites-grid .product-card')].map((c) => [c.querySelector('.product-card__title').textContent, c.querySelector('img').getAttribute('src')]))`,
  );
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);
await evaluate(`localStorage.setItem('${FAV}', ${JSON.stringify(B1_FAV)})`);
await reload();
await go('#/favorites');
await waitFor(
  `document.querySelectorAll('.favorites-grid .product-card').length === 3`,
  'b1 favorites',
);
const b1Fav = await favImages();
const b1FavMismatch = b1Mismatches(b1Fav).filter(([title]) => title in b1Fav);
check(
  'b1 favorites: url / local hero / SVG precedence',
  Object.keys(b1Fav).length === 3 && b1FavMismatch.length === 0,
  JSON.stringify(b1FavMismatch),
);
check(
  'b1 favorites: stored JSON unchanged by render',
  (await evaluate(`localStorage.getItem('${FAV}')`)) === B1_FAV,
);
await reload();
await go('#/favorites');
await waitFor(
  `document.querySelectorAll('.favorites-grid .product-card').length === 3`,
  'b1 favorites reload',
);
check(
  'b1 favorites: reload keeps stored JSON',
  (await evaluate(`localStorage.getItem('${FAV}')`)) === B1_FAV,
);
await evaluate(`localStorage.removeItem('${FAV}')`);

check('no uncaught errors', consoleErrors.length === 0, consoleErrors.join(' ; '));
await evaluate(
  `localStorage.removeItem('goodcall.verify.marker'); localStorage.removeItem('${CART}')`,
);

await cdp.close();
await browser.close();
report(results);

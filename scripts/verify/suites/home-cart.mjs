import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = outputDir();
const BASE = appBase();
const CART = 'goodcall.cart.v1';
const results = [];
const CATS = [
  'smartphones',
  'laptops',
  'tablets',
  'smart-watches',
  'headphones',
  'accessories',
  'gaming',
  'televisions',
];
const CAT_NAMES = [
  'Смартфоны',
  'Ноутбуки',
  'Планшеты',
  'Умные часы',
  'Наушники',
  'Аксессуары',
  'Игры и консоли',
  'Телевизоры',
];
const EARBUDS = readFileSync(
  new URL(
    '../../../src/assets/media/home/derived/home-device-earbuds-card-240.webp',
    import.meta.url,
  ),
);
const CATEGORY_ROWS = CATS.map((slug, i) => ({
  id: `cat-${slug}`,
  slug,
  name: CAT_NAMES[i],
  sort_order: i,
  is_active: true,
  merchandising_media_path: null,
  merchandising_media_alt: null,
}));
const row = (slug, name, cat, price, oldPrice, pop) => ({
  id: `id-${slug}`,
  category_id: `cat-${cat}`,
  slug,
  name,
  brand: name.split(' ')[0],
  price,
  old_price: oldPrice,
  rating: 4.7,
  review_count: 10,
  is_new: false,
  popularity_score: pop,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
});
const HOME = [
  row('iphone-15-128', 'Apple iPhone 15 128 ГБ, Чёрный', 'smartphones', 64990, 73990, 100),
  row('galaxy-s24-128', 'Samsung Galaxy S24 128 ГБ, Фиолетовый', 'smartphones', 69990, null, 99),
  row(
    'redmi-note-13-pro-256',
    'Xiaomi Redmi Note 13 Pro 8/256 ГБ, Чёрный',
    'smartphones',
    23990,
    26990,
    98,
  ),
  row('airpods-pro-2-usb-c', 'Apple AirPods Pro 2 (USB-C)', 'headphones', 24990, null, 97),
  row(
    'apple-watch-series-9-45',
    'Apple Watch Series 9 45 мм, Чёрный',
    'smart-watches',
    44990,
    52990,
    96,
  ),
];
const CATALOG = [
  HOME[0],
  HOME[1],
  row('pixel-8-128', 'Google Pixel 8 128 ГБ, Обсидиан', 'smartphones', 53990, null, 90),
];
const IMAGES = [
  {
    id: 'img-1',
    product_id: 'id-airpods-pro-2-usb-c',
    storage_path: 'home/airpods.png',
    alt: 'AirPods Pro 2',
    position: 1,
  },
];
let homeFails = false;
function mockBody(url, accept) {
  const u = new URL(url);
  const table = u.pathname.split('/').pop();
  let rows = [];
  if (table === 'categories') {
    if (u.searchParams.get('slug') === 'eq.smartphones') rows = [{ id: 'cat-smartphones' }];
    else rows = homeFails ? [] : CATEGORY_ROWS;
  }
  if (table === 'home_popular_products')
    rows = HOME.map((p, i) => ({ position: i + 1, product_id: p.id }));
  if (table === 'products') {
    const ids = u.searchParams.get('id');
    const slug = u.searchParams.get('slug');
    if (ids) rows = HOME.filter((p) => ids.includes(p.id));
    else if (slug) rows = [...HOME, ...CATALOG].filter((p) => `eq.${p.slug}` === slug);
    else rows = CATALOG;
  }
  if (table === 'product_images')
    rows = IMAGES.filter((img) =>
      (u.searchParams.get('product_id') ?? '').includes(img.product_id),
    );
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
    if (request.method === 'OPTIONS') {
      send('Fetch.fulfillRequest', { requestId, responseCode: 204, responseHeaders: cors() });
      return;
    }
    if (request.url.includes('/storage/v1/object/public/')) {
      send('Fetch.fulfillRequest', {
        requestId,
        responseCode: 200,
        responseHeaders: [...cors(), { name: 'Content-Type', value: 'image/webp' }],
        body: EARBUDS.toString('base64'),
      });
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
  await sleep(400);
}
async function reload() {
  await send('Page.reload', {});
  await sleep(1300);
}
async function viewport(width, height, mobile) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await sleep(300);
}
async function shot(name, fullPage = true) {
  let clip;
  if (fullPage) {
    const size = await evaluate(
      `({ w: document.documentElement.clientWidth, h: document.documentElement.scrollHeight })`,
    );
    clip = { x: 0, y: 0, width: size.w, height: size.h, scale: 1 };
  }
  const res = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: fullPage,
    ...(clip ? { clip } : {}),
  });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(res.result.data, 'base64'));
}

const cartBadge = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/cart"] .site-header__badge')?.textContent ?? null`,
  );
const lines = async () =>
  JSON.parse((await evaluate(`localStorage.getItem('${CART}')`)) ?? '{"lines":[]}').lines;
const homeCards = `[...document.querySelectorAll('.home-products > .product-card')]`;
const card = (i) => `${homeCards}[${i}]`;
const cardState = (i) =>
  evaluate(
    `(() => { const c = ${card(i)}; const b = c.querySelector('.product-card__cart'); const s = c.querySelector('.ui-stepper'); return { button: b ? { tag: b.tagName, type: b.type, disabled: b.disabled, label: b.getAttribute('aria-label'), text: b.textContent.trim() } : null, stepper: s ? { value: s.querySelector('.ui-stepper__value').textContent, label: s.getAttribute('aria-label'), dec: s.querySelector('.ui-stepper__button').disabled } : null }; })()`,
  );
const status = () =>
  evaluate(`document.querySelector('.home-page > [role=status]')?.textContent ?? null`);
async function openHome() {
  await go('#/');
  await waitFor(
    `${homeCards}.length === 5 && !${card(0)}.querySelector('.product-card__cart').disabled`,
    'live home',
  );
}

await send('Runtime.enable');
await send('Page.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: '*mock-goodcall.supabase.co*' }] });
await viewport(1440, 900, false);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);
await evaluate(`localStorage.clear()`);
await reload();
await openHome();

check(
  'live: 5 popular cards, all with enabled labelled «В корзину» buttons',
  await evaluate(
    `${homeCards}.every((c) => { const b = c.querySelector('.product-card__cart'); return b && b.tagName === 'BUTTON' && b.type === 'button' && !b.disabled && b.textContent.trim() === 'В корзину'; })`,
  ),
);
check(
  'live: button label carries product context',
  (await cardState(0)).button?.label === 'В корзину: Apple iPhone 15 128 ГБ, Чёрный',
);
check(
  'initial: no stepper, cart empty, shell count 0',
  (await evaluate(`document.querySelectorAll('.home-products .ui-stepper').length`)) === 0 &&
    (await lines()).length === 0 &&
    (await cartBadge()) === '0',
);
check(
  'scope: no ♥ / compare controls and no dialog on Home cards',
  (await evaluate(
    `document.querySelectorAll('.home-products .product-action--favorite, .home-products .product-action--compare, [role=dialog]').length`,
  )) === 0,
);
check(
  'heading structure: popular products h2 intact, ≤1 h1',
  (await evaluate(`document.getElementById('home-products-title')?.tagName`)) === 'H2' &&
    (await evaluate(`document.querySelectorAll('h1').length`)) <= 1,
);

await evaluate(
  `${card(0)}.querySelector('.product-card__cart').focus(); ${card(0)}.querySelector('.product-card__cart').click()`,
);
await sleep(200);
let st = await cardState(0);
check(
  'add: accepted ProductCard cart state — stepper (1) appears beside the still-present labelled button',
  st.stepper?.value === '1' && st.button?.text === 'В корзину' && !st.button.disabled,
  JSON.stringify(st),
);
check(
  'add: stepper labelled with product; «−» enabled at 1 (decrement-to-zero)',
  st.stepper?.label === 'Количество: Apple iPhone 15 128 ГБ, Чёрный' && st.stepper.dec === false,
);
check(
  'add: focus is not lost (stays on the cart button inside the card)',
  (await evaluate(`document.activeElement?.getAttribute('aria-label')`)) ===
    'В корзину: Apple iPhone 15 128 ГБ, Чёрный' &&
    (await evaluate(`${card(0)}.contains(document.activeElement)`)),
);
check(
  'add: status announcement',
  (await status()) === 'Товар добавлен в корзину: Apple iPhone 15 128 ГБ, Чёрный. В корзине: 1 шт.',
  String(await status()),
);
let l = await lines();
check(
  'cart line: canonical id/slug, title, numeric price/oldPrice, fallback image',
  l.length === 1 &&
    l[0].id === 'iphone-15-128' &&
    l[0].productSlug === 'iphone-15-128' &&
    l[0].title === 'Apple iPhone 15 128 ГБ, Чёрный' &&
    l[0].price === 64990 &&
    l[0].oldPrice === 73990 &&
    l[0].image.kind === 'catalog-fallback' &&
    l[0].quantity === 1,
  JSON.stringify(l[0]),
);
check('shell count follows (1)', (await cartBadge()) === '1');
await evaluate(`${card(0)}.querySelectorAll('.ui-stepper__button')[1].click()`);
await sleep(150);
await evaluate(`${card(0)}.querySelectorAll('.ui-stepper__button')[1].click()`);
await sleep(150);
check(
  'increment via stepper «+» → 3; shell 3',
  (await cardState(0)).stepper?.value === '3' &&
    (await lines())[0].quantity === 3 &&
    (await cartBadge()) === '3',
);
await evaluate(`${card(0)}.querySelector('.ui-stepper__button').click()`);
await sleep(150);
check(
  'decrement → 2; shell 2',
  (await cardState(0)).stepper?.value === '2' &&
    (await lines())[0].quantity === 2 &&
    (await cartBadge()) === '2',
);
await evaluate(`${card(0)}.querySelector('.ui-stepper__button').click()`);
await sleep(150);
st = await cardState(0);
check(
  'back at 1: «−» still enabled',
  st.stepper?.value === '1' && st.stepper.dec === false && (await lines())[0].quantity === 1,
);
await evaluate(
  `${card(0)}.querySelector('.ui-stepper__button').focus(); ${card(0)}.querySelector('.ui-stepper__button').click()`,
);
await sleep(250);
st = await cardState(0);
check(
  '1 → 0: cart line removed (no zero line stored)',
  (await lines()).length === 0,
  JSON.stringify(await lines()),
);
check(
  '1 → 0: stepper disappears; labelled enabled «В корзину» remains',
  st.stepper === null && st.button?.text === 'В корзину' && !st.button.disabled,
  JSON.stringify(st),
);
check('1 → 0: shell count back to 0', (await cartBadge()) === '0');
check(
  '1 → 0: truthful removal announcement',
  (await status()) === 'Товар удалён из корзины: Apple iPhone 15 128 ГБ, Чёрный',
  String(await status()),
);
check(
  '1 → 0: focus lands on the same card «В корзину» (not body)',
  (await evaluate(`document.activeElement?.getAttribute('aria-label')`)) ===
    'В корзину: Apple iPhone 15 128 ГБ, Чёрный' &&
    (await evaluate(`${card(0)}.contains(document.activeElement)`)),
);
await evaluate(`document.activeElement.click()`);
await sleep(200);
check(
  'add again from focused button works → 1; shell 1',
  (await cardState(0)).stepper?.value === '1' &&
    (await lines()).length === 1 &&
    (await cartBadge()) === '1',
);

await evaluate(`${card(3)}.querySelector('.product-card__cart').click()`);
await sleep(200);
l = await lines();
const airpods = l.find((x) => x.productSlug === 'airpods-pro-2-usb-c');
check(
  'cart line: live product_images → url image; no oldPrice when absent',
  airpods?.image.kind === 'url' &&
    /catalog-media\/home\/airpods\.png$/.test(airpods.image.src) &&
    airpods.oldPrice === undefined &&
    airpods.price === 24990,
  JSON.stringify(airpods),
);

await go('#/catalog/smartphones');
await waitFor(`document.querySelectorAll('.catalog-grid .product-card').length === 3`, 'catalog');
const catQty = await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card')][0].querySelector('.ui-stepper__value')?.textContent ?? null`,
);
check(
  'merge Home → Catalog: same product shows the Home quantity (1)',
  catQty === '1',
  String(catQty),
);
await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card')][0].querySelectorAll('.ui-stepper__button')[1].click()`,
);
await sleep(150);
await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card')][1].querySelector('.product-card__cart').click()`,
);
await sleep(150);
l = await lines();
check(
  'merge: one line per slug after Catalog edits (iphone 2, galaxy 1, airpods 1)',
  l.filter((x) => x.productSlug === 'iphone-15-128').length === 1 &&
    l.find((x) => x.productSlug === 'iphone-15-128').quantity === 2 &&
    l.find((x) => x.productSlug === 'galaxy-s24-128')?.quantity === 1 &&
    l.length === 3,
  JSON.stringify(l.map((x) => [x.id, x.quantity])),
);
await openHome();
check(
  'merge Catalog → Home: Home reflects existing quantities (iphone 2, galaxy 1)',
  (await cardState(0)).stepper?.value === '2' &&
    (await cardState(1)).stepper?.value === '1' &&
    (await cardState(2)).stepper === null,
);
check('shell count = all units (4)', (await cartBadge()) === '4');
await shot('home-cart-1440');
await go('#/cart');
await sleep(500);
check(
  'Cart page lists the 3 merged lines',
  (await evaluate(`document.querySelectorAll('.cart-line').length`)) === 3,
  String(await evaluate(`document.querySelectorAll('.cart-line').length`)),
);
check(
  'Cart page semantics unchanged: its stepper «−» still disabled at quantity 1',
  await evaluate(
    `(() => { const s = [...document.querySelectorAll('.cart-line .ui-stepper')].find((x) => x.querySelector('.ui-stepper__value').textContent === '1'); return Boolean(s) && s.querySelector('.ui-stepper__button').disabled; })()`,
  ),
);
await go('#/catalog/smartphones');
await waitFor(
  `document.querySelectorAll('.catalog-grid .product-card').length === 3`,
  'catalog zero',
);
const galaxy = `[...document.querySelectorAll('.catalog-grid .product-card')][1]`;
check(
  'Catalog (shared ProductCard): «−» enabled at 1',
  (await evaluate(`${galaxy}.querySelector('.ui-stepper__value').textContent`)) === '1' &&
    !(await evaluate(`${galaxy}.querySelector('.ui-stepper__button').disabled`)),
);
await evaluate(
  `${galaxy}.querySelector('.ui-stepper__button').focus(); ${galaxy}.querySelector('.ui-stepper__button').click()`,
);
await sleep(250);
check(
  'Catalog 1 → 0: line removed, stepper gone, «В корзину» back and focused',
  !(await lines()).some((x) => x.productSlug === 'galaxy-s24-128') &&
    (await evaluate(`${galaxy}.querySelector('.ui-stepper')`)) === null &&
    (await evaluate(`document.activeElement?.getAttribute('aria-label')`)) ===
      'В корзину: Samsung Galaxy S24 128 ГБ, Фиолетовый',
);
check(
  'Catalog 1 → 0: announcement + shell count 3',
  (await evaluate(
    `document.querySelector('.catalog-grid + [role=status], main [role=status]')?.textContent`,
  )) === 'Товар удалён из корзины: Samsung Galaxy S24 128 ГБ, Фиолетовый' &&
    (await cartBadge()) === '3',
  String(
    await evaluate(
      `[...document.querySelectorAll('main [role=status]')].map((x) => x.textContent).join('|')`,
    ),
  ),
);
await openHome();
check(
  'cross-surface: Home reflects the Catalog removal (galaxy back to «В корзину»)',
  (await cardState(1)).stepper === null && (await cardState(0)).stepper?.value === '2',
);
await evaluate(`${card(1)}.querySelector('.product-card__cart').click()`);
await sleep(200);

for (const [w, h, m] of [
  [1440, 900, false],
  [1280, 900, false],
  [1024, 800, false],
  [768, 1000, true],
  [390, 844, true],
  [320, 640, true],
]) {
  await viewport(w, h, m);
  await go('#/');
  await reload();
  await waitFor(
    `${homeCards}.length === 5 && ${card(0)}.querySelector('.ui-stepper')`,
    `home ${w}`,
  );
  const r = await evaluate(
    `(() => { const cards = ${homeCards}; const hs = cards.map((c) => Math.round(c.getBoundingClientRect().height)); const rows = new Map(); cards.forEach((c, i) => { const t = Math.round(c.getBoundingClientRect().top); rows.set(t, [...(rows.get(t) ?? []), hs[i]]); }); const fits = cards.every((c) => { const cr = c.getBoundingClientRect(); return [...c.querySelectorAll('.product-card__cart, .ui-stepper, .product-card__title, .product-card__prices, .product-card__media')].every((e) => { const q = e.getBoundingClientRect(); return q.left >= cr.left - 0.5 && q.right <= cr.right + 0.5; }); }); const noOverlap = cards.every((c) => { const a = c.querySelector('.product-card__actions')?.getBoundingClientRect(); const p = c.querySelector('.product-card__prices').getBoundingClientRect(); return !a || a.top >= p.top - 0.5; }); return { page: document.documentElement.scrollWidth - document.documentElement.clientWidth, rowsEqual: [...rows.values()].every((v) => Math.max(...v) - Math.min(...v) <= 1), fits, noOverlap, maxH: Math.max(...hs) }; })()`,
  );
  check(
    `responsive ${w}: no overflow; equal heights per row; controls inside cards; no overlap`,
    r.page <= 0 && r.rowsEqual && r.fits && r.noOverlap && r.maxH < 520,
    JSON.stringify(r),
  );
  if (w === 390) {
    await evaluate(`window.scrollTo(0, ${card(1)}.getBoundingClientRect().top + scrollY - 110)`);
    await sleep(200);
    await shot('home-cart-390-viewport', false);
    await shot('home-cart-390');
  }
}
await viewport(1440, 900, false);

await openHome();
await evaluate(
  `${homeCards}.forEach((c) => c.querySelector('img').setAttribute('loading', 'eager'))`,
);
await waitFor(
  `${homeCards}.every((c) => c.querySelector('img').complete)`,
  'home card images settled',
);
const homeImages = await evaluate(
  `${homeCards}.map((c) => [c.querySelector('.product-card__title').textContent, c.querySelector('img').getAttribute('src'), c.querySelector('img').naturalWidth > 0])`,
);
const homeImage = (i) => homeImages[i]?.[1] ?? '';
check(
  'thumb: iPhone 15 → local hero',
  homeImage(0).includes('product-details-gallery-pink-hero-front-gallery'),
  homeImage(0),
);
check(
  'thumb: Galaxy S24 → local hero',
  homeImage(1).includes('product-details-galaxy-s24-128-hero-front-gallery'),
  homeImage(1),
);
check(
  'thumb: Redmi keeps category art',
  homeImage(2).includes('home-device-smartphone-card'),
  homeImage(2),
);
check(
  'thumb: AirPods live product_images URL wins',
  homeImage(3).includes('/storage/v1/object/public/'),
  homeImage(3),
);
check(
  'thumb: Watch → local product image',
  homeImage(4).includes('product-details-gallery-apple-watch-s9-black-gallery'),
  homeImage(4),
);
check(
  'thumb: all home card images load',
  homeImages.every(([, , loaded]) => loaded),
  JSON.stringify(homeImages.map(([title, , loaded]) => [title, loaded])),
);
await go('#/');
await send('Page.navigate', { url: `${BASE}?reference=home` });
await sleep(1500);
const referenceHome = await evaluate(
  `[...document.querySelectorAll('.home-products > .product-card img')].map((i) => i.getAttribute('src'))`,
);
check(
  'thumb: ?reference=home keeps category artwork only',
  referenceHome.length === 5 &&
    referenceHome.every((src) => src.includes('home-device-') && !src.includes('product-details')),
  JSON.stringify(referenceHome),
);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);

await evaluate(`localStorage.removeItem('${CART}')`);
await reload();
await openHome();
for (const index of [1, 3, 4]) {
  await evaluate(`${card(index)}.querySelector('.product-card__cart').click()`);
  await sleep(150);
}
const homeKinds = Object.fromEntries((await lines()).map((l) => [l.productSlug, l.image.kind]));
check(
  'b1: Home-added lines store catalog-fallback (Galaxy, Watch) and url (AirPods)',
  homeKinds['galaxy-s24-128'] === 'catalog-fallback' &&
    homeKinds['apple-watch-series-9-45'] === 'catalog-fallback' &&
    homeKinds['airpods-pro-2-usb-c'] === 'url',
  JSON.stringify(homeKinds),
);
const storedHomeCart = await evaluate(`localStorage.getItem('${CART}')`);
await go('#/cart');
await waitFor(`document.querySelectorAll('.cart-line').length === 3`, 'b1 home cart lines');
const homeCartImages = await evaluate(
  `Object.fromEntries([...document.querySelectorAll('.cart-line')].map((l) => [l.querySelector('.cart-line__title').textContent, l.querySelector('img').getAttribute('src')]))`,
);
const homeCartImage = (prefix) =>
  Object.entries(homeCartImages).find(([title]) => title.startsWith(prefix))?.[1] ?? '';
check(
  'b1: cart renders Galaxy and Watch local images, AirPods stored URL',
  homeCartImage('Samsung Galaxy S24').includes(
    'product-details-galaxy-s24-128-hero-front-gallery',
  ) &&
    homeCartImage('Apple Watch').includes('product-details-gallery-apple-watch-s9-black-gallery') &&
    homeCartImage('Apple AirPods').includes('/storage/v1/object/public/'),
  JSON.stringify(homeCartImages),
);
check(
  'b1: cart render leaves stored JSON unchanged',
  (await evaluate(`localStorage.getItem('${CART}')`)) === storedHomeCart,
);
await evaluate(`localStorage.removeItem('${CART}')`);
await reload();

homeFails = true;
const before = JSON.stringify(await lines());
await go('#/');
await reload();
await sleep(800);
const fb = await evaluate(
  `${homeCards}.map((c) => { const b = c.querySelector('.product-card__cart'); return { disabled: b?.disabled, text: b?.textContent.trim(), stepper: Boolean(c.querySelector('.ui-stepper')) }; })`,
);
check(
  'fallback: 5 fixture cards render with labelled but disabled cart buttons, no steppers',
  fb.length === 5 && fb.every((x) => x.disabled === true && x.text === 'В корзину' && !x.stepper),
  JSON.stringify(fb),
);
await evaluate(`${homeCards}.forEach((c) => c.querySelector('.product-card__cart').click())`);
await sleep(200);
check(
  'thumb: fixture fallback keeps category artwork (no slug leakage)',
  (await evaluate(`${homeCards}.map((c) => c.querySelector('img').getAttribute('src'))`)).every(
    (src) => src.includes('home-device-') && !src.includes('product-details'),
  ),
);
check(
  'fallback: clicks cannot mutate cart; no fixture ids inserted',
  JSON.stringify(await lines()) === before &&
    !(await lines()).some((x) =>
      ['galaxy-s24-256', 'redmi-note-13-pro', 'airpods-pro-2', 'apple-watch-9-45'].includes(
        x.productSlug,
      ),
    ),
);
homeFails = false;

check('no uncaught errors', consoleErrors.length === 0, consoleErrors.join(' ; '));
await cdp.close();
await browser.close();
report(results);

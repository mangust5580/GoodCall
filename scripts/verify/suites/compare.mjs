import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';
import { writeFileSync } from 'node:fs';

const OUT = outputDir();
const BASE = appBase();
const COMPARE = 'goodcall.compare.v1';
const CART = 'goodcall.cart.v1';
const FAV = 'goodcall.favorites.v1';
const results = [];
const row = (slug, name, price, oldPrice, rating, reviews, pop) => ({
  id: `id-${slug}`,
  category_id: 'cat-smartphones',
  slug,
  name,
  brand: name.split(' ')[0],
  price,
  old_price: oldPrice,
  rating,
  review_count: reviews,
  is_new: false,
  popularity_score: pop,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
});
const PRODUCTS = [
  row(
    'iphone-15-pro-128',
    'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
    109990,
    124990,
    4.8,
    12,
    100,
  ),
  row('iphone-15-128', 'Apple iPhone 15 128 ГБ, Розовый', 79990, 84990, 4.6, 8, 99),
  row('galaxy-s24-256', 'Samsung Galaxy S24 256 ГБ, Фиолетовый', 75990, null, null, 0, 98),
  row('pixel-8-128', 'Google Pixel 8 128 ГБ, Обсидиан', 53990, 58990, 4.5, 2, 97),
  row('nothing-phone-2a', 'Nothing Phone (2a)', 31990, null, 4.6, 3, 96),
  row('xiaomi-14-256', 'Xiaomi 14 12/256 ГБ, Черный', 69990, null, 4.7, 5, 95),
];
function mockBody(url, accept) {
  const u = new URL(url);
  const table = u.pathname.split('/').pop();
  let rows = [];
  if (table === 'categories')
    rows = u.searchParams.get('slug') === 'eq.smartphones' ? [{ id: 'cat-smartphones' }] : [];
  if (table === 'products') {
    const slug = u.searchParams.get('slug');
    rows = slug ? PRODUCTS.filter((p) => `eq.${p.slug}` === slug) : PRODUCTS;
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

const compareBadge = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/compare"] .site-header__badge')?.textContent ?? null`,
  );
const stored = () =>
  evaluate(
    `JSON.parse(localStorage.getItem('${COMPARE}') ?? '{"items":[]}').items.map((i) => i.slug)`,
  );
const cards = `[...document.querySelectorAll('.catalog-grid .product-card')]`;
const cardBtn = (i) => `${cards}[${i}].querySelector('.product-card__compare')`;
const btnState = (i) =>
  evaluate(
    `(() => { const b = ${cardBtn(i)}; return { pressed: b.getAttribute('aria-pressed'), disabled: b.disabled, label: b.getAttribute('aria-label'), tag: b.tagName, type: b.type }; })()`,
  );
const click = async (expr) => {
  await evaluate(`${expr}.click()`);
  await sleep(150);
};
const rowValues = (r) =>
  evaluate(
    `[...document.querySelectorAll('tbody tr')[${r}].querySelectorAll('td')].map((td) => td.textContent.replace(/\\s+/g, ' ').trim())`,
  );
async function openCatalog() {
  await go('#/catalog/smartphones');
  await waitFor(`${cards}.length === 6 && !${cardBtn(0)}.disabled`, 'live catalog');
}

await send('Runtime.enable');
await send('Page.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: '*mock-goodcall.supabase.co*' }] });
await viewport(1440, 900, false);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);
await evaluate(`localStorage.clear()`);
await reload();

check(
  'shell: header comparison count is real 0 (no fabricated 3)',
  (await compareBadge()) === '0',
  String(await compareBadge()),
);
check(
  'shell: header + mobile bar link to #/compare',
  await evaluate(
    `document.querySelectorAll('.site-header__action[href="#/compare"]').length === 1 && document.querySelectorAll('.mobile-action-bar a[href="#/compare"]').length === 1`,
  ),
);
check(
  'shell: accessible name carries count',
  (await evaluate(
    `document.querySelector('.site-header__action[href="#/compare"]').getAttribute('aria-label')`,
  )) === 'Сравнение: 0',
);

await openCatalog();
check(
  'catalog: every card has one compare control',
  await evaluate(
    `${cards}.every((c) => c.querySelectorAll('.product-card__compare').length === 1)`,
  ),
);
let s0 = await btnState(0);
check(
  'catalog: native button type=button, aria-pressed=false, enabled',
  s0.tag === 'BUTTON' && s0.type === 'button' && s0.pressed === 'false' && !s0.disabled,
);
check(
  'catalog: inactive label',
  s0.label === 'Добавить к сравнению: Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
  s0.label,
);
check(
  'catalog: icon-only (no visible text)',
  (await evaluate(`${cardBtn(0)}.textContent.trim()`)) === '',
);
const geo = await evaluate(
  `(() => { const c = ${cards}[0]; const r = (s) => c.querySelector(s).getBoundingClientRect(); const h = r('.product-card__favorite'), k = r('.product-card__compare'), m = r('.product-card__media'), card = c.getBoundingClientRect(); return { hx: Math.round(h.right), kx: Math.round(k.right), gap: Math.round(k.top - h.bottom), size: [Math.round(k.width), Math.round(k.height), Math.round(h.width)], media: Math.round(m.height), inside: k.right <= card.right + 0.5 && k.left >= card.left }; })()`,
);
check(
  'card layout: compare directly under heart (same right edge, small gap, same size)',
  geo.hx === geo.kx &&
    geo.gap >= 0 &&
    geo.gap <= 8 &&
    geo.size[0] === geo.size[2] &&
    geo.size[1] === geo.size[2],
  JSON.stringify(geo),
);
check(
  'card layout: media height unchanged (148) and control inside card',
  geo.media === 148 && geo.inside,
  JSON.stringify(geo),
);
await click(cardBtn(0));
s0 = await btnState(0);
check(
  'toggle on: aria-pressed=true + remove label',
  s0.pressed === 'true' &&
    s0.label === 'Убрать из сравнения: Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
);
check('shell count updates to 1', (await compareBadge()) === '1');
await click(`${cards}[0].querySelector('.product-card__favorite')`);
check(
  'favorite works independently of compare',
  (await evaluate(
    `${cards}[0].querySelector('.product-card__favorite').getAttribute('aria-pressed')`,
  )) === 'true' &&
    (await btnState(0)).pressed === 'true' &&
    JSON.parse(await evaluate(`localStorage.getItem('${FAV}')`)).items.length === 1 &&
    (await stored()).length === 1,
);
for (const i of [1, 2, 3]) await click(cardBtn(i));
check('cap: 4 compared', (await stored()).length === 4 && (await compareBadge()) === '4');
const s4 = await btnState(4);
check(
  'cap: inactive toggles disabled with full label',
  s4.disabled &&
    s4.pressed === 'false' &&
    s4.label === 'Сравнение заполнено (4 из 4): Nothing Phone (2a)',
  s4.label,
);
check(
  'cap: active toggles stay enabled',
  await evaluate(
    `[0, 1, 2, 3].every((i) => !${cards}[i].querySelector('.product-card__compare').disabled)`,
  ),
);
await evaluate(`${cardBtn(4)}.click()`);
await sleep(150);
check(
  'cap: fifth product cannot be added',
  (await stored()).join() === 'iphone-15-pro-128,iphone-15-128,galaxy-s24-256,pixel-8-128',
);
await click(cardBtn(1));
check(
  'removal at cap re-enables inactive toggles',
  (await stored()).length === 3 &&
    !(await btnState(4)).disabled &&
    (await btnState(4)).label === 'Добавить к сравнению: Nothing Phone (2a)',
);
await click(cardBtn(4));
check(
  'insertion order kept (re-added goes last)',
  (await stored()).join() === 'iphone-15-pro-128,galaxy-s24-256,pixel-8-128,nothing-phone-2a',
);
await evaluate(
  `window.scrollTo(0, document.querySelector('.catalog-grid').getBoundingClientRect().top + scrollY - 120)`,
);
await sleep(300);
await shot('catalog-compare-1440', false);

await go('#/search?q=Apple');
await sleep(900);
check(
  'Search desktop rows: no compare control leaks',
  (await evaluate(
    `document.querySelectorAll('.product-card__compare, .product-action--compare').length`,
  )) === 0 && (await evaluate(`document.querySelectorAll('.search-row').length`)) > 0,
);
await viewport(390, 844, true);
await reload();
check(
  'Search mobile ProductCards: no compare control leaks',
  (await evaluate(
    `document.querySelectorAll('.product-card__compare, .product-action--compare').length`,
  )) === 0 &&
    (await evaluate(`document.querySelectorAll('.search-results .product-card').length`)) > 0,
);
await viewport(1440, 900, false);
await reload();
await go('#/favorites');
check(
  'Favorites page: saved item renders with pressed heart, no compare control',
  (await evaluate(`document.querySelectorAll('.favorites-grid .product-card').length`)) === 1 &&
    (await evaluate(
      `document.querySelector('.favorites-grid .product-card__favorite').getAttribute('aria-pressed')`,
    )) === 'true' &&
    (await evaluate(`document.querySelectorAll('.product-action--compare').length`)) === 0,
);
await click(`document.querySelector('.favorites-grid .product-card__favorite')`);
check(
  'Favorites page: removal still works; comparison untouched',
  (await evaluate(`document.querySelectorAll('.favorites-grid .product-card').length`)) === 0 &&
    (await stored()).length === 4,
);
await go('#/');
await sleep(500);
check(
  'Home: no compare control',
  (await evaluate(`document.querySelectorAll('.product-action--compare').length`)) === 0,
);

await go('#/compare');
await sleep(400);
check(
  'page: breadcrumb',
  (await evaluate(`document.querySelector('.compare-page__breadcrumbs ol').textContent`)) ===
    'ГлавнаяСравнение товаров',
);
check(
  'page: one h1 «Сравнение товаров» + «4 из 4»',
  (await evaluate(`[...document.querySelectorAll('h1')].map((h) => h.textContent).join('|')`)) ===
    'Сравнение товаров' &&
    (await evaluate(`document.querySelector('.compare__count').textContent`)) === '4 из 4',
);
check(
  'page: «Очистить все» is a real button; no share',
  await evaluate(
    `document.querySelector('.compare__clear').tagName === 'BUTTON' && document.querySelector('.compare__clear').type === 'button' && !/Поделиться/.test(document.querySelector('main').textContent)`,
  ),
);
check(
  'table: native table with visually hidden caption',
  await evaluate(
    `Boolean(document.querySelector('table.compare-table > caption.ui-visually-hidden'))`,
  ),
);
check(
  'table: product column headers scope=col in insertion order',
  (await evaluate(
    `[...document.querySelectorAll('thead th[scope=col]')].map((t) => t.querySelector('.compare-product__title').textContent).join('|')`,
  )) ===
    'Apple iPhone 15 Pro 128 ГБ, Натуральный титан|Samsung Galaxy S24 256 ГБ, Фиолетовый|Google Pixel 8 128 ГБ, Обсидиан|Nothing Phone (2a)',
);
check(
  'table: exactly six row headers scope=row',
  (await evaluate(
    `[...document.querySelectorAll('tbody th[scope=row]')].map((t) => t.textContent).join('|')`,
  )) === 'Цена|Выгода|Рейтинг|Бренд|Встроенная память|Цвет',
);
check(
  'table: unsupported raster rows and stock absent',
  !/Диагональ|Разрешение|Процессор|Оперативная|Аккумулятор|Вес|В наличии/.test(
    await evaluate(`document.querySelector('main').textContent`),
  ),
);
const v = [];
for (let r = 0; r < 6; r += 1) v.push(await rowValues(r));
check(
  'row Цена',
  v[0].join('|').replace(/\s/g, '') === '109990₽|75990₽|53990₽|31990₽',
  v[0].join('|'),
);
check(
  'row Выгода: real saving or —',
  v[1].join('|').replace(/\s/g, '') === '15000₽|—|5000₽|—',
  v[1].join('|'),
);
check(
  'row Рейтинг: value + reviews, — when absent',
  /4\.8/.test(v[2][0]) && /12 отзывов/.test(v[2][0]) && v[2][1] === '—' && /4\.5/.test(v[2][2]),
  v[2].join('|'),
);
check('row Бренд', v[3].join('|') === 'Apple|Samsung|Google|Nothing', v[3].join('|'));
check(
  'row Встроенная память: accepted derivation, — when absent',
  v[4].join('|') === '128 ГБ|256 ГБ|128 ГБ|—',
  v[4].join('|'),
);
check(
  'row Цвет: single text label, — when absent, no swatches',
  v[5].join('|') === 'Натуральный титан|Фиолетовый|Обсидиан|—' &&
    (await evaluate(`document.querySelectorAll('tbody [class*=swatch]').length`)) === 0,
  v[5].join('|'),
);
check(
  'header: old price only when present',
  (await evaluate(
    `document.querySelectorAll('thead th[scope=col]')[0].querySelector('.compare-product__old-price')?.textContent.replace(/\\s/g, '')`,
  )) === '124990₽' &&
    (await evaluate(
      `document.querySelectorAll('thead th[scope=col]')[1].querySelector('.compare-product__old-price')`,
    )) === null,
);
check(
  'header: remove buttons named with title',
  (await evaluate(
    `[...document.querySelectorAll('.compare-product__remove')].map((b) => b.getAttribute('aria-label')).join('|')`,
  )) ===
    'Убрать из сравнения: Apple iPhone 15 Pro 128 ГБ, Натуральный титан|Убрать из сравнения: Samsung Galaxy S24 256 ГБ, Фиолетовый|Убрать из сравнения: Google Pixel 8 128 ГБ, Обсидиан|Убрать из сравнения: Nothing Phone (2a)',
);
check(
  'header: PD link only for canonical slugs with PDP content (iphone-15-pro-128, pixel-8-128); content-less mock slugs (galaxy-s24-256, nothing-phone-2a) unlinked',
  (await evaluate(
    `[...document.querySelectorAll('thead th[scope=col]')].map((t) => t.querySelector('.compare-product__link')?.getAttribute('href') ?? 'none').join('|')`,
  )) === '#/product/iphone-15-pro-128|none|#/product/pixel-8-128|none',
  await evaluate(
    `[...document.querySelectorAll('thead th[scope=col]')].map((t) => t.querySelector('.compare-product__link')?.getAttribute('href') ?? 'none').join('|')`,
  ),
);
check(
  'corner cell: present in header row, visually empty, aligned with row labels',
  await evaluate(
    `(() => { const c = document.querySelector('thead tr > td.compare-table__corner'); const l = document.querySelector('tbody th[scope=row]'); return Boolean(c) && c.textContent.trim() === '' && Math.round(c.getBoundingClientRect().width) === Math.round(l.getBoundingClientRect().width) && !/Основные характеристики/.test(document.querySelector('main').textContent); })()`,
  ),
);
await shot('compare-4-1440');
check(
  '1440: four columns fit — no matrix scroll, no region role/tabindex',
  await evaluate(
    `(() => { const s = document.querySelector('.compare__scroll'); return s.scrollWidth <= s.clientWidth && !s.hasAttribute('role') && !s.hasAttribute('tabindex'); })()`,
  ),
);

await evaluate(`document.querySelectorAll('.compare-table__cart')[0].click()`);
await sleep(150);
await evaluate(`document.querySelectorAll('.compare-table__cart')[0].click()`);
await sleep(150);
const cartLines = JSON.parse(await evaluate(`localStorage.getItem('${CART}')`)).lines;
check(
  'cart: «В корзину» adds; second click merges to qty 2 by canonical id',
  cartLines.length === 1 &&
    cartLines[0].productSlug === 'iphone-15-pro-128' &&
    cartLines[0].quantity === 2 &&
    cartLines[0].price === 109990 &&
    cartLines[0].oldPrice === 124990,
  JSON.stringify(cartLines),
);
check(
  'cart: comparison keeps the item; cart badge 2',
  (await stored()).length === 4 &&
    (await evaluate(
      `document.querySelector('.site-header__action[href="#/cart"] .site-header__badge').textContent`,
    )) === '2',
);
await go('#/catalog/smartphones');
await waitFor(`${cards}.length === 6`, 'catalog again');
check(
  'cart: Catalog sees the same merged line (stepper 2)',
  (await evaluate(`${cards}[0].querySelector('.ui-stepper__value')?.textContent ?? ''`)) === '2',
);
await go('#/compare');
await sleep(300);

await evaluate(
  `document.querySelectorAll('.compare-product__remove')[1].focus(); document.querySelectorAll('.compare-product__remove')[1].click()`,
);
await sleep(250);
check(
  'remove: column removed',
  (await stored()).join() === 'iphone-15-pro-128,pixel-8-128,nothing-phone-2a',
);
check(
  'remove: focus moves to next remaining remove control',
  (await evaluate(`document.activeElement.getAttribute('aria-label')`)) ===
    'Убрать из сравнения: Google Pixel 8 128 ГБ, Обсидиан',
);
await evaluate(`document.querySelectorAll('.compare-product__remove')[2].click()`);
await sleep(250);
check(
  'remove last column: focus to previous remaining',
  (await evaluate(`document.activeElement.getAttribute('aria-label')`)) ===
    'Убрать из сравнения: Google Pixel 8 128 ГБ, Обсидиан' && (await stored()).length === 2,
);
check(
  'count updates «2 из 4» + shell 2',
  (await evaluate(`document.querySelector('.compare__count').textContent`)) === '2 из 4' &&
    (await compareBadge()) === '2',
);
await shot('compare-2-1440');
await reload();
check(
  'persistence: reload keeps 2 items',
  (await evaluate(`document.querySelectorAll('thead th[scope=col]').length`)) === 2,
);
await evaluate(`document.querySelector('.compare__clear').click()`);
await sleep(250);
check(
  'clear all: empty state rendered, its h1 focused',
  (await evaluate(`document.activeElement.id`)) === 'compare-empty-title' &&
    (await evaluate(`[...document.querySelectorAll('h1')].map((h) => h.textContent).join('|')`)) ===
      'Сравнение пусто',
);
check(
  'empty: no table, catalogue CTA link, shell 0, store empty',
  (await evaluate(`document.querySelector('table')`)) === null &&
    (await evaluate(
      `document.querySelector('.compare-empty .empty-state__action').getAttribute('href')`,
    )) === '#/catalog/smartphones' &&
    (await compareBadge()) === '0' &&
    (await stored()).length === 0,
);
check(
  'empty: Newsletter/Footer continue',
  await evaluate(
    `Boolean(document.querySelector('footer')) && /Будьте в курсе/.test(document.body.textContent)`,
  ),
);
await shot('compare-empty-1440');

const item = (slug, title, price, oldPrice, rating, reviewCount, brand, storage, colour) => ({
  slug,
  title,
  image: { kind: 'catalog-fallback' },
  price,
  ...(oldPrice ? { oldPrice } : {}),
  ...(rating ? { rating } : {}),
  reviewCount,
  brand,
  ...(storage ? { storage } : {}),
  ...(colour ? { colour } : {}),
});
const FOUR = [
  item(
    'iphone-15-pro-128',
    'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
    109990,
    124990,
    4.8,
    12,
    'Apple',
    128,
    'Натуральный титан',
  ),
  item(
    'galaxy-s24-256',
    'Samsung Galaxy S24 256 ГБ, Фиолетовый',
    75990,
    null,
    null,
    0,
    'Samsung',
    256,
    'Фиолетовый',
  ),
  item(
    'pixel-8-128',
    'Google Pixel 8 128 ГБ, Обсидиан',
    53990,
    58990,
    4.5,
    2,
    'Google',
    128,
    'Обсидиан',
  ),
  item(
    'xiaomi-14-256',
    'Xiaomi 14 12/256 ГБ, Черный',
    69990,
    null,
    4.7,
    5,
    'Xiaomi',
    256,
    'Черный',
  ),
];
await evaluate(
  `localStorage.setItem('${COMPARE}', ${JSON.stringify(JSON.stringify({ items: FOUR }))})`,
);
await reload();
for (const [w, h, m] of [
  [1440, 900, false],
  [1280, 900, false],
  [1024, 800, false],
  [768, 1000, true],
  [390, 844, true],
  [320, 640, true],
]) {
  await viewport(w, h, m);
  await reload();
  const r = await evaluate(
    `(() => { const s = document.querySelector('.compare__scroll'); const t = s.querySelector('table'); return { page: document.documentElement.scrollWidth - document.documentElement.clientWidth, scrolls: s.scrollWidth > s.clientWidth, role: s.getAttribute('role'), tab: s.getAttribute('tabindex'), label: s.getAttribute('aria-label'), labelW: Math.round(t.querySelector('tbody th').getBoundingClientRect().width), colW: Math.round(t.querySelector('thead th[scope=col]').getBoundingClientRect().width), overflowing: [...document.querySelectorAll('body *')].filter((e) => { if (e.getBoundingClientRect().right <= document.documentElement.clientWidth + 1) return false; for (let p = e.parentElement; p; p = p.parentElement) { if (getComputedStyle(p).overflowX !== 'visible') return false; } return true; }).slice(0, 4).map((e) => e.tagName + '.' + e.className) }; })()`,
  );
  const gap = await evaluate(
    `(() => { const card = document.querySelector('.compare').getBoundingClientRect(); const band = document.querySelector('.newsletter-band').getBoundingClientRect(); return { gap: Math.round(band.top - card.bottom), pad: parseFloat(getComputedStyle(document.querySelector('main')).paddingBottom) }; })()`,
  );
  check(
    `spacing ${w}: card → Newsletter gap is only the page bottom padding (≤ 40px)`,
    gap.gap === Math.round(gap.pad) && gap.gap <= 40,
    JSON.stringify(gap),
  );
  const okScroll = r.scrolls
    ? r.role === 'region' && r.tab === '0' && Boolean(r.label)
    : r.role === null && r.tab === null;
  check(
    `responsive ${w}: no page overflow; region semantics match overflow; label ≥120, columns ≥168`,
    r.page <= 0 && okScroll && r.labelW >= 119 && r.colW >= 167,
    JSON.stringify(r),
  );
  if (w <= 768) {
    const reach = await evaluate(
      `(() => { const s = document.querySelector('.compare__scroll'); const b = [...document.querySelectorAll('.compare-table__cart')].at(-1); b.scrollIntoView({ block: 'center', inline: 'center' }); const rect = b.getBoundingClientRect(); const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2); const ok = hit === b || b.contains(hit); s.scrollLeft = 0; return ok; })()`,
    );
    check(`responsive ${w}: last column controls reachable by scrolling`, reach);
  }
  if (w === 390) {
    await evaluate('window.scrollTo(0, 0)');
    await shot('compare-390');
  }
}
await viewport(1440, 900, false);
check('a11y: exactly one h1', (await evaluate(`document.querySelectorAll('h1').length`)) === 1);
check(
  'a11y: every button in main has an accessible name',
  await evaluate(
    `[...document.querySelectorAll('main button')].every((b) => (b.getAttribute('aria-label') || b.textContent).trim() !== '')`,
  ),
);
await evaluate(`localStorage.removeItem('${COMPARE}')`);
await reload();
check(
  'direct route with no items: «Сравнение пусто»',
  (await evaluate(`document.querySelector('h1').textContent`)) === 'Сравнение пусто',
);
const B1_COMPARE =
  '{"items":[{"slug":"pixel-8-128","title":"Google Pixel 8 128 ГБ, Обсидиан","image":{"kind":"catalog-fallback"},"price":53990,"reviewCount":10},{"slug":"realme-gt6-256","title":"realme GT 6 12/256 ГБ, Серебристый","image":{"kind":"catalog-fallback"},"price":44990,"reviewCount":10},{"slug":"oneplus-12-256","title":"OnePlus 12 12/256 ГБ, Сланец","image":{"kind":"url","src":"https://mock-goodcall.supabase.co/storage/v1/object/public/catalog-media/stub/oneplus-live.webp"},"price":64990,"reviewCount":10},{"slug":"iphone-15-128","title":"Apple iPhone 15 128 ГБ, Розовый","image":{"kind":"product-details","colourId":"pink"},"price":79990,"reviewCount":10}]}';
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
const compareImages = () =>
  evaluate(
    `Object.fromEntries([...document.querySelectorAll('.compare-product')].map((p) => [p.querySelector('.compare-product__title').textContent.trim(), p.querySelector('img').getAttribute('src')]))`,
  );
await evaluate(
  `localStorage.removeItem('${CART}'); localStorage.setItem('${COMPARE}', ${JSON.stringify(B1_COMPARE)})`,
);
await reload();
await go('#/compare');
await waitFor(`document.querySelectorAll('.compare-product').length === 4`, 'b1 compare');
const b1Compare = await compareImages();
const b1CompareMismatch = b1Mismatches(b1Compare).filter(([title]) => title in b1Compare);
check(
  'b1 compare: url / colour / local hero / SVG precedence',
  Object.keys(b1Compare).length === 4 && b1CompareMismatch.length === 0,
  JSON.stringify(b1CompareMismatch),
);
check(
  'b1 compare: stored JSON unchanged by render',
  (await evaluate(`localStorage.getItem('${COMPARE}')`)) === B1_COMPARE,
);
await evaluate(
  `document.querySelector('button[aria-label="В корзину: Google Pixel 8 128 ГБ, Обсидиан"]').click()`,
);
await sleep(150);
check(
  'b1 compare → cart copies stored kind unchanged',
  JSON.parse(await evaluate(`localStorage.getItem('${CART}')`)).lines.find(
    (l) => l.productSlug === 'pixel-8-128',
  )?.image.kind === 'catalog-fallback',
);
await reload();
await go('#/compare');
await waitFor(`document.querySelectorAll('.compare-product').length === 4`, 'b1 compare reload');
check(
  'b1 compare: reload keeps stored JSON',
  (await evaluate(`localStorage.getItem('${COMPARE}')`)) === B1_COMPARE,
);
const settleMedia = () =>
  evaluate(
    `Promise.race([Promise.all([...document.querySelectorAll('.compare-product img')].map((img) => { img.loading = 'eager'; return img.complete ? null : new Promise((r) => { img.addEventListener('load', r); img.addEventListener('error', r); }); })), new Promise((r) => setTimeout(r, 6000))])`,
  );
const mediaGeometry = () =>
  evaluate(
    `(() => { const inside = (a, b) => a.left >= b.left - 1 && a.top >= b.top - 1 && a.right <= b.right + 1 && a.bottom <= b.bottom + 1; const apart = (a, b) => a.bottom <= b.top + 1 || b.bottom <= a.top + 1 || a.right <= b.left + 1 || b.right <= a.left + 1; return [...document.querySelectorAll('.compare-product')].map((p) => { const box = p.querySelector('.compare-product__media').getBoundingClientRect(); const media = [...p.querySelectorAll('.compare-product__media picture, .compare-product__media img')].filter((e) => e.getClientRects().length > 0).map((e) => e.getBoundingClientRect()); const text = [p.querySelector('.compare-product__title'), p.querySelector('.compare-product__prices')].map((e) => e.getBoundingClientRect()); const img = p.querySelector('.compare-product__media img').getBoundingClientRect(); return { title: p.querySelector('.compare-product__title').textContent.trim().slice(0, 24), ok: media.length > 0 && media.every((r) => inside(r, box) && text.every((t) => apart(r, t))), box: [Math.round(box.width), Math.round(box.height)], img: [Math.round(img.width), Math.round(img.height)] }; }); })()`,
  );
async function checkMediaGeometry(label, count, shotName) {
  for (const [w, h, m] of [
    [1440, 900, false],
    [1024, 800, false],
    [768, 1000, true],
    [390, 844, true],
  ]) {
    await viewport(w, h, m);
    await reload();
    await waitFor(`document.querySelectorAll('.compare-product').length === ${count}`, label);
    await settleMedia();
    await sleep(150);
    const geometry = await mediaGeometry();
    check(
      `${label} ${w}: every product image is contained by its media box and clear of title/price`,
      geometry.length === count && geometry.every((g) => g.ok),
      JSON.stringify(geometry.filter((g) => !g.ok)),
    );
    if (shotName) {
      await evaluate('window.scrollTo(0, 0)');
      await shot(`${shotName}-${w}`);
    }
  }
  await viewport(1440, 900, false);
}
await checkMediaGeometry('media geometry', 4);
const MIXED_COMPARE = JSON.stringify({
  items: [
    item(
      'iphone-15-pro-128',
      'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
      109990,
      124990,
      4.8,
      12,
      'Apple',
      128,
      'Натуральный титан',
    ),
    item(
      'macbook-air-13-m3-256',
      'Apple MacBook Air 13 M3 8/256 ГБ, Полночь',
      129990,
      null,
      4.9,
      7,
      'Apple',
      256,
      'Полночь',
    ),
  ],
});
await evaluate(`localStorage.setItem('${COMPARE}', ${JSON.stringify(MIXED_COMPARE)})`);
await checkMediaGeometry('mixed smartphone + laptop media geometry', 2, 'compare-mixed');

const STORAGE_COMPARE = JSON.stringify({
  items: [
    item(
      'lenovo-legion-5-16-rtx4060',
      'Lenovo Legion Slim 5 16 AMD Ryzen 7 16 ГБ/1 ТБ RTX 4060, Серый',
      149990,
      164990,
      4.8,
      254,
      'Lenovo',
      1024,
      'Серый',
    ),
    item(
      'macbook-pro-14-m3-512',
      'Apple MacBook Pro 14 M3 8/512 ГБ, Серый космос',
      169990,
      null,
      4.9,
      148,
      'Apple',
      512,
      'Серый космос',
    ),
    item(
      'macbook-air-13-m3-256',
      'Apple MacBook Air 13 M3 8/256 ГБ, Полночь',
      129990,
      null,
      4.9,
      7,
      'Apple',
      256,
      'Полночь',
    ),
    item(
      'iphone-15-pro-128',
      'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
      109990,
      124990,
      4.8,
      12,
      'Apple',
      128,
      'Натуральный титан',
    ),
  ],
});
await evaluate(`localStorage.setItem('${COMPARE}', ${JSON.stringify(STORAGE_COMPARE)})`);
await reload();
await waitFor(`document.querySelectorAll('.compare-product').length === 4`, 'storage compare');
const storageRow = await evaluate(
  `[...document.querySelectorAll('tbody tr')].find((tr) => tr.querySelector('th').textContent === 'Встроенная память') ? [...[...document.querySelectorAll('tbody tr')].find((tr) => tr.querySelector('th').textContent === 'Встроенная память').querySelectorAll('td')].map((td) => td.textContent.replace(/\s/g, ' ')) : null`,
);
check(
  'row Встроенная память Q-19: laptop 1024 → 1 ТБ; 512/256/128 stay in ГБ',
  JSON.stringify(storageRow) === JSON.stringify(['1 ТБ', '512 ГБ', '256 ГБ', '128 ГБ']),
  JSON.stringify(storageRow),
);
check(
  'row Встроенная память Q-19: persisted storage stays numeric (1024/512/256/128)',
  JSON.stringify(
    JSON.parse(await evaluate(`localStorage.getItem('${COMPARE}')`)).items.map((i) => i.storage),
  ) === JSON.stringify([1024, 512, 256, 128]),
);
await checkMediaGeometry('storage 1 ТБ compare media geometry', 4, 'compare-storage');

await evaluate(`localStorage.removeItem('${CART}'); localStorage.removeItem('${COMPARE}')`);

check('no uncaught errors', consoleErrors.length === 0, consoleErrors.join(' ; '));
await cdp.close();
await browser.close();
report(results);

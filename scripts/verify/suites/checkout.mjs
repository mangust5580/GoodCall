import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';
import { writeFileSync } from 'node:fs';

const OUT = outputDir();
const BASE = appBase();
const MOCK_HOST = 'mock-goodcall.supabase.co';
const CART = 'goodcall.cart.v1';
const CITY = 'goodcall.city.v1';
const results = [];

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
    rows = slug ? PRODUCTS.filter((p) => `eq.${p.slug}` === slug) : PRODUCTS;
  }
  return accept.includes('vnd.pgrst.object') ? (rows[0] ?? null) : rows;
}

const SEED = {
  lines: [
    {
      id: 'iphone-15-pro-128',
      productSlug: 'iphone-15-pro-128',
      title: 'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
      image: { kind: 'catalog-fallback' },
      price: 109990,
      oldPrice: 124990,
      quantity: 1,
      selected: true,
    },
    {
      id: 'iphone-15-128|black|256',
      productSlug: 'iphone-15-128',
      title: 'Apple iPhone 15 128 ГБ',
      variant: 'Чёрный · 256 ГБ',
      image: { kind: 'product-details', colourId: 'black' },
      price: 79990,
      oldPrice: 84990,
      quantity: 2,
      selected: true,
    },
    {
      id: 'galaxy-s24-256',
      productSlug: 'galaxy-s24-256',
      title: 'Samsung Galaxy S24 256 ГБ, Фиолетовый',
      image: { kind: 'catalog-fallback' },
      price: 75990,
      quantity: 1,
      selected: true,
    },
  ],
};

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
const seed = (lines) =>
  evaluate(`localStorage.setItem('${CART}', ${JSON.stringify(JSON.stringify(lines))})`);
const cartRaw = () => evaluate(`localStorage.getItem('${CART}')`);
const cartBadge = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/cart"] .site-header__badge')?.textContent ?? null`,
  );
const overflow = () =>
  evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
const active = () =>
  evaluate(
    `document.activeElement?.id || document.activeElement?.getAttribute('name') || document.activeElement?.tagName`,
  );
const errorsShown = () =>
  evaluate(
    `[...document.querySelectorAll('.checkout-form .ui-field__error')].map((e) => e.textContent)`,
  );
const submit = async () => {
  await evaluate(`document.querySelector('.checkout-summary__action').click()`);
  await sleep(250);
};
const statusText = () =>
  evaluate(`document.querySelector('.checkout-summary__status')?.textContent ?? null`);
async function typeInto(id, text) {
  await evaluate(
    `(() => { const el = document.getElementById(${JSON.stringify(id)}); el.focus(); el.select?.(); })()`,
  );
  await send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Backspace',
    code: 'Backspace',
    windowsVirtualKeyCode: 8,
  });
  await send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Backspace',
    code: 'Backspace',
    windowsVirtualKeyCode: 8,
  });
  await send('Input.insertText', { text });
  await sleep(80);
}
const value = (id) => evaluate(`document.getElementById(${JSON.stringify(id)})?.value ?? null`);
const money = (sel) =>
  `(document.querySelector(${JSON.stringify(sel)})?.textContent ?? '').replace(/\\s/g, '')`;

await send('Runtime.enable');
await send('Page.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: `*${MOCK_HOST}*` }] });
await viewport(1440, 900, false);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);
await evaluate(`localStorage.removeItem('${CART}'); localStorage.removeItem('${CITY}')`);
await seed(SEED);
await reload();

await go('#/cart');
await waitFor(`document.querySelector('.cart-summary')`, 'cart');
check(
  'cart: selected lines → CTA is link to #/checkout',
  await evaluate(
    `(() => { const a = document.querySelector('.cart-summary__action'); return a.tagName === 'A' && a.getAttribute('href') === '#/checkout' && a.textContent === 'Оформить заказ'; })()`,
  ),
);
check(
  'cart: line images render via extracted CartLineMedia',
  await evaluate(`document.querySelectorAll('.cart-line .cart-line__image').length === 3`),
);
const cartTotal = await evaluate(money('.cart-summary__row--total dd'));
const cartGoods = await evaluate(
  `[...document.querySelectorAll('.cart-summary__row dd')][0].textContent.replace(/\\s/g, '')`,
);
const cartDiscount = await evaluate(
  `[...document.querySelectorAll('.cart-summary__row')].find((r) => r.querySelector('dt').textContent === 'Скидка')?.querySelector('dd').textContent.replace(/\\s/g, '')`,
);
await evaluate(`document.querySelector('.cart-items__toolbar input[type=checkbox]').click()`);
await sleep(200);
check(
  'cart: no selection → CTA disabled button',
  await evaluate(
    `(() => { const a = document.querySelector('.cart-summary__action'); return a.tagName === 'BUTTON' && a.disabled; })()`,
  ),
);
await go('#/checkout');
await waitFor(`document.querySelector('.checkout-unavailable')`, 'unavailable');
check(
  'guard: lines but none selected → no-selection state, no form',
  await evaluate(
    `!document.querySelector('.checkout-form') && document.querySelector('.checkout-unavailable__message').textContent.startsWith('Не выбрано') && document.querySelector('.checkout-unavailable__action').getAttribute('href') === '#/cart' && document.querySelectorAll('h1').length === 1`,
  ),
);
check(
  'guard: no auto-select',
  (await cartRaw()).includes('"selected":false') && !(await cartRaw()).includes('"selected":true'),
);
await seed({ lines: SEED.lines.map((l, i) => ({ ...l, selected: i !== 2 })) });
await reload();
await go('#/cart');
await waitFor(`document.querySelector('.cart-summary__action[href]')`, 'cart cta');
const cartTotal2 = await evaluate(money('.cart-summary__row--total dd'));
await evaluate(`document.querySelector('.cart-summary__action').click()`);
await sleep(500);
check(
  'handoff: CTA navigates to #/checkout',
  (await evaluate(`location.hash`)) === '#/checkout' &&
    (await evaluate(`Boolean(document.querySelector('.checkout-form'))`)),
);
check(
  'checkout: one h1 (visually hidden) "Оформление заказа"',
  await evaluate(
    `document.querySelectorAll('h1').length === 1 && document.querySelector('h1').textContent === 'Оформление заказа' && document.querySelector('h1').classList.contains('ui-visually-hidden')`,
  ),
);
check(
  'checkout: breadcrumb Главная › Оформление заказа',
  await evaluate(
    `[...document.querySelectorAll('.checkout-page__crumb')].map((c) => c.textContent).join('|') === 'Главная|Оформление заказа' && document.querySelector('.checkout-page__crumb-link').getAttribute('href') === '#/'`,
  ),
);
const titles = await evaluate(
  `[...document.querySelectorAll('.checkout-summary .checkout-line__title')].map((t) => t.textContent)`,
);
check(
  'summary: selected lines only (2 of 3)',
  titles.length === 2 && !titles.some((t) => t.includes('Galaxy')),
  JSON.stringify(titles),
);
check(
  'summary: variant + quantity shown',
  await evaluate(
    `[...document.querySelectorAll('.checkout-line')][1].textContent.includes('Чёрный · 256 ГБ') && [...document.querySelectorAll('.checkout-line')][1].textContent.includes('× 2')`,
  ),
);
check(
  'summary: header count "(3 товара)"',
  (await evaluate(`document.querySelector('.checkout-summary__count').textContent`)) ===
    '(3 товара)',
  await evaluate(`document.querySelector('.checkout-summary__count').textContent`),
);
const coTotal = await evaluate(money('.checkout-summary__row--total dd'));
check('summary: К оплате equals Cart Итого', coTotal === cartTotal2, `${coTotal} vs ${cartTotal2}`);
check(
  'summary: line total 2×79990',
  (await evaluate(
    `[...document.querySelectorAll('.checkout-line__total')][1].textContent.replace(/\\s/g, '')`,
  )) === '159980₽',
);
check(
  'summary: Товары / Скидка values',
  (await evaluate(
    `[...document.querySelectorAll('.checkout-summary__row dd')].map((d) => d.textContent.replace(/\\s/g, '')).join('|')`,
  )) === '294970₽|−25000₽|269970₽',
  await evaluate(
    `[...document.querySelectorAll('.checkout-summary__row dd')].map((d) => d.textContent.replace(/\\s/g, '')).join('|')`,
  ),
);
check(
  'summary: no bonus/promo/delivery/bonus-card rows',
  await evaluate(
    `!/Бонус|Промокод|Доставка|Начислим/.test(document.querySelector('.checkout-summary').textContent)`,
  ),
);
check(
  'summary: protection note present',
  await evaluate(
    `document.querySelector('.checkout-summary__note-title')?.textContent === 'Ваши данные защищены'`,
  ),
);
check(
  'page: two delivery methods, courier default (Pickup A contract)',
  await evaluate(
    `(() => { const r = [...document.querySelectorAll('input[name="checkout-delivery-method"]')]; return r.length === 2 && r[0].value === 'courier' && r[0].checked && r[1].value === 'pickup' && !r[1].checked; })()`,
  ),
);
check(
  'page: payment options 4, none preselected',
  await evaluate(
    `document.querySelectorAll('input[name="checkout-payment"]').length === 4 && ![...document.querySelectorAll('input[name="checkout-payment"]')].some((i) => i.checked)`,
  ),
);
check(
  'page: payment marks МИР/СБП only',
  (await evaluate(
    `[...document.querySelectorAll('.checkout-option__mark')].map((m) => m.alt).join(',')`,
  )) === 'МИР,СБП,МИР',
);
check(
  'page: date defaults to Завтра, 7 options',
  await evaluate(
    `document.getElementById('checkout-deliveryDate').textContent.startsWith('Завтра, ')`,
  ),
  await evaluate(`document.getElementById('checkout-deliveryDate').textContent`),
);
check(
  'page: fields start empty (no specimen data)',
  await evaluate(
    `['checkout-firstName','checkout-lastName','checkout-phone','checkout-email','checkout-street','checkout-house'].every((id) => document.getElementById(id).value === '')`,
  ),
);
check('page: city empty without stored city', (await value('checkout-city')) === '');
check(
  'page: BenefitsStrip present',
  await evaluate(
    `document.querySelectorAll('.checkout-benefits .benefits-strip__item').length === 4`,
  ),
);
check(
  'a11y: every form control labelled',
  await evaluate(
    `[...document.querySelectorAll('.checkout-form input:not([type=radio]), .checkout-form textarea, .checkout-form button[role=combobox]')].every((el) => el.labels?.length > 0 || document.querySelector('label[for="' + el.id + '"]'))`,
  ),
);
check(
  'a11y: radio groups inside fieldset with legend',
  await evaluate(
    `[...document.querySelectorAll('.checkout-form input[type=radio]')].every((r) => r.closest('fieldset')?.querySelector('legend')?.textContent.trim().length > 0)`,
  ),
);
check(
  'a11y: required attr on required text inputs',
  await evaluate(
    `['checkout-firstName','checkout-lastName','checkout-phone','checkout-email','checkout-city','checkout-street','checkout-house'].every((id) => document.getElementById(id).required)`,
  ),
);

const before = await cartRaw();
await submit();
const errs1 = await errorsShown();
check('validation: empty submit → 9 errors', errs1.length === 9, JSON.stringify(errs1));
check(
  'validation: focus → first invalid (Имя)',
  (await active()) === 'checkout-firstName',
  await active(),
);
check(
  'validation: aria-invalid + describedby → error',
  await evaluate(
    `(() => { const el = document.getElementById('checkout-firstName'); const d = el.getAttribute('aria-describedby'); return el.getAttribute('aria-invalid') === 'true' && d && document.getElementById(d)?.textContent === 'Укажите имя'; })()`,
  ),
);
check(
  'validation: radio group errors described on fieldset',
  await evaluate(
    `document.getElementById('checkout-deliverySlot').getAttribute('aria-describedby') === 'checkout-deliverySlot-error' && document.getElementById('checkout-payment').getAttribute('aria-describedby') === 'checkout-payment-error'`,
  ),
);
check(
  'validation: invalid submit does not navigate (stays on #/checkout)',
  (await evaluate(`location.hash`)) === '#/checkout',
);
await shot('checkout-1440-errors');
await typeInto('checkout-firstName', 'Анна');
await typeInto('checkout-lastName', 'Петрова');
check('validation: live error clears after fix', !(await errorsShown()).includes('Укажите имя'));
await submit();
check('validation: partial → focus Телефон', (await active()) === 'checkout-phone', await active());
await typeInto('checkout-phone', '99912');
check(
  'phone: mask applied',
  (await value('checkout-phone')).startsWith('+7 (999) 12'),
  await value('checkout-phone'),
);
await submit();
check(
  'phone: incomplete → format error + focus',
  (await errorsShown()).some((e) => e.startsWith('Введите номер полностью')) &&
    (await active()) === 'checkout-phone',
);
await typeInto('checkout-phone', '9991234567');
check(
  'phone: complete masked value',
  (await value('checkout-phone')) === '+7 (999) 123-45-67',
  await value('checkout-phone'),
);
await typeInto('checkout-email', 'anna@mail');
await submit();
check(
  'email: invalid format error + focus',
  (await errorsShown()).some((e) => e.startsWith('Проверьте e-mail')) &&
    (await active()) === 'checkout-email',
);
await typeInto('checkout-email', 'anna@mail.ru');
await submit();
check('address: missing → focus Город', (await active()) === 'checkout-city', await active());
check(
  'address: city/street/house errors',
  ['Укажите город', 'Укажите улицу', 'Укажите дом'].every((e) => errs1.includes(e)) &&
    (await errorsShown()).includes('Укажите город'),
);
await typeInto('checkout-city', 'Москва');
await typeInto('checkout-street', 'Ленинский проспект');
await typeInto('checkout-house', '12');
await submit();
check(
  'slot: missing → focus first slot radio',
  (await evaluate(`document.activeElement?.name`)) === 'checkout-delivery-slot',
);
check(
  'slot + payment errors shown',
  (await errorsShown()).includes('Выберите интервал доставки') &&
    (await errorsShown()).includes('Выберите способ оплаты'),
);
await evaluate(`document.querySelectorAll('input[name="checkout-delivery-slot"]')[1].click()`);
await sleep(100);
await submit();
check(
  'payment: missing → focus first payment radio',
  (await evaluate(`document.activeElement?.name`)) === 'checkout-payment',
);
await evaluate(`document.querySelectorAll('input[name="checkout-payment"]')[1].click()`);
await sleep(100);
await submit();
await sleep(400);
check(
  'valid: placement navigates to #/order-confirmation (replaces D1 status)',
  (await evaluate(`location.hash`)) === '#/order-confirmation',
);
check(
  'valid: demo order stored in session',
  await evaluate(
    `/^GC-\\d{8}-[0-9A-Z]{4}$/.test(JSON.parse(sessionStorage.getItem('goodcall.lastOrder.v1') ?? '{}').number ?? '')`,
  ),
);
check(
  'valid: only selected lines removed (unselected Galaxy remains)',
  await evaluate(
    `JSON.stringify(JSON.parse(localStorage.getItem('${CART}')).lines.map((l) => l.id)) === JSON.stringify(['galaxy-s24-256'])`,
  ),
);
check(
  'badge: shell cart count = remaining unselected units (1)',
  (await cartBadge()) === '1',
  await cartBadge(),
);
await seed({ lines: SEED.lines.map((l, i) => ({ ...l, selected: i !== 2 })) });
await reload();
await go('#/checkout');

await reload();
check(
  'reload: #/checkout direct entry works',
  await evaluate(
    `location.hash === '#/checkout' && Boolean(document.querySelector('.checkout-form'))`,
  ),
);
await send('Page.navigate', { url: `${BASE}#/checkout` });
await sleep(1300);
check(
  'direct: fresh navigation renders checkout',
  await evaluate(`Boolean(document.querySelector('.checkout-form'))`),
);
await go('#/cart');
await go('#/checkout');
await evaluate(`history.back()`);
await sleep(500);
check('back: browser back returns to #/cart', (await evaluate(`location.hash`)) === '#/cart');

await evaluate(
  `localStorage.setItem('${CITY}', JSON.stringify({ fiasId: '93b3df57-4c89-44df-ac42-96f05e9cd3b9', name: 'Казань', region: 'Республика Татарстан' }))`,
);
await reload();
await go('#/checkout');
check(
  'city: prefilled from stored Location city',
  (await value('checkout-city')) === 'Казань',
  await value('checkout-city'),
);
await evaluate(`localStorage.removeItem('${CITY}')`);

const widths = [
  [1920, 1080, false],
  [1440, 900, false],
  [1280, 900, false],
  [1024, 800, false],
  [1023, 800, true],
  [768, 1000, true],
  [480, 900, true],
  [390, 844, true],
  [320, 640, true],
];
for (const [w, h, m] of widths) {
  await viewport(w, h, m);
  await reload();
  await go('#/checkout');
  await waitFor(`document.querySelector('.checkout-form')`, `resp ${w}`);
  const geo = await evaluate(
    `(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); const f = r('.checkout-form'), s = r('.checkout-summary'), b = r('.checkout-benefits'); return { fR: f.right, fB: f.bottom, sL: s.left, sT: s.top, sB: s.bottom, sR: s.right, bT: b.top, bL: b.left, bR: b.right, fL: f.left, sW: s.width, fW: f.width, fT: f.top }; })()`,
  );
  const layoutOk =
    w >= 1024
      ? geo.sL > geo.fR &&
        geo.bT >= Math.max(geo.fB, geo.sB) &&
        Math.abs(geo.bL - geo.fL) < 1 &&
        Math.abs(geo.bR - geo.sR) < 1
      : geo.sT >= geo.fB && geo.bT >= geo.sB && Math.abs(geo.sL - geo.fL) < 1;
  check(
    `responsive ${w}: layout ${w >= 1024 ? 'two-column (form | summary, benefits under form)' : 'single column form → summary → benefits'}`,
    layoutOk,
    JSON.stringify(geo),
  );
  check(
    `responsive ${w}: no horizontal overflow`,
    (await overflow()) <= 0,
    String(await overflow()),
  );
  const cramped = await evaluate(
    `[...document.querySelectorAll('.checkout-page *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > document.documentElement.clientWidth + 0.5 || r.left < -0.5); }).length`,
  );
  check(`responsive ${w}: no element outside viewport`, cramped === 0, String(cramped));
  if (w >= 1024)
    check(`responsive ${w}: summary top aligned with first card`, Math.abs(geo.sT - geo.fT) < 1);
  if ([1920, 1440, 1024, 390, 320].includes(w)) await shot(`checkout-${w}`);
}
const FIVE = [
  ...SEED.lines,
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
  {
    id: 'iphone-15-128|pink|128',
    productSlug: 'iphone-15-128',
    title: 'Apple iPhone 15 128 ГБ',
    variant: 'Розовый · 128 ГБ',
    image: { kind: 'product-details', colourId: 'pink' },
    price: 79990,
    oldPrice: 84990,
    quantity: 1,
    selected: true,
  },
].map((l) => ({ ...l, selected: true }));
await seed({ lines: FIVE });
for (const [w, h] of [
  [1920, 1080],
  [1440, 900],
]) {
  await viewport(w, h, false);
  await reload();
  await go('#/checkout');
  await waitFor(`document.querySelectorAll('.checkout-line').length === 5`, 'five lines');
  check(`five-line ${w}: no overflow`, (await overflow()) <= 0);
  await shot(`checkout-${w}-five`);
}
await seed({ lines: [{ ...SEED.lines[0] }] });
await viewport(1920, 1080, false);
await reload();
await go('#/checkout');
await waitFor(`document.querySelectorAll('.checkout-line').length === 1`, 'one line');
check(
  'one-line: summary height content-driven (< 700px)',
  (await evaluate(
    `document.querySelector('.checkout-summary__card').getBoundingClientRect().height`,
  )) < 700,
  String(
    await evaluate(
      `document.querySelector('.checkout-summary__card').getBoundingClientRect().height`,
    ),
  ),
);
await shot('checkout-1920-one');
await seed({ lines: SEED.lines.map((l, i) => ({ ...l, selected: i !== 2 })) });
await viewport(390, 844, true);
await reload();
await go('#/checkout');
await submit();
check('mobile 390: empty submit focuses Имя', (await active()) === 'checkout-firstName');
check(
  'mobile 390: CTA full width of card',
  await evaluate(
    `(() => { const a = document.querySelector('.checkout-summary__action').getBoundingClientRect(); const c = document.querySelector('.checkout-summary__card').getBoundingClientRect(); return c.width - a.width < 50; })()`,
  ),
);
check(
  'mobile 390: slot touch targets ≥ 44px',
  await evaluate(
    `[...document.querySelectorAll('.checkout-slot')].every((s) => s.getBoundingClientRect().height >= 44)`,
  ),
);
await shot('checkout-390-errors');

await viewport(1440, 900, false);
await evaluate(`localStorage.removeItem('${CART}')`);
await reload();
await go('#/checkout');
check(
  'guard: empty cart → empty state + link to cart',
  await evaluate(
    `!document.querySelector('.checkout-form') && document.querySelector('.checkout-unavailable__message').textContent.startsWith('В корзине пока нет') && document.querySelector('.checkout-unavailable__action').getAttribute('href') === '#/cart'`,
  ),
);
await shot('checkout-1440-empty', false);
await go('#/cart');
check(
  'regression: empty cart still Cart A empty state',
  await evaluate(`Boolean(document.querySelector('.cart-empty'))`),
);

await go('#/search?q=iPhone');
await waitFor(`document.querySelector('.search-row__actions button')`, 'search live');
await evaluate(
  `[...document.querySelectorAll('.search-row__actions button')].find((b) => b.textContent.includes('В корзину')).click()`,
);
await sleep(250);
check(
  'regression: Search → cart add updates badge',
  (await cartBadge()) === '1',
  await cartBadge(),
);
await go('#/catalog/smartphones');
await waitFor(`document.querySelector('.product-card__link')`, 'catalog live');
await evaluate(
  `[...document.querySelectorAll('.catalog-grid .product-card')].find((c) => c.textContent.includes('Galaxy')).querySelector('.product-card__cart').click()`,
);
await sleep(250);
check('regression: Catalog → cart add', (await cartBadge()) === '2', await cartBadge());
await go('#/cart');
check(
  'regression: Cart shows 2 lines with CTA link',
  await evaluate(
    `document.querySelectorAll('.cart-line').length === 2 && document.querySelector('.cart-summary__action').tagName === 'A'`,
  ),
);
await go('#/checkout');
check(
  'regression: new lines flow into checkout',
  await evaluate(`document.querySelectorAll('.checkout-line').length === 2`),
);
await go('#/favorites');
await sleep(300);
check(
  'regression: favourites page renders',
  await evaluate(`Boolean(document.querySelector('.favorites-page'))`),
);
check('no uncaught errors', consoleErrors.length === 0, consoleErrors.join(' ; '));
await evaluate(`localStorage.removeItem('${CART}')`);

await cdp.close();
await browser.close();
report(results);

import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';
import { writeFileSync } from 'node:fs';

const OUT = outputDir();
const BASE = appBase();
const CART = 'goodcall.cart.v1';
const ORDER = 'goodcall.lastOrder.v1';
const results = [];
const LINES = [
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
    selected: false,
  },
];

const browser = await launchBrowser();
const cdp = await browser.newPage();
const { send } = cdp;
const errors = [];
cdp.onEvent((msg) => {
  if (msg.method === 'Fetch.requestPaused')
    send('Fetch.fulfillRequest', {
      requestId: msg.params.requestId,
      responseCode: 200,
      responseHeaders: [
        { name: 'Access-Control-Allow-Origin', value: '*' },
        { name: 'Content-Type', value: 'application/json' },
      ],
      body: Buffer.from('[]').toString('base64'),
    });
  if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text);
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error')
    errors.push(msg.params.args.map((a) => a.value).join(' '));
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
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
async function viewport(width, height, mobile) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await sleep(250);
}
async function key(k, code = k, vk = 0) {
  await send('Input.dispatchKeyEvent', {
    type: 'rawKeyDown',
    key: k,
    code,
    windowsVirtualKeyCode: vk,
  });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk });
  await sleep(60);
}
async function setField(id, text) {
  await evaluate(
    `(() => { const el = document.getElementById(${JSON.stringify(id)}); el.focus(); el.select?.(); })()`,
  );
  await key('Backspace', 'Backspace', 8);
  if (text !== '') await send('Input.insertText', { text });
  await sleep(60);
}
async function shot(name) {
  const s = await evaluate(
    `({ w: document.documentElement.clientWidth, h: document.documentElement.scrollHeight })`,
  );
  const r = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: s.w, height: s.h, scale: 1 },
  });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, 'base64'));
}
const hash = () => evaluate('location.hash');
const stored = () => evaluate(`JSON.parse(sessionStorage.getItem('${ORDER}') ?? 'null')`);
const cartIds = () =>
  evaluate(`JSON.parse(localStorage.getItem('${CART}') ?? '{"lines":[]}').lines.map((l) => l.id)`);
const badge = () =>
  evaluate(
    `document.querySelector('.site-header__action[href="#/cart"] .site-header__badge')?.textContent ?? null`,
  );
const text = (sel) =>
  evaluate(`document.querySelector(${JSON.stringify(sel)})?.textContent ?? null`);
const overflow = () =>
  evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
async function reload() {
  await send('Page.reload', {});
  await sleep(1300);
}
async function seedAndOpenCheckout() {
  await evaluate(
    `localStorage.setItem('${CART}', ${JSON.stringify(JSON.stringify({ lines: LINES }))}); localStorage.removeItem('goodcall.city.v1'); window.__orderWrites = 0; window.__cartWrites = 0;`,
  );
  await reload();
  await evaluate(`location.hash = '#/cart'`);
  await sleep(500);
  await evaluate(`location.hash = '#/checkout'`);
  await sleep(600);
}
async function fillContact(payIndex) {
  await setField('checkout-firstName', 'Анна');
  await setField('checkout-lastName', 'Петрова');
  await setField('checkout-phone', '9991234567');
  await setField('checkout-email', 'anna@mail.ru');
  await evaluate(
    `document.querySelectorAll('input[name="checkout-payment"]')[${payIndex}].click()`,
  );
  await sleep(60);
}

await send('Runtime.enable');
await send('Page.enable');
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `(() => { const set = Storage.prototype.setItem; window.__orderWrites = 0; window.__cartWrites = 0; Storage.prototype.setItem = function (k, v) { if (window.__blockSession && this === window.sessionStorage) throw new Error('blocked'); if (this === window.sessionStorage && k === '${ORDER}') window.__orderWrites += 1; if (this === window.localStorage && k === '${CART}') window.__cartWrites += 1; return set.call(this, k, v); }; })();`,
});
await send('Fetch.enable', { patterns: [{ urlPattern: '*mock-goodcall.supabase.co*' }] });
await viewport(1440, 900, false);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);
await evaluate(`sessionStorage.removeItem('${ORDER}')`);

await evaluate(`location.hash = '#/order-confirmation'`);
await sleep(600);
const cartBeforeDirect = await evaluate(`localStorage.getItem('${CART}')`);
check(
  'direct route without order → empty state h1 «Заказ не найден»',
  (await text('h1')) === 'Заказ не найден' &&
    (await evaluate(`document.querySelectorAll('h1').length`)) === 1,
);
check(
  'empty state: links to catalogue and home, no order content',
  (await evaluate(
    `[...document.querySelectorAll('.order-empty a')].map((a) => a.getAttribute('href')).join('|')`,
  )) === '#/catalog/smartphones|#/' &&
    !(await evaluate(`Boolean(document.querySelector('.order-confirmation'))`)),
);
check(
  'empty state: no cart mutation, no redirect',
  (await evaluate(`localStorage.getItem('${CART}')`)) === cartBeforeDirect &&
    (await hash()) === '#/order-confirmation',
);
await shot('order-empty-1440');

await seedAndOpenCheckout();
const pre = await evaluate(
  `({ titles: [...document.querySelectorAll('.checkout-line__title')].map((t) => t.textContent), rows: [...document.querySelectorAll('.checkout-summary__row dd')].map((d) => d.textContent), date: document.getElementById('checkout-deliveryDate').textContent })`,
);
await fillContact(3);
await setField('checkout-city', 'Москва');
await setField('checkout-street', 'ул. Тверская');
await setField('checkout-house', '18');
await setField('checkout-apartment', '52');
await setField('checkout-order-comment', 'Позвонить заранее');
await evaluate(`document.querySelectorAll('input[name="checkout-delivery-slot"]')[1].click()`);
await sleep(60);
await evaluate(
  `(() => { const b = document.querySelector('.checkout-summary__action'); b.click(); b.click(); b.click(); })()`,
);
await sleep(700);
const order = await stored();
check('courier: navigates to #/order-confirmation', (await hash()) === '#/order-confirmation');
check(
  'double submit: exactly one order save + one cart write',
  (await evaluate('window.__orderWrites')) === 1 && (await evaluate('window.__cartWrites')) === 1,
  `orders=${await evaluate('window.__orderWrites')} cart=${await evaluate('window.__cartWrites')}`,
);
check(
  'order number format GC-YYYYMMDD-XXXX',
  /^GC-\d{8}-[0-9A-Z]{4}$/.test(order?.number ?? ''),
  order?.number,
);
check(
  'order number date part = today',
  order?.number?.slice(3, 11) ===
    (() => {
      const d = new Date();
      return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    })(),
);
check(
  'createdAt valid ISO, recent',
  Math.abs(Date.now() - Date.parse(order?.createdAt ?? '')) < 60000,
);
check(
  'line snapshot = pre-submit selected lines (2, not unselected Galaxy)',
  JSON.stringify(order.lines.map((l) => [l.title, l.quantity, l.price])) ===
    JSON.stringify([
      ['Apple iPhone 15 Pro 128 ГБ, Натуральный титан', 1, 109990],
      ['Apple iPhone 15 128 ГБ', 2, 79990],
    ]) &&
    order.lines[1].variant === 'Чёрный · 256 ГБ' &&
    order.lines[1].image.kind === 'product-details',
);
check(
  'totals snapshot = pre-submit summary',
  JSON.stringify(order.totals) ===
    JSON.stringify({ unitCount: 3, listTotal: 294970, discount: 25000, total: 269970 }),
  JSON.stringify(order.totals),
);
check(
  'courier snapshot: address with кв., ISO date, slot value',
  order.deliveryMethod === 'courier' &&
    order.courier.address === 'Москва, ул. Тверская, 18, кв. 52' &&
    /^\d{4}-\d{2}-\d{2}$/.test(order.courier.date) &&
    order.courier.slot === '14-18' &&
    order.pickupStoreId === undefined,
);
check(
  'snapshot excludes contact, comments, DaData IDs, payment status',
  !/Анна|Петрова|anna@|9991234567|Позвонить|FiasId|fias|status|paid|transaction/i.test(
    JSON.stringify(order),
  ) &&
    Object.keys(order).sort().join(',') ===
      'courier,createdAt,deliveryMethod,lines,number,payment,totals',
  JSON.stringify(order),
);
check('payment stored as method value only', order.payment === 'cash');
check(
  'cart: only ordered selected lines removed; unselected remains',
  JSON.stringify(await cartIds()) === JSON.stringify(['galaxy-s24-256']),
);
check('cart badge updated to remaining units (1)', (await badge()) === '1', await badge());
check(
  'h1 «Спасибо! Ваш заказ оформлен» receives focus',
  (await text('h1')) === 'Спасибо! Ваш заказ оформлен' &&
    (await evaluate('document.activeElement?.id')) === 'order-confirmation-title' &&
    (await evaluate(`document.querySelectorAll('h1').length`)) === 1,
);
check(
  'lead is demo-qualified',
  (await text('.order-confirmation__lead')) ===
    'Это демонстрационный заказ. Он сохранён только в текущей сессии браузера — оплата и доставка не выполняются.',
);
check(
  'number tile «Номер демо-заказа» + value',
  (await text('.order-confirmation__number-label')) === 'Номер демо-заказа' &&
    (await text('.order-confirmation__number-value')) === order.number,
);
const info = await evaluate(
  `[...document.querySelectorAll('.order-info__item')].map((i) => [i.querySelector('dt').textContent, i.querySelector('dd').textContent])`,
);
check(
  'info dl: date, payment, delivery method, address',
  JSON.stringify(info.map((i) => i[0])) ===
    JSON.stringify(['Дата заказа', 'Способ оплаты', 'Способ получения', 'Адрес доставки']),
  JSON.stringify(info),
);
check('info: payment label only «Наличными»', info[1][1] === 'Наличными');
check(
  'info: courier method + formatted date + slot label',
  info[2][1].startsWith('Курьером') &&
    info[2][1].endsWith(', 14:00 – 18:00') &&
    !info[2][1].includes('Завтра'),
  info[2][1],
);
check(
  'info: created date has no «г.» and has time',
  /^\d{1,2} [а-я]+ \d{4}, \d{2}:\d{2}$/.test(info[0][1]),
  info[0][1],
);
check('info: address with кв.', info[3][1] === 'Москва, ул. Тверская, 18, кв. 52');
check(
  'lines list: 2 items, qty + line totals',
  (await evaluate(
    `[...document.querySelectorAll('.order-line')].map((l) => l.querySelector('.order-line__quantity').textContent + '|' + l.querySelector('.order-line__price').textContent.replace(/\\s/g, '')).join(';')`,
  )) === '1 шт.|109990₽;2 шт.|159980₽',
);
check(
  'composition heading count «(3 товара)»',
  (await text('.order-lines__count')) === '(3 товара)',
);
check(
  'totals dl: Товары / Скидка / К оплате (no delivery row)',
  (await evaluate(
    `[...document.querySelectorAll('.order-totals__row')].map((r) => r.querySelector('dt').textContent + '=' + r.querySelector('dd').textContent.replace(/\\s/g, '')).join('|')`,
  )) === 'Товары (3)=294970₽|Скидка=−25000₽|К оплате=269970₽',
);
check(
  'CTAs: real links to catalogue + home',
  (await evaluate(
    `[...document.querySelectorAll('.order-confirmation__actions a')].map((a) => a.textContent + '>' + a.getAttribute('href')).join('|')`,
  )) === 'Перейти к покупкам>#/catalog/smartphones|На главную>#/',
);
const mainText = await text('main');
check(
  'truthfulness: no free delivery/email/SMS/processing/tracking/payment-status/account link',
  !/Бесплатно|письм|SMS|смс|приступили|обработк|Отследить|отслеж|Оплачено|оплачен|Не оплачено|списан|транзакц|Смотреть заказ|Что дальше/i.test(
    mainText,
  ),
);
check(
  'no account rail; semantic sections',
  await evaluate(
    `document.querySelectorAll('main nav').length === 1 && Boolean(document.querySelector('dl.order-info')) && Boolean(document.querySelector('ul.order-lines__list')) && Boolean(document.querySelector('dl.order-totals__rows'))`,
  ),
);
check(
  'success icon decorative',
  await evaluate(
    `document.querySelector('.order-confirmation__success .ui-icon').getAttribute('aria-hidden') === 'true'`,
  ),
);
await shot('order-courier-1440');
await evaluate('history.back()');
await sleep(600);
check(
  'Back after replace navigation returns to #/cart (not Checkout)',
  (await hash()) === '#/cart',
  await hash(),
);
await evaluate('history.forward()');
await sleep(600);
await reload();
check(
  'refresh restores same confirmation in session',
  (await hash()) === '#/order-confirmation' &&
    (await text('.order-confirmation__number-value')) === order.number,
);

await seedAndOpenCheckout();
await fillContact(1);
await evaluate(
  `document.querySelector('input[name="checkout-delivery-method"][value="pickup"]').click()`,
);
await sleep(100);
await evaluate(
  `document.querySelector('input[name="checkout-pickup-store"][value="moscow-evropeisky"]').click()`,
);
await sleep(80);
await evaluate(`document.querySelector('.checkout-summary__action').click()`);
await sleep(700);
const pickupOrder = await stored();
check(
  'pickup: navigates + stores pickupStoreId, no courier',
  (await hash()) === '#/order-confirmation' &&
    pickupOrder.deliveryMethod === 'pickup' &&
    pickupOrder.pickupStoreId === 'moscow-evropeisky' &&
    pickupOrder.courier === undefined,
);
const pinfo = await evaluate(
  `[...document.querySelectorAll('.order-info__item')].map((i) => [i.querySelector('dt').textContent, i.querySelector('dd').textContent])`,
);
check(
  'pickup info: Самовывоз + store name + «Москва, address» via findStore',
  pinfo[2][0] === 'Способ получения' &&
    pinfo[2][1] === 'Самовывоз' &&
    pinfo[3][0] === 'Магазин самовывоза' &&
    pinfo[3][1] === 'ТЦ «Европейский»Москва, пл. Киевского вокзала, 2',
  JSON.stringify(pinfo),
);
check('pickup payment label «СБП»', pinfo[1][1] === 'СБП');
check(
  'pickup: no date/slot/ETA/price/availability claims',
  !/\d{2}:\d{2} – \d{2}:\d{2}|Сегодня|Завтра|В наличии|Бесплатно|резерв/i.test(
    await text('.order-info'),
  ),
);
await shot('order-pickup-1440');
await evaluate(
  `(() => { const o = JSON.parse(sessionStorage.getItem('${ORDER}')); o.pickupStoreId = 'moscow-unknown'; sessionStorage.setItem('${ORDER}', JSON.stringify(o)); })()`,
);
await reload();
check(
  'pickup: unresolvable store ID degrades to «Магазин самовывоза» (no crash)',
  (await evaluate(
    `[...document.querySelectorAll('.order-info__item')][3].querySelector('dd').textContent`,
  )) === 'Магазин самовывоза' && errors.length === 0,
);

await evaluate(`sessionStorage.setItem('${ORDER}', '{bad json')`);
await reload();
check(
  'malformed storage → removed + empty state',
  (await text('h1')) === 'Заказ не найден' &&
    (await evaluate(`sessionStorage.getItem('${ORDER}')`)) === null,
);
await evaluate(`sessionStorage.setItem('${ORDER}', JSON.stringify({ number: 'X', lines: [] }))`);
await reload();
check(
  'invalid shape → removed + empty state',
  (await text('h1')) === 'Заказ не найден' &&
    (await evaluate(`sessionStorage.getItem('${ORDER}')`)) === null,
);

await seedAndOpenCheckout();
await evaluate('window.__blockSession = true');
await fillContact(0);
await evaluate(
  `document.querySelector('input[name="checkout-delivery-method"][value="pickup"]').click()`,
);
await sleep(80);
await evaluate(
  `document.querySelector('input[name="checkout-pickup-store"][value="moscow-columbus"]').click()`,
);
await sleep(80);
await evaluate(`document.querySelector('.checkout-summary__action').click()`);
await sleep(700);
check(
  'storage blocked: placement still works via in-memory fallback',
  (await hash()) === '#/order-confirmation' &&
    /^GC-/.test((await text('.order-confirmation__number-value')) ?? '') &&
    (await evaluate(`sessionStorage.getItem('${ORDER}')`)) === null,
);
check(
  'storage blocked: cart still cleared once',
  JSON.stringify(await cartIds()) === JSON.stringify(['galaxy-s24-256']),
);
await reload();
check(
  'storage blocked: refresh legitimately falls back to empty state',
  (await text('h1')) === 'Заказ не найден',
);

await seedAndOpenCheckout();
await fillContact(2);
await setField('checkout-city', 'Казань');
await setField('checkout-street', 'ул. Баумана');
await setField('checkout-house', '7к1');
await evaluate(`document.querySelectorAll('input[name="checkout-delivery-slot"]')[0].click()`);
await sleep(60);
await evaluate(`document.querySelector('.checkout-summary__action').click()`);
await sleep(700);
check(
  'courier without apartment: no «кв.»',
  (await evaluate(
    `[...document.querySelectorAll('.order-info__item')][3].querySelector('dd').textContent`,
  )) === 'Казань, ул. Баумана, 7к1',
);
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
  const cols = await evaluate(
    `new Set([...document.querySelectorAll('.order-info__item')].map((i) => Math.round(i.getBoundingClientRect().left))).size`,
  );
  const outside = await evaluate(
    `[...document.querySelectorAll('main *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > document.documentElement.clientWidth + 0.5 || r.left < -0.5); }).length`,
  );
  const expected = w >= 1024 ? 4 : w >= 600 ? 2 : 1;
  check(
    `responsive ${w}: no overflow, info columns ${expected}`,
    (await overflow()) <= 0 && outside === 0 && cols === expected,
    `cols=${cols} outside=${outside}`,
  );
  if (w === 390) await shot('order-courier-390');
}
await evaluate(`location.hash = '#/order-confirmation'`);
await sleep(400);
const orderImages = await evaluate(
  `[...document.querySelectorAll('.order-line')].map((l) => [l.querySelector('.order-line__title').textContent, l.querySelector('img').getAttribute('src')])`,
);
const orderImage = (title) => orderImages.find(([t]) => t === title)?.[1] ?? '';
check(
  'b2 deferral: covered catalog-fallback order line still renders SVG',
  orderImage('Apple iPhone 15 Pro 128 ГБ, Натуральный титан').includes('phone-back'),
  orderImage('Apple iPhone 15 Pro 128 ГБ, Натуральный титан').slice(0, 60),
);
check(
  'b2 deferral: stored order lines carry no slug',
  ((await stored())?.lines ?? []).every((line) => !('productSlug' in line)),
);

check('no uncaught errors', errors.length === 0, errors.join(' ; '));
await cdp.close();
await browser.close();
report(results);

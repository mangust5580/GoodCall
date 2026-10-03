import { launchBrowser, sleep } from '../lib/browser.mjs';
import { appBase, outputDir, report } from '../lib/suite.mjs';
import { writeFileSync } from 'node:fs';

const OUT = outputDir();
const BASE = appBase();
const CART = 'goodcall.cart.v1';
const CITY = 'goodcall.city.v1';
const results = [];
const SEED = {
  lines: [
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
    if (request.url.includes('dadata.ru')) {
      send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
      return;
    }
    send('Fetch.fulfillRequest', {
      requestId,
      responseCode: 200,
      responseHeaders: [...cors(), { name: 'Content-Type', value: 'application/json' }],
      body: Buffer.from('[]').toString('base64'),
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
async function waitFor(expression, label, timeout = 6000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return true;
    await sleep(80);
  }
  return false;
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
async function shot(name) {
  const res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(res.result.data, 'base64'));
}
async function key(k, code = k, vk = 0) {
  await send('Input.dispatchKeyEvent', {
    type: 'rawKeyDown',
    key: k,
    code,
    windowsVirtualKeyCode: vk,
  });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk });
  await sleep(80);
}
async function setField(id, text) {
  await evaluate(
    `(() => { const el = document.getElementById(${JSON.stringify(id)}); el.focus(); el.select?.(); })()`,
  );
  await key('Backspace', 'Backspace', 8);
  if (text !== '') await send('Input.insertText', { text });
  await sleep(60);
}
const value = (id) => evaluate(`document.getElementById(${JSON.stringify(id)})?.value ?? null`);
const attr = (id, a) =>
  evaluate(
    `document.getElementById(${JSON.stringify(id)})?.getAttribute(${JSON.stringify(a)}) ?? null`,
  );
const fieldError = (id) =>
  evaluate(`document.getElementById(${JSON.stringify(`${id}-error`)})?.textContent ?? null`);
const submit = async () => {
  await evaluate(`document.querySelector('.checkout-summary__action').click()`);
  await sleep(250);
};
const placed = async () => {
  await sleep(450);
  return (
    (await evaluate(`location.hash`)) === '#/order-confirmation' &&
    Boolean(await evaluate(`sessionStorage.getItem('goodcall.lastOrder.v1')`))
  );
};
const active = () => evaluate(`document.activeElement?.id ?? ''`);

async function fillValid(cityText) {
  await setField('checkout-firstName', 'Анна');
  await setField('checkout-lastName', 'Петрова');
  await setField('checkout-phone', '9991234567');
  await setField('checkout-email', 'anna@mail.ru');
  if (cityText !== undefined) await setField('checkout-city', cityText);
  await setField('checkout-street', 'Ленинский проспект');
  await setField('checkout-house', '12');
  await evaluate(
    `document.querySelectorAll('input[name="checkout-delivery-slot"]')[0].click(); document.querySelectorAll('input[name="checkout-payment"]')[0].click();`,
  );
  await sleep(100);
}
async function open(city) {
  await evaluate(
    `localStorage.setItem('${CART}', ${JSON.stringify(JSON.stringify(SEED))}); ${city ? `localStorage.setItem('${CITY}', ${JSON.stringify(JSON.stringify(city))})` : `localStorage.removeItem('${CITY}')`}`,
  );
  await reload();
  await go('#/cart');
  await go('#/checkout');
}

await send('Runtime.enable');
await send('Page.enable');
await send('Fetch.enable', {
  patterns: [
    { urlPattern: '*mock-goodcall.supabase.co*' },
    { urlPattern: '*suggestions.dadata.ru*' },
  ],
});
await viewport(1440, 900, false);
await send('Page.navigate', { url: `${BASE}#/` });
await sleep(1500);

await open(null);
check(
  'fallback: city is plain text (no combobox ARIA)',
  (await attr('checkout-city', 'role')) === null &&
    (await attr('checkout-city', 'autocomplete')) === 'address-level2',
);
const matrix = await evaluate(
  `['checkout-firstName','checkout-lastName','checkout-phone','checkout-email','checkout-city','checkout-street','checkout-house','checkout-apartment','checkout-courier-comment','checkout-order-comment'].map((id) => { const e = document.getElementById(id); return [id.replace('checkout-',''), e.type, e.inputMode || '-', e.getAttribute('autocomplete') || '-', e.maxLength].join(':'); }).join(' ')`,
);
check(
  'matrix: types/inputMode/autocomplete/maxLength',
  matrix ===
    'firstName:text:-:given-name:50 lastName:text:-:family-name:60 phone:tel:tel:tel:-1 email:email:email:email:254 city:text:-:address-level2:80 street:text:-:-:120 house:text:-:-:20 apartment:text:-:-:10 courier-comment:textarea:-:-:300 order-comment:textarea:-:-:500',
  matrix,
);
check(
  'comments: visible length hints',
  (await evaluate(`document.getElementById('checkout-courier-comment-hint')?.textContent`)) ===
    'До 300 символов' &&
    (await evaluate(`document.getElementById('checkout-order-comment-hint')?.textContent`)) ===
      'До 500 символов',
);
await fillValid('Москва');
const cases = [
  ['checkout-firstName', 'Анна-Мария', null],
  ['checkout-firstName', "O'Brien", null],
  ['checkout-firstName', 'Jean Paul', null],
  ['checkout-firstName', 'Zoë', null],
  ['checkout-firstName', '12345', 'Имя может содержать буквы, пробел, дефис и апостроф'],
  ['checkout-firstName', '---', 'Имя может содержать буквы, пробел, дефис и апостроф'],
  ['checkout-lastName', 'Салтыков-Щедрин', null],
  ['checkout-lastName', 'Иванов2', 'Фамилия может содержать буквы, пробел, дефис и апостроф'],
  ['checkout-email', 'anna@mail', 'Проверьте e-mail: например, name@example.ru'],
  ['checkout-email', 'anna@mail.ru', null],
  ['checkout-city', 'Ростов-на-Дону', null],
  ['checkout-city', 'Санкт-Петербург', null],
  ['checkout-city', '123', 'Название города может содержать буквы, пробел, дефис и точку'],
  ['checkout-street', '8 Марта', null],
  ['checkout-street', '1-я Тверская-Ямская', null],
  ['checkout-street', '123', 'Укажите название улицы'],
  ['checkout-house', '12А', null],
  ['checkout-house', '10/2', null],
  ['checkout-house', '7к1', null],
  ['checkout-house', '15 стр. 2', null],
  ['checkout-house', '--', 'Укажите номер дома'],
  ['checkout-apartment', '', null],
  ['checkout-apartment', '12А', null],
  ['checkout-apartment', '/', 'Укажите номер квартиры или оставьте поле пустым'],
];
await setField('checkout-house', '--');
await submit();
check(
  'invalid submit enters validation mode without placing an order',
  (await evaluate(`location.hash`)) === '#/checkout' &&
    (await evaluate(`sessionStorage.getItem('goodcall.lastOrder.v1')`)) === null,
);
for (const [id, text, expected] of cases) {
  await setField(id, text);
  const got = await fieldError(id);
  check(
    `field ${id.replace('checkout-', '')} "${text}" → ${expected ?? 'valid'}`,
    got === expected,
    String(got),
  );
}
await setField('checkout-house', '12');
await setField('checkout-street', 'Ленинский проспект');
await setField('checkout-city', 'Москва');
await setField('checkout-firstName', '  Анна   Мария  ');
await setField('checkout-lastName', 'Петрова');
await setField('checkout-apartment', '');
await submit();
check('whitespace: padded name accepted → demo order placed', await placed());
check(
  'placement: stored snapshot carries no contact data',
  !(await evaluate(`sessionStorage.getItem('goodcall.lastOrder.v1')`)).includes('Анна'),
);
await open(null);
await fillValid('Москва');
await setField('checkout-email', '  anna@mail.ru  ');
await submit();
check('email: surrounding whitespace accepted → demo order placed', await placed());
await open(null);
await fillValid('Москва');
await setField('checkout-phone', '+7 999 123 45 67');
check(
  'phone: pasted "+7 999 123 45 67" normalizes via mask',
  (await value('checkout-phone')) === '+7 (999) 123-45-67',
  await value('checkout-phone'),
);
await setField('checkout-phone', '+79991234567');
check(
  'phone: pasted "+79991234567" normalizes via mask',
  (await value('checkout-phone')) === '+7 (999) 123-45-67',
  await value('checkout-phone'),
);
await setField('checkout-phone', 'abc');
check(
  'phone: letters not accepted by mask',
  !/[a-z]/i.test(await value('checkout-phone')),
  await value('checkout-phone'),
);
await setField('checkout-phone', '99912');
await submit();
check(
  'phone: incomplete rejected + focus',
  (await fieldError('checkout-phone')) === 'Введите номер полностью: +7 (XXX) XXX-XX-XX' &&
    (await active()) === 'checkout-phone',
);
await setField('checkout-phone', '9991234567');
await setField('checkout-courier-comment', 'а'.repeat(400));
check(
  'comment: maxLength 300 enforced by browser',
  (await value('checkout-courier-comment')).length === 300,
);
await setField('checkout-courier-comment', '');
check(
  'radio groups intact',
  await evaluate(
    `document.querySelectorAll('fieldset#checkout-deliverySlot input[type=radio]').length === 3 && document.querySelectorAll('fieldset#checkout-payment input[type=radio]').length === 4`,
  ),
);
check(
  'date select labelled',
  await evaluate(
    `document.querySelector('label[for="checkout-deliveryDate"]')?.textContent === 'Дата' && document.getElementById('checkout-deliveryDate').getAttribute('role') === 'combobox'`,
  ),
);
await submit();
check('comment: optional empty OK → demo order placed', await placed());
check(
  'placement removed the ordered (selected) line from the cart',
  JSON.parse(await evaluate(`localStorage.getItem('${CART}')`)).lines.length === 0,
);
check('no uncaught errors', consoleErrors.length === 0, consoleErrors.join(' ; '));
await cdp.close();
await browser.close();
report(results);

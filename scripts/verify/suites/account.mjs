import { register } from 'node:module';

import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { launchBrowser } from '../lib/browser.mjs';
import { openPage } from '../lib/page.mjs';
import { appBase, outputDir, reportCounts } from '../lib/suite.mjs';

register(new URL('../lib/ts-hook.mjs', import.meta.url));
const { accountProfileErrors } = await import(
  new URL('../../../src/commerce/account/accountProfile.ts', import.meta.url).href
);
const { DEMO_STORES } = await import(
  new URL('../../../src/commerce/shops/shopData.ts', import.meta.url).href
);
const { STOREFRONT_PAYMENT_OPTIONS } = await import(
  new URL('../../../src/commerce/storefront/storefrontFacts.ts', import.meta.url).href
);

const BASE = appBase();
const SHOTS = outputDir();
const ACCOUNT = 'goodcall.account.v1';
const CART = 'goodcall.cart.v1';
const FAVORITES = 'goodcall.favorites.v1';
const COMPARE = 'goodcall.compare.v1';
const CITY = 'goodcall.city.v1';
const ORDER = 'goodcall.lastOrder.v1';
const ORDER_NUMBER = 'GC-20261007-DEMO';
const ORDER_TOTAL_TEXT = '159 980 ₽';

const CART_VALUE = JSON.stringify({
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
const favorite = (slug, title, price) => ({
  slug,
  title,
  image: { kind: 'catalog-fallback' },
  price,
});
const FAVORITES_VALUE = JSON.stringify({
  items: [
    favorite('galaxy-s24-128', 'Samsung Galaxy S24 128 ГБ, Фиолетовый', 75990),
    favorite('pixel-8-128', 'Google Pixel 8 128 ГБ, Обсидиан', 53990),
  ],
});
const compareItem = (slug, title, price) => ({
  slug,
  title,
  image: { kind: 'catalog-fallback' },
  price,
  reviewCount: 10,
});
const COMPARE_VALUE = JSON.stringify({
  items: [
    compareItem('galaxy-s24-128', 'Samsung Galaxy S24 128 ГБ, Фиолетовый', 75990),
    compareItem('pixel-8-128', 'Google Pixel 8 128 ГБ, Обсидиан', 53990),
    compareItem('oneplus-12-256', 'OnePlus 12 12/256 ГБ, Сланец', 65990),
  ],
});
const CITY_VALUE = JSON.stringify({ fiasId: 'demo-city', name: 'Казань', region: 'Татарстан' });
const ORDER_VALUE = JSON.stringify({
  number: ORDER_NUMBER,
  createdAt: '2026-10-07T12:30:00.000Z',
  lines: [
    {
      productSlug: 'iphone-15-128',
      title: 'Apple iPhone 15 128 ГБ, Розовый',
      image: { kind: 'catalog-fallback' },
      price: 79990,
      quantity: 2,
    },
  ],
  totals: { unitCount: 2, listTotal: 159980, discount: 0, total: 159980 },
  deliveryMethod: 'pickup',
  pickupStoreId: 'moscow-aviapark',
  payment: 'cash',
});

let passed = 0;
const failures = [];
function check(condition, message) {
  if (condition) passed += 1;
  else failures.push(message);
}

const browser = await launchBrowser({ extraArgs: ['--hide-scrollbars'] });

function newPage(width = 1440, height = 900) {
  return openPage(browser, {
    width,
    height,
    interceptPatterns: [`*${MOCK_SUPABASE_HOST}*`],
    respond: () => ({ status: 200, body: '[]' }),
    onPageError: (message) => failures.push(`pageerror ${message}`),
  });
}

async function open(page, path) {
  await page.goto(`${BASE}#${path}`);
  await page.waitForSelector('main h1');
}

async function fresh(page, path) {
  await page.goto('about:blank');
  await page.goto(`${BASE}#${path}`);
  await page.waitForSelector('main h1');
}

const hash = (page) => page.evaluate(() => location.hash);
const historyLength = (page) => page.evaluate(() => history.length);
const storage = (page) =>
  page.evaluate(
    (keys) => ({
      account: localStorage.getItem(keys.ACCOUNT),
      cart: localStorage.getItem(keys.CART),
      favorites: localStorage.getItem(keys.FAVORITES),
      compare: localStorage.getItem(keys.COMPARE),
      city: localStorage.getItem(keys.CITY),
      order: sessionStorage.getItem(keys.ORDER),
    }),
    { ACCOUNT, CART, FAVORITES, COMPARE, CITY, ORDER },
  );
const shellAccount = (page) =>
  page.evaluate(() => {
    const pick = (selector) => {
      const target = [...document.querySelectorAll(selector)].at(-1);
      return target
        ? { label: target.textContent.trim(), href: target.getAttribute('href') }
        : null;
    };
    return {
      header: pick('.site-header__action'),
      mobile: pick('.mobile-action-bar__link'),
    };
  });
const pageFacts = (page) =>
  page.evaluate(() => {
    const main = document.querySelector('main');
    return {
      mains: document.querySelectorAll('main').length,
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      newsletter: Boolean(document.querySelector('.newsletter-band')),
      footer: Boolean(document.querySelector('footer.site-footer')),
      text: main?.innerText ?? '',
      passwordFields: document.querySelectorAll('input[type="password"]').length,
      inputs: main ? main.querySelectorAll('input, select, textarea').length : 0,
      focused: document.activeElement?.id ?? null,
    };
  });
const shellGeometry = (page) =>
  page.evaluate(() => {
    const rects = (selector) =>
      [...document.querySelectorAll(selector)]
        .filter((el) => el.getBoundingClientRect().width > 0)
        .map((el) => {
          const r = el.getBoundingClientRect();
          const label = el.querySelector('[class$="-label"]') ?? el;
          return {
            left: r.left,
            right: r.right,
            top: r.top,
            clipped:
              label.getBoundingClientRect().width > 1 && label.scrollWidth > label.clientWidth + 1,
          };
        });
    const overlap = (list) =>
      list.some(
        (a, i) => i > 0 && Math.abs(a.top - list[i - 1].top) < 4 && a.left < list[i - 1].right - 1,
      );
    const header = rects('.site-header__action');
    const mobile = rects('.mobile-action-bar__link');
    const vw = document.documentElement.clientWidth;
    return {
      headerOverlap: overlap(header),
      mobileOverlap: overlap(mobile),
      clipped: [...header, ...mobile].some((r) => r.clipped),
      offscreen: [...header, ...mobile].some((r) => r.right > vw + 1 || r.left < -1),
    };
  });

const COURIER_ORDER_VALUE = JSON.stringify({
  number: 'GC-20261008-CUR1',
  createdAt: '2026-10-08T09:15:00.000Z',
  lines: [
    {
      productSlug: 'galaxy-s24-128',
      title: 'Samsung Galaxy S24 128 ГБ, Фиолетовый',
      image: { kind: 'catalog-fallback' },
      price: 75990,
      quantity: 1,
    },
  ],
  totals: { unitCount: 1, listTotal: 75990, discount: 0, total: 75990 },
  deliveryMethod: 'courier',
  courier: { address: 'Москва, Тверская улица, 7, кв. 12', date: '2026-10-09', slot: '10-14' },
  payment: 'card-online',
});
const PICKUP_STORE = DEMO_STORES.find((store) => store.id === 'moscow-aviapark');
const paymentLabel = (value) =>
  STOREFRONT_PAYMENT_OPTIONS.find((option) => option.value === value)?.label;
const railState = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('.account-navigation__row')].map((row) => [
      row.textContent.trim(),
      row.getAttribute('aria-current'),
    ]),
  );
const activeRail = async (page) =>
  (await railState(page))
    .filter(([, current]) => current === 'page')
    .map(([text]) => text)
    .join('|');
const crumbs = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('.account-crumbs li')].map((li) => [
      li.textContent.trim(),
      li.querySelector('a')?.getAttribute('href') ?? null,
      li.getAttribute('aria-current'),
    ]),
  );
const fieldState = (page, label) =>
  page.evaluate((text) => {
    const labelEl = [...document.querySelectorAll('main label')].find(
      (node) => node.textContent.trim() === text,
    );
    const el = labelEl ? document.getElementById(labelEl.htmlFor) : null;
    if (!el) return null;
    const described = (el.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent.trim() ?? '')
      .join(' ');
    return {
      id: el.id,
      tag: el.tagName,
      value: el.tagName === 'INPUT' ? el.value : el.textContent.trim(),
      invalid: el.getAttribute('aria-invalid'),
      described,
    };
  }, label);
const setField = (page, label, value) =>
  page.evaluate(
    ({ text, next }) => {
      const labelEl = [...document.querySelectorAll('main label')].find(
        (node) => node.textContent.trim() === text,
      );
      const el = document.getElementById(labelEl.htmlFor);
      el.focus();
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(el, next);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    { text: label, next: value },
  );
const chooseGender = async (page, label) => {
  const { id } = await fieldState(page, 'Пол');
  await page.click(`[id="${id}"]`);
  await page.click('.ui-select-content__item', { hasText: label });
  await page.waitForTimeout(150);
};
const profileStatus = (page) =>
  page.evaluate(() => document.querySelector('.account-profile__status')?.textContent ?? null);
const submitProfile = async (page) => {
  await page.click('.account-profile__submit');
  await page.waitForTimeout(150);
};
const sessionCard = (page) =>
  page.evaluate(() => {
    const card = document.querySelector('.account-session-order');
    if (!card) return null;
    const facts = Object.fromEntries(
      [...card.querySelectorAll('.account-session-order__fact')].map((fact) => [
        fact.querySelector('dt').textContent.trim(),
        fact.querySelector('dd').textContent.trim(),
      ]),
    );
    const link = card.querySelector('.account-session-order__details');
    return {
      number: card.querySelector('.account-session-order__number').textContent.trim(),
      status: card.querySelector('.ui-chip').textContent.trim(),
      date: card.querySelector('.account-session-order__date').textContent.trim(),
      count: card
        .querySelector('.account-session-order__count')
        .textContent.replace(/\s/g, ' ')
        .trim(),
      total: card.querySelector('.account-session-order__total').textContent.replace(/\s/g, ' '),
      facts,
      href: link.getAttribute('href'),
      linkName: link.textContent.trim(),
      image: Boolean(card.querySelector('img')),
    };
  });
const ordersChrome = (page) =>
  page.evaluate(() => {
    const main = document.querySelector('main');
    const text = main.innerText;
    return {
      cards: document.querySelectorAll('.account-session-order').length,
      pagination: document.querySelectorAll('main .ui-pagination').length,
      filters: /Все заказы|Ожидают оплаты|Отменены/.test(text),
      pay: /Оплатить|Повторить заказ|Распечатать/.test(text),
      orderRows: document.querySelectorAll('main .order-row').length,
      disabled: main.querySelectorAll('[disabled], [aria-disabled="true"]').length,
    };
  });
const enterDemo = async (page) => {
  await page.click('main button', { hasText: 'Войти в демо-аккаунт' });
};
const logoutFromRail = async (page) => {
  await page.click('.account-navigation button', { hasText: 'Выход' });
  await page.waitForFunction(() => location.hash === '#/login');
};

const FORBIDDEN = [
  /Забыли пароль/i,
  /Запомнить меня/i,
  /Создать аккаунт/i,
  /Зарегистрир/i,
  /Google|Apple ID|Facebook|ВКонтакте/,
  /бонус/i,
  /Уведомлени/i,
  /Безопасность|двухфактор|Активные сессии/i,
  /Недавно просмотренн/i,
  /Адреса доставки|Адрес доставки/,
  /Настройки/,
];

const page = await newPage();
await page.goto(`${BASE}#/`);
await page.waitForSelector('main');
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});

let shell = await (async () => {
  await open(page, '/');
  return shellAccount(page);
})();
check(
  shell.header?.label === 'Войти' && shell.header?.href === '#/login',
  `shell signed out: header ${JSON.stringify(shell.header)}`,
);

await fresh(page, '/account');
await page.waitForFunction(() => location.hash === '#/login');
check((await hash(page)) === '#/login', 'route: signed-out #/account → #/login');
let facts = await pageFacts(page);
check(
  facts.mains === 1 && facts.h1.length === 1 && facts.h1[0] === 'Добро пожаловать',
  `login: one main/h1 ${JSON.stringify(facts.h1)}`,
);
const entry = await page.evaluate(() => {
  const button = [...document.querySelectorAll('main button')].find(
    (b) => b.textContent.trim() === 'Войти в демо-аккаунт',
  );
  return {
    button: button ? { tag: button.tagName, type: button.type } : null,
    forms: document.querySelectorAll('main form').length,
    crumbs: [...document.querySelectorAll('.account-crumbs li')].map((li) => li.textContent.trim()),
  };
});
check(
  entry.button?.tag === 'BUTTON' && entry.button.type === 'button',
  `login: entry is a button ${JSON.stringify(entry.button)}`,
);
check(
  facts.passwordFields === 0 && facts.inputs === 0 && entry.forms === 0,
  `login: no credential form (${facts.passwordFields} password, ${facts.inputs} inputs)`,
);
check(
  JSON.stringify(entry.crumbs) === JSON.stringify(['Главная', 'Вход']),
  `login: breadcrumbs ${JSON.stringify(entry.crumbs)}`,
);
check(
  /демо-аккаунт/i.test(facts.text) &&
    /Настоящий аккаунт не создаётся/.test(facts.text) &&
    /пароля/i.test(facts.text) &&
    /в этом браузере/.test(facts.text),
  'login: truthful demo disclosure',
);
check(!/localStorage|mock|fixture|debug/i.test(facts.text), 'login: no developer wording in copy');
const loginForbidden = FORBIDDEN.filter((pattern) => pattern.test(facts.text)).map(String);
check(loginForbidden.length === 0, `login: excluded copy absent ${loginForbidden.join(' ')}`);
check(
  (await page.count('.benefits-strip__item')) === 4 && !/24\/7/.test(facts.text),
  'login: benefits strip truthful',
);
check(facts.newsletter && facts.footer, 'login: Newsletter + Footer follow');
await page.screenshot({ path: `${SHOTS}/login-1440.png`, fullPage: true });

await page.evaluate(
  (values) => {
    localStorage.setItem(values.CART, values.CART_VALUE);
    localStorage.setItem(values.CITY, values.CITY_VALUE);
  },
  { CART, CART_VALUE, CITY, CITY_VALUE },
);
const beforeEntryLength = await historyLength(page);
await page.click('main button', { hasText: 'Войти в демо-аккаунт' });
await page.waitForFunction(
  () => document.querySelector('main h1')?.textContent === 'Личный кабинет',
);
check((await hash(page)) === '#/account', 'entry: lands on #/account');
check(
  (await historyLength(page)) === beforeEntryLength,
  'entry: replace navigation (no extra history entry)',
);
facts = await pageFacts(page);
check(facts.focused === 'account-title', `entry: focus moves to h1 (${facts.focused})`);
check(
  JSON.parse((await storage(page)).account ?? 'null')?.signedIn === true &&
    JSON.parse((await storage(page)).account).version === 1 &&
    Object.keys(JSON.parse((await storage(page)).account)).length === 2,
  `store: minimal account state ${(await storage(page)).account}`,
);
shell = await shellAccount(page);
check(
  shell.header?.label === 'Профиль' && shell.header?.href === '#/account',
  `shell signed in: header ${JSON.stringify(shell.header)}`,
);

const overview = () =>
  page.evaluate(() => {
    const metric = (id) =>
      [...document.querySelectorAll('.account-stats__metric')].find(
        (m) => m.querySelector('.account-stats__name')?.textContent === id,
      );
    const tile = (label) => {
      const m = metric(label);
      return m
        ? {
            value: m.querySelector('.account-stats__value').textContent,
            note: m.querySelector('.account-stats__note')?.textContent ?? null,
            href: m.querySelector('.account-stats__link')?.getAttribute('href') ?? null,
          }
        : null;
    };
    const rail = document.querySelector('nav.account-navigation');
    return {
      greeting: document.querySelector('.account-greeting__title')?.textContent.trim(),
      demo: document.querySelector('.account-greeting')?.innerText.includes('Демо-профиль'),
      orders: tile('Заказы'),
      favorites: tile('Избранное'),
      compare: tile('Сравнение'),
      tiles: document.querySelectorAll('.account-stats__metric').length,
      rail: rail
        ? {
            label: rail.getAttribute('aria-label'),
            rows: [...rail.querySelectorAll('.account-navigation__row')].map((row) => ({
              tag: row.tagName,
              text: row.textContent.trim(),
              href: row.getAttribute('href'),
              current: row.getAttribute('aria-current'),
              weight: getComputedStyle(row).fontWeight,
            })),
          }
        : null,
      details: [...document.querySelectorAll('.account-details__row')].map((row) => [
        row.querySelector('dt').textContent.trim(),
        row.querySelector('dd').textContent.trim(),
      ]),
      emptyOrders: document.querySelector('.account-orders-empty__title')?.textContent ?? null,
      emptyLink: document.querySelector('.account-orders-empty__action')?.getAttribute('href'),
      order: document.querySelector('.account-order')
        ? {
            number: document.querySelector('.account-order__number').textContent,
            total: document
              .querySelector('.account-order__value--total')
              .textContent.replace(/\s/g, ' '),
            link: document.querySelector('.account-order__link').getAttribute('href'),
            linkName: document.querySelector('.account-order__link').textContent,
            status: document.querySelector('.account-order .ui-chip').textContent,
          }
        : null,
      orderCards: document.querySelectorAll('.account-order').length,
      editControls: document.querySelectorAll(
        'main input, main [disabled], main [aria-disabled="true"]',
      ).length,
    };
  });

let view = await overview();
check(
  view.greeting === 'Здравствуйте, Иван!' && view.demo,
  `overview: greeting + Демо-профиль ${view.greeting}`,
);
check(
  view.rail?.label === 'Личный кабинет' &&
    JSON.stringify(view.rail.rows.map((r) => [r.tag, r.text, r.href])) ===
      JSON.stringify([
        ['A', 'Профиль', '#/account'],
        ['A', 'Мои заказы', '#/account/orders'],
        ['A', 'Избранное', '#/favorites'],
        ['A', 'Сравнение', '#/compare'],
        ['BUTTON', 'Выход', null],
      ]),
  `overview: rail rows ${JSON.stringify(view.rail?.rows.map((r) => r.text))}`,
);
check(
  view.rail.rows[0].current === 'page' &&
    view.rail.rows.slice(1).every((r) => r.current === null) &&
    Number(view.rail.rows[0].weight) > Number(view.rail.rows[1].weight),
  'overview: Профиль aria-current=page with non-colour emphasis',
);
check(
  view.tiles === 3 &&
    view.orders?.value === '0' &&
    view.orders.note === 'В этой сессии' &&
    view.favorites?.value === '0 товаров' &&
    view.compare?.value === '0 товаров',
  `overview: empty truthful stats ${JSON.stringify([view.orders, view.favorites, view.compare])}`,
);
check(
  view.favorites.href === '#/favorites' && view.compare.href === '#/compare',
  'overview: stat links to existing Favourites / Compare pages',
);
check(
  view.emptyOrders === 'В этой сессии заказов пока нет' &&
    view.emptyLink === '#/catalog/smartphones' &&
    view.orderCards === 0,
  `overview: honest empty session order state ${view.emptyOrders}`,
);
check(
  JSON.stringify(view.details) ===
    JSON.stringify([
      ['Имя', 'Иван Иванов'],
      ['Телефон', '+7 (900) 000-00-00'],
      ['E-mail', 'demo@goodcall.example'],
      ['Дата рождения', '12.04.1996'],
    ]),
  `overview: read-only demo persona ${JSON.stringify(view.details)}`,
);
check(view.editControls === 0, 'overview: no edit/disabled placeholder controls');
facts = await pageFacts(page);
check(facts.mains === 1 && facts.h1.length === 1, 'overview: one main/h1');
const overviewForbidden = FORBIDDEN.filter((pattern) => pattern.test(facts.text)).map(String);
check(
  overviewForbidden.length === 0 && !/12\s+Всего заказов|2\s?600/.test(facts.text),
  `overview: excluded blocks/copy absent ${overviewForbidden.join(' ')}`,
);
check(facts.overflow <= 0 && facts.newsletter && facts.footer, 'overview 1440: no overflow, shell');
await page.screenshot({ path: `${SHOTS}/account-empty-1440.png`, fullPage: true });

await page.reload();
await page.waitForSelector('main h1');
check(
  (await hash(page)) === '#/account' &&
    (await page.textContent('main h1')) === 'Личный кабинет' &&
    (await pageFacts(page)).focused !== 'account-title',
  'store: sign-in persists across reload (no repeated transition focus)',
);
check(
  (await page.evaluate(() => JSON.stringify(history.state?.usr ?? null))) === 'null',
  'route: one-time transition state cleared from history',
);

await fresh(page, '/login');
await page.waitForFunction(() => location.hash === '#/account');
check((await hash(page)) === '#/account', 'route: signed-in #/login → #/account');
for (const path of ['/account/settings', '/account/anything', '/account/orders/1']) {
  await open(page, path);
  check(
    (await page.textContent('main h1')).trim() === 'Страница не найдена' &&
      (await hash(page)) === `#${path}`,
    `route: ${path} reaches the designed 404`,
  );
}

await page.evaluate(
  (values) => {
    localStorage.setItem(values.FAVORITES, values.FAVORITES_VALUE);
    localStorage.setItem(values.COMPARE, values.COMPARE_VALUE);
    sessionStorage.setItem(values.ORDER, values.ORDER_VALUE);
  },
  { FAVORITES, FAVORITES_VALUE, COMPARE, COMPARE_VALUE, ORDER, ORDER_VALUE },
);
await fresh(page, '/account');
await page.waitForSelector('.account-order');
view = await overview();
check(
  view.favorites.value === '2 товара' && view.compare.value === '3 товара',
  `data: counts from real stores ${view.favorites.value} / ${view.compare.value}`,
);
check(
  view.orders.value === '1' && view.orderCards === 1 && view.emptyOrders === null,
  'data: session order → Заказы 1, exactly one summary',
);
check(
  view.order?.number === `Демо-заказ №${ORDER_NUMBER}` &&
    view.order.total === ORDER_TOTAL_TEXT &&
    view.order.status === 'Оформлен',
  `data: real session order fields ${JSON.stringify(view.order)}`,
);
check(
  view.order.link === '#/order-confirmation' && view.order.linkName.startsWith('Подробнее'),
  'data: Подробнее → #/order-confirmation',
);
await page.screenshot({ path: `${SHOTS}/account-populated-1440.png`, fullPage: true });

await open(page, '/favorites');
await page.waitForSelector('.favorites-grid');
await page.click('.favorites-grid .product-action--favorite');
await page.waitForFunction(() => document.querySelectorAll('.favorites-grid > li').length === 1);
await open(page, '/account');
view = await overview();
check(
  view.favorites.value === '1 товар',
  `flow: favourites change reflects in Account (${view.favorites.value})`,
);

const beforeLogout = await storage(page);
const beforeLogoutLength = await historyLength(page);
await page.click('.account-navigation button', { hasText: 'Выход' });
await page.waitForFunction(() => location.hash === '#/login');
await page.waitForFunction(
  () => document.querySelector('.login-page__status')?.textContent === 'Вы вышли из демо-аккаунта',
);
const afterLogout = await storage(page);
check(afterLogout.account === null, 'logout: clears goodcall.account.v1');
check(
  afterLogout.cart === beforeLogout.cart && afterLogout.cart !== null,
  'logout: cart preserved',
);
check(
  afterLogout.favorites === beforeLogout.favorites && afterLogout.favorites !== null,
  'logout: favourites preserved',
);
check(
  afterLogout.compare === beforeLogout.compare && afterLogout.compare !== null,
  'logout: compare preserved',
);
check(afterLogout.city === CITY_VALUE, 'logout: city preserved');
check(afterLogout.order === ORDER_VALUE, 'logout: session order preserved');
const status = await page.evaluate(() => {
  const el = document.querySelector('.login-page__status');
  return { role: el.getAttribute('role'), focused: document.activeElement?.id };
});
check(
  status.role === 'status' && status.focused === 'login-title',
  `logout: polite status + focus on login h1 ${JSON.stringify(status)}`,
);
check(
  (await historyLength(page)) === beforeLogoutLength,
  'logout: replace navigation (no history loop)',
);
shell = await shellAccount(page);
check(
  shell.header?.label === 'Войти' && shell.header?.href === '#/login',
  'shell: signed out again after logout',
);
await page.reload();
await page.waitForSelector('main h1');
check(
  (await page.evaluate(() => document.querySelector('.login-page__status').textContent)) === '',
  'logout: status is not persisted across reload',
);

for (const raw of [
  '{bad json',
  '{"version":2,"signedIn":true}',
  '{"version":1,"signedIn":"yes"}',
]) {
  await page.evaluate((value) => localStorage.setItem('goodcall.account.v1', value), raw);
  await fresh(page, '/account');
  await page.waitForFunction(() => location.hash === '#/login');
  check(
    (await hash(page)) === '#/login' && (await storage(page)).account === null,
    `store: corrupt state ${raw} recovers signed-out and is removed`,
  );
}

const PROFILE_BASE = {
  firstName: 'Иван',
  lastName: 'Иванов',
  email: 'demo@goodcall.example',
  phone: '+7 (900) 000-00-00',
  birthDate: '1996-04-12',
  gender: 'unspecified',
};
const ruleErrors = (patch) => accountProfileErrors({ ...PROFILE_BASE, ...patch }, '2026-10-08');
check(
  Object.keys(ruleErrors({})).length === 0 &&
    ruleErrors({ birthDate: '2026-10-09' }).birthDate === 'Укажите дату не позже сегодняшней' &&
    ruleErrors({ birthDate: '2026-10-08' }).birthDate === undefined &&
    ruleErrors({ birthDate: '1899-12-31' }).birthDate === 'Укажите корректную дату рождения' &&
    ruleErrors({ birthDate: '2001-02-30' }).birthDate === 'Укажите корректную дату рождения' &&
    ruleErrors({ birthDate: '' }).birthDate === 'Укажите дату рождения' &&
    ruleErrors({ firstName: 'Анна1' }).firstName ===
      'Имя может содержать буквы, пробел, дефис и апостроф' &&
    ruleErrors({ gender: 'other' }).gender !== undefined,
  'validation rules: future/min/invalid birth date, name chars, gender allow-list',
);

await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
for (const path of ['/account/orders', '/account/profile']) {
  await fresh(page, path);
  await page.waitForFunction(() => location.hash === '#/login');
  const lengthBefore = await historyLength(page);
  await enterDemo(page);
  await page.waitForFunction((target) => location.hash === `#${target}`, path);
  await page.waitForSelector('main h1');
  const arrived = await pageFacts(page);
  check(
    arrived.focused === 'account-title' && (await historyLength(page)) === lengthBefore,
    `deep link: signed-out ${path} → login → back to ${path} (focus ${arrived.focused})`,
  );
  await page.waitForTimeout(100);
  check(
    (await page.evaluate(() => JSON.stringify(history.state?.usr ?? null))) === 'null',
    `deep link: ${path} one-time return state cleared`,
  );
  await logoutFromRail(page);
}
await fresh(page, '/login');
await page.evaluate(() => {
  history.replaceState(
    { usr: { accountReturn: '/checkout' }, key: 'probe', idx: 0 },
    '',
    location.href,
  );
});
await page.reload();
await page.waitForSelector('main h1');
await enterDemo(page);
await page.waitForFunction(() => location.hash === '#/account');
await page.waitForSelector('.account-greeting');
check(
  (await hash(page)) === '#/account',
  'deep link: non-allow-listed return falls back to #/account',
);
check((await activeRail(page)) === 'Профиль', 'rail: /account → Профиль active');
const overviewLinks = await page.evaluate(() => ({
  edit: [...document.querySelectorAll('main a')]
    .filter((a) => a.textContent.trim() === 'Редактировать профиль')
    .map((a) => a.getAttribute('href')),
  orders: [...document.querySelectorAll('.account-stats__metric')]
    .find((m) => m.querySelector('.account-stats__name')?.textContent === 'Заказы')
    ?.querySelector('.account-stats__link')
    ?.getAttribute('href'),
  allOrders: /Все заказы/.test(document.querySelector('main').innerText),
}));
check(
  JSON.stringify(overviewLinks.edit) === '["#/account/profile"]' &&
    overviewLinks.orders === '#/account/orders' &&
    !overviewLinks.allOrders,
  `overview: bounded links only ${JSON.stringify(overviewLinks)}`,
);

await open(page, '/account/orders');
check(
  (await page.textContent('main h1')) === 'Мои заказы' && (await activeRail(page)) === 'Мои заказы',
  'orders: h1 + Мои заказы active',
);
check(
  JSON.stringify(await crumbs(page)) ===
    JSON.stringify([
      ['Главная', '#/', null],
      ['Аккаунт', '#/account', null],
      ['Мои заказы', null, 'page'],
    ]),
  `orders: breadcrumbs ${JSON.stringify(await crumbs(page))}`,
);
let ordersView = await ordersChrome(page);
facts = await pageFacts(page);
check(
  ordersView.cards === 0 &&
    /В этой сессии заказов пока нет/.test(facts.text) &&
    /Заказы, оформленные в этой сессии браузера/.test(facts.text) &&
    /не сохраняются после завершения сессии браузера/.test(facts.text) &&
    (await page.getAttribute('.account-orders-empty__action', 'href')) === '#/catalog/smartphones',
  'orders: honest empty session state',
);
check(
  !ordersView.filters &&
    ordersView.pagination === 0 &&
    !ordersView.pay &&
    ordersView.orderRows === 0 &&
    ordersView.disabled === 0,
  `orders: no filters/pagination/pay/reorder/OrderRow/disabled ${JSON.stringify(ordersView)}`,
);
check(
  facts.mains === 1 && facts.h1.length === 1 && facts.overflow <= 0,
  'orders: main/h1/overflow',
);
await page.screenshot({ path: `${SHOTS}/account-orders-empty-1440.png`, fullPage: true });

await page.evaluate((values) => sessionStorage.setItem(values.ORDER, values.ORDER_VALUE), {
  ORDER,
  ORDER_VALUE,
});
await page.reload();
await page.waitForSelector('.account-session-order');
let card = await sessionCard(page);
ordersView = await ordersChrome(page);
check(ordersView.cards === 1, 'orders: exactly one session-order card');
check(
  card.number === `Демо-заказ №${ORDER_NUMBER}` &&
    card.status === 'Оформлен' &&
    /7 октября 2026/.test(card.date) &&
    card.count === '2 товара на сумму' &&
    card.total === ORDER_TOTAL_TEXT &&
    card.image,
  `orders: number/date/count/total ${JSON.stringify(card)}`,
);
check(
  card.facts['Способ оплаты'] === paymentLabel('cash') &&
    card.facts['Способ получения'] === 'Самовывоз' &&
    card.facts['Адрес'] === `${PICKUP_STORE.name}, ${PICKUP_STORE.address}`,
  `orders: pickup payment/fulfilment/address ${JSON.stringify(card.facts)}`,
);
check(
  card.href === '#/order-confirmation' &&
    card.linkName.startsWith('Подробнее') &&
    card.linkName.includes(ORDER_NUMBER),
  `orders: Подробнее → order confirmation with number (${card.linkName})`,
);
check(
  !ordersView.filters && ordersView.pagination === 0 && !ordersView.pay,
  'orders: populated state still without filters/pagination/pay',
);
await page.screenshot({ path: `${SHOTS}/account-orders-populated-1440.png`, fullPage: true });
await page.evaluate((values) => sessionStorage.setItem(values.ORDER, values.COURIER_ORDER_VALUE), {
  ORDER,
  COURIER_ORDER_VALUE,
});
await page.reload();
await page.waitForSelector('.account-session-order');
card = await sessionCard(page);
check(
  card.facts['Способ оплаты'] === paymentLabel('card-online') &&
    card.facts['Способ получения'] === 'Курьером' &&
    card.facts['Адрес'] === 'Москва, Тверская улица, 7, кв. 12' &&
    card.count === '1 товар на сумму',
  `orders: courier mapping ${JSON.stringify(card.facts)}`,
);
await page.evaluate((values) => sessionStorage.setItem(values.ORDER, values.ORDER_VALUE), {
  ORDER,
  ORDER_VALUE,
});

await open(page, '/account/profile');
check(
  (await page.textContent('main h1')) === 'Профиль' && (await activeRail(page)) === 'Профиль',
  'profile: h1 + Профиль active',
);
check(
  JSON.stringify((await crumbs(page)).map(([text]) => text)) ===
    JSON.stringify(['Главная', 'Аккаунт', 'Профиль']),
  'profile: breadcrumbs',
);
const defaults = {
  first: await fieldState(page, 'Имя'),
  last: await fieldState(page, 'Фамилия'),
  email: await fieldState(page, 'E-mail'),
  phone: await fieldState(page, 'Телефон'),
  birth: await fieldState(page, 'Дата рождения'),
  gender: await fieldState(page, 'Пол'),
};
check(
  defaults.first?.value === 'Иван' &&
    defaults.last?.value === 'Иванов' &&
    defaults.email?.value === 'demo@goodcall.example' &&
    defaults.phone?.value === '+7 (900) 000-00-00' &&
    defaults.birth?.value.includes('12.04.1996') &&
    defaults.gender?.value === 'Не указан',
  `profile: persona defaults ${JSON.stringify(defaults)}`,
);
facts = await pageFacts(page);
check(
  (await page.count('main input[type="file"]')) === 0 &&
    !/Изменить фото|Загрузить фото/.test(facts.text) &&
    (await page.count('.account-profile__avatar')) === 1,
  'profile: decorative avatar only, no upload',
);
check(
  (await page.count('main form[novalidate]')) === 1 &&
    (await page.getAttribute('.account-profile__submit', 'type')) === 'submit' &&
    (await profileStatus(page)) === '' &&
    (await page.getAttribute('.account-profile__status', 'role')) === 'status',
  'profile: noValidate form, submit button, empty polite status',
);
check(
  facts.mains === 1 && facts.h1.length === 1 && facts.overflow <= 0,
  'profile: main/h1/overflow',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-profile-default-1440.png`, fullPage: true });

await setField(page, 'Имя', '   ');
await setField(page, 'Фамилия', '');
await setField(page, 'E-mail', 'not-an-email');
await setField(page, 'Телефон', '+7 (900');
await submitProfile(page);
const invalid = {
  first: await fieldState(page, 'Имя'),
  last: await fieldState(page, 'Фамилия'),
  email: await fieldState(page, 'E-mail'),
  phone: await fieldState(page, 'Телефон'),
};
check(
  invalid.first.invalid === 'true' && invalid.first.described.includes('Укажите имя'),
  `validation: required first name ${JSON.stringify(invalid.first)}`,
);
check(
  invalid.last.invalid === 'true' && invalid.last.described.includes('Укажите фамилию'),
  'validation: required last name',
);
check(
  invalid.email.invalid === 'true' &&
    invalid.email.described.includes('Проверьте e-mail: например, name@example.ru'),
  'validation: invalid e-mail',
);
check(
  invalid.phone.invalid === 'true' && invalid.phone.described.includes('Введите номер полностью'),
  `validation: incomplete phone ${JSON.stringify(invalid.phone)}`,
);
check(
  (await page.evaluate(() => document.activeElement?.id)) === invalid.first.id &&
    (await profileStatus(page)) === '' &&
    JSON.parse((await storage(page)).account).profile === undefined,
  'validation: first invalid field focused, nothing saved',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-profile-invalid-1440.png`, fullPage: true });

await setField(page, 'Имя', '  Анна   Мария ');
check((await fieldState(page, 'Имя')).invalid === null, 'validation: editing clears that error');
await setField(page, 'Фамилия', 'Смирнова');
await setField(page, 'E-mail', ' anna@goodcall.example ');
await setField(page, 'Телефон', '+7 (911) 222-33-44');
await chooseGender(page, 'Женский');
await submitProfile(page);
const savedStore = JSON.parse((await storage(page)).account ?? 'null');
check(
  (await profileStatus(page)) === 'Изменения сохранены в этом браузере' &&
    (await page.evaluate(() => document.activeElement?.textContent.trim())) ===
      'Сохранить изменения',
  'save: status shown, focus stays on submit',
);
check(
  JSON.stringify(savedStore) ===
    JSON.stringify({
      version: 1,
      signedIn: true,
      profile: {
        firstName: 'Анна Мария',
        lastName: 'Смирнова',
        email: 'anna@goodcall.example',
        phone: '+7 (911) 222-33-44',
        birthDate: '1996-04-12',
        gender: 'female',
      },
    }),
  `save: normalized profile stored in goodcall.account.v1 ${JSON.stringify(savedStore)}`,
);
check(
  (await fieldState(page, 'Имя')).value === 'Анна Мария' &&
    (await page.textContent('.account-profile__name')).trim() === 'Анна Мария Смирнова',
  'save: form re-baselined, identity block updated',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-profile-saved-1440.png`, fullPage: true });
await setField(page, 'Фамилия', 'Смирнова-Петрова');
check((await profileStatus(page)) === '', 'save: status clears on next edit');
await page.reload();
await page.waitForSelector('.account-profile__form');
check(
  (await fieldState(page, 'Фамилия')).value === 'Смирнова' &&
    (await fieldState(page, 'Пол')).value === 'Женский',
  'save: reload restores the saved profile, unsaved draft discarded',
);

await open(page, '/account');
const integrated = await overview();
check(
  integrated.greeting === 'Здравствуйте, Анна Мария!' &&
    JSON.stringify(integrated.details) ===
      JSON.stringify([
        ['Имя', 'Анна Мария Смирнова'],
        ['Телефон', '+7 (911) 222-33-44'],
        ['E-mail', 'anna@goodcall.example'],
        ['Дата рождения', '12.04.1996'],
      ]),
  `overview: reflects saved profile ${JSON.stringify(integrated)}`,
);
await page.screenshot({ path: `${SHOTS}/account-overview-integrated-1440.png`, fullPage: true });

for (const profile of [
  { ...PROFILE_BASE, email: 'broken' },
  { ...PROFILE_BASE, birthDate: '2999-01-01' },
  { ...PROFILE_BASE, gender: 'robot' },
  'not-an-object',
]) {
  await page.evaluate(
    (value) =>
      localStorage.setItem(
        'goodcall.account.v1',
        JSON.stringify({ version: 1, signedIn: true, profile: value }),
      ),
    profile,
  );
  await fresh(page, '/account');
  await page.waitForSelector('.account-greeting');
  check(
    (await hash(page)) === '#/account' &&
      (await storage(page)).account === '{"version":1,"signedIn":true}' &&
      (await overview()).greeting === 'Здравствуйте, Иван!',
    `store: invalid profile ${JSON.stringify(profile).slice(0, 40)} dropped, still signed in`,
  );
}

await open(page, '/account/profile');
await setField(page, 'Имя', 'Анна');
await submitProfile(page);
await page.evaluate(
  (values) => {
    localStorage.setItem(values.CART, values.CART_VALUE);
    localStorage.setItem(values.FAVORITES, values.FAVORITES_VALUE);
    localStorage.setItem(values.COMPARE, values.COMPARE_VALUE);
    localStorage.setItem(values.CITY, values.CITY_VALUE);
    sessionStorage.setItem(values.ORDER, values.ORDER_VALUE);
  },
  {
    CART,
    CART_VALUE,
    FAVORITES,
    FAVORITES_VALUE,
    COMPARE,
    COMPARE_VALUE,
    CITY,
    CITY_VALUE,
    ORDER,
    ORDER_VALUE,
  },
);
const beforeReset = await storage(page);
check(
  JSON.parse(beforeReset.account).profile?.firstName === 'Анна',
  'logout precondition: edited profile stored',
);
await logoutFromRail(page);
const afterReset = await storage(page);
check(
  afterReset.account === null &&
    afterReset.cart === beforeReset.cart &&
    afterReset.favorites === beforeReset.favorites &&
    afterReset.compare === beforeReset.compare &&
    afterReset.city === beforeReset.city &&
    afterReset.order === beforeReset.order,
  'logout: profile edits reset, cart/favourites/compare/city/session order byte-identical',
);
await enterDemo(page);
await page.waitForFunction(() => location.hash === '#/account');
await page.waitForSelector('.account-greeting');
check(
  (await overview()).greeting === 'Здравствуйте, Иван!',
  'logout: re-entry starts from persona defaults',
);
await open(page, '/account/profile');
check(
  (await fieldState(page, 'Имя')).value === 'Иван' &&
    (await fieldState(page, 'Пол')).value === 'Не указан',
  'logout: profile form back to defaults',
);

await page.goto(`${BASE}?reference=header`);
await page.waitForSelector('.site-header');
const referenceShell = await shellAccount(page);
check(
  referenceShell.header?.label === 'Войти' &&
    referenceShell.header?.href === new URL(BASE).pathname,
  `reference: default shell account ${JSON.stringify(referenceShell.header)}`,
);
await page.close();

for (const [width, height, label] of [
  [1440, 900, 'desktop'],
  [1024, 800, 'compact'],
  [390, 844, 'mobile'],
]) {
  const p = await newPage(width, height);
  await p.goto(`${BASE}#/`);
  await p.waitForSelector('main');
  await p.evaluate(
    (values) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(values.FAVORITES, values.FAVORITES_VALUE);
      localStorage.setItem(values.COMPARE, values.COMPARE_VALUE);
    },
    { FAVORITES, FAVORITES_VALUE, COMPARE, COMPARE_VALUE },
  );
  await open(p, '/login');
  let geometry = await shellGeometry(p);
  let pf = await pageFacts(p);
  check(
    pf.overflow <= 0 && !geometry.headerOverlap && !geometry.mobileOverlap && !geometry.clipped,
    `${label} ${width}: login no overflow / shell collision ${JSON.stringify(geometry)}`,
  );
  if (width === 390) await p.screenshot({ path: `${SHOTS}/login-390.png`, fullPage: true });
  await p.screenshot({ path: `${SHOTS}/shell-signed-out-${width}.png` });
  await p.click('main button', { hasText: 'Войти в демо-аккаунт' });
  await p.waitForFunction(
    () => document.querySelector('main h1')?.textContent === 'Личный кабинет',
  );
  geometry = await shellGeometry(p);
  pf = await pageFacts(p);
  const mobileShell = await shellAccount(p);
  check(
    pf.overflow <= 0 &&
      !geometry.headerOverlap &&
      !geometry.mobileOverlap &&
      !geometry.clipped &&
      !geometry.offscreen &&
      pf.newsletter &&
      pf.footer,
    `${label} ${width}: account no overflow / shell collision ${JSON.stringify(geometry)}`,
  );
  if (width === 390) {
    check(
      mobileShell.mobile?.label === 'Профиль' && mobileShell.mobile?.href === '#/account',
      `mobile: action bar account ${JSON.stringify(mobileShell.mobile)}`,
    );
    const rail = await p.evaluate(() =>
      [...document.querySelectorAll('.account-navigation__row')].map((row) => {
        const r = row.getBoundingClientRect();
        const label = row.querySelector('.account-navigation__label');
        return {
          visible: r.width > 0 && r.left >= 0 && r.right <= document.documentElement.clientWidth,
          clipped: label.scrollWidth > label.clientWidth + 1,
          height: r.height,
        };
      }),
    );
    check(
      rail.length === 5 && rail.every((r) => r.visible && !r.clipped && r.height >= 40),
      `mobile: rail actions reachable, unclipped ${JSON.stringify(rail)}`,
    );
    await p.screenshot({ path: `${SHOTS}/account-empty-390.png`, fullPage: true });
    await p.focus('#account-title');
    const tabStops = [];
    for (let index = 0; index < 5; index += 1) {
      await p.keyboard.press('Tab');
      tabStops.push(
        await p.evaluate(() => {
          const el = document.activeElement;
          return {
            text: el?.textContent.trim(),
            row: Boolean(el?.classList.contains('account-navigation__row')),
            outline: getComputedStyle(el).outlineStyle,
          };
        }),
      );
    }
    check(
      tabStops.map((stop) => stop.text).join('|') ===
        'Профиль|Мои заказы|Избранное|Сравнение|Выход' &&
        tabStops.every((stop) => stop.row && stop.outline !== 'none'),
      `mobile: rail rows reachable by Tab with visible focus ${JSON.stringify(tabStops)}`,
    );
    await p.evaluate((values) => sessionStorage.setItem(values.ORDER, values.ORDER_VALUE), {
      ORDER,
      ORDER_VALUE,
    });
    await p.reload();
    await p.waitForSelector('.account-order');
    pf = await pageFacts(p);
    check(pf.overflow <= 0, 'mobile 390: populated overview no overflow');
    await p.screenshot({ path: `${SHOTS}/account-populated-390.png`, fullPage: true });
  }
  for (const path of ['/account/orders', '/account/profile']) {
    await open(p, path);
    const sectionGeometry = await shellGeometry(p);
    const sectionFacts = await pageFacts(p);
    check(
      sectionFacts.overflow <= 0 &&
        !sectionGeometry.headerOverlap &&
        !sectionGeometry.mobileOverlap &&
        !sectionGeometry.clipped &&
        !sectionGeometry.offscreen,
      `${label} ${width}: ${path} no overflow / shell collision`,
    );
  }
  await p.screenshot({ path: `${SHOTS}/shell-signed-in-${width}.png` });
  await p.close();
}

const mobile = await newPage(390, 844);
await mobile.goto(`${BASE}#/`);
await mobile.waitForSelector('main');
await mobile.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await fresh(mobile, '/account/orders');
await mobile.waitForFunction(() => location.hash === '#/login');
await enterDemo(mobile);
await mobile.waitForFunction(() => location.hash === '#/account/orders');
await mobile.waitForSelector('.account-orders-empty');
const mobileShots = [];
const mobileShot = async (name) => {
  const mf = await pageFacts(mobile);
  mobileShots.push([name, mf.overflow]);
  await mobile.evaluate(() => window.scrollTo(0, 0));
  await mobile.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
};
await mobileShot('account-orders-empty-390');
await mobile.evaluate((values) => sessionStorage.setItem(values.ORDER, values.ORDER_VALUE), {
  ORDER,
  ORDER_VALUE,
});
await mobile.reload();
await mobile.waitForSelector('.account-session-order');
const mobileCard = await mobile.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  return [...document.querySelectorAll('.account-session-order *')].every((el) => {
    const r = el.getBoundingClientRect();
    return r.width === 0 || r.right <= vw + 1;
  });
});
await mobileShot('account-orders-populated-390');
await open(mobile, '/account/profile');
await mobileShot('account-profile-default-390');
await setField(mobile, 'E-mail', 'broken');
await setField(mobile, 'Телефон', '+7 (9');
await submitProfile(mobile);
await mobileShot('account-profile-invalid-390');
await setField(mobile, 'E-mail', 'anna@goodcall.example');
await setField(mobile, 'Телефон', '+7 (911) 222-33-44');
await setField(mobile, 'Имя', 'Анна');
await submitProfile(mobile);
const mobileSaved = await profileStatus(mobile);
await mobileShot('account-profile-saved-390');
await open(mobile, '/account');
await mobileShot('account-overview-integrated-390');
check(
  mobileShots.every(([, overflow]) => overflow <= 0) &&
    mobileCard &&
    mobileSaved === 'Изменения сохранены в этом браузере',
  `mobile 390: Account B states without overflow ${JSON.stringify(mobileShots)}`,
);
await mobile.close();

await browser.close();
reportCounts(passed, failures);

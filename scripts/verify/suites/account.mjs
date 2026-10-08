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
        ['A', 'Адреса доставки', '#/account/addresses'],
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
for (const path of [
  '/account/settings',
  '/account/anything',
  '/account/orders/1',
  '/account/addresses/x',
]) {
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

const ACCOUNT_ADDRESS_LIMIT_VALUE = 5;
const addressCards = (target) =>
  target.evaluate(() =>
    [...document.querySelectorAll('.account-addresses__items > li')].map((li) => ({
      id: li.dataset.addressId,
      line: li.querySelector('.address-card__line')?.textContent ?? null,
      locality:
        li.querySelector('.address-card__locality')?.textContent.replace(/\s/g, ' ') ?? null,
      recipient: li.querySelector('.address-card__recipient')?.textContent ?? null,
      phone: li.querySelector('.address-card__phone')?.textContent ?? null,
      badge: li.querySelector('.address-card__badge')?.textContent.trim() ?? null,
      article: li.firstElementChild?.tagName ?? null,
      buttons: [...li.querySelectorAll('button')].map((b) => [b.tagName, b.textContent.trim()]),
    })),
  );
const storedAccount = async (target) => JSON.parse((await storage(target)).account ?? 'null');
const addressStatus = (target) =>
  target.evaluate(() => document.querySelector('.account-addresses__status')?.textContent ?? null);
const formHeading = (target) =>
  target.evaluate(
    () => document.querySelector('.account-addresses__form-card h2')?.textContent.trim() ?? null,
  );
const defaultCheckbox = (target) =>
  target.evaluate(() => {
    const input = document.querySelector('.account-addresses__form .ui-choice input');
    return input ? input.checked : null;
  });
const fillAddress = async (target, values) => {
  for (const [label, value] of Object.entries(values)) {
    await setField(target, label, value);
  }
};
const submitAddress = async (target) => {
  await target.click('.account-addresses__submit');
  await target.waitForTimeout(150);
};
const clickCardAction = async (target, id, label) => {
  await target.click(`[data-address-id="${id}"] .address-card__edit`, { hasText: label });
  await target.waitForTimeout(150);
};
const dialogState = (target) =>
  target.evaluate(() => {
    const dialog = document.querySelector('[role="alertdialog"]');
    return dialog
      ? {
          title: dialog.querySelector('.feedback-dialog__title')?.textContent ?? null,
          message: dialog.querySelector('.feedback-dialog__message')?.textContent ?? null,
          focusInside: dialog.contains(document.activeElement),
        }
      : null;
  });
const ADDRESS_ONE = {
  Город: 'Москва',
  Адрес: 'ул. Тверская, 18, кв. 25',
  Индекс: '125009',
};
const ADDRESS_TWO = { Город: 'Санкт-Петербург', Адрес: 'пр. Ленина, 42, кв. 10', Индекс: '' };
const extraAddress = (index) => ({
  Город: 'Казань',
  Адрес: `ул. Баумана, ${String(index)}`,
  Индекс: '',
});

await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await fresh(page, '/account/addresses');
await page.waitForFunction(() => location.hash === '#/login');
const addressesLength = await historyLength(page);
await enterDemo(page);
await page.waitForFunction(() => location.hash === '#/account/addresses');
await page.waitForSelector('.account-addresses');
facts = await pageFacts(page);
check(
  facts.focused === 'account-title' && (await historyLength(page)) === addressesLength,
  `addresses: signed-out deep link returns with h1 focus (${facts.focused})`,
);
await page.waitForTimeout(100);
check(
  (await page.evaluate(() => JSON.stringify(history.state?.usr ?? null))) === 'null',
  'addresses: one-time return state cleared',
);
check(
  (await page.textContent('main h1')) === 'Адреса доставки' &&
    (await activeRail(page)) === 'Адреса доставки' &&
    JSON.stringify((await crumbs(page)).map(([text]) => text)) ===
      JSON.stringify(['Главная', 'Аккаунт', 'Адреса доставки']),
  'addresses: h1, rail and breadcrumbs',
);
check(
  facts.mains === 1 && facts.h1.length === 1 && facts.overflow <= 0,
  'addresses: main/h1/overflow',
);
check(
  /Сохранённых адресов пока нет/.test(facts.text) &&
    /только в этом браузере/.test(facts.text) &&
    /не подставляются при оформлении заказа/.test(facts.text) &&
    !/будут доступны при оформлении/.test(facts.text) &&
    (await page.count('.account-addresses__items')) === 0 &&
    (await page.count('.account-addresses__form')) === 1 &&
    (await formHeading(page)) === 'Добавить новый адрес' &&
    (await defaultCheckbox(page)) === null &&
    /Первый сохранённый адрес станет основным/.test(facts.text),
  'addresses: empty by default, truthful copy, add form visible, first-default note',
);
check(
  (await fieldState(page, 'Получатель'))?.value === 'Иван Иванов' &&
    (await fieldState(page, 'Телефон'))?.value === '+7 (900) 000-00-00' &&
    (await fieldState(page, 'Город'))?.value === '',
  'addresses: add form prefilled from the profile',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-addresses-empty-1440.png`, fullPage: true });

await fillAddress(page, { Получатель: '', Телефон: '+7 (9', Город: '', Адрес: '', Индекс: '12' });
await submitAddress(page);
let addressErrors = {
  recipient: await fieldState(page, 'Получатель'),
  phone: await fieldState(page, 'Телефон'),
  city: await fieldState(page, 'Город'),
  line: await fieldState(page, 'Адрес'),
  postal: await fieldState(page, 'Индекс'),
};
check(
  addressErrors.recipient.invalid === 'true' &&
    addressErrors.recipient.described.includes('Укажите получателя') &&
    addressErrors.phone.described.includes('Введите номер полностью') &&
    addressErrors.city.described.includes('Укажите город') &&
    addressErrors.line.described.includes('Укажите улицу, дом и квартиру') &&
    addressErrors.postal.described.includes('Индекс состоит из 6 цифр') &&
    (await page.evaluate(() => document.activeElement?.id)) === addressErrors.recipient.id,
  `addresses validation: required fields, aria-invalid/described-by, first-invalid focus ${JSON.stringify(addressErrors.recipient)}`,
);
await fillAddress(page, {
  Получатель: 'Иван3',
  Телефон: '',
  Город: 'Москва1',
  Адрес: 'Тверская улица',
  Индекс: '12a456',
});
await submitAddress(page);
addressErrors = {
  recipient: await fieldState(page, 'Получатель'),
  phone: await fieldState(page, 'Телефон'),
  city: await fieldState(page, 'Город'),
  line: await fieldState(page, 'Адрес'),
  postal: await fieldState(page, 'Индекс'),
};
check(
  addressErrors.recipient.described.includes('Имя получателя может содержать') &&
    addressErrors.phone.described.includes('Укажите номер телефона') &&
    addressErrors.city.described.includes('Название города может содержать') &&
    addressErrors.line.described.includes('Укажите улицу, дом и квартиру') &&
    addressErrors.postal.described.includes('Индекс состоит из 6 цифр') &&
    (await storedAccount(page)).addresses === undefined,
  'addresses validation: invalid characters, missing digit, bad postal code; nothing saved',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-addresses-validation-1440.png`, fullPage: true });

await fillAddress(page, {
  Получатель: 'Иван   Иванов',
  Телефон: '+7 (900) 000-00-00',
  ...ADDRESS_ONE,
});
check(
  (await fieldState(page, 'Получатель')).invalid === null,
  'addresses validation: editing a field clears its error',
);
await submitAddress(page);
let account = await storedAccount(page);
let cards = await addressCards(page);
const firstId = account.addresses?.[0]?.id;
check(
  (await addressStatus(page)) === 'Адрес сохранён в этом браузере' &&
    account.addresses?.length === 1 &&
    account.defaultAddressId === firstId &&
    JSON.stringify({ ...account.addresses[0], id: 'x' }) ===
      JSON.stringify({
        id: 'x',
        recipientName: 'Иван Иванов',
        phone: '+7 (900) 000-00-00',
        city: 'Москва',
        addressLine: 'ул. Тверская, 18, кв. 25',
        postalCode: '125009',
      }) &&
    typeof firstId === 'string' &&
    firstId.length >= 32,
  `addresses add: normalized stored shape, first address auto-default ${JSON.stringify(account)}`,
);
check(
  cards.length === 1 &&
    cards[0].badge === 'Основной адрес' &&
    cards[0].article === 'ARTICLE' &&
    cards[0].locality === 'Москва, 125009' &&
    JSON.stringify(cards[0].buttons) ===
      JSON.stringify([
        ['BUTTON', 'Редактировать: ул. Тверская, 18, кв. 25'],
        ['BUTTON', 'Удалить: ул. Тверская, 18, кв. 25'],
      ]) &&
    (await page.getAttribute('.account-addresses__items', 'aria-label')) === 'Сохранённые адреса',
  `addresses add: card, default chip, unique action names ${JSON.stringify(cards)}`,
);
check(
  (await formHeading(page)) === 'Добавить новый адрес' &&
    (await fieldState(page, 'Город')).value === '' &&
    (await fieldState(page, 'Получатель')).value === 'Иван Иванов' &&
    (await defaultCheckbox(page)) === false,
  'addresses add: form resets to prefilled add mode, default checkbox now unchecked',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-addresses-add-saved-1440.png`, fullPage: true });
await page.reload();
await page.waitForSelector('.account-addresses__items');
check(
  (await addressCards(page)).length === 1 && (await addressStatus(page)) === '',
  'addresses: reload persists addresses, status not persisted',
);

await fillAddress(page, ADDRESS_TWO);
await page.click('.account-addresses__form .ui-choice');
await submitAddress(page);
account = await storedAccount(page);
cards = await addressCards(page);
const secondId = account.addresses?.[1]?.id;
check(
  account.addresses.length === 2 &&
    account.defaultAddressId === secondId &&
    !('postalCode' in account.addresses[1]) &&
    cards.filter((card) => card.badge === 'Основной адрес').length === 1 &&
    cards[1].badge === 'Основной адрес' &&
    cards[1].locality === 'Санкт-Петербург',
  'addresses: second address marked primary, exactly one default, empty postal code omitted',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-addresses-populated-1440.png`, fullPage: true });

await open(page, '/account');
const overviewAddress = await page.evaluate(() => {
  const card = document.getElementById('account-address-title')?.closest('section');
  return card
    ? {
        line: card.querySelector('.account-address-summary__line')?.textContent ?? null,
        recipient: card.querySelector('.account-details__value')?.textContent ?? null,
        link: card.querySelector('a')?.getAttribute('href') ?? null,
        linkText: card.querySelector('a')?.textContent.trim() ?? null,
        lines: card.querySelectorAll('.account-address-summary__line').length,
      }
    : null;
});
check(
  overviewAddress?.line === 'пр. Ленина, 42, кв. 10' &&
    overviewAddress.lines === 1 &&
    overviewAddress.recipient === 'Иван Иванов' &&
    overviewAddress.link === '#/account/addresses' &&
    overviewAddress.linkText === 'Изменить адрес',
  `overview: shows only the default address ${JSON.stringify(overviewAddress)}`,
);
await page.screenshot({
  path: `${SHOTS}/account-overview-address-populated-1440.png`,
  fullPage: true,
});

await open(page, '/account/addresses');
await clickCardAction(page, firstId, 'Редактировать');
check(
  (await formHeading(page)) === 'Редактирование адреса' &&
    (await fieldState(page, 'Город')).value === 'Москва' &&
    (await fieldState(page, 'Индекс')).value === '125009' &&
    (await defaultCheckbox(page)) === false &&
    (await page.evaluate(() => document.activeElement?.id)) ===
      (await fieldState(page, 'Получатель')).id &&
    (await page.count('.account-addresses__actions button')) === 2,
  'addresses edit: loads the saved snapshot, focuses Получатель, shows Отменить',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-addresses-edit-1440.png`, fullPage: true });
await fillAddress(page, { Получатель: 'Анна Смирнова', Телефон: '+7 (911) 222-33-44' });
await submitAddress(page);
account = await storedAccount(page);
check(
  (await addressStatus(page)) === 'Изменения адреса сохранены' &&
    account.addresses[0].id === firstId &&
    account.addresses[0].recipientName === 'Анна Смирнова' &&
    account.addresses[1].id === secondId &&
    account.defaultAddressId === secondId &&
    (await formHeading(page)) === 'Добавить новый адрес' &&
    (await page.evaluate(() => document.activeElement?.closest('li')?.dataset.addressId)) ===
      firstId,
  'addresses edit: id kept, other address untouched, focus back on its card',
);
await clickCardAction(page, secondId, 'Редактировать');
check((await defaultCheckbox(page)) === true, 'addresses edit: default address loads checked');
await page.click('.account-addresses__form .ui-choice');
await submitAddress(page);
check(
  (await storedAccount(page)).defaultAddressId === secondId,
  'addresses edit: unchecking the current default keeps it default',
);
await clickCardAction(page, firstId, 'Редактировать');
await page.click('.account-addresses__actions button', { hasText: 'Отменить' });
await page.waitForTimeout(150);
check(
  (await formHeading(page)) === 'Добавить новый адрес' &&
    (await page.evaluate(() => document.activeElement?.closest('li')?.dataset.addressId)) ===
      firstId,
  'addresses edit: cancel discards the draft and restores focus to the card',
);

await open(page, '/account/profile');
await setField(page, 'Имя', 'Пётр');
await submitProfile(page);
account = await storedAccount(page);
check(
  account.profile?.firstName === 'Пётр' &&
    account.addresses?.length === 2 &&
    account.defaultAddressId === secondId &&
    account.addresses[0].recipientName === 'Анна Смирнова' &&
    account.addresses[1].recipientName === 'Иван Иванов',
  'invariants: profile save preserves addresses/default; saved recipients are snapshots',
);
await open(page, '/account/addresses');
check(
  (await fieldState(page, 'Получатель')).value === 'Пётр Иванов',
  'snapshot: new add form prefills from the updated profile',
);
await fillAddress(page, extraAddress(1));
await submitAddress(page);
account = await storedAccount(page);
const thirdId = account.addresses[2]?.id;
check(
  account.profile?.firstName === 'Пётр' && account.defaultAddressId === secondId,
  'invariants: address add preserves profile and default',
);

await clickCardAction(page, firstId, 'Удалить');
let dialog = await dialogState(page);
check(
  dialog?.title === 'Удалить адрес?' &&
    dialog.message.includes('ул. Тверская, 18, кв. 25') &&
    dialog.focusInside,
  `delete: confirmation dialog with address and trapped focus ${JSON.stringify(dialog)}`,
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({
  path: `${SHOTS}/account-addresses-delete-dialog-1440.png`,
  fullPage: true,
});
await page.evaluate(() =>
  document.activeElement?.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  ),
);
await page.waitForTimeout(300);
check(
  (await dialogState(page)) === null &&
    (await addressCards(page)).length === 3 &&
    (await page.evaluate(() => document.activeElement?.textContent.trim())).startsWith('Удалить'),
  'delete: Escape cancels and focus returns to the delete trigger',
);
await clickCardAction(page, firstId, 'Удалить');
await page.click('[role="alertdialog"] .ui-button--danger');
await page.waitForTimeout(400);
account = await storedAccount(page);
check(
  account.addresses.length === 2 &&
    !account.addresses.some((address) => address.id === firstId) &&
    account.defaultAddressId === secondId &&
    account.profile?.firstName === 'Пётр' &&
    (await addressStatus(page)) === 'Адрес удалён' &&
    (await page.evaluate(() => document.activeElement?.tagName)) === 'H2',
  `delete: confirm removes only that address, preserves profile, focuses list heading (${await page.evaluate(() => document.activeElement?.tagName)})`,
);
await clickCardAction(page, secondId, 'Удалить');
await page.click('[role="alertdialog"] .ui-button--danger');
await page.waitForTimeout(400);
account = await storedAccount(page);
check(
  account.addresses.length === 1 && account.defaultAddressId === thirdId,
  'delete: removing the default promotes the first remaining address',
);
await clickCardAction(page, thirdId, 'Редактировать');
await clickCardAction(page, thirdId, 'Удалить');
await page.click('[role="alertdialog"] .ui-button--danger');
await page.waitForTimeout(400);
account = await storedAccount(page);
check(
  account.addresses === undefined &&
    account.defaultAddressId === undefined &&
    account.profile?.firstName === 'Пётр' &&
    (await formHeading(page)) === 'Добавить новый адрес' &&
    /Сохранённых адресов пока нет/.test((await pageFacts(page)).text),
  'delete: deleting the edited last address resets the form and clears addresses/default',
);

await open(page, '/account');
check(
  (await page.evaluate(
    () =>
      document
        .getElementById('account-address-title')
        ?.closest('section')
        ?.textContent.includes('Адрес пока не добавлен') ?? false,
  )) &&
    (await page.evaluate(
      () =>
        document
          .getElementById('account-address-title')
          ?.closest('section')
          ?.querySelector('a')
          ?.getAttribute('href') ?? null,
    )) === '#/account/addresses',
  'overview: empty address card links to #/account/addresses',
);
await page.screenshot({ path: `${SHOTS}/account-overview-address-empty-1440.png`, fullPage: true });

await open(page, '/account/addresses');
for (let index = 1; index <= ACCOUNT_ADDRESS_LIMIT_VALUE; index += 1) {
  await fillAddress(page, extraAddress(index));
  await submitAddress(page);
}
account = await storedAccount(page);
facts = await pageFacts(page);
check(
  account.addresses.length === ACCOUNT_ADDRESS_LIMIT_VALUE &&
    (await page.count('.account-addresses__form')) === 0 &&
    /Можно сохранить до 5 адресов/.test(facts.text) &&
    (await page.count('main [disabled], main [aria-disabled="true"]')) === 0,
  'limit: five addresses, add form replaced by the limit note, no disabled controls',
);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${SHOTS}/account-addresses-limit-1440.png`, fullPage: true });
const limitId = account.addresses[4].id;
await clickCardAction(page, limitId, 'Редактировать');
await setField(page, 'Индекс', '420111');
await submitAddress(page);
check(
  (await storedAccount(page)).addresses[4].postalCode === '420111' &&
    (await page.count('.account-addresses__form')) === 0,
  'limit: editing still works at five, then the limit note returns',
);

await page.evaluate(
  (values) => {
    const valid = (id, line) => ({
      id,
      recipientName: 'Иван Иванов',
      phone: '+7 (900) 000-00-00',
      city: 'Москва',
      addressLine: line,
    });
    localStorage.setItem(
      'goodcall.account.v1',
      JSON.stringify({
        version: 1,
        signedIn: true,
        profile: values.PROFILE,
        addresses: [
          valid('a1', 'ул. Первая, 1'),
          { ...valid('bad', 'без цифр'), phone: '123' },
          valid('a1', 'ул. Дубль, 2'),
          'not-an-object',
          valid('a2', 'ул. Вторая, 2'),
          valid('a3', 'ул. Третья, 3'),
          valid('a4', 'ул. Четвёртая, 4'),
          valid('a5', 'ул. Пятая, 5'),
          valid('a6', 'ул. Шестая, 6'),
        ],
        defaultAddressId: 'missing',
      }),
    );
  },
  { PROFILE: { ...PROFILE_BASE, firstName: 'Пётр' } },
);
await fresh(page, '/account/addresses');
await page.waitForSelector('.account-addresses__items');
account = await storedAccount(page);
check(
  (await hash(page)) === '#/account/addresses' &&
    JSON.stringify(account.addresses.map((address) => address.id)) ===
      JSON.stringify(['a1', 'a2', 'a3', 'a4', 'a5']) &&
    account.defaultAddressId === 'a1' &&
    account.profile?.firstName === 'Пётр',
  `corruption: bad/duplicate items dropped, trimmed to 5, dangling default promoted, profile kept ${JSON.stringify(account.addresses?.map((a) => a.id))}`,
);
await page.evaluate(() =>
  localStorage.setItem(
    'goodcall.account.v1',
    JSON.stringify({ version: 1, signedIn: true, addresses: 'oops', defaultAddressId: 'a1' }),
  ),
);
await fresh(page, '/account/addresses');
await page.waitForSelector('.account-addresses');
check(
  (await hash(page)) === '#/account/addresses' &&
    (await storage(page)).account === '{"version":1,"signedIn":true}',
  'corruption: non-array addresses dropped without signing out',
);

await fillAddress(page, { Город: 'Москва', Адрес: 'ул. Заводская, 7', Индекс: '' });
await submitAddress(page);
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
await open(page, '/checkout');
await page.waitForTimeout(400);
const checkoutText = await page.evaluate(() => ({
  text: document.querySelector('main')?.innerText ?? '',
  values: [...document.querySelectorAll('main input')].map((input) => input.value),
}));
check(
  !checkoutText.text.includes('ул. Заводская, 7') &&
    !checkoutText.values.some((value) => value.includes('Заводская')) &&
    !/Сохранённые адреса|Основной адрес/.test(checkoutText.text),
  'checkout: saved Account addresses are not offered or prefilled',
);
await open(page, '/account');
const beforeAddressLogout = await storage(page);
await logoutFromRail(page);
const afterAddressLogout = await storage(page);
check(
  afterAddressLogout.account === null &&
    afterAddressLogout.cart === beforeAddressLogout.cart &&
    afterAddressLogout.favorites === beforeAddressLogout.favorites &&
    afterAddressLogout.compare === beforeAddressLogout.compare &&
    afterAddressLogout.city === beforeAddressLogout.city &&
    afterAddressLogout.order === beforeAddressLogout.order,
  'logout: addresses reset; cart/favourites/compare/city/session order byte-identical',
);
await enterDemo(page);
await page.waitForFunction(() => location.hash === '#/account');
await page.waitForSelector('.account-greeting');
await open(page, '/account/addresses');
check(
  (await page.count('.account-addresses__items')) === 0 &&
    (await fieldState(page, 'Получатель')).value === 'Иван Иванов',
  'logout: re-entry starts with an empty address book and persona prefill',
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
      rail.length === 6 && rail.every((r) => r.visible && !r.clipped && r.height >= 40),
      `mobile: rail actions reachable, unclipped ${JSON.stringify(rail)}`,
    );
    await p.screenshot({ path: `${SHOTS}/account-empty-390.png`, fullPage: true });
    await p.focus('#account-title');
    const tabStops = [];
    for (let index = 0; index < 6; index += 1) {
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
        'Профиль|Мои заказы|Избранное|Сравнение|Адреса доставки|Выход' &&
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
  for (const path of ['/account/orders', '/account/profile', '/account/addresses']) {
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

const addressMobile = await newPage(390, 844);
await addressMobile.goto(`${BASE}#/`);
await addressMobile.waitForSelector('main');
await addressMobile.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await fresh(addressMobile, '/login');
await enterDemo(addressMobile);
await addressMobile.waitForFunction(() => location.hash === '#/account');
await addressMobile.waitForSelector('.account-greeting');
const addressShots = [];
const addressShot = async (name) => {
  const mf = await pageFacts(addressMobile);
  addressShots.push([name, mf.overflow]);
  await addressMobile.evaluate(() => window.scrollTo(0, 0));
  await addressMobile.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
};
await addressShot('account-overview-address-empty-390');
await open(addressMobile, '/account/addresses');
await addressShot('account-addresses-empty-390');
await fillAddress(addressMobile, { Телефон: '+7 (9', Город: '', Адрес: 'без номера' });
await submitAddress(addressMobile);
await addressShot('account-addresses-validation-390');
await fillAddress(addressMobile, { Телефон: '+7 (900) 000-00-00', ...ADDRESS_ONE });
await submitAddress(addressMobile);
await addressShot('account-addresses-add-saved-390');
await fillAddress(addressMobile, ADDRESS_TWO);
await submitAddress(addressMobile);
await addressShot('account-addresses-populated-390');
const mobileCards = await addressCards(addressMobile);
await clickCardAction(addressMobile, mobileCards[1].id, 'Редактировать');
const editVisible = await addressMobile.evaluate(() => {
  const field = document.activeElement;
  const r = field?.getBoundingClientRect();
  return Boolean(r && r.top >= 0 && r.bottom <= window.innerHeight);
});
await addressShot('account-addresses-edit-390');
await addressMobile.click('.account-addresses__actions button', { hasText: 'Отменить' });
await addressMobile.waitForTimeout(150);
await clickCardAction(addressMobile, mobileCards[1].id, 'Удалить');
const mobileDialog = await addressMobile.evaluate(() => {
  const dialog = document.querySelector('[role="alertdialog"]');
  const r = dialog?.getBoundingClientRect();
  return Boolean(r && r.left >= 0 && r.right <= document.documentElement.clientWidth);
});
await addressShot('account-addresses-delete-dialog-390');
await addressMobile.evaluate(() =>
  document.activeElement?.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  ),
);
await addressMobile.waitForTimeout(300);
await open(addressMobile, '/account');
await addressShot('account-overview-address-populated-390');
check(
  addressShots.every(([, overflow]) => overflow <= 0) && editVisible && mobileDialog,
  `mobile 390: address states without overflow, edit field in view, dialog fits ${JSON.stringify(addressShots)}`,
);
await addressMobile.close();

await browser.close();
reportCounts(passed, failures);

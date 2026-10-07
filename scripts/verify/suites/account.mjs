import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { launchBrowser } from '../lib/browser.mjs';
import { openPage } from '../lib/page.mjs';
import { appBase, outputDir, reportCounts } from '../lib/suite.mjs';

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
  /Мои заказы/,
  /Адреса доставки|Адрес доставки/,
  /Настройки/,
  /Редактировать профиль/,
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
for (const path of ['/account/orders', '/account/anything']) {
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
      rail.length === 4 && rail.every((r) => r.visible && !r.clipped && r.height >= 40),
      `mobile: rail actions reachable, unclipped ${JSON.stringify(rail)}`,
    );
    await p.screenshot({ path: `${SHOTS}/account-empty-390.png`, fullPage: true });
    await p.focus('#account-title');
    const tabStops = [];
    for (let index = 0; index < 4; index += 1) {
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
      tabStops.map((stop) => stop.text).join('|') === 'Профиль|Избранное|Сравнение|Выход' &&
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
  await p.screenshot({ path: `${SHOTS}/shell-signed-in-${width}.png` });
  await p.close();
}

await browser.close();
reportCounts(passed, failures);

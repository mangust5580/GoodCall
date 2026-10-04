import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { launchBrowser } from '../lib/browser.mjs';
import { openPage } from '../lib/page.mjs';
import { appBase, reportCounts } from '../lib/suite.mjs';

const BASE = appBase();
const CART = 'goodcall.cart.v1';
const PHONE = '8 800 100-10-10';
const EMAIL = 'support@goodcall.example';
const HOURS = 'Ежедневно с 9:00 до 21:00';

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

const page = await newPage();

await open(page, '/shops');
const shopNames = await page.evaluate(() =>
  [...document.querySelectorAll('.store-card__title')].map((el) => el.textContent.trim()),
);
check(shopNames.length === 6, `shops: demo store count ${shopNames.length}`);

await open(page, '/contacts');
const facts = await page.evaluate(() => {
  const main = document.querySelector('main');
  return {
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
    crumbs: [...document.querySelectorAll('nav[aria-label="Хлебные крошки"] li')].map((li) => [
      li.textContent.trim(),
      li.querySelector('a')?.getAttribute('href') ?? null,
      li.getAttribute('aria-current'),
    ]),
    sectionNavs: [...main.querySelectorAll('nav')].filter(
      (nav) => nav.getAttribute('aria-label') !== 'Хлебные крошки',
    ).length,
    channels: [...document.querySelectorAll('.contacts-channels__item')].map((li) => ({
      label: li.querySelector('.contacts-channels__label').textContent.trim(),
      value: li.querySelector('.contacts-channels__value').textContent.trim(),
      href: li.querySelector('a.contacts-channels__value')?.getAttribute('href') ?? null,
    })),
    stores: [...main.querySelectorAll('.contacts-store__title')].map((el) => el.textContent.trim()),
    storesCta: [...main.querySelectorAll('.contacts-stores a')].map((a) => [
      a.textContent.trim(),
      a.getAttribute('href'),
    ]),
    formControls: main.querySelectorAll('form, input, textarea, select, button').length,
    maps: main.querySelectorAll('iframe, canvas').length,
    mainText: main.innerText,
    bodyText: document.body.innerText,
  };
});
check(facts.h1.join() === 'Контакты', `contacts: single h1 ${facts.h1}`);
check(
  JSON.stringify(facts.crumbs) ===
    JSON.stringify([
      ['Главная', '#/', null],
      ['Контакты', null, 'page'],
    ]),
  `contacts: breadcrumbs ${JSON.stringify(facts.crumbs)}`,
);
check(
  facts.sectionNavs === 0 && !facts.mainText.includes('Информация'),
  `contacts: no section sidebar/navigation (${facts.sectionNavs})`,
);
const channel = (label) => facts.channels.find((c) => c.label === label);
check(
  channel('Телефон')?.value === PHONE && channel('Телефон')?.href === 'tel:+78001001010',
  'contacts: canonical phone link',
);
check(
  channel('E-mail')?.value === EMAIL && channel('E-mail')?.href === `mailto:${EMAIL}`,
  'contacts: canonical email link',
);
check(channel('Часы работы поддержки')?.value === HOURS, 'contacts: canonical support hours');
check(
  channel('Магазины')?.value === '6 магазинов GoodCall' && channel('Магазины')?.href === '#/shops',
  `contacts: store channel ${JSON.stringify(channel('Магазины'))}`,
);
check(facts.channels.length === 4, `contacts: four channels (${facts.channels.length})`);
check(
  JSON.stringify(facts.stores) === JSON.stringify(shopNames.slice(0, 3)),
  `contacts: stores from DEMO_STORES ${facts.stores}`,
);
check(
  facts.storesCta.some(([label, href]) => label === 'Все магазины' && href === '#/shops'),
  'contacts: CTA to #/shops',
);
check(facts.formControls === 0, `contacts: no form controls (${facts.formControls})`);
check(
  facts.maps === 0 && !/на карте|карта магазинов|яндекс|google maps/i.test(facts.mainText),
  `contacts: no map (${facts.maps})`,
);
check(
  !/офис|пресненск|тверская|башня|инн|огрн/i.test(facts.mainText),
  'contacts: no invented office address',
);
check(!/24\/7|круглосуточ/i.test(facts.bodyText), 'contacts: no 24/7 claim on page or shell');
check(
  !/vk\.com|t\.me|youtube|instagram|tiktok/i.test(
    await page.evaluate(() => [...document.querySelectorAll('a')].map((a) => a.href).join(' ')),
  ),
  'contacts: no social destinations',
);

const shell = await page.evaluate(() => ({
  header: [...document.querySelectorAll('.site-header__support')].map((a) => [
    a.textContent.trim(),
    a.getAttribute('href'),
  ]),
  footer: [...document.querySelectorAll('.site-footer__group-link')].map((a) => [
    a.textContent.trim(),
    a.getAttribute('href'),
  ]),
}));
check(
  shell.header.length === 1 &&
    shell.header[0][0] === 'Поддержка' &&
    shell.header[0][1] === '#/contacts',
  `shell: header support ${JSON.stringify(shell.header)}`,
);
check(
  shell.footer.some(([l, h]) => l === 'Контакты' && h === '#/contacts') &&
    shell.footer.some(([l, h]) => l === 'Поддержка' && h === '#/contacts'),
  `shell: footer contacts/support ${JSON.stringify(shell.footer)}`,
);

await open(page, '/');
await page.click('.site-header__support');
await page.waitForFunction(() => location.hash === '#/contacts');
await page.waitForSelector('main h1');
check((await page.textContent('main h1')) === 'Контакты', 'shell: header support opens contacts');
await open(page, '/delivery');
await page.focus('.site-footer__group-link[href="#/contacts"]');
await page.keyboard.press('Enter');
await page.waitForFunction(() => location.hash === '#/contacts');
check(
  (await page.evaluate(() => window.scrollY)) === 0,
  'shell: footer contacts link opens contacts at top',
);

await page.goto(`${BASE}#/`);
await page.evaluate(
  (key) =>
    localStorage.setItem(
      key,
      JSON.stringify({
        lines: [
          {
            id: 'contacts-probe',
            productSlug: 'iphone-15-128',
            title: 'Apple iPhone 15 128 ГБ, Розовый',
            image: { kind: 'catalog-fallback' },
            price: 79990,
            quantity: 1,
            selected: true,
          },
        ],
      }),
    ),
  CART,
);
for (const path of ['/', '/cart', '/checkout', '/delivery', '/faq']) {
  await open(page, path);
  await page.waitForTimeout(200);
  const text = await page.evaluate(() => document.body.innerText);
  check(!/24\/7|в любое время|мы всегда на связи/i.test(text), `support claim truthful on ${path}`);
}
await open(page, '/checkout');
check(
  (await page.evaluate(() => document.body.innerText)).includes(HOURS),
  'checkout: support benefit shows canonical hours',
);
await page.evaluate((key) => localStorage.removeItem(key), CART);

const homeBenefits = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('.home-page .benefits-strip__item')].map((li) => [
      li.querySelector('.benefits-strip__title').textContent.trim(),
      li.querySelector('.benefits-strip__note').textContent.trim(),
    ]),
  );
const HOME_SHARED_BENEFITS = [
  ['Гарантия до 24 месяцев', 'на все товары'],
  ['Оригинальная продукция', 'только официальные поставки'],
  ['Быстрая доставка', 'от 1 дня по всей России'],
];
await open(page, '/');
const productionBenefits = await homeBenefits();
check(
  JSON.stringify(productionBenefits) ===
    JSON.stringify([...HOME_SHARED_BENEFITS, ['Поддержка', HOURS]]),
  `home: production support benefit truthful ${JSON.stringify(productionBenefits)}`,
);
await page.goto(`${BASE}?reference=home`);
await page.waitForSelector('.home-page .benefits-strip__item');
const referenceBenefits = await homeBenefits();
check(
  JSON.stringify(referenceBenefits) ===
    JSON.stringify([...HOME_SHARED_BENEFITS, ['Поддержка 24/7', 'мы всегда на связи']]),
  `home: reference specimen benefits preserved ${JSON.stringify(referenceBenefits)}`,
);

for (const path of ['/contacts/extra', '/contact', '/about']) {
  await page.goto(`${BASE}#${path}`);
  await page.waitForSelector('main h1');
  check((await page.textContent('main h1')).trim() === 'Страница не найдена', `404: ${path}`);
}
await page.close();

for (const width of [1440, 390, 320]) {
  const shot = await newPage(width, width === 1440 ? 900 : 844);
  await open(shot, '/contacts');
  await shot.waitForTimeout(150);
  const metrics = await shot.evaluate(() => {
    const main = document.querySelector('main');
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      small: [...main.querySelectorAll('.ui-button')]
        .filter((el) => el.getBoundingClientRect().height < 44)
        .map((el) => el.textContent.trim()),
      clipped: [...main.querySelectorAll('h1, h2, h3, p, li, span, a')].filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.right > document.documentElement.clientWidth + 1;
      }).length,
    };
  });
  const key = `contacts@${width}`;
  check(metrics.overflow <= 0, `${key}: horizontal overflow ${metrics.overflow}`);
  check(metrics.small.length === 0, `${key}: small touch targets ${metrics.small}`);
  check(metrics.clipped === 0, `${key}: clipped content ${metrics.clipped}`);
  await shot.close();
}

await browser.close();
reportCounts(passed, failures);

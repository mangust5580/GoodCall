import { createRequire, register } from 'node:module';

import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { launchBrowser } from '../lib/browser.mjs';
import { CATEGORIES, HOME_POPULAR_PRODUCTS, PRODUCTS } from '../lib/catalog.mjs';
import { openPage } from '../lib/page.mjs';
import {
  BREADCRUMB_LABEL,
  breadcrumbFacts,
  breadcrumbProblems,
  emptyStateFacts,
  headingOutline,
  routeStatusFacts,
} from '../lib/semantics.mjs';
import { appBase, outputDir, referenceBase, reportCounts } from '../lib/suite.mjs';

const require = createRequire(import.meta.url);
register(new URL('../lib/ts-hook.mjs', import.meta.url));
const { STOREFRONT_PAYMENT_OPTIONS } = await import(
  new URL('../../../src/commerce/storefront/storefrontFacts.ts', import.meta.url).href
);
const sharp = require('sharp');
const SHOTS = outputDir();
const NEW = appBase();
const HEAD = referenceBase();

const EXPECTED_SLUGS = [
  'acer-aspire-5-i5-512',
  'acer-swift-go-14-ultra5',
  'asus-tuf-f15-rtx3050',
  'asus-vivobook-15-i5-512',
  'hp-15-i5-512',
  'hp-victus-16-rtx4050',
  'huawei-matebook-d16-i5',
  'lenovo-ideapad-slim-5-14',
  'lenovo-legion-5-16-rtx4060',
  'macbook-air-13-m3-256',
  'macbook-pro-14-m3-512',
  'msi-katana-17-rtx4060',
];
const LAPTOPS_HASH = '#/catalog/laptops';
const LAPTOP_ART = 'home-device-laptop-card';
const PHONE_ART = 'product-phone';
const LEGION = 'lenovo-legion-5-16-rtx4060';

const laptopsCategory = CATEGORIES.find((category) => category.slug === 'laptops');
const laptopRows = PRODUCTS.filter((row) => row.category_id === laptopsCategory?.id);
const bySlug = new Map(laptopRows.map((row) => [row.slug, row]));
const byName = new Map(laptopRows.map((row) => [row.name, row.slug]));

let scenario = {};

function tableRows(table) {
  if (table === 'categories') return CATEGORIES;
  if (table === 'home_popular_products') return HOME_POPULAR_PRODUCTS;
  if (table === 'product_images') return scenario.productImages ?? [];
  if (table === 'products') {
    if (scenario.laptopsEmpty)
      return PRODUCTS.filter((row) => row.category_id !== laptopsCategory.id);
    return scenario.extraProduct === undefined ? PRODUCTS : [...PRODUCTS, scenario.extraProduct];
  }
  return [];
}

function applyFilters(rows, params) {
  let out = rows;
  for (const [key, raw] of params) {
    if (['select', 'order', 'limit', 'offset'].includes(key)) continue;
    if (raw.startsWith('eq.')) {
      const value = raw.slice(3);
      out = out.filter((row) => String(row[key]) === value);
    } else if (raw.startsWith('in.(')) {
      const values = raw
        .slice(4, -1)
        .split(',')
        .map((v) => v.replace(/^"|"$/g, ''));
      out = out.filter((row) => values.includes(String(row[key])));
    }
  }
  const order = params.get('order');
  if (order) {
    const specs = order.split(',').map((part) => part.split('.'));
    out = [...out].sort((a, b) => {
      for (const [field, dir] of specs) {
        if (a[field] === b[field]) continue;
        const sign = dir === 'desc' ? -1 : 1;
        return a[field] > b[field] ? sign : -sign;
      }
      return 0;
    });
  }
  if ((params.get('select') ?? '').includes('categories(')) {
    out = out.map((row) => {
      const category = CATEGORIES.find((c) => c.id === row.category_id);
      return { ...row, categories: category ? { slug: category.slug, name: category.name } : null };
    });
  }
  return out;
}

function stub(request) {
  const url = new URL(request.url);
  const table = url.pathname.replace('/rest/v1/', '');
  if (scenario.productsHang && table === 'products') return null;
  if (scenario.productsError && table === 'products') {
    return {
      status: 500,
      body: JSON.stringify({ code: 'XX000', message: 'stub failure', details: null, hint: null }),
    };
  }
  return { status: 200, body: JSON.stringify(applyFilters(tableRows(table), url.searchParams)) };
}

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
    respond: stub,
    onPageError: (message) => failures.push(`pageerror ${message}`),
  });
}

async function openLaptops(page, query = '') {
  await page.goto(`${NEW}${LAPTOPS_HASH}${query === '' ? '' : `?${query}`}`);
  await page.waitForFunction(
    () => document.querySelector('.catalog-page__title') || document.querySelector('h1'),
  );
  await page.waitForTimeout(150);
}

async function fresh(page, query = '') {
  await page.goto(`${NEW}#/`);
  await page.waitForSelector('main');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await openLaptops(page, query);
}

const listing = (page) =>
  page.evaluate(() => {
    const cards = [...document.querySelectorAll('.catalog-grid .product-card')];
    return {
      count: document.querySelector('.catalog-page__count')?.textContent ?? '',
      titles: cards.map((card) => card.querySelector('.product-card__title')?.textContent.trim()),
      empty: document
        .querySelector('.catalog-page__results')
        ?.innerText.includes('Ничего не найдено'),
      pagination: document.querySelector('.catalog-page__pagination') !== null,
      query: location.hash.includes('?') ? location.hash.slice(location.hash.indexOf('?') + 1) : '',
      index: navigation.currentEntry.index,
      sort: document.querySelector('.catalog-page__sort')?.textContent.trim() ?? '',
      trigger: document.querySelector('.catalog-filter-trigger')?.textContent.trim() ?? '',
    };
  });
const slugsOf = (state) => state.titles.map((title) => byName.get(title));
const countOf = (state) => Number(state.count.replace(/\D/g, ''));

async function toggleOption(page, scope, legend, label) {
  await page.evaluate(
    ({ scope, legend, label }) => {
      const group = [...document.querySelectorAll(`${scope} fieldset`)].find(
        (fieldset) => fieldset.querySelector('legend')?.textContent === legend,
      );
      const choice = [...group.querySelectorAll('.ui-choice, .catalog-filters__swatch')].find(
        (el) =>
          (
            el.querySelector('.catalog-filters__option-name, .ui-visually-hidden')?.textContent ??
            ''
          ).split(' (')[0] === label,
      );
      choice.querySelector('input').click();
    },
    { scope, legend, label },
  );
  await page.waitForTimeout(150);
}
const toggleSidebar = (page, legend, label) =>
  toggleOption(page, '.catalog-page__sidebar', legend, label);

async function setPrice(page, label, value) {
  await page.evaluate(
    ({ label, value }) => {
      const input = document.querySelector(
        `.catalog-page__sidebar input[aria-label="${label}: значение"]`,
      );
      input.focus();
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.blur();
    },
    { label, value },
  );
  await page.waitForTimeout(250);
}

async function chooseSort(page, label) {
  await page.click('.catalog-page__sort');
  await page.click('.ui-select-content__item', { hasText: label });
  await page.waitForTimeout(200);
}

async function pageFacts(page) {
  return page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    mains: document.querySelectorAll('main').length,
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
  }));
}

async function settleImages(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.images) img.loading = 'eager';
    await Promise.race([
      Promise.all(
        [...document.images].map((img) =>
          img.complete
            ? null
            : new Promise((r) => {
                img.addEventListener('load', r);
                img.addEventListener('error', r);
              }),
        ),
      ),
      new Promise((r) => setTimeout(r, 6000)),
    ]);
  });
  await page.waitForTimeout(300);
}

async function shot(page, name, fullPage = true) {
  await settleImages(page);
  if (fullPage) await page.evaluate(() => window.scrollTo(0, 0));
  const file = `${SHOTS}/${name}.png`;
  await page.screenshot({ path: file, fullPage });
  if (!fullPage) {
    const view = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
    const buffer = await sharp(file)
      .extract({ left: 0, top: 0, width: view.width, height: view.height })
      .toBuffer();
    await sharp(buffer).toFile(file);
  }
}

const imageSources = (page, selector) =>
  page.evaluate(
    (selector) =>
      [...document.querySelectorAll(selector)].map((img) =>
        [img.currentSrc, img.getAttribute('src'), img.getAttribute('srcset')]
          .concat(
            [...(img.closest('picture')?.querySelectorAll('source') ?? [])].map((s) =>
              s.getAttribute('srcset'),
            ),
          )
          .join(' '),
      ),
    selector,
  );
const allLaptopArt = (sources) =>
  sources.length > 0 &&
  sources.every((source) => source.includes(LAPTOP_ART) && !source.includes(PHONE_ART));

console.log('stage: data', new Date().toISOString());
check(laptopsCategory?.is_active === true, 'data: laptops category active');
check(laptopRows.length === 12, `data: 12 laptop rows, got ${laptopRows.length}`);
check(
  JSON.stringify(laptopRows.map((row) => row.slug).sort()) === JSON.stringify(EXPECTED_SLUGS),
  'data: exact 12 laptop slugs',
);
check(
  laptopRows.every((row) => row.is_active),
  'data: all laptop rows active',
);
check(
  EXPECTED_SLUGS.every((slug) => PRODUCTS.filter((row) => row.slug === slug).length === 1),
  'data: every laptop slug appears once in the snapshot',
);

console.log('stage: route', new Date().toISOString());
const page = await newPage(1440, 900);
await fresh(page);
let state = await listing(page);
const route = await page.evaluate(() => {
  const crumbs = [...document.querySelectorAll('.catalog-page__breadcrumbs li')];
  const legends = [...document.querySelectorAll('.catalog-page__sidebar fieldset > legend')].map(
    (legend) => legend.textContent,
  );
  const groups = Object.fromEntries(
    [...document.querySelectorAll('.catalog-page__sidebar fieldset')].map((fieldset) => [
      fieldset.querySelector('legend').textContent,
      [...fieldset.querySelectorAll('.ui-choice, .catalog-filters__swatch')].map((choice) =>
        (choice.querySelector('.catalog-filters__swatch-dot')
          ? choice.querySelector('.ui-visually-hidden').textContent
          : `${choice.querySelector('.catalog-filters__option-name')?.textContent ?? ''} (${
              choice.querySelector('.catalog-filters__option-count')?.textContent ?? ''
            })`
        ).trim(),
      ),
    ]),
  );
  return {
    crumbs: crumbs.map((crumb) => crumb.textContent.trim()),
    crumbLinks: crumbs.map((crumb) => crumb.querySelector('a')?.getAttribute('href') ?? null),
    current: crumbs.at(-1)?.getAttribute('aria-current'),
    breadcrumbNav: document.querySelector('nav[aria-label="Хлебные крошки"]') !== null,
    legends,
    groups,
    priceHeading: document.querySelector('.catalog-page__sidebar h3')?.textContent,
    priceLabels: [...document.querySelectorAll('.catalog-page__sidebar input[aria-label]')].map(
      (input) => input.getAttribute('aria-label'),
    ),
    brandSearch: document.querySelector('.catalog-page__sidebar input[type="search"]')
      ? document.querySelector('.catalog-page__sidebar label')?.textContent
      : null,
    quick: document.querySelectorAll('.catalog-page__quick-filter').length,
    promo: document.querySelectorAll('.catalog-grid__promo').length,
    countLive: document.querySelector('.catalog-page__count')?.getAttribute('aria-live'),
    sortLabel: document.querySelector('.catalog-page__sort')?.getAttribute('aria-label'),
    text: document.querySelector('main').innerText,
    sidebarText: document.querySelector('.catalog-page__sidebar').innerText,
  };
});
const facts = await pageFacts(page);
check(
  facts.mains === 1 && JSON.stringify(facts.h1) === JSON.stringify(['Ноутбуки']),
  `route: one main, one h1 «Ноутбуки» ${JSON.stringify(facts.h1)}`,
);
check(
  route.breadcrumbNav &&
    JSON.stringify(route.crumbs) === JSON.stringify(['Главная', 'Каталог', 'Ноутбуки']) &&
    route.crumbLinks[0] === '#/' &&
    route.crumbLinks[1] === null &&
    route.current === 'page',
  `route: breadcrumbs ${JSON.stringify(route.crumbs)} ${JSON.stringify(route.crumbLinks)}`,
);
check(countOf(state) === 12 && state.titles.length === 12, `route: 12 products (${state.count})`);
check(
  JSON.stringify([...slugsOf(state)].sort()) === JSON.stringify(EXPECTED_SLUGS),
  'route: the 12 live laptop cards',
);
check(!state.pagination, 'pagination: no visible control for 12 products');
check(route.quick === 0 && route.promo === 0, 'route: no quick filters and no in-grid promo');
check(route.countLive === 'polite', 'a11y: result count is a polite live region');
check(route.sortLabel === 'Сортировка', 'a11y: sort trigger labelled');
check(
  JSON.stringify(route.legends) ===
    JSON.stringify([
      'Производитель',
      'Диагональ экрана',
      'Процессор',
      'Оперативная память (RAM)',
      'Объём накопителя (SSD)',
      'Видеокарта',
      'Операционная система',
      'Цвет',
    ]),
  `facets: legend inventory ${JSON.stringify(route.legends)}`,
);
check(
  route.priceHeading === 'Цена, ₽' &&
    route.priceLabels.includes('Цена от: значение') &&
    route.priceLabels.includes('Цена до: значение'),
  `facets: price group labelled ${JSON.stringify(route.priceLabels)}`,
);
check(
  route.brandSearch === 'Поиск производителя',
  `a11y: brand search labelled (${route.brandSearch})`,
);
check(
  !/Наличие|Рейтинг|Серия|Быстрая доставка/u.test(route.sidebarText) &&
    !/трейд-ин|Популярные бренды|Хиты продаж/iu.test(route.text),
  `facets: no availability, rating, series, trade-in or brand carousel (${/Наличие|Рейтинг|Серия|Быстрая доставка/u.exec(route.sidebarText)?.[0]})`,
);
const expectGroup = (legend, expected) =>
  check(
    JSON.stringify(route.groups[legend]) === JSON.stringify(expected),
    `facets: ${legend} ${JSON.stringify(route.groups[legend])}`,
  );
expectGroup('Производитель', [
  'Все производители (12)',
  'Acer (2)',
  'Apple (2)',
  'ASUS (2)',
  'HP (2)',
  'Lenovo (2)',
  'HUAWEI (1)',
  'MSI (1)',
]);
expectGroup('Диагональ экрана', ['13″ – 14″ (4)', '15″ – 16″ (7)', '17″ и больше (1)']);
expectGroup('Процессор', [
  'Apple M3 (2)',
  'Intel Core i5 (5)',
  'Intel Core i7 (1)',
  'Intel Core Ultra 5 (1)',
  'AMD Ryzen 5 (1)',
  'AMD Ryzen 7 (2)',
]);
expectGroup('Оперативная память (RAM)', ['8 ГБ (3)', '16 ГБ (9)']);
expectGroup('Объём накопителя (SSD)', ['256 ГБ (1)', '512 ГБ (9)', '1 ТБ (2)']);
expectGroup('Видеокарта', [
  'Встроенная (8)',
  'GeForce RTX 3050 (1)',
  'GeForce RTX 4050 (1)',
  'GeForce RTX 4060 (2)',
]);
expectGroup('Операционная система', ['macOS (2)', 'Windows 11 (10)']);
expectGroup('Цвет', [
  'Серый (4)',
  'Синий (1)',
  'Чёрный (1)',
  'Серебристый (3)',
  'Серый космос (2)',
  'Полночь (1)',
]);
await shot(page, 'laptops-default-1440');

console.log('stage: cards', new Date().toISOString());
const cards = await page.evaluate(() =>
  [...document.querySelectorAll('.catalog-grid .product-card')].map((card) => ({
    title: card.querySelector('.product-card__title')?.textContent.trim(),
    href: card.querySelector('.product-card__link')?.getAttribute('href'),
    badge: card.querySelector('.product-badge')?.textContent ?? null,
    badgeKind: card.querySelector('.product-badge--sale')
      ? 'sale'
      : card.querySelector('.product-badge--new')
        ? 'new'
        : null,
    oldPrice: card.querySelector('.product-card__old-price, s, del')?.textContent ?? null,
    rating: card.innerText.includes('4,') || card.innerText.includes('4.'),
    buttons: [...card.querySelectorAll('button')].map(
      (button) => button.getAttribute('aria-label') ?? button.textContent.trim(),
    ),
  })),
);
const cardSources = await imageSources(page, '.catalog-grid .product-card img');
check(allLaptopArt(cardSources), `cards: laptop category artwork on all 12 (${cardSources[0]})`);
for (const card of cards) {
  const slug = byName.get(card.title);
  const row = bySlug.get(slug);
  check(card.href === `#/product/${slug}`, `cards: ${slug} PDP link ${card.href}`);
  const sale = row.old_price !== null && row.old_price > row.price;
  const expectedBadge = sale
    ? `-${Math.round(((row.old_price - row.price) / row.old_price) * 100)}%`
    : row.is_new
      ? 'Новинка'
      : null;
  check(
    card.badge === expectedBadge && card.badgeKind === (sale ? 'sale' : row.is_new ? 'new' : null),
    `cards: ${slug} badge ${card.badge}/${card.badgeKind} vs ${expectedBadge}`,
  );
  check(
    card.buttons.some((label) => /корзин/iu.test(label)) &&
      card.buttons.some((label) => /избранн/iu.test(label)) &&
      card.buttons.some((label) => /сравн/iu.test(label)),
    `cards: ${slug} cart/favourite/compare controls ${JSON.stringify(card.buttons)}`,
  );
}
check(
  cards.filter((card) => card.badgeKind === 'sale').length === 6 &&
    cards.filter((card) => card.badgeKind === 'new').length === 2,
  'cards: 6 sale and 2 new badges from live data',
);

console.log('stage: sorting', new Date().toISOString());
const comparators = {
  popular: (a, b) => b.popularity_score - a.popularity_score,
  cheap: (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};
const expectedOrder = (sort, rows = laptopRows) =>
  [...rows]
    .sort((a, b) => comparators[sort](a, b) || a.slug.localeCompare(b.slug))
    .map((row) => row.slug);
check(
  JSON.stringify(slugsOf(state)) === JSON.stringify(expectedOrder('popular')),
  `sort: default popular order ${slugsOf(state).join(',')}`,
);
for (const [value, label] of [
  ['cheap', 'Сначала дешевле'],
  ['expensive', 'Сначала дороже'],
  ['rating', 'По рейтингу'],
  ['popular', 'Сначала популярные'],
]) {
  const before = (await listing(page)).index;
  await chooseSort(page, label);
  state = await listing(page);
  check(
    JSON.stringify(slugsOf(state)) === JSON.stringify(expectedOrder(value)) &&
      state.sort === label &&
      state.index === before + 1 &&
      state.query === (value === 'popular' ? '' : `sort=${value}`),
    `sort: ${value} order, push, query ${state.query}`,
  );
  if (value === 'cheap') await shot(page, 'laptops-sort-cheap-1440');
}

console.log('stage: facets', new Date().toISOString());
const facetCases = [
  ['Производитель', 'Apple', 'brand=Apple', (r) => r.brand === 'Apple'],
  ['Диагональ экрана', '17″ и больше', 'diagonal=17%2B', (r) => r.slug === 'msi-katana-17-rtx4060'],
  [
    'Процессор',
    'AMD Ryzen 7',
    'cpu=amd-ryzen-7',
    (r) => ['lenovo-ideapad-slim-5-14', LEGION].includes(r.slug),
  ],
  [
    'Оперативная память (RAM)',
    '8 ГБ',
    'ram=8',
    (r) => ['macbook-air-13-m3-256', 'macbook-pro-14-m3-512', 'hp-15-i5-512'].includes(r.slug),
  ],
  [
    'Объём накопителя (SSD)',
    '1 ТБ',
    'ssd=1024',
    (r) => [LEGION, 'msi-katana-17-rtx4060'].includes(r.slug),
  ],
  [
    'Видеокарта',
    'GeForce RTX 4060',
    'gpu=rtx-4060',
    (r) => [LEGION, 'msi-katana-17-rtx4060'].includes(r.slug),
  ],
  ['Операционная система', 'macOS', 'os=macos', (r) => r.brand === 'Apple'],
  ['Цвет', 'Серый', `colour=${encodeURIComponent('Серый')}`, (r) => r.name.endsWith(', Серый')],
  [
    'Цвет',
    'Полночь',
    `colour=${encodeURIComponent('Полночь')}`,
    (r) => r.name.endsWith(', Полночь'),
  ],
];
for (const [legend, label, query, predicate] of facetCases) {
  await openLaptops(page);
  const before = (await listing(page)).index;
  await toggleSidebar(page, legend, label);
  state = await listing(page);
  const expected = expectedOrder('popular', laptopRows.filter(predicate));
  check(
    JSON.stringify(slugsOf(state)) === JSON.stringify(expected) &&
      countOf(state) === expected.length &&
      state.query === query &&
      state.index === before + 1,
    `facet: ${legend} ${label} → ${expected.length} (${state.query}, ${slugsOf(state).join(',')})`,
  );
  if (legend === 'Производитель') await shot(page, 'laptops-one-facet-1440');
}

await openLaptops(page);
await toggleSidebar(page, 'Оперативная память (RAM)', '8 ГБ');
await toggleSidebar(page, 'Оперативная память (RAM)', '16 ГБ');
state = await listing(page);
check(
  countOf(state) === 12 && state.query === 'ram=8&ram=16',
  `facet: OR within a group (${state.query})`,
);

await openLaptops(page);
await toggleSidebar(page, 'Производитель', 'Lenovo');
await toggleSidebar(page, 'Видеокарта', 'GeForce RTX 4060');
state = await listing(page);
check(
  JSON.stringify(slugsOf(state)) === JSON.stringify([LEGION]) &&
    state.query === 'brand=Lenovo&gpu=rtx-4060',
  `facet: AND across groups → Legion (${state.query})`,
);
await toggleSidebar(page, 'Процессор', 'AMD Ryzen 7');
await setPrice(page, 'Цена от', '100000');
state = await listing(page);
check(
  JSON.stringify(slugsOf(state)) === JSON.stringify([LEGION]),
  `facet: multi-filter keeps Legion (${state.query})`,
);
await shot(page, 'laptops-multi-filter-1440');

await openLaptops(page);
let before = (await listing(page)).index;
await setPrice(page, 'Цена до', '60000');
state = await listing(page);
check(
  JSON.stringify(slugsOf(state)) ===
    JSON.stringify(
      expectedOrder(
        'popular',
        laptopRows.filter((r) => r.price <= 60000),
      ),
    ) &&
    state.query === 'price_to=60000' &&
    state.index === before,
  `price: ≤ 60 000 → 3, replace (${state.query}, index ${before}→${state.index})`,
);

await openLaptops(page, 'sort=cheap');
await toggleSidebar(page, 'Производитель', 'Apple');
await toggleSidebar(page, 'Операционная система', 'Windows 11');
state = await listing(page);
check(
  state.empty && state.titles.length === 0 && countOf(state) === 0,
  `no-results: Apple + Windows 11 shows the empty state (${state.count})`,
);
await shot(page, 'laptops-no-results-1440');
await page.click('.catalog-page__results button', { hasText: 'Сбросить фильтры' });
await page.waitForTimeout(200);
state = await listing(page);
check(
  countOf(state) === 12 && state.query === 'sort=cheap',
  `reset: empty-state reset clears filters, keeps sort (${state.query})`,
);
await openLaptops(page, 'brand=HP&page=2&sort=rating');
await page.click('.catalog-page__sidebar .catalog-filters__reset');
await page.waitForTimeout(200);
state = await listing(page);
check(
  countOf(state) === 12 && state.query === 'sort=rating',
  `reset: sidebar reset clears filters and page, keeps sort (${state.query})`,
);

console.log('stage: url', new Date().toISOString());
await openLaptops(
  page,
  `utm=keep&os=windows-11&colour=${encodeURIComponent('Серый')}&brand=Lenovo&sort=expensive&ssd=1024&gpu=rtx-4060&cpu=amd-ryzen-7&ram=16&diagonal=15-16&price_to=200000&price_from=100000`,
);
state = await listing(page);
check(
  JSON.stringify(slugsOf(state)) === JSON.stringify([LEGION]),
  `url: every parameter restores (${slugsOf(state).join(',')})`,
);
const loadedQuery = state.query;
await toggleSidebar(page, 'Цвет', 'Серый');
await toggleSidebar(page, 'Цвет', 'Серый');
state = await listing(page);
check(
  state.query ===
    `utm=keep&brand=Lenovo&diagonal=15-16&cpu=amd-ryzen-7&ram=16&ssd=1024&gpu=rtx-4060&os=windows-11&colour=${encodeURIComponent('Серый')}&price_from=100000&price_to=200000&sort=expensive` &&
    loadedQuery.startsWith('utm=keep&os='),
  `url: canonical serialization order, unrelated param preserved (${state.query})`,
);

const unknown =
  'brand=Nokia&diagonal=11-12&cpu=intel-core-i9&ram=4&ssd=2048&gpu=rtx-4090&os=linux&colour=Red&sort=bogus&page=abc&utm=x';
await openLaptops(page, unknown);
state = await listing(page);
check(
  countOf(state) === 12 && state.query === unknown && state.sort === 'Сначала популярные',
  `url: unknown values ignored and URL not auto-cleaned (${state.query})`,
);

await openLaptops(page, 'page=5');
state = await listing(page);
check(
  countOf(state) === 12 &&
    state.titles.length === 12 &&
    !state.pagination &&
    state.query === 'page=5',
  `pagination: out-of-range page renders page 1 without rewriting (${state.query})`,
);
before = state.index;
await toggleSidebar(page, 'Производитель', 'Acer');
state = await listing(page);
check(
  state.query === 'brand=Acer' && state.index === before + 1,
  `url: refinement drops page with push (${state.query})`,
);
await openLaptops(page, 'page=3');
await setPrice(page, 'Цена от', '50000');
state = await listing(page);
check(state.query === 'price_from=50000', `url: price change drops page (${state.query})`);
await openLaptops(page, 'page=3');
await chooseSort(page, 'Сначала дороже');
state = await listing(page);
check(state.query === 'sort=expensive', `url: sort drops page (${state.query})`);

await openLaptops(page, 'brand=Apple&sort=expensive');
await page.reload();
await page.waitForSelector('.catalog-page__title');
await page.waitForTimeout(200);
state = await listing(page);
const appleChecked = await page.evaluate(
  () =>
    [...document.querySelectorAll('.catalog-page__sidebar .ui-choice')]
      .find((choice) => choice.textContent.startsWith('Apple'))
      ?.querySelector('input').checked,
);
check(
  JSON.stringify(slugsOf(state)) ===
    JSON.stringify(['macbook-pro-14-m3-512', 'macbook-air-13-m3-256']) &&
    state.sort === 'Сначала дороже' &&
    appleChecked === true,
  `url: reload restores filters and sort (${slugsOf(state).join(',')})`,
);

await openLaptops(page);
await toggleSidebar(page, 'Производитель', 'HP');
await chooseSort(page, 'Сначала дешевле');
await page.evaluate(() => history.back());
await page.waitForTimeout(300);
state = await listing(page);
const backOne =
  state.query === 'brand=HP' && countOf(state) === 2 && state.sort === 'Сначала популярные';
await page.evaluate(() => history.back());
await page.waitForTimeout(300);
state = await listing(page);
const backTwo = state.query === '' && countOf(state) === 12;
await page.evaluate(() => history.forward());
await page.waitForTimeout(300);
state = await listing(page);
check(
  backOne && backTwo && state.query === 'brand=HP' && countOf(state) === 2,
  `url: Back/Forward restore state (${state.query})`,
);

console.log('stage: keyboard', new Date().toISOString());
await openLaptops(page);
const focusOrder = [];
await page.focus('.catalog-page__sort');
for (let i = 0; i < 6; i += 1) {
  await page.keyboard.press('Tab');
  focusOrder.push(
    await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        inSidebar: Boolean(el?.closest('.catalog-page__sidebar')),
        outline: getComputedStyle(
          el.matches('input[type="checkbox"]') ? (el.nextElementSibling ?? el) : el,
        ).outlineStyle,
      };
    }),
  );
}
check(
  focusOrder.some((entry) => entry.inSidebar),
  `keyboard: Tab reaches the filter sidebar ${JSON.stringify(focusOrder)}`,
);
await page.close();

console.log('stage: mobile', new Date().toISOString());
const mobile = await newPage(390, 844);
await fresh(mobile);
let mobileFacts = await pageFacts(mobile);
const mobileLayout = await mobile.evaluate(() => ({
  sidebar: getComputedStyle(document.querySelector('.catalog-page__sidebar')).display,
  trigger: document.querySelector('.catalog-filter-trigger')?.getBoundingClientRect().width ?? 0,
  cards: document.querySelectorAll('.catalog-grid .product-card').length,
}));
check(
  mobileFacts.overflow <= 0 &&
    mobileLayout.sidebar === 'none' &&
    mobileLayout.trigger > 0 &&
    mobileLayout.cards === 12,
  `390: trigger, hidden sidebar, 12 cards, no overflow ${JSON.stringify({ ...mobileLayout, overflow: mobileFacts.overflow })}`,
);
await shot(mobile, 'laptops-default-390');

await mobile.click('.catalog-filter-trigger');
await mobile.waitForSelector('.catalog-filter-dialog');
await mobile.waitForTimeout(250);
const dialogInfo = await mobile.evaluate(() => {
  const dialog = document.querySelector('.catalog-filter-dialog');
  return {
    role: dialog.getAttribute('role'),
    title: dialog.querySelector('.catalog-filter-dialog__title')?.textContent,
    focusInside: dialog.contains(document.activeElement),
    legends: [...dialog.querySelectorAll('fieldset > legend')].map((l) => l.textContent),
    fits:
      dialog.getBoundingClientRect().right <= document.documentElement.clientWidth + 0.5 &&
      dialog.scrollWidth <= dialog.clientWidth &&
      [...dialog.querySelectorAll('input, .ui-choice')].every(
        (el) => el.getBoundingClientRect().right <= dialog.getBoundingClientRect().right + 0.5,
      ),
  };
});
check(
  dialogInfo.role === 'dialog' &&
    dialogInfo.title === 'Фильтры' &&
    dialogInfo.focusInside &&
    dialogInfo.legends.length === 8 &&
    dialogInfo.fits,
  `390: dialog semantics, focus inside, same 8 groups ${JSON.stringify(dialogInfo)}`,
);
const trap = [];
for (let i = 0; i < 80; i += 1) {
  await mobile.keyboard.press('Tab');
  trap.push(
    await mobile.evaluate(() =>
      Boolean(document.querySelector('.catalog-filter-dialog')?.contains(document.activeElement)),
    ),
  );
}
check(trap.every(Boolean), 'keyboard: Tab stays trapped inside the filter dialog');
let mobileBefore = await listing(mobile);
await toggleOption(mobile, '.catalog-filter-dialog', 'Производитель', 'Lenovo');
await toggleOption(mobile, '.catalog-filter-dialog', 'Видеокарта', 'GeForce RTX 4060');
let mobileState = await listing(mobile);
check(
  mobileState.query === '' && mobileState.index === mobileBefore.index,
  `mobile draft: dialog edits do not touch the URL (${mobileState.query})`,
);
await shot(mobile, 'laptops-filter-dialog-390', false);
await mobile.click('.catalog-filter-dialog__action', { hasText: 'Показать' });
await mobile.waitForTimeout(300);
mobileState = await listing(mobile);
const focusReturned = await mobile.evaluate(() =>
  document.activeElement?.classList.contains('catalog-filter-trigger'),
);
check(
  mobileState.query === 'brand=Lenovo&gpu=rtx-4060' &&
    mobileState.index === mobileBefore.index + 1 &&
    JSON.stringify(slugsOf(mobileState)) === JSON.stringify([LEGION]) &&
    mobileState.trigger.endsWith('2') &&
    !(await mobile.evaluate(() => document.querySelector('.catalog-filter-dialog') !== null)),
  `mobile apply: one push, URL written once, badge 2 (${mobileState.query}, ${mobileState.trigger})`,
);
check(focusReturned, 'keyboard: focus returns to the Фильтры trigger after Apply');
await shot(mobile, 'laptops-multi-filter-390');

await mobile.click('.catalog-filter-trigger');
await mobile.waitForSelector('.catalog-filter-dialog');
await mobile.click('.catalog-filter-dialog__action', { hasText: 'Сбросить' });
await mobile.waitForTimeout(150);
mobileBefore = await listing(mobile);
await mobile.evaluate(() =>
  document.activeElement.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  ),
);
await mobile.waitForTimeout(300);
mobileState = await listing(mobile);
const escapeFocus = await mobile.evaluate(() =>
  document.activeElement?.classList.contains('catalog-filter-trigger'),
);
check(
  mobileState.query === 'brand=Lenovo&gpu=rtx-4060' &&
    mobileState.index === mobileBefore.index &&
    escapeFocus &&
    !(await mobile.evaluate(() => document.querySelector('.catalog-filter-dialog') !== null)),
  `mobile draft: Escape discards the reset draft and returns focus (${mobileState.query})`,
);
await mobile.click('.catalog-filter-trigger');
await mobile.waitForSelector('.catalog-filter-dialog');
await mobile.click('.catalog-filter-dialog__action', { hasText: 'Сбросить' });
await mobile.click('.catalog-filter-dialog__action', { hasText: 'Показать' });
await mobile.waitForTimeout(300);
mobileState = await listing(mobile);
check(
  mobileState.query === '' && countOf(mobileState) === 12,
  `mobile apply: reset draft clears filters (${mobileState.query})`,
);

await openLaptops(mobile, 'brand=Apple');
await shot(mobile, 'laptops-one-facet-390');
await openLaptops(mobile, 'brand=Apple&os=windows-11');
mobileState = await listing(mobile);
mobileFacts = await pageFacts(mobile);
check(mobileState.empty && mobileFacts.overflow <= 0, '390: no-results state without overflow');
await shot(mobile, 'laptops-no-results-390');
await mobile.close();

console.log('stage: responsive', new Date().toISOString());
for (const [width, height] of [
  [1440, 900],
  [1024, 768],
  [390, 844],
]) {
  const p = await newPage(width, height);
  await fresh(p);
  const metrics = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('.catalog-grid .product-card')];
    const firstTop = cards[0]?.getBoundingClientRect().top;
    const columns = cards.filter(
      (card) => Math.abs(card.getBoundingClientRect().top - firstTop) < 2,
    ).length;
    const heading = document.querySelector('.catalog-page__title').getBoundingClientRect();
    const sort = document.querySelector('.catalog-page__sort').getBoundingClientRect();
    const overlap = !(
      heading.right <= sort.left ||
      sort.right <= heading.left ||
      heading.bottom <= sort.top ||
      sort.bottom <= heading.top
    );
    const header = [
      ...document.querySelectorAll(
        '.site-header__brand, .site-header__catalog, .site-header__search, .site-header__actions',
      ),
    ].map((el) => el.getBoundingClientRect());
    const headerCollision = header.some((a, i) =>
      header.some(
        (b, j) =>
          i < j &&
          a.width > 1 &&
          b.width > 1 &&
          a.left < b.right - 1 &&
          b.left < a.right - 1 &&
          a.top < b.bottom - 1 &&
          b.top < a.bottom - 1,
      ),
    );
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sidebar: getComputedStyle(document.querySelector('.catalog-page__sidebar')).display,
      columns,
      overlap,
      headerCollision,
    };
  });
  const expectedSidebar = width >= 1024 ? 'block' : 'none';
  check(
    metrics.overflow <= 0 &&
      !metrics.overlap &&
      !metrics.headerCollision &&
      (metrics.sidebar === expectedSidebar || (width >= 1024 && metrics.sidebar !== 'none')) &&
      (width !== 1440 || metrics.columns === 4),
    `responsive ${width}: ${JSON.stringify(metrics)}`,
  );
  await p.close();
}

console.log('stage: navigation', new Date().toISOString());
for (const [width, height, suffix] of [
  [1440, 900, '1440'],
  [390, 844, '390'],
]) {
  const p = await newPage(width, height);
  await p.goto(`${NEW}#/`);
  await p.waitForSelector('.home-tiles');
  await p.waitForFunction(() => document.querySelector('.home-tile--available') !== null);
  const nav = await p.evaluate(() => {
    const headerLinks = Object.fromEntries(
      [...document.querySelectorAll('.site-header__category')].map((link) => [
        link.textContent.trim(),
        link.getAttribute('href'),
      ]),
    );
    const tiles = [...document.querySelectorAll('.home-tiles > li > *')].map((tile) => [
      tile.textContent.trim(),
      tile.tagName,
      tile.getAttribute('href'),
    ]);
    return { headerLinks, tiles };
  });
  const unresolvedHeader = Object.entries(nav.headerLinks).filter(
    ([label]) => !['Смартфоны', 'Ноутбуки'].includes(label),
  );
  check(
    nav.headerLinks['Ноутбуки'] === '#/catalog/laptops' &&
      nav.headerLinks['Смартфоны'] === '#/catalog/smartphones' &&
      unresolvedHeader.every(([, href]) => !href.startsWith('#/catalog/')),
    `nav ${suffix}: header Ноутбуки link, others unchanged ${JSON.stringify(nav.headerLinks)}`,
  );
  const linkedTiles = nav.tiles.filter(([, tag]) => tag === 'A');
  check(
    JSON.stringify(linkedTiles.map(([label, , href]) => [label, href]).sort()) ===
      JSON.stringify(
        [
          ['Ноутбуки', '#/catalog/laptops'],
          ['Смартфоны', '#/catalog/smartphones'],
        ].sort(),
      ),
    `nav ${suffix}: only Смартфоны and Ноутбуки tiles link ${JSON.stringify(nav.tiles)}`,
  );
  await p.evaluate(() =>
    [...document.querySelectorAll('.site-header__category')]
      .find((link) => link.textContent.trim() === 'Ноутбуки')
      .scrollIntoView({ block: 'center', inline: 'center' }),
  );
  await p.waitForTimeout(200);
  const visible = await p.evaluate(() => {
    const link = [...document.querySelectorAll('.site-header__category')].find(
      (el) => el.textContent.trim() === 'Ноутбуки',
    );
    const rect = link.getBoundingClientRect();
    return rect.width > 1 && rect.left >= -1 && rect.right <= innerWidth + 1;
  });
  check(visible, `nav ${suffix}: header Ноутбуки reachable in the category row/scroller`);
  await shot(p, `laptops-header-home-link-${suffix}`);
  await p.click('.site-header__category', { hasText: 'Ноутбуки' });
  await p.waitForSelector('.catalog-page__title');
  check(
    (await p.evaluate(() => location.hash)) === LAPTOPS_HASH,
    `nav ${suffix}: header click opens the laptops route`,
  );
  await p.goto(`${NEW}#/`);
  await p.waitForFunction(() => document.querySelector('.home-tile--available') !== null);
  await p.click('.home-tile--available', { hasText: 'Ноутбуки' });
  await p.waitForSelector('.catalog-page__title');
  check(
    (await p.evaluate(() => location.hash)) === LAPTOPS_HASH &&
      (await p.textContent('h1')) === 'Ноутбуки',
    `nav ${suffix}: Home tile opens the laptops route`,
  );
  await p.goto(`${NEW}#/catalog/tablets`);
  await p.waitForSelector('h1');
  check(
    (await p.textContent('h1')) === 'Страница не найдена',
    `nav ${suffix}: #/catalog/tablets stays a designed 404`,
  );
  await p.close();
}

console.log('stage: states', new Date().toISOString());
for (const [name, value] of [
  ['read error', { productsError: true }],
  ['0 live laptops', { laptopsEmpty: true }],
]) {
  scenario = value;
  const p = await newPage(1440, 900);
  await p.goto(`${NEW}${LAPTOPS_HASH}`);
  await p.waitForFunction(() => document.querySelector('h1') !== null);
  const text = await p.evaluate(() => ({
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent),
    cards: document.querySelectorAll('.product-card').length,
    mains: document.querySelectorAll('main').length,
  }));
  check(
    JSON.stringify(text.h1) === JSON.stringify(['Товары временно недоступны']) &&
      text.cards === 0 &&
      text.mains === 1,
    `states: ${name} → failure state, no fixture fallback ${JSON.stringify(text)}`,
  );
  const status = await p.evaluate(routeStatusFacts);
  check(
    status.routeStatus &&
      status.busy === null &&
      status.status === null &&
      status.message === 'Не удалось загрузить ноутбуки. Попробуйте обновить страницу позже.' &&
      JSON.stringify(status.actions) === JSON.stringify(['На главную=#/']) &&
      status.paddingTop === '96px' &&
      status.titleSize === '32px',
    `states: ${name} → shared RouteStatus failure semantics and geometry ${JSON.stringify(status)}`,
  );
  await p.close();
}
scenario = { productsHang: true };
{
  const p = await newPage(1440, 900);
  await p.goto(`${NEW}${LAPTOPS_HASH}`);
  await p.waitForSelector('main[aria-busy="true"]');
  await p.waitForTimeout(300);
  const status = await p.evaluate(routeStatusFacts);
  check(
    status.mains === 1 &&
      status.routeStatus &&
      status.busy === 'true' &&
      status.status === 'Загружаем товары…' &&
      status.h1.length === 0 &&
      status.paddingTop === '96px',
    `states: pending read → shared RouteStatus loading semantics ${JSON.stringify(status)}`,
  );
  await p.close();
}
scenario = {};

console.log('stage: card artwork', new Date().toISOString());
const UNLISTED_LAPTOP = {
  ...bySlug.get(LEGION),
  id: 'id-unlisted-laptop',
  slug: 'unlisted-verify-laptop',
  name: 'Verify Laptop 15 8/256 ГБ, Серый',
  popularity_score: 100000,
};
const IMAGED_SLUG = expectedOrder('popular')[0];
const IMAGED_PATH = 'stub/laptop-live.webp';
scenario = {
  extraProduct: UNLISTED_LAPTOP,
  productImages: [
    {
      id: 'img-laptop-live',
      product_id: bySlug.get(IMAGED_SLUG).id,
      storage_path: IMAGED_PATH,
      alt: 'Ноутбук с живым фото',
      position: 1,
    },
  ],
};
{
  const p = await newPage(1440, 900);
  await fresh(p);
  await settleImages(p);
  const cards = await p.evaluate(() =>
    Object.fromEntries(
      [...document.querySelectorAll('.catalog-grid .product-card')].map((card) => {
        const img = card.querySelector('.product-card__image');
        const sources = [img.currentSrc, img.getAttribute('src'), img.getAttribute('srcset')]
          .concat(
            [...(img.closest('picture')?.querySelectorAll('source') ?? [])].map((source) =>
              source.getAttribute('srcset'),
            ),
          )
          .join(' ');
        return [
          card.querySelector('.product-card__title').textContent.trim(),
          { sources, loaded: img.complete && img.naturalWidth > 0 },
        ];
      }),
    ),
  );
  const unlisted = cards[UNLISTED_LAPTOP.name];
  check(
    unlisted !== undefined &&
      unlisted.sources.includes(LAPTOP_ART) &&
      !unlisted.sources.includes(PHONE_ART) &&
      unlisted.loaded,
    `card artwork: laptop without product image or thumbnail falls back to loaded laptop category art ${JSON.stringify(unlisted)}`,
  );
  const imaged = cards[bySlug.get(IMAGED_SLUG).name];
  check(
    imaged !== undefined &&
      imaged.sources.includes(`catalog-media/${IMAGED_PATH}`) &&
      !imaged.sources.includes(LAPTOP_ART) &&
      !imaged.sources.includes(PHONE_ART),
    `card artwork: a real product_images URL still wins over thumbnail and category art ${JSON.stringify(imaged)}`,
  );
  const thumbnailed = Object.entries(cards).filter(
    ([title]) => title !== UNLISTED_LAPTOP.name && title !== bySlug.get(IMAGED_SLUG).name,
  );
  check(
    thumbnailed.length > 0 &&
      thumbnailed.every(
        ([, card]) =>
          card.sources.includes(LAPTOP_ART) && !card.sources.includes(PHONE_ART) && card.loaded,
      ),
    `card artwork: listed laptops keep their product thumbnail (${thumbnailed.length})`,
  );
  await p.close();
}
scenario = {};

console.log('stage: compare storage', new Date().toISOString());
{
  const p = await newPage(1440, 900);
  await fresh(p, 'ssd=1024');
  const terabyteSlugs = slugsOf(await listing(p));
  await p.click('.catalog-grid .product-card button[aria-label*="сравн" i]');
  await p.waitForTimeout(150);
  const storedCompare = await p.evaluate(() =>
    JSON.parse(localStorage.getItem('goodcall.compare.v1') ?? 'null'),
  );
  await p.goto(`${NEW}#/compare`);
  await p.waitForSelector('.compare-product');
  const storageCell = await p.evaluate(() => {
    const row = [...document.querySelectorAll('tbody tr')].find(
      (tr) => tr.querySelector('th').textContent === 'Встроенная память',
    );
    return row?.querySelector('td')?.textContent.replace(/\s/g, ' ') ?? null;
  });
  check(
    JSON.stringify([...terabyteSlugs].sort()) ===
      JSON.stringify(['lenovo-legion-5-16-rtx4060', 'msi-katana-17-rtx4060']) &&
      storedCompare?.items?.[0]?.storage === 1024 &&
      storageCell === '1 ТБ',
    `compare storage: a 1 ТБ laptop added from Catalog stores 1024 and shows «1 ТБ» ${JSON.stringify({ terabyteSlugs, stored: storedCompare?.items?.[0], storageCell })}`,
  );
  await p.close();
}

console.log('stage: downstream', new Date().toISOString());
const flow = await newPage(1440, 900);
await fresh(flow);
await flow.click('.catalog-grid .product-card button[aria-label*="корзин" i]');
await flow.waitForTimeout(150);
await flow.click('.catalog-grid .product-card button[aria-label*="избранн" i]');
await flow.waitForTimeout(150);
await flow.click('.catalog-grid .product-card button[aria-label*="сравн" i]');
await flow.waitForTimeout(150);
const firstSlug = expectedOrder('popular')[0];
const stored = await flow.evaluate(() => ({
  cart: JSON.parse(localStorage.getItem('goodcall.cart.v1') ?? 'null'),
  favorites: JSON.parse(localStorage.getItem('goodcall.favorites.v1') ?? 'null'),
  compare: JSON.parse(localStorage.getItem('goodcall.compare.v1') ?? 'null'),
}));
check(
  JSON.stringify(stored).includes(firstSlug) &&
    stored.compare?.items?.[0]?.storage === 256 &&
    stored.compare?.items?.[0]?.brand === 'Apple',
  `downstream: cart, favourite, compare stored for ${firstSlug} with SSD 256 ${JSON.stringify(stored.compare)}`,
);
for (const [hash, selector, label] of [
  ['#/cart', '.cart-line img, .cart-page img', 'Cart'],
  ['#/favorites', '.favorites-page main img, main img', 'Favourites'],
  ['#/compare', '.compare-product__image', 'Compare'],
  ['#/checkout', '.checkout-line__image', 'Checkout'],
]) {
  await flow.goto(`${NEW}${hash}`);
  await flow.waitForSelector('main');
  await flow.waitForTimeout(400);
  const sources = (await imageSources(flow, selector)).filter((source) => source.trim() !== '');
  const relevant = sources.filter(
    (source) => source.includes(LAPTOP_ART) || source.includes(PHONE_ART),
  );
  check(
    relevant.length > 0 && relevant.every((source) => source.includes(LAPTOP_ART)),
    `downstream: ${label} uses laptop artwork (${relevant.length})`,
  );
}
const row = bySlug.get(firstSlug);
const payment = STOREFRONT_PAYMENT_OPTIONS[0].value;
await flow.evaluate(
  (order) => sessionStorage.setItem('goodcall.lastOrder.v1', JSON.stringify(order)),
  {
    number: 'GC-20261008-AB12',
    createdAt: new Date().toISOString(),
    lines: [
      {
        productSlug: firstSlug,
        title: row.name,
        image: { kind: 'catalog-fallback' },
        price: row.price,
        quantity: 1,
      },
    ],
    totals: { unitCount: 1, listTotal: row.price, discount: 0, total: row.price },
    deliveryMethod: 'pickup',
    pickupStoreId: 'moscow-aviapark',
    payment,
  },
);
await flow.goto(`${NEW}#/order-confirmation`);
await flow.waitForSelector('.order-line');
const orderSources = await imageSources(flow, '.order-line img');
check(allLaptopArt(orderSources), `downstream: Order Confirmation uses laptop artwork`);
await flow.close();

console.log('stage: pdp', new Date().toISOString());
const pdp = await newPage(1440, 900);
await fresh(pdp);
await pdp.click(`a[href="#/product/${LEGION}"]`);
await pdp.waitForFunction(
  () => !document.querySelector('[aria-busy="true"]') && document.querySelector('h1'),
);
await pdp.waitForTimeout(300);
const legion = await pdp.evaluate(() => ({
  hash: location.hash,
  h1: document.querySelector('h1')?.textContent,
  crumbs: [...document.querySelectorAll('nav[aria-label="Хлебные крошки"] a')].map((a) => [
    a.textContent.trim(),
    a.getAttribute('href'),
  ]),
  text: document.querySelector('main').innerText,
  related: document.querySelector('.product-related') !== null,
  galleryImages: [...document.querySelectorAll('.product-gallery img')].length,
}));
const legionGallery = await imageSources(pdp, '.product-gallery img');
check(
  legion.hash === `#/product/${LEGION}` &&
    legion.h1 === bySlug.get(LEGION).name &&
    legion.crumbs.some(([label, href]) => label === 'Ноутбуки' && href === LAPTOPS_HASH) &&
    !legion.related &&
    legion.text.includes('AMD Ryzen 7 7840HS') &&
    legion.text.includes('NVIDIA GeForce RTX 4060') &&
    allLaptopArt(legionGallery),
  `pdp: Legion handoff, category crumb, specs, laptop art, no related ${JSON.stringify({ ...legion, text: undefined })}`,
);
await shot(pdp, 'laptop-pdp-legion-1440');
for (const slug of EXPECTED_SLUGS) {
  await pdp.goto(`${NEW}#/product/${slug}`);
  await pdp.waitForFunction(
    () => !document.querySelector('[aria-busy="true"]') && document.querySelector('h1'),
  );
  const h1 = await pdp.textContent('h1');
  check(h1 === bySlug.get(slug).name, `pdp: ${slug} resolves (${h1})`);
}
await pdp.close();
const pdpMobile = await newPage(390, 844);
await pdpMobile.goto(`${NEW}#/product/${LEGION}`);
await pdpMobile.waitForFunction(
  () => !document.querySelector('[aria-busy="true"]') && document.querySelector('h1'),
);
const pdpMobileFacts = await pageFacts(pdpMobile);
check(pdpMobileFacts.overflow <= 0, `pdp 390: no overflow (${pdpMobileFacts.overflow})`);
await shot(pdpMobile, 'laptop-pdp-legion-390');
await pdpMobile.close();

console.log('stage: document', new Date().toISOString());
const SITE_TITLE = 'GoodCall';
const titled = (name) => `${name} — ${SITE_TITLE}`;
const IPHONE_PRO = 'iphone-15-pro-128';
const iphoneProName = PRODUCTS.find((row) => row.slug === IPHONE_PRO)?.name;
const doc = await newPage(1440, 900);
await doc.goto(`${NEW}#/`);
await doc.waitForSelector('main');
await doc.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await doc.reload();
await doc.waitForSelector('main');
check(
  (await doc.evaluate(() => document.documentElement.lang)) === 'ru',
  'document: production html lang is ru',
);
async function expectTitle(label, expected) {
  await doc.waitForFunction((title) => document.title === title, expected).catch(() => null);
  const title = await doc.evaluate(() => document.title);
  check(
    title.trim() !== '' && title !== SITE_TITLE && title.includes(SITE_TITLE) && title === expected,
    `title: ${label} → "${title}" (expected "${expected}")`,
  );
}
async function visitTitle(hash, expected) {
  await doc.evaluate((target) => {
    location.hash = target;
  }, hash);
  await expectTitle(hash, expected);
}
async function visitHeadingTitle(hash, heading) {
  await doc.evaluate((target) => {
    location.hash = target;
  }, hash);
  await doc.waitForSelector(heading);
  const h1 = (await doc.textContent(heading)).trim();
  await expectTitle(`${hash} (h1 "${h1}")`, titled(h1));
}
await expectTitle('#/ initial load', titled('Главная'));
const HOME_CRUMB = ['Главная', '#/'];
const EXPECTED_CRUMBS = {
  '#/catalog/smartphones': [HOME_CRUMB, ['Каталог', null], ['Смартфоны', null]],
  '#/catalog/laptops': [HOME_CRUMB, ['Каталог', null], ['Ноутбуки', null]],
  '#/cart': [HOME_CRUMB, ['Корзина', null]],
  '#/order-confirmation': [HOME_CRUMB, ['Заказ не найден', null]],
  '#/favorites': [HOME_CRUMB, ['Избранное', null]],
  '#/compare': [HOME_CRUMB, ['Сравнение товаров', null]],
  '#/search?q=iPhone': [HOME_CRUMB, ['Поиск', null]],
  '#/shops': [HOME_CRUMB, ['Магазины', null]],
  '#/delivery': [HOME_CRUMB, ['Доставка и оплата', null]],
  '#/faq': [HOME_CRUMB, ['FAQ', null]],
  '#/about': [HOME_CRUMB, ['О нас', null]],
  '#/blog': [HOME_CRUMB, ['Блог', null]],
  '#/login': [HOME_CRUMB, ['Вход', null]],
  '#/no-such-route': [HOME_CRUMB, ['404', null]],
  [`#/product/${LEGION}`]: [
    HOME_CRUMB,
    ['Каталог', null],
    ['Ноутбуки', LAPTOPS_HASH],
    [bySlug.get(LEGION).name, null],
  ],
  [`#/product/${IPHONE_PRO}`]: [
    HOME_CRUMB,
    ['Каталог', null],
    ['Смартфоны', '#/catalog/smartphones'],
    [iphoneProName, null],
  ],
  '#/account/orders': [HOME_CRUMB, ['Аккаунт', '#/account'], ['Мои заказы', null]],
};
let crumbRoutes = 0;
async function checkCrumbs(hash) {
  if (EXPECTED_CRUMBS[hash] !== undefined) {
    await doc.waitForFunction(
      (label) => document.querySelector(`nav[aria-label="${label}"]`) !== null,
      BREADCRUMB_LABEL,
    );
  }
  const facts = await doc.evaluate(breadcrumbFacts, BREADCRUMB_LABEL);
  if (facts.navs === 0 && EXPECTED_CRUMBS[hash] === undefined) return;
  crumbRoutes += 1;
  const problems = breadcrumbProblems(facts);
  const expected = EXPECTED_CRUMBS[hash];
  if (
    expected !== undefined &&
    JSON.stringify(facts.labels.map((label, index) => [label, facts.hrefs[index]])) !==
      JSON.stringify(expected)
  ) {
    problems.push(`items ${JSON.stringify(facts.labels)} ${JSON.stringify(facts.hrefs)}`);
  }
  check(problems.length === 0, `breadcrumbs: ${hash} ${problems.join('; ')}`);
}
for (const [hash, name] of [
  ['#/catalog/smartphones', 'Смартфоны'],
  ['#/catalog/laptops', 'Ноутбуки'],
  ['#/cart', 'Корзина'],
  ['#/checkout', 'Оформление заказа'],
  ['#/order-confirmation', 'Заказ не найден'],
  ['#/favorites', 'Избранное'],
  ['#/compare', 'Сравнение товаров'],
  ['#/search?q=iPhone', 'Результаты поиска «iPhone»'],
  ['#/shops', 'Магазины'],
  ['#/delivery', 'Доставка и оплата'],
  ['#/warranty', 'Гарантия и возврат'],
  ['#/faq', 'Часто задаваемые вопросы'],
  ['#/contacts', 'Контакты'],
  ['#/about', 'О нас'],
  ['#/privacy', 'Политика конфиденциальности'],
  ['#/terms', 'Пользовательское соглашение'],
  ['#/offer', 'Публичная оферта'],
  ['#/blog', 'Блог'],
  ['#/login', 'Вход'],
  ['#/account', 'Вход'],
  [`#/product/${LEGION}`, bySlug.get(LEGION).name],
  [`#/product/${IPHONE_PRO}`, iphoneProName],
  ['#/product/no-such-product', 'Товар не найден'],
  ['#/blog/no-such-article', 'Страница не найдена'],
  ['#/no-such-route', 'Страница не найдена'],
]) {
  await visitTitle(hash, titled(name));
  await checkCrumbs(hash);
}
await visitHeadingTitle(`#/product/${LEGION}`, '.product-purchase__title');
await checkCrumbs(`#/product/${LEGION}`);
await visitHeadingTitle('#/blog/how-to-choose-smartphone-2024', '.blog-article__title');
const articleCrumbs = await doc.evaluate(breadcrumbFacts, BREADCRUMB_LABEL);
check(
  breadcrumbProblems(articleCrumbs).length === 0 &&
    JSON.stringify(articleCrumbs.hrefs) === JSON.stringify(['#/', '#/blog', null]) &&
    articleCrumbs.labels[2] === (await doc.textContent('.blog-article__title')).trim(),
  `breadcrumbs: blog article ${JSON.stringify(articleCrumbs)}`,
);
await visitHeadingTitle('#/order-confirmation', '.order-empty .empty-state__title');
await doc.evaluate(() => {
  localStorage.setItem('goodcall.account.v1', JSON.stringify({ version: 1, signedIn: true }));
});
await doc.reload();
for (const [hash, name] of [
  ['#/account', 'Личный кабинет'],
  ['#/account/orders', 'Мои заказы'],
  ['#/account/profile', 'Профиль'],
  ['#/account/addresses', 'Адреса доставки'],
]) {
  await visitTitle(hash, titled(name));
  await checkCrumbs(hash);
  const heading = (await doc.textContent('.account-page__title')).trim();
  check(heading === name, `title: ${hash} matches its h1 "${heading}"`);
}
await doc.evaluate(() => {
  localStorage.removeItem('goodcall.account.v1');
  location.hash = '#/';
});
await doc.reload();
await expectTitle('reload #/', titled('Главная'));
await visitTitle('#/cart', titled('Корзина'));
await visitTitle(`#/product/${LEGION}`, titled(bySlug.get(LEGION).name));
await doc.evaluate(() => history.back());
await expectTitle('Back → #/cart', titled('Корзина'));
await doc.evaluate(() => history.forward());
await expectTitle(`Forward → #/product/${LEGION}`, titled(bySlug.get(LEGION).name));
await doc.reload();
await expectTitle(`reload #/product/${LEGION}`, titled(bySlug.get(LEGION).name));
await visitTitle('#/no-such-route', titled('Страница не найдена'));
await doc.reload();
await expectTitle('reload #/no-such-route', titled('Страница не найдена'));
await doc.close();
check(crumbRoutes >= 25, `breadcrumbs: invariants covered ${crumbRoutes} routes`);

console.log('stage: headings', new Date().toISOString());
const SMARTPHONES_EMPTY_QUERY =
  'sort=rating&brand=Samsung&colour=%D0%97%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B9&quick=discounted';
const HEADING_ROUTES = [
  {
    name: 'catalog smartphones',
    hash: '#/catalog/smartphones',
    ready: '.catalog-grid .product-card',
    hidden: ['Товары каталога'],
  },
  {
    name: 'catalog laptops',
    hash: LAPTOPS_HASH,
    ready: '.catalog-grid .product-card',
    hidden: ['Товары каталога'],
  },
  {
    name: 'catalog no-results',
    hash: `#/catalog/smartphones?${SMARTPHONES_EMPTY_QUERY}`,
    ready: '.catalog-page__results .empty-state',
    hidden: ['Товары каталога'],
    empty: {
      scope: '.catalog-page__results',
      variant: 'panel',
      level: 'h3',
      icon: 'ui-icon--search',
      actions: ['button:Сбросить фильтры'],
    },
  },
  {
    name: 'search results',
    hash: '#/search?q=iPhone',
    ready: '.search-rows, .search-results',
    hidden: ['Найденные товары'],
  },
  {
    name: 'search no-results',
    hash: '#/search?q=zzzzzz',
    ready: '.search-empty',
    hidden: [],
    empty: {
      scope: '.search-page',
      variant: 'page',
      level: 'h2',
      icon: 'ui-icon--search',
      actions: ['a:Перейти в каталог=#/catalog/smartphones', 'a:На главную=#/'],
    },
  },
  {
    name: 'favourites empty',
    hash: '#/favorites',
    ready: '.favorites-empty',
    hidden: [],
    empty: {
      scope: '.favorites-page',
      variant: 'page',
      level: 'h2',
      icon: 'ui-icon--heart',
      actions: ['a:Перейти в каталог=#/catalog/smartphones', 'a:На главную=#/'],
    },
  },
  {
    name: 'compare empty',
    hash: '#/compare',
    ready: '.compare-empty',
    hidden: [],
    empty: {
      scope: '.compare-page',
      variant: 'page',
      level: 'h1',
      icon: 'ui-icon--compare',
      actions: ['a:Перейти в каталог=#/catalog/smartphones'],
    },
  },
  {
    name: 'order empty',
    hash: '#/order-confirmation',
    ready: '.order-empty',
    hidden: [],
    empty: {
      scope: '.order-page',
      variant: 'page',
      level: 'h1',
      icon: 'ui-icon--package',
      actions: ['a:Перейти в каталог=#/catalog/smartphones', 'a:На главную=#/'],
    },
  },
  {
    name: 'favourites populated',
    hash: '#/favorites',
    ready: '.favorites-grid .product-card',
    hidden: ['Товары в избранном'],
    seedFavourite: true,
  },
];
for (const width of [1440, 1024, 390]) {
  const p = await newPage(width, width >= 1024 ? 900 : 844);
  await p.goto(`${NEW}#/`);
  await p.waitForSelector('main');
  await p.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  for (const route of HEADING_ROUTES) {
    if (route.seedFavourite) {
      await p.goto(`${NEW}#/catalog/smartphones`);
      await p.waitForFunction(
        () =>
          document.querySelector(
            '.catalog-grid .product-card button[aria-label*="избранн" i]:not(:disabled)',
          ) !== null,
      );
      await p.evaluate(() =>
        document
          .querySelector('.catalog-grid .product-card button[aria-label*="избранн" i]')
          .click(),
      );
      await p.waitForFunction(() => localStorage.getItem('goodcall.favorites.v1') !== null);
    }
    await p.goto(`${NEW}${route.hash}`);
    await p.waitForSelector(route.ready);
    await p.waitForTimeout(150);
    const outline = await p.evaluate(headingOutline);
    check(
      outline.skips.length === 0 &&
        outline.visibleH1 === 1 &&
        outline.levels[0] === 1 &&
        JSON.stringify(outline.hiddenH2) === JSON.stringify(route.hidden),
      `headings ${width}: ${route.name} ${JSON.stringify(outline)}`,
    );
    if (route.empty !== undefined) {
      const facts = await p.evaluate(emptyStateFacts, route.empty.scope);
      check(
        facts !== null &&
          facts.variant === route.empty.variant &&
          facts.level === route.empty.level &&
          facts.icon === route.empty.icon &&
          facts.labelledBy &&
          JSON.stringify(facts.actions) === JSON.stringify(route.empty.actions),
        `empty state ${width}: ${route.name} ${JSON.stringify(facts)}`,
      );
    }
  }
  const overflow = await p.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check(overflow <= 0, `headings ${width}: favourites populated has no overflow (${overflow})`);
  await p.close();
}
for (const reference of ['catalog', 'product-details', 'home', 'header', 'components']) {
  const isolated = await newPage(1440, 900);
  await isolated.goto(`${NEW}?reference=${reference}`);
  await isolated.waitForSelector('main, .reference-page, body > div > *');
  await isolated.waitForTimeout(400);
  const facts = await isolated.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    notes: [...document.querySelectorAll('[class$="-reference__note"]')].map((note) => note.lang),
    specimen: document.querySelector('.site-header, .product-card')?.closest('[lang]')?.lang,
  }));
  check(
    facts.title === SITE_TITLE &&
      facts.lang === 'ru' &&
      facts.notes.every((lang) => lang === 'en') &&
      facts.specimen === 'ru',
    `document: ?reference=${reference} keeps the static title, lang ru, English notes lang en, specimen ru ${JSON.stringify(facts)}`,
  );
  await isolated.close();
}

console.log('stage: reference', new Date().toISOString());
async function capture(base, path, width, ready, name) {
  const p = await newPage(width, 900);
  await p.goto(`${base}${path}`);
  await p.waitForSelector(ready);
  for (let y = 0; y < 12; y += 1) {
    await p.evaluate((step) => window.scrollTo(0, (document.body.scrollHeight * step) / 11), y);
    await p.waitForTimeout(120);
  }
  await settleImages(p);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  const file = `${SHOTS}/${name}.png`;
  await p.screenshot({ path: file, fullPage: true });
  await p.close();
  return file;
}
async function pixelDiff(files) {
  const [a, b] = await Promise.all(
    files.map((file) => sharp(file).raw().ensureAlpha().toBuffer({ resolveWithObject: true })),
  );
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) return -1;
  let diff = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    if (
      a.data[i] !== b.data[i] ||
      a.data[i + 1] !== b.data[i + 1] ||
      a.data[i + 2] !== b.data[i + 2]
    )
      diff += 1;
  }
  return diff;
}
const referenceTargets = [
  ['?reference=catalog', '.catalog-page__title', 'catalog-reference'],
  ['?reference=home', '.home-tiles', 'home-reference'],
  ['?reference=header', '.site-header', 'header-reference'],
  ['?reference=components', '.product-card', 'components-reference'],
  ['#/catalog/smartphones', '.catalog-grid .product-card', 'catalog-smartphones-regression'],
];
for (const [path, ready, name] of referenceTargets) {
  for (const width of [1440, 390]) {
    const files = [];
    for (const [base, label] of [
      [HEAD, 'head'],
      [NEW, 'new'],
    ]) {
      files.push(await capture(base, path, width, ready, `${name}-${label}-${width}`));
    }
    let diff = await pixelDiff(files);
    if (diff !== 0) {
      console.log(`reference retry ${path} ${width}: first diff ${diff}`);
      files.length = 0;
      for (const [base, label] of [
        [HEAD, 'head'],
        [NEW, 'new'],
      ]) {
        files.push(await capture(base, path, width, ready, `${name}-${label}-${width}`));
      }
      diff = await pixelDiff(files);
    }
    check(diff === 0, `reference: ${path} pixel diff at ${width} vs HEAD = ${diff}`);
    if (name === 'catalog-smartphones-regression') {
      const copy = await sharp(files[1]).toFile(`${SHOTS}/${name}-${width}.png`);
      check(copy.width > 0, `screenshot: ${name}-${width}`);
    }
  }
}

const network = await newPage(1440, 900);
const requests = [];
await network.goto(`${NEW}?reference=catalog`);
await network.waitForSelector('.catalog-page__title');
await network.waitForTimeout(500);
const referenceRequests = await network.evaluate(() =>
  performance
    .getEntriesByType('resource')
    .map((entry) => entry.name)
    .filter((name) => name.includes('supabase')),
);
requests.push(...referenceRequests);
check(
  requests.length === 0,
  `reference: ?reference=catalog makes no Supabase request (${requests.length})`,
);
await network.close();

await browser.close();
reportCounts(passed, failures);

import { createRequire } from 'node:module';

import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { launchBrowser } from '../lib/browser.mjs';
import { CATEGORIES, HOME_POPULAR_PRODUCTS, PRODUCTS } from '../lib/catalog.mjs';
import { openPage } from '../lib/page.mjs';
import { appBase, outputDir, referenceBase, reportCounts } from '../lib/suite.mjs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const SHOTS = outputDir();

const HOME = HOME_POPULAR_PRODUCTS;
const smartphones = CATEGORIES.find((c) => c.slug === 'smartphones');

let scenario = {};
let productRequests = [];
let categoryRequests = 0;

const RELATED_LIMIT = 8;
const MEDIA_BATCH_SLUGS = [
  'iphone-15-pro-128',
  'galaxy-s24-128',
  'xiaomi-14-256',
  'pixel-8-128',
  'oneplus-12-256',
];
const relatedSmartphones = (currentSlug) =>
  PRODUCTS.filter((row) => row.is_active && row.category_id === smartphones.id)
    .sort((a, b) =>
      a.popularity_score === b.popularity_score
        ? a.slug.localeCompare(b.slug)
        : b.popularity_score - a.popularity_score,
    )
    .map((row) => row.slug)
    .filter((slug) => slug !== currentSlug)
    .slice(0, RELATED_LIMIT);

function tableRows(table) {
  if (table === 'categories') return CATEGORIES;
  if (table === 'home_popular_products') return HOME;
  if (table === 'product_images') return [];
  if (table === 'products') {
    let rows = PRODUCTS.map((row) => ({ ...row }));
    if (scenario.inactiveSlug)
      rows = rows.map((row) =>
        row.slug === scenario.inactiveSlug ? { ...row, is_active: false } : row,
      );
    if (scenario.mismatchSlug)
      rows = rows.map((row) =>
        row.slug === scenario.mismatchSlug ? { ...row, category_id: smartphones.id } : row,
      );
    if (scenario.extraProduct)
      rows.push({
        ...rows[0],
        id: '00000000-0000-0000-0000-00000000beef',
        slug: 'stub-phone-x',
        name: 'Stub Phone X 128 ГБ, Серый',
        popularity_score: 1000,
      });
    return rows;
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
  const select = params.get('select') ?? '';
  if (select.includes('categories(')) {
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
  if (table === 'products') productRequests.push(url.search);
  if (table === 'categories') categoryRequests += 1;
  if (scenario.catalogListError && table === 'categories') {
    return {
      status: 500,
      body: JSON.stringify({ code: 'XX000', message: 'stub failure', details: null, hint: null }),
    };
  }
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

const NEW = appBase();
const HEAD = referenceBase();
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

async function openPdp(page, slug) {
  await page.goto(`${NEW}#/product/${slug}`);
  await page.waitForFunction(
    () => !document.querySelector('[aria-busy="true"]') && document.querySelector('h1'),
  );
}

async function pdpFacts(page) {
  return page.evaluate(() => {
    const text = document.querySelector('main')?.innerText ?? '';
    const headings = [...document.querySelectorAll('main h1, main h2, main h3')];
    return {
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      text,
      radios: document.querySelectorAll('main input[type="radio"]').length,
      thumbs: document.querySelectorAll('.product-gallery__thumb').length,
      arrows: document.querySelectorAll('.product-gallery__arrow').length,
      galleryLabel: document.querySelector('.product-gallery')?.getAttribute('aria-label'),
      stageAlt: document.querySelector('.product-gallery__stage img')?.getAttribute('alt'),
      stageHasImage: document.querySelector('.product-gallery__stage img') !== null,
      attributes: [...document.querySelectorAll('.product-attributes__item')].map((el) =>
        el.innerText.replace(/\s+/g, ' ').trim(),
      ),
      highlights: document.querySelectorAll('.product-purchase__highlight').length,
      tabs: [...document.querySelectorAll('[role="tab"]')].map((tab) => tab.textContent.trim()),
      panels: [...document.querySelectorAll('[role="tabpanel"]')].map(
        (panel) => panel.textContent.trim().length,
      ),
      emptyHeadings: headings.filter((h) => h.textContent.trim() === '').length,
      reviewCards: document.querySelectorAll('.product-review').length,
      reviewNote: document.querySelector('.product-reviews__note') !== null,
      descriptionMedia: document.querySelector('.product-description__media') !== null,
      descriptionTextOnly: document.querySelector('.product-description__intro--text') !== null,
      warrantyMedia: document.querySelector('.product-warranty__media') !== null,
      warrantyTextOnly: document.querySelector('.product-warranty__intro--text') !== null,
      keySpecs: document.querySelectorAll('.product-key-specs .product-specs__row').length,
      specGroups: [...document.querySelectorAll('.product-spec-groups__title')].map((h) =>
        h.textContent.trim(),
      ),
      crumbs: [...document.querySelectorAll('.product-details__crumb')].map((li) => ({
        text: li.textContent.trim(),
        href: li.querySelector('a')?.getAttribute('href') ?? null,
      })),
      oneClick: [...document.querySelectorAll('button')].some((b) =>
        b.textContent.includes('Купить в 1 клик'),
      ),
      offerServices: document.querySelector('.product-offer__services')?.innerText ?? '',
      badge:
        document.querySelector('.product-purchase .product-details-badge')?.textContent ?? null,
      oldPrice: document.querySelector('.product-purchase__old-price') !== null,
      labels: [...document.querySelectorAll('.product-purchase__labels li')].map((li) =>
        li.textContent.trim(),
      ),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

function commonPdpChecks(name, facts, expectedTitle) {
  check(facts.h1.length === 1, `${name}: exactly one h1 (${facts.h1.length})`);
  check(facts.h1[0] === expectedTitle, `${name}: h1 "${facts.h1[0]}"`);
  check(facts.radios === 0, `${name}: no radios`);
  check(!facts.oneClick, `${name}: no one-click`);
  check(!facts.text.includes('Код товара'), `${name}: no SKU`);
  check(!facts.text.includes('В наличии'), `${name}: no stock`);
  check(!facts.text.includes('Хит продаж'), `${name}: no Хит продаж`);
  check(!/бонус/i.test(facts.text), `${name}: no bonus`);
  check(
    !facts.text.includes('Завтра') && !facts.text.includes('Доставка завтра'),
    `${name}: no delivery date`,
  );
  check(!facts.text.includes('45 магазинов'), `${name}: no 45 stores`);
  check(facts.reviewCards === 0, `${name}: no review cards`);
  check(facts.reviewNote, `${name}: reviews note`);
  check(facts.tabs.length === 5, `${name}: 5 tabs`);
  check(
    facts.tabs[0] === 'Описание' &&
      facts.tabs[1] === 'Характеристики' &&
      facts.tabs[2].startsWith('Отзывы (') &&
      facts.tabs[3] === 'Доставка и оплата' &&
      facts.tabs[4] === 'Гарантия',
    `${name}: tab labels ${facts.tabs.join('|')}`,
  );
  check(
    facts.panels.every((length) => length > 40),
    `${name}: all panels populated`,
  );
  check(facts.emptyHeadings === 0, `${name}: no empty headings`);
  check(facts.attributes.length >= 1, `${name}: static attributes`);
  check(facts.highlights >= 4 && facts.highlights <= 6, `${name}: highlights ${facts.highlights}`);
  check(facts.keySpecs >= 6, `${name}: key specs ${facts.keySpecs}`);
  check(facts.stageHasImage, `${name}: gallery not empty`);
  check(facts.offerServices.includes('Дата и время — при оформлении'), `${name}: courier wording`);
  check(facts.offerServices.includes('Из 6 магазинов'), `${name}: pickup store count`);
  check(facts.overflow <= 0, `${name}: no horizontal overflow (${facts.overflow})`);
}

const summary = {};

console.log('stage: pdp pages', new Date().toISOString());
{
  const page = await newPage();
  scenario = {};

  await openPdp(page, 'iphone-15-128');
  let facts = await pdpFacts(page);
  commonPdpChecks('iphone', facts, 'Apple iPhone 15 128 ГБ, Розовый');
  check(facts.thumbs === 5 && facts.arrows === 2, 'iphone: 5 thumbs + arrows');
  check(facts.galleryLabel === 'Фотографии товара', 'iphone: gallery label');
  check(
    (facts.stageAlt ?? '').includes('Apple iPhone 15, розовый') &&
      facts.stageAlt.includes('фото 1 из 5'),
    `iphone: tier-1 alt "${facts.stageAlt}"`,
  );
  check(facts.descriptionMedia && facts.warrantyMedia, 'iphone: editorial + warranty media');
  check(
    JSON.stringify(facts.attributes) === JSON.stringify(['Цвет Розовый', 'Память 128 ГБ']),
    `iphone: attributes ${facts.attributes}`,
  );
  check(
    facts.specGroups.join('|') ===
      'Экран|Производительность|Камеры|Питание|Связь и интерфейсы|Корпус|Система',
    'iphone: phone template',
  );
  check(
    facts.crumbs[2]?.href === '#/catalog/smartphones' && facts.crumbs[2]?.text === 'Смартфоны',
    'iphone: category crumb link',
  );
  check(facts.badge === '-6%' && facts.oldPrice, `iphone: discount ${facts.badge}`);
  check(facts.labels.length === 0, 'iphone: no labels (is_new false)');
  summary.iphone = { keySpecs: facts.keySpecs, tabs: facts.tabs };

  await openPdp(page, 'galaxy-s24-128');
  facts = await pdpFacts(page);
  commonPdpChecks('galaxy', facts, 'Samsung Galaxy S24 128 ГБ, Фиолетовый');
  check(facts.thumbs === 3 && facts.arrows === 2, 'galaxy: 3 images + controls');
  check(
    facts.galleryLabel === 'Фотографии товара' && facts.stageAlt.includes('Samsung Galaxy S24'),
    'galaxy: product-specific gallery',
  );
  check(facts.descriptionTextOnly && !facts.descriptionMedia, 'galaxy: text-only description');
  check(facts.warrantyTextOnly && !facts.warrantyMedia, 'galaxy: text-only warranty');
  check(facts.badge === '-16%', `galaxy: discount ${facts.badge}`);

  await openPdp(page, 'xiaomi-14-256');
  facts = await pdpFacts(page);
  check(
    JSON.stringify(facts.labels) === JSON.stringify(['Новинка']),
    `xiaomi: live Новинка ${facts.labels}`,
  );
  check(facts.attributes.includes('ОЗУ 12 ГБ'), 'xiaomi: RAM attribute');

  await openPdp(page, 'apple-watch-series-9-45');
  facts = await pdpFacts(page);
  commonPdpChecks('watch', facts, 'Apple Watch Series 9 45 мм, Чёрный');
  check(
    facts.specGroups.join('|') ===
      'Экран|Производительность|Здоровье и спорт|Связь|Питание|Корпус|Совместимость',
    'watch: template',
  );
  check(
    facts.crumbs[2]?.text === 'Умные часы' && facts.crumbs[2]?.href === null,
    'watch: category crumb text only',
  );
  check(
    facts.galleryLabel === 'Фотографии товара' &&
      facts.thumbs === 0 &&
      facts.arrows === 0 &&
      facts.stageAlt === 'Apple Watch Series 9, чёрный корпус и спортивный ремешок',
    `watch: corrected tier-1 single image (${facts.galleryLabel} / ${facts.stageAlt})`,
  );
  const watchImg = await page.evaluate(async () => {
    const img = document.querySelector('.product-gallery__stage img');
    if (!img.complete)
      await new Promise((r) => {
        img.addEventListener('load', r);
        img.addEventListener('error', r);
      });
    const r = img.getBoundingClientRect();
    return {
      src: img.currentSrc,
      natural: img.naturalWidth,
      shown: Math.round(r.width),
      stage: Math.round(
        document.querySelector('.product-gallery__stage').getBoundingClientRect().width,
      ),
    };
  });
  check(
    /apple-watch-s9-black/.test(watchImg.src) &&
      watchImg.natural >= watchImg.shown &&
      watchImg.shown <= watchImg.stage,
    `watch: corrected asset loaded, not upscaled, inside stage ${JSON.stringify(watchImg)}`,
  );
  check(
    facts.descriptionTextOnly && facts.warrantyTextOnly,
    'watch: text-only description/warranty',
  );
  check(
    JSON.stringify(facts.attributes) === JSON.stringify(['Размер корпуса 45 мм', 'Цвет Чёрный']),
    `watch: attributes ${facts.attributes}`,
  );

  await openPdp(page, 'airpods-pro-2-usb-c');
  facts = await pdpFacts(page);
  commonPdpChecks('airpods', facts, 'Apple AirPods Pro 2 (USB-C)');
  check(
    facts.specGroups.join('|') ===
      'Звук|Управление и чип|Питание|Связь|Корпус и защита|Совместимость',
    'airpods: template',
  );
  check(facts.badge === null && !facts.oldPrice, 'airpods: no discount');
  check(facts.crumbs[2]?.text === 'Наушники', 'airpods: category crumb');

  for (const slug of ['pixel-8-128', 'oneplus-12-256', 'tecno-camon-30-256']) {
    await openPdp(page, slug);
    facts = await pdpFacts(page);
    const live = PRODUCTS.find((p) => p.slug === slug);
    commonPdpChecks(slug, facts, live.name);
  }

  productRequests = [];
  await page.goto(`${NEW}#/product/does-not-exist`);
  await page.waitForSelector('h1');
  check((await page.textContent('h1')) === 'Товар не найден', 'unknown: not-found');
  check(productRequests.length === 0, `unknown: no live read (${productRequests.length})`);

  await page.close();
}

console.log('stage: media batch', new Date().toISOString());
{
  const stageImage = async (page) => {
    await page.waitForFunction(() => {
      const image = document.querySelector('.product-gallery__stage img');
      return image?.complete && image.naturalWidth > 0;
    });
    return page.evaluate(() => {
      const image = document.querySelector('.product-gallery__stage img');
      const stage = document.querySelector('.product-gallery__stage').getBoundingClientRect();
      const rect = image.getBoundingClientRect();
      const fit = getComputedStyle(image).objectFit;
      const canvasWidth = Math.min(
        rect.width,
        (rect.height * image.naturalWidth) / image.naturalHeight,
      );
      const canvasLeft = rect.left + (rect.width - canvasWidth) / 2;
      const arrows = [...document.querySelectorAll('.product-gallery__arrow')].map((button) => ({
        label: button.getAttribute('aria-label'),
        box: button.getBoundingClientRect(),
      }));
      return {
        source: image.currentSrc,
        alt: image.alt,
        fit,
        inside:
          rect.left >= stage.left - 1 &&
          rect.right <= stage.right + 1 &&
          rect.top >= stage.top - 1 &&
          rect.bottom <= stage.bottom + 1,
        arrowsClear: arrows.every(
          ({ box }) =>
            box.right <= canvasLeft + canvasWidth * 0.16 ||
            box.left >= canvasLeft + canvasWidth * 0.84,
        ),
        arrowLabels: arrows.map(({ label }) => label),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        thumbs: [...document.querySelectorAll('.product-gallery__thumb')].map((button) => {
          const box = button.getBoundingClientRect();
          return {
            label: button.getAttribute('aria-label'),
            width: box.width,
            height: box.height,
            current: button.getAttribute('aria-current'),
          };
        }),
      };
    });
  };
  for (const slug of MEDIA_BATCH_SLUGS) {
    const widths = slug === 'iphone-15-pro-128' ? [1440, 1280, 1024, 390, 320] : [1440, 390];
    for (const width of widths) {
      scenario = {};
      const page = await newPage(width, width >= 1024 ? 900 : 844);
      await openPdp(page, slug);
      await page.waitForFunction(
        () => document.querySelectorAll('.product-related .product-card').length > 0,
      );
      const live = PRODUCTS.find((product) => product.slug === slug);
      const facts = await pdpFacts(page);
      check(facts.h1[0] === live.name, `${slug}@${width}: ready`);
      check(
        facts.thumbs === 3 && facts.arrows === 2 && facts.galleryLabel === 'Фотографии товара',
        `${slug}@${width}: 3 non-decorative images`,
      );
      check(
        facts.descriptionTextOnly &&
          facts.warrantyTextOnly &&
          !facts.descriptionMedia &&
          !facts.warrantyMedia,
        `${slug}@${width}: no editorial/warranty additions`,
      );
      const sources = [];
      for (let index = 0; index < 3; index += 1) {
        await page.click('.product-gallery__thumb', { nth: index });
        await page.waitForFunction(
          (number) =>
            document
              .querySelector('.product-gallery__stage img')
              ?.alt.endsWith(`фото ${number} из 3`),
          index + 1,
        );
        const image = await stageImage(page);
        sources.push(image.source);
        const model = live.name.split(/\s\d+(?:\/\d+)?\sГБ/)[0];
        const colour = live.name.split(',').at(-1).trim().toLowerCase();
        const angle =
          index === 0
            ? 'вид спереди под углом'
            : index === 1
              ? 'вид сзади под углом'
              : 'спереди и сзади';
        check(
          image.alt.includes(model) && image.alt.includes(colour) && image.alt.includes(angle),
          `${slug}@${width}/${index}: informative alt`,
        );
        check(
          image.source.includes(`product-details-${slug}-`),
          `${slug}@${width}/${index}: SKU asset loaded`,
        );
        check(
          image.inside && image.fit === 'contain' && image.arrowsClear && image.overflow <= 0,
          `${slug}@${width}/${index}: image inside stage, arrows clear, no overflow`,
        );
        check(
          image.thumbs.length === 3 &&
            image.thumbs.every(
              (thumb, nth) =>
                thumb.width >= 24 &&
                thumb.height >= 24 &&
                thumb.label === `Показать фото ${nth + 1} из 3`,
            ) &&
            image.thumbs[index].current === 'true',
          `${slug}@${width}/${index}: usable labelled thumbnails`,
        );
        check(
          JSON.stringify(image.arrowLabels) ===
            JSON.stringify(['Предыдущее фото', 'Следующее фото']),
          `${slug}@${width}/${index}: arrow labels preserved`,
        );
      }
      check(new Set(sources).size === 3, `${slug}@${width}: thumbnail changes active asset`);
      await page.click('.product-gallery__arrow--next');
      check(
        (await stageImage(page)).source === sources[0],
        `${slug}@${width}: next wraps to front`,
      );
      await page.click('.product-gallery__arrow--previous');
      check(
        (await stageImage(page)).source === sources[2],
        `${slug}@${width}: previous wraps to pair`,
      );
      await page.focus('.product-gallery__thumb');
      await page.keyboard.press('Enter');
      check((await stageImage(page)).source === sources[0], `${slug}@${width}: keyboard thumbnail`);
      await page.focus('.product-gallery__arrow--next');
      await page.keyboard.press('Enter');
      check((await stageImage(page)).source === sources[1], `${slug}@${width}: keyboard arrow`);
      if (width === 1440) {
        await page.click('.product-purchase__cart');
        const imageKind = await page.evaluate(
          (id) =>
            JSON.parse(localStorage.getItem('goodcall.cart.v1')).lines.find(
              (line) => line.id === id,
            )?.image.kind,
          slug,
        );
        check(imageKind === 'catalog-fallback', `${slug}: commerce image remains catalog-fallback`);
      }
      await page.close();
    }
  }

  const surfaceImages = (page) =>
    page.evaluate(() => ({
      gallery: [...document.querySelectorAll('.product-gallery img')].map((image) => ({
        source: new URL(image.currentSrc || image.src).pathname.split('/assets/').at(-1),
        alt: image.alt,
      })),
      cards: [...document.querySelectorAll('.product-related .product-card img')].map((image) => ({
        source: new URL(image.currentSrc || image.src).pathname.split('/assets/').at(-1),
        alt: image.alt,
      })),
    }));
  for (const slug of [
    'iphone-15-128',
    'apple-watch-series-9-45',
    'airpods-pro-2-usb-c',
    'tecno-camon-30-256',
    ...MEDIA_BATCH_SLUGS,
  ]) {
    const snapshots = [];
    for (const base of [HEAD, NEW]) {
      scenario = {};
      const page = await newPage();
      await page.goto(`${base}#/product/${slug}`);
      await page.waitForSelector('.product-gallery__stage img');
      if (slug !== 'apple-watch-series-9-45' && slug !== 'airpods-pro-2-usb-c') {
        await page.waitForFunction(
          () => document.querySelectorAll('.product-related .product-card').length > 0,
        );
      }
      await page.evaluate(async () => {
        for (const image of document.querySelectorAll('.product-gallery img, .product-related img'))
          image.loading = 'eager';
      });
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.product-gallery img, .product-related img')].every(
          (image) => image.complete && image.naturalWidth > 0,
        ),
      );
      snapshots.push(await surfaceImages(page));
      await page.close();
    }
    check(
      JSON.stringify(snapshots[0].cards) === JSON.stringify(snapshots[1].cards),
      `${slug}: Product Details C card imagery unchanged from HEAD`,
    );
    if (!MEDIA_BATCH_SLUGS.includes(slug)) {
      check(
        JSON.stringify(snapshots[0].gallery) === JSON.stringify(snapshots[1].gallery),
        `${slug}: protected gallery/fallback unchanged from HEAD`,
      );
    }
  }

  const zoomPage = await newPage(720, 450);
  scenario = {};
  await openPdp(zoomPage, 'iphone-15-pro-128');
  for (let index = 0; index < 3; index += 1) {
    await zoomPage.click('.product-gallery__thumb', { nth: index });
    const image = await stageImage(zoomPage);
    check(
      image.inside && image.overflow <= 0 && image.thumbs.every((thumb) => thumb.width >= 24),
      `200% zoom reflow (1440 to 720 CSS px)/${index}: gallery usable`,
    );
  }
  await zoomPage.close();
}

console.log('stage: route states', new Date().toISOString());
{
  const page = await newPage();
  scenario = { inactiveSlug: 'tecno-camon-30-256' };
  await openPdp(page, 'tecno-camon-30-256');
  check((await page.textContent('h1')) === 'Товар не найден', 'inactive: not-found');
  scenario = { mismatchSlug: 'airpods-pro-2-usb-c' };
  await openPdp(page, 'airpods-pro-2-usb-c');
  check((await page.textContent('h1')) === 'Товар не найден', 'category mismatch: not-found');
  scenario = { productsError: true };
  await openPdp(page, 'pixel-8-128');
  check(
    (await page.textContent('h1')) === 'Не удалось загрузить товар',
    'query error: error state',
  );
  scenario = { extraProduct: true };
  productRequests = [];
  await page.goto(`${NEW}#/product/stub-phone-x`);
  await page.waitForSelector('h1');
  check((await page.textContent('h1')) === 'Товар не найден', 'missing content: not-found');
  check(productRequests.length === 0, 'missing content: no live read');
  await page.goto(`${NEW}#/catalog/smartphones`);
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.product-card__title')].some((h) =>
      h.textContent.includes('Stub Phone X'),
    ),
  );
  const stubLinked = await page.evaluate(
    () =>
      [...document.querySelectorAll('.product-card__title')]
        .find((h) => h.textContent.includes('Stub Phone X'))
        ?.querySelector('a') !== null,
  );
  check(!stubLinked, 'missing content: catalog card unlinked');
  await page.close();
}

console.log('stage: links/cart/favorites', new Date().toISOString());
{
  const page = await newPage();
  scenario = {};
  await page.goto(`${NEW}#/catalog/smartphones`);
  await page.waitForFunction(() => document.querySelectorAll('.product-card__link').length > 0);
  const catalog = await page.evaluate(() => ({
    cards: document.querySelectorAll(
      '.product-grid .product-card, .catalog-grid .product-card, main .product-card',
    ).length,
    links: [...document.querySelectorAll('.product-card__link')].map((a) => [
      a.textContent.trim(),
      a.getAttribute('href'),
    ]),
  }));
  check(
    catalog.links.length === catalog.cards && catalog.cards > 0,
    `catalog: every live card linked (${catalog.links.length}/${catalog.cards})`,
  );
  check(
    catalog.links.every(([, href]) => /^#\/product\/[a-z0-9-]+$/.test(href)),
    'catalog: canonical hrefs',
  );
  await page.click('.product-card__link');
  await page.waitForFunction(() => document.querySelector('.product-purchase__title'));
  check((await page.textContent('h1')) === catalog.links[0][0], 'catalog → PDP title match');

  await page.goto(`${NEW}#/search?q=Samsung`);
  await page.waitForFunction(() => document.querySelectorAll('a[href^="#/product/"]').length > 0);
  const searchLinks = await page.evaluate(() =>
    [...document.querySelectorAll('main a[href^="#/product/"]')].map((a) => a.getAttribute('href')),
  );
  check(
    searchLinks.some((href) => href === '#/product/galaxy-s24-128') &&
      searchLinks.some((href) => href === '#/product/galaxy-a55-128'),
    `search: Samsung links ${searchLinks.join(',')}`,
  );
  await page.click('main a[href="#/product/galaxy-a55-128"]');
  await page.waitForFunction(() => document.querySelector('.product-purchase__title'));
  check((await page.textContent('h1')) === 'Samsung Galaxy A55 128 ГБ, Лиловый', 'search → PDP');

  await page.goto(`${NEW}#/`);
  await page.waitForFunction(() => document.querySelectorAll('.product-card__link').length >= 5);
  const homeLinks = await page.evaluate(() =>
    [...document.querySelectorAll('.product-card__link')].map((a) => a.getAttribute('href')),
  );
  check(homeLinks.length === 5, `home: 5 popular links (${homeLinks.length})`);
  check(
    homeLinks.includes('#/product/airpods-pro-2-usb-c') &&
      homeLinks.includes('#/product/apple-watch-series-9-45'),
    'home: non-phone links',
  );
  await page.click('.product-card__link[href="#/product/airpods-pro-2-usb-c"]');
  await page.waitForFunction(() => document.querySelector('.product-purchase__title'));
  check((await page.textContent('h1')) === 'Apple AirPods Pro 2 (USB-C)', 'home → PDP');

  await openPdp(page, 'galaxy-s24-128');
  await page.click('.product-gallery__favorite');
  const favState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('goodcall.favorites.v1') ?? '{}'),
  );
  check(JSON.stringify(favState).includes('galaxy-s24-128'), 'favorite: stored by slug');
  check(
    (await page.getAttribute('.product-gallery__favorite', 'aria-pressed')) === 'true',
    'favorite: pressed on PDP',
  );
  await page.goto(`${NEW}#/catalog/smartphones`);
  await page.waitForFunction(() => document.querySelectorAll('.product-card__link').length > 0);
  const catalogFavPressed = await page.evaluate(() => {
    const card = [...document.querySelectorAll('.product-card')].find(
      (el) =>
        el.querySelector('.product-card__link')?.getAttribute('href') ===
        '#/product/galaxy-s24-128',
    );
    return card?.querySelector('.product-card__favorite')?.getAttribute('aria-pressed');
  });
  check(catalogFavPressed === 'true', 'favorite: synced to catalog card');
  await page.goto(`${NEW}#/favorites`);
  await page.waitForSelector('.product-card__link');
  await page.click('.product-card__link[href="#/product/galaxy-s24-128"]');
  await page.waitForFunction(() => document.querySelector('.product-purchase__title'));
  check(
    (await page.textContent('h1')) === 'Samsung Galaxy S24 128 ГБ, Фиолетовый',
    'favorites → PDP',
  );

  await page.goto(`${NEW}#/catalog/smartphones`);
  await page.waitForFunction(
    () => document.querySelector('.product-card__link[href="#/product/pixel-8-128"]') !== null,
  );
  await page.evaluate(() => {
    const card = [...document.querySelectorAll('.product-card')].find(
      (el) =>
        el.querySelector('.product-card__link')?.getAttribute('href') === '#/product/pixel-8-128',
    );
    card?.querySelector('.product-card__compare')?.click();
  });
  await page.goto(`${NEW}#/compare`);
  await page.waitForSelector('a[href="#/product/pixel-8-128"]');
  await page.click('a[href="#/product/pixel-8-128"]');
  await page.waitForFunction(() => document.querySelector('.product-purchase__title'));
  check((await page.textContent('h1')) === 'Google Pixel 8 128 ГБ, Обсидиан', 'compare → PDP');
  check(
    (await page.evaluate(
      () =>
        [...document.querySelectorAll('.product-details [aria-label*="сравнени"]')].filter(
          (el) => el.closest('.product-related') === null,
        ).length,
    )) === 0,
    'PDP: no compare control outside related rail',
  );

  await page.evaluate(() => localStorage.removeItem('goodcall.cart.v1'));
  await page.goto(`${NEW}#/catalog/smartphones`);
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('.product-card__link').length > 0);
  await page.evaluate(() => {
    const card = [...document.querySelectorAll('.product-card')].find(
      (el) =>
        el.querySelector('.product-card__link')?.getAttribute('href') ===
        '#/product/galaxy-s24-128',
    );
    card?.querySelector('.product-card__cart')?.click();
  });
  await openPdp(page, 'galaxy-s24-128');
  await page.click('.product-purchase__cart');
  const announcement = await page.textContent('.product-purchase [role="status"]');
  check(
    announcement ===
      'Товар добавлен в корзину: Samsung Galaxy S24 128 ГБ, Фиолетовый. В корзине: 2 шт.',
    `cart: PDP announcement "${announcement}"`,
  );
  await page.goto(`${NEW}#/`);
  await page.waitForFunction(() => document.querySelectorAll('.product-card__link').length >= 5);
  await page.evaluate(() => {
    const card = [...document.querySelectorAll('.product-card')].find(
      (el) =>
        el.querySelector('.product-card__link')?.getAttribute('href') ===
        '#/product/galaxy-s24-128',
    );
    card?.querySelector('.product-card__cart')?.click();
  });
  const cart = await page.evaluate(
    () => JSON.parse(localStorage.getItem('goodcall.cart.v1') ?? '{"lines":[]}').lines,
  );
  check(
    cart.length === 1 && cart[0].id === 'galaxy-s24-128' && cart[0].quantity === 3,
    `cart: canonical merge ${JSON.stringify(cart.map((l) => [l.id, l.quantity]))}`,
  );
  const badge = await page.evaluate(() =>
    [...document.querySelectorAll('.site-header__badge')].map((b) => b.textContent),
  );
  check(badge.includes('3'), `cart: shell count ${badge}`);
  check(cart[0].variant === undefined, 'cart: no variant text');

  await page.evaluate(() =>
    localStorage.setItem(
      'goodcall.cart.v1',
      JSON.stringify({
        lines: [
          {
            id: 'iphone-15-128|pink|128',
            productSlug: 'iphone-15-128',
            title: 'Apple iPhone 15 128 ГБ, Розовый',
            variant: 'Розовый · 128 ГБ',
            image: { kind: 'product-details', colourId: 'pink' },
            price: 79990,
            oldPrice: 84990,
            quantity: 1,
            selected: true,
          },
        ],
      }),
    ),
  );
  await page.goto(`${NEW}#/cart`);
  await page.reload();
  await page.waitForSelector('h1');
  const legacyVisible = await page.evaluate(() =>
    document.querySelector('main').innerText.includes('Розовый · 128 ГБ'),
  );
  check(legacyVisible, 'cart: legacy variant line still parseable');
  await openPdp(page, 'iphone-15-128');
  await page.click('.product-purchase__cart');
  const cartAfter = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('goodcall.cart.v1')).lines.map((l) => l.id),
  );
  check(
    cartAfter.length === 2 &&
      cartAfter.includes('iphone-15-128|pink|128') &&
      cartAfter.includes('iphone-15-128'),
    `cart: legacy untouched ${cartAfter}`,
  );

  await page.close();
}

console.log('stage: related', new Date().toISOString());
{
  const relatedFacts = (page) =>
    page.evaluate(() => {
      const section = document.querySelector('.product-related');
      const sections = document.querySelector('.product-sections');
      const rect = sections?.getBoundingClientRect();
      const all = section?.querySelector('.product-related__all');
      return {
        present: section !== null,
        heading: section?.querySelector('h2')?.textContent.trim() ?? null,
        all: all ? [all.textContent.trim(), all.getAttribute('href')] : null,
        links: section
          ? [...section.querySelectorAll('.product-card__link')].map((a) => a.getAttribute('href'))
          : [],
        cards: section ? section.querySelectorAll('.product-card').length : 0,
        afterSections:
          section !== null &&
          sections !== null &&
          (sections.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        insideMain: section !== null && section.closest('main.product-details') !== null,
        sectionsBox: rect ? [Math.round(rect.top + scrollY), Math.round(rect.height)] : null,
        error: document.body.innerText.includes('Не удалось'),
        h1: document.querySelector('h1')?.textContent.trim(),
      };
    });
  const waitRelated = (page) =>
    page.waitForFunction(
      () => document.querySelectorAll('.product-related .product-card').length > 0,
    );
  const shellCounts = (page) =>
    page.evaluate(() =>
      [...document.querySelectorAll('.site-header__action')].map((a) =>
        a.getAttribute('aria-label'),
      ),
    );
  const cardOf = (slug) =>
    `.product-related__item:has(.product-card__link[href="#/product/${slug}"])`;

  const page = await newPage(1440, 900);
  scenario = {};
  await page.goto(`${NEW}#/`);
  await page.evaluate(() => localStorage.clear());
  categoryRequests = 0;
  await openPdp(page, 'iphone-15-128');
  await waitRelated(page);
  let facts = await relatedFacts(page);
  const expected = relatedSmartphones('iphone-15-128');
  check(facts.heading === 'Другие смартфоны', `related: heading ${facts.heading}`);
  check(
    JSON.stringify(facts.all) === JSON.stringify(['Смотреть все', '#/catalog/smartphones']),
    `related: all link ${JSON.stringify(facts.all)}`,
  );
  check(
    facts.cards >= 1 && facts.cards <= RELATED_LIMIT && facts.cards === expected.length,
    `related: count ${facts.cards}`,
  );
  check(
    JSON.stringify(facts.links) === JSON.stringify(expected.map((slug) => `#/product/${slug}`)),
    `related: canonical order ${JSON.stringify(facts.links)}`,
  );
  check(!facts.links.includes('#/product/iphone-15-128'), 'related: current excluded');
  check(facts.afterSections && facts.insideMain, 'related: placed after sections inside PDP');
  check(categoryRequests === 1, `related: one catalog read (${categoryRequests})`);
  const withRelatedBox = facts.sectionsBox;

  const nav = await page.evaluate(() => ({
    previous: document.querySelector('.product-related__nav--previous')?.disabled,
    next: document.querySelector('.product-related__nav--next')?.disabled,
    labels: [...document.querySelectorAll('.product-related__nav')].map((b) =>
      b.getAttribute('aria-label'),
    ),
  }));
  check(
    nav.previous === true && nav.next === false && nav.labels.length === 2,
    `related: initial nav ${JSON.stringify(nav)}`,
  );
  const hrefBefore = await page.evaluate(() => location.href);
  await page.evaluate(() => document.querySelector('.product-related__nav--next').click());
  await page.waitForFunction(
    () =>
      document.querySelector('.product-related__rail').scrollLeft > 0 &&
      document.querySelector('.product-related__nav--previous')?.disabled === false,
  );
  check((await page.evaluate(() => location.href)) === hrefBefore, 'related: nav keeps URL');
  await page.evaluate(() => {
    const rail = document.querySelector('.product-related__rail');
    rail.style.scrollBehavior = 'auto';
    rail.scrollLeft = 0;
    rail.style.scrollBehavior = '';
  });

  const firstSlug = expected[0];
  const first = cardOf(firstSlug);
  await page.click(`${first} .product-card__cart`);
  let cartLines = await page.evaluate(
    () => JSON.parse(localStorage.getItem('goodcall.cart.v1') ?? '{"lines":[]}').lines,
  );
  check(
    cartLines.length === 1 && cartLines[0].id === firstSlug && cartLines[0].quantity === 1,
    `related: add to cart ${JSON.stringify(cartLines.map((l) => [l.id, l.quantity]))}`,
  );
  check((await shellCounts(page)).includes('Корзина: 1'), 'related: cart shell count');
  await page.click(`${first} .ui-stepper__button`, { nth: 1 });
  check(
    (await page.textContent(`${first} .ui-stepper__value`)) === '2',
    'related: stepper increase',
  );
  await page.click(`${first} .ui-stepper__button`, { nth: 0 });
  await page.click(`${first} .ui-stepper__button`, { nth: 0 });
  cartLines = await page.evaluate(
    () => JSON.parse(localStorage.getItem('goodcall.cart.v1') ?? '{"lines":[]}').lines,
  );
  check(cartLines.length === 0, 'related: stepper removes at zero');
  check((await page.count(`${first} .product-card__cart`)) === 1, 'related: cart button restored');

  await page.click(`${first} .product-card__favorite`);
  const favorites = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('goodcall.favorites.v1') ?? '{"items":[]}').items.map(
      (i) => i.slug,
    ),
  );
  check(
    JSON.stringify(favorites) === JSON.stringify([firstSlug]),
    `related: favorite ${favorites}`,
  );
  check((await shellCounts(page)).includes('Избранное: 1'), 'related: favorites shell count');

  for (const slug of expected.slice(0, 4)) {
    await page.evaluate(
      (selector) => document.querySelector(selector).click(),
      `${cardOf(slug)} .product-card__compare`,
    );
  }
  const compare = await page.evaluate(
    (selector) => ({
      stored: JSON.parse(localStorage.getItem('goodcall.compare.v1') ?? '{"items":[]}').items
        .length,
      fifth: [
        document.querySelector(selector)?.disabled,
        document.querySelector(selector)?.getAttribute('aria-label'),
      ],
    }),
    `${cardOf(expected[4])} .product-card__compare`,
  );
  check(compare.stored === 4, `related: compare stored ${compare.stored}`);
  check(
    compare.fifth[0] === true &&
      (compare.fifth[1] ?? '').startsWith('Сравнение заполнено (4 из 4)'),
    `related: compare limit ${JSON.stringify(compare.fifth)}`,
  );
  check((await shellCounts(page)).includes('Сравнение: 4'), 'related: compare shell count');
  await page.evaluate(() => localStorage.clear());

  await page.click(`${first} .product-card__link`);
  await page.waitForFunction(
    (slug) =>
      location.hash === `#/product/${slug}` &&
      document.querySelectorAll('.product-related .product-card').length > 0,
    firstSlug,
  );
  facts = await relatedFacts(page);
  check(
    JSON.stringify(facts.links) ===
      JSON.stringify(relatedSmartphones(firstSlug).map((slug) => `#/product/${slug}`)),
    `related: next PDP order ${JSON.stringify(facts.links)}`,
  );
  check(categoryRequests === 1, `related: list reused across slugs (${categoryRequests})`);
  await page.close();

  for (const slug of ['apple-watch-series-9-45', 'airpods-pro-2-usb-c']) {
    const fresh = await newPage(1440, 900);
    categoryRequests = 0;
    await openPdp(fresh, slug);
    await fresh.waitForTimeout(400);
    const other = await relatedFacts(fresh);
    check(!other.present, `${slug}: no related section`);
    check(categoryRequests === 0, `${slug}: no catalog read (${categoryRequests})`);
    await fresh.close();
  }

  const failing = await newPage(1440, 900);
  scenario = { catalogListError: true };
  await openPdp(failing, 'iphone-15-128');
  await failing.waitForTimeout(400);
  facts = await relatedFacts(failing);
  check(
    !facts.present && !facts.error && facts.h1 === 'Apple iPhone 15 128 ГБ, Розовый',
    `related failure: absent, PDP ready ${JSON.stringify(facts)}`,
  );
  check(
    JSON.stringify(facts.sectionsBox) === JSON.stringify(withRelatedBox),
    `related: geometry above unchanged ${JSON.stringify([facts.sectionsBox, withRelatedBox])}`,
  );
  scenario = {};
  await failing.close();
}

console.log('stage: reference', new Date().toISOString());
{
  const page = await newPage();
  await page.goto(`${NEW}?reference=product-details`);
  await page.waitForSelector('.product-purchase__title');
  const ref = await page.evaluate(() => ({
    radios: document.querySelectorAll('input[type="radio"]').length,
    oneClick: [...document.querySelectorAll('button')].some((b) =>
      b.textContent.includes('Купить в 1 клик'),
    ),
    sku: document.body.innerText.includes('Код товара: 213475'),
    reviews: document.querySelectorAll('.product-review').length,
    bonus: document.querySelector('.product-purchase__bonus') !== null,
    stock: document.body.innerText.includes('В наличии'),
    thumbs: document.querySelectorAll('.product-gallery__thumb').length,
    attributes: document.querySelectorAll('.product-attributes').length,
    title: document.querySelector('h1').textContent,
    related: document.querySelector('.product-related') !== null,
  }));
  check(
    ref.radios === 5 &&
      ref.oneClick &&
      ref.sku &&
      ref.reviews === 3 &&
      ref.bonus &&
      ref.stock &&
      ref.thumbs === 5 &&
      ref.attributes === 0,
    `reference: frozen fixture ${JSON.stringify(ref)}`,
  );
  check(ref.title === 'Apple iPhone 15 128 ГБ, Розовый', 'reference: title');
  check(!ref.related, 'reference: no related section');
  await page.click('.product-option__swatch', { nth: 1 });
  check(
    (await page.textContent('h1')) === 'Apple iPhone 15 128 ГБ, Чёрный',
    'reference: colour switch still works',
  );
  await page.close();
}

console.log('stage: pixel', new Date().toISOString());
const pixel = {};
for (const width of [1440, 390]) {
  const shots = [];
  for (const base of [HEAD, NEW]) {
    const page = await newPage(width, 900);
    await page.goto(`${base}?reference=product-details`);
    await page.waitForSelector('.product-purchase__title');
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const img of document.images) img.loading = 'eager';
      const loads = [...document.images].map((img) =>
        img.complete
          ? null
          : new Promise((r) => {
              img.addEventListener('load', r);
              img.addEventListener('error', r);
            }),
      );
      await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 8000))]);
    });
    await page.waitForTimeout(600);
    const file = `${SHOTS}/reference-${base === HEAD ? 'head' : 'new'}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    shots.push(file);
    await page.close();
  }
  const [a, b] = await Promise.all(
    shots.map((file) => sharp(file).raw().ensureAlpha().toBuffer({ resolveWithObject: true })),
  );
  let diff = 0;
  if (a.info.width === b.info.width && a.info.height === b.info.height) {
    for (let i = 0; i < a.data.length; i += 4) {
      if (
        a.data[i] !== b.data[i] ||
        a.data[i + 1] !== b.data[i + 1] ||
        a.data[i + 2] !== b.data[i + 2]
      )
        diff += 1;
    }
  } else {
    diff = -1;
  }
  pixel[width] = {
    size: `${a.info.width}x${a.info.height} vs ${b.info.width}x${b.info.height}`,
    diff,
  };
  check(diff === 0, `reference pixel diff at ${width}: ${diff} (${pixel[width].size})`);
}

console.log('stage: responsive', new Date().toISOString());
const responsive = {};
for (const slug of ['iphone-15-128', 'apple-watch-series-9-45', 'airpods-pro-2-usb-c']) {
  for (const width of [1440, 1280, 1024, 768, 430, 390, 320]) {
    const page = await newPage(width, width >= 1024 ? 900 : 844);
    scenario = {};
    await openPdp(page, slug);
    if (slug === 'iphone-15-128') {
      await page.waitForFunction(
        () => document.querySelectorAll('.product-related .product-card').length > 0,
      );
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const metrics = await page.evaluate(() => {
      const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect();
      const gallery = rect('.product-gallery');
      const purchase = rect('.product-purchase');
      const clipped = [...document.querySelectorAll('main *')].filter((el) => {
        const style = getComputedStyle(el);
        return (
          !el.closest('.ui-visually-hidden') &&
          el.clientWidth > 1 &&
          el.scrollWidth > el.clientWidth + 1 &&
          style.overflowX === 'hidden' &&
          el.children.length === 0 &&
          el.textContent.trim() !== ''
        );
      }).length;
      const small = [...document.querySelectorAll('main button, main a, main [role="tab"]')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.height < 24 || r.width < 24);
        })
        .map((el) => el.textContent.trim().slice(0, 30) || el.getAttribute('aria-label'));
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        h1: document.querySelectorAll('h1').length,
        emptyHeadings: [...document.querySelectorAll('main h1, main h2, main h3')].filter(
          (h) => h.textContent.trim() === '',
        ).length,
        emptyContainers: [
          ...document.querySelectorAll(
            '.product-description__media, .product-warranty__media, .product-gallery__thumbs, .product-attributes, .product-purchase__highlights',
          ),
        ].filter((el) => el.children.length === 0).length,
        galleryHeight: gallery?.height ?? 0,
        purchaseHeight: purchase?.height ?? 0,
        purchaseTop: purchase?.top ?? 0,
        galleryTop: gallery?.top ?? 0,
        clipped,
        small,
        relatedVisible: (() => {
          const rail = document.querySelector('.product-related__rail');
          if (!rail) return null;
          const box = rail.getBoundingClientRect();
          return [...rail.querySelectorAll('.product-related__item')].filter((item) => {
            const r = item.getBoundingClientRect();
            return r.left >= box.left - 1 && r.right <= box.right + 1;
          }).length;
        })(),
      };
    });
    responsive[`${slug}@${width}`] = metrics;
    check(metrics.overflow <= 0, `${slug}@${width}: overflow ${metrics.overflow}`);
    check(metrics.h1 === 1, `${slug}@${width}: h1`);
    check(
      metrics.emptyHeadings === 0 && metrics.emptyContainers === 0,
      `${slug}@${width}: empty headings/containers`,
    );
    check(metrics.clipped === 0, `${slug}@${width}: clipped text`);
    if (slug === 'iphone-15-128') {
      const expectedVisible = width >= 1200 ? 5 : width >= 768 ? 3 : 1;
      check(
        metrics.relatedVisible === expectedVisible,
        `${slug}@${width}: related visible cards ${metrics.relatedVisible}`,
      );
    } else {
      check(metrics.relatedVisible === null, `${slug}@${width}: no related rail`);
    }
    if (width === 1440) {
      check(
        metrics.purchaseHeight >= 0.75 * metrics.galleryHeight,
        `${slug}@1440: purchase ${Math.round(metrics.purchaseHeight)} vs gallery ${Math.round(metrics.galleryHeight)}`,
      );
    }
    if (width === 1440 || width === 390) {
      const short = slug.split('-').slice(0, 2).join('-');
      await page.screenshot({ path: `${SHOTS}/pdp-${short}-${width}-fold.png` });
      await page.screenshot({ path: `${SHOTS}/pdp-${short}-${width}-full.png`, fullPage: true });
      await page.click('[role="tab"]', { hasText: 'Характеристики' });
      await page.elementScreenshot('.product-sections', `${SHOTS}/pdp-${short}-${width}-specs.png`);
      await page.click('[role="tab"]', { hasText: 'Отзывы' });
      await page.elementScreenshot(
        '.product-sections',
        `${SHOTS}/pdp-${short}-${width}-reviews.png`,
      );
      await page.click('[role="tab"]', { hasText: 'Гарантия' });
      await page.elementScreenshot(
        '.product-sections',
        `${SHOTS}/pdp-${short}-${width}-warranty.png`,
      );
    }
    await page.close();
  }
}

console.log('stage: keyboard', new Date().toISOString());
{
  const page = await newPage(1440, 900);
  await openPdp(page, 'galaxy-s24-128');
  await page.focus('[role="tab"][aria-selected="true"]');
  await page.keyboard.press('ArrowRight');
  const selected = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check(selected === 'Характеристики', `keyboard: tab arrow navigation (${selected})`);
  await page.click('.product-key-specs__more');
  check(
    (await page.evaluate(() => document.activeElement?.textContent?.trim())) === 'Характеристики',
    'keyboard: Все характеристики focuses specs tab',
  );
  await page.keyboard.press('Tab');
  const panelFocused = await page.evaluate(() => document.activeElement?.getAttribute('role'));
  check(panelFocused === 'tabpanel', `keyboard: tab into panel (${panelFocused})`);
  const focusRing = await page.evaluate(() => {
    const el = document.querySelector('.product-purchase__cart');
    el.focus();
    const s = getComputedStyle(el);
    return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
  });
  check(focusRing, 'a11y: cart button focus visible');
  await page.close();
}

await browser.close();

console.log(JSON.stringify({ pixel, summary }, null, 1));
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(responsive)
        .filter(([k]) => k.endsWith('@1440') || k.endsWith('@390') || k.endsWith('@320'))
        .map(([k, v]) => [
          k,
          {
            overflow: v.overflow,
            gallery: Math.round(v.galleryHeight),
            purchase: Math.round(v.purchaseHeight),
            small: v.small,
          },
        ]),
    ),
  ),
);
reportCounts(passed, failures);

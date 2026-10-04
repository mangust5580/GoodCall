import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { activeCatalogProducts } from '../lib/catalog.mjs';
import { outputDir, reportCounts } from '../lib/suite.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const require = createRequire(path.join(ROOT, 'package.json'));
const { createServer } = await import(pathToFileURL(require.resolve('vite')).href);

const server = await createServer({
  root: ROOT,
  configFile: path.join(ROOT, 'vite.config.ts'),
  envDir: path.join(outputDir(), 'empty-env'),
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
  logLevel: 'error',
});

let pass = 0;
const failures = [];
function check(condition, message) {
  if (condition) pass += 1;
  else failures.push(message);
}

try {
  const mod = await server.ssrLoadModule('/src/pages/product-details/productDetailsContent.ts');
  const {
    PRODUCT_DETAILS_CONTENT,
    PRODUCT_SPEC_TEMPLATES,
    getProductDetailsContent,
    hasProductDetailsContent,
  } = mod;
  const live = activeCatalogProducts();
  const iconSource = readFileSync(`${ROOT}/src/components/ui/Icon.tsx`, 'utf8');
  const icons = new Set(
    [...iconSource.split('interface IconProps')[0].matchAll(/\| '([a-z-]+)'/g)].map((m) => m[1]),
  );

  const limits = {
    smartphones: { groups: 7, rows: 20, keyMin: 8, keyMax: 12, featureMin: 4 },
    'smart-watches': { groups: 7, rows: 16, keyMin: 6, keyMax: 10, featureMin: 3 },
    headphones: { groups: 6, rows: 12, keyMin: 6, keyMax: 8, featureMin: 3 },
  };
  const forbidden =
    /(В наличии|Хит продаж|Код товара|бонус|Завтра|Сегодня|Купить в 1 клик|45 магазинов)/i;
  const placeholder = /(lorem|ipsum|\bTBD\b|\bTODO\b|(^|[\s«])скоро([\s.,»]|$)|xxx|заглушк)/iu;

  const slugs = PRODUCT_DETAILS_CONTENT.map((record) => record.slug);
  check(new Set(slugs).size === slugs.length, 'duplicate slugs in content');
  check(
    PRODUCT_DETAILS_CONTENT.length === 18,
    `expected 18 records, got ${PRODUCT_DETAILS_CONTENT.length}`,
  );
  check(live.length === 18, `expected 18 live active products, got ${live.length}`);

  for (const product of live) {
    check(hasProductDetailsContent(product.slug), `missing content for live slug ${product.slug}`);
  }
  for (const slug of slugs) {
    check(
      live.some((product) => product.slug === slug),
      `content slug not live: ${slug}`,
    );
  }

  for (const record of PRODUCT_DETAILS_CONTENT) {
    const id = record.slug;
    const liveProduct = live.find((product) => product.slug === id);
    const limit = limits[record.category];
    check(getProductDetailsContent(id) === record, `${id}: registry lookup`);
    check(limit !== undefined, `${id}: unknown category`);
    check(
      liveProduct?.categories?.slug === record.category,
      `${id}: category ${record.category} vs live ${liveProduct?.categories?.slug}`,
    );

    const titles = record.specificationGroups.map((group) => group.title);
    check(
      JSON.stringify(titles) === JSON.stringify(PRODUCT_SPEC_TEMPLATES[record.category]),
      `${id}: group order ${titles.join('/')}`,
    );
    check(titles.length === limit.groups, `${id}: group count`);
    const rows = record.specificationGroups.flatMap((group) => group.rows);
    check(rows.length >= limit.rows, `${id}: rows ${rows.length} < ${limit.rows}`);
    for (const group of record.specificationGroups) {
      check(group.rows.length >= 2, `${id}: group ${group.title} has ${group.rows.length} rows`);
      const labels = group.rows.map((row) => row.label);
      check(new Set(labels).size === labels.length, `${id}: duplicate labels in ${group.title}`);
    }
    const allLabels = rows.map((row) => row.label);
    check(
      new Set(allLabels).size === allLabels.length,
      `${id}: duplicate row labels across groups`,
    );
    const keys = rows.filter((row) => row.key === true).length;
    check(keys >= limit.keyMin && keys <= limit.keyMax, `${id}: key rows ${keys}`);

    check(
      record.highlights.length >= 4 && record.highlights.length <= 6,
      `${id}: highlights ${record.highlights.length}`,
    );
    check(
      record.description.paragraphs.length >= 1 && record.description.paragraphs.length <= 2,
      `${id}: paragraphs`,
    );
    for (const paragraph of record.description.paragraphs) {
      check(
        paragraph.length >= 150 && paragraph.length <= 400,
        `${id}: paragraph length ${paragraph.length}`,
      );
    }
    const features = record.description.features.length;
    check(features >= limit.featureMin && features <= 5, `${id}: features ${features}`);
    for (const feature of record.description.features) {
      check(icons.has(feature.icon), `${id}: invalid icon ${feature.icon}`);
    }

    const strings = [
      record.description.title,
      ...record.description.paragraphs,
      ...record.description.features.flatMap((feature) => [feature.title, feature.text]),
      ...record.highlights,
      ...record.attributes.flatMap((attribute) => [attribute.label, attribute.value]),
      ...record.specificationGroups.flatMap((group) => [
        group.title,
        ...group.rows.flatMap((row) => [row.label, row.value]),
      ]),
    ];
    for (const value of strings) {
      check(
        typeof value === 'string' && value.trim() !== '' && value.trim() === value,
        `${id}: empty or untrimmed string "${value}"`,
      );
      check(!forbidden.test(value), `${id}: forbidden operational text "${value}"`);
      check(!placeholder.test(value), `${id}: placeholder text "${value}"`);
    }

    const name = liveProduct?.name ?? '';
    const attribute = (label) => record.attributes.find((entry) => entry.label === label)?.value;
    const colourFromName = name.includes(',')
      ? name.slice(name.lastIndexOf(',') + 1).trim()
      : undefined;
    check(
      attribute('Цвет') === colourFromName,
      `${id}: colour attribute ${attribute('Цвет')} vs name ${colourFromName}`,
    );
    const storage = /(\d+)\s*ГБ/u.exec(name.replace(/\d+\//u, ''));
    check(
      attribute('Память') === (storage === null ? undefined : `${storage[1]} ГБ`),
      `${id}: storage attribute`,
    );
    const ram = /(\d+)\/\d+\s*ГБ/u.exec(name);
    check(attribute('ОЗУ') === (ram === null ? undefined : `${ram[1]} ГБ`), `${id}: RAM attribute`);
    if (record.category === 'smartphones') {
      const storageRow = rows.find((row) => row.label === 'Встроенная память')?.value ?? '';
      check(
        storage !== null && storageRow.startsWith(`${storage[1]} ГБ`),
        `${id}: storage row ${storageRow}`,
      );
      if (ram !== null) {
        const ramRow = rows.find((row) => row.label === 'Оперативная память')?.value ?? '';
        check(ramRow.startsWith(`${ram[1]} ГБ`), `${id}: RAM row ${ramRow}`);
      }
    }
    const size = attribute('Размер корпуса');
    if (size !== undefined) check(name.includes(size), `${id}: case size attribute`);
    const connector = attribute('Разъём кейса');
    if (connector !== undefined) check(name.includes(connector), `${id}: case connector attribute`);
    check(record.attributes.length >= 1, `${id}: attributes present`);
    const forbiddenFields = [
      'sku',
      'availability',
      'bonusPoints',
      'reviews',
      'oneClickPurchase',
      'variants',
      'labels',
    ];
    for (const field of forbiddenFields) {
      check(!(field in record), `${id}: forbidden field ${field}`);
    }
  }

  let duplicateThrew = false;
  try {
    const registry = new Map();
    for (const record of [...PRODUCT_DETAILS_CONTENT, PRODUCT_DETAILS_CONTENT[0]]) {
      if (registry.has(record.slug)) throw new Error('dup');
      registry.set(record.slug, record);
    }
  } catch {
    duplicateThrew = true;
  }
  check(duplicateThrew, 'duplicate detection logic');
  check(
    /throw new Error\(`Duplicate Product Details content slug/.test(
      readFileSync(`${ROOT}/src/pages/product-details/productDetailsContent.ts`, 'utf8'),
    ),
    'registry throws on duplicate',
  );

  const { productThumbnail } = await server.ssrLoadModule(
    '/src/assets/media/product-details/productThumbnailMedia.ts',
  );
  const { PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA } = await server.ssrLoadModule(
    '/src/assets/media/product-details/productDetailsMedia.ts',
  );
  const THUMBNAIL_SLUGS = [
    'iphone-15-128',
    'iphone-15-pro-128',
    'galaxy-s24-128',
    'xiaomi-14-256',
    'pixel-8-128',
    'oneplus-12-256',
    'apple-watch-series-9-45',
  ];
  const referenceOnly = new Set(
    ['black', 'blue'].flatMap((colour) =>
      Object.values(PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA[colour]),
    ),
  );
  for (const record of PRODUCT_DETAILS_CONTENT) {
    const thumbnail = productThumbnail(record.slug);
    if (THUMBNAIL_SLUGS.includes(record.slug)) {
      check(
        thumbnail !== undefined && thumbnail === record.media?.gallery[0]?.source,
        `${record.slug}: thumbnail is the production gallery hero`,
      );
    } else {
      check(thumbnail === undefined, `${record.slug}: no thumbnail without product media`);
    }
    check(!referenceOnly.has(thumbnail), `${record.slug}: no reference-only thumbnail`);
  }
  check(
    THUMBNAIL_SLUGS.filter((slug) => productThumbnail(slug) !== undefined).length === 7,
    'thumbnail lookup has exactly 7 entries',
  );
  check(productThumbnail('constructor') === undefined, 'thumbnail lookup ignores prototype keys');
} finally {
  await server.close();
}

reportCounts(pass, failures);

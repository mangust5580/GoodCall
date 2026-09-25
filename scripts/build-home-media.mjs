import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mastersDir = path.join(rootDir, 'src/assets/media/home/masters');
const derivedDir = path.join(rootDir, 'src/assets/media/home/derived');

const assets = [
  {
    id: 'home-hero-main-promo',
    variants: [
      {
        id: 'desktop',
        width: 1600,
        height: 704,
        position: 'right',
        widths: [640, 960, 1280, 1600],
      },
      { id: 'mobile', width: 720, height: 620, position: 'right', widths: [320, 480, 640, 720] },
    ],
  },
  {
    id: 'home-promo-new-arrivals',
    variants: [
      { id: 'desktop', width: 1200, height: 680, position: 'right', widths: [420, 640, 960, 1200] },
      { id: 'mobile', width: 720, height: 520, position: 'right', widths: [320, 480, 640, 720] },
    ],
  },
  {
    id: 'home-promo-black-friday',
    variants: [
      { id: 'desktop', width: 1200, height: 680, position: 'right', widths: [420, 640, 960, 1200] },
      { id: 'mobile', width: 720, height: 520, position: 'right', widths: [320, 480, 640, 720] },
    ],
  },
  {
    id: 'home-wearable-tech',
    variants: [
      { id: 'desktop', width: 900, height: 520, position: 'right', widths: [360, 540, 720, 900] },
      { id: 'mobile', width: 720, height: 480, position: 'right', widths: [320, 480, 640, 720] },
    ],
  },
  {
    id: 'home-entertainment-streaming',
    variants: [
      {
        id: 'desktop',
        width: 1800,
        height: 760,
        position: 'right',
        widths: [720, 1080, 1440, 1800],
      },
      { id: 'mobile', width: 720, height: 620, position: 'right', widths: [320, 480, 640, 720] },
    ],
  },
  {
    id: 'home-device-smartphone',
    source: 'home-device-library',
    extract: { left: 6, top: 6, width: 406, height: 406 },
    variants: [
      {
        id: 'card',
        width: 900,
        height: 900,
        position: 'center',
        widths: [160, 240, 320, 480, 640],
      },
    ],
  },
  {
    id: 'home-device-earbuds',
    source: 'home-device-library',
    extract: { left: 424, top: 6, width: 406, height: 406 },
    variants: [
      {
        id: 'card',
        width: 900,
        height: 900,
        position: 'center',
        widths: [160, 240, 320, 480, 640],
      },
    ],
  },
  {
    id: 'home-device-watch',
    source: 'home-device-library',
    extract: { left: 842, top: 6, width: 406, height: 406 },
    variants: [
      {
        id: 'card',
        width: 900,
        height: 900,
        position: 'center',
        widths: [160, 240, 320, 480, 640],
      },
    ],
  },
  {
    id: 'home-device-headphones',
    source: 'home-device-library',
    extract: { left: 6, top: 424, width: 406, height: 406 },
    variants: [
      {
        id: 'card',
        width: 900,
        height: 900,
        position: 'center',
        widths: [160, 240, 320, 480, 640],
      },
    ],
  },
  {
    id: 'home-device-laptop',
    source: 'home-device-library',
    extract: { left: 424, top: 424, width: 406, height: 406 },
    variants: [
      {
        id: 'card',
        width: 900,
        height: 900,
        position: 'center',
        widths: [160, 240, 320, 480, 640],
      },
    ],
  },
  {
    id: 'home-device-tablet',
    source: 'home-device-library',
    extract: { left: 842, top: 424, width: 406, height: 406 },
    variants: [
      {
        id: 'card',
        width: 900,
        height: 900,
        position: 'center',
        widths: [160, 240, 320, 480, 640],
      },
    ],
  },
  {
    id: 'home-article-smartphone-review',
    source: 'home-article-editorial',
    extract: { left: 0, top: 0, width: 2172, height: 543 },
    variants: [
      {
        id: 'cover',
        width: 1200,
        height: 300,
        position: 'center',
        widths: [320, 480, 640, 900, 1200],
        webpQuality: 88,
        avifQuality: 64,
      },
    ],
  },
  {
    id: 'home-article-flagship-preview',
    source: 'home-article-editorial',
    extract: { left: 2172, top: 0, width: 2172, height: 543 },
    variants: [
      {
        id: 'cover',
        width: 1200,
        height: 300,
        position: 'center',
        widths: [320, 480, 640, 900, 1200],
        webpQuality: 88,
        avifQuality: 64,
      },
    ],
  },
  {
    id: 'home-article-watch-guide',
    source: 'home-article-editorial',
    extract: { left: 4344, top: 0, width: 2172, height: 543 },
    variants: [
      {
        id: 'cover',
        width: 1200,
        height: 300,
        position: 'center',
        widths: [320, 480, 640, 900, 1200],
        webpQuality: 88,
        avifQuality: 64,
      },
    ],
  },
];

const encodeVariant = async (asset, variant) => {
  const sourcePath = path.join(mastersDir, `${asset.source ?? asset.id}.png`);
  const outputBase = `${asset.id}-${variant.id}`;
  const outputPng = path.join(derivedDir, `${outputBase}.png`);
  const source = sharp(sourcePath);
  const base = asset.extract === undefined ? source : source.extract(asset.extract);

  await base
    .resize({
      width: variant.width,
      height: variant.height,
      fit: 'cover',
      position: variant.position,
    })
    .png({ compressionLevel: 9 })
    .toFile(outputPng);

  await Promise.all(
    variant.widths.map(async (width) => {
      await sharp(outputPng)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: variant.webpQuality ?? 82 })
        .toFile(path.join(derivedDir, `${outputBase}-${width}.webp`));

      await sharp(outputPng)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: variant.avifQuality ?? 58 })
        .toFile(path.join(derivedDir, `${outputBase}-${width}.avif`));
    }),
  );
};

await rm(derivedDir, { recursive: true, force: true });
await mkdir(derivedDir, { recursive: true });

for (const asset of assets) {
  for (const variant of asset.variants) {
    await encodeVariant(asset, variant);
  }
}

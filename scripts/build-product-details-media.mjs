import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mastersDir = path.join(rootDir, 'src/assets/media/product-details/masters');
const derivedDir = path.join(rootDir, 'src/assets/media/product-details/derived');

const assets = [
  {
    id: 'product-details-iphone-15-pro-128-hero-front',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-iphone-15-pro-128-rear-camera',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-iphone-15-pro-128-front-rear-pair',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-galaxy-s24-128-hero-front',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-galaxy-s24-128-rear-camera',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-galaxy-s24-128-front-rear-pair',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-xiaomi-14-256-hero-front',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-xiaomi-14-256-rear-camera',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-xiaomi-14-256-front-rear-pair',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-pixel-8-128-hero-front',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-pixel-8-128-rear-camera',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-pixel-8-128-front-rear-pair',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-oneplus-12-256-hero-front',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-oneplus-12-256-rear-camera',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-oneplus-12-256-front-rear-pair',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-pink-hero-front',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-pink-rear-camera',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-pink-side-profile',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-pink-front-rear-pair',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-pink-camera-detail',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-hero-front',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-rear-camera',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-side-profile',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-front-rear-pair',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-camera-detail',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-blue-hero-front',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-blue-rear-camera',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-blue-side-profile',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-blue-front-rear-pair',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-blue-camera-detail',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640, 960, 1254],
  },
  {
    id: 'product-details-gallery-apple-watch-s9-black',
    variant: 'gallery',
    widths: [160, 240, 320, 480, 640],
  },
  {
    id: 'product-details-description-editorial',
    variant: 'editorial',
    widths: [320, 480, 640, 960, 1280, 1672],
    webpQuality: 86,
    avifQuality: 62,
  },
  {
    id: 'product-details-warranty-trust',
    variant: 'trust',
    widths: [320, 480, 640, 960, 1280, 1536],
    webpQuality: 86,
    avifQuality: 62,
  },
];

const encodeAsset = async (asset) => {
  const sourcePath = path.join(mastersDir, `${asset.id}.png`);
  const outputBase = `${asset.id}-${asset.variant}`;
  const outputPng = path.join(derivedDir, `${outputBase}.png`);

  await sharp(sourcePath).png({ compressionLevel: 9 }).toFile(outputPng);

  await Promise.all(
    asset.widths.map(async (width) => {
      await sharp(outputPng)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: asset.webpQuality ?? 84 })
        .toFile(path.join(derivedDir, `${outputBase}-${width}.webp`));

      await sharp(outputPng)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: asset.avifQuality ?? 60 })
        .toFile(path.join(derivedDir, `${outputBase}-${width}.avif`));
    }),
  );
};

await rm(derivedDir, { recursive: true, force: true });
await mkdir(derivedDir, { recursive: true });

for (const asset of assets) {
  await encodeAsset(asset);
}

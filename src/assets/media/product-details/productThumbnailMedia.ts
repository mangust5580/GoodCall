import type { PictureSource } from '../../../components/media';
import { HOME_DEVICE_MEDIA } from '../home/homeMarketingMedia';

import {
  PRODUCT_DETAILS_APPLE_WATCH_S9_MEDIA,
  PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA,
  PRODUCT_DETAILS_GALLERY_BY_SLUG,
} from './productDetailsMedia';

const LAPTOP_SLUGS: readonly string[] = [
  'macbook-air-13-m3-256',
  'macbook-pro-14-m3-512',
  'asus-vivobook-15-i5-512',
  'asus-tuf-f15-rtx3050',
  'lenovo-ideapad-slim-5-14',
  'lenovo-legion-5-16-rtx4060',
  'hp-15-i5-512',
  'hp-victus-16-rtx4050',
  'acer-aspire-5-i5-512',
  'acer-swift-go-14-ultra5',
  'msi-katana-17-rtx4060',
  'huawei-matebook-d16-i5',
];

const PRODUCT_THUMBNAIL_BY_SLUG: Readonly<Partial<Record<string, PictureSource>>> = {
  'iphone-15-128': PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA.pink.heroFront,
  'iphone-15-pro-128': PRODUCT_DETAILS_GALLERY_BY_SLUG['iphone-15-pro-128'].heroFront,
  'galaxy-s24-128': PRODUCT_DETAILS_GALLERY_BY_SLUG['galaxy-s24-128'].heroFront,
  'xiaomi-14-256': PRODUCT_DETAILS_GALLERY_BY_SLUG['xiaomi-14-256'].heroFront,
  'pixel-8-128': PRODUCT_DETAILS_GALLERY_BY_SLUG['pixel-8-128'].heroFront,
  'oneplus-12-256': PRODUCT_DETAILS_GALLERY_BY_SLUG['oneplus-12-256'].heroFront,
  'apple-watch-series-9-45': PRODUCT_DETAILS_APPLE_WATCH_S9_MEDIA,
  ...Object.fromEntries(LAPTOP_SLUGS.map((slug) => [slug, HOME_DEVICE_MEDIA.laptop])),
};

export function productThumbnail(slug: string): PictureSource | undefined {
  return Object.hasOwn(PRODUCT_THUMBNAIL_BY_SLUG, slug)
    ? PRODUCT_THUMBNAIL_BY_SLUG[slug]
    : undefined;
}

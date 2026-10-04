import type { PictureSource } from '../../../components/media';

import {
  PRODUCT_DETAILS_APPLE_WATCH_S9_MEDIA,
  PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA,
  PRODUCT_DETAILS_GALLERY_BY_SLUG,
} from './productDetailsMedia';

const PRODUCT_THUMBNAIL_BY_SLUG: Readonly<Partial<Record<string, PictureSource>>> = {
  'iphone-15-128': PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA.pink.heroFront,
  'iphone-15-pro-128': PRODUCT_DETAILS_GALLERY_BY_SLUG['iphone-15-pro-128'].heroFront,
  'galaxy-s24-128': PRODUCT_DETAILS_GALLERY_BY_SLUG['galaxy-s24-128'].heroFront,
  'xiaomi-14-256': PRODUCT_DETAILS_GALLERY_BY_SLUG['xiaomi-14-256'].heroFront,
  'pixel-8-128': PRODUCT_DETAILS_GALLERY_BY_SLUG['pixel-8-128'].heroFront,
  'oneplus-12-256': PRODUCT_DETAILS_GALLERY_BY_SLUG['oneplus-12-256'].heroFront,
  'apple-watch-series-9-45': PRODUCT_DETAILS_APPLE_WATCH_S9_MEDIA,
};

export function productThumbnail(slug: string): PictureSource | undefined {
  return Object.hasOwn(PRODUCT_THUMBNAIL_BY_SLUG, slug)
    ? PRODUCT_THUMBNAIL_BY_SLUG[slug]
    : undefined;
}

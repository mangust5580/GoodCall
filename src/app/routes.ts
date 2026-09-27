import { isProductDetailsSpecimenSlug } from '../pages/product-details/productDetailsFixtures';

export const HOME_PATH = '/';
export const CATALOG_SMARTPHONES_PATH = '/catalog/smartphones';
export const PRODUCT_PATH = '/product/:slug';
export const CART_PATH = '/cart';

export function hashHref(path: string): string {
  return `#${path}`;
}

export function productPath(slug: string): string {
  return `/product/${encodeURIComponent(slug)}`;
}

export function productDetailsHref(slug: string): string | undefined {
  return isProductDetailsSpecimenSlug(slug) ? hashHref(productPath(slug)) : undefined;
}

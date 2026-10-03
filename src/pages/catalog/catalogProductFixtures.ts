import { CATALOG_PRODUCTS_PER_PAGE } from './catalogProduct';
import type { CatalogProduct } from './catalogProduct';

export const CATALOG_PAGE_COUNT = 65;

export function catalogPageProducts(
  products: readonly CatalogProduct[],
  page: number,
): CatalogProduct[] {
  const total = products.length;

  if (total === 0) {
    return [];
  }

  const offset = ((((page - 1) * CATALOG_PRODUCTS_PER_PAGE) % total) + total) % total;

  return Array.from(
    { length: Math.min(CATALOG_PRODUCTS_PER_PAGE, total) },
    (_, index) => products[(offset + index) % total],
  );
}

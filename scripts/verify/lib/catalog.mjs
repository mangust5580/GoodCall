import { readFileSync } from 'node:fs';

const catalog = JSON.parse(
  readFileSync(new URL('../fixtures/catalog.json', import.meta.url), 'utf8'),
);

export const CATEGORIES = catalog.categories;
export const PRODUCTS = catalog.products;
export const HOME_POPULAR_PRODUCTS = catalog.homePopularProducts;

export function activeCatalogProducts() {
  return PRODUCTS.filter((product) => product.is_active).map((product) => ({
    slug: product.slug,
    name: product.name,
    is_active: product.is_active,
    categories: { slug: CATEGORIES.find((category) => category.id === product.category_id)?.slug },
  }));
}

import { CATALOG_PRODUCTS_PER_PAGE, CATALOG_SORT_OPTIONS } from '../catalog/catalogProductFixtures';
import type { CatalogProduct, CatalogSortValue } from '../catalog/catalogProductFixtures';

export const SEARCH_RESULTS_PER_PAGE = CATALOG_PRODUCTS_PER_PAGE;

const LOCALE = 'ru-RU';
const countFormatter = new Intl.NumberFormat(LOCALE);
const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});
const pluralRules = new Intl.PluralRules(LOCALE);

const PRODUCT_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'товаров',
  one: 'товар',
  two: 'товара',
  few: 'товара',
  many: 'товаров',
  other: 'товара',
};

const FOUND_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'найдено',
  one: 'найден',
  two: 'найдено',
  few: 'найдено',
  many: 'найдено',
  other: 'найдено',
};

export function normalizeSearchQuery(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function matchSearchProducts(
  products: readonly CatalogProduct[],
  query: string,
): readonly CatalogProduct[] {
  const needle = normalizeSearchQuery(query).toLocaleLowerCase(LOCALE);

  if (needle === '') {
    return [];
  }

  return products.filter((product) => product.title.toLocaleLowerCase(LOCALE).includes(needle));
}

export function parseSearchSort(value: string | null): CatalogSortValue | undefined {
  return CATALOG_SORT_OPTIONS.find((option) => option.value === value)?.value;
}

export function parseSearchPage(value: string | null): number {
  const page = value === null ? Number.NaN : Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function searchPageCount(resultCount: number): number {
  return Math.max(1, Math.ceil(resultCount / SEARCH_RESULTS_PER_PAGE));
}

export function searchPageSlice(
  products: readonly CatalogProduct[],
  page: number,
): readonly CatalogProduct[] {
  const start = (page - 1) * SEARCH_RESULTS_PER_PAGE;

  return products.slice(start, start + SEARCH_RESULTS_PER_PAGE);
}

export function searchSavings(price: number, oldPrice: number | undefined): number | undefined {
  return oldPrice !== undefined && oldPrice > price ? oldPrice - price : undefined;
}

export function formatSearchPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatFoundCount(value: number): string {
  const rule = pluralRules.select(value);

  return `${FOUND_WORDS[rule]} ${countFormatter.format(value)} ${PRODUCT_WORDS[rule]}`;
}

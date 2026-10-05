import { CATALOG_PRODUCTS_PER_PAGE } from './catalogProduct';
import type { CatalogProduct } from './catalogProduct';
import { CATALOG_PRICE_MAX, CATALOG_PRICE_MIN } from './catalogFilterState';
import type { CatalogFilterState } from './catalogFilterState';

export interface CatalogFacetCount<Value extends string | number> {
  readonly value: Value;
  readonly count: number;
}

export interface CatalogLiveFacets {
  readonly brands: readonly CatalogFacetCount<string>[];
  readonly storages: readonly CatalogFacetCount<number>[];
  readonly colours: readonly CatalogFacetCount<string>[];
}

export type CatalogQuickFilterValue =
  'all' | 'new' | 'bestsellers' | 'discounted' | 'under-15000' | '15000-30000' | 'over-30000';

const STORAGE_PATTERN = /(\d+)\s*ГБ/u;
const RAM_STORAGE_PATTERN = /(\d+)\/\d+\s*ГБ/u;
const LOWER_PRICE_BOUNDARY = 15000;
const UPPER_PRICE_BOUNDARY = 30000;

export function productBrand(product: CatalogProduct): string | undefined {
  return product.title.split(' ')[0] || undefined;
}

export function productStorage(product: CatalogProduct): number | undefined {
  const match = STORAGE_PATTERN.exec(product.title);

  return match === null ? undefined : Number(match[1]);
}

export function productRam(product: CatalogProduct): number | undefined {
  const match = RAM_STORAGE_PATTERN.exec(product.title);

  return match === null ? undefined : Number(match[1]);
}

export function productColour(product: CatalogProduct): string | undefined {
  const index = product.title.lastIndexOf(',');

  return index === -1 ? undefined : product.title.slice(index + 1).trim() || undefined;
}

export function countFacetValues<Value extends string | number>(
  values: readonly (Value | undefined)[],
): Map<Value, number> {
  const counts = new Map<Value, number>();

  for (const value of values) {
    if (value !== undefined) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return counts;
}

export function byCountThenName<Value extends string | number>(
  counts: Map<Value, number>,
): CatalogFacetCount<Value>[] {
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort(
      (left, right) =>
        right.count - left.count || String(left.value).localeCompare(String(right.value), 'ru'),
    );
}

export function buildCatalogLiveFacets(products: readonly CatalogProduct[]): CatalogLiveFacets {
  return {
    brands: byCountThenName(countFacetValues(products.map(productBrand))),
    storages: [...countFacetValues(products.map(productStorage))]
      .map(([value, count]) => ({ value, count }))
      .sort((left, right) => left.value - right.value),
    colours: byCountThenName(countFacetValues(products.map(productColour))),
  };
}

function matchesQuickFilter(
  product: CatalogProduct,
  quickFilter: CatalogQuickFilterValue,
): boolean {
  switch (quickFilter) {
    case 'discounted':
      return product.oldPriceValue !== undefined && product.oldPriceValue > product.priceValue;
    case 'under-15000':
      return product.priceValue < LOWER_PRICE_BOUNDARY;
    case '15000-30000':
      return (
        product.priceValue >= LOWER_PRICE_BOUNDARY && product.priceValue < UPPER_PRICE_BOUNDARY
      );
    case 'over-30000':
      return product.priceValue >= UPPER_PRICE_BOUNDARY;
    default:
      return true;
  }
}

export function applyCatalogLiveFilters(
  products: readonly CatalogProduct[],
  filters: CatalogFilterState,
  quickFilter: CatalogQuickFilterValue,
): readonly CatalogProduct[] {
  const [lowerPrice, upperPrice] = filters.price;
  const priceActive = lowerPrice !== CATALOG_PRICE_MIN || upperPrice !== CATALOG_PRICE_MAX;
  const ratingThresholds = filters.rating.map(Number).filter(Number.isFinite);
  const minimumRating = ratingThresholds.length === 0 ? undefined : Math.min(...ratingThresholds);

  return products.filter((product) => {
    const brand = productBrand(product);
    const storage = productStorage(product);
    const colour = productColour(product);

    return (
      (!priceActive || (product.priceValue >= lowerPrice && product.priceValue <= upperPrice)) &&
      (filters.brands.length === 0 || (brand !== undefined && filters.brands.includes(brand))) &&
      (filters.memory.length === 0 ||
        (storage !== undefined && filters.memory.includes(String(storage)))) &&
      (filters.colours.length === 0 ||
        (colour !== undefined && filters.colours.includes(colour))) &&
      (minimumRating === undefined ||
        (product.rating !== undefined && product.rating >= minimumRating)) &&
      matchesQuickFilter(product, quickFilter)
    );
  });
}

export function catalogLivePageCount(resultCount: number): number {
  return Math.max(1, Math.ceil(resultCount / CATALOG_PRODUCTS_PER_PAGE));
}

export function catalogLivePageSlice(
  products: readonly CatalogProduct[],
  page: number,
): readonly CatalogProduct[] {
  const start = (page - 1) * CATALOG_PRODUCTS_PER_PAGE;

  return products.slice(start, start + CATALOG_PRODUCTS_PER_PAGE);
}

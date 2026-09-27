import type { CatalogProduct } from '../catalog/catalogProductFixtures';

export interface SearchFacetOption<Value extends string | number> {
  readonly value: Value;
  readonly count: number;
}

export interface SearchFacetOptions {
  readonly priceBounds?: readonly [number, number];
  readonly brands: readonly SearchFacetOption<string>[];
  readonly colours: readonly SearchFacetOption<string>[];
  readonly storages: readonly SearchFacetOption<number>[];
}

export interface SearchFilterState {
  readonly price?: readonly [number, number];
  readonly brands: readonly string[];
  readonly colours: readonly string[];
  readonly storages: readonly number[];
}

export const SEARCH_PRICE_STEP = 1000;

export const EMPTY_SEARCH_FILTERS: SearchFilterState = {
  brands: [],
  colours: [],
  storages: [],
};

const STORAGE_PATTERN = /(\d+)\s*ГБ/u;
const RAM_STORAGE_PATTERN = /(\d+)\/\d+\s*ГБ/u;

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

function countValues<Value extends string | number>(
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

function byCountThenName<Value extends string | number>(
  counts: Map<Value, number>,
): SearchFacetOption<Value>[] {
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort(
      (left, right) =>
        right.count - left.count || String(left.value).localeCompare(String(right.value), 'ru'),
    );
}

export function buildSearchFacetOptions(products: readonly CatalogProduct[]): SearchFacetOptions {
  const prices = products.map((product) => product.priceValue);
  const minPrice = Math.floor(Math.min(...prices) / SEARCH_PRICE_STEP) * SEARCH_PRICE_STEP;
  const maxPrice = Math.ceil(Math.max(...prices) / SEARCH_PRICE_STEP) * SEARCH_PRICE_STEP;

  return {
    priceBounds: prices.length > 0 && maxPrice > minPrice ? [minPrice, maxPrice] : undefined,
    brands: byCountThenName(countValues(products.map(productBrand))),
    colours: byCountThenName(countValues(products.map(productColour))),
    storages: [...countValues(products.map(productStorage))]
      .map(([value, count]) => ({ value, count }))
      .sort((left, right) => left.value - right.value),
  };
}

function priceFilterActive(filters: SearchFilterState, options: SearchFacetOptions): boolean {
  const bounds = options.priceBounds;

  return (
    filters.price !== undefined &&
    bounds !== undefined &&
    (filters.price[0] > bounds[0] || filters.price[1] < bounds[1])
  );
}

export function searchFiltersActive(
  filters: SearchFilterState,
  options: SearchFacetOptions,
): boolean {
  return (
    priceFilterActive(filters, options) ||
    filters.brands.length > 0 ||
    filters.colours.length > 0 ||
    filters.storages.length > 0
  );
}

export function applySearchFilters(
  products: readonly CatalogProduct[],
  filters: SearchFilterState,
  options: SearchFacetOptions,
): readonly CatalogProduct[] {
  const price = priceFilterActive(filters, options) ? filters.price : undefined;

  return products.filter((product) => {
    const brand = productBrand(product);
    const colour = productColour(product);
    const storage = productStorage(product);

    return (
      (price === undefined || (product.priceValue >= price[0] && product.priceValue <= price[1])) &&
      (filters.brands.length === 0 || (brand !== undefined && filters.brands.includes(brand))) &&
      (filters.colours.length === 0 ||
        (colour !== undefined && filters.colours.includes(colour))) &&
      (filters.storages.length === 0 ||
        (storage !== undefined && filters.storages.includes(storage)))
    );
  });
}

export function sameSearchFilters(
  left: SearchFilterState,
  right: SearchFilterState,
  options: SearchFacetOptions,
): boolean {
  const sameList = <Value>(a: readonly Value[], b: readonly Value[]) =>
    a.length === b.length && a.every((value) => b.includes(value));
  const leftPrice = priceFilterActive(left, options) ? left.price : undefined;
  const rightPrice = priceFilterActive(right, options) ? right.price : undefined;

  return (
    leftPrice?.[0] === rightPrice?.[0] &&
    leftPrice?.[1] === rightPrice?.[1] &&
    sameList(left.brands, right.brands) &&
    sameList(left.colours, right.colours) &&
    sameList(left.storages, right.storages)
  );
}

export function toggleFilterValue<Value>(
  values: readonly Value[],
  value: Value,
  checked: boolean,
): readonly Value[] {
  return checked
    ? [...values.filter((entry) => entry !== value), value]
    : values.filter((entry) => entry !== value);
}

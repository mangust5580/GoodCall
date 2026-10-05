import {
  byCountThenName,
  countFacetValues,
  productBrand,
  productColour,
  productStorage,
} from '../catalog';
import type { CatalogProduct } from '../catalog';

export { productBrand, productColour, productRam, productStorage } from '../catalog';

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

export function buildSearchFacetOptions(products: readonly CatalogProduct[]): SearchFacetOptions {
  const prices = products.map((product) => product.priceValue);
  const minPrice = Math.floor(Math.min(...prices) / SEARCH_PRICE_STEP) * SEARCH_PRICE_STEP;
  const maxPrice = Math.ceil(Math.max(...prices) / SEARCH_PRICE_STEP) * SEARCH_PRICE_STEP;

  return {
    priceBounds: prices.length > 0 && maxPrice > minPrice ? [minPrice, maxPrice] : undefined,
    brands: byCountThenName(countFacetValues(products.map(productBrand))),
    colours: byCountThenName(countFacetValues(products.map(productColour))),
    storages: [...countFacetValues(products.map(productStorage))]
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

export function countActiveSearchFilters(
  filters: SearchFilterState,
  options: SearchFacetOptions,
): number {
  return (
    filters.brands.length +
    filters.colours.length +
    filters.storages.length +
    (priceFilterActive(filters, options) ? 1 : 0)
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

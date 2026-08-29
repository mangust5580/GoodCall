export interface CatalogFilterState {
  readonly brands: readonly string[];
  readonly series: readonly string[];
  readonly diagonal: readonly string[];
  readonly rating: readonly string[];
  readonly memory: readonly string[];
  readonly colours: readonly string[];
  readonly price: readonly [number, number];
}

export type CatalogFilterListKey = Exclude<keyof CatalogFilterState, 'price'>;

export const CATALOG_PRICE_MIN = 3000;
export const CATALOG_PRICE_MAX = 250000;
export const CATALOG_PRICE_STEP = 1000;

export const DEFAULT_CATALOG_FILTER_STATE: CatalogFilterState = {
  brands: [],
  series: [],
  diagonal: [],
  rating: [],
  memory: [],
  colours: [],
  price: [CATALOG_PRICE_MIN, CATALOG_PRICE_MAX],
};

export function countActiveCatalogFilters(state: CatalogFilterState): number {
  const [lower, upper] = state.price;
  const priceChanged = lower !== CATALOG_PRICE_MIN || upper !== CATALOG_PRICE_MAX;

  return (
    state.brands.length +
    state.series.length +
    state.diagonal.length +
    state.rating.length +
    state.memory.length +
    state.colours.length +
    (priceChanged ? 1 : 0)
  );
}

export function toggleCatalogFilterValue(
  values: readonly string[],
  value: string,
  checked: boolean,
): string[] {
  if (checked) {
    return values.includes(value) ? [...values] : [...values, value];
  }

  return values.filter((current) => current !== value);
}

import { CATALOG_PRICE_MAX, CATALOG_PRICE_MIN } from '../catalogFilterState';

export interface LaptopFilterState {
  readonly brands: readonly string[];
  readonly diagonal: readonly string[];
  readonly cpu: readonly string[];
  readonly ram: readonly string[];
  readonly ssd: readonly string[];
  readonly gpu: readonly string[];
  readonly os: readonly string[];
  readonly colours: readonly string[];
  readonly price: readonly [number, number];
}

export type LaptopFilterListKey = Exclude<keyof LaptopFilterState, 'price'>;

export const LAPTOP_FILTER_LIST_KEYS: readonly LaptopFilterListKey[] = [
  'brands',
  'diagonal',
  'cpu',
  'ram',
  'ssd',
  'gpu',
  'os',
  'colours',
];

export const DEFAULT_LAPTOP_FILTER_STATE: LaptopFilterState = {
  brands: [],
  diagonal: [],
  cpu: [],
  ram: [],
  ssd: [],
  gpu: [],
  os: [],
  colours: [],
  price: [CATALOG_PRICE_MIN, CATALOG_PRICE_MAX],
};

export function countActiveLaptopFilters(state: LaptopFilterState): number {
  const [lower, upper] = state.price;
  const priceChanged = lower !== CATALOG_PRICE_MIN || upper !== CATALOG_PRICE_MAX;

  return (
    LAPTOP_FILTER_LIST_KEYS.reduce((total, key) => total + state[key].length, 0) +
    (priceChanged ? 1 : 0)
  );
}

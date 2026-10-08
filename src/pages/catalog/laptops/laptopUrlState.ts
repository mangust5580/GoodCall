import { CATALOG_PRICE_MAX, CATALOG_PRICE_MIN } from '../catalogFilterState';
import { DEFAULT_CATALOG_SORT } from '../catalogProduct';
import type { CatalogSortValue } from '../catalogProduct';
import {
  allowedValues,
  appendUnique,
  parsePage,
  parsePriceBound,
  parseSort,
} from '../catalogUrlState';
import type { LaptopFacets } from './laptopFacets';
import type { LaptopFilterListKey, LaptopFilterState } from './laptopFilterState';

export interface LaptopAppliedState {
  readonly filters: LaptopFilterState;
  readonly sort: CatalogSortValue;
  readonly page: number;
}

const LIST_PARAMS: Readonly<Record<LaptopFilterListKey, string>> = {
  brands: 'brand',
  diagonal: 'diagonal',
  cpu: 'cpu',
  ram: 'ram',
  ssd: 'ssd',
  gpu: 'gpu',
  os: 'os',
  colours: 'colour',
};

const PRICE_FROM_PARAM = 'price_from';
const PRICE_TO_PARAM = 'price_to';
const SORT_PARAM = 'sort';
const PAGE_PARAM = 'page';

const LAPTOP_URL_PARAMS: readonly string[] = [
  ...Object.values(LIST_PARAMS),
  PRICE_FROM_PARAM,
  PRICE_TO_PARAM,
  SORT_PARAM,
  PAGE_PARAM,
];

export function parseLaptopUrlState(
  params: URLSearchParams,
  facets: LaptopFacets,
): LaptopAppliedState {
  const lower = parsePriceBound(params.get(PRICE_FROM_PARAM), CATALOG_PRICE_MIN);
  const upper = parsePriceBound(params.get(PRICE_TO_PARAM), CATALOG_PRICE_MAX);
  const list = (key: LaptopFilterListKey): string[] =>
    allowedValues(params, LIST_PARAMS[key], new Set(facets[key].map((option) => option.value)));

  return {
    filters: {
      brands: list('brands'),
      diagonal: list('diagonal'),
      cpu: list('cpu'),
      ram: list('ram'),
      ssd: list('ssd'),
      gpu: list('gpu'),
      os: list('os'),
      colours: list('colours'),
      price: [Math.min(lower, upper), Math.max(lower, upper)],
    },
    sort: parseSort(params.get(SORT_PARAM)),
    page: parsePage(params.get(PAGE_PARAM)),
  };
}

export function serializeLaptopUrlState(
  state: LaptopAppliedState,
  current: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(current);

  for (const key of LAPTOP_URL_PARAMS) {
    next.delete(key);
  }

  for (const [key, param] of Object.entries(LIST_PARAMS) as [LaptopFilterListKey, string][]) {
    appendUnique(next, param, state.filters[key]);
  }

  const [lower, upper] = state.filters.price;

  if (lower !== CATALOG_PRICE_MIN) {
    next.set(PRICE_FROM_PARAM, String(lower));
  }

  if (upper !== CATALOG_PRICE_MAX) {
    next.set(PRICE_TO_PARAM, String(upper));
  }

  if (state.sort !== DEFAULT_CATALOG_SORT) {
    next.set(SORT_PARAM, state.sort);
  }

  if (state.page > 1) {
    next.set(PAGE_PARAM, String(state.page));
  }

  return next;
}

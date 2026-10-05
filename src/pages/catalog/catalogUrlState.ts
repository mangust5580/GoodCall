import type { CatalogLiveFacets, CatalogQuickFilterValue } from './catalogFacets';
import {
  CATALOG_PRICE_MAX,
  CATALOG_PRICE_MIN,
  CATALOG_PRICE_STEP,
  CATALOG_RATING_VALUES,
  DEFAULT_CATALOG_FILTER_STATE,
} from './catalogFilterState';
import type { CatalogFilterState } from './catalogFilterState';
import { CATALOG_SORT_OPTIONS, DEFAULT_CATALOG_SORT } from './catalogProduct';
import type { CatalogSortValue } from './catalogProduct';

export type CatalogHistoryMode = 'push' | 'replace';

export interface CatalogAppliedState {
  readonly filters: CatalogFilterState;
  readonly quickFilter: CatalogQuickFilterValue;
  readonly sort: CatalogSortValue;
  readonly page: number;
}

export const DEFAULT_CATALOG_QUICK_FILTER: CatalogQuickFilterValue = 'all';

export const CATALOG_LIVE_QUICK_FILTER_VALUES: readonly CatalogQuickFilterValue[] = [
  'discounted',
  'under-15000',
  '15000-30000',
  'over-30000',
];

const BRAND_PARAM = 'brand';
const MEMORY_PARAM = 'memory';
const COLOUR_PARAM = 'colour';
const RATING_PARAM = 'rating';
const PRICE_FROM_PARAM = 'price_from';
const PRICE_TO_PARAM = 'price_to';
const QUICK_PARAM = 'quick';
const SORT_PARAM = 'sort';
const PAGE_PARAM = 'page';

const CATALOG_URL_PARAMS = [
  BRAND_PARAM,
  MEMORY_PARAM,
  COLOUR_PARAM,
  RATING_PARAM,
  PRICE_FROM_PARAM,
  PRICE_TO_PARAM,
  QUICK_PARAM,
  SORT_PARAM,
  PAGE_PARAM,
] as const;

const PAGE_PATTERN = /^\d+$/u;

function allowedValues(
  params: URLSearchParams,
  key: string,
  allowed: ReadonlySet<string>,
): string[] {
  const values: string[] = [];

  for (const value of params.getAll(key)) {
    if (allowed.has(value) && !values.includes(value)) {
      values.push(value);
    }
  }

  return values;
}

function parsePriceBound(value: string | null, fallback: number): number {
  if (value === null || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  const stepped =
    Math.round((parsed - CATALOG_PRICE_MIN) / CATALOG_PRICE_STEP) * CATALOG_PRICE_STEP +
    CATALOG_PRICE_MIN;

  return Math.min(CATALOG_PRICE_MAX, Math.max(CATALOG_PRICE_MIN, stepped));
}

function parseQuickFilter(value: string | null): CatalogQuickFilterValue {
  return (
    CATALOG_LIVE_QUICK_FILTER_VALUES.find((quick) => quick === value) ??
    DEFAULT_CATALOG_QUICK_FILTER
  );
}

function parseSort(value: string | null): CatalogSortValue {
  return (
    CATALOG_SORT_OPTIONS.find((option) => option.value === value)?.value ?? DEFAULT_CATALOG_SORT
  );
}

function parsePage(value: string | null): number {
  if (value === null || !PAGE_PATTERN.test(value)) {
    return 1;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function parseCatalogUrlState(
  params: URLSearchParams,
  facets: CatalogLiveFacets,
): CatalogAppliedState {
  const lower = parsePriceBound(params.get(PRICE_FROM_PARAM), CATALOG_PRICE_MIN);
  const upper = parsePriceBound(params.get(PRICE_TO_PARAM), CATALOG_PRICE_MAX);

  return {
    filters: {
      ...DEFAULT_CATALOG_FILTER_STATE,
      brands: allowedValues(params, BRAND_PARAM, new Set(facets.brands.map((b) => b.value))),
      memory: allowedValues(
        params,
        MEMORY_PARAM,
        new Set(facets.storages.map((storage) => String(storage.value))),
      ),
      colours: allowedValues(params, COLOUR_PARAM, new Set(facets.colours.map((c) => c.value))),
      rating: allowedValues(params, RATING_PARAM, new Set(CATALOG_RATING_VALUES)),
      price: [Math.min(lower, upper), Math.max(lower, upper)],
    },
    quickFilter: parseQuickFilter(params.get(QUICK_PARAM)),
    sort: parseSort(params.get(SORT_PARAM)),
    page: parsePage(params.get(PAGE_PARAM)),
  };
}

function appendUnique(params: URLSearchParams, key: string, values: readonly string[]): void {
  for (const value of new Set(values)) {
    params.append(key, value);
  }
}

export function serializeCatalogUrlState(
  state: CatalogAppliedState,
  current: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(current);

  for (const key of CATALOG_URL_PARAMS) {
    next.delete(key);
  }

  const [lower, upper] = state.filters.price;

  appendUnique(next, BRAND_PARAM, state.filters.brands);
  appendUnique(next, MEMORY_PARAM, state.filters.memory);
  appendUnique(next, COLOUR_PARAM, state.filters.colours);
  appendUnique(next, RATING_PARAM, state.filters.rating);

  if (lower !== CATALOG_PRICE_MIN) {
    next.set(PRICE_FROM_PARAM, String(lower));
  }

  if (upper !== CATALOG_PRICE_MAX) {
    next.set(PRICE_TO_PARAM, String(upper));
  }

  if (state.quickFilter !== DEFAULT_CATALOG_QUICK_FILTER) {
    next.set(QUICK_PARAM, state.quickFilter);
  }

  if (state.sort !== DEFAULT_CATALOG_SORT) {
    next.set(SORT_PARAM, state.sort);
  }

  if (state.page > 1) {
    next.set(PAGE_PARAM, String(state.page));
  }

  return next;
}

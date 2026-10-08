import { useState } from 'react';

import { CatalogFilterDialog } from './CatalogFilterDialog';
import { CatalogFilters } from './CatalogFilters';
import { CatalogListingLayout } from './CatalogListingLayout';
import { CatalogProductGrid } from './CatalogProductGrid';
import type {
  CatalogCartSeam,
  CatalogCompareSeam,
  CatalogFavoritesSeam,
} from './CatalogProductCard';
import {
  applyCatalogLiveFilters,
  buildCatalogLiveFacets,
  catalogLivePageCount,
  catalogLivePageSlice,
} from './catalogFacets';
import type { CatalogQuickFilterValue } from './catalogFacets';
import { DEFAULT_CATALOG_FILTER_STATE, isPriceOnlyChange } from './catalogFilterState';
import type { CatalogFilterListKey, CatalogFilterState } from './catalogFilterState';
import { DEFAULT_CATALOG_SORT, sortCatalogProducts } from './catalogProduct';
import type { CatalogProduct, CatalogSortValue } from './catalogProduct';
import { CATALOG_PAGE_COUNT, catalogPageProducts } from './catalogProductFixtures';
import { CATALOG_PRODUCTS } from './catalogProducts';
import { DEFAULT_CATALOG_QUICK_FILTER } from './catalogUrlState';
import type { CatalogAppliedState, CatalogHistoryMode } from './catalogUrlState';

export type CatalogPageMode = 'specimen' | 'live';

export interface CatalogPageProps {
  readonly mode?: CatalogPageMode;
  readonly resultCount?: number;
  readonly homeHref?: string;
  readonly products?: readonly CatalogProduct[];
  readonly productHref?: (slug: string) => string | undefined;
  readonly cart?: CatalogCartSeam;
  readonly favorites?: CatalogFavoritesSeam;
  readonly compare?: CatalogCompareSeam;
  readonly applied?: CatalogAppliedState;
  readonly onAppliedChange?: (next: CatalogAppliedState, history: CatalogHistoryMode) => void;
}

interface QuickFilter {
  readonly value: CatalogQuickFilterValue;
  readonly label: string;
}

const CATEGORY_TITLE = 'Смартфоны';
const DEFAULT_RESULT_COUNT = 2546;

const QUICK_FILTERS: readonly QuickFilter[] = [
  { value: 'all', label: 'Все смартфоны' },
  { value: 'new', label: 'Новинки' },
  { value: 'bestsellers', label: 'Хиты продаж' },
  { value: 'discounted', label: 'Со скидкой' },
  { value: 'under-15000', label: 'До 15 000 ₽' },
  { value: '15000-30000', label: '15 000 – 30 000 ₽' },
  { value: 'over-30000', label: '30 000 ₽ и выше' },
];

const LIVE_HIDDEN_QUICK_FILTERS: readonly CatalogQuickFilterValue[] = ['new', 'bestsellers'];
const LIVE_QUICK_FILTERS = QUICK_FILTERS.filter(
  (item) => !LIVE_HIDDEN_QUICK_FILTERS.includes(item.value),
);

const FILTER_LIST_KEYS: readonly CatalogFilterListKey[] = [
  'brands',
  'series',
  'diagonal',
  'rating',
  'memory',
  'colours',
];

export function CatalogPage({
  mode = 'specimen',
  resultCount = DEFAULT_RESULT_COUNT,
  homeHref,
  products = CATALOG_PRODUCTS,
  productHref,
  cart,
  favorites,
  compare,
  applied,
  onAppliedChange,
}: CatalogPageProps) {
  const [localFilters, setFilters] = useState<CatalogFilterState>(DEFAULT_CATALOG_FILTER_STATE);
  const [localQuickFilter, setQuickFilter] = useState<CatalogQuickFilterValue>(
    DEFAULT_CATALOG_QUICK_FILTER,
  );
  const [localSort, setSort] = useState<CatalogSortValue>(DEFAULT_CATALOG_SORT);
  const [localPage, setPage] = useState(1);

  const live = mode === 'live';
  const controlled = live && applied !== undefined && onAppliedChange !== undefined;
  const filters = controlled ? applied.filters : localFilters;
  const quickFilter = controlled ? applied.quickFilter : localQuickFilter;
  const sort = controlled ? applied.sort : localSort;
  const page = controlled ? applied.page : localPage;

  const commit = (next: Partial<CatalogAppliedState>, history: CatalogHistoryMode): void => {
    onAppliedChange?.({ filters, quickFilter, sort, page, ...next }, history);
  };
  const liveFacets = live ? buildCatalogLiveFacets(products) : undefined;
  const liveMatches = live
    ? sortCatalogProducts(applyCatalogLiveFilters(products, filters, quickFilter), sort)
    : [];
  const pageCount = live ? catalogLivePageCount(liveMatches.length) : CATALOG_PAGE_COUNT;
  const currentPage = live ? Math.min(page, pageCount) : page;
  const visibleProducts = live
    ? catalogLivePageSlice(liveMatches, currentPage)
    : catalogPageProducts(sortCatalogProducts(products, sort), page);
  const displayedCount = live ? liveMatches.length : resultCount;
  const quickFilters = live ? LIVE_QUICK_FILTERS : QUICK_FILTERS;
  const emptyResults = live && liveMatches.length === 0;

  const updateFilters = (next: CatalogFilterState): void => {
    if (controlled) {
      commit(
        { filters: next, page: 1 },
        isPriceOnlyChange(filters, next, FILTER_LIST_KEYS) ? 'replace' : 'push',
      );
      return;
    }

    setFilters(next);

    if (live) {
      setPage(1);
    }
  };

  const applyDialogFilters = (next: CatalogFilterState): void => {
    if (controlled) {
      commit({ filters: next, page: 1 }, 'push');
      return;
    }

    updateFilters(next);
  };

  const resetLiveResults = (): void => {
    if (controlled) {
      commit(
        {
          filters: DEFAULT_CATALOG_FILTER_STATE,
          quickFilter: DEFAULT_CATALOG_QUICK_FILTER,
          page: 1,
        },
        'push',
      );
      return;
    }

    setFilters(DEFAULT_CATALOG_FILTER_STATE);
    setQuickFilter(DEFAULT_CATALOG_QUICK_FILTER);
    setPage(1);
  };

  const changeSort = (next: CatalogSortValue): void => {
    if (controlled) {
      commit({ sort: next, page: 1 }, 'push');
      return;
    }

    setSort(next);
    setPage(1);
  };

  const changeQuickFilter = (next: CatalogQuickFilterValue): void => {
    if (controlled) {
      commit({ quickFilter: next, page: 1 }, 'push');
      return;
    }

    setQuickFilter(next);

    if (live) {
      setPage(1);
    }
  };

  const changePage = (next: number): void => {
    if (controlled) {
      commit({ page: next }, 'push');
      return;
    }

    setPage(next);
  };

  return (
    <CatalogListingLayout
      count={displayedCount}
      emptyResults={emptyResults}
      filterBar={
        <CatalogFilterDialog
          liveFacets={liveFacets}
          onApply={applyDialogFilters}
          totalCount={live ? products.length : resultCount}
          value={filters}
        />
      }
      homeHref={homeHref}
      live={live}
      onResetResults={resetLiveResults}
      onSortChange={changeSort}
      pagination={
        live && pageCount <= 1 ? undefined : { page: currentPage, pageCount, onChange: changePage }
      }
      quickFilters={
        <div aria-label="Быстрые фильтры" className="catalog-page__quick-filters" role="group">
          {quickFilters.map((item) => {
            const selected = item.value === quickFilter;
            const className = selected
              ? 'catalog-page__quick-filter catalog-page__quick-filter--selected'
              : 'catalog-page__quick-filter';

            return (
              <button
                aria-pressed={selected}
                className={className}
                key={item.value}
                onClick={() => {
                  changeQuickFilter(item.value);
                }}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>
      }
      results={
        <CatalogProductGrid
          cart={cart}
          favorites={favorites}
          compare={compare}
          productHref={productHref}
          products={visibleProducts}
        />
      }
      sidebar={
        <CatalogFilters
          liveFacets={liveFacets}
          onChange={updateFilters}
          onReset={live ? resetLiveResults : undefined}
          totalCount={live ? products.length : resultCount}
          value={filters}
        />
      }
      sort={sort}
      title={CATEGORY_TITLE}
    />
  );
}

import { CatalogFilterDialogShell } from '../CatalogFilterDialog';
import { catalogLivePageCount, catalogLivePageSlice } from '../catalogFacets';
import { isPriceOnlyChange } from '../catalogFilterState';
import { CatalogListingLayout } from '../CatalogListingLayout';
import { sortCatalogProducts } from '../catalogProduct';
import type { CatalogProduct } from '../catalogProduct';
import type {
  CatalogCartSeam,
  CatalogCompareSeam,
  CatalogFavoritesSeam,
} from '../CatalogProductCard';
import { CatalogProductGrid } from '../CatalogProductGrid';
import type { CatalogHistoryMode } from '../catalogUrlState';
import { applyLaptopFilters } from './laptopFacets';
import type { LaptopFacets } from './laptopFacets';
import { LaptopFilters } from './LaptopFilters';
import {
  DEFAULT_LAPTOP_FILTER_STATE,
  LAPTOP_FILTER_LIST_KEYS,
  countActiveLaptopFilters,
} from './laptopFilterState';
import type { LaptopFilterState } from './laptopFilterState';
import type { LaptopAppliedState } from './laptopUrlState';

export interface LaptopCatalogPageProps {
  readonly products: readonly CatalogProduct[];
  readonly facets: LaptopFacets;
  readonly applied: LaptopAppliedState;
  readonly onAppliedChange: (next: LaptopAppliedState, history: CatalogHistoryMode) => void;
  readonly homeHref?: string;
  readonly productHref?: (slug: string) => string | undefined;
  readonly cart?: CatalogCartSeam;
  readonly favorites?: CatalogFavoritesSeam;
  readonly compare?: CatalogCompareSeam;
}

const CATEGORY_TITLE = 'Ноутбуки';

export function LaptopCatalogPage({
  products,
  facets,
  applied,
  onAppliedChange,
  homeHref,
  productHref,
  cart,
  favorites,
  compare,
}: LaptopCatalogPageProps) {
  const { filters, sort, page } = applied;
  const matches = sortCatalogProducts(applyLaptopFilters(products, filters), sort);
  const pageCount = catalogLivePageCount(matches.length);
  const currentPage = Math.min(page, pageCount);

  const commit = (next: Partial<LaptopAppliedState>, history: CatalogHistoryMode): void => {
    onAppliedChange({ ...applied, ...next }, history);
  };

  const updateFilters = (next: LaptopFilterState): void => {
    commit(
      { filters: next, page: 1 },
      isPriceOnlyChange(filters, next, LAPTOP_FILTER_LIST_KEYS) ? 'replace' : 'push',
    );
  };

  const resetResults = (): void => {
    commit({ filters: DEFAULT_LAPTOP_FILTER_STATE, page: 1 }, 'push');
  };

  return (
    <CatalogListingLayout
      count={matches.length}
      emptyResults={matches.length === 0}
      filterBar={
        <CatalogFilterDialogShell
          activeCount={countActiveLaptopFilters(filters)}
          defaultValue={DEFAULT_LAPTOP_FILTER_STATE}
          onApply={(next) => {
            commit({ filters: next, page: 1 }, 'push');
          }}
          renderFilters={(draft, onDraftChange) => (
            <LaptopFilters
              facets={facets}
              layout="dialog"
              onChange={onDraftChange}
              totalCount={products.length}
              value={draft}
            />
          )}
          value={filters}
        />
      }
      homeHref={homeHref}
      live
      onResetResults={resetResults}
      onSortChange={(next) => {
        commit({ sort: next, page: 1 }, 'push');
      }}
      pagination={
        pageCount <= 1
          ? undefined
          : {
              page: currentPage,
              pageCount,
              onChange: (next) => {
                commit({ page: next }, 'push');
              },
            }
      }
      results={
        <CatalogProductGrid
          cart={cart}
          compare={compare}
          favorites={favorites}
          productHref={productHref}
          products={catalogLivePageSlice(matches, currentPage)}
          promo={false}
        />
      }
      sidebar={
        <LaptopFilters
          facets={facets}
          onChange={updateFilters}
          onReset={resetResults}
          totalCount={products.length}
          value={filters}
        />
      }
      sort={sort}
      title={CATEGORY_TITLE}
    />
  );
}

import { Select } from 'radix-ui';
import { useState } from 'react';

import { EmptyState } from '../../components/feedback';
import { Container } from '../../components/layout';
import { Icon, Pagination } from '../../components/ui';
import { CatalogFilterDialog } from './CatalogFilterDialog';
import { CatalogFilters } from './CatalogFilters';
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
import { DEFAULT_CATALOG_FILTER_STATE } from './catalogFilterState';
import type { CatalogFilterListKey, CatalogFilterState } from './catalogFilterState';
import { CATALOG_SORT_OPTIONS, DEFAULT_CATALOG_SORT, sortCatalogProducts } from './catalogProduct';
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
const SORT_LABEL = 'Сортировка';

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

const countFormatter = new Intl.NumberFormat('ru-RU');

function sameValues(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function isPriceOnlyChange(previous: CatalogFilterState, next: CatalogFilterState): boolean {
  return FILTER_LIST_KEYS.every((key) => sameValues(previous[key], next[key]));
}

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
      commit({ filters: next, page: 1 }, isPriceOnlyChange(filters, next) ? 'replace' : 'push');
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
    <main className="catalog-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="catalog-page__breadcrumbs">
          <ol className="catalog-page__crumbs">
            <li className="catalog-page__crumb">
              {homeHref === undefined ? (
                'Главная'
              ) : (
                <a className="catalog-page__crumb-link" href={homeHref}>
                  Главная
                </a>
              )}
            </li>
            <li className="catalog-page__crumb">Каталог</li>
            <li aria-current="page" className="catalog-page__crumb">
              {CATEGORY_TITLE}
            </li>
          </ol>
        </nav>

        <div className="catalog-page__layout">
          <header className="catalog-page__heading">
            <div className="catalog-page__heading-group">
              <h1 className="catalog-page__title">{CATEGORY_TITLE}</h1>
              <p aria-live={live ? 'polite' : undefined} className="catalog-page__count">
                {countFormatter.format(displayedCount)} товаров
              </p>
            </div>

            <Select.Root
              onValueChange={(value: CatalogSortValue) => {
                changeSort(value);
              }}
              value={sort}
            >
              <Select.Trigger
                aria-label={SORT_LABEL}
                className="ui-input ui-input--select-trigger catalog-page__sort"
              >
                <Select.Value />
                <Select.Icon asChild>
                  <Icon className="ui-input__select-icon" name="chevron-down" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  align="end"
                  className="ui-floating-surface ui-select-content"
                  collisionPadding={16}
                  position="popper"
                  sideOffset={8}
                >
                  <Select.Viewport className="ui-select-content__viewport">
                    {CATALOG_SORT_OPTIONS.map((option) => (
                      <Select.Item
                        className="ui-select-content__item"
                        key={option.value}
                        value={option.value}
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </header>

          <aside aria-label="Фильтры каталога" className="catalog-page__sidebar">
            <CatalogFilters
              liveFacets={liveFacets}
              onChange={updateFilters}
              onReset={live ? resetLiveResults : undefined}
              totalCount={live ? products.length : resultCount}
              value={filters}
            />
          </aside>

          <section aria-label="Товары каталога" className="catalog-page__results">
            <div className="catalog-page__filter-bar">
              <CatalogFilterDialog
                liveFacets={liveFacets}
                onApply={applyDialogFilters}
                totalCount={live ? products.length : resultCount}
                value={filters}
              />
            </div>

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

            {emptyResults ? (
              <EmptyState
                action={{ label: 'Сбросить фильтры', onClick: resetLiveResults }}
                message="По выбранным фильтрам товаров нет."
                title="Ничего не найдено"
              />
            ) : (
              <CatalogProductGrid
                cart={cart}
                favorites={favorites}
                compare={compare}
                productHref={productHref}
                products={visibleProducts}
              />
            )}

            {live && pageCount <= 1 ? null : (
              <div className="catalog-page__pagination">
                <Pagination
                  label="Страницы каталога"
                  onChange={changePage}
                  page={currentPage}
                  pageCount={pageCount}
                />
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}

import { Select } from 'radix-ui';
import { useState } from 'react';

import { Container } from '../../components/layout';
import { Icon, Pagination } from '../../components/ui';
import { CatalogFilterDialog } from './CatalogFilterDialog';
import { CatalogFilters } from './CatalogFilters';
import { CatalogProductGrid } from './CatalogProductGrid';
import { DEFAULT_CATALOG_FILTER_STATE } from './catalogFilterState';
import type { CatalogFilterState } from './catalogFilterState';
import {
  CATALOG_PAGE_COUNT,
  CATALOG_PRODUCTS,
  CATALOG_SORT_OPTIONS,
  DEFAULT_CATALOG_SORT,
  catalogPageProducts,
  sortCatalogProducts,
} from './catalogProductFixtures';
import type { CatalogProduct, CatalogSortValue } from './catalogProductFixtures';

export interface CatalogPageProps {
  readonly resultCount?: number;
  readonly homeHref?: string;
  readonly products?: readonly CatalogProduct[];
}

interface QuickFilter {
  readonly value: string;
  readonly label: string;
}

const CATEGORY_TITLE = 'Смартфоны';
const DEFAULT_RESULT_COUNT = 2546;
const DEFAULT_QUICK_FILTER = 'all';
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

const countFormatter = new Intl.NumberFormat('ru-RU');

export function CatalogPage({
  resultCount = DEFAULT_RESULT_COUNT,
  homeHref,
  products = CATALOG_PRODUCTS,
}: CatalogPageProps) {
  const [filters, setFilters] = useState<CatalogFilterState>(DEFAULT_CATALOG_FILTER_STATE);
  const [quickFilter, setQuickFilter] = useState(DEFAULT_QUICK_FILTER);
  const [sort, setSort] = useState<CatalogSortValue>(DEFAULT_CATALOG_SORT);
  const [page, setPage] = useState(1);

  const visibleProducts = catalogPageProducts(sortCatalogProducts(products, sort), page);

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
              <p className="catalog-page__count">{countFormatter.format(resultCount)} товаров</p>
            </div>

            <Select.Root
              onValueChange={(value: CatalogSortValue) => {
                setSort(value);
                setPage(1);
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
            <CatalogFilters onChange={setFilters} totalCount={resultCount} value={filters} />
          </aside>

          <section aria-label="Товары каталога" className="catalog-page__results">
            <div className="catalog-page__filter-bar">
              <CatalogFilterDialog onApply={setFilters} totalCount={resultCount} value={filters} />
            </div>

            <div aria-label="Быстрые фильтры" className="catalog-page__quick-filters" role="group">
              {QUICK_FILTERS.map((item) => {
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
                      setQuickFilter(item.value);
                    }}
                    type="button"
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <CatalogProductGrid products={visibleProducts} />

            <div className="catalog-page__pagination">
              <Pagination
                label="Страницы каталога"
                onChange={setPage}
                page={page}
                pageCount={CATALOG_PAGE_COUNT}
              />
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}

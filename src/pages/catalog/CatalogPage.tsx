import { useState } from 'react';

import { Container } from '../../components/layout';
import { CatalogFilterDialog } from './CatalogFilterDialog';
import { CatalogFilters } from './CatalogFilters';
import { DEFAULT_CATALOG_FILTER_STATE } from './catalogFilterState';
import type { CatalogFilterState } from './catalogFilterState';

export interface CatalogPageProps {
  readonly resultCount?: number;
}

interface QuickFilter {
  readonly value: string;
  readonly label: string;
}

const CATEGORY_TITLE = 'Смартфоны';
const DEFAULT_RESULT_COUNT = 2546;
const CURRENT_SORT = 'Сначала популярные';
const DEFAULT_QUICK_FILTER = 'all';

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

export function CatalogPage({ resultCount = DEFAULT_RESULT_COUNT }: CatalogPageProps) {
  const home = import.meta.env.BASE_URL;
  const [filters, setFilters] = useState<CatalogFilterState>(DEFAULT_CATALOG_FILTER_STATE);
  const [quickFilter, setQuickFilter] = useState(DEFAULT_QUICK_FILTER);

  return (
    <main className="catalog-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="catalog-page__breadcrumbs">
          <ol className="catalog-page__crumbs">
            <li className="catalog-page__crumb">
              <a className="catalog-page__crumb-link" href={home}>
                Главная
              </a>
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
            <p className="catalog-page__sort">
              Сортировка: <span className="catalog-page__sort-value">{CURRENT_SORT}</span>
            </p>
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

            <div className="catalog-page__reserved catalog-page__reserved--products" />
          </section>
        </div>
      </Container>
    </main>
  );
}

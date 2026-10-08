import { Select } from 'radix-ui';
import type { ReactNode } from 'react';

import { formatUnitCount } from '../../commerce/cart';
import { EmptyState } from '../../components/feedback';
import { Breadcrumbs, Container } from '../../components/layout';
import { Icon, Pagination } from '../../components/ui';
import { CATALOG_SORT_OPTIONS } from './catalogProduct';
import type { CatalogSortValue } from './catalogProduct';

const SORT_LABEL = 'Сортировка';

export interface CatalogListingPagination {
  readonly page: number;
  readonly pageCount: number;
  readonly onChange: (page: number) => void;
}

interface CatalogListingLayoutProps {
  readonly title: string;
  readonly homeHref?: string;
  readonly count: number;
  readonly live: boolean;
  readonly sort: CatalogSortValue;
  readonly onSortChange: (sort: CatalogSortValue) => void;
  readonly sidebar: ReactNode;
  readonly filterBar: ReactNode;
  readonly quickFilters?: ReactNode;
  readonly emptyResults: boolean;
  readonly onResetResults: () => void;
  readonly results: ReactNode;
  readonly pagination?: CatalogListingPagination;
}

export function CatalogListingLayout({
  title,
  homeHref,
  count,
  live,
  sort,
  onSortChange,
  sidebar,
  filterBar,
  quickFilters,
  emptyResults,
  onResetResults,
  results,
  pagination,
}: CatalogListingLayoutProps) {
  return (
    <main className="catalog-page">
      <Container>
        <Breadcrumbs
          className="catalog-page__breadcrumbs"
          items={[{ label: 'Главная', href: homeHref }, { label: 'Каталог' }, { label: title }]}
        />

        <div className="catalog-page__layout">
          <header className="catalog-page__heading">
            <div className="catalog-page__heading-group">
              <h1 className="catalog-page__title">{title}</h1>
              <p aria-live={live ? 'polite' : undefined} className="catalog-page__count">
                {formatUnitCount(count)}
              </p>
            </div>

            <Select.Root onValueChange={onSortChange} value={sort}>
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
            {sidebar}
          </aside>

          <section aria-labelledby="catalog-results-title" className="catalog-page__results">
            <h2 className="ui-visually-hidden" id="catalog-results-title">
              Товары каталога
            </h2>
            <div className="catalog-page__filter-bar">{filterBar}</div>

            {quickFilters}

            {emptyResults ? (
              <EmptyState
                action={{ label: 'Сбросить фильтры', onClick: onResetResults }}
                headingLevel="h3"
                icon="search"
                message="По выбранным фильтрам товаров нет."
                title="Ничего не найдено"
              />
            ) : (
              results
            )}

            {pagination === undefined ? null : (
              <div className="catalog-page__pagination">
                <Pagination
                  label="Страницы каталога"
                  onChange={pagination.onChange}
                  page={pagination.page}
                  pageCount={pagination.pageCount}
                />
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}

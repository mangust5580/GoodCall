import { useState, useSyncExternalStore } from 'react';
import { Select } from 'radix-ui';

import productPhone from '../../assets/products/product-phone.svg';
import { formatPrice } from '../../commerce/format';
import { Container } from '../../components/layout';
import { ProductCard } from '../../components/product';
import { Button, Chip, Icon, Pagination } from '../../components/ui';
import type { CatalogCartSeam, CatalogProduct, CatalogSortValue } from '../catalog';
import { CATALOG_SORT_OPTIONS, sortCatalogProducts } from '../catalog';
import { SearchFilterDialog } from './SearchFilterDialog';
import { SearchFilters } from './SearchFilters';
import { SearchResultRow } from './SearchResultRow';
import {
  EMPTY_SEARCH_FILTERS,
  applySearchFilters,
  buildSearchFacetOptions,
  countActiveSearchFilters,
  sameSearchFilters,
  searchFiltersActive,
} from './searchFacets';
import type { SearchFilterState } from './searchFacets';
import {
  formatFoundCount,
  matchSearchProducts,
  searchPageCount,
  searchPageSlice,
} from './searchResults';

export interface SearchPageProps {
  readonly query: string;
  readonly products: readonly CatalogProduct[];
  readonly sort: CatalogSortValue;
  readonly page: number;
  readonly onSortChange: (sort: CatalogSortValue) => void;
  readonly onPageChange: (page: number) => void;
  readonly productHref?: (slug: string) => string | undefined;
  readonly homeHref: string;
  readonly catalogHref: string;
  readonly cart?: CatalogCartSeam;
}

const SORT_LABEL = 'Сортировка';
const FACETS_QUERY = '(min-width: 1024px)';

function subscribeToFacetsViewport(onChange: () => void): () => void {
  const query = window.matchMedia(FACETS_QUERY);

  query.addEventListener('change', onChange);

  return () => {
    query.removeEventListener('change', onChange);
  };
}

function readFacetsViewport(): boolean {
  return window.matchMedia(FACETS_QUERY).matches;
}

function readServerFacetsViewport(): boolean {
  return false;
}

export function SearchPage({
  query,
  products,
  sort,
  page,
  onSortChange,
  onPageChange,
  productHref,
  homeHref,
  catalogHref,
  cart,
}: SearchPageProps) {
  const facetsViewport = useSyncExternalStore(
    subscribeToFacetsViewport,
    readFacetsViewport,
    readServerFacetsViewport,
  );
  const [draftFilters, setDraftFilters] = useState<SearchFilterState>(EMPTY_SEARCH_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<SearchFilterState>(EMPTY_SEARCH_FILTERS);
  const [announcement, setAnnouncement] = useState('');
  const baseMatches = matchSearchProducts(products, query);
  const hasBaseMatches = baseMatches.length > 0;
  const faceted = facetsViewport && hasBaseMatches;
  const showFilterTrigger = !facetsViewport && hasBaseMatches;
  const facetOptions = buildSearchFacetOptions(baseMatches);
  const filtersApplied = hasBaseMatches && searchFiltersActive(appliedFilters, facetOptions);
  const filtered = hasBaseMatches
    ? applySearchFilters(baseMatches, appliedFilters, facetOptions)
    : baseMatches;
  const matches = sortCatalogProducts(filtered, sort);
  const pageCount = searchPageCount(matches.length);
  const currentPage = Math.min(page, pageCount);
  const visibleMatches = searchPageSlice(matches, currentPage);
  const hasQuery = query !== '';

  const returnToFirstPage = () => {
    if (page !== 1) {
      onPageChange(1);
    }
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    returnToFirstPage();
  };

  const applyDialogFilters = (next: SearchFilterState) => {
    setDraftFilters(next);
    setAppliedFilters(next);
    returnToFirstPage();
  };

  const addToCart = (product: CatalogProduct) => {
    if (cart === undefined) {
      return;
    }

    const lineQuantity = cart.add(product);
    setAnnouncement(
      `Товар добавлен в корзину: ${product.title}. В корзине: ${String(lineQuantity)} шт.`,
    );
  };

  const changeQuantity = (product: CatalogProduct, value: number) => {
    cart?.setQuantity(product, value);

    if (value === 0) {
      setAnnouncement(`Товар удалён из корзины: ${product.title}`);
    }
  };

  const resetFilters = () => {
    setDraftFilters(EMPTY_SEARCH_FILTERS);
    setAppliedFilters(EMPTY_SEARCH_FILTERS);
    returnToFirstPage();
  };

  const filteredEmpty = (
    <section aria-labelledby="search-filtered-empty-title" className="search-filtered-empty">
      <span className="search-empty__visual">
        <Icon className="search-empty__icon" name="search" />
      </span>
      <h2 className="search-empty__title" id="search-filtered-empty-title">
        Ничего не найдено
      </h2>
      <p className="search-empty__message">По текущему запросу и выбранным фильтрам товаров нет.</p>
      <Button className="search-filtered-empty__reset" onClick={resetFilters}>
        Сбросить фильтры
      </Button>
    </section>
  );

  const resultList = (
    <>
      <ul aria-label="Найденные товары" className="search-results">
        {visibleMatches.map((product) => (
          <li key={product.id}>
            <ProductCard
              badge={
                product.badge === undefined ? undefined : (
                  <Chip variant={product.discounted === true ? 'danger' : 'brand'}>
                    {product.badge}
                  </Chip>
                )
              }
              disabled={cart === undefined}
              href={productHref?.(product.id)}
              image={product.image}
              imageAlt={product.imageAlt}
              imageSrc={product.imageSrc ?? productPhone}
              layout="horizontal"
              oldPrice={
                product.oldPriceValue === undefined ? undefined : formatPrice(product.oldPriceValue)
              }
              onAddToCart={() => {
                addToCart(product);
              }}
              allowZeroQuantity
              onQuantityChange={
                cart?.quantityOf(product) === undefined
                  ? undefined
                  : (value) => {
                      changeQuantity(product, value);
                    }
              }
              price={formatPrice(product.priceValue)}
              quantity={cart?.quantityOf(product)}
              rating={product.rating}
              reviewCount={product.reviewCount}
              title={product.title}
            />
          </li>
        ))}
      </ul>

      {pageCount > 1 ? (
        <div className="search-page__pagination">
          <Pagination
            label="Страницы результатов поиска"
            onChange={onPageChange}
            page={currentPage}
            pageCount={pageCount}
          />
        </div>
      ) : null}
    </>
  );

  return (
    <main className="search-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="search-page__breadcrumbs">
          <ol className="search-page__crumbs">
            <li className="search-page__crumb">
              <a className="search-page__crumb-link" href={homeHref}>
                Главная
              </a>
            </li>
            <li aria-current="page" className="search-page__crumb">
              Поиск
            </li>
          </ol>
        </nav>

        <header className="search-page__heading">
          <div className="search-page__heading-group">
            <h1 className="search-page__title">Результаты поиска</h1>
            {matches.length > 0 ? (
              <p className="search-page__summary">
                По запросу <span className="search-page__query">«{query}»</span>{' '}
                {filtersApplied ? 'с выбранными фильтрами ' : null}
                {formatFoundCount(matches.length)}
              </p>
            ) : null}
          </div>

          {showFilterTrigger || matches.length > 0 ? (
            <div className="search-page__controls">
              {showFilterTrigger ? (
                <SearchFilterDialog
                  activeCount={countActiveSearchFilters(appliedFilters, facetOptions)}
                  applied={appliedFilters}
                  onApply={applyDialogFilters}
                  options={facetOptions}
                />
              ) : null}
              {matches.length > 0 ? (
                <Select.Root onValueChange={onSortChange} value={sort}>
                  <Select.Trigger
                    aria-label={SORT_LABEL}
                    className="ui-input ui-input--select-trigger search-page__sort"
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
              ) : null}
            </div>
          ) : null}
        </header>

        {faceted ? (
          <div className="search-workspace">
            <SearchFilters
              applyDisabled={sameSearchFilters(draftFilters, appliedFilters, facetOptions)}
              draft={draftFilters}
              onApply={applyFilters}
              onDraftChange={setDraftFilters}
              onReset={resetFilters}
              options={facetOptions}
              resetDisabled={
                !searchFiltersActive(draftFilters, facetOptions) &&
                !searchFiltersActive(appliedFilters, facetOptions)
              }
            />

            <div className="search-workspace__results">
              {matches.length > 0 ? (
                <>
                  <ul aria-label="Найденные товары" className="search-rows">
                    {visibleMatches.map((product) => (
                      <li key={product.id}>
                        <SearchResultRow
                          disabled={cart === undefined}
                          href={productHref?.(product.id)}
                          onAddToCart={() => {
                            addToCart(product);
                          }}
                          onQuantityChange={(value) => {
                            changeQuantity(product, value);
                          }}
                          product={product}
                          quantity={cart?.quantityOf(product)}
                        />
                      </li>
                    ))}
                  </ul>

                  {pageCount > 1 ? (
                    <div className="search-workspace__pagination">
                      <Pagination
                        label="Страницы результатов поиска"
                        onChange={onPageChange}
                        page={currentPage}
                        pageCount={pageCount}
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                filteredEmpty
              )}
            </div>
          </div>
        ) : matches.length > 0 ? (
          resultList
        ) : hasBaseMatches ? (
          filteredEmpty
        ) : (
          <section aria-labelledby="search-empty-title" className="search-empty">
            <span className="search-empty__visual">
              <Icon className="search-empty__icon" name="search" />
            </span>
            <h2 className="search-empty__title" id="search-empty-title">
              {hasQuery ? 'Ничего не найдено' : 'Введите запрос'}
            </h2>
            <p className="search-empty__message">
              {hasQuery ? (
                <>
                  По запросу <span className="search-page__query">«{query}»</span> ничего не
                  найдено. Проверьте написание или попробуйте другой запрос в строке поиска.
                </>
              ) : (
                'Воспользуйтесь строкой поиска в шапке сайта, чтобы найти товары.'
              )}
            </p>
            <div className="search-empty__actions">
              <a className="ui-button ui-button--primary search-empty__action" href={catalogHref}>
                Перейти в каталог
              </a>
              <a className="ui-button ui-button--secondary search-empty__action" href={homeHref}>
                На главную
              </a>
            </div>
          </section>
        )}
      </Container>
      <p className="ui-visually-hidden" role="status">
        {announcement}
      </p>
    </main>
  );
}

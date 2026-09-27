import { Select } from 'radix-ui';

import productPhone from '../../assets/products/product-phone.svg';
import { Container } from '../../components/layout';
import { ProductCard } from '../../components/product';
import { Chip, Icon, Pagination } from '../../components/ui';
import { CATALOG_SORT_OPTIONS, sortCatalogProducts } from '../catalog/catalogProductFixtures';
import type { CatalogProduct, CatalogSortValue } from '../catalog/catalogProductFixtures';
import {
  formatFoundCount,
  formatSearchPrice,
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
}

const SORT_LABEL = 'Сортировка';

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
}: SearchPageProps) {
  const matches = sortCatalogProducts(matchSearchProducts(products, query), sort);
  const pageCount = searchPageCount(matches.length);
  const currentPage = Math.min(page, pageCount);
  const visibleMatches = searchPageSlice(matches, currentPage);
  const hasQuery = query !== '';

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
                {formatFoundCount(matches.length)}
              </p>
            ) : null}
          </div>

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
        </header>

        {matches.length > 0 ? (
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
                    href={productHref?.(product.id)}
                    imageAlt={product.imageAlt}
                    imageSrc={product.imageSrc ?? productPhone}
                    layout="horizontal"
                    oldPrice={
                      product.oldPriceValue === undefined
                        ? undefined
                        : formatSearchPrice(product.oldPriceValue)
                    }
                    price={formatSearchPrice(product.priceValue)}
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
    </main>
  );
}

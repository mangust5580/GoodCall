import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { RouteStatus } from '../../components/feedback';
import { DEFAULT_CATALOG_SORT, fetchCatalogProducts } from '../../pages/catalog';
import type { CatalogProduct, CatalogSortValue } from '../../pages/catalog';
import {
  SearchPage,
  normalizeSearchQuery,
  parseSearchPage,
  parseSearchSort,
} from '../../pages/search';
import { ProductionShell } from '../ProductionShell';
import {
  CATALOG_SMARTPHONES_PATH,
  HOME_PATH,
  SEARCH_QUERY_PARAM,
  hashHref,
  productDetailsHref,
} from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';
import { useCatalogCartSeam } from './useCatalogCartSeam';

const SORT_PARAM = 'sort';
const PAGE_PARAM = 'page';

type SearchRead =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly products: readonly CatalogProduct[] }
  | { readonly status: 'failure' };

function SearchLoading() {
  return <RouteStatus kind="loading" message="Загружаем товары…" />;
}

function SearchFailure({ onRetry }: { readonly onRetry: () => void }) {
  return (
    <RouteStatus
      actions={
        <>
          <button className="ui-button ui-button--primary" onClick={onRetry} type="button">
            Повторить
          </button>
          <Link className="ui-button ui-button--secondary" to={HOME_PATH}>
            На главную
          </Link>
        </>
      }
      kind="failure"
      message="Не удалось выполнить поиск. Попробуйте ещё раз."
      title="Товары временно недоступны"
    />
  );
}

export function SearchRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [read, setRead] = useState<SearchRead>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const products = read.status === 'ready' ? read.products : undefined;
  const cart = useCatalogCartSeam(products !== undefined);
  const query = normalizeSearchQuery(searchParams.get(SEARCH_QUERY_PARAM) ?? '');
  const sort = parseSearchSort(searchParams.get(SORT_PARAM)) ?? DEFAULT_CATALOG_SORT;
  const page = parseSearchPage(searchParams.get(PAGE_PARAM));
  useDocumentTitle(
    read.status === 'failure'
      ? 'Товары временно недоступны'
      : query === ''
        ? 'Результаты поиска'
        : `Результаты поиска «${query}»`,
  );

  useEffect(() => {
    let mounted = true;

    void fetchCatalogProducts('smartphones').then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setRead({ status: 'ready', products: result.products });
        return;
      }

      if (import.meta.env.DEV) {
        console.warn('Search catalog read failed', result.reason);
      }

      setRead({ status: 'failure' });
    });

    return () => {
      mounted = false;
    };
  }, [attempt]);

  const handleRetry = () => {
    setRead({ status: 'loading' });
    setAttempt((current) => current + 1);
  };

  const handleSortChange = (nextSort: CatalogSortValue) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (nextSort === DEFAULT_CATALOG_SORT) {
        next.delete(SORT_PARAM);
      } else {
        next.set(SORT_PARAM, nextSort);
      }

      next.delete(PAGE_PARAM);

      return next;
    });
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (nextPage <= 1) {
        next.delete(PAGE_PARAM);
      } else {
        next.set(PAGE_PARAM, String(nextPage));
      }

      return next;
    });
  };

  return (
    <ProductionShell>
      {read.status === 'loading' ? <SearchLoading /> : null}
      {read.status === 'failure' ? <SearchFailure onRetry={handleRetry} /> : null}
      {products === undefined ? null : (
        <SearchPage
          key={query}
          cart={cart}
          catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
          homeHref={hashHref(HOME_PATH)}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          page={page}
          productHref={productDetailsHref}
          products={products}
          query={query}
          sort={sort}
        />
      )}
    </ProductionShell>
  );
}

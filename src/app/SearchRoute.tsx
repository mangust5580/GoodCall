import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchCatalogProducts } from '../pages/catalog/catalogProductData';
import { CATALOG_PRODUCTS, DEFAULT_CATALOG_SORT } from '../pages/catalog/catalogProductFixtures';
import type { CatalogProduct, CatalogSortValue } from '../pages/catalog/catalogProductFixtures';
import { SearchPage } from '../pages/search';
import {
  normalizeSearchQuery,
  parseSearchPage,
  parseSearchSort,
} from '../pages/search/searchResults';
import { ProductionShell } from './ProductionShell';
import {
  CATALOG_SMARTPHONES_PATH,
  HOME_PATH,
  SEARCH_QUERY_PARAM,
  hashHref,
  productDetailsHref,
} from './routes';

const SORT_PARAM = 'sort';
const PAGE_PARAM = 'page';

export function SearchRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<readonly CatalogProduct[]>();
  const query = normalizeSearchQuery(searchParams.get(SEARCH_QUERY_PARAM) ?? '');
  const sort = parseSearchSort(searchParams.get(SORT_PARAM)) ?? DEFAULT_CATALOG_SORT;
  const page = parseSearchPage(searchParams.get(PAGE_PARAM));

  useEffect(() => {
    let mounted = true;

    void fetchCatalogProducts().then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setProducts(result.products);
      } else if (result.status === 'failure' && import.meta.env.DEV) {
        console.warn('Search Supabase fallback', result.reason);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

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
      <SearchPage
        key={query}
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        homeHref={hashHref(HOME_PATH)}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        page={page}
        productHref={products === undefined ? undefined : productDetailsHref}
        products={products ?? CATALOG_PRODUCTS}
        query={query}
        sort={sort}
      />
    </ProductionShell>
  );
}

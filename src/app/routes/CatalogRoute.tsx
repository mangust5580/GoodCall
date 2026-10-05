import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  CatalogPage,
  buildCatalogLiveFacets,
  fetchCatalogProducts,
  parseCatalogUrlState,
  serializeCatalogUrlState,
} from '../../pages/catalog';
import type { CatalogAppliedState, CatalogHistoryMode, CatalogProduct } from '../../pages/catalog';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH, hashHref, productDetailsHref } from '../routePaths';
import { useCatalogCartSeam } from './useCatalogCartSeam';
import { useCatalogCompareSeam } from './useCatalogCompareSeam';
import { useCatalogFavoritesSeam } from './useCatalogFavoritesSeam';

export function CatalogRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<readonly CatalogProduct[]>();
  const facets = useMemo(
    () => (products === undefined ? undefined : buildCatalogLiveFacets(products)),
    [products],
  );
  const applied = facets === undefined ? undefined : parseCatalogUrlState(searchParams, facets);
  const cart = useCatalogCartSeam(products !== undefined);
  const favorites = useCatalogFavoritesSeam(products !== undefined);
  const compare = useCatalogCompareSeam(products !== undefined);

  useEffect(() => {
    let mounted = true;

    void fetchCatalogProducts().then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setProducts(result.products);
      } else if (result.status === 'failure' && import.meta.env.DEV) {
        console.warn('Catalog Supabase fallback', result.reason);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleAppliedChange = (next: CatalogAppliedState, history: CatalogHistoryMode) => {
    const serialized = serializeCatalogUrlState(next, searchParams);

    if (serialized.toString() === searchParams.toString()) {
      return;
    }

    setSearchParams(serialized, { replace: history === 'replace' });
  };

  return (
    <ProductionShell>
      <CatalogPage
        applied={applied}
        cart={cart}
        compare={compare}
        favorites={favorites}
        homeHref={hashHref(HOME_PATH)}
        mode={products === undefined ? 'specimen' : 'live'}
        onAppliedChange={applied === undefined ? undefined : handleAppliedChange}
        productHref={products === undefined ? undefined : productDetailsHref}
        products={products}
      />
    </ProductionShell>
  );
}

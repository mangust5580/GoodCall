import { useEffect, useState } from 'react';

import { CatalogPage, fetchCatalogProducts } from '../../pages/catalog';
import type { CatalogProduct } from '../../pages/catalog';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH, hashHref, productDetailsHref } from '../routePaths';
import { useCatalogCartSeam } from './useCatalogCartSeam';
import { useCatalogCompareSeam } from './useCatalogCompareSeam';
import { useCatalogFavoritesSeam } from './useCatalogFavoritesSeam';

export function CatalogRoute() {
  const [products, setProducts] = useState<readonly CatalogProduct[]>();
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

  return (
    <ProductionShell>
      <CatalogPage
        cart={cart}
        compare={compare}
        favorites={favorites}
        homeHref={hashHref(HOME_PATH)}
        mode={products === undefined ? 'specimen' : 'live'}
        productHref={products === undefined ? undefined : productDetailsHref}
        products={products}
      />
    </ProductionShell>
  );
}

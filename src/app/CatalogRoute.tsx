import { useEffect, useState } from 'react';

import { CatalogPage } from '../pages/catalog';
import type { CatalogProduct } from '../pages/catalog/catalogProductFixtures';
import { fetchCatalogProducts } from '../pages/catalog/catalogProductData';
import { ProductionShell } from './ProductionShell';
import { HOME_PATH, hashHref, productDetailsHref } from './routes';
import { useCatalogCartSeam } from './useCatalogCartSeam';
import { useCatalogFavoritesSeam } from './useCatalogFavoritesSeam';

export function CatalogRoute() {
  const [products, setProducts] = useState<readonly CatalogProduct[]>();
  const cart = useCatalogCartSeam(products !== undefined);
  const favorites = useCatalogFavoritesSeam(products !== undefined);

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
        favorites={favorites}
        homeHref={hashHref(HOME_PATH)}
        productHref={products === undefined ? undefined : productDetailsHref}
        products={products}
      />
    </ProductionShell>
  );
}

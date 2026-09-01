import { useEffect, useState } from 'react';

import { CatalogPage } from '../pages/catalog';
import type { CatalogProduct } from '../pages/catalog/catalogProductFixtures';
import { fetchCatalogProducts } from '../pages/catalog/catalogProductData';
import { ProductionShell } from './ProductionShell';
import { HOME_PATH, hashHref } from './routes';

export function CatalogRoute() {
  const [products, setProducts] = useState<readonly CatalogProduct[]>();

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
      <CatalogPage homeHref={hashHref(HOME_PATH)} products={products} />
    </ProductionShell>
  );
}

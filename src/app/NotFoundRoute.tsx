import { useEffect, useState } from 'react';

import { NotFoundPage } from '../pages/not-found';
import { fetchHomeData } from '../pages/home/homeData';
import { HOME_PRODUCTS } from '../pages/home/homeFixtures';
import type { HomeProduct } from '../pages/home/homeFixtures';
import { ProductionShell } from './ProductionShell';
import {
  CART_PATH,
  CATALOG_SMARTPHONES_PATH,
  HOME_PATH,
  hashHref,
  productDetailsHref,
  searchPath,
} from './routes';
import { useSearchNavigation } from './useSearchNavigation';

const SHORTCUT_TARGETS = {
  smartphones: hashHref(CATALOG_SMARTPHONES_PATH),
  iphoneSearch: hashHref(searchPath('iPhone')),
  samsungSearch: hashHref(searchPath('Samsung')),
  cart: hashHref(CART_PATH),
};

export function NotFoundRoute() {
  const handleSearchSubmit = useSearchNavigation();
  const [products, setProducts] = useState<readonly HomeProduct[]>();

  useEffect(() => {
    let mounted = true;

    void fetchHomeData().then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setProducts(result.products);
      } else if (result.status === 'failure' && import.meta.env.DEV) {
        console.warn('Not found recommendations fallback', result.reason);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ProductionShell>
      <NotFoundPage
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        homeHref={hashHref(HOME_PATH)}
        onSearchSubmit={handleSearchSubmit}
        productHref={products === undefined ? undefined : productDetailsHref}
        products={products ?? HOME_PRODUCTS}
        shortcutTargets={SHORTCUT_TARGETS}
      />
    </ProductionShell>
  );
}

import { useEffect, useState } from 'react';

import { HomePage, fetchHomeData } from '../../pages/home';
import type { HomeCategoryTile, HomeProduct } from '../../pages/home';
import { ProductionShell } from '../ProductionShell';
import { CATALOG_SMARTPHONES_PATH, productDetailsHref } from '../routePaths';
import { useHomeCartSeam } from './useHomeCartSeam';

interface HomeRouteData {
  readonly categories: readonly HomeCategoryTile[];
  readonly products: readonly HomeProduct[];
}

export function HomeRoute() {
  const [homeData, setHomeData] = useState<HomeRouteData>();
  const cart = useHomeCartSeam(homeData !== undefined);

  useEffect(() => {
    let mounted = true;

    void fetchHomeData().then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setHomeData({ categories: result.categories, products: result.products });
      } else if (result.status === 'failure' && import.meta.env.DEV) {
        console.warn('Home Supabase fallback', result.reason);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ProductionShell>
      <HomePage
        cart={cart}
        categories={homeData?.categories}
        productHref={homeData === undefined ? undefined : productDetailsHref}
        products={homeData?.products}
        smartphonesPath={CATALOG_SMARTPHONES_PATH}
      />
    </ProductionShell>
  );
}

import { useEffect, useState } from 'react';

import { HomePage } from '../pages/home';
import { fetchHomeData } from '../pages/home/homeData';
import type { HomeCategoryTile, HomeProduct } from '../pages/home/homeFixtures';
import { ProductionShell } from './ProductionShell';
import { CATALOG_SMARTPHONES_PATH } from './routes';

interface HomeRouteData {
  readonly categories: readonly HomeCategoryTile[];
  readonly products: readonly HomeProduct[];
}

export function HomeRoute() {
  const [homeData, setHomeData] = useState<HomeRouteData>();

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
        categories={homeData?.categories}
        products={homeData?.products}
        smartphonesPath={CATALOG_SMARTPHONES_PATH}
      />
    </ProductionShell>
  );
}

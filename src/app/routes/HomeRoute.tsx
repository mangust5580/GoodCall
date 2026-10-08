import { useEffect, useState } from 'react';

import { HomePage, fetchHomeData } from '../../pages/home';
import type { HomeCategoryTile, HomeProduct } from '../../pages/home';
import { ProductionShell } from '../ProductionShell';
import {
  BLOG_PATH,
  CATALOG_LAPTOPS_PATH,
  CATALOG_SMARTPHONES_PATH,
  productDetailsHref,
} from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';
import { useHomeCartSeam } from './useHomeCartSeam';

interface HomeRouteData {
  readonly categories: readonly HomeCategoryTile[];
  readonly products: readonly HomeProduct[];
}

export function HomeRoute() {
  const [homeData, setHomeData] = useState<HomeRouteData>();
  const cart = useHomeCartSeam(homeData !== undefined);
  useDocumentTitle('Главная');

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
        articlesPath={BLOG_PATH}
        cart={cart}
        categories={homeData?.categories}
        laptopsPath={CATALOG_LAPTOPS_PATH}
        productHref={homeData === undefined ? undefined : productDetailsHref}
        products={homeData?.products}
        smartphonesPath={CATALOG_SMARTPHONES_PATH}
      />
    </ProductionShell>
  );
}

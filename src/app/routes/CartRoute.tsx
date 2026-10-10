import { useEffect, useState } from 'react';

import { useCartLines } from '../../commerce/cart';
import { CartPage } from '../../pages/cart';
import { HOME_PRODUCTS, fetchHomeData } from '../../pages/home';
import type { HomeProduct } from '../../pages/home';
import { ProductionShell } from '../ProductionShell';
import {
  CATALOG_SMARTPHONES_PATH,
  CHECKOUT_PATH,
  HOME_PATH,
  hashHref,
  productDetailsHref,
} from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';

export function CartRoute() {
  const cart = useCartLines();
  const [products, setProducts] = useState<readonly HomeProduct[]>();
  useDocumentTitle('Корзина');

  useEffect(() => {
    let mounted = true;

    void fetchHomeData().then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setProducts(result.products);
      } else if (result.status === 'failure' && import.meta.env.DEV) {
        console.warn('Cart recommendations fallback', result.reason);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ProductionShell>
      <CartPage
        cart={cart}
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        checkoutHref={hashHref(CHECKOUT_PATH)}
        homeHref={hashHref(HOME_PATH)}
        productHref={products === undefined ? undefined : productDetailsHref}
        recommendations={products ?? HOME_PRODUCTS}
      />
    </ProductionShell>
  );
}

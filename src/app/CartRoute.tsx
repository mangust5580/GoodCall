import { CartPage } from '../pages/cart';
import { useCartLines } from '../pages/cart/useCartLines';
import { ProductionShell } from './ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref } from './routes';

export function CartRoute() {
  const cart = useCartLines();

  return (
    <ProductionShell>
      <CartPage
        cart={cart}
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        homeHref={hashHref(HOME_PATH)}
      />
    </ProductionShell>
  );
}

import { CartPage } from '../pages/cart';
import { CART_SEED_LINES } from '../pages/cart/cartFixtures';
import { cartUnitCount } from '../pages/cart/cartPricing';
import { useCartLines } from '../pages/cart/useCartLines';
import { ProductionShell } from './ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref } from './routes';

export function CartRoute() {
  const cart = useCartLines(CART_SEED_LINES);

  return (
    <ProductionShell cartCount={cartUnitCount(cart.lines)}>
      <CartPage
        cart={cart}
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        homeHref={hashHref(HOME_PATH)}
      />
    </ProductionShell>
  );
}

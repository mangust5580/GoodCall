import { CartPage } from '../pages/cart';
import { ProductionShell } from './ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref } from './routes';

const EMPTY_CART_COUNT = 0;

export function CartRoute() {
  return (
    <ProductionShell cartCount={EMPTY_CART_COUNT}>
      <CartPage catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)} homeHref={hashHref(HOME_PATH)} />
    </ProductionShell>
  );
}

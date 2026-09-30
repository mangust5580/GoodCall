import { DEMO_STORES, StoresPage } from '../pages/stores';
import { ProductionShell } from './ProductionShell';
import { HOME_PATH, hashHref } from './routes';

export function ShopsRoute() {
  return (
    <ProductionShell>
      <StoresPage homeHref={hashHref(HOME_PATH)} stores={DEMO_STORES} />
    </ProductionShell>
  );
}

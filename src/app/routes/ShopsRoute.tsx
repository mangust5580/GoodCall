import { DEMO_STORES } from '../../commerce/shops';
import { StoresPage } from '../../pages/stores';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH, hashHref } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';

export function ShopsRoute() {
  useDocumentTitle('Магазины');

  return (
    <ProductionShell>
      <StoresPage homeHref={hashHref(HOME_PATH)} stores={DEMO_STORES} />
    </ProductionShell>
  );
}

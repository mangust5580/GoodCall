import { CatalogPage } from '../pages/catalog';
import { ProductionShell } from './ProductionShell';
import { HOME_PATH, hashHref } from './routes';

export function CatalogRoute() {
  return (
    <ProductionShell>
      <CatalogPage homeHref={hashHref(HOME_PATH)} />
    </ProductionShell>
  );
}

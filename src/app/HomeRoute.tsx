import { HomePage } from '../pages/home';
import { ProductionShell } from './ProductionShell';
import { CATALOG_SMARTPHONES_PATH } from './routes';

export function HomeRoute() {
  return (
    <ProductionShell>
      <HomePage smartphonesPath={CATALOG_SMARTPHONES_PATH} />
    </ProductionShell>
  );
}

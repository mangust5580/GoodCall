import { useState } from 'react';

import { OrderConfirmationPage, readDemoOrder } from '../../pages/order-confirmation';
import { ProductionShell } from '../ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';

export function OrderConfirmationRoute() {
  const [order] = useState(() => readDemoOrder());
  useDocumentTitle(order === undefined ? 'Заказ не найден' : 'Заказ оформлен');

  return (
    <ProductionShell>
      <OrderConfirmationPage
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        homeHref={hashHref(HOME_PATH)}
        order={order}
      />
    </ProductionShell>
  );
}

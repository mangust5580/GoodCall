import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  createDaDataAddressClient,
  createDaDataCityClient,
  isCityLookupConfigured,
  readStoredCity,
} from '../components/location';
import { cartTotals } from '../pages/cart/cartPricing';
import { removeSelectedCartLines } from '../pages/cart/cartStore';
import { CheckoutPage } from '../pages/checkout';
import type { CheckoutFormState } from '../pages/checkout/checkoutFormModel';
import { createDemoOrder, saveDemoOrder } from '../pages/order-confirmation';
import { useCartLineList } from '../pages/cart/useCartLines';
import { ProductionShell } from './ProductionShell';
import { CART_PATH, HOME_PATH, ORDER_CONFIRMATION_PATH, hashHref } from './routes';

export function CheckoutRoute() {
  const lines = useCartLineList();
  const [initialCity] = useState(() => readStoredCity());
  const cityLookupClient = useMemo(() => createDaDataCityClient(), []);
  const addressLookupClient = useMemo(() => createDaDataAddressClient(), []);
  const addressLookupConfigured = isCityLookupConfigured();
  const navigate = useNavigate();

  const placeOrder = (form: CheckoutFormState) => {
    saveDemoOrder(
      createDemoOrder({
        form,
        lines: lines.filter((line) => line.selected),
        totals: cartTotals(lines),
        now: new Date(),
      }),
    );
    removeSelectedCartLines();
    void navigate(ORDER_CONFIRMATION_PATH, { replace: true });
  };

  useEffect(() => {
    if (import.meta.env.DEV && !addressLookupConfigured) {
      console.info(
        'Checkout address lookup is off: VITE_DADATA_TOKEN is not set, so the address form uses manual entry.',
      );
    }
  }, [addressLookupConfigured]);

  return (
    <ProductionShell>
      <CheckoutPage
        cartHref={hashHref(CART_PATH)}
        homeHref={hashHref(HOME_PATH)}
        addressLookupClient={addressLookupClient}
        addressLookupConfigured={addressLookupConfigured}
        cityLookupClient={cityLookupClient}
        initialCity={initialCity}
        lines={lines}
        onPlaceOrder={placeOrder}
      />
    </ProductionShell>
  );
}

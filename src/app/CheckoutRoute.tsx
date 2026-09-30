import { useEffect, useMemo, useState } from 'react';

import {
  createDaDataAddressClient,
  createDaDataCityClient,
  isCityLookupConfigured,
  readStoredCity,
} from '../components/location';
import { CheckoutPage } from '../pages/checkout';
import { useCartLineList } from '../pages/cart/useCartLines';
import { ProductionShell } from './ProductionShell';
import { CART_PATH, HOME_PATH, hashHref } from './routes';

export function CheckoutRoute() {
  const lines = useCartLineList();
  const [initialCity] = useState(() => readStoredCity());
  const cityLookupClient = useMemo(() => createDaDataCityClient(), []);
  const addressLookupClient = useMemo(() => createDaDataAddressClient(), []);
  const addressLookupConfigured = isCityLookupConfigured();

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
      />
    </ProductionShell>
  );
}

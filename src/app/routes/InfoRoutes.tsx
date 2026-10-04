import {
  ContactsPage,
  DeliveryPage,
  FaqPage,
  OfferPage,
  PrivacyPage,
  TermsPage,
  WarrantyPage,
} from '../../pages/info';
import type { InfoLinks } from '../../pages/info';
import { ProductionShell } from '../ProductionShell';
import {
  CART_PATH,
  CATALOG_SMARTPHONES_PATH,
  COMPARE_PATH,
  CONTACTS_PATH,
  DELIVERY_PATH,
  FAQ_PATH,
  FAVORITES_PATH,
  HOME_PATH,
  OFFER_PATH,
  PRIVACY_PATH,
  SHOPS_PATH,
  TERMS_PATH,
  WARRANTY_PATH,
  hashHref,
} from '../routePaths';

const INFO_LINKS: InfoLinks = {
  home: hashHref(HOME_PATH),
  delivery: hashHref(DELIVERY_PATH),
  warranty: hashHref(WARRANTY_PATH),
  faq: hashHref(FAQ_PATH),
  shops: hashHref(SHOPS_PATH),
  cart: hashHref(CART_PATH),
  catalog: hashHref(CATALOG_SMARTPHONES_PATH),
  compare: hashHref(COMPARE_PATH),
  favorites: hashHref(FAVORITES_PATH),
  contacts: hashHref(CONTACTS_PATH),
  privacy: hashHref(PRIVACY_PATH),
  terms: hashHref(TERMS_PATH),
  offer: hashHref(OFFER_PATH),
};

export function DeliveryRoute() {
  return (
    <ProductionShell>
      <DeliveryPage links={INFO_LINKS} />
    </ProductionShell>
  );
}

export function WarrantyRoute() {
  return (
    <ProductionShell>
      <WarrantyPage links={INFO_LINKS} />
    </ProductionShell>
  );
}

export function FaqRoute() {
  return (
    <ProductionShell>
      <FaqPage links={INFO_LINKS} />
    </ProductionShell>
  );
}

export function ContactsRoute() {
  return (
    <ProductionShell>
      <ContactsPage links={INFO_LINKS} />
    </ProductionShell>
  );
}

export function PrivacyRoute() {
  return (
    <ProductionShell>
      <PrivacyPage links={INFO_LINKS} />
    </ProductionShell>
  );
}

export function TermsRoute() {
  return (
    <ProductionShell>
      <TermsPage links={INFO_LINKS} />
    </ProductionShell>
  );
}

export function OfferRoute() {
  return (
    <ProductionShell>
      <OfferPage links={INFO_LINKS} />
    </ProductionShell>
  );
}

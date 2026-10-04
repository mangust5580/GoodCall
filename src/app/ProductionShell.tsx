import type { ReactNode } from 'react';

import { useCartUnitCount } from '../commerce/cart';
import { useCompareCount } from '../commerce/compare';
import { useFavoritesCount } from '../commerce/favorites';
import { STOREFRONT_PAYMENT_MARKS, STOREFRONT_SUPPORT } from '../commerce/storefront';
import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import {
  ABOUT_PATH,
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
} from './routePaths';
import { useSearchNavigation } from './useSearchNavigation';

import './ProductionShell.scss';

const CONTACTS_HREF = hashHref(CONTACTS_PATH);
const SUPPORT_LABEL = 'Поддержка';

const FOOTER_HELP_LINKS = {
  delivery: hashHref(DELIVERY_PATH),
  warranty: hashHref(WARRANTY_PATH),
  faq: hashHref(FAQ_PATH),
  contacts: CONTACTS_HREF,
  support: CONTACTS_HREF,
};

const FOOTER_COMPANY_LINKS = {
  about: hashHref(ABOUT_PATH),
};

const FOOTER_LEGAL_LINKS = {
  privacy: hashHref(PRIVACY_PATH),
  terms: hashHref(TERMS_PATH),
  offer: hashHref(OFFER_PATH),
};

const FOOTER_PAYMENT_MARKS = STOREFRONT_PAYMENT_MARKS.map((mark) => ({
  name: mark.alt,
  src: mark.src,
  modifier: mark.modifier,
}));

interface ProductionShellProps {
  readonly children: ReactNode;
}

export function ProductionShell({ children }: ProductionShellProps) {
  const cartCount = useCartUnitCount();
  const favoritesCount = useFavoritesCount();
  const comparisonCount = useCompareCount();
  const handleSearchSubmit = useSearchNavigation();
  const home = hashHref(HOME_PATH);
  const cart = hashHref(CART_PATH);
  const favorites = hashHref(FAVORITES_PATH);
  const comparison = hashHref(COMPARE_PATH);

  return (
    <div className="production-shell">
      <SiteHeader
        cartCount={cartCount}
        cartHref={cart}
        comparisonCount={comparisonCount}
        comparisonHref={comparison}
        favoritesCount={favoritesCount}
        favoritesHref={favorites}
        homeHref={home}
        onSearchSubmit={handleSearchSubmit}
        smartphonesHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        storesHref={hashHref(SHOPS_PATH)}
        supportHref={CONTACTS_HREF}
        supportLabel={SUPPORT_LABEL}
      />
      {children}
      <NewsletterBand />
      <SiteFooter
        helpLinks={FOOTER_HELP_LINKS}
        homeHref={home}
        companyLinks={FOOTER_COMPANY_LINKS}
        legalLinks={FOOTER_LEGAL_LINKS}
        paymentMarks={FOOTER_PAYMENT_MARKS}
        support={STOREFRONT_SUPPORT}
        supportLabel={SUPPORT_LABEL}
      />
      <MobileActionBar
        cartCount={cartCount}
        cartHref={cart}
        comparisonCount={comparisonCount}
        comparisonHref={comparison}
        favoritesCount={favoritesCount}
        favoritesHref={favorites}
      />
    </div>
  );
}

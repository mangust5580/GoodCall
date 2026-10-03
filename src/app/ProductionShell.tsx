import type { ReactNode } from 'react';

import { useCartUnitCount } from '../commerce/cart';
import { useCompareCount } from '../commerce/compare';
import { useFavoritesCount } from '../commerce/favorites';
import { STOREFRONT_PAYMENT_MARKS, STOREFRONT_SUPPORT } from '../commerce/storefront';
import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import {
  CART_PATH,
  COMPARE_PATH,
  DELIVERY_PATH,
  FAQ_PATH,
  FAVORITES_PATH,
  HOME_PATH,
  SHOPS_PATH,
  WARRANTY_PATH,
  hashHref,
} from './routePaths';
import { useSearchNavigation } from './useSearchNavigation';

import './ProductionShell.scss';

const FOOTER_HELP_LINKS = {
  delivery: hashHref(DELIVERY_PATH),
  warranty: hashHref(WARRANTY_PATH),
  faq: hashHref(FAQ_PATH),
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
        storesHref={hashHref(SHOPS_PATH)}
      />
      {children}
      <NewsletterBand />
      <SiteFooter
        helpLinks={FOOTER_HELP_LINKS}
        homeHref={home}
        paymentMarks={FOOTER_PAYMENT_MARKS}
        support={STOREFRONT_SUPPORT}
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

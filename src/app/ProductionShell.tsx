import type { ReactNode } from 'react';

import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { useCartUnitCount } from '../pages/cart/useCartLines';
import { useCompareCount } from '../pages/compare/useCompare';
import { useFavoritesCount } from '../pages/favorites/useFavorites';
import { CART_PATH, COMPARE_PATH, FAVORITES_PATH, HOME_PATH, SHOPS_PATH, hashHref } from './routes';
import { useSearchNavigation } from './useSearchNavigation';

import './ProductionShell.scss';

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
      <SiteFooter homeHref={home} />
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

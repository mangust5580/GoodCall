import type { ReactNode } from 'react';

import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { useCartUnitCount } from '../pages/cart/useCartLines';
import { useFavoritesCount } from '../pages/favorites/useFavorites';
import { CART_PATH, FAVORITES_PATH, HOME_PATH, SHOPS_PATH, hashHref } from './routes';
import { useSearchNavigation } from './useSearchNavigation';

import './ProductionShell.scss';

interface ProductionShellProps {
  readonly children: ReactNode;
}

const COMPARISON_COUNT = 3;

export function ProductionShell({ children }: ProductionShellProps) {
  const cartCount = useCartUnitCount();
  const favoritesCount = useFavoritesCount();
  const handleSearchSubmit = useSearchNavigation();
  const home = hashHref(HOME_PATH);
  const cart = hashHref(CART_PATH);
  const favorites = hashHref(FAVORITES_PATH);

  return (
    <div className="production-shell">
      <SiteHeader
        cartCount={cartCount}
        cartHref={cart}
        comparisonCount={COMPARISON_COUNT}
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
        comparisonCount={COMPARISON_COUNT}
        favoritesCount={favoritesCount}
        favoritesHref={favorites}
      />
    </div>
  );
}

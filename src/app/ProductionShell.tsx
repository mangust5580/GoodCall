import type { ReactNode } from 'react';

import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { useCartUnitCount } from '../pages/cart/useCartLines';
import { CART_PATH, HOME_PATH, hashHref } from './routes';
import { useSearchNavigation } from './useSearchNavigation';

import './ProductionShell.scss';

interface ProductionShellProps {
  readonly children: ReactNode;
}

const COMPARISON_COUNT = 3;
const FAVORITES_COUNT = 12;

export function ProductionShell({ children }: ProductionShellProps) {
  const cartCount = useCartUnitCount();
  const handleSearchSubmit = useSearchNavigation();
  const home = hashHref(HOME_PATH);
  const cart = hashHref(CART_PATH);

  return (
    <div className="production-shell">
      <SiteHeader
        cartCount={cartCount}
        cartHref={cart}
        comparisonCount={COMPARISON_COUNT}
        favoritesCount={FAVORITES_COUNT}
        homeHref={home}
        onSearchSubmit={handleSearchSubmit}
      />
      {children}
      <NewsletterBand />
      <SiteFooter homeHref={home} />
      <MobileActionBar
        cartCount={cartCount}
        cartHref={cart}
        comparisonCount={COMPARISON_COUNT}
        favoritesCount={FAVORITES_COUNT}
      />
    </div>
  );
}

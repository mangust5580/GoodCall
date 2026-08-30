import type { ReactNode } from 'react';

import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { HOME_PATH, hashHref } from './routes';

import './ProductionShell.scss';

interface ProductionShellProps {
  readonly children: ReactNode;
}

const CART_COUNT = 2;
const COMPARISON_COUNT = 3;
const FAVORITES_COUNT = 12;

export function ProductionShell({ children }: ProductionShellProps) {
  const home = hashHref(HOME_PATH);

  return (
    <div className="production-shell">
      <SiteHeader
        cartCount={CART_COUNT}
        comparisonCount={COMPARISON_COUNT}
        favoritesCount={FAVORITES_COUNT}
        homeHref={home}
      />
      {children}
      <NewsletterBand />
      <SiteFooter homeHref={home} />
      <MobileActionBar
        cartCount={CART_COUNT}
        comparisonCount={COMPARISON_COUNT}
        favoritesCount={FAVORITES_COUNT}
      />
    </div>
  );
}

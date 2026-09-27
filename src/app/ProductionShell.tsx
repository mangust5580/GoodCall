import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { CART_PATH, HOME_PATH, hashHref, searchPath } from './routes';

import './ProductionShell.scss';

interface ProductionShellProps {
  readonly children: ReactNode;
  readonly cartCount?: number;
}

const CART_COUNT = 2;
const COMPARISON_COUNT = 3;
const FAVORITES_COUNT = 12;

export function ProductionShell({ children, cartCount = CART_COUNT }: ProductionShellProps) {
  const navigate = useNavigate();
  const home = hashHref(HOME_PATH);
  const cart = hashHref(CART_PATH);

  const handleSearchSubmit = (value: string) => {
    const query = value.trim();

    if (query !== '') {
      void navigate(searchPath(query));
    }
  };

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

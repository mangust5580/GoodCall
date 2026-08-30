import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { CatalogPage } from '../pages/catalog';

import './CatalogRoute.scss';

export function CatalogRoute() {
  return (
    <div className="catalog-route">
      <SiteHeader cartCount={2} comparisonCount={3} favoritesCount={12} />
      <CatalogPage />
      <NewsletterBand />
      <SiteFooter />
      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}

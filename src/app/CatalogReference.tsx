import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { CatalogPage } from '../pages/catalog';

import './CatalogReference.scss';

export function CatalogReference() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="catalog-reference">
      <p className="catalog-reference__note">
        Temporary development reference for the Catalog page family. Everything below is the real
        production shell around the real <code>CatalogPage</code>. Catalog A geometry is accepted.
        Catalog B filters are accepted. Catalog C renders the results region from deterministic
        local <code>ProductCard</code> fixtures with local sorting and pagination. No backend, data
        layer or router exists, so filters and quick presets remain UI-only and never change the
        results or the product count.{' '}
        <a className="catalog-reference__back" href={base}>
          Back to reference index
        </a>
      </p>

      <SiteHeader cartCount={2} comparisonCount={3} favoritesCount={12} />
      <CatalogPage />
      <NewsletterBand />
      <SiteFooter homeHref={base} />
      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}

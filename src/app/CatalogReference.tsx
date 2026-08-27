import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { CatalogPage } from '../pages/catalog';

import './CatalogReference.scss';

export function CatalogReference() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="catalog-reference">
      <p className="catalog-reference__note">
        Temporary development reference for Catalog A — page foundation and layout. Everything below
        is the real production shell around the real <code>CatalogPage</code>: breadcrumbs, title
        and result count, the sidebar and results geometry, and the sort row. The dashed regions are
        reserved space: filters are deferred to Catalog B, and the product grid and pagination to
        Catalog C. No router, data layer or catalog state exists.{' '}
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

import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { CatalogPage } from '../pages/catalog';
import { referenceUrl } from './referenceUrl';

import './CatalogReference.scss';

export function CatalogReference() {
  const index = referenceUrl('index');

  return (
    <div className="catalog-reference">
      <p className="catalog-reference__note">
        Temporary development reference for the Catalog page family. Everything below is the real
        production shell around the real <code>CatalogPage</code>. Catalog A geometry is accepted.
        Catalog B filters are accepted. Catalog C renders the results region from deterministic
        local <code>ProductCard</code> fixtures with local sorting and pagination. No backend or
        data layer exists, so filters and quick presets remain UI-only and never change the results
        or the product count. The production route for this page is{' '}
        <code>#/catalog/smartphones</code>.{' '}
        <a className="catalog-reference__back" href={index}>
          Back to reference index
        </a>
      </p>

      <SiteHeader cartCount={2} comparisonCount={3} favoritesCount={12} homeHref={index} />
      <CatalogPage homeHref={index} />
      <NewsletterBand />
      <SiteFooter homeHref={index} />
      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}

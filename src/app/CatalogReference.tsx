import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { CatalogPage } from '../pages/catalog';

import './CatalogReference.scss';

export function CatalogReference() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="catalog-reference">
      <p className="catalog-reference__note">
        Temporary development reference for Catalog A + B — page foundation, layout and filters.
        Everything below is the real production shell around the real <code>CatalogPage</code>.
        Catalog A geometry is accepted: breadcrumbs, title and result count, the 250px sidebar and
        results columns, and the sort row. Catalog B adds real interactive filter UI state — the
        desktop filter panel, the quick-filter row and the mobile <code>Фильтры</code> dialog. The
        state is UI-only: nothing is filtered, and the product count never reacts to it. The dashed
        region is reserved space: the product grid, pagination and sort behaviour remain deferred to
        Catalog C. No router, data layer or catalog store exists.{' '}
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

import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { ProductDetailsPage } from '../pages/product-details';
import { referenceUrl } from './referenceUrl';

import './ProductDetailsReference.scss';

export function ProductDetailsReference() {
  const index = referenceUrl('index');

  return (
    <div className="product-details-reference">
      <p className="product-details-reference__note" lang="en">
        Temporary development reference for the Product Details page family. Everything below is the
        real production shell around the real <code>ProductDetailsPage</code>. Product Details A
        covers the primary product surface from <code>Product_details.png</code>; Product Details B
        adds the tabbed description, characteristics, reviews, delivery and payment, and warranty
        sections plus the key characteristics card. Everything is driven by a deterministic local
        fixture built from the Catalog <code>iphone-15-128</code> entry. Reviews and payment methods
        are presentation specimens. There is no production route, no Supabase read, and no cart,
        favourites, review or payment integration yet.{' '}
        <a className="product-details-reference__back" href={index}>
          Back to reference index
        </a>
      </p>

      <SiteHeader cartCount={2} comparisonCount={3} favoritesCount={12} homeHref={index} />
      <ProductDetailsPage homeHref={index} />
      <NewsletterBand />
      <SiteFooter homeHref={index} />
      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}

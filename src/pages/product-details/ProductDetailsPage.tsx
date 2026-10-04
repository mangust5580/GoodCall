import { useState } from 'react';

import { Container } from '../../components/layout';
import { ProductDetailsSections } from './ProductDetailsSections';
import { ProductGallery } from './ProductGallery';
import type { ProductFavoriteBinding } from './ProductGallery';
import { ProductOfferSummary } from './ProductOfferSummary';
import { ProductPurchasePanel } from './ProductPurchasePanel';
import { ProductRelatedProducts } from './ProductRelatedProducts';
import type { ProductRelatedProductsBinding } from './ProductRelatedProducts';
import { PRODUCT_DETAILS_FIXTURE, productDetailsVariantTitle } from './productDetailsFixtures';
import type { ProductDetailsColourId, ProductDetailsView } from './productDetailsView';

export interface ProductDetailsPageProps {
  readonly homeHref?: string;
  readonly categoryHref?: string;
  readonly product?: ProductDetailsView;
  readonly onAddToCart?: (quantity: number) => number;
  readonly favorite?: ProductFavoriteBinding;
  readonly related?: ProductRelatedProductsBinding;
}

export function ProductDetailsPage({
  homeHref,
  categoryHref,
  product = PRODUCT_DETAILS_FIXTURE,
  onAddToCart,
  favorite,
  related,
}: ProductDetailsPageProps) {
  const variants = product.variants;
  const [selectedColourId, setSelectedColourId] = useState<ProductDetailsColourId | undefined>(
    variants?.defaultColourId,
  );
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const selectedColour = variants?.colours.find((entry) => entry.id === selectedColourId);
  const galleryImages =
    variants === undefined || selectedColourId === undefined
      ? product.gallery.images
      : variants.galleryByColour[selectedColourId];
  const title =
    variants === undefined
      ? product.title
      : productDetailsVariantTitle(variants.baseTitle, selectedColour?.label);
  const handleColourChange = (colourId: ProductDetailsColourId) => {
    setSelectedColourId(colourId);
    setActiveGalleryIndex(0);
  };

  return (
    <main className="product-details">
      <Container>
        <nav aria-label="Хлебные крошки" className="product-details__breadcrumbs">
          <ol className="product-details__crumbs">
            <li className="product-details__crumb">
              {homeHref === undefined ? (
                'Главная'
              ) : (
                <a className="product-details__crumb-link" href={homeHref}>
                  Главная
                </a>
              )}
            </li>
            <li className="product-details__crumb">Каталог</li>
            <li className="product-details__crumb">
              {categoryHref === undefined ? (
                product.categoryTitle
              ) : (
                <a className="product-details__crumb-link" href={categoryHref}>
                  {product.categoryTitle}
                </a>
              )}
            </li>
            <li aria-current="page" className="product-details__crumb">
              {title}
            </li>
          </ol>
        </nav>

        <div className="product-details__layout">
          <div className="product-details__gallery">
            <ProductGallery
              activeIndex={activeGalleryIndex}
              decorative={variants === undefined && product.gallery.decorative}
              discount={product.discount}
              favorite={favorite}
              images={galleryImages}
              onActiveIndexChange={setActiveGalleryIndex}
            />
          </div>
          <div className="product-details__purchase">
            <ProductPurchasePanel
              onAddToCart={onAddToCart}
              onColourChange={handleColourChange}
              product={product}
              selectedColourId={selectedColourId}
              title={title}
            />
          </div>
          <div className="product-details__offer">
            <ProductOfferSummary product={product} />
          </div>
        </div>

        <ProductDetailsSections product={product} />

        {related === undefined ? null : <ProductRelatedProducts {...related} />}
      </Container>
    </main>
  );
}

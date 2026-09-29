import { useState } from 'react';

import { Container } from '../../components/layout';
import { ProductDetailsSections } from './ProductDetailsSections';
import { ProductGallery } from './ProductGallery';
import { ProductOfferSummary } from './ProductOfferSummary';
import { ProductPurchasePanel } from './ProductPurchasePanel';
import type { ProductDetailsCartSelection } from './ProductPurchasePanel';
import { PRODUCT_DETAILS_FIXTURE, productDetailsTitle } from './productDetailsFixtures';
import type { ProductDetailsColourId, ProductDetailsFixture } from './productDetailsFixtures';

export interface ProductDetailsPageProps {
  readonly homeHref?: string;
  readonly categoryHref?: string;
  readonly product?: ProductDetailsFixture;
  readonly onAddToCart?: (selection: ProductDetailsCartSelection) => number;
}

const CATEGORY_TITLE = 'Смартфоны';

export function ProductDetailsPage({
  homeHref,
  categoryHref,
  product = PRODUCT_DETAILS_FIXTURE,
  onAddToCart,
}: ProductDetailsPageProps) {
  const [selectedColourId, setSelectedColourId] = useState<ProductDetailsColourId>(
    product.defaultColourId,
  );
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const gallery = product.galleryByColour[selectedColourId];
  const title = productDetailsTitle(product, selectedColourId);
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
                CATEGORY_TITLE
              ) : (
                <a className="product-details__crumb-link" href={categoryHref}>
                  {CATEGORY_TITLE}
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
              discount={product.discount}
              images={gallery}
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
      </Container>
    </main>
  );
}

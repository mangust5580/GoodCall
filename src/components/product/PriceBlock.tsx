import type { ReactNode } from 'react';

import { ProductAvailability } from './ProductAvailability';
import { ProductRating } from './ProductRating';

interface PriceBlockProps {
  readonly price: string;
  readonly oldPrice?: string;
  readonly discount?: ReactNode;
  readonly savings?: string;
  readonly rating?: number;
  readonly reviewCount?: number;
  readonly availability?: string;
}

export function PriceBlock({
  price,
  oldPrice,
  discount,
  savings,
  rating,
  reviewCount,
  availability,
}: PriceBlockProps) {
  return (
    <div className="price-block">
      <div className="price-block__panel">
        <p className="price-block__prices">
          <strong className="product-price price-block__current">{price}</strong>
          {oldPrice === undefined ? null : <del className="product-price-old">{oldPrice}</del>}
          {discount}
        </p>
        {savings === undefined ? null : <p className="price-block__savings">{savings}</p>}
      </div>
      {rating === undefined ? null : <ProductRating rating={rating} reviewCount={reviewCount} />}
      {availability === undefined ? null : <ProductAvailability status={availability} />}
    </div>
  );
}

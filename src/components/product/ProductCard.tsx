import type { ReactNode } from 'react';

import { QuantityStepper } from '../ui';

import { AddToCartButton, FavoriteButton } from './ProductActions';
import { ProductRating } from './ProductRating';

export type ProductCardLayout = 'vertical' | 'horizontal';

const CART_ACTION_TEXT = 'В корзину';

interface ProductCardProps {
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly price: string;
  readonly layout?: ProductCardLayout;
  readonly oldPrice?: string;
  readonly rating?: number;
  readonly reviewCount?: number;
  readonly badge?: ReactNode;
  readonly availability?: ReactNode;
  readonly favoritePressed?: boolean;
  readonly onFavoriteToggle?: (pressed: boolean) => void;
  readonly quantity?: number;
  readonly onQuantityChange?: (value: number) => void;
  readonly onAddToCart?: () => void;
  readonly disabled?: boolean;
}

export function ProductCard({
  title,
  imageSrc,
  imageAlt,
  price,
  layout = 'vertical',
  oldPrice,
  rating,
  reviewCount,
  badge,
  availability,
  favoritePressed = false,
  onFavoriteToggle,
  quantity,
  onQuantityChange,
  onAddToCart,
  disabled = false,
}: ProductCardProps) {
  const labelledCart = layout === 'vertical';
  const stepper =
    quantity === undefined || onQuantityChange === undefined ? null : (
      <QuantityStepper
        label={`Количество: ${title}`}
        onChange={onQuantityChange}
        value={quantity}
      />
    );
  const cartButton =
    onAddToCart === undefined ? null : (
      <AddToCartButton
        className="product-card__cart"
        disabled={disabled}
        label={labelledCart ? `${CART_ACTION_TEXT}: ${title}` : `Добавить в корзину: ${title}`}
        onClick={onAddToCart}
      >
        {labelledCart ? CART_ACTION_TEXT : undefined}
      </AddToCartButton>
    );
  const hasActions = availability !== undefined || stepper !== null || cartButton !== null;

  return (
    <article className={`product-card product-card--${layout}`}>
      <div className="product-card__media">
        {badge === undefined ? null : <div className="product-card__badge">{badge}</div>}
        <img alt={imageAlt} className="product-card__image" src={imageSrc} />
        {onFavoriteToggle === undefined ? null : (
          <FavoriteButton
            className="product-card__favorite"
            disabled={disabled}
            label={
              favoritePressed ? `Убрать из избранного: ${title}` : `Добавить в избранное: ${title}`
            }
            onToggle={onFavoriteToggle}
            pressed={favoritePressed}
          />
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__info">
          <h3 className="product-card__title">{title}</h3>
          {rating === undefined ? null : (
            <ProductRating rating={rating} reviewCount={reviewCount} />
          )}
        </div>

        <div className="product-card__footer">
          <p className="product-card__prices">
            <strong className="product-price">{price}</strong>
            {oldPrice === undefined ? null : <del className="product-price-old">{oldPrice}</del>}
          </p>
          {hasActions ? (
            <div className="product-card__actions">
              {availability}
              {stepper}
              {cartButton}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

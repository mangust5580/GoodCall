import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { Picture } from '../media';
import type { PictureSource } from '../media';
import { QuantityStepper } from '../ui';

import { AddToCartButton, CompareButton, FavoriteButton } from './ProductActions';
import { ProductRating } from './ProductRating';

export type ProductCardLayout = 'vertical' | 'horizontal';

const CART_ACTION_TEXT = 'В корзину';

interface ProductCardProps {
  readonly title: string;
  readonly href?: string;
  readonly imageSrc?: string;
  readonly image?: PictureSource;
  readonly imageAlt: string;
  readonly imageSizes?: string;
  readonly price: string;
  readonly layout?: ProductCardLayout;
  readonly oldPrice?: string;
  readonly rating?: number;
  readonly reviewCount?: number;
  readonly badge?: ReactNode;
  readonly availability?: ReactNode;
  readonly favoritePressed?: boolean;
  readonly onFavoriteToggle?: (pressed: boolean) => void;
  readonly comparePressed?: boolean;
  readonly compareDisabled?: boolean;
  readonly compareLabel?: string;
  readonly onCompareToggle?: (pressed: boolean) => void;
  readonly quantity?: number;
  readonly onQuantityChange?: (value: number) => void;
  readonly allowZeroQuantity?: boolean;
  readonly onAddToCart?: () => void;
  readonly disabled?: boolean;
}

export function ProductCard({
  title,
  href,
  imageSrc,
  image,
  imageAlt,
  imageSizes = '240px',
  price,
  layout = 'vertical',
  oldPrice,
  rating,
  reviewCount,
  badge,
  availability,
  favoritePressed = false,
  onFavoriteToggle,
  comparePressed = false,
  compareDisabled = false,
  compareLabel,
  onCompareToggle,
  quantity,
  onQuantityChange,
  allowZeroQuantity = false,
  onAddToCart,
  disabled = false,
}: ProductCardProps) {
  const labelledCart = layout === 'vertical';
  const cardRef = useRef<HTMLElement>(null);
  const cartFocusPending = useRef(false);

  useEffect(() => {
    if (cartFocusPending.current && quantity === undefined) {
      cartFocusPending.current = false;
      cardRef.current?.querySelector<HTMLButtonElement>('.product-card__cart')?.focus();
    }
  }, [quantity]);

  const stepper =
    quantity === undefined || onQuantityChange === undefined ? null : (
      <QuantityStepper
        label={`Количество: ${title}`}
        min={allowZeroQuantity ? 0 : 1}
        onChange={(value) => {
          cartFocusPending.current = value === 0;
          onQuantityChange(value);
        }}
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
  const productImage =
    image === undefined ? (
      <img alt={imageAlt} className="product-card__image" src={imageSrc} />
    ) : (
      <Picture alt={imageAlt} className="product-card__image" sizes={imageSizes} source={image} />
    );

  return (
    <article className={`product-card product-card--${layout}`} ref={cardRef}>
      <div className="product-card__media">
        {badge === undefined ? null : <div className="product-card__badge">{badge}</div>}
        {productImage}
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
        {onCompareToggle === undefined ? null : (
          <CompareButton
            className="product-card__compare"
            disabled={compareDisabled}
            label={
              compareLabel ??
              (comparePressed ? `Убрать из сравнения: ${title}` : `Добавить к сравнению: ${title}`)
            }
            onToggle={onCompareToggle}
            pressed={comparePressed}
          />
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__info">
          <h3 className="product-card__title">
            {href === undefined ? (
              title
            ) : (
              <a className="product-card__link" href={href}>
                {title}
              </a>
            )}
          </h3>
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

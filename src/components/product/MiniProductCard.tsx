import { AddToCartButton, FavoriteButton } from './ProductActions';

interface MiniProductCardProps {
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly favoritePressed?: boolean;
  readonly onFavoriteToggle?: (pressed: boolean) => void;
  readonly onAddToCart?: () => void;
  readonly disabled?: boolean;
}

export function MiniProductCard({
  title,
  imageSrc,
  imageAlt,
  favoritePressed = false,
  onFavoriteToggle,
  onAddToCart,
  disabled = false,
}: MiniProductCardProps) {
  return (
    <article aria-label={title} className="mini-product-card">
      <img alt={imageAlt} className="mini-product-card__image" src={imageSrc} />
      {onFavoriteToggle === undefined ? null : (
        <FavoriteButton
          className="mini-product-card__favorite"
          disabled={disabled}
          label={
            favoritePressed ? `Убрать из избранного: ${title}` : `Добавить в избранное: ${title}`
          }
          onToggle={onFavoriteToggle}
          pressed={favoritePressed}
        />
      )}
      {onAddToCart === undefined ? null : (
        <AddToCartButton
          className="mini-product-card__cart"
          disabled={disabled}
          label={`Добавить в корзину: ${title}`}
          onClick={onAddToCart}
        />
      )}
    </article>
  );
}

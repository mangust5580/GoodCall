import { Icon } from '../ui';

interface ProductRatingProps {
  readonly rating: number;
  readonly reviewCount?: number;
  readonly maxRating?: number;
}

const countFormatter = new Intl.NumberFormat('ru-RU');
const reviewPluralRules = new Intl.PluralRules('ru-RU');

const REVIEW_WORDS: Record<Intl.LDMLPluralRule, string> = {
  zero: 'отзывов',
  one: 'отзыв',
  two: 'отзыва',
  few: 'отзыва',
  many: 'отзывов',
  other: 'отзыва',
};

export function ProductRating({ rating, reviewCount, maxRating = 5 }: ProductRatingProps) {
  const value = rating.toFixed(1);
  const reviews =
    reviewCount === undefined
      ? null
      : `${countFormatter.format(reviewCount)} ${REVIEW_WORDS[reviewPluralRules.select(reviewCount)]}`;

  return (
    <p className="product-rating">
      <span className="ui-visually-hidden">
        {reviews === null
          ? `Рейтинг ${value} из ${String(maxRating)}`
          : `Рейтинг ${value} из ${String(maxRating)}, ${reviews}`}
      </span>
      <Icon className="product-rating__star" name="star" />
      <span aria-hidden="true" className="product-rating__value">
        {value}
      </span>
      {reviewCount === undefined ? null : (
        <span aria-hidden="true" className="product-rating__count">
          ({countFormatter.format(reviewCount)})
        </span>
      )}
    </p>
  );
}

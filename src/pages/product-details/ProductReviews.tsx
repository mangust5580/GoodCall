import { Icon } from '../../components/ui';
import { PRODUCT_STAR_COUNT, ProductStars } from './ProductStars';
import { formatRating, formatReviewCount } from './productDetailsFormat';
import type { ProductDetailsReview } from './productDetailsView';

const AVATAR_INITIALS_LIMIT = 2;

function reviewerInitials(author: string): string {
  return author
    .split(/\s+/u)
    .map((part) => part.replace(/[^\p{L}]/gu, '').charAt(0))
    .filter((initial) => initial !== '')
    .slice(0, AVATAR_INITIALS_LIMIT)
    .join('')
    .toLocaleUpperCase('ru-RU');
}

interface ProductReviewsProps {
  readonly rating: number;
  readonly reviewCount: number;
  readonly reviews: readonly ProductDetailsReview[];
}

export function ProductReviews({ rating, reviewCount, reviews }: ProductReviewsProps) {
  const ratingLabel = formatRating(rating);
  const summary = (
    <>
      <p className="product-reviews__score">
        <span className="ui-visually-hidden">
          {`Средняя оценка ${ratingLabel} из ${String(PRODUCT_STAR_COUNT)}`}
        </span>
        <span aria-hidden="true" className="product-reviews__score-value">
          {ratingLabel}
        </span>
        <ProductStars rating={rating} />
      </p>
      <p className="product-reviews__count">На основе {formatReviewCount(reviewCount)}</p>
    </>
  );

  if (reviews.length === 0) {
    return (
      <div className="product-panel product-reviews">
        <h2 className="product-panel__title">Отзывы покупателей</h2>

        <div className="product-reviews__summary product-reviews__summary--standalone">
          {summary}
        </div>
        <p className="product-reviews__note">
          <Icon className="product-reviews__note-icon" name="message" />
          <span>
            Тексты отзывов в демо-витрине не публикуются — оценка и количество отзывов приходят из
            каталога.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="product-panel product-reviews">
      <h2 className="product-panel__title">Отзывы покупателей</h2>

      <div className="product-reviews__summary">{summary}</div>

      <ul className="product-reviews__list">
        {reviews.map((review) => (
          <li className="product-review" key={review.id}>
            <article className="product-review__body">
              <header className="product-review__header">
                <span aria-hidden="true" className="product-review__avatar">
                  <span className="product-review__avatar-initials">
                    {reviewerInitials(review.author)}
                  </span>
                  {review.avatarSrc === undefined ? null : (
                    <img
                      alt=""
                      className="product-review__avatar-image"
                      src={review.avatarSrc}
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                  )}
                </span>
                <div className="product-review__identity">
                  <h3 className="product-review__author">{review.author}</h3>
                  <p className="product-review__date">{review.date}</p>
                </div>
              </header>
              <p className="product-review__rating">
                <span className="ui-visually-hidden">
                  {`Оценка ${String(review.rating)} из ${String(PRODUCT_STAR_COUNT)}`}
                </span>
                <ProductStars rating={review.rating} />
              </p>
              <p className="product-review__text">{review.text}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const countFormatter = new Intl.NumberFormat('ru-RU');

const ratingFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const reviewPluralRules = new Intl.PluralRules('ru-RU');

const REVIEW_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'отзывов',
  one: 'отзыв',
  two: 'отзыва',
  few: 'отзыва',
  many: 'отзывов',
  other: 'отзыва',
};

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatPoints(value: number): string {
  return countFormatter.format(value);
}

export function formatRating(value: number): string {
  return ratingFormatter.format(value);
}

export function formatReviewCount(value: number): string {
  return `${countFormatter.format(value)} ${REVIEW_WORDS[reviewPluralRules.select(value)]}`;
}

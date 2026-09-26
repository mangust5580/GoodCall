import { Icon } from '../../components/ui';

type StarFill = 'full' | 'half' | 'empty';

const STAR_COUNT = 5;

function starFills(rating: number): readonly StarFill[] {
  const halves = Math.round(rating * 2);

  return Array.from({ length: STAR_COUNT }, (_, index) => {
    const position = (index + 1) * 2;

    if (halves >= position) {
      return 'full';
    }

    return halves === position - 1 ? 'half' : 'empty';
  });
}

interface ProductStarsProps {
  readonly rating: number;
}

export function ProductStars({ rating }: ProductStarsProps) {
  return (
    <span aria-hidden="true" className="product-stars">
      {starFills(rating).map((fill, index) => (
        <Icon
          className={`product-stars__star product-stars__star--${fill}`}
          key={String(index)}
          name="star"
        />
      ))}
    </span>
  );
}

export const PRODUCT_STAR_COUNT = STAR_COUNT;

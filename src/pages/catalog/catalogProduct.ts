export interface CatalogProduct {
  readonly id: string;
  readonly title: string;
  readonly imageSrc?: string;
  readonly imageAlt: string;
  readonly priceValue: number;
  readonly oldPriceValue?: number;
  readonly rating?: number;
  readonly reviewCount: number;
  readonly badge?: string;
  readonly discounted?: boolean;
  readonly popularity: number;
}

export type CatalogSortValue = 'popular' | 'cheap' | 'expensive' | 'rating';

export const CATALOG_SORT_OPTIONS: readonly {
  readonly value: CatalogSortValue;
  readonly label: string;
}[] = [
  { value: 'popular', label: 'Сначала популярные' },
  { value: 'cheap', label: 'Сначала дешевле' },
  { value: 'expensive', label: 'Сначала дороже' },
  { value: 'rating', label: 'По рейтингу' },
];

export const DEFAULT_CATALOG_SORT: CatalogSortValue = 'popular';

export const CATALOG_PRODUCTS_PER_PAGE = 12;

const SORT_COMPARATORS: Record<
  CatalogSortValue,
  (left: CatalogProduct, right: CatalogProduct) => number
> = {
  popular: (left, right) => right.popularity - left.popularity,
  cheap: (left, right) => left.priceValue - right.priceValue,
  expensive: (left, right) => right.priceValue - left.priceValue,
  rating: (left, right) => (right.rating ?? 0) - (left.rating ?? 0),
};

export function sortCatalogProducts(
  products: readonly CatalogProduct[],
  sort: CatalogSortValue,
): CatalogProduct[] {
  const comparator = SORT_COMPARATORS[sort];

  return [...products].sort((left, right) => {
    const primary = comparator(left, right);

    return primary === 0 ? left.id.localeCompare(right.id) : primary;
  });
}

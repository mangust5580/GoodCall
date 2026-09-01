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
export const CATALOG_PAGE_COUNT = 65;

export const CATALOG_PRODUCTS: readonly CatalogProduct[] = [
  {
    id: 'iphone-15-pro-128',
    title: 'Apple iPhone 15 Pro 128 ГБ, Натуральный титан',
    imageAlt: 'Смартфон Apple iPhone 15 Pro в цвете натуральный титан',
    priceValue: 109990,
    oldPriceValue: 124990,
    rating: 4.8,
    reviewCount: 1284,
    badge: 'Новинка',
    popularity: 100,
  },
  {
    id: 'galaxy-s24-128',
    title: 'Samsung Galaxy S24 128 ГБ, Фиолетовый',
    imageAlt: 'Смартфон Samsung Galaxy S24 в фиолетовом цвете',
    priceValue: 75990,
    oldPriceValue: 89990,
    rating: 4.6,
    reviewCount: 866,
    badge: '-15%',
    discounted: true,
    popularity: 96,
  },
  {
    id: 'xiaomi-14-256',
    title: 'Xiaomi 14 12/256 ГБ, Чёрный',
    imageAlt: 'Смартфон Xiaomi 14 в чёрном цвете',
    priceValue: 69990,
    rating: 4.7,
    reviewCount: 742,
    badge: 'Новинка',
    popularity: 93,
  },
  {
    id: 'pixel-8-128',
    title: 'Google Pixel 8 128 ГБ, Обсидиан',
    imageAlt: 'Смартфон Google Pixel 8 в цвете обсидиан',
    priceValue: 53990,
    oldPriceValue: 59990,
    rating: 4.5,
    reviewCount: 431,
    badge: '-10%',
    discounted: true,
    popularity: 88,
  },
  {
    id: 'oneplus-12-256',
    title: 'OnePlus 12 12/256 ГБ, Сланец',
    imageAlt: 'Смартфон OnePlus 12 в цвете сланец',
    priceValue: 65990,
    oldPriceValue: 74990,
    rating: 4.7,
    reviewCount: 219,
    badge: '-12%',
    discounted: true,
    popularity: 84,
  },
  {
    id: 'realme-gt6-256',
    title: 'realme GT 6 12/256 ГБ, Серебристый',
    imageAlt: 'Смартфон realme GT 6 в серебристом цвете',
    priceValue: 49990,
    rating: 4.6,
    reviewCount: 408,
    badge: 'Новинка',
    popularity: 80,
  },
  {
    id: 'poco-f6-256',
    title: 'POCO F6 12/256 ГБ, Чёрный',
    imageAlt: 'Смартфон POCO F6 в чёрном цвете',
    priceValue: 31990,
    oldPriceValue: 39990,
    rating: 4.5,
    reviewCount: 3540,
    badge: '-20%',
    discounted: true,
    popularity: 76,
  },
  {
    id: 'galaxy-a55-128',
    title: 'Samsung Galaxy A55 128 ГБ, Лиловый',
    imageAlt: 'Смартфон Samsung Galaxy A55 в лиловом цвете',
    priceValue: 28990,
    oldPriceValue: 34990,
    rating: 4.6,
    reviewCount: 2118,
    badge: '-18%',
    discounted: true,
    popularity: 72,
  },
  {
    id: 'infinix-zero-30-256',
    title: 'Infinix ZERO 30 5G 256 ГБ, Золотой',
    imageAlt: 'Смартфон Infinix ZERO 30 5G в золотом цвете',
    priceValue: 22490,
    oldPriceValue: 26990,
    rating: 4.5,
    reviewCount: 297,
    badge: '-17%',
    discounted: true,
    popularity: 68,
  },
  {
    id: 'honor-magic6-lite-256',
    title: 'HONOR Magic6 Lite 256 ГБ, Изумрудный',
    imageAlt: 'Смартфон HONOR Magic6 Lite в изумрудном цвете',
    priceValue: 27990,
    rating: 4.6,
    reviewCount: 654,
    badge: 'Новинка',
    popularity: 64,
  },
  {
    id: 'nothing-phone-2a-256',
    title: 'Nothing Phone (2a) 256 ГБ, Чёрный',
    imageAlt: 'Смартфон Nothing Phone (2a) в чёрном цвете',
    priceValue: 31990,
    oldPriceValue: 36990,
    rating: 4.6,
    reviewCount: 512,
    badge: '-13%',
    discounted: true,
    popularity: 60,
  },
  {
    id: 'vivo-v30-256',
    title: 'vivo V30 256 ГБ, Зелёный',
    imageAlt: 'Смартфон vivo V30 в зелёном цвете',
    priceValue: 33990,
    oldPriceValue: 37990,
    rating: 4.6,
    reviewCount: 383,
    badge: '-10%',
    discounted: true,
    popularity: 56,
  },
  {
    id: 'iphone-15-128',
    title: 'Apple iPhone 15 128 ГБ, Розовый',
    imageAlt: 'Смартфон Apple iPhone 15 в розовом цвете',
    priceValue: 79990,
    oldPriceValue: 84990,
    rating: 4.7,
    reviewCount: 1976,
    badge: '-6%',
    discounted: true,
    popularity: 52,
  },
  {
    id: 'redmi-note-13-pro-256',
    title: 'Xiaomi Redmi Note 13 Pro 256 ГБ, Синий',
    imageAlt: 'Смартфон Xiaomi Redmi Note 13 Pro в синем цвете',
    priceValue: 24990,
    oldPriceValue: 28990,
    rating: 4.4,
    reviewCount: 4207,
    badge: '-14%',
    discounted: true,
    popularity: 48,
  },
  {
    id: 'oppo-reno-11-256',
    title: 'OPPO Reno 11 256 ГБ, Зелёный',
    imageAlt: 'Смартфон OPPO Reno 11 в зелёном цвете',
    priceValue: 39990,
    rating: 4.5,
    reviewCount: 168,
    popularity: 44,
  },
  {
    id: 'tecno-camon-30-256',
    title: 'Tecno Camon 30 256 ГБ, Чёрный',
    imageAlt: 'Смартфон Tecno Camon 30 в чёрном цвете',
    priceValue: 19990,
    oldPriceValue: 23990,
    rating: 4.2,
    reviewCount: 96,
    badge: '-16%',
    discounted: true,
    popularity: 40,
  },
];

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

export function catalogPageProducts(
  products: readonly CatalogProduct[],
  page: number,
): CatalogProduct[] {
  const total = products.length;

  if (total === 0) {
    return [];
  }

  const offset = ((((page - 1) * CATALOG_PRODUCTS_PER_PAGE) % total) + total) % total;

  return Array.from(
    { length: Math.min(CATALOG_PRODUCTS_PER_PAGE, total) },
    (_, index) => products[(offset + index) % total],
  );
}

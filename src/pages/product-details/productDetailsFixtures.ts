import paymentMir from '../../assets/commerce/payment-mir.svg';
import paymentSberpay from '../../assets/commerce/payment-sberpay.svg';
import paymentSbp from '../../assets/commerce/payment-sbp.svg';
import paymentTpay from '../../assets/commerce/payment-tpay.svg';
import {
  PRODUCT_DETAILS_DESCRIPTION_MEDIA,
  PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA,
  PRODUCT_DETAILS_REVIEW_AVATARS,
  PRODUCT_DETAILS_WARRANTY_MEDIA,
} from '../../assets/media/product-details/productDetailsMedia';
import type { PictureSource } from '../../components/media';
import type { IconName } from '../../components/ui';
import { CATALOG_PRODUCTS } from '../catalog/catalogProductFixtures';
import type { CatalogProduct } from '../catalog/catalogProductFixtures';
import type { ProductDetailsLiveProduct } from './productDetailsData';

export type ProductDetailsColourId = 'pink' | 'black' | 'blue';

export type ProductDetailsColourSwatch = ProductDetailsColourId;

export interface ProductDetailsColour {
  readonly id: ProductDetailsColourId;
  readonly label: string;
  readonly swatch: ProductDetailsColourSwatch;
}

export interface ProductDetailsMemory {
  readonly id: string;
  readonly label: string;
}

export interface ProductDetailsGalleryImage {
  readonly id: string;
  readonly source: PictureSource;
  readonly alt: string;
}

export interface ProductDetailsService {
  readonly kind: 'delivery' | 'warranty';
  readonly title: string;
  readonly lines: readonly string[];
  readonly icon: IconName;
}

export interface ProductDetailsPaymentMethod {
  readonly id: string;
  readonly label: string;
  readonly mark?: {
    readonly src: string;
    readonly alt: string;
    readonly modifier: string;
  };
}

export interface ProductDetailsFeature {
  readonly title: string;
  readonly text: string;
  readonly icon: IconName;
}

export interface ProductDetailsDescription {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly features: readonly ProductDetailsFeature[];
}

export interface ProductDetailsSpecification {
  readonly label: string;
  readonly value: string;
  readonly key?: boolean;
}

export interface ProductDetailsSpecificationGroup {
  readonly title: string;
  readonly rows: readonly ProductDetailsSpecification[];
}

export interface ProductDetailsReview {
  readonly id: string;
  readonly author: string;
  readonly date: string;
  readonly rating: number;
  readonly text: string;
  readonly avatarSrc?: string;
}

export interface ProductDetailsTrustItem {
  readonly title: string;
  readonly text: string;
  readonly icon: IconName;
}

export interface ProductDetailsFixture {
  readonly baseTitle: string;
  readonly priceValue: number;
  readonly oldPriceValue?: number;
  readonly discount?: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly sku: string;
  readonly labels: readonly string[];
  readonly installmentMonths: number;
  readonly availability: string;
  readonly deliveryNote: string;
  readonly colours: readonly ProductDetailsColour[];
  readonly defaultColourId: ProductDetailsColourId;
  readonly memories: readonly ProductDetailsMemory[];
  readonly defaultMemoryId: string;
  readonly highlights: readonly string[];
  readonly bonusPoints: number;
  readonly galleryByColour: Record<ProductDetailsColourId, readonly ProductDetailsGalleryImage[]>;
  readonly descriptionImage: PictureSource;
  readonly warrantyImage: PictureSource;
  readonly services: readonly ProductDetailsService[];
  readonly paymentMethods: readonly ProductDetailsPaymentMethod[];
  readonly description: ProductDetailsDescription;
  readonly specificationGroups: readonly ProductDetailsSpecificationGroup[];
  readonly reviews: readonly ProductDetailsReview[];
  readonly trust: readonly ProductDetailsTrustItem[];
  readonly supportPhone: string;
  readonly supportPhoneHref: string;
  readonly supportHours: string;
  readonly chatNote: string;
}

const REFERENCE_PRODUCT_ID = 'iphone-15-128';
const NEW_LABEL = 'Новинка';
const SPECIMEN_LABELS: readonly string[] = ['Хит продаж'];
const WARRANTY_TEXT = 'Официальная гарантия 12 месяцев';
const DEFAULT_COLOUR: ProductDetailsColour = { id: 'pink', label: 'Розовый', swatch: 'pink' };
const COLOURS: readonly ProductDetailsColour[] = [
  DEFAULT_COLOUR,
  { id: 'black', label: 'Чёрный', swatch: 'black' },
  { id: 'blue', label: 'Голубой', swatch: 'blue' },
];
const TITLE_COLOUR_SEPARATOR = ', ';
const DEFAULT_COLOUR_SUFFIX = `${TITLE_COLOUR_SEPARATOR}${DEFAULT_COLOUR.label}`;

export function isProductDetailsSpecimenSlug(slug: string): boolean {
  return slug === REFERENCE_PRODUCT_ID;
}

export function productDetailsTitle(
  product: ProductDetailsFixture,
  colourId: ProductDetailsColourId,
): string {
  const colour = product.colours.find((entry) => entry.id === colourId);

  return colour === undefined
    ? product.baseTitle
    : `${product.baseTitle}${TITLE_COLOUR_SEPARATOR}${colour.label}`;
}

function referenceCatalogProduct(): CatalogProduct {
  const product = CATALOG_PRODUCTS.find((entry) => entry.id === REFERENCE_PRODUCT_ID);

  if (product === undefined) {
    throw new Error(`Catalog fixture ${REFERENCE_PRODUCT_ID} is missing`);
  }

  return product;
}

const catalogProduct = referenceCatalogProduct();

function referenceBaseTitle(title: string): string {
  if (!title.endsWith(DEFAULT_COLOUR_SUFFIX)) {
    throw new Error(
      `Catalog fixture ${REFERENCE_PRODUCT_ID} title must end with ${DEFAULT_COLOUR_SUFFIX}`,
    );
  }

  return title.slice(0, -DEFAULT_COLOUR_SUFFIX.length);
}

function galleryForColour(
  colourId: ProductDetailsColourId,
  colourLabel: string,
): readonly ProductDetailsGalleryImage[] {
  const media = PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA[colourId];

  return [
    {
      id: `${colourId}-hero-front`,
      source: media.heroFront,
      alt: `${colourLabel} смартфон, вид спереди под углом`,
    },
    {
      id: `${colourId}-rear-camera`,
      source: media.rearCamera,
      alt: `${colourLabel} смартфон, вид сзади`,
    },
    {
      id: `${colourId}-side-profile`,
      source: media.sideProfile,
      alt: `${colourLabel} смартфон, вид сбоку`,
    },
    {
      id: `${colourId}-front-rear-pair`,
      source: media.frontRearPair,
      alt: `${colourLabel} смартфон спереди и сзади`,
    },
    {
      id: `${colourId}-camera-detail`,
      source: media.cameraDetail,
      alt: `${colourLabel} смартфон, крупный план камеры и корпуса`,
    },
  ];
}

const galleryByColour = Object.fromEntries(
  COLOURS.map((colour) => [colour.id, galleryForColour(colour.id, colour.label)]),
) as Record<ProductDetailsColourId, readonly ProductDetailsGalleryImage[]>;

export const PRODUCT_DETAILS_FIXTURE: ProductDetailsFixture = {
  baseTitle: referenceBaseTitle(catalogProduct.title),
  priceValue: catalogProduct.priceValue,
  oldPriceValue: catalogProduct.oldPriceValue,
  discount: catalogProduct.badge,
  rating: catalogProduct.rating ?? 0,
  reviewCount: catalogProduct.reviewCount,
  sku: '213475',
  labels: [NEW_LABEL, ...SPECIMEN_LABELS],
  installmentMonths: 36,
  availability: 'В наличии',
  deliveryNote: 'Доставка завтра',
  colours: COLOURS,
  defaultColourId: DEFAULT_COLOUR.id,
  memories: [
    { id: '128', label: '128 ГБ' },
    { id: '256', label: '256 ГБ' },
  ],
  defaultMemoryId: '128',
  highlights: [
    'Dynamic Island вместо выреза',
    'Основная камера 48 МП',
    'Разъём USB-C',
    'Процессор A16 Bionic',
    'Дисплей Super Retina XDR 6,1″',
  ],
  bonusPoints: 800,
  galleryByColour,
  descriptionImage: PRODUCT_DETAILS_DESCRIPTION_MEDIA,
  warrantyImage: PRODUCT_DETAILS_WARRANTY_MEDIA,
  services: [
    { kind: 'delivery', title: 'Доставка', lines: ['Завтра, бесплатно'], icon: 'package' },
    {
      kind: 'delivery',
      title: 'Самовывоз',
      lines: ['Сегодня, бесплатно', 'Из 45 магазинов'],
      icon: 'map-pin',
    },
    { kind: 'warranty', title: 'Гарантия', lines: [WARRANTY_TEXT], icon: 'check' },
  ],
  paymentMethods: [
    {
      id: 'card',
      label: 'Банковская карта',
      mark: { src: paymentMir, alt: 'МИР', modifier: 'mir' },
    },
    { id: 'sbp', label: 'СБП', mark: { src: paymentSbp, alt: 'СБП', modifier: 'sbp' } },
    {
      id: 'sberpay',
      label: 'SberPay',
      mark: { src: paymentSberpay, alt: 'SberPay', modifier: 'sberpay' },
    },
    {
      id: 't-pay',
      label: 'T-Pay',
      mark: { src: paymentTpay, alt: 'T-Pay', modifier: 'tpay' },
    },
  ],
  supportPhone: '8 800 100-10-19',
  supportPhoneHref: 'tel:88001001019',
  supportHours: 'Ежедневно с 9:00 до 21:00',
  chatNote: 'Ответим в течение 1 минуты',
  description: {
    title: 'Знакомый iPhone, заметно новее',
    paragraphs: [
      'iPhone 15 получил Dynamic Island, основную камеру 48 МП и разъём USB-C. Корпус из цветного матового стекла и алюминия остаётся компактным и лёгким.',
      'Процессор A16 Bionic уверенно справляется с приложениями, играми и обработкой фото, а дисплей Super Retina XDR сохраняет читаемость даже на ярком солнце.',
    ],
    features: [
      {
        title: 'Dynamic Island',
        text: 'Уведомления и активные действия вокруг фронтальной камеры.',
        icon: 'smartphone',
      },
      {
        title: 'Камера 48 МП',
        text: 'Детальные снимки и двукратное приближение без потери качества.',
        icon: 'scan-qr',
      },
      {
        title: 'Разъём USB-C',
        text: 'Один кабель для зарядки и передачи данных.',
        icon: 'accessories',
      },
      {
        title: 'A16 Bionic',
        text: 'Быстрая работа приложений и игр без задержек.',
        icon: 'settings',
      },
      {
        title: 'Super Retina XDR',
        text: 'OLED-дисплей 6,1″ с яркостью до 2000 кд/\u2060м².',
        icon: 'tv',
      },
    ],
  },
  specificationGroups: [
    {
      title: 'Экран',
      rows: [
        { label: 'Диагональ экрана', value: '6,1″', key: true },
        { label: 'Тип экрана', value: 'Super Retina XDR, OLED', key: true },
        { label: 'Разрешение', value: '2556 × 1179', key: true },
        { label: 'Частота обновления', value: '60 Гц', key: true },
        { label: 'Максимальная яркость', value: '2000 кд/\u2060м²' },
      ],
    },
    {
      title: 'Производительность',
      rows: [
        { label: 'Процессор', value: 'A16 Bionic', key: true },
        { label: 'Встроенная память', value: '128 ГБ', key: true },
      ],
    },
    {
      title: 'Камеры',
      rows: [
        { label: 'Основная камера', value: '48 МП + 12 МП', key: true },
        { label: 'Фронтальная камера', value: '12 МП', key: true },
        { label: 'Видео', value: '4K, до 60 кадров/с' },
      ],
    },
    {
      title: 'Связь и интерфейсы',
      rows: [
        { label: 'Разъём', value: 'USB-C', key: true },
        { label: 'SIM-карты', value: 'nano-SIM и eSIM' },
        { label: 'Сети', value: '5G' },
        { label: 'Wi-Fi', value: 'Wi-Fi 6' },
        { label: 'Bluetooth', value: '5.3' },
        { label: 'NFC', value: 'Есть' },
      ],
    },
    {
      title: 'Корпус',
      rows: [
        { label: 'Защита от воды и пыли', value: 'IP68', key: true },
        { label: 'Размеры', value: '147,6 × 71,6 × 7,8 мм' },
        { label: 'Вес', value: '171 г' },
      ],
    },
    {
      title: 'Система',
      rows: [
        { label: 'Операционная система', value: 'iOS 17', key: true },
        { label: 'Разблокировка', value: 'Face ID' },
      ],
    },
  ],
  reviews: [
    {
      id: 'review-1',
      author: 'Анна К.',
      date: '14 сентября 2026',
      rating: 5,
      text: 'Перешла с iPhone 12 и сразу оценила USB-C: один кабель для всего. Камера днём снимает очень детально, розовый цвет вживую спокойный и приятный.',
      avatarSrc: PRODUCT_DETAILS_REVIEW_AVATARS.annaK,
    },
    {
      id: 'review-2',
      author: 'Дмитрий С.',
      date: '2 сентября 2026',
      rating: 4,
      text: 'Быстрый, удобный, Dynamic Island действительно полезен. Жаль, что экран 60 Гц — после Android это заметно, но к этому быстро привыкаешь.',
      avatarSrc: PRODUCT_DETAILS_REVIEW_AVATARS.dmitryS,
    },
    {
      id: 'review-3',
      author: 'Ольга М.',
      date: '28 августа 2026',
      rating: 5,
      text: 'Заказала вечером, забрала в магазине на следующий день. Телефон оригинальный, активировался без проблем.',
      avatarSrc: PRODUCT_DETAILS_REVIEW_AVATARS.olgaM,
    },
  ],
  trust: [
    { title: 'Гарантия', text: WARRANTY_TEXT, icon: 'check' },
    {
      title: 'Оригинальная продукция',
      text: 'Только официальные поставки',
      icon: 'package',
    },
    {
      title: 'Обмен и возврат',
      text: 'По условиям законодательства о защите прав потребителей',
      icon: 'return',
    },
  ],
};

function discountLabel(priceValue: number, oldPriceValue: number): string {
  return `-${String(Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100))}%`;
}

export function productDetailsSpecimenFromLive(
  product: ProductDetailsLiveProduct,
): ProductDetailsFixture | undefined {
  if (
    !isProductDetailsSpecimenSlug(product.slug) ||
    !product.name.endsWith(DEFAULT_COLOUR_SUFFIX)
  ) {
    return undefined;
  }

  const oldPriceValue =
    product.oldPriceValue !== undefined && product.oldPriceValue > product.priceValue
      ? product.oldPriceValue
      : undefined;

  return {
    ...PRODUCT_DETAILS_FIXTURE,
    baseTitle: product.name.slice(0, -DEFAULT_COLOUR_SUFFIX.length),
    priceValue: product.priceValue,
    oldPriceValue,
    discount:
      oldPriceValue === undefined ? undefined : discountLabel(product.priceValue, oldPriceValue),
    rating: product.rating,
    reviewCount: product.reviewCount,
    labels: product.isNew ? [NEW_LABEL, ...SPECIMEN_LABELS] : SPECIMEN_LABELS,
  };
}

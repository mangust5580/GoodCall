import { HOME_DEVICE_MEDIA } from '../../assets/media/home/homeMarketingMedia';
import type { BenefitItem } from '../../components/content';
import type { PictureSource } from '../../components/media';
import type { IconName } from '../../components/ui';

export interface CartCategory {
  readonly label: string;
  readonly icon: IconName;
  readonly linksToCatalog: boolean;
}

export interface CartRecommendation {
  readonly id: string;
  readonly title: string;
  readonly image: PictureSource;
  readonly imageAlt: string;
  readonly price: string;
  readonly oldPrice?: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly badge?: { readonly label: string; readonly tone: 'sale' | 'new' };
}

export const CART_CATEGORIES: readonly CartCategory[] = [
  { label: 'Смартфоны', icon: 'smartphone', linksToCatalog: true },
  { label: 'Ноутбуки', icon: 'laptop', linksToCatalog: false },
  { label: 'Наушники', icon: 'headphones', linksToCatalog: false },
  { label: 'Умные часы', icon: 'watch', linksToCatalog: false },
];

export const CART_BENEFITS: readonly BenefitItem[] = [
  { title: 'Официальная гарантия', note: 'от производителя на все товары', icon: 'check' },
  { title: 'Быстрая доставка', note: 'от 1 дня по всей России', icon: 'package' },
  { title: 'Удобная оплата', note: 'картой, через СБП, SberPay или T‑Pay', icon: 'scan-qr' },
  { title: 'Поддержка 24/7', note: 'ответим на вопросы в любое время', icon: 'headset' },
];

export const CART_RECOMMENDATIONS: readonly CartRecommendation[] = [
  {
    id: 'iphone-15-128',
    title: 'Apple iPhone 15 128 ГБ, Розовый',
    image: HOME_DEVICE_MEDIA.smartphone,
    imageAlt: 'Смартфон Apple iPhone 15',
    price: '79 990 ₽',
    oldPrice: '84 990 ₽',
    rating: 4.7,
    reviewCount: 1976,
    badge: { label: '-6%', tone: 'sale' },
  },
  {
    id: 'macbook-air-13-m2',
    title: 'Apple MacBook Air 13 M2 8/256 ГБ, Серый космос',
    image: HOME_DEVICE_MEDIA.laptop,
    imageAlt: 'Ноутбук Apple MacBook Air 13',
    price: '89 990 ₽',
    rating: 4.9,
    reviewCount: 156,
    badge: { label: 'Новинка', tone: 'new' },
  },
  {
    id: 'galaxy-s24-256',
    title: 'Samsung Galaxy S24 256 ГБ, Фиолетовый',
    image: HOME_DEVICE_MEDIA.smartphone,
    imageAlt: 'Смартфон Samsung Galaxy S24',
    price: '69 990 ₽',
    oldPrice: '77 990 ₽',
    rating: 4.7,
    reviewCount: 98,
    badge: { label: '-10%', tone: 'sale' },
  },
  {
    id: 'apple-watch-9-45',
    title: 'Apple Watch Series 9 45 мм, Чёрный',
    image: HOME_DEVICE_MEDIA.watch,
    imageAlt: 'Смарт-часы Apple Watch Series 9',
    price: '41 990 ₽',
    rating: 4.8,
    reviewCount: 211,
  },
  {
    id: 'airpods-pro-2',
    title: 'Apple AirPods Pro 2 (USB-C)',
    image: HOME_DEVICE_MEDIA.earbuds,
    imageAlt: 'Беспроводные наушники Apple AirPods Pro 2',
    price: '21 990 ₽',
    oldPrice: '27 490 ₽',
    rating: 4.9,
    reviewCount: 302,
    badge: { label: '-20%', tone: 'sale' },
  },
];

import type { IconName } from '../../components/ui';

export type HomeArtwork = 'phone' | 'laptop' | 'earbuds';

export interface HomeHeroOffer {
  readonly id: string;
  readonly title: string;
  readonly spec: string;
  readonly price: string;
  readonly imageAlt: string;
  readonly image: HomeArtwork;
}

export interface HomeBenefit {
  readonly title: string;
  readonly note: string;
  readonly icon: IconName;
}

export interface HomeCategoryPromo {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: HomeArtwork;
}

export interface HomeCategoryTile {
  readonly label: string;
  readonly icon: IconName;
}

export interface HomeProduct {
  readonly id: string;
  readonly title: string;
  readonly imageAlt: string;
  readonly price: string;
  readonly oldPrice?: string;
  readonly badge?: string;
  readonly badgeTone?: 'sale' | 'new';
  readonly image: HomeArtwork;
}

export interface HomeArticle {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly date: string;
}

export const HOME_HERO_OFFERS: readonly HomeHeroOffer[] = [
  {
    id: 'iphone-15',
    title: 'iPhone 15',
    spec: '128 ГБ, розовый',
    price: '64 990 ₽',
    imageAlt: 'Смартфон iPhone 15',
    image: 'phone',
  },
  {
    id: 'galaxy-s24',
    title: 'Samsung Galaxy S24',
    spec: '256 ГБ, фиолетовый',
    price: '69 990 ₽',
    imageAlt: 'Смартфон Samsung Galaxy S24',
    image: 'phone',
  },
  {
    id: 'apple-watch-se',
    title: 'Apple Watch SE',
    spec: 'GPS, 40 мм',
    price: '19 990 ₽',
    imageAlt: 'Смарт-часы Apple Watch SE',
    image: 'earbuds',
  },
];

export const HOME_BENEFITS: readonly HomeBenefit[] = [
  { title: 'Гарантия до 24 месяцев', note: 'на все товары', icon: 'check' },
  { title: 'Оригинальная продукция', note: 'только официальные поставки', icon: 'package' },
  { title: 'Быстрая доставка', note: 'от 1 дня по всей России', icon: 'store' },
  { title: 'Поддержка 24/7', note: 'мы всегда на связи', icon: 'headset' },
];

export const HOME_CATEGORY_PROMOS: readonly HomeCategoryPromo[] = [
  {
    id: 'accessories',
    title: 'Аксессуары для смартфонов',
    description: 'Чехлы, зарядные устройства, кабели и многое другое',
    image: 'earbuds',
  },
  {
    id: 'watches',
    title: 'Умные часы нового поколения',
    description: 'Следите за здоровьем, спортом и делами',
    image: 'phone',
  },
  {
    id: 'audio',
    title: 'Наушники и аудиотехника',
    description: 'Премиальный звук для каждого',
    image: 'earbuds',
  },
];

export const HOME_CATEGORY_TILES: readonly HomeCategoryTile[] = [
  { label: 'Смартфоны', icon: 'smartphone' },
  { label: 'Ноутбуки', icon: 'laptop' },
  { label: 'Планшеты', icon: 'tablet' },
  { label: 'Умные часы', icon: 'watch' },
  { label: 'Наушники', icon: 'headphones' },
  { label: 'Аксессуары', icon: 'accessories' },
  { label: 'Игры и консоли', icon: 'gamepad' },
  { label: 'Телевизоры', icon: 'tv' },
];

export const HOME_PRODUCTS: readonly HomeProduct[] = [
  {
    id: 'iphone-15-128',
    title: 'Apple iPhone 15 128 ГБ, Чёрный',
    imageAlt: 'Смартфон Apple iPhone 15 в чёрном цвете',
    price: '64 990 ₽',
    oldPrice: '73 990 ₽',
    badge: '-12%',
    badgeTone: 'sale',
    image: 'phone',
  },
  {
    id: 'galaxy-s24-256',
    title: 'Samsung Galaxy S24 256 ГБ, Фиолетовый',
    imageAlt: 'Смартфон Samsung Galaxy S24 в фиолетовом цвете',
    price: '69 990 ₽',
    badge: 'Новинка',
    badgeTone: 'new',
    image: 'phone',
  },
  {
    id: 'redmi-note-13-pro',
    title: 'Xiaomi Redmi Note 13 Pro 12/512 ГБ',
    imageAlt: 'Смартфон Xiaomi Redmi Note 13 Pro',
    price: '23 990 ₽',
    oldPrice: '26 990 ₽',
    badge: '-10%',
    badgeTone: 'sale',
    image: 'phone',
  },
  {
    id: 'airpods-pro-2',
    title: 'Apple AirPods Pro 2 (USB-C)',
    imageAlt: 'Беспроводные наушники Apple AirPods Pro 2',
    price: '24 990 ₽',
    image: 'earbuds',
  },
  {
    id: 'apple-watch-9-45',
    title: 'Apple Watch Series 9 45 мм, Чёрный',
    imageAlt: 'Смарт-часы Apple Watch Series 9',
    price: '44 990 ₽',
    oldPrice: '52 990 ₽',
    badge: '-15%',
    badgeTone: 'sale',
    image: 'earbuds',
  },
];

export const HOME_ARTICLES: readonly HomeArticle[] = [
  {
    id: 'iphone-15-review',
    title: 'Обзор iPhone 15: что нового?',
    excerpt: 'Подробный обзор новой флагманской модели',
    date: '12 мая 2024',
  },
  {
    id: 'galaxy-s24-first-look',
    title: 'Samsung Galaxy S24: первые впечатления',
    excerpt: 'Делимся впечатлениями от нового флагмана',
    date: '8 мая 2024',
  },
  {
    id: 'how-to-pick-a-watch',
    title: 'Как выбрать смарт-часы?',
    excerpt: 'Гид по выбору идеальных смарт-часов для ваших задач',
    date: '5 мая 2024',
  },
];

export const HOME_CINEMA_POINTS: readonly string[] = [
  'Тысячи фильмов и сериалов',
  'Без рекламы и в высоком качестве',
  'Скачивайте и смотрите оффлайн',
];

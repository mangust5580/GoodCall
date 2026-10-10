import { STOREFRONT_SUPPORT } from '../../commerce/storefront';
import type { BenefitItem } from '../../components/content';
import type { IconName } from '../../components/ui';

export interface CartCategory {
  readonly label: string;
  readonly icon: IconName;
  readonly linksToCatalog: boolean;
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
  { title: 'Поддержка', note: STOREFRONT_SUPPORT.hours, icon: 'headset' },
];

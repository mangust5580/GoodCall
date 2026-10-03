import { DEMO_STORES } from '../../commerce/shops';
import {
  PRODUCT_TRUST,
  PRODUCT_WARRANTY_TEXT as WARRANTY_TEXT,
  STOREFRONT_PAYMENT_METHODS,
  STOREFRONT_SUPPORT,
} from '../../commerce/storefront';
import type {
  ProductDetailsPaymentMethod,
  ProductDetailsStorewide,
  ProductDetailsTrustItem,
} from './productDetailsView';

const storePluralRules = new Intl.PluralRules('ru-RU');

const STORE_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'магазинов',
  one: 'магазина',
  two: 'магазинов',
  few: 'магазинов',
  many: 'магазинов',
  other: 'магазина',
};

export function pickupStoresLine(count: number): string {
  return `Из ${String(count)} ${STORE_WORDS[storePluralRules.select(count)]}`;
}

export const STOREWIDE_PAYMENT_METHODS: readonly ProductDetailsPaymentMethod[] =
  STOREFRONT_PAYMENT_METHODS.map(({ id, label, icon, mark }) =>
    mark === undefined ? { id, label, icon } : { id, label, icon, mark },
  );

export const STOREWIDE_TRUST: readonly ProductDetailsTrustItem[] = PRODUCT_TRUST;

export const STOREWIDE_SUPPORT = {
  supportPhone: STOREFRONT_SUPPORT.phone,
  supportPhoneHref: STOREFRONT_SUPPORT.phoneHref,
  supportHours: STOREFRONT_SUPPORT.hours,
  chatNote: 'Ответим в течение 1 минуты',
} as const;

export { WARRANTY_TEXT };

export const PRODUCT_DETAILS_STOREWIDE: ProductDetailsStorewide = {
  installmentMonths: 36,
  services: [
    {
      kind: 'delivery',
      title: 'Доставка курьером',
      lines: ['Дата и время — при оформлении'],
      icon: 'package',
    },
    {
      kind: 'delivery',
      title: 'Самовывоз',
      lines: [pickupStoresLine(DEMO_STORES.length)],
      icon: 'map-pin',
    },
    { kind: 'warranty', title: 'Гарантия', lines: [WARRANTY_TEXT], icon: 'check' },
  ],
  paymentMethods: STOREWIDE_PAYMENT_METHODS,
  trust: STOREWIDE_TRUST,
  ...STOREWIDE_SUPPORT,
};

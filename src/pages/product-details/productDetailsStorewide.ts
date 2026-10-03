import paymentMir from '../../assets/commerce/payment-mir.svg';
import paymentSberpay from '../../assets/commerce/payment-sberpay.svg';
import paymentSbp from '../../assets/commerce/payment-sbp.svg';
import paymentTpay from '../../assets/commerce/payment-tpay.svg';
import { DEMO_STORES } from '../stores/storeData';
import type {
  ProductDetailsPaymentMethod,
  ProductDetailsService,
  ProductDetailsTrustItem,
} from './productDetailsView';

export interface ProductDetailsStorewide {
  readonly installmentMonths: number;
  readonly services: readonly ProductDetailsService[];
  readonly paymentMethods: readonly ProductDetailsPaymentMethod[];
  readonly trust: readonly ProductDetailsTrustItem[];
  readonly supportPhone: string;
  readonly supportPhoneHref: string;
  readonly supportHours: string;
  readonly chatNote: string;
}

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

export const WARRANTY_TEXT = 'Официальная гарантия 12 месяцев';

export const STOREWIDE_PAYMENT_METHODS: readonly ProductDetailsPaymentMethod[] = [
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
];

export const STOREWIDE_TRUST: readonly ProductDetailsTrustItem[] = [
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
];

export const STOREWIDE_SUPPORT = {
  supportPhone: '8 800 100-10-19',
  supportPhoneHref: 'tel:88001001019',
  supportHours: 'Ежедневно с 9:00 до 21:00',
  chatNote: 'Ответим в течение 1 минуты',
} as const;

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

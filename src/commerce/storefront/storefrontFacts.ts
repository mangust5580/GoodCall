import paymentMir from '../../assets/commerce/payment-mir.svg';
import paymentSbp from '../../assets/commerce/payment-sbp.svg';
import type { IconName } from '../../components/ui';

export interface StorefrontPaymentMark {
  readonly src: string;
  readonly alt: string;
  readonly modifier: string;
}

export type StorefrontPaymentMethodId = 'card' | 'sbp' | 'cash';

export interface StorefrontPaymentMethod {
  readonly id: StorefrontPaymentMethodId;
  readonly label: string;
  readonly description: string;
  readonly icon: IconName;
  readonly mark?: StorefrontPaymentMark;
}

export type StorefrontPaymentTiming = 'online' | 'on-receipt';

export interface StorefrontPaymentOption {
  readonly value: string;
  readonly label: string;
  readonly method: StorefrontPaymentMethodId;
  readonly timing: StorefrontPaymentTiming;
}

export interface StorefrontDeliverySlot {
  readonly value: string;
  readonly label: string;
}

export interface StorefrontTrustItem {
  readonly title: string;
  readonly text: string;
  readonly icon: IconName;
}

export const MIR_MARK: StorefrontPaymentMark = { src: paymentMir, alt: 'МИР', modifier: 'mir' };
export const SBP_MARK: StorefrontPaymentMark = { src: paymentSbp, alt: 'СБП', modifier: 'sbp' };

export const STOREFRONT_PAYMENT_METHODS: readonly StorefrontPaymentMethod[] = [
  {
    id: 'card',
    label: 'Банковская карта',
    description: 'Онлайн при оформлении заказа или картой при получении',
    icon: 'credit-card',
    mark: MIR_MARK,
  },
  {
    id: 'sbp',
    label: 'СБП',
    description: 'Онлайн при оформлении заказа через Систему быстрых платежей',
    icon: 'scan-qr',
    mark: SBP_MARK,
  },
  {
    id: 'cash',
    label: 'Наличные',
    description: 'При получении заказа — курьеру или в магазине',
    icon: 'banknote',
  },
];

export const STOREFRONT_PAYMENT_OPTIONS: readonly StorefrontPaymentOption[] = [
  { value: 'card-online', label: 'Банковской картой онлайн', method: 'card', timing: 'online' },
  { value: 'sbp', label: 'СБП', method: 'sbp', timing: 'online' },
  {
    value: 'card-on-delivery',
    label: 'При получении картой',
    method: 'card',
    timing: 'on-receipt',
  },
  { value: 'cash', label: 'Наличными', method: 'cash', timing: 'on-receipt' },
];

export function storefrontPaymentMethod(id: StorefrontPaymentMethodId): StorefrontPaymentMethod {
  const method = STOREFRONT_PAYMENT_METHODS.find((item) => item.id === id);

  if (method === undefined) {
    throw new Error(`Unknown storefront payment method: ${id}`);
  }

  return method;
}

export const STOREFRONT_PAYMENT_MARKS: readonly StorefrontPaymentMark[] =
  STOREFRONT_PAYMENT_METHODS.flatMap((method) => (method.mark === undefined ? [] : [method.mark]));

export const STOREFRONT_DELIVERY_SLOTS: readonly StorefrontDeliverySlot[] = [
  { value: '10-14', label: '10:00 – 14:00' },
  { value: '14-18', label: '14:00 – 18:00' },
  { value: '18-22', label: '18:00 – 22:00' },
];

export const STOREFRONT_SUPPORT = {
  phone: '8 800 100-10-10',
  phoneHref: 'tel:+78001001010',
  email: 'support@goodcall.example',
  emailHref: 'mailto:support@goodcall.example',
  hours: 'Ежедневно с 9:00 до 21:00',
} as const;

export const PRODUCT_WARRANTY_MONTHS = 12;

export const PRODUCT_WARRANTY_TEXT = `Официальная гарантия ${String(PRODUCT_WARRANTY_MONTHS)} месяцев`;

export const WARRANTY_TERM_NOTE = 'Срок указан для конкретного товара';

const ORIGINAL_PRODUCTS_ITEM: StorefrontTrustItem = {
  title: 'Оригинальная продукция',
  text: 'Только официальные поставки',
  icon: 'package',
};

const RETURNS_ITEM: StorefrontTrustItem = {
  title: 'Обмен и возврат',
  text: 'По условиям законодательства о защите прав потребителей',
  icon: 'return',
};

export const STOREFRONT_TRUST: readonly StorefrontTrustItem[] = [
  { title: 'Официальная гарантия', text: WARRANTY_TERM_NOTE, icon: 'shield' },
  ORIGINAL_PRODUCTS_ITEM,
  RETURNS_ITEM,
];

export const PRODUCT_TRUST: readonly StorefrontTrustItem[] = [
  { title: 'Гарантия', text: PRODUCT_WARRANTY_TEXT, icon: 'check' },
  ORIGINAL_PRODUCTS_ITEM,
  RETURNS_ITEM,
];

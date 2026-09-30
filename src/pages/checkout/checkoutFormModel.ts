import paymentMir from '../../assets/commerce/payment-mir.svg';
import paymentSbp from '../../assets/commerce/payment-sbp.svg';
import type { BenefitItem } from '../../components/content';
import type { CityOption } from '../../components/location';
import { findStore } from '../stores';
import type { StorePoint } from '../stores';

export type CheckoutDeliveryMethod = 'courier' | 'pickup';

export interface CheckoutFormState {
  readonly deliveryMethod: CheckoutDeliveryMethod;
  readonly pickupStoreId: StorePoint['id'] | null;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly email: string;
  readonly city: string;
  readonly cityFiasId: string;
  readonly cityRegion: string;
  readonly street: string;
  readonly streetFiasId: string;
  readonly house: string;
  readonly houseFiasId: string;
  readonly apartment: string;
  readonly addressMode: CheckoutAddressMode;
  readonly manualFrom: CheckoutAddressLevel | null;
  readonly courierComment: string;
  readonly deliveryDate: string;
  readonly deliverySlot: string;
  readonly payment: string;
  readonly orderComment: string;
}

export type CheckoutAddressMode = 'provider' | 'manual';

export type CheckoutAddressLevel = 'city' | 'street' | 'house';

const ADDRESS_LEVEL_ORDER: readonly CheckoutAddressLevel[] = ['city', 'street', 'house'];

export function isManualAddressLevel(
  form: Pick<CheckoutFormState, 'addressMode' | 'manualFrom'>,
  level: CheckoutAddressLevel,
): boolean {
  if (form.addressMode === 'manual') {
    return true;
  }

  return (
    form.manualFrom !== null &&
    ADDRESS_LEVEL_ORDER.indexOf(level) >= ADDRESS_LEVEL_ORDER.indexOf(form.manualFrom)
  );
}

export function isAddressLevelConfirmed(
  form: CheckoutFormState,
  level: CheckoutAddressLevel,
): boolean {
  const fiasId = { city: form.cityFiasId, street: form.streetFiasId, house: form.houseFiasId }[
    level
  ];

  return fiasId !== '' || isManualAddressLevel(form, level);
}

export type CheckoutValidatedField =
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'email'
  | 'city'
  | 'street'
  | 'house'
  | 'apartment'
  | 'deliveryDate'
  | 'deliverySlot'
  | 'pickupStore'
  | 'payment';

export type CheckoutErrors = Partial<Record<CheckoutValidatedField, string>>;

export const CHECKOUT_FIELD_ORDER: readonly CheckoutValidatedField[] = [
  'firstName',
  'lastName',
  'phone',
  'email',
  'city',
  'street',
  'house',
  'apartment',
  'deliveryDate',
  'deliverySlot',
  'pickupStore',
  'payment',
];

export function checkoutControlId(field: CheckoutValidatedField): string {
  return `checkout-${field}`;
}

export const CHECKOUT_MAX_LENGTH = {
  firstName: 50,
  lastName: 60,
  email: 254,
  city: 80,
  street: 120,
  house: 20,
  apartment: 10,
  courierComment: 300,
  orderComment: 500,
} as const;

export interface CheckoutChoice {
  readonly value: string;
  readonly label: string;
}

export const CHECKOUT_DELIVERY_SLOTS: readonly CheckoutChoice[] = [
  { value: '10-14', label: '10:00 – 14:00' },
  { value: '14-18', label: '14:00 – 18:00' },
  { value: '18-22', label: '18:00 – 22:00' },
];

export interface CheckoutPaymentMark {
  readonly src: string;
  readonly alt: string;
  readonly modifier: string;
}

export interface CheckoutPaymentMethod {
  readonly value: string;
  readonly label: string;
  readonly marks: readonly CheckoutPaymentMark[];
}

const MIR_MARK: CheckoutPaymentMark = { src: paymentMir, alt: 'МИР', modifier: 'mir' };
const SBP_MARK: CheckoutPaymentMark = { src: paymentSbp, alt: 'СБП', modifier: 'sbp' };

export const CHECKOUT_PAYMENT_METHODS: readonly CheckoutPaymentMethod[] = [
  { value: 'card-online', label: 'Банковской картой онлайн', marks: [MIR_MARK] },
  { value: 'sbp', label: 'СБП', marks: [SBP_MARK] },
  { value: 'card-on-delivery', label: 'При получении картой', marks: [MIR_MARK] },
  { value: 'cash', label: 'Наличными', marks: [] },
];

export const CHECKOUT_BENEFITS: readonly BenefitItem[] = [
  { title: 'Официальная гарантия', note: 'от производителя на все товары', icon: 'check' },
  { title: 'Быстрая доставка', note: 'от 1 дня по всей России', icon: 'package' },
  { title: 'Удобная оплата', note: 'онлайн или при получении', icon: 'scan-qr' },
  { title: 'Поддержка 24/7', note: 'ответим на вопросы в любое время', icon: 'headset' },
];

const DELIVERY_DAY_COUNT = 7;

const dayMonthFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' });

function dateValue(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
}

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase('ru-RU') + value.slice(1);
}

export function checkoutDeliveryDates(today: Date): readonly CheckoutChoice[] {
  return Array.from({ length: DELIVERY_DAY_COUNT }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index + 1);
    const day = index === 0 ? 'Завтра' : capitalize(weekdayFormatter.format(date));

    return { value: dateValue(date), label: `${day}, ${dayMonthFormatter.format(date)}` };
  });
}

export function initialCheckoutForm(
  city: CityOption | null,
  deliveryDate: string,
  addressMode: CheckoutAddressMode,
): CheckoutFormState {
  return {
    deliveryMethod: 'courier',
    pickupStoreId: null,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: city?.name ?? '',
    cityFiasId: addressMode === 'provider' ? (city?.fiasId ?? '') : '',
    cityRegion: addressMode === 'provider' ? (city?.region ?? '') : '',
    street: '',
    streetFiasId: '',
    house: '',
    houseFiasId: '',
    apartment: '',
    addressMode,
    manualFrom: null,
    courierComment: '',
    deliveryDate,
    deliverySlot: '',
    payment: '',
    orderComment: '',
  };
}

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PERSON_NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:[ '’-]\p{L}[\p{L}\p{M}]*)*$/u;
const PLACE_NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:(?:[ '’-]|\. ?)\p{L}[\p{L}\p{M}]*)*$/u;
const HAS_LETTER = /\p{L}/u;
const HAS_LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/gu, ' ');
}

export function formatCourierAddress(
  form: Pick<CheckoutFormState, 'city' | 'street' | 'house' | 'apartment'>,
): string {
  const apartment = normalizeText(form.apartment);
  const parts = [normalizeText(form.city), normalizeText(form.street), normalizeText(form.house)];

  return [...parts, ...(apartment === '' ? [] : [`кв. ${apartment}`])].join(', ');
}

export function normalizeCheckoutForm(form: CheckoutFormState): CheckoutFormState {
  return {
    ...form,
    firstName: normalizeText(form.firstName),
    lastName: normalizeText(form.lastName),
    email: form.email.trim(),
    city: normalizeText(form.city),
    street: normalizeText(form.street),
    house: normalizeText(form.house),
    apartment: normalizeText(form.apartment),
    courierComment: form.courierComment.trim(),
    orderComment: form.orderComment.trim(),
  };
}

function personNameError(value: string, missing: string, invalid: string): string | undefined {
  const normalized = normalizeText(value);

  if (normalized === '') {
    return missing;
  }

  return PERSON_NAME_PATTERN.test(normalized) ? undefined : invalid;
}

function cityError(form: CheckoutFormState): string | undefined {
  const normalized = normalizeText(form.city);

  if (!isManualAddressLevel(form, 'city')) {
    return form.cityFiasId === '' ? 'Выберите город из списка' : undefined;
  }

  if (normalized === '') {
    return 'Укажите город';
  }

  return PLACE_NAME_PATTERN.test(normalized)
    ? undefined
    : 'Название города может содержать буквы, пробел, дефис и точку';
}

function streetError(form: CheckoutFormState): string | undefined {
  if (!isManualAddressLevel(form, 'street')) {
    if (!isAddressLevelConfirmed(form, 'city')) {
      return undefined;
    }

    return form.streetFiasId === '' ? 'Выберите улицу из списка' : undefined;
  }

  const street = normalizeText(form.street);

  if (street === '') {
    return 'Укажите улицу';
  }

  return HAS_LETTER.test(street) ? undefined : 'Укажите название улицы';
}

function houseError(form: CheckoutFormState): string | undefined {
  if (!isManualAddressLevel(form, 'house')) {
    if (!isAddressLevelConfirmed(form, 'street')) {
      return undefined;
    }

    return form.houseFiasId === '' ? 'Выберите дом из списка' : undefined;
  }

  const house = normalizeText(form.house);

  if (house === '') {
    return 'Укажите дом';
  }

  return HAS_LETTER_OR_DIGIT.test(house) ? undefined : 'Укажите номер дома';
}

export function validateCheckoutForm(form: CheckoutFormState): CheckoutErrors {
  const errors: Partial<Record<CheckoutValidatedField, string>> = {};
  const nameHint = 'может содержать буквы, пробел, дефис и апостроф';

  errors.firstName = personNameError(form.firstName, 'Укажите имя', `Имя ${nameHint}`);
  errors.lastName = personNameError(form.lastName, 'Укажите фамилию', `Фамилия ${nameHint}`);

  if (form.phone.trim() === '') {
    errors.phone = 'Укажите номер телефона';
  } else if (!PHONE_PATTERN.test(form.phone)) {
    errors.phone = 'Введите номер полностью: +7 (XXX) XXX-XX-XX';
  }

  if (form.email.trim() === '') {
    errors.email = 'Укажите e-mail';
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Проверьте e-mail: например, name@example.ru';
  }

  if (form.deliveryMethod === 'pickup') {
    if (findStore(form.pickupStoreId) === undefined) {
      errors.pickupStore = 'Выберите магазин для самовывоза';
    }
  } else {
    errors.city = cityError(form);
    errors.street = streetError(form);
    errors.house = houseError(form);

    const apartment = normalizeText(form.apartment);

    if (apartment !== '' && !HAS_LETTER_OR_DIGIT.test(apartment)) {
      errors.apartment = 'Укажите номер квартиры или оставьте поле пустым';
    }

    if (form.deliveryDate.trim() === '') {
      errors.deliveryDate = 'Выберите дату доставки';
    }

    if (form.deliverySlot.trim() === '') {
      errors.deliverySlot = 'Выберите интервал доставки';
    }
  }

  if (form.payment.trim() === '') {
    errors.payment = 'Выберите способ оплаты';
  }

  return errors;
}

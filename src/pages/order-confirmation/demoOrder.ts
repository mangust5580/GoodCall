import { toCartLineImage } from '../../commerce/cart';
import type { CartLine, CartLineImage, CartTotals } from '../../commerce/cart';
import type { StorePoint } from '../../commerce/shops';
import { CHECKOUT_PAYMENT_METHODS, formatCourierAddress } from '../checkout';
import type { CheckoutFormState } from '../checkout';
import { STOREFRONT_DELIVERY_SLOTS } from '../../commerce/storefront';

export interface DemoOrderLine {
  readonly title: string;
  readonly variant?: string;
  readonly image: CartLineImage;
  readonly price: number;
  readonly oldPrice?: number;
  readonly quantity: number;
}

export interface DemoOrderTotals {
  readonly unitCount: number;
  readonly listTotal: number;
  readonly discount: number;
  readonly total: number;
}

export interface DemoOrderCourier {
  readonly address: string;
  readonly date: string;
  readonly slot: string;
}

export interface DemoOrder {
  readonly number: string;
  readonly createdAt: string;
  readonly lines: readonly DemoOrderLine[];
  readonly totals: DemoOrderTotals;
  readonly deliveryMethod: 'courier' | 'pickup';
  readonly courier?: DemoOrderCourier;
  readonly pickupStoreId?: StorePoint['id'];
  readonly payment: string;
}

export interface DemoOrderInput {
  readonly form: CheckoutFormState;
  readonly lines: readonly CartLine[];
  readonly totals: CartTotals;
  readonly now: Date;
}

export const DEMO_ORDER_STORAGE_KEY = 'goodcall.lastOrder.v1';

const ORDER_NUMBER_PATTERN = /^GC-\d{8}-[0-9A-Z]{4}$/;
const SUFFIX_ALPHABET = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const SUFFIX_LENGTH = 4;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

let memoryOrder: DemoOrder | undefined;

function orderSuffix(): string {
  const values = crypto.getRandomValues(new Uint32Array(SUFFIX_LENGTH));

  return Array.from(values, (value) => SUFFIX_ALPHABET[value % SUFFIX_ALPHABET.length]).join('');
}

function compactDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${String(date.getFullYear())}${month}${day}`;
}

export function createDemoOrder({ form, lines, totals, now }: DemoOrderInput): DemoOrder {
  const base = {
    number: `GC-${compactDate(now)}-${orderSuffix()}`,
    createdAt: now.toISOString(),
    lines: lines.map(({ title, variant, image, price, oldPrice, quantity }) => ({
      title,
      ...(variant === undefined ? {} : { variant }),
      image,
      price,
      ...(oldPrice === undefined ? {} : { oldPrice }),
      quantity,
    })),
    totals: {
      unitCount: totals.selectedUnitCount,
      listTotal: totals.selectedListTotal,
      discount: totals.selectedDiscount,
      total: totals.selectedTotal,
    },
    payment: form.payment,
  };

  if (form.deliveryMethod === 'pickup' && form.pickupStoreId !== null) {
    return { ...base, deliveryMethod: 'pickup', pickupStoreId: form.pickupStoreId };
  }

  return {
    ...base,
    deliveryMethod: 'courier',
    courier: {
      address: formatCourierAddress(form),
      date: form.deliveryDate,
      slot: form.deliverySlot,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function positiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function nonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function toOrderLine(value: unknown): DemoOrderLine | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const { title, variant, image, price, oldPrice, quantity } = value;
  const lineImage = toCartLineImage(image);

  if (
    !nonEmptyString(title) ||
    (variant !== undefined && !nonEmptyString(variant)) ||
    lineImage === undefined ||
    !positiveNumber(price) ||
    (oldPrice !== undefined && !positiveNumber(oldPrice)) ||
    !Number.isInteger(quantity) ||
    !positiveNumber(quantity)
  ) {
    return undefined;
  }

  return {
    title,
    ...(variant === undefined ? {} : { variant }),
    image: lineImage,
    price,
    ...(oldPrice === undefined ? {} : { oldPrice }),
    quantity,
  };
}

function toDemoOrder(value: unknown): DemoOrder | undefined {
  if (!isRecord(value) || !Array.isArray(value.lines) || !isRecord(value.totals)) {
    return undefined;
  }

  const { number, createdAt, deliveryMethod, courier, pickupStoreId, payment } = value;
  const lines = (value.lines as readonly unknown[]).map(toOrderLine);
  const { unitCount, listTotal, discount, total } = value.totals;

  if (
    typeof number !== 'string' ||
    !ORDER_NUMBER_PATTERN.test(number) ||
    typeof createdAt !== 'string' ||
    Number.isNaN(Date.parse(createdAt)) ||
    lines.length === 0 ||
    lines.some((line) => line === undefined) ||
    !positiveNumber(unitCount) ||
    !nonNegativeNumber(listTotal) ||
    !nonNegativeNumber(discount) ||
    !nonNegativeNumber(total) ||
    !CHECKOUT_PAYMENT_METHODS.some((method) => method.value === payment)
  ) {
    return undefined;
  }

  const base = {
    number,
    createdAt,
    lines: lines as readonly DemoOrderLine[],
    totals: { unitCount, listTotal, discount, total },
    payment: payment as string,
  };

  if (deliveryMethod === 'pickup' && nonEmptyString(pickupStoreId)) {
    return { ...base, deliveryMethod, pickupStoreId };
  }

  if (
    deliveryMethod === 'courier' &&
    isRecord(courier) &&
    nonEmptyString(courier.address) &&
    typeof courier.date === 'string' &&
    DATE_PATTERN.test(courier.date) &&
    STOREFRONT_DELIVERY_SLOTS.some((slot) => slot.value === courier.slot)
  ) {
    return {
      ...base,
      deliveryMethod,
      courier: { address: courier.address, date: courier.date, slot: courier.slot as string },
    };
  }

  return undefined;
}

function removeStoredOrder(): void {
  try {
    window.sessionStorage.removeItem(DEMO_ORDER_STORAGE_KEY);
  } catch {
    return;
  }
}

export function saveDemoOrder(order: DemoOrder): void {
  memoryOrder = order;

  try {
    window.sessionStorage.setItem(DEMO_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    return;
  }
}

export function readDemoOrder(): DemoOrder | undefined {
  let raw: string | null;

  try {
    raw = window.sessionStorage.getItem(DEMO_ORDER_STORAGE_KEY);
  } catch {
    return memoryOrder;
  }

  if (raw === null) {
    return memoryOrder;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    removeStoredOrder();

    return undefined;
  }

  const order = toDemoOrder(parsed);

  if (order === undefined) {
    removeStoredOrder();
  }

  return order;
}

import { PRODUCT_DETAILS_FIXTURE } from '../product-details/productDetailsFixtures';
import type { ProductDetailsColourId } from '../product-details/productDetailsFixtures';

export type CartLineImage =
  | { readonly kind: 'url'; readonly src: string }
  | { readonly kind: 'catalog-fallback' }
  | { readonly kind: 'product-details'; readonly colourId: ProductDetailsColourId };

export interface CartLine {
  readonly id: string;
  readonly productSlug: string;
  readonly title: string;
  readonly variant?: string;
  readonly image: CartLineImage;
  readonly price: number;
  readonly oldPrice?: number;
  readonly quantity: number;
  readonly selected: boolean;
}

export type CartLineInput = Omit<CartLine, 'quantity' | 'selected'>;

export const CART_STORAGE_KEY = 'goodcall.cart.v1';
export const CART_MIN_QUANTITY = 1;
export const CART_MAX_QUANTITY = 99;

type Listener = () => void;

const listeners = new Set<Listener>();
let lines: readonly CartLine[] | undefined;

function clampQuantity(quantity: number): number {
  return Math.min(CART_MAX_QUANTITY, Math.max(CART_MIN_QUANTITY, Math.trunc(quantity)));
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function positiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function toCartLineImage(value: unknown): CartLineImage | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const { kind, src, colourId } = value as Record<string, unknown>;

  if (kind === 'url' && nonEmptyString(src)) {
    return { kind, src };
  }

  if (kind === 'catalog-fallback') {
    return { kind };
  }

  if (
    kind === 'product-details' &&
    typeof colourId === 'string' &&
    Object.hasOwn(PRODUCT_DETAILS_FIXTURE.galleryByColour, colourId)
  ) {
    return { kind, colourId: colourId as ProductDetailsColourId };
  }

  return undefined;
}

function toCartLine(value: unknown): CartLine | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const { id, productSlug, title, variant, image, price, oldPrice, quantity, selected } =
    value as Record<string, unknown>;
  const lineImage = toCartLineImage(image);

  if (
    !nonEmptyString(id) ||
    !nonEmptyString(productSlug) ||
    !nonEmptyString(title) ||
    (variant !== undefined && !nonEmptyString(variant)) ||
    lineImage === undefined ||
    !positiveNumber(price) ||
    (oldPrice !== undefined && !positiveNumber(oldPrice)) ||
    typeof quantity !== 'number' ||
    !Number.isInteger(quantity) ||
    quantity < CART_MIN_QUANTITY ||
    quantity > CART_MAX_QUANTITY ||
    typeof selected !== 'boolean'
  ) {
    return undefined;
  }

  return { id, productSlug, title, variant, image: lineImage, price, oldPrice, quantity, selected };
}

function parseStoredLines(raw: string): readonly CartLine[] | undefined {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return undefined;
  }

  const { lines: storedLines } = parsed as Record<string, unknown>;

  if (!Array.isArray(storedLines)) {
    return undefined;
  }

  const result: CartLine[] = [];
  const ids = new Set<string>();

  for (const entry of storedLines) {
    const line = toCartLine(entry);

    if (line === undefined || ids.has(line.id)) {
      return undefined;
    }

    ids.add(line.id);
    result.push(line);
  }

  return result;
}

function readStoredLines(): readonly CartLine[] {
  let raw: string | null;

  try {
    raw = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return [];
  }

  if (raw === null) {
    return [];
  }

  const stored = parseStoredLines(raw);

  if (stored === undefined) {
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      return [];
    }

    return [];
  }

  return stored;
}

function writeStoredLines(next: readonly CartLine[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ lines: next }));
  } catch {
    return;
  }
}

function currentLines(): readonly CartLine[] {
  lines ??= readStoredLines();

  return lines;
}

function commit(next: readonly CartLine[]): void {
  lines = next;
  writeStoredLines(next);
  listeners.forEach((listener) => {
    listener();
  });
}

function update(transform: (current: readonly CartLine[]) => readonly CartLine[]): void {
  commit(transform(currentLines()));
}

export function subscribeCart(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getCartLines(): readonly CartLine[] {
  return currentLines();
}

export function cartLineId(productSlug: string, variantKey?: readonly string[]): string {
  return variantKey === undefined || variantKey.length === 0
    ? productSlug
    : [productSlug, ...variantKey].join('|');
}

export function addCartLine(input: CartLineInput, quantity: number): number {
  const existing = currentLines().find((line) => line.id === input.id);
  const nextQuantity = clampQuantity((existing?.quantity ?? 0) + quantity);

  update((current) =>
    existing === undefined
      ? [...current, { ...input, quantity: nextQuantity, selected: true }]
      : current.map((line) => (line.id === input.id ? { ...line, quantity: nextQuantity } : line)),
  );

  return nextQuantity;
}

export function setCartLineQuantity(id: string, quantity: number): void {
  update((current) =>
    current.map((line) => (line.id === id ? { ...line, quantity: clampQuantity(quantity) } : line)),
  );
}

export function toggleCartLine(id: string, selected: boolean): void {
  update((current) => current.map((line) => (line.id === id ? { ...line, selected } : line)));
}

export function toggleAllCartLines(selected: boolean): void {
  update((current) => current.map((line) => ({ ...line, selected })));
}

export function removeCartLine(id: string): void {
  update((current) => current.filter((line) => line.id !== id));
}

export function removeSelectedCartLines(): void {
  update((current) => current.filter((line) => !line.selected));
}

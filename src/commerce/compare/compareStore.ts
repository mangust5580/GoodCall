import { toCartLineImage } from '../cart/cartStore';
import type { CartLineImage } from '../cart/cartStore';

export interface CompareItem {
  readonly slug: string;
  readonly title: string;
  readonly image: CartLineImage;
  readonly price: number;
  readonly oldPrice?: number;
  readonly rating?: number;
  readonly reviewCount: number;
  readonly brand?: string;
  readonly storage?: number;
  readonly colour?: string;
}

export const COMPARE_STORAGE_KEY = 'goodcall.compare.v1';
export const COMPARE_LIMIT = 4;

type Listener = () => void;

const listeners = new Set<Listener>();
let items: readonly CompareItem[] | undefined;

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function positiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function optional<Value>(value: unknown, guard: (candidate: unknown) => candidate is Value) {
  return value === undefined || guard(value);
}

function toCompareItem(value: unknown): CompareItem | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const { slug, title, image, price, oldPrice, rating, reviewCount, brand, storage, colour } =
    value as Record<string, unknown>;
  const itemImage = toCartLineImage(image);

  if (
    !nonEmptyString(slug) ||
    !nonEmptyString(title) ||
    itemImage === undefined ||
    !positiveNumber(price) ||
    !optional(oldPrice, positiveNumber) ||
    !optional(rating, positiveNumber) ||
    typeof reviewCount !== 'number' ||
    !Number.isInteger(reviewCount) ||
    reviewCount < 0 ||
    !optional(brand, nonEmptyString) ||
    !optional(storage, positiveNumber) ||
    !optional(colour, nonEmptyString)
  ) {
    return undefined;
  }

  return {
    slug,
    title,
    image: itemImage,
    price,
    ...(oldPrice === undefined ? {} : { oldPrice }),
    ...(rating === undefined ? {} : { rating }),
    reviewCount,
    ...(brand === undefined ? {} : { brand }),
    ...(storage === undefined ? {} : { storage }),
    ...(colour === undefined ? {} : { colour }),
  };
}

function parseStoredItems(raw: string): readonly CompareItem[] | undefined {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return undefined;
  }

  const { items: storedItems } = parsed as Record<string, unknown>;

  if (!Array.isArray(storedItems) || storedItems.length > COMPARE_LIMIT) {
    return undefined;
  }

  const result: CompareItem[] = [];
  const slugs = new Set<string>();

  for (const entry of storedItems) {
    const item = toCompareItem(entry);

    if (item === undefined || slugs.has(item.slug)) {
      return undefined;
    }

    slugs.add(item.slug);
    result.push(item);
  }

  return result;
}

function readStoredItems(): readonly CompareItem[] {
  let raw: string | null;

  try {
    raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
  } catch {
    return [];
  }

  if (raw === null) {
    return [];
  }

  const stored = parseStoredItems(raw);

  if (stored === undefined) {
    try {
      window.localStorage.removeItem(COMPARE_STORAGE_KEY);
    } catch {
      return [];
    }

    return [];
  }

  return stored;
}

function writeStoredItems(next: readonly CompareItem[]): void {
  try {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify({ items: next }));
  } catch {
    return;
  }
}

function currentItems(): readonly CompareItem[] {
  items ??= readStoredItems();

  return items;
}

function commit(next: readonly CompareItem[]): void {
  items = next;
  writeStoredItems(next);
  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribeCompare(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getCompareItems(): readonly CompareItem[] {
  return currentItems();
}

export function isCompared(slug: string): boolean {
  return currentItems().some((item) => item.slug === slug);
}

export function isCompareFull(): boolean {
  return currentItems().length >= COMPARE_LIMIT;
}

export function addCompareItem(item: CompareItem): void {
  if (isCompared(item.slug) || isCompareFull()) {
    return;
  }

  commit([...currentItems(), item]);
}

export function removeCompareItem(slug: string): void {
  if (!isCompared(slug)) {
    return;
  }

  commit(currentItems().filter((item) => item.slug !== slug));
}

export function toggleCompareItem(item: CompareItem, pressed: boolean): void {
  if (pressed) {
    addCompareItem(item);
  } else {
    removeCompareItem(item.slug);
  }
}

export function clearCompareItems(): void {
  if (currentItems().length === 0) {
    return;
  }

  commit([]);
}

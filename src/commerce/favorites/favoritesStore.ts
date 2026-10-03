export type FavoriteImage =
  { readonly kind: 'url'; readonly src: string } | { readonly kind: 'catalog-fallback' };

export interface FavoriteItem {
  readonly slug: string;
  readonly title: string;
  readonly image: FavoriteImage;
  readonly price: number;
  readonly oldPrice?: number;
}

export const FAVORITES_STORAGE_KEY = 'goodcall.favorites.v1';

type Listener = () => void;

const listeners = new Set<Listener>();
let items: readonly FavoriteItem[] | undefined;

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function positiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function toFavoriteImage(value: unknown): FavoriteImage | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const { kind, src } = value as Record<string, unknown>;

  if (kind === 'url' && nonEmptyString(src)) {
    return { kind, src };
  }

  if (kind === 'catalog-fallback') {
    return { kind };
  }

  return undefined;
}

function toFavoriteItem(value: unknown): FavoriteItem | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const { slug, title, image, price, oldPrice } = value as Record<string, unknown>;
  const itemImage = toFavoriteImage(image);

  if (
    !nonEmptyString(slug) ||
    !nonEmptyString(title) ||
    itemImage === undefined ||
    !positiveNumber(price) ||
    (oldPrice !== undefined && !positiveNumber(oldPrice))
  ) {
    return undefined;
  }

  return { slug, title, image: itemImage, price, oldPrice };
}

function parseStoredItems(raw: string): readonly FavoriteItem[] | undefined {
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

  if (!Array.isArray(storedItems)) {
    return undefined;
  }

  const result: FavoriteItem[] = [];
  const slugs = new Set<string>();

  for (const entry of storedItems) {
    const item = toFavoriteItem(entry);

    if (item === undefined || slugs.has(item.slug)) {
      return undefined;
    }

    slugs.add(item.slug);
    result.push(item);
  }

  return result;
}

function readStoredItems(): readonly FavoriteItem[] {
  let raw: string | null;

  try {
    raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    return [];
  }

  if (raw === null) {
    return [];
  }

  const stored = parseStoredItems(raw);

  if (stored === undefined) {
    try {
      window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch {
      return [];
    }

    return [];
  }

  return stored;
}

function writeStoredItems(next: readonly FavoriteItem[]): void {
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ items: next }));
  } catch {
    return;
  }
}

function currentItems(): readonly FavoriteItem[] {
  items ??= readStoredItems();

  return items;
}

function commit(next: readonly FavoriteItem[]): void {
  items = next;
  writeStoredItems(next);
  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribeFavorites(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getFavoriteItems(): readonly FavoriteItem[] {
  return currentItems();
}

export function isFavorite(slug: string): boolean {
  return currentItems().some((item) => item.slug === slug);
}

export function addFavorite(item: FavoriteItem): void {
  if (isFavorite(item.slug)) {
    return;
  }

  commit([item, ...currentItems()]);
}

export function removeFavorite(slug: string): void {
  if (!isFavorite(slug)) {
    return;
  }

  commit(currentItems().filter((item) => item.slug !== slug));
}

export function toggleFavorite(item: FavoriteItem, pressed: boolean): void {
  if (pressed) {
    addFavorite(item);
  } else {
    removeFavorite(item.slug);
  }
}

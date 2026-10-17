import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { Dispatch } from '@reduxjs/toolkit';

import {
  FAVORITES_STORAGE_KEY,
  favoritesHydrated,
  parseStoredFavorites,
  selectFavoriteItems,
  serializeFavorites,
} from '../commerce/favorites';
import type { FavoriteItem, FavoritesRootState } from '../commerce/favorites';

export type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface StorageEventSource {
  addEventListener(type: 'storage', listener: (event: StorageEvent) => void): void;
  removeEventListener(type: 'storage', listener: (event: StorageEvent) => void): void;
}

export function readStoredFavorites(storage: BrowserStorage | undefined): readonly FavoriteItem[] {
  if (storage === undefined) {
    return [];
  }

  let raw: string | null;

  try {
    raw = storage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    return [];
  }

  if (raw === null) {
    return [];
  }

  const stored = parseStoredFavorites(raw);

  if (stored === undefined) {
    try {
      storage.removeItem(FAVORITES_STORAGE_KEY);
    } catch {
      return [];
    }

    return [];
  }

  return stored;
}

function writeStoredFavorites(
  storage: BrowserStorage | undefined,
  items: readonly FavoriteItem[],
): void {
  if (storage === undefined) {
    return;
  }

  try {
    storage.setItem(FAVORITES_STORAGE_KEY, serializeFavorites(items));
  } catch {
    return;
  }
}

export function createFavoritesPersistence(storage: BrowserStorage | undefined) {
  const persistence = createListenerMiddleware<FavoritesRootState>();

  persistence.startListening({
    predicate: (action, currentState, previousState) =>
      !favoritesHydrated.match(action) &&
      selectFavoriteItems(currentState) !== selectFavoriteItems(previousState),
    effect: (_action, api) => {
      writeStoredFavorites(storage, selectFavoriteItems(api.getState()));
    },
  });

  return persistence.middleware;
}

export function startFavoritesStorageSync(
  dispatch: Dispatch,
  source: StorageEventSource,
  storage: BrowserStorage | undefined,
): () => void {
  if (storage === undefined) {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== FAVORITES_STORAGE_KEY) {
      return;
    }

    if (event.storageArea !== storage) {
      return;
    }

    dispatch(favoritesHydrated(readStoredFavorites(storage)));
  };

  try {
    source.addEventListener('storage', handleStorage);
  } catch {
    return () => undefined;
  }

  return () => {
    try {
      source.removeEventListener('storage', handleStorage);
    } catch {
      return;
    }
  };
}

import { configureStore } from '@reduxjs/toolkit';

import { favoritesReducer } from '../commerce/favorites';
import { createFavoritesPersistence, readStoredFavorites } from './favoritesPersistence';
import type { BrowserStorage } from './favoritesPersistence';

export function browserLocalStorage(): BrowserStorage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function createAppStore(storage: BrowserStorage | undefined) {
  return configureStore({
    reducer: { favorites: favoritesReducer },
    preloadedState: { favorites: { items: [...readStoredFavorites(storage)] } },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(createFavoritesPersistence(storage)),
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

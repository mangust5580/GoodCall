import { useSyncExternalStore } from 'react';

import { getFavoriteItems, subscribeFavorites } from './favoritesStore';
import type { FavoriteItem } from './favoritesStore';

export function useFavoriteItems(): readonly FavoriteItem[] {
  return useSyncExternalStore(subscribeFavorites, getFavoriteItems);
}

export function useFavoritesCount(): number {
  return useFavoriteItems().length;
}

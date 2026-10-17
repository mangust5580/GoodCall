import { createSlice } from '@reduxjs/toolkit';
import type { Draft, PayloadAction } from '@reduxjs/toolkit';

import type { FavoriteItem } from './favoritesModel';

export interface FavoritesState {
  readonly items: FavoriteItem[];
}

export interface FavoritesRootState {
  readonly favorites: FavoritesState;
}

export interface FavoriteToggle {
  readonly item: FavoriteItem;
  readonly pressed: boolean;
}

const initialState: FavoritesState = { items: [] };

function addItem(state: Draft<FavoritesState>, item: FavoriteItem): void {
  if (!state.items.some((current) => current.slug === item.slug)) {
    state.items.unshift(item);
  }
}

function removeItem(state: Draft<FavoritesState>, slug: string): void {
  const index = state.items.findIndex((current) => current.slug === slug);

  if (index !== -1) {
    state.items.splice(index, 1);
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    favoriteAdded(state, action: PayloadAction<FavoriteItem>) {
      addItem(state, action.payload);
    },
    favoriteRemoved(state, action: PayloadAction<string>) {
      removeItem(state, action.payload);
    },
    favoriteToggled(state, action: PayloadAction<FavoriteToggle>) {
      if (action.payload.pressed) {
        addItem(state, action.payload.item);
      } else {
        removeItem(state, action.payload.item.slug);
      }
    },
    favoritesCleared(state) {
      if (state.items.length > 0) {
        state.items = [];
      }
    },
    favoritesHydrated(state, action: PayloadAction<readonly FavoriteItem[]>) {
      state.items = [...action.payload];
    },
  },
});

export const {
  favoriteAdded,
  favoriteRemoved,
  favoriteToggled,
  favoritesCleared,
  favoritesHydrated,
} = favoritesSlice.actions;

export const favoritesReducer = favoritesSlice.reducer;

export function selectFavoriteItems(state: FavoritesRootState): readonly FavoriteItem[] {
  return state.favorites.items;
}

export function selectFavoritesCount(state: FavoritesRootState): number {
  return state.favorites.items.length;
}

export function selectIsFavorite(state: FavoritesRootState, slug: string): boolean {
  return state.favorites.items.some((item) => item.slug === slug);
}

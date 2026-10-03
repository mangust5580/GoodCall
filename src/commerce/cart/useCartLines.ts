import { useSyncExternalStore } from 'react';

import { cartUnitCount } from './cartPricing';
import {
  getCartLines,
  removeCartLine,
  removeSelectedCartLines,
  setCartLineQuantity,
  subscribeCart,
  toggleAllCartLines,
  toggleCartLine,
} from './cartStore';
import type { CartLine } from './cartStore';

export interface CartLinesState {
  readonly lines: readonly CartLine[];
  readonly toggleLine: (id: string, selected: boolean) => void;
  readonly toggleAll: (selected: boolean) => void;
  readonly setQuantity: (id: string, quantity: number) => void;
  readonly removeLine: (id: string) => void;
  readonly removeSelected: () => void;
}

export function useCartLineList(): readonly CartLine[] {
  return useSyncExternalStore(subscribeCart, getCartLines);
}

export function useCartUnitCount(): number {
  return cartUnitCount(useCartLineList());
}

export function useCartLines(): CartLinesState {
  return {
    lines: useCartLineList(),
    toggleLine: toggleCartLine,
    toggleAll: toggleAllCartLines,
    setQuantity: setCartLineQuantity,
    removeLine: removeCartLine,
    removeSelected: removeSelectedCartLines,
  };
}

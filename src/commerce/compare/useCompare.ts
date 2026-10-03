import { useSyncExternalStore } from 'react';

import { getCompareItems, subscribeCompare } from './compareStore';
import type { CompareItem } from './compareStore';

export function useCompareItems(): readonly CompareItem[] {
  return useSyncExternalStore(subscribeCompare, getCompareItems);
}

export function useCompareCount(): number {
  return useCompareItems().length;
}

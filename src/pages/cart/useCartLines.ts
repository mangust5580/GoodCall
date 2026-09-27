import { useState } from 'react';

import type { CartLine } from './cartFixtures';

export interface CartLinesState {
  readonly lines: readonly CartLine[];
  readonly toggleLine: (id: string, selected: boolean) => void;
  readonly toggleAll: (selected: boolean) => void;
  readonly setQuantity: (id: string, quantity: number) => void;
  readonly removeLine: (id: string) => void;
  readonly removeSelected: () => void;
}

const MIN_QUANTITY = 1;

export function useCartLines(seed: readonly CartLine[]): CartLinesState {
  const [lines, setLines] = useState(seed);

  return {
    lines,
    toggleLine: (id, selected) => {
      setLines((current) => current.map((line) => (line.id === id ? { ...line, selected } : line)));
    },
    toggleAll: (selected) => {
      setLines((current) => current.map((line) => ({ ...line, selected })));
    },
    setQuantity: (id, quantity) => {
      setLines((current) =>
        current.map((line) =>
          line.id === id ? { ...line, quantity: Math.max(MIN_QUANTITY, quantity) } : line,
        ),
      );
    },
    removeLine: (id) => {
      setLines((current) => current.filter((line) => line.id !== id));
    },
    removeSelected: () => {
      setLines((current) => current.filter((line) => !line.selected));
    },
  };
}

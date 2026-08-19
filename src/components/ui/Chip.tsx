import type { ReactNode } from 'react';

export type ChipVariant = 'brand' | 'success' | 'danger';

interface ChipProps {
  readonly variant?: ChipVariant;
  readonly children: ReactNode;
}

export function Chip({ variant = 'brand', children }: ChipProps) {
  return <span className={`ui-chip ui-chip--${variant}`}>{children}</span>;
}

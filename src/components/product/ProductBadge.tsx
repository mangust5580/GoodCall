import type { ReactNode } from 'react';

export type ProductBadgeTone = 'sale' | 'new';

interface ProductBadgeProps {
  readonly tone: ProductBadgeTone;
  readonly className?: string;
  readonly children: ReactNode;
}

export function ProductBadge({ tone, className, children }: ProductBadgeProps) {
  const toneClass = `product-badge product-badge--${tone}`;

  return (
    <span className={className === undefined ? toneClass : `${toneClass} ${className}`}>
      {children}
    </span>
  );
}

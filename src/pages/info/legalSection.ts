import type { ReactNode } from 'react';

import type { IconName } from '../../components/ui';

export interface LegalContentsItem {
  readonly id: string;
  readonly title: string;
}

export interface LegalSection extends LegalContentsItem {
  readonly icon: IconName;
  readonly content: ReactNode;
}

export function legalSectionTitle(index: number, title: string): string {
  return `${String(index + 1)}. ${title}`;
}

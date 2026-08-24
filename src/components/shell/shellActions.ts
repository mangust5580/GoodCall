import type { IconName } from '../ui';

export interface ShellAction {
  readonly label: string;
  readonly icon: IconName;
  readonly href: string;
  readonly count?: number;
}

export interface ShellActionInput {
  readonly fallbackHref: string;
  readonly comparisonHref?: string;
  readonly favoritesHref?: string;
  readonly cartHref?: string;
  readonly accountHref?: string;
  readonly comparisonCount?: number;
  readonly favoritesCount?: number;
  readonly cartCount?: number;
}

export function shellActions({
  fallbackHref,
  comparisonHref,
  favoritesHref,
  cartHref,
  accountHref,
  comparisonCount,
  favoritesCount,
  cartCount,
}: ShellActionInput): readonly ShellAction[] {
  return [
    {
      label: 'Сравнение',
      icon: 'compare',
      href: comparisonHref ?? fallbackHref,
      count: comparisonCount,
    },
    {
      label: 'Избранное',
      icon: 'heart',
      href: favoritesHref ?? fallbackHref,
      count: favoritesCount,
    },
    { label: 'Корзина', icon: 'cart', href: cartHref ?? fallbackHref, count: cartCount },
    { label: 'Войти', icon: 'person', href: accountHref ?? fallbackHref },
  ];
}

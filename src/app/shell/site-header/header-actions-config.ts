import comparisonIconUrl from '@/assets/icons/shell/comparison.svg';
import favoritesIconUrl from '@/assets/icons/shell/favorites.svg';
import cartIconUrl from '@/assets/icons/shell/cart.svg';
import accountIconUrl from '@/assets/icons/shell/account.svg';
import { getRouteMetadata, type RouteKey } from '@/app/routing/registry';

export const USER_NAV_LABEL = 'Пользовательская навигация';

export type HeaderActionId = 'comparison' | 'favorites' | 'cart' | 'account';

export interface HeaderActionDescriptor {
  id: HeaderActionId;
  label: string;
  routeKey: RouteKey;
  path: string;
  iconUrl: string;
}

interface HeaderActionDefinition {
  id: HeaderActionId;
  label: string;
  routeKey: RouteKey;
  iconUrl: string;
}

const HEADER_ACTION_DEFINITIONS: readonly HeaderActionDefinition[] = [
  { id: 'comparison', label: 'Сравнение', routeKey: 'comparison', iconUrl: comparisonIconUrl },
  { id: 'favorites', label: 'Избранное', routeKey: 'favorites', iconUrl: favoritesIconUrl },
  { id: 'cart', label: 'Корзина', routeKey: 'cart', iconUrl: cartIconUrl },
  { id: 'account', label: 'Войти', routeKey: 'auth', iconUrl: accountIconUrl },
];

function resolveHeaderAction(definition: HeaderActionDefinition): HeaderActionDescriptor {
  const metadata = getRouteMetadata(definition.routeKey);

  if (metadata === undefined) {
    throw new Error(`Header action references an unregistered route key: ${definition.routeKey}`);
  }

  const { path } = metadata;

  if (path === '*') {
    throw new Error(`Header action cannot target the catch-all route: ${definition.routeKey}`);
  }

  if (path.includes(':')) {
    throw new Error(`Header action cannot target a dynamic route: ${definition.routeKey}`);
  }

  if (!path.startsWith('/') || path.includes('GoodCall')) {
    throw new Error(`Header action destination must be an app-relative path: ${path}`);
  }

  if (definition.iconUrl.length === 0) {
    throw new Error(`Header action is missing an icon source: ${definition.id}`);
  }

  return {
    id: definition.id,
    label: definition.label,
    routeKey: definition.routeKey,
    path,
    iconUrl: definition.iconUrl,
  };
}

function assertUnique(values: readonly string[], subject: string): void {
  if (new Set(values).size !== values.length) {
    throw new Error(`Header action ${subject} must be unique`);
  }
}

function resolveHeaderActions(): readonly HeaderActionDescriptor[] {
  const resolved = HEADER_ACTION_DEFINITIONS.map(resolveHeaderAction);

  assertUnique(
    resolved.map((action) => action.id),
    'ids'
  );
  assertUnique(
    resolved.map((action) => action.label),
    'labels'
  );
  assertUnique(
    resolved.map((action) => action.routeKey),
    'route keys'
  );
  assertUnique(
    resolved.map((action) => action.path),
    'destinations'
  );

  return resolved;
}

export const headerActions: readonly HeaderActionDescriptor[] = resolveHeaderActions();

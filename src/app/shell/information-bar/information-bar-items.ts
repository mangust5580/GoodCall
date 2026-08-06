import { getRouteMetadata, type RouteKey } from '@/app/routing/registry';

export const INFORMATION_BAR_NAV_LABEL = 'Сервисная навигация';
export const INFORMATION_BAR_DISCLOSURE_LABEL = 'Информация и помощь';
export const INFORMATION_BAR_CITY = 'Москва';
export const INFORMATION_BAR_CITY_CONTEXT_PREFIX = 'Текущий город: ';

export interface ServiceLinkDescriptor {
  key: RouteKey;
  label: string;
  path: string;
}

interface ServiceLinkDefinition {
  key: RouteKey;
  label: string;
}

const SERVICE_LINK_DEFINITIONS: readonly ServiceLinkDefinition[] = [
  { key: 'information.deliveryAndPayment', label: 'Доставка и оплата' },
  { key: 'help.warrantyReturns', label: 'Гарантия и возврат' },
  { key: 'loyalty.program', label: 'Программа лояльности' },
  { key: 'help.faq', label: 'Помощь' },
  { key: 'company.contacts', label: 'Контакты' },
];

function resolveServiceLink(definition: ServiceLinkDefinition): ServiceLinkDescriptor {
  const metadata = getRouteMetadata(definition.key);

  if (metadata === undefined) {
    throw new Error(`Information Bar references an unregistered route key: ${definition.key}`);
  }

  const { path } = metadata;

  if (path === '*') {
    throw new Error(`Information Bar cannot target the catch-all route: ${definition.key}`);
  }

  if (path.includes(':')) {
    throw new Error(`Information Bar cannot target a dynamic route: ${definition.key}`);
  }

  if (!path.startsWith('/') || path.includes('GoodCall')) {
    throw new Error(`Information Bar destination must be an app-relative path: ${path}`);
  }

  return { key: definition.key, label: definition.label, path };
}

function resolveServiceLinks(): readonly ServiceLinkDescriptor[] {
  const resolved = SERVICE_LINK_DEFINITIONS.map(resolveServiceLink);
  const paths = new Set(resolved.map((link) => link.path));

  if (paths.size !== resolved.length) {
    throw new Error('Information Bar destinations must be unique');
  }

  return resolved;
}

export const serviceLinks: readonly ServiceLinkDescriptor[] = resolveServiceLinks();

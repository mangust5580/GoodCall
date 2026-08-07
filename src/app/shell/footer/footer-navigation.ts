import { getRouteMetadata, type RouteKey } from '@/app/routing/registry';

export type FooterGroupId = 'shoppers' | 'company' | 'help';

export interface FooterLinkDescriptor {
  routeKey: RouteKey;
  label: string;
  path: string;
}

export interface FooterGroupDescriptor {
  id: FooterGroupId;
  title: string;
  links: readonly FooterLinkDescriptor[];
}

interface FooterLinkDefinition {
  routeKey: RouteKey;
  label: string;
}

interface FooterGroupDefinition {
  id: FooterGroupId;
  title: string;
  links: readonly FooterLinkDefinition[];
}

const FOOTER_GROUP_DEFINITIONS: readonly FooterGroupDefinition[] = [
  {
    id: 'shoppers',
    title: 'Покупателям',
    links: [
      { routeKey: 'information.deliveryAndPayment', label: 'Доставка и оплата' },
      { routeKey: 'help.warrantyReturns', label: 'Гарантия, возврат и ремонт' },
      { routeKey: 'loyalty.program', label: 'Бонусная программа' },
      { routeKey: 'promotions.list', label: 'Акции и спецпредложения' },
      { routeKey: 'brands.directory', label: 'Бренды' },
    ],
  },
  {
    id: 'company',
    title: 'Компания',
    links: [
      { routeKey: 'company.about', label: 'О компании' },
      { routeKey: 'blog.list', label: 'Блог' },
      { routeKey: 'locations.shops', label: 'Магазины' },
    ],
  },
  {
    id: 'help',
    title: 'Помощь',
    links: [
      { routeKey: 'help.faq', label: 'Помощь и ответы на вопросы' },
      { routeKey: 'order.tracking', label: 'Отслеживание заказа' },
      { routeKey: 'locations.serviceCenters', label: 'Сервисные центры' },
    ],
  },
];

const LEGAL_LINK_DEFINITIONS: readonly FooterLinkDefinition[] = [
  { routeKey: 'legal.privacyPolicy', label: 'Политика конфиденциальности' },
  { routeKey: 'legal.userAgreement', label: 'Пользовательское соглашение' },
  { routeKey: 'legal.publicOffer', label: 'Публичная оферта' },
];

function resolveFooterLink(definition: FooterLinkDefinition): FooterLinkDescriptor {
  const metadata = getRouteMetadata(definition.routeKey);

  if (metadata === undefined) {
    throw new Error(`Footer references an unregistered route key: ${definition.routeKey}`);
  }

  const { path } = metadata;

  if (path === '*') {
    throw new Error(`Footer cannot target the catch-all route: ${definition.routeKey}`);
  }

  if (path.includes(':')) {
    throw new Error(`Footer cannot target a dynamic route: ${definition.routeKey}`);
  }

  if (!path.startsWith('/') || path.includes('GoodCall')) {
    throw new Error(`Footer destination must be an app-relative path: ${path}`);
  }

  return { routeKey: definition.routeKey, label: definition.label, path };
}

function assertUniquePaths(links: readonly FooterLinkDescriptor[]): void {
  const paths = new Set(links.map((link) => link.path));

  if (paths.size !== links.length) {
    throw new Error('Footer destinations must be unique');
  }
}

function resolveFooterGroups(): readonly FooterGroupDescriptor[] {
  const groups = FOOTER_GROUP_DEFINITIONS.map((group) => ({
    id: group.id,
    title: group.title,
    links: group.links.map(resolveFooterLink),
  }));

  assertUniquePaths(groups.flatMap((group) => group.links));

  return groups;
}

function resolveLegalLinks(): readonly FooterLinkDescriptor[] {
  const links = LEGAL_LINK_DEFINITIONS.map(resolveFooterLink);

  assertUniquePaths(links);

  return links;
}

export const footerGroups: readonly FooterGroupDescriptor[] = resolveFooterGroups();

export const footerLegalLinks: readonly FooterLinkDescriptor[] = resolveLegalLinks();

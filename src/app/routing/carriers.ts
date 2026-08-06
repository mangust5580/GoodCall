export type CarrierRouteKey =
  | 'search'
  | 'comparison'
  | 'favorites'
  | 'auth'
  | 'information.deliveryAndPayment'
  | 'help.warrantyReturns'
  | 'loyalty.program'
  | 'help.faq'
  | 'company.contacts'
  | 'promotions.list'
  | 'brands.directory'
  | 'locations.shops'
  | 'locations.serviceCenters'
  | 'company.about'
  | 'blog.list'
  | 'order.tracking'
  | 'legal.privacyPolicy'
  | 'legal.userAgreement'
  | 'legal.publicOffer';

export interface CarrierRouteDescriptor {
  key: CarrierRouteKey;
  id: string;
  path: string;
  heading: string;
}

export const CARRIER_NOTICE =
  'Технический маршрут подготовлен для интеграции глобальной оболочки. Функциональность раздела будет реализована на отдельном этапе.';

export const CARRIER_HOME_LINK_LABEL = 'На главную';

export const carrierRoutes: readonly CarrierRouteDescriptor[] = [
  { key: 'search', id: 'search', path: '/search', heading: 'Поиск' },
  { key: 'comparison', id: 'comparison', path: '/comparison', heading: 'Сравнение товаров' },
  { key: 'favorites', id: 'favorites', path: '/favorites', heading: 'Избранное' },
  { key: 'auth', id: 'auth', path: '/auth', heading: 'Вход и регистрация' },
  {
    key: 'information.deliveryAndPayment',
    id: 'information-delivery-and-payment',
    path: '/delivery-and-payment',
    heading: 'Доставка и оплата',
  },
  {
    key: 'help.warrantyReturns',
    id: 'help-warranty-returns',
    path: '/warranty-and-returns',
    heading: 'Гарантия и возврат',
  },
  {
    key: 'loyalty.program',
    id: 'loyalty-program',
    path: '/loyalty',
    heading: 'Программа лояльности',
  },
  { key: 'help.faq', id: 'help-faq', path: '/help', heading: 'Помощь' },
  { key: 'company.contacts', id: 'company-contacts', path: '/contacts', heading: 'Контакты' },
  { key: 'promotions.list', id: 'promotions-list', path: '/promotions', heading: 'Акции' },
  { key: 'brands.directory', id: 'brands-directory', path: '/brands', heading: 'Бренды' },
  { key: 'locations.shops', id: 'locations-shops', path: '/shops', heading: 'Магазины' },
  {
    key: 'locations.serviceCenters',
    id: 'locations-service-centers',
    path: '/service-centers',
    heading: 'Сервисные центры',
  },
  { key: 'company.about', id: 'company-about', path: '/about', heading: 'О компании' },
  { key: 'blog.list', id: 'blog-list', path: '/blog', heading: 'Блог' },
  { key: 'order.tracking', id: 'order-tracking', path: '/track-order', heading: 'Отследить заказ' },
  {
    key: 'legal.privacyPolicy',
    id: 'legal-privacy-policy',
    path: '/privacy-policy',
    heading: 'Политика конфиденциальности',
  },
  {
    key: 'legal.userAgreement',
    id: 'legal-user-agreement',
    path: '/user-agreement',
    heading: 'Пользовательское соглашение',
  },
  {
    key: 'legal.publicOffer',
    id: 'legal-public-offer',
    path: '/public-offer',
    heading: 'Публичная оферта',
  },
];

export function carrierRouteTitle(carrier: CarrierRouteDescriptor): string {
  return `${carrier.heading} — GoodCall`;
}

export function carrierRouteSegment(carrier: CarrierRouteDescriptor): string {
  return carrier.path.slice(1);
}

import { STOREFRONT_SUPPORT } from '../../commerce/storefront';
import type { BenefitItem } from '../../components/content';
import type { IconName } from '../../components/ui';

export interface AccountDemoFeature {
  readonly title: string;
  readonly note: string;
  readonly icon: IconName;
}

export const ACCOUNT_BENEFITS: readonly BenefitItem[] = [
  { title: 'Официальная гарантия', note: 'от производителя на все товары', icon: 'check' },
  { title: 'Оригинальная продукция', note: 'только официальные поставки', icon: 'package' },
  { title: 'Быстрая доставка', note: 'от 1 дня по всей России', icon: 'store' },
  { title: 'Поддержка', note: STOREFRONT_SUPPORT.hours, icon: 'headset' },
];

export const ACCOUNT_DEMO_PROMISES: readonly AccountDemoFeature[] = [
  {
    title: 'Без регистрации',
    note: 'Настоящий аккаунт не создаётся',
    icon: 'person',
  },
  {
    title: 'Без пароля',
    note: 'Вход в демо-аккаунт одним нажатием',
    icon: 'check',
  },
  {
    title: 'Только в этом браузере',
    note: 'Данные никуда не отправляются',
    icon: 'laptop',
  },
];

export const ACCOUNT_DEMO_FEATURES: readonly AccountDemoFeature[] = [
  {
    title: 'Профиль',
    note: 'Демо-профиль покупателя с контактными данными',
    icon: 'person',
  },
  {
    title: 'Избранное',
    note: 'Товары, которые вы отметили ♥ в каталоге',
    icon: 'heart',
  },
  {
    title: 'Сравнение',
    note: 'До четырёх товаров для сравнения характеристик',
    icon: 'compare',
  },
  {
    title: 'Заказ',
    note: 'Демо-заказ, оформленный в этой сессии',
    icon: 'package',
  },
];

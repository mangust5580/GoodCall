import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { AccountNavigation } from '../../components/account';
import type { AccountNavigationItem } from '../../components/account';
import { Breadcrumbs, Container } from '../../components/layout';
import { Icon } from '../../components/ui';

export interface AccountLinks {
  readonly home: string;
  readonly account: string;
  readonly orders: string;
  readonly profile: string;
  readonly addresses: string;
  readonly favorites: string;
  readonly compare: string;
  readonly catalog: string;
  readonly orderConfirmation: string;
}

export type AccountSection = 'overview' | 'orders' | 'profile' | 'addresses';

interface AccountLayoutProps {
  readonly links: AccountLinks;
  readonly section: AccountSection;
  readonly title: string;
  readonly crumb?: string;
  readonly focusTitle: boolean;
  readonly onSignOut: () => void;
  readonly children: ReactNode;
}

export const ACCOUNT_TITLE_ID = 'account-title';

export function AccountLayout({
  links,
  section,
  title,
  crumb,
  focusTitle,
  onSignOut,
  children,
}: AccountLayoutProps) {
  useEffect(() => {
    if (focusTitle) {
      document.getElementById(ACCOUNT_TITLE_ID)?.focus({ preventScroll: true });
    }
  }, [focusTitle]);

  const navigation: readonly AccountNavigationItem[] = [
    { id: 'profile', label: 'Профиль', icon: 'person', href: links.account },
    { id: 'orders', label: 'Мои заказы', icon: 'package', href: links.orders },
    { id: 'favorites', label: 'Избранное', icon: 'heart', href: links.favorites },
    { id: 'compare', label: 'Сравнение', icon: 'compare', href: links.compare },
    { id: 'addresses', label: 'Адреса доставки', icon: 'map-pin', href: links.addresses },
  ];

  return (
    <main className="account-page">
      <Container>
        <Breadcrumbs
          className="account-crumbs"
          items={
            crumb === undefined
              ? [{ label: 'Главная', href: links.home }, { label: 'Аккаунт' }]
              : [
                  { label: 'Главная', href: links.home },
                  { label: 'Аккаунт', href: links.account },
                  { label: crumb },
                ]
          }
        />

        <h1 className="account-page__title" id={ACCOUNT_TITLE_ID} tabIndex={-1}>
          {title}
        </h1>

        <div className="account-page__layout">
          <div className="account-page__rail">
            <AccountNavigation
              currentId={section === 'overview' || section === 'profile' ? 'profile' : section}
              items={navigation}
              label="Личный кабинет"
              onSignOut={onSignOut}
              signOutLabel="Выход"
            />
          </div>

          <div className="account-page__main">{children}</div>
        </div>
      </Container>
    </main>
  );
}

interface AccountOrdersEmptyProps {
  readonly catalogHref: string;
  readonly headingLevel: 'h2' | 'h3';
}

export function AccountOrdersEmpty({ catalogHref, headingLevel }: AccountOrdersEmptyProps) {
  const Heading = headingLevel;

  return (
    <div className="account-orders-empty">
      <span aria-hidden="true" className="account-orders-empty__glyph">
        <Icon className="account-orders-empty__icon" name="package" />
      </span>
      <Heading className="account-orders-empty__title">В этой сессии заказов пока нет</Heading>
      <p className="account-orders-empty__message">
        Оформите заказ в каталоге — он появится здесь до конца сессии браузера.
      </p>
      <a className="ui-button ui-button--secondary account-orders-empty__action" href={catalogHref}>
        Перейти в каталог
      </a>
    </div>
  );
}

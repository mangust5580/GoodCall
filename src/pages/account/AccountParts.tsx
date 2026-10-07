import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { AccountNavigation } from '../../components/account';
import type { AccountNavigationItem } from '../../components/account';
import { Container } from '../../components/layout';
import { Icon } from '../../components/ui';

export interface AccountLinks {
  readonly home: string;
  readonly account: string;
  readonly orders: string;
  readonly profile: string;
  readonly favorites: string;
  readonly compare: string;
  readonly catalog: string;
  readonly orderConfirmation: string;
}

export type AccountSection = 'overview' | 'orders' | 'profile';

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
  ];

  return (
    <main className="account-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="account-crumbs">
          <ol className="account-crumbs__list">
            <li className="account-crumbs__item">
              <a className="account-crumbs__link" href={links.home}>
                Главная
              </a>
            </li>
            {crumb === undefined ? (
              <li aria-current="page" className="account-crumbs__item">
                Аккаунт
              </li>
            ) : (
              <>
                <li className="account-crumbs__item">
                  <a className="account-crumbs__link" href={links.account}>
                    Аккаунт
                  </a>
                </li>
                <li aria-current="page" className="account-crumbs__item">
                  {crumb}
                </li>
              </>
            )}
          </ol>
        </nav>

        <h1 className="account-page__title" id={ACCOUNT_TITLE_ID} tabIndex={-1}>
          {title}
        </h1>

        <div className="account-page__layout">
          <div className="account-page__rail">
            <AccountNavigation
              currentId={section === 'orders' ? 'orders' : 'profile'}
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

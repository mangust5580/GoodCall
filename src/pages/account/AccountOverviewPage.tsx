import { useEffect } from 'react';

import type { DemoAccountPersona } from '../../commerce/account';
import { formatUnitCount } from '../../commerce/cart';
import { formatPrice } from '../../commerce/format';
import { AccountNavigation, AccountStats } from '../../components/account';
import type { AccountNavigationItem, AccountStatsMetric } from '../../components/account';
import { Container } from '../../components/layout';
import { Chip, Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';

export interface AccountRecentOrder {
  readonly number: string;
  readonly createdAt: string;
  readonly unitCount: number;
  readonly total: number;
}

export interface AccountOverviewPageProps {
  readonly homeHref: string;
  readonly accountHref: string;
  readonly favoritesHref: string;
  readonly compareHref: string;
  readonly catalogHref: string;
  readonly orderHref: string;
  readonly persona: DemoAccountPersona;
  readonly favoritesCount: number;
  readonly compareCount: number;
  readonly order?: AccountRecentOrder;
  readonly onSignOut: () => void;
  readonly focusTitle?: boolean;
}

interface PersonalDetail {
  readonly label: string;
  readonly value: string;
  readonly icon: IconName;
}

const TITLE_ID = 'account-title';

const createdAtFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);

  return `${createdAtFormatter.format(date).replace(/\s*г\.$/u, '')}, ${timeFormatter.format(date)}`;
}

function RecentOrder({
  order,
  orderHref,
}: {
  readonly order: AccountRecentOrder;
  readonly orderHref: string;
}) {
  return (
    <article aria-labelledby="account-order-number" className="account-order">
      <div className="account-order__head">
        <h3 className="account-order__number" id="account-order-number">
          Демо-заказ №{order.number}
        </h3>
        <Chip variant="brand">Оформлен</Chip>
      </div>
      <dl className="account-order__facts">
        <div className="account-order__fact">
          <dt className="account-order__term">Дата</dt>
          <dd className="account-order__value">{formatCreatedAt(order.createdAt)}</dd>
        </div>
        <div className="account-order__fact">
          <dt className="account-order__term">Товары</dt>
          <dd className="account-order__value">{formatUnitCount(order.unitCount)}</dd>
        </div>
        <div className="account-order__fact">
          <dt className="account-order__term">Сумма</dt>
          <dd className="account-order__value account-order__value--total">
            {formatPrice(order.total)}
          </dd>
        </div>
      </dl>
      <div className="account-order__foot">
        <p className="account-order__note">Демо-заказ хранится только в этой сессии браузера.</p>
        <a className="account-order__link" href={orderHref}>
          Подробнее<span className="ui-visually-hidden"> о демо-заказе №{order.number}</span>
        </a>
      </div>
    </article>
  );
}

export function AccountOverviewPage({
  homeHref,
  accountHref,
  favoritesHref,
  compareHref,
  catalogHref,
  orderHref,
  persona,
  favoritesCount,
  compareCount,
  order,
  onSignOut,
  focusTitle = false,
}: AccountOverviewPageProps) {
  useEffect(() => {
    if (focusTitle) {
      document.getElementById(TITLE_ID)?.focus({ preventScroll: true });
    }
  }, [focusTitle]);

  const navigation: readonly AccountNavigationItem[] = [
    { id: 'profile', label: 'Профиль', icon: 'person', href: accountHref },
    { id: 'favorites', label: 'Избранное', icon: 'heart', href: favoritesHref },
    { id: 'compare', label: 'Сравнение', icon: 'compare', href: compareHref },
  ];
  const metrics: readonly AccountStatsMetric[] = [
    {
      id: 'orders',
      icon: 'package',
      label: 'Заказы',
      value: String(order === undefined ? 0 : 1),
      note: 'В этой сессии',
    },
    {
      id: 'favorites',
      icon: 'heart',
      label: 'Избранное',
      value: formatUnitCount(favoritesCount),
      note: 'В списке',
      link: { href: favoritesHref, label: 'Смотреть все' },
    },
    {
      id: 'compare',
      icon: 'compare',
      label: 'Сравнение',
      value: formatUnitCount(compareCount),
      note: 'В сравнении',
      link: { href: compareHref, label: 'Смотреть все' },
    },
  ];
  const details: readonly PersonalDetail[] = [
    { label: 'Имя', value: `${persona.firstName} ${persona.lastName}`, icon: 'person' },
    { label: 'Телефон', value: persona.phone, icon: 'phone' },
    { label: 'E-mail', value: persona.email, icon: 'mail' },
    { label: 'Дата рождения', value: persona.birthDate, icon: 'calendar' },
  ];

  return (
    <main className="account-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="account-crumbs">
          <ol className="account-crumbs__list">
            <li className="account-crumbs__item">
              <a className="account-crumbs__link" href={homeHref}>
                Главная
              </a>
            </li>
            <li aria-current="page" className="account-crumbs__item">
              Аккаунт
            </li>
          </ol>
        </nav>

        <h1 className="account-page__title" id={TITLE_ID} tabIndex={-1}>
          Личный кабинет
        </h1>

        <div className="account-page__layout">
          <div className="account-page__rail">
            <AccountNavigation
              currentId="profile"
              items={navigation}
              label="Личный кабинет"
              onSignOut={onSignOut}
              signOutLabel="Выход"
            />
          </div>

          <div className="account-page__main">
            <section aria-labelledby="account-greeting-title" className="account-greeting">
              <div className="account-greeting__text">
                <div className="account-greeting__title-row">
                  <h2 className="account-greeting__title" id="account-greeting-title">
                    Здравствуйте,{' '}
                    <span className="account-greeting__name">{persona.firstName}</span>!
                  </h2>
                  <Chip>Демо-профиль</Chip>
                </div>
                <p className="account-greeting__lead">
                  Добро пожаловать в демо-кабинет GoodCall. Здесь собраны ваше избранное, сравнение
                  и заказ, оформленный в этой сессии.
                </p>
              </div>
              <span aria-hidden="true" className="account-greeting__visual">
                <Icon className="account-greeting__icon" name="person" />
              </span>
            </section>

            <section aria-labelledby="account-summary-title" className="account-page__summary">
              <h2 className="ui-visually-hidden" id="account-summary-title">
                Сводка
              </h2>
              <AccountStats layout="tiles" metrics={metrics} />
            </section>

            <div className="account-page__cards">
              <section aria-labelledby="account-personal-title" className="account-card">
                <h2 className="account-card__title" id="account-personal-title">
                  Личные данные
                </h2>
                <dl className="account-details">
                  {details.map((detail) => (
                    <div className="account-details__row" key={detail.label}>
                      <dt className="account-details__term">
                        <Icon className="account-details__icon" name={detail.icon} />
                        {detail.label}
                      </dt>
                      <dd className="account-details__value">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="account-orders-title" className="account-card">
                <h2 className="account-card__title" id="account-orders-title">
                  Последние заказы
                </h2>
                {order === undefined ? (
                  <div className="account-orders-empty">
                    <span aria-hidden="true" className="account-orders-empty__glyph">
                      <Icon className="account-orders-empty__icon" name="package" />
                    </span>
                    <h3 className="account-orders-empty__title">В этой сессии заказов пока нет</h3>
                    <p className="account-orders-empty__message">
                      Оформите заказ в каталоге — он появится здесь до конца сессии браузера.
                    </p>
                    <a
                      className="ui-button ui-button--secondary account-orders-empty__action"
                      href={catalogHref}
                    >
                      Перейти в каталог
                    </a>
                  </div>
                ) : (
                  <RecentOrder order={order} orderHref={orderHref} />
                )}
              </section>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

import { formatAccountBirthDate } from '../../commerce/account';
import type { DemoAccountProfile } from '../../commerce/account';
import { formatUnitCount } from '../../commerce/cart';
import { formatPrice } from '../../commerce/format';
import { AccountStats } from '../../components/account';
import type { AccountStatsMetric } from '../../components/account';
import { Chip, Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';
import { AccountLayout, AccountOrdersEmpty } from './AccountParts';
import type { AccountLinks } from './AccountParts';

export interface AccountRecentOrder {
  readonly number: string;
  readonly createdAt: string;
  readonly unitCount: number;
  readonly total: number;
}

export interface AccountOverviewPageProps {
  readonly links: AccountLinks;
  readonly profile: DemoAccountProfile;
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
  links,
  profile,
  favoritesCount,
  compareCount,
  order,
  onSignOut,
  focusTitle = false,
}: AccountOverviewPageProps) {
  const metrics: readonly AccountStatsMetric[] = [
    {
      id: 'orders',
      icon: 'package',
      label: 'Заказы',
      value: String(order === undefined ? 0 : 1),
      note: 'В этой сессии',
      link: { href: links.orders, label: 'Подробнее' },
    },
    {
      id: 'favorites',
      icon: 'heart',
      label: 'Избранное',
      value: formatUnitCount(favoritesCount),
      note: 'В списке',
      link: { href: links.favorites, label: 'Смотреть все' },
    },
    {
      id: 'compare',
      icon: 'compare',
      label: 'Сравнение',
      value: formatUnitCount(compareCount),
      note: 'В сравнении',
      link: { href: links.compare, label: 'Смотреть все' },
    },
  ];
  const details: readonly PersonalDetail[] = [
    { label: 'Имя', value: `${profile.firstName} ${profile.lastName}`, icon: 'person' },
    { label: 'Телефон', value: profile.phone, icon: 'phone' },
    { label: 'E-mail', value: profile.email, icon: 'mail' },
    {
      label: 'Дата рождения',
      value: formatAccountBirthDate(profile.birthDate),
      icon: 'calendar',
    },
  ];

  return (
    <AccountLayout
      focusTitle={focusTitle}
      links={links}
      onSignOut={onSignOut}
      section="overview"
      title="Личный кабинет"
    >
      <section aria-labelledby="account-greeting-title" className="account-greeting">
        <div className="account-greeting__text">
          <div className="account-greeting__title-row">
            <h2 className="account-greeting__title" id="account-greeting-title">
              Здравствуйте, <span className="account-greeting__name">{profile.firstName}</span>!
            </h2>
            <Chip>Демо-профиль</Chip>
          </div>
          <p className="account-greeting__lead">
            Добро пожаловать в демо-кабинет GoodCall. Здесь собраны ваше избранное, сравнение и
            заказ, оформленный в этой сессии.
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
          <a className="ui-button ui-button--secondary account-card__action" href={links.profile}>
            Редактировать профиль
          </a>
        </section>

        <section aria-labelledby="account-orders-title" className="account-card">
          <h2 className="account-card__title" id="account-orders-title">
            Последние заказы
          </h2>
          {order === undefined ? (
            <AccountOrdersEmpty catalogHref={links.catalog} headingLevel="h3" />
          ) : (
            <RecentOrder order={order} orderHref={links.orderConfirmation} />
          )}
        </section>
      </div>
    </AccountLayout>
  );
}

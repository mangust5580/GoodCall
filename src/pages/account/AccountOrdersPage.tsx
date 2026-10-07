import { CartLineMedia, formatUnitCount } from '../../commerce/cart';
import type { CartLineImage } from '../../commerce/cart';
import { formatPrice } from '../../commerce/format';
import { Chip } from '../../components/ui';
import { AccountLayout, AccountOrdersEmpty } from './AccountParts';
import type { AccountLinks } from './AccountParts';

export interface AccountSessionOrder {
  readonly number: string;
  readonly createdAt: string;
  readonly unitCount: number;
  readonly total: number;
  readonly paymentLabel: string;
  readonly fulfilmentLabel: string;
  readonly address: string;
  readonly thumbnail: {
    readonly image: CartLineImage;
    readonly productSlug?: string;
  };
}

export interface AccountOrdersPageProps {
  readonly links: AccountLinks;
  readonly order?: AccountSessionOrder;
  readonly onSignOut: () => void;
  readonly focusTitle?: boolean;
}

const THUMBNAIL_SIZES = '96px';

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

function SessionOrderCard({
  order,
  detailsHref,
}: {
  readonly order: AccountSessionOrder;
  readonly detailsHref: string;
}) {
  return (
    <article aria-labelledby="account-session-order-number" className="account-session-order">
      <div className="account-session-order__media">
        <CartLineMedia
          className="account-session-order__image"
          image={order.thumbnail.image}
          productSlug={order.thumbnail.productSlug}
          sizes={THUMBNAIL_SIZES}
        />
      </div>

      <div className="account-session-order__summary">
        <div className="account-session-order__head">
          <h2 className="account-session-order__number" id="account-session-order-number">
            Демо-заказ №{order.number}
          </h2>
          <Chip variant="brand">Оформлен</Chip>
        </div>
        <p className="account-session-order__date">от {formatCreatedAt(order.createdAt)}</p>
        <p className="account-session-order__amount">
          <span className="account-session-order__count">
            {formatUnitCount(order.unitCount)} на сумму
          </span>
          <span className="account-session-order__total">{formatPrice(order.total)}</span>
        </p>
      </div>

      <dl className="account-session-order__facts">
        <div className="account-session-order__fact">
          <dt className="account-session-order__term">Способ оплаты</dt>
          <dd className="account-session-order__value">{order.paymentLabel}</dd>
        </div>
        <div className="account-session-order__fact">
          <dt className="account-session-order__term">Способ получения</dt>
          <dd className="account-session-order__value">{order.fulfilmentLabel}</dd>
        </div>
        <div className="account-session-order__fact account-session-order__fact--address">
          <dt className="account-session-order__term">Адрес</dt>
          <dd className="account-session-order__value">{order.address}</dd>
        </div>
      </dl>

      <div className="account-session-order__actions">
        <a
          className="ui-button ui-button--secondary account-session-order__details"
          href={detailsHref}
        >
          Подробнее<span className="ui-visually-hidden"> о демо-заказе №{order.number}</span>
        </a>
      </div>
    </article>
  );
}

export function AccountOrdersPage({
  links,
  order,
  onSignOut,
  focusTitle = false,
}: AccountOrdersPageProps) {
  return (
    <AccountLayout
      crumb="Мои заказы"
      focusTitle={focusTitle}
      links={links}
      onSignOut={onSignOut}
      section="orders"
      title="Мои заказы"
    >
      <section aria-label="Заказы в этой сессии" className="account-card account-orders">
        <div className="account-orders__intro">
          <p className="account-orders__lead">Заказы, оформленные в этой сессии браузера.</p>
          <p className="account-orders__note">
            Демо-заказы не сохраняются после завершения сессии браузера.
          </p>
        </div>

        {order === undefined ? (
          <AccountOrdersEmpty catalogHref={links.catalog} headingLevel="h2" />
        ) : (
          <SessionOrderCard detailsHref={links.orderConfirmation} order={order} />
        )}
      </section>
    </AccountLayout>
  );
}

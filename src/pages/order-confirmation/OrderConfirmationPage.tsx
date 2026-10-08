import { useEffect } from 'react';

import { CartLineMedia, formatUnitCount } from '../../commerce/cart';
import { formatPrice } from '../../commerce/format';
import { findStore } from '../../commerce/shops';
import { EmptyState } from '../../components/feedback';
import { Breadcrumbs, Container } from '../../components/layout';
import { Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';
import { CHECKOUT_PAYMENT_METHODS } from '../checkout';
import type { DemoOrder } from './demoOrder';
import { STOREFRONT_DELIVERY_SLOTS } from '../../commerce/storefront';

export interface OrderConfirmationPageProps {
  readonly order: DemoOrder | undefined;
  readonly homeHref: string;
  readonly catalogHref: string;
}

interface InfoItem {
  readonly icon: IconName;
  readonly term: string;
  readonly value: string;
  readonly detail?: string;
}

const LINE_MEDIA_SIZES = '64px';
const TITLE_ID = 'order-confirmation-title';

const createdAtFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const deliveryDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);

  return `${createdAtFormatter.format(date).replace(/\s*г\.$/u, '')}, ${timeFormatter.format(date)}`;
}

function formatDeliveryDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  const text = deliveryDateFormatter.format(new Date(year ?? 0, (month ?? 1) - 1, day ?? 1));

  return text.charAt(0).toLocaleUpperCase('ru-RU') + text.slice(1);
}

function deliveryItems(order: DemoOrder): readonly InfoItem[] {
  if (order.deliveryMethod === 'pickup') {
    const store = order.pickupStoreId === undefined ? undefined : findStore(order.pickupStoreId);

    return [
      { icon: 'store', term: 'Способ получения', value: 'Самовывоз' },
      store === undefined
        ? { icon: 'map-pin', term: 'Магазин самовывоза', value: 'Магазин самовывоза' }
        : {
            icon: 'map-pin',
            term: 'Магазин самовывоза',
            value: store.name,
            detail: `${store.city}, ${store.address}`,
          },
    ];
  }

  const slot = STOREFRONT_DELIVERY_SLOTS.find((choice) => choice.value === order.courier?.slot);

  return [
    {
      icon: 'package',
      term: 'Способ получения',
      value: 'Курьером',
      detail:
        order.courier === undefined
          ? undefined
          : `${formatDeliveryDate(order.courier.date)}, ${slot?.label ?? ''}`,
    },
    { icon: 'map-pin', term: 'Адрес доставки', value: order.courier?.address ?? '' },
  ];
}

export function OrderConfirmationPage({
  order,
  homeHref,
  catalogHref,
}: OrderConfirmationPageProps) {
  useEffect(() => {
    document.getElementById(TITLE_ID)?.focus({ preventScroll: true });
  }, []);

  const payment = CHECKOUT_PAYMENT_METHODS.find((method) => method.value === order?.payment);
  const info: readonly InfoItem[] =
    order === undefined
      ? []
      : [
          { icon: 'calendar', term: 'Дата заказа', value: formatCreatedAt(order.createdAt) },
          { icon: 'scan-qr', term: 'Способ оплаты', value: payment?.label ?? '' },
          ...deliveryItems(order),
        ];

  return (
    <main className="order-page">
      <Container>
        <Breadcrumbs
          className="order-page__breadcrumbs"
          items={[
            { label: 'Главная', href: homeHref },
            { label: order === undefined ? 'Заказ не найден' : 'Заказ оформлен' },
          ]}
        />

        {order === undefined ? (
          <EmptyState
            action={{ label: 'Перейти в каталог', href: catalogHref }}
            className="order-empty"
            headingLevel="h1"
            icon="package"
            message="В текущей сессии браузера нет оформленного демо-заказа. Оформите заказ в корзине, чтобы увидеть его здесь."
            secondaryAction={{ label: 'На главную', href: homeHref }}
            title="Заказ не найден"
            titleId={TITLE_ID}
            variant="page"
          />
        ) : (
          <section aria-labelledby={TITLE_ID} className="order-confirmation">
            <div className="order-confirmation__hero">
              <span className="order-confirmation__success">
                <Icon className="order-confirmation__success-icon" name="check" />
              </span>
              <h1 className="order-confirmation__title" id={TITLE_ID} tabIndex={-1}>
                Спасибо! Ваш заказ оформлен
              </h1>
              <p className="order-confirmation__lead">
                Это демонстрационный заказ. Он сохранён только в текущей сессии браузера — оплата и
                доставка не выполняются.
              </p>
              <p className="order-confirmation__number">
                <span className="order-confirmation__number-label">Номер демо-заказа</span>
                <span className="order-confirmation__number-value">{order.number}</span>
              </p>
            </div>

            <dl className="order-info">
              {info.map((item) => (
                <div className="order-info__item" key={item.term}>
                  <span className="order-info__glyph">
                    <Icon className="order-info__icon" name={item.icon} />
                  </span>
                  <div className="order-info__text">
                    <dt className="order-info__term">{item.term}</dt>
                    <dd className="order-info__value">
                      {item.value}
                      {item.detail === undefined ? null : (
                        <span className="order-info__detail">{item.detail}</span>
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="order-body">
              <section aria-labelledby="order-lines-title" className="order-lines">
                <h2 className="order-lines__title" id="order-lines-title">
                  Состав заказа{' '}
                  <span className="order-lines__count">{`(${formatUnitCount(order.totals.unitCount)})`}</span>
                </h2>
                <ul aria-label="Товары в заказе" className="order-lines__list">
                  {order.lines.map((line, index) => (
                    <li className="order-line" key={`${line.title}-${String(index)}`}>
                      <div className="order-line__media">
                        <CartLineMedia
                          className="order-line__image"
                          image={line.image}
                          productSlug={line.productSlug}
                          sizes={LINE_MEDIA_SIZES}
                        />
                      </div>
                      <div className="order-line__info">
                        <p className="order-line__title">{line.title}</p>
                        {line.variant === undefined ? null : (
                          <p className="order-line__variant">{line.variant}</p>
                        )}
                      </div>
                      <p className="order-line__quantity">{`${String(line.quantity)} шт.`}</p>
                      <p className="order-line__price">{formatPrice(line.price * line.quantity)}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="order-totals-title" className="order-totals">
                <h2 className="order-totals__title" id="order-totals-title">
                  Итого
                </h2>
                <dl className="order-totals__rows">
                  <div className="order-totals__row">
                    <dt>{`Товары (${String(order.totals.unitCount)})`}</dt>
                    <dd>{formatPrice(order.totals.listTotal)}</dd>
                  </div>
                  {order.totals.discount > 0 ? (
                    <div className="order-totals__row order-totals__row--discount">
                      <dt>Скидка</dt>
                      <dd>{`−${formatPrice(order.totals.discount)}`}</dd>
                    </div>
                  ) : null}
                  <div className="order-totals__row order-totals__row--total">
                    <dt>К оплате</dt>
                    <dd>{formatPrice(order.totals.total)}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="order-confirmation__actions">
              <a
                className="ui-button ui-button--primary order-confirmation__action"
                href={catalogHref}
              >
                Перейти к покупкам
              </a>
              <a
                className="ui-button ui-button--secondary order-confirmation__action"
                href={homeHref}
              >
                На главную
              </a>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

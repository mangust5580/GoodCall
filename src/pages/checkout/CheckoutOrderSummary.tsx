import { CartLineMedia, formatUnitCount, lineTotal } from '../../commerce/cart';
import type { CartLine, CartTotals } from '../../commerce/cart';
import { formatPrice } from '../../commerce/format';
import type { StorePoint } from '../../commerce/shops';
import { Button, Icon } from '../../components/ui';

interface CheckoutOrderSummaryProps {
  readonly lines: readonly CartLine[];
  readonly totals: CartTotals;
  readonly formId: string;
  readonly placing: boolean;
  readonly pickupStore?: StorePoint;
}

const LINE_MEDIA_SIZES = '72px';

export function CheckoutOrderSummary({
  lines,
  totals,
  formId,
  placing,
  pickupStore,
}: CheckoutOrderSummaryProps) {
  return (
    <section aria-labelledby="checkout-summary-title" className="checkout-summary">
      <div className="checkout-summary__card">
        <h2 className="checkout-summary__title" id="checkout-summary-title">
          Ваш заказ{' '}
          <span className="checkout-summary__count">{`(${formatUnitCount(totals.selectedUnitCount)})`}</span>
        </h2>

        <ul aria-label="Товары в заказе" className="checkout-summary__lines">
          {lines.map((line) => (
            <li className="checkout-line" key={line.id}>
              <div className="checkout-line__media">
                <CartLineMedia
                  className="checkout-line__image"
                  image={line.image}
                  productSlug={line.productSlug}
                  sizes={LINE_MEDIA_SIZES}
                />
              </div>
              <div className="checkout-line__info">
                <p className="checkout-line__title">{line.title}</p>
                {line.variant === undefined ? null : (
                  <p className="checkout-line__variant">{line.variant}</p>
                )}
                <p className="checkout-line__quantity">{`× ${line.quantity}`}</p>
              </div>
              <strong className="checkout-line__total">{formatPrice(lineTotal(line))}</strong>
            </li>
          ))}
        </ul>

        {pickupStore === undefined ? null : (
          <div className="checkout-summary__pickup">
            <p className="checkout-summary__pickup-label">Самовывоз</p>
            <p className="checkout-summary__pickup-name">{pickupStore.name}</p>
            <p className="checkout-summary__pickup-address">
              {pickupStore.city}, {pickupStore.address}
            </p>
          </div>
        )}

        <dl className="checkout-summary__rows">
          <div className="checkout-summary__row">
            <dt>{`Товары (${totals.selectedUnitCount})`}</dt>
            <dd>{formatPrice(totals.selectedListTotal)}</dd>
          </div>
          {totals.selectedDiscount > 0 ? (
            <div className="checkout-summary__row checkout-summary__row--discount">
              <dt>Скидка</dt>
              <dd>{`−${formatPrice(totals.selectedDiscount)}`}</dd>
            </div>
          ) : null}
          <div className="checkout-summary__row checkout-summary__row--total">
            <dt>К оплате</dt>
            <dd>{formatPrice(totals.selectedTotal)}</dd>
          </div>
        </dl>

        <Button className="checkout-summary__action" disabled={placing} form={formId} type="submit">
          Подтвердить заказ
        </Button>

        <div className="checkout-summary__note">
          <span className="checkout-summary__note-glyph">
            <Icon name="check" />
          </span>
          <div className="checkout-summary__note-body">
            <p className="checkout-summary__note-title">Ваши данные защищены</p>
            <p className="checkout-summary__note-text">
              Мы не передаём ваши данные третьим лицам и используем их только для оформления заказа.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Button } from '../../components/ui';
import type { CartTotals } from './cartPricing';
import { formatPrice } from './cartPricing';

interface CartOrderSummaryProps {
  readonly totals: CartTotals;
}

export function CartOrderSummary({ totals }: CartOrderSummaryProps) {
  return (
    <section aria-labelledby="cart-summary-title" className="cart-summary">
      <h2 className="cart-summary__title" id="cart-summary-title">
        Ваш заказ
      </h2>

      {totals.selectedUnitCount === 0 ? (
        <p className="cart-summary__empty">Не выбрано ни одного товара</p>
      ) : (
        <dl className="cart-summary__rows">
          <div className="cart-summary__row">
            <dt>{`Товары, ${totals.selectedUnitCount} шт.`}</dt>
            <dd>{formatPrice(totals.selectedListTotal)}</dd>
          </div>
          {totals.selectedDiscount > 0 ? (
            <div className="cart-summary__row">
              <dt>Скидка</dt>
              <dd>{`−${formatPrice(totals.selectedDiscount)}`}</dd>
            </div>
          ) : null}
          <div className="cart-summary__row cart-summary__row--total">
            <dt>Итого</dt>
            <dd>{formatPrice(totals.selectedTotal)}</dd>
          </div>
        </dl>
      )}

      <Button className="cart-summary__action" disabled variant="primary">
        Оформить заказ
      </Button>
    </section>
  );
}

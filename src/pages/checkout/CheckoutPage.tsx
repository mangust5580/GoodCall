import { cartTotals } from '../../commerce/cart';
import type { CartLine } from '../../commerce/cart';
import { Container } from '../../components/layout';
import type { AddressLookupClient, CityLookupClient, CityOption } from '../../components/location';
import { Icon } from '../../components/ui';
import { CheckoutForm } from './CheckoutForm';
import type { CheckoutFormState } from './checkoutFormModel';

export interface CheckoutPageProps {
  readonly homeHref: string;
  readonly cartHref: string;
  readonly lines: readonly CartLine[];
  readonly initialCity: CityOption | null;
  readonly cityLookupClient: CityLookupClient;
  readonly addressLookupClient: AddressLookupClient;
  readonly addressLookupConfigured: boolean;
  readonly onPlaceOrder: (form: CheckoutFormState) => void;
}

export function CheckoutPage({
  homeHref,
  cartHref,
  lines,
  initialCity,
  cityLookupClient,
  addressLookupClient,
  addressLookupConfigured,
  onPlaceOrder,
}: CheckoutPageProps) {
  const selectedLines = lines.filter((line) => line.selected);
  const totals = cartTotals(lines);

  return (
    <main className="checkout-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="checkout-page__breadcrumbs">
          <ol className="checkout-page__crumbs">
            <li className="checkout-page__crumb">
              <a className="checkout-page__crumb-link" href={homeHref}>
                Главная
              </a>
            </li>
            <li aria-current="page" className="checkout-page__crumb">
              Оформление заказа
            </li>
          </ol>
        </nav>

        {selectedLines.length === 0 ? (
          <section aria-labelledby="checkout-unavailable-title" className="checkout-unavailable">
            <span className="checkout-unavailable__visual">
              <Icon className="checkout-unavailable__icon" name="cart" />
            </span>
            <h1 className="checkout-unavailable__title" id="checkout-unavailable-title">
              Оформление заказа
            </h1>
            <p className="checkout-unavailable__message">
              {lines.length === 0
                ? 'В корзине пока нет товаров. Добавьте товары в корзину, чтобы оформить заказ.'
                : 'Не выбрано ни одного товара. Отметьте товары в корзине, чтобы оформить заказ.'}
            </p>
            <a
              className="ui-button ui-button--primary checkout-unavailable__action"
              href={cartHref}
            >
              Перейти в корзину
            </a>
          </section>
        ) : (
          <>
            <h1 className="ui-visually-hidden">Оформление заказа</h1>
            <CheckoutForm
              addressLookupClient={addressLookupClient}
              addressLookupConfigured={addressLookupConfigured}
              cityLookupClient={cityLookupClient}
              initialCity={initialCity}
              lines={selectedLines}
              onPlaceOrder={onPlaceOrder}
              totals={totals}
            />
          </>
        )}
      </Container>
    </main>
  );
}

import { formatPrice } from '../../commerce/format';
import { Icon } from '../../components/ui';
import type { ProductDetailsPaymentMethod, ProductDetailsService } from './productDetailsView';

interface ProductDeliveryPaymentProps {
  readonly delivery: readonly ProductDetailsService[];
  readonly paymentMethods: readonly ProductDetailsPaymentMethod[];
  readonly monthlyPayment: number;
  readonly installmentMonths: number;
}

export function ProductDeliveryPayment({
  delivery,
  paymentMethods,
  monthlyPayment,
  installmentMonths,
}: ProductDeliveryPaymentProps) {
  return (
    <div className="product-panel product-logistics">
      <h2 className="product-panel__title">Доставка и оплата</h2>

      <div className="product-logistics__grid">
        <section className="product-logistics__block">
          <h3 className="product-logistics__heading">Получение</h3>
          <ul className="product-info-list">
            {delivery.map((service) => (
              <li className="product-info-list__item" key={service.title}>
                <Icon className="product-info-list__icon" name={service.icon} />
                <span className="product-info-list__body">
                  <span className="product-info-list__title">{service.title}</span>
                  <span className="product-info-list__text">{service.lines.join(' · ')}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="product-logistics__block">
          <h3 className="product-logistics__heading">Способы оплаты</h3>
          <ul className="product-payment-methods">
            {paymentMethods.map((method) => (
              <li className="product-payment-methods__item" key={method.id}>
                <span className="product-payment-methods__label">{method.label}</span>
                <span className="product-payment-methods__visual">
                  {method.mark === undefined ? (
                    <Icon
                      className="product-payment-methods__glyph"
                      name={method.icon ?? 'smartphone'}
                    />
                  ) : (
                    <img
                      alt={method.mark.alt === method.label ? '' : method.mark.alt}
                      className={`product-payment-methods__mark product-payment-methods__mark--${method.mark.modifier}`}
                      src={method.mark.src}
                    />
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="product-logistics__installment">
            <span className="product-logistics__installment-label">Рассрочка</span>
            <span>
              от <strong>{formatPrice(monthlyPayment)}</strong> × {installmentMonths} мес
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}

import { formatPrice } from '../../commerce/format';
import { Chip, Icon } from '../../components/ui';
import type { ProductDetailsView } from './productDetailsView';

interface ProductOfferSummaryProps {
  readonly product: ProductDetailsView;
}

export function ProductOfferSummary({ product }: ProductOfferSummaryProps) {
  const monthlyPayment = Math.ceil(product.priceValue / product.installmentMonths);
  const savings =
    product.oldPriceValue === undefined ? undefined : product.oldPriceValue - product.priceValue;

  return (
    <aside aria-label="Условия покупки" className="product-offer">
      <div className="product-offer__section">
        <div className="product-offer__price-row">
          <p className="product-offer__price">{formatPrice(product.priceValue)}</p>
          {savings === undefined ? null : <Chip>Выгода {formatPrice(savings)}</Chip>}
        </div>
        <p className="product-offer__installment">
          <span className="product-offer__installment-label">Рассрочка</span>
          <span>
            <strong>{formatPrice(monthlyPayment)}</strong> × {product.installmentMonths} мес
          </span>
        </p>
      </div>

      <ul className="product-offer__section product-offer__services">
        {product.services.map((service) => (
          <li className="product-offer__service" key={service.title}>
            <Icon className="product-offer__icon" name={service.icon} />
            <span className="product-offer__service-body">
              <span className="product-offer__service-title">{service.title}</span>
              {service.lines.map((line) => (
                <span className="product-offer__service-line" key={line}>
                  {line}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>

      <section className="product-offer__section">
        <h2 className="product-offer__heading">Способы оплаты</h2>
        <ul className="product-offer__payments">
          {product.paymentMethods.map((method) => (
            <li className="product-offer__payment" key={method.id}>
              {method.mark === undefined ? (
                <span className="product-offer__payment-name">{method.label}</span>
              ) : (
                <img
                  alt={
                    method.label === method.mark.alt
                      ? method.label
                      : `${method.label} ${method.mark.alt}`
                  }
                  className={`product-offer__payment-mark product-offer__payment-mark--${method.mark.modifier}`}
                  src={method.mark.src}
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="product-offer__section">
        <h2 className="product-offer__heading">Нужна помощь?</h2>
        <ul className="product-offer__support">
          <li className="product-offer__service">
            <Icon className="product-offer__icon" name="phone" />
            <span className="product-offer__service-body">
              <a className="product-offer__phone" href={product.supportPhoneHref}>
                {product.supportPhone}
              </a>
              <span className="product-offer__service-line">{product.supportHours}</span>
            </span>
          </li>
          <li className="product-offer__service">
            <Icon className="product-offer__icon" name="headset" />
            <span className="product-offer__service-body">
              <span className="product-offer__service-title">Онлайн-чат</span>
              <span className="product-offer__service-line">{product.chatNote}</span>
            </span>
          </li>
        </ul>
      </section>
    </aside>
  );
}

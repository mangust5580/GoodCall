import { Button, QuantityStepper } from '../ui';

interface CommerceCartSummaryProps {
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly title: string;
  readonly price: string;
  readonly quantity: number;
  readonly onQuantityChange: (quantity: number) => void;
  readonly quantityLabel: string;
  readonly actionLabel: string;
  readonly actionHref?: string;
  readonly onAction?: () => void;
}

export function CommerceCartSummary({
  imageSrc,
  imageAlt,
  title,
  price,
  quantity,
  onQuantityChange,
  quantityLabel,
  actionLabel,
  actionHref,
  onAction,
}: CommerceCartSummaryProps) {
  return (
    <article className="commerce-cart-summary">
      <div className="commerce-cart-summary__item">
        <img alt={imageAlt} className="commerce-cart-summary__image" src={imageSrc} />
        <div className="commerce-cart-summary__details">
          <h3 className="commerce-cart-summary__title">{title}</h3>
          <p className="commerce-cart-summary__price">{price}</p>
          <QuantityStepper label={quantityLabel} onChange={onQuantityChange} value={quantity} />
        </div>
      </div>
      {actionHref === undefined ? (
        <Button className="commerce-cart-summary__action" onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      ) : (
        <a className="ui-button ui-button--primary commerce-cart-summary__action" href={actionHref}>
          {actionLabel}
        </a>
      )}
    </article>
  );
}

import { Chip, Icon } from '../ui';

interface OrderRowPresentationProps {
  readonly orderLabel: string;
  readonly date: string;
  readonly status: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly title: string;
  readonly variant?: string;
  readonly price: string;
  readonly quantity: string;
  readonly detailsLabel: string;
  readonly reorderLabel: string;
  readonly onReorder: () => void;
}

type OrderRowDetailsTarget =
  | {
      readonly detailsHref: string;
      readonly onDetails?: never;
    }
  | {
      readonly detailsHref?: never;
      readonly onDetails: () => void;
    };

type OrderRowProps = OrderRowPresentationProps & OrderRowDetailsTarget;

export function OrderRow(props: OrderRowProps) {
  const {
    orderLabel,
    date,
    status,
    imageSrc,
    imageAlt,
    title,
    variant,
    price,
    quantity,
    detailsLabel,
    reorderLabel,
    onReorder,
  } = props;

  return (
    <article className="order-row">
      <header className="order-row__head">
        <h3 className="order-row__number">{orderLabel}</h3>
        <p className="order-row__date">{date}</p>
        <Chip variant="success">{status}</Chip>
      </header>
      <div className="order-row__body">
        <img alt={imageAlt} className="order-row__image" src={imageSrc} />
        <div className="order-row__info">
          <p className="order-row__title">{title}</p>
          {variant === undefined ? null : <p className="order-row__variant">{variant}</p>}
          <p className="order-row__amount">
            <span className="order-row__price">{price}</span>
            <span className="order-row__quantity">{quantity}</span>
          </p>
        </div>
        <div className="order-row__actions">
          {props.detailsHref === undefined ? (
            <button
              aria-label={detailsLabel}
              className="account-action account-action--outline"
              onClick={props.onDetails}
              type="button"
            >
              <Icon name="chevron-right" />
            </button>
          ) : (
            <a
              aria-label={detailsLabel}
              className="account-action account-action--outline"
              href={props.detailsHref}
            >
              <Icon name="chevron-right" />
            </a>
          )}
          <button
            aria-label={reorderLabel}
            className="account-action account-action--cart"
            onClick={onReorder}
            type="button"
          >
            <Icon name="cart" />
          </button>
        </div>
      </div>
    </article>
  );
}

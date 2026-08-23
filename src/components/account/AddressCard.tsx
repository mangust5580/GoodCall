import { Icon } from '../ui';

interface AddressCardProps {
  readonly addressLine: string;
  readonly localityLine: string;
  readonly recipientName: string;
  readonly phone: string;
  readonly editLabel: string;
  readonly onEdit: () => void;
}

export function AddressCard({
  addressLine,
  localityLine,
  recipientName,
  phone,
  editLabel,
  onEdit,
}: AddressCardProps) {
  return (
    <article className="address-card">
      <div className="address-card__group">
        <Icon className="address-card__icon" name="map-pin" />
        <div className="address-card__content">
          <p className="address-card__line">{addressLine}</p>
          <p className="address-card__locality">{localityLine}</p>
        </div>
      </div>
      <div className="address-card__group address-card__group--contact">
        <Icon className="address-card__icon" name="person" />
        <div className="address-card__content">
          <p className="address-card__recipient">{recipientName}</p>
          <p className="address-card__phone">{phone}</p>
        </div>
      </div>
      <button
        aria-label={editLabel}
        className="account-action account-action--edit"
        onClick={onEdit}
        type="button"
      >
        <Icon name="edit" />
      </button>
    </article>
  );
}

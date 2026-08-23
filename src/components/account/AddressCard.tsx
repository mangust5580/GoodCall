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
      <p className="address-card__line">{addressLine}</p>
      <p className="address-card__locality">{localityLine}</p>
      <div className="address-card__contact">
        <p className="address-card__recipient">{recipientName}</p>
        <p className="address-card__phone">{phone}</p>
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

import { Icon } from '../ui';

export interface SavedPaymentEntry {
  readonly id: string;
  readonly brandSrc: string;
  readonly brandAlt: string;
  readonly cardLabel: string;
}

interface SavedPaymentListProps {
  readonly label: string;
  readonly entries: readonly SavedPaymentEntry[];
  readonly addLabel: string;
  readonly onAdd: () => void;
  readonly hideLabel?: boolean;
}

export function SavedPaymentList({
  label,
  entries,
  addLabel,
  onAdd,
  hideLabel = false,
}: SavedPaymentListProps) {
  return (
    <section className="saved-payment-list">
      <h3 className={hideLabel ? 'ui-visually-hidden' : 'saved-payment-list__title'}>{label}</h3>
      <ul className="saved-payment-list__items">
        {entries.map((entry) => (
          <li className="saved-payment-list__item" key={entry.id}>
            <img alt={entry.brandAlt} className="saved-payment-list__brand" src={entry.brandSrc} />
            <span className="saved-payment-list__card">{entry.cardLabel}</span>
          </li>
        ))}
      </ul>
      <button className="saved-payment-list__add" onClick={onAdd} type="button">
        <Icon name="edit" />
        <span>{addLabel}</span>
      </button>
    </section>
  );
}

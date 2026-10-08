import type { ReactNode } from 'react';

import { Icon } from '../ui';

interface AddressCardProps {
  readonly addressLine: string;
  readonly city: string;
  readonly postalCode?: string;
  readonly recipientName: string;
  readonly phone: string;
  readonly editLabel: string;
  readonly onEdit: () => void;
  readonly badge?: ReactNode;
  readonly deleteLabel?: string;
  readonly onDelete?: () => void;
  readonly actionContext?: string;
}

export function AddressCard({
  addressLine,
  city,
  postalCode,
  recipientName,
  phone,
  editLabel,
  onEdit,
  badge,
  deleteLabel,
  onDelete,
  actionContext,
}: AddressCardProps) {
  const context =
    actionContext === undefined ? null : (
      <span className="ui-visually-hidden">: {actionContext}</span>
    );

  return (
    <article className="address-card">
      {badge === undefined ? null : <div className="address-card__badge">{badge}</div>}
      <div className="address-card__group">
        <Icon className="address-card__icon" name="map-pin" />
        <div className="address-card__content">
          <p className="address-card__line">{addressLine}</p>
          <p className="address-card__locality">
            <span className="address-card__city">{city}</span>
            {postalCode === undefined ? null : (
              <>
                {', '}
                <span className="address-card__postal">{postalCode}</span>
              </>
            )}
          </p>
        </div>
      </div>
      <div className="address-card__group address-card__group--contact">
        <Icon className="address-card__icon" name="person" />
        <div className="address-card__content">
          <p className="address-card__recipient">{recipientName}</p>
          <p className="address-card__phone">{phone}</p>
        </div>
      </div>
      {deleteLabel === undefined || onDelete === undefined ? (
        <button className="address-card__edit" onClick={onEdit} type="button">
          <Icon name="edit" />
          <span>{editLabel}</span>
          {context}
        </button>
      ) : (
        <div className="address-card__actions">
          <button
            className="address-card__edit address-card__edit--inline"
            onClick={onEdit}
            type="button"
          >
            <Icon name="edit" />
            <span>{editLabel}</span>
            {context}
          </button>
          <button
            className="address-card__edit address-card__edit--inline address-card__edit--danger"
            onClick={onDelete}
            type="button"
          >
            <Icon name="close" />
            <span>{deleteLabel}</span>
            {context}
          </button>
        </div>
      )}
    </article>
  );
}

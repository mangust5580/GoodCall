import { Icon } from '../ui';

interface CommerceLocationCardProps {
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly title: string;
  readonly address: string;
  readonly hours: string;
  readonly phone: string;
  readonly phoneHref?: string;
}

export function CommerceLocationCard({
  imageSrc,
  imageAlt,
  title,
  address,
  hours,
  phone,
  phoneHref,
}: CommerceLocationCardProps) {
  return (
    <article className="commerce-location-card">
      <img alt={imageAlt} className="commerce-location-card__image" src={imageSrc} />
      <h3 className="commerce-location-card__title">{title}</h3>
      <ul className="commerce-location-card__rows">
        <li className="commerce-location-card__row">
          <Icon className="commerce-location-card__icon" name="map-pin" />
          <span>{address}</span>
        </li>
        <li className="commerce-location-card__row">
          <Icon className="commerce-location-card__icon" name="clock" />
          <span>{hours}</span>
        </li>
        <li className="commerce-location-card__row">
          <Icon className="commerce-location-card__icon" name="phone" />
          {phoneHref === undefined ? (
            <span>{phone}</span>
          ) : (
            <a className="commerce-location-card__phone" href={phoneHref}>
              {phone}
            </a>
          )}
        </li>
      </ul>
    </article>
  );
}

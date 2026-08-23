import { Icon } from '../ui';

interface CommerceServiceCardProps {
  readonly title: string;
  readonly address: string;
  readonly hours: string;
  readonly phone: string;
  readonly phoneHref?: string;
}

export function CommerceServiceCard({
  title,
  address,
  hours,
  phone,
  phoneHref,
}: CommerceServiceCardProps) {
  return (
    <article className="commerce-service-card">
      <Icon className="commerce-service-card__glyph" name="tools" />
      <div className="commerce-service-card__body">
        <h3 className="commerce-service-card__title">{title}</h3>
        <ul className="commerce-service-card__rows">
          <li className="commerce-service-card__row">
            <Icon className="commerce-service-card__icon" name="map-pin" />
            <span>{address}</span>
          </li>
          <li className="commerce-service-card__row">
            <Icon className="commerce-service-card__icon" name="clock" />
            <span>{hours}</span>
          </li>
          <li className="commerce-service-card__row">
            <Icon className="commerce-service-card__icon" name="phone" />
            {phoneHref === undefined ? (
              <span>{phone}</span>
            ) : (
              <a className="commerce-service-card__phone" href={phoneHref}>
                {phone}
              </a>
            )}
          </li>
        </ul>
      </div>
    </article>
  );
}

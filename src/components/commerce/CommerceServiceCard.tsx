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
      <Icon className="commerce-service-card__icon" name="tools" />
      <div className="commerce-service-card__body">
        <h3 className="commerce-service-card__title">{title}</h3>
        <p className="commerce-service-card__line">{address}</p>
        <p className="commerce-service-card__line">{hours}</p>
        <p className="commerce-service-card__line">
          {phoneHref === undefined ? (
            phone
          ) : (
            <a className="commerce-service-card__phone" href={phoneHref}>
              {phone}
            </a>
          )}
        </p>
      </div>
    </article>
  );
}

import { Button } from '../ui';

interface PromoBannerProps {
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly href?: string;
  readonly onAction?: () => void;
}

export function PromoBanner({
  title,
  imageSrc,
  imageAlt,
  description,
  actionLabel,
  href,
  onAction,
}: PromoBannerProps) {
  const action = (() => {
    if (actionLabel === undefined) {
      return null;
    }

    if (href !== undefined) {
      return (
        <a className="ui-button ui-button--secondary promo-banner__action" href={href}>
          {actionLabel}
        </a>
      );
    }

    if (onAction !== undefined) {
      return (
        <Button className="promo-banner__action" onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      );
    }

    return null;
  })();

  return (
    <div className="promo-banner">
      <div className="promo-banner__content">
        <h3 className="promo-banner__title">{title}</h3>
        {description === undefined ? null : (
          <p className="promo-banner__description">{description}</p>
        )}
        {action}
      </div>
      <img alt={imageAlt} className="promo-banner__image" src={imageSrc} />
    </div>
  );
}

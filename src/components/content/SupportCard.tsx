import { Icon } from '../ui';
import type { IconName } from '../ui';

interface SupportCardProps {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
}

export function SupportCard({ icon, title, description }: SupportCardProps) {
  return (
    <article className="support-card">
      <Icon className="support-card__icon" name={icon} />
      <h3 className="support-card__title">{title}</h3>
      <p className="support-card__description">{description}</p>
    </article>
  );
}

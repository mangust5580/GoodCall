import { Icon } from '../ui';
import type { IconName } from '../ui';

export interface BenefitItem {
  readonly title: string;
  readonly note: string;
  readonly icon: IconName;
}

interface BenefitsStripProps {
  readonly label: string;
  readonly items: readonly BenefitItem[];
}

export function BenefitsStrip({ label, items }: BenefitsStripProps) {
  return (
    <section aria-label={label} className="benefits-strip">
      <ul className="benefits-strip__list">
        {items.map((item) => (
          <li className="benefits-strip__item" key={item.title}>
            <span className="benefits-strip__glyph">
              <Icon name={item.icon} />
            </span>
            <span className="benefits-strip__body">
              <span className="benefits-strip__title">{item.title}</span>
              <span className="benefits-strip__note">{item.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

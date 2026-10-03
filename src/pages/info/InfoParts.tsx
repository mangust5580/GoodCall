import type { ReactNode } from 'react';

import { BenefitsStrip } from '../../components/content';
import type { BenefitItem } from '../../components/content';
import { Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';

interface InfoHighlightsProps {
  readonly label: string;
  readonly items: readonly BenefitItem[];
}

export function InfoHighlights({ label, items }: InfoHighlightsProps) {
  return (
    <div className="info-highlights">
      <BenefitsStrip items={items} label={label} />
    </div>
  );
}

interface InfoIllustrationProps {
  readonly icon: IconName;
  readonly size?: 'lg' | 'md';
}

export function InfoIllustration({ icon, size = 'lg' }: InfoIllustrationProps) {
  return (
    <div aria-hidden="true" className={`info-illustration info-illustration--${size}`}>
      <span className="info-illustration__halo" />
      <span className="info-illustration__dot info-illustration__dot--one" />
      <span className="info-illustration__dot info-illustration__dot--two" />
      <span className="info-illustration__dot info-illustration__dot--three" />
      <span className="info-illustration__core">
        <Icon className="info-illustration__icon" name={icon} />
      </span>
    </div>
  );
}

interface InfoNoticeProps {
  readonly children: ReactNode;
}

export function InfoNotice({ children }: InfoNoticeProps) {
  return (
    <div className="info-notice">
      <Icon className="info-notice__icon" name="info" />
      <p className="info-notice__text">{children}</p>
    </div>
  );
}

interface InfoCheckListProps {
  readonly items: readonly string[];
  readonly label?: string;
}

export function InfoCheckList({ items, label }: InfoCheckListProps) {
  return (
    <ul aria-label={label} className="info-check-list">
      {items.map((item) => (
        <li className="info-check-list__item" key={item}>
          <span className="info-check-list__mark">
            <Icon name="check" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export interface InfoFact {
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

interface InfoFactsProps {
  readonly items: readonly InfoFact[];
  readonly label?: string;
}

export function InfoFacts({ items, label }: InfoFactsProps) {
  return (
    <ul aria-label={label} className="info-facts">
      {items.map((item) => (
        <li className="info-facts__item" key={item.title}>
          <span className="info-facts__glyph">
            <Icon name={item.icon} />
          </span>
          <span className="info-facts__body">
            <span className="info-facts__title">{item.title}</span>
            <span className="info-facts__text">{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export interface InfoStep {
  readonly icon: IconName;
  readonly text: string;
}

interface InfoStepsProps {
  readonly items: readonly InfoStep[];
  readonly label: string;
}

export function InfoSteps({ items, label }: InfoStepsProps) {
  return (
    <ol aria-label={label} className="info-steps">
      {items.map((step) => (
        <li className="info-steps__item" key={step.text}>
          <span className="info-steps__glyph">
            <Icon name={step.icon} />
          </span>
          <span className="info-steps__text">{step.text}</span>
        </li>
      ))}
    </ol>
  );
}

interface InfoSectionHeadingProps {
  readonly id: string;
  readonly title: string;
  readonly lead?: string;
  readonly focusable?: boolean;
}

export function InfoSectionHeading({
  id,
  title,
  lead,
  focusable = false,
}: InfoSectionHeadingProps) {
  return (
    <div className="info-section__heading">
      <h2 className="info-section__title" id={id} tabIndex={focusable ? -1 : undefined}>
        {title}
      </h2>
      {lead === undefined ? null : <p className="info-section__lead">{lead}</p>}
    </div>
  );
}

import React from 'react';
import styles from './ErrorSummary.module.scss';
import { classNames } from '../../internal/class-names';
import {
  requireNonBlankText,
  withoutRegionConflicts,
  type RegionFeedbackForbiddenProp,
} from '../internal/feedback-props';

export interface ErrorSummaryItem {
  message: string;
  targetId?: string;
}

export interface ErrorSummaryProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  RegionFeedbackForbiddenProp | 'title'
> {
  title: string;
  items: readonly ErrorSummaryItem[];
  headingLevel?: 2 | 3 | 4;
  ref?: React.Ref<HTMLElement>;
}

const HEADING_TAGS = {
  2: 'h2',
  3: 'h3',
  4: 'h4',
} as const;

function focusSummaryTarget(event: React.MouseEvent<HTMLAnchorElement>, targetId: string): void {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const target = document.getElementById(targetId);

  if (target instanceof HTMLElement) {
    event.preventDefault();
    target.focus();
  }
}

export function ErrorSummary({
  title,
  items,
  headingLevel = 2,
  className,
  ref,
  ...rest
}: ErrorSummaryProps): React.ReactElement {
  const generatedId = React.useId();

  requireNonBlankText('ErrorSummary', title, 'title');

  if (items.length === 0) {
    throw new Error('ErrorSummary requires at least one item: an empty summary has nothing to fix');
  }

  for (const item of items) {
    requireNonBlankText('ErrorSummary', item.message, 'message');

    if (item.targetId !== undefined) {
      requireNonBlankText('ErrorSummary', item.targetId, 'targetId');
    }
  }

  const Heading = HEADING_TAGS[headingLevel];

  if (Heading === undefined) {
    throw new Error(
      `ErrorSummary received an unsupported heading level "${String(headingLevel)}"; supported levels are 2, 3, 4`
    );
  }

  const titleId = `${generatedId}-error-summary-title`;

  return (
    <section
      {...withoutRegionConflicts(rest)}
      ref={ref}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={classNames(styles['error-summary'], className)}
    >
      <Heading id={titleId} className={styles['title']}>
        {title}
      </Heading>
      <ul className={styles['list']}>
        {items.map((item, index) => (
          <li key={`${item.message}-${String(index)}`} className={styles['item']}>
            {item.targetId === undefined ? (
              <span>{item.message}</span>
            ) : (
              <a
                href={`#${encodeURIComponent(item.targetId)}`}
                className={styles['link']}
                onClick={(event) => {
                  focusSummaryTarget(event, item.targetId ?? '');
                }}
              >
                {item.message}
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

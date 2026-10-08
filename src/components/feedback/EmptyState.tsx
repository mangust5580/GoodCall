import { useId } from 'react';
import type { ReactNode } from 'react';

import { Icon } from '../ui';
import type { IconName } from '../ui';
import { FeedbackActionButton } from './feedbackAction';
import type { FeedbackAction } from './feedbackAction';

interface EmptyStateContent {
  readonly icon: IconName;
  readonly headingLevel: 'h1' | 'h2' | 'h3';
  readonly title: string;
  readonly titleId?: string;
  readonly message: ReactNode;
  readonly action: FeedbackAction;
  readonly className?: string;
}

type EmptyStateProps = EmptyStateContent &
  (
    | { readonly variant?: 'panel'; readonly secondaryAction?: never }
    | { readonly variant: 'page'; readonly secondaryAction?: FeedbackAction }
  );

export function EmptyState({
  variant = 'panel',
  icon,
  headingLevel,
  title,
  titleId,
  message,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const generatedId = useId();
  const headingId = titleId ?? generatedId;
  const Heading = headingLevel;
  const lead = variant === 'page' && headingLevel === 'h1';
  const rootClass = `empty-state empty-state--${variant}`;

  return (
    <section
      aria-labelledby={headingId}
      className={className === undefined ? rootClass : `${rootClass} ${className}`}
    >
      {variant === 'page' ? (
        <span className="empty-state__visual">
          <Icon className="empty-state__icon" name={icon} />
        </span>
      ) : (
        <Icon className="empty-state__icon" name={icon} />
      )}
      <Heading
        className={lead ? 'empty-state__title empty-state__title--lead' : 'empty-state__title'}
        id={headingId}
        tabIndex={lead ? -1 : undefined}
      >
        {title}
      </Heading>
      <p className="empty-state__message">{message}</p>
      {variant === 'page' ? (
        <div className="empty-state__actions">
          <FeedbackActionButton action={action} className="empty-state__action" />
          {secondaryAction === undefined ? null : (
            <FeedbackActionButton
              action={secondaryAction}
              className="empty-state__action"
              variant="secondary"
            />
          )}
        </div>
      ) : (
        <FeedbackActionButton action={action} className="empty-state__action" />
      )}
    </section>
  );
}

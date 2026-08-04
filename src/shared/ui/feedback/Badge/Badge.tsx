import React from 'react';
import styles from './Badge.module.scss';
import { classNames } from '../../internal/class-names';
import {
  requireNonBlankText,
  withoutCompactConflicts,
  type CompactFeedbackForbiddenProp,
} from '../internal/feedback-props';
import { assertFeedbackTone, type FeedbackTone } from '../internal/feedback-tone';

export interface BadgeProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  CompactFeedbackForbiddenProp
> {
  children: string;
  tone?: FeedbackTone;
}

export function Badge({
  children,
  tone = 'neutral',
  className,
  ...rest
}: BadgeProps): React.ReactElement {
  requireNonBlankText('Badge', children, 'label');
  const resolvedTone = assertFeedbackTone('Badge', tone);

  return (
    <span
      {...withoutCompactConflicts(rest)}
      className={classNames(styles['badge'], styles[`tone-${resolvedTone}`], className)}
    >
      {children}
    </span>
  );
}

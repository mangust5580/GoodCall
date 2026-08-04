import React from 'react';
import styles from './Status.module.scss';
import { classNames } from '../../internal/class-names';
import {
  requireNonBlankText,
  withoutCompactConflicts,
  type CompactFeedbackForbiddenProp,
} from '../internal/feedback-props';
import { assertFeedbackTone, type FeedbackTone } from '../internal/feedback-tone';

export interface StatusProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  CompactFeedbackForbiddenProp
> {
  children: string;
  tone: FeedbackTone;
}

export function Status({ children, tone, className, ...rest }: StatusProps): React.ReactElement {
  requireNonBlankText('Status', children, 'text');
  const resolvedTone = assertFeedbackTone('Status', tone);

  return (
    <span
      {...withoutCompactConflicts(rest)}
      className={classNames(styles['status'], styles[`tone-${resolvedTone}`], className)}
    >
      {children}
    </span>
  );
}

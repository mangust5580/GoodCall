import React from 'react';
import styles from './Counter.module.scss';
import { classNames } from '../../internal/class-names';
import {
  normalizeCounterValue,
  withoutCompactConflicts,
  type CompactFeedbackForbiddenProp,
} from '../internal/feedback-props';
import { assertFeedbackTone, type FeedbackTone } from '../internal/feedback-tone';

export interface CounterProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  CompactFeedbackForbiddenProp
> {
  value: number | string;
  tone?: FeedbackTone;
}

export function Counter({
  value,
  tone = 'neutral',
  className,
  ...rest
}: CounterProps): React.ReactElement {
  const resolvedValue = normalizeCounterValue(value);
  const resolvedTone = assertFeedbackTone('Counter', tone);

  return (
    <span
      {...withoutCompactConflicts(rest)}
      className={classNames(styles['counter'], styles[`tone-${resolvedTone}`], className)}
    >
      {resolvedValue}
    </span>
  );
}

import React from 'react';
import styles from './InlineStatus.module.scss';
import { classNames } from '../../internal/class-names';
import {
  withoutRegionConflicts,
  type RegionFeedbackForbiddenProp,
} from '../internal/feedback-props';
import {
  assertInlineStatusRole,
  assertInlineStatusTone,
  type InlineStatusRole,
  type InlineStatusTone,
} from '../internal/feedback-tone';

export interface InlineStatusProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  RegionFeedbackForbiddenProp
> {
  tone: InlineStatusTone;
  role?: InlineStatusRole;
  children: React.ReactNode;
}

export function InlineStatus({
  tone,
  role,
  children,
  className,
  ...rest
}: InlineStatusProps): React.ReactElement {
  const resolvedTone = assertInlineStatusTone('InlineStatus', tone);
  const resolvedRole =
    role === undefined ? undefined : assertInlineStatusRole('InlineStatus', role);

  return (
    <div
      {...withoutRegionConflicts(rest)}
      role={resolvedRole}
      className={classNames(styles['inline-status'], styles[`tone-${resolvedTone}`], className)}
    >
      {children}
    </div>
  );
}

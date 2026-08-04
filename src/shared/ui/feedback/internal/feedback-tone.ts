export type FeedbackTone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'current';

export type InlineStatusTone =
  'info' | 'pending' | 'success' | 'warning' | 'error' | 'stale' | 'offline';

export type InlineStatusRole = 'status' | 'alert';

const FEEDBACK_TONES: readonly string[] = [
  'neutral',
  'info',
  'success',
  'warning',
  'error',
  'current',
];

const INLINE_STATUS_TONES: readonly string[] = [
  'info',
  'pending',
  'success',
  'warning',
  'error',
  'stale',
  'offline',
];

const INLINE_STATUS_ROLES: readonly string[] = ['status', 'alert'];

export function assertFeedbackTone(component: string, tone: FeedbackTone): FeedbackTone {
  if (!FEEDBACK_TONES.includes(tone)) {
    throw new Error(
      `${component} received an unsupported tone "${String(tone)}"; supported tones are ${FEEDBACK_TONES.join(', ')}`
    );
  }

  return tone;
}

export function assertInlineStatusTone(
  component: string,
  tone: InlineStatusTone
): InlineStatusTone {
  if (!INLINE_STATUS_TONES.includes(tone)) {
    throw new Error(
      `${component} received an unsupported tone "${String(tone)}"; supported tones are ${INLINE_STATUS_TONES.join(', ')}`
    );
  }

  return tone;
}

export function assertInlineStatusRole(
  component: string,
  role: InlineStatusRole
): InlineStatusRole {
  if (!INLINE_STATUS_ROLES.includes(role)) {
    throw new Error(
      `${component} received an unsupported role "${String(role)}"; supported roles are ${INLINE_STATUS_ROLES.join(', ')}`
    );
  }

  return role;
}

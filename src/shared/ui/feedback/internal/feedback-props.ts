type CompactFeedbackConflicts = {
  children?: unknown;
  style?: unknown;
  dangerouslySetInnerHTML?: unknown;
  role?: unknown;
  tabIndex?: unknown;
  contentEditable?: unknown;
  autoFocus?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  'aria-live'?: unknown;
  'aria-atomic'?: unknown;
  'aria-relevant'?: unknown;
  'aria-busy'?: unknown;
};

type RegionFeedbackConflicts = CompactFeedbackConflicts & {
  hidden?: unknown;
  inert?: unknown;
  'aria-hidden'?: unknown;
};

export type CompactFeedbackForbiddenProp = keyof CompactFeedbackConflicts;

export type RegionFeedbackForbiddenProp = keyof RegionFeedbackConflicts;

export function withoutCompactConflicts<TProps extends object>(
  props: TProps & CompactFeedbackConflicts
): Omit<TProps, CompactFeedbackForbiddenProp> {
  const {
    children,
    style,
    dangerouslySetInnerHTML,
    role,
    tabIndex,
    contentEditable,
    autoFocus,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-live': ariaLive,
    'aria-atomic': ariaAtomic,
    'aria-relevant': ariaRelevant,
    'aria-busy': ariaBusy,
    ...forwarded
  } = props;

  void [
    children,
    style,
    dangerouslySetInnerHTML,
    role,
    tabIndex,
    contentEditable,
    autoFocus,
    ariaLabel,
    ariaLabelledby,
    ariaLive,
    ariaAtomic,
    ariaRelevant,
    ariaBusy,
  ];

  return forwarded;
}

export function withoutRegionConflicts<TProps extends object>(
  props: TProps & RegionFeedbackConflicts
): Omit<TProps, RegionFeedbackForbiddenProp> {
  const {
    children,
    style,
    dangerouslySetInnerHTML,
    role,
    tabIndex,
    contentEditable,
    autoFocus,
    hidden,
    inert,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-live': ariaLive,
    'aria-atomic': ariaAtomic,
    'aria-relevant': ariaRelevant,
    'aria-busy': ariaBusy,
    'aria-hidden': ariaHidden,
    ...forwarded
  } = props;

  void [
    children,
    style,
    dangerouslySetInnerHTML,
    role,
    tabIndex,
    contentEditable,
    autoFocus,
    hidden,
    inert,
    ariaLabel,
    ariaLabelledby,
    ariaLive,
    ariaAtomic,
    ariaRelevant,
    ariaBusy,
    ariaHidden,
  ];

  return forwarded;
}

export function requireNonBlankText(component: string, value: string, subject: string): string {
  if (value.trim().length === 0) {
    throw new Error(`${component} requires a non-empty ${subject}: it is the visible content`);
  }

  return value;
}

export function normalizeCounterValue(value: number | string): string {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error(
        `Counter requires a finite value; received "${String(value)}". Format the value before passing it.`
      );
    }

    return String(value);
  }

  if (value.trim().length === 0) {
    throw new Error('Counter requires a non-empty value: it is the visible content');
  }

  return value;
}

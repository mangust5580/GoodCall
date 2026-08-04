import { describe, it, expect } from 'vitest';
import type { HTMLAttributes, Ref } from 'react';
import type {
  BadgeProps,
  CounterProps,
  ErrorSummaryItem,
  ErrorSummaryProps,
  FeedbackTone,
  InlineStatusProps,
  InlineStatusRole,
  InlineStatusTone,
  StatusProps,
} from '@/shared/ui';

type Assert<T extends true> = T;

type Absent<TProps, TKeys> = [Extract<keyof TProps, TKeys>] extends [never] ? true : false;

type Present<TProps, TKeys extends PropertyKey> = TKeys extends keyof TProps ? true : false;

type IsRequired<TProps, TKey extends keyof TProps> =
  Record<never, never> extends Pick<TProps, TKey> ? false : true;

type FeedbackForbiddenProp =
  | 'children'
  | 'style'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'autoFocus'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'aria-atomic'
  | 'aria-relevant'
  | 'aria-busy';

type CompactSafeProp = 'id' | 'className' | 'title' | 'aria-describedby' | 'aria-hidden';

type BadgeForbiddenAbsent = Assert<Absent<BadgeProps, Exclude<FeedbackForbiddenProp, 'children'>>>;
type BadgeChildrenRequiredString = Assert<
  IsRequired<BadgeProps, 'children'> extends true
    ? BadgeProps['children'] extends string
      ? true
      : false
    : false
>;
type BadgeToneOptional = Assert<
  IsRequired<BadgeProps, 'tone'> extends false
    ? BadgeProps['tone'] extends FeedbackTone | undefined
      ? true
      : false
    : false
>;
type BadgeSafePropsPresent = Assert<Present<BadgeProps, CompactSafeProp>>;

type CounterForbiddenAbsent = Assert<Absent<CounterProps, FeedbackForbiddenProp>>;
type CounterValueRequired = Assert<IsRequired<CounterProps, 'value'>>;
type CounterValueAcceptsNumberOrString = Assert<
  number extends CounterProps['value']
    ? string extends CounterProps['value']
      ? true
      : false
    : false
>;
type CounterSafePropsPresent = Assert<Present<CounterProps, CompactSafeProp>>;

type StatusForbiddenAbsent = Assert<
  Absent<StatusProps, Exclude<FeedbackForbiddenProp, 'children'>>
>;
type StatusChildrenRequiredString = Assert<
  IsRequired<StatusProps, 'children'> extends true
    ? StatusProps['children'] extends string
      ? true
      : false
    : false
>;
type StatusToneRequired = Assert<IsRequired<StatusProps, 'tone'>>;

type InlineStatusForbiddenAbsent = Assert<
  Absent<
    InlineStatusProps,
    Exclude<FeedbackForbiddenProp, 'children' | 'role'> | 'hidden' | 'inert' | 'aria-hidden'
  >
>;
type InlineStatusChildrenRequired = Assert<IsRequired<InlineStatusProps, 'children'>>;
type InlineStatusToneRequired = Assert<
  IsRequired<InlineStatusProps, 'tone'> extends true
    ? InlineStatusProps['tone'] extends InlineStatusTone
      ? true
      : false
    : false
>;
type InlineStatusRoleRestricted = Assert<
  IsRequired<InlineStatusProps, 'role'> extends false
    ? InlineStatusProps['role'] extends InlineStatusRole | undefined
      ? true
      : false
    : false
>;
type InlineStatusRoleExcludesArbitrary = Assert<
  Extract<InlineStatusRole, 'dialog' | 'button' | 'log' | 'marquee'> extends never ? true : false
>;

type ErrorSummaryForbiddenAbsent = Assert<
  Absent<
    ErrorSummaryProps,
    | 'children'
    | 'style'
    | 'dangerouslySetInnerHTML'
    | 'role'
    | 'tabIndex'
    | 'aria-labelledby'
    | 'aria-live'
    | 'aria-atomic'
    | 'aria-relevant'
    | 'aria-busy'
    | 'aria-hidden'
    | 'hidden'
    | 'inert'
  >
>;
type ErrorSummaryTitleRequired = Assert<IsRequired<ErrorSummaryProps, 'title'>>;
type ErrorSummaryItemsRequired = Assert<
  IsRequired<ErrorSummaryProps, 'items'> extends true
    ? ErrorSummaryProps['items'] extends readonly ErrorSummaryItem[]
      ? true
      : false
    : false
>;
type ErrorSummaryHeadingLevelRestricted = Assert<
  ErrorSummaryProps['headingLevel'] extends 2 | 3 | 4 | undefined ? true : false
>;
type ErrorSummaryRefTarget = Assert<
  NonNullable<ErrorSummaryProps['ref']> extends Ref<HTMLElement> ? true : false
>;
type ErrorSummaryItemMessageRequired = Assert<IsRequired<ErrorSummaryItem, 'message'>>;
type ErrorSummaryItemTargetOptional = Assert<
  IsRequired<ErrorSummaryItem, 'targetId'> extends false ? true : false
>;

type ForbiddenPropsExistOnHtmlBase = Assert<
  Present<HTMLAttributes<HTMLElement>, Exclude<FeedbackForbiddenProp, never>>
>;

describe('Feedback primitive type contracts', () => {
  it('removes content, semantics and live-region props from the compact family', () => {
    const results: true[] = [
      true satisfies BadgeForbiddenAbsent,
      true satisfies CounterForbiddenAbsent,
      true satisfies StatusForbiddenAbsent,
    ];

    expect(results).toHaveLength(3);
  });

  it('keeps the compact family content and tone contracts', () => {
    const results: true[] = [
      true satisfies BadgeChildrenRequiredString,
      true satisfies BadgeToneOptional,
      true satisfies BadgeSafePropsPresent,
      true satisfies CounterValueRequired,
      true satisfies CounterValueAcceptsNumberOrString,
      true satisfies CounterSafePropsPresent,
      true satisfies StatusChildrenRequiredString,
      true satisfies StatusToneRequired,
    ];

    expect(results).toHaveLength(8);
  });

  it('restricts InlineStatus to an explicit tone and an opt-in live role', () => {
    const results: true[] = [
      true satisfies InlineStatusForbiddenAbsent,
      true satisfies InlineStatusChildrenRequired,
      true satisfies InlineStatusToneRequired,
      true satisfies InlineStatusRoleRestricted,
      true satisfies InlineStatusRoleExcludesArbitrary,
    ];

    expect(results).toHaveLength(5);
  });

  it('keeps ErrorSummary content, heading and ref contracts', () => {
    const results: true[] = [
      true satisfies ErrorSummaryForbiddenAbsent,
      true satisfies ErrorSummaryTitleRequired,
      true satisfies ErrorSummaryItemsRequired,
      true satisfies ErrorSummaryHeadingLevelRestricted,
      true satisfies ErrorSummaryRefTarget,
      true satisfies ErrorSummaryItemMessageRequired,
      true satisfies ErrorSummaryItemTargetOptional,
    ];

    expect(results).toHaveLength(7);
  });

  it('guards against the native base type silently dropping the forbidden props', () => {
    const forbiddenPropsExistOnHtmlBase: ForbiddenPropsExistOnHtmlBase = true;

    expect(forbiddenPropsExistOnHtmlBase).toBe(true);
  });
});

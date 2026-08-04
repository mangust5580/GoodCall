import { describe, it, expect } from 'vitest';
import type { HTMLAttributes } from 'react';
import type { VisuallyHiddenProps } from '@/shared/ui';

type Assert<T extends true> = T;

type ForbiddenProp = 'style' | 'hidden' | 'aria-hidden' | 'inert' | 'tabIndex';

type PreservedProp = 'id' | 'className' | 'role' | 'aria-live';

type ForbiddenPropsRemoved = Assert<
  [Extract<keyof VisuallyHiddenProps, ForbiddenProp>] extends [never] ? true : false
>;

type PreservedPropsAvailable = Assert<
  PreservedProp extends keyof VisuallyHiddenProps ? true : false
>;

type ForbiddenPropsExistOnBaseAttributes = Assert<
  ForbiddenProp extends keyof HTMLAttributes<HTMLElement> ? true : false
>;

describe('VisuallyHiddenProps type contract', () => {
  it('removes props that would break the accessibility contract', () => {
    const forbiddenPropsRemoved: ForbiddenPropsRemoved = true;

    expect(forbiddenPropsRemoved).toBe(true);
  });

  it('preserves consumer-owned identity and ARIA props', () => {
    const preservedPropsAvailable: PreservedPropsAvailable = true;

    expect(preservedPropsAvailable).toBe(true);
  });

  it('guards against the base attribute type silently dropping the forbidden props', () => {
    const forbiddenPropsExistOnBaseAttributes: ForbiddenPropsExistOnBaseAttributes = true;

    expect(forbiddenPropsExistOnBaseAttributes).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import * as sharedUi from '@/shared/ui';

const APPROVED_RUNTIME_EXPORTS = [
  'Badge',
  'Button',
  'Checkbox',
  'Counter',
  'ErrorSummary',
  'Grid',
  'IconButton',
  'InlineStatus',
  'Link',
  'PageContainer',
  'Radio',
  'Select',
  'Stack',
  'Status',
  'Switch',
  'Textarea',
  'TextField',
  'VisuallyHidden',
];

const PROHIBITED_EXPORTS = [
  'Toast',
  'Snackbar',
  'MessageBanner',
  'Alert',
  'Notice',
  'Callout',
  'Spinner',
  'Progress',
  'Skeleton',
  'EmptyState',
  'AsyncState',
  'Form',
  'FormProvider',
  'classNames',
  'FieldShell',
  'withoutFieldConflicts',
  'withoutOwnedAttributes',
];

describe('Shared UI public entry point', () => {
  it('exposes exactly the approved runtime exports', () => {
    expect(Object.keys(sharedUi).sort()).toEqual([...APPROVED_RUNTIME_EXPORTS].sort());
  });

  it('exposes exactly eighteen runtime exports', () => {
    expect(Object.keys(sharedUi)).toHaveLength(18);
  });

  it('exposes every approved export as a component function', () => {
    for (const name of APPROVED_RUNTIME_EXPORTS) {
      expect(typeof sharedUi[name as keyof typeof sharedUi]).toBe('function');
    }
  });

  it('exposes no private helper or prohibited primitive', () => {
    const exported = Object.keys(sharedUi);

    for (const name of PROHIBITED_EXPORTS) {
      expect(exported).not.toContain(name);
    }
  });
});

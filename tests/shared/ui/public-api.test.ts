import { describe, it, expect } from 'vitest';
import * as sharedUi from '@/shared/ui';

const APPROVED_RUNTIME_EXPORTS = ['Grid', 'PageContainer', 'Stack', 'VisuallyHidden'];

describe('Shared UI public entry point', () => {
  it('exposes exactly the approved runtime exports', () => {
    expect(Object.keys(sharedUi).sort()).toEqual([...APPROVED_RUNTIME_EXPORTS].sort());
  });

  it('exposes every approved export as a component function', () => {
    for (const name of APPROVED_RUNTIME_EXPORTS) {
      expect(typeof sharedUi[name as keyof typeof sharedUi]).toBe('function');
    }
  });
});

import { describe, it, expect, vi } from 'vitest';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Badge, Counter, Status } from '@/shared/ui';
import type { FeedbackTone } from '@/shared/ui';

const TONES: FeedbackTone[] = ['neutral', 'info', 'success', 'warning', 'error', 'current'];

function conflictingProps() {
  return {
    children: 'Injected child content',
    role: 'status',
    tabIndex: 0,
    style: { display: 'none' },
    contentEditable: true,
    autoFocus: true,
    'aria-label': 'Wrong name',
    'aria-labelledby': 'wrong-label',
    'aria-live': 'assertive',
    'aria-atomic': true,
    'aria-relevant': 'all',
    'aria-busy': true,
    dangerouslySetInnerHTML: { __html: '<span>Wrong content</span>' },
  };
}

function invalidTone(): object {
  return { tone: 'catastrophic' };
}

type CompactCase = {
  name: string;
  visible: string;
  render: (extra: object) => ReactElement;
};

const CASES: CompactCase[] = [
  {
    name: 'Badge',
    visible: 'New',
    render: (extra) => <Badge {...extra}>New</Badge>,
  },
  {
    name: 'Counter',
    visible: '7',
    render: (extra) => <Counter value={7} {...extra} />,
  },
  {
    name: 'Status',
    visible: 'In stock',
    render: (extra) => (
      <Status tone="success" {...extra}>
        In stock
      </Status>
    ),
  },
];

describe('Compact feedback shared contract', () => {
  for (const compact of CASES) {
    describe(compact.name, () => {
      it('renders a native span', () => {
        const { container } = render(compact.render({}));

        expect(container.firstElementChild?.tagName.toLowerCase()).toBe('span');
      });

      it('carries no role and no live-region semantics by default', () => {
        const { container } = render(compact.render({}));
        const root = container.firstElementChild;

        expect(root).not.toHaveAttribute('role');
        expect(root).not.toHaveAttribute('aria-live');
        expect(root).not.toHaveAttribute('aria-atomic');
        expect(root).not.toHaveAttribute('aria-relevant');
        expect(root).not.toHaveAttribute('aria-busy');
        expect(screen.queryByRole('status')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();
      });

      it('keeps its visible content and semantics under a conflicting spread', () => {
        const { container } = render(compact.render(conflictingProps()));
        const root = container.firstElementChild;

        expect(root?.tagName.toLowerCase()).toBe('span');
        expect(root?.textContent).toBe(compact.visible);
        expect(root).not.toHaveAttribute('role');
        expect(root).not.toHaveAttribute('tabindex');
        expect(root).not.toHaveAttribute('style');
        expect(root).not.toHaveAttribute('contenteditable');
        expect(root).not.toHaveAttribute('aria-label');
        expect(root).not.toHaveAttribute('aria-labelledby');
        expect(root).not.toHaveAttribute('aria-live');
        expect(root).not.toHaveAttribute('aria-atomic');
        expect(root).not.toHaveAttribute('aria-relevant');
        expect(root).not.toHaveAttribute('aria-busy');
        expect(screen.queryByText('Injected child content')).toBeNull();
        expect(screen.queryByText('Wrong content')).toBeNull();
      });

      it('keeps safe consumer attributes', () => {
        const { container } = render(
          compact.render({
            id: 'feedback-root',
            'data-testid': 'feedback',
            'aria-describedby': 'hint',
            'aria-hidden': true,
            title: 'Tooltip text',
          })
        );
        const root = container.firstElementChild;

        expect(root).toHaveAttribute('id', 'feedback-root');
        expect(root).toHaveAttribute('data-testid', 'feedback');
        expect(root).toHaveAttribute('aria-describedby', 'hint');
        expect(root).toHaveAttribute('aria-hidden', 'true');
        expect(root).toHaveAttribute('title', 'Tooltip text');
      });

      it('merges the consumer className onto the root', () => {
        const { container } = render(compact.render({ className: 'consumer-hook' }));
        const root = container.firstElementChild;

        expect(root?.classList.contains('consumer-hook')).toBe(true);
        expect(root?.classList.length).toBeGreaterThan(1);
      });

      it('accepts every approved tone', () => {
        for (const tone of TONES) {
          const { container, unmount } = render(compact.render({ tone }));

          expect(container.firstElementChild?.tagName.toLowerCase()).toBe('span');
          unmount();
        }
      });

      it('rejects an unsupported tone arriving through a spread', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => render(compact.render(invalidTone()))).toThrow(/unsupported tone/i);

        consoleError.mockRestore();
      });
    });
  }
});

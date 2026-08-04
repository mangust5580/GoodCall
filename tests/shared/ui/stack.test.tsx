import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from '@/shared/ui';
import type { SpacingScale, StackAlign, StackDirection } from '@/shared/ui';

const LANDMARK_ROLES = ['banner', 'contentinfo', 'main', 'navigation', 'region', 'complementary'];
const DIRECTIONS: StackDirection[] = ['block', 'inline'];
const GAPS: SpacingScale[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const ALIGNMENTS: StackAlign[] = ['start', 'center', 'end', 'stretch'];

describe('Stack', () => {
  it('renders provided content', () => {
    render(<Stack>Stack content</Stack>);

    expect(screen.getByText('Stack content')).toBeInTheDocument();
  });

  it('renders a div root by default', () => {
    const { container } = render(<Stack>content</Stack>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('div');
  });

  it('renders the requested semantic root element', () => {
    const { container } = render(<Stack as="nav">content</Stack>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('nav');
  });

  it('creates no landmark or heading semantics by default', () => {
    render(<Stack>content</Stack>);

    for (const role of LANDMARK_ROLES) {
      expect(screen.queryAllByRole(role)).toHaveLength(0);
    }
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('preserves child DOM order', () => {
    const { container } = render(
      <Stack>
        <span>one</span>
        <span>two</span>
        <span>three</span>
      </Stack>
    );

    const order = Array.from(container.firstElementChild?.children ?? []).map(
      (child) => child.textContent
    );

    expect(order).toEqual(['one', 'two', 'three']);
  });

  it('preserves child DOM order for every direction', () => {
    for (const direction of DIRECTIONS) {
      const { container } = render(
        <Stack direction={direction}>
          <span>first</span>
          <span>second</span>
        </Stack>
      );

      const order = Array.from(container.firstElementChild?.children ?? []).map(
        (child) => child.textContent
      );

      expect(order).toEqual(['first', 'second']);
    }
  });

  it('accepts every documented gap and alignment role', () => {
    for (const gap of GAPS) {
      for (const align of ALIGNMENTS) {
        const { container } = render(
          <Stack gap={gap} align={align}>
            content
          </Stack>
        );

        expect(container.firstElementChild?.tagName.toLowerCase()).toBe('div');
      }
    }
  });

  it('preserves consumer identity, aria attributes and className on the root', () => {
    const { container } = render(
      <Stack id="stack-root" aria-label="Stack region" className="consumer-hook">
        content
      </Stack>
    );

    const root = document.getElementById('stack-root');

    expect(root).not.toBeNull();
    expect(root?.getAttribute('aria-label')).toBe('Stack region');
    expect(container.firstElementChild?.classList.contains('consumer-hook')).toBe(true);
  });
});

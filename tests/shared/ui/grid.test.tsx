import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid } from '@/shared/ui';
import type { GridMinItemWidth, SpacingScale } from '@/shared/ui';

const LANDMARK_ROLES = ['banner', 'contentinfo', 'main', 'navigation', 'region', 'complementary'];
const MIN_ITEM_WIDTHS: GridMinItemWidth[] = ['sm', 'md', 'lg'];
const GAPS: SpacingScale[] = ['xs', 'sm', 'md', 'lg', 'xl'];

describe('Grid', () => {
  it('renders provided content', () => {
    render(<Grid>Grid content</Grid>);

    expect(screen.getByText('Grid content')).toBeInTheDocument();
  });

  it('renders a div root by default', () => {
    const { container } = render(<Grid>content</Grid>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('div');
  });

  it('renders the requested semantic root element', () => {
    const { container } = render(<Grid as="section">content</Grid>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('section');
  });

  it('creates no landmark or heading semantics by default', () => {
    render(<Grid>content</Grid>);

    for (const role of LANDMARK_ROLES) {
      expect(screen.queryAllByRole(role)).toHaveLength(0);
    }
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('preserves child DOM order', () => {
    const { container } = render(
      <Grid>
        <span>one</span>
        <span>two</span>
        <span>three</span>
      </Grid>
    );

    const order = Array.from(container.firstElementChild?.children ?? []).map(
      (child) => child.textContent
    );

    expect(order).toEqual(['one', 'two', 'three']);
  });

  it('accepts every documented item-width and gap role', () => {
    for (const minItemWidth of MIN_ITEM_WIDTHS) {
      for (const gap of GAPS) {
        const { container } = render(
          <Grid minItemWidth={minItemWidth} gap={gap}>
            content
          </Grid>
        );

        expect(container.firstElementChild?.tagName.toLowerCase()).toBe('div');
      }
    }
  });

  it('preserves consumer identity, aria attributes and className on the root', () => {
    const { container } = render(
      <Grid id="grid-root" aria-label="Grid region" className="consumer-hook">
        content
      </Grid>
    );

    const root = document.getElementById('grid-root');

    expect(root).not.toBeNull();
    expect(root?.getAttribute('aria-label')).toBe('Grid region');
    expect(container.firstElementChild?.classList.contains('consumer-hook')).toBe(true);
  });
});

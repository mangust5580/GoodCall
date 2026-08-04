import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/shared/ui';
import type { FeedbackTone } from '@/shared/ui';

const TONES: FeedbackTone[] = ['neutral', 'info', 'success', 'warning', 'error', 'current'];

describe('Badge', () => {
  it('renders a native span with the visible label', () => {
    const { container } = render(<Badge>New</Badge>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('span');
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders exactly the provided label text', () => {
    const { container } = render(<Badge>Limited edition</Badge>);

    expect(container.firstElementChild?.textContent).toBe('Limited edition');
  });

  it('defaults to the neutral tone and still renders a span', () => {
    const { container } = render(<Badge>New</Badge>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('span');
    expect(container.firstElementChild?.classList.length).toBeGreaterThan(0);
  });

  it('accepts every approved tone', () => {
    for (const tone of TONES) {
      const { container, unmount } = render(<Badge tone={tone}>New</Badge>);

      expect(container.firstElementChild?.textContent).toBe('New');
      unmount();
    }
  });

  it('rejects a blank label with a clear runtime error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Badge> </Badge>)).toThrow(/non-empty/i);
    expect(() => render(<Badge>{''}</Badge>)).toThrow(/non-empty/i);

    consoleError.mockRestore();
  });

  it('exposes no live-region or interactive semantics', () => {
    const { container } = render(<Badge>New</Badge>);
    const root = container.firstElementChild;

    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-live');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('onclick');
  });

  it('lets the consumer hide a duplicate visual badge from the accessibility tree', () => {
    const { container } = render(<Badge aria-hidden="true">3</Badge>);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild?.textContent).toBe('3');
  });

  it('keeps safe consumer attributes on the root', () => {
    const { container } = render(
      <Badge id="badge-root" data-testid="badge" aria-describedby="hint">
        New
      </Badge>
    );
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('id', 'badge-root');
    expect(root).toHaveAttribute('data-testid', 'badge');
    expect(root).toHaveAttribute('aria-describedby', 'hint');
  });
});

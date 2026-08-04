import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Status } from '@/shared/ui';
import type { FeedbackTone } from '@/shared/ui';

const TONES: FeedbackTone[] = ['neutral', 'info', 'success', 'warning', 'error', 'current'];

function invalidTone(): object {
  return { tone: 'critical' };
}

describe('Status', () => {
  it('renders a native span with the visible text', () => {
    const { container } = render(<Status tone="success">In stock</Status>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('span');
    expect(screen.getByText('In stock')).toBeInTheDocument();
  });

  it('accepts every approved tone', () => {
    for (const tone of TONES) {
      const { container, unmount } = render(<Status tone={tone}>Current state</Status>);

      expect(container.firstElementChild?.textContent).toBe('Current state');
      unmount();
    }
  });

  it('rejects blank text with a clear runtime error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Status tone="info"> </Status>)).toThrow(/non-empty/i);

    consoleError.mockRestore();
  });

  it('stays static even with the error tone', () => {
    const { container } = render(<Status tone="error">Out of stock</Status>);
    const root = container.firstElementChild;

    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-live');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('stays static when the text changes', () => {
    const { container, rerender } = render(<Status tone="info">Pending</Status>);

    rerender(<Status tone="success">Delivered</Status>);

    expect(container.firstElementChild?.textContent).toBe('Delivered');
    expect(container.firstElementChild).not.toHaveAttribute('aria-live');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('rejects an unsupported tone arriving through a spread', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      render(
        <Status tone="info" {...invalidTone()}>
          Text
        </Status>
      )
    ).toThrow(/unsupported tone/i);

    consoleError.mockRestore();
  });

  it('keeps safe consumer attributes and is not focusable', () => {
    const { container } = render(
      <Status tone="info" id="status-root" data-testid="status" aria-describedby="hint">
        Pending
      </Status>
    );
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('id', 'status-root');
    expect(root).toHaveAttribute('data-testid', 'status');
    expect(root).toHaveAttribute('aria-describedby', 'hint');
    expect(root).not.toHaveAttribute('tabindex');
  });
});

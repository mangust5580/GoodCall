import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InlineStatus } from '@/shared/ui';
import type { InlineStatusTone } from '@/shared/ui';

const TONES: InlineStatusTone[] = [
  'info',
  'pending',
  'success',
  'warning',
  'error',
  'stale',
  'offline',
];

function invalidRole(): object {
  return { role: 'dialog' };
}

function rawLiveProps() {
  return {
    'aria-live': 'assertive',
    'aria-atomic': true,
    'aria-relevant': 'all',
    'aria-busy': true,
  };
}

function hidingProps() {
  return { hidden: true, inert: true, 'aria-hidden': true };
}

function rawContentProps() {
  return {
    children: 'Injected content',
    dangerouslySetInnerHTML: { __html: '<span>Wrong content</span>' },
  };
}

describe('InlineStatus', () => {
  it('renders a native div preserving the visible children', () => {
    const { container } = render(<InlineStatus tone="info">Saved a moment ago</InlineStatus>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('div');
    expect(screen.getByText('Saved a moment ago')).toBeInTheDocument();
  });

  it('accepts every approved tone', () => {
    for (const tone of TONES) {
      const { container, unmount } = render(<InlineStatus tone={tone}>Owner copy</InlineStatus>);

      expect(container.firstElementChild?.textContent).toBe('Owner copy');
      unmount();
    }
  });

  it('is static by default', () => {
    const { container } = render(<InlineStatus tone="info">Owner copy</InlineStatus>);
    const root = container.firstElementChild;

    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-live');
    expect(root).not.toHaveAttribute('aria-atomic');
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('exposes status semantics only when the consumer opts in', () => {
    render(
      <InlineStatus tone="success" role="status">
        Order placed
      </InlineStatus>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Order placed')).toBeInTheDocument();
  });

  it('exposes alert semantics only when the consumer opts in', () => {
    render(
      <InlineStatus tone="error" role="alert">
        Payment failed
      </InlineStatus>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Payment failed')).toBeInTheDocument();
  });

  it('never derives a live role from the tone', () => {
    for (const tone of ['error', 'success', 'pending'] as InlineStatusTone[]) {
      const { unmount } = render(<InlineStatus tone={tone}>Owner copy</InlineStatus>);

      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.queryByRole('status')).toBeNull();
      unmount();
    }
  });

  it('keeps the tone independent of the chosen role', () => {
    const { container } = render(
      <InlineStatus tone="success" role="alert">
        Owner copy
      </InlineStatus>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(container.firstElementChild?.textContent).toBe('Owner copy');
  });

  it('rejects an unsupported role arriving through a spread', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      render(
        <InlineStatus tone="info" {...invalidRole()}>
          Owner copy
        </InlineStatus>
      )
    ).toThrow(/unsupported role/i);

    consoleError.mockRestore();
  });

  it('does not let raw live-region attributes bypass the explicit API', () => {
    const { container } = render(
      <InlineStatus tone="info" {...rawLiveProps()}>
        Owner copy
      </InlineStatus>
    );
    const root = container.firstElementChild;

    expect(root).not.toHaveAttribute('aria-live');
    expect(root).not.toHaveAttribute('aria-atomic');
    expect(root).not.toHaveAttribute('aria-relevant');
    expect(root).not.toHaveAttribute('aria-busy');
    expect(root).not.toHaveAttribute('role');
  });

  it('cannot be hidden from the accessibility tree through a spread', () => {
    const { container } = render(
      <InlineStatus tone="info" {...hidingProps()}>
        Owner copy
      </InlineStatus>
    );
    const root = container.firstElementChild;

    expect(root).not.toHaveAttribute('hidden');
    expect(root).not.toHaveAttribute('inert');
    expect(root).not.toHaveAttribute('aria-hidden');
    expect(screen.getByText('Owner copy')).toBeInTheDocument();
  });

  it('keeps ownership of its content when raw content arrives through a spread', () => {
    const { container } = render(
      <InlineStatus tone="info" {...rawContentProps()}>
        Owner copy
      </InlineStatus>
    );

    expect(container.firstElementChild?.textContent).toBe('Owner copy');
    expect(screen.queryByText('Injected content')).toBeNull();
    expect(screen.queryByText('Wrong content')).toBeNull();
  });

  it('keeps safe consumer attributes', () => {
    const { container } = render(
      <InlineStatus tone="info" id="status-region" data-testid="inline" aria-describedby="hint">
        Owner copy
      </InlineStatus>
    );
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('id', 'status-region');
    expect(root).toHaveAttribute('data-testid', 'inline');
    expect(root).toHaveAttribute('aria-describedby', 'hint');
  });

  it('registers no timer and moves no focus', () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const activeBefore = document.activeElement;

    const { rerender } = render(
      <InlineStatus tone="pending" role="status">
        Saving
      </InlineStatus>
    );
    rerender(
      <InlineStatus tone="success" role="status">
        Saved
      </InlineStatus>
    );

    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(setIntervalSpy).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(activeBefore);

    setTimeoutSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });
});

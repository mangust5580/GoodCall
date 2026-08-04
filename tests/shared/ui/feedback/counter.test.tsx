import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Counter } from '@/shared/ui';
import type { FeedbackTone } from '@/shared/ui';

const TONES: FeedbackTone[] = ['neutral', 'info', 'success', 'warning', 'error', 'current'];

describe('Counter', () => {
  it('renders a native span', () => {
    const { container } = render(<Counter value={3} />);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('span');
  });

  it('renders zero as a visible value', () => {
    const { container } = render(<Counter value={0} />);

    expect(container.firstElementChild?.textContent).toBe('0');
  });

  it('renders positive and negative finite numbers as provided', () => {
    const { container: positive } = render(<Counter value={128} />);
    const { container: negative } = render(<Counter value={-4} />);

    expect(positive.firstElementChild?.textContent).toBe('128');
    expect(negative.firstElementChild?.textContent).toBe('-4');
  });

  it('renders a consumer-formatted string exactly', () => {
    const { container } = render(<Counter value="99+" />);

    expect(container.firstElementChild?.textContent).toBe('99+');
  });

  it('rejects a blank string value', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Counter value="   " />)).toThrow(/non-empty/i);
    expect(() => render(<Counter value="" />)).toThrow(/non-empty/i);

    consoleError.mockRestore();
  });

  it('rejects non-finite numeric values', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Counter value={Number.NaN} />)).toThrow(/finite/i);
    expect(() => render(<Counter value={Number.POSITIVE_INFINITY} />)).toThrow(/finite/i);
    expect(() => render(<Counter value={Number.NEGATIVE_INFINITY} />)).toThrow(/finite/i);

    consoleError.mockRestore();
  });

  it('accepts every approved tone', () => {
    for (const tone of TONES) {
      const { container, unmount } = render(<Counter value={5} tone={tone} />);

      expect(container.firstElementChild?.textContent).toBe('5');
      unmount();
    }
  });

  it('stays static when the value changes', () => {
    const { container, rerender } = render(<Counter value={1} />);
    const root = container.firstElementChild;

    expect(root).not.toHaveAttribute('aria-live');

    rerender(<Counter value={2} />);

    expect(container.firstElementChild?.textContent).toBe('2');
    expect(container.firstElementChild).not.toHaveAttribute('aria-live');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('lets the consumer hide a duplicate visual count from the accessibility tree', () => {
    const { container } = render(<Counter value={3} aria-hidden="true" />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild?.textContent).toBe('3');
  });

  it('keeps safe consumer data attributes', () => {
    const { container } = render(<Counter value={3} data-testid="counter" />);

    expect(container.firstElementChild).toHaveAttribute('data-testid', 'counter');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisuallyHidden } from '@/shared/ui';

describe('VisuallyHidden', () => {
  it('keeps content in the document', () => {
    render(<VisuallyHidden>Loading page</VisuallyHidden>);

    expect(screen.getByText('Loading page')).toBeInTheDocument();
  });

  it('renders a span root by default', () => {
    const { container } = render(<VisuallyHidden>content</VisuallyHidden>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('span');
  });

  it('renders the requested root element', () => {
    const { container } = render(<VisuallyHidden as="div">content</VisuallyHidden>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('div');
  });

  it('does not remove content from the accessibility tree', () => {
    const { container } = render(<VisuallyHidden>Accessible text</VisuallyHidden>);
    const root = container.firstElementChild;

    expect(root?.hasAttribute('hidden')).toBe(false);
    expect(root?.hasAttribute('aria-hidden')).toBe(false);
    expect(root?.hasAttribute('style')).toBe(false);
  });

  it('keeps nested accessible content queryable by role', () => {
    render(
      <VisuallyHidden>
        <h2>Hidden heading</h2>
      </VisuallyHidden>
    );

    expect(screen.getByRole('heading', { name: 'Hidden heading' })).toBeInTheDocument();
  });

  it('preserves consumer identity, aria attributes and className on the root', () => {
    const { container } = render(
      <VisuallyHidden id="hidden-root" aria-live="polite" className="consumer-hook">
        content
      </VisuallyHidden>
    );

    const root = document.getElementById('hidden-root');

    expect(root).not.toBeNull();
    expect(root?.getAttribute('aria-live')).toBe('polite');
    expect(container.firstElementChild?.classList.contains('consumer-hook')).toBe(true);
  });

  it('preserves child DOM order', () => {
    const { container } = render(
      <VisuallyHidden>
        <span>one</span>
        <span>two</span>
      </VisuallyHidden>
    );

    const order = Array.from(container.firstElementChild?.children ?? []).map(
      (child) => child.textContent
    );

    expect(order).toEqual(['one', 'two']);
  });
});

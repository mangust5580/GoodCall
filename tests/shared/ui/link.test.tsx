import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Link } from '@/shared/ui';
import type { LinkVariant } from '@/shared/ui';

const VARIANTS: LinkVariant[] = ['primary', 'secondary', 'tertiary'];

function renderWithRouter(ui: ReactElement) {
  return render(
    <MemoryRouter initialEntries={['/start']}>
      <Routes>
        <Route path="/start" element={ui} />
        <Route path="/target" element={<h1>Target page</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Link', () => {
  it('renders anchor semantics', () => {
    renderWithRouter(<Link to="/target">Go to target</Link>);

    const link = screen.getByRole('link', { name: 'Go to target' });

    expect(link.tagName.toLowerCase()).toBe('a');
  });

  it('resolves an href from the to prop', () => {
    renderWithRouter(<Link to="/target">Go to target</Link>);

    expect(screen.getByRole('link', { name: 'Go to target' })).toHaveAttribute('href', '/target');
  });

  it('does not render a button or expose button semantics', () => {
    const { container } = renderWithRouter(<Link to="/target">Go to target</Link>);

    expect(container.querySelector('button')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('link', { name: 'Go to target' })).not.toHaveAttribute('role');
  });

  it('navigates on pointer activation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Link to="/target">Go to target</Link>);

    await user.click(screen.getByRole('link', { name: 'Go to target' }));

    expect(screen.getByRole('heading', { name: 'Target page' })).toBeInTheDocument();
  });

  it('navigates on Enter', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Link to="/target">Go to target</Link>);

    await user.tab();
    expect(screen.getByRole('link', { name: 'Go to target' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('heading', { name: 'Target page' })).toBeInTheDocument();
  });

  it('derives its accessible name from the visible label', () => {
    renderWithRouter(<Link to="/target">Continue to checkout</Link>);

    expect(screen.getByRole('link', { name: 'Continue to checkout' })).toBeInTheDocument();
    expect(screen.getByText('Continue to checkout')).toBeInTheDocument();
  });

  it('passes consumer identity, safe ARIA props and className to the root', () => {
    renderWithRouter(
      <Link to="/target" id="target-link" aria-describedby="target-hint" className="consumer-hook">
        Go to target
      </Link>
    );

    const link = screen.getByRole('link', { name: 'Go to target' });

    expect(link.id).toBe('target-link');
    expect(link).toHaveAttribute('aria-describedby', 'target-hint');
    expect(link.classList.contains('consumer-hook')).toBe(true);
  });

  it('accepts every approved variant', () => {
    for (const variant of VARIANTS) {
      const { unmount } = renderWithRouter(
        <Link to="/target" variant={variant}>
          Go to target
        </Link>
      );

      expect(screen.getByRole('link', { name: 'Go to target' }).tagName.toLowerCase()).toBe('a');
      unmount();
    }
  });

  it('exposes no disabled or loading state', () => {
    renderWithRouter(<Link to="/target">Go to target</Link>);

    const link = screen.getByRole('link', { name: 'Go to target' });

    expect(link).not.toHaveAttribute('aria-disabled');
    expect(link).not.toHaveAttribute('disabled');
    expect(link).not.toHaveAttribute('aria-busy');
    expect(link).not.toHaveAttribute('tabindex');
  });
});

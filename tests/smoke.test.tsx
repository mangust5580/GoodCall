import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '@/app/App';

describe('App Smoke Tests', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/GoodCall Bootstrap/i)).toBeDefined();
  });

  it('has accessible h1', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/GoodCall Bootstrap/i);
  });

  it('has main landmark', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main#main');
    expect(main).toBeTruthy();
  });

  it('has skip link', () => {
    const { container } = render(<App />);
    const skipLink = container.querySelector('a[href="#main"]');
    expect(skipLink).toBeTruthy();
    expect(skipLink?.textContent).toContain('Skip to main content');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/app/shell/RootLayout';
import { HomePage } from '@/routes/home/HomePage';
import { RootErrorBoundary } from '@/app/shell/RootErrorBoundary';

describe('App Smoke Tests', () => {
  it('renders without crashing', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          errorElement: <RootErrorBoundary />,
          children: [{ index: true, element: <HomePage /> }],
        },
      ],
      { initialEntries: ['/'] }
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getAllByText(/GoodCall/i).length).toBeGreaterThan(0);
    });
  });

  it('has accessible h1', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          errorElement: <RootErrorBoundary />,
          children: [{ index: true, element: <HomePage /> }],
        },
      ],
      { initialEntries: ['/'] }
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/GoodCall/i);
    });
  });

  it('has main landmark with id main-content', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          errorElement: <RootErrorBoundary />,
          children: [{ index: true, element: <HomePage /> }],
        },
      ],
      { initialEntries: ['/'] }
    );

    const { container } = render(<RouterProvider router={router} />);

    await waitFor(() => {
      const main = container.querySelector('main#main-content');
      expect(main).toBeTruthy();
    });
  });

  it('has skip link', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RootLayout />,
          errorElement: <RootErrorBoundary />,
          children: [{ index: true, element: <HomePage /> }],
        },
      ],
      { initialEntries: ['/'] }
    );

    const { container } = render(<RouterProvider router={router} />);

    await waitFor(() => {
      const skipLink = container.querySelector('a[href="#main-content"]');
      expect(skipLink).toBeTruthy();
      expect(skipLink?.textContent).toContain('Skip to main content');
    });
  });
});

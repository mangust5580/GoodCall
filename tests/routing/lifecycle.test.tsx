import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/app/shell/RootLayout';
import { RootErrorBoundary } from '@/app/shell/RootErrorBoundary';
import { HomePage } from '@/routes/home/HomePage';

describe('M1 Routing Lifecycle Contracts', () => {
  describe('Document Title Lifecycle', () => {
    it('initial direct render sets document title', async () => {
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
        expect(document.title).toBe('GoodCall');
      });
    });

    it('live region is empty on initial load', async () => {
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
        const liveRegion = document.getElementById('route-announcement');
        expect(liveRegion?.textContent).toBe('');
      });
    });
  });

  describe('Route Announcement Contract', () => {
    it('does not announce on query-only navigation', async () => {
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
        expect(document.title).toBe('GoodCall');
      });

      router.navigate('/?search=query');

      await waitFor(() => {
        const liveRegion = document.getElementById('route-announcement');
        expect(liveRegion?.textContent).toBe('');
      });
    });
  });

  describe('Accessibility Contracts', () => {
    it('renders main landmark from RootLayout', async () => {
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
        const main = document.querySelector('main#main-content');
        expect(main).toBeInTheDocument();
      });
    });
  });
});

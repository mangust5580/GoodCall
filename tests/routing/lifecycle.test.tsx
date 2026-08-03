import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
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

  describe('Focus Lifecycle Contracts', () => {
    it('initial render does not focus heading', async () => {
      const TestPage = () => (
        <main id="main-content">
          <h1 data-route-focus tabIndex={-1}>
            Home
          </h1>
          <p>Home page</p>
        </main>
      );

      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [{ index: true, element: <TestPage /> }],
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        const heading = document.querySelector('h1[data-route-focus]');
        expect(document.activeElement).not.toBe(heading);
      });
    });

    it('pathname navigation focuses new route heading', async () => {
      const CatalogPage = () => (
        <main id="main-content">
          <h1 data-route-focus tabIndex={-1}>
            Catalog
          </h1>
          <p>Catalog page</p>
        </main>
      );

      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [
              { index: true, element: <HomePage /> },
              { path: 'catalog', element: <CatalogPage /> },
            ],
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(document.title).toBe('GoodCall');
      });

      router.navigate('/catalog');

      await waitFor(() => {
        const heading = document.querySelector('h1[data-route-focus]');
        expect(document.activeElement).toBe(heading);
      });
    });

    it('query-only navigation preserves focus on current element', async () => {
      const TestPage = () => {
        const [count, setCount] = React.useState(0);
        return (
          <main id="main-content">
            <h1 data-route-focus tabIndex={-1}>
              Test
            </h1>
            <button onClick={() => setCount(count + 1)}>Click me</button>
            <p>Count: {count}</p>
          </main>
        );
      };

      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [{ index: true, element: <TestPage /> }],
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();
      });

      const button = document.querySelector('button') as HTMLButtonElement;
      button.focus();

      await waitFor(() => {
        expect(document.activeElement).toBe(button);
      });

      router.navigate('/?sort=price');

      await waitFor(async () => {
        expect(document.activeElement).toBe(button);
      });
    });

    it('POP navigation does not force heading focus', async () => {
      const TestPage = () => (
        <main id="main-content">
          <h1 data-route-focus tabIndex={-1}>
            Test
          </h1>
          <button>Click me</button>
        </main>
      );

      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [{ index: true, element: <TestPage /> }],
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();
      });

      const button = document.querySelector('button') as HTMLButtonElement;
      button.focus();

      await waitFor(() => {
        expect(document.activeElement).toBe(button);
      });

      router.navigate('/other');

      await waitFor(() => {
        const heading = document.querySelector('h1[data-route-focus]');
        expect(document.activeElement).not.toBe(heading);
        expect(document.activeElement).toBe(button);
      });

      router.navigate(-1);

      await waitFor(() => {
        expect(document.activeElement).not.toBe(document.querySelector('h1[data-route-focus]'));
      });
    });

    it('hash-only navigation does not force heading focus', async () => {
      const TestPage = () => (
        <main id="main-content">
          <h1 data-route-focus tabIndex={-1}>
            Test
          </h1>
          <button>Click me</button>
        </main>
      );

      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [{ index: true, element: <TestPage /> }],
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();
      });

      const button = document.querySelector('button') as HTMLButtonElement;
      button.focus();

      await waitFor(() => {
        expect(document.activeElement).toBe(button);
      });

      window.location.hash = '#section';

      await waitFor(() => {
        expect(document.activeElement).toBe(button);
      });
    });
  });

  describe('Scroll Restoration Contracts', () => {
    it('uses pathname as scroll key', async () => {
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

      const scrollRestoration = document.querySelector('div[role="status"]');
      expect(scrollRestoration).toBeInTheDocument();
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

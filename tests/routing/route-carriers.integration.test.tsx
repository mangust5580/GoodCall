import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import React from 'react';
import { RootLayout } from '@/app/shell/RootLayout';
import { RootErrorBoundary } from '@/app/shell/RootErrorBoundary';
import { HomePage } from '@/routes/home/HomePage';
import { NotFoundPage } from '@/routes/error/not-found/NotFoundPage';
import { RouteCarrierPage } from '@/routes/carrier/RouteCarrierPage';
import {
  CARRIER_HOME_LINK_LABEL,
  CARRIER_NOTICE,
  carrierRouteSegment,
  carrierRouteTitle,
  carrierRoutes,
} from '@/app/routing/carriers';

const carrierCases = carrierRoutes.map(
  (carrier) => [carrier.path, carrier.heading, carrierRouteTitle(carrier)] as const
);

function createRoutes(): RouteObject[] {
  return [
    {
      element: <RootLayout />,
      errorElement: <RootErrorBoundary />,
      children: [
        { index: true, element: <HomePage />, handle: { title: 'GoodCall' } },
        ...carrierRoutes.map((carrier) => ({
          id: carrier.id,
          path: carrierRouteSegment(carrier),
          element: <RouteCarrierPage heading={carrier.heading} />,
          handle: { title: carrierRouteTitle(carrier) },
        })),
        { path: '*', element: <NotFoundPage />, handle: { title: 'Page not found — GoodCall' } },
      ],
    },
  ];
}

function renderAt(initialEntries: string[]) {
  const router = createMemoryRouter(createRoutes(), { initialEntries });
  render(<RouterProvider router={router} />);
  return router;
}

describe('M4-01 route carriers', () => {
  beforeEach(() => {
    document.title = '';
  });

  it.each(carrierCases)('%s resolves to its carrier, not the catch-all', async (path, heading) => {
    renderAt([path]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    });

    expect(screen.queryByRole('heading', { name: /Page not found/i })).not.toBeInTheDocument();
  });

  it.each(carrierCases)('%s owns exactly one main and one h1', async (path) => {
    renderAt([path]);

    await waitFor(() => {
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    });

    expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it.each(carrierCases)('%s renders the neutral notice and Home link', async (path) => {
    renderAt([path]);

    await waitFor(() => {
      expect(screen.getByText(CARRIER_NOTICE)).toBeInTheDocument();
    });

    const homeLink = screen.getByRole('link', { name: CARRIER_HOME_LINK_LABEL });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it.each(carrierCases)('%s sets its route-specific document title', async (path, _h, title) => {
    renderAt([path]);

    await waitFor(() => {
      expect(document.title).toBe(title);
    });
  });

  it.each(carrierCases)('%s carries a focusable canonical heading', async (path) => {
    renderAt([path]);

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveAttribute('data-route-focus');
      expect(heading).toHaveAttribute('tabindex', '-1');
    });
  });

  it.each(carrierCases)('%s does not create a second route announcement owner', async (path) => {
    renderAt([path]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    expect(document.querySelectorAll('#route-announcement')).toHaveLength(1);
    const main = document.querySelector('main#main-content');
    expect(main?.querySelector('#route-announcement')).toBeNull();
    expect(main?.querySelectorAll('[aria-live]')).toHaveLength(0);
  });

  it('keeps an unregistered path on the catch-all', async () => {
    renderAt(['/definitely-not-a-carrier']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Page not found/i })).toBeInTheDocument();
    });
  });

  it('does not register a catalog root route', async () => {
    renderAt(['/catalog']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Page not found/i })).toBeInTheDocument();
    });
  });
});

describe('M4-01 carrier lifecycle contracts', () => {
  beforeEach(() => {
    document.title = '';
  });

  it('focuses the carrier heading after client navigation', async () => {
    const router = renderAt(['/']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /GoodCall/i })).toBeInTheDocument();
    });

    await router.navigate('/search');

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Поиск');
      expect(document.activeElement).toBe(heading);
    });
  });

  it('does not force heading focus on POP back to a carrier', async () => {
    const router = renderAt(['/search']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Поиск');
    });

    await router.navigate('/contacts');

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Контакты');
      expect(document.activeElement).toBe(heading);
    });

    (document.activeElement as HTMLElement | null)?.blur();
    expect(document.activeElement).toBe(document.body);

    await router.navigate(-1);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Поиск');
    });

    expect(document.activeElement).toBe(document.body);
  });

  it('does not re-focus the heading on query-only navigation', async () => {
    const router = renderAt(['/']);

    await waitFor(() => {
      expect(document.title).toBe('GoodCall');
    });

    await router.navigate('/search');

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Поиск');
      expect(document.activeElement).toBe(heading);
    });

    (document.activeElement as HTMLElement | null)?.blur();
    expect(document.activeElement).toBe(document.body);

    await router.navigate('/search?q=test');

    await waitFor(() => {
      expect(router.state.location.search).toBe('?q=test');
    });

    expect(document.activeElement).toBe(document.body);
  });

  it('announces the carrier title on client navigation only', async () => {
    const router = renderAt(['/']);

    await waitFor(() => {
      expect(document.getElementById('route-announcement')?.textContent).toBe('');
    });

    await router.navigate('/blog');

    await waitFor(() => {
      expect(document.getElementById('route-announcement')?.textContent).toBe('Блог — GoodCall');
    });
  });
});

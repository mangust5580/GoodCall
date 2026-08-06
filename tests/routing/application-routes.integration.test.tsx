import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createApplicationRoutes } from '@/app/composition/application-routes';

function renderApplicationAt(path: string) {
  const router = createMemoryRouter(createApplicationRoutes(), { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

async function headingAt(path: string): Promise<HTMLElement> {
  renderApplicationAt(path);

  return waitFor(() => screen.getByRole('heading', { level: 1 }));
}

describe('Application route tree', () => {
  beforeEach(() => {
    document.title = '';
  });

  describe('catalog family composition', () => {
    it('sends /catalog to the global catch-all', async () => {
      const heading = await headingAt('/catalog');

      expect(heading).toHaveTextContent('Page not found');
    });

    it('renders exactly one main and one h1 at /catalog', async () => {
      await headingAt('/catalog');

      expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
      expect(document.querySelectorAll('h1')).toHaveLength(1);
    });

    it('keeps the not-found title contract at /catalog', async () => {
      await headingAt('/catalog');

      await waitFor(() => {
        expect(document.title).toBe('Page not found — GoodCall');
      });
    });

    it('does not leave an empty outlet at /catalog', async () => {
      await headingAt('/catalog');

      const main = document.querySelector('main#main-content');
      expect(main).not.toBeNull();
      expect((main?.textContent ?? '').trim().length).toBeGreaterThan(0);
    });

    it('still resolves /catalog/laptops through the category route', async () => {
      const heading = await headingAt('/catalog/laptops');

      expect(heading).toHaveTextContent('Category');
      expect(screen.getByText('Category: laptops')).toBeInTheDocument();
      expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    });

    it('keeps the category loader rejecting an invalid slug through the catalog boundary', async () => {
      const heading = await headingAt('/catalog/laptop%402024');

      expect(heading).toHaveTextContent('Resource not found');
    });

    it('keeps a deeper unknown catalog path on the catch-all', async () => {
      const heading = await headingAt('/catalog/laptops/extra');

      expect(heading).toHaveTextContent('Page not found');
    });
  });

  describe('unchanged route behaviour', () => {
    it('renders Home at /', async () => {
      const heading = await headingAt('/');

      expect(heading).toHaveTextContent('GoodCall');
    });

    it('renders the product route', async () => {
      const heading = await headingAt('/products/demo-product');

      expect(heading).toHaveTextContent('Product');
    });

    it('renders the cart route', async () => {
      const heading = await headingAt('/cart');

      expect(heading).toHaveTextContent('Cart');
    });

    it('renders a carrier route', async () => {
      const heading = await headingAt('/search');

      expect(heading).toHaveTextContent('Поиск');
    });

    it('renders the catch-all for an unknown path', async () => {
      const heading = await headingAt('/definitely-not-a-route');

      expect(heading).toHaveTextContent('Page not found');
    });
  });
});

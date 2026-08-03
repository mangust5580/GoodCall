import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/app/shell/RootLayout';
import { RootErrorBoundary } from '@/app/shell/RootErrorBoundary';
import { HomePage } from '@/routes/home/HomePage';
import { CategoryListingPage } from '@/routes/catalog/category-listing/CategoryListingPage';
import { ProductDetailsPage } from '@/routes/catalog/product-details/ProductDetailsPage';
import { CartPage } from '@/routes/commerce/cart/CartPage';
import { NotFoundPage } from '@/routes/error/not-found/NotFoundPage';

describe('Routing Integration', () => {
  describe('Home route', () => {
    it('renders home at /', async () => {
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
        expect(screen.getByRole('heading', { name: /GoodCall/i })).toBeInTheDocument();
      });
    });

    it('has main#main-content', async () => {
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
        const main = screen.getByRole('main');
        expect(main).toHaveAttribute('id', 'main-content');
      });
    });
  });

  describe('Catch-all route', () => {
    it('renders not found at unknown path', async () => {
      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [
              { index: true, element: <HomePage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
        { initialEntries: ['/unknown-path'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Page not found/i })).toBeInTheDocument();
      });
    });

    it('preserves attempted pathname', async () => {
      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [
              { index: true, element: <HomePage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
        { initialEntries: ['/attempted-pathname'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText(/\/attempted-pathname/)).toBeInTheDocument();
      });
    });

    it('has one main and one h1', async () => {
      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [
              { index: true, element: <HomePage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
        { initialEntries: ['/not-found'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        const mains = screen.getAllByRole('main');
        const headings = screen.getAllByRole('heading', { level: 1 });
        expect(mains).toHaveLength(1);
        expect(headings).toHaveLength(1);
      });
    });
  });

  describe('Category route', () => {
    it('renders category placeholder', async () => {
      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [
              { index: true, element: <HomePage /> },
              { path: '/catalog/:categorySlug', element: <CategoryListingPage /> },
            ],
          },
        ],
        { initialEntries: ['/catalog/laptops'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Category/i })).toBeInTheDocument();
      });
    });

    it('displays category slug', async () => {
      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [
              { index: true, element: <HomePage /> },
              { path: '/catalog/:categorySlug', element: <CategoryListingPage /> },
            ],
          },
        ],
        { initialEntries: ['/catalog/laptops'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText(/laptops/)).toBeInTheDocument();
      });
    });
  });

  describe('Product route', () => {
    it('renders product placeholder', async () => {
      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [
              { index: true, element: <HomePage /> },
              { path: '/products/:productSlug', element: <ProductDetailsPage /> },
            ],
          },
        ],
        { initialEntries: ['/products/demo-product'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Product/i })).toBeInTheDocument();
      });
    });
  });

  describe('Cart route', () => {
    it('renders cart placeholder', async () => {
      const router = createMemoryRouter(
        [
          {
            element: <RootLayout />,
            errorElement: <RootErrorBoundary />,
            children: [
              { index: true, element: <HomePage /> },
              { path: '/cart', element: <CartPage /> },
            ],
          },
        ],
        { initialEntries: ['/cart'] }
      );

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Cart/i })).toBeInTheDocument();
      });
    });
  });
});

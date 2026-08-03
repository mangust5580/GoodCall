import React from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { publicConfig } from '@/app/config';
import { createQueryClient } from '@/app/composition/create-query-client';
import { RootLayout } from '@/app/shell/RootLayout';
import { RootErrorBoundary } from '@/app/shell/RootErrorBoundary';
import { CatalogErrorBoundary } from '@/routes/catalog/CatalogRouteErrorBoundary';
import { categoryLoader, productLoader } from '@/app/routing/loaders';
import type { QueryClient } from '@tanstack/react-query';

export interface ApplicationRuntime {
  queryClient: QueryClient;
  router: ReturnType<typeof createBrowserRouter>;
}

export function createApplicationRuntime(): ApplicationRuntime {
  const queryClient = createQueryClient();

  const routes: RouteObject[] = [
    {
      id: 'root',
      element: React.createElement(RootLayout),
      errorElement: React.createElement(RootErrorBoundary),
      children: [
        {
          id: 'home',
          index: true,
          lazy: () => import('@/routes/home/route'),
        },
        {
          id: 'catalog-family',
          path: 'catalog',
          errorElement: React.createElement(CatalogErrorBoundary),
          children: [
            {
              id: 'catalog-category',
              path: ':categorySlug',
              lazy: () => import('@/routes/catalog/category-listing/route'),
              loader: categoryLoader,
            },
          ],
        },
        {
          id: 'catalog-product',
          path: 'products/:productSlug',
          lazy: () => import('@/routes/catalog/product-details/route'),
          loader: productLoader,
        },
        {
          id: 'cart',
          path: 'cart',
          lazy: () => import('@/routes/commerce/cart/route'),
        },
        {
          id: 'not-found',
          path: '*',
          lazy: () => import('@/routes/error/not-found/route'),
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes, {
    basename: publicConfig.base,
  });

  return { queryClient, router };
}

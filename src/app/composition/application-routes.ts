import React from 'react';
import { type RouteObject } from 'react-router-dom';
import { RootLayout } from '@/app/shell/RootLayout';
import { RootErrorBoundary } from '@/app/shell/RootErrorBoundary';
import { CatalogErrorBoundary } from '@/routes/catalog/CatalogRouteErrorBoundary';
import { categoryLoader, productLoader } from '@/app/routing/loaders';
import { carrierRouteSegment, carrierRouteTitle, carrierRoutes } from '@/app/routing/carriers';
import { RouteCarrierPage } from '@/routes/carrier/RouteCarrierPage';

export function createApplicationRoutes(): RouteObject[] {
  return [
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
          errorElement: React.createElement(CatalogErrorBoundary),
          children: [
            {
              id: 'catalog-category',
              path: 'catalog/:categorySlug',
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
        ...carrierRoutes.map((carrier) => ({
          id: carrier.id,
          path: carrierRouteSegment(carrier),
          element: React.createElement(RouteCarrierPage, { heading: carrier.heading }),
          handle: { title: carrierRouteTitle(carrier) },
        })),
        {
          id: 'not-found',
          path: '*',
          lazy: () => import('@/routes/error/not-found/route'),
        },
      ],
    },
  ];
}

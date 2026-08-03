import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { createDataRouter } from '@/app/composition/create-runtime';

const router = createDataRouter();

export function App(): React.ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </Suspense>
  );
}

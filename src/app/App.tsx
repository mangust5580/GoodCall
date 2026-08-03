import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import type { ApplicationRuntime } from '@/app/composition/create-runtime';

interface AppProps {
  runtime: ApplicationRuntime;
}

export function App({ runtime }: AppProps): React.ReactElement {
  return (
    <AppProviders queryClient={runtime.queryClient}>
      <RouterProvider router={runtime.router} />
    </AppProviders>
  );
}

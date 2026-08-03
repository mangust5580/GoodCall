import React from 'react';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';

interface AppProvidersProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export function AppProviders({ children, queryClient }: AppProvidersProps): React.ReactElement {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

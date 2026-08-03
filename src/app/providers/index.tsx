import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/app/composition/create-query-client';

const queryClient = createQueryClient();

export function AppProviders({ children }: { children: React.ReactNode }): React.ReactElement {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

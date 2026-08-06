import { createBrowserRouter } from 'react-router-dom';
import { publicConfig } from '@/app/config';
import { createQueryClient } from '@/app/composition/create-query-client';
import { createApplicationRoutes } from '@/app/composition/application-routes';
import type { QueryClient } from '@tanstack/react-query';

export interface ApplicationRuntime {
  queryClient: QueryClient;
  router: ReturnType<typeof createBrowserRouter>;
}

export function createApplicationRuntime(): ApplicationRuntime {
  const queryClient = createQueryClient();

  const router = createBrowserRouter(createApplicationRoutes(), {
    basename: publicConfig.base,
  });

  return { queryClient, router };
}

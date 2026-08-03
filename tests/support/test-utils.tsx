import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProviders } from '@/app/providers';
import { createQueryClient } from '@/app/composition/create-query-client';

const testQueryClient = createQueryClient();

function AllTheProviders({ children }: { children: React.ReactNode }): ReactElement {
  return <AppProviders queryClient={testQueryClient}>{children}</AppProviders>;
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };

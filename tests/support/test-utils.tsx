import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Providers } from '@/app/providers';
import { MemoryRouter } from 'react-router-dom';

function AllTheProviders({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Providers>{children}</Providers>
    </MemoryRouter>
  );
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

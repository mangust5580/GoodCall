import React, { Suspense } from 'react';
import { Providers } from '@/app/providers';
import { Router } from '@/app/routing';

export function App(): React.ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Providers>
        <Router />
      </Providers>
    </Suspense>
  );
}

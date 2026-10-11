import { Suspense, lazy } from 'react';

import { ProductionRouter } from './ProductionRouter';

const ReferenceSurface = lazy(() => import('../reference/ReferenceSurface'));

function currentReference(): string | null {
  return new URLSearchParams(window.location.search).get('reference');
}

function ReferenceLoading() {
  return (
    <main aria-busy="true">
      <p lang="en" role="status">
        Loading reference…
      </p>
    </main>
  );
}

export function App() {
  const reference = currentReference();

  if (reference === null) {
    return <ProductionRouter />;
  }

  return (
    <Suspense fallback={<ReferenceLoading />}>
      <ReferenceSurface reference={reference} />
    </Suspense>
  );
}

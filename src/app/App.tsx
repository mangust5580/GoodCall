import { Suspense, lazy, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { startFavoritesStorageSync } from './favoritesPersistence';
import { ProductionRouter } from './ProductionRouter';
import { browserLocalStorage, createAppStore } from './store';

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

function ProductionApp() {
  const [{ store, storage }] = useState(() => {
    const localStorage = browserLocalStorage();

    return { store: createAppStore(localStorage), storage: localStorage };
  });

  useEffect(() => startFavoritesStorageSync(store.dispatch, window, storage), [store, storage]);

  return (
    <Provider store={store}>
      <ProductionRouter />
    </Provider>
  );
}

export function App() {
  const reference = currentReference();

  if (reference === null) {
    return <ProductionApp />;
  }

  return (
    <Suspense fallback={<ReferenceLoading />}>
      <ReferenceSurface reference={reference} />
    </Suspense>
  );
}

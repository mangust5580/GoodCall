import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/app/App';
import { restoreRedirectedURL } from '@/app/fallback';
import { createApplicationRuntime } from '@/app/composition/create-runtime';
import '@/styles/index.scss';

async function startMSW() {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks');
    await worker.start({
      onUnhandledRequest: 'warn',
    });
  }
}

export async function bootstrap() {
  await startMSW();

  restoreRedirectedURL();

  const runtime = createApplicationRuntime();

  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App runtime={runtime} />
    </React.StrictMode>
  );
}

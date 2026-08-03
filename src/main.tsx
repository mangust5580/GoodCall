import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/app/App';
import '@/styles/index.scss';

if (import.meta.env.DEV) {
  const { worker } = await import('@/mocks');
  await worker.start({
    onUnhandledRequest: 'warn',
  });
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

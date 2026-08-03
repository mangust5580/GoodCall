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

// Restore URL from GitHub Pages 404 fallback redirect
const redirectData = sessionStorage.getItem('__goodcall_redirect');
if (redirectData) {
  try {
    const data = JSON.parse(redirectData);
    // Validate redirect data is recent and internal
    if (
      data.pathname &&
      typeof data.pathname === 'string' &&
      data.pathname.startsWith('/GoodCall/') &&
      Date.now() - data.timestamp < 5000
    ) {
      // Restore the attempted URL using History API
      const targetUrl = data.pathname + (data.search || '') + (data.hash || '');
      window.history.replaceState(null, '', targetUrl);
      // Clear the redirect data
      sessionStorage.removeItem('__goodcall_redirect');
    }
  } catch (_e) {
    // Ignore invalid redirect data
    sessionStorage.removeItem('__goodcall_redirect');
  }
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

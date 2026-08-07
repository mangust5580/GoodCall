import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const NOT_FOUND_NAV_LABEL = 'Page not found navigation';

export function NotFoundPage(): React.ReactElement {
  const location = useLocation();

  return (
    <main id="main-content" tabIndex={-1}>
      <h1 tabIndex={-1} data-route-focus>
        Page not found
      </h1>
      <p>The page you requested could not be found.</p>
      <p>Requested path: {location.pathname}</p>
      <nav aria-label={NOT_FOUND_NAV_LABEL}>
        <Link to="/">Back to Home</Link>
      </nav>
    </main>
  );
}

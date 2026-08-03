import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export function NotFoundPage(): React.ReactElement {
  const location = useLocation();
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <main id="main-content">
      <h1 ref={headingRef} tabIndex={-1} data-route-focus>
        Page not found
      </h1>
      <p>The page you requested could not be found.</p>
      <p>Requested path: {location.pathname}</p>
      <nav>
        <Link to="/">Back to Home</Link>
      </nav>
    </main>
  );
}

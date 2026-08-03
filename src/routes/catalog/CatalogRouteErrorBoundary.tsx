import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function CatalogErrorBoundary(): React.ReactElement {
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <main id="main-content">
      <h1 ref={headingRef} tabIndex={-1} data-route-focus>
        Resource not found
      </h1>
      <p>The requested resource could not be found.</p>
      <nav>
        <Link to="/">Back to Home</Link>
      </nav>
    </main>
  );
}

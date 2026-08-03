import React, { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

export function RootErrorBoundary(): React.ReactElement {
  const error = useRouteError();
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  const isDev = import.meta.env.DEV;
  const errorMessage = error instanceof Error ? error.message : 'Application error occurred';

  return (
    <div>
      <main id="main-content">
        <h1 ref={headingRef} tabIndex={-1} data-route-focus>
          Application error
        </h1>
        <p>Something went wrong. Please try reloading the page.</p>
        {isDev && <pre>{errorMessage}</pre>}
        <button onClick={() => window.location.reload()}>Reload page</button>
      </main>
    </div>
  );
}

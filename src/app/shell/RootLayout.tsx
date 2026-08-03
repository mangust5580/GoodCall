import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Shell.module.scss';

export function RootLayout(): React.ReactElement {
  const location = useLocation();

  useEffect(() => {
    const mainElement = document.getElementById('main-content');
    if (mainElement) {
      const heading = mainElement.querySelector('h1[data-route-focus]');
      if (heading && heading instanceof HTMLElement) {
        heading.focus();
      }
    }
  }, [location.pathname]);

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles['skip-link']}>
        Skip to main content
      </a>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles['sr-only']}
        id="route-announcement"
      />
      <Outlet />
    </div>
  );
}

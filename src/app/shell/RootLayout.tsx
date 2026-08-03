import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useMatches, useNavigationType } from 'react-router-dom';
import styles from './Shell.module.scss';

export function RootLayout(): React.ReactElement {
  const location = useLocation();
  const matches = useMatches();
  const navigationType = useNavigationType();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (navigationType === 'POP') {
      return;
    }

    const mainElement = document.getElementById('main-content');
    if (mainElement) {
      const heading = mainElement.querySelector('h1[data-route-focus]');
      if (heading && heading instanceof HTMLElement) {
        requestAnimationFrame(() => {
          heading.focus();
        });
      }
    }
  }, [location.pathname, navigationType]);

  useEffect(() => {
    const deepestHandle = matches[matches.length - 1]?.handle as { title?: string } | undefined;
    const title = typeof deepestHandle?.title === 'string' ? deepestHandle.title : 'GoodCall';

    document.title = title;

    const announcement = document.getElementById('route-announcement');
    if (announcement && navigationType !== 'POP') {
      const isQueryOnly =
        location.pathname === (matches[matches.length - 1]?.pathname || location.pathname);
      if (!isQueryOnly) {
        announcement.textContent = title;
      }
    }
  }, [location.pathname, matches, navigationType]);

  const handleSkipLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainElement = document.getElementById('main-content');
    if (mainElement) {
      mainElement.focus();
    }
  };

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles['skip-link']} onClick={handleSkipLinkClick}>
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

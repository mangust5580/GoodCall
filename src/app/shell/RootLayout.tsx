import React, { useEffect, useRef } from 'react';
import {
  Outlet,
  useLocation,
  useMatches,
  useNavigationType,
  useNavigation,
} from 'react-router-dom';
import styles from './Shell.module.scss';

const scrollPositions: Record<string, number> = {};

export function RootLayout(): React.ReactElement {
  const location = useLocation();
  const matches = useMatches();
  const navigationType = useNavigationType();
  const navigation = useNavigation();
  const isInitialLoad = useRef(true);
  const pendingTimerRef = useRef<number | null>(null);
  const [showPendingIndicator, setShowPendingIndicator] = React.useState(false);

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

  useEffect(() => {
    if (navigation.state === 'loading') {
      pendingTimerRef.current = window.setTimeout(() => {
        setShowPendingIndicator(true);
      }, 500);
    } else {
      if (pendingTimerRef.current !== null) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
      setShowPendingIndicator(false);
    }

    return () => {
      if (pendingTimerRef.current !== null) {
        clearTimeout(pendingTimerRef.current);
      }
    };
  }, [navigation.state]);

  useEffect(() => {
    if (navigationType === 'POP') {
      const savedPosition = scrollPositions[location.pathname];
      if (typeof savedPosition === 'number') {
        window.scrollTo(0, savedPosition);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navigationType]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions[location.pathname] = window.scrollY;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      scrollPositions[location.pathname] = window.scrollY;
    };
  }, [location.pathname]);

  const handleSkipLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainElement = document.getElementById('main-content');
    if (mainElement) {
      mainElement.focus();
    }
  };

  return (
    <div className={styles.shell} role="application" aria-busy={navigation.state === 'loading'}>
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
      {showPendingIndicator && (
        <div role="status" aria-live="polite" className={styles['sr-only']} id="navigation-pending">
          Loading page
        </div>
      )}
      <Outlet />
    </div>
  );
}

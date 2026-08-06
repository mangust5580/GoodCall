import React, { useEffect, useRef } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
  useNavigationType,
  useNavigation,
} from 'react-router-dom';
import styles from './Shell.module.scss';
import { BrandHomeLink } from '@/app/shell/brand';

export function RootLayout(): React.ReactElement {
  const location = useLocation();
  const matches = useMatches();
  const navigationType = useNavigationType();
  const navigation = useNavigation();
  const isInitialLoad = useRef(true);
  const previousPathname = useRef<string | null>(null);
  const previousPathnameForFocus = useRef<string | null>(null);
  const pendingTimerRef = useRef<number | null>(null);
  const [showPendingIndicator, setShowPendingIndicator] = React.useState(false);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      previousPathnameForFocus.current = location.pathname;
      return;
    }

    if (navigationType === 'POP') {
      previousPathnameForFocus.current = location.pathname;
      return;
    }

    const isPathnameChanged = location.pathname !== previousPathnameForFocus.current;
    if (!isPathnameChanged) {
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

    previousPathnameForFocus.current = location.pathname;
  }, [location.pathname, navigationType]);

  useEffect(() => {
    const deepestHandle = matches[matches.length - 1]?.handle as { title?: string } | undefined;
    const title = typeof deepestHandle?.title === 'string' ? deepestHandle.title : 'GoodCall';

    document.title = title;

    const isPathChanged = location.pathname !== previousPathname.current;
    previousPathname.current = location.pathname;

    const announcement = document.getElementById('route-announcement');
    if (announcement && isPathChanged && navigationType !== 'POP') {
      announcement.textContent = title;
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

  return (
    <div className={styles.shell} aria-busy={navigation.state === 'loading'}>
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
      {showPendingIndicator && (
        <div role="status" aria-live="polite" className={styles['sr-only']} id="navigation-pending">
          Loading page
        </div>
      )}
      <header className={styles['brand-slot']}>
        <BrandHomeLink />
      </header>
      <ScrollRestoration getKey={(location) => location.pathname} />
      <Outlet />
    </div>
  );
}

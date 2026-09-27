import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  NavigationType as RouterNavigationType,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

export function RouteScrollReset() {
  const { pathname } = useLocation();
  const routerNavigationType = useNavigationType();
  const previousPathname = useRef(pathname);
  const browserNavigationType = useRef<NavigationType | undefined>(undefined);

  useEffect(() => {
    if (!('navigation' in window)) {
      return;
    }

    const handleNavigate = (event: NavigateEvent) => {
      browserNavigationType.current = event.navigationType;
    };

    window.navigation.addEventListener('navigate', handleNavigate);

    return () => {
      window.navigation.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;

    const historyTraversal =
      routerNavigationType === RouterNavigationType.Pop &&
      browserNavigationType.current !== 'push' &&
      browserNavigationType.current !== 'replace';

    if (!historyTraversal) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, routerNavigationType]);

  return null;
}

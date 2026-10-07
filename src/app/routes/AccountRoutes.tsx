import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import {
  DEMO_ACCOUNT_PERSONA,
  signInDemoAccount,
  signOutDemoAccount,
  useAccountSignedIn,
} from '../../commerce/account';
import { useCompareCount } from '../../commerce/compare';
import { useFavoritesCount } from '../../commerce/favorites';
import { AccountOverviewPage, LoginPage } from '../../pages/account';
import type { AccountRecentOrder } from '../../pages/account';
import { readDemoOrder } from '../../pages/order-confirmation';
import { ProductionShell } from '../ProductionShell';
import {
  ACCOUNT_PATH,
  CATALOG_SMARTPHONES_PATH,
  COMPARE_PATH,
  FAVORITES_PATH,
  HOME_PATH,
  LOGIN_PATH,
  ORDER_CONFIRMATION_PATH,
  hashHref,
} from '../routePaths';

type AccountTransition = 'signed-in' | 'signed-out';

const SIGNED_OUT_STATUS = 'Вы вышли из демо-аккаунта';

function readTransition(state: unknown): AccountTransition | undefined {
  if (typeof state !== 'object' || state === null) {
    return undefined;
  }

  const { accountTransition } = state as Record<string, unknown>;

  return accountTransition === 'signed-in' || accountTransition === 'signed-out'
    ? accountTransition
    : undefined;
}

function useOneTimeTransition(): AccountTransition | undefined {
  const location = useLocation();
  const navigate = useNavigate();
  const [transition] = useState(() => readTransition(location.state));
  const hasState = readTransition(location.state) !== undefined;

  useEffect(() => {
    if (hasState) {
      void navigate(location.pathname, { replace: true, state: null });
    }
  }, [hasState, location.pathname, navigate]);

  return transition;
}

function recentOrder(): AccountRecentOrder | undefined {
  const order = readDemoOrder();

  return order === undefined
    ? undefined
    : {
        number: order.number,
        createdAt: order.createdAt,
        unitCount: order.totals.unitCount,
        total: order.totals.total,
      };
}

export function LoginRoute() {
  const signedIn = useAccountSignedIn();
  const transition = useOneTimeTransition();
  const [entering, setEntering] = useState(false);

  if (signedIn) {
    return (
      <Navigate
        replace
        state={entering ? { accountTransition: 'signed-in' } : undefined}
        to={ACCOUNT_PATH}
      />
    );
  }

  return (
    <ProductionShell>
      <LoginPage
        focusTitle={transition === 'signed-out'}
        homeHref={hashHref(HOME_PATH)}
        onEnterDemo={() => {
          setEntering(true);
          signInDemoAccount();
        }}
        status={transition === 'signed-out' ? SIGNED_OUT_STATUS : undefined}
      />
    </ProductionShell>
  );
}

export function AccountRoute() {
  const signedIn = useAccountSignedIn();
  const transition = useOneTimeTransition();
  const [signingOut, setSigningOut] = useState(false);
  const favoritesCount = useFavoritesCount();
  const compareCount = useCompareCount();
  const [order] = useState(recentOrder);

  if (!signedIn) {
    return (
      <Navigate
        replace
        state={signingOut ? { accountTransition: 'signed-out' } : undefined}
        to={LOGIN_PATH}
      />
    );
  }

  return (
    <ProductionShell>
      <AccountOverviewPage
        accountHref={hashHref(ACCOUNT_PATH)}
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        compareCount={compareCount}
        compareHref={hashHref(COMPARE_PATH)}
        favoritesCount={favoritesCount}
        favoritesHref={hashHref(FAVORITES_PATH)}
        focusTitle={transition === 'signed-in'}
        homeHref={hashHref(HOME_PATH)}
        onSignOut={() => {
          setSigningOut(true);
          signOutDemoAccount();
        }}
        order={order}
        orderHref={hashHref(ORDER_CONFIRMATION_PATH)}
        persona={DEMO_ACCOUNT_PERSONA}
      />
    </ProductionShell>
  );
}

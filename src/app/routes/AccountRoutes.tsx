import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import {
  saveAccountProfile,
  signInDemoAccount,
  signOutDemoAccount,
  useAccountProfile,
  useAccountSignedIn,
} from '../../commerce/account';
import { useCompareCount } from '../../commerce/compare';
import { useFavoritesCount } from '../../commerce/favorites';
import { findStore } from '../../commerce/shops';
import {
  AccountOrdersPage,
  AccountOverviewPage,
  AccountProfilePage,
  LoginPage,
} from '../../pages/account';
import type { AccountLinks, AccountRecentOrder, AccountSessionOrder } from '../../pages/account';
import { CHECKOUT_PAYMENT_METHODS } from '../../pages/checkout';
import { readDemoOrder } from '../../pages/order-confirmation';
import type { DemoOrder } from '../../pages/order-confirmation';
import { ProductionShell } from '../ProductionShell';
import {
  ACCOUNT_ORDERS_PATH,
  ACCOUNT_PATH,
  ACCOUNT_PROFILE_PATH,
  CATALOG_SMARTPHONES_PATH,
  COMPARE_PATH,
  FAVORITES_PATH,
  HOME_PATH,
  LOGIN_PATH,
  ORDER_CONFIRMATION_PATH,
  hashHref,
} from '../routePaths';

type AccountTransition = 'signed-in' | 'signed-out';

interface AccountRouteState {
  readonly transition?: AccountTransition;
  readonly accountReturn?: string;
}

const SIGNED_OUT_STATUS = 'Вы вышли из демо-аккаунта';
const ACCOUNT_RETURN_PATHS: readonly string[] = [
  ACCOUNT_PATH,
  ACCOUNT_ORDERS_PATH,
  ACCOUNT_PROFILE_PATH,
];

const ACCOUNT_LINKS: AccountLinks = {
  home: hashHref(HOME_PATH),
  account: hashHref(ACCOUNT_PATH),
  orders: hashHref(ACCOUNT_ORDERS_PATH),
  profile: hashHref(ACCOUNT_PROFILE_PATH),
  favorites: hashHref(FAVORITES_PATH),
  compare: hashHref(COMPARE_PATH),
  catalog: hashHref(CATALOG_SMARTPHONES_PATH),
  orderConfirmation: hashHref(ORDER_CONFIRMATION_PATH),
};

function readRouteState(state: unknown): AccountRouteState {
  if (typeof state !== 'object' || state === null) {
    return {};
  }

  const { accountTransition, accountReturn } = state as Record<string, unknown>;

  return {
    transition:
      accountTransition === 'signed-in' || accountTransition === 'signed-out'
        ? accountTransition
        : undefined,
    accountReturn:
      typeof accountReturn === 'string' && ACCOUNT_RETURN_PATHS.includes(accountReturn)
        ? accountReturn
        : undefined,
  };
}

function useOneTimeRouteState(): AccountRouteState {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeState] = useState(() => readRouteState(location.state));
  const hasState = location.state !== null && location.state !== undefined;

  useEffect(() => {
    if (hasState) {
      void navigate(location.pathname, { replace: true, state: null });
    }
  }, [hasState, location.pathname, navigate]);

  return routeState;
}

function useSignedInAccountPage(): {
  readonly gate: ReactNode;
  readonly focusTitle: boolean;
  readonly signOut: () => void;
} {
  const signedIn = useAccountSignedIn();
  const { pathname } = useLocation();
  const { transition } = useOneTimeRouteState();
  const [signingOut, setSigningOut] = useState(false);

  const gate = signedIn ? null : (
    <Navigate
      replace
      state={
        signingOut
          ? { accountTransition: 'signed-out' }
          : { accountReturn: ACCOUNT_RETURN_PATHS.includes(pathname) ? pathname : ACCOUNT_PATH }
      }
      to={LOGIN_PATH}
    />
  );

  return {
    gate,
    focusTitle: transition === 'signed-in',
    signOut: () => {
      setSigningOut(true);
      signOutDemoAccount();
    },
  };
}

function recentOrder(order: DemoOrder | undefined): AccountRecentOrder | undefined {
  return order === undefined
    ? undefined
    : {
        number: order.number,
        createdAt: order.createdAt,
        unitCount: order.totals.unitCount,
        total: order.totals.total,
      };
}

function sessionOrder(order: DemoOrder | undefined): AccountSessionOrder | undefined {
  const firstLine = order?.lines[0];

  if (order === undefined || firstLine === undefined) {
    return undefined;
  }

  const store =
    order.deliveryMethod === 'pickup' ? findStore(order.pickupStoreId ?? null) : undefined;
  const address =
    order.deliveryMethod === 'pickup'
      ? store === undefined
        ? 'Магазин GoodCall'
        : `${store.name}, ${store.address}`
      : (order.courier?.address ?? '');

  return {
    number: order.number,
    createdAt: order.createdAt,
    unitCount: order.totals.unitCount,
    total: order.totals.total,
    paymentLabel:
      CHECKOUT_PAYMENT_METHODS.find((method) => method.value === order.payment)?.label ??
      order.payment,
    fulfilmentLabel: order.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Курьером',
    address,
    thumbnail: {
      image: firstLine.image,
      ...(firstLine.productSlug === undefined ? {} : { productSlug: firstLine.productSlug }),
    },
  };
}

export function LoginRoute() {
  const signedIn = useAccountSignedIn();
  const { transition, accountReturn } = useOneTimeRouteState();
  const [entering, setEntering] = useState(false);

  if (signedIn) {
    return (
      <Navigate
        replace
        state={entering ? { accountTransition: 'signed-in' } : undefined}
        to={entering ? (accountReturn ?? ACCOUNT_PATH) : ACCOUNT_PATH}
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
  const { gate, focusTitle, signOut } = useSignedInAccountPage();
  const profile = useAccountProfile();
  const favoritesCount = useFavoritesCount();
  const compareCount = useCompareCount();
  const [order] = useState(() => recentOrder(readDemoOrder()));

  if (gate !== null) {
    return gate;
  }

  return (
    <ProductionShell>
      <AccountOverviewPage
        compareCount={compareCount}
        favoritesCount={favoritesCount}
        focusTitle={focusTitle}
        links={ACCOUNT_LINKS}
        onSignOut={signOut}
        order={order}
        profile={profile}
      />
    </ProductionShell>
  );
}

export function AccountOrdersRoute() {
  const { gate, focusTitle, signOut } = useSignedInAccountPage();
  const [order] = useState(() => sessionOrder(readDemoOrder()));

  if (gate !== null) {
    return gate;
  }

  return (
    <ProductionShell>
      <AccountOrdersPage
        focusTitle={focusTitle}
        links={ACCOUNT_LINKS}
        onSignOut={signOut}
        order={order}
      />
    </ProductionShell>
  );
}

export function AccountProfileRoute() {
  const { gate, focusTitle, signOut } = useSignedInAccountPage();
  const profile = useAccountProfile();

  if (gate !== null) {
    return gate;
  }

  return (
    <ProductionShell>
      <AccountProfilePage
        focusTitle={focusTitle}
        links={ACCOUNT_LINKS}
        onSave={saveAccountProfile}
        onSignOut={signOut}
        profile={profile}
      />
    </ProductionShell>
  );
}

import { useSyncExternalStore } from 'react';

import type { DemoAccountAddress } from './accountAddresses';
import type { DemoAccountProfile } from './accountPersona';
import {
  getAccountAddresses,
  getAccountProfile,
  getDefaultAccountAddressId,
  isAccountSignedIn,
  subscribeAccount,
} from './accountStore';

export function useAccountSignedIn(): boolean {
  return useSyncExternalStore(subscribeAccount, isAccountSignedIn);
}

export function useAccountProfile(): DemoAccountProfile {
  return useSyncExternalStore(subscribeAccount, getAccountProfile);
}

export function useAccountAddresses(): readonly DemoAccountAddress[] {
  return useSyncExternalStore(subscribeAccount, getAccountAddresses);
}

export function useDefaultAccountAddressId(): string | undefined {
  return useSyncExternalStore(subscribeAccount, getDefaultAccountAddressId);
}

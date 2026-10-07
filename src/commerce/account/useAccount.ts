import { useSyncExternalStore } from 'react';

import type { DemoAccountProfile } from './accountPersona';
import { getAccountProfile, isAccountSignedIn, subscribeAccount } from './accountStore';

export function useAccountSignedIn(): boolean {
  return useSyncExternalStore(subscribeAccount, isAccountSignedIn);
}

export function useAccountProfile(): DemoAccountProfile {
  return useSyncExternalStore(subscribeAccount, getAccountProfile);
}

import { useSyncExternalStore } from 'react';

import { isAccountSignedIn, subscribeAccount } from './accountStore';

export function useAccountSignedIn(): boolean {
  return useSyncExternalStore(subscribeAccount, isAccountSignedIn);
}

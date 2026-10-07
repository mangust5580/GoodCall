import { DEMO_ACCOUNT_PERSONA } from './accountPersona';
import type { DemoAccountProfile } from './accountPersona';
import { normalizeAccountProfile, toStoredAccountProfile } from './accountProfile';

export const ACCOUNT_STORAGE_KEY = 'goodcall.account.v1';

const ACCOUNT_STORAGE_VERSION = 1;

interface AccountState {
  readonly signedIn: boolean;
  readonly profile?: DemoAccountProfile;
}

type Listener = () => void;

const SIGNED_OUT: AccountState = { signedIn: false };
const listeners = new Set<Listener>();
let state: AccountState | undefined;

function storedValue(next: AccountState): string {
  return JSON.stringify(
    next.profile === undefined
      ? { version: ACCOUNT_STORAGE_VERSION, signedIn: true }
      : { version: ACCOUNT_STORAGE_VERSION, signedIn: true, profile: next.profile },
  );
}

function removeStoredAccount(): void {
  try {
    window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  } catch {
    return;
  }
}

function writeStoredAccount(next: AccountState): void {
  try {
    window.localStorage.setItem(ACCOUNT_STORAGE_KEY, storedValue(next));
  } catch {
    return;
  }
}

function parseStoredAccount(raw: string): AccountState | undefined {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return undefined;
  }

  const record = parsed as Record<string, unknown>;

  if (record.version !== ACCOUNT_STORAGE_VERSION || record.signedIn !== true) {
    return undefined;
  }

  if (!('profile' in record)) {
    return { signedIn: true };
  }

  const profile = toStoredAccountProfile(record.profile);

  if (profile === undefined) {
    const recovered: AccountState = { signedIn: true };

    writeStoredAccount(recovered);

    return recovered;
  }

  return { signedIn: true, profile };
}

function readStoredAccount(): AccountState {
  let raw: string | null;

  try {
    raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
  } catch {
    return SIGNED_OUT;
  }

  if (raw === null) {
    return SIGNED_OUT;
  }

  const stored = parseStoredAccount(raw);

  if (stored === undefined) {
    removeStoredAccount();

    return SIGNED_OUT;
  }

  return stored;
}

function currentState(): AccountState {
  state ??= readStoredAccount();

  return state;
}

function commit(next: AccountState): void {
  state = next;

  if (next.signedIn) {
    writeStoredAccount(next);
  } else {
    removeStoredAccount();
  }

  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribeAccount(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function isAccountSignedIn(): boolean {
  return currentState().signedIn;
}

export function getAccountProfile(): DemoAccountProfile {
  return currentState().profile ?? DEMO_ACCOUNT_PERSONA;
}

export function signInDemoAccount(): void {
  commit({ signedIn: true });
}

export function signOutDemoAccount(): void {
  commit(SIGNED_OUT);
}

export function saveAccountProfile(profile: DemoAccountProfile): boolean {
  const current = currentState();
  const normalized = toStoredAccountProfile(normalizeAccountProfile(profile));

  if (!current.signedIn || normalized === undefined) {
    return false;
  }

  commit({ signedIn: true, profile: normalized });

  return true;
}

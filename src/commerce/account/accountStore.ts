import {
  ACCOUNT_ADDRESS_LIMIT,
  accountAddressErrors,
  createAccountAddressId,
  readStoredAddressBook,
  toAccountAddress,
  withDefaultAddress,
} from './accountAddresses';
import type {
  AccountAddressBook,
  AccountAddressInput,
  DemoAccountAddress,
} from './accountAddresses';
import { DEMO_ACCOUNT_PERSONA } from './accountPersona';
import type { DemoAccountProfile } from './accountPersona';
import { normalizeAccountProfile, toStoredAccountProfile } from './accountProfile';

export const ACCOUNT_STORAGE_KEY = 'goodcall.account.v1';

const ACCOUNT_STORAGE_VERSION = 1;

interface AccountState extends AccountAddressBook {
  readonly signedIn: boolean;
  readonly profile?: DemoAccountProfile;
}

type Listener = () => void;

const NO_ADDRESSES: readonly DemoAccountAddress[] = [];
const SIGNED_OUT: AccountState = { signedIn: false, addresses: NO_ADDRESSES };
const listeners = new Set<Listener>();
let state: AccountState | undefined;

function signedInState(
  profile: DemoAccountProfile | undefined,
  book: AccountAddressBook,
): AccountState {
  const { addresses, defaultAddressId } = withDefaultAddress(book.addresses, book.defaultAddressId);

  return {
    signedIn: true,
    ...(profile === undefined ? {} : { profile }),
    addresses: addresses.length === 0 ? NO_ADDRESSES : addresses,
    ...(defaultAddressId === undefined ? {} : { defaultAddressId }),
  };
}

function storedValue(next: AccountState): string {
  return JSON.stringify({
    version: ACCOUNT_STORAGE_VERSION,
    signedIn: true,
    ...(next.profile === undefined ? {} : { profile: next.profile }),
    ...(next.addresses.length === 0
      ? {}
      : { addresses: next.addresses, defaultAddressId: next.defaultAddressId }),
  });
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

  const profile = 'profile' in record ? toStoredAccountProfile(record.profile) : undefined;
  const book =
    'addresses' in record
      ? readStoredAddressBook(record.addresses, record.defaultAddressId)
      : { addresses: NO_ADDRESSES };
  const recovered = signedInState(profile, book);

  if (storedValue(recovered) !== raw) {
    writeStoredAccount(recovered);
  }

  return recovered;
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

function updateSignedIn(
  change: (current: AccountState) => AccountState | undefined,
): AccountState | undefined {
  const current = currentState();

  if (!current.signedIn) {
    return undefined;
  }

  const next = change(current);

  if (next !== undefined) {
    commit(next);
  }

  return next;
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

export function getAccountAddresses(): readonly DemoAccountAddress[] {
  return currentState().addresses;
}

export function getDefaultAccountAddressId(): string | undefined {
  return currentState().defaultAddressId;
}

export function signInDemoAccount(): void {
  commit(signedInState(undefined, { addresses: NO_ADDRESSES }));
}

export function signOutDemoAccount(): void {
  commit(SIGNED_OUT);
}

export function saveAccountProfile(profile: DemoAccountProfile): boolean {
  const normalized = toStoredAccountProfile(normalizeAccountProfile(profile));

  if (normalized === undefined) {
    return false;
  }

  return updateSignedIn((current) => signedInState(normalized, current)) !== undefined;
}

export function addAccountAddress(
  input: AccountAddressInput,
  makeDefault: boolean,
): string | undefined {
  if (Object.keys(accountAddressErrors(input)).length > 0) {
    return undefined;
  }

  let created: string | undefined;

  updateSignedIn((current) => {
    if (current.addresses.length >= ACCOUNT_ADDRESS_LIMIT) {
      return undefined;
    }

    const id = createAccountAddressId(current.addresses);
    created = id;

    return signedInState(current.profile, {
      addresses: [...current.addresses, toAccountAddress(id, input)],
      defaultAddressId: makeDefault ? id : current.defaultAddressId,
    });
  });

  return created;
}

export function updateAccountAddress(
  id: string,
  input: AccountAddressInput,
  makeDefault: boolean,
): boolean {
  if (Object.keys(accountAddressErrors(input)).length > 0) {
    return false;
  }

  const next = updateSignedIn((current) =>
    current.addresses.some((address) => address.id === id)
      ? signedInState(current.profile, {
          addresses: current.addresses.map((address) =>
            address.id === id ? toAccountAddress(id, input) : address,
          ),
          defaultAddressId: makeDefault ? id : current.defaultAddressId,
        })
      : undefined,
  );

  return next !== undefined;
}

export function deleteAccountAddress(id: string): boolean {
  const next = updateSignedIn((current) =>
    current.addresses.some((address) => address.id === id)
      ? signedInState(current.profile, {
          addresses: current.addresses.filter((address) => address.id !== id),
          defaultAddressId: current.defaultAddressId,
        })
      : undefined,
  );

  return next !== undefined;
}

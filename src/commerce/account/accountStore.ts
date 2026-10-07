export const ACCOUNT_STORAGE_KEY = 'goodcall.account.v1';

const ACCOUNT_STORAGE_VERSION = 1;

type Listener = () => void;

const listeners = new Set<Listener>();
let signedIn: boolean | undefined;

function parseStoredSignedIn(raw: string): boolean | undefined {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return undefined;
  }

  const { version, signedIn: storedSignedIn } = parsed as Record<string, unknown>;

  return version === ACCOUNT_STORAGE_VERSION && storedSignedIn === true ? true : undefined;
}

function removeStoredAccount(): void {
  try {
    window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  } catch {
    return;
  }
}

function readStoredSignedIn(): boolean {
  let raw: string | null;

  try {
    raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
  } catch {
    return false;
  }

  if (raw === null) {
    return false;
  }

  if (parseStoredSignedIn(raw) === undefined) {
    removeStoredAccount();

    return false;
  }

  return true;
}

function writeStoredSignedIn(): void {
  try {
    window.localStorage.setItem(
      ACCOUNT_STORAGE_KEY,
      JSON.stringify({ version: ACCOUNT_STORAGE_VERSION, signedIn: true }),
    );
  } catch {
    return;
  }
}

function commit(next: boolean): void {
  signedIn = next;

  if (next) {
    writeStoredSignedIn();
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
  signedIn ??= readStoredSignedIn();

  return signedIn;
}

export function signInDemoAccount(): void {
  commit(true);
}

export function signOutDemoAccount(): void {
  commit(false);
}

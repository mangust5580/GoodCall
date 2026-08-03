export const FALLBACK_KEY = '__goodcall_redirect';
export const FALLBACK_TIMEOUT_MS = 5000;

export interface RedirectPayload {
  pathname: string;
  search: string;
  hash: string;
  timestamp: number;
}

export function validateRedirectPayload(
  payload: unknown,
  base: string = import.meta.env.BASE_URL
): {
  valid: boolean;
  error?: string;
} {
  if (typeof payload !== 'object' || payload === null) {
    return { valid: false, error: 'Invalid payload type' };
  }

  const obj = payload as Record<string, unknown>;

  if (typeof obj.pathname !== 'string') {
    return { valid: false, error: 'Missing or invalid pathname' };
  }

  if (!obj.pathname.startsWith(base)) {
    return { valid: false, error: 'Pathname not under app base' };
  }

  if (obj.search !== undefined && typeof obj.search !== 'string') {
    return { valid: false, error: 'Invalid search' };
  }

  if (obj.hash !== undefined && typeof obj.hash !== 'string') {
    return { valid: false, error: 'Invalid hash' };
  }

  if (typeof obj.timestamp !== 'number' || !isFinite(obj.timestamp)) {
    return { valid: false, error: 'Missing or invalid timestamp' };
  }

  if (obj.timestamp > Date.now()) {
    return { valid: false, error: 'Timestamp in future' };
  }

  if (Date.now() - obj.timestamp > FALLBACK_TIMEOUT_MS) {
    return { valid: false, error: 'Redirect expired' };
  }

  return { valid: true };
}

export function restoreURLFromPayload(
  payload: unknown,
  base: string = import.meta.env.BASE_URL
): string | null {
  const validation = validateRedirectPayload(payload, base);
  if (!validation.valid) {
    return null;
  }

  const obj = payload as RedirectPayload;
  return obj.pathname + obj.search + obj.hash;
}

export function restoreRedirectedURL(): void {
  const base = import.meta.env.BASE_URL;
  let payload: unknown;
  try {
    const stored = sessionStorage.getItem(FALLBACK_KEY);
    if (!stored) return;

    payload = JSON.parse(stored);
  } catch (_e) {
    try {
      sessionStorage.removeItem(FALLBACK_KEY);
    } catch (_e2) {
      void _e2;
    }
    return;
  }

  const restoredURL = restoreURLFromPayload(payload, base);
  if (!restoredURL) {
    try {
      sessionStorage.removeItem(FALLBACK_KEY);
    } catch (_e) {
      void _e;
    }
    return;
  }

  window.history.replaceState(null, '', restoredURL);

  try {
    sessionStorage.removeItem(FALLBACK_KEY);
  } catch (_e) {
    void _e;
  }
}

/**
 * GitHub Pages 404 redirect/restore fallback mechanism.
 *
 * Flow:
 * 1. User accesses /GoodCall/missing/path
 * 2. GitHub Pages 404 handler captures URL and stores in sessionStorage
 * 3. Redirects to /GoodCall/ (app entry)
 * 4. Runtime restores URL from sessionStorage via History API
 */

export const FALLBACK_KEY = '__goodcall_redirect';
export const FALLBACK_TIMEOUT_MS = 5000; // 5 second window
export const APP_BASE = '/GoodCall/';

export interface RedirectPayload {
  pathname: string;
  search: string;
  hash: string;
  timestamp: number;
}

/**
 * Validate redirect payload from 404 handler.
 * Ensures payload is safe before restoration.
 */
export function validateRedirectPayload(payload: unknown): {
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

  // Must be under app base to prevent external redirects
  if (!obj.pathname.startsWith(APP_BASE)) {
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

/**
 * Restore URL from validated payload.
 */
export function restoreURLFromPayload(payload: unknown): string | null {
  const validation = validateRedirectPayload(payload);
  if (!validation.valid) {
    return null;
  }

  const obj = payload as RedirectPayload;
  return obj.pathname + obj.search + obj.hash;
}

/**
 * Restore attempted URL from sessionStorage.
 * Called at runtime to handle GitHub Pages 404 redirect.
 */
export function restoreRedirectedURL(): void {
  let payload: unknown;
  try {
    const stored = sessionStorage.getItem(FALLBACK_KEY);
    if (!stored) return;

    payload = JSON.parse(stored);
  } catch (_e) {
    // Invalid JSON or sessionStorage error - clean up and exit
    try {
      sessionStorage.removeItem(FALLBACK_KEY);
    } catch (_e2) {
      // sessionStorage unavailable
    }
    return;
  }

  const restoredURL = restoreURLFromPayload(payload);
  if (!restoredURL) {
    // Validation failed - clean up
    try {
      sessionStorage.removeItem(FALLBACK_KEY);
    } catch (_e) {
      // sessionStorage unavailable
    }
    return;
  }

  // Restore the attempted URL using History API (no reload)
  window.history.replaceState(null, '', restoredURL);

  // Clean up storage
  try {
    sessionStorage.removeItem(FALLBACK_KEY);
  } catch (_e) {
    // sessionStorage unavailable - acceptable
  }
}

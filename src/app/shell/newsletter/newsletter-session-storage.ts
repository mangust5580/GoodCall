import { z } from 'zod';
import { newsletterEmailSchema } from './newsletter-schema';

export const NEWSLETTER_STORAGE_KEY = 'goodcall.newsletter';

export const NEWSLETTER_STORAGE_VERSION = 1;

const persistedConsentSchema = z.object({
  version: z.literal(NEWSLETTER_STORAGE_VERSION),
  state: z.literal('subscribed'),
  email: newsletterEmailSchema,
});

export type NewsletterPersistedConsent = z.infer<typeof persistedConsentSchema>;

function sessionStore(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function clearNewsletterConsent(): void {
  const store = sessionStore();

  if (store === null) {
    return;
  }

  try {
    store.removeItem(NEWSLETTER_STORAGE_KEY);
  } catch {
    return;
  }
}

export function readNewsletterConsent(): NewsletterPersistedConsent | null {
  const store = sessionStore();

  if (store === null) {
    return null;
  }

  let raw: string | null;

  try {
    raw = store.getItem(NEWSLETTER_STORAGE_KEY);
  } catch {
    return null;
  }

  if (raw === null) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    clearNewsletterConsent();
    return null;
  }

  const result = persistedConsentSchema.safeParse(parsed);

  if (!result.success) {
    clearNewsletterConsent();
    return null;
  }

  return result.data;
}

export function writeNewsletterConsent(email: string): void {
  const store = sessionStore();

  if (store === null) {
    return;
  }

  const payload: NewsletterPersistedConsent = {
    version: NEWSLETTER_STORAGE_VERSION,
    state: 'subscribed',
    email,
  };

  try {
    store.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    return;
  }
}

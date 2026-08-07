import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  NEWSLETTER_STORAGE_KEY,
  NEWSLETTER_STORAGE_VERSION,
  clearNewsletterConsent,
  readNewsletterConsent,
  writeNewsletterConsent,
} from '@/app/shell/newsletter/newsletter-session-storage';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const storageSource = fs.readFileSync(
  path.join(repoRoot, 'src', 'app', 'shell', 'newsletter', 'newsletter-session-storage.ts'),
  'utf-8'
);

const VALID_EMAIL = 'reader@goodcall.test';
const UNRELATED_KEY = 'goodcall.unrelated';

function storedPayload(): unknown {
  const raw = window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY);
  return raw === null ? null : JSON.parse(raw);
}

describe('Newsletter session storage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('contract', () => {
    it('uses the stable application-owned key', () => {
      expect(NEWSLETTER_STORAGE_KEY).toBe('goodcall.newsletter');
      expect(NEWSLETTER_STORAGE_KEY).not.toContain('GoodCall/');
    });

    it('declares schema version 1', () => {
      expect(NEWSLETTER_STORAGE_VERSION).toBe(1);
    });

    it('uses sessionStorage only', () => {
      expect(storageSource).toContain('sessionStorage');
      expect(storageSource).not.toContain('localStorage');
      expect(storageSource).not.toContain('indexedDB');
      expect(storageSource).not.toContain('document.cookie');
    });

    it('registers no cross-tab synchronization', () => {
      expect(storageSource).not.toContain('addEventListener');
      expect(storageSource).not.toContain('BroadcastChannel');
      expect(storageSource).not.toContain('SharedWorker');
    });
  });

  describe('write', () => {
    it('persists a versioned subscribed envelope', () => {
      writeNewsletterConsent(VALID_EMAIL);

      expect(storedPayload()).toEqual({
        version: 1,
        state: 'subscribed',
        email: VALID_EMAIL,
      });
    });

    it('persists no pending, validation, focus or identity metadata', () => {
      writeNewsletterConsent(VALID_EMAIL);

      const raw = window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY) ?? '';

      expect(Object.keys(storedPayload() as object).sort()).toEqual(['email', 'state', 'version']);
      for (const forbidden of ['submitting', 'pending', 'touched', 'dirty', 'focus', 'session']) {
        expect(raw).not.toContain(forbidden);
      }
    });

    it('overwrites a previous subscription with the newer email', () => {
      writeNewsletterConsent(VALID_EMAIL);
      writeNewsletterConsent('second@goodcall.test');

      expect(storedPayload()).toEqual({
        version: 1,
        state: 'subscribed',
        email: 'second@goodcall.test',
      });
    });
  });

  describe('read', () => {
    it('returns null when no key exists', () => {
      expect(readNewsletterConsent()).toBeNull();
    });

    it('round-trips a valid subscribed payload', () => {
      writeNewsletterConsent(VALID_EMAIL);

      expect(readNewsletterConsent()).toEqual({
        version: 1,
        state: 'subscribed',
        email: VALID_EMAIL,
      });
    });

    it('normalizes a stored email with surrounding whitespace', () => {
      window.sessionStorage.setItem(
        NEWSLETTER_STORAGE_KEY,
        JSON.stringify({ version: 1, state: 'subscribed', email: `  ${VALID_EMAIL}  ` })
      );

      expect(readNewsletterConsent()?.email).toBe(VALID_EMAIL);
    });

    it.each([
      ['malformed JSON', 'not-json{'],
      [
        'unsupported version',
        JSON.stringify({ version: 2, state: 'subscribed', email: VALID_EMAIL }),
      ],
      ['missing version', JSON.stringify({ state: 'subscribed', email: VALID_EMAIL })],
      ['wrong state', JSON.stringify({ version: 1, state: 'unsubscribed', email: VALID_EMAIL })],
      ['missing email', JSON.stringify({ version: 1, state: 'subscribed' })],
      ['invalid email', JSON.stringify({ version: 1, state: 'subscribed', email: 'broken' })],
      ['empty email', JSON.stringify({ version: 1, state: 'subscribed', email: '   ' })],
      ['array payload', JSON.stringify([1, 2, 3])],
      ['null payload', JSON.stringify(null)],
    ])('safely clears its own key for %s', (_label, raw) => {
      window.sessionStorage.setItem(UNRELATED_KEY, 'keep-me');
      window.sessionStorage.setItem(NEWSLETTER_STORAGE_KEY, raw);

      expect(readNewsletterConsent()).toBeNull();
      expect(window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY)).toBeNull();
      expect(window.sessionStorage.getItem(UNRELATED_KEY)).toBe('keep-me');
    });

    it('leaves unrelated keys untouched on a valid read', () => {
      window.sessionStorage.setItem(UNRELATED_KEY, 'keep-me');
      writeNewsletterConsent(VALID_EMAIL);

      expect(readNewsletterConsent()).not.toBeNull();
      expect(window.sessionStorage.getItem(UNRELATED_KEY)).toBe('keep-me');
    });
  });

  describe('clear', () => {
    it('removes only the Newsletter key', () => {
      window.sessionStorage.setItem(UNRELATED_KEY, 'keep-me');
      writeNewsletterConsent(VALID_EMAIL);

      clearNewsletterConsent();

      expect(window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY)).toBeNull();
      expect(window.sessionStorage.getItem(UNRELATED_KEY)).toBe('keep-me');
    });

    it('is safe when nothing is stored', () => {
      expect(() => {
        clearNewsletterConsent();
      }).not.toThrow();
    });
  });

  describe('degraded storage', () => {
    it('returns null when reading throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied');
      });

      expect(() => readNewsletterConsent()).not.toThrow();
      expect(readNewsletterConsent()).toBeNull();
    });

    it('does not throw when writing throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });

      expect(() => {
        writeNewsletterConsent(VALID_EMAIL);
      }).not.toThrow();
    });

    it('does not throw when removing throws', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('denied');
      });

      expect(() => {
        clearNewsletterConsent();
      }).not.toThrow();
    });

    it('does not throw when sessionStorage access itself throws', () => {
      const descriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage');

      Object.defineProperty(window, 'sessionStorage', {
        configurable: true,
        get() {
          throw new Error('blocked');
        },
      });

      try {
        expect(readNewsletterConsent()).toBeNull();
        expect(() => {
          writeNewsletterConsent(VALID_EMAIL);
        }).not.toThrow();
        expect(() => {
          clearNewsletterConsent();
        }).not.toThrow();
      } finally {
        if (descriptor === undefined) {
          Reflect.deleteProperty(window, 'sessionStorage');
        } else {
          Object.defineProperty(window, 'sessionStorage', descriptor);
        }
      }
    });
  });
});

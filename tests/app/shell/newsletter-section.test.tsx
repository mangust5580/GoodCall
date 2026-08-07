import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, act, fireEvent } from '@testing-library/react';
import { NewsletterSection } from '@/app/shell/newsletter';
import {
  NEWSLETTER_CONSENT_NOTE,
  NEWSLETTER_DESCRIPTION,
  NEWSLETTER_EMAIL_LABEL,
  NEWSLETTER_EMPTY_ERROR,
  NEWSLETTER_HEADING,
  NEWSLETTER_INVALID_ERROR,
  NEWSLETTER_PENDING_STATUS,
  NEWSLETTER_SUBMIT_DELAY_MS,
  NEWSLETTER_SUBMIT_LABEL,
  NEWSLETTER_SUBMIT_PENDING_LABEL,
  NEWSLETTER_SUCCESS_STATUS,
} from '@/app/shell/newsletter/newsletter-content';
import { NEWSLETTER_STORAGE_KEY } from '@/app/shell/newsletter/newsletter-session-storage';

const VALID_EMAIL = 'reader@goodcall.test';
const SECOND_EMAIL = 'second@goodcall.test';

function newsletterSection(): HTMLElement {
  return screen.getByRole('region', { name: NEWSLETTER_HEADING });
}

function emailField(): HTMLInputElement {
  return screen.getByRole('textbox', { name: new RegExp(NEWSLETTER_EMAIL_LABEL) });
}

function submitButton(): HTMLButtonElement {
  return screen.getByRole('button', { name: new RegExp(`${NEWSLETTER_SUBMIT_LABEL}|Подписываем`) });
}

function newsletterForm(): HTMLFormElement {
  const form = newsletterSection().querySelector('form');

  if (form === null) {
    throw new Error('Newsletter form is missing');
  }

  return form;
}

function newsletterStatuses(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-newsletter-status]'));
}

function storedConsent(): unknown {
  const raw = window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY);
  return raw === null ? null : JSON.parse(raw);
}

function seedConsent(raw: string): void {
  window.sessionStorage.setItem(NEWSLETTER_STORAGE_KEY, raw);
}

function seedValidConsent(email: string): void {
  seedConsent(JSON.stringify({ version: 1, state: 'subscribed', email }));
}

async function typeEmail(value: string): Promise<void> {
  await act(async () => {
    fireEvent.change(emailField(), { target: { value } });
  });
}

async function blurEmail(): Promise<void> {
  await act(async () => {
    fireEvent.blur(emailField());
  });
}

async function submit(): Promise<void> {
  await act(async () => {
    fireEvent.click(submitButton());
  });
}

async function submitForm(): Promise<void> {
  await act(async () => {
    fireEvent.submit(newsletterForm());
  });
}

async function completePending(): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(NEWSLETTER_SUBMIT_DELAY_MS);
  });
}

async function subscribe(value: string): Promise<void> {
  await typeEmail(value);
  await submit();
  await completePending();
}

describe('NewsletterSection', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('structure and canonical content', () => {
    it('renders one named section with one heading', () => {
      render(<NewsletterSection />);

      expect(screen.getAllByRole('region', { name: NEWSLETTER_HEADING })).toHaveLength(1);
      expect(newsletterSection().tagName.toLowerCase()).toBe('section');
      expect(
        within(newsletterSection()).getAllByRole('heading', { name: NEWSLETTER_HEADING, level: 2 })
      ).toHaveLength(1);
    });

    it('renders the canonical description and consent note', () => {
      render(<NewsletterSection />);

      expect(screen.getByText(NEWSLETTER_DESCRIPTION)).toBeInTheDocument();
      expect(screen.getByText(NEWSLETTER_CONSENT_NOTE)).toBeInTheDocument();
    });

    it('renders one form with a persistent visible email label', () => {
      const { container } = render(<NewsletterSection />);

      expect(container.querySelectorAll('form')).toHaveLength(1);
      expect(container.querySelectorAll('input')).toHaveLength(1);

      const label = Array.from(container.querySelectorAll('label')).find(
        (candidate) => candidate.textContent === NEWSLETTER_EMAIL_LABEL
      );

      expect(label).toBeDefined();
      expect(label?.getAttribute('for')).toBe(emailField().id);
    });

    it('uses the correct email input purpose', () => {
      render(<NewsletterSection />);

      const field = emailField();
      expect(field.getAttribute('type')).toBe('email');
      expect(field.getAttribute('name')).toBe('email');
      expect(field.getAttribute('autocomplete')).toBe('email');
      expect(field.getAttribute('inputmode')).toBe('email');
      expect(field.required).toBe(true);
      expect(field.getAttribute('placeholder')).toBeNull();
      expect(field.value).toBe('');
    });

    it('names the form from the section heading', () => {
      render(<NewsletterSection />);

      const heading = within(newsletterSection()).getByRole('heading', { level: 2 });
      expect(newsletterForm().getAttribute('aria-labelledby')).toBe(heading.id);
    });

    it('adds no page heading, main, banner or navigation landmark', () => {
      const { container } = render(<NewsletterSection />);

      expect(container.querySelectorAll('h1')).toHaveLength(0);
      expect(container.querySelectorAll('main')).toHaveLength(0);
      expect(container.querySelectorAll('header')).toHaveLength(0);
      expect(container.querySelectorAll('nav')).toHaveLength(0);
    });

    it('renders nothing when route policy hides it', () => {
      const { container } = render(<NewsletterSection visible={false} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('initial state', () => {
    it('exposes no Newsletter status', () => {
      render(<NewsletterSection />);

      expect(newsletterStatuses()).toHaveLength(0);
      expect(document.querySelectorAll('[role="status"]')).toHaveLength(0);
    });

    it('is not busy and the submit control is enabled', () => {
      render(<NewsletterSection />);

      expect(newsletterForm().getAttribute('aria-busy')).toBeNull();
      expect(submitButton()).toBeEnabled();
      expect(submitButton()).toHaveTextContent(NEWSLETTER_SUBMIT_LABEL);
    });

    it('performs no eager validation before the first submit', async () => {
      render(<NewsletterSection />);

      await typeEmail('broken');
      await blurEmail();

      expect(screen.queryByText(NEWSLETTER_INVALID_ERROR)).not.toBeInTheDocument();
      expect(emailField().getAttribute('aria-invalid')).toBeNull();
    });
  });

  describe('invalid submission', () => {
    it('reports the empty error, associates it and focuses the field', async () => {
      render(<NewsletterSection />);

      await submit();

      const field = emailField();
      const error = screen.getByText(NEWSLETTER_EMPTY_ERROR);

      expect(field).toHaveFocus();
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(field.getAttribute('aria-describedby')).toContain(error.id);
      expect(newsletterStatuses()).toHaveLength(0);
    });

    it('reports the format error and preserves the entered value', async () => {
      render(<NewsletterSection />);

      await typeEmail('broken');
      await submit();

      expect(screen.getByText(NEWSLETTER_INVALID_ERROR)).toBeInTheDocument();
      expect(emailField().value).toBe('broken');
      expect(emailField()).toHaveFocus();
      expect(newsletterStatuses()).toHaveLength(0);
    });

    it('rejects a whitespace-only value as empty', async () => {
      render(<NewsletterSection />);

      await typeEmail('   ');
      await submit();

      expect(screen.getByText(NEWSLETTER_EMPTY_ERROR)).toBeInTheDocument();
    });

    it('does not enter the pending lifecycle', async () => {
      render(<NewsletterSection />);

      await submit();
      await completePending();

      expect(newsletterForm().getAttribute('aria-busy')).toBeNull();
      expect(newsletterStatuses()).toHaveLength(0);
      expect(storedConsent()).toBeNull();
    });
  });

  describe('post-error revalidation', () => {
    it('revalidates on change and keeps a deterministic error for another invalid value', async () => {
      render(<NewsletterSection />);

      await submit();
      expect(screen.getByText(NEWSLETTER_EMPTY_ERROR)).toBeInTheDocument();

      await typeEmail('broken');

      expect(screen.queryByText(NEWSLETTER_EMPTY_ERROR)).not.toBeInTheDocument();
      expect(screen.getByText(NEWSLETTER_INVALID_ERROR)).toBeInTheDocument();
      expect(emailField().getAttribute('aria-invalid')).toBe('true');
    });

    it('clears the error on change once the value becomes valid', async () => {
      render(<NewsletterSection />);

      await typeEmail('broken');
      await submit();
      expect(screen.getByText(NEWSLETTER_INVALID_ERROR)).toBeInTheDocument();

      await typeEmail(VALID_EMAIL);

      expect(screen.queryByText(NEWSLETTER_INVALID_ERROR)).not.toBeInTheDocument();
      expect(emailField().getAttribute('aria-invalid')).toBeNull();
      expect(submitButton()).toBeEnabled();
    });

    it('revalidates on blur while the field is in an error state', async () => {
      render(<NewsletterSection />);

      await submit();
      expect(screen.getByText(NEWSLETTER_EMPTY_ERROR)).toBeInTheDocument();

      await blurEmail();

      expect(screen.getByText(NEWSLETTER_EMPTY_ERROR)).toBeInTheDocument();
      expect(emailField().getAttribute('aria-invalid')).toBe('true');
    });

    it('accepts the revalidated value without requiring a second failed submit', async () => {
      render(<NewsletterSection />);

      await submit();
      await typeEmail(VALID_EMAIL);
      await submit();
      await completePending();

      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });
  });

  describe('valid submission lifecycle', () => {
    it('enters pending immediately with one owned announced status', async () => {
      render(<NewsletterSection />);

      await typeEmail(VALID_EMAIL);
      await submit();

      expect(newsletterForm().getAttribute('aria-busy')).toBe('true');
      expect(submitButton()).toBeDisabled();
      expect(submitButton()).toHaveTextContent(NEWSLETTER_SUBMIT_PENDING_LABEL);

      const statuses = newsletterStatuses();
      expect(statuses).toHaveLength(1);
      expect(statuses[0]?.getAttribute('role')).toBe('status');
      expect(statuses[0]).toHaveTextContent(NEWSLETTER_PENDING_STATUS);
      expect(vi.getTimerCount(), 'the test ends while a completion is still scheduled').toBe(1);
    });

    it('does not persist consent during the pending phase', async () => {
      render(<NewsletterSection />);

      await typeEmail(VALID_EMAIL);
      await submit();

      expect(storedConsent()).toBeNull();
      expect(vi.getTimerCount(), 'the test ends while a completion is still scheduled').toBe(1);
    });

    it('resolves to the canonical success message in the same status owner', async () => {
      render(<NewsletterSection />);

      await typeEmail(VALID_EMAIL);
      await submit();

      const pendingStatus = newsletterStatuses()[0];
      await completePending();

      const statuses = newsletterStatuses();
      expect(statuses).toHaveLength(1);
      expect(statuses[0]).toBe(pendingStatus);
      expect(statuses[0]?.getAttribute('role')).toBe('status');
      expect(statuses[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
      expect(newsletterForm().getAttribute('aria-busy')).toBeNull();
    });

    it('persists the versioned envelope only after success', async () => {
      render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);

      expect(storedConsent()).toEqual({
        version: 1,
        state: 'subscribed',
        email: VALID_EMAIL,
      });
    });

    it('normalizes the submitted value into the visible field and persisted payload', async () => {
      render(<NewsletterSection />);

      await subscribe(`   ${VALID_EMAIL}   `);

      expect(emailField().value).toBe(VALID_EMAIL);
      expect(storedConsent()).toEqual({
        version: 1,
        state: 'subscribed',
        email: VALID_EMAIL,
      });
    });

    it('keeps focus stable across the success transition', async () => {
      render(<NewsletterSection />);

      const field = emailField();
      field.focus();
      await typeEmail(VALID_EMAIL);
      await submitForm();
      await completePending();

      expect(document.activeElement).toBe(field);
    });

    it('blocks resubmission of the unchanged subscribed value', async () => {
      render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);

      expect(submitButton()).toBeDisabled();

      await submitForm();
      await completePending();

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });

    it('schedules only one completion for synchronous duplicate submits', async () => {
      render(<NewsletterSection />);

      await typeEmail(VALID_EMAIL);

      const form = newsletterForm();
      await act(async () => {
        form.requestSubmit();
        form.requestSubmit();
        form.requestSubmit();
      });

      expect(vi.getTimerCount(), 'exactly one completion is scheduled').toBe(1);
      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_PENDING_STATUS);

      await completePending();

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });
  });

  describe('restored subscription', () => {
    it('restores the subscribed state and normalized email from session storage', () => {
      seedValidConsent(VALID_EMAIL);

      render(<NewsletterSection />);

      expect(emailField().value).toBe(VALID_EMAIL);
      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
      expect(submitButton()).toBeDisabled();
    });

    it('replays no pending phase', async () => {
      seedValidConsent(VALID_EMAIL);

      render(<NewsletterSection />);

      expect(newsletterForm().getAttribute('aria-busy')).toBeNull();
      expect(newsletterStatuses()[0]).not.toHaveTextContent(NEWSLETTER_PENDING_STATUS);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);

      await completePending();

      expect(newsletterForm().getAttribute('aria-busy')).toBeNull();
      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });

    it('does not steal focus on restoration', () => {
      seedValidConsent(VALID_EMAIL);

      render(<NewsletterSection />);

      expect(document.activeElement).toBe(document.body);
      expect(emailField()).not.toHaveFocus();
    });

    it('renders the restored success statically rather than as a live announcement', () => {
      seedValidConsent(VALID_EMAIL);

      render(<NewsletterSection />);

      const status = newsletterStatuses()[0];

      expect(status?.getAttribute('role')).toBeNull();
      expect(status?.getAttribute('data-newsletter-announced')).toBe('false');
      expect(document.querySelectorAll('[role="status"]')).toHaveLength(0);
      expect(document.querySelectorAll('[aria-live]')).toHaveLength(0);
    });

    it('announces a new in-session success even after restoration', async () => {
      seedValidConsent(VALID_EMAIL);

      render(<NewsletterSection />);

      await subscribe(SECOND_EMAIL);

      const status = newsletterStatuses()[0];
      expect(status?.getAttribute('role')).toBe('status');
      expect(status?.getAttribute('data-newsletter-announced')).toBe('true');
    });

    it.each([
      ['malformed JSON', 'not-json{'],
      [
        'unsupported version',
        JSON.stringify({ version: 2, state: 'subscribed', email: VALID_EMAIL }),
      ],
      ['invalid email', JSON.stringify({ version: 1, state: 'subscribed', email: 'broken' })],
    ])('falls back to the initial state for %s and clears the key', (_label, raw) => {
      seedConsent(raw);

      expect(() => render(<NewsletterSection />)).not.toThrow();

      expect(emailField().value).toBe('');
      expect(newsletterStatuses()).toHaveLength(0);
      expect(window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY)).toBeNull();
    });
  });

  describe('edit-driven re-entry', () => {
    it('clears the result, removes persisted consent and re-enables submit', async () => {
      render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);
      expect(storedConsent()).not.toBeNull();

      await typeEmail(SECOND_EMAIL);

      expect(newsletterStatuses()).toHaveLength(0);
      expect(submitButton()).toBeEnabled();
      expect(emailField().value).toBe(SECOND_EMAIL);
      expect(storedConsent()).toBeNull();
    });

    it('does not persist the edited draft before a new success', async () => {
      render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);
      await typeEmail('partial@');

      expect(storedConsent()).toBeNull();
    });

    it('replaces the persisted email on a second successful subscription', async () => {
      render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);
      await subscribe(SECOND_EMAIL);

      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
      expect(storedConsent()).toEqual({
        version: 1,
        state: 'subscribed',
        email: SECOND_EMAIL,
      });
    });

    it('removes restored consent when the restored email is edited', async () => {
      seedValidConsent(VALID_EMAIL);

      render(<NewsletterSection />);

      await typeEmail(SECOND_EMAIL);

      expect(newsletterStatuses()).toHaveLength(0);
      expect(window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY)).toBeNull();
    });

    it('does not announce a reset message when the result clears', async () => {
      render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);
      await typeEmail(`${VALID_EMAIL}x`);

      expect(document.querySelectorAll('[role="status"]')).toHaveLength(0);
      expect(document.querySelectorAll('[aria-live]')).toHaveLength(0);
    });
  });

  describe('boundaries', () => {
    it('cancels the pending timer on unmount without leaking a completion', async () => {
      const { unmount } = render(<NewsletterSection />);

      await typeEmail(VALID_EMAIL);
      await submit();

      expect(vi.getTimerCount(), 'a completion is scheduled while pending').toBe(1);

      unmount();

      expect(vi.getTimerCount(), 'unmount cancels the scheduled completion').toBe(0);
      expect(() => {
        vi.advanceTimersByTime(NEWSLETTER_SUBMIT_DELAY_MS * 2);
      }).not.toThrow();
    });

    it('keeps its state while route policy hides it', async () => {
      const { rerender } = render(<NewsletterSection visible />);

      await subscribe(VALID_EMAIL);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);

      rerender(<NewsletterSection visible={false} />);
      expect(newsletterStatuses()).toHaveLength(0);

      rerender(<NewsletterSection visible />);

      expect(emailField().value).toBe(VALID_EMAIL);
      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });

    it('keeps the in-memory lifecycle usable when storage writes fail', async () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });

      render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
      expect(emailField().value).toBe(VALID_EMAIL);
    });

    it('mounts safely when storage reads fail', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied');
      });

      expect(() => render(<NewsletterSection />)).not.toThrow();
      expect(emailField().value).toBe('');
      expect(newsletterStatuses()).toHaveLength(0);
    });

    it('uses no local persistence and issues no network request', async () => {
      const localSetItem = vi.spyOn(Storage.prototype, 'setItem');
      const fetchSpy = vi.fn();
      vi.stubGlobal('fetch', fetchSpy);

      render(<NewsletterSection />);
      await subscribe(VALID_EMAIL);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(document.cookie).toBe('');
      expect(localSetItem).toHaveBeenCalled();
      expect(window.localStorage.length).toBe(0);

      vi.unstubAllGlobals();
    });

    it('renders no dialog, toast or duplicate live region', async () => {
      const { container } = render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);

      expect(container.querySelectorAll('dialog')).toHaveLength(0);
      expect(container.querySelectorAll('[role="dialog"]')).toHaveLength(0);
      expect(container.querySelectorAll('[role="alert"]')).toHaveLength(0);
      expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
      expect(container.querySelectorAll('[role="status"]')).toHaveLength(1);
    });

    it('places the email field before the submit control in DOM order', () => {
      const { container } = render(<NewsletterSection />);

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>('input, button:not([disabled])')
      );

      expect(focusables.indexOf(emailField())).toBe(0);
      expect(focusables.indexOf(submitButton())).toBe(1);
    });

    it('keeps the status out of the focus order', async () => {
      render(<NewsletterSection />);

      await subscribe(VALID_EMAIL);

      expect(newsletterStatuses()[0]?.getAttribute('tabindex')).toBeNull();
    });
  });
});

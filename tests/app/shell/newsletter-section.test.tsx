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

function typeEmail(value: string): void {
  fireEvent.change(emailField(), { target: { value } });
}

function submit(): void {
  fireEvent.click(submitButton());
}

function completePending(): void {
  act(() => {
    vi.advanceTimersByTime(NEWSLETTER_SUBMIT_DELAY_MS);
  });
}

function subscribe(value: string): void {
  typeEmail(value);
  submit();
  completePending();
}

describe('NewsletterSection', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
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
  });

  describe('invalid submission', () => {
    it('reports the empty error, associates it and focuses the field', () => {
      render(<NewsletterSection />);

      submit();

      const field = emailField();
      const error = screen.getByText(NEWSLETTER_EMPTY_ERROR);

      expect(field).toHaveFocus();
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(field.getAttribute('aria-describedby')).toContain(error.id);
      expect(newsletterStatuses()).toHaveLength(0);
    });

    it('reports the format error and preserves the entered value', () => {
      render(<NewsletterSection />);

      typeEmail('broken');
      submit();

      expect(screen.getByText(NEWSLETTER_INVALID_ERROR)).toBeInTheDocument();
      expect(emailField().value).toBe('broken');
      expect(emailField()).toHaveFocus();
      expect(newsletterStatuses()).toHaveLength(0);
    });

    it('rejects a whitespace-only value as empty', () => {
      render(<NewsletterSection />);

      typeEmail('   ');
      submit();

      expect(screen.getByText(NEWSLETTER_EMPTY_ERROR)).toBeInTheDocument();
    });

    it('does not enter the pending lifecycle', () => {
      render(<NewsletterSection />);

      submit();
      completePending();

      expect(newsletterForm().getAttribute('aria-busy')).toBeNull();
      expect(newsletterStatuses()).toHaveLength(0);
    });

    it('clears the error when the field is edited', () => {
      render(<NewsletterSection />);

      submit();
      expect(screen.getByText(NEWSLETTER_EMPTY_ERROR)).toBeInTheDocument();

      typeEmail('r');

      expect(screen.queryByText(NEWSLETTER_EMPTY_ERROR)).not.toBeInTheDocument();
      expect(emailField().getAttribute('aria-invalid')).toBeNull();
    });
  });

  describe('valid submission lifecycle', () => {
    it('enters pending immediately with one owned status', () => {
      render(<NewsletterSection />);

      typeEmail(VALID_EMAIL);
      submit();

      expect(newsletterForm().getAttribute('aria-busy')).toBe('true');
      expect(submitButton()).toBeDisabled();
      expect(submitButton()).toHaveTextContent(NEWSLETTER_SUBMIT_PENDING_LABEL);

      const statuses = newsletterStatuses();
      expect(statuses).toHaveLength(1);
      expect(statuses[0]?.getAttribute('role')).toBe('status');
      expect(statuses[0]).toHaveTextContent(NEWSLETTER_PENDING_STATUS);
    });

    it('resolves to the canonical success message in the same status owner', () => {
      render(<NewsletterSection />);

      typeEmail(VALID_EMAIL);
      submit();

      const pendingStatus = newsletterStatuses()[0];
      completePending();

      const statuses = newsletterStatuses();
      expect(statuses).toHaveLength(1);
      expect(statuses[0]).toBe(pendingStatus);
      expect(statuses[0]?.getAttribute('role')).toBe('status');
      expect(statuses[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
      expect(newsletterForm().getAttribute('aria-busy')).toBeNull();
    });

    it('trims the submitted value', () => {
      render(<NewsletterSection />);

      subscribe(`  ${VALID_EMAIL}  `);

      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });

    it('keeps the submitted value visible and does not move focus', () => {
      render(<NewsletterSection />);

      const field = emailField();
      field.focus();
      typeEmail(VALID_EMAIL);
      fireEvent.submit(newsletterForm());
      completePending();

      expect(emailField().value).toBe(VALID_EMAIL);
      expect(document.activeElement).toBe(field);
    });

    it('blocks resubmission of the unchanged subscribed value', () => {
      render(<NewsletterSection />);

      subscribe(VALID_EMAIL);

      expect(submitButton()).toBeDisabled();

      fireEvent.submit(newsletterForm());
      completePending();

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });

    it('schedules only one completion for synchronous duplicate submits', () => {
      render(<NewsletterSection />);

      typeEmail(VALID_EMAIL);

      const form = newsletterForm();
      act(() => {
        form.requestSubmit();
        form.requestSubmit();
        form.requestSubmit();
      });

      expect(vi.getTimerCount(), 'exactly one completion is scheduled').toBe(1);
      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_PENDING_STATUS);

      completePending();

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);

      completePending();

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });

    it('schedules only one completion for rapid duplicate activation', () => {
      render(<NewsletterSection />);

      typeEmail(VALID_EMAIL);
      submit();
      fireEvent.submit(newsletterForm());
      fireEvent.submit(newsletterForm());

      expect(vi.getTimerCount(), 'exactly one completion is scheduled').toBe(1);
      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_PENDING_STATUS);

      completePending();

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);

      completePending();

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });
  });

  describe('edit-driven re-entry', () => {
    it('clears the result and re-enables submit when the email changes', () => {
      render(<NewsletterSection />);

      subscribe(VALID_EMAIL);
      typeEmail(SECOND_EMAIL);

      expect(newsletterStatuses()).toHaveLength(0);
      expect(submitButton()).toBeEnabled();
      expect(emailField().value).toBe(SECOND_EMAIL);
    });

    it('completes a second deterministic lifecycle', () => {
      render(<NewsletterSection />);

      subscribe(VALID_EMAIL);
      typeEmail(SECOND_EMAIL);
      submit();

      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_PENDING_STATUS);

      completePending();

      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });

    it('does not announce a reset message when the result clears', () => {
      render(<NewsletterSection />);

      subscribe(VALID_EMAIL);
      typeEmail(`${VALID_EMAIL}x`);

      expect(document.querySelectorAll('[role="status"]')).toHaveLength(0);
      expect(document.querySelectorAll('[aria-live]')).toHaveLength(0);
    });
  });

  describe('boundaries', () => {
    it('clears a pending timer safely on unmount', () => {
      const { unmount } = render(<NewsletterSection />);

      typeEmail(VALID_EMAIL);
      submit();

      expect(() => {
        unmount();
        vi.advanceTimersByTime(NEWSLETTER_SUBMIT_DELAY_MS * 2);
      }).not.toThrow();
    });

    it('keeps its state while route policy hides it', () => {
      const { rerender } = render(<NewsletterSection visible />);

      subscribe(VALID_EMAIL);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);

      rerender(<NewsletterSection visible={false} />);
      expect(newsletterStatuses()).toHaveLength(0);

      rerender(<NewsletterSection visible />);

      expect(emailField().value).toBe(VALID_EMAIL);
      expect(newsletterStatuses()).toHaveLength(1);
      expect(newsletterStatuses()[0]).toHaveTextContent(NEWSLETTER_SUCCESS_STATUS);
    });

    it('uses no browser persistence and issues no network request', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const fetchSpy = vi.fn();
      vi.stubGlobal('fetch', fetchSpy);

      render(<NewsletterSection />);
      subscribe(VALID_EMAIL);

      expect(setItemSpy).not.toHaveBeenCalled();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(document.cookie).toBe('');

      setItemSpy.mockRestore();
      vi.unstubAllGlobals();
    });

    it('renders no dialog, toast or duplicate live region', () => {
      const { container } = render(<NewsletterSection />);

      subscribe(VALID_EMAIL);

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

    it('keeps the status out of the focus order', () => {
      render(<NewsletterSection />);

      subscribe(VALID_EMAIL);

      expect(newsletterStatuses()[0]?.getAttribute('tabindex')).toBeNull();
    });
  });
});

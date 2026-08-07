import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { NEWSLETTER_STORAGE_KEY } from '@/app/shell/newsletter/newsletter-session-storage';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createApplicationRoutes } from '@/app/composition/application-routes';
import {
  NEWSLETTER_EMAIL_LABEL,
  NEWSLETTER_HEADING,
  NEWSLETTER_SUCCESS_STATUS,
} from '@/app/shell/newsletter/newsletter-content';

const VALID_EMAIL = 'reader@goodcall.test';
const TRANSITION_TIMEOUT = 3000;

function renderApplicationAt(path: string) {
  const router = createMemoryRouter(createApplicationRoutes(), { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

function newsletterSections(): HTMLElement[] {
  return screen.queryAllByRole('region', { name: NEWSLETTER_HEADING });
}

function emailField(): HTMLInputElement {
  return screen.getByRole('textbox', { name: new RegExp(NEWSLETTER_EMAIL_LABEL) });
}

async function waitForHeading(): Promise<HTMLElement> {
  return waitFor(() => screen.getByRole('heading', { level: 1 }));
}

async function subscribeOnHome(): Promise<void> {
  await act(async () => {
    fireEvent.change(emailField(), { target: { value: VALID_EMAIL } });
  });
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Подписаться' }));
  });

  await screen.findByText(NEWSLETTER_SUCCESS_STATUS, undefined, { timeout: TRANSITION_TIMEOUT });
}

const NEWSLETTER_VISIBLE_ROUTES: ReadonlyArray<readonly [string, string]> = [
  ['/', 'GoodCall Shared UI verification'],
  ['/catalog/laptops', 'Category'],
  ['/products/demo-product', 'Product'],
  ['/cart', 'Cart'],
  ['/comparison', 'Сравнение товаров'],
  ['/favorites', 'Избранное'],
  ['/auth', 'Вход и регистрация'],
  ['/help', 'Помощь'],
];

describe('Newsletter runtime mount', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  describe('root composition', () => {
    it('places the Header, then route main, then the Newsletter section', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      const header = screen.getByRole('banner');
      const main = document.querySelector('main#main-content') as HTMLElement;
      const [newsletter] = newsletterSections();

      expect(newsletter).toBeDefined();
      expect(header.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(
        main.compareDocumentPosition(newsletter as HTMLElement) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('keeps the Newsletter outside the route main', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      const [newsletter] = newsletterSections();

      expect(newsletter?.closest('main')).toBeNull();
      expect(newsletter?.closest('header')).toBeNull();
      expect(newsletter?.closest('nav')).toBeNull();
    });

    it('adds no second main or page heading', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
      expect(document.querySelectorAll('main')).toHaveLength(1);
      expect(document.querySelectorAll('h1')).toHaveLength(1);
      expect(screen.getAllByRole('banner')).toHaveLength(1);
    });

    it('keeps the skip link targeting the route main', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      const skipLink = document.querySelector('a[href="#main-content"]');

      expect(skipLink).not.toBeNull();
      expect(document.querySelector('main#main-content')).not.toBeNull();
    });

    it('keeps the Newsletter outside the single Footer landmark', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      expect(document.querySelectorAll('footer')).toHaveLength(1);
      expect(screen.queryAllByRole('contentinfo')).toHaveLength(1);
      expect(newsletterSections()[0]?.closest('footer')).toBeNull();
    });
  });

  describe('route visibility policy', () => {
    it.each(NEWSLETTER_VISIBLE_ROUTES)('shows the Newsletter at %s', async (path, heading) => {
      renderApplicationAt(path);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
      });

      expect(newsletterSections()).toHaveLength(1);
    });

    it.each(['/unknown-path', '/catalog', '/help/unknown', '/deep/unknown/path'])(
      'hides the Newsletter on the catch-all at %s',
      async (path) => {
        renderApplicationAt(path);

        await waitFor(() => {
          expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
        });

        expect(newsletterSections()).toHaveLength(0);
        expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
      }
    );

    it.each(['/?source=footer', '/#newsletter', '/comparison?source=header', '/favorites#saved'])(
      'keeps visibility unchanged for query and hash at %s',
      async (path) => {
        renderApplicationAt(path);
        await waitForHeading();

        expect(newsletterSections()).toHaveLength(1);
      }
    );
  });

  describe('state continuity within one SPA mount', () => {
    it('preserves the subscribed state across client-side navigation', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();
      await subscribeOnHome();

      await router.navigate('/comparison');
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Сравнение товаров');
      });

      expect(screen.getByText(NEWSLETTER_SUCCESS_STATUS)).toBeInTheDocument();
      expect(emailField().value).toBe(VALID_EMAIL);

      await router.navigate('/help');
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Помощь');
      });

      expect(screen.getByText(NEWSLETTER_SUCCESS_STATUS)).toBeInTheDocument();
    });

    it('hides but does not destroy the state on the catch-all', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();
      await subscribeOnHome();

      await router.navigate('/unknown-path');
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
      });

      expect(newsletterSections()).toHaveLength(0);
      expect(screen.queryByText(NEWSLETTER_SUCCESS_STATUS)).not.toBeInTheDocument();

      await router.navigate('/');
      await waitFor(() => {
        expect(newsletterSections()).toHaveLength(1);
      });

      expect(screen.getByText(NEWSLETTER_SUCCESS_STATUS)).toBeInTheDocument();
      expect(emailField().value).toBe(VALID_EMAIL);
    });

    it('restores the subscription on a fresh mount that keeps the browser session', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();
      await subscribeOnHome();

      expect(screen.getByText(NEWSLETTER_SUCCESS_STATUS)).toBeInTheDocument();
      expect(window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY)).not.toBeNull();

      router.dispose();
      document.body.innerHTML = '';

      renderApplicationAt('/');
      await waitForHeading();

      expect(screen.getByText(NEWSLETTER_SUCCESS_STATUS)).toBeInTheDocument();
      expect(emailField().value).toBe(VALID_EMAIL);
    });

    it('starts initial on a fresh mount after the browser session is cleared', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();
      await subscribeOnHome();

      router.dispose();
      document.body.innerHTML = '';
      window.sessionStorage.clear();

      renderApplicationAt('/');
      await waitForHeading();

      expect(screen.queryByText(NEWSLETTER_SUCCESS_STATUS)).not.toBeInTheDocument();
      expect(emailField().value).toBe('');
    });

    it.each([
      ['malformed JSON', 'not-json{'],
      [
        'unsupported version',
        JSON.stringify({ version: 2, state: 'subscribed', email: VALID_EMAIL }),
      ],
      ['invalid email', JSON.stringify({ version: 1, state: 'subscribed', email: 'broken' })],
    ])('boots safely with %s persisted and clears only its own key', async (_label, raw) => {
      window.sessionStorage.setItem('goodcall.unrelated', 'keep-me');
      window.sessionStorage.setItem(NEWSLETTER_STORAGE_KEY, raw);

      renderApplicationAt('/');
      await waitForHeading();

      expect(newsletterSections()).toHaveLength(1);
      expect(emailField().value).toBe('');
      expect(screen.queryByText(NEWSLETTER_SUCCESS_STATUS)).not.toBeInTheDocument();
      expect(window.sessionStorage.getItem(NEWSLETTER_STORAGE_KEY)).toBeNull();
      expect(window.sessionStorage.getItem('goodcall.unrelated')).toBe('keep-me');
      expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    });
  });

  describe('route lifecycle preservation', () => {
    it('keeps the route heading focus and title lifecycle unchanged', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();

      await router.navigate('/comparison');

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Сравнение товаров');
        expect(document.activeElement).toBe(heading);
      });

      expect(document.title).toBe('Сравнение товаров — GoodCall');
      expect(document.querySelectorAll('#route-announcement')).toHaveLength(1);
    });

    it('keeps the route announcement free of Newsletter copy', async () => {
      renderApplicationAt('/');
      await waitForHeading();
      await subscribeOnHome();

      const announcement = document.querySelector('#route-announcement');

      expect(announcement?.textContent ?? '').not.toContain(NEWSLETTER_SUCCESS_STATUS);
      expect(announcement?.textContent ?? '').not.toContain(NEWSLETTER_HEADING);
    });
  });
});

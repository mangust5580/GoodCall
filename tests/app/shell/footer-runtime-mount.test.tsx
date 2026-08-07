import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within, fireEvent, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createApplicationRoutes } from '@/app/composition/application-routes';
import { company } from '@/app/content/company';
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

function footer(): HTMLElement {
  return screen.getByRole('contentinfo');
}

function newsletterSections(): HTMLElement[] {
  return screen.queryAllByRole('region', { name: NEWSLETTER_HEADING });
}

async function waitForHeading(): Promise<HTMLElement> {
  return waitFor(() => screen.getByRole('heading', { level: 1 }));
}

describe('Footer runtime mount', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  describe('root composition', () => {
    it('orders route main, then Newsletter, then Footer', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      const main = document.querySelector('main#main-content') as HTMLElement;
      const [newsletter] = newsletterSections();

      expect(newsletter).toBeDefined();
      expect(
        main.compareDocumentPosition(newsletter as HTMLElement) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(
        (newsletter as HTMLElement).compareDocumentPosition(footer()) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('keeps exactly one main, one contentinfo, one banner and one route heading', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
      expect(document.querySelectorAll('main')).toHaveLength(1);
      expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
      expect(screen.getAllByRole('banner')).toHaveLength(1);
      expect(document.querySelectorAll('h1')).toHaveLength(1);
    });

    it('keeps the Footer outside main and outside the banner', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      expect(footer().closest('main')).toBeNull();
      expect(footer().closest('header')).toBeNull();
    });

    it('keeps the skip link targeting the route main', async () => {
      renderApplicationAt('/');
      await waitForHeading();

      expect(document.querySelector('a[href="#main-content"]')).not.toBeNull();
      expect(document.querySelector('main#main-content')).not.toBeNull();
    });
  });

  describe('catch-all', () => {
    it.each(['/unknown-path', '/catalog', '/help/unknown'])(
      'renders the Footer without the Newsletter at %s',
      async (path) => {
        renderApplicationAt(path);

        await waitFor(() => {
          expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
        });

        expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
        expect(newsletterSections()).toHaveLength(0);
        expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
      }
    );

    it('keeps Footer navigation, legal links and contacts reachable on the catch-all', async () => {
      renderApplicationAt('/unknown-path');

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
      });

      const scope = within(footer());

      expect(scope.getAllByRole('navigation')).toHaveLength(4);
      expect(scope.getByRole('link', { name: 'Публичная оферта' })).toBeInTheDocument();
      expect(scope.getByRole('link', { name: company.supportPhone })).toBeInTheDocument();
      expect(scope.getByText(company.headOffice)).toBeInTheDocument();
    });
  });

  describe('client navigation', () => {
    it('keeps the Footer mounted across route changes', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();

      const before = footer();

      await router.navigate('/about');
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('О компании');
      });

      expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
      expect(footer()).toBe(before);
    });

    it('marks the active Footer link current after navigation', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();

      await router.navigate('/about');
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('О компании');
      });

      expect(within(footer()).getByRole('link', { name: 'О компании' })).toHaveAttribute(
        'aria-current',
        'page'
      );
    });

    it('preserves the route focus, title and announcement lifecycle', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();

      await router.navigate('/about');

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('О компании');
        expect(document.activeElement).toBe(heading);
      });

      expect(document.title).toBe('О компании — GoodCall');
      expect(document.querySelectorAll('#route-announcement')).toHaveLength(1);
      expect(document.querySelectorAll('[aria-live]')).toHaveLength(1);
    });
  });

  describe('newsletter isolation', () => {
    it('leaves the Newsletter subscription state untouched by the Footer', async () => {
      const router = renderApplicationAt('/');
      await waitForHeading();

      await act(async () => {
        fireEvent.change(
          screen.getByRole('textbox', { name: new RegExp(NEWSLETTER_EMAIL_LABEL) }),
          { target: { value: VALID_EMAIL } }
        );
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Подписаться' }));
      });

      await screen.findByText(NEWSLETTER_SUCCESS_STATUS, undefined, {
        timeout: TRANSITION_TIMEOUT,
      });

      await router.navigate('/about');
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('О компании');
      });

      expect(screen.getByText(NEWSLETTER_SUCCESS_STATUS)).toBeInTheDocument();
      expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
    });
  });
});

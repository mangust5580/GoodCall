import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createApplicationRoutes } from '@/app/composition/application-routes';
import { BRAND_HOME_LINK_LABEL } from '@/app/shell/brand';
import { INFORMATION_BAR_NAV_LABEL } from '@/app/shell/information-bar/information-bar-items';

function renderApplicationAt(path: string) {
  const router = createMemoryRouter(createApplicationRoutes(), { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

function serviceNav(): HTMLElement {
  return screen.getByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL });
}

function brandLink(): HTMLElement {
  return within(screen.getByRole('banner')).getByRole('link', { name: BRAND_HOME_LINK_LABEL });
}

const MOUNTED_ROUTES: ReadonlyArray<readonly [string, string, string]> = [
  ['/', 'GoodCall Shared UI verification', 'GoodCall'],
  ['/contacts', 'Контакты', 'Контакты — GoodCall'],
];

describe('Information Bar runtime mount', () => {
  beforeEach(() => {
    document.title = '';
  });

  it.each(MOUNTED_ROUTES)('%s exposes one shell of each landmark', async (path, heading) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    });

    expect(screen.getAllByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL })).toHaveLength(1);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(
      within(screen.getByRole('banner')).getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })
    ).toHaveLength(1);
    expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it.each(MOUNTED_ROUTES)('%s keeps the route title unchanged', async (path, _heading, title) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(document.title).toBe(title);
    });
  });

  it('places the Information Bar before the banner in DOM order', async () => {
    renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const nav = serviceNav();
    const banner = screen.getByRole('banner');

    expect(nav.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(nav.closest('main')).toBeNull();
    expect(nav.closest('header')).toBeNull();
  });

  it('keeps the skip link before Information Bar focusables and the brand link after them', async () => {
    renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const skipLink = document.querySelector('a[href="#main-content"]');
    expect(skipLink).not.toBeNull();

    const focusables = Array.from(
      document.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );

    const skipIndex = focusables.indexOf(skipLink as HTMLElement);
    const disclosureIndex = focusables.indexOf(
      within(serviceNav()).getByRole('button') as HTMLElement
    );
    const firstServiceLinkIndex = focusables.indexOf(
      within(serviceNav()).getAllByRole('link')[0] as HTMLElement
    );
    const brandIndex = focusables.indexOf(brandLink());

    expect(skipIndex).toBe(0);
    expect(disclosureIndex).toBeGreaterThan(skipIndex);
    expect(firstServiceLinkIndex).toBeGreaterThan(disclosureIndex);
    expect(brandIndex).toBeGreaterThan(firstServiceLinkIndex);
  });

  it('adds no duplicate announcement owner', async () => {
    renderApplicationAt('/contacts');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Контакты');
    });

    expect(document.querySelectorAll('#route-announcement')).toHaveLength(1);
    expect(document.querySelectorAll('[aria-live]')).toHaveLength(1);
    expect(serviceNav().querySelectorAll('[aria-live]')).toHaveLength(0);
  });

  it('navigates to a service carrier and focuses its heading through the M1 lifecycle', async () => {
    const router = renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'GoodCall Shared UI verification'
      );
    });

    await router.navigate('/delivery-and-payment');

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Доставка и оплата');
      expect(document.activeElement).toBe(heading);
    });

    expect(document.title).toBe('Доставка и оплата — GoodCall');
    expect(within(serviceNav()).getByRole('link', { name: 'Доставка и оплата' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('keeps one main and one h1 after service navigation', async () => {
    const router = renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    await router.navigate('/loyalty');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Программа лояльности');
    });

    expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getAllByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL })).toHaveLength(1);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
  });
});

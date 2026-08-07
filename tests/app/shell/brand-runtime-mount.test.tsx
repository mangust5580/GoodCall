import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createApplicationRoutes } from '@/app/composition/application-routes';
import { BRAND_HOME_LINK_LABEL } from '@/app/shell/brand';

function renderApplicationAt(path: string) {
  const router = createMemoryRouter(createApplicationRoutes(), { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

function brandLink(): HTMLElement {
  return within(screen.getByRole('banner')).getByRole('link', { name: BRAND_HOME_LINK_LABEL });
}

function footerBrandLink(): HTMLElement {
  return within(screen.getByRole('contentinfo')).getByRole('link', {
    name: BRAND_HOME_LINK_LABEL,
  });
}

function expectOneBrandLinkPerShellLandmark(): void {
  expect(
    within(screen.getByRole('banner')).getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })
  ).toHaveLength(1);
  expect(
    within(screen.getByRole('contentinfo')).getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })
  ).toHaveLength(1);
  expect(screen.getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })).toHaveLength(2);
}

const MOUNTED_ROUTES: ReadonlyArray<readonly [string, string, string]> = [
  ['/', 'GoodCall Shared UI verification', 'GoodCall'],
  ['/search', 'Поиск', 'Поиск — GoodCall'],
];

describe('Runtime brand mount', () => {
  beforeEach(() => {
    document.title = '';
  });

  it.each(MOUNTED_ROUTES)('%s renders exactly one brand Home link', async (path, heading) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    });

    expectOneBrandLinkPerShellLandmark();
    expect(brandLink()).toHaveAttribute('href', '/');
    expect(footerBrandLink()).toHaveAttribute('href', '/');
  });

  it.each(MOUNTED_ROUTES)('%s keeps one main and one h1', async (path, heading) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    });

    expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it.each(MOUNTED_ROUTES)('%s keeps the route title unchanged', async (path, _heading, title) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(document.title).toBe(title);
    });
  });

  it.each(MOUNTED_ROUTES)('%s keeps the brand link outside main', async (path, heading) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    });

    const main = document.querySelector('main#main-content');
    expect(main?.contains(brandLink())).toBe(false);
    expect(main?.contains(footerBrandLink())).toBe(false);
  });

  it('places the skip link before the brand link in DOM and focus order', async () => {
    renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const skipLink = document.querySelector('a[href="#main-content"]');
    expect(skipLink).not.toBeNull();

    const focusable = Array.from(document.querySelectorAll('a[href], button:not([disabled])'));
    expect(focusable.indexOf(skipLink as Element)).toBe(0);
    expect(focusable.indexOf(brandLink())).toBeGreaterThan(0);
    expect(
      (skipLink as Element).compareDocumentPosition(brandLink()) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it.each(MOUNTED_ROUTES)('%s contains the brand link in one banner landmark', async (path) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    expect(screen.getAllByRole('banner')).toHaveLength(1);

    const banner = screen.getByRole('banner');
    expect(banner.tagName.toLowerCase()).toBe('header');
    expect(banner.getAttribute('role')).toBeNull();
    expect(banner.getAttribute('aria-label')).toBeNull();
    expect(banner.contains(brandLink())).toBe(true);
    expect(within(banner).getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })).toHaveLength(1);
  });

  it.each(MOUNTED_ROUTES)('%s keeps the banner outside main and unnested', async (path) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const banner = screen.getByRole('banner');
    expect(banner.closest('main')).toBeNull();
    expect(banner.parentElement?.closest('header')).toBeNull();
    expect(document.querySelectorAll('header')).toHaveLength(1);
    expect(document.querySelector('main#main-content')?.querySelector('header')).toBeNull();
  });

  it('keeps the brand link out of any navigation landmark and adds no live region', async () => {
    renderApplicationAt('/search');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Поиск');
    });

    const banner = screen.getByRole('banner');

    expect(brandLink().closest('nav')).toBeNull();
    expect(footerBrandLink().closest('nav')).toBeNull();
    expect(within(banner).getAllByRole('navigation')).toHaveLength(2);
    expect(within(banner).getAllByRole('navigation', { name: 'Основная навигация' })).toHaveLength(
      1
    );
    expect(
      within(banner).getAllByRole('navigation', { name: 'Пользовательская навигация' })
    ).toHaveLength(1);
    expect(banner.querySelectorAll('[aria-live]')).toHaveLength(0);
    expect(document.querySelectorAll('#route-announcement')).toHaveLength(1);
    expect(document.querySelectorAll('[aria-live]')).toHaveLength(1);
  });

  it('navigates back to Home from a carrier route', async () => {
    const router = renderApplicationAt('/search');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Поиск');
    });

    await router.navigate('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'GoodCall Shared UI verification'
      );
    });

    expectOneBrandLinkPerShellLandmark();
  });

  it('does not duplicate the carrier Home link accessible name', async () => {
    renderApplicationAt('/search');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Поиск');
    });

    expect(screen.getAllByRole('link', { name: 'На главную' })).toHaveLength(1);
    expectOneBrandLinkPerShellLandmark();
  });
});

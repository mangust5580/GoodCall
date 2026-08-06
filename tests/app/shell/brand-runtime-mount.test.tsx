import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createApplicationRoutes } from '@/app/composition/application-routes';
import { BRAND_HOME_LINK_LABEL } from '@/app/shell/brand';

function renderApplicationAt(path: string) {
  const router = createMemoryRouter(createApplicationRoutes(), { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

function brandLink(): HTMLElement {
  return screen.getByRole('link', { name: BRAND_HOME_LINK_LABEL });
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

    expect(screen.getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })).toHaveLength(1);
    expect(brandLink()).toHaveAttribute('href', '/');
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
  });

  it('places the skip link before the brand link in DOM and focus order', async () => {
    renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const skipLink = document.querySelector('a[href="#main-content"]');
    expect(skipLink).not.toBeNull();

    const focusable = Array.from(document.querySelectorAll('a[href]'));
    expect(focusable.indexOf(skipLink as Element)).toBe(0);
    expect(focusable.indexOf(brandLink())).toBe(1);
    expect(
      (skipLink as Element).compareDocumentPosition(brandLink()) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('adds no landmark and no live region around the brand slot', async () => {
    renderApplicationAt('/search');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Поиск');
    });

    const slot = brandLink().parentElement;
    expect(slot?.tagName.toLowerCase()).toBe('div');
    expect(slot?.getAttribute('role')).toBeNull();
    expect(slot?.closest('header')).toBeNull();
    expect(slot?.closest('nav')).toBeNull();
    expect(slot?.closest('main')).toBeNull();
    expect(document.querySelectorAll('#route-announcement')).toHaveLength(1);
    expect(slot?.querySelectorAll('[aria-live]')).toHaveLength(0);
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

    expect(screen.getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })).toHaveLength(1);
  });

  it('does not duplicate the carrier Home link accessible name', async () => {
    renderApplicationAt('/search');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Поиск');
    });

    expect(screen.getAllByRole('link', { name: 'На главную' })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })).toHaveLength(1);
  });
});

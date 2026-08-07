import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createApplicationRoutes } from '@/app/composition/application-routes';
import { BRAND_HOME_LINK_LABEL } from '@/app/shell/brand';
import { INFORMATION_BAR_NAV_LABEL } from '@/app/shell/information-bar/information-bar-items';

function renderApplicationAt(path: string) {
  const router = createMemoryRouter(createApplicationRoutes(), { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

function banner(): HTMLElement {
  return screen.getByRole('banner');
}

function primaryNav(): HTMLElement {
  return screen.getByRole('navigation', { name: 'Основная навигация' });
}

function searchLandmark(): HTMLElement {
  return screen.getByRole('search', { name: 'Поиск по каталогу' });
}

function searchField(): HTMLInputElement {
  return screen.getByRole('searchbox', { name: 'Поиск по каталогу' });
}

const USER_NAV_LABEL = 'Пользовательская навигация';
const ACTION_LABELS = ['Сравнение', 'Избранное', 'Корзина', 'Войти'];

const MOUNTED_ROUTES: ReadonlyArray<readonly [string, string, string]> = [
  ['/', 'GoodCall Shared UI verification', 'GoodCall'],
  ['/search', 'Поиск', 'Поиск — GoodCall'],
  ['/catalog/laptops', 'Category', 'Category — GoodCall'],
];

describe('Site Header runtime mount', () => {
  beforeEach(() => {
    document.title = '';
  });

  it.each(MOUNTED_ROUTES)('%s exposes one of each shell landmark', async (path, heading) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    });

    expect(screen.getAllByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL })).toHaveLength(1);
    expect(screen.getAllByRole('navigation', { name: 'Основная навигация' })).toHaveLength(1);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getAllByRole('search', { name: 'Поиск по каталогу' })).toHaveLength(1);
    expect(within(banner()).getAllByRole('link', { name: BRAND_HOME_LINK_LABEL })).toHaveLength(1);
    expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it.each(MOUNTED_ROUTES)('%s keeps the route title unchanged', async (path, _heading, title) => {
    renderApplicationAt(path);

    await waitFor(() => {
      expect(document.title).toBe(title);
    });
  });

  it('orders Information Bar, then Header, then route main', async () => {
    renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const serviceNav = screen.getByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL });
    const header = banner();
    const main = document.querySelector('main#main-content') as HTMLElement;

    expect(
      serviceNav.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(header.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(serviceNav.closest('header')).toBeNull();
  });

  it('contains the brand link, Catalog and Search inside the banner', async () => {
    renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const header = banner();
    expect(header.contains(within(header).getByRole('link', { name: BRAND_HOME_LINK_LABEL }))).toBe(
      true
    );
    expect(header.contains(within(primaryNav()).getByRole('link', { name: 'Каталог' }))).toBe(true);
    expect(header.contains(searchLandmark())).toBe(true);
  });

  it('removes the transitional brand-slot wrapper', async () => {
    const { container } = render(
      <RouterProvider
        router={createMemoryRouter(createApplicationRoutes(), { initialEntries: ['/'] })}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    expect(container.querySelector('[class*="brand-slot"]')).toBeNull();
    expect(document.querySelectorAll('header')).toHaveLength(1);
  });

  it('keeps the skip link first and Information Bar controls before Header controls', async () => {
    renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const skipLink = document.querySelector('a[href="#main-content"]') as HTMLElement;
    const focusables = Array.from(
      document.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input')
    );

    const serviceNav = screen.getByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL });
    const disclosureIndex = focusables.indexOf(within(serviceNav).getByRole('button'));
    const brandIndex = focusables.indexOf(
      within(banner()).getByRole('link', { name: BRAND_HOME_LINK_LABEL })
    );
    const catalogIndex = focusables.indexOf(screen.getByRole('link', { name: 'Каталог' }));
    const fieldIndex = focusables.indexOf(searchField());
    const submitIndex = focusables.indexOf(screen.getByRole('button', { name: 'Найти' }));

    expect(focusables.indexOf(skipLink)).toBe(0);
    expect(disclosureIndex).toBeGreaterThan(0);
    expect(brandIndex).toBeGreaterThan(disclosureIndex);
    expect(catalogIndex).toBe(brandIndex + 1);
    expect(fieldIndex).toBe(catalogIndex + 1);
    expect(submitIndex).toBe(fieldIndex + 1);

    const userNav = screen.getByRole('navigation', { name: USER_NAV_LABEL });
    const actionIndexes = ACTION_LABELS.map((label) =>
      focusables.indexOf(within(userNav).getByRole('link', { name: label }))
    );

    expect(actionIndexes).toEqual([
      submitIndex + 1,
      submitIndex + 2,
      submitIndex + 3,
      submitIndex + 4,
    ]);
  });

  it.each([
    ['/comparison', 'Сравнение', 'Сравнение товаров'],
    ['/favorites', 'Избранное', 'Избранное'],
    ['/cart', 'Корзина', 'Cart'],
    ['/auth', 'Войти', 'Вход и регистрация'],
  ])('navigates from Home to %s and focuses its heading', async (route, label, heading) => {
    const router = renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    await router.navigate(route);

    await waitFor(() => {
      const routeHeading = screen.getByRole('heading', { level: 1 });
      expect(routeHeading).toHaveTextContent(heading);
      expect(document.activeElement).toBe(routeHeading);
    });

    expect(router.state.location.pathname).toBe(route);
    expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getAllByRole('banner')).toHaveLength(1);

    const userNav = screen.getByRole('navigation', { name: USER_NAV_LABEL });
    expect(within(userNav).getByRole('link', { name: label })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(
      within(userNav)
        .getAllByRole('link')
        .filter((link) => link.hasAttribute('aria-current'))
    ).toHaveLength(1);
  });

  it.each(['/comparison', '/favorites', '/cart', '/auth'])(
    'composes %s directly for a hard refresh',
    async (route) => {
      renderApplicationAt(route);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      expect(screen.getAllByRole('banner')).toHaveLength(1);
      expect(screen.getAllByRole('navigation', { name: USER_NAV_LABEL })).toHaveLength(1);
      expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    }
  );

  it.each(['/', '/catalog/laptops', '/search', '/help'])(
    'marks no user action current at %s',
    async (route) => {
      renderApplicationAt(route);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      const userNav = screen.getByRole('navigation', { name: USER_NAV_LABEL });
      expect(
        within(userNav)
          .getAllByRole('link')
          .filter((link) => link.hasAttribute('aria-current'))
      ).toHaveLength(0);
    }
  );

  it('navigates to the representative category and focuses its heading', async () => {
    const router = renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    await router.navigate('/catalog/laptops');

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Category');
      expect(document.activeElement).toBe(heading);
    });

    expect(screen.getByText('Category: laptops')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps /catalog on the global catch-all', async () => {
    renderApplicationAt('/catalog');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    });

    expect(screen.getByRole('link', { name: 'Каталог' })).not.toHaveAttribute('aria-current');
  });

  it('submits a search from Home and focuses the Search carrier heading', async () => {
    const user = userEvent.setup();
    const router = renderApplicationAt('/');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    await user.type(searchField(), 'ноутбук');
    await user.click(screen.getByRole('button', { name: 'Найти' }));

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Поиск');
      expect(document.activeElement).toBe(heading);
    });

    expect(router.state.location.pathname).toBe('/search');
    expect(new URLSearchParams(router.state.location.search).get('q')).toBe('ноутбук');
    expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
  });

  it('does not refocus the heading or duplicate announcements on query-only search', async () => {
    const user = userEvent.setup();
    const router = renderApplicationAt('/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA');

    await waitFor(() => {
      expect(searchField()).toHaveValue('ноутбук');
    });

    const heading = screen.getByRole('heading', { level: 1 });
    (document.activeElement as HTMLElement | null)?.blur();

    await user.clear(searchField());
    await user.type(searchField(), 'телефон');
    await user.click(screen.getByRole('button', { name: 'Найти' }));

    await waitFor(() => {
      expect(new URLSearchParams(router.state.location.search).get('q')).toBe('телефон');
    });

    expect(router.state.location.pathname).toBe('/search');
    expect(document.activeElement).not.toBe(heading);
    expect(document.querySelectorAll('#route-announcement')).toHaveLength(1);
    expect(document.querySelectorAll('[aria-live]')).toHaveLength(1);
  });
});

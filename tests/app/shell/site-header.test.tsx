import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SiteHeader } from '@/app/shell/site-header';
import { BRAND_HOME_LINK_LABEL } from '@/app/shell/brand';

function renderHeader(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SiteHeader />
    </MemoryRouter>
  );
}

function banner(): HTMLElement {
  return screen.getByRole('banner');
}

function primaryNav(): HTMLElement {
  return screen.getByRole('navigation', { name: 'Основная навигация' });
}

function catalogLink(): HTMLElement {
  return screen.getByRole('link', { name: 'Каталог' });
}

describe('SiteHeader', () => {
  describe('landmarks', () => {
    it('renders one semantic banner', () => {
      renderHeader();

      expect(screen.getAllByRole('banner')).toHaveLength(1);
      expect(banner().tagName.toLowerCase()).toBe('header');
    });

    it('renders one primary navigation with the canonical name', () => {
      renderHeader();

      expect(screen.getAllByRole('navigation', { name: 'Основная навигация' })).toHaveLength(1);
      expect(banner().contains(primaryNav())).toBe(true);
    });

    it('renders one named search landmark inside the banner', () => {
      renderHeader();

      const forms = screen.getAllByRole('search', { name: 'Поиск по каталогу' });
      expect(forms).toHaveLength(1);
      expect(banner().contains(forms[0] as HTMLElement)).toBe(true);
    });

    it('adds no live region', () => {
      const { container } = renderHeader();

      expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
    });
  });

  describe('brand integration', () => {
    it('renders exactly one brand Home link inside the banner', () => {
      renderHeader();

      const brand = screen.getAllByRole('link', { name: BRAND_HOME_LINK_LABEL });
      expect(brand).toHaveLength(1);
      expect(banner().contains(brand[0] as HTMLElement)).toBe(true);
      expect(brand[0]).toHaveAttribute('href', '/');
    });

    it('keeps the brand visual decorative', () => {
      const { container } = renderHeader();

      expect(container.querySelector('[data-brand-asset]')).not.toBeNull();
      expect(container.querySelector('img')).toHaveAttribute('alt', '');
    });
  });

  describe('catalog entry', () => {
    it('renders a link, not a button or disclosure', () => {
      renderHeader();

      const link = catalogLink();
      expect(link.tagName.toLowerCase()).toBe('a');
      expect(link).toHaveAttribute('href', '/catalog/laptops');
      expect(link.getAttribute('role')).toBeNull();
      expect(link.getAttribute('aria-haspopup')).toBeNull();
      expect(link.getAttribute('aria-expanded')).toBeNull();
      expect(link.getAttribute('aria-disabled')).toBeNull();
      expect(within(primaryNav()).queryAllByRole('button')).toHaveLength(0);
    });

    it('is current only on its exact destination', () => {
      renderHeader('/catalog/laptops');

      expect(catalogLink()).toHaveAttribute('aria-current', 'page');
    });

    it('is not current on another category path', () => {
      renderHeader('/catalog/phones');

      expect(catalogLink()).not.toHaveAttribute('aria-current');
    });

    it('is not current on a deeper path below the destination', () => {
      renderHeader('/catalog/laptops/extra');

      expect(catalogLink()).not.toHaveAttribute('aria-current');
    });

    it('is not current on unrelated routes', () => {
      renderHeader('/');

      expect(catalogLink()).not.toHaveAttribute('aria-current');
    });

    it('signals the current state beyond colour alone', () => {
      renderHeader('/catalog/laptops');

      expect(catalogLink().className).toContain('catalog-current');
    });
  });

  describe('canonical order', () => {
    it('places brand, then Catalog, then Search in DOM order', () => {
      const { container } = renderHeader();

      const brand = screen.getByRole('link', { name: BRAND_HOME_LINK_LABEL });
      const catalog = catalogLink();
      const search = screen.getByRole('search', { name: 'Поиск по каталогу' });

      const order = Array.from(container.querySelectorAll('a, form'));
      expect(order.indexOf(brand)).toBeLessThan(order.indexOf(catalog));
      expect(order.indexOf(catalog)).toBeLessThan(order.indexOf(search));
    });

    it('places brand, Catalog, Search field and submit in focus order', () => {
      const { container } = renderHeader();

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>('a[href], input, button:not([disabled])')
      );

      const brandIndex = focusables.indexOf(
        screen.getByRole('link', { name: BRAND_HOME_LINK_LABEL })
      );
      const catalogIndex = focusables.indexOf(catalogLink());
      const fieldIndex = focusables.indexOf(
        screen.getByRole('searchbox', { name: 'Поиск по каталогу' })
      );
      const submitIndex = focusables.indexOf(screen.getByRole('button', { name: 'Найти' }));

      expect(brandIndex).toBe(0);
      expect(catalogIndex).toBe(1);
      expect(fieldIndex).toBe(2);
      expect(submitIndex).toBe(3);
    });
  });

  describe('deferred M4-05 actions', () => {
    it.each(['Сравнение', 'Избранное', 'Корзина', 'Войти', 'Аккаунт'])(
      'does not render the %s action',
      (label) => {
        renderHeader();

        expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: label })).not.toBeInTheDocument();
      }
    );

    it('renders no empty placeholder control', () => {
      const { container } = renderHeader();

      const interactive = Array.from(container.querySelectorAll<HTMLElement>('a[href], button'));

      expect(interactive).toHaveLength(3);
      for (const element of interactive) {
        const hasName =
          (element.textContent ?? '').trim().length > 0 || element.hasAttribute('aria-label');
        expect(hasName, `${element.tagName} has an accessible name`).toBe(true);
      }
    });
  });
});

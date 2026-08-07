import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SiteHeader } from '@/app/shell/site-header';
import { BRAND_HOME_LINK_LABEL } from '@/app/shell/brand';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const headerStylesheet = fs.readFileSync(
  path.join(repoRoot, 'src', 'app', 'shell', 'site-header', 'SiteHeader.module.scss'),
  'utf-8'
);

const COMPACT_RESTORE_QUERY = '@media (width >= 48rem)';
const restoreIndex = headerStylesheet.indexOf(COMPACT_RESTORE_QUERY);
const compactStylesheet = restoreIndex < 0 ? '' : headerStylesheet.slice(0, restoreIndex);
const restoredStylesheet = restoreIndex < 0 ? '' : headerStylesheet.slice(restoreIndex);

function ruleBlock(source: string, selector: string): string {
  const opening = `${selector} {`;
  const start = source.indexOf(opening);

  if (start < 0) {
    return '';
  }

  const end = source.indexOf('}', start);
  return end < 0 ? source.slice(start) : source.slice(start, end);
}

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

const USER_NAV_LABEL = 'Пользовательская навигация';
const ACTION_LABELS = ['Сравнение', 'Избранное', 'Корзина', 'Войти'];

function userNav(): HTMLElement {
  return screen.getByRole('navigation', { name: USER_NAV_LABEL });
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

    it('passes a Header-owned class to the brand link', () => {
      renderHeader();

      const brand = screen.getByRole('link', { name: BRAND_HOME_LINK_LABEL });

      expect(brand.className).toContain('brand-link');
      expect(brand.className).toContain('brand-home-link');
      expect(brand.className).toContain('horizontal');
    });

    it('keeps the horizontal lockup rather than the symbol lockup', () => {
      renderHeader();

      const brand = screen.getByRole('link', { name: BRAND_HOME_LINK_LABEL });

      expect(brand.className).not.toContain('symbol');
    });
  });

  describe('compact identity style contract', () => {
    it('locates the 48rem restoration range', () => {
      expect(restoreIndex).toBeGreaterThanOrEqual(0);
    });

    it('owns the compact brand width from the Header stylesheet', () => {
      expect(compactStylesheet).toMatch(
        /\.identity\s+\.brand-link\s+\[data-brand-asset\]\s*\{[^}]*inline-size:\s*120px/
      );
    });

    it('restores the wider brand width at 48rem', () => {
      expect(restoredStylesheet).toMatch(
        /\.identity\s+\.brand-link\s+\[data-brand-asset\]\s*\{[^}]*inline-size:\s*180px/
      );
    });

    it('never declares a brand width below the approved minimum', () => {
      const widths = Array.from(headerStylesheet.matchAll(/(?<![-\w])inline-size:\s*(\d+)px/g)).map(
        (match) => Number(match[1])
      );

      expect(widths.length).toBeGreaterThan(0);
      for (const width of widths) {
        expect(width).toBeGreaterThanOrEqual(120);
      }
    });

    it('keeps the compact identity row from wrapping', () => {
      expect(ruleBlock(compactStylesheet, '.identity')).toContain('flex-wrap: nowrap');
      expect(ruleBlock(compactStylesheet, '.identity')).not.toContain('flex-wrap: wrap');
    });

    it('keeps the brand link and Catalog from shrinking below their content', () => {
      expect(ruleBlock(compactStylesheet, '.brand-link')).toContain('flex: 0 0 auto');
      expect(ruleBlock(compactStylesheet, '.primary-nav')).toContain('flex: 0 0 auto');
    });

    it('keeps Search on the second compact row and shares one row at 48rem', () => {
      expect(ruleBlock(compactStylesheet, '.search-slot')).toContain('flex: 1 1 100%');
      expect(restoredStylesheet).toContain('flex: 1 1 20rem');
    });

    it('composes the correction without absolute positioning or visual reordering', () => {
      expect(headerStylesheet).not.toMatch(/position:\s*absolute/);
      expect(headerStylesheet).not.toMatch(/^\s*order:/m);
    });

    it('keeps the Catalog target at or above 44px', () => {
      const catalogRule = ruleBlock(headerStylesheet, '.catalog');

      expect(catalogRule).toContain('min-inline-size: 44px');
      expect(catalogRule).toContain('min-block-size: 44px');
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
    it('places brand, then Catalog, then Search, then the actions in DOM order', () => {
      const { container } = renderHeader();

      const brand = screen.getByRole('link', { name: BRAND_HOME_LINK_LABEL });
      const catalog = catalogLink();
      const search = screen.getByRole('search', { name: 'Поиск по каталогу' });
      const userNav = screen.getByRole('navigation', { name: USER_NAV_LABEL });

      const order = Array.from(container.querySelectorAll('a, form, nav'));
      expect(order.indexOf(brand)).toBeLessThan(order.indexOf(catalog));
      expect(order.indexOf(catalog)).toBeLessThan(order.indexOf(search));
      expect(order.indexOf(search)).toBeLessThan(order.indexOf(userNav));
    });

    it('places brand, Catalog, Search and the four actions in focus order', () => {
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

      const actionIndexes = ACTION_LABELS.map((label) =>
        focusables.indexOf(within(userNav()).getByRole('link', { name: label }))
      );

      expect(actionIndexes).toEqual([4, 5, 6, 7]);
    });
  });

  describe('M4-05 user actions', () => {
    it('renders one user navigation landmark', () => {
      renderHeader();

      expect(screen.getAllByRole('navigation', { name: USER_NAV_LABEL })).toHaveLength(1);
      expect(banner().contains(userNav())).toBe(true);
    });

    it.each(ACTION_LABELS)('renders exactly one %s link', (label) => {
      renderHeader();

      expect(within(userNav()).getAllByRole('link', { name: label })).toHaveLength(1);
    });

    it('renders no action as a button', () => {
      renderHeader();

      expect(within(userNav()).queryAllByRole('button')).toHaveLength(0);
    });

    it('renders every Header control with an accessible name', () => {
      const { container } = renderHeader();

      const interactive = Array.from(container.querySelectorAll<HTMLElement>('a[href], button'));

      expect(interactive).toHaveLength(7);
      for (const element of interactive) {
        const hasName =
          (element.textContent ?? '').trim().length > 0 || element.hasAttribute('aria-label');
        expect(hasName, `${element.tagName} has an accessible name`).toBe(true);
      }
    });

    it('does not retrofit the Catalog or Search controls with an icon', () => {
      const { container } = renderHeader();

      const catalog = catalogLink();
      const search = screen.getByRole('search', { name: 'Поиск по каталогу' });

      expect(catalog.querySelector('[data-shell-icon]')).toBeNull();
      expect(search.querySelector('[data-shell-icon]')).toBeNull();
      expect(container.querySelectorAll('[data-shell-icon]')).toHaveLength(4);
    });

    it('renders no counter, badge or account avatar', () => {
      const { container } = renderHeader();

      expect(within(userNav()).getByRole('link', { name: 'Войти' })).toBeInTheDocument();
      expect(userNav().textContent).toBe(ACTION_LABELS.join(''));
      expect(container.querySelector('[class*="counter"]')).toBeNull();
      expect(container.querySelector('[class*="badge"]')).toBeNull();
    });

    it('adds no live region alongside the actions', () => {
      const { container } = renderHeader();

      expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
    });
  });
});

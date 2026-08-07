import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HeaderActions } from '@/app/shell/site-header/HeaderActions';
import { headerActions } from '@/app/shell/site-header/header-actions-config';

const USER_NAV_LABEL = 'Пользовательская навигация';
const ACTION_LABELS = ['Сравнение', 'Избранное', 'Корзина', 'Войти'];

function renderActions(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <HeaderActions />
    </MemoryRouter>
  );
}

function userNav(): HTMLElement {
  return screen.getByRole('navigation', { name: USER_NAV_LABEL });
}

function actionLinks(): HTMLElement[] {
  return within(userNav()).getAllByRole('link');
}

describe('HeaderActions', () => {
  describe('landmark and inventory', () => {
    it('renders one navigation with the canonical user navigation name', () => {
      renderActions();

      expect(screen.getAllByRole('navigation', { name: USER_NAV_LABEL })).toHaveLength(1);
      expect(userNav().tagName.toLowerCase()).toBe('nav');
    });

    it('renders exactly four links', () => {
      renderActions();

      expect(actionLinks()).toHaveLength(4);
    });

    it('places the actions in canonical DOM order', () => {
      renderActions();

      expect(actionLinks().map((link) => link.getAttribute('aria-label'))).toEqual(ACTION_LABELS);
    });

    it('exposes the exact accessible name for each action', () => {
      renderActions();

      for (const label of ACTION_LABELS) {
        expect(within(userNav()).getAllByRole('link', { name: label })).toHaveLength(1);
      }
    });

    it('points each action at its exact destination', () => {
      renderActions();

      const destinations = actionLinks().map((link) => link.getAttribute('href'));

      expect(destinations).toEqual(['/comparison', '/favorites', '/cart', '/auth']);
    });
  });

  describe('icon consumption', () => {
    it('marks every icon decorative', () => {
      const { container } = renderActions();
      const icons = Array.from(container.querySelectorAll('[data-shell-icon]'));

      expect(icons).toHaveLength(4);
      for (const icon of icons) {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
        expect((icon.textContent ?? '').trim()).toBe('');
      }
    });

    it('points each icon custom property at the expected production asset', () => {
      const { container } = renderActions();

      for (const action of headerActions) {
        const icon = container.querySelector<HTMLElement>(`[data-shell-icon="${action.id}"]`);

        expect(icon, `${action.id} icon`).not.toBeNull();
        expect(icon?.style.getPropertyValue('--gc-header-action-icon')).toBe(
          `url("${action.iconUrl}")`
        );
      }
    });

    it('inlines no SVG path geometry', () => {
      const { container } = renderActions();

      expect(container.querySelector('svg')).toBeNull();
      expect(container.querySelector('path')).toBeNull();
      expect(container.querySelector('img')).toBeNull();
    });

    it('hides the visible label from the accessibility tree', () => {
      renderActions();

      for (const link of actionLinks()) {
        const label = Array.from(link.querySelectorAll('span')).find(
          (span) => (span.textContent ?? '').trim().length > 0
        );

        expect(label, 'visible label span').toBeDefined();
        expect(label?.getAttribute('aria-hidden')).toBe('true');
        expect(label?.textContent).toBe(link.getAttribute('aria-label'));
      }
    });
  });

  describe('semantics', () => {
    it('uses links rather than buttons', () => {
      renderActions();

      expect(within(userNav()).queryAllByRole('button')).toHaveLength(0);

      for (const link of actionLinks()) {
        expect(link.tagName.toLowerCase()).toBe('a');
        expect(link.getAttribute('role')).toBeNull();
        expect(link.getAttribute('aria-haspopup')).toBeNull();
        expect(link.getAttribute('aria-expanded')).toBeNull();
        expect(link.getAttribute('type')).toBeNull();
      }
    });

    it('adds no ARIA menu or toolbar semantics', () => {
      const { container } = renderActions();

      expect(container.querySelector('[role="menu"]')).toBeNull();
      expect(container.querySelector('[role="menubar"]')).toBeNull();
      expect(container.querySelector('[role="menuitem"]')).toBeNull();
      expect(container.querySelector('[role="toolbar"]')).toBeNull();
    });

    it('adds no live region', () => {
      const { container } = renderActions();

      expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
      expect(container.querySelectorAll('[role="status"]')).toHaveLength(0);
    });

    it('renders no counter, badge or notification dot', () => {
      const { container } = renderActions();

      for (const link of actionLinks()) {
        expect((link.textContent ?? '').trim()).toBe(link.getAttribute('aria-label'));
        expect(link.querySelector('[class*="counter"]')).toBeNull();
        expect(link.querySelector('[class*="badge"]')).toBeNull();
      }

      expect(container.textContent).not.toMatch(/\d/);
    });

    it('requires no tooltip for naming', () => {
      renderActions();

      for (const link of actionLinks()) {
        expect(link.getAttribute('title')).toBeNull();
      }
    });
  });

  describe('current route state', () => {
    it.each([
      ['/comparison', 'Сравнение'],
      ['/favorites', 'Избранное'],
      ['/cart', 'Корзина'],
      ['/auth', 'Войти'],
    ])('marks only the exact action current at %s', (route, label) => {
      renderActions(route);

      const current = within(userNav()).getAllByRole('link', { name: label });
      expect(current[0]).toHaveAttribute('aria-current', 'page');

      expect(
        within(userNav())
          .getAllByRole('link')
          .filter((link) => link.hasAttribute('aria-current'))
      ).toHaveLength(1);
    });

    it.each([
      ['/comparison?source=header', 'Сравнение'],
      ['/favorites#saved', 'Избранное'],
    ])('preserves the current state at %s', (route, label) => {
      renderActions(route);

      expect(within(userNav()).getAllByRole('link', { name: label })[0]).toHaveAttribute(
        'aria-current',
        'page'
      );
    });

    it.each(['/comparison-extra', '/cart/checkout', '/favorites/saved', '/catalog/laptops', '/'])(
      'marks no action current at %s',
      (route) => {
        renderActions(route);

        expect(
          within(userNav())
            .getAllByRole('link')
            .filter((link) => link.hasAttribute('aria-current'))
        ).toHaveLength(0);
      }
    );

    it('signals the current action beyond colour alone', () => {
      renderActions('/cart');

      const current = within(userNav()).getAllByRole('link', { name: 'Корзина' })[0];

      expect(current?.className).toContain('action-current');
    });
  });
});

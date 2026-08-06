import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { InformationBar } from '@/app/shell/information-bar';
import {
  INFORMATION_BAR_CITY,
  INFORMATION_BAR_DISCLOSURE_LABEL,
  INFORMATION_BAR_NAV_LABEL,
  serviceLinks,
} from '@/app/shell/information-bar/information-bar-items';

const CANONICAL_LABELS = [
  'Доставка и оплата',
  'Гарантия и возврат',
  'Программа лояльности',
  'Помощь',
  'Контакты',
];

function renderBar(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <InformationBar />
    </MemoryRouter>
  );
}

function serviceNav(): HTMLElement {
  return screen.getByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL });
}

function disclosure(): HTMLElement {
  return screen.getByRole('button', { name: INFORMATION_BAR_DISCLOSURE_LABEL });
}

describe('InformationBar', () => {
  describe('landmark and city context', () => {
    it('exposes exactly one navigation landmark with the canonical name', () => {
      renderBar();

      expect(screen.getAllByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL })).toHaveLength(
        1
      );
      expect(serviceNav().tagName.toLowerCase()).toBe('nav');
    });

    it('contains all information bar content inside the landmark', () => {
      const { container } = renderBar();

      const nav = serviceNav();
      expect(nav.contains(disclosure())).toBe(true);
      expect(within(nav).getByText(INFORMATION_BAR_CITY, { exact: false })).toBeInTheDocument();

      const root = container.firstElementChild;
      expect(root?.childElementCount).toBe(1);
      expect(root?.firstElementChild).toBe(nav);
    });

    it('shows the city as visible text', () => {
      renderBar();

      const city = within(serviceNav()).getByText(
        (_content, element) => element?.tagName.toLowerCase() === 'p'
      );
      expect(city).toHaveTextContent('Москва');
    });

    it('provides the programmatic city context without duplicating visible text', () => {
      renderBar();

      const city = within(serviceNav()).getByText(
        (_content, element) => element?.tagName.toLowerCase() === 'p'
      );

      expect(city.textContent).toBe('Текущий город: Москва');
      expect(city.textContent?.match(/Москва/g)).toHaveLength(1);
    });

    it('keeps the city non-interactive', () => {
      renderBar();

      const nav = serviceNav();
      const city = within(nav).getByText(
        (_content, element) => element?.tagName.toLowerCase() === 'p'
      );

      expect(city.tagName.toLowerCase()).toBe('p');
      expect(city.closest('button')).toBeNull();
      expect(city.closest('a')).toBeNull();
      expect(city.getAttribute('role')).toBeNull();
      expect(city.getAttribute('tabindex')).toBeNull();
      expect(within(nav).queryByRole('combobox')).not.toBeInTheDocument();
      expect(
        within(nav)
          .getAllByRole('button')
          .every((button) => button.textContent !== INFORMATION_BAR_CITY)
      ).toBe(true);
    });

    it('adds no live region and no ARIA menu semantics', () => {
      const { container } = renderBar();

      expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.queryByRole('menubar')).not.toBeInTheDocument();
      expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('disclosure', () => {
    it('renders one native button with the canonical label', () => {
      renderBar();

      const button = disclosure();
      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button).toHaveAttribute('type', 'button');
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('is closed initially and controls the link panel', () => {
      renderBar();

      const button = disclosure();
      expect(button).toHaveAttribute('aria-expanded', 'false');

      const panelId = button.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();

      const panel = document.getElementById(panelId ?? '');
      expect(panel).not.toBeNull();
      expect(panel?.tagName.toLowerCase()).toBe('ul');
      expect(panel?.getAttribute('data-expanded')).toBe('false');
    });

    it('opens and closes on pointer activation', async () => {
      const user = userEvent.setup();
      renderBar();

      await user.click(disclosure());
      expect(disclosure()).toHaveAttribute('aria-expanded', 'true');

      await user.click(disclosure());
      expect(disclosure()).toHaveAttribute('aria-expanded', 'false');
    });

    it.each(['{Enter}', ' '])('toggles with %s keyboard activation', async (key) => {
      const user = userEvent.setup();
      renderBar();

      disclosure().focus();
      await user.keyboard(key);
      expect(disclosure()).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard(key);
      expect(disclosure()).toHaveAttribute('aria-expanded', 'false');
    });

    it('leaves focus on the button when opening and closing', async () => {
      const user = userEvent.setup();
      renderBar();

      const button = disclosure();
      button.focus();

      await user.keyboard('{Enter}');
      expect(document.activeElement).toBe(disclosure());

      await user.keyboard('{Enter}');
      expect(document.activeElement).toBe(disclosure());
    });

    it('reflects the open state on the controlled panel', async () => {
      const user = userEvent.setup();
      renderBar();

      await user.click(disclosure());

      const panelId = disclosure().getAttribute('aria-controls') ?? '';
      expect(document.getElementById(panelId)?.getAttribute('data-expanded')).toBe('true');
    });
  });

  describe('service links', () => {
    it('renders the five canonical links exactly once in order', () => {
      renderBar();

      const links = within(serviceNav()).getAllByRole('link');
      expect(links).toHaveLength(5);
      expect(links.map((link) => link.textContent)).toEqual(CANONICAL_LABELS);
    });

    it('renders exactly one DOM instance of each destination', () => {
      const { container } = renderBar();

      for (const link of serviceLinks) {
        expect(container.querySelectorAll(`a[href="${link.path}"]`)).toHaveLength(1);
      }
    });

    it.each(serviceLinks.map((link) => [link.label, link.path] as const))(
      '%s targets %s',
      (label, expectedPath) => {
        renderBar();

        expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', expectedPath);
      }
    );

    it('marks the current service destination with aria-current', () => {
      renderBar('/help');

      const current = screen.getByRole('link', { name: 'Помощь' });
      expect(current).toHaveAttribute('aria-current', 'page');
      expect(current.textContent).toBe('Помощь');

      const marked = within(serviceNav())
        .getAllByRole('link')
        .filter((link) => link.getAttribute('aria-current') === 'page');
      expect(marked).toHaveLength(1);
    });

    it('signals the current destination beyond colour alone', () => {
      renderBar('/contacts');

      const current = screen.getByRole('link', { name: 'Контакты' });
      expect(current.className).toContain('link-current');
    });

    it('marks no service link as current on unrelated routes', () => {
      renderBar('/');

      const marked = within(serviceNav())
        .getAllByRole('link')
        .filter((link) => link.getAttribute('aria-current') === 'page');
      expect(marked).toHaveLength(0);
    });

    it('marks no service link as current on a carrier outside the service set', () => {
      renderBar('/search');

      const marked = within(serviceNav())
        .getAllByRole('link')
        .filter((link) => link.getAttribute('aria-current') === 'page');
      expect(marked).toHaveLength(0);
    });
  });
});

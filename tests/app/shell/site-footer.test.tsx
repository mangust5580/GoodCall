import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SiteFooter } from '@/app/shell/footer';
import { company } from '@/app/content/company';
import { footerGroups, footerLegalLinks } from '@/app/shell/footer/footer-navigation';
import { BRAND_HOME_LINK_LABEL } from '@/app/shell/brand';

const LEGAL_NAV_LABEL = 'Правовая информация';
const GROUP_TITLES = ['Покупателям', 'Компания', 'Помощь'];

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const footerDir = path.join(repoRoot, 'src', 'app', 'shell', 'footer');

const footerSource = ['SiteFooter.tsx', 'FooterLinkGroup.tsx', 'footer-content.ts']
  .map((name) => fs.readFileSync(path.join(footerDir, name), 'utf-8'))
  .join('\n');

const footerStyles = fs.readFileSync(path.join(footerDir, 'SiteFooter.module.scss'), 'utf-8');

function renderFooter(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SiteFooter />
    </MemoryRouter>
  );
}

function footer(): HTMLElement {
  return screen.getByRole('contentinfo');
}

function groupNav(title: string): HTMLElement {
  return within(footer()).getByRole('navigation', { name: title });
}

function disclosureFor(title: string): HTMLButtonElement {
  return within(footer()).getByRole('button', { name: `Показать раздел «${title}»` });
}

function openDisclosureFor(title: string): HTMLButtonElement {
  return within(footer()).getByRole('button', { name: `Скрыть раздел «${title}»` });
}

function panelFor(title: string): HTMLElement {
  const nav = groupNav(title);
  const list = nav.querySelector('ul');

  if (list === null) {
    throw new Error(`${title} panel is missing`);
  }

  return list;
}

describe('SiteFooter', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('landmark and structure', () => {
    it('renders exactly one contentinfo landmark', () => {
      renderFooter();

      expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
      expect(footer().tagName.toLowerCase()).toBe('footer');
    });

    it('adds no main and no page heading', () => {
      const { container } = renderFooter();

      expect(container.querySelectorAll('main')).toHaveLength(0);
      expect(container.querySelectorAll('h1')).toHaveLength(0);
      expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
      expect(container.querySelectorAll('[role="status"]')).toHaveLength(0);
    });

    it('places the five canonical blocks in canonical source order', () => {
      const { container } = renderFooter();

      const headings = Array.from(container.querySelectorAll<HTMLElement>('h2')).map(
        (heading) => heading.textContent
      );

      expect(headings.slice(0, 4)).toEqual([...GROUP_TITLES, 'Контакты']);

      const brand = screen.getByRole('link', { name: BRAND_HOME_LINK_LABEL });
      const firstGroupTitle = screen.getByText('Покупателям');

      expect(
        brand.compareDocumentPosition(firstGroupTitle) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });

  describe('brand block', () => {
    it('reuses the approved brand home link exactly once', () => {
      const { container } = renderFooter();

      const brand = within(footer()).getAllByRole('link', { name: BRAND_HOME_LINK_LABEL });

      expect(brand).toHaveLength(1);
      expect(brand[0]).toHaveAttribute('href', '/');
      expect(container.querySelectorAll('[data-brand-asset]')).toHaveLength(1);
      expect(container.querySelector('img')).toHaveAttribute('alt', '');
    });

    it('renders the exact COMPANY-001 descriptor', () => {
      renderFooter();

      expect(within(footer()).getByText(company.descriptor)).toBeInTheDocument();
    });

    it('adds no duplicate textual brand link beside the logo', () => {
      renderFooter();

      expect(within(footer()).queryAllByRole('link', { name: 'GoodCall' })).toHaveLength(0);
    });
  });

  describe('navigation groups', () => {
    it('renders three navigation landmarks with distinct names', () => {
      renderFooter();

      const navs = within(footer()).getAllByRole('navigation');

      expect(navs).toHaveLength(4);

      for (const title of GROUP_TITLES) {
        expect(within(footer()).getAllByRole('navigation', { name: title })).toHaveLength(1);
      }

      expect(within(footer()).getAllByRole('navigation', { name: LEGAL_NAV_LABEL })).toHaveLength(
        1
      );
    });

    it.each(footerGroups.map((group) => [group.title, group] as const))(
      'renders %s links once with the canonical destinations',
      (title, group) => {
        renderFooter();

        const links = within(groupNav(title)).getAllByRole('link');

        expect(links.map((link) => link.textContent)).toEqual(group.links.map((l) => l.label));
        expect(links.map((link) => link.getAttribute('href'))).toEqual(
          group.links.map((l) => l.path)
        );
      }
    );

    it('renders one DOM instance per navigation destination', () => {
      const { container } = renderFooter();

      const hrefs = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]')).map(
        (anchor) => anchor.getAttribute('href')
      );
      const routeHrefs = hrefs.filter((href) => href !== null && href.startsWith('/'));

      expect(new Set(routeHrefs).size).toBe(routeHrefs.length);
    });

    it('uses no ARIA menu semantics', () => {
      const { container } = renderFooter();

      for (const role of ['menu', 'menubar', 'menuitem', 'toolbar']) {
        expect(container.querySelectorAll(`[role="${role}"]`)).toHaveLength(0);
      }
    });
  });

  describe('contacts', () => {
    it('renders the exact COMPANY-001 operational content', () => {
      renderFooter();

      const scope = within(footer());

      expect(scope.getByRole('link', { name: company.supportPhone })).toHaveAttribute(
        'href',
        'tel:88001001010'
      );
      expect(scope.getByRole('link', { name: company.supportEmail })).toHaveAttribute(
        'href',
        'mailto:info@goodcall.ru'
      );
      expect(scope.getByText(company.supportHours)).toBeInTheDocument();
      expect(scope.getByText(company.headOffice)).toBeInTheDocument();
      expect(scope.getByText(company.officeHours)).toBeInTheDocument();
    });

    it('distinguishes support hours from office hours', () => {
      renderFooter();

      const scope = within(footer());

      expect(scope.getByText('Поддержка')).toBeInTheDocument();
      expect(scope.getByText('Часы работы офиса')).toBeInTheDocument();
      expect(company.supportHours).not.toBe(company.officeHours);
    });

    it('renders the head office as a complete address', () => {
      const { container } = renderFooter();

      const address = container.querySelector('address');

      expect(address).not.toBeNull();
      expect(address?.textContent).toBe(company.headOffice);
    });

    it('is not an additional navigation landmark', () => {
      renderFooter();

      expect(within(footer()).queryAllByRole('navigation', { name: 'Контакты' })).toHaveLength(0);
    });

    it('makes no 24/7 human-support claim', () => {
      renderFooter();

      expect(footer().textContent ?? '').not.toContain('24/7');
      expect(footer().textContent ?? '').not.toContain('круглосуточно');
    });
  });

  describe('social exclusions', () => {
    it('renders no social links, placeholders or empty heading', () => {
      const { container } = renderFooter();

      const text = footer().textContent ?? '';

      expect(text).not.toContain('Социальные сети');
      for (const forbidden of ['vk.com', 't.me', 'telegram', 'youtube', 'instagram', 'facebook']) {
        expect(text.toLowerCase()).not.toContain(forbidden);
      }

      expect(container.querySelectorAll('a[href^="http"]')).toHaveLength(0);
      expect(container.querySelectorAll('button:disabled')).toHaveLength(0);
    });

    it('renders no app-store content', () => {
      renderFooter();

      const text = (footer().textContent ?? '').toLowerCase();

      for (const forbidden of ['app store', 'google play', 'appstore', 'googleplay']) {
        expect(text).not.toContain(forbidden);
      }
    });
  });

  describe('utility row', () => {
    it('renders the exact demo payment indicators as non-interactive text', () => {
      renderFooter();

      const scope = within(footer());

      expect(scope.getByText('Демонстрационные способы оплаты')).toBeInTheDocument();
      expect(scope.getByText('Visa •••• 4242')).toBeInTheDocument();
      expect(scope.getByText('Mastercard •••• 8888')).toBeInTheDocument();

      expect(scope.queryByRole('link', { name: /Visa/ })).not.toBeInTheDocument();
      expect(scope.queryByRole('button', { name: /Visa/ })).not.toBeInTheDocument();
      expect(scope.queryByRole('link', { name: /Mastercard/ })).not.toBeInTheDocument();
    });

    it('exposes no card, expiry or checkout detail', () => {
      renderFooter();

      const text = footer().textContent ?? '';

      for (const forbidden of ['CVV', 'CVC', 'Основная', 'Срок действия', 'Оплатить']) {
        expect(text).not.toContain(forbidden);
      }
    });

    it('renders exactly the three canonical legal links', () => {
      renderFooter();

      const links = within(groupNav(LEGAL_NAV_LABEL)).getAllByRole('link');

      expect(links).toHaveLength(3);
      expect(links.map((link) => link.textContent)).toEqual([
        'Политика конфиденциальности',
        'Пользовательское соглашение',
        'Публичная оферта',
      ]);
      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        footerLegalLinks.map((link) => link.path)
      );
    });
  });

  describe('copyright year', () => {
    it('renders the canonical copyright with the runtime year', () => {
      renderFooter();

      const year = new Date().getFullYear();

      expect(
        within(footer()).getByText(`© ${String(year)} GoodCall. Все права защищены.`)
      ).toBeInTheDocument();
    });

    it('derives the year at runtime rather than hard-coding it', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2032-03-04T10:00:00Z'));

      renderFooter();

      expect(
        within(footer()).getByText('© 2032 GoodCall. Все права защищены.')
      ).toBeInTheDocument();
    });
  });

  describe('current route state', () => {
    it.each([
      ['/about', 'О компании'],
      ['/help', 'Помощь и ответы на вопросы'],
      ['/privacy-policy', 'Политика конфиденциальности'],
    ])('marks only the exact active link at %s', (route, label) => {
      renderFooter(route);

      const current = within(footer()).getByRole('link', { name: label });

      expect(current).toHaveAttribute('aria-current', 'page');
      expect(current.className).toContain('link-current');
      expect(current.textContent).toBe(label);

      expect(
        within(footer())
          .getAllByRole('link')
          .filter((link) => link.hasAttribute('aria-current'))
      ).toHaveLength(1);
    });

    it('marks no Footer link current on an unrelated route', () => {
      renderFooter('/');

      expect(
        within(footer())
          .getAllByRole('link')
          .filter((link) => link.hasAttribute('aria-current'))
      ).toHaveLength(0);
    });

    it('never marks contact or brand links current', () => {
      renderFooter('/about');

      expect(
        within(footer()).getByRole('link', { name: company.supportPhone })
      ).not.toHaveAttribute('aria-current');
      expect(
        within(footer()).getByRole('link', { name: BRAND_HOME_LINK_LABEL })
      ).not.toHaveAttribute('aria-current');
    });
  });

  describe('compact disclosures', () => {
    it.each(GROUP_TITLES)('starts %s closed with a related panel', (title) => {
      renderFooter();

      const button = disclosureFor(title);
      const panel = panelFor(title);

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('data-expanded')).toBe('false');
    });

    it.each(GROUP_TITLES)('toggles %s open and closed without moving focus', (title) => {
      renderFooter();

      const button = disclosureFor(title);
      button.focus();

      fireEvent.click(button);

      const opened = openDisclosureFor(title);
      expect(opened.getAttribute('aria-expanded')).toBe('true');
      expect(panelFor(title).getAttribute('data-expanded')).toBe('true');
      expect(document.activeElement).toBe(opened);

      fireEvent.click(opened);

      expect(disclosureFor(title).getAttribute('aria-expanded')).toBe('false');
      expect(panelFor(title).getAttribute('data-expanded')).toBe('false');
      expect(document.activeElement).toBe(disclosureFor(title));
    });

    it('keeps groups independent', () => {
      renderFooter();

      fireEvent.click(disclosureFor('Покупателям'));
      fireEvent.click(disclosureFor('Помощь'));

      expect(panelFor('Покупателям').getAttribute('data-expanded')).toBe('true');
      expect(panelFor('Помощь').getAttribute('data-expanded')).toBe('true');
      expect(panelFor('Компания').getAttribute('data-expanded')).toBe('false');

      fireEvent.click(openDisclosureFor('Покупателям'));

      expect(panelFor('Покупателям').getAttribute('data-expanded')).toBe('false');
      expect(panelFor('Помощь').getAttribute('data-expanded')).toBe('true');
    });

    it('keeps the group title visible regardless of disclosure state', () => {
      renderFooter();

      for (const title of GROUP_TITLES) {
        expect(within(footer()).getByText(title)).toBeInTheDocument();
      }
    });

    it('uses native buttons and keeps one link list per group', () => {
      renderFooter();

      for (const title of GROUP_TITLES) {
        const button = disclosureFor(title);
        expect(button.tagName.toLowerCase()).toBe('button');
        expect(button.getAttribute('type')).toBe('button');
        expect(groupNav(title).querySelectorAll('ul')).toHaveLength(1);
      }
    });

    it('adds no announcement when a disclosure toggles', () => {
      const { container } = renderFooter();

      fireEvent.click(disclosureFor('Компания'));

      expect(container.querySelectorAll('[aria-live]')).toHaveLength(0);
      expect(container.querySelectorAll('[role="status"]')).toHaveLength(0);
    });
  });

  describe('source contract', () => {
    it('uses no JavaScript viewport detection and no fixed year', () => {
      for (const forbidden of [
        'matchMedia',
        'innerWidth',
        'resize',
        'ResizeObserver',
        '2023',
        '2024',
        '2025',
        '2026',
      ]) {
        expect(footerSource.includes(forbidden), `Footer source contains ${forbidden}`).toBe(false);
      }
    });

    it('does not duplicate COMPANY-001 literals inside the Footer boundary', () => {
      for (const literal of [
        company.supportPhone,
        company.supportEmail,
        company.headOffice,
        company.officeHours,
        company.supportHours,
        company.descriptor,
      ]) {
        expect(footerSource.includes(literal), `Footer duplicates ${literal}`).toBe(false);
      }

      expect(footerSource).toContain("from '@/app/content/company'");
    });

    it('authors no repository base literal and no CSS order divergence', () => {
      expect(footerSource).not.toContain('/GoodCall/');
      expect(footerStyles).not.toMatch(/^\s*order:/m);
      expect(footerStyles).not.toMatch(/position:\s*(sticky|fixed)/);
    });
  });
});

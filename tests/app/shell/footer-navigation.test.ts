import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { footerGroups, footerLegalLinks } from '@/app/shell/footer/footer-navigation';
import { getRouteMetadata, routeRegistry } from '@/app/routing/registry';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const navigationSource = fs.readFileSync(
  path.join(repoRoot, 'src', 'app', 'shell', 'footer', 'footer-navigation.ts'),
  'utf-8'
);

const EXPECTED_GROUPS = [
  {
    id: 'shoppers',
    title: 'Покупателям',
    links: [
      ['information.deliveryAndPayment', 'Доставка и оплата', '/delivery-and-payment'],
      ['help.warrantyReturns', 'Гарантия, возврат и ремонт', '/warranty-and-returns'],
      ['loyalty.program', 'Бонусная программа', '/loyalty'],
      ['promotions.list', 'Акции и спецпредложения', '/promotions'],
      ['brands.directory', 'Бренды', '/brands'],
    ],
  },
  {
    id: 'company',
    title: 'Компания',
    links: [
      ['company.about', 'О компании', '/about'],
      ['blog.list', 'Блог', '/blog'],
      ['locations.shops', 'Магазины', '/shops'],
    ],
  },
  {
    id: 'help',
    title: 'Помощь',
    links: [
      ['help.faq', 'Помощь и ответы на вопросы', '/help'],
      ['order.tracking', 'Отслеживание заказа', '/track-order'],
      ['locations.serviceCenters', 'Сервисные центры', '/service-centers'],
    ],
  },
] as const;

const EXPECTED_LEGAL = [
  ['legal.privacyPolicy', 'Политика конфиденциальности', '/privacy-policy'],
  ['legal.userAgreement', 'Пользовательское соглашение', '/user-agreement'],
  ['legal.publicOffer', 'Публичная оферта', '/public-offer'],
] as const;

function allLinks() {
  return [...footerGroups.flatMap((group) => group.links), ...footerLegalLinks];
}

describe('Footer navigation configuration', () => {
  it('exposes exactly three route-navigation groups in canonical order', () => {
    expect(footerGroups).toHaveLength(3);
    expect(footerGroups.map((group) => group.id)).toEqual(['shoppers', 'company', 'help']);
    expect(footerGroups.map((group) => group.title)).toEqual(['Покупателям', 'Компания', 'Помощь']);
  });

  it.each(EXPECTED_GROUPS.map((group, index) => [index, group] as const))(
    'resolves group %i with the canonical working subset',
    (index, expected) => {
      const group = footerGroups[index];

      expect(group?.id).toBe(expected.id);
      expect(group?.title).toBe(expected.title);
      expect(group?.links.map((link) => [link.routeKey, link.label, link.path])).toEqual(
        expected.links.map((link) => [...link])
      );
    }
  );

  it('exposes exactly the three canonical legal links', () => {
    expect(footerLegalLinks).toHaveLength(3);
    expect(footerLegalLinks.map((link) => [link.routeKey, link.label, link.path])).toEqual(
      EXPECTED_LEGAL.map((link) => [...link])
    );
  });

  it('derives every destination from the route registry', () => {
    for (const link of allLinks()) {
      expect(getRouteMetadata(link.routeKey)?.path, `${link.routeKey} registry path`).toBe(
        link.path
      );
    }
  });

  it('keeps every destination static, app-relative and free of the repository literal', () => {
    for (const link of allLinks()) {
      expect(link.path.startsWith('/'), `${link.routeKey} app-relative`).toBe(true);
      expect(link.path.includes(':'), `${link.routeKey} dynamic`).toBe(false);
      expect(link.path, `${link.routeKey} catch-all`).not.toBe('*');
      expect(link.path.includes('GoodCall'), `${link.routeKey} repository literal`).toBe(false);
    }
  });

  it('has no duplicate destination across the whole Footer', () => {
    const paths = allLinks().map((link) => link.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  it('targets only registered routes', () => {
    const registered = new Set(routeRegistry.map((route) => route.path));

    for (const link of allLinks()) {
      expect(registered.has(link.path), `${link.path} is registered`).toBe(true);
    }
  });

  it('authors no route literal and no repository base in the configuration source', () => {
    expect(navigationSource).toContain("from '@/app/routing/registry'");
    expect(navigationSource).not.toContain('/GoodCall/');

    for (const link of allLinks()) {
      expect(navigationSource.includes(`'${link.path}'`), `${link.path} literal`).toBe(false);
    }
  });

  it('uses canonical registry terminology rather than the current carrier headings', () => {
    const labels = footerGroups.flatMap((group) => group.links.map((link) => link.label));

    expect(labels).toContain('Гарантия, возврат и ремонт');
    expect(labels).toContain('Бонусная программа');
    expect(labels).toContain('Акции и спецпредложения');
    expect(labels).toContain('Помощь и ответы на вопросы');
    expect(labels).toContain('Отслеживание заказа');

    expect(labels).not.toContain('Гарантия и возврат');
    expect(labels).not.toContain('Программа лояльности');
    expect(labels).not.toContain('Акции');
    expect(labels).not.toContain('Отследить заказ');
  });

  it('leaves the current carrier route headings untouched', () => {
    const carrierSource = fs.readFileSync(
      path.join(repoRoot, 'src', 'app', 'routing', 'carriers.ts'),
      'utf-8'
    );

    expect(carrierSource).toContain("heading: 'Гарантия и возврат'");
    expect(carrierSource).toContain("heading: 'Программа лояльности'");
    expect(carrierSource).toContain("heading: 'Акции'");
    expect(carrierSource).toContain("heading: 'Отследить заказ'");
  });
});

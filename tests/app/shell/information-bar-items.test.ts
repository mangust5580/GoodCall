import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { serviceLinks } from '@/app/shell/information-bar/information-bar-items';
import { routeRegistry, getRouteMetadata } from '@/app/routing/registry';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const CANONICAL_SERVICE_LINKS: ReadonlyArray<readonly [string, string, string]> = [
  ['information.deliveryAndPayment', 'Доставка и оплата', '/delivery-and-payment'],
  ['help.warrantyReturns', 'Гарантия и возврат', '/warranty-and-returns'],
  ['loyalty.program', 'Программа лояльности', '/loyalty'],
  ['help.faq', 'Помощь', '/help'],
  ['company.contacts', 'Контакты', '/contacts'],
];

describe('Information Bar service link configuration', () => {
  it('declares exactly five service links', () => {
    expect(serviceLinks).toHaveLength(5);
  });

  it('preserves the canonical order, labels and destinations', () => {
    expect(serviceLinks.map((link) => [link.key, link.label, link.path])).toEqual(
      CANONICAL_SERVICE_LINKS.map((entry) => [...entry])
    );
  });

  it.each(CANONICAL_SERVICE_LINKS)(
    '%s resolves through the route registry',
    (key, _label, expectedPath) => {
      const metadata = getRouteMetadata(key as (typeof routeRegistry)[number]['key']);

      expect(metadata).toBeDefined();
      expect(metadata?.path).toBe(expectedPath);
      expect(metadata?.access).toBe('public');
    }
  );

  it('targets no dynamic or catch-all destination', () => {
    for (const link of serviceLinks) {
      expect(link.path).not.toBe('*');
      expect(link.path).not.toContain(':');
      expect(link.path.startsWith('/')).toBe(true);
    }
  });

  it('carries no repository literal and no browser-root URL', () => {
    for (const link of serviceLinks) {
      expect(link.path).not.toContain('GoodCall');
      expect(link.path).not.toMatch(/^https?:/);
      expect(link.path.startsWith('/'.repeat(2))).toBe(false);
    }
  });

  it('has unique destinations and unique route keys', () => {
    expect(new Set(serviceLinks.map((link) => link.path)).size).toBe(serviceLinks.length);
    expect(new Set(serviceLinks.map((link) => link.key)).size).toBe(serviceLinks.length);
  });

  it('introduces no second route registry', () => {
    const source = fs.readFileSync(
      path.join(repoRoot, 'src', 'app', 'shell', 'information-bar', 'information-bar-items.ts'),
      'utf-8'
    );

    expect(source).toContain("from '@/app/routing/registry'");
    for (const [, , expectedPath] of CANONICAL_SERVICE_LINKS) {
      expect(source).not.toContain(`'${expectedPath}'`);
    }
  });

  it('derives no destination from label concatenation', () => {
    const source = fs.readFileSync(
      path.join(repoRoot, 'src', 'app', 'shell', 'information-bar', 'information-bar-items.ts'),
      'utf-8'
    );

    expect(source).not.toMatch(/path:\s*`/);
    expect(source).not.toMatch(/`\/\$\{/);
  });
});

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  USER_NAV_LABEL,
  headerActions,
  type HeaderActionId,
} from '@/app/shell/site-header/header-actions-config';
import { getRouteMetadata } from '@/app/routing/registry';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const configSource = fs.readFileSync(
  path.join(repoRoot, 'src', 'app', 'shell', 'site-header', 'header-actions-config.ts'),
  'utf-8'
);

const EXPECTED_ACTIONS: ReadonlyArray<{
  id: HeaderActionId;
  label: string;
  routeKey: string;
  path: string;
  iconFile: string;
}> = [
  {
    id: 'comparison',
    label: 'Сравнение',
    routeKey: 'comparison',
    path: '/comparison',
    iconFile: 'comparison.svg',
  },
  {
    id: 'favorites',
    label: 'Избранное',
    routeKey: 'favorites',
    path: '/favorites',
    iconFile: 'favorites.svg',
  },
  { id: 'cart', label: 'Корзина', routeKey: 'cart', path: '/cart', iconFile: 'cart.svg' },
  { id: 'account', label: 'Войти', routeKey: 'auth', path: '/auth', iconFile: 'account.svg' },
];

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function assetSource(iconFile: string): string {
  return fs.readFileSync(path.join(repoRoot, 'src', 'assets', 'icons', 'shell', iconFile), 'utf-8');
}

function firstGeometry(iconFile: string): string {
  const match = /d="([^"]+)"/.exec(assetSource(iconFile));

  if (match?.[1] === undefined) {
    throw new Error(`${iconFile} exposes no path geometry`);
  }

  return normalize(match[1]);
}

function resolvedIconContent(iconUrl: string): string {
  const inlined = iconUrl.startsWith('data:');
  return normalize(inlined ? decodeURIComponent(iconUrl) : iconUrl);
}

describe('Header actions configuration', () => {
  it('uses the exact canonical user navigation name', () => {
    expect(USER_NAV_LABEL).toBe('Пользовательская навигация');
  });

  it('exposes exactly four actions in canonical order', () => {
    expect(headerActions).toHaveLength(4);
    expect(headerActions.map((action) => action.id)).toEqual(
      EXPECTED_ACTIONS.map((action) => action.id)
    );
  });

  it.each(EXPECTED_ACTIONS.map((action, index) => [index, action] as const))(
    'resolves action %i with the exact canonical identity',
    (index, expected) => {
      const action = headerActions[index];

      expect(action).toBeDefined();
      expect(action?.id).toBe(expected.id);
      expect(action?.label).toBe(expected.label);
      expect(action?.routeKey).toBe(expected.routeKey);
      expect(action?.path).toBe(expected.path);

      const iconUrl = action?.iconUrl ?? '';
      const carriesFileName = iconUrl.includes(expected.iconFile);
      const carriesGeometry = resolvedIconContent(iconUrl).includes(
        firstGeometry(expected.iconFile)
      );

      expect(carriesFileName || carriesGeometry, `${expected.id} resolves its approved asset`).toBe(
        true
      );
    }
  );

  it('derives every destination from the route registry', () => {
    for (const action of headerActions) {
      expect(getRouteMetadata(action.routeKey)?.path, `${action.id} registry path`).toBe(
        action.path
      );
    }
  });

  it('keeps every destination static, app-relative and free of the repository literal', () => {
    for (const action of headerActions) {
      expect(action.path.startsWith('/'), `${action.id} app-relative`).toBe(true);
      expect(action.path.includes(':'), `${action.id} dynamic segment`).toBe(false);
      expect(action.path, `${action.id} catch-all`).not.toBe('*');
      expect(action.path.includes('GoodCall'), `${action.id} repository literal`).toBe(false);
    }
  });

  it('has no duplicate id, label, route key or destination', () => {
    expect(new Set(headerActions.map((action) => action.id)).size).toBe(4);
    expect(new Set(headerActions.map((action) => action.label)).size).toBe(4);
    expect(new Set(headerActions.map((action) => action.routeKey)).size).toBe(4);
    expect(new Set(headerActions.map((action) => action.path)).size).toBe(4);
  });

  it('selects a distinct approved icon for every action', () => {
    for (const action of headerActions) {
      expect(action.iconUrl.length, `${action.id} icon source`).toBeGreaterThan(0);
    }

    expect(new Set(headerActions.map((action) => action.iconUrl)).size).toBe(4);
  });

  it('does not select the Catalog or Search icon', () => {
    const catalogSignature = normalize('rect x="4.25" y="4.25" width="6" height="6"');
    const searchSignature = firstGeometry('search.svg');

    for (const action of headerActions) {
      const content = resolvedIconContent(action.iconUrl);

      expect(action.iconUrl.includes('catalog.svg'), `${action.id} catalog icon`).toBe(false);
      expect(action.iconUrl.includes('search.svg'), `${action.id} search icon`).toBe(false);
      expect(content.includes(catalogSignature), `${action.id} catalog geometry`).toBe(false);
      expect(content.includes(searchSignature), `${action.id} search geometry`).toBe(false);
    }

    expect(configSource.includes('icons/shell/catalog.svg')).toBe(false);
    expect(configSource.includes('icons/shell/search.svg')).toBe(false);
  });

  it('derives destinations from the registry rather than hardcoded literals', () => {
    expect(configSource).toContain("from '@/app/routing/registry'");
    expect(configSource).not.toContain("'/comparison'");
    expect(configSource).not.toContain("'/favorites'");
    expect(configSource).not.toContain("'/cart'");
    expect(configSource).not.toContain("'/auth'");
    expect(configSource).not.toContain('GoodCall/');
  });

  it('declares no counter, badge or domain state', () => {
    const forbidden = [
      /\bcount\b/i,
      /\bcounter\b/i,
      /\bbadge\b/i,
      /\btotal\b/i,
      /\bquantity\b/i,
      /\buseState\b/,
      /\buseReducer\b/,
      /\buseContext\b/,
    ];

    for (const pattern of forbidden) {
      expect(pattern.test(configSource), String(pattern)).toBe(false);
    }
  });
});

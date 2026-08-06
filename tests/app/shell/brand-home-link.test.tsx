import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BrandHomeLink, BRAND_HOME_LINK_LABEL } from '@/app/shell/brand';
import { brandAssets, selectBrandAsset } from '@/app/shell/brand/brand-assets';
import type { BrandLockup, BrandVariant } from '@/app/shell/brand';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const stylesheetSource = fs.readFileSync(
  path.join(repoRoot, 'src', 'app', 'shell', 'brand', 'BrandHomeLink.module.scss'),
  'utf-8'
);

const SELECTION_MATRIX: ReadonlyArray<
  readonly [BrandLockup, BrandVariant, string, 'image' | 'mask']
> = [
  ['horizontal', 'primary', 'goodcall-logo.svg', 'image'],
  ['horizontal', 'inverse', 'goodcall-logo-inverse.svg', 'image'],
  ['horizontal', 'monochrome', 'goodcall-logo-monochrome.svg', 'mask'],
  ['symbol', 'primary', 'goodcall-symbol.svg', 'image'],
  ['symbol', 'inverse', 'goodcall-symbol-inverse.svg', 'image'],
  ['symbol', 'monochrome', 'goodcall-symbol-monochrome.svg', 'mask'],
];

const DATA_URI_PREFIX = 'data:image/svg+xml,';

function brandSourceFor(filename: string): string {
  return fs.readFileSync(path.join(repoRoot, 'src', 'assets', 'brand', filename), 'utf-8');
}

function expectRuntimeAssetMatchesApprovedSource(url: string, filename: string): void {
  const source = brandSourceFor(filename);
  const viewBox = /viewBox="([^"]+)"/.exec(source)?.[1];
  const pathData = (source.match(/ d="[^"]+"/g) ?? []).map((attribute) => attribute.slice(4, -1));

  expect(viewBox).toBeDefined();
  expect(pathData.length).toBeGreaterThan(0);

  if (url.startsWith(DATA_URI_PREFIX)) {
    const decoded = decodeURIComponent(url.slice(DATA_URI_PREFIX.length));

    expect(decoded).toContain(`viewBox='${String(viewBox)}'`);
    for (const geometry of pathData) {
      expect(decoded).toContain(geometry);
    }
    return;
  }

  expect(url).toContain(filename);
}

function renderBrand(props: { lockup?: BrandLockup; variant?: BrandVariant; className?: string }) {
  return render(
    <MemoryRouter>
      <BrandHomeLink {...props} />
    </MemoryRouter>
  );
}

function brandLink(): HTMLElement {
  return screen.getByRole('link', { name: BRAND_HOME_LINK_LABEL });
}

describe('BrandHomeLink', () => {
  describe('destination and accessible name', () => {
    it('links to the Router Home route', () => {
      renderBrand({});

      expect(brandLink()).toHaveAttribute('href', '/');
    });

    it('carries no repository literal in its destination', () => {
      renderBrand({});

      expect(brandLink().getAttribute('href')).not.toContain('GoodCall');
    });

    it('owns exactly the approved accessible name', () => {
      renderBrand({});

      expect(BRAND_HOME_LINK_LABEL).toBe('GoodCall — на главную');
      expect(screen.getAllByRole('link')).toHaveLength(1);
      expect(brandLink()).toHaveAccessibleName('GoodCall — на главную');
    });

    it('exposes no second accessible name from the internal visual', () => {
      const { container } = renderBrand({});

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(container.querySelector('img')).toHaveAttribute('alt', '');
      expect(container.querySelector('svg')).toBeNull();
      expect(container.querySelector('title')).toBeNull();
    });

    it('exposes no second accessible name for the monochrome mask', () => {
      const { container } = renderBrand({ variant: 'monochrome' });

      expect(screen.getAllByRole('link')).toHaveLength(1);
      expect(container.querySelector('[data-brand-asset]')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('defaults', () => {
    it('defaults to the horizontal primary lockup', () => {
      const { container } = renderBrand({});

      const visual = container.querySelector('[data-brand-asset]');
      expect(visual?.getAttribute('data-brand-asset')).toBe(brandAssets.horizontal.primary.url);
      expect(visual?.tagName.toLowerCase()).toBe('img');
    });

    it('marks the default link with the horizontal sizing contract', () => {
      renderBrand({});

      expect(brandLink().className).toContain('horizontal');
    });
  });

  describe('asset selection matrix', () => {
    it.each(SELECTION_MATRIX)(
      '%s + %s resolves to the approved %s geometry',
      (lockup, variant, filename, rendering) => {
        const asset = selectBrandAsset(lockup, variant);

        expectRuntimeAssetMatchesApprovedSource(asset.url, filename);
        expect(asset.rendering).toBe(rendering);
      }
    );

    it.each(SELECTION_MATRIX)('%s + %s renders the approved asset', (lockup, variant, filename) => {
      const { container } = renderBrand({ lockup, variant });

      const visual = container.querySelector('[data-brand-asset]');
      expectRuntimeAssetMatchesApprovedSource(
        visual?.getAttribute('data-brand-asset') ?? '',
        filename
      );
      expect(brandLink().className).toContain(lockup);
    });

    it('maps every lockup and variant exactly once', () => {
      const urls = Object.values(brandAssets).flatMap((byVariant) =>
        Object.values(byVariant).map((asset) => asset.url)
      );

      expect(urls).toHaveLength(6);
      expect(new Set(urls).size).toBe(6);
    });

    it('never derives an asset filename by concatenation', () => {
      const source = fs.readFileSync(
        path.join(repoRoot, 'src', 'app', 'shell', 'brand', 'brand-assets.ts'),
        'utf-8'
      );

      expect(source).not.toMatch(/`[^`]*goodcall-[^`]*\$\{/);
      expect(source.match(/from '@\/assets\/brand\//g)).toHaveLength(6);
    });
  });

  describe('rendering strategy', () => {
    it.each(['primary', 'inverse'] as const)(
      'renders the %s variant as an imported image resource',
      (variant) => {
        const { container } = renderBrand({ variant });

        const image = container.querySelector('img');
        expect(image).not.toBeNull();
        expect(image).toHaveAttribute('src', brandAssets.horizontal[variant].url);
      }
    );

    it('renders the monochrome variant through a currentColor-capable mask', () => {
      const { container } = renderBrand({ variant: 'monochrome' });

      expect(container.querySelector('img')).toBeNull();

      const mask = container.querySelector('[data-brand-asset]');
      expect(mask?.tagName.toLowerCase()).toBe('span');
      expect(mask?.getAttribute('style')).toContain('--gc-brand-mask-image');
      expect(mask?.getAttribute('style')).toContain('goodcall-logo-monochrome.svg');
      expectRuntimeAssetMatchesApprovedSource(
        mask?.getAttribute('data-brand-asset') ?? '',
        'goodcall-logo-monochrome.svg'
      );
    });

    it('resolves the monochrome fill from currentColor and hardcodes no colour', () => {
      expect(stylesheetSource).toContain('background-color: currentcolor');
      expect(stylesheetSource).toContain('mask-image: var(--gc-brand-mask-image)');
      expect(stylesheetSource).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    });

    it('reconstructs no SVG geometry in the component', () => {
      const source = fs.readFileSync(
        path.join(repoRoot, 'src', 'app', 'shell', 'brand', 'BrandHomeLink.tsx'),
        'utf-8'
      );

      expect(source).not.toContain('dangerouslySetInnerHTML');
      expect(source).not.toContain('<path');
      expect(source).not.toContain('<svg');
    });
  });

  describe('sizing and interaction contract', () => {
    it('declares the horizontal minimum rendered width', () => {
      expect(stylesheetSource).toMatch(/\.horizontal[\s\S]*?min-inline-size:\s*120px/);
    });

    it('declares the symbol minimum rendered size', () => {
      expect(stylesheetSource).toMatch(/\.symbol[\s\S]*?min-inline-size:\s*16px/);
    });

    it('declares a 44px interactive target on the link', () => {
      expect(stylesheetSource).toMatch(/min-inline-size:\s*44px/);
      expect(stylesheetSource).toMatch(/min-block-size:\s*44px/);
    });

    it('preserves aspect ratio and contain fit without transforms', () => {
      expect(stylesheetSource).toContain('aspect-ratio: 666.664 / 84');
      expect(stylesheetSource).toContain('aspect-ratio: 98 / 84');
      expect(stylesheetSource).toContain('object-fit: contain');
      expect(stylesheetSource).toContain('mask-size: contain');
      expect(stylesheetSource).not.toContain('transform:');
      expect(stylesheetSource).not.toMatch(/margin[^:]*:\s*-/);
    });

    it('keeps a focus indicator that does not depend on asset colour', () => {
      expect(stylesheetSource).toContain('outline');
      expect(stylesheetSource).toContain('forced-colors: active');
    });
  });

  describe('consumer boundary', () => {
    it('applies a consumer className to the link boundary', () => {
      renderBrand({ className: 'consumer-hook' });

      expect(brandLink().className).toContain('consumer-hook');
      expect(brandLink().className).toContain('horizontal');
    });

    it('is not exported from the Shared UI public API', () => {
      const sharedUiSource = fs.readFileSync(
        path.join(repoRoot, 'src', 'shared', 'ui', 'index.ts'),
        'utf-8'
      );

      expect(sharedUiSource).not.toContain('BrandHomeLink');
      expect(sharedUiSource).not.toContain('brand');
    });
  });
});

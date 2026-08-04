import { describe, it, expect } from 'vitest';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type BrandAssetManifestEntry = {
  assetId: string;
  canonicalName: string;
  role: string;
  variant: string;
  viewBox: string;
  fileSizeBytes: number;
  sha256: string;
  pathCount: number;
  subpathCount: number;
  textElements: number;
  fontDependency: boolean;
  rasterEmbedding: boolean;
  externalReferences: boolean;
  fillStrategy: string;
  fixedColors: string[];
  approvalStatus: string;
  integrationStatus: string;
  productionPath: string;
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(
  repoRoot,
  'docs',
  '05-implementation',
  'm2-brand-asset-manifest.json'
);
const manifestSource = fs.readFileSync(manifestPath, 'utf-8');
const manifest = JSON.parse(manifestSource) as BrandAssetManifestEntry[];

const EXPECTED_PRODUCTION_PATHS = [
  'src/assets/brand/goodcall-logo.svg',
  'src/assets/brand/goodcall-symbol.svg',
  'src/assets/brand/goodcall-logo-inverse.svg',
  'src/assets/brand/goodcall-symbol-inverse.svg',
  'src/assets/brand/goodcall-logo-monochrome.svg',
  'src/assets/brand/goodcall-symbol-monochrome.svg',
];

const SVG_NAMESPACE = 'xmlns="http://www.w3.org/2000/svg"';
const FORBIDDEN_FRAGMENTS = [
  '<text',
  '<image',
  '<foreignObject',
  '<script',
  'javascript:',
  'data:',
  '<!--',
];
const PRIMARY_BRAND_COLORS = ['#8343FB', '#0A0F2C'];

function absolutePathFor(entry: BrandAssetManifestEntry): string {
  return path.join(repoRoot, entry.productionPath);
}

function readAssetSource(entry: BrandAssetManifestEntry): string {
  return fs.readFileSync(absolutePathFor(entry), 'utf-8');
}

function countMatches(source: string, pattern: RegExp): number {
  return source.match(pattern)?.length ?? 0;
}

function pathDataAttributes(source: string): string[] {
  return (source.match(/ d="[^"]+"/g) ?? []).map((attribute) => attribute.slice(4, -1));
}

function entryFor(productionPath: string): BrandAssetManifestEntry {
  const entry = manifest.find((candidate) => candidate.productionPath === productionPath);
  if (!entry) {
    throw new Error(`Manifest has no entry for ${productionPath}`);
  }
  return entry;
}

function wordmarkPathData(): string {
  const horizontal = entryFor('src/assets/brand/goodcall-logo.svg');
  const pathData = pathDataAttributes(readAssetSource(horizontal));
  const wordmark = pathData[pathData.length - 1];
  if (!wordmark) {
    throw new Error(`${horizontal.productionPath} exposes no path geometry`);
  }
  return wordmark;
}

describe('Brand Asset Contract', () => {
  it('manifest describes exactly the six approved production assets', () => {
    expect([...manifest.map((entry) => entry.productionPath)].sort()).toEqual(
      [...EXPECTED_PRODUCTION_PATHS].sort()
    );
  });

  it('manifest reports every asset as approved and tracked but not consumed', () => {
    for (const entry of manifest) {
      expect(entry.approvalStatus, `${entry.productionPath} approvalStatus`).toBe('approved');
      expect(entry.integrationStatus, `${entry.productionPath} integrationStatus`).toBe(
        'tracked-not-yet-consumed'
      );
    }
  });

  for (const entry of manifest) {
    describe(entry.productionPath, () => {
      it('exists with the approved byte identity', () => {
        expect(fs.existsSync(absolutePathFor(entry)), `${entry.productionPath} is missing`).toBe(
          true
        );

        const bytes = fs.readFileSync(absolutePathFor(entry));

        expect(bytes.byteLength, `${entry.productionPath} file size`).toBe(entry.fileSizeBytes);
        expect(
          createHash('sha256').update(bytes).digest('hex'),
          `${entry.productionPath} SHA-256 does not match the approved manifest hash`
        ).toBe(entry.sha256);
      });

      it('is readable UTF-8 SVG markup', () => {
        const source = readAssetSource(entry);

        expect(source.startsWith('<svg'), `${entry.productionPath} does not start with <svg`).toBe(
          true
        );
        expect(source.includes(SVG_NAMESPACE), `${entry.productionPath} SVG namespace`).toBe(true);
      });

      it('contains no forbidden markup', () => {
        const source = readAssetSource(entry);

        for (const fragment of FORBIDDEN_FRAGMENTS) {
          expect(
            source.includes(fragment),
            `${entry.productionPath} contains forbidden fragment ${fragment}`
          ).toBe(false);
        }
      });

      it('declares no external references', () => {
        const source = readAssetSource(entry).replace(SVG_NAMESPACE, '');

        expect(source.includes('http://'), `${entry.productionPath} references http://`).toBe(
          false
        );
        expect(source.includes('https://'), `${entry.productionPath} references https://`).toBe(
          false
        );
        expect(source.includes('href'), `${entry.productionPath} declares an href`).toBe(false);
      });

      it('matches the approved viewBox and geometry counts', () => {
        const source = readAssetSource(entry);

        expect(
          source.includes(`viewBox="${entry.viewBox}"`),
          `${entry.productionPath} viewBox does not match ${entry.viewBox}`
        ).toBe(true);
        expect(countMatches(source, /<path/g), `${entry.productionPath} path count`).toBe(
          entry.pathCount
        );
        expect(countMatches(source, /[Zz]/g), `${entry.productionPath} subpath count`).toBe(
          entry.subpathCount
        );
      });

      it('applies the approved fill strategy', () => {
        const source = readAssetSource(entry);
        const fills = source.match(/fill="[^"]*"/g) ?? [];

        expect(fills.length, `${entry.productionPath} fill declarations`).toBe(entry.pathCount);

        if (entry.fillStrategy === 'fixed-brand-color') {
          for (const fill of fills) {
            expect(
              PRIMARY_BRAND_COLORS.some((color) => fill === `fill="${color}"`),
              `${entry.productionPath} uses unapproved fill ${fill}`
            ).toBe(true);
          }
          for (const color of entry.fixedColors) {
            expect(source.includes(color), `${entry.productionPath} is missing ${color}`).toBe(
              true
            );
          }
        }

        if (entry.fillStrategy === 'fixed-white') {
          for (const fill of fills) {
            expect(fill, `${entry.productionPath} uses unapproved fill ${fill}`).toBe(
              'fill="#FFFFFF"'
            );
          }
        }

        if (entry.fillStrategy === 'currentColor') {
          for (const fill of fills) {
            expect(fill, `${entry.productionPath} uses unapproved fill ${fill}`).toBe(
              'fill="currentColor"'
            );
          }
          expect(source.includes('#'), `${entry.productionPath} hardcodes a colour`).toBe(false);
        }
      });

      it('keeps primary brand colours out of non-primary variants', () => {
        const source = readAssetSource(entry);

        for (const color of PRIMARY_BRAND_COLORS) {
          if (entry.variant === 'primary') {
            continue;
          }
          expect(
            source.includes(color),
            `${entry.productionPath} must not contain primary brand colour ${color}`
          ).toBe(false);
        }
      });

      it('carries wordmark geometry only in horizontal assets', () => {
        const source = readAssetSource(entry);
        const carriesWordmark = source.includes(wordmarkPathData());

        expect(carriesWordmark, `${entry.productionPath} wordmark geometry presence`).toBe(
          entry.role === 'horizontal logo'
        );
      });
    });
  }
});

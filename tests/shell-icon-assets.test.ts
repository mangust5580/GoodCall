import { describe, it, expect } from 'vitest';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type ShellIconManifestEntry = {
  assetId: string;
  canonicalName: string;
  semanticRole: string;
  owner: string;
  format: string;
  viewBox: string;
  intrinsicWidth: number;
  intrinsicHeight: number;
  fileSizeBytes: number;
  sha256: string;
  elementCounts: Record<string, number>;
  pathCount: number;
  fillStrategy: string;
  fixedColors: string[];
  strokeWidth: string;
  strokeLinecap: string;
  strokeLinejoin: string;
  transparentBackground: boolean;
  fontDependency: boolean;
  rasterEmbedding: boolean;
  externalReferences: boolean;
  accessibilityOwnership: string;
  intendedRuntimeUse: string;
  minimumReviewSize: string;
  productionPath: string;
  sourceEvidence: string[];
  approvalStatus: string;
  integrationStatus: string;
  knownRisks: string[];
  notes: string;
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shellIconDir = path.join(repoRoot, 'src', 'assets', 'icons', 'shell');
const manifestPath = path.join(
  repoRoot,
  'docs',
  '05-implementation',
  'm4-shell-icon-asset-manifest.json'
);
const manifestSource = fs.readFileSync(manifestPath, 'utf-8');
const manifest = JSON.parse(manifestSource) as ShellIconManifestEntry[];

const EXPECTED_ASSETS = ['catalog', 'search', 'comparison', 'favorites', 'cart', 'account'];
const EXPECTED_PRODUCTION_PATHS = EXPECTED_ASSETS.map(
  (assetId) => `src/assets/icons/shell/${assetId}.svg`
);
const EXPECTED_STATUS = 'awaiting-independent-asset-audit-and-user-visual-confirmation';
const EXPECTED_INTEGRATION_STATUS = 'produced-not-integrated';
const SVG_NAMESPACE = 'xmlns="http://www.w3.org/2000/svg"';
const ALLOWED_ELEMENTS = new Set(['svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline']);
const FORBIDDEN_ELEMENTS = [
  'text',
  'image',
  'script',
  'style',
  'foreignObject',
  'linearGradient',
  'radialGradient',
  'filter',
  'pattern',
  'animate',
  'animateTransform',
  'animateMotion',
  'metadata',
  'title',
  'desc',
  'use',
];
const FORBIDDEN_FRAGMENTS = [
  '<!--',
  'data:',
  'javascript:',
  '<![CDATA',
  'font-family',
  '@font-face',
  'url(',
  'href=',
  'xlink:href',
  'xmlns:',
  'sodipodi:',
  'inkscape:',
  'sketch:',
  'figma:',
];
const BANNED_ICON_DEPENDENCIES = [
  '@fortawesome',
  '@heroicons',
  '@iconify',
  'font-awesome',
  'heroicons',
  'lucide',
  'lucide-react',
  'material-icons',
  'react-icons',
];
const SIZE_CEILING_BYTES = 3000;
const REJECTED_COMPARISON_CONVERGING_MARKER =
  'M10.25 12h3.5m0 0-1.45-1.45M13.75 12l-1.45 1.45M10.25 12l1.45-1.45M10.25 12l1.45 1.45';
const COMPARISON_UPPER_DIRECTIONAL_ROW = 'M9.25 10.1h5.5m-1.35-1.3 1.35 1.3-1.35 1.3';
const COMPARISON_LOWER_DIRECTIONAL_ROW = 'M14.75 13.9h-5.5m1.35-1.3-1.35 1.3 1.35 1.3';

function productionPath(assetId: string): string {
  return `src/assets/icons/shell/${assetId}.svg`;
}

function absolutePathFor(productionAssetPath: string): string {
  return path.join(repoRoot, productionAssetPath);
}

function readSource(productionAssetPath: string): string {
  return fs.readFileSync(absolutePathFor(productionAssetPath), 'utf-8');
}

function readBytes(productionAssetPath: string): Uint8Array {
  return fs.readFileSync(absolutePathFor(productionAssetPath));
}

function hashBytes(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function parseSvg(source: string): XMLDocument {
  const document = new DOMParser().parseFromString(source, 'image/svg+xml');
  const parserError = document.querySelector('parsererror');

  if (parserError !== null) {
    throw new Error(parserError.textContent ?? 'SVG parser error');
  }

  return document;
}

function elementsIn(document: XMLDocument): Element[] {
  return Array.from(document.querySelectorAll('*'));
}

function countElements(document: XMLDocument): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const element of elementsIn(document)) {
    const name = element.localName;
    counts[name] = (counts[name] ?? 0) + 1;
  }

  return counts;
}

function elementCountFor(document: XMLDocument, elementName: string): number {
  return document.querySelectorAll(elementName).length;
}

function paintValues(source: string): string[] {
  return Array.from(source.matchAll(/\s(?:fill|stroke)="([^"]+)"/g), (match) => match[1] ?? '');
}

function opacityValues(source: string): number[] {
  return Array.from(
    source.matchAll(/\s(?:opacity|fill-opacity|stroke-opacity)="([^"]+)"/g),
    (match) => Number(match[1])
  );
}

function runtimeSourceFiles(): string[] {
  const files: string[] = [];

  function walk(directory: string): void {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      if (/\.(ts|tsx|js|jsx|scss|css)$/.test(entry.name)) {
        files.push(entryPath);
      }
    }
  }

  walk(path.join(repoRoot, 'src'));
  return files;
}

describe('Shell Icon Asset Contract', () => {
  it('exposes exactly the six expected production SVG files', () => {
    const actual = fs
      .readdirSync(shellIconDir)
      .filter((fileName) => fileName.endsWith('.svg'))
      .sort();
    const expected = EXPECTED_ASSETS.map((assetId) => `${assetId}.svg`).sort();

    expect(actual).toEqual(expected);
  });

  it('keeps the manifest in canonical order', () => {
    expect(manifest.map((entry) => entry.assetId)).toEqual(EXPECTED_ASSETS);
    expect(manifest.map((entry) => entry.productionPath)).toEqual(EXPECTED_PRODUCTION_PATHS);
  });

  it('keeps the corrected comparison marker distinct from the Catalog tile grid', () => {
    const catalogDocument = parseSvg(readSource(productionPath('catalog')));
    const comparisonSource = readSource(productionPath('comparison'));
    const comparisonDocument = parseSvg(comparisonSource);
    const comparisonRects = Array.from(comparisonDocument.querySelectorAll('rect'));
    const comparisonPaths = Array.from(comparisonDocument.querySelectorAll('path'), (marker) =>
      marker.getAttribute('d')
    );

    expect(elementCountFor(catalogDocument, 'rect'), 'Catalog tile count').toBe(4);
    expect(elementCountFor(catalogDocument, 'path'), 'Catalog relation marker path').toBe(0);
    expect(comparisonRects.length, 'Comparison product/card entities').toBe(2);
    expect(
      comparisonRects.map((rect) => rect.getAttribute('width')),
      'Comparison card widths'
    ).toEqual(['5.4', '5.4']);
    expect(comparisonPaths, 'Comparison separated directional rows').toEqual([
      COMPARISON_UPPER_DIRECTIONAL_ROW,
      COMPARISON_LOWER_DIRECTIONAL_ROW,
    ]);
    expect(
      comparisonPaths.every((pathData) => pathData !== null && !/[Aa]/.test(pathData)),
      'Comparison avoids circular-arrow path commands'
    ).toBe(true);
    expect(
      comparisonSource.includes(REJECTED_COMPARISON_CONVERGING_MARKER),
      'Comparison does not keep the rejected center-converging marker'
    ).toBe(false);
    expect(
      comparisonSource.includes('M6.9 9h1.2'),
      'Comparison does not keep the rejected list-column marks'
    ).toBe(false);
  });

  for (const assetId of EXPECTED_ASSETS) {
    const assetPath = productionPath(assetId);

    describe(assetPath, () => {
      it('exists with byte identity matching the manifest', () => {
        const entry = manifest.find((candidate) => candidate.assetId === assetId);

        expect(entry, `${assetPath} manifest entry`).toBeDefined();

        if (entry === undefined) {
          throw new Error(`${assetPath} manifest entry missing`);
        }

        const bytes = readBytes(assetPath);

        expect(bytes.byteLength, `${assetPath} file size`).toBe(entry.fileSizeBytes);
        expect(hashBytes(bytes), `${assetPath} SHA-256`).toBe(entry.sha256);
        expect(bytes.byteLength, `${assetPath} size ceiling`).toBeLessThan(SIZE_CEILING_BYTES);
      });

      it('is standalone readable SVG with the approved root geometry', () => {
        const source = readSource(assetPath);
        const document = parseSvg(source);
        const root = document.documentElement;

        expect(source.startsWith('<svg'), `${assetPath} starts with <svg`).toBe(true);
        expect(source.includes(SVG_NAMESPACE), `${assetPath} SVG namespace`).toBe(true);
        expect(root.localName, `${assetPath} root element`).toBe('svg');
        expect(root.getAttribute('viewBox'), `${assetPath} viewBox`).toBe('0 0 24 24');
        expect(root.getAttribute('width'), `${assetPath} width`).toBe('24');
        expect(root.getAttribute('height'), `${assetPath} height`).toBe('24');
      });

      it('contains only allowed SVG elements and required geometry', () => {
        const document = parseSvg(readSource(assetPath));
        const elementNames = elementsIn(document).map((element) => element.localName);

        for (const elementName of elementNames) {
          expect(ALLOWED_ELEMENTS.has(elementName), `${assetPath} element ${elementName}`).toBe(
            true
          );
        }

        for (const elementName of FORBIDDEN_ELEMENTS) {
          expect(
            elementCountFor(document, elementName),
            `${assetPath} forbidden ${elementName}`
          ).toBe(0);
        }

        expect(elementNames.length, `${assetPath} geometry`).toBeGreaterThan(1);
      });

      it('contains no forbidden markup, references, fonts, handlers or editor namespaces', () => {
        const source = readSource(assetPath);
        const sourceWithoutNamespace = source.replace(SVG_NAMESPACE, '');

        for (const fragment of FORBIDDEN_FRAGMENTS) {
          expect(source.includes(fragment), `${assetPath} fragment ${fragment}`).toBe(false);
        }

        expect(sourceWithoutNamespace.includes('http://'), `${assetPath} http reference`).toBe(
          false
        );
        expect(sourceWithoutNamespace.includes('https://'), `${assetPath} https reference`).toBe(
          false
        );
        expect(/\son[a-z]+\s*=/.test(source), `${assetPath} event handler`).toBe(false);
      });

      it('uses only the approved monochrome transparent paint model', () => {
        const source = readSource(assetPath);
        const colors = Array.from(source.matchAll(/#[0-9a-fA-F]{3,8}/g), (match) => match[0]);

        for (const value of paintValues(source)) {
          expect(['#000000', 'none'].includes(value), `${assetPath} paint ${value}`).toBe(true);
        }

        for (const color of colors) {
          expect(color, `${assetPath} fixed color`).toBe('#000000');
        }

        for (const opacity of opacityValues(source)) {
          expect(opacity, `${assetPath} opacity`).toBeGreaterThanOrEqual(1);
        }

        expect(source.includes('background'), `${assetPath} background paint`).toBe(false);
      });

      it('matches the manifest structural contract and unapproved status', () => {
        const entry = manifest.find((candidate) => candidate.assetId === assetId);

        if (entry === undefined) {
          throw new Error(`${assetPath} manifest entry missing`);
        }

        const source = readSource(assetPath);
        const document = parseSvg(source);

        expect(entry.viewBox, `${assetPath} manifest viewBox`).toBe('0 0 24 24');
        expect(entry.intrinsicWidth, `${assetPath} manifest width`).toBe(24);
        expect(entry.intrinsicHeight, `${assetPath} manifest height`).toBe(24);
        expect(entry.elementCounts, `${assetPath} element counts`).toEqual(countElements(document));
        expect(entry.pathCount, `${assetPath} path count`).toBe(elementCountFor(document, 'path'));
        expect(entry.fillStrategy, `${assetPath} fill strategy`).toBe('fixed-monochrome-stroke');
        expect(entry.fixedColors, `${assetPath} fixed colors`).toEqual(['#000000']);
        expect(entry.strokeWidth, `${assetPath} stroke width`).toBe('1.9');
        expect(entry.strokeLinecap, `${assetPath} stroke linecap`).toBe('round');
        expect(entry.strokeLinejoin, `${assetPath} stroke linejoin`).toBe('round');
        expect(entry.transparentBackground, `${assetPath} transparent background`).toBe(true);
        expect(entry.fontDependency, `${assetPath} font dependency`).toBe(false);
        expect(entry.rasterEmbedding, `${assetPath} raster embedding`).toBe(false);
        expect(entry.externalReferences, `${assetPath} external references`).toBe(false);
        expect(entry.accessibilityOwnership, `${assetPath} accessibility ownership`).toBe(
          'consuming component owns semantics'
        );
        expect(entry.approvalStatus, `${assetPath} approval status`).toBe(EXPECTED_STATUS);
        expect(entry.integrationStatus, `${assetPath} integration status`).toBe(
          EXPECTED_INTEGRATION_STATUS
        );
      });
    });
  }

  it('keeps shell icons out of runtime source until an integration stage owns them', () => {
    for (const filePath of runtimeSourceFiles()) {
      const source = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(repoRoot, filePath);

      expect(
        source.includes('assets/icons/shell'),
        `${relativePath} imports shell icon folder`
      ).toBe(false);

      for (const assetPath of EXPECTED_PRODUCTION_PATHS) {
        expect(source.includes(assetPath), `${relativePath} imports ${assetPath}`).toBe(false);
      }
    }
  });

  it('does not add a third-party icon dependency', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf-8')
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const dependencyNames = [
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {}),
    ];

    for (const banned of BANNED_ICON_DEPENDENCIES) {
      expect(
        dependencyNames.some((dependencyName) => dependencyName.includes(banned)),
        `dependency ${banned}`
      ).toBe(false);
    }
  });
});

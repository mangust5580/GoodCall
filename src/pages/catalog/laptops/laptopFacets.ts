import { formatMemorySize } from '../../../commerce/format';
import { CATALOG_PRICE_MAX, CATALOG_PRICE_MIN } from '../catalogFilterState';
import { byCountThenName, countFacetValues } from '../catalogFacets';
import type { CatalogProduct } from '../catalogProduct';
import { LAPTOP_CPU_LABELS, LAPTOP_GPU_LABELS, LAPTOP_OS_LABELS, laptopFacts } from './laptopFacts';
import type { LaptopFacts } from './laptopFacts';
import type { LaptopFilterListKey, LaptopFilterState } from './laptopFilterState';

export interface LaptopFacetOption {
  readonly value: string;
  readonly label: string;
  readonly count: number;
}

export type LaptopFacets = Readonly<Record<LaptopFilterListKey, readonly LaptopFacetOption[]>>;

type FactKey = Exclude<LaptopFilterListKey, 'brands'>;

interface DiagonalBucket {
  readonly id: string;
  readonly label: string;
  readonly min: number;
  readonly max: number;
}

const DIAGONAL_BUCKETS: readonly DiagonalBucket[] = [
  { id: '13-14', label: '13″ – 14″', min: 13, max: 15 },
  { id: '15-16', label: '15″ – 16″', min: 15, max: 17 },
  { id: '17+', label: '17″ и больше', min: 17, max: Number.POSITIVE_INFINITY },
];

const GPU_FACET_LABELS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(LAPTOP_GPU_LABELS).map(([gpu, label]) => [gpu, label.replace(/^NVIDIA /u, '')]),
);

const FACT_KEYS: readonly FactKey[] = ['diagonal', 'cpu', 'ram', 'ssd', 'gpu', 'os', 'colours'];

function labelFrom(labels: Readonly<Record<string, string>>) {
  return (value: string): string => labels[value] ?? value;
}

const DIAGONAL_LABELS: Readonly<Record<string, string>> = Object.fromEntries(
  DIAGONAL_BUCKETS.map((bucket) => [bucket.id, bucket.label]),
);

function factValue(facts: LaptopFacts, key: FactKey): string | undefined {
  switch (key) {
    case 'diagonal':
      return DIAGONAL_BUCKETS.find(
        (bucket) => facts.diagonal >= bucket.min && facts.diagonal < bucket.max,
      )?.id;
    case 'ram':
      return String(facts.ram);
    case 'ssd':
      return String(facts.ssd);
    case 'colours':
      return facts.colour;
    default:
      return facts[key];
  }
}

function orderedOptions(
  counts: Map<string, number>,
  labels: Readonly<Record<string, string>>,
): LaptopFacetOption[] {
  const label = labelFrom(labels);

  return Object.keys(labels)
    .filter((value) => counts.has(value))
    .map((value) => ({ value, label: label(value), count: counts.get(value) ?? 0 }));
}

function memoryOptions(counts: Map<string, number>): LaptopFacetOption[] {
  return [...counts]
    .sort(([left], [right]) => Number(left) - Number(right))
    .map(([value, count]) => ({ value, label: formatMemorySize(Number(value)), count }));
}

function namedOptions(counts: Map<string, number>): LaptopFacetOption[] {
  return byCountThenName(counts).map(({ value, count }) => ({ value, label: value, count }));
}

export function buildLaptopFacets(products: readonly CatalogProduct[]): LaptopFacets {
  const facts = products.map((product) => laptopFacts(product.id));
  const counts = (key: FactKey) =>
    countFacetValues(
      facts.map((entry) => (entry === undefined ? undefined : factValue(entry, key))),
    );

  return {
    brands: namedOptions(countFacetValues(products.map((product) => product.brand))),
    diagonal: orderedOptions(counts('diagonal'), DIAGONAL_LABELS),
    cpu: orderedOptions(counts('cpu'), LAPTOP_CPU_LABELS),
    ram: memoryOptions(counts('ram')),
    ssd: memoryOptions(counts('ssd')),
    gpu: orderedOptions(counts('gpu'), GPU_FACET_LABELS),
    os: orderedOptions(counts('os'), LAPTOP_OS_LABELS),
    colours: namedOptions(counts('colours')),
  };
}

function matchesList(selected: readonly string[], value: string | undefined): boolean {
  return selected.length === 0 || (value !== undefined && selected.includes(value));
}

export function applyLaptopFilters(
  products: readonly CatalogProduct[],
  filters: LaptopFilterState,
): readonly CatalogProduct[] {
  const [lowerPrice, upperPrice] = filters.price;
  const priceActive = lowerPrice !== CATALOG_PRICE_MIN || upperPrice !== CATALOG_PRICE_MAX;

  return products.filter((product) => {
    const facts = laptopFacts(product.id);

    return (
      (!priceActive || (product.priceValue >= lowerPrice && product.priceValue <= upperPrice)) &&
      matchesList(filters.brands, product.brand) &&
      FACT_KEYS.every((key) =>
        matchesList(filters[key], facts === undefined ? undefined : factValue(facts, key)),
      )
    );
  });
}

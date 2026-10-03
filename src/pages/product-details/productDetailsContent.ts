import { HEADPHONES_CONTENT } from './content/headphones';
import { SMART_WATCHES_CONTENT } from './content/smartWatches';
import { SMARTPHONES_CONTENT } from './content/smartphones';
import type { ProductContentCategory, ProductDetailsContent } from './productDetailsContent.types';

export const PRODUCT_SPEC_TEMPLATES: Readonly<Record<ProductContentCategory, readonly string[]>> = {
  smartphones: [
    'Экран',
    'Производительность',
    'Камеры',
    'Питание',
    'Связь и интерфейсы',
    'Корпус',
    'Система',
  ],
  'smart-watches': [
    'Экран',
    'Производительность',
    'Здоровье и спорт',
    'Связь',
    'Питание',
    'Корпус',
    'Совместимость',
  ],
  headphones: ['Звук', 'Управление и чип', 'Питание', 'Связь', 'Корпус и защита', 'Совместимость'],
};

function buildRegistry(
  records: readonly ProductDetailsContent[],
): ReadonlyMap<string, ProductDetailsContent> {
  const registry = new Map<string, ProductDetailsContent>();

  for (const record of records) {
    if (registry.has(record.slug)) {
      throw new Error(`Duplicate Product Details content slug: ${record.slug}`);
    }

    registry.set(record.slug, record);
  }

  return registry;
}

export const PRODUCT_DETAILS_CONTENT: readonly ProductDetailsContent[] = [
  ...SMARTPHONES_CONTENT,
  ...SMART_WATCHES_CONTENT,
  ...HEADPHONES_CONTENT,
];

const registry = buildRegistry(PRODUCT_DETAILS_CONTENT);

export function getProductDetailsContent(slug: string): ProductDetailsContent | undefined {
  return registry.get(slug);
}

export function hasProductDetailsContent(slug: string): boolean {
  return registry.has(slug);
}

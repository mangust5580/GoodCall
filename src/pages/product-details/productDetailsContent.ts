import type { PictureSource } from '../../components/media';
import type { IconName } from '../../components/ui';
import type { CartLineImage } from '../cart/cartStore';
import { HEADPHONES_CONTENT } from './content/headphones';
import { SMART_WATCHES_CONTENT } from './content/smartWatches';
import { SMARTPHONES_CONTENT } from './content/smartphones';

export type ProductContentCategory = 'smartphones' | 'smart-watches' | 'headphones';

export interface ProductSpecRow {
  readonly label: string;
  readonly value: string;
  readonly key?: boolean;
}

export interface ProductSpecGroup {
  readonly title: string;
  readonly rows: readonly ProductSpecRow[];
}

export interface ProductAttribute {
  readonly label: string;
  readonly value: string;
}

export interface ProductFeature {
  readonly title: string;
  readonly text: string;
  readonly icon: IconName;
}

export interface ProductContentDescription {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly features: readonly ProductFeature[];
}

export interface ProductContentGalleryImage {
  readonly id: string;
  readonly source: PictureSource;
  readonly alt: string;
}

export interface ProductContentMedia {
  readonly gallery: readonly ProductContentGalleryImage[];
  readonly editorial?: PictureSource;
  readonly warranty?: PictureSource;
  readonly cartImage: CartLineImage;
}

export interface ProductDetailsContent {
  readonly slug: string;
  readonly category: ProductContentCategory;
  readonly attributes: readonly ProductAttribute[];
  readonly highlights: readonly string[];
  readonly description: ProductContentDescription;
  readonly specificationGroups: readonly ProductSpecGroup[];
  readonly media?: ProductContentMedia;
}

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

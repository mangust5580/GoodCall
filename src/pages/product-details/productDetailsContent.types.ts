import type { CartLineImage } from '../../commerce/cart';
import type { PictureSource } from '../../components/media';
import type { IconName } from '../../components/ui';

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

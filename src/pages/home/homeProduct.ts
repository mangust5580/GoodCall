import type { PictureSource } from '../../components/media';

export type HomeArtwork = 'smartphone' | 'earbuds' | 'watch' | 'headphones' | 'laptop' | 'tablet';

export interface HomeProduct {
  readonly id: string;
  readonly title: string;
  readonly imageSrc?: string;
  readonly thumbnail?: PictureSource;
  readonly imageAlt: string;
  readonly price: string;
  readonly priceValue: number;
  readonly oldPrice?: string;
  readonly oldPriceValue?: number;
  readonly badge?: string;
  readonly badgeTone?: 'sale' | 'new';
  readonly image: HomeArtwork;
}

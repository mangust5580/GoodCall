import { HOME_DEVICE_MEDIA } from '../../assets/media/home/homeMarketingMedia';
import type { PictureSource } from '../../components/media';
import type { IconName } from '../../components/ui';
import type {
  ProductAttribute,
  ProductContentCategory,
  ProductDetailsContent,
  ProductSpecGroup,
} from './productDetailsContent.types';
import type { ProductDetailsLiveProduct } from './productDetailsData';

export type ProductDetailsColourId = 'pink' | 'black' | 'blue';

export interface ProductDetailsColour {
  readonly id: ProductDetailsColourId;
  readonly label: string;
  readonly swatch: ProductDetailsColourId;
}

export interface ProductDetailsMemory {
  readonly id: string;
  readonly label: string;
}

export interface ProductDetailsGalleryImage {
  readonly id: string;
  readonly source: PictureSource;
  readonly alt: string;
}

export interface ProductDetailsGallery {
  readonly images: readonly ProductDetailsGalleryImage[];
  readonly decorative: boolean;
}

export interface ProductDetailsService {
  readonly kind: 'delivery' | 'warranty';
  readonly title: string;
  readonly lines: readonly string[];
  readonly icon: IconName;
}

export interface ProductDetailsPaymentMethod {
  readonly id: string;
  readonly label: string;
  readonly icon?: IconName;
  readonly mark?: {
    readonly src: string;
    readonly alt: string;
    readonly modifier: string;
  };
}

export interface ProductDetailsFeature {
  readonly title: string;
  readonly text: string;
  readonly icon: IconName;
}

export interface ProductDetailsDescription {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly features: readonly ProductDetailsFeature[];
}

export type ProductDetailsSpecification = ProductSpecGroup['rows'][number];

export type ProductDetailsSpecificationGroup = ProductSpecGroup;

export interface ProductDetailsReview {
  readonly id: string;
  readonly author: string;
  readonly date: string;
  readonly rating: number;
  readonly text: string;
  readonly avatarSrc?: string;
}

export interface ProductDetailsTrustItem {
  readonly title: string;
  readonly text: string;
  readonly icon: IconName;
}

export interface ProductDetailsStorewide {
  readonly installmentMonths: number;
  readonly services: readonly ProductDetailsService[];
  readonly paymentMethods: readonly ProductDetailsPaymentMethod[];
  readonly trust: readonly ProductDetailsTrustItem[];
  readonly supportPhone: string;
  readonly supportPhoneHref: string;
  readonly supportHours: string;
  readonly chatNote?: string;
}

export interface ProductDetailsVariants {
  readonly baseTitle: string;
  readonly colours: readonly ProductDetailsColour[];
  readonly defaultColourId: ProductDetailsColourId;
  readonly memories: readonly ProductDetailsMemory[];
  readonly defaultMemoryId: string;
  readonly galleryByColour: Readonly<
    Record<ProductDetailsColourId, readonly ProductDetailsGalleryImage[]>
  >;
}

export interface ProductDetailsAvailability {
  readonly status: string;
  readonly note: string;
}

export interface ProductDetailsView {
  readonly title: string;
  readonly categoryTitle: string;
  readonly priceValue: number;
  readonly oldPriceValue?: number;
  readonly discount?: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly labels: readonly string[];
  readonly installmentMonths: number;
  readonly attributes: readonly ProductAttribute[];
  readonly highlights: readonly string[];
  readonly gallery: ProductDetailsGallery;
  readonly description: ProductDetailsDescription;
  readonly descriptionImage?: PictureSource;
  readonly warrantyImage?: PictureSource;
  readonly specificationGroups: readonly ProductDetailsSpecificationGroup[];
  readonly services: readonly ProductDetailsService[];
  readonly paymentMethods: readonly ProductDetailsPaymentMethod[];
  readonly trust: readonly ProductDetailsTrustItem[];
  readonly supportPhone: string;
  readonly supportPhoneHref: string;
  readonly supportHours: string;
  readonly chatNote?: string;
  readonly variants?: ProductDetailsVariants;
  readonly sku?: string;
  readonly availability?: ProductDetailsAvailability;
  readonly bonusPoints?: number;
  readonly reviews?: readonly ProductDetailsReview[];
  readonly oneClickPurchase?: boolean;
}

export const NEW_PRODUCT_LABEL = 'Новинка';

const CATEGORY_ARTWORK: Readonly<Record<ProductContentCategory, PictureSource>> = {
  smartphones: HOME_DEVICE_MEDIA.smartphone,
  'smart-watches': HOME_DEVICE_MEDIA.watch,
  headphones: HOME_DEVICE_MEDIA.earbuds,
  laptops: HOME_DEVICE_MEDIA.laptop,
};

export function discountLabel(priceValue: number, oldPriceValue: number): string {
  return `-${String(Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100))}%`;
}

function productGallery(content: ProductDetailsContent): ProductDetailsGallery {
  const media = content.media;

  if (media !== undefined && media.gallery.length > 0) {
    return { images: media.gallery, decorative: false };
  }

  return {
    images: [{ id: 'category-artwork', source: CATEGORY_ARTWORK[content.category], alt: '' }],
    decorative: true,
  };
}

export function buildProductDetailsView(
  live: ProductDetailsLiveProduct,
  content: ProductDetailsContent,
  storewide: ProductDetailsStorewide,
): ProductDetailsView {
  const oldPriceValue =
    live.oldPriceValue !== undefined && live.oldPriceValue > live.priceValue
      ? live.oldPriceValue
      : undefined;

  return {
    title: live.name,
    categoryTitle: live.categoryName,
    priceValue: live.priceValue,
    oldPriceValue,
    discount:
      oldPriceValue === undefined ? undefined : discountLabel(live.priceValue, oldPriceValue),
    rating: live.rating,
    reviewCount: live.reviewCount,
    labels: live.isNew ? [NEW_PRODUCT_LABEL] : [],
    installmentMonths: storewide.installmentMonths,
    attributes: content.attributes,
    highlights: content.highlights,
    gallery: productGallery(content),
    description: content.description,
    descriptionImage: content.media?.editorial,
    warrantyImage: content.media?.warranty,
    specificationGroups: content.specificationGroups,
    services: storewide.services,
    paymentMethods: storewide.paymentMethods,
    trust: storewide.trust,
    supportPhone: storewide.supportPhone,
    supportPhoneHref: storewide.supportPhoneHref,
    supportHours: storewide.supportHours,
    ...(storewide.chatNote === undefined ? {} : { chatNote: storewide.chatNote }),
  };
}

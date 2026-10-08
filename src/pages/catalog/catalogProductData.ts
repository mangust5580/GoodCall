import { productThumbnail } from '../../assets/media/product-details/productThumbnailMedia';
import { supabaseClient } from '../../lib/supabase/client';
import type { GoodCallSupabaseClient } from '../../lib/supabase/client';
import type { Database } from '../../lib/supabase/database.types';
import type { CatalogProduct } from './catalogProduct';
import { CATALOG_PRODUCTS } from './catalogProducts';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductImageRow = Database['public']['Tables']['product_images']['Row'];

type CatalogProductDataResult =
  | {
      readonly status: 'ready';
      readonly products: readonly CatalogProduct[];
    }
  | {
      readonly status: 'unavailable' | 'failure';
      readonly reason: string;
    };

export type CatalogCategorySlug = 'smartphones' | 'laptops';

const CATALOG_MEDIA_BUCKET = 'catalog-media';
const fixturePresentationBySlug = new Map(CATALOG_PRODUCTS.map((product) => [product.id, product]));

function finiteNumber(value: number | null): number | undefined {
  return value === null || !Number.isFinite(value) ? undefined : value;
}

function saleBadge(priceValue: number, oldPriceValue: number | undefined): string | undefined {
  if (oldPriceValue === undefined || oldPriceValue <= priceValue) {
    return undefined;
  }

  return `-${String(Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100))}%`;
}

const NEW_PRODUCT_BADGE = 'Новинка';

const IMAGE_ALT_PREFIX: Readonly<Record<CatalogCategorySlug, string>> = {
  smartphones: 'Смартфон',
  laptops: 'Ноутбук',
};

function liveBadge(
  priceValue: number,
  oldPriceValue: number | undefined,
  isNew: boolean,
): Pick<CatalogProduct, 'badge' | 'discounted'> {
  const badge = saleBadge(priceValue, oldPriceValue);

  if (badge !== undefined) {
    return { badge, discounted: true };
  }

  return isNew ? { badge: NEW_PRODUCT_BADGE } : {};
}

function productBadge(
  presentation: CatalogProduct | undefined,
  priceValue: number,
  oldPriceValue: number | undefined,
): Pick<CatalogProduct, 'badge' | 'discounted'> {
  if (presentation?.discounted !== true) {
    return { badge: presentation?.badge };
  }

  const badge = saleBadge(priceValue, oldPriceValue);

  return badge === undefined ? {} : { badge, discounted: true };
}

function groupImagesByProduct(
  images: readonly ProductImageRow[],
): ReadonlyMap<string, readonly ProductImageRow[]> {
  const groups = new Map<string, ProductImageRow[]>();

  for (const image of images) {
    const current = groups.get(image.product_id);

    if (current === undefined) {
      groups.set(image.product_id, [image]);
    } else {
      current.push(image);
    }
  }

  return groups;
}

function mapCatalogProduct(
  client: GoodCallSupabaseClient,
  categorySlug: CatalogCategorySlug,
  product: ProductRow,
  images: readonly ProductImageRow[],
): CatalogProduct | undefined {
  if (!Number.isFinite(product.price) || !Number.isFinite(product.popularity_score)) {
    return undefined;
  }

  const presentation =
    categorySlug === 'smartphones' ? fixturePresentationBySlug.get(product.slug) : undefined;
  const primaryImage = images[0];
  const publicImage =
    primaryImage === undefined
      ? undefined
      : client.storage.from(CATALOG_MEDIA_BUCKET).getPublicUrl(primaryImage.storage_path).data
          .publicUrl;
  const oldPriceValue = finiteNumber(product.old_price);
  const rating = finiteNumber(product.rating);

  return {
    id: product.slug,
    title: product.name,
    imageSrc: publicImage,
    image: publicImage === undefined ? productThumbnail(product.slug) : undefined,
    imageAlt:
      primaryImage?.alt.trim() ||
      presentation?.imageAlt ||
      `${IMAGE_ALT_PREFIX[categorySlug]} ${product.name}`,
    priceValue: product.price,
    oldPriceValue,
    rating,
    reviewCount: product.review_count,
    brand: product.brand,
    ...(categorySlug === 'smartphones'
      ? productBadge(presentation, product.price, oldPriceValue)
      : liveBadge(product.price, oldPriceValue, product.is_new)),
    popularity: product.popularity_score,
  };
}

async function fetchProductImages(
  client: GoodCallSupabaseClient,
  productIds: readonly string[],
): Promise<readonly ProductImageRow[]> {
  if (productIds.length === 0) {
    return [];
  }

  const { data, error } = await client
    .from('product_images')
    .select('id, product_id, storage_path, alt, position')
    .in('product_id', productIds)
    .order('position', { ascending: true })
    .order('storage_path', { ascending: true });

  if (error !== null) {
    throw error;
  }

  return data;
}

export async function fetchCatalogProducts(
  categorySlug: CatalogCategorySlug,
): Promise<CatalogProductDataResult> {
  const client = supabaseClient;

  if (client === undefined) {
    return { status: 'unavailable', reason: 'supabase-env-missing' };
  }

  try {
    const { data: category, error: categoryError } = await client
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .eq('is_active', true)
      .maybeSingle();

    if (categoryError !== null) {
      return { status: 'failure', reason: categoryError.message };
    }

    if (category === null) {
      return { status: 'failure', reason: `${categorySlug}-category-missing` };
    }

    const { data: products, error: productsError } = await client
      .from('products')
      .select(
        'id, category_id, slug, name, brand, price, old_price, rating, review_count, is_new, popularity_score, is_active, created_at',
      )
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('popularity_score', { ascending: false })
      .order('slug', { ascending: true });

    if (productsError !== null) {
      return { status: 'failure', reason: productsError.message };
    }

    if (products.length === 0) {
      return { status: 'failure', reason: `${categorySlug}-products-empty` };
    }

    const images = await fetchProductImages(
      client,
      products.map((product) => product.id),
    );
    const imagesByProduct = groupImagesByProduct(images);
    const mappedProducts = products
      .map((product) =>
        mapCatalogProduct(client, categorySlug, product, imagesByProduct.get(product.id) ?? []),
      )
      .filter((product): product is CatalogProduct => product !== undefined);

    if (mappedProducts.length === 0) {
      return { status: 'failure', reason: `${categorySlug}-products-invalid` };
    }

    return { status: 'ready', products: mappedProducts };
  } catch (error) {
    return {
      status: 'failure',
      reason: error instanceof Error ? error.message : 'catalog-products-query-failed',
    };
  }
}

import { supabaseClient } from '../../lib/supabase/client';
import type { GoodCallSupabaseClient } from '../../lib/supabase/client';
import type { Database } from '../../lib/supabase/database.types';
import { CATALOG_PRODUCTS } from './catalogProductFixtures';
import type { CatalogProduct } from './catalogProductFixtures';

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

const SMARTPHONES_SLUG = 'smartphones';
const CATALOG_MEDIA_BUCKET = 'catalog-media';
const fixturePresentationBySlug = new Map(CATALOG_PRODUCTS.map((product) => [product.id, product]));

function finiteNumber(value: number | null): number | undefined {
  return value === null || !Number.isFinite(value) ? undefined : value;
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
  product: ProductRow,
  images: readonly ProductImageRow[],
): CatalogProduct | undefined {
  if (!Number.isFinite(product.price) || !Number.isFinite(product.popularity_score)) {
    return undefined;
  }

  const presentation = fixturePresentationBySlug.get(product.slug);
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
    imageAlt: primaryImage?.alt.trim() || presentation?.imageAlt || `Смартфон ${product.name}`,
    priceValue: product.price,
    oldPriceValue,
    rating,
    reviewCount: product.review_count,
    badge: presentation?.badge,
    discounted: presentation?.discounted,
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

export async function fetchCatalogProducts(): Promise<CatalogProductDataResult> {
  const client = supabaseClient;

  if (client === undefined) {
    return { status: 'unavailable', reason: 'supabase-env-missing' };
  }

  try {
    const { data: category, error: categoryError } = await client
      .from('categories')
      .select('id')
      .eq('slug', SMARTPHONES_SLUG)
      .eq('is_active', true)
      .maybeSingle();

    if (categoryError !== null) {
      return { status: 'failure', reason: categoryError.message };
    }

    if (category === null) {
      return { status: 'failure', reason: 'smartphones-category-missing' };
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
      return { status: 'failure', reason: 'smartphones-products-empty' };
    }

    const images = await fetchProductImages(
      client,
      products.map((product) => product.id),
    );
    const imagesByProduct = groupImagesByProduct(images);
    const mappedProducts = products
      .map((product) => mapCatalogProduct(client, product, imagesByProduct.get(product.id) ?? []))
      .filter((product): product is CatalogProduct => product !== undefined);

    if (mappedProducts.length === 0) {
      return { status: 'failure', reason: 'smartphones-products-invalid' };
    }

    return { status: 'ready', products: mappedProducts };
  } catch (error) {
    return {
      status: 'failure',
      reason: error instanceof Error ? error.message : 'catalog-products-query-failed',
    };
  }
}

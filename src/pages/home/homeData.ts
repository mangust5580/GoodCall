import { supabaseClient } from '../../lib/supabase/client';
import type { GoodCallSupabaseClient } from '../../lib/supabase/client';
import type { Database } from '../../lib/supabase/database.types';
import { HOME_CATEGORY_TILES } from './homeFixtures';
import type { HomeArtwork, HomeCategoryTile, HomeProduct } from './homeFixtures';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductImageRow = Database['public']['Tables']['product_images']['Row'];
type HomePopularProductRow = Database['public']['Tables']['home_popular_products']['Row'];

type HomeDataResult =
  | {
      readonly status: 'ready';
      readonly categories: readonly HomeCategoryTile[];
      readonly products: readonly HomeProduct[];
    }
  | {
      readonly status: 'unavailable' | 'failure';
      readonly reason: string;
    };

interface HomeProductPresentation {
  readonly badge?: string;
  readonly badgeTone?: 'sale' | 'new';
  readonly image: HomeArtwork;
  readonly imageAlt: string;
}

const CATALOG_MEDIA_BUCKET = 'catalog-media';
const EXPECTED_CATEGORY_COUNT = HOME_CATEGORY_TILES.length;
const EXPECTED_PRODUCT_POSITIONS = [1, 2, 3, 4, 5] as const;
const iconByCategorySlug = new Map(
  HOME_CATEGORY_TILES.map((category) => [category.slug, category.icon]),
);
const productPresentationBySlug = new Map<string, HomeProductPresentation>([
  [
    'iphone-15-128',
    {
      badge: '-12%',
      badgeTone: 'sale',
      image: 'phone',
      imageAlt: 'Смартфон Apple iPhone 15',
    },
  ],
  [
    'galaxy-s24-128',
    {
      badge: 'Новинка',
      badgeTone: 'new',
      image: 'phone',
      imageAlt: 'Смартфон Samsung Galaxy S24',
    },
  ],
  [
    'redmi-note-13-pro-256',
    {
      badge: '-10%',
      badgeTone: 'sale',
      image: 'phone',
      imageAlt: 'Смартфон Xiaomi Redmi Note 13 Pro',
    },
  ],
  [
    'airpods-pro-2-usb-c',
    {
      image: 'earbuds',
      imageAlt: 'Беспроводные наушники Apple AirPods Pro 2',
    },
  ],
  [
    'apple-watch-series-9-45',
    {
      badge: '-15%',
      badgeTone: 'sale',
      image: 'earbuds',
      imageAlt: 'Смарт-часы Apple Watch Series 9',
    },
  ],
]);

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

function formatPrice(value: number): string {
  return priceFormatter.format(value);
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

function mapCategory(category: CategoryRow): HomeCategoryTile | undefined {
  const icon = iconByCategorySlug.get(category.slug);

  if (icon === undefined) {
    return undefined;
  }

  return {
    slug: category.slug,
    label: category.name,
    icon,
  };
}

function mapProduct(
  client: GoodCallSupabaseClient,
  product: ProductRow,
  images: readonly ProductImageRow[],
): HomeProduct | undefined {
  if (!Number.isFinite(product.price)) {
    return undefined;
  }

  const presentation = productPresentationBySlug.get(product.slug);

  if (presentation === undefined) {
    return undefined;
  }

  const primaryImage = images[0];
  const imageSrc =
    primaryImage === undefined
      ? undefined
      : client.storage.from(CATALOG_MEDIA_BUCKET).getPublicUrl(primaryImage.storage_path).data
          .publicUrl;
  const oldPrice =
    product.old_price === null || !Number.isFinite(product.old_price)
      ? undefined
      : formatPrice(product.old_price);

  return {
    id: product.slug,
    title: product.name,
    imageSrc,
    imageAlt: primaryImage?.alt.trim() || presentation.imageAlt,
    price: formatPrice(product.price),
    oldPrice,
    badge: presentation.badge,
    badgeTone: presentation.badgeTone,
    image: presentation.image,
  };
}

async function fetchCategories(client: GoodCallSupabaseClient): Promise<readonly CategoryRow[]> {
  const { data, error } = await client
    .from('categories')
    .select(
      'id, slug, name, sort_order, is_active, merchandising_media_path, merchandising_media_alt',
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('slug', { ascending: true });

  if (error !== null) {
    throw error;
  }

  return data;
}

async function fetchHomePopularProducts(
  client: GoodCallSupabaseClient,
): Promise<readonly HomePopularProductRow[]> {
  const { data, error } = await client
    .from('home_popular_products')
    .select('position, product_id')
    .order('position', { ascending: true });

  if (error !== null) {
    throw error;
  }

  return data;
}

async function fetchProducts(
  client: GoodCallSupabaseClient,
  productIds: readonly string[],
): Promise<readonly ProductRow[]> {
  const { data, error } = await client
    .from('products')
    .select(
      'id, category_id, slug, name, brand, price, old_price, rating, review_count, is_new, popularity_score, is_active, created_at',
    )
    .in('id', productIds)
    .eq('is_active', true);

  if (error !== null) {
    throw error;
  }

  return data;
}

async function fetchProductImages(
  client: GoodCallSupabaseClient,
  productIds: readonly string[],
): Promise<readonly ProductImageRow[]> {
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

function positionsAreValid(rows: readonly HomePopularProductRow[]): boolean {
  return (
    rows.length === EXPECTED_PRODUCT_POSITIONS.length &&
    rows.every((row, index) => row.position === EXPECTED_PRODUCT_POSITIONS[index])
  );
}

export async function fetchHomeData(): Promise<HomeDataResult> {
  const client = supabaseClient;

  if (client === undefined) {
    return { status: 'unavailable', reason: 'supabase-env-missing' };
  }

  try {
    const categoryRows = await fetchCategories(client);
    const categories = categoryRows
      .map((category) => mapCategory(category))
      .filter((category): category is HomeCategoryTile => category !== undefined);

    if (categories.length !== EXPECTED_CATEGORY_COUNT) {
      return { status: 'failure', reason: 'home-categories-invalid' };
    }

    const activeCategoryIds = new Set(categoryRows.map((category) => category.id));
    const curatedRows = await fetchHomePopularProducts(client);

    if (!positionsAreValid(curatedRows)) {
      return { status: 'failure', reason: 'home-popular-products-invalid' };
    }

    const productIds = curatedRows.map((row) => row.product_id);
    const productRows = await fetchProducts(client, productIds);
    const productById = new Map(productRows.map((product) => [product.id, product]));

    if (productRows.length !== productIds.length) {
      return { status: 'failure', reason: 'home-popular-products-missing' };
    }

    const images = await fetchProductImages(client, productIds);
    const imagesByProduct = groupImagesByProduct(images);
    const products = curatedRows
      .map((row) => {
        const product = productById.get(row.product_id);

        if (product === undefined || !activeCategoryIds.has(product.category_id)) {
          return undefined;
        }

        return mapProduct(client, product, imagesByProduct.get(product.id) ?? []);
      })
      .filter((product): product is HomeProduct => product !== undefined);

    if (products.length !== EXPECTED_PRODUCT_POSITIONS.length) {
      return { status: 'failure', reason: 'home-products-invalid' };
    }

    return { status: 'ready', categories, products };
  } catch (error) {
    return {
      status: 'failure',
      reason: error instanceof Error ? error.message : 'home-query-failed',
    };
  }
}

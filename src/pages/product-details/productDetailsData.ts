import { supabaseClient } from '../../lib/supabase/client';

export interface ProductDetailsLiveProduct {
  readonly slug: string;
  readonly name: string;
  readonly brand: string;
  readonly categorySlug: string;
  readonly categoryName: string;
  readonly priceValue: number;
  readonly oldPriceValue?: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly isNew: boolean;
}

export type ProductDetailsDataResult =
  | {
      readonly status: 'ready';
      readonly product: ProductDetailsLiveProduct;
    }
  | {
      readonly status: 'not-found';
    }
  | {
      readonly status: 'unavailable' | 'failure';
      readonly reason: string;
    };

export async function fetchProductDetails(slug: string): Promise<ProductDetailsDataResult> {
  const client = supabaseClient;

  if (client === undefined) {
    return { status: 'unavailable', reason: 'supabase-env-missing' };
  }

  try {
    const { data: product, error } = await client
      .from('products')
      .select(
        'slug, name, brand, price, old_price, rating, review_count, is_new, is_active, categories(slug, name)',
      )
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error !== null) {
      return { status: 'failure', reason: error.message };
    }

    if (product === null) {
      return { status: 'not-found' };
    }

    const category = product.categories;

    if (
      !Number.isFinite(product.price) ||
      product.rating === null ||
      !Number.isFinite(product.rating) ||
      !Number.isFinite(product.review_count) ||
      category === null
    ) {
      return { status: 'failure', reason: 'product-details-invalid' };
    }

    return {
      status: 'ready',
      product: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        categorySlug: category.slug,
        categoryName: category.name,
        priceValue: product.price,
        oldPriceValue:
          product.old_price === null || !Number.isFinite(product.old_price)
            ? undefined
            : product.old_price,
        rating: product.rating,
        reviewCount: product.review_count,
        isNew: product.is_new,
      },
    };
  } catch (error) {
    return {
      status: 'failure',
      reason: error instanceof Error ? error.message : 'product-details-query-failed',
    };
  }
}

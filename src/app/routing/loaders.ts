import { type LoaderFunctionArgs } from 'react-router-dom';
import { categorySlugSchema, productSlugSchema } from './registry';

export async function categoryLoader({ params }: LoaderFunctionArgs) {
  const slug = params.categorySlug;
  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  const result = categorySlugSchema.safeParse(slug);
  if (!result.success) {
    throw new Response('Not Found', { status: 404 });
  }

  return { slug: result.data };
}

export async function productLoader({ params }: LoaderFunctionArgs) {
  const slug = params.productSlug;
  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  const result = productSlugSchema.safeParse(slug);
  if (!result.success) {
    throw new Response('Not Found', { status: 404 });
  }

  return { slug: result.data };
}

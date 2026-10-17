import { hasBlogArticleDetail } from '../../pages/blog/teasers';
import { blogArticlePath, hashHref } from '../routePaths';

export function blogArticleHref(slug: string): string | undefined {
  return hasBlogArticleDetail(slug) ? hashHref(blogArticlePath(slug)) : undefined;
}

import { HashRouter, Route, Routes } from 'react-router-dom';

import { BlogArticleRoute } from './BlogArticleRoute';
import { BlogRoute } from './BlogRoute';
import { CartRoute } from './CartRoute';
import { CatalogRoute } from './CatalogRoute';
import { CheckoutRoute } from './CheckoutRoute';
import { FavoritesRoute } from './FavoritesRoute';
import { HomeRoute } from './HomeRoute';
import { NotFoundRoute } from './NotFoundRoute';
import { ProductDetailsRoute } from './ProductDetailsRoute';
import { RouteScrollReset } from './RouteScrollReset';
import { SearchRoute } from './SearchRoute';
import { ShopsRoute } from './ShopsRoute';
import {
  BLOG_ARTICLE_PATH,
  BLOG_PATH,
  CART_PATH,
  CATALOG_SMARTPHONES_PATH,
  CHECKOUT_PATH,
  FAVORITES_PATH,
  HOME_PATH,
  PRODUCT_PATH,
  SEARCH_PATH,
  SHOPS_PATH,
} from './routes';

export function ProductionRouter() {
  return (
    <HashRouter>
      <RouteScrollReset />
      <Routes>
        <Route element={<HomeRoute />} path={HOME_PATH} />
        <Route element={<CatalogRoute />} path={CATALOG_SMARTPHONES_PATH} />
        <Route element={<ProductDetailsRoute />} path={PRODUCT_PATH} />
        <Route element={<CartRoute />} path={CART_PATH} />
        <Route element={<CheckoutRoute />} path={CHECKOUT_PATH} />
        <Route element={<FavoritesRoute />} path={FAVORITES_PATH} />
        <Route element={<SearchRoute />} path={SEARCH_PATH} />
        <Route element={<ShopsRoute />} path={SHOPS_PATH} />
        <Route element={<BlogRoute />} path={BLOG_PATH} />
        <Route element={<BlogArticleRoute />} path={BLOG_ARTICLE_PATH} />
        <Route element={<NotFoundRoute />} path="*" />
      </Routes>
    </HashRouter>
  );
}

import { HashRouter, Route, Routes } from 'react-router-dom';

import { BlogRoute } from './BlogRoute';
import { CartRoute } from './CartRoute';
import { CatalogRoute } from './CatalogRoute';
import { HomeRoute } from './HomeRoute';
import { NotFoundRoute } from './NotFoundRoute';
import { ProductDetailsRoute } from './ProductDetailsRoute';
import { RouteScrollReset } from './RouteScrollReset';
import { SearchRoute } from './SearchRoute';
import {
  BLOG_PATH,
  CART_PATH,
  CATALOG_SMARTPHONES_PATH,
  HOME_PATH,
  PRODUCT_PATH,
  SEARCH_PATH,
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
        <Route element={<SearchRoute />} path={SEARCH_PATH} />
        <Route element={<BlogRoute />} path={BLOG_PATH} />
        <Route element={<NotFoundRoute />} path="*" />
      </Routes>
    </HashRouter>
  );
}

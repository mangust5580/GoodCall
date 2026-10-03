import { HashRouter, Route, Routes } from 'react-router-dom';

import { RouteScrollReset } from './RouteScrollReset';
import {
  BLOG_ARTICLE_PATH,
  BLOG_PATH,
  CART_PATH,
  CATALOG_SMARTPHONES_PATH,
  CHECKOUT_PATH,
  COMPARE_PATH,
  DELIVERY_PATH,
  FAQ_PATH,
  FAVORITES_PATH,
  HOME_PATH,
  ORDER_CONFIRMATION_PATH,
  PRODUCT_PATH,
  SEARCH_PATH,
  SHOPS_PATH,
  WARRANTY_PATH,
} from './routePaths';
import { BlogArticleRoute } from './routes/BlogArticleRoute';
import { BlogRoute } from './routes/BlogRoute';
import { CartRoute } from './routes/CartRoute';
import { CatalogRoute } from './routes/CatalogRoute';
import { CheckoutRoute } from './routes/CheckoutRoute';
import { CompareRoute } from './routes/CompareRoute';
import { FavoritesRoute } from './routes/FavoritesRoute';
import { HomeRoute } from './routes/HomeRoute';
import { DeliveryRoute, FaqRoute, WarrantyRoute } from './routes/InfoRoutes';
import { NotFoundRoute } from './routes/NotFoundRoute';
import { OrderConfirmationRoute } from './routes/OrderConfirmationRoute';
import { ProductDetailsRoute } from './routes/ProductDetailsRoute';
import { SearchRoute } from './routes/SearchRoute';
import { ShopsRoute } from './routes/ShopsRoute';

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
        <Route element={<OrderConfirmationRoute />} path={ORDER_CONFIRMATION_PATH} />
        <Route element={<FavoritesRoute />} path={FAVORITES_PATH} />
        <Route element={<CompareRoute />} path={COMPARE_PATH} />
        <Route element={<SearchRoute />} path={SEARCH_PATH} />
        <Route element={<ShopsRoute />} path={SHOPS_PATH} />
        <Route element={<DeliveryRoute />} path={DELIVERY_PATH} />
        <Route element={<WarrantyRoute />} path={WARRANTY_PATH} />
        <Route element={<FaqRoute />} path={FAQ_PATH} />
        <Route element={<BlogRoute />} path={BLOG_PATH} />
        <Route element={<BlogArticleRoute />} path={BLOG_ARTICLE_PATH} />
        <Route element={<NotFoundRoute />} path="*" />
      </Routes>
    </HashRouter>
  );
}

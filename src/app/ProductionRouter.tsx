import { HashRouter, Route, Routes } from 'react-router-dom';

import { RouteScrollReset } from './RouteScrollReset';
import {
  ABOUT_PATH,
  ACCOUNT_ADDRESSES_PATH,
  ACCOUNT_ORDERS_PATH,
  ACCOUNT_PATH,
  ACCOUNT_PROFILE_PATH,
  BLOG_ARTICLE_PATH,
  BLOG_PATH,
  CART_PATH,
  CATALOG_LAPTOPS_PATH,
  CATALOG_SMARTPHONES_PATH,
  CHECKOUT_PATH,
  COMPARE_PATH,
  CONTACTS_PATH,
  DELIVERY_PATH,
  FAQ_PATH,
  FAVORITES_PATH,
  HOME_PATH,
  LOGIN_PATH,
  OFFER_PATH,
  ORDER_CONFIRMATION_PATH,
  PRIVACY_PATH,
  PRODUCT_PATH,
  SEARCH_PATH,
  SHOPS_PATH,
  TERMS_PATH,
  WARRANTY_PATH,
} from './routePaths';
import { CartRoute } from './routes/CartRoute';
import { CatalogLaptopsRoute } from './routes/CatalogLaptopsRoute';
import { CatalogRoute } from './routes/CatalogRoute';
import { CompareRoute } from './routes/CompareRoute';
import { FavoritesRoute } from './routes/FavoritesRoute';
import { HomeRoute } from './routes/HomeRoute';
import { LazyAccountFlowRoute } from './routes/LazyAccountFlowRoute';
import { LazyBlogFlowRoute } from './routes/LazyBlogFlowRoute';
import { LazyInfoRoute } from './routes/LazyInfoRoute';
import { NotFoundRoute } from './routes/NotFoundRoute';
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
        <Route element={<CatalogLaptopsRoute />} path={CATALOG_LAPTOPS_PATH} />
        <Route element={<ProductDetailsRoute />} path={PRODUCT_PATH} />
        <Route element={<CartRoute />} path={CART_PATH} />
        <Route
          element={<LazyAccountFlowRoute key="checkout" name="checkout" />}
          path={CHECKOUT_PATH}
        />
        <Route
          element={<LazyAccountFlowRoute key="order-confirmation" name="order-confirmation" />}
          path={ORDER_CONFIRMATION_PATH}
        />
        <Route element={<FavoritesRoute />} path={FAVORITES_PATH} />
        <Route element={<CompareRoute />} path={COMPARE_PATH} />
        <Route element={<SearchRoute />} path={SEARCH_PATH} />
        <Route element={<ShopsRoute />} path={SHOPS_PATH} />
        <Route element={<LazyInfoRoute key="delivery" name="delivery" />} path={DELIVERY_PATH} />
        <Route element={<LazyInfoRoute key="warranty" name="warranty" />} path={WARRANTY_PATH} />
        <Route element={<LazyInfoRoute key="faq" name="faq" />} path={FAQ_PATH} />
        <Route element={<LazyInfoRoute key="contacts" name="contacts" />} path={CONTACTS_PATH} />
        <Route element={<LazyInfoRoute key="about" name="about" />} path={ABOUT_PATH} />
        <Route element={<LazyInfoRoute key="privacy" name="privacy" />} path={PRIVACY_PATH} />
        <Route element={<LazyInfoRoute key="terms" name="terms" />} path={TERMS_PATH} />
        <Route element={<LazyInfoRoute key="offer" name="offer" />} path={OFFER_PATH} />
        <Route
          element={<LazyBlogFlowRoute key="blog" name="blog" notFound={<NotFoundRoute />} />}
          path={BLOG_PATH}
        />
        <Route
          element={
            <LazyBlogFlowRoute
              key="blog-article"
              name="blog-article"
              notFound={<NotFoundRoute />}
            />
          }
          path={BLOG_ARTICLE_PATH}
        />
        <Route element={<LazyAccountFlowRoute key="login" name="login" />} path={LOGIN_PATH} />
        <Route
          element={<LazyAccountFlowRoute key="account" name="account" />}
          path={ACCOUNT_PATH}
        />
        <Route
          element={<LazyAccountFlowRoute key="account-orders" name="account-orders" />}
          path={ACCOUNT_ORDERS_PATH}
        />
        <Route
          element={<LazyAccountFlowRoute key="account-profile" name="account-profile" />}
          path={ACCOUNT_PROFILE_PATH}
        />
        <Route
          element={<LazyAccountFlowRoute key="account-addresses" name="account-addresses" />}
          path={ACCOUNT_ADDRESSES_PATH}
        />
        <Route element={<NotFoundRoute />} path="*" />
      </Routes>
    </HashRouter>
  );
}

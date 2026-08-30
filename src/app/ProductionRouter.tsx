import { HashRouter, Link, Route, Routes } from 'react-router-dom';

import { Container } from '../components/layout';
import { CatalogRoute } from './CatalogRoute';
import { HomeRoute } from './HomeRoute';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH } from './routes';

import './ProductionRouter.scss';

function RouteNotFound() {
  return (
    <main className="route-not-found">
      <Container className="route-not-found__inner">
        <h1 className="route-not-found__title">Страница не найдена</h1>
        <p className="route-not-found__message">Такой страницы пока нет. Вернитесь на главную.</p>
        <Link className="ui-button ui-button--primary route-not-found__action" to={HOME_PATH}>
          На главную
        </Link>
      </Container>
    </main>
  );
}

export function ProductionRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<HomeRoute />} path={HOME_PATH} />
        <Route element={<CatalogRoute />} path={CATALOG_SMARTPHONES_PATH} />
        <Route element={<RouteNotFound />} path="*" />
      </Routes>
    </HashRouter>
  );
}

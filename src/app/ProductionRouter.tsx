import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

import { Container } from '../components/layout';
import { CatalogRoute } from './CatalogRoute';

import './ProductionRouter.scss';

const CATALOG_SMARTPHONES_PATH = '/catalog/smartphones';

function RouteNotFound() {
  return (
    <main className="route-not-found">
      <Container className="route-not-found__inner">
        <h1 className="route-not-found__title">Страница не найдена</h1>
        <p className="route-not-found__message">
          Такой страницы пока нет. Откройте каталог смартфонов.
        </p>
        <Link
          className="ui-button ui-button--primary route-not-found__action"
          to={CATALOG_SMARTPHONES_PATH}
        >
          Каталог смартфонов
        </Link>
      </Container>
    </main>
  );
}

export function ProductionRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Navigate replace to={CATALOG_SMARTPHONES_PATH} />} path="/" />
        <Route element={<CatalogRoute />} path={CATALOG_SMARTPHONES_PATH} />
        <Route element={<RouteNotFound />} path="*" />
      </Routes>
    </HashRouter>
  );
}

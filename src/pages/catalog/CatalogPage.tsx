import { Container } from '../../components/layout';

export interface CatalogPageProps {
  readonly resultCount?: number;
}

const CATEGORY_TITLE = 'Смартфоны';
const DEFAULT_RESULT_COUNT = 2546;
const CURRENT_SORT = 'Сначала популярные';

const countFormatter = new Intl.NumberFormat('ru-RU');

export function CatalogPage({ resultCount = DEFAULT_RESULT_COUNT }: CatalogPageProps) {
  const home = import.meta.env.BASE_URL;

  return (
    <main className="catalog-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="catalog-page__breadcrumbs">
          <ol className="catalog-page__crumbs">
            <li className="catalog-page__crumb">
              <a className="catalog-page__crumb-link" href={home}>
                Главная
              </a>
            </li>
            <li className="catalog-page__crumb">Каталог</li>
            <li aria-current="page" className="catalog-page__crumb">
              {CATEGORY_TITLE}
            </li>
          </ol>
        </nav>

        <div className="catalog-page__layout">
          <header className="catalog-page__heading">
            <div className="catalog-page__heading-group">
              <h1 className="catalog-page__title">{CATEGORY_TITLE}</h1>
              <p className="catalog-page__count">{countFormatter.format(resultCount)} товаров</p>
            </div>
            <p className="catalog-page__sort">
              Сортировка: <span className="catalog-page__sort-value">{CURRENT_SORT}</span>
            </p>
          </header>

          <aside aria-label="Фильтры каталога" className="catalog-page__sidebar">
            <div className="catalog-page__reserved catalog-page__reserved--filters" />
          </aside>

          <section aria-label="Товары каталога" className="catalog-page__results">
            <div className="catalog-page__reserved catalog-page__reserved--products" />
          </section>
        </div>
      </Container>
    </main>
  );
}

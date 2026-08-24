import { useState } from 'react';

import { Container } from '../components/layout';
import { SiteHeader } from '../components/shell';

import './HeaderReference.scss';

export function HeaderReference() {
  const base = import.meta.env.BASE_URL;
  const [submitted, setSubmitted] = useState('');

  return (
    <div className="header-reference">
      <SiteHeader
        cartCount={2}
        comparisonCount={3}
        favoritesCount={12}
        onSearchSubmit={setSubmitted}
      />

      <main className="header-reference__body">
        <Container className="header-reference__inner">
          <h1 className="header-reference__title">Global Shell / SiteHeader</h1>
          <p className="header-reference__note">
            Temporary development reference for the canonical GoodCall header. Everything above this
            block is the real production <code>SiteHeader</code>: one brand-purple utility row, one
            main row with brand, catalog entry, search and the four user actions, and one category
            navigation row. Each row is a full-width region whose content sits in the accepted
            Container, so all three rows share the same inner horizontal edges.
          </p>
          <p className="header-reference__note">
            This page body is reference-only. It is not a Home page, and no hero, catalog, footer or
            newsletter is implemented. Header destinations are injected by the consumer; with no
            router installed they resolve to the site root.
          </p>
          <p aria-live="polite" className="header-reference__status">
            {submitted ? `Поисковый запрос: ${submitted}` : 'Поиск ещё не отправлен'}
          </p>
          <a className="header-reference__back" href={base}>
            Back to reference index
          </a>
        </Container>
      </main>
    </div>
  );
}

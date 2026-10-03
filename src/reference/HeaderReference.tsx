import { useState } from 'react';

import { Container } from '../components/layout';
import { MobileActionBar, SiteHeader } from '../components/shell';
import { referenceUrl } from './referenceUrl';

import './HeaderReference.scss';

export function HeaderReference() {
  const index = referenceUrl('index');
  const [status, setStatus] = useState('');

  return (
    <div className="header-reference">
      <SiteHeader
        cartCount={2}
        comparisonCount={3}
        favoritesCount={12}
        onScanRequest={() => {
          setStatus('Запрошено сканирование QR-кода');
        }}
        onSearchSubmit={(value) => {
          setStatus(`Поисковый запрос: ${value}`);
        }}
      />

      <main className="header-reference__body">
        <Container className="header-reference__inner">
          <h1 className="header-reference__title">Global Shell / SiteHeader</h1>
          <p className="header-reference__note">
            Temporary development reference for the canonical GoodCall shell navigation. Everything
            above this block is the real production <code>SiteHeader</code>: one brand-purple
            utility row, one main row with brand, catalog entry and search, and one category
            navigation row. Each row is a full-width region whose content sits in the accepted
            Container, so all three rows share the same inner horizontal edges.
          </p>
          <p className="header-reference__note">
            Below 768px the four user actions leave the header and appear in the real production{' '}
            <code>MobileActionBar</code> fixed to the bottom of the viewport, and the search gains a
            QR action. The QR button is presentation only: it reports the request below and performs
            no camera access or scanning.
          </p>
          <p className="header-reference__note">
            This page body is reference-only. It is not a Home page, and no hero, catalog, footer or
            newsletter is implemented. Header destinations are injected by the consumer; the
            production routes behind them do not exist yet, so they resolve to the app base.
          </p>
          <p aria-live="polite" className="header-reference__status">
            {status || 'Поиск ещё не отправлен'}
          </p>
          <a className="header-reference__back" href={index}>
            Back to reference index
          </a>
        </Container>
      </main>

      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}

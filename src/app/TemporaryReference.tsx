import { referenceUrl } from './referenceUrl';

import './TemporaryReference.scss';

export function ReferenceIndex() {
  return (
    <main className="temporary-reference">
      <h1 className="temporary-reference__title">GoodCall</h1>
      <p className="temporary-reference__note">
        Temporary development reference surfaces. These are not product pages and will be removed
        once the reference surfaces are no longer needed.
      </p>
      <ul className="temporary-reference__links">
        <li>
          <a href={referenceUrl('foundations')}>Foundations reference</a>
        </li>
        <li>
          <a href={referenceUrl('components')}>Components reference</a>
        </li>
        <li>
          <a href={referenceUrl('layout')}>Layout reference</a>
        </li>
        <li>
          <a href={referenceUrl('header')}>Header reference</a>
        </li>
        <li>
          <a href={referenceUrl('location')}>Location reference</a>
        </li>
        <li>
          <a href={referenceUrl('newsletter')}>Newsletter reference</a>
        </li>
        <li>
          <a href={referenceUrl('footer')}>Footer reference</a>
        </li>
        <li>
          <a href={referenceUrl('catalog')}>Catalog reference</a>
        </li>
      </ul>
    </main>
  );
}

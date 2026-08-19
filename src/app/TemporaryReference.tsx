import './TemporaryReference.scss';

const referenceUrl = (name: string): string => `${import.meta.env.BASE_URL}?reference=${name}`;

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
      </ul>
    </main>
  );
}

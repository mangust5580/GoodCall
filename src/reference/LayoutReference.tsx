import { Container } from '../components/layout';
import { referenceUrl } from './referenceUrl';

import './LayoutReference.scss';

const BLOCKS = ['Block 1', 'Block 2', 'Block 3', 'Block 4'] as const;

export function LayoutReference() {
  return (
    <main className="layout-reference">
      <section className="layout-reference__band layout-reference__band--a">
        <Container>
          <div className="layout-reference__surface">
            <h1 className="layout-reference__title">Layout / Container</h1>
            <p className="layout-reference__note">
              Temporary development reference for the canonical Container primitive. Container owns
              centred horizontal content width, a 1440px maximum outer border-box width and
              responsive horizontal gutters. It owns no vertical spacing, background, border or
              semantics. The bands on this page are full-width surfaces; only their content is
              constrained.
            </p>
          </div>
        </Container>
      </section>

      <section className="layout-reference__band layout-reference__band--b">
        <Container>
          <div className="layout-reference__surface">
            <h2 className="layout-reference__heading">Second full-width band</h2>
            <p className="layout-reference__note">
              The inner edges of this surface must align exactly with the band above and the band
              below, at every viewport width.
            </p>
          </div>
        </Container>
      </section>

      <section className="layout-reference__band layout-reference__band--c">
        <Container>
          <div className="layout-reference__surface">
            <h2 className="layout-reference__heading">Reflowing content</h2>
            <ul className="layout-reference__blocks">
              {BLOCKS.map((block) => (
                <li className="layout-reference__block" key={block}>
                  {block}
                </li>
              ))}
            </ul>
            <p className="layout-reference__measure">
              ContainerMaximumOuterWidth1440pxIncludingHorizontalPaddingUnbrokenStringOverflowProbe
            </p>
          </div>
        </Container>
      </section>

      <section className="layout-reference__band">
        <Container>
          <a className="layout-reference__back" href={referenceUrl('index')}>
            Back to reference index
          </a>
        </Container>
      </section>
    </main>
  );
}

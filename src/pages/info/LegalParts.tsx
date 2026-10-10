import { useState } from 'react';
import type { ReactNode } from 'react';

import { Container } from '../../components/layout';
import { Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';
import { InfoPageHeader } from './InfoPageHeader';
import { legalSectionTitle } from './legalSection';
import type { LegalContentsItem, LegalSection } from './legalSection';

const DEFAULT_LEGAL_UPDATED_DATE = '4 октября 2026 г.';

function legalHeadingId(id: string): string {
  return `${id}-title`;
}

function focusLegalSection(id: string) {
  const heading = document.getElementById(legalHeadingId(id));

  if (heading === null) {
    return;
  }

  heading.closest('section')?.scrollIntoView({ block: 'start' });
  heading.focus({ preventScroll: true });
}

interface LegalContentsProps {
  readonly titleId: string;
  readonly icon: IconName;
  readonly items: readonly LegalContentsItem[];
  readonly onNavigate: (id: string) => void;
}

export function LegalContents({ titleId, icon, items, onNavigate }: LegalContentsProps) {
  const [currentId, setCurrentId] = useState(items[0]?.id);

  return (
    <nav aria-labelledby={titleId} className="legal-contents">
      <div className="legal-contents__head">
        <span className="legal-contents__glyph">
          <Icon name={icon} />
        </span>
        <h2 className="legal-contents__title" id={titleId}>
          Содержание
        </h2>
      </div>
      <ol className="legal-contents__list">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              aria-current={item.id === currentId ? 'true' : undefined}
              className="legal-contents__item"
              onClick={() => {
                setCurrentId(item.id);
                onNavigate(item.id);
              }}
              type="button"
            >
              <span aria-hidden="true" className="legal-contents__number">
                {`${String(index + 1)}.`}
              </span>
              <span className="legal-contents__label">{item.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface LegalDocumentPageProps {
  readonly className: string;
  readonly homeHref: string;
  readonly title: string;
  readonly lead: string;
  readonly sections: readonly LegalSection[];
  readonly contentsIcon?: IconName;
  readonly intro?: ReactNode;
  readonly outro?: ReactNode;
  readonly updatedDate?: string;
}

export function LegalDocumentPage({
  className,
  homeHref,
  title,
  lead,
  sections,
  contentsIcon = 'shield',
  intro,
  outro,
  updatedDate = DEFAULT_LEGAL_UPDATED_DATE,
}: LegalDocumentPageProps) {
  const contentsTitleId = `${className}-contents-title`;

  return (
    <main className={`info-page legal-page ${className}`}>
      <Container>
        <InfoPageHeader homeHref={homeHref} lead={lead} title={title} />

        <div className="legal-layout">
          <aside className="legal-layout__aside">
            <LegalContents
              icon={contentsIcon}
              items={sections}
              onNavigate={focusLegalSection}
              titleId={contentsTitleId}
            />
          </aside>

          <article aria-label={title} className="legal-document">
            {intro}
            {sections.map((section, index) => (
              <section
                aria-labelledby={legalHeadingId(section.id)}
                className="legal-document__section"
                key={section.id}
              >
                <span className="legal-document__glyph">
                  <Icon name={section.icon} />
                </span>
                <div className="legal-document__body">
                  <h2
                    className="legal-document__title"
                    id={legalHeadingId(section.id)}
                    tabIndex={-1}
                  >
                    {legalSectionTitle(index, section.title)}
                  </h2>
                  <div className="legal-text">{section.content}</div>
                </div>
              </section>
            ))}
            {outro}
            <p className="legal-document__updated">{`Последнее обновление: ${updatedDate}`}</p>
          </article>
        </div>
      </Container>
    </main>
  );
}

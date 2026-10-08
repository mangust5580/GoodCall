import type { ReactNode } from 'react';

import { Breadcrumbs } from '../../components/layout';

interface InfoPageHeaderProps {
  readonly homeHref: string;
  readonly title: string;
  readonly crumb?: string;
  readonly lead: string;
  readonly aside?: ReactNode;
}

export function InfoPageHeader({
  homeHref,
  title,
  crumb = title,
  lead,
  aside,
}: InfoPageHeaderProps) {
  return (
    <>
      <Breadcrumbs
        className="info-page__breadcrumbs"
        items={[{ label: 'Главная', href: homeHref }, { label: crumb }]}
      />

      <header
        className={
          aside === undefined
            ? 'info-page__heading'
            : 'info-page__heading info-page__heading--aside'
        }
      >
        <div className="info-page__heading-text">
          <h1 className="info-page__title">{title}</h1>
          <p className="info-page__lead">{lead}</p>
        </div>
        {aside}
      </header>
    </>
  );
}

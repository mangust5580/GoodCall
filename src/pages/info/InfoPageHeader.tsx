import type { ReactNode } from 'react';

interface InfoPageHeaderProps {
  readonly homeHref: string;
  readonly title: string;
  readonly crumb?: string;
  readonly lead: string;
  readonly aside?: ReactNode;
}

interface InfoBreadcrumbsProps {
  readonly homeHref: string;
  readonly crumb: string;
}

export function InfoBreadcrumbs({ homeHref, crumb }: InfoBreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className="info-page__breadcrumbs">
      <ol className="info-page__crumbs">
        <li className="info-page__crumb">
          <a className="info-page__crumb-link" href={homeHref}>
            Главная
          </a>
        </li>
        <li aria-current="page" className="info-page__crumb">
          {crumb}
        </li>
      </ol>
    </nav>
  );
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
      <InfoBreadcrumbs crumb={crumb} homeHref={homeHref} />

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

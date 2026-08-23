import type { ReactNode } from 'react';

interface BrandCardProps {
  readonly name: string;
  readonly logoSrc: string;
  readonly logoAlt?: string;
  readonly meta?: string;
  readonly href?: string;
}

export function BrandCard({ name, logoSrc, logoAlt = '', meta, href }: BrandCardProps) {
  const body: ReactNode = (
    <>
      <img alt={logoAlt} className="brand-card__logo" src={logoSrc} />
      <h3 className="brand-card__name">{name}</h3>
      {meta === undefined ? null : <p className="brand-card__meta">{meta}</p>}
    </>
  );

  if (href === undefined) {
    return <article className="brand-card">{body}</article>;
  }

  return (
    <a className="brand-card brand-card--link" href={href}>
      {body}
    </a>
  );
}

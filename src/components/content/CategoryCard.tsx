import type { ReactNode } from 'react';

interface CategoryCardProps {
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly meta?: string;
  readonly href?: string;
}

export function CategoryCard({ title, imageSrc, imageAlt, meta, href }: CategoryCardProps) {
  const body: ReactNode = (
    <>
      <span className="category-card__media">
        <img alt={imageAlt} className="category-card__image" src={imageSrc} />
      </span>
      <h3 className="category-card__title">{title}</h3>
      {meta === undefined ? null : <p className="category-card__meta">{meta}</p>}
    </>
  );

  if (href === undefined) {
    return <article className="category-card">{body}</article>;
  }

  return (
    <a className="category-card category-card--link" href={href}>
      {body}
    </a>
  );
}

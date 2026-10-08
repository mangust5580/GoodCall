export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[];
  readonly className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const lastIndex = items.length - 1;

  return (
    <nav
      aria-label="Хлебные крошки"
      className={className === undefined ? 'breadcrumbs' : `breadcrumbs ${className}`}
    >
      <ol className="breadcrumbs__list">
        {items.map((item, index) =>
          index === lastIndex ? (
            <li aria-current="page" className="breadcrumbs__item" key={item.label}>
              {item.label}
            </li>
          ) : (
            <li className="breadcrumbs__item" key={item.label}>
              {item.href === undefined ? (
                item.label
              ) : (
                <a className="breadcrumbs__link" href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

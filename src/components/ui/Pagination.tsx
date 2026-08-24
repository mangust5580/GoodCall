import { Icon } from './Icon';

interface PaginationProps {
  readonly page: number;
  readonly pageCount: number;
  readonly onChange: (page: number) => void;
  readonly label: string;
  readonly previousLabel?: string;
  readonly nextLabel?: string;
}

const GAP = 'gap';

type PageSlot = number | typeof GAP;

function buildPageSlots(page: number, pageCount: number): PageSlot[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const slots = new Set<number>([1, pageCount, page]);

  for (let offset = -1; offset <= 1; offset += 1) {
    const candidate = page + offset;

    if (candidate > 1 && candidate < pageCount) {
      slots.add(candidate);
    }
  }

  if (page <= 3) {
    [2, 3, 4].forEach((value) => slots.add(value));
  }

  if (page >= pageCount - 2) {
    [pageCount - 3, pageCount - 2, pageCount - 1].forEach((value) => slots.add(value));
  }

  const ordered = [...slots]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);
  const result: PageSlot[] = [];

  ordered.forEach((value, index) => {
    const previous = ordered[index - 1];

    if (previous !== undefined && value - previous > 1) {
      result.push(GAP);
    }

    result.push(value);
  });

  return result;
}

export function Pagination({
  page,
  pageCount,
  onChange,
  label,
  previousLabel = 'Предыдущая страница',
  nextLabel = 'Следующая страница',
}: PaginationProps) {
  const slots = buildPageSlots(page, pageCount);

  return (
    <nav aria-label={label} className="ui-pagination">
      <ul className="ui-pagination__list">
        <li>
          <button
            aria-label={previousLabel}
            className="ui-pagination__item ui-pagination__item--arrow"
            disabled={page <= 1}
            onClick={() => {
              onChange(page - 1);
            }}
            type="button"
          >
            <Icon name="chevron-left" />
          </button>
        </li>
        {slots.map((slot, index) =>
          slot === GAP ? (
            <li aria-hidden="true" className="ui-pagination__gap" key={`gap-${String(index)}`}>
              …
            </li>
          ) : (
            <li key={slot}>
              {slot === page ? (
                <span
                  aria-current="page"
                  className="ui-pagination__item ui-pagination__item--active"
                >
                  {slot}
                </span>
              ) : (
                <button
                  className="ui-pagination__item"
                  onClick={() => {
                    onChange(slot);
                  }}
                  type="button"
                >
                  {slot}
                </button>
              )}
            </li>
          ),
        )}
        <li>
          <button
            aria-label={nextLabel}
            className="ui-pagination__item ui-pagination__item--arrow"
            disabled={page >= pageCount}
            onClick={() => {
              onChange(page + 1);
            }}
            type="button"
          >
            <Icon name="chevron-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

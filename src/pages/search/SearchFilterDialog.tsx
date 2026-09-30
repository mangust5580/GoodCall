import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { Button, Icon } from '../../components/ui';
import { EMPTY_SEARCH_FILTERS } from './searchFacets';
import type { SearchFacetOptions, SearchFilterState } from './searchFacets';
import { SearchFilters } from './SearchFilters';

interface SearchFilterDialogProps {
  readonly applied: SearchFilterState;
  readonly options: SearchFacetOptions;
  readonly activeCount: number;
  readonly onApply: (next: SearchFilterState) => void;
}

const TRIGGER_TEXT = 'Фильтры';

export function SearchFilterDialog({
  applied,
  options,
  activeCount,
  onApply,
}: SearchFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SearchFilterState>(applied);

  const handleOpenChange = (nextOpen: boolean): void => {
    if (nextOpen) {
      setDraft(applied);
    }

    setOpen(nextOpen);
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Trigger
        aria-label={
          activeCount > 0 ? `${TRIGGER_TEXT}, выбрано: ${String(activeCount)}` : TRIGGER_TEXT
        }
        className="search-filter-trigger"
      >
        {TRIGGER_TEXT}
        {activeCount > 0 ? (
          <span className="search-filter-trigger__count">{activeCount}</span>
        ) : null}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="search-filter-dialog__overlay" />
        <Dialog.Content aria-describedby={undefined} className="search-filter-dialog">
          <div className="search-filter-dialog__header">
            <Dialog.Title className="search-filter-dialog__title">{TRIGGER_TEXT}</Dialog.Title>
            <Dialog.Close aria-label="Закрыть" className="search-filter-dialog__close">
              <Icon name="close" />
            </Dialog.Close>
          </div>

          <div className="search-filter-dialog__body">
            <SearchFilters
              draft={draft}
              layout="dialog"
              onDraftChange={setDraft}
              options={options}
            />
          </div>

          <div className="search-filter-dialog__footer">
            <Button
              className="search-filter-dialog__action"
              onClick={() => {
                setDraft(EMPTY_SEARCH_FILTERS);
              }}
              variant="secondary"
            >
              Сбросить
            </Button>
            <Button
              className="search-filter-dialog__action"
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
            >
              Показать
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

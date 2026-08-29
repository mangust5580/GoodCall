import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { Button, Icon } from '../../components/ui';
import { CatalogFilters } from './CatalogFilters';
import { DEFAULT_CATALOG_FILTER_STATE, countActiveCatalogFilters } from './catalogFilterState';
import type { CatalogFilterState } from './catalogFilterState';

interface CatalogFilterDialogProps {
  readonly value: CatalogFilterState;
  readonly onApply: (next: CatalogFilterState) => void;
  readonly totalCount: number;
}

export function CatalogFilterDialog({ value, onApply, totalCount }: CatalogFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogFilterState>(value);
  const activeCount = countActiveCatalogFilters(value);

  const handleOpenChange = (nextOpen: boolean): void => {
    if (nextOpen) {
      setDraft(value);
    }

    setOpen(nextOpen);
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Trigger className="catalog-filter-trigger">
        Фильтры
        {activeCount > 0 ? (
          <span className="catalog-filter-trigger__count">{activeCount}</span>
        ) : null}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="catalog-filter-dialog__overlay" />
        <Dialog.Content aria-describedby={undefined} className="catalog-filter-dialog">
          <div className="catalog-filter-dialog__header">
            <Dialog.Title className="catalog-filter-dialog__title">Фильтры</Dialog.Title>
            <Dialog.Close aria-label="Закрыть" className="catalog-filter-dialog__close">
              <Icon name="close" />
            </Dialog.Close>
          </div>

          <div className="catalog-filter-dialog__body">
            <CatalogFilters
              layout="dialog"
              onChange={setDraft}
              totalCount={totalCount}
              value={draft}
            />
          </div>

          <div className="catalog-filter-dialog__footer">
            <Button
              className="catalog-filter-dialog__action"
              onClick={() => {
                setDraft(DEFAULT_CATALOG_FILTER_STATE);
              }}
              variant="secondary"
            >
              Сбросить
            </Button>
            <Button
              className="catalog-filter-dialog__action"
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

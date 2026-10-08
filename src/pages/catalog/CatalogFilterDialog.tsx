import { Dialog } from 'radix-ui';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { Button, Icon } from '../../components/ui';
import { CatalogFilters } from './CatalogFilters';
import { DEFAULT_CATALOG_FILTER_STATE, countActiveCatalogFilters } from './catalogFilterState';
import type { CatalogFilterState } from './catalogFilterState';
import type { CatalogLiveFacets } from './catalogFacets';

interface CatalogFilterDialogShellProps<State> {
  readonly value: State;
  readonly onApply: (next: State) => void;
  readonly defaultValue: State;
  readonly activeCount: number;
  readonly renderFilters: (draft: State, onDraftChange: (next: State) => void) => ReactNode;
}

export function CatalogFilterDialogShell<State>({
  value,
  onApply,
  defaultValue,
  activeCount,
  renderFilters,
}: CatalogFilterDialogShellProps<State>) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<State>(value);

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

          <div className="catalog-filter-dialog__body">{renderFilters(draft, setDraft)}</div>

          <div className="catalog-filter-dialog__footer">
            <Button
              className="catalog-filter-dialog__action"
              onClick={() => {
                setDraft(defaultValue);
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

interface CatalogFilterDialogProps {
  readonly value: CatalogFilterState;
  readonly onApply: (next: CatalogFilterState) => void;
  readonly totalCount: number;
  readonly liveFacets?: CatalogLiveFacets;
}

export function CatalogFilterDialog({
  value,
  onApply,
  totalCount,
  liveFacets,
}: CatalogFilterDialogProps) {
  return (
    <CatalogFilterDialogShell
      activeCount={countActiveCatalogFilters(value)}
      defaultValue={DEFAULT_CATALOG_FILTER_STATE}
      onApply={onApply}
      renderFilters={(draft, onDraftChange) => (
        <CatalogFilters
          layout="dialog"
          liveFacets={liveFacets}
          onChange={onDraftChange}
          totalCount={totalCount}
          value={draft}
        />
      )}
      value={value}
    />
  );
}

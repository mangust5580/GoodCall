import type { KeyboardEvent } from 'react';

import { tabId, tabPanelId } from './tabIds';

export interface TabItem {
  readonly id: string;
  readonly label: string;
}

interface TabsProps {
  readonly idBase: string;
  readonly items: readonly TabItem[];
  readonly activeId: string;
  readonly onChange: (id: string) => void;
  readonly label: string;
}

export function Tabs({ idBase, items, activeId, onChange, label }: TabsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;

    if (offset === 0 || items.length === 0) {
      return;
    }

    event.preventDefault();

    const current = items.findIndex((item) => item.id === activeId);
    const next = items[(current + offset + items.length) % items.length];

    if (next) {
      onChange(next.id);
      document.getElementById(tabId(idBase, next.id))?.focus();
    }
  };

  return (
    <div aria-label={label} className="ui-tabs" role="tablist">
      {items.map((item) => {
        const selected = item.id === activeId;

        return (
          <button
            aria-controls={tabPanelId(idBase, item.id)}
            aria-selected={selected}
            className={selected ? 'ui-tabs__tab ui-tabs__tab--active' : 'ui-tabs__tab'}
            id={tabId(idBase, item.id)}
            key={item.id}
            onClick={() => {
              if (!selected) {
                onChange(item.id);
              }
            }}
            onKeyDown={handleKeyDown}
            role="tab"
            tabIndex={selected ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

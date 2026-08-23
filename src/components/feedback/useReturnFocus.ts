import { useRef } from 'react';

interface ReturnFocusHandlers {
  readonly onOpenAutoFocus: () => void;
  readonly onCloseAutoFocus: (event: Event) => void;
}

export function useReturnFocus(): ReturnFocusHandlers {
  const previous = useRef<HTMLElement | null>(null);

  return {
    onOpenAutoFocus: () => {
      const active = document.activeElement;
      previous.current = active instanceof HTMLElement ? active : null;
    },
    onCloseAutoFocus: (event: Event) => {
      const target = previous.current;
      previous.current = null;

      if (target !== null && document.contains(target)) {
        event.preventDefault();
        target.focus();
      }
    },
  };
}

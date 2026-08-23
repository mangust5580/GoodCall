import type { ReactNode } from 'react';
import { Dialog } from 'radix-ui';

import { Button } from '../ui';
import { useReturnFocus } from './useReturnFocus';

interface InfoDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  readonly message: ReactNode;
  readonly actionLabel: string;
  readonly onAcknowledge?: () => void;
}

export function InfoDialog({
  open,
  onOpenChange,
  title,
  message,
  actionLabel,
  onAcknowledge,
}: InfoDialogProps) {
  const returnFocus = useReturnFocus();

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="feedback-dialog__overlay" />
        <Dialog.Content
          aria-modal
          className="feedback-dialog feedback-dialog--info"
          onCloseAutoFocus={returnFocus.onCloseAutoFocus}
          onOpenAutoFocus={returnFocus.onOpenAutoFocus}
        >
          <Dialog.Title className="feedback-dialog__title">{title}</Dialog.Title>
          <Dialog.Description className="feedback-dialog__message">{message}</Dialog.Description>
          <Button
            className="feedback-dialog__action"
            onClick={() => {
              onAcknowledge?.();
              onOpenChange(false);
            }}
            variant="primary"
          >
            {actionLabel}
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

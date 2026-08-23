import type { ReactNode } from 'react';
import { AlertDialog } from 'radix-ui';

import { Button } from '../ui';
import { useReturnFocus } from './useReturnFocus';

interface ConfirmationDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  readonly message: ReactNode;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  readonly onConfirm: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onConfirm,
}: ConfirmationDialogProps) {
  const returnFocus = useReturnFocus();

  return (
    <AlertDialog.Root onOpenChange={onOpenChange} open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="feedback-dialog__overlay" />
        <AlertDialog.Content
          aria-modal
          className="feedback-dialog feedback-dialog--confirm"
          onCloseAutoFocus={returnFocus.onCloseAutoFocus}
          onOpenAutoFocus={returnFocus.onOpenAutoFocus}
        >
          <AlertDialog.Title className="feedback-dialog__title">{title}</AlertDialog.Title>
          <AlertDialog.Description className="feedback-dialog__message">
            {message}
          </AlertDialog.Description>
          <div className="feedback-dialog__actions">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button onClick={onConfirm} variant="danger">
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

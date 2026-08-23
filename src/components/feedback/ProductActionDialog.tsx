import { Dialog } from 'radix-ui';

import { FeedbackActionButton } from './feedbackAction';
import { useReturnFocus } from './useReturnFocus';
import type { FeedbackAction } from './feedbackAction';

interface ProductActionDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly title: string;
  readonly price: string;
  readonly action: FeedbackAction;
}

export function ProductActionDialog({
  open,
  onOpenChange,
  imageSrc,
  imageAlt,
  title,
  price,
  action,
}: ProductActionDialogProps) {
  const returnFocus = useReturnFocus();

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="feedback-dialog__overlay" />
        <Dialog.Content
          aria-modal
          className="feedback-dialog feedback-dialog--product"
          onCloseAutoFocus={returnFocus.onCloseAutoFocus}
          onOpenAutoFocus={returnFocus.onOpenAutoFocus}
        >
          <div className="product-action-dialog__item">
            <img alt={imageAlt} className="product-action-dialog__image" src={imageSrc} />
            <div className="product-action-dialog__details">
              <Dialog.Title className="product-action-dialog__title">{title}</Dialog.Title>
              <Dialog.Description className="product-action-dialog__price">
                {price}
              </Dialog.Description>
            </div>
          </div>
          <FeedbackActionButton
            action={action}
            className="product-action-dialog__action"
            variant="secondary"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

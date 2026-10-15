import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

import { Icon } from '../ui';

interface ActionNoticeProps {
  readonly open: boolean;
  readonly message: string;
  readonly announcement: string;
  readonly actionLabel: string;
  readonly actionHref: string;
  readonly dismissLabel: string;
  readonly onDismiss: (focusedNotice: HTMLElement | null) => void;
}

export function ActionNotice({
  open,
  message,
  announcement,
  actionLabel,
  actionHref,
  dismissLabel,
  onDismiss,
}: ActionNoticeProps) {
  const noticeRef = useRef<HTMLDivElement>(null);

  const dismiss = () => {
    const notice = noticeRef.current;

    onDismiss(notice !== null && notice.contains(document.activeElement) ? notice : null);
  };

  const dismissOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      dismiss();
    }
  };

  return (
    <>
      <p aria-atomic="true" className="ui-visually-hidden" role="status">
        {announcement}
      </p>
      {open ? (
        <div className="action-notice" ref={noticeRef}>
          <span className="action-notice__mark">
            <Icon name="check" />
          </span>
          <p className="action-notice__message">{message}</p>
          <a className="action-notice__action" href={actionHref} onKeyDown={dismissOnEscape}>
            {actionLabel}
          </a>
          <button
            aria-label={dismissLabel}
            className="action-notice__close"
            onClick={dismiss}
            onKeyDown={dismissOnEscape}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>
      ) : null}
    </>
  );
}

import { useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';

import { InfoDialog } from './InfoDialog';

export interface DemoContactNotice {
  readonly title: string;
  readonly message: string;
  readonly actionLabel: string;
}

interface DemoContactLinkProps {
  readonly href: string;
  readonly className: string;
  readonly notice?: DemoContactNotice;
  readonly children: ReactNode;
}

export function DemoContactLink({ href, className, notice, children }: DemoContactLinkProps) {
  const [open, setOpen] = useState(false);

  if (notice === undefined) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.currentTarget.focus();
    setOpen(true);
  };

  return (
    <>
      <a className={className} href={href} onClick={handleClick}>
        {children}
      </a>
      <InfoDialog
        actionLabel={notice.actionLabel}
        dimmed
        message={notice.message}
        onOpenChange={setOpen}
        open={open}
        title={notice.title}
      />
    </>
  );
}

import { useEffect } from 'react';

const SITE_NAME = 'GoodCall';

export function useDocumentTitle(pageName: string | undefined): void {
  useEffect(() => {
    if (pageName !== undefined) {
      document.title = `${pageName} — ${SITE_NAME}`;
    }
  }, [pageName]);
}

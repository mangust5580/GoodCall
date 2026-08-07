import { expect, type Page } from '@playwright/test';

const FOCUS_ORIGIN_ID = 'e2e-focus-origin-sentinel';

async function installFocusOrigin(page: Page): Promise<void> {
  const state = await page.evaluate((id) => {
    document.getElementById(id)?.remove();

    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }

    const sentinel = document.createElement('div');
    sentinel.id = id;
    sentinel.tabIndex = -1;
    sentinel.style.position = 'fixed';
    sentinel.style.inlineSize = '0';
    sentinel.style.blockSize = '0';
    sentinel.style.overflow = 'hidden';

    const applicationRoot = document.getElementById('root') ?? document.body.firstElementChild;
    if (applicationRoot === null) {
      document.body.prepend(sentinel);
    } else {
      applicationRoot.before(sentinel);
    }

    sentinel.focus();

    return {
      mounted: document.getElementById(id) !== null,
      precedesApplicationRoot:
        applicationRoot === null ||
        (sentinel.compareDocumentPosition(applicationRoot) & Node.DOCUMENT_POSITION_FOLLOWING) !==
          0,
      isActiveElement: document.activeElement === sentinel,
      tabIndex: sentinel.tabIndex,
    };
  }, FOCUS_ORIGIN_ID);

  expect(state.mounted, 'focus-origin sentinel is mounted').toBe(true);
  expect(state.precedesApplicationRoot, 'focus-origin sentinel precedes the application root').toBe(
    true
  );
  expect(state.tabIndex, 'focus-origin sentinel stays out of the normal Tab order').toBe(-1);
  expect(state.isActiveElement, 'focus-origin sentinel is the active element').toBe(true);
}

async function removeFocusOrigin(page: Page): Promise<void> {
  if (page.isClosed()) {
    return;
  }

  await page.evaluate((id) => {
    document.getElementById(id)?.remove();
  }, FOCUS_ORIGIN_ID);
}

export async function withDocumentStartFocus(
  page: Page,
  traversal: () => Promise<void>
): Promise<void> {
  await installFocusOrigin(page);

  try {
    await traversal();
  } finally {
    await removeFocusOrigin(page);
  }
}

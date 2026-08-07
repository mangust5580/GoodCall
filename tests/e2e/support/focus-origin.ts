import { expect, type Page } from '@playwright/test';

const FOCUS_ORIGIN_ID = 'e2e-focus-origin-sentinel';
const FOCUS_ORIGIN_SELECTOR = `#${FOCUS_ORIGIN_ID}`;

function focusOrigin(page: Page) {
  return page.locator(FOCUS_ORIGIN_SELECTOR);
}

async function settleRenderingTurn(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      })
  );
}

async function installFocusOrigin(page: Page): Promise<void> {
  const state = await page.evaluate((id) => {
    document.getElementById(id)?.remove();

    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }

    const scrollBefore = { x: window.scrollX, y: window.scrollY };

    const sentinel = document.createElement('div');
    sentinel.id = id;
    sentinel.tabIndex = 0;
    sentinel.style.position = 'fixed';
    sentinel.style.insetBlockStart = '0';
    sentinel.style.insetInlineStart = '0';
    sentinel.style.inlineSize = '1px';
    sentinel.style.blockSize = '1px';
    sentinel.style.opacity = '0';
    sentinel.style.pointerEvents = 'none';

    const applicationRoot = document.getElementById('root');

    if (applicationRoot === null) {
      document.body.prepend(sentinel);
    } else {
      applicationRoot.before(sentinel);
    }

    sentinel.focus({ preventScroll: true });

    return {
      mounted: document.getElementById(id) !== null,
      applicationRootFound: applicationRoot !== null,
      immediatelyPrecedesApplicationRoot: sentinel.nextElementSibling === applicationRoot,
      tabIndex: sentinel.tabIndex,
      scrollUnchanged: window.scrollX === scrollBefore.x && window.scrollY === scrollBefore.y,
    };
  }, FOCUS_ORIGIN_ID);

  expect(state.applicationRootFound, 'application root #root exists').toBe(true);
  expect(state.mounted, 'focus-origin sentinel is mounted').toBe(true);
  expect(
    state.immediatelyPrecedesApplicationRoot,
    'focus-origin sentinel is inserted immediately before the application root'
  ).toBe(true);
  expect(state.tabIndex, 'focus-origin sentinel joins the sequential focus order').toBe(0);
  expect(state.scrollUnchanged, 'focus-origin sentinel does not move the scroll position').toBe(
    true
  );

  await expect(focusOrigin(page)).toBeFocused();
  await settleRenderingTurn(page);
  await expect(focusOrigin(page)).toBeFocused();
}

async function removeFocusOrigin(page: Page, assertRemoval: boolean): Promise<void> {
  if (page.isClosed()) {
    return;
  }

  const removed = await page.evaluate((id) => {
    document.getElementById(id)?.remove();
    return document.getElementById(id) === null;
  }, FOCUS_ORIGIN_ID);

  if (assertRemoval) {
    expect(removed, 'focus-origin sentinel is removed after the traversal').toBe(true);
  }
}

export async function withDocumentStartFocus(
  page: Page,
  traversal: () => Promise<void>
): Promise<void> {
  await installFocusOrigin(page);

  let traversalSucceeded = false;

  try {
    await traversal();
    traversalSucceeded = true;
  } finally {
    await removeFocusOrigin(page, traversalSucceeded);
  }
}

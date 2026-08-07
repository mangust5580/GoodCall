import { test, expect, type Page } from '@playwright/test';
import { withDocumentStartFocus } from './support/focus-origin';

const BRAND_LINK_LABEL = 'GoodCall — на главную';

function headerBrandLink(page: Page) {
  return page.getByRole('banner').getByRole('link', { name: BRAND_LINK_LABEL, exact: true });
}

function headerBrandAsset(page: Page) {
  return page.getByRole('banner').locator('[data-brand-asset]');
}
const MINIMUM_HORIZONTAL_WIDTH = 120;
const MINIMUM_TARGET_SIZE = 44;

function collectRuntimeProblems(page: Page): {
  pageErrors: string[];
  consoleErrors: string[];
  failedRequests: string[];
} {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.resourceType()} ${request.url()}`);
  });

  return { pageErrors, consoleErrors, failedRequests };
}

test.describe('M4-02 runtime brand link', () => {
  test('Home exposes exactly one Header-owned brand Home link', async ({ page }) => {
    const problems = collectRuntimeProblems(page);

    await page.goto('/GoodCall/');

    const brandLink = headerBrandLink(page);

    await expect(brandLink).toHaveCount(1);
    await expect(brandLink).toBeVisible();
    await expect(brandLink).toHaveAttribute('href', '/GoodCall/');
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);

    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  test('brand visual resource renders at or above the approved minimum width', async ({ page }) => {
    await page.goto('/GoodCall/');

    const visual = headerBrandAsset(page);
    await expect(visual).toHaveCount(1);
    await expect(visual).toBeVisible();

    const box = await visual.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_HORIZONTAL_WIDTH);
    expect(box?.height ?? 0).toBeGreaterThan(0);

    const loaded = await visual.evaluate((element) => {
      if (!(element instanceof HTMLImageElement)) {
        return true;
      }
      return element.complete && element.naturalWidth > 0;
    });
    expect(loaded).toBe(true);
  });

  test('brand link is not cropped or stretched', async ({ page }) => {
    await page.goto('/GoodCall/');

    const visual = headerBrandAsset(page);
    const box = await visual.boundingBox();
    const ratio = (box?.width ?? 0) / (box?.height ?? 1);

    expect(ratio).toBeGreaterThan(7);
    expect(ratio).toBeLessThan(9);

    const objectFit = await visual.evaluate(
      (element) => window.getComputedStyle(element).objectFit
    );
    expect(objectFit).toBe('contain');
  });

  test('brand link navigates from a carrier route back to Home', async ({ page }) => {
    const problems = collectRuntimeProblems(page);

    await page.goto('/GoodCall/search');
    await expect(page.locator('h1')).toHaveText('Поиск');

    const brandLink = headerBrandLink(page);
    await expect(brandLink).toHaveCount(1);
    await brandLink.click();

    await expect(page).toHaveURL('/GoodCall/');
    await expect(page.locator('h1')).toContainText('GoodCall');

    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  test('skip link remains first and the brand link follows the shell controls', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    const skipLink = page.locator('a[href="#main-content"]');
    const disclosure = page.getByRole('button', { name: 'Информация и помощь', exact: true });
    const brandLink = headerBrandLink(page);

    await expect(skipLink).toHaveCount(1);
    await expect(disclosure).toBeVisible();
    await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
    await expect(brandLink).toHaveCount(1);

    await withDocumentStartFocus(page, async () => {
      await expect(skipLink).not.toBeFocused();
      await expect(disclosure).not.toBeFocused();
      await expect(brandLink).not.toBeFocused();

      await page.keyboard.press('Tab');
      await expect(skipLink).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(disclosure).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(brandLink).toBeFocused();
    });
  });

  test('compact viewport keeps the target size without page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/GoodCall/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const box = await headerBrandLink(page).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET_SIZE);

    const visualBox = await headerBrandAsset(page).boundingBox();
    expect(visualBox?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_HORIZONTAL_WIDTH);
  });

  test('expanded viewport keeps the horizontal lockup contained', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const box = await headerBrandAsset(page).boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_HORIZONTAL_WIDTH);
    expect(box?.width ?? 0).toBeLessThanOrEqual(1440);
  });

  test('forced colors keeps a visible focus indicator on the brand link', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/GoodCall/');

    const brandLink = headerBrandLink(page);
    await brandLink.focus();
    await expect(brandLink).toBeFocused();

    const indicator = await brandLink.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: parseFloat(style.outlineWidth),
      };
    });

    expect(indicator.outlineStyle).not.toBe('none');
    expect(indicator.outlineWidth).toBeGreaterThan(0);
  });
});

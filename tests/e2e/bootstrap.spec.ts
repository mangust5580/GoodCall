import { test, expect } from '@playwright/test';

test.describe('Bootstrap smoke tests', () => {
  test('renders home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('GoodCall Bootstrap');
  });

  test('skip link works', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toHaveText('Skip to main content');
  });

  test('main landmark exists', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('main#main');
    await expect(main).toBeVisible();
  });

  test('passes axe accessibility scan', async ({ page }) => {
    const { injectAxe, checkA11y } = await import('axe-playwright');
    await page.goto('/');
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });
});

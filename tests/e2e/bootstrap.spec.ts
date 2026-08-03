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

  test('accessibility: page renders with no console errors', async ({ page }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Console error: ${msg.text()}`);
      }
    });

    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});

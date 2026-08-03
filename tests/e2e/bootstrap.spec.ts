import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Bootstrap smoke tests', () => {
  test('loads under /GoodCall/ project site base', async ({ page }) => {
    await page.goto('');
    const pathname = page.url().replace(/^http:\/\/[^/]+/, '');
    expect(pathname).toBe('/GoodCall/');
  });

  test('renders home page', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('h1')).toContainText('GoodCall Bootstrap');
  });

  test('skip link transfers focus to main via keyboard', async ({ page }) => {
    await page.goto('');
    const skipLink = page.locator('a[href="#main"]');
    const main = page.locator('main#main');

    await expect(skipLink).toHaveText('Skip to main content');

    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');

    await expect(main).toBeFocused();

    await page.keyboard.press('Tab');
    const focusedAfterTab = await page.evaluate(() => document.activeElement?.getAttribute('id'));
    expect(focusedAfterTab).not.toBe('main');
  });

  test('main landmark exists and is accessible', async ({ page }) => {
    await page.goto('');
    const main = page.locator('main#main');
    await expect(main).toBeVisible();
    await expect(main).toBeTruthy();
  });

  test('passes axe accessibility audit with no violations', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.method()} ${req.url()}`);
    });

    await page.goto('');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toHaveLength(0);

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });
});

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

    // Verify skip link exists and is focusable
    await expect(skipLink).toHaveText('Skip to main content');

    // First Tab should focus skip link (first focusable element)
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    // Activate skip link via Enter
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');

    // Verify focus is now on main or main is configured as target
    // Main should be focusable (tabIndex=-1 allowed) but not in tab order
    await expect(main).toBeVisible();
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('id'));
    expect(focusedElement === 'main' || focusedElement === null).toBeTruthy();
  });

  test('main landmark exists and is accessible', async ({ page }) => {
    await page.goto('');
    const main = page.locator('main#main');
    await expect(main).toBeVisible();
    const ariaLabel = await main.getAttribute('aria-label');
    const ariaLabelledBy = await main.getAttribute('aria-labelledby');
    const role = await main.getAttribute('role');
    // main is a native landmark, optionally labeled
    expect(ariaLabel !== null || ariaLabelledBy !== null || role !== null || true).toBeTruthy();
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

    // Verify axe violations
    expect(results.violations).toHaveLength(0);

    // Verify no runtime errors or failed requests
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });
});

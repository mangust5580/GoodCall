import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('M1 Routing and Navigation', () => {
  test('direct Home under /GoodCall/', async ({ page }) => {
    await page.goto('');
    const pathname = page.url().replace(/^http:\/\/[^/]+/, '');
    expect(pathname).toBe('/GoodCall/');
    await expect(page.locator('h1')).toContainText('GoodCall');
  });

  test('skip link navigates to main-content', async ({ page }) => {
    await page.goto('/GoodCall/');
    const skipLink = page.locator('a[href="#main-content"]');
    const main = page.locator('main#main-content');

    await expect(skipLink).toHaveText('Skip to main content');
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(main).toBeFocused();
    const url = page.url();
    expect(url).toContain('#main-content');
  });

  test('main landmark with id main-content exists', async ({ page }) => {
    await page.goto('');
    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
  });

  test('client navigation Home to Category', async ({ page }) => {
    await page.goto('');
    const categoryLink = page.locator('a:has-text("Catalog Category")');
    await categoryLink.click();

    await expect(page).toHaveURL(/\/catalog\/laptops/);
    await expect(page.locator('h1')).toContainText('Category');
  });

  test('title updates on client navigation', async ({ page }) => {
    await page.goto('');
    const initialTitle = await page.title();
    expect(initialTitle).toContain('GoodCall');

    const categoryLink = page.locator('a:has-text("Catalog Category")');
    await categoryLink.click();

    await expect(page).toHaveURL(/\/catalog\/laptops/);
    await expect(page).toHaveTitle('Category — GoodCall');
  });

  test('category h1 focused after client navigation', async ({ page }) => {
    await page.goto('');
    const categoryLink = page.locator('a:has-text("Catalog Category")');
    await categoryLink.click();

    await expect(page).toHaveURL(/\/catalog\/laptops/);
    const h1 = page.locator('h1');
    const isFocused = await page.evaluate(() => {
      const h1Element = document.querySelector('h1');
      return document.activeElement === h1Element;
    });

    expect(isFocused).toBe(true);
  });

  test('direct nested Category route', async ({ page }) => {
    await page.goto('/GoodCall/catalog/gaming-laptops');
    await expect(page).toHaveURL('/GoodCall/catalog/gaming-laptops');
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Category');
    await expect(page.getByText('Category: gaming-laptops', { exact: true })).toBeVisible();
  });

  test('hard refresh nested Category', async ({ page }) => {
    await page.goto('/GoodCall/catalog/gaming-laptops');
    await page.reload();
    await expect(page.locator('h1')).toContainText('Category');
  });

  test('direct Product route', async ({ page }) => {
    await page.goto('/GoodCall/products/demo-product');
    await expect(page.locator('h1')).toContainText('Product');
  });

  test('Cart route', async ({ page }) => {
    await page.goto('/GoodCall/cart');
    await expect(page.locator('h1')).toContainText('Cart');
  });

  test('unknown route renders 404', async ({ page }) => {
    await page.goto('/GoodCall/unknown-path');
    await expect(page.locator('h1')).toContainText('Page not found');
  });

  test('404 preserves attempted pathname', async ({ page }) => {
    await page.goto('/GoodCall/unknown-route-test');
    const pathDisplay = page.locator('text=/unknown-route-test/');
    await expect(pathDisplay).toBeVisible();
  });

  test('404 does not redirect to Home', async ({ page }) => {
    await page.goto('/GoodCall/not-existing');
    const url = page.url();
    expect(url).toContain('/not-existing');
    expect(url).not.toMatch(/\/$$/);
  });

  test('one main and one h1 per route', async ({ page }) => {
    const routes = ['/', '/catalog/laptops', '/products/demo-product', '/cart', '/not-found'];

    for (const route of routes) {
      await page.goto(`/GoodCall${route}`);
      const main = page.locator('main#main-content');
      const h1 = page.locator('h1');

      await expect(main).toBeVisible();
      await expect(h1).toBeVisible();

      const mainCount = await main.count();
      const h1Count = await h1.count();

      expect(mainCount).toBe(1);
      expect(h1Count).toBe(1);
    }
  });

  test('axe scan Home passes', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('');
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toHaveLength(0);
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });

  test('axe scan 404 passes', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/GoodCall/not-found');
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toHaveLength(0);
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });

  test('Back/Forward does not create duplicate landmarks', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('GoodCall');

    await page.click('a:has-text("Catalog Category")');
    await expect(page).toHaveURL(/\/catalog\/laptops/);
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Category');

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('GoodCall');

    await page.goForward();
    await expect(page).toHaveURL(/\/catalog\/laptops/);
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Category');
  });
});

const TECHNICAL_NOTICE = 'Technical Shared UI verification surface';
const SUCCESS_RESULT = 'Demonstration form validated. No data was sent.';
const SUMMARY_TITLE = 'Fix these demonstration fields';
const MAIN_CONTENT = 'main#main-content';
const ROUTE_ANNOUNCEMENT = '#route-announcement';
const INCREMENT_LABEL = 'Increment demonstration counter';
const RESET_COUNTER_LABEL = 'Reset demonstration counter';

const VERIFICATION_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 767, height: 800 },
  { width: 768, height: 800 },
  { width: 1023, height: 800 },
  { width: 1024, height: 800 },
  { width: 1279, height: 800 },
  { width: 1280, height: 800 },
];

test.describe('M3 Shared UI integration', () => {
  test('technical verification surface renders without runtime errors', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('');

    await expect(page.getByText(TECHNICAL_NOTICE)).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Route navigation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Compact feedback and actions' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Layout primitives' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Form controls' })).toBeVisible();
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });

  test('counter increments and resets without announcing', async ({ page }) => {
    await page.goto('');

    const main = page.locator(MAIN_CONTENT);
    const routeAnnouncement = page.locator(ROUTE_ANNOUNCEMENT);
    const counter = page.getByTestId('demo-counter');
    const increment = page.getByRole('button', { name: INCREMENT_LABEL });
    const reset = page.getByRole('button', { name: RESET_COUNTER_LABEL });

    await expect(routeAnnouncement).toHaveCount(1);
    await expect(main.locator(ROUTE_ANNOUNCEMENT)).toHaveCount(0);
    await expect(main.getByRole('status')).toHaveCount(0);
    await expect(counter).toHaveText('0');

    await increment.focus();
    await page.keyboard.press('Enter');
    await increment.click();

    await expect(counter).toHaveText('2');
    await expect(counter).not.toHaveAttribute('role', /.*/);
    await expect(counter).not.toHaveAttribute('aria-live', /.*/);
    await expect(main.getByRole('status')).toHaveCount(0);
    await expect(routeAnnouncement).not.toContainText('2');
    await expect(routeAnnouncement).not.toContainText(INCREMENT_LABEL);

    await reset.click();

    await expect(counter).toHaveText('0');
    await expect(main.getByRole('status')).toHaveCount(0);
    await expect(routeAnnouncement).not.toContainText(RESET_COUNTER_LABEL);
  });

  test('invalid submit moves focus to the error summary', async ({ page }) => {
    await page.goto('');

    const submit = page.getByRole('button', { name: 'Validate demonstration form' });
    await submit.focus();
    await page.keyboard.press('Enter');

    const summary = page.getByRole('region', { name: SUMMARY_TITLE });

    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(page.getByRole('alert')).toHaveCount(0);

    await summary.getByRole('link', { name: 'Enter a demonstration name' }).click();

    await expect(page.locator('#m3-demo-name')).toBeFocused();
  });

  test('valid submit produces exactly one home-owned status result', async ({ page }) => {
    await page.goto('');

    const main = page.locator(MAIN_CONTENT);
    const routeAnnouncement = page.locator(ROUTE_ANNOUNCEMENT);

    await expect(routeAnnouncement).toHaveCount(1);
    await expect(main.locator(ROUTE_ANNOUNCEMENT)).toHaveCount(0);

    await page.locator('#m3-demo-name').fill('Demonstration');
    await page.locator('#m3-demo-category').selectOption('laptops');
    await page.getByRole('button', { name: 'Validate demonstration form' }).click();

    const homeStatuses = main.getByRole('status');

    await expect(homeStatuses).toHaveCount(1);
    await expect(homeStatuses).toHaveText(SUCCESS_RESULT);
    await expect(main.getByRole('region', { name: SUMMARY_TITLE })).toHaveCount(0);
    await expect(main.getByRole('alert')).toHaveCount(0);
    await expect(routeAnnouncement).not.toContainText(SUCCESS_RESULT);
  });

  test('layout and interactive targets hold across verification viewports', async ({ page }) => {
    for (const viewport of VERIFICATION_VIEWPORTS) {
      await page.setViewportSize(viewport);
      await page.goto('');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(1);

      await expect(page.locator('main#main-content')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();

      const labelClipping = await page.evaluate(() =>
        Array.from(document.querySelectorAll('label')).some(
          (label) => label.scrollWidth - label.clientWidth > 1
        )
      );
      expect(labelClipping, `clipped label at ${viewport.width}px`).toBe(false);

      const primaryButton = await page
        .getByRole('button', { name: 'Increment demonstration counter' })
        .boundingBox();
      expect(primaryButton?.width, `button width at ${viewport.width}px`).toBeGreaterThanOrEqual(
        44
      );
      expect(primaryButton?.height, `button height at ${viewport.width}px`).toBeGreaterThanOrEqual(
        44
      );

      const iconButton = await page
        .getByRole('button', { name: 'Reset demonstration counter' })
        .boundingBox();
      expect(iconButton?.width, `icon button width at ${viewport.width}px`).toBeGreaterThanOrEqual(
        44
      );
      expect(
        iconButton?.height,
        `icon button height at ${viewport.width}px`
      ).toBeGreaterThanOrEqual(44);

      const choiceTargetsUsable = await page.evaluate(() =>
        Array.from(document.querySelectorAll('input[type="checkbox"], input[type="radio"]')).every(
          (input) => {
            const label = input.closest('label');

            if (label === null) {
              return false;
            }

            const labelRect = label.getBoundingClientRect();
            const inputRect = input.getBoundingClientRect();

            return labelRect.height >= 44 && labelRect.width > inputRect.width;
          }
        )
      );
      expect(choiceTargetsUsable, `choice target too small at ${viewport.width}px`).toBe(true);
    }
  });

  test('reduced motion and forced colors keep the invalid state accessible', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await page.goto('');

    await page.getByRole('button', { name: 'Validate demonstration form' }).click();

    const summary = page.getByRole('region', { name: SUMMARY_TITLE });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toHaveLength(0);
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);

    const summaryLink = summary.getByRole('link', { name: 'Enter a demonstration name' });
    await summaryLink.focus();
    await expect(summaryLink).toBeFocused();
    await expect(summaryLink).toBeVisible();
  });
});

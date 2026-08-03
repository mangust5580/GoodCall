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

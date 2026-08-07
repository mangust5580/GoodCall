import { test, expect, type Locator, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { withDocumentStartFocus } from './support/focus-origin';

const PRIMARY_NAV_LABEL = 'Основная навигация';
const SEARCH_LANDMARK_LABEL = 'Поиск по каталогу';
const SEARCH_SUBMIT_LABEL = 'Найти';
const CATALOG_LABEL = 'Каталог';
const BRAND_LINK_LABEL = 'GoodCall — на главную';
const SERVICE_NAV_LABEL = 'Сервисная навигация';
const DISCLOSURE_LABEL = 'Информация и помощь';
const SEARCH_EMPTY_ERROR = 'Введите поисковый запрос.';
const MINIMUM_TARGET = 44;
const MINIMUM_LOGO_WIDTH = 120;
const ROW_TOLERANCE = 2;
const FULL_WIDTH_TOLERANCE = 1;
const USER_NAV_LABEL = 'Пользовательская навигация';
const ACTION_LABELS = ['Сравнение', 'Избранное', 'Корзина', 'Войти'];

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function resolveBox(locator: Locator, name: string): Promise<Box> {
  const box = await locator.boundingBox();

  expect(box, `${name} must expose a bounding box`).not.toBeNull();

  if (box === null) {
    throw new Error(`${name} has no bounding box`);
  }

  return box;
}

function boxTop(box: Box): number {
  return box.y;
}

function boxBottom(box: Box): number {
  return box.y + box.height;
}

function boxCenterY(box: Box): number {
  return box.y + box.height / 2;
}

function boxRight(box: Box): number {
  return box.x + box.width;
}

function verticalOverlap(first: Box, second: Box): number {
  return Math.min(boxBottom(first), boxBottom(second)) - Math.max(boxTop(first), boxTop(second));
}

async function headerContentWidth(page: Page): Promise<number> {
  const width = await searchLandmark(page).evaluate((element) => {
    const parent = element.parentElement;

    if (parent === null) {
      return null;
    }

    const style = window.getComputedStyle(parent);
    return parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  });

  expect(width, 'Header content width must be measurable').not.toBeNull();

  if (width === null) {
    throw new Error('Header content width is not measurable');
  }

  return width;
}

async function expectOrderedAccessibleNames(
  links: Locator,
  names: readonly string[]
): Promise<void> {
  await expect(links).toHaveCount(names.length);

  for (const [index, name] of names.entries()) {
    await expect(links.nth(index)).toHaveAccessibleName(name);
  }
}

async function expectIdentityRow(page: Page): Promise<{ brand: Box; catalog: Box; search: Box }> {
  const brand = await resolveBox(brandLink(page), 'brand link');
  const catalog = await resolveBox(catalogLink(page), 'Catalog link');
  const search = await resolveBox(searchLandmark(page), 'Search form');

  expect(
    Math.abs(boxCenterY(brand) - boxCenterY(catalog)),
    'brand and Catalog share the identity row'
  ).toBeLessThanOrEqual(ROW_TOLERANCE);
  expect(boxRight(brand), 'brand precedes Catalog horizontally').toBeLessThanOrEqual(catalog.x);

  return { brand, catalog, search };
}

const SERVICE_LINK_LABELS = [
  'Доставка и оплата',
  'Гарантия и возврат',
  'Программа лояльности',
  'Помощь',
  'Контакты',
];

function banner(page: Page) {
  return page.getByRole('banner');
}

function catalogLink(page: Page) {
  return page
    .getByRole('navigation', { name: PRIMARY_NAV_LABEL })
    .getByRole('link', { name: CATALOG_LABEL, exact: true });
}

function searchLandmark(page: Page) {
  return page.getByRole('search', { name: SEARCH_LANDMARK_LABEL });
}

function searchField(page: Page) {
  return page.getByRole('searchbox', { name: SEARCH_LANDMARK_LABEL });
}

function searchSubmit(page: Page) {
  return searchLandmark(page).getByRole('button', { name: SEARCH_SUBMIT_LABEL, exact: true });
}

function brandLink(page: Page) {
  return banner(page).getByRole('link', { name: BRAND_LINK_LABEL, exact: true });
}

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

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

test.describe('M4-04 primary Header core', () => {
  test('expanded 1440px composes the Header core in one row', async ({ page }) => {
    const problems = collectRuntimeProblems(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    await expect(banner(page)).toHaveCount(1);
    await expect(brandLink(page)).toBeVisible();
    await expect(catalogLink(page)).toBeVisible();
    await expect(searchLandmark(page)).toHaveCount(1);
    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();

    const serviceNav = page.getByRole('navigation', { name: SERVICE_NAV_LABEL });
    const serviceBox = await resolveBox(serviceNav, 'service navigation');
    const headerBox = await resolveBox(banner(page), 'banner');
    expect(boxBottom(serviceBox)).toBeLessThanOrEqual(boxTop(headerBox) + 1);

    const { brand, catalog, search } = await expectIdentityRow(page);

    expect(
      verticalOverlap(search, brand),
      'Search form shares the Header row with the brand link'
    ).toBeGreaterThan(0);
    expect(
      verticalOverlap(search, catalog),
      'Search form shares the Header row with Catalog'
    ).toBeGreaterThan(0);
    expect(search.x, 'Search form follows Catalog horizontally').toBeGreaterThanOrEqual(
      boxRight(catalog)
    );
    expect(search.width, 'Search form dominates Catalog').toBeGreaterThan(catalog.width);

    const userNav = page.getByRole('navigation', { name: USER_NAV_LABEL });
    await expect(userNav).toHaveCount(1);
    await expectOrderedAccessibleNames(userNav.getByRole('link'), ACTION_LABELS);
    expect(search.x, 'Search precedes the user actions').toBeLessThan(
      (await resolveBox(userNav.getByRole('link').first(), 'first action')).x
    );

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  for (const width of [1023, 1024, 1025, 1279, 1280, 1281]) {
    test(`${String(width)}px keeps the Header core usable without overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/GoodCall/');

      await expect(brandLink(page)).toBeVisible();
      await expect(catalogLink(page)).toBeVisible();
      await expect(searchLandmark(page)).toBeVisible();
      await expect(searchField(page)).toBeVisible();
      await expect(searchSubmit(page)).toBeVisible();

      const logoBox = await resolveBox(banner(page).locator('[data-brand-asset]'), 'brand asset');
      expect(logoBox.width).toBeGreaterThanOrEqual(MINIMUM_LOGO_WIDTH);

      const { brand, catalog, search } = await expectIdentityRow(page);

      expect(
        verticalOverlap(search, brand),
        'Search form shares the Header row with the brand link'
      ).toBeGreaterThan(0);
      expect(
        verticalOverlap(search, catalog),
        'Search form shares the Header row with Catalog'
      ).toBeGreaterThan(0);
      expect(search.x, 'Search form follows the identity controls').toBeGreaterThanOrEqual(
        boxRight(catalog)
      );

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  for (const width of [767, 768, 769]) {
    test(`${String(width)}px keeps DOM order and an operable Search`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/GoodCall/');

      await expect(brandLink(page)).toBeVisible();
      await expect(catalogLink(page)).toBeVisible();
      await expect(searchField(page)).toBeVisible();
      await expect(searchSubmit(page)).toBeVisible();

      const order = await page.evaluate(() => {
        const header = document.querySelector('header');
        const nodes = Array.from(header?.querySelectorAll('a[href], input, button') ?? []);
        return nodes.map((node) =>
          node instanceof HTMLInputElement ? 'field' : (node.textContent ?? '').trim() || 'brand'
        );
      });

      expect(order).toEqual([
        'brand',
        CATALOG_LABEL,
        'field',
        SEARCH_SUBMIT_LABEL,
        ...ACTION_LABELS,
      ]);

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  test('compact 320px keeps identity in one row above a full-width Search', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    const { brand, catalog, search } = await expectIdentityRow(page);
    const fieldBox = await resolveBox(searchField(page), 'Search field');
    const submitBox = await resolveBox(searchSubmit(page), 'Search submit');
    const logoBox = await resolveBox(banner(page).locator('[data-brand-asset]'), 'brand asset');

    expect(
      catalog.x - boxRight(brand),
      'Catalog begins after the brand link'
    ).toBeGreaterThanOrEqual(0);
    expect(boxTop(search), 'Search form starts below the brand link').toBeGreaterThan(
      boxBottom(brand)
    );
    expect(boxTop(search), 'Search form starts below Catalog').toBeGreaterThan(boxBottom(catalog));

    const contentWidth = await headerContentWidth(page);
    expect(search.width, 'Search form fills the compact Header row').toBeGreaterThanOrEqual(
      contentWidth - FULL_WIDTH_TOLERANCE
    );

    await expect(page.getByText(SEARCH_LANDMARK_LABEL).first()).toBeVisible();
    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();

    expect(logoBox.width).toBeGreaterThanOrEqual(MINIMUM_LOGO_WIDTH);
    const ratio = logoBox.width / logoBox.height;
    expect(ratio).toBeGreaterThan(7);
    expect(ratio).toBeLessThan(9);

    expect(brand.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(catalog.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(catalog.width).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(fieldBox.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(submitBox.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(submitBox.width).toBeGreaterThanOrEqual(MINIMUM_TARGET);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('compact keyboard order reaches Header controls after the Information Bar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await withDocumentStartFocus(page, async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('a[href="#main-content"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: DISCLOSURE_LABEL, exact: true })).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(brandLink(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(catalogLink(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(searchField(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(searchSubmit(page)).toBeFocused();

      const userNav = page.getByRole('navigation', { name: USER_NAV_LABEL });
      for (const label of ACTION_LABELS) {
        await page.keyboard.press('Tab');
        await expect(userNav.getByRole('link', { name: label, exact: true })).toBeFocused();
      }
    });
  });

  test('wide keyboard order passes the inline service links first', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await withDocumentStartFocus(page, async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('a[href="#main-content"]')).toBeFocused();

      const serviceNav = page.getByRole('navigation', { name: SERVICE_NAV_LABEL });
      for (const label of SERVICE_LINK_LABELS) {
        await page.keyboard.press('Tab');
        await expect(serviceNav.getByRole('link', { name: label, exact: true })).toBeFocused();
      }

      await page.keyboard.press('Tab');
      await expect(brandLink(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(catalogLink(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(searchField(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(searchSubmit(page)).toBeFocused();

      const userNav = page.getByRole('navigation', { name: USER_NAV_LABEL });
      for (const label of ACTION_LABELS) {
        await page.keyboard.press('Tab');
        await expect(userNav.getByRole('link', { name: label, exact: true })).toBeFocused();
      }
    });
  });

  test('Catalog navigates to the representative category', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await catalogLink(page).click();

    await expect(page).toHaveURL('/GoodCall/catalog/laptops');
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Category');
    await expect(heading).toBeFocused();
    await expect(page.getByText('Category: laptops')).toBeVisible();
    await expect(catalogLink(page)).toHaveAttribute('aria-current', 'page');

    await page.reload();
    await expect(page).toHaveURL('/GoodCall/catalog/laptops');
    await expect(page.locator('h1')).toHaveText('Category');
    await expect(banner(page)).toHaveCount(1);
  });

  test('Catalog current state does not leak to other category paths', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto('/GoodCall/catalog/phones');
    await expect(page.locator('h1')).toHaveText('Category');
    await expect(catalogLink(page)).not.toHaveAttribute('aria-current', 'page');

    await page.goto('/GoodCall/catalog');
    await expect(page.locator('h1')).toContainText('Page not found');
    await expect(catalogLink(page)).not.toHaveAttribute('aria-current', 'page');
  });

  test('Search submits a normalized query and focuses the carrier heading', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await searchField(page).fill('  ноутбук  ');
    await searchSubmit(page).click();

    await expect(page).toHaveURL(/\/GoodCall\/search\?q=/);
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Поиск');
    await expect(heading).toBeFocused();
    await expect(searchField(page)).toHaveValue('ноутбук');

    const decoded = await page.evaluate(() => new URLSearchParams(location.search).get('q'));
    expect(decoded).toBe('ноутбук');

    await page.reload();
    await expect(page).toHaveURL(/\/GoodCall\/search\?q=/);
    await expect(page.locator('h1')).toHaveText('Поиск');
    await expect(searchField(page)).toHaveValue('ноутбук');
  });

  test('query-only Search does not refocus the heading or duplicate announcements', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA');

    await expect(searchField(page)).toHaveValue('ноутбук');

    await searchField(page).fill('телефон');
    await searchSubmit(page).click();

    await expect
      .poll(async () => page.evaluate(() => new URLSearchParams(location.search).get('q')))
      .toBe('телефон');

    await expect(page).toHaveURL(/\/GoodCall\/search\?q=/);
    await expect(page.locator('h1')).not.toBeFocused();
    await expect(page.locator('#route-announcement')).toHaveCount(1);
    await expect(page.locator('[aria-live]')).toHaveCount(1);
  });

  for (const start of ['/GoodCall/', '/GoodCall/search']) {
    test(`empty Search from ${start} shows the canonical error without navigating`, async ({
      page,
    }) => {
      const problems = collectRuntimeProblems(page);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(start);

      const urlBefore = page.url();
      await searchField(page).fill('   ');
      await searchSubmit(page).click();

      await expect(page.getByText(SEARCH_EMPTY_ERROR)).toBeVisible();
      await expect(searchField(page)).toHaveAttribute('aria-invalid', 'true');
      await expect(searchField(page)).toBeFocused();
      expect(page.url()).toBe(urlBefore);

      await searchField(page).fill('н');
      await expect(page.getByText(SEARCH_EMPTY_ERROR)).toHaveCount(0);
      await expect(searchField(page)).not.toHaveAttribute('aria-invalid', 'true');

      expect(problems.pageErrors).toHaveLength(0);
      expect(problems.consoleErrors).toHaveLength(0);
    });
  }

  test('200 percent zoom keeps every Header control usable', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 512 });
    await page.goto('/GoodCall/');

    await expect(brandLink(page)).toBeVisible();
    await expect(catalogLink(page)).toBeVisible();
    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('400 percent zoom resolves to the compact composition', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await page.goto('/GoodCall/');

    const brandBox = await resolveBox(brandLink(page), 'brand link');
    const searchBox = await resolveBox(searchLandmark(page), 'Search form');

    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();
    expect(boxTop(searchBox)).toBeGreaterThan(boxBottom(brandBox));
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('low-height wide viewport keeps the Header non-sticky', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto('/GoodCall/');

    const position = await banner(page).evaluate(
      (element) => window.getComputedStyle(element).position
    );
    expect(['static', 'relative']).toContain(position);

    const before = await banner(page).boundingBox();
    await page.mouse.wheel(0, 600);
    await page.waitForFunction(
      () => window.scrollY > 0 || document.body.scrollHeight <= window.innerHeight
    );

    const after = await banner(page).boundingBox();
    const scrolled = await page.evaluate(() => window.scrollY);

    if (scrolled > 0) {
      expect(after?.y ?? 0).toBeLessThan(before?.y ?? 0);
    }
  });

  test('coarse pointer activates Catalog and Search by tap', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    try {
      await page.goto('/GoodCall/');

      await searchField(page).tap();
      await searchField(page).fill('ноутбук');
      await searchSubmit(page).tap();

      await expect(page).toHaveURL(/\/GoodCall\/search\?q=/);
      await expect(page.locator('h1')).toHaveText('Поиск');

      await catalogLink(page).tap();
      await expect(page).toHaveURL('/GoodCall/catalog/laptops');
      await expect(page.locator('h1')).toHaveText('Category');
    } finally {
      await context.close();
    }
  });

  test('forced colors keeps Header boundaries and states perceivable', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/catalog/laptops');

    const catalogTreatment = await catalogLink(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        borderStyle: style.borderTopStyle,
        borderWidth: parseFloat(style.borderTopWidth),
        textDecoration: style.textDecorationLine,
      };
    });
    expect(catalogTreatment.borderStyle).not.toBe('none');
    expect(catalogTreatment.borderWidth).toBeGreaterThan(0);
    expect(catalogTreatment.textDecoration).toContain('underline');

    await catalogLink(page).focus();
    const catalogFocus = await catalogLink(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(catalogFocus.style).not.toBe('none');
    expect(catalogFocus.width).toBeGreaterThan(0);

    const fieldBoundary = await searchField(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.borderTopStyle, width: parseFloat(style.borderTopWidth) };
    });
    expect(fieldBoundary.style).not.toBe('none');
    expect(fieldBoundary.width).toBeGreaterThan(0);

    await searchField(page).fill('   ');
    await searchSubmit(page).click();
    await expect(page.getByText(SEARCH_EMPTY_ERROR)).toBeVisible();

    const invalidBoundary = await searchField(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return parseFloat(style.borderTopWidth);
    });
    expect(invalidBoundary).toBeGreaterThanOrEqual(fieldBoundary.width);
  });

  for (const scenario of [
    { name: 'Home at expanded width', path: '/GoodCall/', width: 1440 },
    { name: 'Home at compact width', path: '/GoodCall/', width: 320 },
    {
      name: 'Search carrier with a query',
      path: '/GoodCall/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA',
      width: 1280,
    },
    { name: 'category carrier', path: '/GoodCall/catalog/laptops', width: 1280 },
    { name: 'catch-all catalog', path: '/GoodCall/catalog', width: 1280 },
  ]) {
    test(`axe passes for ${scenario.name}`, async ({ page }) => {
      await page.setViewportSize({ width: scenario.width, height: 900 });
      await page.goto(scenario.path);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toHaveLength(0);
    });
  }

  test('axe passes with the Search validation error visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await searchField(page).fill('   ');
    await searchSubmit(page).click();
    await expect(page.getByText(SEARCH_EMPTY_ERROR)).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });
});

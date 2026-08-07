import { test, expect, type Locator, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { withDocumentStartFocus } from './support/focus-origin';

const USER_NAV_LABEL = 'Пользовательская навигация';
const SEARCH_LANDMARK_LABEL = 'Поиск по каталогу';
const SEARCH_SUBMIT_LABEL = 'Найти';
const CATALOG_LABEL = 'Каталог';
const PRIMARY_NAV_LABEL = 'Основная навигация';
const BRAND_LINK_LABEL = 'GoodCall — на главную';
const SERVICE_NAV_LABEL = 'Сервисная навигация';
const DISCLOSURE_LABEL = 'Информация и помощь';
const MINIMUM_TARGET = 44;
const ICON_SIZE = 20;
const ROW_TOLERANCE = 2;
const EQUAL_WIDTH_TOLERANCE = 1.5;

const SERVICE_LINK_LABELS = [
  'Доставка и оплата',
  'Гарантия и возврат',
  'Программа лояльности',
  'Помощь',
  'Контакты',
];

const ACTIONS = [
  { id: 'comparison', label: 'Сравнение', path: '/comparison', heading: 'Сравнение товаров' },
  { id: 'favorites', label: 'Избранное', path: '/favorites', heading: 'Избранное' },
  { id: 'cart', label: 'Корзина', path: '/cart', heading: 'Cart' },
  { id: 'account', label: 'Войти', path: '/auth', heading: 'Вход и регистрация' },
] as const;

const ACTION_LABELS = ACTIONS.map((action) => action.label);

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
  return Math.min(boxBottom(first), boxBottom(second)) - Math.max(first.y, second.y);
}

function banner(page: Page) {
  return page.getByRole('banner');
}

function userNav(page: Page) {
  return page.getByRole('navigation', { name: USER_NAV_LABEL });
}

function actionLink(page: Page, label: string) {
  return userNav(page).getByRole('link', { name: label, exact: true });
}

function actionIcon(page: Page, id: string) {
  return page.locator(`[data-shell-icon="${id}"]`);
}

function actionLabel(page: Page, label: string) {
  return actionLink(page, label).locator('span:not([data-shell-icon])');
}

function catalogLink(page: Page) {
  return page
    .getByRole('navigation', { name: PRIMARY_NAV_LABEL })
    .getByRole('link', { name: CATALOG_LABEL, exact: true });
}

function brandLink(page: Page) {
  return page.getByRole('link', { name: BRAND_LINK_LABEL, exact: true });
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

async function expectActionInventory(page: Page): Promise<void> {
  await expect(userNav(page)).toHaveCount(1);
  await expect(userNav(page).getByRole('link')).toHaveCount(4);
  await expect(userNav(page).getByRole('link')).toHaveAccessibleName(ACTION_LABELS);

  for (const action of ACTIONS) {
    await expect(actionLink(page, action.label)).toBeVisible();
    await expect(actionIcon(page, action.id)).toBeVisible();
  }
}

async function expectNoCounters(page: Page): Promise<void> {
  const text = (await userNav(page).innerText()).replace(/\s+/g, '');

  expect(text).not.toMatch(/\d/);
  await expect(userNav(page).getByRole('img')).toHaveCount(0);
  await expect(userNav(page).getByRole('button')).toHaveCount(0);
}

async function expectIconSize(page: Page): Promise<void> {
  for (const action of ACTIONS) {
    const icon = await resolveBox(actionIcon(page, action.id), `${action.id} icon`);

    expect(Math.round(icon.width), `${action.id} icon width`).toBe(ICON_SIZE);
    expect(Math.round(icon.height), `${action.id} icon height`).toBe(ICON_SIZE);
  }
}

async function expectTargetSizes(page: Page): Promise<void> {
  for (const action of ACTIONS) {
    const box = await resolveBox(actionLink(page, action.label), `${action.label} target`);

    expect(box.width, `${action.label} target width`).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(box.height, `${action.label} target height`).toBeGreaterThanOrEqual(MINIMUM_TARGET);
  }
}

async function actionBoxes(page: Page): Promise<Box[]> {
  const boxes: Box[] = [];

  for (const action of ACTIONS) {
    boxes.push(await resolveBox(actionLink(page, action.label), `${action.label} target`));
  }

  return boxes;
}

test.describe('M4-05 Header route actions', () => {
  test('expanded 1440px composes identity, Search and four labelled actions in one row', async ({
    page,
  }) => {
    const problems = collectRuntimeProblems(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    await expect(banner(page)).toHaveCount(1);
    await expect(brandLink(page)).toBeVisible();
    await expect(catalogLink(page)).toBeVisible();
    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();
    await expectActionInventory(page);

    for (const action of ACTIONS) {
      await expect(actionLabel(page, action.label)).toBeVisible();
      await expect(actionLabel(page, action.label)).toHaveText(action.label);
    }

    const catalog = await resolveBox(catalogLink(page), 'Catalog link');
    const search = await resolveBox(searchLandmark(page), 'Search form');
    const boxes = await actionBoxes(page);
    const [first] = boxes;

    expect(first, 'first action box').toBeDefined();

    if (first === undefined) {
      throw new Error('first action box missing');
    }

    expect(
      verticalOverlap(search, first),
      'actions share the Header row with Search'
    ).toBeGreaterThan(0);
    expect(first.x, 'actions follow Search horizontally').toBeGreaterThanOrEqual(boxRight(search));

    for (let index = 1; index < boxes.length; index += 1) {
      const previous = boxes[index - 1];
      const current = boxes[index];

      if (previous === undefined || current === undefined) {
        throw new Error('action box missing');
      }

      expect(
        current.x,
        `${ACTION_LABELS[index]} follows the previous action`
      ).toBeGreaterThanOrEqual(previous.x);
      expect(
        Math.abs(boxCenterY(current) - boxCenterY(previous)),
        `${ACTION_LABELS[index]} shares the action row`
      ).toBeLessThanOrEqual(ROW_TOLERANCE);
    }

    for (const box of boxes) {
      expect(search.width, 'Search stays wider than each action').toBeGreaterThan(box.width);
    }

    expect(verticalOverlap(search, catalog), 'Search shares the row with Catalog').toBeGreaterThan(
      0
    );

    await expectIconSize(page);
    await expectNoCounters(page);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  for (const width of [1023, 1024, 1025, 1279, 1280, 1281]) {
    test(`${String(width)}px resolves the approved wide-boundary composition`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/GoodCall/');

      await expect(brandLink(page)).toBeVisible();
      await expect(catalogLink(page)).toBeVisible();
      await expect(searchField(page)).toBeVisible();
      await expect(searchSubmit(page)).toBeVisible();
      await expectActionInventory(page);

      const search = await resolveBox(searchLandmark(page), 'Search form');
      const boxes = await actionBoxes(page);
      const [first] = boxes;

      if (first === undefined) {
        throw new Error('first action box missing');
      }

      if (width >= 1024) {
        for (const action of ACTIONS) {
          await expect(actionLabel(page, action.label)).toBeVisible();
        }

        expect(
          verticalOverlap(search, first),
          'wide keeps actions in the Header row'
        ).toBeGreaterThan(0);
        expect(first.x, 'wide keeps actions after Search').toBeGreaterThanOrEqual(boxRight(search));
      } else {
        for (const action of ACTIONS) {
          await expect(actionLabel(page, action.label)).toBeHidden();
        }

        expect(first.y, 'medium moves actions below Search').toBeGreaterThanOrEqual(
          boxBottom(search) - ROW_TOLERANCE
        );
      }

      await expectIconSize(page);
      await expectTargetSizes(page);

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  for (const width of [767, 768, 769]) {
    test(`${String(width)}px resolves the approved medium boundary`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/GoodCall/');

      await expectActionInventory(page);

      for (const action of ACTIONS) {
        await expect(actionLabel(page, action.label)).toBeHidden();
        await expect(actionLink(page, action.label)).toHaveAccessibleName(action.label);
      }

      const identity = await resolveBox(brandLink(page), 'brand link');
      const search = await resolveBox(searchLandmark(page), 'Search form');
      const boxes = await actionBoxes(page);
      const [first] = boxes;

      if (first === undefined) {
        throw new Error('first action box missing');
      }

      expect(first.y, 'actions form the last row').toBeGreaterThanOrEqual(
        boxBottom(search) - ROW_TOLERANCE
      );

      if (width >= 768) {
        expect(
          verticalOverlap(search, identity),
          'medium keeps identity and Search in one row'
        ).toBeGreaterThan(0);
      } else {
        expect(search.y, 'compact moves Search below identity').toBeGreaterThan(
          boxBottom(identity) - ROW_TOLERANCE
        );
      }

      await expectIconSize(page);
      await expectTargetSizes(page);

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  test('compact 320px stacks identity, Search and a four-column action row', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await expectActionInventory(page);

    const identity = await resolveBox(brandLink(page), 'brand link');
    const search = await resolveBox(searchLandmark(page), 'Search form');
    const boxes = await actionBoxes(page);
    const [first] = boxes;

    if (first === undefined) {
      throw new Error('first action box missing');
    }

    expect(search.y, 'Search forms the second row').toBeGreaterThan(
      boxBottom(identity) - ROW_TOLERANCE
    );
    expect(first.y, 'actions form the third row').toBeGreaterThanOrEqual(
      boxBottom(search) - ROW_TOLERANCE
    );

    for (let index = 1; index < boxes.length; index += 1) {
      const previous = boxes[index - 1];
      const current = boxes[index];

      if (previous === undefined || current === undefined) {
        throw new Error('action box missing');
      }

      expect(current.x, `${ACTION_LABELS[index]} follows the previous action`).toBeGreaterThan(
        previous.x
      );
      expect(
        Math.abs(boxCenterY(current) - boxCenterY(previous)),
        `${ACTION_LABELS[index]} shares the compact action row`
      ).toBeLessThanOrEqual(ROW_TOLERANCE);
      expect(
        Math.abs(current.width - previous.width),
        `${ACTION_LABELS[index]} column width`
      ).toBeLessThanOrEqual(EQUAL_WIDTH_TOLERANCE);
    }

    for (const action of ACTIONS) {
      await expect(actionLabel(page, action.label)).toBeHidden();
      await expect(actionLink(page, action.label)).toHaveAccessibleName(action.label);
    }

    await expectIconSize(page);
    await expectTargetSizes(page);
    await expectNoCounters(page);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  for (const action of ACTIONS) {
    test(`${action.label} navigates by keyboard and survives a refresh`, async ({ page }) => {
      const problems = collectRuntimeProblems(page);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/GoodCall/');

      await actionLink(page, action.label).focus();
      await page.keyboard.press('Enter');

      await expect(page).toHaveURL(`/GoodCall${action.path}`);

      const heading = page.locator('h1');
      await expect(heading).toHaveText(action.heading);
      await expect(heading).toBeFocused();
      await expect(actionLink(page, action.label)).toHaveAttribute('aria-current', 'page');
      await expect(userNav(page).locator('a[aria-current="page"]')).toHaveCount(1);

      await page.reload();

      await expect(page).toHaveURL(`/GoodCall${action.path}`);
      await expect(page.locator('h1')).toHaveText(action.heading);
      await expect(banner(page)).toHaveCount(1);
      await expect(actionLink(page, action.label)).toHaveAttribute('aria-current', 'page');
      await expect(userNav(page).locator('a[aria-current="page"]')).toHaveCount(1);

      expect(problems.pageErrors).toHaveLength(0);
      expect(problems.consoleErrors).toHaveLength(0);
    });
  }

  test('query and hash preserve the exact current action', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/GoodCall/comparison?source=header');
    await expect(actionLink(page, 'Сравнение')).toHaveAttribute('aria-current', 'page');
    await expect(userNav(page).locator('a[aria-current="page"]')).toHaveCount(1);

    await page.goto('/GoodCall/favorites#saved');
    await expect(actionLink(page, 'Избранное')).toHaveAttribute('aria-current', 'page');
    await expect(userNav(page).locator('a[aria-current="page"]')).toHaveCount(1);
  });

  for (const path of [
    '/GoodCall/comparison-extra',
    '/GoodCall/cart/checkout',
    '/GoodCall/catalog/laptops',
    '/GoodCall/search',
    '/GoodCall/help',
    '/GoodCall/',
  ]) {
    test(`no user action is current at ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path);

      await expect(userNav(page).locator('a[aria-current="page"]')).toHaveCount(0);
    });
  }

  test('compact keyboard order reaches the four actions after Search', async ({ page }) => {
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

      for (const action of ACTIONS) {
        await page.keyboard.press('Tab');
        await expect(actionLink(page, action.label)).toBeFocused();
      }
    });
  });

  test('wide keyboard order reaches the four actions after Search', async ({ page }) => {
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

      for (const action of ACTIONS) {
        await page.keyboard.press('Tab');
        await expect(actionLink(page, action.label)).toBeFocused();
      }
    });
  });

  test('200 percent zoom keeps every action usable', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 512 });
    await page.goto('/GoodCall/');

    await expectActionInventory(page);
    await expectIconSize(page);
    await expectTargetSizes(page);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('400 percent zoom resolves to the compact three-row composition', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await page.goto('/GoodCall/');

    await expectActionInventory(page);

    const identity = await resolveBox(brandLink(page), 'brand link');
    const search = await resolveBox(searchLandmark(page), 'Search form');
    const boxes = await actionBoxes(page);
    const [first] = boxes;

    if (first === undefined) {
      throw new Error('first action box missing');
    }

    expect(search.y).toBeGreaterThan(boxBottom(identity) - ROW_TOLERANCE);
    expect(first.y).toBeGreaterThanOrEqual(boxBottom(search) - ROW_TOLERANCE);

    await expectIconSize(page);
    await expectTargetSizes(page);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('coarse pointer reaches every action by tap', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    try {
      for (const action of ACTIONS) {
        await page.goto('/GoodCall/');
        await actionLink(page, action.label).tap();

        await expect(page).toHaveURL(`/GoodCall${action.path}`);
        await expect(page.locator('h1')).toHaveText(action.heading);
        await expect(actionLink(page, action.label)).toHaveAttribute('aria-current', 'page');
      }
    } finally {
      await context.close();
    }
  });

  test('forced colors keeps icons, focus and current state perceivable', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/cart');

    for (const action of ACTIONS) {
      await expect(actionIcon(page, action.id)).toBeVisible();

      const icon = await resolveBox(actionIcon(page, action.id), `${action.id} icon`);
      expect(icon.width, `${action.id} icon width`).toBeGreaterThan(0);
      expect(icon.height, `${action.id} icon height`).toBeGreaterThan(0);

      const paint = await actionIcon(page, action.id).evaluate((element) => {
        const style = window.getComputedStyle(element);
        return { background: style.backgroundColor, mask: style.maskImage };
      });

      expect(paint.background, `${action.id} icon paint`).not.toBe('rgba(0, 0, 0, 0)');
      expect(paint.mask, `${action.id} icon mask`).not.toBe('none');
    }

    const current = actionLink(page, 'Корзина');
    await expect(current).toHaveAttribute('aria-current', 'page');

    const currentTreatment = await current.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        borderStyle: style.borderTopStyle,
        borderWidth: parseFloat(style.borderTopWidth),
        fontWeight: Number(style.fontWeight),
      };
    });

    expect(currentTreatment.borderStyle).not.toBe('none');
    expect(currentTreatment.borderWidth).toBeGreaterThan(0);
    expect(currentTreatment.fontWeight).toBeGreaterThanOrEqual(600);

    await current.focus();
    const focusTreatment = await current.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });

    expect(focusTreatment.style).not.toBe('none');
    expect(focusTreatment.width).toBeGreaterThan(0);
  });

  for (const scenario of [
    { name: 'Home expanded', path: '/GoodCall/', width: 1440 },
    { name: 'Home wide', path: '/GoodCall/', width: 1280 },
    { name: 'Home medium', path: '/GoodCall/', width: 800 },
    { name: 'Home compact', path: '/GoodCall/', width: 320 },
    { name: 'Comparison current', path: '/GoodCall/comparison', width: 1280 },
    { name: 'Favorites current', path: '/GoodCall/favorites', width: 1280 },
    { name: 'Cart current', path: '/GoodCall/cart', width: 1280 },
    { name: 'Auth current', path: '/GoodCall/auth', width: 1280 },
  ]) {
    test(`axe passes for ${scenario.name}`, async ({ page }) => {
      await page.setViewportSize({ width: scenario.width, height: 900 });
      await page.goto(scenario.path);
      await expect(userNav(page)).toHaveCount(1);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toHaveLength(0);
    });
  }
});

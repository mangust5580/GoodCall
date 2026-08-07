import { test, expect, type Locator, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { withDocumentStartFocus } from './support/focus-origin';

const BRAND_LINK_LABEL = 'GoodCall — на главную';
const DESCRIPTOR =
  'Интернет-магазин электроники и аксессуаров с доставкой, самовывозом и поддержкой после покупки.';
const LEGAL_NAV_LABEL = 'Правовая информация';
const CONTACTS_TITLE = 'Контакты';
const SUPPORT_PHONE = '8 800 100-10-10';
const SUPPORT_EMAIL = 'info@goodcall.ru';
const SUPPORT_HOURS = 'Ежедневно, 09:00–21:00';
const HEAD_OFFICE = '123112, г. Москва, Пресненская наб., д. 8, стр. 1, офис 45-12';
const OFFICE_HOURS = 'Пн–Пт, 09:00–18:00';
const PAYMENT_TITLE = 'Демонстрационные способы оплаты';
const VISA = 'Visa •••• 4242';
const MASTERCARD = 'Mastercard •••• 8888';

const GROUPS = [
  { title: 'Покупателям', sample: 'Доставка и оплата', path: '/delivery-and-payment' },
  { title: 'Компания', sample: 'О компании', path: '/about' },
  { title: 'Помощь', sample: 'Помощь и ответы на вопросы', path: '/help' },
] as const;

const LEGAL_LINKS = [
  { label: 'Политика конфиденциальности', path: '/privacy-policy' },
  { label: 'Пользовательское соглашение', path: '/user-agreement' },
  { label: 'Публичная оферта', path: '/public-offer' },
] as const;

const MINIMUM_TARGET = 44;
const ROW_TOLERANCE = 4;
const ALIGNMENT_TOLERANCE = 2;

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

function footer(page: Page) {
  return page.getByRole('contentinfo');
}

function footerBrand(page: Page) {
  return footer(page).getByRole('link', { name: BRAND_LINK_LABEL, exact: true });
}

function groupNav(page: Page, title: string) {
  return footer(page).getByRole('navigation', { name: title });
}

function disclosure(page: Page, title: string) {
  return footer(page).getByRole('button', { name: new RegExp(`раздел «${title}»`) });
}

function legalNav(page: Page) {
  return footer(page).getByRole('navigation', { name: LEGAL_NAV_LABEL });
}

function contactsHeading(page: Page) {
  return footer(page).getByRole('heading', { level: 2, name: CONTACTS_TITLE });
}

function brandColumn(page: Page) {
  return footer(page).getByText(DESCRIPTOR);
}

function groupColumn(page: Page, title: string) {
  return groupNav(page, title);
}

function contactsColumn(page: Page) {
  return footer(page).locator('dl');
}

function addressBlock(page: Page) {
  return footer(page).locator('address');
}

async function renderedLineCount(locator: Locator, name: string): Promise<number> {
  const lines = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);

    if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
      return null;
    }

    return Math.round(element.getBoundingClientRect().height / lineHeight);
  });

  expect(lines, `${name} must expose a measurable line height`).not.toBeNull();

  if (lines === null) {
    throw new Error(`${name} line count is not measurable`);
  }

  return lines;
}

interface BrandGeometry {
  rowGap: number;
  areaTop: number;
  logoTop: number;
  logoBottom: number;
  logoHeight: number;
  descriptorTop: number;
}

async function resolveBrandGeometry(page: Page): Promise<BrandGeometry> {
  const geometry = await footer(page)
    .getByText(DESCRIPTOR)
    .evaluate((descriptor): BrandGeometry | null => {
      const area = descriptor.parentElement;
      const logo = area?.querySelector('a') ?? null;

      if (area === null || logo === null) {
        return null;
      }

      const areaBox = area.getBoundingClientRect();
      const logoBox = logo.getBoundingClientRect();
      const descriptorBox = descriptor.getBoundingClientRect();
      const rowGap = parseFloat(window.getComputedStyle(area).rowGap);

      if (!Number.isFinite(rowGap)) {
        return null;
      }

      return {
        rowGap,
        areaTop: areaBox.top,
        logoTop: logoBox.top,
        logoBottom: logoBox.bottom,
        logoHeight: logoBox.height,
        descriptorTop: descriptorBox.top,
      };
    });

  expect(geometry, 'the Brand area must expose a measurable row gap and boxes').not.toBeNull();

  if (geometry === null) {
    throw new Error('Brand geometry is not measurable');
  }

  return geometry;
}

async function expectCompactBrandCluster(page: Page): Promise<void> {
  const brand = await resolveBrandGeometry(page);

  expect(brand.rowGap, 'the Brand grid declares a positive row gap').toBeGreaterThan(0);

  expect(
    brand.logoTop - brand.areaTop,
    'the Brand logo starts at the block-start of its grid area'
  ).toBeLessThanOrEqual(ALIGNMENT_TOLERANCE);

  expect(
    brand.logoHeight,
    'the Brand logo row stays content-sized instead of stretching over the grid area'
  ).toBeLessThanOrEqual(MINIMUM_TARGET + ALIGNMENT_TOLERANCE);

  expect(
    Math.abs(brand.descriptorTop - brand.logoBottom - brand.rowGap),
    'the descriptor follows the logo by the configured Brand gap'
  ).toBeLessThanOrEqual(ALIGNMENT_TOLERANCE);
}

async function expectSingleLineContact(page: Page, name: string): Promise<void> {
  const box = await resolveBox(footer(page).getByRole('link', { name }), `${name} link`);

  expect(box.height, `${name} stays on one line`).toBeLessThanOrEqual(MINIMUM_TARGET + 2);
}

async function expectWideCompactGrid(page: Page): Promise<void> {
  const brand = await resolveBox(brandColumn(page), 'brand column');
  const shoppers = await resolveBox(groupColumn(page, GROUPS[0].title), GROUPS[0].title);
  const company = await resolveBox(groupColumn(page, GROUPS[1].title), GROUPS[1].title);
  const help = await resolveBox(groupColumn(page, GROUPS[2].title), GROUPS[2].title);
  const contacts = await resolveBox(contactsColumn(page), 'contacts column');

  expect(shoppers.x, 'the compact grid follows the Brand area').toBeGreaterThan(brand.x);

  expect(
    Math.abs(shoppers.y - company.y),
    'Покупателям and Компания share the first compact row'
  ).toBeLessThanOrEqual(ROW_TOLERANCE);
  expect(company.x, 'Компания follows Покупателям').toBeGreaterThan(shoppers.x);

  expect(help.y, 'Помощь starts a second compact row').toBeGreaterThan(boxBottom(shoppers) - 1);
  expect(
    Math.abs(help.y - contacts.y),
    'Помощь and Контакты share the second compact row'
  ).toBeLessThanOrEqual(ROW_TOLERANCE);
  expect(contacts.x, 'Контакты follows Помощь').toBeGreaterThan(help.x);

  expect(
    Math.abs(help.x - shoppers.x),
    'the compact grid keeps a stable first column'
  ).toBeLessThanOrEqual(ROW_TOLERANCE);

  expect(boxBottom(brand), 'the Brand area spans the compact grid rows').toBeGreaterThan(
    shoppers.y
  );
}

async function expectExpandedFiveColumns(page: Page): Promise<void> {
  const columns = [
    await resolveBox(brandColumn(page), 'brand column'),
    await resolveBox(groupColumn(page, GROUPS[0].title), GROUPS[0].title),
    await resolveBox(groupColumn(page, GROUPS[1].title), GROUPS[1].title),
    await resolveBox(groupColumn(page, GROUPS[2].title), GROUPS[2].title),
    await resolveBox(contactsColumn(page), 'contacts column'),
  ];

  for (let index = 1; index < columns.length; index += 1) {
    const previous = columns[index - 1];
    const current = columns[index];

    if (previous === undefined || current === undefined) {
      throw new Error('column box missing');
    }

    expect(current.x, `column ${String(index)} follows the previous column`).toBeGreaterThan(
      previous.x
    );
    expect(
      current.x,
      `column ${String(index)} does not overlap the previous column`
    ).toBeGreaterThanOrEqual(previous.x + previous.width - 1);
    expect(
      Math.abs(current.y - (columns[0]?.y ?? 0)) < 200,
      `column ${String(index)} stays in the expanded band`
    ).toBe(true);
  }
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

async function expectFooterInventory(page: Page): Promise<void> {
  await expect(footer(page)).toHaveCount(1);
  await expect(footerBrand(page)).toBeVisible();
  await expect(footer(page).getByText(DESCRIPTOR)).toBeVisible();
  await expect(contactsHeading(page)).toBeVisible();
  await expect(legalNav(page)).toHaveCount(1);

  for (const group of GROUPS) {
    await expect(groupNav(page, group.title)).toHaveCount(1);
    await expect(footer(page).getByRole('heading', { level: 2, name: group.title })).toBeVisible();
  }
}

async function expectAllNavigationVisible(page: Page): Promise<void> {
  for (const group of GROUPS) {
    await expect(
      groupNav(page, group.title).getByRole('link', { name: group.sample, exact: true })
    ).toBeVisible();
  }
}

test.describe('M4-07 canonical Footer', () => {
  test('expanded 1440px composes five canonical blocks above the utility row', async ({ page }) => {
    const problems = collectRuntimeProblems(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    await expectFooterInventory(page);
    await expectAllNavigationVisible(page);

    const newsletter = await resolveBox(
      page.getByRole('region', { name: 'Будьте в курсе новинок и акций' }),
      'Newsletter'
    );
    const footerBox = await resolveBox(footer(page), 'Footer');

    expect(footerBox.y, 'Footer follows the Newsletter').toBeGreaterThanOrEqual(
      boxBottom(newsletter) - ROW_TOLERANCE
    );

    const brand = await resolveBox(footerBrand(page), 'brand');
    const columns = [brand];

    for (const group of GROUPS) {
      columns.push(
        await resolveBox(
          footer(page).getByRole('heading', { level: 2, name: group.title }),
          group.title
        )
      );
    }
    columns.push(await resolveBox(contactsHeading(page), 'Contacts'));

    for (let index = 1; index < columns.length; index += 1) {
      const previous = columns[index - 1];
      const current = columns[index];

      if (previous === undefined || current === undefined) {
        throw new Error('column box missing');
      }

      expect(current.x, `column ${String(index)} follows the previous column`).toBeGreaterThan(
        previous.x
      );
    }

    const legalBox = await resolveBox(legalNav(page), 'legal navigation');
    const lastColumn = columns[columns.length - 1];

    if (lastColumn === undefined) {
      throw new Error('last column missing');
    }

    expect(legalBox.y, 'utility row sits below the Footer grid').toBeGreaterThan(lastColumn.y);

    for (const group of GROUPS) {
      await expect(disclosure(page, group.title)).toBeHidden();
    }

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  for (const width of [1279, 1280, 1281]) {
    test(`${String(width)}px resolves the wide/expanded transition`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/GoodCall/');

      await expectFooterInventory(page);
      await expectAllNavigationVisible(page);

      for (const group of GROUPS) {
        await expect(disclosure(page, group.title)).toBeHidden();
      }

      if (width >= 1280) {
        await expectExpandedFiveColumns(page);
      } else {
        await expectWideCompactGrid(page);
      }

      await expectCompactBrandCluster(page);

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  test('expanded 1920px allocates width by content need', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/GoodCall/');

    await expectFooterInventory(page);
    await expectAllNavigationVisible(page);
    await expectExpandedFiveColumns(page);
    await expectCompactBrandCluster(page);

    const brand = await resolveBox(brandColumn(page), 'brand column');
    const company = await resolveBox(groupColumn(page, GROUPS[1].title), GROUPS[1].title);
    const contacts = await resolveBox(contactsColumn(page), 'contacts column');

    expect(contacts.width, 'Contacts is wider than the short Компания column').toBeGreaterThan(
      company.width
    );
    expect(
      contacts.width,
      'Brand does not take width at the expense of Contacts'
    ).toBeGreaterThanOrEqual(brand.width - 1);

    const addressLines = await renderedLineCount(addressBlock(page), 'head office address');
    expect(addressLines, 'the head office address stays compact').toBeLessThanOrEqual(3);

    await expectSingleLineContact(page, SUPPORT_PHONE);
    await expectSingleLineContact(page, SUPPORT_EMAIL);

    for (const group of GROUPS) {
      const link = groupNav(page, group.title).getByRole('link', {
        name: group.sample,
        exact: true,
      });
      const lines = await renderedLineCount(link, `${group.sample} label`);
      expect(lines, `${group.sample} avoids pathological wrapping`).toBeLessThanOrEqual(2);
    }

    const legalBox = await resolveBox(legalNav(page), 'legal navigation');
    expect(legalBox.y, 'the utility row stays below the Footer grid').toBeGreaterThan(
      boxBottom(contacts) - 1
    );

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  for (const width of [1023, 1024, 1025]) {
    test(`${String(width)}px resolves the medium/wide Footer boundary`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/GoodCall/');

      await expectFooterInventory(page);
      await expectAllNavigationVisible(page);

      for (const group of GROUPS) {
        await expect(disclosure(page, group.title)).toBeHidden();
      }

      if (width >= 1024) {
        await expectWideCompactGrid(page);
      } else {
        const brand = await resolveBox(brandColumn(page), 'brand column');
        const contacts = await resolveBox(contactsColumn(page), 'contacts column');

        expect(contacts.y, 'medium wraps Contacts below the Brand row').toBeGreaterThan(brand.y);
      }

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  for (const width of [767, 768, 769]) {
    test(`${String(width)}px resolves the compact/medium Footer boundary`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/GoodCall/');

      await expectFooterInventory(page);

      if (width >= 768) {
        await expectAllNavigationVisible(page);
        for (const group of GROUPS) {
          await expect(disclosure(page, group.title)).toBeHidden();
        }
      } else {
        for (const group of GROUPS) {
          await expect(disclosure(page, group.title)).toBeVisible();
          await expect(
            groupNav(page, group.title).getByRole('link', { name: group.sample, exact: true })
          ).toBeHidden();
        }
      }

      for (const group of GROUPS) {
        await expect(
          groupNav(page, group.title).locator(`a[href="/GoodCall${group.path}"]`)
        ).toHaveCount(1);
      }

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  test('compact 320px exposes three independent disclosures', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await expectFooterInventory(page);
    await expect(footer(page).getByText(SUPPORT_PHONE)).toBeVisible();

    for (const group of GROUPS) {
      const control = disclosure(page, group.title);
      await expect(control).toBeVisible();
      await expect(control).toHaveAttribute('aria-expanded', 'false');

      const box = await resolveBox(control, `${group.title} disclosure`);
      expect(box.width).toBeGreaterThanOrEqual(MINIMUM_TARGET);
      expect(box.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    }

    await disclosure(page, GROUPS[0].title).click();
    await expect(disclosure(page, GROUPS[0].title)).toHaveAttribute('aria-expanded', 'true');
    await expect(
      groupNav(page, GROUPS[0].title).getByRole('link', { name: GROUPS[0].sample, exact: true })
    ).toBeVisible();

    await disclosure(page, GROUPS[2].title).click();
    await expect(disclosure(page, GROUPS[2].title)).toHaveAttribute('aria-expanded', 'true');
    await expect(disclosure(page, GROUPS[0].title)).toHaveAttribute('aria-expanded', 'true');
    await expect(disclosure(page, GROUPS[1].title)).toHaveAttribute('aria-expanded', 'false');

    await disclosure(page, GROUPS[0].title).click();
    await expect(disclosure(page, GROUPS[0].title)).toHaveAttribute('aria-expanded', 'false');
    await expect(disclosure(page, GROUPS[2].title)).toHaveAttribute('aria-expanded', 'true');

    await expect(footer(page).getByText(VISA)).toBeVisible();
    await expect(legalNav(page).getByRole('link', { name: LEGAL_LINKS[0].label })).toBeVisible();

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('contacts expose the canonical operational content and external schemes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    const scope = footer(page);

    await expect(scope.getByRole('link', { name: SUPPORT_PHONE })).toHaveAttribute(
      'href',
      'tel:88001001010'
    );
    await expect(scope.getByRole('link', { name: SUPPORT_EMAIL })).toHaveAttribute(
      'href',
      'mailto:info@goodcall.ru'
    );
    await expect(scope.getByText(SUPPORT_HOURS)).toBeVisible();
    await expect(scope.getByText(HEAD_OFFICE)).toBeVisible();
    await expect(scope.getByText(OFFICE_HOURS)).toBeVisible();

    await expect(scope.getByText(PAYMENT_TITLE)).toBeVisible();
    await expect(scope.getByText(VISA)).toBeVisible();
    await expect(scope.getByText(MASTERCARD)).toBeVisible();
    await expect(scope.getByRole('link', { name: new RegExp('Visa') })).toHaveCount(0);

    await expect(scope.locator('a[href^="http"]')).toHaveCount(0);
    await expect(scope.getByText('Социальные сети')).toHaveCount(0);
  });

  test('the copyright uses the browser runtime year', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    const year = await page.evaluate(() => new Date().getFullYear());

    await expect(
      footer(page).getByText(`© ${String(year)} GoodCall. Все права защищены.`)
    ).toBeVisible();
  });

  for (const group of GROUPS) {
    test(`${group.title} navigates to its destination and marks it current`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/GoodCall/');

      await groupNav(page, group.title)
        .getByRole('link', { name: group.sample, exact: true })
        .click();

      await expect(page).toHaveURL(`/GoodCall${group.path}`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        groupNav(page, group.title).getByRole('link', { name: group.sample, exact: true })
      ).toHaveAttribute('aria-current', 'page');
      await expect(footer(page).locator('a[aria-current="page"]')).toHaveCount(1);
    });
  }

  for (const link of LEGAL_LINKS) {
    test(`${link.label} navigates and marks the legal link current`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/GoodCall/');

      await legalNav(page).getByRole('link', { name: link.label, exact: true }).click();

      await expect(page).toHaveURL(`/GoodCall${link.path}`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        legalNav(page).getByRole('link', { name: link.label, exact: true })
      ).toHaveAttribute('aria-current', 'page');
      await expect(footer(page).locator('a[aria-current="page"]')).toHaveCount(1);
    });
  }

  test('the catch-all keeps the Footer and drops the Newsletter', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/unknown-footer-path');

    await expect(page.locator('h1')).toContainText('Page not found');
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.getByRole('region', { name: 'Будьте в курсе новинок и акций' })).toHaveCount(
      0
    );

    await expectFooterInventory(page);
    await expect(legalNav(page).getByRole('link')).toHaveCount(3);
    await expect(footer(page).getByText(SUPPORT_PHONE)).toBeVisible();

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('compact keyboard order reaches the Footer after the Newsletter', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await withDocumentStartFocus(page, async () => {
      const maximumStops = 40;
      let reachedFooterBrand = false;

      for (let step = 0; step < maximumStops; step += 1) {
        await page.keyboard.press('Tab');

        if (await footerBrand(page).evaluate((element) => element === document.activeElement)) {
          reachedFooterBrand = true;
          break;
        }
      }

      expect(reachedFooterBrand, 'sequential focus reaches the Footer brand link').toBe(true);
      await expect(footerBrand(page)).toBeFocused();

      for (const group of GROUPS) {
        await page.keyboard.press('Tab');
        await expect(disclosure(page, group.title)).toBeFocused();
      }

      await page.keyboard.press('Tab');
      await expect(footer(page).getByRole('link', { name: SUPPORT_PHONE })).toBeFocused();
    });
  });

  test('opening a disclosure by keyboard keeps focus on the control', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    const control = disclosure(page, GROUPS[1].title);
    await control.focus();
    await page.keyboard.press('Enter');

    await expect(disclosure(page, GROUPS[1].title)).toHaveAttribute('aria-expanded', 'true');
    await expect(disclosure(page, GROUPS[1].title)).toBeFocused();
  });

  test('200 percent zoom keeps the Footer usable', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 512 });
    await page.goto('/GoodCall/');

    await expectFooterInventory(page);
    await expect(footer(page).getByText(SUPPORT_PHONE)).toBeVisible();
    await expect(legalNav(page).getByRole('link')).toHaveCount(3);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('400 percent zoom resolves to the compact Footer composition', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await page.goto('/GoodCall/');

    for (const group of GROUPS) {
      await expect(disclosure(page, group.title)).toBeVisible();
    }

    await disclosure(page, GROUPS[0].title).click();
    await expect(
      groupNav(page, GROUPS[0].title).getByRole('link', { name: GROUPS[0].sample, exact: true })
    ).toBeVisible();
    await expect(footer(page).getByText(HEAD_OFFICE)).toBeVisible();

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('low-height viewport keeps the Footer scrollable and unobscured', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto('/GoodCall/');

    const position = await footer(page).evaluate(
      (element) => window.getComputedStyle(element).position
    );
    expect(['static', 'relative']).toContain(position);

    await legalNav(page).getByRole('link', { name: LEGAL_LINKS[2].label }).scrollIntoViewIfNeeded();
    await expect(legalNav(page).getByRole('link', { name: LEGAL_LINKS[2].label })).toBeVisible();
  });

  test('coarse pointer toggles disclosures and follows links by tap', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    try {
      await page.goto('/GoodCall/');

      await disclosure(page, GROUPS[1].title).tap();
      await expect(disclosure(page, GROUPS[1].title)).toHaveAttribute('aria-expanded', 'true');

      await groupNav(page, GROUPS[1].title)
        .getByRole('link', { name: GROUPS[1].sample, exact: true })
        .tap();

      await expect(page).toHaveURL(`/GoodCall${GROUPS[1].path}`);
      await expect(page.locator('h1')).toHaveText('О компании');
    } finally {
      await context.close();
    }
  });

  test('forced colors keeps Footer controls and current state perceivable', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/about');

    for (const group of GROUPS) {
      const control = disclosure(page, group.title);
      await expect(control).toBeVisible();

      const boundary = await control.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return { style: style.borderTopStyle, width: parseFloat(style.borderTopWidth) };
      });
      expect(boundary.style).not.toBe('none');
      expect(boundary.width).toBeGreaterThan(0);
    }

    await disclosure(page, GROUPS[1].title).focus();
    await page.keyboard.press('Enter');
    await expect(disclosure(page, GROUPS[1].title)).toHaveAttribute('aria-expanded', 'true');

    const current = groupNav(page, GROUPS[1].title).getByRole('link', {
      name: GROUPS[1].sample,
      exact: true,
    });
    await expect(current).toHaveAttribute('aria-current', 'page');

    const treatment = await current.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { decoration: style.textDecorationLine, weight: Number(style.fontWeight) };
    });
    expect(treatment.decoration.includes('underline') || treatment.weight >= 600).toBe(true);

    await page.keyboard.press('Tab');
    await expect(current).toBeFocused();

    const focusIndicator = await current.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(focusIndicator.style).not.toBe('none');
    expect(focusIndicator.width).toBeGreaterThan(0);

    await expect(footer(page).getByText(VISA)).toBeVisible();
  });

  test('reduced motion keeps the Footer immediately usable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await disclosure(page, GROUPS[0].title).click();
    await expect(
      groupNav(page, GROUPS[0].title).getByRole('link', { name: GROUPS[0].sample, exact: true })
    ).toBeVisible();
  });

  test('axe passes for the expanded Footer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');
    await expect(footer(page)).toHaveCount(1);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes for the compact Footer with disclosures closed', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');
    await expect(disclosure(page, GROUPS[0].title)).toHaveAttribute('aria-expanded', 'false');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes for the compact Footer with one disclosure open', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await disclosure(page, GROUPS[0].title).click();
    await expect(disclosure(page, GROUPS[0].title)).toHaveAttribute('aria-expanded', 'true');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes on a legal route with a current Footer link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/privacy-policy');
    await expect(
      legalNav(page).getByRole('link', { name: LEGAL_LINKS[0].label, exact: true })
    ).toHaveAttribute('aria-current', 'page');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes on the catch-all Footer', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/unknown-footer-path');
    await expect(footer(page)).toHaveCount(1);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });
});

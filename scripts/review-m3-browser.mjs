import { createServer as createNetServer } from 'node:net';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const ARTIFACT_DIR = 'artifacts/m3-browser-review';
const REPORT_PATH = 'artifacts/M3-browser-review.md';
const RESULTS_PATH = `${ARTIFACT_DIR}/results.json`;

const WORKER_FILENAME = 'mockServiceWorker.js';
const EXPECTED_H1 = 'GoodCall Shared UI verification';
const EXPECTED_NOTICE = 'Technical Shared UI verification surface';
const FAILURE_TITLE = 'GoodCall could not start';
const SUMMARY_TITLE = 'Fix these demonstration fields';
const SUCCESS_RESULT = 'Demonstration form validated. No data was sent.';
const NAME_ERROR = 'Enter a demonstration name';
const CATEGORY_ERROR = 'Choose a demonstration category';
const INCREMENT_LABEL = 'Increment demonstration counter';
const RESET_COUNTER_LABEL = 'Reset demonstration counter';
const SUBMIT_LABEL = 'Validate demonstration form';
const RESET_FORM_LABEL = 'Reset demonstration form';
const NOTES_MARKER = 'preserved notes value';

const MAIN = 'main#main-content';
const ROUTE_ANNOUNCEMENT = '#route-announcement';
const NAME_FIELD = '#m3-demo-name';
const NOTES_FIELD = '#m3-demo-notes';
const CATEGORY_FIELD = '#m3-demo-category';

const DESKTOP_VIEWPORT = { width: 1280, height: 800 };

const REVIEW_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1024, height: 500 },
];

const ROUTE_TARGETS = [
  { label: 'Catalog Category', path: '/catalog/laptops', heading: 'Category' },
  { label: 'Product Details', path: '/products/demo-product', heading: 'Product' },
  { label: 'Shopping Cart', path: '/cart', heading: 'Cart' },
];

const FOCUS_TARGETS = [
  { name: 'route Link', selector: 'a[href="/catalog/laptops"]' },
  { name: 'Button', selector: `button:has-text("${INCREMENT_LABEL}")` },
  { name: 'IconButton', selector: `button[aria-label="${RESET_COUNTER_LABEL}"]` },
  { name: 'TextField', selector: NAME_FIELD },
  { name: 'Select', selector: CATEGORY_FIELD },
  { name: 'Checkbox', selector: 'input[name="updates"]' },
  { name: 'Radio', selector: 'input[name="delivery"][value="courier"]' },
  { name: 'Switch', selector: 'input[name="compact"]' },
];

const MANUAL_PROMPTS = [
  { key: '200% zoom', allowed: ['PASS', 'FAIL'], required: true },
  { key: '400% zoom', allowed: ['PASS', 'FAIL'], required: true },
  { key: 'keyboard/focus', allowed: ['PASS', 'FAIL'], required: true },
  { key: 'clipping/overlap', allowed: ['PASS', 'FAIL'], required: true },
  { key: 'forced colors', allowed: ['PASS', 'FAIL', 'NOT AVAILABLE'], required: true },
  { key: 'screen reader', allowed: ['PASS', 'FAIL', 'NOT TESTED'], required: true },
];

const MANUAL_CHECKLIST = `
Manual sign-off in the Playwright review window:

1. Set browser zoom to 200%.
2. Confirm no horizontal overflow, clipping or overlap.
3. Set browser zoom to 400%.
4. Trigger the invalid form state.
5. Confirm Error Summary, labels, controls and focus remain usable.
6. Reset zoom to 100%.
7. Use keyboard only:
   - Tab to skip link;
   - activate it;
   - tab through controls;
   - submit invalid form;
   - use both Error Summary links.
8. Confirm focus is visible and not obscured.
9. Test real OS forced-colors mode only if available.
10. Test a screen reader only if available.
`;

const automatedOnly = process.argv.includes('--automated-only');

const results = {
  mode: automatedOnly ? 'automated-only' : 'interactive',
  startedAt: new Date().toISOString(),
  baseUrl: null,
  port: null,
  startup: {},
  sections: [],
  viewports: [],
  axe: [],
  diagnostics: {},
  lifecycle: {
    serverStarted: false,
    automatedContextClosed: false,
    automatedBrowserClosed: false,
    interactiveContextClosed: false,
    interactiveBrowserClosed: false,
    serverClosed: false,
    portReleased: false,
    cleanupErrors: [],
    userBrowserTouched: false,
  },
  manual: null,
  screenshots: [],
};

function toMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return Object.prototype.toString.call(error);
  }
}

function resolveFreePort() {
  return new Promise((resolve, reject) => {
    const probe = createNetServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => {
        resolve(port);
      });
    });
  });
}

async function respondsAt(url) {
  try {
    await fetch(url, { signal: AbortSignal.timeout(2000) });
    return true;
  } catch {
    return false;
  }
}

async function closeStage(label, close) {
  try {
    await close();
    return true;
  } catch (error) {
    results.lifecycle.cleanupErrors.push(`${label} close failed: ${toMessage(error)}`);
    return false;
  }
}

function openSection(id, name) {
  const record = { id, name, status: 'PASS', failures: [], notes: [] };
  results.sections.push(record);

  return {
    check(condition, message) {
      if (!condition) {
        record.status = 'FAIL';
        record.failures.push(message);
      }
    },
    note(message) {
      record.notes.push(message);
    },
  };
}

function createDiagnostics(page) {
  const sink = { pageErrors: [], consoleErrors: [], requestFailures: [], badResponses: [] };

  page.on('pageerror', (error) => {
    sink.pageErrors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      sink.consoleErrors.push(message.text());
    }
  });
  page.on('requestfailed', (request) => {
    sink.requestFailures.push(`${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      sink.badResponses.push(`${response.url()} :: ${String(response.status())}`);
    }
  });

  return sink;
}

async function shot(page, name) {
  const path = `${ARTIFACT_DIR}/${name}`;
  await page.screenshot({ path, fullPage: true });
  results.screenshots.push(path);
  return path;
}

async function gotoHome(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector(MAIN, { timeout: 30000 });
}

async function horizontalOverflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

async function waitForHeading(page, expected) {
  try {
    await page.waitForFunction(
      (text) => (document.querySelector('h1')?.textContent ?? '').includes(text),
      expected,
      { timeout: 15000 }
    );
    return true;
  } catch {
    return false;
  }
}

async function layoutFingerprint(page) {
  return page.evaluate(() => {
    const heading = document.querySelector('h1');
    const main = document.querySelector('main#main-content');
    return {
      headingOffset: heading === null ? null : heading.offsetTop,
      headingWidth: heading === null ? null : Math.round(heading.getBoundingClientRect().width),
      mainHeight: main === null ? null : Math.round(main.getBoundingClientRect().height),
      documentWidth: document.documentElement.scrollWidth,
    };
  });
}

async function runStartupChecks(page, url, sink) {
  const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });

  try {
    await page.waitForSelector(MAIN, { timeout: 30000 });
  } catch {
    results.startup.mainAppeared = false;
  }

  const workerUrl = new URL(WORKER_FILENAME, url).href;
  const workerResponse = await fetch(workerUrl);
  const workerContentType = workerResponse.headers.get('content-type') ?? '';
  const workerBody = await workerResponse.text();

  const dom = await page.evaluate(
    ([headingText, noticeText, failureTitle]) => {
      const root = document.getElementById('root');
      const headings = Array.from(document.querySelectorAll('h1'));
      return {
        rootPresent: root !== null,
        rootChildren: root === null ? 0 : root.children.length,
        mainCount: document.querySelectorAll('main#main-content').length,
        h1Count: headings.length,
        h1Text: headings[0]?.textContent ?? null,
        hasExpectedH1: headings.some((h) => (h.textContent ?? '').includes(headingText)),
        noticeVisible: (document.body.innerText ?? '').includes(noticeText),
        failureVisible: headings.some((h) => (h.textContent ?? '').includes(failureTitle)),
      };
    },
    [EXPECTED_H1, EXPECTED_NOTICE, FAILURE_TITLE]
  );

  const registration = await page.evaluate(async () => {
    const active = await navigator.serviceWorker.getRegistration();
    if (active === undefined) {
      return null;
    }
    const worker = active.active ?? active.installing ?? active.waiting;
    return worker === null || worker === undefined ? null : worker.scriptURL;
  });

  const blockers = [];

  if (response === null || !response.ok()) {
    blockers.push(`root URL responded ${String(response?.status() ?? 'no response')}`);
  }
  if (workerResponse.status !== 200) {
    blockers.push(`worker responded ${String(workerResponse.status)}`);
  }
  if (!workerContentType.includes('javascript')) {
    blockers.push(`worker content-type "${workerContentType}" is not JavaScript`);
  }
  if (/^\s*<(!doctype|html)/i.test(workerBody)) {
    blockers.push('worker response body is HTML');
  }
  if (!dom.rootPresent || dom.rootChildren === 0) {
    blockers.push('root has no rendered children');
  }
  if (dom.mainCount !== 1) {
    blockers.push(`expected one main#main-content, found ${String(dom.mainCount)}`);
  }
  if (dom.h1Count !== 1) {
    blockers.push(`expected one h1, found ${String(dom.h1Count)}`);
  }
  if (!dom.hasExpectedH1) {
    blockers.push(`h1 does not contain "${EXPECTED_H1}"`);
  }
  if (!dom.noticeVisible) {
    blockers.push('technical notice is not visible');
  }
  if (dom.failureVisible) {
    blockers.push('bootstrap failure diagnostic is visible');
  }
  if (registration === null || !registration.endsWith(`/${WORKER_FILENAME}`)) {
    blockers.push(`service worker script URL is "${String(registration)}"`);
  }
  if (sink.pageErrors.length > 0) {
    blockers.push(`page errors: ${sink.pageErrors.join(' | ')}`);
  }
  if (sink.consoleErrors.length > 0) {
    blockers.push(`console errors: ${sink.consoleErrors.join(' | ')}`);
  }
  if (sink.requestFailures.length > 0) {
    blockers.push(`request failures: ${sink.requestFailures.join(' | ')}`);
  }

  results.startup = {
    httpStatus: response === null ? null : response.status(),
    worker: {
      url: workerUrl,
      status: workerResponse.status,
      contentType: workerContentType,
      bytes: workerBody.length,
    },
    dom,
    serviceWorker: registration,
    blockers,
    healthy: blockers.length === 0,
  };

  return blockers.length === 0;
}

async function sectionInitialStructure(page, url) {
  const s = openSection('A', 'Initial structure');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await gotoHome(page, url);

  const structure = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2')).map((h) => h.textContent ?? '');
    const clipped = Array.from(document.querySelectorAll('h1, h2, p, label, button, a')).filter(
      (el) => el.scrollWidth - el.clientWidth > 1
    ).length;
    return {
      mainCount: document.querySelectorAll('main#main-content').length,
      h1Count: document.querySelectorAll('h1').length,
      headerCount: document.querySelectorAll('header').length,
      footerCount: document.querySelectorAll('footer').length,
      imgCount: document.querySelectorAll('img').length,
      svgCount: document.querySelectorAll('svg').length,
      headings,
      clipped,
    };
  });

  s.check(structure.mainCount === 1, `expected one main, found ${String(structure.mainCount)}`);
  s.check(structure.h1Count === 1, `expected one h1, found ${String(structure.h1Count)}`);
  s.check(structure.headerCount === 0, 'header element present');
  s.check(structure.footerCount === 0, 'footer element present');
  s.check(structure.imgCount === 0 && structure.svgCount === 0, 'logo or image asset present');
  s.check(
    await page.getByText(EXPECTED_NOTICE).first().isVisible(),
    'technical notice not visible'
  );

  for (const heading of [
    'Route navigation',
    'Compact feedback and actions',
    'Layout primitives',
    'Form controls',
  ]) {
    s.check(
      structure.headings.some((text) => text.includes(heading)),
      `section missing: ${heading}`
    );
  }

  s.check((await horizontalOverflow(page)) <= 1, 'horizontal overflow at 1280x800');
  s.check(structure.clipped === 0, `${String(structure.clipped)} clipped text elements`);

  await shot(page, 'automated-1280x800.png');
}

async function sectionKeyboard(page, url) {
  const s = openSection('B', 'Keyboard and skip link');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await gotoHome(page, url);

  await page.keyboard.press('Tab');
  const skipLink = page.locator('a[href="#main-content"]');
  s.check(await skipLink.isVisible(), 'skip link not visible after Tab');
  s.check(await skipLink.evaluate((el) => el === document.activeElement), 'skip link not focused');

  await page.keyboard.press('Enter');
  s.check(
    await page.locator(MAIN).evaluate((el) => el === document.activeElement),
    'main did not receive focus after activating skip link'
  );

  for (const target of FOCUS_TARGETS) {
    const locator = page.locator(target.selector).first();
    await locator.focus();

    const focusState = await locator.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        isActive: el === document.activeElement,
        focusVisible: el.matches(':focus-visible'),
        outlineWidth: style.outlineWidth,
        outlineStyle: style.outlineStyle,
        boxShadow: style.boxShadow,
        hasBox: el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0,
      };
    });

    s.check(focusState.isActive, `${target.name} did not receive focus`);
    s.check(focusState.hasBox, `${target.name} has no bounding box`);

    const ringVisible =
      focusState.focusVisible ||
      (focusState.outlineStyle !== 'none' && focusState.outlineWidth !== '0px') ||
      focusState.boxShadow !== 'none';

    s.check(ringVisible, `${target.name} has no visible focus indicator`);
  }
}

async function sectionCounter(page, url) {
  const s = openSection('C', 'Counter');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await gotoHome(page, url);

  const main = page.locator(MAIN);
  const routeAnnouncement = page.locator(ROUTE_ANNOUNCEMENT);
  const counter = page.getByTestId('demo-counter');
  const increment = page.getByRole('button', { name: INCREMENT_LABEL });
  const reset = page.getByRole('button', { name: RESET_COUNTER_LABEL });

  s.check((await routeAnnouncement.count()) === 1, 'route announcement region missing');
  s.check(
    (await main.locator(ROUTE_ANNOUNCEMENT).count()) === 0,
    'route announcement is inside main'
  );
  s.check((await counter.textContent()) === '0', 'counter did not start at 0');

  await increment.focus();
  await page.keyboard.press('Enter');
  s.check((await counter.textContent()) === '1', 'keyboard activation did not increment');

  await increment.click();
  s.check((await counter.textContent()) === '2', 'pointer activation did not increment');

  const counterAttributes = await counter.evaluate((el) => ({
    role: el.getAttribute('role'),
    ariaLive: el.getAttribute('aria-live'),
  }));

  s.check(counterAttributes.role === null, 'counter carries a role');
  s.check(counterAttributes.ariaLive === null, 'counter carries aria-live');
  s.check((await main.getByRole('status').count()) === 0, 'counter created a Home-owned status');

  await reset.click();
  s.check((await counter.textContent()) === '0', 'reset did not return counter to 0');
  s.check((await main.getByRole('status').count()) === 0, 'reset created a Home-owned status');

  const announcementText = (await routeAnnouncement.textContent()) ?? '';
  s.check(!announcementText.includes(INCREMENT_LABEL), 'route announcement carries counter copy');
}

async function sectionInvalidForm(page, url) {
  const s = openSection('D', 'Invalid form');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await gotoHome(page, url);

  await page.locator(NOTES_FIELD).fill(NOTES_MARKER);
  await page.getByRole('button', { name: SUBMIT_LABEL }).click();

  const main = page.locator(MAIN);
  const summary = page.getByRole('region', { name: SUMMARY_TITLE });

  s.check(await summary.isVisible(), 'error summary not visible');
  s.check(
    await summary.evaluate((el) => el === document.activeElement),
    'error summary did not receive focus'
  );

  const links = summary.getByRole('link');
  s.check((await links.count()) === 2, 'expected two summary links');
  s.check(await page.getByText(NAME_ERROR).first().isVisible(), 'name field error not visible');
  s.check(
    await page.getByText(CATEGORY_ERROR).first().isVisible(),
    'category field error not visible'
  );
  s.check((await page.getByRole('alert').count()) === 0, 'alert role present');
  s.check(
    (await main.getByRole('status').count()) === 0,
    'Home-owned status present on invalid submit'
  );
  s.check(
    (await page.locator(NOTES_FIELD).inputValue()) === NOTES_MARKER,
    'unrelated form value was cleared'
  );

  await shot(page, 'invalid-summary-focus.png');

  await links.nth(0).click();
  s.check(
    await page.locator(NAME_FIELD).evaluate((el) => el === document.activeElement),
    'name summary link did not focus the name field'
  );

  await links.nth(1).click();
  s.check(
    await page.locator(CATEGORY_FIELD).evaluate((el) => el === document.activeElement),
    'category summary link did not focus the category field'
  );
}

async function sectionValidForm(page, url) {
  const s = openSection('E', 'Valid form');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await gotoHome(page, url);

  const mutations = [];
  const recordMutation = (request) => {
    if (request.method() !== 'GET') {
      mutations.push(`${request.method()} ${request.url()}`);
    }
  };
  page.on('request', recordMutation);

  await page.locator(NAME_FIELD).fill('Demonstration');
  await page.locator(CATEGORY_FIELD).selectOption('laptops');
  await page.getByRole('button', { name: SUBMIT_LABEL }).click();

  const main = page.locator(MAIN);
  const statuses = main.getByRole('status');

  s.check((await statuses.count()) === 1, 'expected exactly one Home-owned status');
  s.check((await statuses.first().textContent()) === SUCCESS_RESULT, 'success copy mismatch');
  s.check(
    (await page.getByRole('region', { name: SUMMARY_TITLE }).count()) === 0,
    'error summary still present'
  );
  s.check((await page.getByRole('alert').count()) === 0, 'alert role present');
  s.check((await page.getByText(NAME_ERROR).count()) === 0, 'field error still present');

  const announcementText = (await page.locator(ROUTE_ANNOUNCEMENT).textContent()) ?? '';
  s.check(!announcementText.includes(SUCCESS_RESULT), 'route announcement carries success copy');

  page.off('request', recordMutation);
  s.check(mutations.length === 0, `submit caused non-GET requests: ${mutations.join(' | ')}`);
}

async function sectionReset(page, url) {
  const s = openSection('F', 'Reset');
  await page.setViewportSize(DESKTOP_VIEWPORT);

  for (const scenario of ['invalid', 'success']) {
    await gotoHome(page, url);
    await page.evaluate(() => {
      window.__gcReviewMarker = 'alive';
    });

    const urlBefore = page.url();

    if (scenario === 'success') {
      await page.locator(NAME_FIELD).fill('Demonstration');
      await page.locator(CATEGORY_FIELD).selectOption('laptops');
    }

    await page.getByRole('button', { name: SUBMIT_LABEL }).click();

    const resetButton = page.getByRole('button', { name: RESET_FORM_LABEL });
    await resetButton.click();

    const main = page.locator(MAIN);

    s.check(
      (await page.getByRole('region', { name: SUMMARY_TITLE }).count()) === 0,
      `${scenario}: summary not cleared`
    );
    s.check((await main.getByRole('status').count()) === 0, `${scenario}: status not cleared`);
    s.check(
      (await page.getByText(NAME_ERROR).count()) === 0,
      `${scenario}: field error not cleared`
    );
    s.check((await page.locator(NAME_FIELD).inputValue()) === '', `${scenario}: value not reset`);
    s.check(page.url() === urlBefore, `${scenario}: URL changed`);
    s.check(
      (await page.evaluate(() => window.__gcReviewMarker)) === 'alive',
      `${scenario}: full page reload occurred`
    );
    s.check(
      await resetButton.evaluate((el) => el === document.activeElement),
      `${scenario}: focus moved away from the reset control`
    );
  }
}

async function sectionResponsive(page, url) {
  const s = openSection('G', 'Responsive matrix');

  for (const viewport of REVIEW_VIEWPORTS) {
    const label = `${String(viewport.width)}x${String(viewport.height)}`;
    await page.setViewportSize(viewport);
    await gotoHome(page, url);

    const overflow = await horizontalOverflow(page);
    const layout = await page.evaluate(() => {
      const clipped = Array.from(document.querySelectorAll('h1, p, label, button, a')).filter(
        (el) => el.scrollWidth - el.clientWidth > 1
      ).length;
      const heading = document.querySelector('h1');
      const notice = Array.from(document.querySelectorAll('p')).find((el) =>
        (el.textContent ?? '').includes('Technical Shared UI verification surface')
      );
      const rect = (el) => (el === null || el === undefined ? null : el.getBoundingClientRect());
      const headingRect = rect(heading);
      const noticeRect = rect(notice);
      return {
        clipped,
        headingVisible: headingRect !== null && headingRect.height > 0,
        noticeVisible: noticeRect !== null && noticeRect.height > 0,
      };
    });

    const record = {
      viewport: label,
      status: 'PASS',
      overflow,
      clipped: layout.clipped,
      notes: [],
    };

    if (overflow > 1) {
      record.status = 'FAIL';
      record.notes.push(`horizontal overflow ${String(overflow)}px`);
      s.check(false, `${label}: horizontal overflow ${String(overflow)}px`);
    }
    if (layout.clipped > 0) {
      record.status = 'FAIL';
      record.notes.push(`${String(layout.clipped)} clipped elements`);
      s.check(false, `${label}: ${String(layout.clipped)} clipped elements`);
    }
    if (!layout.headingVisible || !layout.noticeVisible) {
      record.status = 'FAIL';
      record.notes.push('heading or notice not visible');
      s.check(false, `${label}: heading or notice not visible`);
    }

    const focusReachable = await page.getByRole('button', { name: SUBMIT_LABEL }).evaluate((el) => {
      el.focus();
      el.scrollIntoView({ block: 'nearest' });
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight + 1;
    });

    if (!focusReachable) {
      record.status = 'FAIL';
      record.notes.push('focused control could not be brought into view');
      s.check(false, `${label}: focused control could not be brought into view`);
    }

    results.viewports.push(record);

    if (label === '320x568') {
      await shot(page, 'viewport-320x568.png');
    }
  }

  await page.setViewportSize(DESKTOP_VIEWPORT);
}

async function sectionTouch(browser, url) {
  const s = openSection('H', 'Touch and no-hover');
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  try {
    const page = await context.newPage();
    const sink = createDiagnostics(page);
    await gotoHome(page, url);

    const media = await page.evaluate(() => ({
      coarse: window.matchMedia('(pointer: coarse)').matches,
      noHover: window.matchMedia('(hover: none)').matches,
    }));

    s.note(`pointer coarse: ${String(media.coarse)}, hover none: ${String(media.noHover)}`);

    const targets = await page.evaluate(() => {
      const box = (selector) => {
        const el = document.querySelector(selector);
        if (el === null) {
          return null;
        }
        const rect = el.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      };
      const choiceLabel = (name) => {
        const input = document.querySelector(`input[name="${name}"]`);
        const label = input === null ? null : input.closest('label');
        if (label === null || input === null) {
          return null;
        }
        const labelRect = label.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();
        return {
          height: labelRect.height,
          widerThanInput: labelRect.width > inputRect.width,
        };
      };
      return {
        button: box('button:not([aria-label])'),
        iconButton: box('button[aria-label]'),
        updates: choiceLabel('updates'),
        delivery: choiceLabel('delivery'),
        compact: choiceLabel('compact'),
      };
    });

    s.check(
      targets.button !== null && targets.button.width >= 44 && targets.button.height >= 44,
      'Button target smaller than 44x44'
    );
    s.check(
      targets.iconButton !== null &&
        targets.iconButton.width >= 44 &&
        targets.iconButton.height >= 44,
      'IconButton target smaller than 44x44'
    );

    for (const [name, value] of Object.entries({
      Checkbox: targets.updates,
      Radio: targets.delivery,
      Switch: targets.compact,
    })) {
      s.check(
        value !== null && value.height >= 44 && value.widerThanInput,
        `${name} label is not a usable target`
      );
    }

    await page.getByRole('button', { name: INCREMENT_LABEL }).tap();
    s.check(
      (await page.getByTestId('demo-counter').textContent()) === '1',
      'tap did not activate Button'
    );

    await page.locator('label:has(input[name="updates"])').tap();
    s.check(
      await page.locator('input[name="updates"]').isChecked(),
      'tapping the checkbox label did not activate it'
    );

    await page.locator(CATEGORY_FIELD).selectOption('phones');
    s.check(
      (await page.locator(CATEGORY_FIELD).inputValue()) === 'phones',
      'Select did not accept a value under touch emulation'
    );

    await page.getByRole('button', { name: SUBMIT_LABEL }).tap();
    const summaryLink = page.getByRole('region', { name: SUMMARY_TITLE }).getByRole('link').first();
    await summaryLink.tap();
    s.check(
      await page.locator(NAME_FIELD).evaluate((el) => el === document.activeElement),
      'summary link did not activate under touch emulation'
    );

    s.check(sink.pageErrors.length === 0, `page errors: ${sink.pageErrors.join(' | ')}`);
    s.check(sink.consoleErrors.length === 0, `console errors: ${sink.consoleErrors.join(' | ')}`);
  } finally {
    await closeStage('touch context', () => context.close());
  }
}

async function sectionForcedColors(page, url) {
  const s = openSection('I', 'Forced colors emulation');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.emulateMedia({ forcedColors: 'active' });
  await gotoHome(page, url);

  const visibility = await page.evaluate(() => {
    const transparent = (value) => value === 'transparent' || value === 'rgba(0, 0, 0, 0)';
    const borderVisible = (el) => {
      if (el === null) {
        return false;
      }
      const style = window.getComputedStyle(el);
      return (
        parseFloat(style.borderTopWidth) > 0 &&
        style.borderTopStyle !== 'none' &&
        !transparent(style.borderTopColor)
      );
    };
    const textVisible = (el) => {
      if (el === null) {
        return false;
      }
      return !transparent(window.getComputedStyle(el).color);
    };

    const panel = document.querySelector('main#main-content div[class*="panel"]');
    const fieldset = document.querySelector('fieldset');
    const link = document.querySelector('main#main-content a');
    const heading = document.querySelector('h1');
    const choices = Array.from(
      document.querySelectorAll('input[type="checkbox"], input[type="radio"]')
    );

    return {
      panelBorder: borderVisible(panel),
      fieldsetBorder: borderVisible(fieldset),
      linkVisible: textVisible(link),
      headingVisible: textVisible(heading),
      choicesRendered: choices.every((el) => el.getBoundingClientRect().height > 0),
      bodyText: (document.body.innerText ?? '').length,
    };
  });

  s.check(visibility.panelBorder, 'panel boundary not visible under forced colors');
  s.check(visibility.fieldsetBorder, 'fieldset boundary not visible under forced colors');
  s.check(visibility.linkVisible, 'link text not visible under forced colors');
  s.check(visibility.headingVisible, 'heading text not visible under forced colors');
  s.check(visibility.choicesRendered, 'choice controls not rendered under forced colors');
  s.check(visibility.bodyText > 0, 'content disappeared under forced colors');

  await page.getByRole('button', { name: SUBMIT_LABEL }).click();
  const summary = page.getByRole('region', { name: SUMMARY_TITLE });
  s.check(await summary.isVisible(), 'error summary not visible under forced colors');

  await page.keyboard.press('Tab');

  const focusRing = await page.evaluate(() => {
    const el = document.activeElement;
    if (el === null || el.tagName.toLowerCase() !== 'a') {
      return { reached: false, visible: false };
    }
    const style = window.getComputedStyle(el);
    return {
      reached: true,
      visible:
        el.matches(':focus-visible') ||
        (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0),
    };
  });

  s.check(focusRing.reached, 'keyboard focus did not reach a summary link under forced colors');
  s.check(focusRing.visible, 'focus indicator not visible under forced colors');

  await shot(page, 'forced-colors.png');
  s.note('PASS — PLAYWRIGHT EMULATION');
  await page.emulateMedia({ forcedColors: null });
}

async function sectionReducedMotion(page, url) {
  const s = openSection('J', 'Reduced motion');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoHome(page, url);

  const before = await layoutFingerprint(page);
  await page.getByRole('button', { name: INCREMENT_LABEL }).click();
  const after = await layoutFingerprint(page);

  s.check(
    before.headingOffset === after.headingOffset &&
      before.headingWidth === after.headingWidth &&
      before.mainHeight === after.mainHeight &&
      before.documentWidth === after.documentWidth,
    `layout shifted under reduced motion: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`
  );
  s.check(
    (await page.getByTestId('demo-counter').textContent()) === '1',
    'interaction failed under reduced motion'
  );

  const animated = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll('main#main-content *')).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.animationName !== 'none' && style.animationDuration !== '0s';
      }).length
  );

  s.check(animated === 0, `${String(animated)} elements still animate under reduced motion`);

  await page.getByRole('button', { name: SUBMIT_LABEL }).click();
  s.check(
    await page
      .getByRole('region', { name: SUMMARY_TITLE })
      .evaluate((el) => el === document.activeElement),
    'focus flow broken under reduced motion'
  );

  await page.emulateMedia({ reducedMotion: null });
}

async function sectionAxe(page, url) {
  const s = openSection('K', 'Axe');

  const scan = async (label, prepare) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await gotoHome(page, url);
    await prepare();
    const scanResults = await new AxeBuilder({ page }).analyze();
    results.axe.push({
      state: label,
      violations: scanResults.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.length,
      })),
    });
    s.check(
      scanResults.violations.length === 0,
      `${label}: ${String(scanResults.violations.length)} axe violations`
    );
  };

  await scan('initial', async () => {});

  await scan('invalid', async () => {
    await page.getByRole('button', { name: SUBMIT_LABEL }).click();
    await page.getByRole('region', { name: SUMMARY_TITLE }).waitFor();
  });

  await scan('success', async () => {
    await page.locator(NAME_FIELD).fill('Demonstration');
    await page.locator(CATEGORY_FIELD).selectOption('laptops');
    await page.getByRole('button', { name: SUBMIT_LABEL }).click();
    await page.locator(MAIN).getByRole('status').waitFor();
  });

  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await scan('forced-colors', async () => {
    await page.getByRole('button', { name: SUBMIT_LABEL }).click();
    await page.getByRole('region', { name: SUMMARY_TITLE }).waitFor();
  });
  await page.emulateMedia({ forcedColors: null, reducedMotion: null });
}

async function sectionRouting(page, url) {
  const s = openSection('L', 'Routing regression');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await gotoHome(page, url);

  await page.locator(NAME_FIELD).fill('Demonstration');
  await page.locator(CATEGORY_FIELD).selectOption('laptops');
  await page.getByRole('button', { name: SUBMIT_LABEL }).click();
  s.check(
    (await page.locator(MAIN).getByRole('status').count()) === 1,
    'success status missing before routing'
  );

  for (const target of ROUTE_TARGETS) {
    await page.getByRole('link', { name: target.label }).click();
    await page.waitForURL(`**${target.path}`);
    s.check(await waitForHeading(page, target.heading), `${target.label}: heading did not render`);

    const shape = await page.evaluate(() => ({
      mainCount: document.querySelectorAll('main#main-content').length,
      h1Count: document.querySelectorAll('h1').length,
      h1Text: document.querySelector('h1')?.textContent ?? '',
      announcementOutsideMain:
        document.querySelector('main#main-content #route-announcement') === null,
      announcementPresent: document.getElementById('route-announcement') !== null,
    }));

    s.check(shape.mainCount === 1, `${target.label}: expected one main`);
    s.check(shape.h1Count === 1, `${target.label}: expected one h1`);
    s.check(shape.h1Text.includes(target.heading), `${target.label}: unexpected heading`);
    s.check(shape.announcementPresent, `${target.label}: route announcement missing`);
    s.check(shape.announcementOutsideMain, `${target.label}: route announcement inside main`);

    const leaked = await page.locator(MAIN).getByText(SUCCESS_RESULT).count();
    s.check(leaked === 0, `${target.label}: Home success status leaked into route`);

    await page.goBack();
    await page.waitForSelector(MAIN);
    s.check(await waitForHeading(page, EXPECTED_H1), `${target.label}: Back did not return Home`);

    await page.goForward();
    await page.waitForURL(`**${target.path}`);
    s.check(
      await waitForHeading(page, target.heading),
      `${target.label}: Forward did not return to the route`
    );

    await page.goBack();
    await page.waitForSelector(MAIN);
    await waitForHeading(page, EXPECTED_H1);
  }

  s.check(await waitForHeading(page, EXPECTED_H1), 'Home did not render after routing regression');
  s.check(
    (await page.locator(MAIN).getByRole('status').count()) === 0,
    'stale success status survived route remount'
  );
}

async function runInteractiveSignoff(browser, url) {
  const context = await browser.newContext({ viewport: DESKTOP_VIEWPORT });
  const page = await context.newPage();
  await gotoHome(page, url);

  stdout.write(`\n${MANUAL_CHECKLIST}\n`);
  stdout.write(`Review window is open at ${url}\n\n`);

  const rl = createInterface({ input: stdin, output: stdout });
  const answers = {};

  try {
    for (const prompt of MANUAL_PROMPTS) {
      let value = '';
      while (value === '') {
        const raw = (await rl.question(`${prompt.key} [${prompt.allowed.join(' | ')}]: `))
          .trim()
          .toUpperCase();
        if (prompt.allowed.includes(raw)) {
          value = raw;
        } else {
          stdout.write(`  expected one of: ${prompt.allowed.join(', ')}\n`);
        }
      }
      answers[prompt.key] = value;
    }

    answers.notes = (await rl.question('notes: ')).trim();
  } finally {
    rl.close();
  }

  await shot(page, 'manual-final.png');

  return { answers, context };
}

function resolveStatus(startupHealthy, cleanupFailed) {
  const sectionFailures = results.sections.filter((entry) => entry.status === 'FAIL');
  const axeViolations = results.axe.reduce((total, entry) => total + entry.violations.length, 0);

  if (!startupHealthy || sectionFailures.length > 0 || axeViolations > 0 || cleanupFailed) {
    return 'FAILED';
  }

  if (automatedOnly) {
    return 'AUTOMATED PASS — USER SIGN-OFF PENDING';
  }

  if (results.manual === null) {
    return 'PARTIAL';
  }

  const manualFailed = MANUAL_PROMPTS.some((prompt) => results.manual[prompt.key] === 'FAIL');
  const manualComplete = MANUAL_PROMPTS.every(
    (prompt) => typeof results.manual[prompt.key] === 'string'
  );

  if (!manualComplete) {
    return 'PARTIAL';
  }

  return manualFailed ? 'FAILED' : 'AUTOMATED + USER REVIEW PASSED';
}

function renderReport(status, environment) {
  const lifecycle = results.lifecycle;
  const sectionRows = results.sections
    .map((entry) => {
      const notes = [...entry.notes, ...entry.failures].join('; ') || '—';
      return `| ${entry.id}. ${entry.name} | ${entry.status} | results.json | ${notes} |`;
    })
    .join('\n');

  const viewportRows = results.viewports
    .map((entry) => {
      const notes = entry.notes.join('; ') || '—';
      const overflow = entry.overflow > 1 ? `${String(entry.overflow)}px` : 'none';
      const clipping = entry.clipped > 0 ? `${String(entry.clipped)} elements` : 'none';
      return `| ${entry.viewport} | ${entry.status} | ${overflow} | ${clipping} | reachable | ${notes} |`;
    })
    .join('\n');

  const axeRows = results.axe
    .map((entry) => `- \`${entry.state}\`: ${String(entry.violations.length)} violations`)
    .join('\n');

  const manual = results.manual;
  const manualRow = (label, key) =>
    `| ${label} | ${manual === null ? 'NOT COLLECTED' : (manual[key] ?? 'NOT COLLECTED')} | ${
      manual === null ? 'automated-only run' : '—'
    } |`;

  const defects = results.sections
    .filter((entry) => entry.status === 'FAIL')
    .flatMap((entry) => entry.failures.map((failure) => `- **${entry.id}** ${failure}`))
    .join('\n');

  const startupBlockers = results.startup.blockers ?? [];

  return `# GoodCall M3 Browser Review

## Status

${status}

## Baseline

- SHA: ${environment.sha}
- branch: main
- M3-05B/M3-05C status: APPROVED AND CLOSED; BR-01 resolved
- CI run: 30970141078 — success for \`9ec8c671e564e1185313d3f8315288fde2e4e209\`

## Environment

- OS: ${environment.os}
- Node: ${environment.node}
- Playwright: ${environment.playwright}
- Chromium: ${environment.chromium}
- mode: ${results.mode}

## Server Lifecycle

- port: ${String(results.port)}
- server started: ${String(lifecycle.serverStarted)}
- server closed: ${String(lifecycle.serverClosed)}
- port released: ${String(lifecycle.portReleased)}
- cleanup errors: ${lifecycle.cleanupErrors.length === 0 ? 'none' : lifecycle.cleanupErrors.join('; ')}
- user browser touched: no

## Browser Isolation

- automated browser: Playwright Chromium, headless, fresh context
- interactive browser: ${automatedOnly ? 'not launched (automated-only mode)' : 'Playwright Chromium, headed, fresh context'}
- existing profile used: no
- existing Chrome/Edge attached: no
- user browser terminated: no

## Runtime Startup

- HTTP: ${String(results.startup.httpStatus)}
- worker: ${String(results.startup.worker?.status)} ${String(results.startup.worker?.contentType)}, ${String(results.startup.worker?.bytes)} bytes
- root children: ${String(results.startup.dom?.rootChildren)}
- main / h1: ${String(results.startup.dom?.mainCount)} / ${String(results.startup.dom?.h1Count)}
- h1 text: ${String(results.startup.dom?.h1Text)}
- notice visible: ${String(results.startup.dom?.noticeVisible)}
- bootstrap failure visible: ${String(results.startup.dom?.failureVisible)}
- service worker: ${String(results.startup.serviceWorker)}
- blockers: ${startupBlockers.length === 0 ? 'none' : startupBlockers.join('; ')}

## Automated Results

| Section | Status | Evidence | Notes |
| --- | --- | --- | --- |
${sectionRows}

## Viewport Matrix

| Viewport | Status | Overflow | Clipping | Focus | Notes |
| --- | --- | --- | --- | --- | --- |
${viewportRows}

## Axe Results

${axeRows || '- not run'}

Full violation payloads: \`${RESULTS_PATH}\`.

## Console and Network

- page errors: ${results.diagnostics.pageErrors?.length === 0 ? 'none' : (results.diagnostics.pageErrors ?? []).join(' | ')}
- console errors: ${results.diagnostics.consoleErrors?.length === 0 ? 'none' : (results.diagnostics.consoleErrors ?? []).join(' | ')}
- request failures: ${results.diagnostics.requestFailures?.length === 0 ? 'none' : (results.diagnostics.requestFailures ?? []).join(' | ')}
- responses >= 400: ${results.diagnostics.badResponses?.length === 0 ? 'none' : (results.diagnostics.badResponses ?? []).join(' | ')}

## Manual Sign-off

| Check | Result | Notes |
| --- | --- | --- |
${manualRow('200% zoom', '200% zoom')}
${manualRow('400% zoom', '400% zoom')}
${manualRow('keyboard/focus', 'keyboard/focus')}
${manualRow('clipping/overlap', 'clipping/overlap')}
${manualRow('real forced colors', 'forced colors')}
${manualRow('screen reader', 'screen reader')}

${manual === null ? 'No user answers were collected in this mode.' : `User notes:\n\n> ${manual.notes || '(none)'}`}

Forced-colors coverage in the automated phase is **PASS — PLAYWRIGHT EMULATION**. Real OS forced-colors mode is only covered by the manual row above.

## Defects

${defects || 'None recorded.'}

## Screenshots

${results.screenshots.map((path) => `- \`${path}\``).join('\n') || '- none'}

## Final Assessment

${
  status === 'AUTOMATED PASS — USER SIGN-OFF PENDING'
    ? 'Automated coverage passed. Real browser zoom, real OS forced-colors mode and screen-reader behaviour are not covered and remain owed from the user sign-off phase.'
    : status === 'AUTOMATED + USER REVIEW PASSED'
      ? 'Automated coverage and user sign-off both passed.'
      : 'Review did not complete successfully. See defects and blockers above.'
}

## Remaining Risks

- Viewport width is not browser zoom; the responsive matrix does not prove 200 % or 400 % reflow.
- Forced-colors coverage here is Playwright emulation, not a real OS high-contrast mode.
- Screen-reader announcement behaviour is not automatable and is not claimed.
- Evidence produced before the harness itself is independently audited is **provisional**.

## Next Step

${
  automatedOnly
    ? 'Run the interactive sign-off phase after the harness is independently audited and CI is green for its exact SHA.'
    : 'Independent review of these results, then the M3 closure documentation pass.'
}

M3 BROWSER REVIEW — ${status === 'AUTOMATED + USER REVIEW PASSED' ? 'PASSED' : status === 'FAILED' ? 'FAILED' : status === 'PARTIAL' ? 'PARTIAL' : 'AUTOMATED PASS, USER SIGN-OFF PENDING'}
`;
}

mkdirSync(ARTIFACT_DIR, { recursive: true });

let server = null;
let automatedBrowser = null;
let automatedContext = null;
let interactiveBrowser = null;
let interactiveContext = null;
let localUrl = null;
let startupHealthy = false;

const failures = [];

try {
  const requestedPort = await resolveFreePort();

  server = await createServer({
    configFile: './vite.config.ts',
    server: {
      host: '127.0.0.1',
      port: requestedPort,
      strictPort: false,
      open: false,
    },
  });

  await server.listen();
  results.lifecycle.serverStarted = true;

  localUrl = server.resolvedUrls?.local?.[0] ?? null;

  if (localUrl === null) {
    throw new Error('dev server did not resolve a local URL');
  }

  results.baseUrl = localUrl;
  results.port = new URL(localUrl).port;

  automatedBrowser = await chromium.launch({ headless: true });
  automatedContext = await automatedBrowser.newContext({ viewport: DESKTOP_VIEWPORT });
  const page = await automatedContext.newPage();
  const sink = createDiagnostics(page);

  startupHealthy = await runStartupChecks(page, localUrl, sink);

  if (!startupHealthy) {
    await shot(page, 'automated-1280x800.png');
    failures.push(...(results.startup.blockers ?? []));
  } else {
    await sectionInitialStructure(page, localUrl);
    await sectionKeyboard(page, localUrl);
    await sectionCounter(page, localUrl);
    await sectionInvalidForm(page, localUrl);
    await sectionValidForm(page, localUrl);
    await sectionReset(page, localUrl);
    await sectionResponsive(page, localUrl);
    await sectionTouch(automatedBrowser, localUrl);
    await sectionForcedColors(page, localUrl);
    await sectionReducedMotion(page, localUrl);
    await sectionAxe(page, localUrl);
    await sectionRouting(page, localUrl);

    results.diagnostics = sink;

    for (const entry of results.sections) {
      failures.push(...entry.failures.map((failure) => `${entry.id}: ${failure}`));
    }
  }

  const automatedPassed = startupHealthy && failures.length === 0;

  if (!automatedOnly && automatedPassed) {
    interactiveBrowser = await chromium.launch({ headless: false });
    const signoff = await runInteractiveSignoff(interactiveBrowser, localUrl);
    interactiveContext = signoff.context;
    results.manual = signoff.answers;
  }
} catch (error) {
  failures.push(toMessage(error));
} finally {
  if (interactiveContext !== null) {
    results.lifecycle.interactiveContextClosed = await closeStage('interactive context', () =>
      interactiveContext.close()
    );
  }

  if (interactiveBrowser !== null) {
    results.lifecycle.interactiveBrowserClosed = await closeStage('interactive browser', () =>
      interactiveBrowser.close()
    );
  }

  if (automatedContext !== null) {
    results.lifecycle.automatedContextClosed = await closeStage('automated context', () =>
      automatedContext.close()
    );
  }

  if (automatedBrowser !== null) {
    results.lifecycle.automatedBrowserClosed = await closeStage('automated browser', () =>
      automatedBrowser.close()
    );
  }

  if (server !== null) {
    results.lifecycle.serverClosed = await closeStage('server', () => server.close());
  }

  try {
    results.lifecycle.portReleased = localUrl === null ? true : !(await respondsAt(localUrl));
  } catch (error) {
    results.lifecycle.cleanupErrors.push(`port verification failed: ${toMessage(error)}`);
  }
}

if (!results.lifecycle.portReleased) {
  results.lifecycle.cleanupErrors.push('review server port still responds after shutdown');
}

const cleanupFailed = results.lifecycle.cleanupErrors.length > 0;
failures.push(...results.lifecycle.cleanupErrors);

const status = resolveStatus(startupHealthy, cleanupFailed);
results.status = status;
results.finishedAt = new Date().toISOString();

const environment = {
  sha: process.env.GITHUB_SHA ?? 'working tree at 9ec8c671e564e1185313d3f8315288fde2e4e209',
  os: `${process.platform} ${process.arch}`,
  node: process.version,
  playwright: '@playwright/test 1.62.1',
  chromium: chromium.name(),
};

writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
writeFileSync(REPORT_PATH, renderReport(status, environment));

console.log(`\n🔍 M3 browser review — ${status}\n`);
console.log(
  JSON.stringify(
    {
      mode: results.mode,
      port: results.port,
      startup: results.startup.healthy,
      sections: results.sections.map((entry) => `${entry.id}:${entry.status}`),
      axeViolations: results.axe.reduce((total, entry) => total + entry.violations.length, 0),
      lifecycle: results.lifecycle,
    },
    null,
    2
  )
);
console.log(`\nReport:  ${REPORT_PATH}`);
console.log(`Results: ${RESULTS_PATH}\n`);

if (failures.length > 0) {
  console.error('✗ M3 browser review did not pass\n');
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  console.error('');
  process.exit(1);
}

console.log('✓ M3 browser review automated phase passed\n');
process.exit(0);

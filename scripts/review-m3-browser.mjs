import { execFileSync } from 'node:child_process';
import { createServer as createNetServer } from 'node:net';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const ARTIFACT_DIR = 'artifacts/m3-browser-review';
const REPORT_PATH = 'artifacts/M3-browser-review.md';
const RESULTS_PATH = `${ARTIFACT_DIR}/results.json`;

const REVIEW_SHA_ENV = 'GOODCALL_REVIEW_SHA';
const REQUIRED_BRANCH = 'main';

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
const OVERLAP_TOLERANCE_PX = 1;
const MAX_TAB_STOPS = 90;
const AXE_HTML_CAP = 400;

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
  { key: 'route Link', selector: 'a[href="/catalog/laptops"]' },
  { key: 'Button', tag: 'button', text: INCREMENT_LABEL },
  { key: 'IconButton', ariaLabel: RESET_COUNTER_LABEL },
  { key: 'TextField', selector: NAME_FIELD },
  { key: 'Select', selector: CATEGORY_FIELD },
  { key: 'Checkbox', selector: 'input[name="updates"]' },
  { key: 'Radio', selector: 'input[name="delivery"][value="courier"]' },
  { key: 'Switch', selector: 'input[name="compact"]' },
];

const OVERLAP_PAIRS = [
  { name: 'H1 vs notice', a: 'main#main-content h1', b: 'main#main-content p' },
  { name: 'feedback primitives', a: 'main#main-content span', b: 'main#main-content span' },
  { name: 'counter actions', a: 'main#main-content button', b: 'main#main-content button' },
  { name: 'field labels vs controls', a: 'main#main-content label', b: 'main#main-content input' },
  { name: 'errors vs fields', a: 'main#main-content label', b: 'main#main-content select' },
];

const RESET_DEFAULTS = {
  name: '',
  notes: '',
  category: '',
  updates: false,
  delivery: null,
  compact: false,
};

const EXPECTED_DIAGNOSTICS = [];

const MANUAL_PROMPTS = [
  { key: '200% zoom', allowed: ['PASS', 'FAIL'] },
  { key: '400% zoom', allowed: ['PASS', 'FAIL'] },
  { key: 'keyboard/focus', allowed: ['PASS', 'FAIL'] },
  { key: 'clipping/overlap', allowed: ['PASS', 'FAIL'] },
  { key: 'forced colors', allowed: ['PASS', 'FAIL', 'NOT AVAILABLE'] },
  { key: 'screen reader', allowed: ['PASS', 'FAIL', 'NOT TESTED'] },
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

const STATUS = {
  AUTOMATED_PENDING: 'AUTOMATED PASS — USER SIGN-OFF PENDING',
  FULL_PASS: 'AUTOMATED + USER REVIEW PASSED',
  FAILED: 'FAILED',
  PARTIAL: 'PARTIAL',
};

const EXIT_CODES = {
  [STATUS.AUTOMATED_PENDING]: 0,
  [STATUS.FULL_PASS]: 0,
  [STATUS.FAILED]: 1,
  [STATUS.PARTIAL]: 1,
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

function resolveFinalStatus(input) {
  const hardFailure =
    !input.baselineEligible ||
    input.startupBlockers > 0 ||
    input.automatedFailures > 0 ||
    input.axeViolations > 0 ||
    input.diagnosticsFailures > 0 ||
    input.cleanupErrors > 0 ||
    !input.portReleased;

  if (hardFailure) {
    return STATUS.FAILED;
  }

  if (input.manual !== null && input.manual.failed) {
    return STATUS.FAILED;
  }

  if (input.interrupted) {
    return STATUS.PARTIAL;
  }

  if (input.executionErrors > 0) {
    return STATUS.FAILED;
  }

  if (input.mode === 'automated-only') {
    return STATUS.AUTOMATED_PENDING;
  }

  if (input.manual === null || !input.manual.complete) {
    return STATUS.PARTIAL;
  }

  return STATUS.FULL_PASS;
}

function exitCodeForStatus(status) {
  return EXIT_CODES[status] ?? 1;
}

function evaluateReviewBaseline(input) {
  const blockers = [];
  const requiresExactBaseline = input.mode === 'interactive' || input.approvedSha !== null;

  if (!input.repo.available) {
    blockers.push(`repository evidence unavailable: ${String(input.repo.error)}`);
  }

  if (input.mode === 'interactive' && input.approvedSha === null) {
    blockers.push(`final interactive review requires ${REVIEW_SHA_ENV}`);
  }

  if (requiresExactBaseline && input.repo.available) {
    if (input.approvedSha !== null && input.repo.headSha !== input.approvedSha) {
      blockers.push(
        `HEAD ${String(input.repo.headSha)} does not match approved SHA ${input.approvedSha}`
      );
    }
    if (input.repo.branch !== REQUIRED_BRANCH) {
      blockers.push(`branch is ${String(input.repo.branch)}, expected ${REQUIRED_BRANCH}`);
    }
    if (!input.repo.trackedTreeClean) {
      blockers.push('tracked working tree is dirty');
    }
  }

  const eligible = blockers.length === 0;
  const finalEligible = eligible && input.approvedSha !== null;

  return {
    eligible,
    finalEligible,
    evidenceClass: finalEligible ? 'FINAL-ELIGIBLE' : 'PROVISIONAL',
    exactMatch: input.approvedSha === null ? null : input.repo.headSha === input.approvedSha,
    blockers,
  };
}

function summariseManual(answers) {
  if (answers === null) {
    return null;
  }

  const complete = MANUAL_PROMPTS.every((prompt) => typeof answers[prompt.key] === 'string');
  const failed = MANUAL_PROMPTS.some((prompt) => answers[prompt.key] === 'FAIL');

  return { complete, failed, answers };
}

function collectRepositoryEvidence() {
  const run = (args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

  try {
    return {
      available: true,
      headSha: run(['rev-parse', 'HEAD']),
      branch: run(['branch', '--show-current']),
      trackedTreeClean: run(['status', '--porcelain', '--untracked-files=no']) === '',
      error: null,
    };
  } catch (error) {
    return {
      available: false,
      headSha: null,
      branch: null,
      trackedTreeClean: false,
      error: toMessage(error),
    };
  }
}

function readPlaywrightVersion() {
  try {
    const manifest = JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8'));
    return typeof manifest.version === 'string' ? manifest.version : 'unknown';
  } catch {
    return 'unknown';
  }
}

function runSelfTest() {
  const base = {
    mode: 'automated-only',
    baselineEligible: true,
    startupBlockers: 0,
    executionErrors: 0,
    automatedFailures: 0,
    axeViolations: 0,
    diagnosticsFailures: 0,
    cleanupErrors: 0,
    portReleased: true,
    manual: null,
    interrupted: false,
  };

  const completeManual = summariseManual({
    '200% zoom': 'PASS',
    '400% zoom': 'PASS',
    'keyboard/focus': 'PASS',
    'clipping/overlap': 'PASS',
    'forced colors': 'NOT AVAILABLE',
    'screen reader': 'NOT TESTED',
    notes: '',
  });

  const failedManual = summariseManual({
    '200% zoom': 'FAIL',
    '400% zoom': 'PASS',
    'keyboard/focus': 'PASS',
    'clipping/overlap': 'PASS',
    'forced colors': 'PASS',
    'screen reader': 'PASS',
    notes: '',
  });

  const partialManual = summariseManual({ '200% zoom': 'PASS', '400% zoom': 'PASS' });

  const dirtyRepo = {
    available: true,
    headSha: 'a'.repeat(40),
    branch: 'main',
    trackedTreeClean: false,
    error: null,
  };
  const cleanRepo = { ...dirtyRepo, trackedTreeClean: true };

  const scenarios = [
    {
      name: 'automated-only pass',
      status: resolveFinalStatus(base),
      expected: STATUS.AUTOMATED_PENDING,
      exit: 0,
    },
    {
      name: 'automated failure',
      status: resolveFinalStatus({ ...base, automatedFailures: 2 }),
      expected: STATUS.FAILED,
      exit: 1,
    },
    {
      name: 'execution exception',
      status: resolveFinalStatus({ ...base, executionErrors: 1 }),
      expected: STATUS.FAILED,
      exit: 1,
    },
    {
      name: 'diagnostics failure',
      status: resolveFinalStatus({ ...base, diagnosticsFailures: 1 }),
      expected: STATUS.FAILED,
      exit: 1,
    },
    {
      name: 'manual FAIL',
      status: resolveFinalStatus({ ...base, mode: 'interactive', manual: failedManual }),
      expected: STATUS.FAILED,
      exit: 1,
    },
    {
      name: 'incomplete manual',
      status: resolveFinalStatus({ ...base, mode: 'interactive', manual: partialManual }),
      expected: STATUS.PARTIAL,
      exit: 1,
    },
    {
      name: 'interrupted sign-off',
      status: resolveFinalStatus({
        ...base,
        mode: 'interactive',
        manual: null,
        interrupted: true,
      }),
      expected: STATUS.PARTIAL,
      exit: 1,
    },
    {
      name: 'cleanup failure',
      status: resolveFinalStatus({ ...base, cleanupErrors: 1 }),
      expected: STATUS.FAILED,
      exit: 1,
    },
    {
      name: 'port not released',
      status: resolveFinalStatus({ ...base, portReleased: false }),
      expected: STATUS.FAILED,
      exit: 1,
    },
    {
      name: 'final interactive complete pass',
      status: resolveFinalStatus({ ...base, mode: 'interactive', manual: completeManual }),
      expected: STATUS.FULL_PASS,
      exit: 0,
    },
  ];

  const baselineScenarios = [
    {
      name: 'SHA mismatch rejected',
      result: evaluateReviewBaseline({
        mode: 'automated-only',
        approvedSha: 'b'.repeat(40),
        repo: cleanRepo,
      }),
      expectEligible: false,
    },
    {
      name: 'dirty tracked tree rejected',
      result: evaluateReviewBaseline({
        mode: 'interactive',
        approvedSha: 'a'.repeat(40),
        repo: dirtyRepo,
      }),
      expectEligible: false,
    },
    {
      name: 'interactive without approved SHA rejected',
      result: evaluateReviewBaseline({ mode: 'interactive', approvedSha: null, repo: cleanRepo }),
      expectEligible: false,
    },
    {
      name: 'automated-only without approved SHA is provisional',
      result: evaluateReviewBaseline({
        mode: 'automated-only',
        approvedSha: null,
        repo: cleanRepo,
      }),
      expectEligible: true,
      expectClass: 'PROVISIONAL',
    },
    {
      name: 'exact match is final-eligible',
      result: evaluateReviewBaseline({
        mode: 'interactive',
        approvedSha: 'a'.repeat(40),
        repo: cleanRepo,
      }),
      expectEligible: true,
      expectClass: 'FINAL-ELIGIBLE',
    },
  ];

  const failures = [];

  for (const scenario of scenarios) {
    const actualExit = exitCodeForStatus(scenario.status);
    if (scenario.status !== scenario.expected) {
      failures.push(`${scenario.name}: status ${scenario.status}, expected ${scenario.expected}`);
    }
    if (actualExit !== scenario.exit) {
      failures.push(
        `${scenario.name}: exit ${String(actualExit)}, expected ${String(scenario.exit)}`
      );
    }
    stdout.write(
      `  ${scenario.status === scenario.expected && actualExit === scenario.exit ? '✓' : '✗'} ${scenario.name} -> ${scenario.status} / exit ${String(actualExit)}\n`
    );
  }

  for (const scenario of baselineScenarios) {
    const okEligible = scenario.result.eligible === scenario.expectEligible;
    const okClass =
      scenario.expectClass === undefined || scenario.result.evidenceClass === scenario.expectClass;
    if (!okEligible || !okClass) {
      failures.push(
        `${scenario.name}: eligible ${String(scenario.result.eligible)}, class ${scenario.result.evidenceClass}`
      );
    }
    stdout.write(
      `  ${okEligible && okClass ? '✓' : '✗'} ${scenario.name} -> eligible ${String(scenario.result.eligible)}, ${scenario.result.evidenceClass}\n`
    );
  }

  return failures;
}

const mode = process.argv.includes('--automated-only') ? 'automated-only' : 'interactive';
const selfTest = process.argv.includes('--self-test');

if (selfTest) {
  stdout.write('\n🔍 M3 browser review — self-test (no server, no browser)\n\n');
  const failures = runSelfTest();
  if (failures.length > 0) {
    stdout.write('\n✗ self-test failed\n');
    for (const failure of failures) {
      stdout.write(`  - ${failure}\n`);
    }
    process.exit(1);
  }
  stdout.write('\n✓ self-test passed\n\n');
  process.exit(0);
}

const approvedSha = process.env[REVIEW_SHA_ENV] ?? null;
const repo = collectRepositoryEvidence();
const baseline = evaluateReviewBaseline({ mode, approvedSha, repo });

const results = {
  mode,
  startedAt: new Date().toISOString(),
  baseUrl: null,
  port: null,
  repository: {
    headSha: repo.headSha,
    branch: repo.branch,
    trackedTreeClean: repo.trackedTreeClean,
    approvedSha,
    exactMatch: baseline.exactMatch,
    evidenceClass: baseline.evidenceClass,
    finalReviewEligible: baseline.finalEligible,
    blockers: baseline.blockers,
  },
  environment: {
    os: `${process.platform} ${process.arch}`,
    node: process.version,
    playwright: readPlaywrightVersion(),
    chromium: null,
  },
  startup: {},
  sections: [],
  viewports: [],
  overlap: [],
  focusOrder: [],
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
  executionErrors: [],
  interrupted: false,
  screenshots: [],
};

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
    get failed() {
      return record.status === 'FAIL';
    },
  };
}

const diagnosticSinks = [];

function createDiagnostics(page, scope) {
  const sink = {
    scope,
    pageErrors: [],
    consoleErrors: [],
    requestFailures: [],
    badResponses: [],
    failedResources: [],
  };

  page.on('pageerror', (error) => {
    sink.pageErrors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      sink.consoleErrors.push(message.text());
    }
  });
  page.on('requestfailed', (request) => {
    const entry = `${request.resourceType()} ${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`;
    sink.requestFailures.push(entry);
    sink.failedResources.push({ type: request.resourceType(), url: request.url(), status: null });
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      const type = response.request().resourceType();
      sink.badResponses.push(`${type} ${response.url()} :: ${String(response.status())}`);
      sink.failedResources.push({ type, url: response.url(), status: response.status() });
    }
  });

  diagnosticSinks.push(sink);
  return sink;
}

function isExpectedDiagnostic(text) {
  return EXPECTED_DIAGNOSTICS.some((entry) =>
    entry.pattern instanceof RegExp ? entry.pattern.test(text) : text.includes(entry.pattern)
  );
}

function aggregateDiagnostics() {
  const aggregate = {
    pageErrors: [],
    consoleErrors: [],
    requestFailures: [],
    badResponses: [],
    failedResources: [],
  };

  for (const sink of diagnosticSinks) {
    for (const key of Object.keys(aggregate)) {
      for (const entry of sink[key]) {
        const text = typeof entry === 'string' ? entry : JSON.stringify(entry);
        if (!isExpectedDiagnostic(text)) {
          aggregate[key].push(typeof entry === 'string' ? `[${sink.scope}] ${entry}` : entry);
        }
      }
    }
  }

  return aggregate;
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

async function shot(page, name) {
  const path = `${ARTIFACT_DIR}/${name}`;
  await page.screenshot({ path, fullPage: true });
  if (!results.screenshots.includes(path)) {
    results.screenshots.push(path);
  }
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

async function clippedElements(page) {
  return page.evaluate(
    () =>
      Array.from(
        document.querySelectorAll(
          'main#main-content h1, main#main-content h2, main#main-content p, main#main-content label, main#main-content button, main#main-content a'
        )
      ).filter((el) => el.scrollWidth - el.clientWidth > 1).length
  );
}

async function overlapReport(page, pairs, tolerance) {
  return page.evaluate(
    ([definitions, allowance]) => {
      const intersects = (a, b) => {
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        return overlapX > allowance && overlapY > allowance;
      };

      const findings = [];

      for (const definition of definitions) {
        const groupA = Array.from(document.querySelectorAll(definition.a));
        const groupB = Array.from(document.querySelectorAll(definition.b));

        for (const first of groupA) {
          for (const second of groupB) {
            if (first === second || first.contains(second) || second.contains(first)) {
              continue;
            }
            const rectA = first.getBoundingClientRect();
            const rectB = second.getBoundingClientRect();
            if (rectA.height === 0 || rectB.height === 0) {
              continue;
            }
            if (intersects(rectA, rectB)) {
              findings.push({
                pair: definition.name,
                a: `${first.tagName.toLowerCase()}:${(first.textContent ?? '').trim().slice(0, 30)}`,
                b: `${second.tagName.toLowerCase()}:${(second.textContent ?? '').trim().slice(0, 30)}`,
              });
            }
          }
        }
      }

      return findings;
    },
    [pairs, tolerance]
  );
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

  const structure = await page.evaluate(() => ({
    mainCount: document.querySelectorAll('main#main-content').length,
    h1Count: document.querySelectorAll('h1').length,
    headerCount: document.querySelectorAll('header').length,
    footerCount: document.querySelectorAll('footer').length,
    imgCount: document.querySelectorAll('img').length,
    svgCount: document.querySelectorAll('svg').length,
    headings: Array.from(document.querySelectorAll('h2')).map((h) => h.textContent ?? ''),
  }));

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
  s.check((await clippedElements(page)) === 0, 'clipped text at 1280x800');

  const overlaps = await overlapReport(page, OVERLAP_PAIRS, OVERLAP_TOLERANCE_PX);
  results.overlap.push({ state: 'initial', viewport: '1280x800', findings: overlaps });
  s.check(overlaps.length === 0, `overlapping regions: ${JSON.stringify(overlaps.slice(0, 3))}`);

  await shot(page, 'automated-1280x800.png');
}

async function captureFocusBaseline(page) {
  return page.evaluate((targets) => {
    const find = (target) => {
      if (target.selector !== undefined) {
        return document.querySelector(target.selector);
      }
      if (target.ariaLabel !== undefined) {
        return document.querySelector(`[aria-label="${target.ariaLabel}"]`);
      }
      return (
        Array.from(document.querySelectorAll(target.tag ?? '*')).find(
          (el) => (el.textContent ?? '').trim() === target.text
        ) ?? null
      );
    };

    const snapshot = {};

    for (const target of targets) {
      const el = find(target);
      if (el === null) {
        snapshot[target.key] = null;
        continue;
      }
      const style = window.getComputedStyle(el);
      snapshot[target.key] = {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor,
        boxShadow: style.boxShadow,
        borderTopWidth: style.borderTopWidth,
        borderTopColor: style.borderTopColor,
        backgroundColor: style.backgroundColor,
      };
    }

    return snapshot;
  }, FOCUS_TARGETS);
}

async function describeActiveElement(page) {
  return page.evaluate((targets) => {
    const el = document.activeElement;
    if (el === null || el === document.body || el === document.documentElement) {
      return null;
    }

    const matchKey = () => {
      for (const target of targets) {
        if (target.selector !== undefined && el.matches(target.selector)) {
          return target.key;
        }
        if (target.ariaLabel !== undefined && el.getAttribute('aria-label') === target.ariaLabel) {
          return target.key;
        }
        if (
          target.text !== undefined &&
          el.tagName.toLowerCase() === (target.tag ?? el.tagName.toLowerCase()) &&
          (el.textContent ?? '').trim() === target.text
        ) {
          return target.key;
        }
      }
      return null;
    };

    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const centreX = rect.left + rect.width / 2;
    const centreY = rect.top + rect.height / 2;
    const hit = document.elementFromPoint(centreX, centreY);

    const documentOrder = Array.from(document.querySelectorAll('*')).indexOf(el);

    return {
      key: matchKey(),
      tag: el.tagName.toLowerCase(),
      label: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40),
      documentOrder,
      focusVisible: el.matches(':focus-visible'),
      style: {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor,
        boxShadow: style.boxShadow,
        borderTopWidth: style.borderTopWidth,
        borderTopColor: style.borderTopColor,
        backgroundColor: style.backgroundColor,
      },
      rect: { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom },
      inViewport:
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth,
      obscured: hit !== null && hit !== el && !el.contains(hit) && !hit.contains(el),
    };
  }, FOCUS_TARGETS);
}

function transparent(color) {
  return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
}

function hasVisibleFocusIndicator(focused, baseline) {
  const outlineVisible =
    focused.outlineStyle !== 'none' &&
    parseFloat(focused.outlineWidth) > 0 &&
    !transparent(focused.outlineColor);

  const shadowVisible =
    focused.boxShadow !== 'none' && !focused.boxShadow.includes('rgba(0, 0, 0, 0)');

  if (outlineVisible || shadowVisible) {
    return true;
  }

  if (baseline === null || baseline === undefined) {
    return false;
  }

  return (
    focused.borderTopWidth !== baseline.borderTopWidth ||
    focused.borderTopColor !== baseline.borderTopColor ||
    focused.backgroundColor !== baseline.backgroundColor
  );
}

async function walkTabOrder(page, limit) {
  const stops = [];

  for (let index = 0; index < limit; index += 1) {
    await page.keyboard.press('Tab');
    const stop = await describeActiveElement(page);
    if (stop === null) {
      break;
    }
    stops.push(stop);
    if (stops.filter((entry) => entry.key !== null).length === FOCUS_TARGETS.length) {
      break;
    }
  }

  return stops;
}

async function sectionKeyboard(page, url) {
  const s = openSection('B', 'Keyboard and skip link');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await gotoHome(page, url);

  const baselineStyles = await captureFocusBaseline(page);

  await page.keyboard.press('Tab');
  const skipLink = page.locator('a[href="#main-content"]');
  s.check(await skipLink.isVisible(), 'skip link not visible after Tab');
  s.check(await skipLink.evaluate((el) => el === document.activeElement), 'skip link not focused');

  await page.keyboard.press('Enter');
  s.check(
    await page.locator(MAIN).evaluate((el) => el === document.activeElement),
    'main did not receive focus after activating skip link'
  );

  const stops = await walkTabOrder(page, MAX_TAB_STOPS);
  results.focusOrder = stops.map((stop) => ({
    key: stop.key,
    tag: stop.tag,
    label: stop.label,
    focusVisible: stop.focusVisible,
  }));

  const reached = new Map();
  for (const stop of stops) {
    if (stop.key !== null && !reached.has(stop.key)) {
      reached.set(stop.key, stop);
    }
  }

  for (const target of FOCUS_TARGETS) {
    const stop = reached.get(target.key);
    s.check(stop !== undefined, `${target.key} was never reached by keyboard navigation`);

    if (stop === undefined) {
      continue;
    }

    s.check(stop.focusVisible, `${target.key} did not match :focus-visible`);
    s.check(
      hasVisibleFocusIndicator(stop.style, baselineStyles[target.key]),
      `${target.key} has no materially visible focus indicator`
    );
    s.check(stop.inViewport, `${target.key} focus target is outside the viewport`);
    s.check(!stop.obscured, `${target.key} focus target is obscured by another element`);
  }

  const reachedOrder = Array.from(reached.values()).map((stop) => stop.documentOrder);
  const ascending = reachedOrder.every(
    (value, index) => index === 0 || value > reachedOrder[index - 1]
  );
  s.check(ascending, 'representative controls were not reached in DOM order');

  await page.keyboard.press('Shift+Tab');
  const backwards = await describeActiveElement(page);
  s.check(backwards !== null, 'Shift+Tab did not move focus backwards');
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

async function readFormState(page) {
  return page.evaluate(() => {
    const value = (selector) => document.querySelector(selector)?.value ?? null;
    const checked = (selector) => document.querySelector(selector)?.checked ?? null;
    const selectedRadio = Array.from(document.querySelectorAll('input[name="delivery"]')).find(
      (el) => el.checked
    );
    return {
      name: value('#m3-demo-name'),
      notes: value('#m3-demo-notes'),
      category: value('#m3-demo-category'),
      updates: checked('input[name="updates"]'),
      delivery: selectedRadio === undefined ? null : selectedRadio.value,
      compact: checked('input[name="compact"]'),
    };
  });
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

    await page.locator(NOTES_FIELD).fill(NOTES_MARKER);
    await page.locator('input[name="updates"]').check();
    await page.locator('input[name="delivery"][value="pickup"]').check();
    await page.locator('input[name="compact"]').check();

    if (scenario === 'success') {
      await page.locator(NAME_FIELD).fill('Demonstration');
      await page.locator(CATEGORY_FIELD).selectOption('laptops');
    }

    await page.getByRole('button', { name: SUBMIT_LABEL }).click();

    const resetButton = page.getByRole('button', { name: RESET_FORM_LABEL });
    await resetButton.click();

    const main = page.locator(MAIN);
    const state = await readFormState(page);

    for (const [field, expected] of Object.entries(RESET_DEFAULTS)) {
      s.check(
        state[field] === expected,
        `${scenario}: ${field} is ${JSON.stringify(state[field])}, expected ${JSON.stringify(expected)}`
      );
    }

    s.check(
      (await page.getByRole('region', { name: SUMMARY_TITLE }).count()) === 0,
      `${scenario}: summary not cleared`
    );
    s.check((await main.getByRole('status').count()) === 0, `${scenario}: status not cleared`);
    s.check(
      (await page.getByText(NAME_ERROR).count()) === 0,
      `${scenario}: field error not cleared`
    );
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

async function measureState(page, s, viewportLabel, state) {
  const overflow = await horizontalOverflow(page);
  const clipped = await clippedElements(page);
  const overlaps = await overlapReport(page, OVERLAP_PAIRS, OVERLAP_TOLERANCE_PX);

  results.overlap.push({ state, viewport: viewportLabel, findings: overlaps });

  const failures = [];

  if (overflow > 1) {
    failures.push(`horizontal overflow ${String(overflow)}px`);
  }
  if (clipped > 0) {
    failures.push(`${String(clipped)} clipped elements`);
  }
  if (overlaps.length > 0) {
    failures.push(`${String(overlaps.length)} overlapping regions`);
  }

  for (const failure of failures) {
    s.check(false, `${viewportLabel} ${state}: ${failure}`);
  }

  return { overflow, clipped, overlaps: overlaps.length, failures };
}

async function sectionResponsive(page, url) {
  const s = openSection('G', 'Responsive matrix');

  for (const viewport of REVIEW_VIEWPORTS) {
    const label = `${String(viewport.width)}x${String(viewport.height)}`;
    await page.setViewportSize(viewport);
    await gotoHome(page, url);

    const initial = await measureState(page, s, label, 'initial');

    const visible = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      const notice = Array.from(document.querySelectorAll('p')).find((el) =>
        (el.textContent ?? '').includes('Technical Shared UI verification surface')
      );
      return {
        heading: heading !== null && heading.getBoundingClientRect().height > 0,
        notice: notice !== undefined && notice.getBoundingClientRect().height > 0,
      };
    });

    s.check(visible.heading, `${label} initial: heading not visible`);
    s.check(visible.notice, `${label} initial: notice not visible`);

    await page.getByRole('button', { name: SUBMIT_LABEL }).click();
    const summary = page.getByRole('region', { name: SUMMARY_TITLE });
    await summary.waitFor();

    const invalid = await measureState(page, s, label, 'invalid');

    s.check(await summary.isVisible(), `${label} invalid: error summary not visible`);
    s.check(
      await summary.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      }),
      `${label} invalid: focused error summary not within the viewport`
    );
    s.check(
      (await summary.getByRole('link').count()) === 2,
      `${label} invalid: summary links missing`
    );
    s.check(
      await page.getByText(NAME_ERROR).first().isVisible(),
      `${label} invalid: field error not visible`
    );

    await page.locator(NAME_FIELD).fill('Demonstration');
    await page.locator(CATEGORY_FIELD).selectOption('laptops');
    await page.getByRole('button', { name: SUBMIT_LABEL }).click();
    const status = page.locator(MAIN).getByRole('status');
    await status.waitFor();

    const success = await measureState(page, s, label, 'success');

    s.check(await status.isVisible(), `${label} success: status not visible`);
    s.check(
      await page.getByRole('button', { name: RESET_FORM_LABEL }).isVisible(),
      `${label} success: form actions not visible`
    );

    results.viewports.push({
      viewport: label,
      status:
        initial.failures.length + invalid.failures.length + success.failures.length === 0
          ? 'PASS'
          : 'FAIL',
      initial,
      invalid,
      success,
    });

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
    createDiagnostics(page, 'touch');
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
        return { height: labelRect.height, widerThanInput: labelRect.width > inputRect.width };
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

    await page.getByRole('button', { name: RESET_COUNTER_LABEL }).tap();
    s.check(
      (await page.getByTestId('demo-counter').textContent()) === '0',
      'tap did not activate IconButton'
    );

    await page.locator('label:has(input[name="updates"])').tap();
    s.check(
      await page.locator('input[name="updates"]').isChecked(),
      'tapping the checkbox label did not activate it'
    );

    await page.locator('label:has(input[name="delivery"][value="pickup"])').tap();
    s.check(
      await page.locator('input[name="delivery"][value="pickup"]').isChecked(),
      'tapping the radio label did not activate it'
    );

    await page.locator('label:has(input[name="compact"])').tap();
    s.check(
      await page.locator('input[name="compact"]').isChecked(),
      'tapping the switch label did not activate it'
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
  } finally {
    await closeStage('touch context', () => context.close());
  }
}

async function choiceStateDistinct(page, selector) {
  const locator = page.locator(selector);
  await locator.uncheck({ force: true }).catch(() => undefined);
  const unchecked = await locator.screenshot();
  await locator.check({ force: true });
  const checked = await locator.screenshot();
  return !unchecked.equals(checked);
}

async function sectionForcedColors(page, url) {
  const s = openSection('I', 'Forced colors emulation');
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.emulateMedia({ forcedColors: 'active' });
  await gotoHome(page, url);

  const visibility = await page.evaluate(() => {
    const isTransparent = (value) => value === 'transparent' || value === 'rgba(0, 0, 0, 0)';
    const borderVisible = (el) => {
      if (el === null || el === undefined) {
        return false;
      }
      const style = window.getComputedStyle(el);
      return (
        parseFloat(style.borderTopWidth) > 0 &&
        style.borderTopStyle !== 'none' &&
        !isTransparent(style.borderTopColor)
      );
    };
    const textVisible = (el) => {
      if (el === null || el === undefined) {
        return false;
      }
      return !isTransparent(window.getComputedStyle(el).color);
    };
    const byText = (text) =>
      Array.from(document.querySelectorAll('main#main-content span')).find(
        (el) => (el.textContent ?? '').trim() === text
      );

    return {
      panelBorder: borderVisible(document.querySelector('main#main-content div[class*="panel"]')),
      fieldsetBorder: borderVisible(document.querySelector('fieldset')),
      badgeBorder: borderVisible(byText('Technical')),
      statusBorder: borderVisible(byText('Verification surface')),
      counterBorder: borderVisible(document.querySelector('[data-testid="demo-counter"]')),
      inlineStatusBorder: borderVisible(
        document.querySelector('main#main-content div[class*="inline-status"]')
      ),
      linkVisible: textVisible(document.querySelector('main#main-content a')),
      headingVisible: textVisible(document.querySelector('h1')),
      bodyText: (document.body.innerText ?? '').length,
    };
  });

  s.check(visibility.panelBorder, 'panel boundary not visible under forced colors');
  s.check(visibility.fieldsetBorder, 'fieldset boundary not visible under forced colors');
  s.check(visibility.badgeBorder, 'Badge boundary not visible under forced colors');
  s.check(visibility.statusBorder, 'Status boundary not visible under forced colors');
  s.check(visibility.counterBorder, 'Counter boundary not visible under forced colors');
  s.check(visibility.inlineStatusBorder, 'InlineStatus boundary not visible under forced colors');
  s.check(visibility.linkVisible, 'link text not visible under forced colors');
  s.check(visibility.headingVisible, 'heading text not visible under forced colors');
  s.check(visibility.bodyText > 0, 'content disappeared under forced colors');

  s.check(
    await choiceStateDistinct(page, 'input[name="updates"]'),
    'checkbox checked and unchecked states are visually identical under forced colors'
  );
  s.check(
    await choiceStateDistinct(page, 'input[name="delivery"][value="courier"]'),
    'radio checked and unchecked states are visually identical under forced colors'
  );
  s.check(
    await choiceStateDistinct(page, 'input[name="compact"]'),
    'switch on and off states are visually identical under forced colors'
  );

  await page.getByRole('button', { name: SUBMIT_LABEL }).click();
  const summary = page.getByRole('region', { name: SUMMARY_TITLE });
  s.check(await summary.isVisible(), 'error summary not visible under forced colors');
  s.check(
    await summary.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== 'none';
    }),
    'error summary boundary not visible under forced colors'
  );

  await page.keyboard.press('Tab');
  const focused = await describeActiveElement(page);

  s.check(
    focused !== null && focused.tag === 'a',
    'keyboard focus did not reach a summary link under forced colors'
  );
  s.check(focused !== null && focused.focusVisible, 'summary link is not :focus-visible');
  s.check(
    focused !== null && hasVisibleFocusIndicator(focused.style, null),
    'focus indicator not materially visible under forced colors'
  );

  await shot(page, 'forced-colors.png');
  s.note(s.failed ? 'FAIL — PLAYWRIGHT EMULATION' : 'PASS — PLAYWRIGHT EMULATION');
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
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        tags: violation.tags,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          impact: node.impact,
          failureSummary: node.failureSummary,
          html: (node.html ?? '').slice(0, AXE_HTML_CAP),
        })),
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
      announcementOutsideMain:
        document.querySelector('main#main-content #route-announcement') === null,
      announcementPresent: document.getElementById('route-announcement') !== null,
    }));

    s.check(shape.mainCount === 1, `${target.label}: expected one main`);
    s.check(shape.h1Count === 1, `${target.label}: expected one h1`);
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

function sectionDiagnosticsGate() {
  const s = openSection('M', 'Runtime diagnostics gate');
  const aggregate = aggregateDiagnostics();
  results.diagnostics = aggregate;

  s.check(aggregate.pageErrors.length === 0, `page errors: ${aggregate.pageErrors.join(' | ')}`);
  s.check(
    aggregate.consoleErrors.length === 0,
    `console errors: ${aggregate.consoleErrors.join(' | ')}`
  );
  s.check(
    aggregate.requestFailures.length === 0,
    `request failures: ${aggregate.requestFailures.join(' | ')}`
  );
  s.check(
    aggregate.badResponses.length === 0,
    `unexpected HTTP >= 400: ${aggregate.badResponses.join(' | ')}`
  );

  const criticalTypes = ['script', 'stylesheet', 'fetch', 'xhr', 'document', 'serviceworker'];
  const criticalFailures = aggregate.failedResources.filter((entry) =>
    criticalTypes.includes(entry.type)
  );

  s.check(
    criticalFailures.length === 0,
    `failed critical resources: ${JSON.stringify(criticalFailures.slice(0, 5))}`
  );

  return s;
}

async function runInteractiveSignoff(page, url, signal) {
  await gotoHome(page, url);

  stdout.write(`\n${MANUAL_CHECKLIST}\n`);
  stdout.write(`Review window is open at ${url}\n\n`);

  const rl = createInterface({ input: stdin, output: stdout });
  const answers = {};

  try {
    for (const prompt of MANUAL_PROMPTS) {
      let value = '';
      while (value === '') {
        const raw = (
          await rl.question(`${prompt.key} [${prompt.allowed.join(' | ')}]: `, { signal })
        )
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

    answers.notes = (await rl.question('notes: ', { signal })).trim();
  } finally {
    rl.close();
  }

  return answers;
}

mkdirSync(ARTIFACT_DIR, { recursive: true });

let server = null;
let automatedBrowser = null;
let automatedContext = null;
let interactiveBrowser = null;
let interactiveContext = null;
let localUrl = null;
let startupHealthy = false;

const abortController = new AbortController();

function onInterrupt() {
  results.interrupted = true;
  abortController.abort();
}

process.on('SIGINT', onInterrupt);
process.on('SIGTERM', onInterrupt);

try {
  if (!baseline.eligible) {
    throw new Error(`review baseline rejected: ${baseline.blockers.join('; ')}`);
  }

  const requestedPort = await resolveFreePort();

  server = await createServer({
    configFile: './vite.config.ts',
    server: { host: '127.0.0.1', port: requestedPort, strictPort: false, open: false },
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
  results.environment.chromium = automatedBrowser.version();
  automatedContext = await automatedBrowser.newContext({ viewport: DESKTOP_VIEWPORT });
  const page = await automatedContext.newPage();
  const sink = createDiagnostics(page, 'automated');

  startupHealthy = await runStartupChecks(page, localUrl, sink);

  if (!startupHealthy) {
    await shot(page, 'automated-1280x800.png');
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
    sectionDiagnosticsGate();
  }

  const automatedFailed = results.sections.some((entry) => entry.status === 'FAIL');
  const automatedPassed = startupHealthy && !automatedFailed;

  if (mode === 'interactive' && automatedPassed && !results.interrupted) {
    interactiveBrowser = await chromium.launch({ headless: false });
    interactiveContext = await interactiveBrowser.newContext({ viewport: DESKTOP_VIEWPORT });
    const interactivePage = await interactiveContext.newPage();
    createDiagnostics(interactivePage, 'interactive');

    try {
      const answers = await runInteractiveSignoff(
        interactivePage,
        localUrl,
        abortController.signal
      );
      results.manual = answers;
      await shot(interactivePage, 'manual-final.png');
    } catch (error) {
      if (results.interrupted) {
        results.executionErrors.push(`sign-off interrupted: ${toMessage(error)}`);
      } else {
        results.executionErrors.push(`sign-off failed: ${toMessage(error)}`);
      }
    }
  }
} catch (error) {
  results.executionErrors.push(toMessage(error));
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

  process.off('SIGINT', onInterrupt);
  process.off('SIGTERM', onInterrupt);
}

if (!results.lifecycle.portReleased) {
  results.lifecycle.cleanupErrors.push('review server port still responds after shutdown');
}

const manualSummary = summariseManual(results.manual);
const automatedFailures = results.sections.filter((entry) => entry.status === 'FAIL');
const diagnosticsSection = results.sections.find((entry) => entry.id === 'M');
const axeViolations = results.axe.reduce((total, entry) => total + entry.violations.length, 0);

const status = resolveFinalStatus({
  mode,
  baselineEligible: baseline.eligible,
  startupBlockers: (results.startup.blockers ?? []).length,
  executionErrors: results.executionErrors.length,
  automatedFailures: automatedFailures.filter((entry) => entry.id !== 'M').length,
  axeViolations,
  diagnosticsFailures: diagnosticsSection?.status === 'FAIL' ? 1 : 0,
  cleanupErrors: results.lifecycle.cleanupErrors.length,
  portReleased: results.lifecycle.portReleased,
  manual: manualSummary,
  interrupted: results.interrupted,
});

const exitCode = exitCodeForStatus(status);

results.status = status;
results.exitCode = exitCode;
results.finishedAt = new Date().toISOString();
results.manualSummary =
  manualSummary === null
    ? null
    : { complete: manualSummary.complete, failed: manualSummary.failed };

function renderReport() {
  const lifecycle = results.lifecycle;
  const repository = results.repository;

  const sectionRows = results.sections
    .map((entry) => {
      const notes = [...entry.notes, ...entry.failures].join('; ') || '—';
      return `| ${entry.id}. ${entry.name} | ${entry.status} | results.json | ${notes} |`;
    })
    .join('\n');

  const viewportRows = results.viewports
    .map((entry) => {
      const detail = ['initial', 'invalid', 'success']
        .map((state) => `${state}: ${entry[state].failures.join(', ') || 'clean'}`)
        .join('; ');
      const overflow = [entry.initial, entry.invalid, entry.success].some((s) => s.overflow > 1)
        ? 'yes'
        : 'none';
      const clipping = [entry.initial, entry.invalid, entry.success].some((s) => s.clipped > 0)
        ? 'yes'
        : 'none';
      return `| ${entry.viewport} | ${entry.status} | ${overflow} | ${clipping} | checked | ${detail} |`;
    })
    .join('\n');

  const axeRows = results.axe
    .map((entry) => `- \`${entry.state}\`: ${String(entry.violations.length)} violations`)
    .join('\n');

  const manual = results.manual;
  const manualRow = (label, key) =>
    `| ${label} | ${manual === null ? 'NOT COLLECTED' : (manual[key] ?? 'NOT COLLECTED')} | ${
      manual === null ? 'no sign-off phase in this run' : '—'
    } |`;

  const defects = results.sections
    .filter((entry) => entry.status === 'FAIL')
    .flatMap((entry) => entry.failures.map((failure) => `- **${entry.id}** ${failure}`))
    .join('\n');

  const startupBlockers = results.startup.blockers ?? [];
  const forcedColors = results.sections.find((entry) => entry.id === 'I');

  return `# GoodCall M3 Browser Review

## Status

${status}

## Evidence Eligibility

- evidence class: **${repository.evidenceClass}**
- actual SHA: \`${String(repository.headSha)}\`
- approved SHA: ${repository.approvedSha === null ? `not supplied (\`${REVIEW_SHA_ENV}\` unset)` : `\`${repository.approvedSha}\``}
- exact match: ${repository.exactMatch === null ? 'not applicable' : String(repository.exactMatch)}
- branch: \`${String(repository.branch)}\`
- tracked tree clean: ${String(repository.trackedTreeClean)}
- final-review eligible: **${String(repository.finalReviewEligible)}**
${repository.blockers.length === 0 ? '' : `- baseline blockers: ${repository.blockers.join('; ')}\n`}
## Execution Outcome

- execution errors: ${results.executionErrors.length === 0 ? 'none' : results.executionErrors.join('; ')}
- automated failures: ${String(automatedFailures.length)}
- diagnostics failures: ${diagnosticsSection === undefined ? 'not reached' : diagnosticsSection.status}
- manual status: ${manualSummary === null ? 'not collected' : `complete=${String(manualSummary.complete)}, failed=${String(manualSummary.failed)}`}
- interrupted: ${String(results.interrupted)}
- cleanup failures: ${lifecycle.cleanupErrors.length === 0 ? 'none' : lifecycle.cleanupErrors.join('; ')}
- final status: **${status}**
- exit code: **${String(exitCode)}**

## Baseline

- SHA: \`${String(repository.headSha)}\`
- branch: \`${String(repository.branch)}\`
- tracked tree clean: ${String(repository.trackedTreeClean)}

Prerequisite history, **not** verification of this review result: M3-05B/M3-05C are recorded as closed in the implementation reports, and M3-05D CI passed for its own commit. Those runs verify their own commits only.

## Environment

- OS: ${results.environment.os}
- Node: ${results.environment.node}
- Playwright: ${results.environment.playwright}
- Chromium: ${String(results.environment.chromium)}
- mode: ${results.mode}

## Server Lifecycle

- port: ${String(results.port)}
- server started: ${String(lifecycle.serverStarted)}
- server closed: ${String(lifecycle.serverClosed)}
- port released: ${String(lifecycle.portReleased)}
- cleanup errors: ${lifecycle.cleanupErrors.length === 0 ? 'none' : lifecycle.cleanupErrors.join('; ')}
- user browser touched: no

## Browser Isolation

- automated browser: Playwright Chromium ${String(results.environment.chromium)}, headless, fresh context
- interactive browser: ${interactiveBrowser === null ? 'not launched' : 'Playwright Chromium, headed, fresh context'}
- automated context closed: ${String(lifecycle.automatedContextClosed)}
- interactive context closed: ${String(lifecycle.interactiveContextClosed)}
- existing profile used: no
- existing Chrome/Edge attached: no
- user browser terminated: no

## Runtime Startup

- HTTP: ${String(results.startup.httpStatus)}
- worker: ${String(results.startup.worker?.status)} ${String(results.startup.worker?.contentType)}, ${String(results.startup.worker?.bytes)} bytes
- root children: ${String(results.startup.dom?.rootChildren)}
- main / h1: ${String(results.startup.dom?.mainCount)} / ${String(results.startup.dom?.h1Count)}
- notice visible: ${String(results.startup.dom?.noticeVisible)}
- bootstrap failure visible: ${String(results.startup.dom?.failureVisible)}
- service worker: ${String(results.startup.serviceWorker)}
- blockers: ${startupBlockers.length === 0 ? 'none' : startupBlockers.join('; ')}

## Automated Results

| Section | Status | Evidence | Notes |
| --- | --- | --- | --- |
${sectionRows}

Forced-colors outcome: **${forcedColors === undefined ? 'not reached' : (forcedColors.notes[0] ?? 'not recorded')}**. Real OS forced-colors mode is never claimed by the automated phase.

## Viewport Matrix

Each viewport is measured in three states — initial, invalid and success.

| Viewport | Status | Overflow | Clipping | Overlap | States |
| --- | --- | --- | --- | --- | --- |
${viewportRows}

## Axe Results

${axeRows || '- not run'}

Affected-node evidence — targets, failure summaries and capped HTML excerpts — is stored in \`${RESULTS_PATH}\`.

## Console and Network

- page errors: ${results.diagnostics.pageErrors?.length ? results.diagnostics.pageErrors.join(' | ') : 'none'}
- console errors: ${results.diagnostics.consoleErrors?.length ? results.diagnostics.consoleErrors.join(' | ') : 'none'}
- request failures: ${results.diagnostics.requestFailures?.length ? results.diagnostics.requestFailures.join(' | ') : 'none'}
- responses >= 400: ${results.diagnostics.badResponses?.length ? results.diagnostics.badResponses.join(' | ') : 'none'}
- diagnostics allow-list entries: ${String(EXPECTED_DIAGNOSTICS.length)}

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

## Defects

${defects || 'None recorded.'}

## Screenshots

${results.screenshots.map((path) => `- \`${path}\``).join('\n') || '- none'}

## Final Assessment

${
  status === STATUS.AUTOMATED_PENDING
    ? 'Automated coverage passed. Real browser zoom, real OS forced-colors mode and screen-reader behaviour are not covered and remain owed from the user sign-off phase.'
    : status === STATUS.FULL_PASS
      ? 'Automated coverage and user sign-off both passed.'
      : status === STATUS.PARTIAL
        ? 'The review did not complete. No pass is claimed.'
        : 'The review failed. See defects and execution outcome above.'
}

${repository.finalReviewEligible ? '' : 'This run is **PROVISIONAL**: it is not bound to an approved review SHA and cannot serve as closure evidence.'}

## Remaining Risks

- Viewport width is not browser zoom; the responsive matrix does not prove 200 % or 400 % reflow.
- Forced-colors coverage here is Playwright emulation, not a real OS high-contrast mode.
- Screen-reader announcement behaviour is not automatable and is not claimed.

## Next Step

${
  repository.finalReviewEligible
    ? 'Independent review of these results, then the M3 closure documentation pass.'
    : `Re-run bound to the approved SHA after independent audit:\n\n\`\`\`\n${REVIEW_SHA_ENV}=<approved SHA> npm run review:m3-browser\n\`\`\`\n\nPowerShell:\n\n\`\`\`\n$env:${REVIEW_SHA_ENV}="<approved SHA>"; npm run review:m3-browser\n\`\`\``
}

M3 BROWSER REVIEW — ${status === STATUS.FULL_PASS ? 'PASSED' : status === STATUS.FAILED ? 'FAILED' : status === STATUS.PARTIAL ? 'PARTIAL' : 'AUTOMATED PASS, USER SIGN-OFF PENDING'}
`;
}

writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
writeFileSync(REPORT_PATH, renderReport());

stdout.write(`\n🔍 M3 browser review — ${status} (${results.repository.evidenceClass})\n\n`);

stdout.write(
  `${JSON.stringify(
    {
      mode: results.mode,
      port: results.port,
      evidenceClass: results.repository.evidenceClass,
      headSha: results.repository.headSha,
      branch: results.repository.branch,
      trackedTreeClean: results.repository.trackedTreeClean,
      startup: results.startup.healthy ?? false,
      sections: results.sections.map((entry) => `${entry.id}:${entry.status}`),
      axeViolations,
      executionErrors: results.executionErrors,
      lifecycle: results.lifecycle,
      exitCode,
    },
    null,
    2
  )}\n`
);

stdout.write(`\nReport:  ${REPORT_PATH}\n`);
stdout.write(`Results: ${RESULTS_PATH}\n\n`);

if (exitCode !== 0) {
  const reasons = [
    ...baseline.blockers,
    ...(results.startup.blockers ?? []),
    ...results.executionErrors,
    ...results.sections.flatMap((entry) => entry.failures.map((f) => `${entry.id}: ${f}`)),
    ...results.lifecycle.cleanupErrors,
  ];

  stdout.write(`✗ M3 browser review — ${status}\n\n`);
  for (const reason of reasons) {
    stdout.write(`  - ${reason}\n`);
  }
  stdout.write('\n');
  process.exit(exitCode);
}

stdout.write(`✓ M3 browser review — ${status}\n\n`);
process.exit(exitCode);

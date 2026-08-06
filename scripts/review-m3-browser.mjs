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
const MIN_VISIBLE_AREA_RATIO = 0.9;
const OBSCURATION_SAMPLES = 5;
const MIN_UNOBSCURED_SAMPLES = 4;
const MIN_FALLBACK_REASON_LENGTH = 3;

const OVERLAP_STATUS = {
  MEASURED_PASS: 'MEASURED_PASS',
  MEASURED_FAIL: 'MEASURED_FAIL',
  UNRESOLVED: 'UNRESOLVED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};

const DIAGNOSTIC_KINDS = [
  'pageErrors',
  'consoleErrors',
  'requestFailures',
  'badResponses',
  'failedResources',
];
const DIAGNOSTIC_SCOPES = ['automated', 'touch', 'interactive'];
const CRITICAL_RESOURCE_TYPES = [
  'script',
  'stylesheet',
  'fetch',
  'xhr',
  'document',
  'serviceworker',
];

const EXPECTED_DIAGNOSTICS = [];

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

const OVERLAP_PROBES = {
  initial: [
    { pair: 'H1 vs technical notice', left: 'h1', right: 'notice' },
    { pair: 'Badge vs Status', left: 'badge', right: 'status' },
    { pair: 'Status vs Counter', left: 'status', right: 'counter' },
    { pair: 'counter actions', left: 'incrementButton', right: 'resetCounterButton' },
    { pair: 'name vs notes field group', left: 'nameGroup', right: 'notesGroup' },
    { pair: 'notes vs category field group', left: 'notesGroup', right: 'categoryGroup' },
    { pair: 'form actions', left: 'submitButton', right: 'resetFormButton' },
  ],
  invalid: [
    { pair: 'error summary vs form', left: 'errorSummary', right: 'form' },
    { pair: 'error summary links', left: 'summaryLinkOne', right: 'summaryLinkTwo' },
    { pair: 'name error vs notes field group', left: 'nameError', right: 'notesGroup' },
    { pair: 'category error vs form actions', left: 'categoryError', right: 'submitButton' },
    { pair: 'form actions', left: 'submitButton', right: 'resetFormButton' },
    { pair: 'name label vs name control', left: 'nameLabel', right: 'nameControl' },
    { pair: 'category label vs category control', left: 'categoryLabel', right: 'categoryControl' },
  ],
  success: [
    { pair: 'success status vs form', left: 'successStatus', right: 'form' },
    { pair: 'success status vs form actions', left: 'successStatus', right: 'submitButton' },
    { pair: 'form actions', left: 'submitButton', right: 'resetFormButton' },
  ],
};

const RESET_DEFAULTS = {
  name: '',
  notes: '',
  category: '',
  updates: false,
  delivery: null,
  compact: false,
};

const MANUAL_PROMPTS = [
  { key: '200% zoom', allowed: ['PASS', 'FAIL'] },
  { key: '400% zoom', allowed: ['PASS', 'FAIL'] },
  { key: 'keyboard/focus', allowed: ['PASS', 'FAIL'] },
  { key: 'clipping/overlap', allowed: ['PASS', 'FAIL'] },
  {
    key: 'forced colors',
    allowed: ['PASS', 'FAIL', 'NOT AVAILABLE'],
    fallback: { value: 'NOT AVAILABLE', reasonKey: 'forced colors reason' },
  },
  {
    key: 'screen reader',
    allowed: ['PASS', 'FAIL', 'NOT TESTED'],
    fallback: { value: 'NOT TESTED', reasonKey: 'screen reader reason' },
  },
];

const MANUAL_FALLBACK_REASONS = MANUAL_PROMPTS.filter(
  (prompt) => prompt.fallback !== undefined
).map((prompt) => ({
  key: prompt.key,
  trigger: prompt.fallback.value,
  reasonKey: prompt.fallback.reasonKey,
}));

const SUMMARY_LINK_TARGETS = [
  { index: 0, name: 'Name', selector: NAME_FIELD },
  { index: 1, name: 'Category', selector: CATEGORY_FIELD },
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
11. NOT AVAILABLE and NOT TESTED each require a short, concrete reason.
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
    input.automatedExecutionErrors > 0 ||
    input.cleanupErrors > 0 ||
    !input.portReleased;

  if (hardFailure) {
    return STATUS.FAILED;
  }

  if (input.manual !== null && input.manual.failed) {
    return STATUS.FAILED;
  }

  if (input.mode === 'automated-only') {
    return input.signoffInterrupted ? STATUS.PARTIAL : STATUS.AUTOMATED_PENDING;
  }

  if (
    input.signoffUnavailable > 0 ||
    input.signoffInterrupted ||
    input.signoffIncomplete > 0 ||
    input.manual === null ||
    !input.manual.complete
  ) {
    return STATUS.PARTIAL;
  }

  return STATUS.FULL_PASS;
}

function exitCodeForStatus(status) {
  return EXIT_CODES[status] ?? 1;
}

function resolveSignoffAvailability(input) {
  if (input.mode !== 'interactive') {
    return { available: false, reason: null };
  }

  if (input.stdinTTY !== true || input.stdoutTTY !== true) {
    return {
      available: false,
      reason: `interactive sign-off requires a TTY (stdin ${String(input.stdinTTY)}, stdout ${String(input.stdoutTTY)})`,
    };
  }

  return { available: true, reason: null };
}

function resolveViewportStatus(states) {
  return states.every((state) => state.failures.length === 0) ? 'PASS' : 'FAIL';
}

function responsiveSectionFailures(viewports) {
  return viewports
    .filter((entry) => entry.status === 'FAIL')
    .map((entry) => {
      const detail = entry.states
        .filter((state) => state.failures.length > 0)
        .map((state) => `${state.state}: ${state.failures.join(', ')}`)
        .join('; ');
      return `${entry.viewport} -> ${detail}`;
    });
}

function evaluateBackwardMove(before, after, order) {
  if (after === null) {
    return { moved: false, reason: 'no element focused after Shift+Tab' };
  }

  if (before !== null && after.documentOrder === before.documentOrder) {
    return { moved: false, reason: 'Shift+Tab left focus on the same element' };
  }

  const beforeIndex = order.indexOf(before?.documentOrder ?? -1);
  const afterIndex = order.indexOf(after.documentOrder);

  if (beforeIndex >= 0 && afterIndex >= 0) {
    if (afterIndex === beforeIndex - 1) {
      return { moved: true, reason: 'reached the immediately previous tab stop' };
    }
    if (afterIndex < beforeIndex) {
      return { moved: true, reason: 'reached an earlier tab stop' };
    }
    return { moved: false, reason: 'Shift+Tab did not move backwards in the recorded tab order' };
  }

  if (before !== null && after.documentOrder < before.documentOrder) {
    return { moved: true, reason: 'reached an earlier element in document order' };
  }

  return { moved: false, reason: 'backward movement could not be confirmed' };
}

function evaluateFocusVisibility(evidence) {
  const failures = [];

  if (evidence.visibleAreaRatio < MIN_VISIBLE_AREA_RATIO) {
    failures.push(
      `only ${(evidence.visibleAreaRatio * 100).toFixed(1)}% of the focus target is inside the viewport`
    );
  }

  if (evidence.unobscuredSampleCount < MIN_UNOBSCURED_SAMPLES) {
    failures.push(
      `only ${String(evidence.unobscuredSampleCount)} of ${String(evidence.sampleCount)} sample points resolve to the focus target`
    );
  }

  return failures;
}

function validateAllowList(entries) {
  const problems = [];

  entries.forEach((entry, index) => {
    const label = `allow-list[${String(index)}]`;

    if (typeof entry.pattern !== 'string' && !(entry.pattern instanceof RegExp)) {
      problems.push(`${label}: pattern must be a string or RegExp`);
    }
    if (typeof entry.reason !== 'string' || entry.reason.trim() === '') {
      problems.push(`${label}: reason must be a non-empty string`);
    }
    if (!Array.isArray(entry.scopes) || entry.scopes.length === 0) {
      problems.push(`${label}: scopes must be a non-empty array`);
    } else if (entry.scopes.some((scope) => !DIAGNOSTIC_SCOPES.includes(scope))) {
      problems.push(`${label}: scopes contains an unknown scope`);
    }
    if (!Array.isArray(entry.kinds) || entry.kinds.length === 0) {
      problems.push(`${label}: kinds must be a non-empty array`);
    } else if (entry.kinds.some((kind) => !DIAGNOSTIC_KINDS.includes(kind))) {
      problems.push(`${label}: kinds contains an unknown kind`);
    }
  });

  return problems;
}

function isSuppressed(entries, kind, scope, text) {
  return entries.some((entry) => {
    if (!Array.isArray(entry.scopes) || !entry.scopes.includes(scope)) {
      return false;
    }
    if (!Array.isArray(entry.kinds) || !entry.kinds.includes(kind)) {
      return false;
    }
    return entry.pattern instanceof RegExp
      ? entry.pattern.test(text)
      : String(text).includes(entry.pattern);
  });
}

function aggregateDiagnostics(sinks, entries) {
  const aggregate = {
    scopes: sinks.map((sink) => sink.scope),
    pageErrors: [],
    consoleErrors: [],
    requestFailures: [],
    badResponses: [],
    failedResources: [],
  };

  for (const sink of sinks) {
    for (const kind of DIAGNOSTIC_KINDS) {
      for (const entry of sink[kind]) {
        const text = typeof entry === 'string' ? entry : JSON.stringify(entry);
        if (isSuppressed(entries, kind, sink.scope, text)) {
          continue;
        }
        aggregate[kind].push(
          typeof entry === 'string' ? `[${sink.scope}] ${entry}` : { scope: sink.scope, ...entry }
        );
      }
    }
  }

  return aggregate;
}

function evaluateDiagnostics(aggregate) {
  const failures = [];

  if (aggregate.pageErrors.length > 0) {
    failures.push(`page errors: ${aggregate.pageErrors.join(' | ')}`);
  }
  if (aggregate.consoleErrors.length > 0) {
    failures.push(`console errors: ${aggregate.consoleErrors.join(' | ')}`);
  }
  if (aggregate.requestFailures.length > 0) {
    failures.push(`request failures: ${aggregate.requestFailures.join(' | ')}`);
  }
  if (aggregate.badResponses.length > 0) {
    failures.push(`unexpected HTTP >= 400: ${aggregate.badResponses.join(' | ')}`);
  }

  const criticalFailures = aggregate.failedResources.filter((entry) =>
    CRITICAL_RESOURCE_TYPES.includes(entry.type)
  );

  if (criticalFailures.length > 0) {
    failures.push(`failed critical resources: ${JSON.stringify(criticalFailures.slice(0, 5))}`);
  }

  return { failures, aggregate };
}

function createManualAnswerRecord() {
  return {};
}

function isValidFallbackReason(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();

  if (trimmed.length < MIN_FALLBACK_REASON_LENGTH) {
    return false;
  }

  return trimmed.replace(/[\p{P}\p{S}\s]/gu, '').length > 0;
}

function summariseManual(answers) {
  if (answers === null || answers === undefined) {
    return null;
  }

  const answeredCount = MANUAL_PROMPTS.filter(
    (prompt) => typeof answers[prompt.key] === 'string'
  ).length;
  const answersComplete = answeredCount === MANUAL_PROMPTS.length;
  const failed = MANUAL_PROMPTS.some((prompt) => answers[prompt.key] === 'FAIL');

  const requiredReasons = MANUAL_FALLBACK_REASONS.filter(
    (entry) => answers[entry.key] === entry.trigger
  );
  const missingReasons = requiredReasons
    .filter((entry) => !isValidFallbackReason(answers[entry.reasonKey]))
    .map((entry) => entry.reasonKey);
  const fallbackReasonsComplete = missingReasons.length === 0;

  return {
    complete: answersComplete && fallbackReasonsComplete,
    answersComplete,
    failed,
    answeredCount,
    promptCount: MANUAL_PROMPTS.length,
    fallbackReasonsComplete,
    missingReasons,
    answers,
  };
}

function evaluateSummaryLinkEvidence(record) {
  const failures = [];
  const label = `summary link ${String(record.index + 1)}`;

  if (record.visible !== true) {
    failures.push(`${label} is not visible`);
  }

  const box = record.boundingBox;

  if (box === null || box === undefined) {
    failures.push(`${label} has no bounding box`);
  } else if (box.width <= 0 || box.height <= 0) {
    failures.push(`${label} has a zero-area box ${String(box.width)}x${String(box.height)}`);
  }

  if (record.visibleAreaRatio < MIN_VISIBLE_AREA_RATIO) {
    failures.push(
      `${label}: only ${(record.visibleAreaRatio * 100).toFixed(1)}% of the link is inside the viewport`
    );
  }

  if (record.unobscuredSampleCount < MIN_UNOBSCURED_SAMPLES) {
    failures.push(
      `${label}: only ${String(record.unobscuredSampleCount)} of ${String(record.sampleCount)} sample points resolve to the link`
    );
  }

  if (record.activationFocusedLink === false) {
    failures.push(`${label} could not take keyboard focus`);
  }

  if (record.activationPassed !== true) {
    failures.push(`${label} did not move focus to ${String(record.activationTarget)}`);
  }

  return failures;
}

function classifyOverlapFinding(finding, viewport, state, tolerance) {
  const identity = {
    viewport,
    state,
    pairName: finding.pairName,
    leftIdentifier: finding.leftIdentifier,
    rightIdentifier: finding.rightIdentifier,
  };

  if (finding.unresolved === true) {
    if (finding.required === false) {
      return {
        ...identity,
        status: OVERLAP_STATUS.NOT_APPLICABLE,
        reason: finding.reason,
        required: false,
        failed: false,
      };
    }

    return {
      ...identity,
      status: OVERLAP_STATUS.UNRESOLVED,
      reason: finding.reason,
      required: true,
      failed: true,
    };
  }

  const failed = finding.overlapX > tolerance && finding.overlapY > tolerance;

  return {
    ...identity,
    status: failed ? OVERLAP_STATUS.MEASURED_FAIL : OVERLAP_STATUS.MEASURED_PASS,
    leftRect: finding.leftRect,
    rightRect: finding.rightRect,
    overlapX: finding.overlapX,
    overlapY: finding.overlapY,
    tolerance,
    required: finding.required !== false,
    failed,
  };
}

function summariseOverlap(records) {
  const count = (status) => records.filter((entry) => entry.status === status).length;

  const measuredPass = count(OVERLAP_STATUS.MEASURED_PASS);
  const measuredFail = count(OVERLAP_STATUS.MEASURED_FAIL);
  const unresolved = count(OVERLAP_STATUS.UNRESOLVED);
  const notApplicable = count(OVERLAP_STATUS.NOT_APPLICABLE);
  const measured = measuredPass + measuredFail;
  const declared = records.length;
  const allRequiredMeasured = unresolved === 0 && measured + notApplicable === declared;

  return {
    declared,
    measured,
    measuredPass,
    measuredFail,
    unresolved,
    notApplicable,
    allRequiredMeasured,
    clean: measuredFail === 0 && allRequiredMeasured,
  };
}

function overlapGeometryFailures(records) {
  const failures = [];
  const measuredFailures = records.filter((entry) => entry.status === OVERLAP_STATUS.MEASURED_FAIL);
  const unresolvedRequired = records.filter((entry) => entry.status === OVERLAP_STATUS.UNRESOLVED);

  if (measuredFailures.length > 0) {
    failures.push(
      `${String(measuredFailures.length)} overlapping regions (${measuredFailures.map((entry) => entry.pairName).join(', ')})`
    );
  }

  if (unresolvedRequired.length > 0) {
    failures.push(
      `${String(unresolvedRequired.length)} unresolved required overlap probes (${unresolvedRequired
        .map((entry) => `${entry.pairName}: ${String(entry.reason)}`)
        .join('; ')})`
    );
  }

  return failures;
}

async function createSignoffEnvironment(steps) {
  const owned = { browser: null, context: null, page: null };

  try {
    owned.browser = await steps.launchBrowser();
    owned.context = await steps.createContext(owned.browser);
    owned.page = await steps.createPage(owned.context);
    await steps.attachDiagnostics(owned.page);
    await steps.preparePage(owned.page);

    return { ...owned, available: true, reason: null };
  } catch (error) {
    return {
      ...owned,
      available: false,
      reason: `sign-off environment unavailable: ${toMessage(error)}`,
    };
  }
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

function readPlaywrightVersion() {
  try {
    const manifest = JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8'));
    return typeof manifest.version === 'string' ? manifest.version : 'unknown';
  } catch {
    return 'unknown';
  }
}

async function runSelfTest() {
  const base = {
    mode: 'automated-only',
    baselineEligible: true,
    startupBlockers: 0,
    automatedExecutionErrors: 0,
    automatedFailures: 0,
    axeViolations: 0,
    diagnosticsFailures: 0,
    cleanupErrors: 0,
    portReleased: true,
    manual: null,
    signoffUnavailable: 0,
    signoffInterrupted: false,
    signoffIncomplete: 0,
  };

  const interactive = { ...base, mode: 'interactive' };

  const completeAnswers = {
    '200% zoom': 'PASS',
    '400% zoom': 'PASS',
    'keyboard/focus': 'PASS',
    'clipping/overlap': 'PASS',
    'forced colors': 'NOT AVAILABLE',
    'screen reader': 'NOT TESTED',
    'forced colors reason': 'no OS high-contrast mode on this machine',
    'screen reader reason': 'no screen reader installed on this machine',
    notes: '',
  };

  const passAnswers = {
    '200% zoom': 'PASS',
    '400% zoom': 'PASS',
    'keyboard/focus': 'PASS',
    'clipping/overlap': 'PASS',
    'forced colors': 'PASS',
    'screen reader': 'PASS',
    notes: '',
  };

  const missingForcedColorsReason = { ...completeAnswers };
  delete missingForcedColorsReason['forced colors reason'];

  const missingScreenReaderReason = { ...completeAnswers };
  delete missingScreenReaderReason['screen reader reason'];

  const completeManual = summariseManual(completeAnswers);

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

  const failures = [];
  let scenarioCount = 0;

  const record = (ok, line) => {
    scenarioCount += 1;
    stdout.write(`  ${ok ? '✓' : '✗'} ${line}\n`);
    if (!ok) {
      failures.push(line);
    }
  };

  const statusCases = [
    { name: 'automated-only pass', input: base, expected: STATUS.AUTOMATED_PENDING },
    { name: 'automated defect', input: { ...base, automatedFailures: 2 }, expected: STATUS.FAILED },
    {
      name: 'automated execution failure',
      input: { ...base, automatedExecutionErrors: 1 },
      expected: STATUS.FAILED,
    },
    {
      name: 'interactive diagnostics defect',
      input: { ...interactive, diagnosticsFailures: 1, manual: completeManual },
      expected: STATUS.FAILED,
    },
    {
      name: 'manual FAIL',
      input: { ...interactive, manual: failedManual },
      expected: STATUS.FAILED,
    },
    {
      name: 'headed browser unavailable',
      input: { ...interactive, signoffUnavailable: 1 },
      expected: STATUS.PARTIAL,
    },
    {
      name: 'stdin EOF',
      input: { ...interactive, signoffIncomplete: 1 },
      expected: STATUS.PARTIAL,
    },
    {
      name: 'SIGINT during sign-off',
      input: { ...interactive, signoffInterrupted: true },
      expected: STATUS.PARTIAL,
    },
    {
      name: 'incomplete manual answers',
      input: { ...interactive, manual: partialManual },
      expected: STATUS.PARTIAL,
    },
    { name: 'cleanup failure', input: { ...base, cleanupErrors: 1 }, expected: STATUS.FAILED },
    { name: 'port unreleased', input: { ...base, portReleased: false }, expected: STATUS.FAILED },
    {
      name: 'complete interactive pass',
      input: { ...interactive, manual: completeManual },
      expected: STATUS.FULL_PASS,
    },
  ];

  for (const testCase of statusCases) {
    const status = resolveFinalStatus(testCase.input);
    const exit = exitCodeForStatus(status);
    const expectedExit =
      testCase.expected === STATUS.FAILED || testCase.expected === STATUS.PARTIAL ? 1 : 0;
    record(
      status === testCase.expected && exit === expectedExit,
      `${testCase.name} -> ${status} / exit ${String(exit)}`
    );
  }

  const baselineCases = [
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

  for (const testCase of baselineCases) {
    const okEligible = testCase.result.eligible === testCase.expectEligible;
    const okClass =
      testCase.expectClass === undefined || testCase.result.evidenceClass === testCase.expectClass;
    record(
      okEligible && okClass,
      `${testCase.name} -> eligible ${String(testCase.result.eligible)}, ${testCase.result.evidenceClass}`
    );
  }

  const nonTty = resolveSignoffAvailability({
    mode: 'interactive',
    stdinTTY: false,
    stdoutTTY: true,
  });
  record(
    !nonTty.available && nonTty.reason !== null,
    `non-TTY interactive mode blocks sign-off before browser launch -> ${String(nonTty.reason)}`
  );
  record(
    resolveSignoffAvailability({ mode: 'interactive', stdinTTY: true, stdoutTTY: true }).available,
    'TTY interactive mode allows sign-off'
  );

  const nonTtyStatus = resolveFinalStatus({ ...interactive, signoffUnavailable: 1 });
  record(
    nonTtyStatus === STATUS.PARTIAL && exitCodeForStatus(nonTtyStatus) === 1,
    `non-TTY interactive run resolves to ${nonTtyStatus} / exit 1`
  );

  const failingViewport = {
    viewport: '320x568',
    states: [
      { state: 'initial', failures: [] },
      { state: 'invalid', failures: ['error summary not visible'] },
      { state: 'success', failures: [] },
    ],
  };
  failingViewport.status = resolveViewportStatus(failingViewport.states);

  const passingViewport = {
    viewport: '1280x800',
    states: [
      { state: 'initial', failures: [] },
      { state: 'invalid', failures: [] },
      { state: 'success', failures: [] },
    ],
  };
  passingViewport.status = resolveViewportStatus(passingViewport.states);

  record(failingViewport.status === 'FAIL', 'viewport state failure forces viewport FAIL');
  record(passingViewport.status === 'PASS', 'clean viewport states resolve to PASS');
  record(
    responsiveSectionFailures([passingViewport, failingViewport]).length === 1,
    'responsive section fails when any viewport fails'
  );

  const order = [10, 20, 30];
  record(
    !evaluateBackwardMove({ documentOrder: 20 }, { documentOrder: 20 }, order).moved,
    'Shift+Tab landing on the same element fails'
  );
  record(
    evaluateBackwardMove({ documentOrder: 20 }, { documentOrder: 10 }, order).moved,
    'Shift+Tab reaching the previous stop passes'
  );
  record(
    !evaluateBackwardMove({ documentOrder: 20 }, { documentOrder: 30 }, order).moved,
    'Shift+Tab moving forwards fails'
  );

  record(
    evaluateFocusVisibility({ visibleAreaRatio: 0.5, unobscuredSampleCount: 5, sampleCount: 5 })
      .length === 1,
    'low visible-area ratio fails'
  );
  record(
    evaluateFocusVisibility({ visibleAreaRatio: 1, unobscuredSampleCount: 2, sampleCount: 5 })
      .length === 1,
    'insufficient unobscured samples fails'
  );
  record(
    evaluateFocusVisibility({ visibleAreaRatio: 1, unobscuredSampleCount: 5, sampleCount: 5 })
      .length === 0,
    'fully visible unobscured target passes'
  );

  const scopedEntry = [
    { pattern: 'noise', reason: 'documented', scopes: ['touch'], kinds: ['consoleErrors'] },
  ];

  record(
    !isSuppressed(scopedEntry, 'consoleErrors', 'automated', 'noise here'),
    'allow-list with wrong scope does not suppress'
  );
  record(
    !isSuppressed(scopedEntry, 'badResponses', 'touch', 'noise here'),
    'allow-list with wrong kind does not suppress'
  );
  record(
    isSuppressed(scopedEntry, 'consoleErrors', 'touch', 'noise here'),
    'allow-list matching kind, scope and pattern suppresses'
  );
  record(
    validateAllowList([{ pattern: 'x' }]).length >= 3,
    'malformed allow-list entry is rejected by validation'
  );
  record(validateAllowList(scopedEntry).length === 0, 'well-formed allow-list entry validates');
  record(validateAllowList(EXPECTED_DIAGNOSTICS).length === 0, 'shipped allow-list validates');

  const interactiveAggregate = aggregateDiagnostics(
    [
      {
        scope: 'interactive',
        pageErrors: ['boom'],
        consoleErrors: [],
        requestFailures: [],
        badResponses: [],
        failedResources: [],
      },
    ],
    EXPECTED_DIAGNOSTICS
  );
  record(
    evaluateDiagnostics(interactiveAggregate).failures.length === 1,
    'interactive diagnostics reach the final evaluation'
  );

  const signoffEnvironmentCases = [
    { name: 'headed browser launch unavailable', failAt: 'launchBrowser' },
    { name: 'interactive context unavailable', failAt: 'createContext' },
    { name: 'interactive page unavailable', failAt: 'createPage' },
    { name: 'interactive diagnostics initialization unavailable', failAt: 'attachDiagnostics' },
    { name: 'initial sign-off page preparation unavailable', failAt: 'preparePage' },
  ];

  for (const testCase of signoffEnvironmentCases) {
    const stub = (name, value) => () => {
      if (testCase.failAt === name) {
        throw new Error(`${name} unavailable`);
      }
      return value;
    };

    const environment = await createSignoffEnvironment({
      launchBrowser: stub('launchBrowser', { id: 'browser' }),
      createContext: stub('createContext', { id: 'context' }),
      createPage: stub('createPage', { id: 'page' }),
      attachDiagnostics: stub('attachDiagnostics', { id: 'sink' }),
      preparePage: stub('preparePage', undefined),
    });

    const outcome = {
      ...interactive,
      signoffUnavailable: environment.available ? 0 : 1,
      automatedExecutionErrors: 0,
    };
    const environmentStatus = resolveFinalStatus(outcome);

    record(
      !environment.available &&
        environmentStatus === STATUS.PARTIAL &&
        exitCodeForStatus(environmentStatus) === 1 &&
        outcome.automatedExecutionErrors === 0,
      `${testCase.name} -> PARTIAL / exit 1, no automated execution error`
    );
  }

  const readyEnvironment = await createSignoffEnvironment({
    launchBrowser: () => ({ id: 'browser' }),
    createContext: () => ({ id: 'context' }),
    createPage: () => ({ id: 'page' }),
    attachDiagnostics: () => ({ id: 'sink' }),
    preparePage: () => undefined,
  });
  record(
    readyEnvironment.available &&
      readyEnvironment.page !== null &&
      readyEnvironment.reason === null,
    'complete sign-off environment resolves as available'
  );

  const partialEnvironment = await createSignoffEnvironment({
    launchBrowser: () => ({ id: 'browser' }),
    createContext: () => {
      throw new Error('context unavailable');
    },
    createPage: () => ({ id: 'page' }),
    attachDiagnostics: () => ({ id: 'sink' }),
    preparePage: () => undefined,
  });
  record(
    partialEnvironment.browser !== null && partialEnvironment.context === null,
    'sign-off environment failure preserves owned references for cleanup'
  );

  const interruptedFail = createManualAnswerRecord();
  interruptedFail['200% zoom'] = 'PASS';
  interruptedFail['400% zoom'] = 'FAIL';

  const interruptedPass = createManualAnswerRecord();
  interruptedPass['200% zoom'] = 'PASS';
  interruptedPass['400% zoom'] = 'PASS';

  const interruptionCases = [
    {
      name: 'manual FAIL then SIGINT',
      answers: interruptedFail,
      outcome: { signoffInterrupted: true },
      expected: STATUS.FAILED,
    },
    {
      name: 'manual FAIL then EOF',
      answers: interruptedFail,
      outcome: { signoffIncomplete: 1 },
      expected: STATUS.FAILED,
    },
    {
      name: 'manual FAIL then late sign-off unavailability',
      answers: interruptedFail,
      outcome: { signoffUnavailable: 1 },
      expected: STATUS.FAILED,
    },
    {
      name: 'partial PASS then SIGINT',
      answers: interruptedPass,
      outcome: { signoffInterrupted: true },
      expected: STATUS.PARTIAL,
    },
    {
      name: 'partial PASS then EOF',
      answers: interruptedPass,
      outcome: { signoffIncomplete: 1 },
      expected: STATUS.PARTIAL,
    },
  ];

  for (const testCase of interruptionCases) {
    const interruptedStatus = resolveFinalStatus({
      ...interactive,
      ...testCase.outcome,
      manual: summariseManual(testCase.answers),
    });
    record(
      interruptedStatus === testCase.expected && exitCodeForStatus(interruptedStatus) === 1,
      `${testCase.name} -> ${interruptedStatus} / exit 1`
    );
  }

  record(
    interruptedFail['200% zoom'] === 'PASS' &&
      summariseManual(interruptedFail).answeredCount === 2 &&
      summariseManual(interruptedFail).failed,
    'incremental answer record retains prior answers through interruption'
  );
  record(
    summariseManual(interruptedPass).answeredCount === 2 &&
      !summariseManual(interruptedPass).answersComplete &&
      !summariseManual(interruptedPass).failed,
    'manual summary operates on a partial answer record'
  );

  record(
    !summariseManual(missingForcedColorsReason).complete &&
      !summariseManual(missingForcedColorsReason).fallbackReasonsComplete &&
      resolveFinalStatus({
        ...interactive,
        manual: summariseManual(missingForcedColorsReason),
      }) === STATUS.PARTIAL,
    'NOT AVAILABLE without a forced-colors reason -> incomplete / PARTIAL'
  );
  record(
    !summariseManual(missingScreenReaderReason).complete &&
      resolveFinalStatus({
        ...interactive,
        manual: summariseManual(missingScreenReaderReason),
      }) === STATUS.PARTIAL,
    'NOT TESTED without a screen-reader reason -> incomplete / PARTIAL'
  );
  record(
    summariseManual(completeAnswers).complete &&
      summariseManual(completeAnswers).fallbackReasonsComplete,
    'both fallbacks with valid reasons -> manual record complete'
  );
  record(
    summariseManual(passAnswers).complete &&
      summariseManual(passAnswers).fallbackReasonsComplete &&
      summariseManual(passAnswers).missingReasons.length === 0,
    'PASS manual results require no fallback reason'
  );
  record(
    !isValidFallbackReason('') &&
      !isValidFallbackReason('  ') &&
      !isValidFallbackReason('...') &&
      !isValidFallbackReason('x') &&
      isValidFallbackReason('no OS high-contrast mode'),
    'fallback reason validation rejects blank and punctuation-only text'
  );

  const persistedFallback = createManualAnswerRecord();
  persistedFallback['forced colors'] = 'NOT AVAILABLE';
  persistedFallback['forced colors reason'] = 'no OS high-contrast mode on this machine';
  record(
    summariseManual(persistedFallback).answeredCount === 1 &&
      summariseManual(persistedFallback).fallbackReasonsComplete,
    'fallback reason persists with its answer before the next prompt'
  );

  const usableLink = (index) => ({
    index,
    name: index === 0 ? 'Name' : 'Category',
    visible: true,
    boundingBox: { top: 12, left: 16, width: 184, height: 22 },
    visibleAreaRatio: 1,
    unobscuredSampleCount: 5,
    sampleCount: 5,
    activationTarget: index === 0 ? NAME_FIELD : CATEGORY_FIELD,
    activationMethod: 'keyboard Enter',
    activationFocusedLink: true,
    activationPassed: true,
  });

  record(
    evaluateSummaryLinkEvidence(usableLink(0)).length === 0 &&
      evaluateSummaryLinkEvidence(usableLink(1)).length === 0,
    'both responsive summary links usable -> no link failure'
  );
  record(
    evaluateSummaryLinkEvidence({ ...usableLink(0), visible: false }).length === 1,
    'hidden responsive summary link fails its viewport'
  );
  record(
    evaluateSummaryLinkEvidence({ ...usableLink(1), unobscuredSampleCount: 1 }).length === 1,
    'obscured responsive summary link fails its viewport'
  );
  record(
    evaluateSummaryLinkEvidence({ ...usableLink(0), visibleAreaRatio: 0.4 }).length === 1,
    'partially clipped responsive summary link fails its viewport'
  );
  record(
    evaluateSummaryLinkEvidence({ ...usableLink(1), activationPassed: false }).length === 1,
    'responsive summary link activation failure fails its viewport'
  );
  record(
    evaluateSummaryLinkEvidence({ ...usableLink(0), boundingBox: null }).length === 1,
    'responsive summary link without a bounding box fails its viewport'
  );

  const linkFailingViewport = {
    viewport: '320x568',
    states: [
      { state: 'initial', failures: [] },
      {
        state: 'invalid',
        failures: evaluateSummaryLinkEvidence({ ...usableLink(1), activationPassed: false }),
      },
      { state: 'success', failures: [] },
    ],
  };
  linkFailingViewport.status = resolveViewportStatus(linkFailingViewport.states);
  record(
    linkFailingViewport.status === 'FAIL',
    'viewport cannot pass while a summary link is unusable'
  );

  const measuredProbe = (overlapX, overlapY) => ({
    pairName: 'form actions',
    leftIdentifier: 'button:Validate demonstration',
    rightIdentifier: 'button:Reset demonstration',
    required: true,
    unresolved: false,
    leftRect: { top: 0, left: 0, width: 100, height: 40 },
    rightRect: { top: 0, left: 110, width: 100, height: 40 },
    overlapX,
    overlapY,
  });

  const measuredPass = classifyOverlapFinding(
    measuredProbe(-10, 40),
    '320x568',
    'invalid',
    OVERLAP_TOLERANCE_PX
  );
  const measuredFail = classifyOverlapFinding(
    measuredProbe(30, 20),
    '320x568',
    'invalid',
    OVERLAP_TOLERANCE_PX
  );
  const unresolvedRequired = classifyOverlapFinding(
    {
      pairName: 'error summary links',
      leftIdentifier: 'summaryLinkOne',
      rightIdentifier: 'summaryLinkTwo',
      required: true,
      unresolved: true,
      reason: 'right target "summaryLinkTwo" did not resolve',
    },
    '320x568',
    'invalid',
    OVERLAP_TOLERANCE_PX
  );
  const unresolvedOptional = classifyOverlapFinding(
    {
      pairName: 'optional probe',
      leftIdentifier: 'left',
      rightIdentifier: 'right',
      required: false,
      unresolved: true,
      reason: 'left target "left" did not resolve',
    },
    '320x568',
    'invalid',
    OVERLAP_TOLERANCE_PX
  );

  record(
    measuredPass.status === OVERLAP_STATUS.MEASURED_PASS &&
      !measuredPass.failed &&
      measuredPass.leftRect !== undefined &&
      measuredPass.rightRect !== undefined &&
      measuredPass.tolerance === OVERLAP_TOLERANCE_PX,
    'measured clear probe -> MEASURED_PASS with rectangles and overlap values'
  );
  record(
    measuredFail.status === OVERLAP_STATUS.MEASURED_FAIL && measuredFail.failed,
    'measured intersecting probe -> MEASURED_FAIL'
  );
  record(
    unresolvedRequired.status === OVERLAP_STATUS.UNRESOLVED &&
      unresolvedRequired.failed &&
      unresolvedRequired.required &&
      typeof unresolvedRequired.reason === 'string',
    'unresolved required probe -> UNRESOLVED with a stored reason and failed: true'
  );
  record(
    unresolvedOptional.status === OVERLAP_STATUS.NOT_APPLICABLE &&
      !unresolvedOptional.failed &&
      unresolvedOptional.required === false &&
      typeof unresolvedOptional.reason === 'string',
    'unresolved optional probe -> NOT_APPLICABLE'
  );
  record(
    overlapGeometryFailures([unresolvedRequired]).length === 1,
    'unresolved required probe appends a state-local failure'
  );
  record(
    overlapGeometryFailures([unresolvedOptional]).length === 0,
    'unresolved optional probe appends no state-local failure'
  );
  record(
    overlapGeometryFailures([measuredFail]).length === 1,
    'measured intersection appends a state-local failure'
  );

  const cleanOverlap = summariseOverlap([measuredPass, measuredPass]);
  record(
    cleanOverlap.clean &&
      cleanOverlap.allRequiredMeasured &&
      cleanOverlap.measuredPass === 2 &&
      cleanOverlap.declared === 2,
    'fully measured probe set may claim clean overlap coverage'
  );
  record(
    !summariseOverlap([measuredPass, unresolvedRequired]).clean &&
      summariseOverlap([measuredPass, unresolvedRequired]).unresolved === 1 &&
      !summariseOverlap([measuredPass, unresolvedRequired]).allRequiredMeasured,
    'unresolved required probe prevents a clean-overlap claim'
  );
  record(
    !summariseOverlap([measuredFail]).clean && summariseOverlap([measuredFail]).measuredFail === 1,
    'measured intersection prevents a clean-overlap claim'
  );
  record(
    summariseOverlap([measuredPass, unresolvedOptional]).clean &&
      summariseOverlap([measuredPass, unresolvedOptional]).notApplicable === 1,
    'optional NOT_APPLICABLE probe does not block a clean-overlap claim'
  );

  stdout.write(
    `\n${String(scenarioCount)} scenarios: ${String(scenarioCount - failures.length)} passed, ${String(failures.length)} failed\n`
  );

  return failures;
}

const mode = process.argv.includes('--automated-only') ? 'automated-only' : 'interactive';
const selfTest = process.argv.includes('--self-test');

if (selfTest) {
  stdout.write('\n🔍 M3 browser review — self-test (no server, no browser)\n\n');
  const selfTestFailures = await runSelfTest();
  if (selfTestFailures.length > 0) {
    stdout.write('\n✗ self-test failed\n');
    for (const failure of selfTestFailures) {
      stdout.write(`  - ${failure}\n`);
    }
    process.exit(1);
  }
  stdout.write('\n✓ self-test passed\n\n');
  process.exit(0);
}

const allowListProblems = validateAllowList(EXPECTED_DIAGNOSTICS);

if (allowListProblems.length > 0) {
  stdout.write('\n✗ diagnostics allow-list is malformed:\n');
  for (const problem of allowListProblems) {
    stdout.write(`  - ${problem}\n`);
  }
  process.exit(1);
}

const approvedSha = process.env[REVIEW_SHA_ENV] ?? null;
const repo = collectRepositoryEvidence();
const baseline = evaluateReviewBaseline({ mode, approvedSha, repo });
const ttyEvidence = { stdin: stdin.isTTY === true, stdout: stdout.isTTY === true };
const signoffAvailability = resolveSignoffAvailability({
  mode,
  stdinTTY: ttyEvidence.stdin,
  stdoutTTY: ttyEvidence.stdout,
});

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
  tty: {
    stdin: ttyEvidence.stdin,
    stdout: ttyEvidence.stdout,
    interactiveSignoffAvailable: signoffAvailability.available,
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
  focus: { forwardOrder: [], backward: null, targets: [] },
  axe: [],
  diagnostics: {
    automatedSnapshot: null,
    finalSnapshot: null,
    interactiveIncluded: false,
    allowListEntries: EXPECTED_DIAGNOSTICS.length,
  },
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
  outcome: {
    automatedExecutionErrors: [],
    signoffUnavailable: [],
    signoffInterrupted: false,
    signoffIncomplete: [],
    signoffCollectionStarted: false,
  },
  manual: null,
  screenshots: [],
};

function openSection(id, name) {
  const existing = results.sections.find((entry) => entry.id === id);
  const record = existing ?? { id, name, status: 'PASS', failures: [], notes: [] };

  if (existing === undefined) {
    results.sections.push(record);
  } else {
    record.status = 'PASS';
    record.failures = [];
    record.notes = [];
  }

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
    sink.requestFailures.push(
      `${request.resourceType()} ${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`
    );
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

function recordDiagnosticsSection(evaluation, includesInteractive) {
  const s = openSection('M', 'Runtime diagnostics gate');

  for (const failure of evaluation.failures) {
    s.check(false, failure);
  }

  s.note(`scopes: ${evaluation.aggregate.scopes.join(', ')}`);
  s.note(`interactive diagnostics included: ${String(includesInteractive)}`);

  results.diagnostics.finalSnapshot = evaluation.aggregate;
  results.diagnostics.interactiveIncluded = includesInteractive;

  return evaluation.failures.length === 0;
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

async function semanticOverlap(page, probes, tolerance, viewportLabel, state) {
  const declarations = probes.map((probe) => ({ ...probe, required: probe.required !== false }));

  const findings = await page.evaluate(
    ([definitions]) => {
      const describedError = (controlId) => {
        const control = document.getElementById(controlId);
        const tokens = (control?.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
        const last = tokens[tokens.length - 1];
        return last === undefined ? null : document.getElementById(last);
      };

      const byExactText = (selector, text) =>
        Array.from(document.querySelectorAll(selector)).find(
          (el) => (el.textContent ?? '').trim() === text
        ) ?? null;

      const summaryLinks = () =>
        Array.from(document.querySelectorAll('main#main-content section[tabindex="-1"] a'));

      const resolvers = {
        h1: () => document.querySelector('main#main-content h1'),
        notice: () =>
          Array.from(document.querySelectorAll('main#main-content p')).find((el) =>
            (el.textContent ?? '').includes('Technical Shared UI verification surface')
          ) ?? null,
        badge: () => byExactText('main#main-content span', 'Technical'),
        status: () => byExactText('main#main-content span', 'Verification surface'),
        counter: () => document.querySelector('[data-testid="demo-counter"]'),
        incrementButton: () =>
          byExactText('main#main-content button', 'Increment demonstration counter'),
        resetCounterButton: () =>
          document.querySelector('button[aria-label="Reset demonstration counter"]'),
        submitButton: () => byExactText('main#main-content button', 'Validate demonstration form'),
        resetFormButton: () => byExactText('main#main-content button', 'Reset demonstration form'),
        form: () => document.querySelector('main#main-content form'),
        errorSummary: () => document.querySelector('main#main-content section[tabindex="-1"]'),
        summaryLinkOne: () => summaryLinks()[0] ?? null,
        summaryLinkTwo: () => summaryLinks()[1] ?? null,
        successStatus: () => document.querySelector('main#main-content [role="status"]'),
        nameControl: () => document.getElementById('m3-demo-name'),
        notesControl: () => document.getElementById('m3-demo-notes'),
        categoryControl: () => document.getElementById('m3-demo-category'),
        nameGroup: () => document.getElementById('m3-demo-name')?.closest('div') ?? null,
        notesGroup: () => document.getElementById('m3-demo-notes')?.closest('div') ?? null,
        categoryGroup: () => document.getElementById('m3-demo-category')?.closest('div') ?? null,
        nameLabel: () => document.querySelector('label[for="m3-demo-name"]'),
        categoryLabel: () => document.querySelector('label[for="m3-demo-category"]'),
        nameError: () => describedError('m3-demo-name'),
        categoryError: () => describedError('m3-demo-category'),
      };

      const identify = (el) =>
        `${el.tagName.toLowerCase()}${el.id === '' ? '' : `#${el.id}`}:${(el.textContent ?? '').trim().slice(0, 30)}`;

      const output = [];

      for (const definition of definitions) {
        const left = resolvers[definition.left]?.() ?? null;
        const right = resolvers[definition.right]?.() ?? null;

        const unresolvedReason =
          left === null
            ? `left target "${definition.left}" did not resolve`
            : right === null
              ? `right target "${definition.right}" did not resolve`
              : left === right
                ? `"${definition.left}" and "${definition.right}" resolved to the same element`
                : left.contains(right) || right.contains(left)
                  ? `"${definition.left}" and "${definition.right}" resolved to a nested pair`
                  : null;

        if (unresolvedReason !== null) {
          output.push({
            pairName: definition.pair,
            leftIdentifier: definition.left,
            rightIdentifier: definition.right,
            required: definition.required,
            unresolved: true,
            reason: unresolvedReason,
          });
          continue;
        }

        const leftRect = left.getBoundingClientRect();
        const rightRect = right.getBoundingClientRect();
        const overlapX =
          Math.min(leftRect.right, rightRect.right) - Math.max(leftRect.left, rightRect.left);
        const overlapY =
          Math.min(leftRect.bottom, rightRect.bottom) - Math.max(leftRect.top, rightRect.top);

        output.push({
          pairName: definition.pair,
          leftIdentifier: identify(left),
          rightIdentifier: identify(right),
          required: definition.required,
          unresolved: false,
          leftRect: {
            top: Math.round(leftRect.top),
            left: Math.round(leftRect.left),
            width: Math.round(leftRect.width),
            height: Math.round(leftRect.height),
          },
          rightRect: {
            top: Math.round(rightRect.top),
            left: Math.round(rightRect.left),
            width: Math.round(rightRect.width),
            height: Math.round(rightRect.height),
          },
          overlapX: Math.round(overlapX),
          overlapY: Math.round(overlapY),
        });
      }

      return output;
    },
    [declarations]
  );

  const records = findings.map((finding) =>
    classifyOverlapFinding(finding, viewportLabel, state, tolerance)
  );

  for (const record of records) {
    results.overlap.push(record);
  }

  return {
    records,
    summary: summariseOverlap(records),
    measuredFailures: records.filter((entry) => entry.status === OVERLAP_STATUS.MEASURED_FAIL),
    unresolvedRequired: records.filter((entry) => entry.status === OVERLAP_STATUS.UNRESOLVED),
  };
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

  const overlap = await semanticOverlap(
    page,
    OVERLAP_PROBES.initial,
    OVERLAP_TOLERANCE_PX,
    '1280x800',
    'initial'
  );

  for (const failure of overlapGeometryFailures(overlap.records)) {
    s.check(false, failure);
  }

  s.note(
    `overlap probes: ${String(overlap.summary.measured)} measured, ${String(overlap.summary.unresolved)} unresolved, ${String(overlap.summary.notApplicable)} N/A`
  );

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

async function describeActiveElement(page, sampleCount) {
  return page.evaluate(
    ([targets, samples]) => {
      const el = document.activeElement;
      if (el === null || el === document.body || el === document.documentElement) {
        return null;
      }

      const matchKey = () => {
        for (const target of targets) {
          if (target.selector !== undefined && el.matches(target.selector)) {
            return target.key;
          }
          if (
            target.ariaLabel !== undefined &&
            el.getAttribute('aria-label') === target.ariaLabel
          ) {
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
      const label = el.closest('label');

      const owns = (hit) =>
        hit !== null &&
        (hit === el ||
          el.contains(hit) ||
          hit.contains(el) ||
          (label !== null && (hit === label || label.contains(hit))));

      const inset = 0.15;
      const points = [
        [rect.left + rect.width / 2, rect.top + rect.height / 2],
        [rect.left + rect.width * inset, rect.top + rect.height * inset],
        [rect.right - rect.width * inset, rect.top + rect.height * inset],
        [rect.left + rect.width * inset, rect.bottom - rect.height * inset],
        [rect.right - rect.width * inset, rect.bottom - rect.height * inset],
      ].slice(0, samples);

      const unobscuredSampleCount = points.filter(([x, y]) =>
        owns(document.elementFromPoint(x, y))
      ).length;

      const visibleWidth = Math.max(
        0,
        Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)
      );
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      );
      const area = rect.width * rect.height;
      const visibleAreaRatio = area === 0 ? 0 : (visibleWidth * visibleHeight) / area;

      return {
        key: matchKey(),
        tag: el.tagName.toLowerCase(),
        label: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40),
        documentOrder: Array.from(document.querySelectorAll('*')).indexOf(el),
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
        rect: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          top: Math.round(rect.top),
        },
        visibleAreaRatio,
        unobscuredSampleCount,
        sampleCount: points.length,
      };
    },
    [FOCUS_TARGETS, sampleCount]
  );
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

  const stops = [];

  for (let index = 0; index < MAX_TAB_STOPS; index += 1) {
    await page.keyboard.press('Tab');
    const stop = await describeActiveElement(page, OBSCURATION_SAMPLES);
    if (stop === null) {
      break;
    }
    stops.push(stop);
    if (stops.filter((entry) => entry.key !== null).length === FOCUS_TARGETS.length) {
      break;
    }
  }

  const order = stops.map((stop) => stop.documentOrder);
  results.focus.forwardOrder = stops.map((stop) => ({
    key: stop.key,
    tag: stop.tag,
    label: stop.label,
    documentOrder: stop.documentOrder,
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

    for (const failure of evaluateFocusVisibility(stop)) {
      s.check(false, `${target.key}: ${failure}`);
    }

    results.focus.targets.push({
      key: target.key,
      focusVisible: stop.focusVisible,
      visibleAreaRatio: Number(stop.visibleAreaRatio.toFixed(3)),
      unobscuredSampleCount: stop.unobscuredSampleCount,
      sampleCount: stop.sampleCount,
    });
  }

  const reachedOrder = Array.from(reached.values()).map((stop) => stop.documentOrder);
  const ascending = reachedOrder.every(
    (value, index) => index === 0 || value > reachedOrder[index - 1]
  );
  s.check(ascending, 'representative controls were not reached in DOM order');

  const beforeBackward = stops[stops.length - 1] ?? null;
  await page.keyboard.press('Shift+Tab');
  const afterBackward = await describeActiveElement(page, OBSCURATION_SAMPLES);
  const backward = evaluateBackwardMove(beforeBackward, afterBackward, order);

  results.focus.backward = {
    from: beforeBackward === null ? null : beforeBackward.label,
    to: afterBackward === null ? null : afterBackward.label,
    moved: backward.moved,
    reason: backward.reason,
  };

  s.check(backward.moved, `Shift+Tab evidence: ${backward.reason}`);
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

async function measureGeometry(page, label, state, probes) {
  const overflow = await horizontalOverflow(page);
  const clipped = await clippedElements(page);
  const overlap = await semanticOverlap(page, probes, OVERLAP_TOLERANCE_PX, label, state);

  const failures = [];

  if (overflow > 1) {
    failures.push(`horizontal overflow ${String(overflow)}px`);
  }
  if (clipped > 0) {
    failures.push(`${String(clipped)} clipped elements`);
  }

  failures.push(...overlapGeometryFailures(overlap.records));

  return {
    geometry: {
      overflow,
      clipped,
      overlaps: overlap.measuredFailures.length,
      unresolvedRequiredProbes: overlap.unresolvedRequired.length,
      overlapProbes: overlap.summary,
    },
    failures,
  };
}

async function ensureInvalidState(page) {
  const summary = page.getByRole('region', { name: SUMMARY_TITLE });

  if ((await summary.count()) === 0) {
    await page.getByRole('button', { name: SUBMIT_LABEL }).click();
    await summary.waitFor();
  }

  return summary;
}

async function measureSummaryLinkGeometry(page, index, samples) {
  return page.evaluate(
    ([linkIndex, sampleCount]) => {
      const links = Array.from(
        document.querySelectorAll('main#main-content section[tabindex="-1"] a')
      );
      const el = links[linkIndex];

      if (el === undefined) {
        return null;
      }

      const rect = el.getBoundingClientRect();
      const owns = (hit) => hit !== null && (hit === el || el.contains(hit) || hit.contains(el));

      const inset = 0.15;
      const points = [
        [rect.left + rect.width / 2, rect.top + rect.height / 2],
        [rect.left + rect.width * inset, rect.top + rect.height * inset],
        [rect.right - rect.width * inset, rect.top + rect.height * inset],
        [rect.left + rect.width * inset, rect.bottom - rect.height * inset],
        [rect.right - rect.width * inset, rect.bottom - rect.height * inset],
      ].slice(0, sampleCount);

      const unobscuredSampleCount = points.filter(([x, y]) =>
        owns(document.elementFromPoint(x, y))
      ).length;

      const visibleWidth = Math.max(
        0,
        Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)
      );
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      );
      const area = rect.width * rect.height;

      return {
        text: (el.textContent ?? '').trim(),
        href: el.getAttribute('href'),
        boundingBox: {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        visibleAreaRatio: area === 0 ? 0 : (visibleWidth * visibleHeight) / area,
        unobscuredSampleCount,
        sampleCount: points.length,
      };
    },
    [index, samples]
  );
}

async function collectSummaryLinkEvidence(page) {
  const records = [];

  for (const target of SUMMARY_LINK_TARGETS) {
    const summary = await ensureInvalidState(page);
    const link = summary.getByRole('link').nth(target.index);

    if ((await link.count()) === 0) {
      records.push({
        index: target.index,
        name: target.name,
        text: null,
        href: null,
        visible: false,
        boundingBox: null,
        visibleAreaRatio: 0,
        unobscuredSampleCount: 0,
        sampleCount: OBSCURATION_SAMPLES,
        activationTarget: target.selector,
        activationMethod: 'keyboard Enter',
        activationFocusedLink: false,
        activationPassed: false,
      });
      continue;
    }

    await link.scrollIntoViewIfNeeded().catch(() => undefined);

    const visible = await link.isVisible();
    const geometry = await measureSummaryLinkGeometry(page, target.index, OBSCURATION_SAMPLES);

    await link.focus();
    const activationFocusedLink = await link.evaluate((el) => el === document.activeElement);
    await page.keyboard.press('Enter');
    const activationPassed = await page
      .locator(target.selector)
      .evaluate((el) => el === document.activeElement);

    records.push({
      index: target.index,
      name: target.name,
      text: geometry === null ? null : geometry.text,
      href: geometry === null ? null : geometry.href,
      visible,
      boundingBox: geometry === null ? null : geometry.boundingBox,
      visibleAreaRatio: geometry === null ? 0 : Number(geometry.visibleAreaRatio.toFixed(3)),
      unobscuredSampleCount: geometry === null ? 0 : geometry.unobscuredSampleCount,
      sampleCount: geometry === null ? OBSCURATION_SAMPLES : geometry.sampleCount,
      activationTarget: target.selector,
      activationMethod: 'keyboard Enter',
      activationFocusedLink,
      activationPassed,
    });
  }

  return records;
}

async function sectionResponsive(page, url) {
  const s = openSection('G', 'Responsive matrix');

  for (const viewport of REVIEW_VIEWPORTS) {
    const label = `${String(viewport.width)}x${String(viewport.height)}`;
    await page.setViewportSize(viewport);
    await gotoHome(page, url);

    const initial = { state: 'initial', failures: [], geometry: {}, visibility: {} };
    const invalid = {
      state: 'invalid',
      failures: [],
      geometry: {},
      visibility: {},
      summaryLinks: [],
    };
    const success = { state: 'success', failures: [], geometry: {}, visibility: {} };

    const initialGeometry = await measureGeometry(page, label, 'initial', OVERLAP_PROBES.initial);
    initial.geometry = initialGeometry.geometry;
    initial.failures.push(...initialGeometry.failures);

    initial.visibility = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      const notice = Array.from(document.querySelectorAll('p')).find((el) =>
        (el.textContent ?? '').includes('Technical Shared UI verification surface')
      );
      return {
        heading: heading !== null && heading.getBoundingClientRect().height > 0,
        notice: notice !== undefined && notice.getBoundingClientRect().height > 0,
      };
    });

    if (!initial.visibility.heading) {
      initial.failures.push('heading not visible');
    }
    if (!initial.visibility.notice) {
      initial.failures.push('technical notice not visible');
    }

    await page.getByRole('button', { name: SUBMIT_LABEL }).click();
    const summary = page.getByRole('region', { name: SUMMARY_TITLE });
    await summary.waitFor();

    const invalidGeometry = await measureGeometry(page, label, 'invalid', OVERLAP_PROBES.invalid);
    invalid.geometry = invalidGeometry.geometry;
    invalid.failures.push(...invalidGeometry.failures);

    invalid.visibility = {
      summaryVisible: await summary.isVisible(),
      summaryFocused: await summary.evaluate((el) => el === document.activeElement),
      summaryInViewport: await summary.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      }),
      summaryLinks: await summary.getByRole('link').count(),
      nameErrorVisible: await page.getByText(NAME_ERROR).first().isVisible(),
      categoryErrorVisible: await page.getByText(CATEGORY_ERROR).first().isVisible(),
      submitVisible: await page.getByRole('button', { name: SUBMIT_LABEL }).isVisible(),
      resetVisible: await page.getByRole('button', { name: RESET_FORM_LABEL }).isVisible(),
    };

    if (!invalid.visibility.summaryVisible) {
      invalid.failures.push('error summary not visible');
    }
    if (!invalid.visibility.summaryFocused) {
      invalid.failures.push('error summary not focused');
    }
    if (!invalid.visibility.summaryInViewport) {
      invalid.failures.push('error summary outside the viewport');
    }
    if (invalid.visibility.summaryLinks !== 2) {
      invalid.failures.push(
        `expected two summary links, found ${String(invalid.visibility.summaryLinks)}`
      );
    }
    if (!invalid.visibility.nameErrorVisible) {
      invalid.failures.push('name error not visible');
    }
    if (!invalid.visibility.categoryErrorVisible) {
      invalid.failures.push('category error not visible');
    }
    if (!invalid.visibility.submitVisible || !invalid.visibility.resetVisible) {
      invalid.failures.push('form actions not visible');
    }

    invalid.summaryLinks = await collectSummaryLinkEvidence(page);

    for (const record of invalid.summaryLinks) {
      invalid.failures.push(...evaluateSummaryLinkEvidence(record));
    }

    await ensureInvalidState(page);

    await page.locator(NAME_FIELD).fill('Demonstration');
    await page.locator(CATEGORY_FIELD).selectOption('laptops');
    await page.getByRole('button', { name: SUBMIT_LABEL }).click();
    const status = page.locator(MAIN).getByRole('status');
    await status.waitFor();

    const successGeometry = await measureGeometry(page, label, 'success', OVERLAP_PROBES.success);
    success.geometry = successGeometry.geometry;
    success.failures.push(...successGeometry.failures);

    success.visibility = {
      statusVisible: await status.isVisible(),
      statusText: await status.first().textContent(),
      statusCount: await status.count(),
      submitVisible: await page.getByRole('button', { name: SUBMIT_LABEL }).isVisible(),
      resetVisible: await page.getByRole('button', { name: RESET_FORM_LABEL }).isVisible(),
    };

    if (!success.visibility.statusVisible) {
      success.failures.push('success status not visible');
    }
    if (success.visibility.statusCount !== 1) {
      success.failures.push(
        `expected one Home-owned status, found ${String(success.visibility.statusCount)}`
      );
    }
    if (success.visibility.statusText !== SUCCESS_RESULT) {
      success.failures.push('success copy mismatch');
    }
    if (!success.visibility.submitVisible || !success.visibility.resetVisible) {
      success.failures.push('form actions not visible');
    }

    const states = [initial, invalid, success];
    results.viewports.push({ viewport: label, states, status: resolveViewportStatus(states) });

    if (label === '320x568') {
      await shot(page, 'viewport-320x568.png');
    }
  }

  for (const failure of responsiveSectionFailures(results.viewports)) {
    s.check(false, failure);
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
  const focused = await describeActiveElement(page, OBSCURATION_SAMPLES);

  s.check(
    focused !== null && focused.tag === 'a',
    'keyboard focus did not reach a summary link under forced colors'
  );
  s.check(focused !== null && focused.focusVisible, 'summary link is not :focus-visible');
  s.check(
    focused !== null && hasVisibleFocusIndicator(focused.style, null),
    'focus indicator not materially visible under forced colors'
  );

  if (focused !== null) {
    for (const failure of evaluateFocusVisibility(focused)) {
      s.check(false, `forced colors focus: ${failure}`);
    }
  }

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

async function runInteractiveSignoff(page, url, signal, answers) {
  await page.bringToFront().catch(() => undefined);

  stdout.write(`\n${MANUAL_CHECKLIST}\n`);
  stdout.write(`Review window is open at ${url}\n\n`);

  const rl = createInterface({ input: stdin, output: stdout });

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

      if (prompt.fallback !== undefined && value === prompt.fallback.value) {
        let reason = '';
        while (reason === '') {
          const raw = (await rl.question(`${prompt.fallback.reasonKey}: `, { signal })).trim();
          if (isValidFallbackReason(raw)) {
            reason = raw;
          } else {
            stdout.write(
              `  ${prompt.fallback.value} needs a concrete reason of at least ${String(MIN_FALLBACK_REASON_LENGTH)} characters\n`
            );
          }
        }

        answers[prompt.fallback.reasonKey] = reason;
      }
    }

    answers.notes = (await rl.question('notes: ', { signal })).trim();
  } finally {
    rl.close();
  }

  return answers;
}

function printSignoffHandoff(sha) {
  const target = sha ?? '<approved SHA>';
  stdout.write('\nInteractive sign-off requires a visible TTY.\n');
  stdout.write('Run in the project terminal:\n\n');
  stdout.write(`  $env:${REVIEW_SHA_ENV}="${target}"\n`);
  stdout.write('  npm run review:m3-browser\n\n');
  stdout.write('Bash:\n\n');
  stdout.write(`  ${REVIEW_SHA_ENV}=${target} npm run review:m3-browser\n\n`);
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
  results.outcome.signoffInterrupted = true;
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
  }

  const automatedAggregate = aggregateDiagnostics(diagnosticSinks, EXPECTED_DIAGNOSTICS);
  const automatedEvaluation = evaluateDiagnostics(automatedAggregate);
  results.diagnostics.automatedSnapshot = automatedAggregate;

  const automatedSectionsFailed = results.sections.some(
    (entry) => entry.id !== 'M' && entry.status === 'FAIL'
  );
  const automatedPassed =
    startupHealthy && !automatedSectionsFailed && automatedEvaluation.failures.length === 0;

  if (mode === 'interactive' && automatedPassed && !results.outcome.signoffInterrupted) {
    if (!signoffAvailability.available) {
      results.outcome.signoffUnavailable.push(String(signoffAvailability.reason));
      printSignoffHandoff(approvedSha);
    } else {
      const environment = await createSignoffEnvironment({
        launchBrowser: () => chromium.launch({ headless: false }),
        createContext: (browser) => browser.newContext({ viewport: DESKTOP_VIEWPORT }),
        createPage: (context) => context.newPage(),
        attachDiagnostics: (interactivePage) => createDiagnostics(interactivePage, 'interactive'),
        preparePage: (interactivePage) => gotoHome(interactivePage, localUrl),
      });

      interactiveBrowser = environment.browser;
      interactiveContext = environment.context;

      if (!environment.available) {
        results.outcome.signoffUnavailable.push(String(environment.reason));
      } else {
        const interactivePage = environment.page;

        results.manual = createManualAnswerRecord();
        results.outcome.signoffCollectionStarted = true;

        try {
          await runInteractiveSignoff(
            interactivePage,
            localUrl,
            abortController.signal,
            results.manual
          );
        } catch (error) {
          if (results.outcome.signoffInterrupted) {
            results.outcome.signoffIncomplete.push(`sign-off interrupted: ${toMessage(error)}`);
          } else {
            results.outcome.signoffIncomplete.push(
              `sign-off did not complete: ${toMessage(error)}`
            );
          }
        }

        try {
          await shot(interactivePage, 'manual-final.png');
        } catch (error) {
          results.outcome.signoffIncomplete.push(`final screenshot failed: ${toMessage(error)}`);
        }
      }
    }
  }
} catch (error) {
  results.outcome.automatedExecutionErrors.push(toMessage(error));
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

const finalAggregate = aggregateDiagnostics(diagnosticSinks, EXPECTED_DIAGNOSTICS);
const finalEvaluation = evaluateDiagnostics(finalAggregate);
const interactiveIncluded = diagnosticSinks.some((sink) => sink.scope === 'interactive');
const diagnosticsPassed = recordDiagnosticsSection(finalEvaluation, interactiveIncluded);

const manualSummary = summariseManual(results.manual);
const interruptedAfterAnswers =
  manualSummary !== null &&
  manualSummary.answeredCount > 0 &&
  (results.outcome.signoffInterrupted ||
    results.outcome.signoffIncomplete.length > 0 ||
    results.outcome.signoffUnavailable.length > 0);
const overlapTotals = summariseOverlap(results.overlap);
const summaryLinkEvidence = results.viewports.flatMap((entry) =>
  entry.states
    .filter((state) => state.state === 'invalid')
    .flatMap((state) =>
      (state.summaryLinks ?? []).map((record) => ({
        viewport: entry.viewport,
        record,
        failures: evaluateSummaryLinkEvidence(record),
      }))
    )
);
const summaryLinkFailureCount = summaryLinkEvidence.filter(
  (entry) => entry.failures.length > 0
).length;
const automatedFailures = results.sections.filter(
  (entry) => entry.id !== 'M' && entry.status === 'FAIL'
);
const axeViolations = results.axe.reduce((total, entry) => total + entry.violations.length, 0);

const status = resolveFinalStatus({
  mode,
  baselineEligible: baseline.eligible,
  startupBlockers: (results.startup.blockers ?? []).length,
  automatedExecutionErrors: results.outcome.automatedExecutionErrors.length,
  automatedFailures: automatedFailures.length,
  axeViolations,
  diagnosticsFailures: diagnosticsPassed ? 0 : 1,
  cleanupErrors: results.lifecycle.cleanupErrors.length,
  portReleased: results.lifecycle.portReleased,
  manual: manualSummary,
  signoffUnavailable: results.outcome.signoffUnavailable.length,
  signoffInterrupted: results.outcome.signoffInterrupted,
  signoffIncomplete: results.outcome.signoffIncomplete.length,
});

const exitCode = exitCodeForStatus(status);

results.status = status;
results.exitCode = exitCode;
results.finishedAt = new Date().toISOString();
results.overlapSummary = overlapTotals;
results.summaryLinkFailures = summaryLinkFailureCount;
results.manualSummary =
  manualSummary === null
    ? null
    : {
        complete: manualSummary.complete,
        answersComplete: manualSummary.answersComplete,
        failed: manualSummary.failed,
        answeredCount: manualSummary.answeredCount,
        promptCount: manualSummary.promptCount,
        fallbackReasonsComplete: manualSummary.fallbackReasonsComplete,
        missingReasons: manualSummary.missingReasons,
        interruptedAfterAnswers,
      };

function renderReport() {
  const lifecycle = results.lifecycle;
  const repository = results.repository;
  const outcome = results.outcome;

  const sectionRows = results.sections
    .map((entry) => {
      const notes = [...entry.notes, ...entry.failures].join('; ') || '—';
      return `| ${entry.id}. ${entry.name} | ${entry.status} | results.json | ${notes} |`;
    })
    .join('\n');

  const viewportRows = results.viewports
    .map((entry) => {
      const cell = (name) => {
        const state = entry.states.find((item) => item.state === name);
        return state === undefined
          ? 'not measured'
          : state.failures.length === 0
            ? 'clean'
            : state.failures.join(', ');
      };
      return `| ${entry.viewport} | ${entry.status} | ${cell('initial')} | ${cell('invalid')} | ${cell('success')} |`;
    })
    .join('\n');

  const axeRows = results.axe
    .map((entry) => `- \`${entry.state}\`: ${String(entry.violations.length)} violations`)
    .join('\n');

  const focusRows = results.focus.targets
    .map(
      (entry) =>
        `| ${entry.key} | ${String(entry.focusVisible)} | ${(entry.visibleAreaRatio * 100).toFixed(1)}% | ${String(entry.unobscuredSampleCount)}/${String(entry.sampleCount)} |`
    )
    .join('\n');

  const overlapFailures = results.overlap.filter(
    (entry) => entry.status === OVERLAP_STATUS.MEASURED_FAIL
  );
  const overlapUnresolved = results.overlap.filter(
    (entry) => entry.status === OVERLAP_STATUS.UNRESOLVED
  );

  const summaryLinkRows = summaryLinkEvidence
    .map(
      (entry) =>
        `| ${entry.viewport} | ${entry.record.name} | ${String(entry.record.visible)} | ${(entry.record.visibleAreaRatio * 100).toFixed(1)}% | ${String(entry.record.unobscuredSampleCount)}/${String(entry.record.sampleCount)} | ${entry.record.activationMethod} | ${String(entry.record.activationPassed)} | ${entry.failures.length === 0 ? '—' : entry.failures.join('; ')} |`
    )
    .join('\n');

  const manual = results.manual;
  const manualRow = (label, key) =>
    `| ${label} | ${manual === null ? 'NOT COLLECTED' : (manual[key] ?? 'NOT COLLECTED')} | ${
      manual === null ? 'no sign-off phase in this run' : '—'
    } |`;

  const manualReasonRow = (label, entry) => {
    if (manual === null) {
      return `| ${label} | NOT COLLECTED | no sign-off phase in this run |`;
    }

    const answer = manual[entry.key];

    if (typeof answer !== 'string') {
      return `| ${label} | NOT COLLECTED | \`${entry.key}\` was never answered |`;
    }

    if (answer !== entry.trigger) {
      return `| ${label} | NOT REQUIRED | \`${entry.key}\` answered ${answer} |`;
    }

    const reason = manual[entry.reasonKey];

    return isValidFallbackReason(reason)
      ? `| ${label} | ${String(reason)} | required because \`${entry.key}\` = ${entry.trigger} |`
      : `| ${label} | MISSING | required because \`${entry.key}\` = ${entry.trigger} |`;
  };

  const fullPassBlockers = [
    manualSummary === null ? 'no manual answers were collected' : null,
    manualSummary !== null && !manualSummary.answersComplete
      ? `manual answers are incomplete (${String(manualSummary.answeredCount)} of ${String(manualSummary.promptCount)})`
      : null,
    manualSummary !== null && manualSummary.failed ? 'a manual FAIL was recorded' : null,
    manualSummary !== null && !manualSummary.fallbackReasonsComplete
      ? `fallback reason missing: ${manualSummary.missingReasons.join(', ')}`
      : null,
    outcome.signoffUnavailable.length > 0 ? 'the sign-off environment was unavailable' : null,
    overlapTotals.unresolved > 0
      ? `${String(overlapTotals.unresolved)} required overlap probes were unresolved`
      : null,
    summaryLinkFailureCount > 0
      ? `${String(summaryLinkFailureCount)} responsive Error Summary links were not usable`
      : null,
  ].filter((entry) => entry !== null);

  const defects = results.sections
    .filter((entry) => entry.status === 'FAIL')
    .flatMap((entry) => entry.failures.map((failure) => `- **${entry.id}** ${failure}`))
    .join('\n');

  const startupBlockers = results.startup.blockers ?? [];
  const forcedColors = results.sections.find((entry) => entry.id === 'I');
  const snapshotCounts = (snapshot) =>
    snapshot === null
      ? 'not captured'
      : `page ${String(snapshot.pageErrors.length)}, console ${String(snapshot.consoleErrors.length)}, request-failures ${String(snapshot.requestFailures.length)}, >=400 ${String(snapshot.badResponses.length)} (scopes: ${snapshot.scopes.join(', ')})`;

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

- automated execution errors: ${outcome.automatedExecutionErrors.length === 0 ? 'none' : outcome.automatedExecutionErrors.join('; ')}
- sign-off unavailable: ${outcome.signoffUnavailable.length === 0 ? 'no' : outcome.signoffUnavailable.join('; ')}
- sign-off interrupted: ${String(outcome.signoffInterrupted)}
- sign-off incomplete: ${outcome.signoffIncomplete.length === 0 ? 'no' : outcome.signoffIncomplete.join('; ')}
- manual failed: ${manualSummary === null ? 'not collected' : String(manualSummary.failed)}
- diagnostics failed: ${String(!diagnosticsPassed)}
- cleanup failed: ${lifecycle.cleanupErrors.length > 0 ? lifecycle.cleanupErrors.join('; ') : 'no'}
- final status: **${status}**
- exit code: **${String(exitCode)}**

## Terminal Availability

- stdin TTY: ${String(results.tty.stdin)}
- stdout TTY: ${String(results.tty.stdout)}
- interactive sign-off available: **${String(results.tty.interactiveSignoffAvailable)}**

## Baseline

- SHA: \`${String(repository.headSha)}\`
- branch: \`${String(repository.branch)}\`
- tracked tree clean: ${String(repository.trackedTreeClean)}

Prerequisite history, **not** verification of this review result: earlier corrective commits passed CI for their own SHAs. Those runs verify their own commits only.

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

Each viewport is measured in three states. Viewport status is PASS only when all three state failure lists are empty.

| Viewport | Status | Initial | Invalid | Success |
| --- | --- | --- | --- | --- |
${viewportRows}

### Responsive Error Summary Links

Both links are inspected independently in the invalid state at every viewport: visibility, bounding box, viewport containment ratio, multi-point obscuration sampling and keyboard activation of the field each link points at. A viewport cannot pass while either link is unusable.

| Viewport | Link | Visible | Visible area | Unobscured | Activation | Focus reached | Failures |
| --- | --- | --- | --- | --- | --- | --- | --- |
${summaryLinkRows || '| — | — | — | — | — | — | — | not measured |'}

## Overlap Probes

Semantic adjacent-region probes with a documented ${String(OVERLAP_TOLERANCE_PX)} px border-touch tolerance. Every probe resolves to exactly one status: \`MEASURED_PASS\`, \`MEASURED_FAIL\`, \`UNRESOLVED\` or \`NOT_APPLICABLE\`. Only a probe explicitly declared \`required: false\` may be \`NOT_APPLICABLE\`; an unresolved required probe is a failure of the state that declared it.

| Count | Value |
| --- | --- |
| declared | ${String(overlapTotals.declared)} |
| measured | ${String(overlapTotals.measured)} |
| measured pass | ${String(overlapTotals.measuredPass)} |
| measured fail | ${String(overlapTotals.measuredFail)} |
| unresolved (required) | ${String(overlapTotals.unresolved)} |
| not applicable (optional) | ${String(overlapTotals.notApplicable)} |
| all required probes measured | ${String(overlapTotals.allRequiredMeasured)} |

${
  overlapTotals.clean
    ? 'No material intersections detected.'
    : [
        ...overlapFailures.map(
          (entry) =>
            `- MEASURED_FAIL — ${entry.viewport} ${entry.state} — ${entry.pairName}: overlapX ${String(entry.overlapX)}, overlapY ${String(entry.overlapY)}`
        ),
        ...overlapUnresolved.map(
          (entry) =>
            `- UNRESOLVED — ${entry.viewport} ${entry.state} — ${entry.pairName}: ${String(entry.reason)}`
        ),
      ].join('\n')
}

Full rectangles, overlap values, statuses and unresolved reasons for every probe: \`${RESULTS_PATH}\`.

## Focus Evidence

Forward tab stops recorded: ${String(results.focus.forwardOrder.length)}. Backward movement: ${
    results.focus.backward === null
      ? 'not measured'
      : `${String(results.focus.backward.from)} -> ${String(results.focus.backward.to)} (${results.focus.backward.reason})`
  }.

| Target | :focus-visible | Visible area | Unobscured samples |
| --- | --- | --- | --- |
${focusRows || '| — | — | — | — |'}

## Axe Results

${axeRows || '- not run'}

Affected-node evidence — targets, failure summaries and capped HTML excerpts — is stored in \`${RESULTS_PATH}\`.

## Console and Network

- automated snapshot: ${snapshotCounts(results.diagnostics.automatedSnapshot)}
- final snapshot: ${snapshotCounts(results.diagnostics.finalSnapshot)}
- interactive diagnostics included: **${String(results.diagnostics.interactiveIncluded)}**
- diagnostics allow-list entries: ${String(results.diagnostics.allowListEntries)}

## Manual Sign-off

- answers collected: ${manual === null ? 'none' : String(Object.keys(manual).length)}
- answered count: ${manualSummary === null ? '0' : `${String(manualSummary.answeredCount)} of ${String(manualSummary.promptCount)}`}
- complete: ${manualSummary === null ? 'false' : String(manualSummary.complete)}
- failed: ${manualSummary === null ? 'not collected' : String(manualSummary.failed)}
- fallback reasons complete: ${manualSummary === null ? 'not collected' : String(manualSummary.fallbackReasonsComplete)}
- missing fallback reasons: ${manualSummary === null || manualSummary.missingReasons.length === 0 ? 'none' : manualSummary.missingReasons.join(', ')}
- sign-off collection started: ${String(outcome.signoffCollectionStarted)}
- interrupted after answers: ${String(interruptedAfterAnswers)}

Every answer is persisted the moment it is accepted, so an EOF, \`SIGINT\` or \`SIGTERM\` after an answer cannot discard it. Answers already recorded are reported below even when the sign-off ended early.

| Check | Result | Reason/notes |
| --- | --- | --- |
${manualRow('200% zoom', '200% zoom')}
${manualRow('400% zoom', '400% zoom')}
${manualRow('keyboard/focus', 'keyboard/focus')}
${manualRow('clipping/overlap', 'clipping/overlap')}
${manualRow('real forced colors', 'forced colors')}
${manualReasonRow('forced colors reason', MANUAL_FALLBACK_REASONS[0])}
${manualRow('screen reader', 'screen reader')}
${manualReasonRow('screen reader reason', MANUAL_FALLBACK_REASONS[1])}

${manual === null ? 'No user answers were collected in this mode.' : `User notes — kept separate from fallback reasons and never accepted as justification:\n\n> ${manual.notes || '(none)'}`}

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

${
  fullPassBlockers.length === 0
    ? 'No blocker to a full-pass claim remains in this run.'
    : `A full-pass claim is impossible while any of these holds:\n\n${fullPassBlockers.map((entry) => `- ${entry}`).join('\n')}`
}

${repository.finalReviewEligible ? '' : 'This run is **PROVISIONAL**: it is not bound to an approved review SHA and cannot serve as closure evidence.'}

## Remaining Risks

- Viewport width is not browser zoom; the responsive matrix does not prove 200 % or 400 % reflow.
- Forced-colors coverage here is Playwright emulation, not a real OS high-contrast mode.
- Axe does not replace a screen-reader review; announcement behaviour is not automatable and is not claimed.
- Automated Error Summary link activation is harness-driven keyboard activation of a focused link. It does not replace the user's keyboard sign-off.

## Next Step

${
  repository.finalReviewEligible && status === STATUS.FULL_PASS
    ? 'Independent review of these results, then the M3 closure documentation pass.'
    : `Re-run bound to the approved SHA in a visible terminal after independent audit:\n\n\`\`\`\n$env:${REVIEW_SHA_ENV}="<approved SHA>"; npm run review:m3-browser\n\`\`\``
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
      tty: results.tty,
      startup: results.startup.healthy ?? false,
      sections: results.sections.map((entry) => `${entry.id}:${entry.status}`),
      viewports: results.viewports.map((entry) => `${entry.viewport}:${entry.status}`),
      overlap: overlapTotals,
      summaryLinkFailures: summaryLinkFailureCount,
      manual: results.manualSummary,
      axeViolations,
      diagnostics: {
        interactiveIncluded: results.diagnostics.interactiveIncluded,
        failures: finalEvaluation.failures.length,
      },
      outcome: results.outcome,
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
    ...results.outcome.automatedExecutionErrors,
    ...results.outcome.signoffUnavailable,
    ...results.outcome.signoffIncomplete,
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

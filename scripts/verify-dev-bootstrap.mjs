import { createServer as createNetServer } from 'node:net';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';

const WORKER_FILENAME = 'mockServiceWorker.js';
const EXPECTED_H1 = 'GoodCall Shared UI verification';
const EXPECTED_NOTICE = 'Technical Shared UI verification surface';
const FAILURE_TITLE = 'GoodCall could not start';
const WORKER_MARKERS = ['PACKAGE_VERSION', 'INTEGRITY_CHECKSUM'];
const PAGE_TIMEOUT_MS = 20000;

const summary = {
  port: null,
  serverStarted: false,
  worker: {},
  runtime: {},
  serviceWorker: {},
  diagnostics: {},
  contextClosed: false,
  browserClosed: false,
  serverClosed: false,
  portReleased: false,
  cleanupErrors: [],
};

const failures = [];

function check(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

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

async function closeStage(label, close) {
  try {
    await close();
    return true;
  } catch (error) {
    summary.cleanupErrors.push(`${label} close failed: ${toMessage(error)}`);
    return false;
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

let server = null;
let browser = null;
let context = null;
let localUrl = null;

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
  summary.serverStarted = true;

  localUrl = server.resolvedUrls?.local?.[0] ?? null;

  if (localUrl === null) {
    throw new Error('dev server did not resolve a local URL');
  }

  summary.port = new URL(localUrl).port;

  const workerUrl = new URL(WORKER_FILENAME, localUrl).href;
  const workerResponse = await fetch(workerUrl);
  const workerContentType = workerResponse.headers.get('content-type') ?? '';
  const workerBody = await workerResponse.text();

  summary.worker = {
    url: workerUrl,
    status: workerResponse.status,
    contentType: workerContentType,
    bytes: workerBody.length,
  };

  check(
    workerResponse.status === 200,
    `worker responded ${String(workerResponse.status)}, expected 200`
  );
  check(
    workerContentType.includes('javascript'),
    `worker content-type "${workerContentType}" is not JavaScript`
  );
  check(!/^\s*<(!doctype|html)/i.test(workerBody), 'worker response body is HTML');
  check(workerBody.length > 0, 'worker response body is empty');

  for (const marker of WORKER_MARKERS) {
    check(workerBody.includes(marker), `worker response is missing marker ${marker}`);
  }

  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  const page = await context.newPage();

  const pageErrors = [];
  const consoleErrors = [];
  const requestFailures = [];
  const badResponses = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('requestfailed', (request) => {
    requestFailures.push(`${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      badResponses.push(`${response.url()} :: ${String(response.status())}`);
    }
  });

  await page.goto(localUrl, { waitUntil: 'load', timeout: PAGE_TIMEOUT_MS });

  try {
    await page.waitForSelector('main#main-content', { timeout: PAGE_TIMEOUT_MS });
  } catch {
    failures.push('main#main-content never appeared');
  }

  const dom = await page.evaluate(
    ([headingText, noticeText, failureTitle]) => {
      const root = document.getElementById('root');
      const headings = Array.from(document.querySelectorAll('h1'));
      return {
        rootChildren: root === null ? null : root.children.length,
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

  summary.runtime = dom;

  check(dom.rootChildren !== null && dom.rootChildren > 0, 'root element has no rendered children');
  check(
    dom.mainCount === 1,
    `expected exactly one main#main-content, found ${String(dom.mainCount)}`
  );
  check(dom.h1Count === 1, `expected exactly one h1, found ${String(dom.h1Count)}`);
  check(dom.hasExpectedH1, `h1 does not contain "${EXPECTED_H1}"`);
  check(dom.noticeVisible, 'technical verification notice is not visible');
  check(!dom.failureVisible, 'bootstrap failure diagnostic is visible');

  const registration = await page.evaluate(async () => {
    const active = await navigator.serviceWorker.getRegistration();
    if (active === undefined) {
      return null;
    }
    const worker = active.active ?? active.installing ?? active.waiting;
    return worker === null || worker === undefined ? null : worker.scriptURL;
  });

  summary.serviceWorker = { scriptURL: registration };

  check(registration !== null, 'no service worker registration resolved');
  check(
    registration !== null && registration.endsWith(`/${WORKER_FILENAME}`),
    `registered script URL "${String(registration)}" does not end with /${WORKER_FILENAME}`
  );

  const failedModules = badResponses.filter((entry) => /\.(m?[jt]sx?)\b/.test(entry));

  summary.diagnostics = { pageErrors, consoleErrors, requestFailures, badResponses };

  check(pageErrors.length === 0, `page errors: ${pageErrors.join(' | ')}`);
  check(consoleErrors.length === 0, `console errors: ${consoleErrors.join(' | ')}`);
  check(requestFailures.length === 0, `request failures: ${requestFailures.join(' | ')}`);
  check(failedModules.length === 0, `failed module requests: ${failedModules.join(' | ')}`);
} catch (error) {
  failures.push(toMessage(error));
} finally {
  if (context !== null) {
    summary.contextClosed = await closeStage('context', () => context.close());
  }

  if (browser !== null) {
    summary.browserClosed = await closeStage('browser', () => browser.close());
  }

  if (server !== null) {
    summary.serverClosed = await closeStage('server', () => server.close());
  }

  try {
    summary.portReleased = localUrl === null ? true : !(await respondsAt(localUrl));
  } catch (error) {
    summary.cleanupErrors.push(`port verification failed: ${toMessage(error)}`);
  }
}

check(summary.portReleased, 'dev server port still responds after shutdown');

for (const cleanupError of summary.cleanupErrors) {
  failures.push(cleanupError);
}

console.log('\n🔍 Dev bootstrap verification\n');
console.log(JSON.stringify(summary, null, 2));

if (failures.length > 0) {
  console.error('\n✗ Dev bootstrap verification failed\n');
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  console.error('');
  process.exit(1);
}

console.log('\n✓ Dev bootstrap verification passed\n');
process.exit(0);

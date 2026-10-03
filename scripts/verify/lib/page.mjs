import { writeFileSync } from 'node:fs';

import { sleep } from './browser.mjs';

const KEYS = {
  ArrowLeft: { code: 'ArrowLeft', keyCode: 37 },
  ArrowRight: { code: 'ArrowRight', keyCode: 39 },
  Enter: { code: 'Enter', keyCode: 13, text: '\r' },
  Tab: { code: 'Tab', keyCode: 9 },
};

const CORS_HEADERS = [
  { name: 'Access-Control-Allow-Origin', value: '*' },
  { name: 'Access-Control-Allow-Headers', value: '*' },
  { name: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
];

const DEFAULT_TIMEOUT = 15000;

function callExpression(fn, arg) {
  return `(${fn.toString()})(${arg === undefined ? '' : JSON.stringify(arg)})`;
}

function visibleMatchExpression(selector, hasText, nth = 0) {
  return `[...document.querySelectorAll(${JSON.stringify(selector)})].filter((el) => {
    const rects = el.getClientRects();
    const style = getComputedStyle(el);
    return rects.length > 0 && style.visibility !== 'hidden' && (${JSON.stringify(hasText ?? null)} === null || el.textContent.includes(${JSON.stringify(hasText ?? '')}));
  })[${nth}]`;
}

export async function openPage(
  browser,
  { width = 1440, height = 900, interceptPatterns = [], respond, onPageError },
) {
  const cdp = await browser.newPage();
  const { send } = cdp;
  let loadWaiters = [];

  cdp.onEvent((message) => {
    if (message.method === 'Page.loadEventFired') {
      for (const resolve of loadWaiters) resolve();
      loadWaiters = [];
    }
    if (message.method === 'Runtime.exceptionThrown') {
      const details = message.params.exceptionDetails;
      onPageError?.(details.exception?.description ?? details.text);
    }
    if (message.method === 'Fetch.requestPaused') {
      const { requestId, request } = message.params;
      if (request.method === 'OPTIONS') {
        send('Fetch.fulfillRequest', {
          requestId,
          responseCode: 204,
          responseHeaders: CORS_HEADERS,
        });
        return;
      }
      const { status, body } = respond(request);
      send('Fetch.fulfillRequest', {
        requestId,
        responseCode: status,
        responseHeaders: [...CORS_HEADERS, { name: 'Content-Type', value: 'application/json' }],
        body: Buffer.from(body).toString('base64'),
      });
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  if (interceptPatterns.length > 0) {
    await send('Fetch.enable', {
      patterns: interceptPatterns.map((urlPattern) => ({ urlPattern })),
    });
  }
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });

  function nextLoad() {
    return new Promise((resolve) => loadWaiters.push(resolve));
  }

  async function evaluateExpression(expression) {
    const response = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.error) throw new Error(`${response.error.message}\n${expression}`);
    if (response.result.exceptionDetails) {
      const details = response.result.exceptionDetails;
      throw new Error(`${details.exception?.description ?? details.text}\n${expression}`);
    }
    return response.result.result.value;
  }

  async function waitForExpression(expression, label, timeout = DEFAULT_TIMEOUT) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        if (await evaluateExpression(`Boolean(${expression})`)) return;
      } catch (error) {
        if (!/context|Cannot find|destroyed/i.test(String(error))) throw error;
      }
      await sleep(100);
    }
    const state = await evaluateExpression(
      `location.href + ' | ' + document.body.innerText.replace(/\\s+/g, ' ').slice(0, 300)`,
    ).catch((error) => String(error));
    throw new Error(`timeout: ${label}\npage: ${state}`);
  }

  async function waitForVisible(selector, hasText) {
    await waitForExpression(visibleMatchExpression(selector, hasText), selector);
  }

  async function waitForAttached(selector) {
    await waitForExpression(`document.querySelector(${JSON.stringify(selector)})`, selector);
  }

  async function capture(path, clip) {
    const response = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      ...(clip ? { clip: { ...clip, scale: 1 } } : {}),
    });
    writeFileSync(path, Buffer.from(response.result.data, 'base64'));
  }

  const page = {
    async goto(url) {
      const loaded = nextLoad();
      const { result, error } = await send('Page.navigate', { url });
      if (error || result.errorText) throw new Error(`navigation failed: ${url}`);
      if (result.loaderId) await Promise.race([loaded, sleep(DEFAULT_TIMEOUT)]);
      else await waitForExpression(`location.href === ${JSON.stringify(url)}`, `commit ${url}`);
    },
    async reload() {
      const loaded = nextLoad();
      await send('Page.reload', {});
      await Promise.race([loaded, sleep(DEFAULT_TIMEOUT)]);
    },
    evaluate(fn, arg) {
      return evaluateExpression(callExpression(fn, arg));
    },
    waitForFunction(fn, arg) {
      return waitForExpression(callExpression(fn, arg), fn.toString().slice(0, 120));
    },
    waitForSelector(selector) {
      return waitForVisible(selector);
    },
    waitForTimeout(ms) {
      return sleep(ms);
    },
    async textContent(selector) {
      await waitForAttached(selector);
      return evaluateExpression(`document.querySelector(${JSON.stringify(selector)}).textContent`);
    },
    async getAttribute(selector, name) {
      await waitForAttached(selector);
      return evaluateExpression(
        `document.querySelector(${JSON.stringify(selector)}).getAttribute(${JSON.stringify(name)})`,
      );
    },
    count(selector) {
      return evaluateExpression(`document.querySelectorAll(${JSON.stringify(selector)}).length`);
    },
    async focus(selector) {
      await waitForAttached(selector);
      await evaluateExpression(`document.querySelector(${JSON.stringify(selector)}).focus()`);
    },
    async click(selector, { hasText, nth = 0 } = {}) {
      await waitForExpression(visibleMatchExpression(selector, hasText, nth), selector);
      const point = await evaluateExpression(`(() => {
        const el = ${visibleMatchExpression(selector, hasText, nth)};
        el.scrollIntoView({ block: 'center', inline: 'center' });
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()`);
      const base = { x: point.x, y: point.y, button: 'left', clickCount: 1 };
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y });
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...base });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...base });
    },
    keyboard: {
      async press(key) {
        const { code, keyCode, text } = KEYS[key];
        const event = { key, code, windowsVirtualKeyCode: keyCode };
        await send(
          'Input.dispatchKeyEvent',
          text === undefined
            ? { type: 'rawKeyDown', ...event }
            : { type: 'keyDown', text, ...event },
        );
        await send('Input.dispatchKeyEvent', { type: 'keyUp', ...event });
      },
    },
    async screenshot({ path, fullPage = false }) {
      if (!fullPage) {
        await capture(path);
        return;
      }
      const size = await evaluateExpression(
        `({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })`,
      );
      await capture(path, { x: 0, y: 0, ...size });
    },
    async elementScreenshot(selector, path) {
      await waitForVisible(selector);
      const clip = await evaluateExpression(`(() => {
        const rect = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
        return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
      })()`);
      await capture(path, clip);
    },
    close: () => cdp.close(),
  };

  return page;
}

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function findChrome() {
  const configured = process.env.GOODCALL_VERIFY_CHROME;
  if (configured) {
    if (!existsSync(configured))
      throw new Error(`GOODCALL_VERIFY_CHROME does not exist: ${configured}`);
    return configured;
  }
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      'Google Chrome was not found. Set GOODCALL_VERIFY_CHROME to a Chrome executable.',
    );
  }
  return found;
}

async function readDevToolsEndpoint(profileDir, chrome) {
  const file = path.join(profileDir, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (chrome.exitCode !== null)
      throw new Error(`Chrome exited early with code ${chrome.exitCode}`);
    if (existsSync(file)) {
      const [port, browserPath] = readFileSync(file, 'utf8').split(/\r?\n/);
      if (port && browserPath) return `ws://127.0.0.1:${port}${browserPath}`;
    }
    await sleep(100);
  }
  throw new Error('Chrome did not publish a DevTools endpoint');
}

export async function launchBrowser({ extraArgs = [] } = {}) {
  const profileDir = mkdtempSync(path.join(tmpdir(), 'goodcall-verify-chrome-'));
  const chrome = spawn(
    findChrome(),
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      `--user-data-dir=${profileDir}`,
      '--remote-debugging-port=0',
      ...extraArgs,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  const socket = new WebSocket(await readDevToolsEndpoint(profileDir, chrome));
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let sequence = 0;
  const pending = new Map();
  const sessionHandlers = new Map();

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id !== undefined && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
      return;
    }
    if (message.sessionId && sessionHandlers.has(message.sessionId)) {
      for (const handler of sessionHandlers.get(message.sessionId)) handler(message);
    }
  });

  function rawSend(method, params = {}, sessionId) {
    sequence += 1;
    const id = sequence;
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    return new Promise((resolve) => pending.set(id, resolve));
  }

  async function newPage() {
    const { result: contextResult } = await rawSend('Target.createBrowserContext', {
      disposeOnDetach: true,
    });
    const { browserContextId } = contextResult;
    const { result: targetResult } = await rawSend('Target.createTarget', {
      url: 'about:blank',
      browserContextId,
    });
    const { targetId } = targetResult;
    const { result: attachResult } = await rawSend('Target.attachToTarget', {
      targetId,
      flatten: true,
    });
    const { sessionId } = attachResult;
    const handlers = new Set();
    sessionHandlers.set(sessionId, handlers);
    return {
      send: (method, params = {}) => rawSend(method, params, sessionId),
      onEvent: (handler) => handlers.add(handler),
      close: async () => {
        sessionHandlers.delete(sessionId);
        await rawSend('Target.closeTarget', { targetId });
        await rawSend('Target.disposeBrowserContext', { browserContextId });
      },
    };
  }

  async function close() {
    const exited = new Promise((resolve) => {
      if (chrome.exitCode !== null) resolve();
      else chrome.once('exit', resolve);
    });
    await Promise.race([rawSend('Browser.close'), sleep(2000)]);
    socket.close();
    await Promise.race([exited, sleep(5000)]);
    if (chrome.exitCode === null) chrome.kill();
    rmSync(profileDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }

  return { newPage, close };
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import {
  renderBootstrapFailure,
  BOOTSTRAP_FAILURE_PREFIX,
  BOOTSTRAP_FAILURE_TITLE,
  BOOTSTRAP_FAILURE_MESSAGE,
} from '@/app/render-bootstrap-failure';

const EXISTING_CONTENT = 'existing application content';

describe('renderBootstrapFailure', () => {
  let errorSpy: MockInstance<(...args: unknown[]) => void>;

  beforeEach(() => {
    document.body.innerHTML = `<div id="root"><p>${EXISTING_CONTENT}</p></div>`;
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    errorSpy.mockRestore();
    document.body.innerHTML = '';
  });

  it('logs through the stable bootstrap prefix', () => {
    const error = new Error('worker registration rejected');

    renderBootstrapFailure(error);

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(BOOTSTRAP_FAILURE_PREFIX, error);
  });

  it('replaces the existing root content', () => {
    renderBootstrapFailure(new Error('boom'));

    const root = document.getElementById('root');

    expect(root?.textContent).not.toContain(EXISTING_CONTENT);
    expect(root?.children).toHaveLength(1);
  });

  it('renders exactly one main landmark', () => {
    renderBootstrapFailure(new Error('boom'));

    expect(document.querySelectorAll('main')).toHaveLength(1);
  });

  it('renders exactly one h1', () => {
    renderBootstrapFailure(new Error('boom'));

    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it('renders stable visible copy', () => {
    renderBootstrapFailure(new Error('boom'));

    expect(document.querySelector('h1')?.textContent).toBe(BOOTSTRAP_FAILURE_TITLE);
    expect(document.querySelector('main')?.textContent).toContain(BOOTSTRAP_FAILURE_MESSAGE);
  });

  it('does not expose the raw error message or stack in the DOM', () => {
    const error = new Error('mockServiceWorker.js returned text/html');

    renderBootstrapFailure(error);

    const text = document.body.textContent ?? '';

    expect(text).not.toContain('mockServiceWorker.js returned text/html');
    expect(text).not.toContain('at ');
    expect(text).not.toContain('Error:');
  });

  it('logs without throwing when the root element is missing', () => {
    document.body.innerHTML = '';
    const error = new Error('no root');

    expect(() => {
      renderBootstrapFailure(error);
    }).not.toThrow();
    expect(errorSpy).toHaveBeenCalledWith(BOOTSTRAP_FAILURE_PREFIX, error);
  });

  it('does not inject markup carried by an error message', () => {
    renderBootstrapFailure(new Error('<img src="x" onerror="globalThis.__pwned = true">'));

    expect(document.querySelector('img')).toBeNull();
    expect(document.body.textContent).not.toContain('<img');
  });
});

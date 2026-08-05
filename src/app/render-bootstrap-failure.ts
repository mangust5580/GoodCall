export const BOOTSTRAP_FAILURE_PREFIX = '[GoodCall bootstrap]';
export const BOOTSTRAP_FAILURE_TITLE = 'GoodCall could not start';
export const BOOTSTRAP_FAILURE_MESSAGE =
  'Development services failed to initialize. Check the browser console for details.';

export function renderBootstrapFailure(error: unknown): void {
  console.error(BOOTSTRAP_FAILURE_PREFIX, error);

  const root = document.getElementById('root');

  if (root === null) {
    return;
  }

  const main = document.createElement('main');
  const heading = document.createElement('h1');
  const message = document.createElement('p');

  heading.textContent = BOOTSTRAP_FAILURE_TITLE;
  message.textContent = BOOTSTRAP_FAILURE_MESSAGE;
  main.append(heading, message);

  root.replaceChildren(main);
}

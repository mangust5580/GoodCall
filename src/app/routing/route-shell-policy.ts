export type RouteShellVisibility = 'visible' | 'hidden';

export interface RouteShellPolicy {
  newsletter?: RouteShellVisibility;
}

export interface RouteShellHandle {
  shell?: RouteShellPolicy;
}

export interface RouteShellMatch {
  handle?: unknown;
}

export const NEWSLETTER_HIDDEN_SHELL_POLICY: RouteShellHandle = {
  shell: { newsletter: 'hidden' },
};

function readNewsletterPolicy(handle: unknown): RouteShellVisibility | undefined {
  if (typeof handle !== 'object' || handle === null) {
    return undefined;
  }

  const { shell } = handle as { shell?: unknown };

  if (typeof shell !== 'object' || shell === null) {
    return undefined;
  }

  const { newsletter } = shell as { newsletter?: unknown };

  if (newsletter !== 'visible' && newsletter !== 'hidden') {
    return undefined;
  }

  return newsletter;
}

export function isNewsletterVisible(matches: readonly RouteShellMatch[]): boolean {
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const policy = readNewsletterPolicy(matches[index]?.handle);

    if (policy !== undefined) {
      return policy === 'visible';
    }
  }

  return true;
}

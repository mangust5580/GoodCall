import { useId } from 'react';

export function describedBy(controlId: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${controlId}-hint` : undefined, error ? `${controlId}-error` : undefined]
    .filter((value) => value !== undefined)
    .join(' ');

  return ids === '' ? undefined : ids;
}

export function useControlId(explicit?: string): string {
  const generated = useId();

  return explicit ?? generated;
}

export function cx(...classes: readonly (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

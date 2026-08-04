import { useId } from 'react';

export type FieldIds = {
  controlId: string;
  descriptionId: string;
  errorId: string;
};

export function useFieldIds(providedId: string | undefined): FieldIds {
  const generatedId = useId();
  const controlId =
    typeof providedId === 'string' && providedId.length > 0 ? providedId : generatedId;

  return {
    controlId,
    descriptionId: `${controlId}-description`,
    errorId: `${controlId}-error`,
  };
}

export function requireNonBlank(value: string, message: string): string {
  if (value.trim().length === 0) {
    throw new Error(message);
  }

  return value;
}

export function optionalText(value: string | undefined): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  return value;
}

export function mergeDescribedBy(sources: Array<string | undefined>): string | undefined {
  const seen = new Set<string>();
  const tokens: string[] = [];

  for (const source of sources) {
    if (typeof source !== 'string') {
      continue;
    }

    for (const token of source.split(' ')) {
      if (token.length === 0 || seen.has(token)) {
        continue;
      }

      seen.add(token);
      tokens.push(token);
    }
  }

  return tokens.length > 0 ? tokens.join(' ') : undefined;
}

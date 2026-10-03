import type { FaqCategoryId, FaqEntry } from './faqData';

export function normalizeFaqText(value: string): string {
  return value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').replace(/\s+/g, ' ').trim();
}

function faqSearchText(entry: FaqEntry): string {
  return normalizeFaqText([entry.question, ...entry.answer, ...(entry.steps ?? [])].join(' '));
}

export function faqQueryTerms(query: string): readonly string[] {
  const normalized = normalizeFaqText(query);

  return normalized === '' ? [] : normalized.split(' ');
}

export function matchesFaqQuery(entry: FaqEntry, terms: readonly string[]): boolean {
  if (terms.length === 0) {
    return true;
  }

  const text = faqSearchText(entry);

  return terms.every((term) => text.includes(term));
}

export function filterFaqEntries(
  entries: readonly FaqEntry[],
  category: FaqCategoryId | undefined,
  terms: readonly string[],
): readonly FaqEntry[] {
  return entries.filter(
    (entry) =>
      (category === undefined || entry.category === category) && matchesFaqQuery(entry, terms),
  );
}

export function referenceUrl(name: string): string {
  return `${import.meta.env.BASE_URL}?reference=${name}`;
}

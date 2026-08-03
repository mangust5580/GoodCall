export const APP_BASE_PATH = '/GoodCall/';
export const STORAGE_ID = 'goodcall-github-pages';

export function normalizeAssetPath(path: string): string {
  if (path.startsWith('/')) {
    return `${APP_BASE_PATH.slice(0, -1)}${path}`;
  }
  return path;
}

export const BUILD_CONFIG: {
  dev: { base: string; publicDir: string };
  production: { base: string };
  browserTargets: string[];
  fallback: { storageKey: string; timeoutMs: number };
  getProductionBase(): string;
  getDevelopmentBase(): string;
  isValidBase(base: string): boolean;
  normalizeBase(base: string): string;
  getBase(command: string, mode: string): string;
  getDevelopmentPublicDir(): string;
  getPublicDir(command: string, isPreview: boolean): string | false;
};

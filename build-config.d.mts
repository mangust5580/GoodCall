export const BUILD_CONFIG: {
  dev: { base: string };
  production: { base: string };
  browserTargets: string[];
  fallback: { storageKey: string; timeoutMs: number };
  getProductionBase(): string;
  getDevelopmentBase(): string;
  isValidBase(base: string): boolean;
  normalizeBase(base: string): string;
  getBase(command: string, mode: string): string;
};

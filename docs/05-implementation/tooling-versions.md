# Tooling Versions

## Production Dependencies

| Package               | Version | Purpose               |
| --------------------- | ------- | --------------------- |
| react                 | ^18.3.1 | UI library            |
| react-dom             | ^18.3.1 | DOM rendering         |
| react-router-dom      | ^6.26.0 | Routing               |
| @tanstack/react-query | ^5.51.1 | Data fetching / cache |
| zod                   | ^3.23.8 | Schema validation     |

## Development Dependencies

### Core Build Tools

| Package              | Version | Purpose               |
| -------------------- | ------- | --------------------- |
| vite                 | ^5.2.11 | Build tool            |
| @vitejs/plugin-react | ^4.3.0  | React plugin for Vite |
| typescript           | ^5.4.5  | Type checking         |

### Node/Type Definitions

| Package          | Version  | Purpose         |
| ---------------- | -------- | --------------- |
| @types/node      | ^20.13.0 | Node.js types   |
| @types/react     | ^18.3.1  | React types     |
| @types/react-dom | ^18.3.0  | React DOM types |

### Linting & Formatting

| Package                          | Version | Purpose                 |
| -------------------------------- | ------- | ----------------------- |
| eslint                           | ^9.5.0  | JavaScript linter       |
| @typescript-eslint/parser        | ^7.11.0 | TS parser for ESLint    |
| @typescript-eslint/eslint-plugin | ^7.11.0 | TS rules for ESLint     |
| eslint-plugin-react              | ^7.34.2 | React rules             |
| eslint-plugin-react-hooks        | ^4.6.0  | React Hooks rules       |
| eslint-plugin-jsx-a11y           | ^6.8.0  | JSX accessibility rules |
| prettier                         | ^3.3.0  | Code formatter          |
| stylelint                        | ^16.6.0 | CSS/SCSS linter         |
| stylelint-config-standard-scss   | ^13.1.0 | SCSS config             |

### Styling

| Package       | Version  | Purpose             |
| ------------- | -------- | ------------------- |
| sass-embedded | ^1.77.6  | SCSS compiler       |
| postcss       | ^8.4.38  | CSS transformations |
| autoprefixer  | ^10.4.19 | Browser prefixes    |

### Testing

| Package                     | Version | Purpose                     |
| --------------------------- | ------- | --------------------------- |
| vitest                      | ^1.6.0  | Unit test runner            |
| @vitest/ui                  | ^1.6.0  | Vitest UI (optional)        |
| jsdom                       | ^24.1.0 | DOM implementation          |
| @testing-library/react      | ^15.0.7 | React component testing     |
| @testing-library/jest-dom   | ^6.4.2  | Custom matchers             |
| @testing-library/user-event | ^14.5.2 | User interaction simulation |
| playwright                  | ^1.45.0 | E2E testing                 |
| @axe-core/playwright        | ^4.8.24 | Accessibility scanning      |

### Mocking

| Package | Version | Purpose             |
| ------- | ------- | ------------------- |
| msw     | ^2.2.8  | Mock Service Worker |

## Node & npm Policy

- **Node.js**: 24.x (see [.nvmrc](../../.nvmrc))
- **npm**: 11.6.0 (locked via `packageManager` in package.json)
- **Installation**: `npm ci` (deterministic, lockfile-based)

## Compatibility Notes

All dependencies use caret ranges (`^`) to allow patch updates while preventing breaking changes. Production build validates that no unexpected packages are present.

## Version Rationale

### React 18.3.1

Latest stable minor version. Supports Strict Mode, Suspense, Concurrent features. SSR ready if needed later.

### React Router 6.26.0

Latest stable release. Supports data loaders, actions, nested routes. Ready for M1 composition.

### TanStack Query 5.51.1

Latest stable v5. Replaces older React Query naming. DevTools available if needed.

### Zod 3.23.8

Latest stable. Strong TypeScript integration, suitable for forms/validation in M1+.

### Vite 5.2.11

Latest stable. Excellent React support via plugin. Fast dev server, optimized build.

### TypeScript 5.4.5

Latest stable. Const type parameters, const assertions, strictest mode support.

### Vitest 1.6.0

Latest stable. Full Vite integration, ESM support, parallel execution.

### Playwright 1.45.0

Latest stable. Excellent Chromium support, Inspector mode, automatic waiting.

### ESLint 9.5.0

Latest stable with flat config. No legacy .eslintrc.

All versions tested for compatibility with GoodCall M0 bootstrap requirements.

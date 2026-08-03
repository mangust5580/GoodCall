# Tooling Versions

## Production Dependencies

| Package               | Version  | Purpose               |
| --------------------- | -------- | --------------------- |
| react                 | ^19.2.8  | UI library            |
| react-dom             | ^19.2.8  | DOM rendering         |
| react-router-dom      | ^7.18.2  | Routing               |
| @tanstack/react-query | ^5.101.4 | Data fetching / cache |
| zod                   | ^4.4.3   | Schema validation     |

## Development Dependencies

### Core Build Tools

| Package              | Version | Purpose               |
| -------------------- | ------- | --------------------- |
| vite                 | ^8.2.0  | Build tool            |
| @vitejs/plugin-react | ^6.0.5  | React plugin for Vite |
| typescript           | ^6.0.3  | Type checking         |

### Node/Type Definitions

| Package          | Version  | Purpose         |
| ---------------- | -------- | --------------- |
| @types/node      | ^24.13.3 | Node.js types   |
| @types/react     | ^19.2.18 | React types     |
| @types/react-dom | ^19.2.4  | React DOM types |

### Linting & Formatting

| Package                          | Version  | Purpose                 |
| -------------------------------- | -------- | ----------------------- |
| eslint                           | ^9.39.5  | JavaScript linter       |
| @typescript-eslint/parser        | ^8.65.0  | TS parser for ESLint    |
| @typescript-eslint/eslint-plugin | ^8.65.0  | TS rules for ESLint     |
| eslint-plugin-react              | ^7.37.2  | React rules             |
| eslint-plugin-react-hooks        | ^5.1.0   | React Hooks rules       |
| eslint-plugin-jsx-a11y           | ^6.10.2  | JSX accessibility rules |
| prettier                         | ^3.4.2   | Code formatter          |
| stylelint                        | ^16.12.0 | CSS/SCSS linter         |
| stylelint-config-standard-scss   | ^13.1.0  | SCSS config             |

### Styling

| Package       | Version  | Purpose             |
| ------------- | -------- | ------------------- |
| sass-embedded | ^1.83.0  | SCSS compiler       |
| postcss       | ^8.4.49  | CSS transformations |
| autoprefixer  | ^10.4.20 | Browser prefixes    |

### Testing

| Package                     | Version | Purpose                     |
| --------------------------- | ------- | --------------------------- |
| vitest                      | ^4.1.10 | Unit test runner            |
| jsdom                       | ^29.1.1 | DOM implementation          |
| @testing-library/react      | ^16.3.2 | React component testing     |
| @testing-library/jest-dom   | ^6.8.1  | Custom matchers             |
| @testing-library/user-event | ^14.5.2 | User interaction simulation |
| @playwright/test            | ^1.62.1 | E2E testing                 |
| @axe-core/playwright        | ^4.12.1 | Accessibility scanning      |

### Mocking

| Package | Version | Purpose             |
| ------- | ------- | ------------------- |
| msw     | ^2.15.0 | Mock Service Worker |

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

# GoodCall

A React SPA built with TypeScript, Vite, and comprehensive testing infrastructure.

## Requirements

- **Node.js**: 24.x (see [.nvmrc](.nvmrc))
- **npm**: 11.6.0+

Verify your environment:

```bash
node --version  # Should be v24.x.x
npm --version   # Should be 11.6.0+
```

## Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Install Playwright browsers (required for E2E tests):

   ```bash
   npx playwright install --with-deps chromium
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser.

## Available Scripts

### Development & Building

- `npm run dev` — Start development server
- `npm run build` — Build for production to `/GoodCall/`
- `npm run preview` — Preview production build locally at http://localhost:4173/GoodCall/

### Quality Checks

- `npm run typecheck` — Type check with TypeScript
- `npm run lint` — Run ESLint
- `npm run lint:styles` — Run Stylelint
- `npm run format` — Format code with Prettier
- `npm run format:check` — Check formatting without changes
- `npm run check:comments` — Check for authored comments in code
- `npm run check` — Run typecheck, lint, format check, and comment check
- `npm run check:full` — Complete serverless check suite including typecheck, lint, tests, and build

### Testing

- `npm test` — Run unit/component tests
- `npm run test:watch` — Run tests in watch mode
- **E2E testing (local)**: Start preview server first, then run E2E:
  ```bash
  npm run preview          # Start preview server (terminal 1)
  npm run test:e2e         # Run E2E tests (terminal 2)
  ```
- **E2E testing (CI)**: Automated in GitHub Actions, server lifecycle managed by Playwright

### Build Artifacts

- `npm run prepare:pages` — Prepare GitHub Pages artifacts (404.html, .nojekyll)
- `npm run report:sizes` — Report bundle sizes
- `npm run validate:build` — Validate production build

## Architecture Zones

```
src/
  app/                   # Application root and composition
    bootstrap.tsx        # Bootstrap function, MSW startup
    App.tsx              # Root component with providers and router
    config/              # Configuration (base path, constants)
      public-config.ts   # Validated public config with Zod
    composition/         # Application composition (router, query client)
      create-query-client.ts
      create-runtime.ts  # Data Router creation
    providers/           # Context/provider setup
    routing/             # React Router configuration and registry
      registry.ts        # Route metadata and validation
      loaders.ts         # Route param validation
    shell/               # Root layout and error boundaries
  routes/                # Route modules
    home/                # Home route
    catalog/             # Catalog routes
    commerce/            # Commerce routes
    error/               # Error routes
  shared/                # Reusable shared components
    ui/                  # UI components
  styles/                # Global styles
    foundations/         # Reset, typography, color, accessibility
    tools/               # Mixins and utilities
  mocks/                 # MSW mock setup
tests/                   # Tests
  e2e/                   # Playwright E2E tests
  support/               # Test utilities
.github/
  workflows/             # CI/CD workflows
scripts/                 # Build/deployment scripts
```

## GitHub Pages Deployment

### Base Path

The application is deployed to GitHub Pages under `/GoodCall/`. Single source of truth:

- `build-config.mjs` — `production.base = '/GoodCall/'`
- `vite.config.ts` — imports `BUILD_CONFIG` and applies base during build
- `playwright.config.ts` — imports `BUILD_CONFIG` for preview URL
- `src/app/routing/index.tsx` — uses `import.meta.env.BASE_URL` for React Router `basename`
- Runtime uses `import.meta.env.BASE_URL` for fallback validation

All internal links and asset URLs are automatically handled through the `APP_BASE_PATH` constant.

### Deploying

Deployment is **manual only** via GitHub Actions:

1. Go to **Actions** > **Deploy to GitHub Pages**
2. Click **Run workflow** > **Run workflow**
3. Wait for the workflow to complete
4. Verify at https://github.com/mangust5580/GoodCall/settings/pages

The workflow:

- Builds the application with `--base=/GoodCall/`
- Validates the build output
- Prepares GitHub Pages artifacts (404.html, .nojekyll)
- Deploys to GitHub Pages

**Note**: The deploy workflow does not run automatically on push. It must be triggered manually from the Actions tab.

## Development Notes

### Agent and Code Policies

**Read [AGENTS.md](./AGENTS.md)** for policies on:

- No authored comments in code (enforced by `npm run check:comments`)
- Local server management (developers only)
- E2E testing workflow

**Why no comments?** Code intent should be clear from names, types, and function boundaries. Non-obvious "why" goes in commit messages.

### TypeScript

Strict mode is enabled with:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitOverride: true`
- `useUnknownInCatchVariables: true`

No suppression comments allowed without escalation.

### Styling

- **SCSS Modules**: Component-scoped styles (`.module.scss`)
- **Global foundations**: `src/styles/foundations/` (Sass module system, no legacy @import)
  - **Primitives** (_primitives.scss): Neutral colors, technical accent, spacing, motion
  - **Semantic tokens** (_semantic.scss): CSS custom properties with `--gc-` prefix
  - **Breakpoints** (_breakpoints.scss): Compile-time Sass values (48rem, 64rem, 80rem)
  - **Reset** (_reset.scss): Border-box, inherited fonts, semantic HTML preservation
  - **Document** (_document.scss): Light-only theme baseline (no dark mode)
  - **Typography** (_typography.scss): Semantic typography roles (body, headings)
  - **Accessibility** (_accessibility.scss): Focus management, motion, forced-colors support

For details, see [M2A Foundations Report](docs/05-implementation/m2-foundations-report.md).

### Testing

- **Unit/Component**: Vitest + React Testing Library
- **E2E**: Playwright with axe accessibility scanning
- **Accessibility**: All tests include accessible queries (role, label, text)

### MSW (Mock Service Worker)

MSW is configured for development/testing only:

- Starts only in development (`import.meta.env.DEV`)
- Worker script is **not** included in production builds
- Validated by build artifact checker

## Routing Architecture

M1 uses React Router 7 Data Router with:

- Explicit route registry with metadata (title, access, lazy flag)
- Routing-owned lifecycle for document titles, focus, and scroll management
- Representative lazy-loaded routes (Home, Category, Product, Cart, 404)
- Param validation with Zod
- Error boundary hierarchy (root, catalog-family, catch-all)
- Accessible routing with skip link and live region announcements

For details, see [M1 Routing Report](docs/05-implementation/m1-routing-report.md).

## See Also

- [M0 Bootstrap Implementation Report](docs/05-implementation/bootstrap-report.md)
- [M1 Routing Report](docs/05-implementation/m1-routing-report.md)
- [M2A Foundations Report](docs/05-implementation/m2-foundations-report.md)
- [M2A Asset Intake Handoff](docs/05-implementation/m2-asset-intake.md)
- [Repository State](docs/05-implementation/repository-state.md)
- [Tooling Versions](docs/05-implementation/tooling-versions.md)

For architecture and design contracts, see the canonical project documents in `/docs` (added in later milestones).

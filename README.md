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

2. Start development server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser.

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
- `npm run check` — Run typecheck, lint, and format check
- `npm run check:full` — Complete check suite including tests and build

### Testing

- `npm test` — Run unit/component tests
- `npm run test:watch` — Run tests in watch mode
- `npm run test:e2e` — Run end-to-end tests with Playwright

### Build Artifacts

- `npm run prepare:pages` — Prepare GitHub Pages artifacts (404.html, .nojekyll)
- `npm run report:sizes` — Report bundle sizes
- `npm run validate:build` — Validate production build

## Architecture Zones

```
src/
  app/           # Application root and composition
    config/      # Configuration (base path, constants)
    providers/   # Context/provider setup
    routing/     # React Router configuration
    shell/       # Root shell component and pages
  shared/        # Reusable shared components
    ui/          # UI components
  styles/        # Global styles
    foundations/ # Reset, typography, color, accessibility
    tools/       # Mixins and utilities
  mocks/         # MSW mock setup
tests/           # Tests
  e2e/           # Playwright E2E tests
  support/       # Test utilities
.github/
  workflows/     # CI/CD workflows
scripts/         # Build/deployment scripts
```

## GitHub Pages Deployment

### Base Path

The application is deployed to GitHub Pages under `/GoodCall/`. This is configured in:

- `vite.config.ts` — `build.base`
- `playwright.config.ts` — `webServer.baseURL`
- `src/app/config/base.ts` — `APP_BASE_PATH`

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
- **Global foundations**: `src/styles/foundations/`
  - Reset, typography, color, accessibility

### Testing

- **Unit/Component**: Vitest + React Testing Library
- **E2E**: Playwright with axe accessibility scanning
- **Accessibility**: All tests include accessible queries (role, label, text)

### MSW (Mock Service Worker)

MSW is configured for development/testing only:

- Starts only in development (`import.meta.env.DEV`)
- Worker script is **not** included in production builds
- Validated by build artifact checker

## See Also

- [M0 Bootstrap Implementation Report](docs/05-implementation/bootstrap-report.md)
- [Repository State](docs/05-implementation/repository-state.md)
- [Tooling Versions](docs/05-implementation/tooling-versions.md)

For architecture and design contracts, see the canonical project documents in `/docs` (added in later milestones).

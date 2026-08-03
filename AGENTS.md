# Agent Policy for GoodCall

This document defines constraints and policies for agents operating within this repository.

## Code Comments

Authored comments are prohibited in production and test code.

**Rule:** Do not add, leave, or generate authored comments in code, configuration, or test files.

**Applies to:** TypeScript, JavaScript, SCSS, CSS, YAML, HTML, and config files.

**Allowed exceptions:**

- License notices required by law (if present in original files)
- Tool directives explicitly required by build/test/lint systems

**Prohibited:**

- Line comments (`// ...`)
- Block comments (`/* ... */`)
- JSDoc comments (`/** ... */`)
- YAML comments (`# ...`)
- HTML comments (`<!-- ... -->`)
- Commented-out code
- TODO/FIXME notes
- TypeScript suppression comments (`@ts-expect-error`, `@ts-ignore`, etc.)

**Enforcement:** `npm run check:comments` scans the repository and exits with code 1 if any authored comments are found. This check is part of CI pipeline and must pass before merge.

**Why:** Comments drift from code and become misleading. Names, types, and function boundaries should make code intent clear. When "why" is non-obvious, commit messages preserve it.

## Local Server Ownership

Only the user (developer) may manage local servers. Agents must never manage server lifecycle.

**Rule:** Do not run commands that start, stop, or manage local servers.

**Prohibited actions:**

- `npm run dev`
- `npm run preview`
- `vite dev` or `vite preview`
- Background/detached processes (using `start`, `start /B`, `nohup`, `&`, PowerShell jobs, etc.)
- Occupying local ports (4173, 5173, 3000, etc.)
- Reusing existing servers without user confirmation

**Why:** Local servers run long and consume system resources. If an agent crashes or hangs with a server running, the user must manually clean up. User has full control of their development environment.

**Allowed in CI only:**

- Playwright's `webServer` configuration controlled by `process.env.CI`
- E2E test server lifecycle management (starts before tests, stops after)
- CI workflows explicitly invoke E2E tests with environment variable set

## Testing Policy

### Local Testing

- Unit and integration tests may run locally without automatic server startup
- Agent may not run Playwright locally if server must be started automatically
- E2E tests require user to manually start preview server first

**How user runs E2E locally:**

```bash
npm run preview  # User runs this
npm run test:e2e # Agent or user can then run this
```

### Continuous Integration

- E2E server lifecycle is owned by CI/Playwright configuration
- Conditional `webServer` in `playwright.config.ts` activates only when `process.env.CI` is true
- CI workflow sets `CI=true` when invoking E2E tests
- Server automatically terminates after test suite completes

## Enforcement Points

1. **Local gates** (`npm run check`, `npm run check:full`):
   - Serverless: typecheck, lint, format check, unit tests, build, build validation, comment check
   - Do not invoke or serve E2E tests
   - Agent must not run these if server would be started

2. **GitHub Actions CI** (`.github/workflows/ci.yml`):
   - Runs `npm run check:full` (serverless)
   - Runs `npm run test:e2e` with `CI=true` environment variable
   - Playwright detects `CI=true` and controls webServer lifecycle
   - Server starts before tests, stops after tests complete

3. **Comment scanner** (`npm run check:comments`):
   - Runs in `npm run check` and `npm run check:full`
   - Part of CI pipeline
   - Must exit code 0 for merge to proceed

## Summary

- Agents do not add comments
- Agents do not manage local servers
- Users control local development lifecycle
- CI controls server lifecycle for E2E tests
- Comment policy is enforced by automated scanner in CI pipeline

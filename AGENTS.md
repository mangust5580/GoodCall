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

Only the user (developer) may manage local servers. Agents must never manage server lifecycle, apart from the two bounded, repository-owned exceptions below.

**Rule:** Do not run commands that start, stop, or manage local servers, except the two commands described in [Bounded Verification Exception](#bounded-verification-exception) and [Bounded Browser Review Exception](#bounded-browser-review-exception).

The two exceptions are distinct and are not interchangeable:

- **`verify:dev-bootstrap`** — directly or through `check:full` — is a **bounded development gate**. It is part of the routine local and CI gate set.
- **`review:m3-browser`** is **explicitly initiated milestone-review tooling**. It is never part of a gate, and it runs only when the user asks for it or approves it.

No other server-bearing command is permitted under either exception.

**Prohibited actions:**

- `npm run dev`
- `npm run preview`
- `vite dev` or `vite preview`
- `npm run test:e2e` and any local production-preview E2E server lifecycle
- Long-lived or interactive local servers
- Background/detached processes (using `start`, `start /B`, `nohup`, `&`, PowerShell jobs, etc.)
- Occupying fixed local ports (4173, 5173, 3000, etc.)
- Reusing existing servers without explicit user confirmation
- Controlling, attaching to, or terminating the user's Chrome/Edge
- Killing processes by broad image or process name (`taskkill /IM`, `Stop-Process -Name`, `pkill`, `killall`)

**Why:** Local servers run long and consume system resources. If an agent crashes or hangs with a server running, the user must manually clean up. User has full control of their development environment.

**Allowed in CI only:**

- Playwright's `webServer` configuration controlled by `process.env.CI`
- E2E test server lifecycle management (starts before tests, stops after)
- CI workflows explicitly invoke E2E tests with environment variable set

## Bounded Verification Exception

This is the first of the two exceptions. One repository-owned verifier is exempt from the rule above, because it is finite, self-cleaning and owns every resource it creates.

**Scope of the exception — exactly two invocations:**

- `npm run verify:dev-bootstrap`
- `npm run check:full`, which runs the same verifier indirectly

Nothing else is covered. The exception grants no general permission to start servers.

**The verifier qualifies only while it satisfies all of the following:**

- one foreground-owned Node process
- Vite Node API (`createServer`), not a CLI dev server
- dynamically selected loopback port, never a fixed one
- `open: false`
- isolated headless Playwright Chromium
- no existing browser profile
- no attachment to the user's browser
- no detached or background process
- cleanup in `finally`
- Playwright context, Playwright browser and Vite server all closed
- port release verified after shutdown
- no process-name kill
- no user browser termination

**If any of these constraints stops holding, the verifier falls outside the exception and agents must not run it.** Re-establish the constraints or hand the run back to the user.

**Why:** the development entry point cannot be verified without loading it in a browser, and no other gate does so. A bounded, self-cleaning verifier closes that hole without giving up user ownership of ordinary server lifecycle.

## Bounded Browser Review Exception

This is the second of the two exceptions. A repository-owned command is exempt on the same bounded terms plus one addition: it may open a **headed** browser window, but only for an explicit user sign-off phase.

**Scope of the exception — one invocation:**

- `npm run review:m3-browser`, with or without `-- --automated-only`

This is **milestone-review tooling**. It is deliberately **not** part of `npm run check`, not part of `npm run check:full`, not a CI gate and not part of any deployment workflow.

**The command is allowed for agents only while it satisfies all of the following:**

- one foreground-owned Node process
- Vite Node API (`createServer`), not a CLI dev server
- dynamically selected loopback port, never a fixed one
- `open: false`
- no detached or background process
- isolated Playwright browser profile — no persistent context, no existing user profile
- no connection to an existing Chrome/Edge
- no remote-debugging attachment
- no termination of any user browser process
- automated phase may use headless Chromium
- interactive sign-off phase may use exactly one harness-owned headed Chromium window
- the user explicitly initiates the command, or explicitly approves running it
- cleanup in `finally`
- context, browser and Vite server closed **independently**, so one failure cannot skip the rest
- port release verified after cleanup
- a cleanup failure makes the command fail
- no process-name kill, no broad Node kill, no browser-image kill
- artifacts written only under the ignored `artifacts/` directory

**If any of these constraints regresses, agents must not run it.**

`npm run dev`, `npm run preview`, local E2E and every other local server remain user-owned and prohibited.

## Testing Policy

### Local Testing

- Unit and integration tests may run locally without automatic server startup
- Agent may not run the Playwright E2E suite locally, because it requires a preview server the user owns
- `verify:dev-bootstrap` is the one exception: it drives Playwright against its own bounded dev server — see [Bounded Verification Exception](#bounded-verification-exception)
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

1. **Local gates**:
   - `npm run check` is **serverless**: typecheck, lint, stylelint, format check, comment check
   - `npm run check:full` adds unit tests, `verify:dev-bootstrap`, build and build validation. It is **not** serverless — it runs the bounded verifier — and agents **may** run it under the [Bounded Verification Exception](#bounded-verification-exception)
   - Neither gate runs the production-preview E2E suite
   - Ordinary local E2E still requires a user-owned preview server

2. **GitHub Actions CI** (`.github/workflows/ci.yml`):
   - Does **not** invoke `npm run check:full`. It runs dedicated steps: Dev bootstrap, TypeCheck, Lint, Lint styles, Format check, Comment check, Unit tests, Build, Validate build, E2E tests
   - The `Dev bootstrap` step runs `npm run verify:dev-bootstrap`, which owns and releases its own server and browser
   - `npm run test:e2e` runs with `CI=true`
   - Playwright detects `CI=true` and owns the production-preview server for the E2E step only
   - That server starts before tests and stops after tests complete

3. **Comment scanner** (`npm run check:comments`):
   - Runs in `npm run check` and `npm run check:full`
   - Part of CI pipeline
   - Must exit code 0 for merge to proceed

## Summary

- Agents do not add comments
- Agents do not manage local servers, apart from two narrowly bounded, repository-owned commands
- `npm run verify:dev-bootstrap` — directly or through `npm run check:full` — is the gate an agent may run, and only while it meets every constraint listed above
- `npm run review:m3-browser` is milestone-review tooling an agent may run on the same terms, plus a headed window for explicit user sign-off only. It is not part of `check`, `check:full` or CI
- Users control local development lifecycle: `dev`, `preview` and local E2E remain theirs
- CI controls server lifecycle for E2E tests
- Comment policy is enforced by automated scanner in CI pipeline

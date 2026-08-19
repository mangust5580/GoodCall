# AGENTS.md

Canonical agent policy for the GoodCall repository. This file wins if any other
repository document conflicts with it.

GoodCall is a visual-first React SPA. Development order is:

> visual reference → Foundations → Components → Global Shell → Home → Catalog →
> Product Details → Cart → Checkout → Order Confirmation → remaining route families

## Startup

Before starting any task:

1. Read `AGENTS.md`.
2. Read `docs/current-state.md`.
3. Read the explicit task prompt.
4. Inspect branch, `HEAD`, and the working tree.
5. Read only the repository sources relevant to the task.

Stop and report instead of changing files when you find:

- an unexpected branch;
- a dirty tracked tree, unless the task explicitly allows it;
- a conflict between the task and existing sources;
- unclear destructive scope.

## Scope

- Perform only the explicit bounded task.
- Do not expand architecture speculatively.
- Do not add dependencies without a concrete requirement.
- Do not rewrite unrelated code.
- Do not port `GoodCall-old` wholesale.

Directories, route families, and abstractions are created when a task needs them,
not in anticipation of one.

## Source priority

When sources conflict, trust them in this order:

1. reviewed current code;
2. current repository docs;
3. the explicit current task;
4. project sources / current design decisions;
5. raster evidence;
6. `GoodCall-old` (advisory reference only);
7. historical chat.

## Engineering style

Prefer clear names, small APIs, predictable ownership, minimal hidden magic, and
no speculative abstractions.

Do not weaken types, accessibility, or relevant checks merely for brevity. If a
rule does not apply, configure it intentionally and say why — do not disable
linting broadly.

Specific standing constraints:

- Lengths are authored in `px` and never in hand-written `rem`. See the Styling
  contract section below for the full rule.
- The GitHub Pages base path lives only in `vite.config.ts`. Application code
  reads `import.meta.env.BASE_URL`; it never repeats the repository name.
- Authored code carries no comments. See the No comments section below.

## No comments

Authored project source, config, style and workflow files carry **no comments**.

Never add line comments, block comments, JSDoc/TSDoc, JSX/HTML comments,
Sass/CSS comments, YAML comments, or explanatory comments in config files. Never
use a comment for a TODO, intent note, architecture explanation, workaround, or
lint/type suppression.

Code communicates through naming, structure and types. Rationale belongs in the
operational Markdown documentation, which this rule does not govern: `README.md`,
`AGENTS.md`, `CLAUDE.md`, `docs/**/*.md` and `AUDIT.md`.

Governed files: `src/**/*.{ts,tsx,js,jsx,scss,css}`, root authored JS/TS config,
HTML source, `.github/workflows/*.{yml,yaml}`, and other authored config such as
`.gitignore` and `.gitattributes`.

Not governed, and never edited merely to remove comments: generated or
third-party content — `node_modules/`, `dist/`, lockfiles, and any vendored
files.

A shebang is an interpreter directive, not a comment, and may remain. Text that
merely looks like a comment inside a string, URL, regex, glob, colour value or
Sass interpolation is not a comment and must be left intact.

If a functional suppression directive — `eslint-disable`, `stylelint-disable`,
`@ts-ignore`, `@ts-expect-error`, a coverage-ignore — appears necessary, correct
the underlying code or config so it is not needed. If that would require a
material unrelated refactor, stop and report the blocker rather than leaving the
directive in place.

## System-first design

Raster evidence defines visual intent, component coverage and meaningful
distinctions. Reviewed Foundations and already-established system rules win over
incidental raster differences. Normalize visually similar cases into the smallest
coherent system. Do not introduce one-off tokens, sizes or variants solely for
pixel matching.

Priority for design implementation:

1. reviewed current repository system;
2. accepted Foundations;
3. established reusable Components;
4. new raster evidence;
5. local one-off decisions, only where a real semantic distinction requires them.

This does not permit ignoring raster direction. It means normalizing accidental
or near-duplicate visual differences instead of encoding them as separate APIs.
Where a raster shows a slightly different colour with no semantic distinction,
use the accepted Foundations role.

Accessibility, responsive correctness and maintainability rank above literal
raster copying. Record every deliberate normalization in the task's `AUDIT.md`.

## Raster references

Raster design evidence lives outside the repository at:

`E:\Work\Frontend\Pictures\GoodCall-references`

It is read-only evidence. Read the raster a task names, and nothing else. Do not
copy the archive, or any raster from it, into the repository.

## Local environment

The user owns the ordinary local dev-server and browser lifecycle. Agents should
not start long-lived dev servers, leave background processes running, or drive
the user's browser unless a task explicitly asks.

Finite repository-owned checks that terminate normally are always allowed:

```
npm run typecheck
npm run lint
npm run lint:styles
npm run format:check
npm run build
```

## Completion report

Implementation tasks report:

- changed;
- intentionally not changed;
- checks run and their results;
- visual evidence, when relevant;
- remaining deviations;
- docs updated;
- next step.

Keep `docs/current-state.md` accurate as an operational handoff. Do not turn it
into a commit log, and do not introduce mandatory independent audit ceremony or
exact-SHA independent audits after every small change.

## AUDIT.md — mandatory task handoff

**Every** explicit Claude Code or Codex bounded task must finish by fully
overwriting `AUDIT.md` in the repository root. This applies to implementation,
publish, maintenance, review, correction and audit tasks alike.

`AUDIT.md` is the current attachable task handoff, not historical documentation.

- Never append. Never archive old copies. Never commit it.
- It stays `/AUDIT.md` in `.gitignore`, local-only.
- Write it **last** — after final checks, commit, push and remote verification —
  so it reflects the true final state.
- If the task stops on a blocker or failure, still overwrite it before exiting,
  recording the blocker and whatever evidence was completed.
- Terminal/chat output may stay concise, because this file is the reliable
  handoff channel.

Ordinary implementation and maintenance tasks record at least: task title/type;
date; repository; branch and final `HEAD`; scope; changed; intentionally not
changed; dependencies changed, if any; checks and results; commit/push/CI state
when applicable; remaining issues/blockers; next step.

Explicit **audit** tasks additionally record: auditor; evidence reviewed;
findings with severity; unresolved issues; final verdict.

Writing the handoff file is mandatory. An independent audit is not — do not
invent audit ceremony for tasks that were not asked to be audited.

## Styling contract

Lengths in SCSS source are authored in **px**. This includes font sizes,
spacing, gaps, padding, margins, fixed widths and heights, radii, icon sizes,
offsets, borders and breakpoint values.

**Never hand-author `rem` in SCSS.** `rem` is a compiled-CSS output concern owned
by the single `postcss-pxtorem` boundary in `postcss.config.js`. Stylelint's
`unit-disallowed-list` enforces this.

The flow is: SCSS authored in px → Sass → CSS in px → postcss-pxtorem →
production CSS in rem. Do not add Sass `px-to-rem()` functions, rem tokens, or
any second conversion path.

Semantic exceptions — use the unit that carries the intended CSS meaning, and do
not flatten it to px for uniformity: `%`; viewport units (`dvh`, `svh`, `lvh`,
`vw`, `vh`); container query units; `fr`; angles (`deg`); time (`ms`, `s`); and
unitless values where CSS expects them (`line-height`, `opacity`, `z-index`,
flex factors).

- Intentional 1px hairlines stay 1px (`minPixelValue: 2`).
- Media queries keep px bounds (`mediaQuery: false`). This is intentional.

### Helpers

`src/styles/helpers/` is the generic helper layer, consumed through its entry
point: `@use '../helpers' as h;` — never via deep partial imports.

Fluid scalars take **unitless px numbers**: `font-size: h.fluid(18, 14)` is 18px
at the wide end and 14px at the narrow end. Unit-bearing input is rejected at
compile time. Use `h.fluid-between($desktop, $mobile, $from, $to)` for an
explicit range. Default range: 320 → 1280.

Use fluid interpolation only for scalars that should genuinely interpolate. It is
not a way to avoid media queries for structural layout changes that need discrete
responsive behaviour.

Media mixins are `h.media-up`, `h.media-max` and `h.media-range`, taking a px
length such as `768px`. Named breakpoints are deferred until Foundations defines
them from raster evidence.

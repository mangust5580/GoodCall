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

- Design measurements are authored in `px`. One PostCSS boundary
  (`postcss.config.js`) converts them to `rem` against a 16px root. Intentional
  1px hairlines stay 1px. Semantic relative units are never rewritten.
- The GitHub Pages base path lives only in `vite.config.ts`. Application code
  reads `import.meta.env.BASE_URL`; it never repeats the repository name.

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
into a commit log, and do not introduce mandatory `AUDIT.md` ceremony or
exact-SHA independent audits after every small change.

## Audits

Audits are not mandatory after every task, and no agent should invent one.

When an explicit Claude Code or Codex audit **is** requested:

- Write the complete result to `AUDIT.md` in the repository root.
- Fully overwrite the previous `AUDIT.md`. It is a current handoff artifact, not
  history — never append, and never keep an archive of past audits.
- Include, when applicable: auditor; audit scope; branch and `HEAD`; checks and
  evidence reviewed; findings with severity; unresolved issues; final verdict.
- Also return a concise terminal/chat summary. `AUDIT.md` remains the canonical
  attachable audit output.

`AUDIT.md` is local-only and gitignored (`/AUDIT.md`), so audit results stay easy
to attach elsewhere without accumulating audit history in Git. Do not commit it,
and do not build any `AUDIT.md` lifecycle beyond explicit audit tasks.

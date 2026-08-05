# M3 Shared UI Report

## Status

| Task                                                                  | Status                                                                                                   |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| M3-01 — Shared UI scaffold, layout and accessibility utilities        | **APPROVED AND CLOSED**                                                                                  |
| M3-01A — VisuallyHidden accessibility contract correction             | **APPROVED AND CLOSED**                                                                                  |
| M3-02 / M3-02A / M3-02B — Semantic action primitives                  | **APPROVED AND CLOSED**                                                                                  |
| M3-03 / M3-03A — Native form controls baseline                        | **APPROVED AND CLOSED**                                                                                  |
| M3-03B — Shared UI directory organization                             | **APPROVED AND CLOSED**                                                                                  |
| M3-04 — Feedback, status and validation-summary primitives            | **APPROVED AND CLOSED**                                                                                  |
| M3-05 — Shared UI runtime integration                                 | **IMPLEMENTED — CORRECTIVE TEST PASS APPLIED — AWAITING INDEPENDENT AUDIT, CI, AND USER BROWSER REVIEW** |
| M3-05A — Shell-aware announcement ownership correction                | **APPROVED AND CLOSED**                                                                                  |
| M3-05B — Dev MSW bootstrap restoration                                | **APPROVED AND CLOSED** with M3-05C                                                                      |
| M3-05C — Agent policy, artifact and verifier lifecycle reconciliation | **APPROVED AND CLOSED**                                                                                  |
| M3-05D — Bounded browser review harness                               | **IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**                                                      |

This report covers the Shared UI layer of milestone M3. It records local verification for the tasks under review. M3-01 through M3-04 are approved and closed; M3-05 and its corrective passes are recorded in their own sections below, and M3 as a whole is not closed.

### M3-01 / M3-01A closure evidence

| Item               | Value                                                            |
| ------------------ | ---------------------------------------------------------------- |
| Corrective commit  | `6676bbbe113778894b2787ddb0f6edb62da9148c`                       |
| Independent audit  | APPROVED                                                         |
| GitHub Actions run | 30905356122 (`CI`, run #22)                                      |
| Run URL            | https://github.com/mangust5580/GoodCall/actions/runs/30905356122 |
| Job                | 91979053539 — `test (24.x)`                                      |
| Conclusion         | success — all 14 steps green, including `E2E tests`              |

M3-02 was started only after both conditions were satisfied.

### M3-02 closure evidence

| Item               | Value                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Final commit       | `9218c551be461b1defc572ec73f798a7de412b55` (M3-02B)                                                                                            |
| Independent audit  | APPROVED                                                                                                                                       |
| GitHub Actions run | 30910895790                                                                                                                                    |
| Run URL            | https://github.com/mangust5580/GoodCall/actions/runs/30910895790                                                                               |
| Job                | 91997101660 — `test (24.x)`                                                                                                                    |
| Conclusion         | success                                                                                                                                        |
| CI scope           | TypeCheck, ESLint, Stylelint, Prettier, comment check, 234 unit/integration tests, production build, build validation, 17 Playwright E2E tests |

M3-03 was started only after that closure was confirmed.

### M3-03 closure evidence

| Item               | Value                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Final commit       | `dcbbdbdc468df3e890d9de6a1910e991608b8684` (M3-03A)                                                                                            |
| Independent audit  | APPROVED                                                                                                                                       |
| GitHub Actions run | 30917346647                                                                                                                                    |
| Run URL            | https://github.com/mangust5580/GoodCall/actions/runs/30917346647                                                                               |
| Job                | 92018726914 — `test (24.x)`                                                                                                                    |
| Conclusion         | success                                                                                                                                        |
| CI scope           | TypeCheck, ESLint, Stylelint, Prettier, comment check, 422 unit/integration tests, production build, build validation, 17 Playwright E2E tests |

M3-03B was started only after that closure was confirmed.

### M3-03B closure evidence

| Item               | Value                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Final commit       | `f65625586f768250e3ede3b1de55c29941fe81f4`                                                                                                     |
| Independent audit  | APPROVED                                                                                                                                       |
| GitHub Actions run | 30919329440                                                                                                                                    |
| Run URL            | https://github.com/mangust5580/GoodCall/actions/runs/30919329440                                                                               |
| Job                | 92025499981 — `test (24.x)`                                                                                                                    |
| Conclusion         | success                                                                                                                                        |
| CI scope           | TypeCheck, ESLint, Stylelint, Prettier, comment check, 422 unit/integration tests, production build, build validation, 17 Playwright E2E tests |
| Bundle baseline    | raw 371.38 KB, gzip 114.00 KB                                                                                                                  |

M3-04 was started only after that closure was confirmed.

### M3-04 closure evidence

| Item               | Value                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Final commit       | `9ce8794b3e21117a694fc269f2d36cc6668665c8`                                                                                                                 |
| Independent audit  | APPROVED                                                                                                                                                   |
| GitHub Actions run | 30923398657                                                                                                                                                |
| Run URL            | https://github.com/mangust5580/GoodCall/actions/runs/30923398657                                                                                           |
| Job                | 92039458396 — `test (24.x)`                                                                                                                                |
| Conclusion         | success                                                                                                                                                    |
| CI scope           | TypeCheck, ESLint, Stylelint, Prettier, comment check, 504 unit/integration tests in 35 files, production build, build validation, 17 Playwright E2E tests |
| Bundle baseline    | raw 371.38 KB, gzip 114.00 KB                                                                                                                              |

M3-05 was started only after that closure was confirmed.

## M3-01 Scope

M3-01 creates the Shared UI public boundary and the four smallest reusable layout and accessibility primitives. It contains no business logic, no canonical shell work, no production asset consumption and no final visual-system decision.

`src/shared/ui` was an approved architecture zone with no implementation. It now has a curated public entry point and four primitives that M4 and later domain milestones can compose.

## Implemented Component Registry

| Component        | Responsibility                                        | Default root | Public types                                                       |
| ---------------- | ----------------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| `PageContainer`  | Content/readable width constraint, responsive gutters | `div`        | `PageContainerProps`, `PageContainerElement`, `PageContainerWidth` |
| `Stack`          | One-dimensional flow and spacing                      | `div`        | `StackProps`, `StackElement`, `StackDirection`, `StackAlign`       |
| `Grid`           | Intrinsic responsive grid                             | `div`        | `GridProps`, `GridElement`, `GridMinItemWidth`                     |
| `VisuallyHidden` | Visual hiding without accessibility-tree removal      | `span`       | `VisuallyHiddenProps`, `VisuallyHiddenElement`                     |

Shared type: `SpacingScale` = `'xs' | 'sm' | 'md' | 'lg' | 'xl'`, mapped one-to-one onto the existing `--gc-spacing-*` semantic tokens.

## Public API Summary

The single public entry point is `src/shared/ui/index.ts`. It uses explicit named exports only — no `export *`, no re-export of implementation modules. Consumers import from `@/shared/ui` and never need a deep import.

M3-01 contributed four runtime exports — `Grid`, `PageContainer`, `Stack`, `VisuallyHidden`. M3-02 added three action primitives and M3-03 added six form controls; the current full list is in [M3-03 runtime exports](#runtime-exports-1). `class-names.ts`, `action-variant.ts`, `forwarded-props.ts`, `FieldShell`, `field-association.ts`, `field-props.ts`, `_action-base.scss` and `_field-base.scss` are internal and deliberately unexported.

### Layout prop contract

`PageContainer`, `Stack` and `Grid` extend `Omit<React.HTMLAttributes<HTMLElement>, 'style'>`:

- native attributes, `id`, `role` and `aria-*` pass through to the root
- `className` is supported as a root placement hook and is merged after the component's own classes
- `style` is deliberately omitted so the API cannot accept an arbitrary style map

### VisuallyHidden prop contract

`VisuallyHidden` does **not** share the layout contract. Its whole purpose is to keep content in the accessibility tree while hiding it visually, so its public type additionally removes every prop that would defeat that invariant:

```ts
Omit<React.HTMLAttributes<HTMLElement>, 'style' | 'hidden' | 'aria-hidden' | 'inert' | 'tabIndex'>;
```

`id`, `className`, `role`, `aria-live` and the remaining ARIA and event attributes stay available and typed. See [M3-01A corrective pass](#m3-01a-corrective-pass) for the defect this replaced.

### PageContainer

```tsx
<PageContainer as="section" width="text" className="page-hook">
  …
</PageContainer>
```

- `as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav'` — default `'div'`
- `width?: 'content' | 'text'` — default `'content'`

### Stack

```tsx
<Stack direction="inline" gap="sm" align="center">
  …
</Stack>
```

- `as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav'` — default `'div'`
- `direction?: 'block' | 'inline'` — default `'block'`
- `gap?: SpacingScale` — default `'md'`
- `align?: 'start' | 'center' | 'end' | 'stretch'` — default `'stretch'`

`direction="inline"` always wraps. Non-wrapping inline layout is not offered because it breaks reflow at narrow widths and high zoom.

### Grid

```tsx
<Grid minItemWidth="lg" gap="lg">
  …
</Grid>
```

- `as?: 'div' | 'section'` — default `'div'`
- `gap?: SpacingScale` — default `'md'`
- `minItemWidth?: 'sm' | 'md' | 'lg'` — default `'md'`

Column count is never specified. Tracks resolve from `repeat(auto-fit, minmax(min(<role>, 100%), 1fr))`, so the grid adapts intrinsically and cannot overflow a narrow viewport.

### VisuallyHidden

```tsx
<VisuallyHidden>Loading page</VisuallyHidden>
```

- `as?: 'span' | 'div'` — default `'span'`

There is no `visible` or `hidden` toggle. This is not a general show/hide utility.

`style`, `hidden`, `aria-hidden`, `inert` and `tabIndex` are absent from the public type, so a consumer cannot remove the root or its subtree from the accessibility tree, and cannot make a visually hidden root focusable.

**Intended content.** `VisuallyHidden` is for hidden text and semantic content — a supplementary label, a status string, a heading that structures a region without being shown. Consumers must not place focusable or interactive descendants inside it: it is not a container for hidden buttons, links, inputs or anything else reachable by keyboard navigation. A focusable descendant would create a target a sighted keyboard user can reach but cannot see. This restriction is a documented contract, not a runtime check — the component performs no descendant inspection.

## Semantics and Accessibility Ownership

- All four primitives render a plain element with no implicit role, landmark or heading. A landmark appears only when a consumer explicitly selects `as="main"`, `as="nav"`, `as="header"` or `as="footer"`.
- Children render in source order inside a single root. No primitive reorders, wraps or clones children, so DOM order and focus order always match source order.
- No primitive sets `tabindex`, `hidden`, `aria-hidden`, `inert` or any live-region attribute. Announcement ownership stays with `RootLayout` and is untouched by M3-01.
- `VisuallyHidden` uses the clip technique (`position: absolute`, 1px box, `clip-path: inset(50%)`, `white-space: nowrap`, negative margin). It never uses `display: none`, `visibility: hidden`, the `hidden` attribute or `aria-hidden`, so content stays in the accessibility tree. `white-space: nowrap` keeps long text from reflowing inside the 1px box under zoom, and the technique carries no colour dependency, so forced-colors mode is unaffected.
- Consumer-supplied ARIA attributes are preserved on the root. A consumer may, for example, place `aria-live` on a `VisuallyHidden` root — the primitive does not impose or remove that semantics.

## Styling and Token Boundaries

- Styles are SCSS Modules co-located with each component. There are no global selectors, no `!important` and no `@import`.
- No component reads a private Sass primitive variable. Spacing comes exclusively from the existing `--gc-spacing-*` semantic custom properties.
- No brand token, shadow, radius, typography family or final visual value is introduced. Brand tokens are not applied to any existing technical UI.
- Responsive behaviour is intrinsic. `PageContainer` gutters use `clamp(var(--gc-spacing-md), 4vw, var(--gc-spacing-xl))` and `Grid` uses `auto-fit` tracks, so no primitive contains a page-specific breakpoint or consumes the breakpoint contract.
- Two technical geometry values exist: `PageContainer` max inline sizes of `80rem` (`content`) and `42rem` (`text`), and `Grid` minimum item widths of `12rem` / `16rem` / `22rem`. **These are technical defaults, not canonical design-system values.** They may change when exact design tokens are extracted.

## Tests and Local Checks

Tests live under `tests/shared/ui/`, matching the repository's existing convention that all tests reside in `tests/`.

| File                                            | Coverage                                                                                                                                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/shared/ui/page-container.test.tsx`       | Content rendering, default and selected root element, absence of implicit landmarks/headings, explicit landmark opt-in, attribute and className preservation, child DOM order, every width role |
| `tests/shared/ui/stack.test.tsx`                | Same baseline plus DOM order across both directions and every gap/alignment role                                                                                                                |
| `tests/shared/ui/grid.test.tsx`                 | Same baseline plus every item-width and gap role                                                                                                                                                |
| `tests/shared/ui/visually-hidden.test.tsx`      | Content presence, root elements, absence of `hidden` / `aria-hidden` / `inert` / `tabindex` / inline `style`, nested content still queryable by role, attribute preservation, child DOM order   |
| `tests/shared/ui/visually-hidden-props.test.ts` | Type-level contract: forbidden props are absent from `VisuallyHiddenProps`, preserved props remain available, and the base attribute type still declares the forbidden props                    |
| `tests/shared/ui/public-api.test.ts`            | Public entry point exposes exactly the four approved runtime exports, each a component function                                                                                                 |

Tests assert observable contract only. They query by role, text and consumer-supplied identity, never by generated CSS Module class names, and there are no static markup snapshots.

`visually-hidden-props.test.ts` is compile-time evidence rather than a rendering test. Each assertion resolves a conditional type through `Assert<T extends true>`, so a regression in the public type breaks `npm run typecheck` — the constraint fails before any test runs. The third assertion guards the other two: if a future `@types/react` upgrade removed a forbidden prop from `HTMLAttributes`, the absence checks would pass vacuously, so the file also asserts that the base type still declares all five.

Local results are recorded in the task handoff. Targeted tests, `npm run check`, `npm run check:full` and `git diff --check` all pass. No local server, preview server or Playwright run was performed.

## Explicit Non-Goals

M3-01 deliberately does **not** deliver:

- Button, Link, IconButton or any action primitive
- form controls, feedback, status, overlay or dialog components
- Header, Footer, Information Bar, Catalog Navigation or any canonical shell composition
- a shared Logo component or any runtime import of the six brand SVGs
- domain patterns such as Product Card, Cart Item or Price
- routes, route registry changes or Home placeholder changes
- API, MSW, TanStack Query, persistence or authentication work
- dependency, lockfile, build-config or CI changes
- final design tokens, typography family, icon system or production media

## Known Limitations

- The geometry values listed under styling boundaries are technical, not canonical. M3-01 makes no visual-fidelity claim.
- No primitive is consumed by the running application yet. Integration on the Home placeholder belongs to M3-05.
- `Grid` and `Stack` do not accept list root elements. Applying flex or grid layout to `ul`/`ol` is known to suppress list semantics in some assistive technologies, and M3-01 must not replace semantic list or group elements. List composition remains the consumer's responsibility.
- Element-specific attributes outside `React.HTMLAttributes` (for example `start` on `ol`) are not typed, which is consistent with the narrow root-element allowlists.
- Browser-level evidence — zoom, reflow, forced colors, coarse pointer — is not collected in M3-01. These primitives have no interactive surface; that evidence belongs to the M3-05 integration review.
- The `VisuallyHidden` restriction against focusable descendants is a documented contract only. It is not enforced at runtime or by the type system.

## M3-01A corrective pass

### Finding A11Y-01

The independent audit rejected the original M3-01 commit. `VisuallyHiddenProps` extended `Omit<React.HTMLAttributes<HTMLElement>, 'style'>`, which left `hidden`, `aria-hidden`, `inert` and `tabIndex` in the public type.

Those four props defeat the component's only reason to exist. `hidden`, `aria-hidden` and `inert` remove the root or its subtree from the accessibility tree — precisely what the clip technique is chosen to avoid — and `tabIndex` makes a visually hidden root focusable, producing a keyboard target that a sighted user can reach but cannot see. The API therefore permitted, as ordinary typed usage, exactly the states the component promises to prevent.

The original commit passed CI. That is expected and does not weaken the finding: this is a contract defect in the public type, and no runtime test or lint rule in the pipeline inspects which props a component's type admits.

### Correction

`VisuallyHiddenProps` now removes all five props at the type level:

```ts
Omit<React.HTMLAttributes<HTMLElement>, 'style' | 'hidden' | 'aria-hidden' | 'inert' | 'tabIndex'>;
```

The forbidden keys are written inline at the type so the contract is visible where the props are declared. `id`, `className`, `role`, `aria-live`, the remaining ARIA attributes and the event handlers already present in the base type stay available and typed. There is no `any`, no type assertion, no index signature and no runtime prop filtering — the type is the enforcement.

`tests/shared/ui/visually-hidden-props.test.ts` provides the regression evidence, and the runtime tests additionally assert that a normally used root carries no `inert` attribute and no `tabindex`.

### Boundaries

Runtime behaviour was unchanged: default `span` root, `as` still restricted to `span | div`, content still in the accessibility tree, no attribute set by the component. `PageContainer`, `Stack` and `Grid` were untouched. No dependency, config, route, shell, foundation or brand-asset change.

The corrective commit cannot record its own hash inside this file, since the file is part of that commit. The exact baseline and corrective SHAs are recorded in the M3-01A task handoff and in the closure evidence at the top of this report.

## M3-02 — Semantic action primitives

**Status: APPROVED AND CLOSED** with M3-02A and M3-02B — see [M3-02 closure evidence](#m3-02-closure-evidence).

M3-02 adds three dedicated, native-semantic action siblings. They are ready for M4 and later route and domain milestones, but nothing consumes them yet.

### Component matrix

| Component    | Responsibility                  | Root                             | Default variant | Loading | Disabled |
| ------------ | ------------------------------- | -------------------------------- | --------------- | ------- | -------- |
| `Button`     | User action or form submission  | native `<button>`                | `primary`       | yes     | native   |
| `Link`       | Internal application navigation | React Router `Link` → `<a href>` | `tertiary`      | no      | no       |
| `IconButton` | Icon-only action                | native `<button>`                | `tertiary`      | yes     | native   |

The three are separate components by design. There is no shared polymorphic root, no `as`, no `asChild` and no element-switching prop anywhere in the family.

### Variant family

```ts
type ActionVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
type LinkVariant = 'primary' | 'secondary' | 'tertiary';
```

`Button` and `IconButton` accept all four. `Link` accepts three — there is no destructive navigation, because navigating somewhere is not itself a destructive act. There is no size, full-width, shape, icon-position, elevation or colour prop.

### Public APIs

**Button** — `ButtonProps`

```ts
Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'style' | 'role' | 'tabIndex' | 'aria-disabled' | 'aria-label' | 'aria-labelledby' | 'children'
> & {
  children: React.ReactNode;
  variant?: ActionVariant;
  isLoading?: boolean;
}
```

`children` is required and is the visible label. `type` defaults to `"button"`; `submit` and `reset` pass through. `disabled` is the native attribute.

**Link** — `LinkProps`

```ts
Omit<
  RouterLinkProps,
  'style' | 'role' | 'aria-disabled' | 'aria-label' | 'aria-labelledby' | 'href' | 'children'
> & {
  children: React.ReactNode;
  variant?: LinkVariant;
}
```

`to` and `children` are required. The React Router import lives only in `Link.tsx`; no other Shared UI file depends on the router.

**IconButton** — `IconButtonProps`

```ts
Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'style' | 'role' | 'tabIndex' | 'aria-disabled' | 'aria-label' | 'aria-labelledby' | 'children'
> & {
  label: string;
  children: React.ReactNode;
  variant?: ActionVariant;
  isLoading?: boolean;
}
```

`label` and `children` are both required — `label` is the accessible name, `children` is the decorative visual.

### Runtime exports

After M3-02 `@/shared/ui` exports exactly seven components: `Button`, `Grid`, `IconButton`, `Link`, `PageContainer`, `Stack`, `VisuallyHidden`. `ActionVariant` and `LinkVariant` are type-only exports. `class-names.ts`, `action-variant.ts` and `_action-base.scss` remain internal.

### Semantics ownership

**Type-level omission alone is not enough.** Removing a key with `Omit` constrains the declared props type, but TypeScript does not apply excess-property checking to a JSX spread. A consumer can build an ordinary object carrying `role`, `aria-label` or `aria-busy` and spread it in without a type error. Ownership therefore has to hold at runtime as well — see [M3-02A](#m3-02a--action-semantic-ownership-correction).

Each component enforces ownership in three layers: the forbidden keys are absent from the public type; conflicting keys are stripped from the forwarded object before it reaches the DOM; and the component-owned attributes are applied **after** the spread, so they always win.

- Actions are `<button>`; navigation is `<a href>`. Neither borrows the other's role, and `role="button"` is never applied to a link.
- `aria-busy` is owned by `isLoading` alone. An idle control never carries a forwarded busy state.
- `IconButton`'s `aria-label` is owned by `label` alone.
- `Link`'s `href` is owned by `to` alone, and `tabIndex` is removed so the link cannot be pulled out of the tab order.

### Interactive content integrity

An interactive primitive must stay interactive. The following are removed from all three public types and stripped from the forwarded object — see [M3-02B](#m3-02b--interactive-content-integrity-correction):

- **`hidden`, `aria-hidden`, `inert`** — none of these may be applied to an action root. `hidden` removes the control from the rendered interaction contract entirely; `aria-hidden` leaves a focusable control in the tab order while deleting it from the accessibility tree, so a keyboard user reaches a control a screen reader cannot describe; `inert` introduces an alternative disabled-like state outside the approved native-`disabled` contract, and on `Link` it reinstates exactly the disabled-link simulation the family forbids.
- **`dangerouslySetInnerHTML`** — `children` belong to the component contract. Forwarding raw HTML alongside them throws React's "Can only set one of `children` or `props.dangerouslySetInnerHTML`", and if it did render it would replace the declared visible-label contract and bypass the structural markup the component owns inside its root.

`Link` additionally rejects `aria-busy`: it has no loading or busy state, so accepting the prop and silently discarding it would be a misleading API.

This applies to the **root** only. `IconButton` still sets `aria-hidden="true"` on its own decorative wrapper and on its loading indicator — that is component-owned, deliberate, and unaffected by the consumer-facing prohibition.

- `Button` and `IconButton` cannot be turned into links: `href`, `to` and `as` are absent from their types, and `ButtonHTMLAttributes` never carried them.
- `Link` cannot be turned into a control: `disabled`, `isLoading`, `aria-disabled` and `role` are absent from its type.
- `style`, `role`, `tabIndex`, `aria-label` and `aria-labelledby` are removed from `Button` and `IconButton` so a consumer cannot override the element's semantics, replace the accessible name with a conflicting one, substitute `aria-disabled` for the native attribute, or remove the control from the tab order.

### Loading and disabled rules

`isLoading` sets the native `disabled` attribute and `aria-busy="true"`. Because the block is native, duplicate clicks and duplicate form submissions cannot occur, and the consumer's `onClick` is never invoked — no runtime click guard is needed. A consumer-supplied `disabled` always wins: a control that is both disabled and loading stays disabled.

The visible label is never hidden or replaced while loading. `Button` keeps rendering its children and adds a separate indicator element; `IconButton` keeps `aria-label` as its accessible name, so the name is stable across the transition. The indicator is a bordered ring built from CSS geometry — it needs no icon asset, and its _presence_ rather than its colour is the signal. Rotation is applied only inside `@media (prefers-reduced-motion: no-preference)`, so the indicator is fully legible without motion. It carries `aria-hidden="true"`; the machine-readable state is `aria-busy`.

Disabled state is distinguished by a dashed border in addition to colour, so it does not depend on colour alone.

### Accessible-name rules

- `Button` and `Link` take their accessible name from the visible label. The API cannot override it.
- `IconButton` sets `aria-label={label}` itself and wraps `children` in a component-owned `aria-hidden="true"` element, so decorative content can never leak into the name.
- A blank or whitespace-only `IconButton` label throws immediately with a message naming the cause, rather than shipping a nameless control.

### Technical, non-canonical style values

These are technical defaults chosen to meet the accessibility contract. **None is a canonical design-system value and no visual fidelity is claimed.**

- minimum interactive target `44px × 44px` on all three components
- border radius `0.25rem`, border width `1px` (`2px` for destructive)
- loading indicator `0.875em`, spin duration `700ms`
- colours come only from existing semantic tokens: `--gc-action`, `--gc-error`, `--gc-surface`, `--gc-focus-ring`, `--gc-disabled-surface`, `--gc-disabled-text`, `--gc-disabled-border`, `--gc-spacing-*`, `--gc-line-height-body`

No global token was added or changed and no foundation file was touched. Styles live in co-located SCSS Modules; the shared geometry, focus, disabled and variant rules live in the private `_action-base.scss` mixin partial, which emits no CSS of its own.

### States and forced colors

Observable states: default, hover, active, focus-visible, disabled, loading, destructive. Hover is an enhancement only — it is wrapped in `@media (hover: hover)` and adds an underline, so no behaviour is hover-dependent. Focus-visible draws a 2px `--gc-focus-ring` outline with offset; there is no prop to disable it and no inline style can reach it. Under `forced-colors: active` the components fall back to system colours (`buttonborder`, `highlight`, `graytext`) so the boundary, focus ring and disabled state survive; no hardcoded palette pair is used.

Text is never clipped: controls use `min-block-size` rather than a fixed height, inherit `font`, and allow `overflow-wrap: break-word`, so long labels wrap instead of overflowing.

### Tests

| File                                   | Coverage                                                                                                                                                                                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/shared/ui/button.test.tsx`      | Native button, default and explicit `type`, name from visible label, pointer/Enter/Space activation, disabled and loading blocking, `aria-busy`, stable name and visible label while loading, indicator hidden from the tree, consumer props, every variant, no navigation semantics                |
| `tests/shared/ui/link.test.tsx`        | Anchor semantics under `MemoryRouter`, `href` resolved from `to`, no button role, pointer and Enter navigation, name from visible label, consumer props, every variant, no disabled/loading/tabindex attributes                                                                                     |
| `tests/shared/ui/icon-button.test.tsx` | Native button, default and explicit `type`, name from `label` only, visual content hidden from the tree, blank-label runtime error, pointer/Enter/Space activation, disabled and loading blocking, stable name and `aria-busy` while loading, every variant, consumer props, no icon or image asset |
| `tests/shared/ui/action-props.test.ts` | Type-level contracts for all three components                                                                                                                                                                                                                                                       |
| `tests/shared/ui/public-api.test.ts`   | Entry point exposes exactly the seven approved runtime exports                                                                                                                                                                                                                                      |

### Type-level evidence

`action-props.test.ts` resolves conditional types through `Assert<T extends true>` and assigns each result to a `const`, so a regression fails `npm run typecheck` before any test runs. It asserts that the forbidden and navigation-escape props are absent, that consumer props survive, and that `children`, `to` and `label` are genuinely required rather than optional. A final assertion confirms `ButtonHTMLAttributes` still declares the forbidden props, so the absence checks cannot pass vacuously after a types upgrade.

### Rejected API variants

- a single polymorphic `Action` component with `as`, `asChild` or a slot API
- `Button` able to render an anchor, or `Link` able to render a button
- simulated disabled `Link` via removed `href`, `preventDefault`, `pointer-events: none`, `aria-disabled` or `tabIndex={-1}`
- `aria-disabled` in place of the native `disabled` attribute
- an icon library, icon dependency, icon registry or icon context
- a generic external-link, download-link, `mailto`/`tel` or inline-prose-link abstraction
- `size`, `fullWidth`, `shape`, `iconPosition`, `elevation` or `color` props, and any boolean appearance matrix
- a loading state that replaces the visible label with a spinner, or that changes the accessible name
- `NavLink` and route-current styling
- split button, toggle button, button group, menu button, floating action button
- `cloneElement`, runtime CSS-in-JS, a style-object API, or a provider/context for action styling

### Explicit non-goals

No route or Home integration, no Header, Footer, Information Bar or Catalog Navigation, no Logo component, no domain UI, no forms, no feedback or status family, no overlays, no production icons, and no dependency change.

### Known limitations

- All styling is a technical baseline. Final design tokens, typography and exact visual treatment remain open.
- Nothing consumes these components at runtime; integration belongs to M3-05, so the production bundle is unchanged by this task.
- There is no shared abstraction for external, download, `mailto`/`tel` or inline prose links. Those remain consumer-owned native `<a>` elements until a contract is approved.
- Destructive intent is conveyed by fill, a heavier border and the consumer's label wording. Final differentiation from `primary` is a design-system decision.
- JSDOM cannot prove rendered target size, forced-colors output or reduced-motion behaviour. Those are structural guarantees here and are confirmed by browser review at M3-05.

## M3-02A — Action semantic ownership correction

**Status: APPROVED AND CLOSED** as part of the cumulative M3-02 contract — see [M3-02 closure evidence](#m3-02-closure-evidence).

### Finding ACTION-A11Y-01

The independent audit rejected the M3-02 commit. `Button`, `Link` and `IconButton` all spread consumer props **after** their own attributes:

```tsx
<button type={type} disabled={disabled || isLoading} aria-busy={isLoading || undefined} {...rest} />
```

Two defects followed.

**Direct override of a permitted key.** `aria-busy` was not excluded from `ButtonProps` or `IconButtonProps`, so `<Button isLoading aria-busy={false}>` type-checked and silently replaced the component-owned busy state.

**Spread-object bypass.** `Omit` constrains the declared keys of an interface; it does not make an object exact at runtime, and TypeScript performs excess-property checking only on object literals written directly in JSX — never on a spread. A consumer could therefore write:

```tsx
const forwarded = { role: 'link', 'aria-label': 'Wrong name' };
<IconButton label="Close" {...forwarded}>
  …
</IconButton>;
```

with no type error, and the resulting DOM would carry an overriding `role`, a replaced accessible name, `aria-labelledby`, `aria-disabled`, a `tabIndex` override or a conflicting `aria-busy`. Type-level `keyof` tests could not detect this, because the types were correct — the runtime forwarding was not.

### Runtime ownership strategy

Three changes, applied to all three components:

1. **Type-level exclusions extended.** `aria-busy` is now removed from `ButtonProps` and `IconButtonProps`; `tabIndex` is removed from `LinkProps`.
2. **Conflicting keys are stripped before forwarding.** A private helper, `withoutOwnedAttributes` in `src/shared/ui/forwarded-props.ts`, removes a fixed set of eight keys — `role`, `tabIndex`, `style`, `href`, `aria-label`, `aria-labelledby`, `aria-disabled`, `aria-busy` — from the rest object via destructuring. The key set is static, the helper is used by all three primitives, it is not exported from the barrel, and it is not a general-purpose DOM sanitiser: it never drops unknown props and maintains no allowlist. There is no `any`, no type assertion, no index signature and no suppression comment.
3. **Owned attributes are applied after the spread.** `{...withoutOwnedAttributes(rest)}` comes first; `type`, `disabled`, `aria-busy`, `aria-label`, `to` and `className` follow it, so the component's values always win.

Consumers keep everything that is legitimately theirs: `id`, `name`, `value`, `form`, `type`, `disabled`, `onClick`, `onFocus`, `aria-describedby`, and `className`, which is merged after the component's own classes rather than replacing them.

### Regression evidence

`button.test.tsx`, `icon-button.test.tsx` and `link.test.tsx` each gained a test that builds an ordinary object of conflicting keys and spreads it into the component — the exact bypass the audit described, with no cast and no assertion. Each asserts the resulting DOM: native element preserved, no `role`, no `aria-labelledby`, no `aria-disabled`, no consumer `tabindex`, the correct accessible name, `aria-busy="true"` while loading, and the consumer's class merged alongside the component's own. `Button` and `IconButton` additionally assert that an idle control never adopts a forwarded `aria-busy`, and `Link` asserts that `href` follows `to` rather than a forwarded `href` and that the link stays tab-reachable and Enter-activated.

All five new tests were confirmed to fail against the M3-02 implementation before the fix was applied.

### Unchanged boundaries

No style file, variant, loading visual, minimum target size, forced-colors rule or reduced-motion rule was touched. `Button.module.scss`, `Link.module.scss`, `IconButton.module.scss`, `_action-base.scss` and `action-variant.ts` are byte-identical to M3-02. The runtime export surface is unchanged — still exactly seven components; the new helper is internal. M3-01 primitives, routes, shell, foundations, assets, dependencies and configs are untouched, and no M3-03 work is present.

## M3-02B — Interactive content integrity correction

**Status: APPROVED AND CLOSED** as part of the cumulative M3-02 contract — see [M3-02 closure evidence](#m3-02-closure-evidence).

### Finding ACTION-A11Y-02

M3-02A closed the semantic-override path, but the cumulative contract was still incomplete. Three categories remained.

**Accessibility-tree removal.** `hidden`, `aria-hidden` and `inert` were neither excluded from the public types nor stripped by the forwarding filter, so `<Button aria-hidden="true">Save</Button>`, `<IconButton label="Close" inert>` and `<Link to="/checkout" hidden>` were all well-typed. Each defeats the purpose of an interactive primitive: `aria-hidden` leaves the control focusable but invisible to assistive technology, `inert` creates a disabled-like state outside the native-`disabled` contract — reinstating disabled-link simulation on `Link` — and `hidden` removes the control from the interaction contract altogether.

`hidden` was not named in the audit summary. It is the direct equivalent of the same defect category, so it is fixed here to make the cumulative contract complete rather than deferred to a third corrective pass.

**Children ownership.** `dangerouslySetInnerHTML` survived in the base attribute types and in the forwarded object. Because all three components own their `children`, forwarding raw HTML threw React's "Can only set one of `children` or `props.dangerouslySetInnerHTML`" at render time, and would otherwise have replaced the declared content contract.

**Link busy-state mismatch.** M3-02A's filter already stripped `aria-busy`, but `LinkProps` still accepted it. `<Link to="/catalog" aria-busy="true">` compiled and the prop silently vanished — a misleading public API contradicting `Link`'s documented absence of any busy state.

### Type corrections

| Component         | Newly excluded                                                           |
| ----------------- | ------------------------------------------------------------------------ |
| `ButtonProps`     | `hidden`, `aria-hidden`, `inert`, `dangerouslySetInnerHTML`              |
| `IconButtonProps` | `hidden`, `aria-hidden`, `inert`, `dangerouslySetInnerHTML`              |
| `LinkProps`       | `hidden`, `aria-hidden`, `inert`, `dangerouslySetInnerHTML`, `aria-busy` |

Every earlier M3-02 and M3-02A prohibition is retained. Safe consumer-owned props are untouched: `id`, `name`, `value`, `form`, `type`, `disabled`, `onClick`, `onFocus`, `aria-describedby`, `aria-controls` and `className` on the controls; `id`, `to`, `replace`, `state`, `relative`, `preventScrollReset`, `aria-describedby`, `aria-controls` and `className` on `Link`. `children` remains required on all three, `to` on `Link`, `label` on `IconButton`.

### Runtime filtering correction

`withoutOwnedAttributes` now strips a fixed set of **twelve** keys:

```
role, tabIndex, style, href, hidden, inert, dangerouslySetInnerHTML,
aria-label, aria-labelledby, aria-disabled, aria-busy, aria-hidden
```

The helper stays narrow: it is private, unexported from the barrel, used by all three primitives, removes only these twelve keys, never touches unknown or safe props, and maintains no HTML-attribute allowlist. There is no `any`, no index signature, no type assertion, no `Proxy`, no `cloneElement` and no suppression comment. The M3-02A ordering is unchanged — filtered consumer props first, then component-owned attributes, then component-owned children.

### Regression evidence

Six new spread-object tests were added — hiding-props and raw-HTML cases for each component, with the `Link` hiding case also covering the `aria-busy` mismatch. All six were confirmed failing against the previous implementation: the hiding cases could not find the element by role at all, because a `hidden` or `aria-hidden` root is excluded from the accessibility tree, and the raw-HTML cases threw React's children conflict error.

The type-level suite gained the four content-integrity keys for every component plus `aria-busy` for `Link`, and the router base-type guard was widened to match. Three deliberate type regressions were verified to break `npm run typecheck`.

### Unchanged boundaries

No style file, variant, loading visual, disabled visual, minimum target size, focus-visible rule, forced-colors rule or reduced-motion rule was touched. The runtime export surface is unchanged — still exactly seven components, with the helper internal. M3-01 primitives, routes, shell, foundations, assets, dependencies and configs are untouched, and no M3-03 work is present.

## M3-03 — Native form controls baseline

**Status: superseded by [M3-03A](#m3-03a--form-content-ownership-and-choice-target-correction)** — the independent audit returned CHANGES REQUIRED on this commit.

M3-03 adds six native-semantic form controls and the private mechanism that gives them a consistent label, description, error and association contract. It implements no form architecture: no form state, no schema, no submission lifecycle and no route integration.

### Component matrix

| Component   | Native root                             | Required props           | Controlled / uncontrolled    | Ref target            |
| ----------- | --------------------------------------- | ------------------------ | ---------------------------- | --------------------- |
| `TextField` | `<input>` (`text` by default)           | `label`                  | `value` / `defaultValue`     | `HTMLInputElement`    |
| `Textarea`  | `<textarea>`                            | `label`                  | `value` / `defaultValue`     | `HTMLTextAreaElement` |
| `Select`    | `<select>` (single)                     | `label`, `children`      | `value` / `defaultValue`     | `HTMLSelectElement`   |
| `Checkbox`  | `<input type="checkbox">`               | `label`                  | `checked` / `defaultChecked` | `HTMLInputElement`    |
| `Radio`     | `<input type="radio">`                  | `label`, `name`, `value` | `checked` / `defaultChecked` | `HTMLInputElement`    |
| `Switch`    | `<input type="checkbox" role="switch">` | `label`                  | `checked` / `defaultChecked` | `HTMLInputElement`    |

All six are dedicated siblings. There is no public generic `Field`, no `control="…"` discriminator, no `as`/`asChild`, and no form context or provider.

### Shared field content contract

Every control accepts `label` (required), `description`, `error` and `className`. `label` must be non-blank — a whitespace-only label throws immediately rather than shipping an unnamed control. Blank `description` and `error` are treated as absent. `className` lands on the public field wrapper, never on the private control, and consumers get no styling hook for private descendants.

### Association contract

Each control accepts a consumer `id` and otherwise derives a stable one from `useId`. The visible `<label>` is bound through `htmlFor`/`id`, and the description and error ids are derived from the resolved control id — no random UUIDs and no module-global counter.

`aria-describedby` is composed in a fixed order:

1. the internal description id
2. the consumer's own `aria-describedby` tokens
3. the internal error id

so help text always precedes error text in both the DOM and the described-by order. Duplicate tokens are removed keeping first position, blank tokens are dropped, and the attribute is omitted entirely when the result is empty. `aria-errormessage` is not part of the public API, so an error is never announced through two channels at once.

### Required indication

`required` sets the **native** attribute. The label area additionally renders the visible text `Обязательное поле` — not an asterisk, and not a colour-only cue. Because the native attribute already conveys the state programmatically, the visible text carries `aria-hidden="true"` so it cannot be announced twice. There is no prop to suppress the indication.

### Invalid ownership

`error` is the only public owner of invalid presentation. A non-empty error renders visible text, adds the error id to `aria-describedby`, and sets `aria-invalid="true"`. With no error there is no error container and no `aria-invalid`. A forwarded `aria-invalid` is never accepted. The error text is not a live region and carries no `role="alert"` — announcement and focus management belong to the form owner.

**`Radio` is the one deliberate exception.** ARIA does not support `aria-invalid` on `role="radio"`; invalid state belongs to the radio _group_, not an individual option, and `jsx-a11y/role-supports-aria-props` enforces this. `Radio` therefore renders the visible error and the described-by association but no `aria-invalid`. This is consistent with the rule that a group-level error must not be duplicated onto every option.

### readOnly versus disabled

| Control                       | `readOnly`                                      | `disabled`            |
| ----------------------------- | ----------------------------------------------- | --------------------- |
| `TextField`, `Textarea`       | supported — focusable, selectable, not editable | native, not focusable |
| `Select`                      | not supported (type and runtime)                | native                |
| `Checkbox`, `Radio`, `Switch` | not supported, and never simulated              | native                |

Read-only and disabled remain visually distinct: dotted border for read-only, dashed for disabled, so neither is signalled by colour alone. Read-only is never simulated with `preventDefault`, and `aria-disabled` / `aria-readonly` are rejected in favour of the native attributes.

### Component-specific decisions

**TextField** accepts only `text`, `email`, `password`, `search`, `tel` and `url`. Because a spread can bypass the type union at runtime, an unsupported `type` throws an error naming the allowed set rather than silently falling back to `text`. `type="search"` is a plain native search input — no suggestions, no history, no clear button, no Search Form.

**Textarea** never uses `children` as a value API, has no fixed height (`min-block-size` only) and stays vertically resizable, so long text and zoom do not clip.

**Select** is native single-select. `multiple`, `size` and `readOnly` are removed from the type and stripped at runtime, so a spread cannot turn it into a listbox. It does not parse options: `children` are the consumer's `<option>` and `<optgroup>` elements.

**Checkbox** supports `indeterminate`, applied to the native `HTMLInputElement.indeterminate` property through an internal ref that composes with the consumer's ref. Mixed state comes from native semantics, not a component-set `aria-checked`, and it is not a third submitted value — the click and change lifecycle stays native. There is no custom tri-state machine.

**Radio** requires non-blank `name` and `value`. Grouping is native composition owned by the consumer:

```tsx
<fieldset>
  <legend>Способ доставки</legend>
  <Radio name="delivery" value="courier" label="Курьер" />
  <Radio name="delivery" value="pickup" label="Самовывоз" />
</fieldset>
```

There is no `RadioGroup` export and no ARIA radiogroup reimplementation — the shared `name` creates the native group and native arrow/Space behaviour is preserved.

**Switch** is a native checkbox with a component-owned `role="switch"`. The accessible name comes only from the visible label; `role`, `aria-label`, `aria-labelledby` and `aria-checked` are all rejected. There is no mixed, pressed or selected state.

### Runtime integrity

Type-level omission does not survive a JSX spread, so each control also filters a fixed conflict set before forwarding and applies its owned attributes afterwards.

Common set removed from every control (19 keys): `children`, `style`, `role`, `tabIndex`, `hidden`, `inert`, `contentEditable`, `dangerouslySetInnerHTML`, `autoFocus`, `aria-label`, `aria-labelledby`, `aria-invalid`, `aria-errormessage`, `aria-disabled`, `aria-readonly`, `aria-required`, `aria-busy`, `aria-hidden`, `aria-checked`. `Select` additionally strips `multiple`, `size` and `readOnly`; the choice controls additionally strip `type`, `readOnly` and `indeterminate`.

`children` is stripped at runtime as well as removed from five public types, so a spread cannot reach a void `<input>` or become a `<textarea>` value. `Select` destructures its own public `children` before the filter runs, so its consumer-owned options are unaffected — see [M3-03A](#m3-03a--form-content-ownership-and-choice-target-correction).

`aria-describedby` is deliberately _not_ blind-forwarded — it is destructured, merged into the ordered association, and re-applied by the component.

The three filters are private, share a static key set, remove only those keys, never touch safe or unknown props, and keep no HTML-attribute allowlist. No `any`, no index signature, no assertion, no `Proxy`, no `cloneElement`, no suppression comment, no dependency.

### Technical, non-canonical styles

Technical baseline values, **not** canonical design tokens: 44 px minimum block size on the interactive target, `0.25rem` radius, `1px` border (`2px` when invalid), `1.25rem` choice-control box, `6rem` textarea minimum height. Colours come only from existing `--gc-*` semantic tokens; no global token was added or changed and `src/styles/**` is untouched.

For choice controls the 44 px minimum is applied to the `<label>` that wraps the native input and spans the row, so the whole visible row is the activation area — not to a non-interactive wrapper. The native input keeps its `1.25rem` box because the enclosing label, not the input, is the pointer target. Rendered pixel size is not measurable in JSDOM and remains subject to the browser review at M3-05; the tests prove structural ownership only.

Text controls use `min-block-size` rather than a fixed height, wrappers and labels allow `min-inline-size: 0` and wrap, and the textarea stays resizable, so nothing clips or scrolls horizontally at zoom. Forced-colors falls back to system colours (`canvastext`, `highlight`, `graytext`) so boundary, focus, invalid and disabled distinctions survive. No animation or transition is required to understand any state.

### Tests

164 new tests across eight files. `form-control-contract.test.tsx` runs the shared contract table-driven across all six controls; the six per-component files cover native behaviour; `form-control-props.test.ts` holds the compile-time contract.

Coverage includes native element and role, visible label and programmatic name, explicit and generated ids, label activation, description/error association and ordering, external described-by preservation and deduplication, absence of containers and `aria-invalid` when clean, native required plus visible indication, wrapper class placement, safe attribute forwarding, native refs, blank-label rejection, controlled and uncontrolled state, keyboard activation, read-only versus disabled, and a spread-object integrity test per control.

### Baseline failure evidence

The new tests were verified to fail against deliberately weakened implementations before the final run:

- widening `TextFieldProps` to accept `aria-invalid` → `TS2344` / `TS1360` in `form-control-props.test.ts`
- forwarding props unfiltered in `TextField` and `Select` → the conflicting-spread tests could not find the controls by role at all, because `hidden` and `aria-hidden` removed them from the accessibility tree
- the same weakening → React's `Can only set one of children or props.dangerouslySetInnerHTML` on `Select`
- the same weakening → `multiple` and `size` leaked and the single-select test failed

### Rejected abstractions

A public generic `Field`; a `control="input|select|…"` discriminator; form context or provider; React Hook Form, Formik or any form library; Zod schemas and resolvers; a schema-driven field generator; Controller adapters; Error Summary and form-level status; a custom Select, Combobox or listbox; a custom radio keyboard model or ARIA radiogroup; `aria-disabled` / `aria-readonly` simulation; simulated read-only via `preventDefault`; a hidden or visually-hidden label; consumer `aria-label` override; multi-select; asterisk-only required indication; and any business form integration.

### Known limitations

- All styling is a technical baseline; final tokens, typography and visual treatment remain open and no visual fidelity is claimed.
- `Switch` reuses the native checkbox presentation. A custom track-and-thumb visual would require `appearance: none`, which risks forced-colors and platform-semantics regressions; the final switch visual is a design-system decision.
- Nothing consumes these controls at runtime; integration belongs to a later approved milestone, so the production bundle is unchanged.
- JSDOM cannot prove rendered target size, forced-colors output or zoom/reflow behaviour. Those are structural CSS guarantees here and need the M3-05 browser review.
- Native radio arrow-key navigation is a platform behaviour; it is not simulated in JSDOM and is not asserted by these tests.

### Runtime exports

After M3-03 `@/shared/ui` exports exactly thirteen components: `Button`, `Checkbox`, `Grid`, `IconButton`, `Link`, `PageContainer`, `Radio`, `Select`, `Stack`, `Switch`, `Textarea`, `TextField`, `VisuallyHidden`. `FieldShell`, `field-association.ts`, `field-props.ts` and `_field-base.scss` stay internal.

### Unchanged boundaries

No existing M3-01 or M3-02 component, style or helper was modified. Routes, shell, foundations, assets, dependencies, lockfile, build scripts, CI workflows and all tooling configuration are untouched, and no M3-04 work is present.

## M3-03A — Form content ownership and choice target correction

**Status: APPROVED AND CLOSED** with M3-03 — see [M3-03 closure evidence](#m3-03-closure-evidence).

The independent audit returned CHANGES REQUIRED on M3-03 with two blocking findings. A successful CI run on the M3-03 commit did not close it: neither defect is detectable by typecheck, lint or the build.

### FORM-RUNTIME-01 — children reached the native control through a spread

`children` was excluded from the five no-children public types but was **not** in the runtime conflict set, so an ordinary object bypassed excess-property checking:

```tsx
const forwarded = { children: 'Wrong content' };
<TextField label="Name" {...forwarded} />;
```

The consequences were real, not theoretical: React threw `input is a void element tag and must neither have children nor use dangerouslySetInnerHTML` for `TextField`, `Checkbox`, `Radio` and `Switch`, and `Textarea` silently adopted the injected text as its content — the children-as-value path the contract explicitly forbids. The existing spread-object test did not include `children`, so nothing caught it.

**Correction.** `children` was added to the private conflict set and is now destructured and discarded by all three filters, so it is removed before anything is forwarded. No component file needed to change. `Select` destructures its own public `children` before calling the filter, so its consumer-owned `<option>` and `<optgroup>` composition is untouched and its API is unchanged.

### FORM-A11Y-01 — the 44 px target was on a non-interactive wrapper

The choice layout rendered the input and the label as siblings inside a `div`:

```
div.field
└── div.choice-row      ← min-block-size: 44px, but not clickable
    ├── input           ← 1.25rem × 1.25rem
    └── label           ← only as large as its own text
```

The 44 px belonged to a `div` that activates nothing. The real pointer targets were the 1.25rem input and the label text; the empty space in the row did nothing. The documented minimum interactive target was therefore not met.

**Correction.** The row _is_ the label now:

```
div.field
├── label.choice-row          ← min-block-size: 44px, inline-size: 100%, cursor: pointer
│   ├── input                 ← native control, first in DOM order
│   └── span.choice-copy
│       ├── span.choice-text  ← visible label text
│       └── span.required     ← aria-hidden decorative indication
├── description
└── error
```

The native input is a descendant of the label, `htmlFor` is retained for explicit association, and the label carries the 44 px minimum and stretches across the row — so any point in the visible row activates the control. There is no click handler, no `preventDefault`, no role simulation and no JavaScript target enlargement; activation is entirely native label behaviour. The input remains the focus and form control, keeps its native appearance with no `appearance: none`, and native checked, selected and mixed rendering is unchanged.

`choice-copy` is a wrapping flex container with an explicit `gap`, so the label text and `Обязательное поле` can no longer run together as `SubscribeОбязательное поле`. The indication stays visible and `aria-hidden="true"`, and native `required` remains the semantic signal. The now-dead `choice-label` mixin and class were removed rather than left behind.

### Test evidence

The shared conflict object now carries `children: 'Wrong child content'`, and every control asserts the injected text never appears, the accessible name is unchanged, and the control stays keyboard reachable. `Textarea` has dedicated regressions proving injected children become neither the uncontrolled nor the controlled value. `Select` has a regression proving its option and optgroup children survive the new conflict key and selection still works.

Seven structural tests per choice control confirm the input is a descendant of the label, the label is the field's first child with no intermediate wrapper, the control precedes the visible text, clicking either the label row or the visible text activates and focuses the control, the required indication is a separate element from the label text, and description and error still follow the row.

All new tests were confirmed failing against the M3-03 implementation before the fix.

### Unchanged

No public API, prop name, type union, runtime export, controlled/uncontrolled behaviour, id association, described-by order, error ownership, native required, ref target, Select options contract, Checkbox indeterminate, Radio grouping or Switch role changed. `Select.tsx`, the six component SCSS modules, `index.ts`, `public-api.test.ts`, M3-01, M3-02, routes, shell, foundations, assets, dependencies and configuration are all untouched, and no M3-04 work is present.

## M3-03B — Shared UI directory organization

**Status: APPROVED AND CLOSED** — see [M3-03B closure evidence](#m3-03b-closure-evidence).

A pure structural refactor. No public API, runtime behaviour, style declaration, test assertion, dependency or bundle output changed — only file locations and the import paths that follow from them.

### Why

`src/shared/ui` had grown to 37 files in one flat directory, mixing public components, their styles, family-specific private helpers, a shared private helper, Sass partials and the public barrel at a single level. After M3-03 that directory holds four distinct families. Carrying the flat layout into M3-04 would keep degrading navigation, helper ownership, reviewability and the visibility of family boundaries. This is an organisational concern, not a runtime defect, so it is isolated in its own commit rather than mixed into functional work.

### Source tree

```
src/shared/ui/
├── accessibility/VisuallyHidden/   VisuallyHidden.tsx + .module.scss
├── actions/
│   ├── Button/                     Button.tsx + .module.scss
│   ├── IconButton/                 IconButton.tsx + .module.scss
│   ├── Link/                       Link.tsx + .module.scss
│   └── internal/                   _action-base.scss, action-variant.ts, forwarded-props.ts
├── forms/
│   ├── Checkbox/ Radio/ Select/ Switch/ Textarea/ TextField/
│   └── internal/                   FieldShell.tsx + .module.scss, _field-base.scss,
│                                   field-association.ts, field-props.ts
├── internal/                       class-names.ts
├── layout/
│   ├── Grid/ PageContainer/ Stack/
│   └── internal/                   spacing.ts
└── index.ts                        the only barrel
```

### Test tree

```
tests/shared/ui/
├── accessibility/   visually-hidden.test.tsx, visually-hidden-props.test.ts
├── actions/         button, icon-button, link, action-props
├── forms/           checkbox, radio, select, switch, text-field, textarea,
│                    form-control-contract, form-control-props
├── layout/          grid, page-container, stack
└── public-api.test.ts
```

### Ownership rules

Each component owns a directory holding its `.tsx` and its co-located `.module.scss`. Helpers used by exactly one family live in that family's `internal/`; only `class-names.ts`, which every family uses, sits in the shared `src/shared/ui/internal/`.

`internal` marks private implementation and is never exported as runtime API. `src/shared/ui/index.ts` remains the **single** barrel — there is no `index.ts` in any category, component or internal directory, so there is no ambiguity about the entry point and no accidental re-export surface.

Within Shared UI, imports are relative and reach only downward or into a shared internal. Family boundaries are enforced by inspection: `actions` never imports from `forms`, `forms` never from `actions`, and neither `layout` nor `accessibility` imports from either. Sass partials are reached through `../internal/…` from their family's components.

### Deep imports remain prohibited

Everything outside `src/shared/ui/**` imports from `@/shared/ui` only. No alias, subpath export or package-style entry point was added for the new directories, so the nesting is invisible to consumers and cannot become a coupling surface.

### Unchanged

The 13 runtime exports and all 25 public type exports are identical. No component prop, JSX structure, DOM output, runtime guard, forwarded-prop filter, ID generation, accessibility semantics, keyboard behaviour, controlled/uncontrolled behaviour, ref, association contract, style declaration, token or CSS value changed. Test count stays at 422 and every assertion is untouched — all 17 moved test files are byte-identical to their previous versions. Dependencies, lockfile, build configuration, routes, foundations and assets are untouched, and the bundle report is unchanged.

Git records the migration as renames rather than delete/create, so the history of every file is preserved and the diff is reviewable as a move.

## M3-04 — Feedback, status and validation-summary primitives

**Status: APPROVED AND CLOSED** — see [M3-04 closure evidence](#m3-04-closure-evidence).

### Scope and non-goals

M3-04 adds basic reusable feedback _presentation_. It does not implement async state ownership, mutation logic, retry orchestration or announcement channels — those stay with the owner.

Delivered: a compact static family (`Badge`, `Counter`, `Status`), a persistent owner-region `InlineStatus` with explicit live-role opt-in, and a long-form `ErrorSummary`.

Not delivered, deliberately: Toast, global notification store, timers, portals, dialogs, drawers, overlay root, route or domain error states, empty states, async orchestration, cross-route feedback infrastructure, spinner, progress, skeleton, action slots and automatic focus.

### Component registry

| Component      | Root      | Tones / states          | Default live semantics                 | Focus owner            |
| -------------- | --------- | ----------------------- | -------------------------------------- | ---------------------- |
| `Badge`        | `span`    | `FeedbackTone`          | none                                   | none                   |
| `Counter`      | `span`    | `FeedbackTone`          | none                                   | none                   |
| `Status`       | `span`    | `FeedbackTone`          | none                                   | none                   |
| `InlineStatus` | `div`     | `InlineStatusTone`      | none; explicit `status` / `alert` only | none                   |
| `ErrorSummary` | `section` | invalid long-form state | none                                   | form owner through ref |

```ts
type FeedbackTone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'current';
type InlineStatusTone = 'info' | 'pending' | 'success' | 'warning' | 'error' | 'stale' | 'offline';
type InlineStatusRole = 'status' | 'alert';
```

Tone sets are closed unions. There is no open string union, no arbitrary colour prop and no `variant`/`severity` synonym. Values arriving through a spread are validated at runtime and throw naming the component and the received value.

### Public API

- `Badge` — `children: string` (required, non-blank), `tone?: FeedbackTone` (default `neutral`)
- `Counter` — `value: number | string` (required), `tone?: FeedbackTone` (default `neutral`)
- `Status` — `children: string` (required, non-blank), `tone: FeedbackTone` (required)
- `InlineStatus` — `tone: InlineStatusTone` (required), `role?: InlineStatusRole`, `children: React.ReactNode` (required)
- `ErrorSummary` — `title: string`, `items: readonly ErrorSummaryItem[]`, `headingLevel?: 2 | 3 | 4` (default `2`), `ref?: React.Ref<HTMLElement>`

`Counter` accepts any finite number including `0`; `NaN` and both infinities throw. A non-blank string such as `99+` passes through exactly — formatting, pluralisation, maximums and localisation all stay with the consumer.

Runtime exports are now exactly eighteen. New public types: `BadgeProps`, `CounterProps`, `ErrorSummaryItem`, `ErrorSummaryProps`, `FeedbackTone`, `InlineStatusProps`, `InlineStatusRole`, `InlineStatusTone`, `StatusProps`. No private helper, validator, tone array or Sass detail is exported.

### Static versus live semantics

Every primitive is static by default. `Badge`, `Counter` and `Status` are **always** static — they carry no role and no live-region attributes, and re-rendering with a new value or new text announces nothing. `Status` stays static even with `tone="error"`; it is compact persistent text, not an announcement primitive.

`InlineStatus` is static unless the consumer passes `role`. Tone and role are fully independent: `tone="error"` without a role announces nothing, `role="alert"` never gets injected because the tone happens to be an error, and choosing a role never rewrites the tone. `aria-live`, `aria-atomic`, `aria-relevant` and `aria-busy` are removed from the type and stripped at runtime, so live semantics can only be reached through the explicit `role` prop — which is itself validated.

### Announcement ownership

One event has one announcement owner, and that owner is the consumer. These primitives never create a live region implicitly, never deduplicate or delay announcements, never own timing, and never construct cross-route notification infrastructure. There is no timer, no portal and no global store anywhere in the family.

### ErrorSummary focus and link contract

```
section.error-summary[tabindex=-1][aria-labelledby]
├── h2|h3|h4.title
└── ul
    ├── li > a[href="#target-id"] message
    └── li > span message
```

The summary is programmatically focusable but **does not focus itself** and does not scroll. The approved long-form flow is: the form owner detects an invalid submit, renders the summary, and focuses it through the ref; the user then activates a link and the linked native control receives focus.

Items with a `targetId` render a native anchor whose accessible name is the visible message and whose `href` is a fragment built from the encoded id. On ordinary activation the component looks the raw id up with `document.getElementById`; if it resolves to an element it prevents the default fragment navigation and calls the element's native `.focus()`. It never adds or mutates the target's `tabindex`, never calls `scrollIntoView`, never rewrites the URL or history, and never synthesises a click or a route navigation. A missing target does not throw — the native fragment `href` simply remains.

The summary carries no `role="alert"` and no `aria-live`; field-level error association stays with the form controls, and the summary never duplicates those errors through a live region.

### Runtime prop hardening

Type-level omission does not survive a JSX spread, so each component also strips a fixed conflict set before forwarding and applies owned attributes afterwards.

Compact family (13 keys): `children`, `style`, `dangerouslySetInnerHTML`, `role`, `tabIndex`, `contentEditable`, `autoFocus`, `aria-label`, `aria-labelledby`, `aria-live`, `aria-atomic`, `aria-relevant`, `aria-busy`.

`InlineStatus` and `ErrorSummary` (16 keys): the above plus `hidden`, `inert`, `aria-hidden`.

Deliberately kept consumer-owned: `id`, `title`, `className`, `data-*`, `aria-describedby`, `aria-current`, and — for the compact family only — `aria-hidden`, because a compact badge or counter is often a duplicate of content the owning control already exposes in its accessible name.

The filters are private, share static key sets, remove only those keys, never touch safe or unknown props, and keep no HTML-attribute allowlist. No `any`, no index signature, no `Proxy`, no `cloneElement`, no suppression comment, no dependency.

### Visual and forced-colors baseline

Compact primitives are content-sized inline-flex with a border, no fixed height and wrapping text. `InlineStatus` and `ErrorSummary` are full-width blocks with visible boundaries and wrapping content. `Counter` uses tabular numerals.

Existing semantic tokens cover neutral, error, surface, text and focus. The palette has no approved info, success or warning role, so three local technical colours plus one offline grey live inside the feedback Sass. **They are non-canonical, are not exposed as root CSS custom properties, and imply no design-system approval.**

Tone is never the sole carrier of meaning — the visible text is, and every primitive requires visible content. Tone is reinforced structurally as well as by colour: warning and stale use a dashed border, pending and offline dotted, error and current a heavier border. Under `forced-colors: active` boundaries and text fall back to system colours and the focus ring uses `highlight`, with no `forced-color-adjust: none` and no dependence on custom background fills.

There is no motion anywhere in the family: no spinner, pulse, fade, auto-dismiss, countdown or required transition.

### Tests

M3-04 added **20 new files and modified 3 existing files** (`index.ts`, `public-api.test.ts` and this report).

The seven files under `tests/shared/ui/feedback/` contain **80 tests**. The targeted run used during that task — the feedback directory plus `tests/shared/ui/public-api.test.ts` — is **84 tests across 8 files**, because the rewritten public-API file contributes **4 tests** of its own. `feedback-contract.test.tsx` drives the compact family table-driven; each component has its own file; `feedback-props.test.ts` holds the compile-time contract.

Coverage includes native roots, absent default semantics, every tone, spread-object integrity for all conflict keys, safe-attribute survival, `className` merging, runtime tone/role/value/heading validation, `InlineStatus` role opt-in in both directions with tone/role independence, and the full `ErrorSummary` structure, validation, link and focus behaviour — including target focus for input, select and textarea, no `tabindex` mutation, no `scrollIntoView`, and a missing target not throwing.

### Rejected variants

A single universal `Alert`/`Notice`/`Callout`; a sixth `MessageBanner` alias; deriving the live role from the tone; a raw `aria-live` prop; Toast, Snackbar or a global notification store; auto-focusing the `ErrorSummary`; `role="alert"` on the summary; mutating the target's `tabindex`; portals and timers; an icon library or icon slot; generating domain copy from a tone; and an action slot or retry callback inside `InlineStatus`.

### Known limitations

The local info/success/warning colours are technical, not canonical. Tone differentiation beyond the visible text is border treatment only, pending design-system review. Nothing consumes these primitives at runtime, so the production bundle is unchanged. JSDOM cannot prove rendered size, forced-colors output or zoom behaviour — those remain for the browser review.

## M3-05 — Shared UI runtime integration

**Status: IMPLEMENTED — CORRECTIVE TEST PASS APPLIED — AWAITING INDEPENDENT AUDIT, CI, AND USER BROWSER REVIEW**

The corrective pass is [M3-05A](#m3-05a--shell-aware-announcement-ownership-correction). It changed test assertions and this report only; the M3-05 runtime is unchanged.

### Purpose

M3-05 adds no new primitives. It proves the already-approved Shared UI API works when consumed through the single public entry point in a real route module, and it produces the first route-level and browser-level evidence for M3-01 through M3-04.

### Technical Home boundary

The existing technical Home placeholder becomes a **verification surface**, not a storefront. The page states this in visible copy:

> Technical Shared UI verification surface — not the canonical storefront Home page.

It is not the canonical Home, not an implementation of RTE-001, and carries no Header, Footer, global or catalog navigation, logo component, brand asset, domain data or design-fidelity claim. Canonical Home belongs to a later milestone and will replace this page.

Structure is unchanged where the routing contract depends on it: exactly one `<main id="main-content">` (now owned by `PageContainer as="main"`), exactly one `<h1>` retaining `tabIndex={-1}` and `data-route-focus`, and the three original navigation labels and targets — `Catalog Category`, `Product Details`, `Shopping Cart` — so every existing M1 selector keeps working.

### Runtime integration matrix

| Component        | Page section          | Purpose in the surface                                      | Runtime state    |
| ---------------- | --------------------- | ----------------------------------------------------------- | ---------------- |
| `PageContainer`  | root                  | owns `<main>`, width and gutters                            | static           |
| `Stack`          | all sections          | vertical rhythm and wrapping inline rows                    | static           |
| `Grid`           | layout evidence       | two intrinsically wrapping panels                           | static           |
| `VisuallyHidden` | counter row           | labelled counter value for the accessibility tree           | reflects counter |
| `Badge`          | compact feedback      | `Technical` categorical marker                              | static           |
| `Status`         | compact feedback      | `Verification surface` current state                        | static           |
| `Counter`        | compact feedback      | demonstration count, `aria-hidden`, tone shifts at > 0      | route state      |
| `Button`         | actions, form         | increment, submit, reset                                    | interactive      |
| `IconButton`     | actions               | counter reset, technical `↺` glyph                          | interactive      |
| `Link`           | navigation            | the three existing route targets                            | static           |
| `TextField`      | form                  | `m3-demo-name`, required, receives owner error              | uncontrolled     |
| `Textarea`       | form                  | `m3-demo-notes`, description                                | uncontrolled     |
| `Select`         | form                  | `m3-demo-category`, required, receives owner error          | uncontrolled     |
| `Checkbox`       | form                  | `Receive demonstration updates`                             | uncontrolled     |
| `Radio`          | form                  | two choices inside a native `fieldset`/`legend`             | uncontrolled     |
| `Switch`         | form                  | `Enable compact notifications`                              | uncontrolled     |
| `InlineStatus`   | identity, form result | static `info` notice; `success` result with `role="status"` | route state      |
| `ErrorSummary`   | form                  | invalid-submit summary and focus target                     | route state      |

The `↺` glyph in `IconButton` is a plain text character inside the component-owned decorative wrapper. **It is not a production icon asset and does not resolve the icon-system question.**

### Route-local state

Three `useState` values only: the counter, the field errors and the success result. Form values are read uncontrolled through `FormData` on submit. There is no context, provider, reducer framework, store, persistence, query cache, async simulation, artificial delay, timer, mock request or event bus.

### Form validation owner

The route owns validation, not the primitives. It checks two things — `Name` non-blank and `Category` selected — with no schema, no form library, no generic hook and no reusable validation layer. The form carries `noValidate` because the owner, not the browser, decides when and how errors surface. Nothing is submitted anywhere.

### Announcement ownership

This is the point of the exercise, and the page keeps exactly one announcement owner per **event**. Ownership is per event, not a global count of live regions in the document.

| Event                     | Owner           | Channel                                                  |
| ------------------------- | --------------- | -------------------------------------------------------- |
| route navigation          | `RootLayout`    | `#route-announcement`, `role="status"`                   |
| counter increment / reset | none            | static `Counter`                                         |
| invalid form submit       | form owner      | focus moved to `ErrorSummary`, no live region            |
| valid form submit         | Home form owner | one success `InlineStatus` `role="status"` inside `main` |

- The route announcement region in `RootLayout` is untouched. It is a **pre-existing, routing-owned** `role="status"` channel that is present on every route, including Home, and sits outside `main#main-content`.
- The counter is **silent**: `Counter` carries no role and no live region, and incrementing or resetting it announces nothing.
- The initial technical `InlineStatus` has **no** role, so it never announces.
- Invalid submit is **focus-based, not announcement-based**: `ErrorSummary` gets no `role="alert"` and no live region; the owner moves focus to it instead.
- The success `InlineStatus role="status"` is the **sole announcement owner of the valid-submit event**, and only after a valid submit.

The success `InlineStatus` is the sole announcement owner of the valid-submit event. `RootLayout`'s pre-existing route announcement remains a separate routing-owned status channel. No second Home-owned result live region, toast or duplicate valid-submit announcement is created.

Document-level `role="status"` counts on Home are therefore: one (routing) in the initial and counter states, and two (routing plus the Home result) after a valid submit. Those totals are evidence about the shell, not about Home's ownership, so tests scope their status assertions to the owner — `main#main-content` for Home, `#route-announcement` for routing.

### ErrorSummary focus flow

Invalid submit builds the error map, renders the summary, and the owner focuses it through the ref in an effect. Each summary item links to the real control id — `#m3-demo-name`, `#m3-demo-category` — and activating a link moves focus to that native control. Reset clears errors, the summary and the result **without** moving focus, so it cannot steal focus from the user.

### Responsive and browser evidence

Six new Playwright scenarios cover the runtime surface (no page or console errors), counter actions, the invalid-submit focus flow, the single Home-owned valid-submit result, a seven-viewport layout and target sweep (320, 767, 768, 1023, 1024, 1279, 1280 px) asserting no horizontal overflow, unclipped labels and ≥ 44 px targets for `Button`, `IconButton` and the choice rows, and a reduced-motion plus forced-colors axe scan of the invalid state with zero violations.

**Viewport width is not zoom.** These scenarios do not prove 200 % or 400 % reflow, real forced-colors rendering, coarse-pointer behaviour or screen-reader output — those remain the user's manual browser review.

### Bundle delta

| Artefact            | Before (M3-04)     | After (M3-05)      |
| ------------------- | ------------------ | ------------------ |
| Total raw / gzip    | 371.38 / 114.00 KB | 406.68 / 122.01 KB |
| Entry JS raw / gzip | 365.60 / 111.08 KB | 365.80 / 111.20 KB |
| Home route chunk    | 0.73 / 0.37 KB     | 20.07 / 5.81 KB    |
| Global CSS          | 2.94 / 1.19 KB     | 2.94 / 1.19 KB     |
| Route CSS chunk     | none               | 15.77 / 2.46 KB    |

The important result: **Shared UI stayed inside the lazy Home boundary.** The entry chunk grew by 0.20 KB raw and 0.12 KB gzip — noise — while the Home route chunk and a new route CSS chunk absorbed the integration. Nothing eagerly imports Home from the app shell, the other four route chunks are unchanged, no duplicate chunk appeared, MSW stays excluded and no source maps are emitted. No budget is set and no manual chunking was added.

### Automated tests

`tests/routes/home/home-page.test.tsx` adds 18 route-level tests covering structure, evidence for all eighteen primitives, the counter flow, the invalid and valid submit flows and reset. The existing smoke suite needed **no** change. Full suite: **36 files, 522 tests**. Expected CI E2E after this change: **23** (17 preserved + 6 new).

These route-level tests render `HomePage` **without** `RootLayout`, so their scope is Home alone: zero Home-owned statuses initially and one after a valid submit. In the full application the routing status channel is present as well, separately. See [M3-05A](#m3-05a--shell-aware-announcement-ownership-correction).

### Rejected variants

A separate showcase route; a canonical Home implementation; Header/Footer/logo; a Storybook or component-explorer dependency; new shared `Card`, `Form` or `RadioGroup` abstractions; deep imports; importing `Link` from `react-router-dom`; a toast; an async mock submit; React Hook Form or Zod; visual snapshot baselines; an auto-announcing counter or error summary; and running a local server or E2E.

### Known limitations

The page is a technical surface with no visual-fidelity claim. The `↺` glyph is not an icon system. JSDOM and viewport sweeps cannot substitute for the manual browser review. Nothing here approves canonical Home, Header, Footer or logo consumption.

### Closure gates

M3 is **not** closed. Closure requires the independent diff audit of the corrective commit, a successful GitHub Actions run for that exact SHA, the user's browser review against the checklist, and any external canonical-source synchronisation the closure review identifies.

### M4 boundary

M4 remains the first milestone permitted to build the canonical shell — Header, Information Bar, Catalog Navigation, Footer — and to consume the brand logo at runtime. None of that is started here.

## M3-05A — Shell-aware announcement ownership correction

**Status: APPROVED AND CLOSED** — independent audit APPROVED; GitHub Actions run 30965324334, job 92177917198, checked SHA `ac24d87e2c72fed059a7dc7031d780fde502a076`, conclusion success, with 522 unit/integration tests, build and validation passing and **23 E2E passing**.

A narrow corrective pass over **test assertions and this report only**. No runtime code was changed, and M3-05 is not approved by it.

### CI evidence for the M3-05 commit

| Item         | Value                                                            |
| ------------ | ---------------------------------------------------------------- |
| Baseline SHA | `150b55d0b1e0fa7e4aa0bc5746d0328abfe5e5e3`                       |
| Run          | 30926941321                                                      |
| Run URL      | https://github.com/mangust5580/GoodCall/actions/runs/30926941321 |
| Job          | 92051591337 — `test (24.x)`                                      |
| Conclusion   | failure — `E2E tests` step only                                  |

Everything except the E2E step passed: TypeCheck, ESLint, Stylelint, Prettier, comment check, **522 unit/integration tests in 36 files**, production build and build validation. E2E ran **23 tests: 21 passed, 2 failed**.

| Failing scenario                                   | Expected | Actual |
| -------------------------------------------------- | -------- | ------ |
| `counter increments and resets without announcing` | 0        | 1      |
| `valid submit produces exactly one status result`  | 1        | 2      |

Both assertions counted `getByRole('status')` across the **whole document**. The extra element in each case is `#route-announcement`, the routing-owned live region `RootLayout` renders on every route. Expected document totals on Home are therefore 1 in the initial and counter states and 2 after a valid submit.

This is **not** an accessibility defect and **not** duplicate ownership of one event. The runtime was correct; the test scoping was shell-unaware. No runtime code change was required, and the corrective scope is tests plus documentation only.

### Correction

- Both E2E scenarios now scope their status assertions to the owner: `main#main-content` for Home, `#route-announcement` for routing. Each asserts the routing region exists, sits outside `main`, and does not carry Home's copy.
- The counter scenario keeps proving counter silence — zero Home-owned statuses before, during and after the increments and the reset, and no `role` or `aria-live` on `Counter` itself.
- The valid-submit scenario keeps proving one Home-owned status carrying exactly the success copy, no `ErrorSummary` and no `alert`.
- `tests/routes/home/home-page.test.tsx` renders `HomePage` in isolation, so its counts were already correct in that scope. Its status queries are now scoped to the rendered `main` and its names say "home-owned", so nothing there implies a document-global count. Test totals are unchanged at **36 files, 522 tests**.
- This report's announcement-ownership section now states ownership per event instead of asserting a global live-region count.

No status assertion was deleted or weakened.

### Boundaries

`src/**` is untouched — `HomePage`, Shared UI, `RootLayout`, `#route-announcement`, routing lifecycle, styles and assets are all unchanged. No dependency, lockfile, config, CI or script change. Exactly three tracked files changed: the two test files and this report.

## M3-05B — Dev MSW bootstrap restoration

**Status: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

### Why this sits inside M3

The M3 browser review was attempted at SHA `ac24d87…` and **failed before a single checklist assertion ran**. The development server returned HTTP 200 but the application never mounted: `#root` empty, no `main#main-content`, no `<h1>`, body text length 0. The cause was defect **BR-01** — MSW's worker asset had never been generated, so `worker.start()` rejected on a `text/html` response and the rejection propagated out of `bootstrap()` before `render()`.

That is an **M0 development-bootstrap defect**, not a Shared UI one. Every automated gate passed at that SHA because none of them loads the development entry point. M3-05B fixes it so the browser review can actually be performed.

### What changed

No Shared UI, Home, route, shell, routing-lifecycle, style or asset behaviour changed. `src/shared/ui/**`, `tests/shared/ui/**`, `src/routes/**`, `tests/routes/**`, `tests/e2e/bootstrap.spec.ts`, `src/app/shell/**`, `src/styles/**` and `src/assets/**` are all untouched.

The change is confined to development bootstrap: a tracked `dev-public/mockServiceWorker.js`, a `publicDir` contract that serves it in development and disables it for build and preview, an explicit worker URL derived from `import.meta.env.BASE_URL`, a fail-closed startup path with a plain-DOM fatal diagnostic, and a Chromium regression gate that loads the development entry point in CI.

Full root cause, design, production-exclusion evidence and rejected variants: [BR-01 in the M0 bootstrap report](bootstrap-report.md#br-01--development-msw-bootstrap-restoration-m3-05b).

### Effect on M3 evidence

- The 18 route-level RTL tests, the 23 E2E scenarios and the announcement-ownership contract are **unchanged**.
- Unit/integration totals move from 522 in 36 files to **533 in 37 files** — 8 new bootstrap-failure tests plus 3 `publicDir` contract tests.
- Expected CI E2E remains **23**.
- The M3 browser review is still **owed**. It has to be re-run once M3-05B is audited and green in CI. Nothing about M3-05 or M3-05A is confirmed or contradicted by this task.

M3 remains open and M4 remains blocked.

## M3-05C — Agent policy, generated artifact and verifier lifecycle reconciliation

**Status: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

### M3-05B outcome

GitHub Actions run **30968872883**, job 92188672031, checked SHA `89d20f2f633af73ba9a1cedf766b1eb5be455b82`, conclusion **success** — Dev bootstrap gate, TypeCheck, ESLint (one warning), Stylelint, Prettier, comment check, 533 unit/integration tests in 37 files, build, build validation and 23 production-preview E2E all passing, bundle raw 407.10 KB / gzip 122.19 KB.

The **independent audit nevertheless returned CHANGES REQUIRED**, with four findings: M3-POLICY-01, M3-LINT-01, M3-LIFECYCLE-01 and M3-TOOLING-01. A green CI run did not close them — none of the four is detectable by any gate in the pipeline.

### What M3-05C changes

Seven tracked files: `AGENTS.md`, `eslint.config.js`, `.prettierignore`, `package.json`, `scripts/verify-dev-bootstrap.mjs` and two implementation reports.

- **Policy.** `AGENTS.md` gains a narrow, conditional Bounded Verification Exception for `verify:dev-bootstrap` and `check:full`, keeps every other server prohibition intact, and corrects the stale "serverless `check:full`" and CI descriptions. `CLAUDE.md` is unchanged.
- **Generated artifact.** The MSW worker is excluded from ESLint and Prettier by directory ignores instead of by editing it or by a negated CLI glob. `npm run lint` now reports zero warnings.
- **Verifier lifecycle.** Context, browser and server are closed independently, port verification always runs, and cleanup failures are accumulated rather than aborting the remaining stages.

### What M3-05C does not change

The MSW worker bytes, the `publicDir` contract, the explicit worker URL, the fail-closed startup, `src/**`, `tests/**`, Shared UI, Home, routes, the shell, the routing lifecycle, `README.md`, `repository-state.md`, `.github/**`, `package-lock.json` and all remaining configuration. Unit/integration totals stay at **533 in 37 files** and expected E2E stays at **23**.

Full finding-by-finding detail: [M3-05C in the M0 bootstrap report](bootstrap-report.md#m3-05c--agent-policy-generated-artifact-and-verifier-lifecycle-reconciliation).

### Still owed

The M3 browser review remains **blocked until the corrective chain closes** — it has not been re-run and nothing about it is claimed here. M3 remains open and M4 remains blocked.

## M3-05D — Bounded browser review harness

**Status: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

### Position in the chain

M3-05B and M3-05C are **APPROVED AND CLOSED**; BR-01 is resolved and the development bootstrap is operational and CI-protected. Baseline CI for M3-05C: run 30970141078, job 92192476289, checked SHA `9ec8c671e564e1185313d3f8315288fde2e4e209`, conclusion success — Dev bootstrap green, ESLint 0 warnings, 533 tests in 37 files, build and validation green, 23 production-preview E2E passing.

The **M3 browser review is still owed.** It has never produced evidence: the first attempt was blocked by BR-01 before any assertion ran, and afterwards no policy-legal way to run a browser review existed.

### What this task adds

One repository-owned command, `npm run review:m3-browser`, plus the narrow `AGENTS.md` exception that makes it runnable. Two modes: `--automated-only`, which ends at `AUTOMATED PASS — USER SIGN-OFF PENDING`, and the default interactive mode, which opens one harness-owned headed window and collects the user's zoom, keyboard, clipping, forced-colors and screen-reader answers through the terminal.

Details of the lifecycle contract, browser isolation and the automated-versus-manual coverage split: [M3-05D in the M0 bootstrap report](bootstrap-report.md#m3-05d--bounded-browser-review-harness).

### What it does not change

No product runtime change. Shared UI, Home, routes, the shell, the routing lifecycle, the MSW worker, the `publicDir` contract and `scripts/verify-dev-bootstrap.mjs` are all untouched. Tests remain **533 in 37 files**, expected E2E remains **23**, and the bundle is unchanged at raw 407.10 KB / gzip 122.19 KB.

### Implementing the harness is not passing the review

Two `--automated-only` runs passed locally during implementation, on distinct dynamic ports, with zero axe violations and clean cleanup. That evidence is **provisional**: it was produced by a harness that has not yet been independently audited, and it carries no user sign-off. The M3 browser review must be re-run after M3-05D is approved and CI is green for its exact SHA.

Real browser zoom, real OS forced-colors mode and screen-reader behaviour remain unverified and are not claimed anywhere.

M3 remains open. M4 remains blocked.

## Next Permitted Step

The only permitted next step is an **independent diff audit of the M3-05D commit**, followed by GitHub Actions CI for it, and then the M3 browser review itself.

M4 must not begin until M3 is recorded as APPROVED AND CLOSED. No domain work is authorised by this report.

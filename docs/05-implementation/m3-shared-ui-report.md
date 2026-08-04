# M3 Shared UI Report

## Status

| Task                                                           | Status                                            |
| -------------------------------------------------------------- | ------------------------------------------------- |
| M3-01 — Shared UI scaffold, layout and accessibility utilities | **APPROVED AND CLOSED**                           |
| M3-01A — VisuallyHidden accessibility contract correction      | **APPROVED AND CLOSED**                           |
| M3-02 — Semantic action primitives                             | superseded by M3-02A                              |
| M3-02A — Action semantic ownership correction                  | **CORRECTED — AWAITING INDEPENDENT AUDIT AND CI** |

This report covers the Shared UI layer of milestone M3. It records local verification for the task under review. No approval is claimed for M3-02 and no later M3 task has started.

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

M3-01 contributed four runtime exports — `Grid`, `PageContainer`, `Stack`, `VisuallyHidden`. M3-02 added three more; the current full list is in [M3-02 runtime exports](#runtime-exports). `class-names.ts`, `action-variant.ts`, `forwarded-props.ts` and `_action-base.scss` are internal and deliberately unexported.

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

**Status: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

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

**Status: CORRECTED — AWAITING INDEPENDENT AUDIT AND CI**

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

## Next Permitted Step

The only permitted next step is an **independent diff audit of the M3-02A commit**, followed by GitHub Actions CI for it.

M3-03 must not begin until M3-02 is recorded as APPROVED AND CLOSED. No M4 work and no domain work is authorised by this report.

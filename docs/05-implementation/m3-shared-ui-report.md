# M3 Shared UI Report

## Status

IMPLEMENTED — AWAITING INDEPENDENT AUDIT

This report covers task **M3-01 — Shared UI scaffold, layout and accessibility utilities** only. It records local verification. No approval is claimed and no later M3 task has started.

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

Runtime exports are exactly `Grid`, `PageContainer`, `Stack`, `VisuallyHidden`. `class-names.ts` is internal and deliberately unexported.

### Shared prop contract

Every primitive extends `Omit<React.HTMLAttributes<HTMLElement>, 'style'>`:

- native attributes, `id`, `role` and `aria-*` pass through to the root
- `className` is supported as a root placement hook and is merged after the component's own classes
- `style` is deliberately omitted so the API cannot accept an arbitrary style map

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

## Semantics and Accessibility Ownership

- All four primitives render a plain element with no implicit role, landmark or heading. A landmark appears only when a consumer explicitly selects `as="main"`, `as="nav"`, `as="header"` or `as="footer"`.
- Children render in source order inside a single root. No primitive reorders, wraps or clones children, so DOM order and focus order always match source order.
- No primitive sets `tabindex`, `hidden`, `aria-hidden` or any live-region attribute. Announcement ownership stays with `RootLayout` and is untouched by M3-01.
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

| File                                       | Coverage                                                                                                                                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/shared/ui/page-container.test.tsx`  | Content rendering, default and selected root element, absence of implicit landmarks/headings, explicit landmark opt-in, attribute and className preservation, child DOM order, every width role |
| `tests/shared/ui/stack.test.tsx`           | Same baseline plus DOM order across both directions and every gap/alignment role                                                                                                                |
| `tests/shared/ui/grid.test.tsx`            | Same baseline plus every item-width and gap role                                                                                                                                                |
| `tests/shared/ui/visually-hidden.test.tsx` | Content presence, root elements, absence of `hidden` / `aria-hidden` / inline `style`, nested content still queryable by role, attribute preservation, child DOM order                          |
| `tests/shared/ui/public-api.test.ts`       | Public entry point exposes exactly the four approved runtime exports, each a component function                                                                                                 |

Tests assert observable contract only. They query by role, text and consumer-supplied identity, never by generated CSS Module class names, and there are no static markup snapshots.

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

## Next Permitted Step

The only permitted next step is an **independent diff audit of the M3-01 commit**.

M3-02 (semantic action primitives) must not begin until that audit approves this commit. No later M3 task, no M4 work and no domain work is authorised by this report.

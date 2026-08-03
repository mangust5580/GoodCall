# M2A Foundations Baseline Report

## Implementation Summary

M2A establishes the SCSS foundation architecture with semantic token pipeline, light-only theme baseline, and accessibility infrastructure. Existing technical M1 routes consume semantic tokens without production redesign.

## Foundation Architecture

### Structure

```
src/styles/
├── index.scss                 (imports via @use)
└── foundations/
    ├── _index.scss            (module export)
    ├── _primitives.scss       (neutral colors, technical accent, spacing, motion)
    ├── _semantic.scss         (CSS custom properties --gc-*)
    ├── _breakpoints.scss      (Sass compile-time values)
    ├── _reset.scss            (border-box, inherited fonts, semantic baseline)
    ├── _document.scss         (light theme root styles)
    ├── _typography.scss       (semantic typography roles)
    └── _accessibility.scss    (focus, motion, forced-colors)
```

### Module System

- **index.scss**: Single `@use 'foundations'` import (no legacy @import)
- **\_index.scss**: Forwards breakpoints only; uses semantic, reset, document, typography, accessibility
- **Primitive layer**: Private internal (not exported via foundation entry point)
- **No circular dependencies**: Modules follow consumption flow (primitives → semantic → components)
- **Stylelint enforces**: No @import in owned code

## Token Layers

### Primitive Layer (_primitives.scss)

Compile-time Sass variables only for internal use:

- **Neutral colors**: $neutral-white (#fff), $neutral-black (#000)
- **Technical accent**: $technical-accent (#06c), $technical-accent-visited (#703080)
- **Status**: $status-error (#c00)
- **Spacing**: $spacing-xs, -sm, -md, -lg, -xl (0.25rem–2rem)
- **Motion**: $motion-short (150ms), $motion-standard (300ms), $easing-ease-in-out

**Note**: These are temporary technical values, not canonical brand palette. No final brand colors extracted or claimed.

### Semantic Layer (_semantic.scss)

Runtime CSS custom properties with `--gc-` prefix:

**Surface/Background**:

- `--gc-surface` (white)
- `--gc-surface-elevated` (white, reserved for future layering)

**Text**:

- `--gc-text-primary` (black)
- `--gc-text-secondary` (#666)
- `--gc-text-disabled` (#999)

**Interaction**:

- `--gc-action` (#06c, technical accent)
- `--gc-action-visited` (#703080)
- `--gc-focus-ring` (#06c)

**Error/Status**:

- `--gc-error` (#c00)
- `--gc-error-subtle` (#fdd)

**Disabled States**:

- `--gc-disabled-text` (#999)
- `--gc-disabled-surface` (#f5f5f5)
- `--gc-disabled-border` (#ddd)

**Spacing** (CSS custom properties):

- `--gc-spacing-xs` through `--gc-spacing-xl`

**Typography** (CSS custom properties):

- `--gc-font-family`
- `--gc-font-size-body`, `--gc-font-size-heading-page`, `--gc-font-size-heading-section`
- `--gc-line-height-body`, `--gc-line-height-heading`

**Motion**:

- `--gc-motion-short`, `--gc-motion-standard`
- `--gc-easing-ease-in-out`

**Accessibility**:

- `--gc-focus-scroll-offset` (2rem, for :focus-visible scroll margin)

### Breakpoints (_breakpoints.scss)

Sass compile-time values only (no CSS custom properties):

```scss
$breakpoint-medium: 48rem;
$breakpoint-wide: 64rem;
$breakpoint-expanded: 80rem;
```

Mobile-first default below 48rem (no explicit compact breakpoint token).

## Light Theme Baseline

**Document Foundation** (_document.scss):

```scss
:root {
  color-scheme: light;
}

body {
  background-color: var(--gc-surface);
  color: var(--gc-text-primary);
}

a {
  color: var(--gc-action);
  &:visited {
    color: var(--gc-action-visited);
  }
}
```

- Single light theme only
- No `prefers-color-scheme: dark` media query
- Semantic token consumption at document root
- Forced-colors media query preserved for high-contrast mode

## Typography Foundation

Semantic typography roles (_typography.scss):

- **Body**: 1rem font-size, 1.5 line-height
- **Page heading (h1)**: 2rem font-size
- **Section heading (h2)**: 1.5rem font-size
- **All headings**: 1.2 line-height

All sizing uses relative units. Font family inheritance via CSS custom property. Margins use em units for context-aware spacing.

## Reset & Semantic Preservation

**Reset Strategy** (_reset.scss):

- `box-sizing: border-box` on all elements
- Font family inheritance for form controls (button, input, textarea, select)
- Image/video max-inline-size baseline (not enforcing fixed dimensions)
- Buttons and form controls: inheritance behavior preserved (no global visual reset)
- Link color inheritance (no forced color)
- Native list markers and indentation preserved (ul, ol)
- Preserved semantic meaning of headings and paragraphs

## Accessibility Foundation

**Focus Management** (_accessibility.scss):

- `:focus-visible` outline using semantic `--gc-focus-ring`
- 2px outline-offset preserved
- Fallback outline in forced-colors mode for buttons/links

**Motion**:

- `prefers-reduced-motion: reduce` disables animations/transitions
- scroll-behavior removed in reduced-motion context

**Sticky-Safe Scroll Margins**:

- `[data-route-focus]:focus` sets scroll-margin-block-start
- `#main-content:focus` sets scroll-margin-block-start
- Value: `--gc-focus-scroll-offset` (2rem)

**Forced-Colors Support**:

- Links underlined
- Buttons bordered
- No color overrides that would break high-contrast mode

## Applied to Existing Technical UI

### Global Foundation Consumption

All foundation modules provide baseline styles for document structure, typography, accessibility, and theme. Semantic tokens are available for component usage.

### Shell Styles (Shell.module.scss)

- **Skip link**: Uses `var(--gc-text-primary)` and `var(--gc-surface)` for semantic theming
- **Main element**: Uses `var(--gc-spacing-md)` for padding
- **SR-only class**: Module-scoped utility for accessible content

**No route structure changed**: Skip link functionality, main landmark, focus handling remain identical.

## Temporary vs. Canonical Values

### Temporary Technical Defaults

These placeholder values support M1 functionality pending design input:

- All color values (#000, #fff, #06c, #703080, #c00, #666, #999, #e8e8e8, #ddd, #f5f5f5, #fdd)
- System font stack (generic families, no brand font assigned)
- Spacing scale (based on 0.25rem unit grid)
- Motion durations (150ms, 300ms baselines)

### NOT Claimed as Canonical

- No extraction from FND-001 or Figma
- No brand palette validation
- No final typography family
- No production logo colors
- No icon system

### Asset Evidence Deferred

See [m2-asset-intake.md](./m2-asset-intake.md) for full handoff protocol.

## Stylelint Configuration

Updated rules to support foundation architecture:

```js
'scss/dollar-variable-empty-line-before': [
  'always',
  { except: ['first-nested', 'after-comment', 'after-dollar-variable'] }
]
'custom-property-empty-line-before': [
  'always',
  { except: ['first-nested', 'after-custom-property'] }
]
'value-keyword-case': [
  'lower',
  { ignoreKeywords: [font family names] }
]
'at-rule-disallowed-list': ['import']
```

Enforces:

- Disallows `@import` (legacy Sass imports)
- No cross-component @extend
- No invalid nesting
- No avoidable !important

## Consumption Direction

```
Primitive Tokens (Sass vars, private)
  ↓
Semantic Tokens (CSS custom properties, public API)
  ↓
Component Tokens (deferred to M2B+)
  ↓
Component Styles
```

Feature styles do NOT reference primitive tokens directly. All runtime styling consumes `--gc-*` variables.

## Test Coverage

- Unit tests: 89 passed (baseline maintained, no regressions)
- Stylelint: All rules pass
- Prettier: All files formatted
- TypeScript: No type errors
- Build: Successful, artifact validation passed

## Non-Canonical Values & Deferred Work

### M2B (Deferred, NOT Started)

- Component-specific token aliases (e.g., `--gc-button-bg`)
- Color contrast validation
- Icon system integration

### M3 (Deferred, NOT Started)

- Shared UI components

### M4 (Deferred, NOT Started)

- Canonical shell (Header/Footer)

### M5 (Deferred, NOT Started)

- First vertical slice: Category → Product → Cart

## Acceptance Criteria Met

- ✅ Sass foundation architecture implemented
- ✅ Legacy @import removed from owned code
- ✅ Primitive → semantic → component consumption flow established
- ✅ Light-only theme baseline (no dark mode)
- ✅ Semantic token prefix --gc- applied
- ✅ CSS custom properties runtime API
- ✅ Breakpoints as compile-time Sass values only
- ✅ Existing M1 technical UI consumes semantic tokens
- ✅ Reset preserves semantic HTML behavior
- ✅ Typography roles defined for current UI
- ✅ Accessibility foundation (focus, motion, forced-colors)
- ✅ Asset-intake handoff document created
- ✅ No production assets created
- ✅ M1 behavior unchanged
- ✅ Dependencies unchanged
- ✅ Routes unchanged
- ✅ No Header/Footer/Newsletter
- ✅ No dark theme or theme switcher
- ✅ Local serverless checks pass
- ✅ Unit tests: 89 passed
- ✅ Build validation: passed
- ✅ No blockers

## Ready for CI Review

This report documents M2A local verification only. GitHub Actions CI pipeline will perform independent validation. No approval is claimed.

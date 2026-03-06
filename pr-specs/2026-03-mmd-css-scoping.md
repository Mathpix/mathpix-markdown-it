# PR: CSS scoping — `#preview-content`/`#setText` specificity boost for all MMD selectors

Status: Active
Owner: @OlgaRedozubova

---

## Context

MMD styles use two scoping mechanisms:
1. **ID selectors** (`#setText h1`, `#preview-content table`) for generic HTML elements — specificity (1,0,1), already beats any host class-based CSS.
2. **Class selectors** (`.tabular`, `.figure_img`, `.itemize`, `.enumerate`, `.hljs-*`, `.proof`, `.author`, etc.) for MMD-specific elements — were bare, vulnerable to host CSS overrides with equal or higher specificity.

When MMD content is embedded on a host page (e.g., `.docs-content table { width: 100% }`), the host styles override MMD class-based rules. This caused tabular tables to stretch, figure alignment to break, list spacing to change, and syntax highlighting colors to be overridden.

---

## Goal

- Boost specificity of all MMD class selectors by adding `#preview-content`/`#setText` scoped variants.
- Keep bare selectors as fallback for `markdownToHTML()` which returns raw HTML without wrapper.
- Clean up dead code, fix bugs, restructure style modules for readability.
- No new wrapper elements, no breaking changes to HTML output or public API signatures.

---

## Scoping Strategy

### Pattern: bare + scoped

Every MMD class selector now follows this pattern:

```css
.selector,
#preview-content .selector, #setText .selector {
    /* styles */
}
```

- **Bare** (0,1,0) — fallback for `markdownToHTML()` consumers without `#setText`/`#preview-content` wrapper.
- **Scoped** (1,1,0) — beats host `.docs-content .selector` (0,1,x) when inside containers.

### Exceptions (bare only, no scoped)

| Selector | Reason |
|---|---|
| `.math-block`, `.math-inline`, `.math-error` | `math-` prefix is distinctive enough; no known collisions |
| `mjx-container` | Custom element, cannot collide with host CSS |
| `*[data-has-dotfill]`, `*[data-has-dotfill] .dotfill` | `data-` attribute scoping is sufficient |
| `svg .math-inline`, `svg mjx-container`, etc. | SVG context selectors |

### Exceptions (scoped only, no bare)

| Selector | Reason |
|---|---|
| `code`, `pre code`, `pre`, `table`, `blockquote`, `img`, `sup`, `h1`–`h6` | Generic HTML elements — bare selectors would affect all elements on host page |

---

## Non-Goals

- Adding a `.mmd` wrapper class (rejected: `#setText` already serves as wrapper).
- Renaming CSS classes `.tabular` → `.mmd-tabular` (rejected: breaking change with no real benefit).
- Shadow DOM encapsulation.

---

## Existing Protection (no changes needed)

| Element | Protection | Mechanism |
|---|---|---|
| Generic `<h1>`–`<h6>`, `<table>`, `<blockquote>`, `<pre>`, `<code>` | `#setText`, `#preview-content` | ID specificity (1,0,1) |
| `.tabular` display | `display: inline-table !important` | `!important` |
| `.tabular td` borders, padding | `border-style: none !important`, `padding !important` | `!important` |
| `.tabular tr` borders | `border-top/bottom: none !important` | `!important` |
| `<td>` text-align | `style="text-align: ..."` | Inline style |
| `<ul>/<ol>` list-style-type | `style="list-style-type: ..."` | Inline style |
| `<blockquote>` margins, padding | `style="margin: ...; padding: ..."` | Inline style (forDocx) |

---

## Changes by File

### `src/styles/index.ts` — restructured into sub-functions

Monolithic `MathpixStyle` function split into 10 named sub-functions composed via array join:

```typescript
export const MathpixStyle = (...) => [
  layoutStyles({ setTextAlignJustify, maxWidth, isPptx }),
  mathStyles(maxWidth),
  imageStyles(),
  blockquoteStyles(useColors),
  codeBlockStyles(useColors),
  tableStyles(useColors),
  docStructureStyles(),
  inlineTextStyles(useColors),
  miscStyles(),
  printStyles(),
].join('');
```

Scoped selectors added for: `.proof`, `.theorem`, `.main-title`, `.author`, `.section-title`, `.abstract`, `.text-url`, `mark`, `span[data-underline-type] mark`, `.smiles`, `div.svg-container`.

Dead code removed: `.empty` (never generated), `.preview-right` (used as id, not class), `scaleEquation` parameter (accepted but never used in CSS output).

Specificity side-effect fix: `.tabular` had `margin: 0` which at (0,1,0) was overridden by `#setText table { margin-bottom: 1em }` (1,0,1). After scoping, `#setText .tabular` (1,1,0) beats `#setText table` (1,0,1), dropping the margin. Fixed by replacing `margin: 0` with `margin: 0 0 1em` so `.tabular` explicitly declares its own bottom margin. Additionally, `font-size: inherit` and other defensive defaults now ensure `.tabular` renders consistently regardless of context (e.g., standalone vs nested inside a list) — previously, list context could affect table width and font size via cascade.

`useColors=false` color leaks fixed: blockquote `border-left`, table `border`, and `mark` `background-color` now gated behind `useColors`.

Bug fix: `div.svg-container` child combinator consistency (`>` for both `#preview-content` and `#setText`).

### `src/styles/styles-tabular.ts` — replaced `.table_tabular .tabular` with ID scoping

Before (commit f0e068a): specificity boosted via `.table_tabular .tabular` compound selector.
Now: replaced with `#preview-content .tabular, #setText .tabular` — cleaner, consistent with other files.

```css
.tabular,
#preview-content .tabular, #setText .tabular {
    display: inline-table !important;
    width: auto;
    /* ... */
}
```

Also scoped: `.table_tabular`, `.tabular th/tr/td/td>p`, `.tabular td._empty`, `.tabular td .f`, `.figure_img`, `div.figure_img img`, dark theme selectors.

Note: `.sub-table` rule moved here from `index.ts` (where it didn't belong).

### `src/styles/styles-code.ts` — scoped hljs, normalized indentation

All 19 `.hljs-*` rule blocks now follow bare + scoped pattern. Indentation normalized from 6 to 8 spaces.

### `src/styles/styles-lists.ts` — scoped all selectors

All list selectors (`ol.enumerate`, `ul.itemize`, `.li_enumerate`, `.li_level`, `.not_number`) now have bare + scoped variants.

### `src/styles/halpers.ts` → `src/styles/helpers.ts` — renamed, cleaned up

- Fixed typo in filename: `halpers` → `helpers`
- Fixed `max-width:` formatting (added space after colon)
- Added scoped variants for `.math-block`, `.smiles`, `.smiles-inline`, `.table_tabular`
- Combined h1-h6 `::-webkit-scrollbar` into single `hideScroll()` call
- Normalized indentation

### `src/mathpix-markdown-model/index.ts`

- Import path updated: `halpers` → `helpers`
- Removed `scaleEquation` from `StyleBundleOpts` interface, `buildStyles()`, and all public method signatures

### `tests/_styles.js`

- Updated `MathpixStyle` calls: removed `scaleEquation` argument
- Updated `max-width` assertion: `'max-width:800px;'` → `'max-width: 800px;'`
- All 68 tests pass

### Snapshot files

All 16 `tests/_data/_styles/*.snap.css` files regenerated.

---

## Style system improvements (from prior commits)

### `buildStyles(opts: StyleBundleOpts)` — single style builder

All 4 style assembly points (`loadMathJax`, `getMathpixStyleOnly`, `getMathpixStyle`, `getMathpixMarkdownStyles`) delegate to a single `buildStyles()` method.

```typescript
interface StyleBundleOpts {
    setTextAlignJustify?: boolean;
    useColors?: boolean;
    maxWidth?: string;
    isPptx?: boolean;
    resetBody?: boolean;
    container?: boolean;
    mathjax?: boolean;
    code?: boolean;       // default: true
    preview?: boolean;
    toc?: boolean;
    tocContainerName?: string;
    menu?: boolean;
}
```

Module composition per caller:

| Module | loadMathJax | getMathpixStyleOnly | getMathpixStyle | getMathpixMarkdownStyles |
|---|:---:|:---:|:---:|:---:|
| resetBody | conditional | - | - | - |
| container | - | - | + | + |
| mathjax | - | + | + | + |
| MathpixStyle | + | + | + | + |
| code | + | + | + | - |
| tabular | + | + | + | + |
| lists | + | + | + | + |
| preview | - | - | if stylePreview | - |
| toc | + | - | if preview+toc | - |
| menu+clipboard | + | + | if stylePreview | - |

### `loadMathJax` DOM re-injection fix

Previously, if `#Mathpix-styles` already existed in the DOM, `loadMathJax()` skipped style update entirely. Now it updates `innerHTML` of the existing element.

### `useColors` propagation

Added `useColors` parameter to `loadMathJax`, `getMathpixStyleOnly`, `getMathpixStyle` — passed through to all style functions.

### `codeStyles` conversion

Converted from static string to function accepting `useColors` parameter.

### Pre-existing bug fixes

- Missing dot: `math-inline svg` → `.math-inline svg` in `@media print`
- Missing dot: `svg math-block` → `svg .math-block`
- Unscoped selectors: `h1, h2, ...` → `#setText > h1, #setText > h2, ...`
- Missing template interpolation: `#{containerName}` → `#${containerName}` in TocStyle
- Dead code: removed empty `if (showToc) {}`

---

## Downstream Impact

- Consumers that override MMD class selectors (e.g., `#preview-main .tabular { width: 100% }`) at specificity (1,1,0) — same as the new scoped selectors. Consumer styles that load after MMD styles win by cascade order. No breakage expected.
- Consumers with their own `.math-block`/`.math-inline` SCSS — bare selectors preserved, no breakage.
- `auto-render.ts` uses `querySelectorAll('.math-inline, .math-block')` — DOM query, not affected by CSS changes.

---

## Constraints / Invariants

- HTML output class names unchanged — no downstream breakage.
- Public API methods unchanged — same signatures, same output.
- Inherited CSS properties (`font-family`, `color`, `line-height`) intentionally cascade from host into MMD content.

---

## Done When

- [x] All MMD class selectors scoped via `#preview-content`/`#setText` (or justified exception)
- [x] Defensive defaults for tables, figures, lists
- [x] `.table_tabular .tabular` replaced with ID scoping
- [x] hljs selectors scoped in styles-code.ts
- [x] lists selectors scoped in styles-lists.ts
- [x] `halpers.ts` → `helpers.ts` rename + cleanup
- [x] `index.ts` restructured into sub-functions
- [x] Dead code removed (`scaleEquation`, `.empty`, `.preview-right`)
- [x] `buildStyles(opts)` single builder with `StyleBundleOpts`
- [x] `loadMathJax` DOM re-injection fix
- [x] `useColors` propagated through all style functions
- [x] Pre-existing bugs fixed
- [x] Snapshot + composition + buildStyles tests (68 tests)
- [x] All existing tests pass
- [ ] PR reviewed and merged

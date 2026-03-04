# PR: Add defensive CSS defaults to MMD class selectors

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

MMD styles use two scoping mechanisms:
1. **ID selectors** (`#setText h1`, `#preview-content table`) for generic HTML elements — specificity (1,0,1), already beats any host class-based CSS.
2. **Class selectors** (`.tabular`, `.figure_img`, `.itemize`, `.enumerate`) for MMD-specific elements — these are effectively namespaced (unique to MMD), but lacked defensive defaults for properties commonly overridden by host CSS.

When MMD content is embedded on a host page (e.g., `.docs-content table { width: 100% }`), the host styles override MMD class-based rules for properties that MMD didn't explicitly set. This caused tabular tables to stretch, figure alignment to break, and list spacing to change.

---

## Goal

- Add defensive default styles to existing MMD class selectors so they resist common host CSS overrides.
- No new wrapper elements, no CSS duplication, no breaking changes.
- Hosts still need `:not(.tabular)` etc. for their OWN generic element styles — this is expected and unavoidable (the library cannot prevent a host from styling its own `<table>` elements).

---

## Non-Goals

- Adding a `.mmd` wrapper class (rejected: `#setText` already serves as wrapper; `.mmd` would duplicate CSS ~2× for no specificity gain on generic elements).
- Renaming CSS classes `.tabular` → `.mmd-tabular` (rejected: these names are already unique to MMD; renaming is a breaking change with no real benefit).
- Shadow DOM encapsulation.
- Protecting generic HTML elements (`<h1>`, `<blockquote>`, `<pre>`, `<code>`) — these are already scoped via `#setText`/`#preview-content` ID selectors.

---

## Why Not `.mmd` Wrapper?

Considered and rejected for these reasons:
1. `#setText` already provides ID-scoped wrapper — adding `.mmd` is redundant.
2. `.mmd table` specificity (0,1,1) = `.docs-content table` (0,1,1) — no specificity gain for generic elements.
3. Every CSS rule would need duplication (`.tabular, .mmd .tabular`), roughly doubling CSS payload.
4. `markdownToHTML()` returns raw HTML without wrapper — consumers would need to manually add `<div class="mmd">`.

---

## Why Not Rename Classes?

`.tabular`, `.figure_img`, `.itemize`, `.enumerate`, `.math-block` etc. are already effectively namespaced — no CSS framework uses these names. Renaming to `.mmd-tabular` would be a breaking change for downstream consumers who parse class names, with no practical benefit.

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

## Changes: Defensive Defaults Added

### `src/styles/styles-tabular.ts`

```css
/* Prevent host "table { width:100%; table-layout:fixed }" */
.table_tabular .tabular, .tabular {
    width: auto;
    table-layout: auto;
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0;
    font-size: inherit;
}

/* Prevent host "th { background; font-weight:600 }" — (0,2,1) beats (0,1,2) */
.table_tabular .tabular th {
    background-color: transparent;
    font-weight: bold;
}

/* Prevent host "tr:nth-child(2n) { background }" — (0,2,1) beats (0,1,2) */
.table_tabular .tabular tr {
    background-color: transparent;
}

/* Prevent host "td { background; word-break }" — (0,2,1) beats (0,1,2) */
.table_tabular .tabular td {
    background-color: #fff;
    word-break: keep-all;
}

/* Prevent host "img { display:block; margin:16px 0 }" — (0,1,2) beats (0,1,1) */
div.figure_img img {
    display: inline;
    margin: 0;
}
```

Note: `.table_tabular .tabular` prefix gives (0,2,x) specificity which beats `.docs-content table *` (0,1,x). `div.figure_img img` (0,1,2) beats `.docs-content img` (0,1,1). Bare `.tabular` kept as fallback for the table element itself.

### `src/styles/styles-lists.ts`

```css
/* Prevent host "ul { margin: 0 0 24px }" */
ol.enumerate, ul.itemize {
    margin: 0 0 1em 0;
}

/* Reset nested list margin */
li > ol.enumerate, li > ul.itemize {
    margin: 0;
}

/* Prevent host "li { margin-bottom: 4px }" */
ul.itemize > li {
    margin-bottom: 0;
}
.enumerate > .li_enumerate {
    margin-bottom: 0;
}
```

Note: `ul.itemize > li` specificity (0,1,2) beats `.docs-content li` (0,1,1). `.enumerate > .li_enumerate` specificity (0,2,0) also beats (0,1,1).

### `src/styles/index.ts`

```css
/* Bug fix: missing dot before math-inline in @media print */
.math-block svg, .math-inline svg { margin-top: 1px; }
```

### Also fixed: duplicate selectors

Removed duplicate selectors in original code: `.tabular tr, .tabular tr` → `.tabular tr`, `.tabular td, .tabular td` → `.tabular td`, `.table_tabular table th, .table_tabular table th` → `.table_tabular table th`.

---

## Style system improvements

### `buildStyles(opts: StyleBundleOpts)` — single style builder

All 4 style assembly points (`loadMathJax`, `getMathpixStyleOnly`, `getMathpixStyle`, `getMathpixMarkdownStyles`) now delegate to a single `buildStyles()` method. Old methods remain as thin wrappers for backward compatibility.

```typescript
interface StyleBundleOpts {
    setTextAlignJustify?: boolean;
    useColors?: boolean;
    maxWidth?: string;
    scaleEquation?: boolean;
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

Previously, if `#Mathpix-styles` already existed in the DOM, `loadMathJax()` skipped style update entirely — even if parameters changed. Now it updates `innerHTML` of the existing element.

### `useColors` propagation

Added `useColors` parameter to `loadMathJax`, `getMathpixStyleOnly`, `getMathpixStyle` — passed through to all style functions. Previously hardcoded to `true`.

### `codeStyles` conversion

Converted from static string to function accepting `useColors` parameter. Code/pre background and base text color now respect `useColors`.

### Bug fixes in `src/styles/index.ts`

- Missing dot: `math-inline svg` → `.math-inline svg` in `@media print`
- Missing dot: `svg math-block` → `svg .math-block`
- Unscoped selectors: `h1, h2, ...` → `#setText > h1, #setText > h2, ...`
- Missing template interpolation: `#{containerName}` → `#${containerName}` in TocStyle
- Assignment expression: `scaleEquation = true` → `scaleEquation` in getMathpixMarkdownStyles
- Dead code: removed empty `if (showToc) {}`

### Types and formatting

- Added explicit `: boolean` types to all style function parameters
- Added `: string` return types to all style functions
- Extracted shared `COLOR_CODE_BG = '#f8f8fa'` constant
- Fixed formatting: trailing whitespace, double spaces, indent consistency

### Snapshot tests

Added `tests/_styles.js` with 46 tests:
- 16 snapshot tests for individual style functions (all param variants)
- 30 composition tests verifying assembly methods include correct modules

---

## Files Changed

| File | Change |
|---|---|
| `src/styles/styles-tabular.ts` | Boost specificity via `.table_tabular .tabular` prefix; add defensive defaults; `div.figure_img img`; types |
| `src/styles/styles-lists.ts` | Add `margin` to `ol.enumerate, ul.itemize`; nested list reset; `margin-bottom: 0` to list items |
| `src/styles/styles-code.ts` | Convert to function with `useColors` param; import `COLOR_CODE_BG` |
| `src/styles/styles-container.ts` | Add explicit types |
| `src/styles/index.ts` | Bug fixes; `COLOR_CODE_BG` constant; types; formatting |
| `src/mathpix-markdown-model/index.ts` | `StyleBundleOpts` interface; `buildStyles()` method; `loadMathJax` DOM re-injection fix; `useColors` propagation; old methods as wrappers |
| `tests/_styles.js` | New: 46 snapshot + composition tests |
| `tests/_data/_styles/*.snap.css` | New: 16 snapshot files |

---

## Constraints / Invariants

- HTML output class names unchanged — no downstream breakage.
- `#setText` / `#preview-content` CSS selectors unchanged.
- Public API methods (`getMathpixStyle`, `getMathpixStyleOnly`, `getMathpixMarkdownStyles`) unchanged — same signatures, same output.
- Inherited CSS properties (`font-family`, `color`, `line-height`) intentionally cascade from host into MMD content.
- Hosts still need `:not(.tabular)`, `:not(.itemize)` etc. to apply their own styles to non-MMD elements — this is expected behavior, not a bug.

---

## Done When

- [x] Defensive styles added for tables (width, table-layout, border-collapse, border-spacing, margin, font-size, th background/font-weight, tr background)
- [x] Defensive styles added for figures (display, margin)
- [x] Defensive styles added for lists (ul/ol margin, nested list margin reset, li margin-bottom)
- [x] Duplicate selectors cleaned up
- [x] `buildStyles(opts)` single builder with `StyleBundleOpts`
- [x] `loadMathJax` DOM re-injection fix
- [x] `useColors` propagated through all style functions
- [x] `codeStyles` converted to function
- [x] Pre-existing bugs fixed (missing dots, unscoped selectors, template interpolation, dead code)
- [x] Types and formatting cleaned up
- [x] Snapshot + composition tests added (46 tests)
- [x] PPTX converter baseCss updated to override library list margins
- [x] All existing tests pass (3205)
- [x] Status updated to Implemented

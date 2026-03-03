# PR: Add `.mmd` wrapper class for CSS scoping

Status: Draft
Owner: @OlgaRedozubova

---

## Context

MMD styles use `#setText` / `#preview-content` ID selectors for scoping, plus global class selectors (`.tabular`, `.figure_img`, `.enumerate`, `.itemize`, `.math-block`, etc.). When MMD content is embedded on a host page with its own CSS (e.g., `.docs-content table { width: 100% }`), the host styles override MMD class-based rules due to equal or higher specificity.

This causes table/figure/list rendering conflicts on host pages. The only workaround is adding `:not(.tabular)`, `:not(.itemize)`, etc. on the host side — fragile and requires every host to replicate.

---

## Goal

- Add `.mmd` as an additional CSS scoping class so MMD styles win over typical host CSS via higher specificity.
- Allow host pages to use simple generic selectors (`.docs-content table { ... }`) without `:not()` exclusions.
- No breaking changes: existing `#setText`/`#preview-content` selectors remain; `.mmd` is additive. HTML class names on rendered elements do not change.

---

## Non-Goals

- Renaming CSS classes (`.tabular` → `.mmd-tabular`) — avoids breaking downstream consumers.
- Shadow DOM encapsulation.
- Changing `ContainerStyle()` — global reset used only for standalone HTML pages, not injected by `loadMathJax()`.

---

## How It Works: Specificity

With `.mmd` as ancestor, all MMD selectors gain one extra class in specificity:

| Host CSS selector | Spec | MMD selector (with `.mmd`) | Spec | Winner |
|---|---|---|---|---|
| `.docs-content table` | (0,1,1) | `.mmd .tabular` | (0,2,0) | **MMD** |
| `.docs-content table th` | (0,1,2) | `.mmd .table_tabular table th` | (0,2,2) | **MMD** |
| `.docs-content table td` | (0,1,2) | `.mmd .tabular td` | (0,2,1) | **MMD** |
| `.docs-content img` | (0,1,1) | `.mmd .figure_img img` | (0,2,1) | **MMD** |
| `.docs-content ul` | (0,1,1) | `.mmd ul.itemize` | (0,2,1) | **MMD** |
| `.docs-content li` | (0,1,1) | `.mmd .itemize > li` | (0,2,1) | **MMD** |

In all cases, 2 classes > 1 class — MMD wins regardless of element count.

---

## Current Behavior

- Host CSS like `.docs-content table { width: 100% }` stretches MMD tabular tables.
- Host `img { border-radius: 8px; margin: 16px 0 }` adds unwanted styling to `.figure_img` images.
- Host `ul/ol { padding-left: 24px; list-style: disc }` overrides MMD list spacing/markers.
- Host `li { margin-bottom: 4px }` adds extra spacing to MMD list items.
- Host `table th { background; font-weight; text-align }` overrides MMD tabular headers.
- Host pages must work around this with `:not()` selectors to exclude MMD elements.

---

## Desired Behavior

- MMD tabular tables, figures, and lists render correctly regardless of host CSS, without the host needing `:not()` exclusions.
- Existing rendering in `#setText` / `#preview-content` wrappers is unchanged.
- All existing consumers of the library are unaffected.

---

## Approach

Add `.mmd` class to all MMD output wrappers. Duplicate all CSS rules with `.mmd` as ancestor selector, keeping originals for backward compatibility.

### Style file changes

For every `#setText`/`#preview-content` scoped rule, add `.mmd` as a third selector:
```css
#setText table, #preview-content table, .mmd table { ... }
```

For every unscoped rule, add `.mmd`-prefixed duplicate:
```css
.tabular, .mmd .tabular { display: inline-table !important; ... }
```

Files: `src/styles/index.ts`, `styles-tabular.ts`, `styles-lists.ts`, `styles-code.ts`, `halpers.ts`.

### Defensive styles (new, `.mmd`-only)

Explicit resets to protect MMD elements from common host CSS patterns:

```css
/* Prevent host "table { width:100%; table-layout:fixed }" */
.mmd .tabular { width: auto; table-layout: auto; border-collapse: collapse; border-spacing: 0; }

/* Prevent host "table { margin; font-size }" */
.mmd .table_tabular table { margin: 0; font-size: inherit; }

/* Prevent host "th { background; font-weight:600; text-align:left }" */
.mmd .table_tabular table th { background: transparent; font-weight: bold; text-align: center; }

/* Prevent host "tr:nth-child(2n) { background }" from striping tabular rows */
.mmd .tabular tr { background-color: transparent; }

/* Prevent host "img { display:block; margin:16px 0; border-radius:8px }" */
.mmd .figure_img img { display: inline; margin: 0; border-radius: initial; border: none; box-shadow: none; }

/* Prevent host "ul { margin: 0 0 24px }" from adding unexpected spacing */
.mmd ol.enumerate, .mmd ul.itemize { margin: 0 0 1em 0; }

/* Reset margin on nested MMD lists */
.mmd li > ol.enumerate, .mmd li > ul.itemize { margin: 0; }

/* Prevent host "li { margin-bottom: 4px }" */
.mmd .itemize > li, .mmd .li_enumerate, .mmd .li_itemize { margin-bottom: 0; }
```

Properties already protected by existing rules (no additional defense needed):
- `.tabular { display: inline-table !important }`, `.tabular td { border-style: none !important; padding: ... !important }`, `.tabular tr { border-top/bottom: none !important }`
- `<td>` text-align — inline `style=` attribute on elements
- `<ul>/<ol>` list-style-type, padding — inline `style=` attribute on elements

### Wrapper changes

- React component (`src/components/mathpix-markdown/index.tsx`): add `className="mmd"` to `#setText` div.
- `render()` (`src/mathpix-markdown-model/index.ts`): add `class="mmd"` to `#setText` in HTML string.
- `generateHtmlPage()` (`src/mathpix-markdown-model/html-page.ts`): add `class="mmd"` to `#preview-content`.

### Documentation

When using `markdownToHTML()` (which returns raw HTML without a wrapper), users should wrap the output in a `<div class="mmd">` container to get proper style isolation:

```html
<div class="mmd">
  ${markdownToHTML(input, options)}
</div>
```

---

## Files Changed

| File | Change |
|---|---|
| `src/styles/index.ts` | Add `.mmd` to all scoped rules, add `.mmd` ancestor to all unscoped rules |
| `src/styles/styles-tabular.ts` | Add `.mmd` ancestor to all rules, add defensive table/figure resets |
| `src/styles/styles-lists.ts` | Add `.mmd` ancestor to all rules, add defensive list item resets |
| `src/styles/styles-code.ts` | Add `.mmd` to scoped rules, add `.mmd` ancestor to `.hljs-*` rules |
| `src/styles/halpers.ts` | Add `.mmd` ancestor to unscoped rules |
| `src/components/mathpix-markdown/index.tsx` | Add `className='mmd'` to `#setText` div |
| `src/mathpix-markdown-model/index.ts` | Add `class="mmd"` to `#setText` in `render()` |
| `src/mathpix-markdown-model/html-page.ts` | Add `class="mmd"` to `#preview-content` in `generateHtmlPage()` |

---

## Constraints / Invariants

- HTML output class names (`.tabular`, `.enumerate`, `.figure_img`, etc.) must not change — downstream consumers parse them by name.
- Existing `#setText` / `#preview-content` CSS selectors must remain — backward compatibility for all current consumers.
- Inherited CSS properties (`font-family`, `color`, `line-height`) intentionally cascade from host into MMD content.
- This approach beats host selectors with 1 class. Hosts using 2+ classes in selectors (e.g., `.page .docs-content table`) may still override — acceptable for ~95% of real-world cases; `!important` and source order handle the rest.

---

## Observability

N/A — CSS-only change with no runtime side effects.

---

## Done When

- [ ] All style files updated with `.mmd` selectors (additive, backward-compatible)
- [ ] Defensive styles added for tables (width, table-layout, border-collapse, border-spacing, margin, font-size, th background/font-weight/text-align, tr background)
- [ ] Defensive styles added for figures (display, margin, border-radius, border, box-shadow)
- [ ] Defensive styles added for lists (ul/ol margin, nested list margin reset, li margin-bottom)
- [ ] React component, `render()`, and `generateHtmlPage()` add `class="mmd"` to wrappers
- [ ] All existing tests pass
- [ ] Manual verification: test page with hostile host CSS confirms MMD renders correctly inside `<div class="mmd">`
- [ ] Status updated to Implemented

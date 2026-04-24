# PR: Optimize tabular parsing performance

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Parsing and rendering large documents with many `\begin{tabular}` blocks was slow and memory-hungry. The benchmark document — a 16 MB MMD with 13,713 tabular blocks, ~479K `<td>` cells, and ~49K inline math expressions — showed a peak heap of 2.6 GB for the full SVG/HTML render path.

Profiling revealed three classes of waste:

1. **Algorithmic**: `getSubMath()` rebuilt the placeholder string on every math expression found (O(N×M)); several lookup tables used `Array + findIndex()`; MathJax was invoked for every math token, including 67% duplicates.
2. **Per-token allocation**: CSS border strings, `attrs` arrays, and close-token objects were allocated fresh for every `<td>`/`<tr>`/`<table>` even though the underlying content was identical across thousands of tokens.
3. **Speculative output**: `renderInlineTokenBlock` always built all five outputs (HTML, TSV, CSV, tableMd, tableSmoothed) regardless of which one the caller actually consumed; `token.mathEquation` was stored on every math token even when the caller only walked the token tree.

---

## Goal

Reduce parse time and memory usage for documents with many tabular environments and repeated math expressions. Avoid building per-token data that the caller will not read.

---

## Non-Goals

- Persistent cross-parse MathJax cache (decided against — complexity outweighs benefit for the supported use cases; cache is per-parse via `state.env`).
- Migrating all module-level state to `state.env` (tracked in the sibling `global-state-cleanup-and-perf.md` spec).
- Changing the markdown-it Token shape (kept for downstream compatibility).

---

## Done When

- [x] `getSubMath` is iterative single-pass
- [x] `mathTable` is `Map<string, string>`
- [x] Per-parse math cache in `state.env.__mathpix` deduplicates identical math
- [x] Cache bypass for `SetItemizeLevelTokens` forDocx mutation
- [x] Accessibility `mjx-mml-*` IDs remain unique on cache hits
- [x] `outMath.skipMathToHtml` option — skips SVG serialization and `token.mathEquation` storage for token-only callers
- [x] Border-style strings pre-interned; composed cell style deduplicated per parse
- [x] Shared attrs arrays for `td_open` / `tr_open` / `table_open` / `tbody_open` with clone-on-write
- [x] Frozen singleton close-tokens for `td_close` / `tr_close` / `table_close`
- [x] `StatePushTabulars` skips `content` / `children = []` assignments on marker tokens
- [x] `res.concat` → in-place `res.push` inside the tabular construction loop
- [x] `renderInlineTokenBlock` and `renderNonTableTokenIntoCell` build each output only when the caller requested it via `options.outMath.include_*`
- [x] HTML-visual attrs (style, `_empty` class, `table_tabular` class, `border-*` tr style) skipped when the caller sets `forMD` or `forLatex`
- [x] `token.mathData.svg` retained only when highlights are active
- [x] Empty `labels` object is returned as `null` from MathJax `OuterData` (no empty `{}` per math token)
- [x] All 3,286 tests pass
- [x] New unit tests cover: `getSubMath` edge cases, math-cache dedup/bypass/isolation, accessibility ID uniqueness, cell-attrs sharing, round-trip placeholder restoration

---

## Architecture

### Iterative getSubMath (sub-math.ts)

Single-pass scan with a local `new RegExp(RE_MATH_OPEN.source, 'g')`:
- `RE_MATH_OPEN` stored as literal without the `/g` flag (immutable template)
- Each call creates a local copy — reentrant-safe
- The `startPos: number = 0` optional parameter is preserved for signature compatibility with the earlier recursive implementation; it is seeked to via `re.lastIndex = startPos` before the scan loop
- `getEndMarker()` uses capture groups for eqref/ref detection (no substring matching)
- `shouldSkipDollar()` validates `$`/`$$` edge cases
- `mathTablePush()` accepts both `(id, content)` and `({id, content})` for backward compatibility

### colsToFixWidth: Array → Set (parse-tabular.ts)

The per-table set of column indices that need fixed width was tracked as a `number[]` with `.includes()` + `.push()` for dedup — O(N²) in cell count for wide tables. Converted to a local `Set<number>` with `.add()` (O(1) dedup). Converted to a plain array once at `tableOpen.meta.colsToFixWidth` assignment so downstream consumers (`shouldRewriteColSpec`) keep their existing array input shape. Removes four identical `if-includes-push` fragments along the way.

### Dead split/join round-trips removed (common.ts)

`getColumnLines` and `getColumnAlign` ended with `.split('').join('')` — an identity operation that allocates a per-call character array for nothing. The neighbouring `.split('').join(' ')` (which inserts spaces between characters) is not a no-op and is preserved.

### Per-parse math cache (convert-math-to-html.ts)

```
state.env.__mathpix = {
  inlineCache:  Map<math, CachedResult>,   // inline_math tokens
  displayCache: Map<math, CachedResult>,   // display_math tokens
  cacheBypass:  number,                    // >0 disables cache
}
```

Initialized by the `init_math_cache` core-ruler hook. On cache hit with accessibility, the original `mjx-assistive-mml` id is replaced with a fresh one from `MathJax.nextAssistiveId()`.

Cache hits mark the returned `TypesetResult` with `_labelsRegistered: true` so `convertMathToHtml` skips the label-registration loop — the `state.md.inline.parse` for every `\label{}` tag and the `addIntoLabelsList` side-effect already ran on the first miss and are idempotent for the same key+content. `idLabels` is still computed from `Object.keys(token.labels)` so downstream ref/eqref resolution is unaffected.

### `outMath.skipMathToHtml` (convert-math-to-html.ts)

When set, `applyTypesetResultToToken` does not copy the serialized math HTML to `token.mathEquation`, and `typesetMathForToken` path 4 forces `outMath.include_svg = false` for the MathJax call so the SVG string is never built. Other MathJax outputs (mathml_word, asciimath, metrics) still populate when the caller enabled them.

### Pre-interned border styles + per-parse style intern (tabular-td.ts)

`verticalCellLine` / `horizontalCellLine` switch on the line token and return one of 16 module-level border strings (solid/double/dashed/none × 4 sides) — template-literal allocation per call is gone. The composed cell style (`composeCellStyle`) is interned in a per-parse `columnStyleCache` so repeated cells share a single string instance.

### Shared attrs for structural tabular tokens

`getSharedCellAttrs(style, isEmpty, skipVisual)`, `getSharedTableOpenAttrs(extraClass?, skipVisual)`, `getSharedTbodyOpenAttrs(numCol)`, and `getSharedTrOpenAttrs(skipVisual)` return read-only attrs arrays cached per-parse by key. The shared arrays carry the non-enumerable `Symbol.for('mathpix.tabular.attrsShared')` marker so mutation sites (`tokenAttrSet` in the tabular renderer, `addAttributesToParentTokenByType` in utils) detach a private clone before writing.

### Frozen close-token singletons

`td_close`, `tr_close`, `table_close`, and `tbody_close` (non-forLatex only) have no variable data. A single `Object.freeze`d instance per kind is exported and pushed everywhere these markers appear. Under `forLatex`, `tbody_close` carries a per-table `latex` payload and is allocated per-instance.

`StatePushTabulars` no longer assigns `content` / `children = []` onto marker tokens — those fields are never read on open/close markers and assignment would throw on the frozen close singletons. The multi-column branch of `parse-tabular.ts` also pushes `SHARED_TD_CLOSE` directly instead of allocating a fresh `{token:'td_close', ...}` object per cell.

`addStyle` / `addHLineIntoStyle` (`tabular-td.ts`) check the input attrs for the `attrsSharedMarker` symbol and clone before mutating so that callers which pass in a shared-attrs array do not corrupt the cached object.

### Output gating in renderInlineTokenBlock / renderNonTableTokenIntoCell

The tabular renderer computes flags via a shared `computeOutputGates(options)` helper and only populates the outputs the caller asked for:

```ts
const { needHtml, needTsv, needCsv, needMd, needSmoothed } = computeOutputGates(options);
// needHtml: !forMD && include_table_html !== false
// needTsv/needCsv: include_tsv / include_csv
// needMd: forMD || include_table_markdown
// needSmoothed: forPptx
```

`renderInlineTokenBlock` and `renderNonTableTokenIntoCell` both use the same helper so their gating cannot drift. Every `result += ...`, `arr*.push(...)`, `cellMd += ...`, and `formatTsvCell` / `formatCsvCell` call is gated on the corresponding flag.

Leaf-token handling still invokes `slf.renderInline([token], options, env)` even when `needHtml` is false — the `latex_list_item_open` render rule sets `token.meta.itemizeLevel` as a side effect, which `handleListTokensForCellMarkdown` reads to emit list markers.

### HTML-visual attrs skipped for forMD / forLatex

`td_open.style`, `td_open.class='_empty'`, `tr_open.style`, `table_open.class='tabular'`, and the `table_tabular` class + text-align style on the wrapping `paragraph_open` are HTML/CSS-only. When the caller sets `forMD` or `forLatex`, `AddTd` / `AddTdSubTable` / `getMultiColumnMultiRow` / `StatePushParagraphOpen` skip these. Colspan / rowspan on multicol/multirow cells and `paragraph_open.data-align` (for forLatex) are preserved.

### mathData.svg only retained under highlights

`applyTypesetResultToToken` shallow-clones `mathData` without the `svg` field unless `options.highlights?.length` is set. The SVG is still available on `token.mathEquation` (the HTML render rule path) — only the duplicate copy on `mathData` is dropped. The highlight render path re-populates `mathData.svg` in `convertMathToHtmlWithHighlight`. Invariant: the `highlights` length is read at parse time; mutating `options.highlights` between parse and render does not retroactively re-populate `mathData.svg`.

### Hot-path outMath spread memoization (skipMathToHtml path)

`typesetMathForToken` under `skipMathToHtml: true` forces `include_svg: false` for the MathJax call. The spread `{ ...options.outMath, include_svg: false }` would run per math token (~49K times on the benchmark). A `WeakMap<outMath, clone>` cache memoizes the spread — first token pays the allocation, the rest reuse the cached clone. GC-friendly: when the parse's `options.outMath` is released, the cache entry goes with it.

### OuterData empty-labels guard (mathjax/index.ts)

When the current equation has no labels, `res.labels` is set to `null` instead of `{...emptyObject}` so each math token does not carry an empty `{}` allocation.

### res.concat → res.push in tabular construction

Tabular token arrays are assembled in a hot loop. `res = res.concat(data.res)` allocated a new array on every iteration; replaced with `for (const t of data.res) res.push(t)` to mutate in place.

---

## Public API changes

| Option | Type | Default | Effect |
|--------|------|--------:|--------|
| `outMath.skipMathToHtml` | boolean | `false` | When `true`, skips SVG serialization and `token.mathEquation` storage; other MathJax outputs still respect their own `include_*` flags. Intended for callers that walk tokens directly and never read the serialized math HTML. |

No other options introduced. Existing flags — `options.forMD`, `options.forLatex`, `options.forDocx`, `options.forPptx`, `outMath.include_tsv` / `include_csv` / `include_table_html` / `include_table_markdown`, `options.highlights` — drive the output-gating decisions described above.

---

## Memory impact

Benchmark document: 16 MB MMD with 13,713 tabular blocks, ~479K `<td>` cells, and ~49K inline math expressions.

### Full SVG/HTML render path

| Stage                   | Before  | After  | Δ            |
|-------------------------|--------:|-------:|-------------:|
| Peak heap (html held)   | 2597 MB | 778 MB | −1819 (−70%) |
| Heap after drop html    | 1887 MB |  68 MB | −1819 (−96%) |
| Parse time              |  17.9 s | 14.6 s |        −18%  |
| HTML output size        |  355 MB | 355 MB |             0 |

### Token-only path (`forMD: true`, `outMath.skipMathToHtml: true`)

| Stage                   | Before  | After  | Δ            |
|-------------------------|--------:|-------:|-------------:|
| Peak heap               | 2597 MB | 443 MB | −2154 (−83%) |
| Heap after drop output  | 1887 MB |  81 MB | −1806 (−96%) |
| Parse time              |  17.9 s | 20.5 s |               |
| Serialized output size  |  355 MB | 165 MB |        −190  |

Parse time on the token-only path includes more bookkeeping but skips SVG serialization; wall-clock depends heavily on which MathJax outputs the caller enables.

---

## Files Changed

| File | Change |
|------|--------|
| `src/markdown/md-block-rule/begin-tabular/sub-math.ts` | Iterative `getSubMath`; `mathTable` Array→Map; `mathTablePush` overload; `getEndMarker` with capture groups |
| `src/markdown/md-block-rule/begin-tabular/tabular-td.ts` | Pre-interned border strings; `columnStyleCache` per-parse intern; `getSharedCellAttrs` / `getSharedTableOpenAttrs` / `getSharedTrOpenAttrs` / `getSharedTbodyOpenAttrs` with clone-on-write marker; frozen `SHARED_TD_CLOSE` / `SHARED_TR_CLOSE` / `SHARED_TABLE_CLOSE`; `skipVisual` pathway in `AddTd` / `AddTdSubTable` |
| `src/markdown/md-block-rule/begin-tabular/parse-tabular.ts` | Derives `skipVisual = forMD \|\| forLatex`; gates style-only calls (`addHLineIntoStyle`, shared attrs helpers); `res.concat` → `res.push` in the construction loop |
| `src/markdown/md-block-rule/begin-tabular/multi-column-row.ts` | `getMultiColumnMultiRow` honors `skipVisual`; colspan/rowspan always preserved, style/width skipped under the flag |
| `src/markdown/md-block-rule/begin-tabular/index.ts` | `StatePushTabulars` skips `content` / `children = []` on open/close markers; `StatePushParagraphOpen` gates class/style on `forMD \|\| forLatex`, preserves `data-align` for forLatex |
| `src/markdown/md-inline-rule/tabular.ts` | Subtable `table_open` uses `getSharedTableOpenAttrs('subtable')` instead of mutating shared attrs |
| `src/markdown/md-renderer-rules/render-tabular.ts` | Clone-on-write `tokenAttrSet`; per-output `needHtml` / `needTsv` / `needCsv` / `needMd` / `needSmoothed` gates throughout `renderInlineTokenBlock` and `renderNonTableTokenIntoCell`; leaf-token `renderInline` retained for list-marker side effect |
| `src/markdown/common/convert-math-to-html.ts` | Per-parse cache in `state.env.__mathpix`; `initMathCache`; `beginCacheBypass` / `endCacheBypass`; accessibility ID replacement; `outMath.skipMathToHtml` path that disables SVG serialization and `mathEquation` storage; `mathData.svg` gated on `options.highlights` |
| `src/markdown/mdPluginRaw.ts` | Registers `init_math_cache` core-ruler hook |
| `src/markdown/md-latex-lists-env/re-level.ts` | `beginCacheBypass` / `endCacheBypass` around forDocx mutation; `try/finally` for `outMath` restoration |
| `src/markdown/utils.ts` | Clone-on-write in `addAttributesToParentTokenByType` (shared attrs marker) |
| `src/mathjax/index.ts` | `OuterData` returns `null` for empty `labels` instead of an empty `{}` clone |
| `tests/_sub-math.js` | Unit tests for `getSubMath` edge cases |
| `tests/_typeset-cache.js` | Tests for dedup, env isolation, mutation protection, accessibility IDs, bypass counter, forDocx integration, mathData svg gating |
| `tests/_accessibility.js` | Tests for unique IDs with cache, aria-labelledby consistency |

---

## Testing

- All 3,286 tests pass
- `outMath.skipMathToHtml` is opt-in; existing callers see identical output
- Shared attrs + close-token singletons verified correct under highlight/diagbox/forDocx paths (tests exercise cloning)
- MD list markers in tabular cells verified — leaf-token `renderInline` is still invoked so the `latex_list_item_open` render rule can set `token.meta.itemizeLevel`

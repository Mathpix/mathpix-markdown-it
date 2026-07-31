# July 2026

## [3.1.0] - List rendering robustness fixes

Fixes for LaTeX `itemize`/`enumerate` lists that rendered incorrectly on several inputs:

- Marker padding is now measured for block-content items too (`\begin{figure}`/`\begin{tabular}`/code fence), so a list whose long-marker items all hold block content no longer loses its `padding-inline-start`.
- Marker width is measured more accurately, so markers no longer get too small an indent: East-Asian Wide/Fullwidth characters are measured as wide glyphs (`\item[11．]`, U+FF0E, no longer undercounted vs `\item[11.42]`); math markers (`\item[$x^4+x^4$]`) use their rendered `widthEx` instead of contributing 0; wrapped markers (`\item[\textbf{…}]`) and code-span markers (`\item[\`x\`]`) are measured through their content. Edge whitespace in a marker (`\item[  wide  ]`) no longer inflates the padding — the marker is measured trimmed, as it renders. Shared width helpers now live in `common/display-width.ts`.
- Empty `<>` list-item bodies (from a leaked `env.isBlock`) are fixed on two independent paths: the speculative list parse now restores its transient env fields on every exit (abort/silent/commit/exception), and a `tabular` inside a list no longer carries those flags into its `envToInline` snapshot (which `core-inline` replays onto the shared env). An unclosed `itemize` before a `tabular`, and a closed figure-list followed by a `tabular`-list, now render correctly instead of empty `<>`.
- Caption numbering (`Figure N` / `Table N`) is no longer inflated by a speculative list parse: the figure/table counters are rolled back when the parse is discarded (silent probe / abort). A `\footnote` after a list containing a `\begin{figure}` no longer shifts the number, and a figure inside a list is now `Figure 1` (was `Figure 3` due to the pre-existing paragraph-terminator probe). The counters moved to the leaf module `common/caption-counters.ts`; the deep-import helpers `ClearTableNumbers`/`ClearFigureNumbers` (formerly on `md-block-rule/begin-table`) are renamed `clearTableNumbers`/`clearFigureNumbers` and live there now — not part of the package's public entry, so only deep imports are affected.
- Marker `padding-inline-start` is now emitted in `em` (was `px`) so it scales with the container `font-size`. This also fixes math markers being clipped: a `7.329ex` math marker reserved `51px` but rendered ~68px — math width now comes from the rendered `widthEx` (converted to em), and text width from a per-glyph-class estimate (narrow `. i l space` < normal < wide `capitals m w`) plus a `0.625em` gap. The default (non-custom) list indent moves `40px` → `2.5em`; custom padding is emitted only when it exceeds the default, so it never resolves below `2.5em`, and is clamped at `20em` so a pathological OCR marker can't blow out the content column. Measured against actual font metrics, 3.0.1's flat `14px`/char over-reserved narrow/digit markers by 36–70% while under-reserving all-caps by ~14%; the per-glyph-class estimate holds a +11…+27% margin across both — so narrow/normal markers get a tighter (correct) indent and all-caps get a wider (safer) one; very short markers now fall to the default indent. Math markers, and math without a `widthEx` (non-SVG output), are unchanged. Marker padding is attributed per nesting level: the default `2.5em` is kept on every list, and a custom indent is emitted only when a marker overflows the accumulated ancestor indent plus that default — so a wide marker in a nested list no longer inflates the outer list, ordinary nested lists (numbering, bullets) stay at the default, and only a genuinely wide nested marker reserves extra (just the shortfall over the ancestor indent). This holds regardless of how the list is written — own-line, same-line, or fully single-line / in a table cell all resolve identically (a single-line or in-cell list, which the block rule can't loop over, now reserves too). **Migration:** `data-padding-inline-start` now holds an em value with its unit (e.g. `"3.51em"`, was a bare px number) — downstream consumers reading this attribute must update.
- `\item` detection now requires a real `\item` command: the bare word "item" (no backslash), and `\item`-prefixed commands like `\itemsep`/`\itemindent`, are no longer mistaken for `\item`. A list-item body that mentions "item" — including a multiline `\footnote`/`\footnotetext` inside the item — no longer splits into a spurious item or leaks the footnote as literal text. (Pre-existing; the item-command regexes now anchor on `\item` + a command boundary.)
- The `\footnote`/`\footnotetext` block rules stop at a `\begin{itemize}`/`\begin{enumerate}`, so a list right after a paragraph (no blank line) whose item holds a multiline footnote renders as a list instead of literal text. The LaTeX list rule is added to the footnote terminators (`latex_footnotetext_block` gets it in its full set; `latex_footnote_block` adds it to its `fence`-only scan). This is also a performance fix: without it, repeated paragraph + list-with-footnotetext units without blank separators made the footnote scan run across every list into the rest of the document — O(N²); terminating at the list makes it linear (guarded by a scaling test). `Lists` gains a first-char fast bail (no substring allocation) since it now runs as a per-line terminator. A silent `Lists` probe no longer mutates the shared `env`.
- Core-markdown lists (`<ul>`/`<ol>`, no `.itemize`/`.enumerate`) now indent by `2.5em` instead of the browser default `40px`, so the indent scales with the container `font-size` (matching LaTeX lists; identical at a 16px base where `2.5em = 40px`). This also covers the generated footnotes list (`<ol class="footnotes-list">`), which had no explicit padding. Scoped to `#preview-content`/`#setText` per the CSS-scoping rules; raw `markdownToHTML()` output without a wrapper is unchanged. LaTeX lists (`.itemize`/`.enumerate`) are unaffected (higher-specificity class rules).

See `pr-specs/2026-07-list-rendering-robustness.md`.

### Code-block styles scale with the em context

Code-text styles were pinned to absolute values (`pre code` `font-size: 15px` / `line-height: 24px` / `padding: 1rem`, `pre` `font-size: 85%`), so a code block did not scale when a consumer sized a rendered block by setting a single `font-size` on the container (e.g. image export) — everything else scaled but the code stayed ~15px. The four properties are now relative (`pre` `font-size: 0.9375em`; `pre code` `font-size: inherit`, `line-height: 1.6`, `padding: 1em`), so a code block scales with its `em` context. Calibrated so that at a 16px base the code text is pixel-identical to before (15px glyphs, 24px line box); the only visible change is code padding, 16px → 15px. Note `pre code` now inherits `font-size` from `pre`, so a consumer that sized code via `pre` now also affects the code text (before, the absolute `15px` on `pre code` won). Styles only; no HTML/markup change.

See `pr-specs/2026-07-code-block-font-scaling.md`.

## [3.0.1] - Preserve code indentation inside list/table/align env wrappers

Fenced code and `lstlisting` inside LaTeX environment wrappers kept their leading whitespace instead of collapsing flush-left:

- **Lists** (`\begin{itemize}`/`\begin{enumerate}`): fenced code (```` ``` ````/`~~~`) is treated as an opaque region and stored raw, so indentation, blank lines and `~~~` are preserved; `~~~` now renders as a code block.
- **Table/align wrappers** (`\begin{table}`/`\begin{figure}` and `\begin{center}`/`\begin{left}`/`\begin{right}`): `lstlisting` inside the wrapped `tabular` keeps its indentation, matching a bare `tabular`. A shared helper `appendEnvAwareContentLine` stores lines raw only while inside a `lstlisting` (detected with `indexOf`, so mid-cell `C &\begin{lstlisting}` works); normal wrapper content stays de-indented, so wrapped-tabular output (CSV/TSV) is unchanged.

Known limitation: a bare ```` ``` ````/`~~~` fence written directly in a `tabular` cell (not wrapped in `lstlisting`) still renders inline — deferred to a follow-up.

See `pr-specs/2026-07-code-indentation-in-env-wrappers.md`.

# June 2026

## [3.0.0] - Math delimiter mode (strict double-backslash handling) and lstlisting mathescape `\$` rendering

**Breaking change.** New `mathDelimiterMode?: 'strict' | 'legacy'` option (default **`'strict'`**) controls whether DOUBLE-backslash delimiters `\\( ... \\)` and `\\[ ... \\]` are treated as math.

- `'strict'` (default): only single-backslash `\(` / `\[` (and `$` / `$$`) open math. `\\(` is **not** a math delimiter — it follows CommonMark escape semantics (`\\` → literal `\`) and renders as literal text.
- `'legacy'`: also accept `\\(` / `\\[` as math openers — the behavior inherited from `markdown-it-mathjax`, default in all versions ≤ 2.x.

**Migration:** versions ≤ 2.x rendered `\\( ... \\)` as math. Under the new `'strict'` default such content renders as literal `\(...\)`. Consumers that rely on double-backslash delimiters (e.g. pasted / legacy MathJax-era content) must pass `mathDelimiterMode: 'legacy'` explicitly. Single-backslash `\(`/`\[` and `$`/`$$` are unaffected.

- Threaded onto `md.options` (via `markdownToHTML` / `markdownToHTMLSegments` / `render` / `convertToHTML` and the `MathpixMarkdown` React component) so the `multiMath` inline rule honors it.
- lstlisting `[mathescape=true]` is verbatim code: in `'strict'`, `\\(` inside a listing stays literal (the math-only parser uses a verbatim backslash rule instead of the default escape, so code is never collapsed); single `\(` is still math (what `mathescape` enables).
- Browser auto-render (`renderMathInElement`) honors `mathDelimiterMode` (`config.mathDelimiterMode`, default `'strict'`) for symmetry with the server parser.
- Both modes pinned with golden tests: `tests/_math-delimiter-mode.js`, `tests/_auto_render.js`.

See `pr-specs/2026-06-math-delimiter-mode.md`.

### lstlisting mathescape: literal `\$` rendering

Inside a `[mathescape=true]` listing, a run of backslashes immediately before `$` drops exactly one backslash and the `$` is a literal dollar (`\$` → `$`, `\\$` → `\$`); only a bare `$` toggles math. Scoped to `$` only — `\(` / `\[` / `\\(` / `\\[` delimiter handling is unchanged. Plain listings (no `mathescape`) are unaffected. Copy-to-clipboard and a mathescape listing inside a table cell reflect the same un-escaped text via a math-aware `token.meta.codeText`. `verbatimBackslash` in `parse-math-escape-inline.ts`; pinned by `tests/_lstlisting-mathescape-dollar.js`.

See `pr-specs/2026-06-lstlisting-mathescape-dollar-render.md`.

# May 2026

## [2.0.40] - Tabular vertical-align bracket and footnote performance

- Tabular vertical alignment:
  - Parse the optional `[t]/[c]/[b]` bracket on `\begin{tabular}` (standard LaTeX2e syntax) and use it as the row-level vertical-align default for `l/c/r/S` columns. Per-column `m`/`p`/`b` continues to override.
  - Cell-level inference: when an outer cell's content includes a nested `\begin{tabular}[t/c/b]`, the outer `<td>` inherits that vertical-align (matching LaTeX baseline semantics — the cell containing the `[t]` inner tabular sits at the top of the row). Per-column `m`/`p`/`b` on the outer column still wins. Cell-level inference overrides the row-level bracket for that single cell.
  - In `forLatex`, every `td_open` of a tabular with an effective bracket carries `meta.parentBracket` (`'t'`/`'c'`/`'b'`) — the bracket of THIS table, set on every cell of that table. Consumers walking forLatex tokens see parent context directly on each `<td>` without re-deriving from the parent `table_open`. `AddTd` and `AddTdSubTable` accept an optional `meta?: TTdMeta` parameter to attach this and other forLatex-specific cell info.
  - New option `defaultCellVerticalAlign?: 'top' | 'middle' | 'bottom'`. HTML rendering: applies as the fallback for `\begin{tabular}` blocks without an explicit bracket. Explicit source bracket always wins. Default unset is byte-identical to legacy on existing MMD. `'middle'` propagates to regular `l/c/r/S` cells (matches existing default), but is a no-op for `\multicolumn` / `\multirow` cells (preserves legacy no-vertical-align on multicol).
  - `forLatex` round-trip: for `'top'`/`'bottom'` (top-level only) the option's value is injected into `tableOpen.meta.bracket` so the consumer can serialize `\begin{tabular}[pos]{...}`. Nested absent-bracket tabulars stay bracket-less to preserve round-trip.
  - `\multicolumn` / `\multirow` cells inherit `'t'`/`'b'` from any source (bracket or option), and `'c'` only from an explicit source bracket — never from option `'middle'`. Plain `\multicolumn{}` / `\multirow{}` in an absent-bracket tabular continues to emit no `vertical-align` (legacy).
  - Diagbox cells always render with `vertical-align: middle` regardless of the outer tabular's bracket: `getSubTabular` flags wrappers with `hasDiagbox`, the parser skips its own vertical-align emit, and `render-tabular` adds `middle` once. Removes the duplicate `vertical-align: middle;` from existing diagbox snapshots.
  - Explicit `\multirow[t/c/b]` always wins over the row-level default and emits explicit `vertical-align`. Fixes a regression where `\multirow[c]` inside `\begin{tabular}[t]{...}` silently inherited the outer `[t]` instead of honoring the user's explicit `[c]`. Two existing `\multirow[c]` snapshots in `_tabular/_data_digbox.js` updated to include the now-explicit `vertical-align: middle`.
  - **Breaking change** to the exported `openTag` / `openTagG` regexes in `md-block-rule/begin-tabular`: the optional `[pos]` bracket is now a capture group. New shape is `match[1]` = bracket pos (`t`/`c`/`b` or `undefined`), `match[2]` = column spec. Previously `match[1]` = column spec. Consumers calling `openTag.exec(src)[1]` / `src.match(openTag)[1]` for the column spec must read `[2]` instead. `openTagTabular` and `BEGIN_TABULAR_INLINE_RE` (presence-check regexes) likewise allow the optional bracket but keep their existing capture groups.
  - `getParams` (column-spec parser) now skips an optional `[pos]` before `{` and returns the normalized bracket position.

- Footnote rule performance:

- `latex_footnote_block` / `latex_footnotetext_block`: per-state position cache + per-line token guard turn the O(N×M) accumulation scan into one O(|src|) sweep per parse and O(1) per subsequent block-start. ~120× speedup on a 2.45 MB MMD with 706 long tabular blocks (worst case for the pre-change Phase 1 scan); HTML output byte-identical.
- `setChildrenPositions`: per-child `Object.isExtensible` guard before `.positions` assignment fixes `TypeError` thrown by frozen `SHARED_*_CLOSE` singletons inside `tabular_inline` subtrees, restoring `markdownToHTMLSegments({ addPositionsToTokens: true })` on documents with inline subtables. `link_open` branch split into strict-triple `[text](url)` (legacy snapshot-pinned math) + span fallback for fancy contents (`[**bold**](url)`, `` [`code`](url) ``, `[![alt](img)](url)`) — fixes silent NaN/off-by-N positions that existed on master.
- `BeginTheorem`: env-name validation hoisted above `state.push` in non-silent mode — unregistered environments no longer leave unmatched `<div class="theorem_block">` wrappers in the rendered HTML. Silent-mode terminator probes preserved (required by `\newtheorem` ↔ `\begin{NAME}` adjacent-line handshake).
- Behavior change for unregistered `\begin{NAME}…\end{NAME}` (e.g. TikZ): previously the rule emitted an unmatched `<div class="theorem_block">` wrapper around a math-block fallback `<span class="math-block equation-number" number="0"></span>`. Now the wrapper is gone; the inner placeholder is unchanged. `.equation-number` element count is unchanged vs master. Register via `\newtheorem{NAME}{…}` to get the body rendered.
- Behavior change for `markdownToHTMLSegments` consumers: same documents emit more segments than before because the previously unmatched wrapper was preventing segment delimiters from breaking at natural boundaries. Output bytes are unchanged; segment counts are not.
- Behavior change for highlights consumers: fancy-link span fallback (`[**bold**](url)` etc. with overlapping `highlights:`) emits empty `<span class="mmd-highlight"></span>` wrappers around markup-only inner tokens (strong_open/strong_close). Filter empty `.mmd-highlight` matches if iterating.

See `pr-specs/2026-05-footnote-perf-and-parser-invariants.md` for design and known limitations.

# April 2026

## [2.0.39] - Optimize tabular parsing memory and performance

- Algorithms:
  - Rewrote `getSubMath()` from recursive to iterative single-pass (O(N×M) → O(N+M)); `getMathTableContent()` now uses `parts[]` + `join()` instead of repeated slice+concat. The `startPos: number = 0` optional parameter is preserved for signature compatibility with deep-import consumers.
  - `colsToFixWidth` in the tabular parser converted from `Array` + `.includes()` + `.push()` to `Set<number>` for O(1) dedup-on-insert. Previous code was O(N²) in cell count for wide tables; Set path is O(N). Converted to array once at `tableOpen.meta` assignment.
  - Removed two dead `.split('').join('')` round-trips in `common.ts` (`getColumnLines` and `getColumnAlign`) — identity operations that allocated a per-call character array. The `.split('').join(' ')` call on the next line is NOT a no-op and is preserved.
  - `mathTable`, `subTabular`, `extractedCodeBlocks` converted from Array + `findIndex()` to Map for O(1) lookups.
  - `labelsByKey` + `labelsByUuid` Map indexes; `labelsList` export kept as a deprecated backward-compatible `Proxy` that returns a version-cached snapshot of `labelsByKey.values()` — snapshot is rebuilt only when the underlying map changes. Mutations (`.push`, index assignment) target the throwaway target array and are effectively ignored.
  - `diagboxById` reverse Map + `ClearDiagboxTable()`.
  - `buildInlineCodePositionSet()` returns `Set<number>` for O(1) position checks in `findEndMarker` (previously O(n×m) per character).
  - `tagRegexCache` memoizes HTML block regexes; fixed `lastIndex` corruption by swapping `.test()` on g-flag regex for `.match()`.
  - `utf8Encode`: `parts[]` + `join()` instead of O(n²) string concat.
  - `SetItemizeLevelTokens`: saves/restores only `outMath` with `try/finally`.
  - `mathTablePush` accepts both `(id, content)` and `({id, content})` forms (backward-compatible overload).
  - `mathpixMarkdownPlugin`: shared `envToInline` object per table to avoid hundreds of thousands of object copies on large documents.

- Per-parse math cache:
  - Added `state.env.__mathpix` cache (following markdown-it-footnote convention) that deduplicates identical `inline_math` / `display_math` expressions within a single parse. No persistence between parses, no public API options.
  - Cache exclusions: `equation_math` / `equation_math_not_number` (numbering side effects), `inline_mathML` / `display_mathML` (different MathJax path), `return_asciimath` tokens (ascii extraction side effects).
  - Cache bypass via `beginCacheBypass` / `endCacheBypass` when `outMath` is temporarily mutated (e.g. `SetItemizeLevelTokens` for `forDocx`).
  - Accessibility IDs (`mjx-mml-*`) regenerated on cache hit so every token keeps a unique DOM id.
  - Cache hits mark the returned result with `_labelsRegistered: true`; `convertMathToHtml` then skips the per-label `state.md.inline.parse()` + `addIntoLabelsList()` loop (the two are idempotent for the same key+content). `idLabels` is still recomputed from `Object.keys(token.labels)`.

- Token-tree retention fixes:
  - `mdPluginTOC`: stored the parse state on a module-level `gstate` variable so the TOC render rule could reach the top-level token list. The reference was never cleared and pinned the entire token tree across unrelated parses. The token list is now stashed on `state.env[TOC_ENV_KEY]` and released with the env when the parse ends.
  - `coreInline`: rebound `state.env` to a fresh object inside the inline loop. That desynced state.env from the env reference the caller of `md.render(src, env)` still held, so parse-time mutations (TOC / cache) became invisible to render rules. Now mutates state.env in place and uses a private `inlineEnv` for the nested `inline.parse()` call. The same pattern was applied to the deeper recursive walker `walkInlineInTokens` (footnote / tabular deep-walk paths).

- Per-parse cross-plugin state reset (`reset_mmd_global_state` core-ruler hook, before `normalize`):
  - Module-level state in sub-plugins (TOC slug registry, theorem/figure/section counters, labels Map, footnote list, itemize marker token trees, list-depth stack, size counter, MathJax equation counter) was previously cleared only at `md.use(plugin)` time or inside the `initMathpixMarkdown.parse` / `renderer.render` wrappers. Direct users of `markdownIt().use(mathpixMarkdownPlugin)` who reused one md instance across documents saw drift: extra `-2`/`-3` TOC slug suffixes, bumped theorem/section numbers, stale `\ref{}` IDs, stale footnote refs, retention of old `\renewcommand{\labelitemi}` token trees.
  - The new hook clears all of the above at the start of every `md.parse()`. It respects `renderElement.startLine` and skips on partial re-renders so cross-references inside an enclosing parse are preserved.
  - Also fixes a latent leak in `parse-error.ts` — `ParseErrorList` had a `ClearParseErrorList()` function that was never called anywhere; tabular parse errors accumulated monotonically.
  - Exported `resetMmdGlobalState()` from the package root so one-shot converters (e.g. DOCX export) can release module-level state immediately after render without waiting for the next parse. Module-level state that render needs (labels, theorems, footnotes, etc.) is otherwise retained until the next `md.parse()` fires the hook.

- Segment balance fix in `markdownToHtmlPipelineSegments`:
  - The segments renderer tracked a single `pendingCloseTag` + `pendingLevel` pair. A nested same-type same-level `_open` (e.g. md-theorem wraps an inner `paragraph_open` at level 0 inside the outer `paragraph_open` class `theorem_block`) caused the first `paragraph_close` to terminate the segment mid-block, producing `<div><div>...</div>` in one segment and `</div></div>...` in the next.
  - Added a `pendingDepth` counter: nested opens of the same type at the same level now increment depth; the segment closes only when depth drops back to zero. Covered by `tests/_html-segments.js` across 38 scenarios exercising all block rules from `mmdRules.ts`.

- Additional parse-only retention fixes:
  - `cleanup_math_cache` core-ruler hook (pushed, end of pipeline) clears `state.env.__mathpix`. Previously the per-parse math dedup cache was only initialized, never released, so MathJax html/svg strings for every unique expression stayed on env until the caller dropped it (200+ MB on math-heavy docs in long-lived processes).
  - `mdPluginTOC.grab_state` stashes `state.tokens` on `state.env[TOC_ENV_KEY]` only when the document actually used `[[toc]]` — detected by a one-pass scan of inline-token children for `toc_body`. Documents without `[[toc]]` no longer pay the cost of retaining the whole token tree on env.

- Two-hook tabular-state cleanup:
  - `reset_tabular_state` core-ruler hook (before `normalize`) clears tabular module-level state at the start of every `md.parse()`.
  - New `cleanup_tabular_state` hook (pushed, end of core pipeline) drops parse-only caches (`subTabular`, `mathTable`, `extractedCodeBlocks`, `diagboxTable`, column-style intern cache) at the end of parse — they're never read during render. Both hooks respect `renderElement.startLine` for partial renders.

- Per-token allocation reduction:
  - Pre-interned 16 border-style strings (`border-{top,bottom,left,right}-style`: solid / double / dashed / none) replace per-cell template-literal allocations.
  - `columnStyleCache` per-parse intern for the composed `<td>` style string.
  - `getSharedCellAttrs` / `getSharedTableOpenAttrs` / `getSharedTbodyOpenAttrs` / `getSharedTrOpenAttrs` return read-only shared attrs arrays keyed by (style, isEmpty) / (extraClass, numCol). Shared arrays carry the non-enumerable `Symbol.for('mathpix.tabular.attrsShared')` marker; mutation sites (`tokenAttrSet` in the tabular renderer, `addAttributesToParentTokenByType` in utils) clone-on-write before writing.
  - Frozen singleton close-token markers: `SHARED_TD_CLOSE`, `SHARED_TR_CLOSE`, `SHARED_TABLE_CLOSE`, and `SHARED_TBODY_CLOSE` (non-forLatex only — under `forLatex`, `tbody_close` carries a per-table `latex` payload and is allocated per-instance). The multi-column branch of `parse-tabular.ts` also pushes `SHARED_TD_CLOSE` directly instead of allocating a fresh close-token per cell.
  - `addStyle` / `addHLineIntoStyle` check the input attrs for the `attrsSharedMarker` symbol and clone before mutating so that callers which pass in a shared-attrs array do not corrupt the cached object.
  - `StatePushTabulars` no longer assigns `content` / `children = []` onto open/close markers — those fields are never read on markers and assignment would throw on the frozen close singletons.
  - Replaced `res = res.concat(...)` with in-place `res.push(...)` inside the tabular construction loop to remove intermediate array allocations.
  - `applyTypesetResultToToken` drops `svg` from `token.mathData` when `options.highlights` is not set — the field is only read by `renderMathHighlight` (active under highlights); the default render rule uses `token.mathEquation`. The highlight path re-populates `mathData.svg` in `convertMathToHtmlWithHighlight`.
  - `OuterData` returns `null` for empty `labels` instead of cloning an empty `{}` onto every math token.

- Output gating in the tabular renderer:
  - `renderInlineTokenBlock` and `renderNonTableTokenIntoCell` build each output only when the caller requested it via a shared `computeOutputGates(options)` helper: `needHtml` (`!forMD && include_table_html !== false`), `needTsv` (`include_tsv`), `needCsv` (`include_csv`), `needMd` (`forMD || include_table_markdown`), `needSmoothed` (`forPptx`). Both call sites use the same helper so gates cannot drift. Every `result += ...`, array push, `cellMd +=`, and `formatTsvCell` / `formatCsvCell` call is gated on the corresponding flag.
  - Leaf-token handling still calls `slf.renderInline([token], options, env)` even when `needHtml` is false — the `latex_list_item_open` render rule sets `token.meta.itemizeLevel` as a side effect that `handleListTokensForCellMarkdown` reads to emit list markers.
  - `renderTabularInline` short-circuits early when `forMD: true` and neither TSV/CSV/markdown output is requested, avoiding an empty `<div class="inline-tabular"></div>` wrapper.

- HTML-visual attrs skipped for non-HTML outputs:
  - `td_open` style / `_empty` class, `tr_open` border-reset style, `table_open` `class='tabular'`, and the `table_tabular` class + text-align style on the wrapping `paragraph_open` are HTML/CSS-only. When the caller sets `forMD` or `forLatex`, `AddTd` / `AddTdSubTable` / `getMultiColumnMultiRow` / `StatePushParagraphOpen` skip those assignments. Multicol/multirow cells still carry `colspan` / `rowspan`; `paragraph_open.data-align` is preserved for `forLatex`.

- New public option:
  - `outMath.skipMathToHtml` (default `false`). Declared on the exported `TOutputMath` type. When `true`, `applyTypesetResultToToken` skips `token.mathEquation` and `typesetMathForToken` passes `include_svg: false` to MathJax so the SVG string is never serialized. Takes precedence over `include_svg`; other MathJax outputs respect their own `include_*` flags. Intended for callers that walk the token tree directly and never read the serialized math HTML. The per-token outMath clone used here is memoized via `WeakMap` to avoid ~49K spread allocations on large documents.

- Review-follow-up cleanups:
  - `computeOutputGates(options)` helper extracted so both tabular render sites use identical gating.
  - `attrsSharedMarker` centralized in `common/consts.ts` (was duplicated in `tabular-td.ts`, `utils.ts`, `render-tabular.ts`).
  - `getSharedTableOpenAttrs(extraClass, skipVisual=true)` now also drops `class='tabular'` under `skipVisual` (previously leaked the HTML-only class for subtable cases).
  - `getSubTabular` guards the direct Map lookup by a UUID-pattern regex so UUID-looking cell text cannot collide with a stored key.
  - `subTabular` / `mathTable` module-level Maps marked `const` (never reassigned; only `.set` / `.clear` / `.get`).
  - Regression test pins `envToInline` render isolation between blocks sharing `state.env`.

- Cleanup:
  - Removed dead file `src/markdown/mdPluginSeparateForBlock.ts` (and its `lib/*` artifacts). It was never registered with markdown-it; its two core rules (`separateForBlock`, `separateBeforeBlock`) shipped in the initial 2019 commit and never wired in.

- Benchmark (16 MB MMD with 13,713 tabular blocks, ~479K `<td>` cells, ~49K inline math expressions):

  Full SVG/HTML render path:

  | Stage                   | Before  | After  | Δ            |
  |-------------------------|--------:|-------:|-------------:|
  | Peak heap (html held)   | 2597 MB | 778 MB | −1819 (−70%) |
  | Heap after drop html    | 1887 MB |  68 MB | −1819 (−96%) |
  | Parse time              |  17.9 s | 14.6 s |        −18%  |

  Token-only path (`forMD: true`, `outMath.skipMathToHtml: true`):

  | Stage                   | Before  | After  | Δ            |
  |-------------------------|--------:|-------:|-------------:|
  | Peak heap               | 2597 MB | 443 MB | −2154 (−83%) |
  | Heap after drop output  | 1887 MB |  81 MB | −1806 (−96%) |
  | Serialized output size  |  355 MB | 165 MB |        −190  |

- Docs:
  - Implementation details in `pr-specs/2026-04-optimize-tabular-parsing.md` and `pr-specs/2026-04-global-state-cleanup-and-perf.md`.

# March 2026

## [2.0.38] - Fix infinite loop in `inlineMmdIcon` and `inlineDiagbox` silent mode

- Bug Fix:
  - Fixed page freeze when `\icon{...}` or `\diagbox{...}` appeared inside link labels (e.g. `[\icon{unknown}]`). The inline rules returned `true` in silent mode without advancing `state.pos`, causing an infinite loop in markdown-it's `parseLinkLabel` → `skipToken`.

- Refactoring:
  - `inlineMmdIcon` and `inlineDiagbox` refactored to follow the `if (!silent) { ... } state.pos = endPos; return true;` pattern used by all other inline rules.
  - `mmd-icon.ts`: extracted `endPos` constant, eliminated 6 duplicated position assignments.
  - `diagbox-inline.ts`: moved `extractNextBraceContent` before the silent check so `endIndex` is available in both modes.

- Tests:
  - Added 4 test cases for icon and diagbox inside link labels and bare brackets.

- Docs:
  - Added implementation details in `pr-specs/2026-03-fix-silent-mode-state-pos.md`.

## [2.0.37] - CSS scoping and style module cleanup

- CSS Scoping:
  - All MMD class selectors now have `#preview-content`/`#setText` scoped variants for specificity boost.
  - Bare selectors preserved as fallback for `markdownToHTML()` (no wrapper).

- Style Architecture:
  - New `buildStyles(opts: StyleBundleOpts)` single CSS builder — all assembly methods delegate here.
  - `MathpixStyle` restructured into 10 composable sub-functions.
  - Color constants extracted into `src/styles/colors.ts`.
  - `halpers.ts` renamed to `helpers.ts`.

- Improvements:
  - `.tabular` now renders consistently regardless of context (standalone vs nested inside a list). Previously, list context could affect table width and font size via cascade. Fixed with explicit `margin: 0 0 1em`, `font-size: inherit`, and other defensive defaults.
  - `useColors=false` now correctly omits blockquote border, table border, and mark background colors.
  - `getMathpixStyle(useColors=false)` now also omits `ContainerStyle` colors (body text, headings, links, captions). Previously `ContainerStyle()` was always called with default colors.

- Bug Fixes:
  - `div.svg-container` child combinator consistency (`>` for both `#preview-content` and `#setText`).
  - `loadMathJax` updates existing `#Mathpix-styles` element instead of skipping.

- Breaking Changes:
  - `scaleEquation` parameter removed from `loadMathJax`, `getMathpixStyleOnly`, `getMathpixStyle`, and `getMathpixMarkdownStyles`. It was never used in CSS output. If you were passing it positionally, shift your arguments. Use `buildStyles(opts)` for a named-parameter alternative.

- Dead Code Removed:
  - `.empty` selector (never generated), `.preview-right` selector (used as id, not class).

- Docs:
  - Added implementation details in `pr-specs/2026-03-mmd-css-scoping.md`.

# February 2026

## [2.0.36] - 16 February 2026

- Math Output Format:
  - Added `output_format` option to `TOutputMath` to control which math format is placed in HTML output.
  - `'svg'` (default): Pre-rendered SVG with hidden formats, works offline.
  - `'mathml'`: Native `<math>` elements only, smaller file size, requires client-side rendering.
  - `'latex'`: Raw LaTeX with original delimiters, smaller file size, requires client-side rendering.

- Browser Rendering Script (`auto-render.js`):
  - New browser bundle for client-side math rendering at `es5/browser/auto-render.js`.
  - Renders MathML or LaTeX content to SVG.
  - Generates hidden format elements for context menu compatibility.
  - Configurable accessibility support via `MathpixAccessibilityConfig`:
    - `assistive_mml`: Add `<mjx-assistive-mml>` for screen readers.
    - `include_speech`: Add `aria-label` with speech text.

- Browser Speech Script (`add-speech.js`):
  - New browser bundle for adding speech to already-rendered SVG at `es5/browser/add-speech.js`.
  - Use when SVG was rendered with `assistiveMml: true` but without `sre` (speech).
  - Loads SRE dynamically and adds `aria-label`, `role="math"`, `tabindex` to `mjx-container` elements.
  - Requires `mjx-assistive-mml` to be present in the rendered output.
  - Exposes `window.MathpixSpeech.addSpeechToRenderedMath(container?)`.

- Accessibility:
  - `mjx-assistive-mml` is no longer marked with `aria-hidden="true"` when accessibility options are enabled. Previously, the assistive MathML element was hidden from screen readers even when the user explicitly requested accessibility via `assistiveMml: true` or `sre`. Now, if any accessibility option is set, the MathML content is exposed to assistive technology — either via `aria-labelledby` (pointing to the assistive MML) or via `aria-label` (SRE speech text). This affects both server-side rendering (`addAriaToMathHTML`) and the new browser bundles.

- Fixes:
  - Fixed centering issue for equations with numbering inside `.math-block[data-width="full"]`.

- Docs:
  - Added implementation details in `pr-specs/2026-01-html-math-output-options.md`.

## [2.0.35] - 13 February 2026

- Tabular:
  - When `forMD` option is set, `renderTableCellContent` now delegates `image`/`includegraphics` rendering to the caller's render rules instead of hardcoding `![alt](src)`.
  - Added `isTableCell` meta flag on child tokens when `forMD` is set, allowing render rules to escape pipe characters in alt text.
  - Added null-safety for `attrGet('alt')` in the default image rendering path.

- Docs:
  - Added implementation details in `pr-specs/2026-02-formd-delegate-image-rendering-in-table-cells.md`.

## [2.0.34] - 7 February 2026

- Table/Figure:
  - Fixed renderer hang when a `\begin{table}` or `\begin{figure}` has a malformed closing tag (e.g. `\end{table>`).
  - `BeginTable` no longer consumes content across multiple table/figure environments when the first is unclosed.

- Lists (inline):
  - Fixed `latexListEnvInline` silent mode to advance `state.pos`, preventing infinite loops in `skipToken` when `\begin{itemize}` or `\begin{enumerate}` appears in inline content.

- Docs:
  - Added implementation details in `pr-specs/2026-02-fix-stuck-render-malformed-table-close.md`.

# January 2026

## [2.0.33] - 27 January 2026

- Tabular:
  - Fixed rendering of tabular environments following nested tabular placeholders that expand to lists.
  - Block parsing status is now propagated from nested sub-tabulars to parent cells to preserve line breaks.
  - Centralized block detection logic into `detectLocalBlock()`.

- Docs:
  - Added implementation details in `pr-specs/2026-01-nested-tabular-text-prefix-with-lists.md`.

## [2.0.32] - 21 January 2026

- Tabular:
  - Added support for LaTeX `itemize` and `enumerate` lists inside table cells.
  - Nested lists now render with correct markers per level.
  - Custom (`\item[X]`) and empty (`\item[]`) markers are preserved.
  - Fixed edge cases with lists mixed with nested tabular, math, and inline formatting.

- Exports:
  - Markdown: list items are separated with `<br>` inside table cells.
  - TSV/CSV: list items are separated by newline characters.
  - Improved export fidelity for tables containing nested lists.

- Parsing:
  - Tabular cells conditionally switch to block parsing when list environments are detected.
  - Prevent nested `.table_tabular` elements from being processed as top-level tables.

- Docs:
  - Detailed implementation notes and test coverage are documented in
    `pr-specs/2026-01-itemize-support-inside-tabular.md`.

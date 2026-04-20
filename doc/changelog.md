# April 2026

## [2.0.39] - Optimize tabular parsing memory and performance

- Algorithms:
  - Rewrote `getSubMath()` from recursive to iterative single-pass (O(N×M) → O(N+M)); `getMathTableContent()` now uses `parts[]` + `join()` instead of repeated slice+concat. The `startPos: number = 0` optional parameter is preserved for signature compatibility with deep-import consumers.
  - `mathTable`, `subTabular`, `extractedCodeBlocks` converted from Array + `findIndex()` to Map for O(1) lookups.
  - `labelsByKey` + `labelsByUuid` Map indexes; `labelsList` export kept as a deprecated backward-compatible `Proxy` that returns a fresh snapshot of `labelsByKey.values()` on each access — supports `.length`, iteration, and Array methods.
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

- Two-hook tabular-state cleanup:
  - `reset_tabular_state` core-ruler hook (before `normalize`) clears tabular module-level state at the start of every `md.parse()`.
  - New `cleanup_tabular_state` hook (pushed, end of core pipeline) drops parse-only caches (`subTabular`, `mathTable`, `extractedCodeBlocks`, `diagboxTable`, column-style intern cache) at the end of parse — they're never read during render. Both hooks respect `renderElement.startLine` for partial renders.

- Per-token allocation reduction:
  - Pre-interned 16 border-style strings (`border-{top,bottom,left,right}-style`: solid / double / dashed / none) replace per-cell template-literal allocations.
  - `columnStyleCache` per-parse intern for the composed `<td>` style string.
  - `getSharedCellAttrs` / `getSharedTableOpenAttrs` / `getSharedTbodyOpenAttrs` / `getSharedTrOpenAttrs` return read-only shared attrs arrays keyed by (style, isEmpty) / (extraClass, numCol). Shared arrays carry the non-enumerable `Symbol.for('mathpix.tabular.attrsShared')` marker; mutation sites (`tokenAttrSet` in the tabular renderer, `addAttributesToParentTokenByType` in utils) clone-on-write before writing.
  - Frozen singleton close-token markers: `SHARED_TD_CLOSE`, `SHARED_TR_CLOSE`, `SHARED_TABLE_CLOSE`. `tbody_close` stays per-instance because it carries a `latex` payload when `forLatex` is set. The multi-column branch of `parse-tabular.ts` also pushes `SHARED_TD_CLOSE` directly instead of allocating a fresh close-token per cell.
  - `addStyle` / `addHLineIntoStyle` check the input attrs for the `attrsSharedMarker` symbol and clone before mutating so that callers which pass in a shared-attrs array do not corrupt the cached object.
  - `StatePushTabulars` no longer assigns `content` / `children = []` onto open/close markers — those fields are never read on markers and assignment would throw on the frozen close singletons.
  - Replaced `res = res.concat(...)` with in-place `res.push(...)` inside the tabular construction loop to remove intermediate array allocations.
  - `applyTypesetResultToToken` drops `svg` from `token.mathData` when `options.highlights` is not set — the field is only read by `renderMathHighlight` (active under highlights); the default render rule uses `token.mathEquation`. The highlight path re-populates `mathData.svg` in `convertMathToHtmlWithHighlight`.
  - `OuterData` returns `null` for empty `labels` instead of cloning an empty `{}` onto every math token.

- Output gating in the tabular renderer:
  - `renderInlineTokenBlock` and `renderNonTableTokenIntoCell` build each output only when the caller requested it: `needHtml` (from `!forMD && include_table_html !== false`), `needTsv` (`include_tsv`), `needCsv` (`include_csv`), `needMd` (`forMD || include_table_markdown`), `needSmoothed` (`forPptx`). Every `result += ...`, array push, cell accumulator update, and `formatTsvCell` / `formatCsvCell` call is gated on the corresponding flag.
  - Leaf-token handling still calls `slf.renderInline([token], options, env)` even when `needHtml` is false — the `latex_list_item_open` render rule sets `token.meta.itemizeLevel` as a side effect that `handleListTokensForCellMarkdown` reads to emit list markers.

- HTML-visual attrs skipped for non-HTML outputs:
  - `td_open` style / `_empty` class, `tr_open` border-reset style, `table_open` `class='tabular'`, and the `table_tabular` class + text-align style on the wrapping `paragraph_open` are HTML/CSS-only. When the caller sets `forMD` or `forLatex`, `AddTd` / `AddTdSubTable` / `getMultiColumnMultiRow` / `StatePushParagraphOpen` skip those assignments. Multicol/multirow cells still carry `colspan` / `rowspan`; `paragraph_open.data-align` is preserved for `forLatex`.

- New public option:
  - `outMath.skipMathToHtml` (default `false`). When `true`, `applyTypesetResultToToken` skips `token.mathEquation` and `typesetMathForToken` passes `include_svg: false` to MathJax so the SVG string is never serialized. Other MathJax outputs respect their own `include_*` flags. Intended for callers that walk the token tree directly and never read the serialized math HTML.

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

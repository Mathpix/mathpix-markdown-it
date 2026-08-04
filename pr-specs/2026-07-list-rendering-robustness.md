# PR: List rendering robustness fixes

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.1.0

---

## Context

Several unrelated inputs made LaTeX `itemize`/`enumerate` lists render incorrectly. The fixes touch the list-env, tabular and footnote block rules, the marker-width helpers (`common/display-width.ts`), and the marker-padding CSS. They ship together.

## Goal

Fix the reported list defects — clipped markers, empty `<>` item bodies, shifted `Figure N`, a swallowed list after a paragraph, content dropped from the tabular-cell export — without changing HTML for input that already rendered correctly. Marker indent must scale with the container `font-size`, and malformed input must not degrade quadratically.

## Non-Goals

- **Module-global state around a speculative parse:** the `env` flags, caption `env` keys, caption counters and the list-level stack are restored. The sub-tabular/sub-math/extracted-code registries, `sectionCount` and theorem counters are not — they are read positionally or by key from live tokens (restoring desyncs them), and are memory-only or unreachable inside a list body. All are cleared per full parse, so nothing crosses documents.
- **The inline registry pop is by token kind, the block path by identity.** An unpaired `\end` of the same kind can attribute a nested marker's reserve to the wrong level — a wrong indent, not a crash, on malformed input only.
- **Text reserve is per glyph class, not per exact glyph** — a coarse estimate with a safety margin, tuned to a Helvetica/Arial-like font (ASCII by lookup table, East-Asian Wide as full-width, everything else by case). Some non-ASCII glyphs over- or under-reserve within a bounded margin; a very different font could shift the fit, but the class shape (narrow < normal < wide) is font-robust.
- **A math marker is only measured under SVG output.** The reserve comes from the token's rendered `widthEx`, which only the SVG pipeline fills, so under `include_mathml`, `include_latex` or `skipMathToHtml` a math marker keeps the default indent and can still clip. Estimating from the LaTeX source instead was rejected: source length tracks rendered width badly in the wrong direction — `$\displaystyle\sum_{i=1}^{n}$` is ~28 characters against ~3em rendered, so it would push ordinary math markers into the `20em` clamp and eat the content column.
- **The em model assumes one `font-size` down the nesting chain.** A nested reserve subtracts `2.5em` per ancestor, but that ancestor's indent is em of *its* font size while the result is em of the child's. With a different size per level (a list inside `\small`, a table cell with its own size, a wrapper at 17px over 16px content) the reserve shifts by that ratio.
- **A nested reserve assumes the emitted stylesheet** — `resolveListPadding` takes each ancestor indent to be `2.5em`. A consumer rendering without the MMD stylesheet gets the UA `40px` instead (equal only at 16px), so shipping the stylesheet is required for custom markers in nested lists.
- **Malformed input with no blank lines is still super-linear**, whichever env is unclosed: every terminator probe is now cheap, but `newTheoremBlock` and markdown-it's `lheading` still scan forward from each block start without terminating. Neither is touched here, and the shape reaches them with no list involved. A blank line between blocks avoids it.
- Above the `20em` clamp a pathological marker (a very long OCR label) can overlap the content.
- A textless item immediately followed by a wider-marker sublist can overlap the two markers — this reproduces LaTeX and is intentionally not "fixed".
- Image markers (`\item[\includegraphics{…}]`) reserve by their alt text, not the rendered image width.

## Current Behavior

Marker width is `String.length` over `text` tokens, so wide, math and wrapped markers are undercounted and clip; padding is `px` and only on the outermost list. A speculative list parse leaks `env` flags and caption counters. `\footnote` scans swallow a following list. Inline content sitting directly in a `\begin{tabular}` cell never reaches `table-markdown`/`tsv`/`csv`. `\itemsep` is mistaken for `\item`.

## Desired Behavior

1. **Block-content items get marker padding.** Marker width was measured on the inline item path only, so a list whose long-marker items all hold a block env (`\begin{figure}`, `\begin{tabular}`, a code fence) lost its `padding-inline-start`. The width calc is now shared and applied on the block path too.
2. **Marker width accounts for wide/math/wrapped content.** Was `String.length` over `text` tokens only: East-Asian Wide/Fullwidth (`\item[11．]`), math (`\item[$x^4+x^4$]`, via rendered `widthEx`) and wrapped markers (`\item[\textbf{…}]`, via their children) are now measured instead of undercounted.
3. **No state leak from a speculative list parse.** The rule parses into a buffered state before committing; a silent probe or abort discards the tokens. Restored on a non-committing exit: the transient `env` flags (a leaked `isBlock` produced empty `<>` items), the caption/float/tabular `env` keys, the module-global figure/table counters (`Figure N`/`Table N` no longer shift; a figure in a list is `Figure 1`, was `Figure 3`), and the list-level stack — levels are pushed and popped, so a discarded parse leaves no half-open level whose `openItems` would close an extra `<li>` later.
4. **Footnote scans stop at a list start.** `\footnote`/`\footnotetext` now terminate their forward scan at `\begin{itemize|enumerate}`, so a list right after a paragraph (no blank line) is no longer swallowed as literal text. The probe answer is memoized per state and an unclosed env short-circuits before parsing, so repeated list units no longer cost O(N²).
5. **Marker padding in `em`, not `px`.** The indent and the `0.625em` marker gap now scale with the container `font-size`. A custom `padding-inline-start` is emitted only when the marker overflows the default (`2.5em`), attributed per nesting level and clamped at `20em`; the attribute carries its unit (`"4.23em"`).
6. **`\item` detection requires a real command.** `\itemsep`/`\itemindent` and the bare word "item" no longer split an item or break a multiline `\footnote` inside one; item detection anchors on `\item` + a command boundary.
7. **Markdown lists indent `2.5em`, not the UA `40px`.** Core-markdown `<ul>`/`<ol>` (no `.itemize`/`.enumerate`) get a scoped `#preview-content`/`#setText` rule that scales with the container; the numbered footnotes list is covered. Wrapped output only.
8. **Inline content in a tabular cell reaches the export.** A one-line list (or a link/bold/math) sitting directly in a `\begin{tabular}` cell was rendered to HTML only; its `table-markdown`/`tsv`/`csv` text was dropped (`\item[x] d` exported as `x `). It now reaches those exports; HTML is unchanged.
9. **A link in a tabular cell keeps its label and closes its anchor.** Pre-existing and unrelated to lists, fixed here because it shares the cell-export path: the link consumed two tokens too many (open `<a>`, following content absorbed), and its Markdown label was read from one token, so a formatted label came out empty. The label is now read whole — an image or math label falls back to its alt text or LaTeX, a `]` anywhere in it is escaped (except an image alt, which is raw source and already carries its own), an href that a bare destination cannot hold takes the `<…>` form — and the pptx-smoothed output no longer carries a bare `<a>` or the raw HTML of a table written inside a label.
10. **Unclosed `\begin{tabular}` short-circuits.** Like fix 4, `BeginTabular` checks for a closing `\end{tabular}` before scanning to EOF instead of rejecting only afterwards, which cuts the cost of such a document by ~30×. Not list-related; included because the same probe-per-line pattern reaches it from the same malformed input.

## Breaking change / migration

- **`data-padding-inline-start` is an em value with its unit** (`"56"` → `"4.23em"`), emitted on nested lists too. Custom-marker values shift in both directions (the width model was rewritten), not just the unit — expect layout changes on lists with custom markers. Readers of the attribute must update.
- **A custom marker's HTML no longer carries edge whitespace** (`<span class="li_level">  wide  </span>` → `<span class="li_level">wide</span>`) — the marker is parsed trimmed.
- **The default indent (`2.5em`) and marker gap (`0.625em`) are em** (were `40px`/`10px`; identical at a 16px base, now scale).
- **Core-markdown `ul`/`ol` indent `2.5em`** — the rule matches any `ul`/`ol` inside `#preview-content`/`#setText`, including a consumer's own under `htmlTags: true`. Wrapped output only; raw `markdownToHTML()` keeps the UA default. The padding floor rises to specificity `(1,0,1)`, so a consumer rule below it no longer wins.
- **An inline-opened `*_list_open` token carries `prentLevel` = its depth** (was `0`). `table-markdown` for a single-line nested list in a cell gains a `<br>` before the sublist.
- **Speculative-parse `env` keys are restored to `undefined`, not deleted.** A consumer that inspects its own `env` after a parse now sees the internal list/float keys present with value `undefined` (`'isBlock' in env` → `true`); value-level checks are unaffected.
- **Deep imports:** `ClearTableNumbers`/`ClearFigureNumbers` → `clearTableNumbers`/`clearFigureNumbers`, moved to `lib/markdown/common/caption-counters` (no re-export); `ListItemsResult`/`ListInlineContext` dropped `padding` and gained required `openTokens`/`allListTokens`; importing `lib/styles/styles-code` alone no longer sizes code text (its `pre` base moved to the always-emitted `MathpixStyle`).
- **A bare `\item` in a `\begin{tabular}` cell inside a list body now renders as literal text**, where it used to emit an orphan `<li>` in the `<td>` with the marker dropped (the inline item rules are gated on the `isBlock` flag the tabular no longer replays). Both forms are wrong for malformed input; only the shape changed. A full `\begin{itemize}…\end{itemize}` in a cell is unaffected.
- **Content before the first `\item` lands directly inside `<ul>`** (invalid HTML) — pre-existing and command-agnostic, only more visible now that `\item`-prefixed commands are no longer mis-parsed as `\item`. DOM walkers (`forDocx`, sanitisers, table extraction) may drop or move it.

## Testing

Rendered HTML is locked by full-HTML fixtures, so a visual regression fails a fixture: `_data/_lists` (marker padding per class, B2 nesting in all written forms, empty-`<>`, `\item` detection, footnote terminators), `_data/_captions` (numbering not shifted by a speculative parse), `_data/_footnotes_latex` (a `\footnotetext` mentioning "item").

Non-renderable behaviour stays as targeted assertions: `_list-marker-padding.js` (width invariant against the bundled Arial fixture, the default-indent threshold, padding-style sanitisation), `_display-width.js` (`isWideChar`/`textReserveEm`/`tokenMarkerWidth`), `_footnotes_latex.js` (repeated units parse linearly), `_parse-isolation.js` (a silent probe leaves `env` unchanged, plus the memo-key invariant), `_styles.js` (the `listsStyles` snapshot and a no-bare-`ul`/`ol` tripwire).

## Done When

- [x] All ten fixes implemented; HTML unchanged for input that already rendered correctly.
- [x] Marker indent, default indent and gap in `em`, attributed per level and clamped.
- [x] Speculative parse restores the `env` flags and caption counters; the rest is listed in Non-Goals.
- [x] Repeated list units parse linearly, guarded by a scaling test.
- [x] Fixtures cover the rendered HTML and the `table-markdown`/`tsv`/`csv` exports; full suite passes.
- [x] Changelog carries the breaking changes and the revert order; `lib/`/`es5/` rebuilt in sync.

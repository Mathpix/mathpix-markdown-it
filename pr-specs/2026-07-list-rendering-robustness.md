# PR: List rendering robustness fixes

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.0.2

---

## Context

Several unrelated inputs made LaTeX `itemize`/`enumerate` lists render incorrectly. All four bugs live in the list-env and footnote block rules and are fixed together.

## Fixes

1. **Marker padding for block-content items.** A top-level list gets its `padding-inline-start` from the widest custom `\item[...]` marker, but the marker width was only measured on the inline item path. Items whose content is a block environment (`\begin{figure}`, `\begin{tabular}`, a code fence) were skipped, so a list whose long-marker items all held block content lost its padding. The width calc is now shared and applied on the block item path too.

2. **Marker width: fullwidth/CJK, math, and wrapped content.** Marker width summed `String.length` over top-level `text` tokens only, so several markers were undercounted (too small an indent): fullwidth/CJK (`\item[11．]`, U+FF0E) counted as narrow ASCII — now East-Asian Wide/Fullwidth chars count as 2 (iterating by code point); math (`\item[$x^4+x^4$]`) contributed 0 — now uses the token's rendered `widthEx` (the same field `getTextWidthByTokens` reads), ~2 ex per character cell; wrapped content (`\item[\textbf{…}]`) contributed 0 — now measured by recursing into the wrapper's children. ASCII text markers are unchanged. The width helpers live in `common/display-width.ts` (`displayWidth`, `tokenDisplayWidth`); `computeMarkerPadding` (list module) delegates to them.

3. **No env-state leak from a non-committing list parse.** The list block rule parses speculatively into a buffered state that shares `env` by prototype. On abort (unclosed list) or a silent probe it returned without restoring `env.isBlock` (and `env.inheritedListType`); a leaked `isBlock=true` then let the inline list fallback fire on the following content, so an unclosed `itemize` before a `tabular` rendered a broken partial list with empty `<>` item bodies. Those transient fields are now restored on both the abort and silent paths, so a silent probe never changes state and the unclosed list degrades to plain text exactly as it does without a `tabular`.

4. **Footnote block rules stop at a list start.** The `\footnote`/`\footnotetext` block rules scan forward for their open tag, terminating at block boundaries so the scan doesn't swallow following blocks. The LaTeX list rule (`Lists`) was not among the terminators, so a `\begin{itemize}` between a paragraph and a later footnote (no blank line) did not stop the scan: the list was swallowed and rendered as literal text (a blank line masked it).

   - `latex_footnotetext_block` already ran the full terminator set; adding `Lists` to that set fixes it.
   - `latex_footnote_block` terminated on `fence` only (a deliberate cost choice — see `2026-05-footnote-perf-and-parser-invariants.md`); it now also runs `Lists`. Kept minimal (`fence` + `Lists`, not the full set) so the extra per-line cost is one cheap probe, not ~20.
   - Performance: this is a **fix**, not a cost. On repeated paragraph + list-with-footnotetext units without blank separators, the missing list terminator made the footnotetext scan run across every `\begin{itemize}` into the rest of the document — O(N²) (seconds on large inputs). Terminating at the list bounds each scan to one unit → linear. Guarded by a scaling test in `tests/_footnotes_latex.js`.
   - `Lists` also gets a fast bail (first-char check before allocating a substring), since it now runs as a per-line terminator in paragraph/footnote scans.

## Non-Goals

- The padding heuristic itself (px-per-char, the `> 3` threshold) is unchanged.
- Malformed input still degrades gracefully; the goal is text, not a partial list.
- Marker width is an approximation: text is char-based (East-Asian-Width over BMP ranges; astral chars — emoji, CJK Ext-B+ — count as width 1) and math is `widthEx`-based, since no font is loaded on this path.
- Inline marker padding is applied to top-level lists only; nested lists keep the default indent even with long block-content markers (pre-existing; separate ticket).

## Testing

- `tests/_data/_lists/_data.js`: fenced-code and figure block items, a fullwidth `11．` marker, an unclosed list + `tabular`, and a list right after a paragraph whose item holds a multiline `\footnote{}` / `\footnotetext{}`.
- `tests/_list-marker-padding.js`: short math marker (under threshold), wide math marker (padding from `widthEx`), bold marker (padding from `\textbf` children), astral/emoji marker (width 1), nested list carries no inline padding, `\footnote` recognized after a heading/table with no blank line, and a core-markdown list before a `\footnote` is not swallowed.
- `tests/_footnotes_latex.js`: a scaling test asserting repeated list + `\footnotetext` units parse linearly (rejects the O(N²) scan).
- `tests/_parse-isolation.js`: a silent `Lists` probe leaves `env` unchanged.
- Full suite green.

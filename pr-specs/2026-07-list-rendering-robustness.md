# PR: List rendering robustness fixes

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.0.2

---

## Context

Several unrelated inputs made LaTeX `itemize`/`enumerate` lists render incorrectly. The fixes live in the list-env, tabular, and footnote block rules, plus the marker-padding CSS, and ship together.

## Fixes

1. **Marker padding for block-content items.** A top-level list gets its `padding-inline-start` from the widest custom `\item[...]` marker, but the marker width was only measured on the inline item path. Items whose content is a block environment (`\begin{figure}`, `\begin{tabular}`, a code fence) were skipped, so a list whose long-marker items all held block content lost its padding. The width calc is now shared and applied on the block item path too.

2. **Marker width: fullwidth/CJK, math, and wrapped content.** Marker width summed `String.length` over top-level `text` tokens only, so several markers were undercounted (too small an indent): fullwidth/CJK (`\item[11．]`, U+FF0E) counted as narrow ASCII — now East-Asian Wide/Fullwidth chars count as 2 (iterating by code point); math (`\item[$x^4+x^4$]`) contributed 0 — now uses the token's rendered `widthEx` (the same field `getTextWidthByTokens` reads), ~2 ex per character cell; wrapped content (`\item[\textbf{…}]`) contributed 0 — now measured by recursing into the wrapper's children. ASCII text markers are unchanged. The width helpers live in `common/display-width.ts` (`displayWidth`, `tokenDisplayWidth`); `computeMarkerPadding` (list module) delegates to them.

3. **No env-state leak from a list parse (empty `<>` item bodies).** A leaked `env.isBlock=true` makes the inline list fallback fire on unrelated later content, rendering item bodies as empty `<>`. There were two independent leak paths, both closed:

   - **Speculative parse.** The list block rule parses into a buffered state that shares `env` by prototype, so it mutates the real `env` (`isBlock`, `inheritedListType`, `parentType`, `prentLevel`). It now snapshots those four transient keys on entry and restores them in a `finally` on every exit — abort, silent probe, commit, or exception — so a silent probe never changes state and an unclosed `itemize` before a `tabular` degrades to plain text exactly as without the `tabular`.
   - **`envToInline` snapshot replay.** A `tabular` inside a list item snapshots the whole `env` into `token.envToInline` while `isBlock=true`; `core-inline` later `Object.assign`s that snapshot back onto the shared `env`, re-leaking `isBlock` **after** the block-rule `finally` and, within the same token loop, waking the fallback on a following list. The snapshot now strips the transient list flags (`snapshotEnvForInline`, single source of truth `LIST_TRANSIENT_ENV_KEYS` in `common/env-transient.ts`); the block item path also resets `isBlock` after block content. Guarded by an adversarial matrix (figure/tabular × closed/unclosed × order) folded into the tests.

4. **Footnote block rules stop at a list start.** The `\footnote`/`\footnotetext` block rules scan forward for their open tag, terminating at block boundaries so the scan doesn't swallow following blocks. The LaTeX list rule (`Lists`) was not among the terminators, so a `\begin{itemize}` between a paragraph and a later footnote (no blank line) did not stop the scan: the list was swallowed and rendered as literal text (a blank line masked it).

   - `latex_footnotetext_block` already ran the full terminator set; adding `Lists` to that set fixes it.
   - `latex_footnote_block` terminated on `fence` only (a deliberate cost choice — see `2026-05-footnote-perf-and-parser-invariants.md`); it now also runs `Lists`. Kept minimal (`fence` + `Lists`, not the full set) so the extra per-line cost is one cheap probe, not ~20.
   - Performance: this is a **fix**, not a cost. On repeated paragraph + list-with-footnotetext units without blank separators, the missing list terminator made the footnotetext scan run across every `\begin{itemize}` into the rest of the document — O(N²) (seconds on large inputs). Terminating at the list bounds each scan to one unit → linear. Guarded by a scaling test in `tests/_footnotes_latex.js`.
   - `Lists` also gets a fast bail (first-char check before allocating a substring), since it now runs as a per-line terminator in paragraph/footnote scans.

5. **Marker padding emitted in `ex`, not `px`, so it scales with the container font.** `px` padding does not track a consumer-set container `font-size`, and the previous `ex→px` conversion undercounted math: a `7.329ex` math marker got `51px` reserved while it renders ~68px, so the marker was clipped. Padding is now `padding-inline-start: {marker width + gap}ex`. A math marker reserves exactly its `widthEx` (plus the gap); the marker→content gap is also `ex` (`.li_level { padding-right: 1.4ex }`, was `10px`) so reservation and gap stay in the same unit at any font size. One character cell = 2 ex (`EX_PER_CHAR_CELL`, matching the `widthEx`-per-cell factor so a math token round-trips exactly); text markers keep a generous reserve. Value stored in `data-padding-inline-start` is now the ex number.

## Non-Goals

- The width heuristic itself (char-cell counting, the `> 3` threshold) is unchanged; only the unit of the emitted padding changed (px → ex).
- The default (non-custom-marker) list indent stays `padding-inline-start: 40px` — the only remaining px in list styles; converting it is a separate cosmetic decision.
- Malformed input still degrades gracefully; the goal is text, not a partial list.
- Marker width is an approximation: text is char-based (East-Asian-Width over BMP ranges; astral chars — emoji, CJK Ext-B+ — count as width 1) and math is `widthEx`-based, since no font is loaded on this path.
- Inline marker padding is applied to top-level lists only; nested lists keep the default indent even with long block-content markers (pre-existing; separate ticket).

## Testing

- `tests/_data/_lists/_data.js`: fenced-code and figure block items, a fullwidth `11．` marker, an unclosed list + `tabular`, and a list right after a paragraph whose item holds a multiline `\footnote{}` / `\footnotetext{}`.
- `tests/_list-marker-padding.js`: short math marker (under threshold), wide math marker (exact ex value), math on the block-content path (same value), config-independent presence, edge-whitespace trimmed, bold marker (`\textbf` children), astral/emoji marker (width 1), nested list carries no inline padding; plus no empty `<>` from leaked `isBlock` (closed tabular-list leaves `env` clean; figure-then-tabular and tabular-then-figure lists produce no `<>`); `\footnote` recognized after a heading/table with no blank line; a core-markdown list before a `\footnote` is not swallowed.
- `tests/_display-width.js`: unit tests for `isWideChar`, `displayWidth`, `tokenDisplayWidth` (text/math/`widthEx`-fallback/wrapper).
- `tests/_footnotes_latex.js`: a scaling test asserting repeated list + `\footnotetext` units parse linearly (rejects the O(N²) scan).
- `tests/_parse-isolation.js`: a silent `Lists` probe leaves `env` unchanged (closed and unclosed list).
- Full suite green.

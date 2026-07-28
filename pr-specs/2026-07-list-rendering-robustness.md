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

   - **Speculative parse.** The list block rule parses into a buffered state that shares `env` by prototype, so it mutates the real `env` (`isBlock`, `inheritedListType`, `parentType`, `prentLevel`). It now snapshots those four transient **env** keys on entry and restores them in a `finally` on every exit — abort, silent probe, commit, or exception — so a silent probe never changes `env` and an unclosed `itemize` before a `tabular` degrades to plain text exactly as without the `tabular`. (The module-global list depth is a separate, pre-existing concern — see Non-Goals.)
   - **`envToInline` snapshot replay.** A `tabular` inside a list item snapshots the whole `env` into `token.envToInline` while `isBlock=true`; `core-inline` later `Object.assign`s that snapshot back onto the shared `env`, re-leaking `isBlock` **after** the block-rule `finally` and, within the same token loop, waking the fallback on a following list. The snapshot now strips the transient list flags (`snapshotEnvForInline`, single source of truth `LIST_TRANSIENT_ENV_KEYS` in `common/env-transient.ts`); the block item path also resets `isBlock` after block content. Guarded by an adversarial matrix (figure/tabular × closed/unclosed × order) folded into the tests.

4. **Footnote block rules stop at a list start.** The `\footnote`/`\footnotetext` block rules scan forward for their open tag, terminating at block boundaries so the scan doesn't swallow following blocks. The LaTeX list rule (`Lists`) was not among the terminators, so a `\begin{itemize}` between a paragraph and a later footnote (no blank line) did not stop the scan: the list was swallowed and rendered as literal text (a blank line masked it).

   - `latex_footnotetext_block` already ran the full terminator set; adding `Lists` to that set fixes it.
   - `latex_footnote_block` terminated on `fence` only (a deliberate cost choice — see `2026-05-footnote-perf-and-parser-invariants.md`); it now also runs `Lists`. Kept minimal (`fence` + `Lists`, not the full ~20-rule set). The `Lists` silent probe fast-bails on non-`\` lines; on an actual `\begin{list}` line it runs a full speculative parse, but that line ends the scan anyway.
   - Performance: this is a **fix**, not a cost. On repeated paragraph + list-with-footnotetext units without blank separators, the missing list terminator made the footnotetext scan run across every `\begin{itemize}` into the rest of the document — O(N²) (seconds on large inputs). Terminating at the list bounds each scan to one unit → linear. Guarded by a scaling test in `tests/_footnotes_latex.js`.
   - `Lists` also gets a fast bail (first-char check before allocating a substring), since it now runs as a per-line terminator in paragraph/footnote scans.

5. **Marker padding emitted in `em`, not `px`, so it scales with the container font.** `px` padding does not track a consumer-set container `font-size`, and the previous `ex→px` conversion undercounted math: a `7.329ex` math marker got `51px` reserved while it renders ~68px, so the marker was clipped. Marker widths are now measured in `ex` and converted to `em` for emission (`EX_TO_EM = exDef/fonSizeDef ≈ 0.5186`, the default font metrics):
   - **Math** uses its exact rendered `widthEx`, converted to em (so `$x^4+x^4$` reserves `7.329ex → ~3.80em` + `0.625em` gap ≈ `4.43em`). This matches the SVG at the default x-height and over-reserves for smaller-x-height fonts (serif); at unusually large-x-height fonts it can under-reserve slightly. `widthEx` exists only for SVG output; under `skipMathToHtml` / non-SVG output there is no measured width, so the marker keeps the default indent rather than a fabricated estimate.
   - **Text** uses `1.3 ex` per character cell (`TEXT_EX_PER_CELL`), then converts to em — a glyph is ~1 ex, a modest reserve; wrapped markers (`\textbf{…}`) recurse into children.
   - The marker→content gap is `0.625em` (`.li_level { padding-right }`, was `10px`) and the default list indent is `2.5em` (`LIST_DEFAULT_INDENT_EM`, was `40px`) — both em, both ≈ their old px at a 16px base but scalable.
   - A custom marker overrides the default only when its computed em value **exceeds** the default (`> 2.5em`), so the emitted padding can never resolve below the default — no `max()` / cross-unit comparison needed.
   - `data-padding-inline-start` now holds the em value **with its unit** (e.g. `"4.43em"`, was a bare px number) so the value is self-describing.

## Migration

- **`data-padding-inline-start` changed from a px number to an em value with unit** (`"56"` → `"3.32em"`-style). A downstream consumer that reads this attribute as px must update to parse the em value; the only in-repo reader (the list renderer) is updated.
- **Custom-marker `padding-inline-start` and the default list indent (`2.5em`) are now em; the marker gap is `0.625em`** (all were px). Layout is ≈ equivalent at a 16px base but now scales with the container `font-size`.

## Non-Goals

- The width heuristic is an approximation (char cells for text, `widthEx` for math) and the ex→em conversion uses the default font metrics, so a marker's reserve is exact only near the default x-height; the trade is conventional em units and a trivial floor check over per-font exactness.
- The module-global list depth (`list-state.ts`) is **not** restored by the above `finally` — it is not on `env`, and it is shared re-entrantly (a list inside a `tabular` relies on it), so restoring it in the outer rule breaks nested cases. This is a pre-existing latent leak with no reproduced render defect (markers use `token.prentLevel`; `openItems` zeroes out); a proper fix needs per-parse depth state — separate ticket.
- Malformed input still degrades gracefully; the goal is text, not a partial list.
- Marker width is an approximation: text is char-based (East-Asian-Width over BMP ranges; astral chars — emoji, CJK Ext-B+ — count as width 1) and math is `widthEx`-based, since no font is loaded on this path.
- Text reserve is **per character cell**, not per glyph (`1.3 ex`/cell). Glyph width is ignored, so a marker of unusually wide glyphs (all-caps, `W`/`M`) reserves the same as a same-length narrow one and can overlap the content; this is ~5–14% tighter than 3.0.1's `14px`/char, which had enough slack to cover caps. Fixing it needs real font metrics, unavailable on this no-font path.
- Inline marker padding is applied to top-level lists only; nested lists keep the default indent even with long block-content markers (pre-existing; separate ticket).

## Testing

- `tests/_data/_lists/_data.js`: fenced-code and figure block items, a fullwidth `11．` marker, an unclosed list + `tabular`, and a list right after a paragraph whose item holds a multiline `\footnote{}` / `\footnotetext{}`.
- `tests/_list-marker-padding.js`: short math marker (under threshold), wide math marker (exact ex value), math on the block-content path (same value), config-independent presence, edge-whitespace trimmed, bold marker (`\textbf` children), astral/emoji marker (width 1), nested list carries no inline padding; plus no empty `<>` from leaked `isBlock` (closed tabular-list leaves `env` clean; figure-then-tabular and tabular-then-figure lists produce no `<>`); `\footnote` recognized after a heading/table with no blank line; a core-markdown list before a `\footnote` is not swallowed.
- `tests/_display-width.js`: unit tests for `isWideChar`, `displayWidth`, `tokenDisplayWidth` (text/math/`widthEx`-fallback/wrapper).
- `tests/_footnotes_latex.js`: a scaling test asserting repeated list + `\footnotetext` units parse linearly (rejects the O(N²) scan).
- `tests/_parse-isolation.js`: a silent `Lists` probe leaves `env` unchanged (closed and unclosed list).
- Full suite green.

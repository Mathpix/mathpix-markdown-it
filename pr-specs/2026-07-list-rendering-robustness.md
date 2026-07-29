# PR: List rendering robustness fixes

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.1.0

---

## Context

Several unrelated inputs made LaTeX `itemize`/`enumerate` lists render incorrectly. The fixes live in the list-env, tabular, and footnote block rules, plus the marker-padding CSS, and ship together.

## Fixes

1. **Marker padding for block-content items.** A top-level list gets its `padding-inline-start` from the widest custom `\item[...]` marker, but the marker width was only measured on the inline item path. Items whose content is a block environment (`\begin{figure}`, `\begin{tabular}`, a code fence) were skipped, so a list whose long-marker items all held block content lost its padding. The width calc is now shared and applied on the block item path too.

2. **Marker width: fullwidth/CJK, math, and wrapped content.** Marker width summed `String.length` over top-level `text` tokens only, so several markers were undercounted (too small an indent): fullwidth/CJK (`\item[11．]`, U+FF0E) counted as narrow ASCII — now East-Asian Wide/Fullwidth chars are measured as wide glyphs; math (`\item[$x^4+x^4$]`) contributed 0 — now uses the token's rendered `widthEx` (the same field `getTextWidthByTokens` reads); wrapped content (`\item[\textbf{…}]`) contributed 0 — now measured by recursing into the wrapper's children. The width helpers live in `common/display-width.ts` (`textReserveEm`, `tokenMarkerWidth`); `computeMarkerPadding` (list module) delegates to them. See fix 5 for the em model.

3. **No state leak from a speculative list parse.** The list block rule parses the body into a buffered state before deciding whether to commit; on a silent probe (now run as a footnote/paragraph terminator) or an abort, the tokens are discarded. Three leaks from that discarded parse are closed. The first two caused empty `<>` item bodies (a leaked `env.isBlock=true` wakes the inline list fallback on later content); the third shifted caption numbers:

   - **Speculative parse.** The list block rule parses into a buffered state that shares `env` by prototype, so it mutates the real `env` (`isBlock`, `inheritedListType`, `parentType`, `prentLevel`). It now snapshots those four transient **env** keys on entry and restores them in a `finally` on every exit — abort, silent probe, commit, or exception — so a silent probe never changes `env` and an unclosed `itemize` before a `tabular` degrades to plain text exactly as without the `tabular`. (The module-global list depth is a separate, pre-existing concern — see Non-Goals.)
   - **`envToInline` snapshot replay.** A `tabular` inside a list item snapshots the whole `env` into `token.envToInline` while `isBlock=true`; `core-inline` later `Object.assign`s that snapshot back onto the shared `env`, re-leaking `isBlock` **after** the block-rule `finally` and, within the same token loop, waking the fallback on a following list. The snapshot now strips the transient list flags (`snapshotEnvForInline`, single source of truth `LIST_TRANSIENT_ENV_KEYS` in `common/env-transient.ts`); the block item path also resets `isBlock` after block content. Guarded by an adversarial matrix (figure/tabular × closed/unclosed × order) folded into the tests.
   - **Caption counters.** The speculative parse runs the body's `\begin{figure}` / `\begin{table}\caption`, which bumps the module-global figure/table counters (extracted to the leaf module `common/caption-counters.ts`; `begin-table.ts` only increments them). On a non-committing exit the tokens are discarded, so the counters are snapshotted and restored too (`getCaptionCounters`/`setCaptionCounters`, restored unless the parse committed) — in the `Lists` block rule's `finally` and inside `parseListEnvRawToTokens` for the inline path. This fixes `\footnote` after such a list shifting `Figure N` / `Table N` by one, **and** the pre-existing inflation from the paragraph-terminator probe (a figure-in-a-list is now `Figure 1`, was `Figure 3`).

4. **Footnote block rules stop at a list start.** The `\footnote`/`\footnotetext` block rules scan forward for their open tag, terminating at block boundaries so the scan doesn't swallow following blocks. The LaTeX list rule (`Lists`) was not among the terminators, so a `\begin{itemize}` between a paragraph and a later footnote (no blank line) did not stop the scan: the list was swallowed and rendered as literal text (a blank line masked it).

   - `latex_footnotetext_block` already ran the full terminator set; adding `Lists` to that set fixes it.
   - `latex_footnote_block` terminated on `fence` only (a deliberate cost choice — see `2026-05-footnote-perf-and-parser-invariants.md`); it now also runs `Lists`. Kept minimal (`fence` + `Lists`, not the full ~20-rule set). The `Lists` silent probe fast-bails on non-`\` lines; on an actual `\begin{list}` line it runs a full speculative parse, but that line ends the scan anyway.
   - Performance: this is a **fix**, not a cost. On repeated paragraph + list-with-footnotetext units without blank separators, the missing list terminator made the footnotetext scan run across every `\begin{itemize}` into the rest of the document — O(N²) (seconds on large inputs). Terminating at the list bounds each scan to one unit → linear. Guarded by a scaling test in `tests/_footnotes_latex.js`.
   - `Lists` also gets a fast bail (first-char check before allocating a substring), since it now runs as a per-line terminator in paragraph/footnote scans.

5. **Marker padding emitted in `em`, not `px`, so it scales with the container font.** `px` padding does not track a consumer-set container `font-size`, and the previous `ex→px` conversion undercounted math: a `7.329ex` math marker got `51px` reserved while it renders ~68px, so the marker was clipped. Marker widths are now measured in em:
   - **Math** uses its exact rendered `widthEx` converted to em (`EX_TO_EM = exDef/fonSizeDef ≈ 0.5186`), so `$x^4+x^4$` reserves `7.329ex → ~3.80em` + `0.625em` gap ≈ `4.43em`. `widthEx` exists only for SVG output; under `skipMathToHtml` / non-SVG output there is no measured width, so the marker keeps the default indent rather than a fabricated estimate.
   - **Text** (and code-span / wrapper content) uses a per-glyph-class estimate (`textReserveEm`): narrow (`. i l space ( )`) `0.40em`, normal `0.62em`, wide (most capitals, `m`) `0.90em`, extra-wide (`W @ %`) `1.10em`, East-Asian full-width `1.20em`, combining marks `0`. These are generous margins over Helvetica advances (≈1.07× for the widest glyphs up to ≈1.8× for the thinnest like `i`/`J` on all-same runs), not exact — the *shape* (narrow < normal < wide) holds for any proportional font. Wrapped (`\textbf{…}`) and code-span markers recurse/measure their content; `html_inline` markup is not measured (0).
   - Both text and math widths get **one** `0.625em` marker→content gap (`.li_level { padding-right }`, was `10px`). The default list indent is `2.5em` (`LIST_DEFAULT_INDENT_EM`, was `40px`).
   - A custom marker overrides the default only when its computed em value **exceeds** it (`> 2.5em`) — so the padding never resolves below the default (no `max()` needed) — and is clamped at `LIST_MAX_INDENT_EM = 20em`.
   - `data-padding-inline-start` now holds the em value **with its unit** (e.g. `"4.43em"`, was a bare px number) so the value is self-describing.
   - vs 3.0.1: measured against real font metrics, 3.0.1's flat `14px`/char over-reserved narrow/digit markers by 36–70% and under-reserved all-caps by ~14%; the class estimate holds a +11…+27% margin — tighter (correct) for narrow/normal, wider (safer) for all-caps. Math unchanged.

## Migration

- **`data-padding-inline-start` changed from a px number to an em value with unit** (`"56"` → `"3.32em"`-style). A downstream consumer that reads this attribute as px must update to parse the em value; the only in-repo reader (the list renderer) is updated.
- **Custom-marker `padding-inline-start` and the default list indent (`2.5em`) are now em; the marker gap is `0.625em`** (all were px). Layout is ≈ equivalent at a 16px base but now scales with the container `font-size`.

## Non-Goals

- Caption counters are restored around the speculative parse (fix 3), but the module-global list **depth** (`list-state.ts`, `openItems`) is **not** — it is shared re-entrantly (a list inside a `tabular` relies on it), so restoring it in the outer rule breaks nested cases. This specific leak has no reproduced render defect (markers use `token.prentLevel`; `openItems` zeroes out); a proper fix needs per-parse depth state — separate ticket. `sectionCount` (`mdPluginText.ts`) is likewise not restored, but sections do not occur inside list bodies in practice.
- Malformed input still degrades gracefully; the goal is text, not a partial list.
- Text reserve is per **glyph class** (narrow/normal/wide/extra-wide + East-Asian full-width), not per exact glyph — a coarse approximation with a margin, tuned to a Helvetica-like font. Astral chars (emoji, CJK Ext-B+) fall in the `normal` class. A very different font could still over- or under-reserve, but the class shape (narrow < normal < wide) is font-robust. Exact per-glyph widths would need a loaded font (`fontMetrics`), unavailable on this path.
- Above the `20em` clamp the reserve is smaller than the marker needs, so a pathological marker (a very long OCR formula/label) can overlap the content. Proper degradation (switching the absolute-positioned marker to inline) is a separate ticket.
- Inline marker padding is applied to top-level lists only; nested lists keep the default indent even with long block-content markers (pre-existing; separate ticket).

## Testing

- `tests/_data/_lists/_data.js`: fenced-code and figure block items, a fullwidth `11．` marker, an unclosed list + `tabular`, and a list right after a paragraph whose item holds a multiline `\footnote{}` / `\footnotetext{}`.
- `tests/_list-marker-padding.js`: short math marker (under threshold), wide math marker (exact ex value), math on the block-content path (same value), config-independent presence, edge-whitespace trimmed, bold marker (`\textbf` children), astral/emoji marker (width 1), nested list carries no inline padding; plus no empty `<>` from leaked `isBlock` (closed tabular-list leaves `env` clean; figure-then-tabular and tabular-then-figure lists produce no `<>`); `\footnote` recognized after a heading/table with no blank line; a core-markdown list before a `\footnote` is not swallowed.
- `tests/_display-width.js`: unit tests for `isWideChar`, `displayWidth`, `tokenDisplayWidth` (text/math/`widthEx`-fallback/wrapper).
- `tests/_footnotes_latex.js`: a scaling test asserting repeated list + `\footnotetext` units parse linearly (rejects the O(N²) scan).
- `tests/_parse-isolation.js`: a silent `Lists` probe leaves `env` unchanged (closed and unclosed list).
- Full suite green.

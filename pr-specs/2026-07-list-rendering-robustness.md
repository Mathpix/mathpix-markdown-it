# PR: List rendering robustness fixes

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.0.2

---

## Context

Several unrelated inputs made LaTeX `itemize`/`enumerate` lists render incorrectly.
All four bugs live in the list env and footnote block rules and are fixed together.

## Fixes

1. **Marker padding for block-content items.**
   A top-level list gets its `padding-inline-start` from the widest custom
   `\item[...]` marker, but the marker width was only measured on the inline item
   path. Items whose content is a block environment (`\begin{figure}`,
   `\begin{tabular}`, a code fence) were skipped, so a list whose long-marker items
   all held block content lost its padding. The width calc is now shared and applied
   on the block item path too.

2. **Fullwidth / CJK marker width.**
   Marker width summed `String.length`, so a fullwidth marker like `\item[11．]`
   (U+FF0E, length 3) was undercounted versus its ASCII twin `\item[11.42]` and fell
   under the padding threshold. Width now counts East-Asian Wide/Fullwidth characters
   as 2 (iterating by code point). ASCII markers are unchanged.

3. **No env-state leak from an aborted list parse.**
   The list block rule parses speculatively into a buffered state that shares `env`
   by prototype. On an unclosed list it returned without restoring `env.isBlock`
   (and `env.inheritedListType`); the leaked `isBlock=true` then let the inline list
   fallback fire on the following content, so an unclosed `itemize` before a
   `tabular` rendered a broken partial list with empty `<>` item bodies. Those
   transient fields are now restored on abort, so the unclosed list degrades to plain
   text exactly as it does without a `tabular`.

4. **Footnote block rules stop at a list start.**
   The `\footnote`/`\footnotetext` block rules scan forward for their open tag using
   a terminator set that included the core markdown list rule but not the LaTeX list
   rule. A `\begin{itemize}` between a paragraph and a later footnote (no blank line)
   did not stop the scan, so the list was swallowed and rendered as literal text
   (a blank line before the list masked it). The LaTeX list rule is now in the
   footnote terminator set, and both footnote rules use it.

## Non-Goals

- The padding heuristic itself (px-per-char, the `> 3` threshold) is unchanged.
- Malformed input still degrades gracefully; the goal is text, not a partial list.

## Testing

- `tests/_data/_lists/_data.js`: added cases for fenced-code and figure block items,
  a fullwidth `11．` marker, an unclosed list + `tabular`, and a list right after a
  paragraph whose item holds a multiline `\footnote{}` / `\footnotetext{}`.
- Full suite green.

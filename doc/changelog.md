# February 2026

## [2.0.35] - 9 February 2026

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

- Fixes:
  - Fixed centering issue for equations with numbering inside `.math-block[data-width="full"]`.

- Docs:
  - Added implementation details in `pr-specs/2026-01-html-math-output-options.md`.

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

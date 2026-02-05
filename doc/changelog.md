# February 2026

## [2.0.34] - 4 February 2026

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

- Fixes:
  - Fixed centering issue for equations with numbering inside `.math-block[data-width="full"]`.

- Docs:
  - Added implementation details in `pr-specs/2026-01-html-math-output-options.md`.

---

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

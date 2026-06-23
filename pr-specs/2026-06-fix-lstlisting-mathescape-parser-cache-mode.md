# PR: Fix lstlisting mathescape parser cache honoring `mathDelimiterMode`

Status: Implemented
Owner: @OlgaRedozubova
Related: `pr-specs/2026-06-math-delimiter-mode.md`, `pr-specs/2026-06-lstlisting-mathescape-dollar-render.md`

---

## Context

`lstlisting[mathescape=true]` content is parsed by a math-only inline parser created in `parse-math-escape-inline.ts`. That parser is cached in a `WeakMap<MarkdownIt, MarkdownIt>` keyed only by the base `MarkdownIt` instance. At construction time it snapshots `baseMd.options`, including `mathDelimiterMode`.

This is correct for `MathpixMarkdownModel.markdownToHTML(...)`, because that path builds a fresh `MarkdownIt` instance per render. It is incorrect for direct plugin consumers that reuse a `MarkdownIt` instance and change `md.options.mathDelimiterMode` between parses. In that case normal prose math sees the current option, but `lstlisting[mathescape]` keeps the first cached mode.

## Reproduction

Run against PR #419:

```js
const MarkdownIt = require('markdown-it');
const plugin = require('./lib/markdown/md-latex-lstlisting-env/index').default;
const src = String.raw`\begin{lstlisting}[mathescape=true]
\\(x\\)
\end{lstlisting}`;
function parseTokenChildren(md, mode) {
  md.options.mathDelimiterMode = mode;
  const token = md.parse(src, {}).find((item) => item.type === 'latex_lstlisting_env');
  return token.children.map((child) => child.type + ':' + (child.content || child.inputLatex)).join('|');
}
const mdLegacyFirst = new MarkdownIt({ outMath: {} });
mdLegacyFirst.use(plugin);
console.log(parseTokenChildren(mdLegacyFirst, 'legacy'));
console.log(parseTokenChildren(mdLegacyFirst, 'strict'));
const mdStrictFirst = new MarkdownIt({ outMath: {} });
mdStrictFirst.use(plugin);
console.log(parseTokenChildren(mdStrictFirst, 'strict'));
console.log(parseTokenChildren(mdStrictFirst, 'legacy'));
```

Current output:

```text
inline_math:x
inline_math:x
text:\\(x\\)
text:\\(x\\)
```

Expected output:

```text
inline_math:x
text:\\(x\\)
text:\\(x\\)
inline_math:x
```

## Goal

Make `parseMathEscapeInline(...)` honor the current `baseMd.options.mathDelimiterMode` on every parse, even when the same `MarkdownIt` instance is reused and its options are mutated between parses.

## Non-Goals

- Changing the public `mathDelimiterMode` contract.
- Changing `MathpixMarkdownModel.markdownToHTML(...)` parser lifecycle.
- Changing `\$` handling or other `lstlisting[mathescape]` escape semantics.
- Changing behavior for plain `lstlisting` without `mathescape`.

## Desired Behavior

- `lstlisting[mathescape]` uses strict mode when `baseMd.options.mathDelimiterMode !== 'legacy'` at parse time.
- `lstlisting[mathescape]` uses legacy mode when `baseMd.options.mathDelimiterMode === 'legacy'` at parse time.
- Direct `MarkdownIt` plugin consumers get the same mode behavior as the high-level model API.
- Cached parser reuse remains acceptable only if option-sensitive values are refreshed before parsing or represented in the cache key.

## Implementation Options

Preferred minimal fix:

- In `parseMathEscapeInline(...)`, after retrieving the cached math-only parser, synchronize option-sensitive fields from `baseMd.options` before `mathMd.inline.parse(...)`.
- At minimum, set `mathMd.options.mathDelimiterMode = baseMd.options.mathDelimiterMode === 'legacy' ? 'legacy' : 'strict'`.

Alternative:

- Cache by `(baseMd, normalizedMathDelimiterMode)` instead of `baseMd` only. This avoids mutating cached parser options, but adds cache complexity.

Avoid:

- Removing the cache without a measured reason.
- Copying all options blindly if that could accidentally refresh unrelated mutable renderer state without tests.

## Testing

- Add a focused test to `tests/_math-delimiter-mode.js` or a small new cache-specific suite using `MarkdownIt` directly with `pluginLatexCodeEnvs`.
- Test `legacy` then `strict` on the same `MarkdownIt` instance:
  - legacy parse of `\\(x\\)` inside `lstlisting[mathescape]` produces `inline_math`.
  - strict parse of the same source on the same instance produces `text`.
- Test `strict` then `legacy` on a second reused instance:
  - strict parse produces `text`.
  - legacy parse produces `inline_math`.
- Keep existing high-level `MathpixMarkdownModel` strict/legacy tests green.

## Done When

- Reused direct `MarkdownIt` instances honor the current `mathDelimiterMode` inside `lstlisting[mathescape]`.
- Existing `mathDelimiterMode` and `lstlisting mathescape dollar` tests still pass.
- The cache comment in `parse-math-escape-inline.ts` no longer documents stale behavior as a caveat; it either states that option-sensitive values are refreshed or describes the mode-aware cache key.

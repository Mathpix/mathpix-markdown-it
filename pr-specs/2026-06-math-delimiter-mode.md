# PR: Math delimiter mode (`mathDelimiterMode`)

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

mathpix-markdown-it accepts `\\( ... \\)` (doubled backslashes) as inline math delimiters, and
`\\[ ... \\]` as display math — the same as the single-backslash `\( ... \)` / `\[ ... \]`. This
doubled form is inherited from the `markdown-it-mathjax` plugin `multiMath` was forked from (which
targeted the markdown→HTML→MathJax pipeline where authors write `\\(x\\)` so the markdown escape layer
emits `\(x\)` for MathJax). It was never a deliberate Mathpix feature.

Two downsides (see the Mathpix monorepo decision in `docs/L200-release.md`, issue
[#20117](https://github.com/Mathpix/monorepo/issues/20117)):

1. **Corrupted model output renders as plausible math.** Mathpix's own pipeline only ever emits
   single-backslash delimiters, so a `\\(` in output is corruption — but the renderer shows it as
   math, masking formatter/model regressions in QA views (IPT compare, Zenpix preview).
2. **No plain-text escape can produce a literal `\(`.** In CommonMark `\\(` is an escaped backslash +
   `(`; here both `\(` and `\\(` are math openers, so the escape hatch is gone.

## Goal

Add `mathDelimiterMode?: 'strict' | 'legacy'` (default `'strict'`) controlling whether double-backslash
`\\(`/`\\[` are treated as math. Defaults encode the intended spec and fail safe (a QA surface that
forgets the option gets strictness, not masking). Scope is the **delimiter acceptance policy**, so an
enum (not a boolean) — extensible to future render modes without a new public option.

## Non-Goals

- Changing single-backslash `\(`/`\[` or dollar `$`/`$$` handling — unaffected in both modes.
- Source rewriting / normalization (`\\(` → `\(`): the renderer never mutates source; normalization
  belongs to an editor/paste layer.

## Desired behavior

- `'strict'` (default): only single-backslash `\(`/`\[` (and `$`/`$$`) open math. `\\(` is not a math
  delimiter — CommonMark escape applies (`\\` → literal `\`).
- `'legacy'`: also accept `\\(`/`\\[` (the pre-3.0.0 behavior).

## Implementation

- `optionsMathpixMarkdown` / `TMarkdownItOptions`: add `mathDelimiterMode?: 'strict' | 'legacy'`.
- Threaded onto `md.options` in all assembly sites (`mathpix-markdown-model`, `markdown/index`,
  `mathpix-markdown-plugins`, `components/mathpix-markdown`) — parity with `defaultCellVerticalAlign`.
- `multiMath` (`mdPluginRaw.ts`): in `'strict'`, the doubled openers `\\[` / `\\(` `return false`, so
  they fall through to the `escape` rule (literal `\(`). Generic — no context logic.
- lstlisting `[mathescape=true]` (`parse-math-escape-inline.ts`): code is verbatim, so the math-only
  parser has no `escape` rule; instead of the default escape it installs a **verbatim backslash rule**
  that keeps `\\` literal and consumes the pair together (so the 2nd backslash can't re-open a single
  `\(`). Result: `'strict'` leaves `\\(` verbatim in code; single `\(` is still math (what `mathescape`
  enables); `'legacy'` treats `\\(` as math.
- Browser auto-render (`browser/auto-render.ts`): `MathpixRenderConfig.mathDelimiterMode` (default
  `'strict'`); `stripOuterMathDelimitersIfWhole` accepts `\\(...\\)` / `\\[...\\]` only in `'legacy'`
  — symmetry with the server parser for the N=1/N=2 cases.

## Breaking change / migration

Semver **major** (3.0.0): a renderer-behavior change is a format-spec change. Versions ≤ 2.x rendered
`\\( ... \\)` as math; under the new `'strict'` default it renders as literal `\(...\)`. Consumers that
rely on doubled delimiters (pasted / legacy MathJax-era content) must pass `mathDelimiterMode: 'legacy'`
explicitly. Loud note in the changelog and README. Per-surface guidance lives in the monorepo decision
(`docs/L200-release.md`): user-content surfaces (snip-web, mathpix-markdown-bundle desktop, website,
mathpix-converter) → `'legacy'`; pipeline-output surfaces (console-web, IPT compare, Zenpix preview) →
`'strict'` default.

## Testing

- `tests/_math-delimiter-mode.js`: prose + lstlisting × strict/legacy/default, for single `\(`/`\[`,
  doubled `\\(`/`\\[`, and `$`/`$$`; literal-preservation (prose collapse vs lstlisting verbatim);
  legacy doubled ≡ single math.
- `tests/_auto_render.js`: strict does not render doubled `\\(`, legacy renders `\\(`/`\\[`, single
  `\(` renders in both modes.
- Full suite green; default `'strict'` is the no-op-on-single-backslash invariant.

## Done When

- [x] `mathDelimiterMode` in both option interfaces, threaded onto `md.options` at all sites.
- [x] `multiMath` rejects doubled openers in `'strict'`.
- [x] lstlisting mathescape verbatim in `'strict'`; single `\(` still math.
- [x] Browser auto-render honors the mode.
- [x] Golden tests for both modes; full suite passes.
- [x] Changelog + README updated; semver-major bump to 3.0.0.

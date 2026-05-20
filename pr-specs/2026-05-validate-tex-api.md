# PR: Add `validateTex` API for fast side-effect-free TeX syntax checking

Status: Active
Owner: @OlgaRedozubova

---

## Context

The `forLatex` output mode (used by `forDocx`/`forMD`/`forPptx` and direct LaTeX export) bypasses MathJax conversion to keep latex export cheap — `mdPluginRaw.ts:174-191` skips `convertMathToHtml` and stores raw markup on tokens. The cost: **broken formulas are not detected** and silently end up in the output, where downstream LaTeX compilation fails.

This PR adds an opt-in API that lets consumers ask MathJax "is this formula parseable?" without producing rendered output and without affecting the rendering pipeline's equation counter, labels, or ids.

---

## Goal

- Expose `MathpixMarkdownModel.validateTex(latex, { display? })`.
- Use MathJax's actual parser (verdict matches what `convertMathToHtml` would have raised) — not a regex approximation.
- Skip everything that does not contribute to error detection: output jax, post-filters, `MathItem`/`MathDocument` orchestration.
- Guarantee zero side-effects on the rendering pipeline.
- Properly typed result: discriminated union + custom error class.

---

## Non-Goals

- Automatic validation inside `markdownToHTML` or the `forLatex` token stream. This PR exposes the primitive; **where** to wire it in is a separate decision per pipeline.
- Cross-version "is this also LaTeX-valid?" guarantee. MathJax's command set is not a strict superset or subset of LaTeX's — false positives/negatives against `pdflatex` are possible by construction.
- Caching / memoization of results.
- Reporting multiple errors per formula (MathJax raises the first parse error and stops; we mirror that).
- Async API.

---

## Current Behavior

- `forLatex: true` skips `convertMathToHtml` entirely. No syntactic check on formula contents.
- The only existing pre-flight check is `checkFormula` (`src/mathpix-markdown-model/check-formula.ts`) which matches delimiters but does not parse formula bodies.

---

## Desired Behavior

`MathpixMarkdownModel.validateTex(latex, { display? = true }): TexValidationResult` where:

```ts
type TexValidationResult =
  | { valid: true }
  | { valid: false; error: TexValidationError };
```

`TexValidationError extends Error` carries `code` (`TexError.id`, e.g. `'MissingArgFor'`, `'BadMath'`) and `latex` (the failed input — useful for batch error reporting).

Semantics:
- Returns `{ valid: true }` if MathJax's `TexParser` completes without throwing.
- Returns `{ valid: false; error }` on `TexError`; non-`TexError` exceptions (rare; would indicate MathJax internal bug) are also wrapped, with `code` unset.
- Never throws. Batch callers processing thousands of formulas always get a return value.
- Stateless: each call resets the validator's internal `tags` state. Repeated identical inputs always produce the same result.

---

## Constraints / Invariants

- **Zero side-effects on the render pipeline.** `getLastEquationNumber()` and `markdownToHTML` output must be byte-identical whether or not `validateTex` is called between renders.
- **Same verdict as render path on syntactic errors.** If `MathJax.TexConvert` would have raised a `TexError`, `validateTex` must also return `{ valid: false }`.
- **No output jax invoked.** No SVG, no glyph measurement, no DOM adaptor mutation.
- **Never throws on bad input.** A bad formula in a batch must not abort the batch.
- **No regression on existing tests.**

---

## Public API changes

| Symbol | Where | Effect |
|--------|-------|--------|
| `MathpixMarkdownModel.validateTex` | `mathpix-markdown-model/index.ts` | New method, opt-in. Nothing calls it automatically. |
| `MathJax.ValidateTex` | `mathjax/index.ts` | Underlying implementation. |
| `TexValidationResult` | `mathjax/index.ts` | Exported discriminated union. |
| `TexValidationError` | `mathjax/index.ts` | Exported class extending `Error`. |

No removals, no signature changes to existing methods.

---

## Architecture

### Why a dedicated MathJax instance

The render path's input jax (`MJ.mTex`) cannot be repurposed for validation without **side-effects on shared `parseOptions.tags` state**: a valid formula's `finishEquation` commits `allCounter`, `allLabels`, `allIds` (`Tags.js:203-215`). Snapshot/restore is fragile (couples to internal field names) and was tried first.

The clean design uses MathJax's own isolation mechanism — a separate `MTeX` instance with its own `parseOptions`, configured with `tags: 'none'` (same `NoTags` class already used by the `nonumbers` mode). The `MmlFactory` is shared with `mTex` because `MmlFactory` is stateless and wiring a fresh one normally requires constructing a full `MathDocument` (unnecessary overhead). See `mathjax.ts` (`initTex`, `setHandler`).

### Why bypass `MathItem.compile()` and call `TexParser` directly

`TeX.compile` (`tex.js:116-141`) does seven steps. Only step 4 (`TexParser.mml()`) raises parse errors. Steps 5-7 (math-node wrapping, `finishEquation`, six post-filter tree walks via `cleanSubSup`, `setInherited`, `moveLimits`, `cleanStretchy`, `cleanAttributes`, `combineRelations`) are **pure transformations** that never throw on parse-valid input — they prepare MML for rendering, not validation. Skipping them is ~10-20% faster and structurally simpler.

The validation function in `mathjax/index.ts`:
1. `parseOptions.clear()` — resets per-call state.
2. `tags.reset(0)` — clears accumulated labels from prior validation calls (the isolated instance is reused; without reset, repeated `\label{eq}` would raise "duplicate label" on the second call).
3. `tags.startEquation(stub)` — initializes `currentTag` for environment macros. The stub `{ inputData: {} } as any` is sufficient because `startEquation` reads only `math.inputData.recompile` (`Tags.js:197-201`).
4. `new TexParser(latex, env, parseOptions); parser.mml()` — the actual parse.
5. Catch `TexError` → return `{ valid: false; error }`. Catch other errors → also return wrapped (never propagate).

### Why a custom error class

`TexValidationError extends Error` instead of plain `Error`:
- `instanceof TexValidationError` distinguishes from other errors a caller might handle.
- `latex` field captures input formula so batch callers don't need to track which formula failed.
- `code` exposes `TexError.id` for programmatic handling.

The constructor restores the prototype chain explicitly — required because the TypeScript target is ES5, where `super(Error)` does not preserve `instanceof`.

### Why a discriminated union for the result

`Error | null` mixes "no error" and "error" in one value and requires a falsy check. A discriminated union narrows the type in the `!result.valid` branch — `result.error` is typed as `TexValidationError` without an extra guard. Shorter caller code, TypeScript catches misuse at compile time.

---

## Edge Cases

- **Repeated identical formulas**: stateless. Two identical inputs always produce the same result. No "duplicate label" leakage between calls.
- **Empty or whitespace-only input**: parser treats as empty math; returns `{ valid: true }`. Caller decides whether empty is meaningful.
- **Formula with `\label{foo}`**: validates as `{ valid: true }`. The label is **not** written to the rendering pipeline's `getLabelsList()`.
- **Formula with `\begin{equation}` auto-numbered**: validates as `{ valid: true }`. `getLastEquationNumber()` is unaffected.
- **Display vs inline**: `display: true` (default) for block math, `display: false` for inline. Affects which constructs are valid (e.g. `\tag{}` requires display).
- **Non-TexError thrown inside MathJax**: wrapped into `TexValidationError` with no `code`. Caller can detect via absence of `code`.
- **Concurrent calls**: JavaScript is single-threaded; the isolated instance is reused serially. Each call resets state before parsing.

---

## Done When

- [x] `src/mathjax/mathjax.ts` declares typed `public validateTex: TeX<any, any, any>` and instantiates `MTeX` with `tags: 'none'` in `initTex`
- [x] `setHandler` wires `mmlFactory` from `mTex` into `validateTex`
- [x] `src/mathjax/index.ts` exports `TexValidationError` class and `TexValidationResult` type
- [x] `MathJax.ValidateTex` calls `TexParser` directly, bypassing `MathItem`/`MathDocument`
- [x] `TexValidationError` constructor restores prototype chain (ES5 target compatibility)
- [x] `MathpixMarkdownModel.validateTex` exposes the API as a method on the public singleton
- [x] Unit tests in `tests/_validateTex.js` cover return value, no-side-effect on counter, no-side-effect on labels, statelessness, isolation from render pipeline
- [x] All existing tests pass; full suite reports `3491 passing` (3478 existing + 13 new)
- [ ] `Status` updated to `Implemented` after merge

---

## Testing

### Unit tests (`tests/_validateTex.js`)

- **Return value**: valid inline / valid display / valid environment → `{ valid: true }`; unmatched brace / unknown control sequence / unclosed environment → `{ valid: false; error: TexValidationError }`.
- **`TexValidationError` properties**: `instanceof`, `message` matches `/TeX error/i`, `latex` equals the input, `code` is set for known TexError IDs.
- **No side-effects on equation counter**: `getLastEquationNumber()` unchanged after validating valid auto-numbered equations, invalid formulas, and many calls in a loop.
- **No side-effects on labels**: rendering `\label{eq:a}` + `\eqref{eq:a}` produces identical HTML whether or not the same formula was validated beforehand. Two consecutive `validateTex` calls with the same `\label{...}` both succeed.
- **Cross-render isolation**: two `markdownToHTML` calls produce the same output whether or not `validateTex` is invoked between them.

### Regression suite

```bash
npm test
```

Full suite must report `3491 passing`.

---

## Risk / Rollback

**Risk**: Low

- Purely additive. Existing render paths are not modified.
- Validation runs against an isolated MathJax instance; no shared mutable state with the render pipeline.
- Opt-in: nothing calls `validateTex` automatically. Consumers who don't use it experience zero behavior change.
- One-time memory cost: extra `MTeX` instance (~100-500 KB). No per-call allocations beyond the MML tree, immediately GC'd.

**Risk areas to watch**:

- MathJax internals (`TexParser`, `ParseOptions.clear`, `Tags.reset`, `Tags.startEquation`) are not public API. A future MathJax upgrade may change signatures. Integration is documented above so the breakage point is locatable.
- The `{ inputData: {} } as any` stub may need adjustment if MathJax tightens the `MathItem` shape used by `startEquation`. Currently only `math.inputData.recompile` is read.

**Rollback**: revert PR. No data migrations, no API contracts broken.

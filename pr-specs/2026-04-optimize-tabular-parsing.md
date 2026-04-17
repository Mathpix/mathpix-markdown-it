# PR: Optimize tabular parsing performance

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Parsing a 3.9 MB MMD document with 165 `\begin{tabular}` blocks and 60K inline math expressions caused 158 seconds for `md.parse()` and 5.7 GB peak heap usage. The document represents a realistic worst case: large geographic coordinate tables where every cell contains `\( ... \)` math.

---

## Goal

Reduce parse time and memory usage for documents with many tabular environments and repeated math expressions.

---

## Non-Goals

- Persistent cross-parse MathJax cache (decided against — complexity outweighs benefit for the converter use case).
- Migrating all module-level state to `state.env` (separate PR scope, tracked in `pr-specs/2026-04-global-state-cleanup-and-perf.md`).

---

## Current Behavior

- `getSubMath()` recursively rebuilds the entire string on every math expression found — O(N×M) where N=string length, M=math count.
- `mathTable` uses `Array` with `findIndex()` for lookups — O(n) per lookup.
- `MathJax.Typeset()` is called for every math token, including 40K duplicates (66.8% of 60K total).

---

## Desired Behavior

- `getSubMath()` scans the string once with a global regex, collects segments into an array, joins at the end — O(N+M).
- `mathTable` uses `Map` for O(1) lookups.
- Duplicate `inline_math` and `display_math` tokens within a single `md.parse()` reuse cached MathJax results — per-parse deduplication via `state.env`.

---

## Constraints / Invariants

- Cache must NOT persist between `md.parse()` calls — each parse gets a fresh cache via `state.env.__mathpix` (following markdown-it-footnote convention).
- Cache must NOT be used when `options.outMath` is temporarily mutated (e.g. `SetItemizeLevelTokens` for `forDocx`) — `beginCacheBypass(state)` / `endCacheBypass(state)` counter mechanism.
- Cached results must be isolated from downstream mutation — `data` and `labels` are shallow-cloned on cache insert.
- Accessibility IDs (`mjx-mml-*`) must be unique per token — on cache hit, the original ID is replaced with a fresh one via `MathJax.nextAssistiveId()`.
- Numbered equations (`equation_math`, `equation_math_not_number`), MathML input tokens, and ascii-extraction tokens are never cached (side effects).
- `buildFormatOutputs` is applied after cache lookup (not cached) to correctly handle `output_format: 'latex'` with different `inputLatex`.

---

## Done When

- [x] `getSubMath` is iterative single-pass
- [x] `mathTable` is `Map<string, string>`
- [x] Per-parse math cache in `state.env.__mathpix` deduplicates identical math
- [x] Cache bypass for `SetItemizeLevelTokens` forDocx mutation
- [x] Accessibility IDs unique on cache hits
- [x] All existing tests pass
- [x] New tests cover: dedup, equation bypass, env isolation, mutation protection, accessibility ID uniqueness, cache bypass counter, forDocx integration
- [x] Benchmark: 179s → ~16s parse time (SVG mode), 5.7GB → ~346MB heap

---

## Architecture

### getSubMath (sub-math.ts)

Iterative single-pass with local `new RegExp(RE_MATH_OPEN.source, 'g')`:
- `RE_MATH_OPEN` stored as literal without `/g` flag (immutable template)
- Each call creates a local copy — reentrant-safe
- `getEndMarker()` uses capture groups for eqref/ref detection (no substring matching)
- `shouldSkipDollar()` validates `$`/`$$` edge cases
- `mathTablePush()` accepts both `(id, content)` and `({id, content})` for backward compatibility

### Per-parse math cache (convert-math-to-html.ts)

```
state.env.__mathpix = {
  inlineCache: Map<math, CachedResult>,   // inline_math tokens
  displayCache: Map<math, CachedResult>,  // display_math tokens
  cacheBypass: number,                     // >0 disables cache (SetItemizeLevelTokens)
}
```

Initialized by `init_math_cache` core ruler hook (fires on every parse, including partial renders).

On cache hit with accessibility:
- Extract original `_mjxId` from `<mjx-assistive-mml id="...">` via `RE_MJX_ASSISTIVE_ID` regex
- Replace with fresh ID from `MathJax.nextAssistiveId()` via `split().join()`
- Applied to both `html` and `data.svg`

### Cache bypass (re-level.ts)

`SetItemizeLevelTokens` and `SetItemizeLevelTokensByIndex` call `beginCacheBypass(state)` before mutating `outMath` for forDocx, and `endCacheBypass(state)` in `finally` block. Counter (not boolean) handles nested calls.

---

## Benchmark

Test document: 3.9 MB MMD, 165 tabulars, 60K math expressions.

| Mode | Before | After | Improvement |
|------|--------|-------|-------------|
| SVG (`include_svg: true`) | 179s | **~16s** | **11×** |
| SVG + assistiveMml | 179s | **~22s** | **8×** |

---

## Files Changed

| File | Change |
|------|--------|
| `src/markdown/md-block-rule/begin-tabular/sub-math.ts` | Iterative `getSubMath`; `mathTable` Array→Map; `mathTablePush` overload; `getEndMarker` with capture groups |
| `src/markdown/common/convert-math-to-html.ts` | Per-parse cache in `state.env.__mathpix`; `initMathCache`; `beginCacheBypass`/`endCacheBypass`; accessibility ID replacement |
| `src/markdown/mdPluginRaw.ts` | Register `init_math_cache` core ruler hook |
| `src/markdown/md-latex-lists-env/re-level.ts` | `beginCacheBypass`/`endCacheBypass` around forDocx mutation; `try/finally` for `outMath` restoration |
| `tests/_sub-math.js` | 26 unit tests for `getSubMath` edge cases |
| `tests/_typeset-cache.js` | 14 tests: dedup, env isolation, mutation protection, accessibility IDs, bypass counter, forDocx integration |
| `tests/_accessibility.js` | 3 tests: unique IDs with cache, aria-labelledby consistency, no IDs without a11y |

---

## Testing

- All 3,286 tests pass
- No new public API options — cache is always on, scoped per-parse via `state.env`
- Shared `envToInline` per table reduces memory for large documents with many table cells
- `mathTablePush` backward-compatible overload preserved

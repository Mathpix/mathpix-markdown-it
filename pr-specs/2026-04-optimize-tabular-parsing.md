# PR: Optimize tabular parsing — iterative getSubMath + MathJax result cache

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Parsing a 3.9 MB MMD document with 165 `\begin{tabular}` blocks and 60K inline math expressions caused:
- **158 seconds** for `md.parse()`
- **5.7 GB** peak heap usage

The document represents a realistic worst case: large geographic coordinate tables where every cell contains `\( ... \)` math.

---

## Root Cause

### 1. `getSubMath()` — recursive O(N x M) string rebuilding

**File:** `src/markdown/md-block-rule/begin-tabular/sub-math.ts`

The function extracted math expressions from tabular content by:
1. Finding a math opener (regex `.match()` on `str.slice(startPos)` — copies the string)
2. Replacing the match with a UUID placeholder via string concatenation (`str.slice(0, start) + placeholder + str.slice(end)` — copies the whole string again)
3. Recursively calling itself on the rebuilt string

For a 36 KB tabular block with 100 math expressions, this produced ~200 intermediate string copies, totaling ~7 MB of garbage per block. Across 165 blocks: **~1.2 GB of transient string allocations**, plus GC pressure that pushed V8 to 5+ GB before collection.

Additionally, `mathTable` was an `Array<{id, content}>` with `findIndex()` for lookups — O(n) linear scan growing with every extracted expression.

### 2. Duplicate MathJax calls — 66.8% redundancy

**File:** `src/markdown/common/convert-math-to-html.ts`

V8 profiling showed `multiMath` (the inline rule calling `MathJax.Typeset()`) consumed 36 seconds. Analysis revealed:
- 60,305 total MathJax calls
- Only 20,016 unique expressions
- 40,289 duplicate calls (66.8%)

Common symbols repeated across table cells accounted for the majority of duplicates.

---

## Fix

### 1. Iterative single-pass `getSubMath()`

Replaced the recursive implementation with an iterative algorithm:
- Uses `RE_MATH_OPEN` with global flag (`/g`) and `exec()` in a `while` loop
- Collects non-math segments and placeholders into `parts: string[]`
- Joins once at the end: `parts.join('')`
- The original string is never mutated or rebuilt mid-scan

Extracted helper functions for readability:
- `getEndMarker(match)` — maps opening marker to closing marker
- `shouldSkipDollar(str, marker, begin, end)` — validates `$`/`$$` matches (escaped, whitespace-padded, digit-followed)

Replaced `mathTable: Array` with `Map<string, string>` for O(1) lookups.

### 2. MathJax typeset result cache

Added a two-level `Map<boolean, Map<string, TypesetResult>>` cache in `typesetMathForToken()`:
- **Key:** outer = display mode (`true`/`false`), inner = raw math content string. No separator in key — eliminates collision risk.
- **Cache hit:** returns stored result, skips MathJax entirely.
- **Cache scope:** instance-scoped via `WeakMap<options, InstanceCache>` — each md instance has its own isolated cache. Cleared at the start of every full `md.parse()` via a `core.ruler.before('normalize', 'reset_typeset_cache', ...)` hook. The hook checks `renderElement` at runtime: partial re-renders skip the clear so the same instance's cache survives. Different md instances never share cache entries. Capped at 50,000 entries per display-mode bucket.

**What is cached:** `inline_math` and `display_math` tokens only (path 4 in `typesetMathForToken`).

**What is NOT cached:**
- `equation_math` / `equation_math_not_number` — these advance the MathJax equation counter via `MathJax.Reset(beginNumber)`
- MathML input tokens — different MathJax path (`TypesetMathML`)
- Ascii-extraction tokens (`return_asciimath`) — different MathJax path (`TypesetSvgAndAscii`) with side-effect options

### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `typesetCacheSize` | `number` | `50000` | Max entries per display-mode bucket. Set to `0` to disable caching. |

Available in all option entry points: `MathpixMarkdownModel.render()`, `mathpixMarkdownPlugin` options, `<MathpixMarkdown>` React props, and `mdInit()` in `markdown/index.ts`.

---

## Benchmark

Test document: 3.9 MB MMD, 15,956 lines, 165 tabulars, 60,308 math expressions.

Mode: `include_typst: true, include_svg: false` (Typst converter pipeline)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| `md.parse()` time | 158 s | 16.8 s | **9.4x faster** |
| Heap after parse | 5,700 MB | 367 MB | **15.5x less** |
| RSS after parse | 5,700 MB | 600 MB | **9.5x less** |

Mode: `include_svg: true` (standard HTML pipeline)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total time | 179 s | 32 s | **5.6x faster** |
| RSS | 2,549 MB | 1,497 MB | **-1 GB** |

---

## Files Changed

| File | Change |
|------|--------|
| `src/markdown/md-block-rule/begin-tabular/sub-math.ts` | Rewrite `getSubMath` to iterative; `mathTable` Array → Map; extract helpers |
| `src/markdown/common/convert-math-to-html.ts` | Add `typesetCache` Map + `clearTypesetCache()`; cache inline/display math results |
| `src/markdown/mdPluginRaw.ts` | Register `core.ruler` hook to clear typeset cache at the start of every `md.parse()` |

---

## Testing

- All existing tests pass (3,242 on master branch)
- Added `tests/_sub-math.js` — 23 unit tests for `getSubMath` edge cases: escaped `$`, whitespace-padded `$`, digit after `$`, unclosed `$`, trailing unclosed `$`, `\\[...\\]`, `\\(...\\)`, `\begin{abstract}`, `\begin{tabular}`, `\begin{equation}`, `\begin{referral}`, eqref, ref, multiple expressions, sequential calls
- Added `tests/_typeset-cache.js` — 6 tests verifying cache behavior: duplicate inline_math cache hit, equation_math bypass (numbering), cache cleared between parse calls, display/inline mode isolation, typesetCacheSize cap
- Verified output identity: HTML output matches original on benchmark file

### Breaking change

- `mathTablePush` signature changed from `(item: {id, content})` to `(id: string, content: string)`. No external callers found in the codebase.

### Cache exclusions

The following token types are **never** cached (to preserve correctness):
- `equation_math` / `equation_math_not_number` — advance MathJax equation counter
- `inline_mathML` / `display_mathML` — different MathJax path (TypesetMathML)
- tokens with `return_asciimath` — different MathJax path (TypesetSvgAndAscii) with side-effect options

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

Added a `Map<string, TypesetResult>` cache in `typesetMathForToken()`:
- **Key:** `math_content + "|" + display_mode` (`"D"` or `"I"`)
- **Cache hit:** returns stored result, skips MathJax entirely
- **Cache scope:** cleared on every `md.parse()` call via `clearTypesetCache()` (called alongside `clearLabelsList()` in `mdPluginRaw.ts`)

**What is cached:** `inline_math` and `display_math` tokens only (path 4 in `typesetMathForToken`).

**What is NOT cached:**
- `equation_math` / `equation_math_not_number` — these advance the MathJax equation counter via `MathJax.Reset(beginNumber)`
- MathML input tokens — different MathJax path (`TypesetMathML`)
- Ascii-extraction tokens (`return_asciimath`) — different MathJax path (`TypesetSvgAndAscii`) with side-effect options

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
| `src/markdown/mdPluginRaw.ts` | Call `clearTypesetCache()` on plugin init |

---

## Testing

- All existing tests pass (3,242 on master branch)
- No new test files — optimization is transparent to output
- Verified output identity: HTML output from patched version matches original byte-for-byte on the benchmark file

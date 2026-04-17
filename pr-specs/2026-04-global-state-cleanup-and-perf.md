# PR: Global state cleanup and performance improvements

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Audit of the codebase revealed multiple module-level mutable state variables that accumulate data across documents in long-lived processes (web servers, Electron apps, PDF generators). Additionally, several hot-path data structures use Array + `findIndex()` for lookups that should be O(1) Maps, and `getInlineCodeListFromString` result was scanned with `.find()` per character in `findEndMarker()` — O(n × m).

These issues are the same class of problems fixed in the `getSubMath()` / `typesetCache` optimization PR — but in other subsystems.

---

## Fixes implemented

### 1. Per-parse global state cleanup via `core.ruler` hook

**File:** `src/markdown/mdPluginTableTabular.ts`

- All `Clear*` functions (`ClearTableNumbers`, `ClearFigureNumbers`, `ClearSubTableLists`, `ClearSubMathLists`, `ClearDiagboxTable`, `ClearParseError`, `ClearExtractedCodeBlocks`) are now called at the start of every `md.parse()` via a `core.ruler.before('normalize', 'reset_tabular_state', ...)` hook.
- Previously these ran only once during `md.use()` (plugin registration). If an md instance was reused for multiple documents (e.g. server scenario), globals accumulated across parses.
- The one-time `md.use()` call is kept for initial cleanup. The hook guarantees cleanup on every subsequent parse.

### 2. `diagboxTable` — module-level Map without cleanup

**File:** `src/markdown/md-block-rule/begin-tabular/sub-cell.ts`

- Added `ClearDiagboxTable()` and reverse-lookup `diagboxById` Map.
- `findInDiagboxTable()` changed from O(n) iteration to O(1) Map lookup.

### 3. `subTabular` — Array → Map

**File:** `src/markdown/md-block-rule/begin-tabular/sub-tabular.ts`

- Replaced `Array<TSubTabular>` with `Map<string, TSubTabular>`.
- 4 `findIndex` call sites → `.get()` — O(1).
- Removed `id` field from `TSubTabular` type (key is the Map key).

### 4. `extractedCodeBlocks` — Array → Map

**File:** `src/markdown/md-block-rule/begin-tabular/sub-code.ts`

- Replaced `Array<TExtractedCodeBlock>` with `Map<string, string>`.
- `findIndex` → `.has()` + `.get()` — O(1).

### 5. `getInlineCodeListFromString` → position Set

**File:** `src/markdown/common.ts`

- Added `buildInlineCodePositionSet()` — builds `Set<number>` of all positions inside inline code spans.
- `findEndMarker()` now uses `codePositions.has(i)` — O(1) per character instead of O(m) `.find()`.
- `extractNextBraceContent()` in `sub-cell.ts` also updated to use position Set.
- Fixed off-by-one: old code used `posEnd >= i` (inclusive), new code uses `p < posEnd` (exclusive, correct for `str.slice(posStart, posEnd)` semantics).

### 6. `labelsList` — Map indexes for O(1) lookups

**File:** `src/markdown/common/labels.ts`

- Primary store: `labelsByKey: Map<string, ILabel>` (insertion order preserved).
- Secondary index: `labelsByUuid: Map<string, ILabel>` for `tokenUuidInParentBlock` lookups.
- `addIntoLabelsList`: O(1) dedup by key, stale uuid cleanup on key collision.
- `getLabelByKeyFromLabelsList` / `getLabelByUuidFromLabelsList`: O(1) Map lookup.
- `getLabelsList()`: derives array from `labelsByKey.values()`.
- `groupLabelIdByUuidFromLabelsList`: iterates `labelsByKey.values()`.

### 7. `makeTagRegexes` — 6 RegExp per HTML block → cached

**File:** `src/markdown/md-block-rule/mmd-html-block.ts`

- Added `tagRegexCache: Map<string, RegexSet>`.
- `getTagRegexes(tagName)` returns cached regex set — O(1) after first call per tag name.
- Fixed `lastIndex` corruption: replaced `RX.CLOSE_ANY.test(lineText)` with `lineText.match(RX.CLOSE_ANY)` — `String.match()` with `/g` regex does not mutate `lastIndex`, unlike `RegExp.test()`.

### 8. `getMathTableContent` — double slice

**File:** `src/markdown/md-block-rule/begin-tabular/sub-math.ts`

- `trimmed.slice(i)` computed once as `tail`, reused for both match attempts.

### 9. `utf8Encode` — O(n²) string concat

**File:** `src/markdown/md-svg-to-base64/base64.ts`

- `utftext +=` in character loop → `parts.push()` + `join('')`.

### 10. `SetItemizeLevelTokens` — full options clone

**File:** `src/markdown/md-latex-lists-env/re-level.ts`

- `{ ...state.md.options }` shallow clone on every call → save/restore only `outMath` (the only field actually modified inside the `forDocx` branch).
- Wrapped in `try/finally` to guarantee `outMath` restoration even if `state.md.inline.parse()` throws.
- Applied to both `SetItemizeLevelTokens` and `SetItemizeLevelTokensByIndex`.

---

## Intentionally not changed

| Issue | File | Reason |
|-------|------|--------|
| Highlight dedup O(n²) in `codeInlineHighlight` / `filteredHighlightContent` | `highlight/render-rule-highlights.ts`, `highlight/common.ts` | Order-dependent dedup is pre-existing behavior. Changing it risks behavioral regression in snip-web without adequate test coverage. Highlights are typically small (< 100 items) — O(n²) with splice is microseconds. |
| String concatenation `result +=` in sanitize-html | `sanitize-html.ts` | Third-party-derived code, separate concern |
| Click handler not removed in MathpixMarkdownModel | `mathpix-markdown-model/index.ts` | Browser-only, separate PR |
| `setInterval` in scrollPage without cleanup | `mathpix-markdown-model/index.ts` | Browser-only, separate PR |
| Context menu listeners without guaranteed cleanup | `contex-menu/index.ts` | Browser-only, separate PR |

---

## Files changed

| File | Changes |
|------|---------|
| `src/markdown/mdPluginTableTabular.ts` | `clearTabularState()` extracted + `core.ruler` per-parse hook, `ClearDiagboxTable()` call |
| `src/markdown/md-block-rule/begin-tabular/sub-cell.ts` | `ClearDiagboxTable()`, `diagboxById` reverse Map, `buildInlineCodePositionSet` in `extractNextBraceContent` |
| `src/markdown/md-block-rule/begin-tabular/sub-tabular.ts` | Array → Map, all `findIndex` → `.get()` |
| `src/markdown/md-block-rule/begin-tabular/sub-code.ts` | Array → Map |
| `src/markdown/md-block-rule/begin-tabular/sub-math.ts` | Single `tail` slice in `getMathTableContent` |
| `src/markdown/common.ts` | `buildInlineCodePositionSet()`, `findEndMarker` uses `Set.has()` |
| `src/markdown/common/labels.ts` | `labelsByKey` + `labelsByUuid` Map indexes, O(1) lookups |
| `src/markdown/md-block-rule/mmd-html-block.ts` | `tagRegexCache` memoization, `.test()` → `.match()` for g-regex |
| `src/markdown/md-svg-to-base64/base64.ts` | `parts[]` + `join()` in utf8Encode |
| `src/markdown/md-latex-lists-env/re-level.ts` | Save/restore only `outMath` + `try/finally` |

---

## Testing

- All 3,276 existing tests pass
- Per-parse cleanup verified: 100 sequential parses on same md instance — no memory growth
- No behavioral changes to highlight rendering (files reverted to master)

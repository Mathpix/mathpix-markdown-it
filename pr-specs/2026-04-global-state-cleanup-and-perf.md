# PR: Global state cleanup and performance improvements

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Audit of the codebase revealed multiple module-level mutable state variables that accumulate data across documents in long-lived processes. Additionally, several hot-path data structures use Array + `findIndex()` for O(n) lookups that should be O(1) Maps, and `getInlineCodeListFromString` result was scanned with `.find()` per character — O(n × m).

---

## Goal

Fix memory leaks from module-level state, improve lookup performance for tabular-related data structures, and add per-parse cleanup guarantees for reused md instances.

---

## Non-Goals

- Highlight dedup optimization (order-dependent behavior is pre-existing, changing risks regression in snip-web without test coverage).
- Migrating mathTable/subTabular/extractedCodeBlocks to `state.env` (future PR — these already work correctly with per-parse `reset_tabular_state` hook).
- Browser-only concerns (click handlers, setInterval, context menu listeners).

---

## Current Behavior

- `Clear*` functions run once at `md.use()` time. If md instance is reused for multiple documents, module-level state accumulates.
- `diagboxTable` has no cleanup function at all — unbounded growth.
- `subTabular`, `extractedCodeBlocks` use Array + `findIndex()` — O(n) per lookup.
- `findEndMarker()` calls `.find()` on inline code list for every character position — O(n × m).
- `labelsList` uses Array for all lookups — O(n) per `find`/`findIndex`.
- `makeTagRegexes` creates 6 new RegExp objects per HTML block.
- `SetItemizeLevelTokens` clones entire `md.options` object on every call.

---

## Desired Behavior

- All `Clear*` functions run at the start of every `md.parse()` via `core.ruler` hook — no state leaks between documents.
- All lookup data structures use Map for O(1) access.
- Inline code position check is O(1) via `Set<number>`.
- Tag regex objects are cached and reused.
- `SetItemizeLevelTokens` saves/restores only `outMath` with `try/finally`.

---

## Constraints / Invariants

- `reset_tabular_state` hook respects `renderElement.startLine` — partial renders skip cleanup (tabular state may be needed for UUID resolution across partial sections).
- Highlight rendering files (`render-rule-highlights.ts`, `common.ts`) are NOT modified — reverted to master to avoid behavioral regression.
- `labelsList` export kept for deep-import backward compatibility (deprecated, derived from `labelsByKey` Map).

---

## Done When

- [x] Per-parse `reset_tabular_state` hook clears all tabular module-level state
- [x] `diagboxTable` has `ClearDiagboxTable()` + `diagboxById` reverse Map
- [x] `subTabular` converted from Array to Map
- [x] `extractedCodeBlocks` converted from Array to Map
- [x] `labelsByKey` + `labelsByUuid` Map indexes for O(1) lookups
- [x] `buildInlineCodePositionSet()` → `Set<number>` for O(1) position check
- [x] `tagRegexCache` memoization + `.test()` → `.match()` fix for g-regex lastIndex
- [x] `utf8Encode` uses `parts[]` + `join()` instead of `+=`
- [x] `SetItemizeLevelTokens` saves/restores only `outMath` with `try/finally`
- [x] All 3,286 tests pass

---

## Files Changed

| File | Change |
|------|--------|
| `src/markdown/mdPluginTableTabular.ts` | `clearTabularState()` + `core.ruler` per-parse hook with `renderElement` check |
| `src/markdown/md-block-rule/begin-tabular/sub-cell.ts` | `ClearDiagboxTable()`, `diagboxById` reverse Map, `buildInlineCodePositionSet` in `extractNextBraceContent` |
| `src/markdown/md-block-rule/begin-tabular/sub-tabular.ts` | Array → Map, all `findIndex` → `.get()` |
| `src/markdown/md-block-rule/begin-tabular/sub-code.ts` | Array → Map |
| `src/markdown/md-block-rule/begin-tabular/sub-math.ts` | Single `tail` slice in `getMathTableContent` |
| `src/markdown/common.ts` | `buildInlineCodePositionSet()`, `findEndMarker` uses `Set.has()` |
| `src/markdown/common/labels.ts` | `labelsByKey` + `labelsByUuid` Map indexes |
| `src/markdown/md-block-rule/mmd-html-block.ts` | `tagRegexCache` memoization, `.test()` → `.match()` for g-regex |
| `src/markdown/md-svg-to-base64/base64.ts` | `parts[]` + `join()` in utf8Encode |
| `src/markdown/md-latex-lists-env/re-level.ts` | Save/restore only `outMath` + `try/finally` + `beginCacheBypass`/`endCacheBypass` |

---

## Testing

- All 3,286 tests pass
- Per-parse cleanup verified: 100 sequential parses on same md instance — no memory growth
- Highlight rendering files reverted to master — zero risk of behavioral regression

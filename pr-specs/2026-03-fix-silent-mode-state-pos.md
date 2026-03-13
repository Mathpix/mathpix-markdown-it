# PR: Fix infinite loop in `inlineMmdIcon` and `inlineDiagbox` silent mode

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Issue [#18088](https://github.com/Mathpix/monorepo/issues/18088) reported that typing `\icon{unknown}` after a `[` character (e.g. `[\icon{unknown}]`) causes the page to freeze. The root cause is in markdown-it's inline rule pipeline: when `parseLinkLabel` encounters content inside `[…]`, it calls `skipToken`, which invokes each inline rule in **silent mode** (`silent = true`). If a rule returns `true` without advancing `state.pos`, `skipToken` caches `pos → pos` (a no-op) and loops forever.

Same bug class as the v2.0.34 `latexListEnvInline` fix.

This was originally patched in `zenpix/` and `ocr-api/` node_modules (monorepo commit `e9f9ca2`). This PR is the permanent upstream fix in the `mathpix-markdown-it` package.

---

## Root Cause

Two inline rules returned `true` in silent mode without advancing `state.pos`:

1. **`inlineMmdIcon`** (`src/markdown/md-inline-rule/mmd-icon.ts:16`):
   ```ts
   if (silent) return true; // state.pos not advanced → infinite loop
   ```

2. **`inlineDiagbox`** (`src/markdown/md-inline-rule/diagbox-inline.ts:48`):
   ```ts
   if (silent) return true; // state.pos not advanced → infinite loop
   ```

When markdown-it's `parseLinkLabel` → `skipToken` calls these rules in silent mode, the position never changes, causing an infinite loop.

---

## Fix

Refactored both rules to follow the same `if (!silent) { ... } state.pos = endPos; return true;` pattern used by all other inline rules in the codebase (e.g. `setCounterSection`, `inlineMathML`, `inlineTabular`).

### `mmd-icon.ts`

- Compute `endPos = pos + match.index + match[0].length` once after regex match
- Wrap all token-creation logic in `if (!silent) { ... }`
- Single `state.pos = endPos; return true;` at the end
- Eliminates 6 duplicated `state.pos = pos + match.index + match[0].length` assignments

### `diagbox-inline.ts`

- Extract brace contents (`extractNextBraceContent`) before the silent check so `endIndex` is available in both modes
- Wrap all token-creation and content-processing logic in `if (!silent) { ... }`
- Single `state.pos += endIndex; return true;` at the end
- In silent mode, `extractNextBraceContent` is lightweight (just brace matching), so no performance concern

---

## Codebase Audit

Audited all 34 `RuleInline` implementations across the codebase. No other rules exhibit this bug pattern — all correctly advance `state.pos` before returning `true`.

| Pattern | Count | Status |
|---|---|---|
| `if (!silent) { ... } state.pos = X; return true;` | 28 | Safe |
| `if (silent) return false;` | 6 | Safe (never returns true in silent) |
| `if (silent) return true;` without pos advance | 0 | Fixed (was 2) |

---

## Files Changed

- `src/markdown/md-inline-rule/mmd-icon.ts` — refactored to `if (!silent)` pattern
- `src/markdown/md-inline-rule/diagbox-inline.ts` — refactored to `if (!silent)` pattern
- `tests/_data/_icon/_data.js` — 4 new test cases

---

## Tests Added

| Input | Triggers |
|---|---|
| `[\icon{unknown}](http://example.com)` | `parseLinkLabel` on icon inside link |
| `[\diagbox{A}{B}](http://example.com)` | `parseLinkLabel` on diagbox inside link |
| `[\icon{unknown}] text` | `parseLinkLabel` on icon inside bare brackets |
| `[\diagbox{A}{B}] text` | `parseLinkLabel` on diagbox inside bare brackets |

All 4 cases caused infinite loops before the fix. All 27 icon tests and 114 tabular tests pass after the fix.

---

## Observability

- Type `[\icon{unknown}]` — page must not freeze
- Type `[\diagbox{A}{B}](http://example.com)` — page must not freeze
- Existing `\icon{star}`, `\icon{unknown}`, `\diagbox{A}{B}` in normal context — render unchanged

---

## Done When

- [x] `[\icon{unknown}]` does not freeze the page
- [x] `[\diagbox{A}{B}]` does not freeze the page
- [x] Both rules follow the `if (!silent)` pattern consistent with all other inline rules
- [x] All existing icon and tabular tests pass
- [x] Full codebase audit confirms no other rules have this bug

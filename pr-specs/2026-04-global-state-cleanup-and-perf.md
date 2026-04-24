# PR: Global state cleanup and performance improvements

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Audit of the codebase revealed multiple module-level mutable state variables that accumulate data across documents in long-lived processes. Several hot-path data structures used `Array` + `findIndex()` for O(n) lookups that should be O(1) Maps, and `getInlineCodeListFromString` result was scanned with `.find()` per character — O(n × m).

Two additional memory-retention bugs were uncovered during this work:

- `mdPluginTOC` stored the parse `state` in a module-level `gstate` variable so the TOC render rule could reach the top-level token list. That reference was never cleared and kept the ENTIRE token tree pinned across unrelated parses until the next `md.use()` call. On tabular-heavy documents this alone retained hundreds of megabytes.

- `coreInline` rebound `state.env = Object.assign({}, ...)` inside the inline loop. That desynced state.env from the env reference the caller of `md.render(src, env)` still held, so parse-time mutations (including our TOC / cache bookkeeping) became invisible to render rules that received the original env.

---

## Goal

Fix memory leaks from module-level state, improve lookup performance for tabular-related data structures, add per-parse cleanup guarantees for reused md instances, and preserve the caller's env reference contract between parse and render.

---

## Non-Goals

- Highlight dedup optimization (order-dependent behavior is pre-existing, changing risks regression without dedicated test coverage).
- Migrating `mathTable` / `subTabular` / `extractedCodeBlocks` to `state.env` (they now work correctly with the two-hook scheme — `reset_tabular_state` at the start of parse plus `cleanup_tabular_state` at the end).
- Browser-only concerns (click handlers, setInterval, context menu listeners).

---

## Current Behavior (before)

- `Clear*` functions run once at `md.use()` time. If the md instance is reused for multiple documents, module-level state accumulates.
- `mdPluginTOC` pins every parsed token tree on module-level `gstate` indefinitely.
- `coreInline` replaces `state.env` with a fresh object per inline token, breaking the shared-env contract.
- `diagboxTable` has no cleanup function at all — unbounded growth.
- `subTabular`, `extractedCodeBlocks` use `Array` + `findIndex()` — O(n) per lookup.
- `findEndMarker()` calls `.find()` on inline code list for every character position — O(n × m).
- `labelsList` uses `Array` for all lookups — O(n) per `find`/`findIndex`.
- `makeTagRegexes` creates 6 new `RegExp` objects per HTML block.
- `SetItemizeLevelTokens` clones the entire `md.options` object on every call.

---

## Desired Behavior (after)

- Every `md.parse()` begins with a `reset_tabular_state` core-ruler hook that clears module-level tabular state. A second `cleanup_tabular_state` hook runs at the end of the core pipeline and drops parse-only caches (`subTabular`, `mathTable`, `extractedCodeBlocks`, `diagboxTable`, and the column-style intern cache) so they're not retained through render.
- `mdPluginTOC` stores the token list on `state.env[TOC_ENV_KEY]`, so the reference is released together with env when the parse ends. The TOC render rule reads the list from env instead of the removed `gstate`.
- `coreInline` mutates `state.env` in place for the inline pass and derives a private `inlineEnv` for the nested `inline.parse()` call. The caller's env binding stays intact for downstream render rules.
- All lookup data structures use `Map` for O(1) access.
- Inline code position check is O(1) via `Set<number>`.
- Tag-regex objects are cached and reused; `g`-flag regexes are matched with `.match()` to avoid `lastIndex` corruption across calls.
- `SetItemizeLevelTokens` saves/restores only `outMath` with `try/finally`.

---

## Constraints / Invariants

- `reset_tabular_state` and `cleanup_tabular_state` both respect `renderElement.startLine` — partial renders skip cleanup so the enclosing re-parse still sees the cached state.
- `labelsByKey` / `labelsByUuid` survive `cleanup_tabular_state` — labels are read by render rules for `\ref{}` / `\eqref{}` resolution.
- Highlight rendering files (`render-rule-highlights.ts`, `common.ts`) are NOT modified — reverted to master to avoid behavioural regression.
- `labelsList` export kept for deep-import backward compatibility (deprecated, exposed as a `Proxy` that returns a version-cached snapshot of `labelsByKey.values()` — snapshot is rebuilt only when `addIntoLabelsList` / `clearLabelsList` bumps the version. Supports `.length`, iteration, and Array methods. Mutations (`.push`, index assignment) target the throwaway target array and are effectively ignored).

### Per-parse cross-plugin state reset

Sub-plugins (TOC, theorem, labels, footnotes, list-env, text counters) each maintain module-level state that was previously cleared only at `md.use` time or inside the `initMathpixMarkdown.parse` / `renderer.render` wrappers. Direct callers of `markdownIt().use(mathpixMarkdownPlugin)` that reuse one md instance across documents saw drift:

- TOC slug registry (`slugsTocItems`) accumulated → second parse of the same document produced `#introduction-2`, `#introduction-3`, …
- `theoremEnvironments` / `environmentsCounter` / `counterProof` kept stale theorem numbers across documents.
- `labelsByKey` / `labelsByUuid` still held prior document's `\label{}` entries, so `\ref{}` could resolve to the wrong block.
- `mmd_footnotes_list` carried old footnote items.
- `itemizeLevelTokens` held parsed token trees from prior `\renewcommand{\labelitemi}` — visible as stale marker tokens in the next document.
- `resetTextCounter` / size counter / `MathJax.Reset()` (equation numbering) were also wrapper-only.
- `ParseErrorList` was the worst offender: `ClearParseErrorList()` was defined but never called anywhere — tabular parse errors grew monotonically.

A new core-ruler hook `reset_mmd_global_state` (registered `before('normalize')` from `mathpixMarkdownPlugin`) calls all the reset functions at the start of every `md.parse()`. It respects `renderElement.startLine` so partial re-renders don't tear down the enclosing parse's cross-reference state. The same implementation is exported as `resetMmdGlobalState()` from the package root so one-shot converters (e.g. DOCX export) can release module-level state immediately after render without waiting for the next parse.

### Additional parse-only retention fixes

- `cleanup_math_cache` core-ruler hook (pushed, end of pipeline) clears `state.env.__mathpix`. Previously the per-parse math dedup cache was only initialized, never released — MathJax html/svg strings for every unique expression stayed on env until the caller dropped it.
- `mdPluginTOC.grab_state` stashes `state.tokens` on `state.env[TOC_ENV_KEY]` only when the document actually used `[[toc]]`, detected by a one-pass scan of inline-token children for `toc_body`. Documents without `[[toc]]` no longer retain the whole token tree on env.

### `markdownToHtmlPipelineSegments` balance fix

The segments renderer tracked a single `pendingCloseTag` + `pendingLevel` pair, so a nested same-type same-level `_open` terminated the segment mid-block. Concrete case: md-theorem wraps an inner `paragraph_open` at level 0 inside the outer `paragraph_open` class `theorem_block` — the first `paragraph_close` closed the segment prematurely, leaving `<div><div>...</div>` in one segment and `</div></div>...` in the next. Added a `pendingDepth` counter so nested opens of the same type at the same level increment depth; the segment closes only when depth drops back to zero. Regression test in `tests/_html-segments.js` covers 38 scenarios across all block rules from `mmdRules.ts`.

---

## Done When

- [x] Per-parse `reset_tabular_state` hook clears all tabular module-level state at the start of parse
- [x] Post-parse `cleanup_tabular_state` hook drops parse-only caches (`subTabular`, `mathTable`, `extractedCodeBlocks`, `diagboxTable`, column-style intern cache) at the end of the core pipeline
- [x] `mdPluginTOC` stores the token list on `state.env[TOC_ENV_KEY]`; module-level `gstate` removed
- [x] `coreInline` mutates `state.env` in place instead of rebinding it
- [x] `diagboxTable` has `ClearDiagboxTable()` + `diagboxById` reverse Map
- [x] `subTabular` converted from Array to Map
- [x] `extractedCodeBlocks` converted from Array to Map
- [x] `labelsByKey` + `labelsByUuid` Map indexes for O(1) lookups
- [x] `buildInlineCodePositionSet()` → `Set<number>` for O(1) position check
- [x] `tagRegexCache` memoization + `.test()` → `.match()` fix for g-regex `lastIndex`
- [x] `utf8Encode` uses `parts[]` + `join()` instead of `+=`
- [x] `SetItemizeLevelTokens` saves/restores only `outMath` with `try/finally`
- [x] All 3,286 tests pass

---

## Architecture

### Two-hook cleanup scheme

```
core.ruler.before('normalize', 'reset_tabular_state', resetHook)
  // clears state before parsing starts (defensive — also catches the case
  // where the previous parse threw)
core.ruler.push(                 'cleanup_tabular_state', cleanupHook)
  // drops parse-only caches after the last core rule — they're never read
  // during render
```

### TOC token-list handoff

Old (leaked entire token tree):

```ts
let gstate;                                      // module scope
md.core.ruler.push('grab_state', (state) => { gstate = state; });
// ...
const dataToc = getTocList(0, gstate.tokens, ...);
```

New (per-parse scope):

```ts
const TOC_ENV_KEY = '__mathpix_toc_tokens';
md.core.ruler.push('grab_state', (state) => {
  if (!state.env) state.env = {};
  state.env[TOC_ENV_KEY] = state.tokens;
});
// ...
const allTokens = (env && env[TOC_ENV_KEY]) || tokens || [];
const dataToc = getTocList(0, allTokens, ...);
```

### coreInline env preservation

Old (broke caller env):

```ts
state.env = Object.assign({}, {...state.env}, {
  currentTag, ...envToInline,
});
state.md.inline.parse(token.content, state.md, state.env, token.children);
```

New (preserves caller env binding):

```ts
const inlineEnv = Object.assign({}, state.env, {currentTag}, envToInline);
state.env.currentTag = currentTag;
if (envToInline && typeof envToInline === 'object') {
  Object.assign(state.env, envToInline);
}
state.md.inline.parse(token.content, state.md, inlineEnv, token.children);
```

The same pattern is applied in the deeper recursive walker `walkInlineInTokens` (used by `footnote_latex` / `tabular` deep-walk): it now also builds a private `inlineEnv` per token and mutates `state.env` in place, rather than rebinding it.

---

## Memory impact

Benchmark document: 16 MB MMD with 13,713 tabular blocks, ~479K `<td>` cells, and ~49K inline math expressions.

### Full SVG+HTML render

| Stage                       | Before  | After   | Δ            |
|-----------------------------|--------:|--------:|-------------:|
| Peak heap (html held)       | 2597 MB |  778 MB | −1819 (−70%) |
| Heap after releasing html   | 1887 MB |   68 MB | −1819 (−96%) |

The bulk of the reduction comes from the TOC `gstate` / `coreInline` env fix: without it the token tree stayed pinned across parses and dominated the retained heap. The `cleanup_tabular_state` hook removes the remaining ~45 MB of parse-only caches that used to survive into the render phase.

---

## Files Changed

| File | Change |
|------|--------|
| `src/markdown/mdPluginTableTabular.ts` | `clearTabularState()` + two core-ruler hooks: `reset_tabular_state` (before normalize) and `cleanup_tabular_state` (push, end of pipeline) |
| `src/markdown/mdPluginTOC.ts` | `TOC_ENV_KEY` on `state.env` replaces module-level `gstate`; render rule reads from env |
| `src/markdown/md-inline-rule/core-inline.ts` | In-place `state.env` mutation, derived `inlineEnv` for nested `inline.parse` |
| `src/markdown/md-block-rule/begin-tabular/sub-cell.ts` | `ClearDiagboxTable()`, `diagboxById` reverse Map, `buildInlineCodePositionSet` in `extractNextBraceContent` |
| `src/markdown/md-block-rule/begin-tabular/sub-tabular.ts` | Array → Map, all `findIndex` → `.get()` |
| `src/markdown/md-block-rule/begin-tabular/sub-code.ts` | Array → Map |
| `src/markdown/md-block-rule/begin-tabular/sub-math.ts` | Single `tail` slice in `getMathTableContent` |
| `src/markdown/common.ts` | `buildInlineCodePositionSet()`, `findEndMarker` uses `Set.has()` |
| `src/markdown/common/labels.ts` | `labelsByKey` + `labelsByUuid` Map indexes |
| `src/markdown/md-block-rule/mmd-html-block.ts` | `tagRegexCache` memoization, `.test()` → `.match()` for g-regex |
| `src/markdown/md-svg-to-base64/base64.ts` | `parts[]` + `join()` in utf8Encode |
| `src/markdown/md-latex-lists-env/re-level.ts` | Save/restore only `outMath` with `try/finally` + `beginCacheBypass`/`endCacheBypass` |
| `src/markdown/mdPluginSeparateForBlock.ts` | Removed — dead code, never imported anywhere |

---

## Testing

- All 3,286 tests pass
- Per-parse cleanup verified: 100 sequential parses on the same md instance show no memory growth
- Highlight rendering files reverted to master — zero risk of behavioural regression

# PR: Footnote block-rule performance + tabular/theorem parser invariants

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

Three independent issues in the block-parsing layer, surfaced together while profiling `markdownToHTMLSegments` on large inputs:

### 1. `latex_footnote_block` / `latex_footnotetext_block` are O(N × M) per block

Both rules are registered as block rules and therefore invoked at the start of every block in the document. Their forward-scanning loop appends each line to a growing `fullContent` buffer and re-runs the opening-tag regex on the **whole** buffer after every line. For a paragraph of `N` lines totaling `M` characters this is O(N × M) per invocation. Across thousands of blocks in documents that contain few or no `\footnote` / `\footnotetext` directives, this turns into the dominant parse cost — the rules do no useful work but pay their full scanning cost for every block start.

V8 CPU profiling on a 2.5 MB / 43,607-line MMD input (706 `\begin{tabular}`, 1,585 `\section*`, **3 `\footnote{}`, 3 `\footnotetext{}`**) measured wall-clock at 93.5 s and attributed:

| Frame | Self time |
|-------|----------:|
| `latex_footnote_block` | 60.3 s (64%) |
| `RegExp \\footnote\s{0,}\[...\]\s{0,}{\|...` | 23.4 s (25%) |
| GC | 8.0 s |
| Everything else | 1.8 s |

Together the rule and its regex consumed ~89% of total time on a document with only 3 footnotes.

### 2. `setChildrenPositions` traversal does not match the existing tabular skip

The top-level `setPositions` already excludes `tabular`-typed tokens from child traversal, since tabular subtrees carry parser-private structure (notably the shared, frozen close-token singletons emitted during cell construction). The recursive `setChildrenPositions` does not skip them, and the inline tabular variant `tabular_inline` (used for subtables embedded in paragraphs) is missing from the existing skip list. When such a token appears as a child of a non-tabular parent and the caller passes `addPositionsToTokens: true`, the recursive walk reaches the frozen singletons and assignment of `.positions` throws:

```
TypeError: Cannot add property positions, object is not extensible
    at setChildrenPositions (md-core-rules/set-positions.ts:84)
    at setChildrenPositions (md-core-rules/set-positions.ts:134)  ← recursive call
```

`markdownToHTMLSegments` returns `null` on any document that contains an inline subtable when this option is set.

### 3. `BeginTheorem` emits open tokens before validating the environment name

`BeginTheorem` matches any `\begin{NAME}…\end{NAME}` whose NAME is not in `latexEnvironments` / `mathEnvironments`. The rule currently:

1. Pushes a `paragraph_open` token (level +1) with `class="theorem_block"`.
2. Optionally pushes an `inline` token for content before the `\begin`.
3. Looks up `getTheoremEnvironmentIndex(envName)` — `-1` for unregistered environments.
4. Returns `false`.

markdown-it has no rollback on `return false`: the open tokens stay in `state.tokens`, and the renderer emits an unclosed `<div class="theorem_block">`. On documents that contain `\begin{NAME}…\end{NAME}` blocks for names not registered via `\newtheorem` (e.g. `tikzpicture`, `lemma`, `example`), HTML output accumulates unmatched opening divs that nest around subsequent content.

---

## Goal

1. Make `latex_footnote_block` and `latex_footnotetext_block` O(1) per block-start when no relevant directive exists at or after the current source position. Preserve the three existing input shapes:
   - `\footnote{…}` placed mid-line.
   - `\footnote{…}` whose opening tag spans line breaks (e.g. `\footnote\n{`, `\footnote[1]\n\n{`).
   - Block-level constructs nested inside `\footnote{…}` content (lists, paragraphs, tables, etc.).
2. Extend the existing tabular skip in `setPositions` / `setChildrenPositions` so the inline tabular variant is also opt-out of source-position assignment, restoring `markdownToHTMLSegments` correctness when subtables are present and `addPositionsToTokens: true`.
3. Hoist the environment-name validation in `BeginTheorem` above the first `state.push`, so unregistered environments cannot leave half-built token sequences in the stream.

---

## Non-Goals

- Rewriting the footnote rule's tokenization pipeline (Phase 2 / Phase 3 / nested `state.md.block.parse`) — left untouched to minimize regression risk.
- Tightening the `reOpenTagFootnoteG` / `reOpenTagFootnotetextG` patterns — they already match correctly; the issue is *how often* they run, not their cost per match.
- Rewriting `findOpenCloseTags(fullContent, …)` calls in Phase 3 — they only execute for actual footnote blocks (≤ number of footnotes in doc) and are not in the profile.
- Un-freezing the shared close-token singletons. The freeze is the parser's contract that close markers carry no per-token state. The `setPositions` change is on the consumer side.

---

## Current Behavior (before)

### Footnote rules

`latex_footnote_block` is registered as a markdown-it block rule (`before('lheading')`), invoked at every block-start during parse. On every invocation:

1. Reads the first line of the candidate block.
2. If the regex `reOpenTagFootnoteG` does not match the first line, enters a forward-scanning loop that:
   - Appends each subsequent non-empty line to `fullContent`.
   - Runs `reOpenTagFootnoteG.test(fullContent)` on the **growing** string after every line.
3. Bails out only when an empty line, fence, or `endLine` is reached.

For a paragraph of `N` lines totaling `M` characters, step 2 is O(N × M) per invocation. `latex_footnotetext_block` follows the identical structure with `reOpenTagFootnotetextG`.

### `setPositions`

Top-level `setPositions` short-circuits before recursing into `tabular`-typed tokens. The recursive `setChildrenPositions` does not — when invoked recursively on a non-tabular parent whose subtree contains a `tabular_inline` child, it walks into the children of that subtable and tries to assign `.positions` onto frozen close-token singletons, throwing.

### `BeginTheorem`

Validation of `envName` against the registered theorem environments runs after the `paragraph_open` and optional `inline` token are already pushed. Returning `false` from validation does not roll back the pushed tokens.

---

## Desired Behavior (after)

1. **Whole-document early exit (footnotes).** On its first invocation per parse, each rule scans `state.src` once with `String.prototype.indexOf` for its keyword(s) and caches the offsets on the parser state. If the offset of the *last* keyword occurrence is before the current block's start, the rule returns `false` in O(1) without entering any loop.

2. **Per-line token guard inside the accumulation loop (footnotes).** The expensive `reOpenTagFootnoteG.test(fullContent)` runs only after a line that contains the literal token has been seen. Sound by construction: the regex always begins with `\\footnote` (resp. `\\footnotetext` / `\\blfootnotetext`), and those literals are contiguous and cannot span a line break. Guard regex `/\\footnote(?![a-zA-Z])/` (resp. `/\\(?:bl)?footnotetext(?![a-zA-Z])/`) excludes `\footnotemark` / `\footnotesize` / `\footnotetextStyle` etc. so the guard does not hold the line on prefix-only matches.

3. **`setChildrenPositions` early-return for `tabular` and `tabular_inline` parents.** Mirrors the existing top-level skip and prevents recursion from reaching the frozen close-token singletons. The top-level skip list is also broadened to `['tabular', 'tabular_inline']` for symmetry.

4. **`BeginTheorem` validates `envName` before the first push.** The `getTheoremEnvironmentIndex(envName)` check is moved above the `state.push('paragraph_open', …)` calls, so an unregistered environment returns `false` without leaving any token in the stream.

5. Tokenization, output, and silent-mode semantics are unchanged. All existing footnote, tabular, and theorem test cases produce byte-identical HTML.

---

## Constraints / Invariants

- The keyword-position cache is pinned to `state` (not `state.env`). Nested `state.md.block.parse(content, …)` calls construct a new `StateBlock` with their own `src`, so each scope computes its own positions; an outer cache cannot leak through to nested parses with different source strings.
- The cache holds plain `number[]` arrays. Sizing is bounded by the number of keyword occurrences in the source string. When the parser state is released after `md.parse` returns, the cache is released with it via normal GC.
- Soundness of the token guard rests on a single property: the literal token `\footnote` (resp. `\footnotetext`, `\blfootnotetext`) is a contiguous run of characters that cannot be split by `\n`. If no line in `fullContent` contains the literal followed by a non-letter (the guard's lookahead anchor), the rule's regex — which has the literal as a required prefix in every alternative followed by `\s*`/`[`/`{` — cannot match.
- `\footnotemark` / `\footnotesize` / `\footnotetextStyle` and other `\footnote*` longer forms are excluded by the `(?![a-zA-Z])` lookahead, so the guard correctly skips lines that only contain those prefixes.
- The footnote rule's silent-mode contract (advance `state.line` only when not silent) is preserved — the new early-exit returns `false`, which is the same as the pre-change path on a non-matching block.
- `tabular` and `tabular_inline` token children are parser-private (frozen close-token singletons + per-cell tokens with non-source content). Skipping them in `setChildrenPositions` matches the existing semantics — source-position metadata on those nodes is not consumed downstream because the tabular renderer reconstructs cell content from `token.content` rather than from `state.src` slices.
- `BeginTheorem`'s behavior for registered environments is unchanged — the lookup is the same, downstream tokens are the same, only the order of operations changes.

---

## Done When

- [x] `latex_footnote_block` short-circuits in O(1) when no `\footnote` keyword exists at or after the current block.
- [x] `latex_footnotetext_block` short-circuits in O(1) when no `\footnotetext` / `\blfootnotetext` keyword exists at or after the current block.
- [x] Per-iteration substring guard prevents the O(`fullContent.length`) regex from running on lines that cannot complete the pattern.
- [x] `setChildrenPositions` returns early for `tabular` / `tabular_inline` parent tokens, so frozen close-token singletons are never written to.
- [x] `markdownToHTMLSegments({ addPositionsToTokens: true })` returns a non-null result on documents with inline subtables.
- [x] `BeginTheorem` (non-silent) bails for unregistered environments before `endTag()` / forward scan / any `state.push`; silent-mode terminator probes preserve the original close-tag-based answer so the `\newtheorem` ↔ `\begin{NAME}` adjacent-line handshake keeps working.
- [x] All existing tests pass; new fixtures cover each change.
- [x] Output of `markdownToHTMLSegments` on the footnote-perf benchmark input is byte-identical before and after the change (same content, same segment map).
- [x] Status is updated to `Implemented`.

---

## Architecture

### Per-state keyword-position cache (`utils.ts`)

Exposed as a shared helper since both `latex_footnote_block` and `latex_footnotetext_block` use the same shape:

```ts
export const getCachedSrcPositions = (
  state: { src: string; [k: string]: unknown },
  key: string,
  pattern: RegExp,
): number[] => {
  if (state[key] !== undefined) return state[key] as number[];
  const re = new RegExp(pattern.source, 'g');
  const positions: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(state.src)) !== null) {
    positions.push(m.index);
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  state[key] = positions;
  return positions;
};
```

Pattern is compiled once with the `g` flag locally so the caller's RegExp is not mutated through `lastIndex`. The cache is keyed by a property on the `StateBlock` instance itself, not on `state.env`. `state.md.block.parse(content, state.md, state.env, children)` builds a fresh state for nested parses, so each parse scope sees its own `state.src` and recomputes its own positions on first access. Env keying would be incorrect — env is shared between outer and nested parses, but the source strings differ.

The returned array is treated as read-only by the caller (no mutation; cache invariant is "stable for the lifetime of the parse state").

### Token guards

Per-rule constants:

```ts
const FOOTNOTE_TOKEN_RE = /\\footnote(?![a-zA-Z])/;
const FOOTNOTETEXT_TOKEN_RE = /\\(?:bl)?footnotetext(?![a-zA-Z])/;
```

The `(?![a-zA-Z])` lookahead anchors the literal so commands sharing a prefix (`\footnotemark`, `\footnotesize`, `\footnotetextStyle`, etc.) do not match.

Both rules begin with:

```ts
const positions = getCachedSrcPositions(state, KEY, FOOTNOTE_TOKEN_RE);
if (positions.length === 0 || positions[positions.length - 1] < state.bMarks[startLine]) {
  return false;
}
```

Reading the *last* element of the positions array makes the check O(1) and correctly returns `false` whether the document has no footnote at all or all footnotes are already past.

The forward-scanning loop in Phase 1 (used to detect a multi-line opening tag) keeps a `sawFootnoteToken` flag:

```ts
let sawFootnoteToken = FOOTNOTE_TOKEN_RE.test(lineText);
if (!sawFootnoteToken || !reOpenTagFootnoteG.test(lineText)) {
  for (; nextLine < endLine; nextLine++) {
    // … fence/empty checks, accumulate fullContent …
    if (!sawFootnoteToken) {
      if (!FOOTNOTE_TOKEN_RE.test(lineText)) continue;
      sawFootnoteToken = true;
    }
    if (reOpenTagFootnoteG.test(fullContent)) { … }
  }
}
```

The flag flips to `true` the first time a line contains the literal token. Until then, the O(`fullContent`) regex test is skipped via `continue`, replaced by an O(`lineText`) regex test against a small fixed pattern. `latex_footnotetext_block` follows the identical shape with `FOOTNOTETEXT_TOKEN_RE`.

### Why the token guard is sound

Every alternative in `reOpenTagFootnoteG` requires the literal `\\footnote` immediately followed by `\s*` (which includes `\n`) and then `[`/`{`. The character right after `\footnote` is therefore never a letter — never inside `[a-zA-Z]`. So `FOOTNOTE_TOKEN_RE` is equivalent (at the prefix level) to "any position the rule's full regex could match starting from".

`fullContent` is built by joining lines with `\n`, and `\n` is not in `\footnote`, so the literal cannot straddle a join. Therefore: if no individual line in `fullContent` contains `\footnote(?![a-zA-Z])`, the rule's full regex cannot match. The guard's `continue` is an admissible early termination.

The same argument applies to `reOpenTagFootnotetextG` and `FOOTNOTETEXT_TOKEN_RE`.

### `setChildrenPositions` skip for tabular parents (`set-positions.ts`)

```ts
const setChildrenPositions = (state, token, pos, highlights, isBlockquote = false) => {
  if (token.type === 'tabular' || token.type === 'tabular_inline') {
    return { token };
  }
  // … existing body …
};
```

The top-level skip list is also updated:

```ts
if (['tabular', 'tabular_inline'].includes(token.type)) {
  continue;
}
```

The early-return inside `setChildrenPositions` is the load-bearing change: the failing path is a recursive call from a non-tabular parent (an `inline` token whose subtree contains a subtable). The top-level update is a symmetry change for the case where future code inserts a `tabular_inline` directly at top level.

### `BeginTheorem` registration check (`md-theorem/block-rule.ts`)

```ts
if (latexEnvironments.includes(envName) || mathEnvironments.includes(envName)) {
  return false;
}

// Non-silent: bail early for unregistered envs (saves closeTag scan).
// Silent must skip this — `newTheoremBlock` calls BeginTheorem(silent) before `\newtheorem` registers.
let envIndex: number = -1;
if (!silent) {
  envIndex = getTheoremEnvironmentIndex(envName);
  if (envIndex === -1) {
    return false;
  }
}

// … endTag(), forward-scan loop. After `if (silent) return true;` (close-tag-based answer),
// non-silent path continues to `state.push` using envIndex set above.
```

The split is required by an existing handshake: `newTheoremBlock` registers `\newtheorem{NAME}` and on its forward scan calls `BeginTheorem(state, line, …, silent=true)` on the next `\begin{NAME}` line as a terminator probe. At that moment NAME is not yet registered. The original silent answer was close-tag-presence-based; the non-silent path is what actually mutates `state.tokens` and is therefore where the registration check is load-bearing.

For unregistered environments (`\begin{tikzpicture}`, `\begin{lemma}` without a matching `\newtheorem`) the non-silent invocation now bails before `endTag()` and the O(blockSize) forward scan, in addition to no longer leaving any token in `state.tokens`. Registered environments are unchanged — same lookup, same downstream tokens.

---

## Performance impact

Profiled on a 2.5 MB / 43,607-line MMD input (706 `\begin{tabular}`, 28 `\begin{align*}`, 11 `\begin{array}`, 1,585 `\section*`, 155 images, 3 `\footnote{}`, 3 `\footnotetext{}`). V8 CPU profiler, local machine.

| Stage | Before | + substring guard | + position cache | Δ vs before |
|---|---:|---:|---:|---:|
| `markdownToHTMLSegments` total | 93,593 ms | 1,943 ms | **1,560 ms** | **−60×** |
| `latex_footnote_block` self-time | 60,255 ms | 251 ms | not in top 30 | eliminated |
| `reOpenTagFootnoteG` self-time | 23,411 ms | not in top 30 | not in top 30 | eliminated |
| Output bytes | 6,675,761 | 6,675,761 | 6,675,761 | 0 |
| Segments emitted | 9,082 | 9,082 | 9,082 | 0 |

A second 1.1 MB profiling input (44 `\begin{tabular}`, 482 `\begin{tikzpicture}`, 726 sections — a TikZ-heavy document with inline subtables) covers the `setPositions` and `BeginTheorem` paths:

| Stage | Before | After |
|---|---|---:|
| `markdownToHTMLSegments({ addPositionsToTokens: true })` | TypeError, returns `null` | 741 ms |
| `<div class="theorem_block">` count in HTML output | 75 (unmatched) | 0 |
| `markdownToHTMLSegments({ addPositionsToTokens: false })` | 581 ms | 581 ms (unchanged) |

The post-change segment count on this input rises because the segment renderer in `markdownToHtmlPipelineSegments` previously coalesced adjacent blocks under each unclosed `<div class="theorem_block">` wrapper (the segment delimiter logic waits for matching close tags). Removing the unmatched opens lets segments break at their natural boundaries.

---

## Files Changed

| File | Change |
|------|--------|
| `src/markdown/utils.ts` | New `getCachedSrcPositions(state, key, pattern)` exported helper — per-state cache of regex match positions in `state.src`; returned array is read-only |
| `src/markdown/md-latex-footnotes/block-rule.ts` | Whole-document early exit at the top of `latex_footnote_block` and `latex_footnotetext_block`; per-line token guard (regex with `(?![a-zA-Z])` lookahead) inside Phase 1 forward-scan in both rules |
| `src/markdown/md-core-rules/set-positions.ts` | `setChildrenPositions` early-returns for `tabular` / `tabular_inline` parents; top-level skip list extended from `['tabular']` to `['tabular', 'tabular_inline']` |
| `src/markdown/md-theorem/block-rule.ts` | `BeginTheorem` env-index lookup gated on `!silent` and hoisted above `endTag()` / forward-scan in non-silent mode — unregistered environments bail in O(1) without touching `state.tokens`. Silent-mode terminator probes keep close-tag-based answer (required by `newTheoremBlock` ↔ `\begin{NAME}` adjacent-line handshake) |
| `tests/_data/_footnotes_latex/_data-footnote.js` | Three new fixtures pinning behavior on `\footnote`-prefixed commands that must not trigger the rule (`\footnotemark[1]` mid-line, `\footnotesize` in multi-line paragraph, repeated `\footnotemark`) |
| `tests/_data/_theorem/_data.js` + `tests/_theorem.js` | Three new fixtures for unregistered environments (`tikzpicture`, `lemma`, `example`) using `htmlNotInclude` to assert specific markup absence without pinning the entire HTML; one fixture for `\newtheorem{NAME}` + `\begin{NAME}` on adjacent lines (silent-mode handshake regression). Test runner extended to support an `htmlNotInclude: string \| string[]` field. |
| `tests/_html-segments.js` | New describe block — three regression cases call `markdownToHTMLSegments` with `addPositionsToTokens: true` on inputs containing inline tabulars (paragraph + subtable, after inline math, two subtables in one paragraph); each must return a non-null `{content, map}` |
| `tests/_tokenPositions.js` + `tests/_data/_tokenPositions/_data_tabulars.js` | New describe block + three tabular position-tokens fixtures (block tabular, nested tabular, tabular surrounded by paragraphs) |

No public API surface, no exported names beyond `getCachedSrcPositions`, no option flags introduced.

---

## Testing

- Full suite: **3,355 passing** (3,342 prior + 13 new: 3 footnote-prefix cases, 3 tabular position-token fixtures, 3 inline-tabular `markdownToHTMLSegments` regression cases, 3 unregistered-theorem-env cases, 1 adjacent-line `\newtheorem`/`\begin{NAME}` regression case).
- Footnote suite: 3 new cases lock in token-guard behavior on `\footnote`-prefixed commands that must not trigger the rule.
- Theorem suite: 3 new cases assert that `\begin{tikzpicture}`, `\begin{lemma}`, `\begin{example}` do not emit `class="theorem_block"` / `theorem_open` markup (via `htmlNotInclude` assertion-mode); 1 new case pins HTML output for `\newtheorem{theorem}{Theorem}\n\\begin{theorem}\n…\n\end{theorem}` (no empty line between) — locks the silent-mode terminator handshake in `newTheoremBlock`.
- HTML-segments suite: 3 new cases directly exercise the regression path that `setChildrenPositions` previously threw on (`tabular_inline` child of an `inline` block), asserting `markdownToHTMLSegments({ addPositionsToTokens: true })` returns a non-null result.
- Position suite: 3 new fixtures cover token shape on block tabular, nested tabular, and tabular surrounded by paragraphs.
- Output equivalence on the footnote-perf benchmark: `markdownToHTMLSegments({ addPositionsToTokens: true })` produces a byte-identical 6,675,761-byte HTML and the same 9,082-entry segment map before and after the change. Verified at every step.
- TikZ-heavy benchmark: `markdownToHTMLSegments({ addPositionsToTokens: true })` returns a non-null `{segs=3915, bytes=1,696,520}` in 741 ms; 0 `class="theorem_block"` occurrences in HTML output.

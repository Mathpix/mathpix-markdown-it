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

1. Make `latex_footnote_block` and `latex_footnotetext_block` O(|src|) on first invocation per parse and O(1) per subsequent block-start when no relevant directive exists at or after the current source position. Preserve the three existing input shapes:
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
- Unifying the Phase 1 terminator asymmetry — `latex_footnote_block` only checks `fence`, while `latex_footnotetext_block` runs the full terminator-rules list. Pre-existing behaviour, separate refactor.
- Direct unit tests for `getCachedSrcPositions` — helper is module-private; exporting for testability is an antipattern. Cache behavior is exercised through integration fixtures (notably `\blfootnotetext`-only doc, which specifically triggers the pre-gate path). Direct unit-test coverage is a separate refactor.

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

1. **Whole-document early exit (footnotes).** On its first invocation per parse, each rule sweeps `state.src` once with `RegExp.exec` (lastIndex reset before scan) and caches the offset of the LAST occurrence on the parser state. Subsequent calls return that cached offset in O(1); when it is before the current block's start, the rule returns `false` without entering any loop.

2. **Per-line token guard inside the accumulation loop (footnotes).** The expensive `reOpenTagFootnoteG.test(fullContent)` runs only after a line that contains the literal token has been seen. Sound by construction: the regex always begins with `\\footnote` (resp. `\\footnotetext` / `\\blfootnotetext`), and those literals are contiguous and cannot span a line break. Guard regex `/\\footnote(?![a-zA-Z])/` (resp. `/\\(?:bl)?footnotetext(?![a-zA-Z])/`) excludes `\footnotemark` / `\footnotesize` etc. so the guard does not hold the line on prefix-only matches.

3. **`setChildrenPositions` early-return for `tabular` and `tabular_inline` parents.** Mirrors the existing top-level skip and prevents recursion from reaching the frozen close-token singletons. The top-level skip list is also broadened to `['tabular', 'tabular_inline']` for symmetry.

4. **`BeginTheorem` validates `envName` before the first push.** The `getTheoremEnvironmentIndex(envName)` check is moved above the `state.push('paragraph_open', …)` calls, so an unregistered environment returns `false` without leaving any token in the stream.

5. Tokenization, output, and silent-mode semantics are unchanged. All existing footnote, tabular, and theorem test cases produce byte-identical HTML.

---

## Constraints / Invariants

- The keyword-position cache is pinned to `state` (not `state.env`). Nested `state.md.block.parse(content, …)` calls construct a new `StateBlock` with their own `src`, so each scope computes its own positions; an outer cache cannot leak through to nested parses with different source strings.
- The cache holds a single `lastPos: number` per rule (-1 if no match). Constant size, released with the parser state via normal GC.
- Soundness of the token guard rests on a single property: the literal token `\footnote` (resp. `\footnotetext`, `\blfootnotetext`) is a contiguous run of characters that cannot be split by `\n`. If no line in `fullContent` contains the literal followed by a non-letter (the guard's lookahead anchor), the rule's regex — which has the literal as a required prefix in every alternative followed by `\s*`/`[`/`{` — cannot match.
- `\footnotemark` / `\footnotesize` and other `\footnote*` longer forms are excluded by the `(?![a-zA-Z])` lookahead, so the guard correctly skips lines that only contain those prefixes.
- The footnote rule's silent-mode contract (advance `state.line` only when not silent) is preserved — the new early-exit returns `false`, which is the same as the pre-change path on a non-matching block.
- `tabular` and `tabular_inline` token children are parser-private (frozen close-token singletons + per-cell tokens with non-source content). Skipping them in `setChildrenPositions` matches the existing semantics — source-position metadata on those nodes is not consumed downstream because the tabular renderer reconstructs cell content from `token.content` rather than from `state.src` slices.
- `BeginTheorem`'s behavior for registered environments is unchanged — the lookup is the same, downstream tokens are the same, only the order of operations changes.

---

## Known limitations

### Pre-existing, not introduced here

**Unregistered theorem env body drop.** For `\begin{NAME}…\end{NAME}` without a matching `\newtheorem{NAME}`, the body text inside the environment is consumed by an unrelated math-block fallback rule and dropped from the rendered HTML — the rule emits an empty `<span class="math-block equation-number">` placeholder rather than the body text. This was already the behavior on master prior to this PR; this PR only stops emitting the unmatched leading `<div class="theorem_block">` wrapper, which made the output look like a real theorem despite the dropped body. A real fix is out of scope (would require either auto-registering common environments or falling back to plain-paragraph rendering for unrecognised `\begin{NAME}…\end{NAME}` blocks).

### Introduced by this PR

**Footnote position cache does not exclude code-fenced regions.** `getCachedSrcPositions` sweeps `state.src` once with the token-guard regex; matches inside fenced code blocks, indented code blocks, or inline code count toward the cache and the rule still runs Phase 1 for blocks at or before them. The block-rule itself bails on the `findOpenCloseTags` step for code-protected matches, so output is unchanged — the cost is "rule didn't early-exit when it could have" for documents where the only `\footnote*` literals live inside code. Acceptable because (1) documents using `\footnote{}` literally inside code are rare, (2) the worst-case is one full Phase 1 walk per parse instead of zero, not a return to O(N×M) per block.

**Symbol-keyed cache mutations on `StateBlock` are invisible to `JSON.stringify` / `Object.keys` / `for…in`.** Intentional — Symbols don't appear in those enumerations, so the cache cannot leak into serialised state or `getOwnPropertyNames`-based introspection. Anyone debugging the StateBlock instance must use `Object.getOwnPropertySymbols(state)` to see the cache slot. Standard for module-private state on objects you don't own; called out so future contributors don't go looking for `state.__mmd_*` strings.

**Empty `<span class="mmd-highlight">` wrappers around markup-only inner tokens in span-fallback links.** When a highlight overlaps `[**bold**](url)` the fallback positions strong_open/strong_close (markup tokens with empty rendered content) and the highlight renderer emits `<span class="mmd-highlight" style="…"></span>` wrappers. Rendered output is visually correct (empty span shows nothing) but consumers depending on `.mmd-highlight` having content may need to filter empty matches. Pinned in `tests/_data/_highlights/_data.js`.

---

## Done When

- [x] `latex_footnote_block` short-circuits in O(1) per block-start (after one O(|src|) sweep per parse) when no `\footnote` keyword exists at or after the current block.
- [x] `latex_footnotetext_block` short-circuits in O(1) per block-start (after one O(|src|) sweep per parse) when no `\footnotetext` / `\blfootnotetext` keyword exists at or after the current block.
- [x] Per-iteration substring guard prevents the O(`fullContent.length`) regex from running on lines that cannot complete the pattern.
- [x] `setChildrenPositions` mirrors top-level skip for `tabular`/`tabular_inline` — positions the token by `content.length` but doesn't recurse into cell children. Per-child `Object.isExtensible` guard remains as a safety net for any other frozen tokens.
- [x] `markdownToHTMLSegments({ addPositionsToTokens: true })` returns a non-null result on documents with inline subtables.
- [x] `BeginTheorem` (non-silent) bails for unregistered environments before `endTag()` / forward scan / any `state.push`; silent-mode terminator probes preserve the original close-tag-based answer so the `\newtheorem` ↔ `\begin{NAME}` adjacent-line handshake keeps working.
- [x] All existing tests pass; new fixtures cover each change.
- [x] Output of `markdownToHTMLSegments` on the footnote-perf benchmark input is byte-identical before and after the change (same content, same segment map).
- [x] Status is updated to `Implemented`.

---

## Architecture

### Footnote rules: per-state position cache + per-line token guard

Module-private helper `getCachedSrcPositions(state, key, patternG)` in `md-latex-footnotes/block-rule.ts`. Cache key is a per-module `Symbol` on the `StateBlock` instance — Symbol uniqueness rules out collisions with `StateBlock` fields or other plugins' state property writes. Cache entry is `{ src, lastPos }` (single integer, -1 if no match); hit is gated on `cached.src === state.src` so a `StateBlock` reused with a swapped src recomputes instead of returning stale offsets. The `/g` pattern is helper-owned (named `*_SWEEP_G`) and `lastIndex` is reset before and after each scan so the shared regex is safe across calls.

Both rules early-exit when `lastPos < state.bMarks[startLine]` — O(1) per block-start once the cache is warm. The cache is **state**-keyed not `state.env`-keyed because `state.md.block.parse(content, …)` builds a fresh `StateBlock` per nested parse — env-keying would alias outer/nested src strings.

Inside Phase 1 (multi-line opening tag detection) the heavy `reOpenTagFootnoteG.test(fullContent)` is gated by two cheap per-line checks: (1) the literal token `\footnote` (or `\footnotetext` / `\blfootnotetext`) appears on this line, anchored by `(?![a-zA-Z])` to exclude `\footnotemark` / `\footnotesize`; (2) the line contains `{`. Either gate's `continue` shortcuts the regex. The token-guard regexes live in `common/consts.ts` so the soundness test pins the same patterns the rule consumes — single source of truth.

**Soundness.** Every alternative of the open-tag regex starts with the literal `\footnote*` followed by `\s*` (which permits `\n`) then `[`/`{`. The character right after the literal is never a letter, so the guard's `(?![a-zA-Z])` lookahead admits exactly the same prefix positions as the full regex. `fullContent` is built by joining lines with `\n` and `\n` is not in `\footnote*`, so the literal cannot straddle a join — if no line contains it, the full regex cannot match.

### `setChildrenPositions`: per-child Object.isExtensible guard + link_open span fallback

**Tabular skip + frozen-token guard.** A top-of-loop skip in `setChildrenPositions` mirrors the existing top-level skip for `tabular`/`tabular_inline`: the token gets `.positions` and `content_test_str` from `content.length`, `pos` advances so siblings stay correctly placed, and recursion into cells is skipped. Cell children (td_open, inline math, includegraphics) don't get `.positions` — same as master pre-PR; cell content is reconstructed from `token.content`, so `state.src` slicing on cell descendants is meaningless. A per-child `Object.isExtensible` check remains downstream as a safety net for any other frozen tokens that could appear in unrelated subtrees.

**link_open: strict triple + span fallback.** The legacy branch unconditionally treated `(link_open, i+1, i+2)` as `(link_open, text, link_close)` and produced `NaN` / off-by-N positions for fancy contents (`[**bold**](url)`, `` [`code`](url) ``, `[![alt](img)](url)`). Replaced with two branches:

- **Strict triple** for `[text](url)`: explicit type checks (`i+1.type === 'text' && i+2.type === 'link_close' && typeof i+2.nextPos === 'number'`) preserve the legacy math + `highlightAll` cascade exactly. Snapshots in `tests/_data/_tokenPositions/_data.js` pin the byte-identical positions.
- **Span fallback** for any other link_open layout: scans forward for the matching `link_close` (depth-tracking), sets `link_open.positions` to the full `[…](…)` span via `start_content + link_close.nextPos`, advances `pos = startPos + 1` if `state.src[startPos] === '['` (else `pos = startPos` — defensive for non-bracket emitters), and lets the per-child loop position each inner child by its own `nextPos`/`inlinePos`/`content`/`markup`. When the loop reaches `link_close`, its `nextPos` jumps `pos` to the link end — no `i +=` skip needed.

The `highlightAll` cascade is intentionally omitted from the span branch — implementing it would require a post-hoc pass over the inner range, and the legacy code didn't compute it correctly for fancy links either (NaN positions short-circuited highlight resolution).

### `BeginTheorem`: validate envName before push

`getTheoremEnvironmentIndex(envName)` is now hoisted above `endTag()` / forward-scan / `state.push`, but only in non-silent mode. Silent-mode invocations keep the original close-tag-based answer — required by `newTheoremBlock`'s terminator pass, which calls `BeginTheorem(silent=true)` on the `\begin{NAME}` line that immediately follows `\newtheorem{NAME}{…}` *before* NAME is registered. Non-silent is the path that mutates `state.tokens`, so the registration check is load-bearing there. Unregistered environments now bail in O(1) without touching `state.tokens` and the renderer no longer emits unmatched `<div class="theorem_block">` wrappers.

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
| `src/markdown/common/consts.ts` | Add `reFootnoteToken` / `reFootnotetextToken` token-guard exports. |
| `src/markdown/md-latex-footnotes/block-rule.ts` | Position cache + early-exit + Phase 1 token/`{` gates. |
| `src/markdown/md-core-rules/set-positions.ts` | `Object.isExtensible` guard, `tabular_inline` skip, link_open strict-triple + span fallback. |
| `src/markdown/md-theorem/block-rule.ts` | Hoist envName validation in non-silent `BeginTheorem`. |
| `tests/_data/_footnotes_latex/_data-footnote.js` | Negative + boundary + multi-line opening tag fixtures. |
| `tests/_data/_footnotes_latex/_data-footnotetext.js` | `\blfootnotetext`-only + mixed `\footnotetext`+`\blfootnotetext` fixtures. |
| `tests/_data/_footnotes_latex/_data_known_quirks_footnote.js` | Pre-existing quirks pinned (mixed mark+real, nested numbering). |
| `tests/_data/_theorem/_data.js` + `_data_known_quirks.js` | Adjacent-line handshake fixture; quirk fixtures under "TO BE FIXED". |
| `tests/_data/_tokenPositions/_data.js` | Strict-triple + span-fallback link snapshots; tabular_inline sibling-positions regression. |
| `tests/_data/_highlights/_data.js` | Span-fallback highlight pin (3 cases). |
| `tests/_html-segments.js` | inline-tabular, fancy-link, tikzpicture (segment count) regression cases. |
| `tests/_footnotes_latex.js` | Soundness canary + ratio-based perf regression. |

No public API surface, no exported names, no option flags introduced.

---

## Testing

Full suite passes (3,397 tests). New coverage:

- Footnote correctness: negative fixtures for `\footnotemark` / `\footnotesize`, mixed mark+real (in quirks file), end-of-source / tShift / nested-parse boundaries, multi-line opening tag (`\footnote\n[1]\n{body}`).
- Footnotetext correctness: `\blfootnotetext`-only doc (pre-gate regression), mixed `\footnotetext` + `\blfootnotetext` in one doc.
- Token-guard soundness: structural canary (every regex alternative starts with `\footnote*` literal and ends with `{`) + per-alternative samples + forbidden samples (letter-continuation rejection) + no-match samples.
- Position invariant: canary that `link_open.positions` carries no `start_content`/`end_content` in either branch (strict-triple `[text](url)` and span fallback `[**bold**](url)`).
- Perf regression: ratio-based scaling test (400 vs 4000 paragraphs, median of 5 via `performance.now()`). Linear ~10, quadratic ~1000, limit 60× catches partial regressions. Two paths: cache early-exit (footnote at start) and per-line gate (footnote at end).
- Tabular: `markdownToHTMLSegments({ addPositionsToTokens: true })` regression for inline-tabular children; sibling-position snapshot for `\begin{tabular}…\end{tabular}` between paragraphs.
- Theorem: HTML pin for `\newtheorem` + adjacent `\begin{NAME}` (silent-mode handshake); pre-existing body-drop quirk pinned in `_data_known_quirks.js`. Tikzpicture segment-count regression: 3 segments (Before/body/After) vs master's 1.
- Link guard: strict-triple `[text](url)` and span fallback for `[**bold**](url)`, `` [`code`](url) ``, `[![alt](img)](url)`, plus nested-bracket `[outer [inner](b)](a)` defensive case.
- Highlight: 3 fancy-link snapshots (bold/code/image) pinning empty `<span class="mmd-highlight">` wrappers.

Output equivalence verified on the footnote-perf benchmark (byte-identical HTML, identical segment map) and on a TikZ-heavy benchmark (no more unmatched `<div class="theorem_block">`).

# PR: Expose figure/table placement specifier on `paragraph_open` meta

Status: Implemented
Owner: @OlgaRedozubova

---

## Context

`\begin{figure}` and `\begin{table}` accept an optional placement specifier — `[h]`, `[t]`, `[b]`, `[p]`, `[H]`, `[!h]`, etc. The parser already matches this specifier via `RE_BEGIN_TABLE_OR_FIGURE_WITH_PLACEMENT` (`src/markdown/common/consts.ts:120`), but `begin-table.ts` discards `match[2]` and unconditionally produces `\begin{<type>}[h]` for the token's `latex` field.

The consequence: downstream `forLatex` consumers cannot distinguish between
- a source that explicitly carried a specifier (any of `t`/`b`/`p`/`H`/`!h`/…),
- a source that explicitly carried `[h]`,
- a source that carried no specifier at all.

All three round-trip to `\begin{figure}[h]`. Documents authored with `[t]` or `[!h]` lose their author's intent on round-trip, and documents without a specifier silently acquire `[h]`. This is the same class of round-trip problem that `2026-05-tabular-vertical-align-bracket.md` solves for tabular `[t]/[c]/[b]`.

---

## Goal

- Preserve the placement specifier captured by the parser regex and expose it on the token so a `forLatex` consumer can reconstruct the original source faithfully.
- Add the environment type (`'figure'` or `'table'`) alongside the placement on the token meta so a consumer iterating tokens has parent context directly on the open-tag.
- Do this without changing the existing `token.latex` shape, so existing HTML and forLatex snapshot tests are byte-identical.

---

## Non-Goals

- Changing how HTML rendering uses (or ignores) the specifier — it has no visual effect on the HTML pipeline today and that stays.
- Changing the existing `token.latex` value. Keeping `\begin{<type>}[h]` for both figure and table preserves the current contract; the truth about the source moves to a side channel (`meta.placement`).
- Extending the regex to cover `[t!]`/`[b!]`/`[p!]` (post-bang variants). These are valid LaTeX but the existing regex does not match them; they fall back to the no-bracket regex and `meta.placement` becomes `undefined`. Out of scope here.
- New rendering / styling driven by the specifier.

---

## Current Behavior

- `\begin{figure}[t]` → `token.latex = '\\begin{figure}[h]'` (user's `t` lost)
- `\begin{figure}[!h]` → `token.latex = '\\begin{figure}[h]'` (user's `!h` lost)
- `\begin{figure}` → `token.latex = '\\begin{figure}[h]'` (`h` injected silently)
- `\begin{table}[b]` → `token.latex = '\\begin{table}[h]'` (user's `b` lost)
- The `paragraph_open` token has no `meta` field populated for placement; `meta` is `null` (markdown-it default).

---

## Desired Behavior

`token.latex` is unchanged — still `\begin{<type>}[h]` for both figure and table, preserving every existing snapshot.

`paragraph_open.meta` (set when `state.md.options.forLatex === true`) gains two fields:

```ts
token.meta = {
  type: 'figure' | 'table',     // environment kind
  placement: 'h' | 'H' | 't' | 'b' | 'p' | '!h' | 'h!' | '!H' | 'H!' | '!t' | '!b' | '!p' | undefined,
}
```

- `placement` is the **exact** captured specifier when the source used the placement-form regex, otherwise `undefined`. A consumer reading `meta.placement` therefore has a faithful signal:
  - `undefined` → source had no `[…]`; the consumer should not emit one (or may inject a default of its own choosing).
  - any non-`undefined` value → source explicitly carried that specifier; emit it verbatim.
- `type` is redundant with `currentTag.type` already on the token but is placed on `meta` so consumers iterating tokens (e.g. forLatex serialization) do not have to thread two access paths.

---

## Constraints / Invariants

- **No-op on HTML output.** The HTML pipeline does not look at `token.latex` or `token.meta.placement`. Rendering is byte-identical.
- **No-op on existing `token.latex` shape.** All existing forLatex consumers reading `token.latex` continue to see `\begin{<type>}[h]`. The new contract is purely additive on `meta`.
- **No new options.** This PR does not introduce a `defaultFigurePlacement` option (unlike the tabular-bracket PR, where the `defaultCellVerticalAlign` option had a real HTML side-effect). For figure/table the placement has no rendering impact, so an option would carry no observable effect; consumers can decide injection policy themselves from `meta.placement`.
- **Defensive `meta` initialization.** `paragraph_open` may already carry a non-null `meta` in other code paths. Use a merge (`{ ...token.meta, type, placement }`) rather than assignment to avoid clobbering future use.
- **Existing regex unchanged.** `RE_BEGIN_TABLE_OR_FIGURE_WITH_PLACEMENT` already captures the standard set (`h`/`!h`/`h!`/`H`/`!H`/`H!`/`t`/`!t`/`b`/`!b`/`p`/`!p`). Reuse `match[2]` as-is.
- **Both code paths covered.** `InlineBlockBeginTable` (`begin-table.ts:161`) and the multi-line `BeginTable` (`begin-table.ts:~270`) construct the `paragraph_open` independently. Both must thread `match[2]` through to `StatePushPatagraphOpenTable`.

---

## Public API changes

| Symbol | Where | Effect |
|--------|-------|--------|
| `token.meta.type` | forLatex `paragraph_open` for figure/table | New field. `'figure'` or `'table'`. |
| `token.meta.placement` | forLatex `paragraph_open` for figure/table | New field. The captured specifier or `undefined`. |

No removals, no signature changes to existing public functions. No new options.

---

## Architecture

### Where the placement is dropped today

`begin-table.ts:230-232` and `begin-table.ts:461-463`:
```ts
let latex = match[1] === 'figure' || match[1] === 'table'
  ? `\\begin{${match[1]}}[h]`
  : match[0];
```

`match[2]` (when present) carries the user's specifier. The fix extracts it and passes it through alongside the existing `latex` argument.

### Threading the placement to the token

`StatePushPatagraphOpenTable` (`begin-table.ts:71`) gains an optional `placement?: string` parameter. Inside, when `state.md.options.forLatex` is set (the same gate already used for `token.latex`), the function attaches:
```ts
token.meta = Object.assign({}, token.meta, { type, placement });
```

Both call sites (`begin-table.ts:233` and `begin-table.ts:464`) pass `match[2]` as the new argument.

### Backward compatibility

- Consumers that ignore `meta` keep working unchanged.
- Consumers that previously read `token.latex` and treated `[h]` as authoritative continue to see `[h]` and behave identically.
- New consumers (or upgraded existing ones) read `meta.placement` to make correct round-trip decisions.

---

## Edge Cases

- **No bracket on source**: `\begin{figure}` → `meta.placement === undefined`; `token.latex === '\\begin{figure}[h]'` (unchanged).
- **All standard specifiers**: `[h]`, `[H]`, `[t]`, `[b]`, `[p]` and the `!`-prefixed/suffixed variants — `meta.placement` is the exact captured substring.
- **Whitespace between env name and bracket**: `\begin{figure}  [t]` — already accepted by the existing regex (`\s{0,}`). `meta.placement === 't'`.
- **Unrelated environment**: `\begin{align}` is matched by a different rule entirely and is unaffected.
- **Inline form vs multi-line form**: same `match[2]` capture in both `InlineBlockBeginTable` and `BeginTable`, both call `StatePushPatagraphOpenTable` with the captured value.
- **Same `[h]` from source vs injected**: distinguishable now — explicit `[h]` source → `meta.placement === 'h'`; absent source → `meta.placement === undefined`.

---

## Done When

- [x] `begin-table.ts:230` and `begin-table.ts:461` extract `match[2]` (may be `undefined`) and pass it to `StatePushPatagraphOpenTable`.
- [x] `StatePushPatagraphOpenTable` accepts `placement?: string` and merges `{ type, placement }` into `token.meta` when `forLatex` is set.
- [x] `token.latex` remains `\\begin{<type>}[h]` for both `figure` and `table` (existing snapshots stay green).
- [x] Unit tests cover: explicit `[t]`, explicit `[!h]`, explicit `[H]`, no-bracket source for both `figure` and `table`. Each asserts `token.meta.placement` and `token.meta.type` on the corresponding `paragraph_open`.
- [x] Changelog entry added for v2.0.41.

---

## Testing

### Unit tests (extend `tests/_figures*` or new file)

Cases:
- `\\begin{figure}[t] ... \\end{figure}` → `meta.placement === 't'`, `meta.type === 'figure'`, `latex === '\\begin{figure}[h]'`.
- `\\begin{figure}[!h] ... \\end{figure}` → `meta.placement === '!h'`.
- `\\begin{figure}[H] ... \\end{figure}` → `meta.placement === 'H'`.
- `\\begin{figure} ... \\end{figure}` (no bracket) → `meta.placement === undefined`, `meta.type === 'figure'`.
- `\\begin{table}[b] ... \\end{table}` → `meta.placement === 'b'`, `meta.type === 'table'`.
- Whitespace variant: `\\begin{figure}  [t] ... \\end{figure}` → `meta.placement === 't'`.
- Without `forLatex`: `meta` may stay `null` (no expectation either way — these consumers don't use the meta).

### Regression suite

`npm test` continues to pass at the post-validateTex count, with the new meta-checking tests added on top.

---

## Risk / Rollback

**Risk: Very low**

- Purely additive on `meta`. `token.latex` shape is unchanged.
- No HTML pipeline change.
- No new options, no new dependencies.
- One small parameter addition on one private helper, one merge into `meta` guarded by the existing `forLatex` check.

**Rollback**: revert PR. Consumers that started reading `meta.placement` would lose access but their old `token.latex` reads continue to work.

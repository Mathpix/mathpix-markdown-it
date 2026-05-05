# PR: Parse `[t]/[c]/[b]` vertical-align bracket on `\begin{tabular}`

Status: Active
Owner: @OlgaRedozubova

---

## Context

Standard LaTeX `\begin{tabular}` accepts an optional positional argument `[t]/[c]/[b]` that controls how the tabular box is aligned vertically with surrounding context. mathpix-markdown-it currently silently drops this bracket — the parser regex matches only `\begin{tabular}\s*\{...\}` and ignores anything between `\begin{tabular}` and `{`.

This PR adds bracket parsing and uses the parsed value as the default vertical alignment for the `l/c/r/S` columns of that table. It also adds an opt-in renderer option that lets consumers flip the absent-bracket default to `top` (or `bottom`) without modifying the source MMD.

The motivating case is tables that contain mixed-height cells — for example, one cell holds a long stacked list (often via a nested `\begin{tabular}{l}`), while siblings carry short text. Today every cell renders vertically centered, so the short cells visually float in the middle of the row instead of starting at the top of the row's content. With this change, a document author (or generator) can write `\begin{tabular}[t]{|l|l|l|}` and get top-aligned `<td>` cells, matching the standard LaTeX `[t]` semantics.

---

## Goal

- Parse the optional `[t]/[c]/[b]` bracket on `\begin{tabular}` and propagate it through the tabular pipeline.
- Use the parsed bracket as the default vertical alignment for `l/c/r/S` columns of that table.
- Add an opt-in `defaultCellVerticalAlign` option that flips the absent-bracket default in both HTML output and `forLatex` export.
- Preserve existing behavior when no bracket is present and the option is not set.

---

## Non-Goals

- Adding `\makecell` parsing (future, complementary path: per-cell vertical alignment without a row-level bracket).
- New non-standard column-spec letters or width inference.
- Per-cell vertical-align values driven by anything other than the existing column-spec mechanism (`m`/`p`/`b`) or the new row-level bracket.
- Auto-injecting `[t]` on outer tabulars when an inner tabular carries `[t]` (would be a non-LaTeX heuristic).
- Any change to math, list, or non-tabular rendering paths.

---

## Current Behavior

- `\begin{tabular}[t]{|l|l|l|}` — bracket is silently dropped at the regex in `parse-tabular.ts`. Rendered identically to `\begin{tabular}{|l|l|l|}`.
- `getVerticallyColumnAlign` (`common.ts`) hard-codes `vAlign = 'middle'` for `l/c/r/S` columns. Only `m`/`p`/`b` produce non-middle vAlign.
- `forLatex` export emits the column spec back into the `latex` payload but does not preserve any bracket (it never received one).
- HTML `<td>` style omits `vertical-align` unless an explicit `m`/`p`/`b` column type is set; the browser default (`middle`) applies.

---

## Desired Behavior

### Bracket parsing

- `\begin{tabular}[t]{|l|l|l|}` → all `l/c/r/S` columns of that table default to `vAlign: 'top'`.
- `\begin{tabular}[c]{|l|l|l|}` → defaults to `'middle'` (matches existing behavior).
- `\begin{tabular}[b]{|l|l|l|}` → defaults to `'bottom'`.
- `\begin{tabular}{|l|l|l|}` (absent bracket) → defaults to `'middle'` (unchanged) unless `defaultCellVerticalAlign` option overrides it.
- Any other bracket value (whitespace, unknown letter, multi-char) → ignored, treated as absent.
- Per-column `m`/`p`/`b` always overrides the row-level bracket default.
- The bracket on a table affects only that table's cells. It does not propagate into nested tabulars (each nested tabular is parsed with its own bracket) nor outward into the cell that contains it.

### `forLatex` export

- When the source had a bracket, the bracket is preserved verbatim in `tableOpen.meta.pos`.
- When `defaultCellVerticalAlign: 'top'` (or `'bottom'`) and the source had no explicit bracket, the option's value is injected as `'t'` (or `'b'`) into `tableOpen.meta.pos` so the consumer can serialize `\begin{tabular}[pos]{...}` and keep HTML and exported LaTeX consistent.
- When `defaultCellVerticalAlign: 'middle'` or unset, no `meta.pos` is set on absent-bracket tables (preserves round-trip).

### `defaultCellVerticalAlign` option

- New top-level option: `defaultCellVerticalAlign?: 'top' | 'middle' | 'bottom'`.
- Default unset → no override; existing defaults apply.
- Affects all `\begin{tabular}` blocks in the document where the bracket is absent.
- A document with an explicit bracket always wins over the option.
- Propagates into `\multicolumn` / `\multirow` cells the same way the row-level bracket does.

---

## Constraints / Invariants

- **No-op on existing MMD**: documents without the bracket and without the option set must produce byte-identical HTML output.
- **LaTeX semantics for the bracket**: `[t]/[c]/[b]` is a row-level default. Per-column `m`/`p`/`b` must continue to win.
- **Round-trip safety**: a source with `\begin{tabular}[t]{|l|l|}` must serialize back to `\begin{tabular}[t]{|l|l|}` in `forLatex` mode (bracket preserved).
- **Scope isolation**: bracket on a table affects only that table's cells. Not propagated into nested tabulars; not propagated outward to the containing cell.
- **Unknown bracket value**: silently treated as absent; never throws or produces malformed output.
- **Existing performance optimizations are not regressed**: `columnStyleCache`, `cellAttrsCache`, shared close-tokens, `colsToFixWidth` Set, and per-parse interning all continue to work. The new `vAlign` value (one of `'top'`/`'middle'`/`'bottom'`) participates in style key generation as before.
- **Test surface**: all existing tests must pass.

---

## Public API changes

| Option | Type | Default | Effect |
|--------|------|--------:|--------|
| `defaultCellVerticalAlign` | `'top' \| 'middle' \| 'bottom' \| undefined` | `undefined` | Vertical-align fallback for `\begin{tabular}` blocks without an explicit `[pos]` bracket. Affects `<td>` HTML style and (for `'top'`/`'bottom'`) `forLatex` round-trip via `tableOpen.meta.pos`. Propagates into `\multicolumn`/`\multirow` cells. Per-column `m`/`p`/`b` and any explicit `[t]/[c]/[b]` source bracket always override. Unset → byte-identical to legacy. |

No other options introduced.

---

## Architecture

### Bracket parsing (parse-tabular.ts)

The current regex is:

```ts
/(?:\\begin{tabular}\s{0,}\{([^}]*)\})/
```

Extend to capture an optional bracket:

```ts
/\\begin{tabular}\s*(?:\[([^\]]*)\])?\s*\{([^}]*)\}/
```

The captured group `[1]` is the raw bracket value (or `undefined`); group `[2]` is the column spec.

Normalize the bracket to one of `'t' | 'c' | 'b' | undefined`:
- Trim whitespace.
- Single-character match against `'t' | 'c' | 'b'`.
- Anything else → `undefined` (absent).

Audit `getParams` and the recursive sub-tabular splice path so the bracket is recognized regardless of which branch parses the tabular.

### Threading the bracket value

The captured bracket position needs to reach `getVerticallyColumnAlign` and the `forLatex` payload builder. Two existing call sites:

- `setTokensTabular` in `parse-tabular.ts` — this is where `getVerticallyColumnAlign` is invoked. Add a `posDefault?: 't' | 'c' | 'b'` parameter threaded through `setTokensTabular → getVerticallyColumnAlign`.
- `table_open` token construction — `latex` payload field. When `forLatex`, emit the bracket into the serialized `\begin{tabular}` open. Source bracket preserved as-is; option-derived bracket injected only if source had none.

The bracket value also enters the per-table state for `multi-column-row.ts` (`getMultiColumnMultiRow`) only if multi-row/multi-column cells inherit row-level vAlign — verify whether they currently inherit `vAlign` from the column or use their own. If they use their own, no thread-through needed.

### `getVerticallyColumnAlign` (common.ts)

Extend signature:

```ts
getVerticallyColumnAlign(
  align: string,
  numCol: number,
  posDefault?: 't' | 'c' | 'b',
): TAlignData
```

For `l/c/r/S` switch branches, replace `vAlign.push('middle')` with a helper that maps `posDefault` → `'top' | 'middle' | 'bottom'`, defaulting to `'middle'` when `posDefault` is undefined.

`m`/`p`/`b` branches are not modified — they already set `vAlign` explicitly and that always wins.

The trailing `arrayFillDef(vAlign, 'middle', numCol)` fallback stays as `'middle'` (only triggers when the user wrote a malformed `align` string with fewer entries than columns; not a path that should observe the new default).

### `defaultCellVerticalAlign` option threading

Read from `state.md.options.defaultCellVerticalAlign` at the parsing entry. When the source had no bracket and the option is set to `'top'` or `'bottom'`, treat the option's value as if it were an implicit bracket — both for `getVerticallyColumnAlign` and for the `forLatex` payload.

Document-level option, not per-call. Same option applies to every tabular in the parse.

### `forLatex` round-trip

The `latex` payload for `table_open` currently emits only the column spec. Extend so that when:

- Source bracket present → serialize as `\begin{tabular}[<src-bracket>]{...}`.
- Source bracket absent + `defaultCellVerticalAlign` set to `'top'`/`'bottom'` → set `tableOpen.meta.pos` to `'t'`/`'b'` accordingly.
- Source bracket absent + no option → emit as today (no bracket).

The `latex` field on `table_open` is consumed by the LaTeX-emitting render path. Verify that consumer accepts the bracket-augmented payload without further modification.

### HTML `<td>` style

`composeCellStyle` in `tabular-td.ts` already emits `vertical-align: ${v}` whenever the `aligns.v` field is non-empty. With the bracket parsed, `vAlign` for `l/c/r/S` columns becomes one of `'top'/'middle'/'bottom'` (instead of always `'middle'` falling through to the no-emit path).

To keep absent-bracket + no-option behavior byte-identical, distinguish two cases inside `getVerticallyColumnAlign`:

- bracket explicitly `'c'` (or option set to `'c'`) → emit `'middle'` (visible in CSS)
- bracket absent and option absent → push empty string `''` (no CSS emitted, current behavior)

This preserves the no-op invariant for existing documents.

---

## Edge Cases

- **Whitespace**: `\begin{tabular}  [t]  {|l|}` — extended regex must allow whitespace between `tabular`, bracket, and `{...}`.
- **Multiple tabulars in one document**: each tabular parses its own bracket independently.
- **Nested tabulars**: outer and inner each parse their own bracket. Outer bracket does not propagate into inner; inner bracket does not propagate outward.
- **Unknown bracket value**: `\begin{tabular}[x]{|l|}` or `\begin{tabular}[tt]{|l|}` — bracket ignored, treated as absent.
- **Empty bracket**: `\begin{tabular}[]{|l|}` — treated as absent.
- **Per-column override**: `\begin{tabular}[t]{|l|m{2cm}|}` — column 0 = top (from bracket), column 1 = middle (from `m{}`).
- **`forMD` export**: the visual gating already skips `<td>` style under `forMD`. No new behavior needed for MD export — vAlign is HTML/visual only.
- **`forDocx`/`forPptx`**: vAlign currently propagates via the cell metadata for these exporters; verify the new vAlign values (`'top'`/`'bottom'`) are recognized. If not, existing behavior is preserved (only `'middle'` was emitted before).
- **`multicolumn` / `multirow`**: row-level `'t'`/`'c'`/`'b'` (from bracket or option) propagates into multicol/multirow cells, symmetric with regular `l/c/r/S` cells. Explicit `\multirow[…]` always wins. Plain `\multicolumn{}`/`\multirow{}` in an absent-bracket tabular emits no `vertical-align` (legacy).

---

## Done When

- [x] `parse-tabular.ts` regex captures `[t]/[c]/[b]` on `\begin{tabular}` and threads it to `getVerticallyColumnAlign`
- [x] All `\begin{tabular}` parsing sites in the file audited so bracket is not dropped on the recursive sub-tabular path
- [x] `getVerticallyColumnAlign` accepts a `posDefault` argument; `l/c/r/S` columns honor it; `m`/`p`/`b` columns continue to win
- [x] `defaultCellVerticalAlign` option threaded from `state.md.options` to the parser; treated as fallback when source bracket is absent
- [x] `forLatex` `tableOpen.meta.pos` carries the source bracket; option-derived `'t'`/`'b'` is injected when the source has no bracket; `'c'`/unset preserves round-trip (no `meta.pos`)
- [x] HTML output: `<td>` gains `vertical-align: top` (or `bottom`) only when bracket is present or option is set; no-op for existing MMD
- [x] `\multicolumn` / `\multirow` cells inherit the row-level `'t'`/`'c'`/`'b'` default; only unset (no bracket, no option) is not propagated, preserving the legacy no-CSS path for plain `\multicolumn{}`/`\multirow{}` in absent-bracket tabulars
- [x] Explicit `\multirow[t]`/`\multirow[c]`/`\multirow[b]` always wins over the row-level default and emits explicit `vertical-align`; `[c]` no longer leaks `[t]`/`[b]` from the outer tabular
- [x] All existing tests pass with no snapshot updates required
- [x] New unit tests cover the cases listed under Testing
- [x] Changelog entry added
- [ ] `Status` updated to `Implemented` after merge

---

## Testing

### Unit tests (new file under `tests/`)

Cases:

- `\begin{tabular}[t]{|l|l|}` → `vAlign = ['top', 'top']`, HTML emits `vertical-align: top` on both `<td>`.
- `\begin{tabular}[b]{|l|l|}` → `vAlign = ['bottom', 'bottom']`, HTML emits `vertical-align: bottom`.
- `\begin{tabular}[c]{|l|l|}` → `vAlign = ['middle', 'middle']`, HTML emits `vertical-align: middle` (explicit centering).
- `\begin{tabular}{|l|l|}` (no bracket, no option) → `vAlign = ['middle', 'middle']`, HTML emits no `vertical-align` (current behavior preserved).
- `\begin{tabular}[t]{|l|m{2cm}|}` → `vAlign = ['top', 'middle']` (per-column `m{}` wins).
- `\begin{tabular}[t]{|l|p{2cm}|b{2cm}|}` → `vAlign = ['top', 'top', 'bottom']` (`p` is already top; `b{}` overrides bracket).
- `\begin{tabular}[x]{|l|l|}` (unknown bracket) → treated as absent.
- `\begin{tabular}[ ]{|l|l|}` (empty/whitespace bracket) → treated as absent.
- `\begin{tabular}  [t]  {|l|l|}` (whitespace around bracket) → `vAlign = ['top', 'top']`.
- Nested: outer `\begin{tabular}{|l|l|}` + inner `\begin{tabular}[t]{l}` — outer cells stay middle, inner cells become top.
- `defaultCellVerticalAlign: 'top'` set, source no bracket → vAlign top, `tableOpen.meta.pos = 't'`.
- `defaultCellVerticalAlign: 'top'` set, source explicitly `[c]` → vAlign middle, `tableOpen.meta.pos = 'c'` (source bracket wins over option).
- `defaultCellVerticalAlign: 'middle'` set, source no bracket → vAlign middle, `tableOpen.meta.pos` undefined (round-trip preserved).
- `defaultCellVerticalAlign` unset, source no bracket → no change (regression guard).

### Snapshot tests

- Run full snapshot suite. No existing snapshots should change — confirm by running `npm test` before and after the implementation and diffing.
- Add a new snapshot fixture: a table with `\begin{tabular}[t]{|l|l|l|}` containing nested-tabular cells of unequal lengths to verify end-to-end HTML output.

### Manual verification

- Render a sample MMD with `\begin{tabular}[t]{|l|l|l|}` containing nested-tabular cells of unequal lengths. Confirm short cells in HTML preview now align to the top.
- Render same document via `forLatex` export, confirm bracket is preserved in the emitted LaTeX source.
- Render same document with `defaultCellVerticalAlign: 'top'` and **without** the source bracket; confirm both HTML emits `vertical-align: top` and `tableOpen.meta.pos === 't'`.

### Commands

```bash
npm test
npm run build
```

---

## Risk / Rollback

**Risk**: Low

- Pure additive change. Default behavior for all existing documents (no bracket + no option) is unchanged.
- Option is opt-in. Absent → identical to current behavior.
- Bracket parsing is scoped to a single regex extension and one new parameter through one helper.
- No changes to math, list, or non-tabular rendering paths.

**Risk areas to watch**:

- Multi-column / multi-row cells — confirm row-level bracket propagates as expected.
- `forLatex` payload — confirm bracket round-trip does not break downstream LaTeX consumers.
- Existing snapshot tests — confirm none change.

**Rollback**: revert PR.

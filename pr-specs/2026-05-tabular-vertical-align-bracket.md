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
- The bracket on a table affects only that table's cells. It does not propagate into nested tabulars (each nested tabular is parsed with its own bracket).

### Cell-level inference (nested bracket → outer td)

- When an outer cell's content contains a nested `\begin{tabular}[t/c/b]`, the outer `<td>` inherits that vertical-align (matching LaTeX baseline semantics — `[t]` on the inner tabular sits at the top of the row baseline, effectively top-aligning the outer cell's content).
- Cell-level inference overrides the row-level bracket for that single cell. Siblings in the same row are not affected.
- Per-column `m`/`p`/`b` on the outer column still wins (most-specific rule).
- If the cell contains a bare nested `\begin{tabular}{...}` without bracket, no inference fires; the outer cell uses the row-level default.

### `forLatex` export

- When the source had a bracket, the bracket is preserved verbatim in `tableOpen.meta.bracket`.
- When `defaultCellVerticalAlign: 'top'` (or `'bottom'`) and the source had no explicit bracket, the option's value is injected as `'t'` (or `'b'`) into `tableOpen.meta.bracket` so the consumer can serialize `\begin{tabular}[pos]{...}` and keep HTML and exported LaTeX consistent. **Top-level only** — nested absent-bracket tabulars stay bracket-less to preserve round-trip.
- When `defaultCellVerticalAlign: 'middle'` or unset, no `meta.bracket` is set on absent-bracket tables (preserves round-trip).
- Every `td_open` of a tabular with an effective bracket carries `meta.parentBracket` set to that bracket. Consumers iterating forLatex tokens see parent context directly on each cell. `AddTd` and `AddTdSubTable` accept an optional `meta?: TTdMeta` parameter; the multicol path sets `parentBracket` alongside its existing meta fields. New `TTdMeta` type in `common.ts` captures the known shape of `td_open.meta` for forLatex (parentBracket, multi, colCount, colSpecs, currentColIndex, isSubTabular, forceMultiFixedWidth).

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
- **Scope rules**: bracket on a table is row-level for that table's own cells. Bracket on a nested tabular additionally propagates to the outer cell containing it (cell-level inference, matches LaTeX baseline semantics). Bracket does not propagate into deeper nested tabulars.
- **Unknown bracket value**: silently treated as absent; never throws or produces malformed output.
- **Existing performance optimizations are not regressed**: `columnStyleCache`, `cellAttrsCache`, shared close-tokens, `colsToFixWidth` Set, and per-parse interning all continue to work. The new `vAlign` value (one of `'top'`/`'middle'`/`'bottom'`) participates in style key generation as before.
- **Test surface**: all existing tests must pass.
- **Frozen shared `td_open.meta`**: the per-bracket `TD_META_BY_BRACKET` singletons are `Object.freeze`'d; extend via spread (`{...meta, extra}`), never in-place. No clone-on-write marker (asymmetric with `attrs` / `attrsSharedMarker`) because the codebase has no in-place meta mutators — add a `metaSharedMarker` only when a legit mutator appears.

---

## Public API changes

| Option | Type | Default | Effect |
|--------|------|--------:|--------|
| `defaultCellVerticalAlign` | `'top' \| 'middle' \| 'bottom' \| undefined` | `undefined` | Vertical-align fallback for `\begin{tabular}` blocks without an explicit `[pos]` bracket. Affects `<td>` HTML style. Propagates into `\multicolumn`/`\multirow` cells only for `'top'`/`'bottom'` (option `'middle'` stays no-op on multicol to preserve legacy). Per-column `m`/`p`/`b` and any explicit `[t]/[c]/[b]` source bracket always override. Unset → byte-identical to legacy. See `forLatex export` for round-trip behavior. |

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

- `setTokensTabular` in `parse-tabular.ts` — this is where `getVerticallyColumnAlign` is invoked. Add a `bracketDefault?: 't' | 'c' | 'b'` parameter threaded through `setTokensTabular → getVerticallyColumnAlign`.
- `table_open` token construction — `latex` payload field. When `forLatex`, emit the bracket into the serialized `\begin{tabular}` open. Source bracket preserved as-is; option-derived bracket injected only if source had none.

The bracket value also enters the per-table state for `multi-column-row.ts` (`getMultiColumnMultiRow`) only if multi-row/multi-column cells inherit row-level vAlign — verify whether they currently inherit `vAlign` from the column or use their own. If they use their own, no thread-through needed.

### `getVerticallyColumnAlign` (common.ts)

Extend signature:

```ts
getVerticallyColumnAlign(
  align: string,
  numCol: number,
  bracketDefault?: 't' | 'c' | 'b',
): TAlignData
```

For `l/c/r/S` switch branches, replace `vAlign.push('middle')` with a helper that maps `bracketDefault` → `'top' | 'middle' | 'bottom'`, defaulting to `'middle'` when `bracketDefault` is undefined.

`m`/`p`/`b` branches are not modified — they already set `vAlign` explicitly and that always wins.

The trailing `arrayFillDef(vAlign, defaultV, numCol)` fallback uses the same `defaultV` for symmetry — extra columns past the column-spec length get the row-level default rather than hardcoded `'middle'`.

### `defaultCellVerticalAlign` option threading

Read from `state.md.options.defaultCellVerticalAlign` at the parsing entry. When the source had no bracket and the option is set to `'top'` or `'bottom'`, treat the option's value as if it were an implicit bracket — both for `getVerticallyColumnAlign` and for the `forLatex` payload.

Document-level option, not per-call. Same option applies to every tabular in the parse.

### `forLatex` round-trip

The `latex` payload for `table_open` currently emits only the column spec. Extend so that when:

- Source bracket present → serialize as `\begin{tabular}[<src-bracket>]{...}`.
- Source bracket absent + `defaultCellVerticalAlign` set to `'top'`/`'bottom'` → set `tableOpen.meta.bracket` to `'t'`/`'b'` accordingly.
- Source bracket absent + no option → emit as today (no bracket).

The `latex` field on `table_open` is consumed by the LaTeX-emitting render path. Verify that consumer accepts the bracket-augmented payload without further modification.

### HTML `<td>` style

`composeCellStyle` in `tabular-td.ts` emits `vertical-align: ${v}` whenever `aligns.v` is non-empty. For regular `l/c/r/S` columns `bracketToVAlign` maps `'t' → 'top'`, `'b' → 'bottom'`, and everything else (`'c'`, `undefined`) → `'middle'` — so `vertical-align: middle` is always present for these cells. This matches master, where the legacy code pushed `'middle'` unconditionally; existing snapshots already include `vertical-align: middle` and remain byte-identical.

The `\multicolumn` / `\multirow` path uses a different guard: it emits `vertical-align` only when an effective bracket (`'t'`/`'c'`/`'b'`) is set, and stays no-CSS when the bracket is absent and the option is `'middle'` or unset. This preserves the legacy no-`vertical-align` output on multicol/multirow cells in absent-bracket tabulars.

---

## Edge Cases

- **Whitespace**: `\begin{tabular}  [t]  {|l|}` — extended regex must allow whitespace between `tabular`, bracket, and `{...}`.
- **Multiple tabulars in one document**: each tabular parses its own bracket independently.
- **Nested tabulars**: outer and inner each parse their own bracket. Outer bracket does not propagate into inner; inner bracket does not propagate outward.
- **Multiple nested tabulars in one cell**: only the first nested `\begin{tabular}[...]` contributes its bracket to the outer cell. Subsequent nested tabulars in the same cell render with their own brackets but do not override the outer cell's vertical-align.
- **Unknown bracket value**: `\begin{tabular}[x]{|l|}` or `\begin{tabular}[tt]{|l|}` — bracket ignored, treated as absent.
- **Empty bracket**: `\begin{tabular}[]{|l|}` — treated as absent.
- **Per-column override**: `\begin{tabular}[t]{|l|m{2cm}|}` — column 0 = top (from bracket), column 1 = middle (from `m{}`).
- **`forMD` export**: the visual gating already skips `<td>` style under `forMD`. No new behavior needed for MD export — vAlign is HTML/visual only.
- **`forDocx`/`forPptx`**: vAlign currently propagates via the cell metadata for these exporters; verify the new vAlign values (`'top'`/`'bottom'`) are recognized. If not, existing behavior is preserved (only `'middle'` was emitted before).
- **`multicolumn` / `multirow`**: explicit source bracket `'t'`/`'c'`/`'b'` propagates; option `'top'`/`'bottom'` propagates; option `'middle'` does NOT (preserves legacy no-vertical-align on multicol). Explicit `\multirow[…]` always wins. Plain `\multicolumn{}`/`\multirow{}` in an absent-bracket tabular emits no `vertical-align`.
- **Diagbox cells**: render-tabular always emits `vertical-align: middle` for cells containing `\diagbox`/`\slashbox`/`\backslashbox`. Parser detects via `getSubTabular`'s `hasDiagbox` flag and skips its own vertical-align emit so the result has a single `vertical-align: middle` (no duplication). Outer tabular's bracket does not override this — the diagonal split visual always centers content.

---

## Done When

- [x] `parse-tabular.ts` regex captures `[t]/[c]/[b]` on `\begin{tabular}` and threads it to `getVerticallyColumnAlign`
- [x] All `\begin{tabular}` parsing sites in the file audited so bracket is not dropped on the recursive sub-tabular path
- [x] `getVerticallyColumnAlign` accepts a `bracketDefault` argument; `l/c/r/S` columns honor it; `m`/`p`/`b` columns continue to win
- [x] `defaultCellVerticalAlign` option threaded from `state.md.options` to the parser; treated as fallback when source bracket is absent
- [x] `forLatex` `tableOpen.meta.bracket` carries the source bracket; option-derived `'t'`/`'b'` is injected when the source has no bracket; `'c'`/unset preserves round-trip (no `meta.bracket`)
- [x] HTML output: `<td>` gains `vertical-align: top` (or `bottom`) only when bracket is present or option is set; no-op for existing MMD
- [x] `\multicolumn` / `\multirow` cells inherit explicit source `'t'`/`'c'`/`'b'` and option `'top'`/`'bottom'`; option `'middle'` and unset stay no-op (preserves legacy no-CSS path on multicol)
- [x] Explicit `\multirow[t]`/`\multirow[c]`/`\multirow[b]` always wins over the row-level default and emits explicit `vertical-align`; `[c]` no longer leaks `[t]`/`[b]` from the outer tabular
- [x] All existing tests pass; two `\multirow[c]` snapshots in `tests/_data/_tabular/_data_digbox.js` updated to include the now-explicit `vertical-align: middle` (intentional behavior change — see "Multirow vpos handling" notes)
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
- `\begin{tabular}{|l|l|}` (no bracket, no option) → `vAlign = ['middle', 'middle']`, HTML emits `vertical-align: middle` (matches master — legacy code pushed `'middle'` unconditionally; snapshots include it).
- `\begin{tabular}[t]{|l|m{2cm}|}` → `vAlign = ['top', 'middle']` (per-column `m{}` wins).
- `\begin{tabular}[t]{|l|p{2cm}|b{2cm}|}` → `vAlign = ['top', 'top', 'bottom']` (`p` is already top; `b{}` overrides bracket).
- `\begin{tabular}[x]{|l|l|}` (unknown bracket) → treated as absent.
- `\begin{tabular}[ ]{|l|l|}` (empty/whitespace bracket) → treated as absent.
- `\begin{tabular}  [t]  {|l|l|}` (whitespace around bracket) → `vAlign = ['top', 'top']`.
- Nested: outer `\begin{tabular}{|l|l|}` + inner `\begin{tabular}[t]{l}` — outer cells stay middle, inner cells become top.
- `defaultCellVerticalAlign: 'top'` set, source no bracket → vAlign top, `tableOpen.meta.bracket = 't'`.
- `defaultCellVerticalAlign: 'top'` set, source explicitly `[c]` → vAlign middle, `tableOpen.meta.bracket = 'c'` (source bracket wins over option).
- `defaultCellVerticalAlign: 'middle'` set, source no bracket → vAlign middle, `tableOpen.meta.bracket` undefined (round-trip preserved).
- `defaultCellVerticalAlign` unset, source no bracket → no change (regression guard).

### Snapshot tests

- Run full snapshot suite. No existing snapshots should change — confirm by running `npm test` before and after the implementation and diffing.
- Add a new snapshot fixture: a table with `\begin{tabular}[t]{|l|l|l|}` containing nested-tabular cells of unequal lengths to verify end-to-end HTML output.

### Manual verification

- Render a sample MMD with `\begin{tabular}[t]{|l|l|l|}` containing nested-tabular cells of unequal lengths. Confirm short cells in HTML preview now align to the top.
- Render same document via `forLatex` export, confirm bracket is preserved in the emitted LaTeX source.
- Render same document with `defaultCellVerticalAlign: 'top'` and **without** the source bracket; confirm both HTML emits `vertical-align: top` and `tableOpen.meta.bracket === 't'`.

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

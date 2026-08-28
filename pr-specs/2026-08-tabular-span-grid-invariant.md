# PR: Decide the tabular grid in one place, and offer a grid a CALS consumer can build

Status: Implemented
Owner: @OlgaRedozubova
Base: master
Version: 3.1.0

---

## Context

- Reported against a pipeline that converts our HTML to CALS. It breaks on span-heavy tables — scanned form pages whose header rows are dense with row- and column-spans, which OCR serializes with spans that overlap.
- The reported shape, reduced: a 5-column tabular where row 2 anchors two spans and row 3 declares a `\multicolumn{4}` over columns that are still covered.

  ```latex
  \begin{tabular}{|l|l|l|l|l|} \hline
  \multirow{2}{*}{Image} & Other view - & \multicolumn{3}{|l|}{\multirow{2}{*}{…}} \\ \hline
  & \multicolumn{4}{|l|}{mc 4} \\ \hline
  ```

- Measured on that shape: the emitted row 3 carries 4 covered slots (column 1 from the `\multirow`, columns 3–5 from the `\multirow` nested in `\multicolumn{3}`) **plus** a declared `colspan=4` — an effective width of **8 in a 5-column table**.
- **The input is upstream's bug, the grid arithmetic is ours.** LaTeX compiles that source with no error, because `\multirow` prints across rows without reserving cells, so an overlap is not a TeX error — yet even TeX's own PDF collides the content: `pdftotext` shows the multirow text pushed out of flow and the two overlapping labels merged onto one line. The serializer should not emit it, and independently our renderer should never emit a grid that cannot exist.
- **Not a regression.** Rendered across ten published versions (1.3.11 … 3.0.1, `master`): the shape's HTML is identical in all of them. It surfaced only now because such pages also carry `\begin{tabular}[t]{…}`, which did not render as a table at all before 2.0.40. Fixing `[pos]` parsing there made those tables render, and this long-standing defect became visible.

## Goal

- **One place decides structure.** Which cell lands in which column, how wide and how tall it ends up, which cells the grid has no room for — decided once from the parsed rows, before anything is emitted.
- **Hold the row-width invariant:** slots carried by rowspans from earlier rows plus the colspans the row declares equals the column count. In `source` for the class this PR fixes — a span declaring more columns than the row has — and in `strict` for every table.
- **Offer, behind an option, a grid a CALS consumer can build** — every row holding at least one cell — without changing what earlier versions rendered by default.

## Non-Goals

- **Restoring the intended geometry.** A valid grid is not the layout the page had: in the reported shape `mc 4` lands in column 2 instead of spanning 2–5, and `strict` shortens spans and drops rows. What the region really looked like is not derivable from contradictory spans; only the serializer knows. The root cause stays upstream, in table serialization.
- **The serializer.** Continuation rows and grid reconciliation are decided where the MMD is written — renderer-only fix here.
- **Reconciling by default.** `strict` rewrites geometry, so it cannot be the default: `source` must render byte-identically to earlier versions, and `forLatex` must rebuild the source whatever the mode says.

## Defect

`parse-tabular.ts` kept the cross-row coverage map `MR[col]` inside the emission walk and decided everything as it went. Two consequences:

1. The guard reaching the `\multicolumn` reduction tested the span's **first** column only:

   ```ts
   let d = ic - mc + 1;          // ic is the span's LAST column, so d is its first — correct
   if (MR[d] && MR[d] > 0) {     // ← tests the first column only
   ```

   On the sample, row 3 arrives as `ic=4 mc=4 MR=[1,0,2,2,2]`: `d = 1`, `MR[1]` is `0` because column 2 is genuinely free, so the guard failed and the span kept its full width. The reduction loop underneath was already correct — run it and it yields `mc = 1`.

2. A `\multirow` was clamped to the table's row count, not to the rows still below it, so a span anchored in the last rows reached past the end of the table.

Neither could be fixed by reordering rows: a span reaches rows the walk has not seen yet, so a row-at-a-time walk cannot know whether a row will be left without cells.

Seven more came out once the grid was reconciled at all — four from the adversarial generator, three from review — each reachable from valid MMD and none present in the reported sample:

3. **A clipped span kept a held column.** Shortening `\multicolumn{3}` to two columns leaves it over the column a `\multirow` holds when the held column is not at its left edge — the slot is then booked twice.
4. **The last row a span covers read as still held.** `covering[col]` counts the anchor row, so "one row left" means the span ends here; the cell path tested that correctly, after its decrement, while padding, collapsing and clipping tested it before. A `\multirow{1}` collapsed the row below it, and padding stopped one column short.
5. **A free column could be left with no cell**, when a clip narrowed a span or a cell was dropped, which is a row narrower than the table — and in one shape the text of the clipped cell was lost outright.
6. **A cell holding a nested tabular read as printing nothing**, because the parse moves that text out of the cell's own content and into `subTable`. On a held column such a cell was dropped with its table, and a row of them would have collapsed. The plan now takes a `prints` flag rather than reading the content string.
7. **A row carrying no cells of its own did not count towards a span's height.** The clamp counted rows that hold cells, while the emitter produces a `<tr>` for a lone rule line too, so a `\multirow` reaching over one came out a row short and the row below it a column narrow. Counted from the rows the emitter will produce.
8. **A span count that is not a positive whole number leaked into the arithmetic.** `getMC` already read `\multicolumn{0}` as one column, but `getCurrentMC` added the raw number for any cell after the first, so `{-1}` and `{q}` sent the next cell's target column negative or to `NaN` — and a plan indexed by column then lost it. Two helpers now answer for every reader: `spanCount` for columns, where a bad count claims one, and `rowCount` for rows, where it claims none. A fraction above one was the worst of them: `\multicolumn{2.5}` normalized in one reader and not in the other, which put the cell at column −1.5 and lost it in `strict`.
9. **`strict` took a slot only when the cell's last column was held.** For a `\multicolumn` whose left half was held and right half free the span was narrowed instead, so two mirror-image tables came out differently. Every column the cell asks for is checked.

## Implementation

- **`begin-tabular/grid-model.ts`** (new) owns structure and nothing else. `buildTabularGrid(cols, rows, options)` takes the analysed rows and returns, per row, its cells in emission order with the `col`/`colspan`/`rowspan` they end up with, the ones dropped for want of room, and whether the row collapses. Rules: a `\multicolumn` running into covered columns is shortened by each column that stays covered, a `\multirow` deeper than the rows left is clamped, a cell whose only column is held is dropped, a row with fewer cells than columns is padded.
- **`parse-tabular.ts`** splits into three steps: `parseTabularRows` parses every row once, `buildTabularGrid` plans, then the emission loop walks the plan and adds borders, alignment and content. `MR[]`, `MRspan[]` and the per-branch coverage bookkeeping are gone from the emitter.
- **`tabularGridMode?: 'source' | 'strict'`**, default `source`, threaded next to `defaultCellVerticalAlign` (model, `mdInit`, plugin, React component, README). Disabled under `forLatex`. `strict` adds what the source cannot express:
  - a row every column of which a span holds and which prints nothing is dropped, and the spans that counted it lose a row with it;
  - a span holding a slot the row writes into gives the slot up, with every column it covers, spans being rectangular;
  - a clipped span takes only the free columns adjacent to the one it ends on;
  - a column with one row of coverage left is free in this row, everywhere the model asks;
  - every free column gets a cell, so no row comes out narrower than the table.
- **No warning.** A clip and a clamp are normalization, not a defect worth a console line.

## Constraints / Invariants

- **`source` is byte-identical to before for every table whose spans do not overlap**, and changes only the `colspan`/`rowspan` of the spans this PR narrows or clamps. Asserted by the corpus differential, not by inspection.
- **A cell parsed once, and only where the emitter used to reach it**, so nested tabular ids keep their order.
- **Export formats follow the HTML.** `tsv`/`csv`/`table-markdown` build from the same token stream, so a clipped span must not desync them — pinned in both modes for every fixture.
- **`forLatex` is mode-independent**, or a `.tex` round-trip would lose the rows `strict` drops.
- **Styling follows what a cell claimed when placed**, not what `strict` later left it: a `\multirow` is styled by the last column of its span, and the rule under it sits where the span was expected to end. See Known Limitations for what that costs under a partial `\cline`.
- **`forLatex` carries the plan's `colspan`/`rowspan` too**, and the plan can change how many cells a row has. Measured against 3.0.1 on two generated corpora of 1500 tables each: rows close to the table's width — 1194 differ, all but six in the span numbers alone, one in `<td>` count; rows that overrun it — 763 differ, every one of them in the span numbers alone. An independent run with a third shape mix reported 62 of 1500 differing in `<td>` count, so the share depends on the input, not on a rule. What holds across all of them: `<tr>` count never differs, `token.latex` and `tr_open.latex` are untouched for every cell that is emitted, and a cell the grid drops takes its source with it. A converter reading the attributes, or counting cells, sees the change.
- **Peak memory grows from one row to one table.** Every row's cell text and parsed spans are held until emission, because a span reaches rows a row-at-a-time walk has not seen. Bounded by the table, not the document.

## Known Limitations

- `source` still emits `<tr></tr>` for a fully covered continuation row. That row is not expressible in CALS (`row` is `(entry|entrytbl)+` in DocBook 4.5, `entry+` in the OASIS Exchange Table Model), and it cannot be fixed without changing geometry — hence the option rather than a fix.
- **`source` can still book a slot twice.** A narrowed `\multicolumn` keeps its right edge, so it may sit on a column a `\multirow` carries — the row's width adds up and the counting check cannot see it, while a consumer that places cells left to right can. Only `strict` moves the span onto the free run. Pinned per shape in `tests/_tabular_grid.js`.
- **A line carrying no cells of its own fills every column in `source`**, the held ones included, which books those slots twice; `strict` skips them.
- `strict` costs height and width: a `\multirow{3}` with two empty continuations becomes a single row, and a span over a written cell narrows.
- **`strict` draws the rule under a cell where the span claimed it would end**, not where the mode left it, and styles the cell from the column its claim ended on. With a `\cline` that covers only part of the width, a shortened span can take a border the source does not draw there.
- **A `\multicolumn` count that is not a positive whole number claims one column**, and a `\multirow` count that is not one claims no rows at all — no `rowspan` is written. Both hold in both modes. That normalization is what keeps the grid buildable for such input; the count itself is malformed LaTeX and nothing recovers the intent.
- **A continuation row must keep an empty cell for each covered column**, which is how the serializer writes one. A cell's column is counted positionally over the row's own spans, coverage not consulted, so a hand-written row that omits those cells has every later cell one column too far left. Untouched here: both modes read the row the same way, and changing it would move every such cell in `source`.
- `\begin {tabular}` whitespace handling is untouched — a separate pre-existing defect.

## Measured

- **Violations by class**, on the reported shapes: before, one row declared 8 columns in a 5-column table and a `\multirow` in the last rows reached past the end of the table; after, neither class occurs in either mode. What `source` still leaves is the fully covered row, which `strict` removes — see Known Limitations.
- **The model was verified against the emitter before it replaced it**: plan and emitted structure compared cell by cell over the whole fixture corpus, 509 tables — 0 mismatches, with and without the option.
- **Corpus differential after the switch**: 1413 fixture sources × html/tex/docx — 5 differences, all `docx`, which is the determinism floor of that format's ids.
- **What the mode costs an ordinary table: nothing.** On tables whose spans fit — placed on free columns, never past the last row, every row printing a cell of its own — `strict` is byte-identical to `source`, over 12000 generated tables. Where the two differ, `source` has something to answer for: of the fixture corpus, 330 sources render a table, 313 are identical in both modes, and of the 17 that differ, 11 have `source` breaking the grid and 6 have it dropping a cell whose column is held. On real OCR output: 82 identical, 700 with a broken grid, 12 sound-looking, of which 3 lose a cell and 9 differ in geometry alone.
- **`strict` drops nothing `source` keeps**, in either corpus, compared cell by cell on markup rather than text — a cell holding only an image has no text of its own. The reverse is not true: `source` drops content in 10 fixture sources and in **208 of the OCR documents**.
- **`source` against 3.0.1, both directions.** Built 3.0.1 alongside and compared cell markup. Fixture corpus, 334 tables: 8 differ, 1 drops a cell 3.0.1 kept, 2 keep one it dropped, and no table gains a violation. Adversarial corpus, 2000 tables: 1761 differ, **39 drop a cell 3.0.1 kept** against 208 that keep one it dropped, 1549 have fewer violations, and 40 gain a class 3.0.1 did not have — a row past the last column (16), a slot taken twice (15), a width mismatch (6), a row with no cells (3). The 39 are rows that declare more columns than the table has, where a cell past the last column is not emitted. That tail is the price of narrowing spans in `source` at all; `strict` has none of it.
- **Adversarial generator**: 12000 generated tables, 2–7 columns, 2–6 rows, every span form real output carries — vertical brackets, a width instead of `*`, a span of one, degenerate and absurd counts, math, a nested tabular whose own spans overlap — plus rows one column short or long. `strict` leaves no violation of any class, in HTML and in `pptx` output, and loses nothing `source` keeps. `source` violates all four classes, as documented.
- **`strict` on the reported source is byte-identical to `source` on the same MMD with the `\multirow` shortened by hand**, which is what the mode is meant to amount to.

## Testing

- **What each mode leaves a consumer** (`tests/_tabular_grid.js`): ten shapes, each run through the invariant checker in both modes. `strict` must leave nothing, and what `source` leaves is pinned per shape — a row with no cells, a slot booked twice — so a known limitation is a checked contract and any new one fails the build.
- **The plan on its own** (`tests/_tabular_grid_model.js`): `buildTabularGrid` called directly on hand-written rows, thirteen cases over the arithmetic that is hardest to read off rendered HTML — where a span ends, what it covers, what the clamp does, and each `strict` rule separately.
- **Seeded fuzz** (`tests/_tabular-grid-fuzz.js`): generates span-heavy tables and asserts, in `strict`, the grid invariant for HTML and `pptx`, and that nothing `source` keeps is lost, compared on cell markup so an image-only cell counts. 400 tables in the suite, `TABULAR_FUZZ_TABLES` to sweep deeper. Defects 3–6 came from here; the fixtures below could not have found them.
- **A golden hash of `source`** over 200 generated tables whose spans fit, in the same file. Nothing else in the repository pins that output — defects 7 and the narrowing loss both reached review only because someone built the previous release and compared. A deliberate change updates the constant; anything else fails the suite.
- **Both modes pinned in full** (`tests/_tabular_grid_mode.js`, `tests/_data/_tabular/_data_grid_mode.js`): eighteen shapes, each with complete HTML for `source` and `strict` plus `tsv`/`csv`/`table-markdown` in both, `pptx` output where that path decides differently, the absence of the option asserted to equal `source`, `forLatex` asserted equal across modes, and the invariant asserted on `strict`. One of them is a whole form-page header, nested tabular inside a span and all. The invariant checker itself lives in `tests/_data/_tabular/_grid_invariant.js`, shared by all three so they cannot drift.
- **Mutation check**: narrowing the clip's guard back to the span's first column fails three shapes — the two invalid ones whose span starts on a free column, and the nested-tabular variant of the same overlap, filed under the already-valid group — plus the content assertion, and nothing else. The remaining invalid shape passes: its span starts on a covered column, which the narrow guard caught too.

## Done When

- [x] Structure is decided in one place, from data the parse already produced, with no extra pass over the source.
- [x] Every row of every table `strict` emits satisfies the width invariant, and `source` no longer declares more columns than a row has.
- [x] `source` renders byte-identically to earlier versions wherever the spans do not overlap, corpus-wide.
- [x] `strict` leaves no row without cells, on every pinned shape and on real OCR output.
- [x] `lib/`/`es5/` rebuilt in sync; changelog entry with the geometry caveat spelled out, so it is not read as a layout fix.

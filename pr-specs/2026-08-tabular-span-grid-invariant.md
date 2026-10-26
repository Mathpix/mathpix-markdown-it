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
- **Hold the row-width invariant in `strict`:** slots carried by rowspans from earlier rows plus the colspans the row declares equals the column count, for every table.
- **Leave `source` exactly as it was.** Every rule this PR adds is behind the option; `source` decides what the previous release decided, byte for byte, on every table whose span counts are positive whole numbers.
- **Offer, behind an option, a grid a CALS consumer can build** — every row holding at least one cell — without changing what earlier versions rendered by default.

## Non-Goals

- **Restoring the intended geometry.** A valid grid is not the layout the page had: in the reported shape `mc 4` lands in column 2 instead of spanning 2–5, and `strict` shortens spans and drops rows. What the region really looked like is not derivable from contradictory spans; only the serializer knows. The root cause stays upstream, in table serialization.
- **The serializer.** Continuation rows and grid reconciliation are decided where the MMD is written — renderer-only fix here.
- **Reconciling by default.** `strict` rewrites geometry, so it cannot be the default: `source` must render byte-identically to earlier versions, and `forLatex` must rebuild the source whatever the mode says.

## Defect

Nine defects, all reachable from valid MMD. Every one of them is fixed in `strict` only: fixing any of them in `source` moves output for a shape someone already relies on, and a partial fix is worse than none — a corrected rule makes a later legacy rule fire where it never did. `source` keeps the arithmetic below; `strict` is where the grid comes out buildable.

`parse-tabular.ts` kept the cross-row coverage map `MR[col]` inside the emission walk and decided everything as it went. Two consequences:

1. The guard reaching the `\multicolumn` reduction tested the span's **first** column only:

   ```ts
   let d = ic - mc + 1;          // ic is the span's LAST column, so d is its first — correct
   if (MR[d] && MR[d] > 0) {     // ← tests the first column only
   ```

   On the sample, row 3 arrives as `ic=4 mc=4 MR=[1,0,2,2,2]`: `d = 1`, `MR[1]` is `0` because column 2 is genuinely free, so the guard failed and the span took all four columns on top of printing them. The reduction loop underneath was already correct — run it and it yields `mc = 1`, which is what the span may take; what it prints is a separate field, and only `strict` sets it from the one.

2. A `\multirow` was clamped to the table's row count, not to the rows still below it, so a span anchored in the last rows reached past the end of the table.

Neither could be fixed by reordering rows: a span reaches rows the walk has not seen yet, so a row-at-a-time walk cannot know whether a row will be left without cells.

Seven more came out once the grid was reconciled at all — four from the adversarial generator, three from review — none present in the reported sample:

3. **A clipped span kept a held column.** Shortening `\multicolumn{3}` to two columns leaves it over the column a `\multirow` holds when the held column is not at its left edge — the slot is then booked twice.
4. **The last row a span covers read as still held.** `covering[col]` counts the anchor row, so "one row left" means the span ends here; the cell path tested that correctly, after its decrement, while padding, collapsing and clipping tested it before. A `\multirow{1}` collapsed the row below it, and padding stopped one column short.
5. **A free column could be left with no cell**, when a clip narrowed a span or a cell was dropped, which is a row narrower than the table — and in one shape the text of the clipped cell was lost outright.
6. **A cell holding a nested tabular read as printing nothing**, because the parse moves that text out of the cell's own content and into `subTable`. On a held column such a cell was dropped with its table, and a row of them would have collapsed. The plan now takes a `prints` flag rather than reading the content string.
7. **A row carrying no cells of its own did not count towards a span's height.** The clamp counted rows that hold cells, while the emitter produces a `<tr>` for a lone rule line too, so a `\multirow` reaching over one came out a row short and the row below it a column narrow. Counted from the rows the emitter will produce.
8. **A span count that is not a positive whole number leaked into the arithmetic.** `getMC` already read `\multicolumn{0}` as one column, but `getCurrentMC` added the raw number for any cell after the first, so `{-1}` and `{q}` sent the next cell's target column negative or to `NaN` — and a plan indexed by column then lost it. One helper, `positiveCount`, now answers for every reader: a bad `\multicolumn` count claims one column, a bad `\multirow` count no rows. A fraction above one was the worst of them: `\multicolumn{2.5}` normalized in one reader and not in the other, which put the cell at column −1.5 and lost it in `strict`.
9. **`strict` took a slot only when the cell's last column was held.** For a `\multicolumn` whose left half was held and right half free the span was narrowed instead, so two mirror-image tables came out differently. Every column the cell asks for is checked.

## Implementation

- **`begin-tabular/grid-model.ts`** (new) owns structure and nothing else. `buildTabularGrid(cols, rows, options)` takes the analysed rows and returns, per row, its cells in emission order, the ones dropped for want of room, and whether the row collapses. Rules, all of them about what a cell takes: a `\multicolumn` running into covered columns is shortened by each column that stays covered, a `\multirow` deeper than the table is clamped, a cell whose column is held is dropped, a row with fewer cells than columns is padded.
- **What a cell prints and what it takes from the grid are separate fields** — `colspan`/`rowspan` against `covers`/`claimed`. That is the release's arithmetic, and the reason its output overlaps: a clip and a clamp move the coverage map, never the attributes. `strict` prints what it takes; `source` prints what the source asked for. Merging the two is what made every earlier attempt at this change a regression.
- **`parse-tabular.ts`** splits into three steps: `parseTabularRows` parses every row once, `buildTabularGrid` plans, then the emission loop walks the plan and adds borders, alignment and content. `MR[]`, `MRspan[]` and the per-branch coverage bookkeeping are gone from the emitter.
- **`tabularGridMode?: 'source' | 'strict'`**, default `source`, threaded next to `defaultCellVerticalAlign` (model, `mdInit`, plugin, React component, README). Disabled under `forLatex`. `strict` adds what the source cannot express:
  - a row every column of which a span holds and which prints nothing is dropped, and the spans that counted it lose a row with it;
  - a span holding a slot the row writes into gives the slot up, with every column it covers, spans being rectangular;
  - a clipped span takes only the free columns adjacent to the one it ends on;
  - a column with one row of coverage left is free in this row, everywhere the model asks;
  - every free column gets a cell, so no row comes out narrower than the table.
- **No warning.** A clip and a clamp are normalization, not a defect worth a console line.

## Constraints / Invariants

- **`source` is byte-identical to the previous release**, overlapping spans included, in HTML, `pptx` and `forLatex`. The one exception is deliberate and in both modes: a span count that is not a positive whole number. Asserted by the corpus differential, not by inspection.
- **A cell parsed once, and only where the emitter used to reach it**, so nested tabular ids keep their order.
- **Export formats follow the HTML.** `tsv`/`csv`/`table-markdown` build from the same token stream, so a clipped span must not desync them — pinned in both modes for every fixture.
- **`forLatex` is mode-independent**, or a `.tex` round-trip would lose the rows `strict` drops.
- **Styling follows what a cell claimed when placed**, not what `strict` later left it: a `\multirow` is styled by the last column of its span, and the rule under it sits where the span was expected to end. See Known Limitations for what that costs under a partial `\cline`.
- **`forLatex` is byte-identical to the previous release**, token stream included — the same corpora as the HTML — except that `td_skip` now always carries a `latex` key (see Known Limitations). A cell the grid drops reaches the `.tex` as `td_skip` carrying its command and nothing else; the writer in `mmd-to-latex-zip` takes a body from the token after it, and for a dropped cell there is none, so the body is lost. That happens on 192 of 400 marked tables, exactly as it does in the release.
- **Peak memory grows from one row to one table.** Every row's cell text and parsed spans are held until emission, because a span reaches rows a row-at-a-time walk has not seen. Bounded by the table, not the document.

## Known Limitations

- `source` still emits `<tr></tr>` for a fully covered continuation row. That row is not expressible in CALS (`row` is `(entry|entrytbl)+` in DocBook 4.5, `entry+` in the OASIS Exchange Table Model), and it cannot be fixed without changing geometry — hence the option rather than a fix.
- **`source` can still book a slot twice, and still declare a row wider than the table.** A clip moves what the span takes, never the `colspan` it prints, so the printed width runs over columns a `\multirow` carries. Only `strict` prints the width it took. Pinned per shape in `tests/_tabular_grid.js`.
- **A line carrying no cells of its own fills every column in `source`**, the held ones included, which books those slots twice; `strict` skips them.
- **A dropped cell takes a nested tabular with it in `source`**, the whole inner table gone from the output — the release does the same, and nothing of the placeholder it was lifted under is left behind. `strict` keeps both.
- **A cell whose parsed content is empty prints nothing**, so `strict` may collapse a row of `\multirow{2}{*}{}` placeholders that carried nothing but a border. A cell holding only an image or a nested tabular does print, and is never read as a placeholder.
- `strict` costs height and width: a `\multirow{3}` with two empty continuations becomes a single row, and a span over a written cell narrows.
- **`strict` draws the rule under a cell where the span claimed it would end**, not where the mode left it, and styles the cell from the column its claim ended on. With a `\cline` that covers only part of the width, a shortened span can take a border the source does not draw there.
- **A `\multicolumn` count that is not a positive whole number claims one column**, and a `\multirow` count that is not one claims no rows at all — no `rowspan` is written. Both hold in both modes. That normalization is what keeps the grid buildable for such input; the count itself is malformed LaTeX and nothing recovers the intent. A count that *is* a whole number is honoured however large: `\multicolumn{500000}` builds half a million columns and 113 MB of HTML from 150 bytes of source, and `\multicolumn{1e21}` renders nothing at all. Both predate this branch — the column count has no ceiling — and both are worth one.
- **A row narrower than the preamble declares stays narrow.** The column count is the widest row, spans counted, so `\begin{tabular}{|l|l|}` whose rows carry one cell each renders one column. Older than this branch, and left alone: raising it to the preamble would move every such table.
- **`td_skip` now always carries a `latex` key**, `''` where there is nothing to write. The old emitter left the key off on one path. Nothing in this repository reads it; a consumer testing `'latex' in token` rather than its truthiness sees the difference.
- **A continuation row must keep an empty cell for each covered column**, which is how the serializer writes one. A cell's column is counted positionally over the row's own spans, coverage not consulted, so a hand-written row that omits those cells has every later cell one column too far left. Untouched here: both modes read the row the same way, and changing it would move every such cell in `source`.
- `\begin {tabular}` whitespace handling is untouched — a separate pre-existing defect.

## Measured

- **`source` against the previous release, built alongside.** Adversarial corpus, 3000 tables — nested tabulars, math, `\cline`, rows one column short or long — compared byte for byte in HTML, `pptx` and the `forLatex` token stream: **every difference has a span count in the source that is not a positive whole number, and there are none without one.** The fixture corpus agrees: of 345 sources carrying a `tabular`, 342 render a table and 339 are byte-identical. The three that differ all carry a count like `\multicolumn{0}` or `\multicolumn{2.5}`, and one of them the release rendered as no table at all. All three are pinned as fixtures.
- **The golden hash of `source` over 200 tables whose spans fit is the digest the release's own build produces.** The second hash, over 200 whose spans overlap, is this branch's, because 145 of those 200 carry a degenerate count — the one thing the two builds disagree on by design. Of the other 55, all 55 are byte-identical to the release.
- **What the mode costs an ordinary table: nothing.** On tables whose spans fit — placed on free columns, never past the last row, every row printing a cell of its own — `strict` is byte-identical to `source`, over 12000 generated tables. Of the fixture corpus, 319 of 342 are identical in both modes; the 23 that differ are the shapes `strict` is for.
- **Violations by class**: `strict` leaves none, on all 342 fixture tables, on the reported shapes, and over 12000 generated tables in HTML and in `pptx`. `source` leaves 16 on the fixture corpus, and every class on the generated one — markup wider than the source declares, a row narrower than that markup, a slot booked twice, a span past the last row, a row with no cells.
- **`strict` drops nothing `source` keeps**, compared cell by cell on markup rather than text — a cell holding only an image has no text of its own. 0 of 342 fixture tables and 0 of 12000 generated ones.
- **`strict` on the reported source is byte-identical to `source` on the same MMD with the `\multirow` shortened by hand**, which is what the mode is meant to amount to.
- **Large tables**, which the generated corpora do not reach: 300×12, 1000×8, 60×40, and three span-heavy shapes up to 800×20. `source` is byte-identical to the previous release in every one; `strict` leaves no violation in any; and on the two whose spans fit, the two modes are byte-identical.
- **Time and memory on those tables**: 0.93× to 1.24× of the previous release, the high end being 3 ms against 4 on a 51 KB output. `strict` is in the same range. Heap after rendering the largest grows 0.1 MB, so holding a table rather than a row costs what the spec says it costs.
- **No `undefined`, `NaN`, `null` or a non-positive span in any attribute or style**, over 4000 generated tables in `source`, `strict` and `strict` + `pptx`, with `p{2cm}` and `c` columns in the preamble. The invariant checker reads structure only, so this is checked separately.
- **The suite**: 5349 tests, Node 16 and Node 20, no failures. Every pre-existing fixture — HTML, `tex`, `docx`, `pptx`, the export formats — passes untouched, which is the same statement as the differential above, made by the tests that shipped before this branch.

## Testing

- **What each mode leaves a consumer** (`tests/_tabular_grid.js`): ten shapes, each run through the invariant checker in both modes. `strict` must leave nothing, and what `source` leaves is pinned per shape — a row with no cells, a slot booked twice — so a known limitation is a checked contract and any new one fails the build.
- **The plan on its own** (`tests/_tabular_grid_model.js`): `buildTabularGrid` called directly on hand-written rows, fourteen cases over the arithmetic that is hardest to read off rendered HTML — where a span ends, what it covers, what the clamp does, and each `strict` rule separately.
- **Seeded fuzz** (`tests/_tabular-grid-fuzz.js`): generates span-heavy tables and asserts, in `strict`, the grid invariant for HTML and `pptx` — against the columns the source declares, not the markup alone, so a row narrower than the table is caught too — and that nothing `source` keeps is lost, compared on cell markup so an image-only cell counts. 400 tables in the suite, `TABULAR_FUZZ_TABLES` to sweep deeper. Defects 3–6 came from here; the fixtures below could not have found them.
- **Two golden hashes of `source`**, in the same file: 200 generated tables whose spans fit, and 200 whose spans overlap. The first guards the ordinary corpus; the second guards the overlap path, where every rule `source` keeps from the release lives — three of them pass all 5300 other tests when removed and fail only that hash. Both are independent of `TABULAR_FUZZ_TABLES`. A deliberate change updates the constant; anything else fails the suite.
- **Attributes and styles** (`writes no span that is not a positive whole number, and no undefined in a style`): the invariant checker reads structure, so what an attribute holds is asserted separately, in both modes, over the same corpus.
- **Round-trip content** (`forLatex keeps every cell body the HTML keeps`): every cell body is unique in its table, so a body missing from the token stream is visible by name. A dropped cell loses its body in the `.tex`, as the release does — what is asserted is that a kept cell never does.
- **Both modes pinned in full** (`tests/_tabular_grid_mode.js`, `tests/_data/_tabular/_data_grid_mode.js`): twenty-two shapes, each with complete HTML for `source` and `strict` plus `tsv`/`csv`/`table-markdown` in both, `pptx` output where that path decides differently, the absence of the option asserted to equal `source`, `forLatex` asserted equal across modes, and the invariant asserted on `strict`. One of them is a whole form-page header, nested tabular inside a span and all. The invariant checker itself lives in `tests/_data/_tabular/_grid_invariant.js`, shared by all three so they cannot drift.
- **Every entry point, per fixture and per mode**: the markdown-it plugin and `lib/markdown`'s own `markdownToHTML` must render what the model renders. The option is unpacked in four places, and only the model's was covered — dropping it from the plugin fails 86 tests now and none before.
- **Mutation checks.** Each rule was removed in turn and the whole suite run:
  - **`source` printing the width the clip left it** — the merge that made this a regression before — fails seven tests: one shape, one fixture in five formats, and one unit test.
  - **`strict` reading the clip's guard off the span's first column only** fails the model unit test and the fuzz, in HTML and in `pptx`. It failed the unit test alone until the generator learned to write a wide span that prints nothing, the only shape where that guard decides anything: a span with content takes the slot instead. That form is now in the generator and pinned as a fixture.
  - **The three rules `source` keeps from the release** — the styling column of a span, the third row it takes off a column, the second drop of a covered cell — each pass every other test in the suite and fail only the overlap golden. They moved 15 to 237 tables of a 3000-table corpus, and nothing in the repository saw it before that hash existed.
  - **`forPptx` writing a span of one** fails the fixture that pins `pptx` for a clipped span, the one path where that rule decides anything: the attribute it drops is the `colspan="1"` a clip leaves behind. A `rowspan="1"` never reaches it — the parse writes no such attribute under `forPptx`.

## Done When

- [x] Structure is decided in one place, from data the parse already produced, with no extra pass over the source.
- [x] Every row of every table `strict` emits satisfies the width invariant, against the columns the source declares.
- [x] `source` renders byte-identically to the previous release, corpus-wide, in HTML, `pptx` and `forLatex` — the one exception being a span count that is not a positive whole number.
- [x] `strict` leaves no row without cells, on every pinned shape and over 12000 generated tables.
- [x] `lib/`/`es5/` rebuilt in sync; changelog entry with the geometry caveat spelled out, so it is not read as a layout fix.

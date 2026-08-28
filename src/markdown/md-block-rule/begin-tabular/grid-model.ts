// Structure of a tabular decided in one place: which cell lands in which column, how wide and how tall,
// and which cells the grid has no room for. Borders, alignment and content stay in the emitter.
//
// Rules the emitter has always applied: a `\multicolumn` running into columns a `\multirow` covers is
// clipped, a `\multirow` deeper than the rows left is clamped, a cell whose column is covered is
// dropped, a row with fewer cells than columns is padded. `strict` adds what the source cannot express:
// a span gives way to the content it covers, a row left without cells is not a row, a clip lands on
// free columns only, the last row of a span is free again, and every free column gets a cell.

// One cell as the parse leaves it.
export type AnalysedCell = {
  // What the source asks for; 0 without `\multicolumn`/`\multirow`.
  mc: number;
  mr: number;
  // Puts something on the page. False for a placeholder like `\multirow{2}{*}{}`; true for a nested
  // tabular, whose text the parse moves out of the cell's content.
  prints: boolean;
  // Index in the row's cells.
  index: number;
};

// One row as the parse leaves it — everything the plan reads.
export type AnalysedRow = {
  // Null for a line carrying no cells (a lone `\hline`), rendered as a row of empty cells.
  cells: AnalysedCell[] | null;
  // Column each index lands in, spans of its own row counted; a missing cell still counts for one.
  targets: number[] | null;
  // Rows the emitter will produce at or after this one, this row included.
  rowsLeft: number;
};

export type PlannedCell = {
  // First column occupied.
  col: number;
  colspan: number;
  // As emitted: 0 for one row, and what `strict` leaves of `claimed`.
  rowspan: number;
  // Rows claimed when placed: the rule under the cell and the column that styles it follow this.
  claimed: number;
  // Index in the row's cells, -1 for a cell added to fill a column.
  index: number;
  // No room: nothing emitted. `clipped` — the span ran into covered columns; `covered` — its column
  // is held.
  dropped?: 'clipped' | 'covered';
};

export type PlannedRow = {
  // Emission order, dropped cells included so a round-trip keeps them.
  cells: PlannedCell[];
  // `strict`: fully covered and printing nothing, so it has no cells — CALS has no such row
  // (`row ::= (entry|entrytbl)+`). Not emitted; the spans that counted it are one row shorter.
  collapsed: boolean;
};

export type TabularGrid = {
  cols: number;
  rows: PlannedRow[];
};

export type GridOptions = {
  // Reconcile the grid: content wins over the span holding its slot, a row left without cells is
  // dropped, a clip lands on free columns only, and every free column gets a cell.
  strict?: boolean;
  // A line without cells of its own skips the columns a span covers instead of filling them.
  pptx?: boolean;
};

/** The structure of one tabular from the analysed rows. */
export const buildTabularGrid = (
  cols: number,
  rows: AnalysedRow[],
  options: GridOptions = {},
): TabularGrid => {
  // An empty cell the plan adds to fill a column, and a cell the grid had no room for.
  const filler = (col: number): PlannedCell => ({ col, colspan: 1, rowspan: 0, claimed: 0, index: -1 });
  const dropCell = (col: number, index: number, why: 'clipped' | 'covered'): PlannedCell =>
    ({ col, colspan: 1, rowspan: 0, claimed: 0, index, dropped: why });
  // Rows still covered per column; every cell landing on a column takes one row off.
  const covering: number[] = new Array(cols).fill(0);
  // The span holding each column, so `strict` can shorten the one it takes the column from.
  const spanAt: Array<PlannedCell | null> = new Array(cols).fill(null);
  const cover = (col: number, left: number, span: PlannedCell | null): void => {
    covering[col] = left;
    spanAt[col] = left > 0 ? span : null;
  };
  // One row of coverage consumed: what a cell landing on the column costs it.
  const uncover = (col: number): void => {
    cover(col, covering[col] > 0 ? covering[col] - 1 : 0, spanAt[col]);
  };
  // Held at the start of this row. `covering` counts the anchor row, so one row left means free here —
  // as a cell placed on the column already reads it, testing after the decrement. `source` keeps its
  // older reading, which counts that last row as held.
  const held = (col: number): boolean => covering[col] > (options.strict ? 1 : 0);
  // `strict`: the span gives way to the content it covers, dropping text being the worse trade, and
  // every column it covers goes with it — spans are rectangular.
  const release = (col: number): void => {
    const span: PlannedCell | null = spanAt[col];
    if (span) {
      const shortened: number = span.rowspan - (covering[col] - 1);
      span.rowspan = shortened > 1 ? shortened : 0;
    }
    for (let k = 0; k < cols; k++) {
      if (k === col || (span && spanAt[k] === span)) {
        cover(k, 0, null);
      }
    }
  };
  const planned: PlannedRow[] = [];
  rows.forEach(({cells, targets, rowsLeft}) => {
    const row: PlannedRow = { cells: [], collapsed: false };
    const targetCols: number[] = targets || [];
    const prints: boolean = !!cells && cells.some((cell) => cell.prints);
    if (options.strict) {
      let allHeld: boolean = true;
      for (let c = 0; c < cols && allHeld; c++) {
        allHeld = held(c);
      }
      if (!prints && allHeld) {
        const shortenedSpans: Set<PlannedCell> = new Set();
        for (let k = 0; k < cols; k++) {
          const span: PlannedCell | null = spanAt[k];
          if (span && !shortenedSpans.has(span)) {
            shortenedSpans.add(span);
            span.rowspan = span.rowspan - 1 > 1 ? span.rowspan - 1 : 0;
          }
          uncover(k);
        }
        row.collapsed = true;
        planned.push(row);
        return;
      }
      if (cells) {
        // Before the walk places anything: released mid-walk, a span leaves the columns already passed
        // unfilled. Every column the cell asks for, not only the one it ends on.
        for (let j = 0; j < cols && j < cells.length; j++) {
          const at: number = j < targetCols.length ? targetCols[j] : cols;
          if (at >= cols) {
            break;
          }
          if (!cells[j] || !cells[j].prints) {
            continue;
          }
          const wide: number = cells[j].mc > cols ? cols : cells[j].mc;
          for (let c = wide > 1 ? at - wide + 1 : at; c <= at; c++) {
            if (c >= 0 && held(c)) {
              release(c);
            }
          }
        }
      }
    }
    // After any release, before the walk moves anything: what a filler must not take.
    const heldAtStart: boolean[] = new Array(cols);
    for (let c = 0; c < cols; c++) {
      heldAtStart[c] = held(c);
    }
    if (!cells) {
      // A lone `\hline`: one empty cell per column, and `strict` and `pptx` skip the held ones.
      for (let c = 0; c < cols; c++) {
        if (options.pptx || options.strict) {
          const holds: boolean = heldAtStart[c];
          uncover(c);
          if (holds) {
            continue;
          }
        }
        row.cells.push(filler(c));
      }
      planned.push(row);
      return;
    }
    for (let j = 0; j < cols; j++) {
      // Where this index lands, spans of its own row counted — a missing cell still counts for one.
      const at: number = j < targetCols.length ? targetCols[j] : cols;
      if (at >= cols) {
        break;
      }
      const cell: AnalysedCell | undefined = cells[j];
      if (!cell) {
        // Fewer cells than columns: the rest of the row is padded from here on.
        for (let c = at; c < cols; c++) {
          const holds: boolean = heldAtStart[c];
          uncover(c);
          if (holds) {
            continue;
          }
          row.cells.push(filler(c));
        }
        break;
      }
      const mr: number = cell.mr > rowsLeft ? rowsLeft : cell.mr;
      // A floor, not a reachable case: the column count comes from the widest row, spans counted.
      let mc: number = cell.mc > cols ? cols : cell.mc;
      // Whether the span ran into a held column, which is what narrowed it.
      let coveredHere = false;
      if (mc > 1) {
        // Never left of the table: unreachable from the parse, where the target already counts the span.
        const from: number = Math.max(0, at - mc + 1);
        for (let k = 0; k < mc; k++) {
          if (covering[from + k] > 0) {
            coveredHere = true;
            break;
          }
        }
        if (coveredHere) {
          const reach: number = mc;
          if (options.strict) {
            // Only the free columns next to the one it ends on: a held column inside would be booked
            // twice. `reach` keeps the run inside the requested span, clear of the cell before it.
            for (let k = 0; k < reach; k++) {
              uncover(from + k);
            }
            mc = 0;
            while (mc < reach && at - mc >= 0 && covering[at - mc] === 0) {
              mc += 1;
            }
          } else {
            // Shortened by every column that stays covered, keeping its right edge where the source
            // put it: moving it, measured against 3.0.1, drops far more cells than it saves.
            for (let k = 0; k < reach; k++) {
              uncover(from + k);
              if (covering[from + k] > 0) {
                mc -= 1;
              }
            }
          }
          if (mc < 1) {
            row.cells.push(dropCell(at, cell.index, 'clipped'));
            continue;
          }
        } else {
          uncover(at);
        }
      } else {
        uncover(at);
        if (covering[at] > 0) {
          row.cells.push(dropCell(at, cell.index, 'covered'));
          continue;
        }
      }
      // A second row off the column, as the emitter has always taken it: a no-op unless the clip above
      // left it covered.
      uncover(at);
      // The span sits where the clip left it, not where the source asked for it.
      const col: number = mc > 1 ? Math.max(0, at - mc + 1) : at;
      const placed: PlannedCell = {
        col,
        colspan: mc > 1 ? mc : 1,
        // `rowspan="1"` covers nothing, but `source` writes it and the modes must agree on a sound grid.
        rowspan: mr > 0 ? mr : 0,
        claimed: mr > 0 ? mr : 0,
        index: cell.index,
      };
      if (mr > 0) {
        for (let k = 0; k < (mc > 1 ? mc : 1); k++) {
          cover(col + k, mr, placed);
        }
      } else if (mc > 1) {
        for (let k = 0; k < mc; k++) {
          uncover(col + k);
        }
        // A narrowed span keeps its cell: taking the width and the cell both loses the text.
        if (covering[col] > 0 && !coveredHere) {
          placed.dropped = 'covered';
        }
      }
      row.cells.push(placed);
    }
    if (options.strict) {
      // A clipped span or a dropped cell leaves a free column with nothing in it, and a row narrower
      // than the table is not a grid. Rebuilt in column order, dropped cells gone.
      const byCol: Array<PlannedCell | undefined> = new Array(cols);
      row.cells.forEach((cell) => {
        if (!cell.dropped) {
          byCol[cell.col] = cell;
        }
      });
      const ordered: PlannedCell[] = [];
      for (let c = 0; c < cols; c++) {
        const placed: PlannedCell | undefined = byCol[c];
        if (placed) {
          ordered.push(placed);
          c += placed.colspan - 1;
          continue;
        }
        if (heldAtStart[c]) {
          continue;
        }
        ordered.push(filler(c));
      }
      row.cells = ordered;
    }
    planned.push(row);
  });
  return { cols, rows: planned };
};

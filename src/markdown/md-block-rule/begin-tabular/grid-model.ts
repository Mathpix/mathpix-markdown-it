// Structure of a tabular: which cell lands in which column, how wide and how tall, and which cells are
// dropped. Borders, alignment and content stay in the emitter.

// One cell as the parse leaves it.
export type AnalysedCell = {
  // From `\multicolumn`/`\multirow`; 0 without.
  mc: number;
  mr: number;
  // False for an empty placeholder like `\multirow{2}{*}{}`; true for a nested tabular.
  prints: boolean;
};

export type AnalysedRow = {
  // Null for a line with no cells (a lone `\hline`).
  cells: AnalysedCell[] | null;
  // Column each cell index lands in, counting the row's own spans.
  targets: number[] | null;
};

export type DropReason = 'clipped' | 'covered';

export type PlannedCell = {
  // First column occupied.
  col: number;
  // Columns taken from the grid.
  covers: number;
  // Emitted attributes: `source` writes what the source asked for, `strict` what the cell took.
  colspan: number;
  // 0 for none.
  rowspan: number;
  // Rows taken from the grid; the rule under the cell follows it.
  claimed: number;
  // Index in the row's cells, -1 for a filler.
  index: number;
  dropped?: DropReason;
};

export type PlannedRow = {
  // Emission order; dropped cells stay for the `.tex` round-trip.
  cells: PlannedCell[];
  // `strict`: fully covered and printing nothing, so not emitted — CALS needs a cell in every row.
  collapsed: boolean;
};

export type GridOptions = {
  // Reconcile the grid; off, the legacy arithmetic is kept as is.
  strict?: boolean;
  // Source line count, the `source` ceiling for a `\multirow`; defaults to the row count.
  lines?: number;
  // A line without cells skips held columns instead of filling them.
  skipHeldOnBareLine?: boolean;
};

// A span of one row or less is written as none.
const spanRows = (rows: number): number => (rows > 1 ? rows : 0);

// First column of a span ending at `at`.
const spanStart = (at: number, width: number): number => (width > 1 ? Math.max(0, at - width + 1) : at);

// A one-column cell taking no rows: a filler (index -1) or a dropped cell.
const singleCell = (col: number, index: number, dropped?: DropReason): PlannedCell => {
  const cell: PlannedCell = { col, covers: 1, colspan: 1, rowspan: 0, claimed: 0, index };
  if (dropped) {
    cell.dropped = dropped;
  }
  return cell;
};

/** Plans every row of one tabular from the analysed rows. */
export const buildTabularGrid = (
  cols: number,
  rows: AnalysedRow[],
  options: GridOptions = {},
): PlannedRow[] => {
  // Rows still covered per column, the anchor row included.
  const covering: number[] = new Array(cols).fill(0);
  // The span holding each column, so `strict` can shorten it.
  const spanAt: Array<PlannedCell | null> = new Array(cols).fill(null);
  const cover = (col: number, left: number, span: PlannedCell | null): void => {
    covering[col] = left;
    spanAt[col] = left > 0 ? span : null;
  };
  // One row of coverage consumed.
  const uncover = (col: number): void => {
    cover(col, covering[col] > 0 ? covering[col] - 1 : 0, spanAt[col]);
  };
  // Held at the start of the row. `strict` reads the span's last row as free; `source` does not.
  const held = (col: number): boolean => covering[col] > (options.strict ? 1 : 0);
  // `strict`: the span gives way to content it covers, on every column it holds.
  const release = (col: number): void => {
    const span: PlannedCell | null = spanAt[col];
    if (span) {
      span.rowspan = spanRows(span.rowspan - (covering[col] - 1));
    }
    for (let k = 0; k < cols; k++) {
      if (k === col || (span && spanAt[k] === span)) {
        cover(k, 0, null);
      }
    }
  };
  const planned: PlannedRow[] = [];
  rows.forEach(({cells, targets}, rowIndex) => {
    const row: PlannedRow = { cells: [], collapsed: false };
    // Past the last target the row has no cell.
    const targetOf = (j: number): number => (targets && j < targets.length ? targets[j] : cols);
    // How deep a `\multirow` may reach from this row.
    const ceiling: number = options.strict ? rows.length - rowIndex : (options.lines ?? rows.length);
    if (options.strict) {
      const prints: boolean = !!cells && cells.some((cell) => cell.prints);
      if (!prints && covering.every((_, c) => held(c))) {
        const shortenedSpans: Set<PlannedCell> = new Set();
        for (let c = 0; c < cols; c++) {
          const span: PlannedCell | null = spanAt[c];
          if (span && !shortenedSpans.has(span)) {
            shortenedSpans.add(span);
            span.rowspan = spanRows(span.rowspan - 1);
          }
          uncover(c);
        }
        row.collapsed = true;
        planned.push(row);
        return;
      }
      if (cells) {
        // Before placing anything, or a span released mid-walk leaves passed columns empty.
        for (let j = 0; j < cols && j < cells.length; j++) {
          const at: number = targetOf(j);
          if (at >= cols) {
            break;
          }
          if (!cells[j] || !cells[j].prints) {
            continue;
          }
          for (let c = spanStart(at, Math.min(cells[j].mc, cols)); c <= at; c++) {
            if (held(c)) {
              release(c);
            }
          }
        }
      }
    }
    // After any release: columns a filler must not take.
    const heldAtStart: boolean[] = covering.map((_, c) => held(c));
    // Fills columns `from` onwards with empty cells, held ones skipped when `skipHeld`.
    const pad = (from: number, skipHeld: boolean): void => {
      for (let c = from; c < cols; c++) {
        if (skipHeld) {
          uncover(c);
          if (heldAtStart[c]) {
            continue;
          }
        }
        row.cells.push(singleCell(c, -1));
      }
    };
    if (!cells) {
      pad(0, !!options.skipHeldOnBareLine || !!options.strict);
      planned.push(row);
      return;
    }
    for (let j = 0; j < cols; j++) {
      const at: number = targetOf(j);
      if (at >= cols) {
        break;
      }
      const cell: AnalysedCell | undefined = cells[j];
      if (!cell) {
        pad(at, true);
        break;
      }
      const mr: number = Math.min(cell.mr, ceiling);
      const asked: number = Math.min(cell.mc, cols);
      let mc: number = asked;
      if (mc > 1) {
        const from: number = spanStart(at, mc);
        // `source` tests the first column only; `strict` every column.
        let coveredHere: boolean = covering[from] > 0;
        for (let k = 1; options.strict && !coveredHere && k < mc; k++) {
          coveredHere = covering[from + k] > 0;
        }
        if (coveredHere) {
          for (let k = 0; k < asked; k++) {
            uncover(from + k);
          }
          if (options.strict) {
            // The free run ending at `at`: a held column inside would be booked twice.
            mc = 0;
            while (mc < asked && at - mc >= 0 && covering[at - mc] === 0) {
              mc += 1;
            }
          } else {
            // Shortened by each column still covered; the right edge stays.
            for (let k = 0; k < asked; k++) {
              if (covering[from + k] > 0) {
                mc -= 1;
              }
            }
          }
          if (mc < 1) {
            row.cells.push(singleCell(at, j, 'clipped'));
            continue;
          }
        } else {
          uncover(at);
        }
      } else {
        uncover(at);
        if (covering[at] > 0) {
          row.cells.push(singleCell(at, j, 'covered'));
          continue;
        }
      }
      // Legacy second decrement; a no-op unless the clip left the column covered.
      uncover(at);
      const col: number = spanStart(at, mc);
      const width: number = options.strict ? mc : asked;
      const depth: number = options.strict ? mr : cell.mr;
      const placed: PlannedCell = {
        col,
        covers: mc > 1 ? mc : 1,
        colspan: width > 1 ? width : 1,
        // `source` writes `rowspan="1"`, so a one-row span is kept here.
        rowspan: depth > 0 ? depth : 0,
        claimed: mr > 0 ? mr : 0,
        index: j,
      };
      if (mr > 0) {
        for (let k = 0; k < placed.covers; k++) {
          cover(col + k, mr, placed);
        }
      } else if (mc > 1) {
        // A narrowed span keeps its cell; the columns it lost were taken off above.
        for (let k = 0; k < mc; k++) {
          uncover(col + k);
        }
      } else if (!options.strict) {
        // Legacy third decrement.
        uncover(at);
      }
      if (!options.strict && mr < 1 && covering[col] > 0) {
        // Legacy: still covered, so dropped.
        row.cells.push(singleCell(at, j, 'covered'));
        continue;
      }
      row.cells.push(placed);
    }
    if (options.strict) {
      // Column order, dropped cells gone, every free column filled.
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
          c += placed.covers - 1;
          continue;
        }
        if (!heldAtStart[c]) {
          ordered.push(singleCell(c, -1));
        }
      }
      row.cells = ordered;
    }
    planned.push(row);
  });
  return planned;
};

"use strict";
// Structure of a tabular decided in one place: which cell lands in which column, how wide and how tall,
// and which cells the grid has no room for. Borders, alignment and content stay in the emitter.
//
// Rules the emitter has always applied: a `\multicolumn` running into columns a `\multirow` covers is
// clipped, a `\multirow` deeper than the rows left is clamped, a cell whose column is covered is
// dropped, a row with fewer cells than columns is padded. `strict` adds what the source cannot express:
// a span gives way to the content it covers, a row left without cells is not a row, a clip lands on
// free columns only, the last row of a span is free again, and every free column gets a cell.
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTabularGrid = void 0;
/** The structure of one tabular from the analysed rows. */
var buildTabularGrid = function (cols, rows, options) {
    if (options === void 0) { options = {}; }
    // An empty cell the plan adds to fill a column, and a cell the grid had no room for.
    var filler = function (col) { return ({ col: col, colspan: 1, rowspan: 0, claimed: 0, index: -1 }); };
    var dropCell = function (col, index, why) {
        return ({ col: col, colspan: 1, rowspan: 0, claimed: 0, index: index, dropped: why });
    };
    // Rows still covered per column; every cell landing on a column takes one row off.
    var covering = new Array(cols).fill(0);
    // The span holding each column, so `strict` can shorten the one it takes the column from.
    var spanAt = new Array(cols).fill(null);
    var cover = function (col, left, span) {
        covering[col] = left;
        spanAt[col] = left > 0 ? span : null;
    };
    // One row of coverage consumed: what a cell landing on the column costs it.
    var uncover = function (col) {
        cover(col, covering[col] > 0 ? covering[col] - 1 : 0, spanAt[col]);
    };
    // Held at the start of this row. `covering` counts the anchor row, so one row left means free here —
    // as a cell placed on the column already reads it, testing after the decrement. `source` keeps its
    // older reading, which counts that last row as held.
    var held = function (col) { return covering[col] > (options.strict ? 1 : 0); };
    // `strict`: the span gives way to the content it covers, dropping text being the worse trade, and
    // every column it covers goes with it — spans are rectangular.
    var release = function (col) {
        var span = spanAt[col];
        if (span) {
            var shortened = span.rowspan - (covering[col] - 1);
            span.rowspan = shortened > 1 ? shortened : 0;
        }
        for (var k = 0; k < cols; k++) {
            if (k === col || (span && spanAt[k] === span)) {
                cover(k, 0, null);
            }
        }
    };
    var planned = [];
    rows.forEach(function (_a) {
        var cells = _a.cells, targets = _a.targets, rowsLeft = _a.rowsLeft;
        var row = { cells: [], collapsed: false };
        var targetCols = targets || [];
        var prints = !!cells && cells.some(function (cell) { return cell.prints; });
        if (options.strict) {
            var allHeld = true;
            for (var c = 0; c < cols && allHeld; c++) {
                allHeld = held(c);
            }
            if (!prints && allHeld) {
                var shortenedSpans = new Set();
                for (var k = 0; k < cols; k++) {
                    var span = spanAt[k];
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
                for (var j = 0; j < cols && j < cells.length; j++) {
                    var at = j < targetCols.length ? targetCols[j] : cols;
                    if (at >= cols) {
                        break;
                    }
                    if (!cells[j] || !cells[j].prints) {
                        continue;
                    }
                    var wide = cells[j].mc > cols ? cols : cells[j].mc;
                    for (var c = wide > 1 ? at - wide + 1 : at; c <= at; c++) {
                        if (c >= 0 && held(c)) {
                            release(c);
                        }
                    }
                }
            }
        }
        // After any release, before the walk moves anything: what a filler must not take.
        var heldAtStart = new Array(cols);
        for (var c = 0; c < cols; c++) {
            heldAtStart[c] = held(c);
        }
        if (!cells) {
            // A lone `\hline`: one empty cell per column, and `strict` and `pptx` skip the held ones.
            for (var c = 0; c < cols; c++) {
                if (options.pptx || options.strict) {
                    var holds = heldAtStart[c];
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
        for (var j = 0; j < cols; j++) {
            // Where this index lands, spans of its own row counted — a missing cell still counts for one.
            var at = j < targetCols.length ? targetCols[j] : cols;
            if (at >= cols) {
                break;
            }
            var cell = cells[j];
            if (!cell) {
                // Fewer cells than columns: the rest of the row is padded from here on.
                for (var c = at; c < cols; c++) {
                    var holds = heldAtStart[c];
                    uncover(c);
                    if (holds) {
                        continue;
                    }
                    row.cells.push(filler(c));
                }
                break;
            }
            var mr = cell.mr > rowsLeft ? rowsLeft : cell.mr;
            // A floor, not a reachable case: the column count comes from the widest row, spans counted.
            var mc = cell.mc > cols ? cols : cell.mc;
            // Whether the span ran into a held column, which is what narrowed it.
            var coveredHere = false;
            if (mc > 1) {
                // Never left of the table: unreachable from the parse, where the target already counts the span.
                var from = Math.max(0, at - mc + 1);
                for (var k = 0; k < mc; k++) {
                    if (covering[from + k] > 0) {
                        coveredHere = true;
                        break;
                    }
                }
                if (coveredHere) {
                    var reach = mc;
                    if (options.strict) {
                        // Only the free columns next to the one it ends on: a held column inside would be booked
                        // twice. `reach` keeps the run inside the requested span, clear of the cell before it.
                        for (var k = 0; k < reach; k++) {
                            uncover(from + k);
                        }
                        mc = 0;
                        while (mc < reach && at - mc >= 0 && covering[at - mc] === 0) {
                            mc += 1;
                        }
                    }
                    else {
                        // Shortened by every column that stays covered, keeping its right edge where the source
                        // put it: moving it, measured against 3.0.1, drops far more cells than it saves.
                        for (var k = 0; k < reach; k++) {
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
                }
                else {
                    uncover(at);
                }
            }
            else {
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
            var col = mc > 1 ? Math.max(0, at - mc + 1) : at;
            var placed = {
                col: col,
                colspan: mc > 1 ? mc : 1,
                // `rowspan="1"` covers nothing, but `source` writes it and the modes must agree on a sound grid.
                rowspan: mr > 0 ? mr : 0,
                claimed: mr > 0 ? mr : 0,
                index: cell.index,
            };
            if (mr > 0) {
                for (var k = 0; k < (mc > 1 ? mc : 1); k++) {
                    cover(col + k, mr, placed);
                }
            }
            else if (mc > 1) {
                for (var k = 0; k < mc; k++) {
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
            var byCol_1 = new Array(cols);
            row.cells.forEach(function (cell) {
                if (!cell.dropped) {
                    byCol_1[cell.col] = cell;
                }
            });
            var ordered = [];
            for (var c = 0; c < cols; c++) {
                var placed = byCol_1[c];
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
    return { cols: cols, rows: planned };
};
exports.buildTabularGrid = buildTabularGrid;
//# sourceMappingURL=grid-model.js.map
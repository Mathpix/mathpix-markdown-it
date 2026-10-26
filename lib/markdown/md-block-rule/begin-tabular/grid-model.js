"use strict";
// Structure of a tabular: which cell lands in which column, how wide and how tall, and which cells are
// dropped. Borders, alignment and content stay in the emitter.
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTabularGrid = void 0;
// A span of one row or less is written as none.
var spanRows = function (rows) { return (rows > 1 ? rows : 0); };
// First column of a span ending at `at`.
var spanStart = function (at, width) { return (width > 1 ? Math.max(0, at - width + 1) : at); };
// A one-column cell taking no rows: a filler (index -1) or a dropped cell.
var singleCell = function (col, index, dropped) {
    var cell = { col: col, covers: 1, colspan: 1, rowspan: 0, claimed: 0, index: index };
    if (dropped) {
        cell.dropped = dropped;
    }
    return cell;
};
/** Plans every row of one tabular from the analysed rows. */
var buildTabularGrid = function (cols, rows, options) {
    if (options === void 0) { options = {}; }
    // Rows still covered per column, the anchor row included.
    var covering = new Array(cols).fill(0);
    // The span holding each column, so `strict` can shorten it.
    var spanAt = new Array(cols).fill(null);
    var cover = function (col, left, span) {
        covering[col] = left;
        spanAt[col] = left > 0 ? span : null;
    };
    // One row of coverage consumed.
    var uncover = function (col) {
        cover(col, covering[col] > 0 ? covering[col] - 1 : 0, spanAt[col]);
    };
    // Held at the start of the row. `strict` reads the span's last row as free; `source` does not.
    var held = function (col) { return covering[col] > (options.strict ? 1 : 0); };
    // `strict`: the span gives way to content it covers, on every column it holds.
    var release = function (col) {
        var span = spanAt[col];
        if (span) {
            span.rowspan = spanRows(span.rowspan - (covering[col] - 1));
        }
        for (var k = 0; k < cols; k++) {
            if (k === col || (span && spanAt[k] === span)) {
                cover(k, 0, null);
            }
        }
    };
    var planned = [];
    rows.forEach(function (_a, rowIndex) {
        var _b;
        var cells = _a.cells, targets = _a.targets;
        var row = { cells: [], collapsed: false };
        // Past the last target the row has no cell.
        var targetOf = function (j) { return (targets && j < targets.length ? targets[j] : cols); };
        // How deep a `\multirow` may reach from this row.
        var ceiling = options.strict ? rows.length - rowIndex : ((_b = options.lines) !== null && _b !== void 0 ? _b : rows.length);
        if (options.strict) {
            var prints = !!cells && cells.some(function (cell) { return cell.prints; });
            if (!prints && covering.every(function (_, c) { return held(c); })) {
                var shortenedSpans = new Set();
                for (var c = 0; c < cols; c++) {
                    var span = spanAt[c];
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
                for (var j = 0; j < cols && j < cells.length; j++) {
                    var at = targetOf(j);
                    if (at >= cols) {
                        break;
                    }
                    if (!cells[j] || !cells[j].prints) {
                        continue;
                    }
                    for (var c = spanStart(at, Math.min(cells[j].mc, cols)); c <= at; c++) {
                        if (held(c)) {
                            release(c);
                        }
                    }
                }
            }
        }
        // After any release: columns a filler must not take.
        var heldAtStart = covering.map(function (_, c) { return held(c); });
        // Fills columns `from` onwards with empty cells, held ones skipped when `skipHeld`.
        var pad = function (from, skipHeld) {
            for (var c = from; c < cols; c++) {
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
        for (var j = 0; j < cols; j++) {
            var at = targetOf(j);
            if (at >= cols) {
                break;
            }
            var cell = cells[j];
            if (!cell) {
                pad(at, true);
                break;
            }
            var mr = Math.min(cell.mr, ceiling);
            var asked = Math.min(cell.mc, cols);
            var mc = asked;
            if (mc > 1) {
                var from = spanStart(at, mc);
                // `source` tests the first column only; `strict` every column.
                var coveredHere = covering[from] > 0;
                for (var k = 1; options.strict && !coveredHere && k < mc; k++) {
                    coveredHere = covering[from + k] > 0;
                }
                if (coveredHere) {
                    for (var k = 0; k < asked; k++) {
                        uncover(from + k);
                    }
                    if (options.strict) {
                        // The free run ending at `at`: a held column inside would be booked twice.
                        mc = 0;
                        while (mc < asked && at - mc >= 0 && covering[at - mc] === 0) {
                            mc += 1;
                        }
                    }
                    else {
                        // Shortened by each column still covered; the right edge stays.
                        for (var k = 0; k < asked; k++) {
                            if (covering[from + k] > 0) {
                                mc -= 1;
                            }
                        }
                    }
                    if (mc < 1) {
                        row.cells.push(singleCell(at, j, 'clipped'));
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
                    row.cells.push(singleCell(at, j, 'covered'));
                    continue;
                }
            }
            // Legacy second decrement; a no-op unless the clip left the column covered.
            uncover(at);
            var col = spanStart(at, mc);
            var width = options.strict ? mc : asked;
            var depth = options.strict ? mr : cell.mr;
            var placed = {
                col: col,
                covers: mc > 1 ? mc : 1,
                colspan: width > 1 ? width : 1,
                // `source` writes `rowspan="1"`, so a one-row span is kept here.
                rowspan: depth > 0 ? depth : 0,
                claimed: mr > 0 ? mr : 0,
                index: j,
            };
            if (mr > 0) {
                for (var k = 0; k < placed.covers; k++) {
                    cover(col + k, mr, placed);
                }
            }
            else if (mc > 1) {
                // A narrowed span keeps its cell; the columns it lost were taken off above.
                for (var k = 0; k < mc; k++) {
                    uncover(col + k);
                }
            }
            else if (!options.strict) {
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
exports.buildTabularGrid = buildTabularGrid;
//# sourceMappingURL=grid-model.js.map
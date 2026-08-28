"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTabular = exports.separateByColumns = void 0;
var tslib_1 = require("tslib");
var tabular_td_1 = require("./tabular-td");
var common_1 = require("./common");
var sub_math_1 = require("./sub-math");
var sub_tabular_1 = require("./sub-tabular");
var multi_column_row_1 = require("./multi-column-row");
var sub_cell_1 = require("./sub-cell");
var utils_1 = require("../../utils");
var grid_model_1 = require("./grid-model");
var consts_1 = require("../../common/consts");
// Column spec letters that carry explicit vertical alignment.
var EXPLICIT_V_COL_SPEC = 'mpb';
// Frozen: shared by all td_open in a tabular — extend via spread, not in-place.
var TD_META_BY_BRACKET = {
    t: Object.freeze({ parentBracket: 't' }),
    c: Object.freeze({ parentBracket: 'c' }),
    b: Object.freeze({ parentBracket: 'b' }),
};
/**
 * Splits a tabular row into columns by unescaped '&' characters.
 * Escaped '\&' is treated as a literal '&' and does not split columns.
 */
var separateByColumns = function (str) {
    // Fast path: no column separators at all
    if (str.indexOf('&') === -1) {
        return [str];
    }
    var columns = [];
    var index = 0;
    for (var i = 0; i < str.length; i++) {
        var pos = str.indexOf('&', i);
        // No more separators found
        if (pos === -1) {
            break;
        }
        // Skip escaped '&' (e.g. '\&')
        if ((0, utils_1.isEscapedAt)(str, pos)) {
            i = pos;
            continue;
        }
        // Unescaped '&' splits the column
        columns.push(str.slice(index, pos));
        index = pos + 1;
        i = pos;
    }
    // Always push the remaining tail (may be empty if string ends with '&')
    columns.push(str.slice(index));
    return columns;
};
exports.separateByColumns = separateByColumns;
var getNumCol = function (cells) {
    var res = 0;
    for (var i = 0; i < cells.length; i++) {
        var columns = (0, exports.separateByColumns)(cells[i]);
        var col = columns.length;
        for (var j = 0; j < columns.length; j++) {
            col += (0, multi_column_row_1.getMC)(columns[j]);
        }
        res = col > res ? col : res;
    }
    return res;
};
var getRows = function (str) {
    str = (0, sub_math_1.getSubMath)(str);
    str = (0, sub_cell_1.getSubDiagbox)(str);
    return str.split('\\\\');
};
/**
 * Marks a table column as requiring fixed width if the cell content
 * contains an inline list environment.
 */
var markColIfHasList = function (colsToFixWidth, colIndex, content) {
    if (!content) {
        return;
    }
    if (!(0, common_1.detectLocalBlock)(content)) {
        return;
    }
    colsToFixWidth.add(colIndex);
};
/** Every row parsed before anything is placed: a span reaches rows a row-at-a-time walk has not seen.
 *  A cell is parsed once and only where the emitter used to reach it, so nested tabular ids keep their
 *  order. */
var parseTabularRows = function (rows, cellsAll, numCol, spec, flags) {
    var _a, _b;
    var cLines = spec.cLines, cAlign = spec.cAlign, bracket = spec.bracket;
    var parsedRows = [];
    for (var i = 0; i < rows.length; i++) {
        if (!cellsAll[i] || cellsAll[i].length === 0) {
            // A trailing line without cells is not a row.
            if (i < cellsAll.length - 1) {
                parsedRows.push({ line: i, raw: [], multi: [], cells: null, targets: null, rowsLeft: 0 });
            }
            continue;
        }
        var raw = (0, exports.separateByColumns)(cellsAll[i]);
        // One past the last cell is where padding starts, and nothing reads further: `getCurrentMC` walks
        // the row's cells for every index it is asked about.
        var targets = [];
        for (var j = 0; j < numCol && j <= raw.length; j++) {
            targets[j] = (0, multi_column_row_1.getCurrentMC)(raw, j);
        }
        var multi = [];
        var cells = [];
        for (var j = 0; j < numCol; j++) {
            var col = targets[j];
            if (col >= numCol || j >= raw.length) {
                break;
            }
            if (!raw[j] || !raw[j].trim().length) {
                cells[j] = { mc: 0, mr: 0, prints: false, index: j };
                continue;
            }
            var rLines = col === numCol - 1 ? cLines[cLines.length - 1] : cLines[col + 1];
            var parsedCell = (0, multi_column_row_1.getMultiColumnMultiRow)(raw[j], { lLines: cLines[col], align: cAlign[col], rLines: rLines, bracketDefault: bracket }, flags.forLatex, flags.forPptx, flags.skipVisual);
            multi[j] = parsedCell;
            // `\multirow{2}{*}{}` is a placeholder for a row the serializer has nothing for: non-empty as
            // text, empty once parsed. A nested tabular leaves the content empty and fills `subTable`.
            var prints = parsedCell
                ? !!((_a = parsedCell.content) === null || _a === void 0 ? void 0 : _a.trim().length) || !!((_b = parsedCell.subTable) === null || _b === void 0 ? void 0 : _b.length)
                : true;
            cells[j] = { mc: parsedCell ? parsedCell.mc : 0, mr: parsedCell ? parsedCell.mr : 0, prints: prints, index: j };
        }
        parsedRows.push({ line: i, raw: raw, multi: multi, cells: cells, targets: targets, rowsLeft: 0 });
    }
    // Rows the emitter will produce at or after this one: a `\multirow` deeper than that reaches rows the
    // table does not have. A line carrying no cells of its own still becomes one.
    parsedRows.forEach(function (row, r) {
        row.rowsLeft = parsedRows.length - r;
    });
    return parsedRows;
};
var setTokensTabular = function (str, _a) {
    var _b, _c, _d, _e;
    var _f = _a === void 0 ? {} : _a, _g = _f.align, align = _g === void 0 ? '' : _g, _h = _f.options, options = _h === void 0 ? {} : _h, _j = _f.isSubTabular, isSubTabular = _j === void 0 ? false : _j, bracket = _f.bracket;
    var res = [];
    var rows = getRows(str);
    var cellsAll = (0, common_1.getCellsAll)(rows);
    var numCol = getNumCol(cellsAll);
    var data = (0, common_1.getRowLines)(rows, numCol);
    var CellsHLines = data.cLines;
    var CellsHLSpaces = data.cSpaces;
    var colsToFixWidth = new Set();
    var optionBracket = (0, common_1.normalizeDefaultCellVerticalAlign)(options === null || options === void 0 ? void 0 : options.defaultCellVerticalAlign);
    // For HTML rendering: source bracket OR option (incl. 'c').
    var effectiveBracket = bracket !== null && bracket !== void 0 ? bracket : optionBracket;
    var dataAlign = (0, common_1.getVerticallyColumnAlign)(align, numCol, effectiveBracket);
    var cLines = (0, common_1.getColumnLines)(align, numCol);
    var cAlign = dataAlign.cAlign, vAlign = dataAlign.vAlign, cWidth = dataAlign.cWidth, colSpec = dataAlign.colSpec;
    var decimal = (0, common_1.getDecimal)(cAlign, cellsAll);
    var _k = options.forLatex, forLatex = _k === void 0 ? false : _k, _l = options.outMath, outMath = _l === void 0 ? {} : _l;
    var skipVisual = !!(options === null || options === void 0 ? void 0 : options.forMD) || !!forLatex;
    // Option fallback only at top level — nested keeps source bracket (round-trip).
    var latexBracket = bracket !== null && bracket !== void 0 ? bracket : (isSubTabular ? undefined : (optionBracket === 'c' ? undefined : optionBracket));
    // Parent bracket attached to every td_open under forLatex.
    var tdMeta = forLatex && latexBracket ? TD_META_BY_BRACKET[latexBracket] : undefined;
    res.push({ token: 'table_open', type: 'table_open', tag: 'table', n: 1,
        attrs: (0, tabular_td_1.getSharedTableOpenAttrs)(undefined, skipVisual),
        latex: forLatex
            ? align
            : outMath.include_table_markdown
                ? cAlign.join('|')
                : ''
    });
    var tableOpen = res[0];
    if (options === null || options === void 0 ? void 0 : options.forPptx) {
        res.push({ token: 'tbody_open', type: 'tbody_open', tag: 'tbody', n: 1, attrs: (0, tabular_td_1.getSharedTbodyOpenAttrs)(numCol) });
    }
    else {
        res.push({ token: 'tbody_open', type: 'tbody_open', tag: 'tbody', n: 1 });
    }
    var parsedRows = parseTabularRows(rows, cellsAll, numCol, { cLines: cLines, cAlign: cAlign, bracket: latexBracket }, { forLatex: forLatex, forPptx: !!(options === null || options === void 0 ? void 0 : options.forPptx), skipVisual: skipVisual });
    // `strict` reconciles the grid, which rewrites the source; a `.tex` round-trip must not.
    var grid = (0, grid_model_1.buildTabularGrid)(numCol, parsedRows, { strict: (options === null || options === void 0 ? void 0 : options.tabularGridMode) === 'strict' && !forLatex, pptx: !!(options === null || options === void 0 ? void 0 : options.forPptx) });
    // `forPptx` writes no span of one, so a span the plan brought down to one loses the attribute there.
    var keeps = function (span) { return span > 1 || (span === 1 && !(options === null || options === void 0 ? void 0 : options.forPptx)); };
    var _loop_1 = function (r) {
        var e_1, _m;
        var plan = grid.rows[r];
        if (plan.collapsed) {
            return "continue";
        }
        var row = parsedRows[r];
        var line = row.line;
        res.push({ token: 'tr_open', type: 'tr_open', tag: 'tr', n: 1,
            attrs: (0, tabular_td_1.getSharedTrOpenAttrs)(skipVisual),
            latex: forLatex && data && data.sLines && data.sLines.length > line ? data.sLines[line] : ''
        });
        var _loop_2 = function (cell) {
            var e_2, _q, e_3, _r, e_4, _s, e_5, _t;
            var multi = cell.index >= 0 ? ((_b = row.multi[cell.index]) !== null && _b !== void 0 ? _b : null) : null;
            if (cell.dropped) {
                // A `.tex` round-trip writes the source back for a cell the grid had no room for.
                if (forLatex && (cell.dropped === 'covered' || (multi && multi.latex))) {
                    res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1,
                        latex: multi && multi.latex ? multi.latex : '' });
                }
                return "continue";
            }
            // A `\multirow` is styled by the last column of its span, every other cell by its own.
            var styleCol = cell.claimed > 0 && cell.colspan > 1 ? cell.col + cell.colspan - 1 : cell.col;
            var cRight = styleCol === numCol - 1 ? cLines[cLines.length - 1] : cLines[styleCol + 1];
            var cLeft = styleCol === 0 ? cLines[0] : '';
            if (multi) {
                // The attributes were built from the source, before the grid was known.
                var csIndex = multi.attrs.findIndex(function (a) { return a[0] === 'colspan'; });
                if (csIndex >= 0) {
                    if (keeps(cell.colspan)) {
                        multi.attrs[csIndex][1] = cell.colspan.toString();
                    }
                    else {
                        multi.attrs.splice(csIndex, 1);
                    }
                }
                var rsIndex = multi.attrs.findIndex(function (a) { return a[0] === 'rowspan'; });
                if (rsIndex >= 0) {
                    if (cell.rowspan > 0 && keeps(cell.rowspan)) {
                        multi.attrs[rsIndex][1] = cell.rowspan.toString();
                    }
                    else {
                        multi.attrs.splice(rsIndex, 1);
                    }
                }
                // The rule under the cell sits at the row the span claimed, not at the one `strict` left it: the
                // row above was already drawn against that geometry.
                var under = cell.claimed > 0 ? cell.claimed + line : line + 1;
                if (cell.claimed > 0 && under >= rows.length - 1 && !skipVisual) {
                    multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[under] ? CellsHLines[under][styleCol] : 'none');
                }
                if (!skipVisual) {
                    if (line === 0) {
                        multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[line] ? CellsHLines[line][styleCol] : 'none', 'top');
                    }
                    multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[under] ? CellsHLines[under][styleCol] : 'none');
                }
                var tdOpen = {
                    token: 'td_open',
                    type: 'td_open',
                    tag: 'td',
                    n: 1,
                    attrs: multi.attrs,
                    latex: forLatex && multi.latex ? multi.latex : ''
                };
                res.push(tdOpen);
                if (forLatex) {
                    tdOpen.meta = tslib_1.__assign(tslib_1.__assign({}, tdMeta), { multi: multi.multi, colCount: numCol, colSpecs: colSpec, currentColIndex: styleCol, isSubTabular: isSubTabular });
                }
                if (multi.subTable) {
                    if (multi.subTable.some(function (item) { return (0, common_1.detectLocalBlock)(item.content); })) {
                        colsToFixWidth.add(styleCol);
                        if (forLatex) {
                            tdOpen.meta.forceMultiFixedWidth = true;
                        }
                    }
                    try {
                        for (var _u = (e_2 = void 0, tslib_1.__values(multi.subTable)), _v = _u.next(); !_v.done; _v = _u.next()) {
                            var t = _v.value;
                            res.push(t);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_v && !_v.done && (_q = _u.return)) _q.call(_u);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                else {
                    if (multi.content) {
                        if ((0, common_1.detectLocalBlock)(multi.content)) {
                            colsToFixWidth.add(styleCol);
                            if (forLatex) {
                                tdOpen.meta.forceMultiFixedWidth = true;
                            }
                        }
                        res.push({ token: 'inline', type: 'inline', tag: '', n: 0, content: multi.content });
                    }
                }
                res.push(tabular_td_1.SHARED_TD_CLOSE);
                return "continue";
            }
            var cellText = cell.index >= 0 ? row.raw[cell.index] : '';
            if (cellText && cellText.trim().length > 0) {
                var parseMath = (0, sub_math_1.getMathTableContent)(cellText, 0);
                var content = parseMath || (0, common_1.getContent)(cellText);
                var handleSubTable = function (subTable, vOverride) {
                    if (!colsToFixWidth.has(styleCol)
                        && subTable.some(function (item) { return (0, common_1.detectLocalBlock)(item.content); })) {
                        colsToFixWidth.add(styleCol);
                    }
                    return (0, tabular_td_1.AddTdSubTable)(subTable, { h: cAlign[styleCol], v: vOverride, w: cWidth[styleCol] }, {
                        left: cLeft,
                        right: cRight,
                        bottom: CellsHLines[line + 1] ? CellsHLines[line + 1][styleCol] : 'none',
                        top: line === 0 ? (CellsHLines[line] ? CellsHLines[line][styleCol] : 'none') : ''
                    }, skipVisual, tdMeta);
                };
                var parseSub = (0, sub_tabular_1.getSubTabular)(content, 0, true, forLatex);
                if (parseSub && parseSub.length > 0) {
                    var cellV = vAlign[styleCol];
                    // Diagbox always centers, ignoring outer bracket.
                    // getSubTabular returns a single wrapper; hasDiagbox is OR'd across all placeholders.
                    if ((_c = parseSub[0]) === null || _c === void 0 ? void 0 : _c.hasDiagbox) {
                        cellV = 'middle';
                        // colSpec may be 'p{2cm}'.
                    }
                    else if (!EXPLICIT_V_COL_SPEC.includes(((_d = colSpec[styleCol]) === null || _d === void 0 ? void 0 : _d[0]) || '')) {
                        // First nested tabular wins if a cell contains several.
                        var placeholder = (_e = content.match(consts_1.doubleAngleBracketUuidPattern)) === null || _e === void 0 ? void 0 : _e[0];
                        var cellBracket = placeholder ? (0, sub_tabular_1.getSubTabularBracket)(placeholder) : undefined;
                        if (cellBracket)
                            cellV = (0, common_1.bracketToVAlign)(cellBracket);
                    }
                    try {
                        for (var _w = (e_3 = void 0, tslib_1.__values(handleSubTable(parseSub, cellV))), _x = _w.next(); !_x.done; _x = _w.next()) {
                            var t = _x.value;
                            res.push(t);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_x && !_x.done && (_r = _w.return)) _r.call(_w);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    return "continue";
                }
                var td_1 = (0, tabular_td_1.AddTd)(content, { h: cAlign[styleCol], v: vAlign[styleCol], w: cWidth[styleCol] }, { left: cLeft, right: cRight, bottom: CellsHLines[line + 1] ? CellsHLines[line + 1][styleCol] : 'none',
                    top: line === 0 ? CellsHLines[line] ? CellsHLines[line][styleCol] : 'none' : '' }, CellsHLSpaces[line + 1][styleCol], decimal[styleCol], skipVisual, tdMeta);
                markColIfHasList(colsToFixWidth, styleCol, td_1.content);
                try {
                    for (var _y = (e_4 = void 0, tslib_1.__values(td_1.res)), _z = _y.next(); !_z.done; _z = _y.next()) {
                        var t = _z.value;
                        res.push(t);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_z && !_z.done && (_s = _y.return)) _s.call(_y);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return "continue";
            }
            // A cell with nothing in it, or a column the row has no cell for.
            var td = (0, tabular_td_1.AddTd)('', { h: cAlign[styleCol], v: vAlign[styleCol], w: cWidth[styleCol] }, { left: cLeft, right: cRight, bottom: CellsHLines[line + 1] ? CellsHLines[line + 1][styleCol] : 'none',
                top: line === 0 ? CellsHLines[line] ? CellsHLines[line][styleCol] : 'none' : '' }, CellsHLSpaces[line + 1][styleCol], null, skipVisual, tdMeta);
            markColIfHasList(colsToFixWidth, styleCol, td.content);
            try {
                for (var _0 = (e_5 = void 0, tslib_1.__values(td.res)), _1 = _0.next(); !_1.done; _1 = _0.next()) {
                    var t = _1.value;
                    res.push(t);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_1 && !_1.done && (_t = _0.return)) _t.call(_0);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        try {
            for (var _o = (e_1 = void 0, tslib_1.__values(plan.cells)), _p = _o.next(); !_p.done; _p = _o.next()) {
                var cell = _p.value;
                _loop_2(cell);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_p && !_p.done && (_m = _o.return)) _m.call(_o);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.push(tabular_td_1.SHARED_TR_CLOSE);
    };
    for (var r = 0; r < grid.rows.length; r++) {
        _loop_1(r);
    }
    if (forLatex) {
        res.push({ token: 'tbody_close', type: 'tbody_close', tag: 'tbody', n: -1,
            latex: data && data.sLines && data.sLines.length ? data.sLines[data.sLines.length - 1] : ''
        });
    }
    else {
        res.push(tabular_td_1.SHARED_TBODY_CLOSE);
    }
    res.push(tabular_td_1.SHARED_TABLE_CLOSE);
    if (forLatex) {
        var colsToFixWidthArr = Array.from(colsToFixWidth);
        tableOpen.meta = {
            colsToFixWidth: colsToFixWidthArr,
            colSpecs: colSpec,
            colCount: numCol,
            isSubTabular: isSubTabular,
            vLineSpec: cLines
        };
        if (latexBracket) {
            tableOpen.meta.bracket = latexBracket;
        }
        if (colsToFixWidthArr.length) {
            tableOpen.meta.shouldRewriteColSpec = (0, common_1.shouldRewriteColSpec)(colsToFixWidthArr, colSpec);
        }
    }
    return res;
};
var ParseTabular = function (str, i, align, options, isSubTabular, bracket) {
    if (align === void 0) { align = ''; }
    if (options === void 0) { options = {}; }
    if (isSubTabular === void 0) { isSubTabular = false; }
    var res = [];
    var posEnd = str.indexOf('\\end{tabular}');
    if (posEnd > 0) {
        var posBegin = str.slice(i, posEnd).lastIndexOf('\\begin{tabular}');
        if (posBegin >= 0) {
            var params = (0, common_1.getParams)(str, posBegin + '\\begin{tabular}'.length);
            if (params) {
                var subT = str.slice(posBegin, posEnd + '\\end{tabular}'.length);
                str = (0, sub_tabular_1.pushSubTabular)(str, subT, [], posBegin, posEnd, i, 0, params.bracket);
                res = (0, exports.ParseTabular)(str, 0, align, options, isSubTabular, bracket);
            }
            else {
                var match = str
                    .slice(posBegin)
                    .match(consts_1.BEGIN_TABULAR_BRACKET_RE);
                var subT = str.slice(posBegin, posEnd + '\\end{tabular}'.length);
                str = (0, sub_tabular_1.pushSubTabular)(str, subT, [], posBegin + match.index, posEnd, i, 0, (0, common_1.parseTabularPos)(match === null || match === void 0 ? void 0 : match[1]));
                res = (0, exports.ParseTabular)(str, 0, align, options, isSubTabular, bracket);
            }
        }
        else {
            var subT = str.slice(i, posEnd);
            var subRes = setTokensTabular(subT, { align: align, options: options, isSubTabular: false, bracket: bracket });
            str = (0, sub_tabular_1.pushSubTabular)(str, subT, subRes, 0, posEnd);
            res = (0, exports.ParseTabular)(str, 0, align, options, isSubTabular, bracket);
        }
    }
    else {
        res = setTokensTabular(str, { align: align, options: options, isSubTabular: isSubTabular, bracket: bracket });
    }
    return res;
};
exports.ParseTabular = ParseTabular;
//# sourceMappingURL=parse-tabular.js.map
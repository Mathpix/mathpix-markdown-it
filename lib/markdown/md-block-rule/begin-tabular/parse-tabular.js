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
// Vertical rule to the right of column `col`.
var ruleRightOf = function (cLines, col, numCol) {
    return col === numCol - 1 ? cLines[cLines.length - 1] : cLines[col + 1];
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
                parsedRows.push({ line: i, raw: [], multi: [], cells: null, targets: null });
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
                cells[j] = { mc: 0, mr: 0, prints: false };
                continue;
            }
            var parsedCell = (0, multi_column_row_1.getMultiColumnMultiRow)(raw[j], { lLines: cLines[col], align: cAlign[col], rLines: ruleRightOf(cLines, col, numCol), bracketDefault: bracket }, flags.forLatex, flags.forPptx, flags.skipVisual);
            multi[j] = parsedCell;
            // `\multirow{2}{*}{}` is a placeholder for a row the serializer has nothing for: non-empty as
            // text, empty once parsed. A nested tabular leaves the content empty and fills `subTable`.
            var prints = parsedCell
                ? !!((_a = parsedCell.content) === null || _a === void 0 ? void 0 : _a.trim().length) || !!((_b = parsedCell.subTable) === null || _b === void 0 ? void 0 : _b.length)
                : true;
            cells[j] = { mc: parsedCell ? parsedCell.mc : 0, mr: parsedCell ? parsedCell.mr : 0, prints: prints };
        }
        parsedRows.push({ line: i, raw: raw, multi: multi, cells: cells, targets: targets });
    }
    return parsedRows;
};
var setTokensTabular = function (str, _a) {
    var e_1, _b, e_2, _c, e_3, _d, e_4, _e;
    var _f, _g, _h, _j;
    var _k = _a === void 0 ? {} : _a, _l = _k.align, align = _l === void 0 ? '' : _l, _m = _k.options, options = _m === void 0 ? {} : _m, _o = _k.isSubTabular, isSubTabular = _o === void 0 ? false : _o, bracket = _k.bracket;
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
    var _p = options.forLatex, forLatex = _p === void 0 ? false : _p, _q = options.outMath, outMath = _q === void 0 ? {} : _q;
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
    var plannedRows = (0, grid_model_1.buildTabularGrid)(numCol, parsedRows, {
        strict: (options === null || options === void 0 ? void 0 : options.tabularGridMode) === 'strict' && !forLatex,
        lines: rows.length,
        skipHeldOnBareLine: !!(options === null || options === void 0 ? void 0 : options.forPptx),
    });
    // `forPptx` writes no span of one.
    var writesSpan = function (span) { return span > 1 || (span === 1 && !(options === null || options === void 0 ? void 0 : options.forPptx)); };
    // Puts the planned span over the one parsed from the source, or removes it.
    var setSpanAttr = function (attrs, name, span) {
        var at = attrs.findIndex(function (attr) { return attr[0] === name; });
        if (at < 0) {
            return;
        }
        if (writesSpan(span)) {
            attrs[at][1] = span.toString();
        }
        else {
            attrs.splice(at, 1);
        }
    };
    // The rule above `line` in column `col`.
    var hLine = function (line, col) { return CellsHLines[line] ? CellsHLines[line][col] : 'none'; };
    for (var r = 0; r < plannedRows.length; r++) {
        var plan = plannedRows[r];
        if (plan.collapsed) {
            continue;
        }
        var row = parsedRows[r];
        var line = row.line;
        res.push({ token: 'tr_open', type: 'tr_open', tag: 'tr', n: 1,
            attrs: (0, tabular_td_1.getSharedTrOpenAttrs)(skipVisual),
            latex: forLatex && data && data.sLines && data.sLines.length > line ? data.sLines[line] : ''
        });
        try {
            for (var _r = (e_1 = void 0, tslib_1.__values(plan.cells)), _s = _r.next(); !_s.done; _s = _r.next()) {
                var cell = _s.value;
                var multi = cell.index >= 0 ? ((_f = row.multi[cell.index]) !== null && _f !== void 0 ? _f : null) : null;
                if (cell.dropped) {
                    // A `.tex` round-trip gets the command back, not the body: the writer reads a cell's body from
                    // the token after `td_skip`, and putting one there swallows the `&` it writes between cells.
                    if (forLatex && (cell.dropped === 'covered' || (multi && multi.latex))) {
                        res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1,
                            latex: multi && multi.latex ? multi.latex : '' });
                    }
                    continue;
                }
                // A `\multirow` is styled by the last column of its span, every other cell by its own.
                var styleCol = cell.claimed > 0 && cell.covers > 1 ? cell.col + cell.covers - 1 : cell.col;
                if (multi) {
                    // The attributes were built from the source, before the grid was known.
                    setSpanAttr(multi.attrs, 'colspan', cell.colspan);
                    setSpanAttr(multi.attrs, 'rowspan', cell.rowspan);
                    if (!skipVisual) {
                        // The rule under the cell sits where the span claimed to end, not where `strict` left it.
                        var under = cell.claimed > 0 ? cell.claimed + line : line + 1;
                        // Legacy: a span reaching the last rows gets its bottom rule twice; kept for identical output.
                        if (cell.claimed > 0 && under >= rows.length - 1) {
                            multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, hLine(under, styleCol));
                        }
                        if (line === 0) {
                            multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, hLine(line, styleCol), 'top');
                        }
                        multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, hLine(under, styleCol));
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
                    // A list inside fixes the column width.
                    var hasLocalBlock = multi.subTable
                        ? multi.subTable.some(function (item) { return (0, common_1.detectLocalBlock)(item.content); })
                        : !!multi.content && (0, common_1.detectLocalBlock)(multi.content);
                    if (hasLocalBlock) {
                        colsToFixWidth.add(styleCol);
                        if (forLatex) {
                            tdOpen.meta.forceMultiFixedWidth = true;
                        }
                    }
                    if (multi.subTable) {
                        try {
                            for (var _t = (e_2 = void 0, tslib_1.__values(multi.subTable)), _u = _t.next(); !_u.done; _u = _t.next()) {
                                var t = _u.value;
                                res.push(t);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_u && !_u.done && (_c = _t.return)) _c.call(_t);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    else if (multi.content) {
                        res.push({ token: 'inline', type: 'inline', tag: '', n: 0, content: multi.content });
                    }
                    res.push(tabular_td_1.SHARED_TD_CLOSE);
                    continue;
                }
                var aligns = { h: cAlign[styleCol], v: vAlign[styleCol], w: cWidth[styleCol] };
                var borders = { left: styleCol === 0 ? cLines[0] : '', right: ruleRightOf(cLines, styleCol, numCol),
                    bottom: hLine(line + 1, styleCol), top: line === 0 ? hLine(line, styleCol) : '' };
                var cellText = cell.index >= 0 ? row.raw[cell.index] : '';
                var hasText = !!cellText && cellText.trim().length > 0;
                var content = hasText ? (0, sub_math_1.getMathTableContent)(cellText, 0) || (0, common_1.getContent)(cellText) : '';
                if (hasText) {
                    var parseSub = (0, sub_tabular_1.getSubTabular)(content, 0, true, forLatex);
                    if (parseSub && parseSub.length > 0) {
                        var cellV = vAlign[styleCol];
                        // Diagbox always centers, ignoring outer bracket.
                        // getSubTabular returns a single wrapper; hasDiagbox is OR'd across all placeholders.
                        if ((_g = parseSub[0]) === null || _g === void 0 ? void 0 : _g.hasDiagbox) {
                            cellV = 'middle';
                            // colSpec may be 'p{2cm}'.
                        }
                        else if (!EXPLICIT_V_COL_SPEC.includes(((_h = colSpec[styleCol]) === null || _h === void 0 ? void 0 : _h[0]) || '')) {
                            // First nested tabular wins if a cell contains several.
                            var placeholder = (_j = content.match(consts_1.doubleAngleBracketUuidPattern)) === null || _j === void 0 ? void 0 : _j[0];
                            var cellBracket = placeholder ? (0, sub_tabular_1.getSubTabularBracket)(placeholder) : undefined;
                            if (cellBracket)
                                cellV = (0, common_1.bracketToVAlign)(cellBracket);
                        }
                        if (parseSub.some(function (item) { return (0, common_1.detectLocalBlock)(item.content); })) {
                            colsToFixWidth.add(styleCol);
                        }
                        try {
                            for (var _v = (e_3 = void 0, tslib_1.__values((0, tabular_td_1.AddTdSubTable)(parseSub, tslib_1.__assign(tslib_1.__assign({}, aligns), { v: cellV }), borders, skipVisual, tdMeta))), _w = _v.next(); !_w.done; _w = _v.next()) {
                                var t = _w.value;
                                res.push(t);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_w && !_w.done && (_d = _v.return)) _d.call(_v);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        continue;
                    }
                }
                // Plain text, or empty for a blank cell or a column the row has no cell for.
                var addedTd = (0, tabular_td_1.AddTd)(content, aligns, borders, CellsHLSpaces[line + 1][styleCol], hasText ? decimal[styleCol] : null, skipVisual, tdMeta);
                markColIfHasList(colsToFixWidth, styleCol, addedTd.content);
                try {
                    for (var _x = (e_4 = void 0, tslib_1.__values(addedTd.res)), _y = _x.next(); !_y.done; _y = _x.next()) {
                        var t = _y.value;
                        res.push(t);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_y && !_y.done && (_e = _x.return)) _e.call(_x);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_s && !_s.done && (_b = _r.return)) _b.call(_r);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.push(tabular_td_1.SHARED_TR_CLOSE);
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
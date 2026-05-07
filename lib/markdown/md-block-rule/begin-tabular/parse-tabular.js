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
var setTokensTabular = function (str, _a) {
    var _b, _c, _d;
    var _e = _a === void 0 ? {} : _a, _f = _e.align, align = _f === void 0 ? '' : _f, _g = _e.options, options = _g === void 0 ? {} : _g, _h = _e.isSubTabular, isSubTabular = _h === void 0 ? false : _h, bracket = _e.bracket;
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
    var _j = options.forLatex, forLatex = _j === void 0 ? false : _j, _k = options.outMath, outMath = _k === void 0 ? {} : _k;
    var skipVisual = !!(options === null || options === void 0 ? void 0 : options.forMD) || !!forLatex;
    // For forLatex round-trip: source bracket OR option ('t'/'b' only — 'c' skipped to preserve round-trip).
    var latexBracket = bracket !== null && bracket !== void 0 ? bracket : (optionBracket === 'c' ? undefined : optionBracket);
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
    var MR = new Array(numCol).fill(0);
    var _loop_1 = function (i) {
        var e_1, _l;
        if (!cellsAll[i] || cellsAll[i].length === 0) {
            if (i < cellsAll.length - 1) {
                res.push({ token: 'tr_open', type: 'tr_open', tag: 'tr', n: 1,
                    attrs: (0, tabular_td_1.getSharedTrOpenAttrs)(skipVisual),
                    latex: forLatex && data && data.sLines && data.sLines.length > i ? data.sLines[i] : ''
                });
                for (var k = 0; k < numCol; k++) {
                    if ((options === null || options === void 0 ? void 0 : options.forPptx) && MR[k] && MR[k] > 0) {
                        MR[k] = MR[k] > 0 ? MR[k] - 1 : 0;
                        continue;
                    }
                    var cRight = k === numCol - 1 ? cLines[cLines.length - 1] : cLines[k + 1];
                    var cLeft = k === 0 ? cLines[0] : '';
                    var data_1 = (0, tabular_td_1.AddTd)('', { h: cAlign[k], v: vAlign[k], w: cWidth[k] }, { left: cLeft, right: cRight, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][k] : 'none',
                        top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : '' }, CellsHLSpaces[i + 1][k], null, skipVisual, tdMeta);
                    markColIfHasList(colsToFixWidth, k, data_1.content);
                    try {
                        for (var _m = (e_1 = void 0, tslib_1.__values(data_1.res)), _o = _m.next(); !_o.done; _o = _m.next()) {
                            var t = _o.value;
                            res.push(t);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_o && !_o.done && (_l = _m.return)) _l.call(_m);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                res.push(tabular_td_1.SHARED_TR_CLOSE);
            }
            return "continue";
        }
        res.push({ token: 'tr_open', type: 'tr_open', tag: 'tr', n: 1,
            attrs: (0, tabular_td_1.getSharedTrOpenAttrs)(skipVisual),
            latex: forLatex && data && data.sLines && data.sLines.length > i ? data.sLines[i] : ''
        });
        var cells = (0, exports.separateByColumns)(cellsAll[i]);
        var _loop_2 = function (j) {
            var e_2, _p, e_3, _q, e_4, _r, e_5, _s, e_6, _t;
            var ic = (0, multi_column_row_1.getCurrentMC)(cells, j);
            if (ic >= numCol) {
                return "break";
            }
            if (j >= (cells.length) && ic < numCol) {
                for (var k = ic; k < numCol; k++) {
                    if (MR[k] && MR[k] > 0) {
                        MR[k] = MR[k] > 0 ? MR[k] - 1 : 0;
                        continue;
                    }
                    var cRight_1 = k === numCol - 1 ? cLines[cLines.length - 1] : cLines[k + 1];
                    var cLeft_1 = k === 0 ? cLines[0] : '';
                    var data_2 = (0, tabular_td_1.AddTd)('', { h: cAlign[k], v: vAlign[k], w: cWidth[k] }, { left: cLeft_1, right: cRight_1, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][k] : 'none',
                        top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : '' }, CellsHLSpaces[i + 1][k], null, skipVisual, tdMeta);
                    markColIfHasList(colsToFixWidth, k, data_2.content);
                    try {
                        for (var _u = (e_2 = void 0, tslib_1.__values(data_2.res)), _v = _u.next(); !_v.done; _v = _u.next()) {
                            var t = _v.value;
                            res.push(t);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_v && !_v.done && (_p = _u.return)) _p.call(_u);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                return "break";
            }
            var cRight = ic === numCol - 1 ? cLines[cLines.length - 1] : cLines[ic + 1];
            var cLeft = ic === 0 ? cLines[0] : '';
            if (cells[j] && cells[j].trim().length > 0) {
                // Multicol inherits only non-default brackets (option 'middle' stays no-op).
                var multi = (0, multi_column_row_1.getMultiColumnMultiRow)(cells[j], { lLines: cLines[ic], align: cAlign[ic], rLines: cRight, bracketDefault: latexBracket }, forLatex, options === null || options === void 0 ? void 0 : options.forPptx, skipVisual);
                if (multi) {
                    var mr = multi.mr > rows.length ? rows.length : multi.mr;
                    var mc = multi.mc > numCol ? numCol : multi.mc;
                    if (mc && mc > 1) {
                        var d = ic - mc + 1;
                        if (MR[d] && MR[d] > 0) {
                            var maxK = mc;
                            for (var k = 0; k < maxK; k++) {
                                MR[d + k] = MR[d + k] > 0 ? MR[d + k] - 1 : 0;
                                if (MR[d + k] > 0) {
                                    mc -= 1;
                                }
                            }
                            if (mc < 1) {
                                if (forLatex && multi.latex) {
                                    res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1,
                                        latex: multi.latex });
                                }
                                return "continue";
                            }
                        }
                        else {
                            MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
                        }
                    }
                    else {
                        MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
                        if (MR[ic] && MR[ic] > 0) {
                            if (forLatex) {
                                res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1,
                                    latex: multi && multi.latex ? multi.latex : '' });
                            }
                            return "continue";
                        }
                    }
                    MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
                    if (mr && mr > 0) {
                        if (mc && mc > 1) {
                            var d = ic - mc + 1;
                            for (var k = 0; k < mc; k++) {
                                MR[d + k] = mr;
                            }
                        }
                        else {
                            MR[ic] = mr;
                        }
                        if (mr + i >= rows.length - 1 && !skipVisual) {
                            multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[mr + i] ? CellsHLines[mr + i][ic] : 'none');
                        }
                    }
                    else {
                        if (mc && mc > 1) {
                            var d = ic - mc + 1;
                            for (var k = 0; k < mc; k++) {
                                MR[d + k] = MR[d + k] > 0 ? MR[d + k] - 1 : 0;
                            }
                            ic = d;
                        }
                        else {
                            MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
                        }
                        if (MR[ic] && MR[ic] > 0) {
                            if (forLatex) {
                                res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1,
                                    latex: multi && multi.latex ? multi.latex : '' });
                            }
                            return "continue";
                        }
                    }
                    if (!skipVisual) {
                        if (i === 0) {
                            multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[i] ? CellsHLines[i][ic] : 'none', 'top');
                        }
                        if (mr && mr > 0) {
                            multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[mr + i] ? CellsHLines[mr + i][ic] : 'none');
                        }
                        else {
                            multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none');
                        }
                    }
                    var tdOpen = {
                        token: 'td_open',
                        type: 'td_open',
                        tag: 'td',
                        n: 1,
                        attrs: multi.attrs,
                        latex: forLatex && multi && multi.latex ? multi.latex : ''
                    };
                    res.push(tdOpen);
                    if (forLatex) {
                        tdOpen.meta = tslib_1.__assign(tslib_1.__assign({}, tdMeta), { multi: multi.multi, colCount: numCol, colSpecs: colSpec, currentColIndex: ic, isSubTabular: isSubTabular });
                    }
                    if (multi.subTable) {
                        if (multi.subTable.some(function (item) { return (0, common_1.detectLocalBlock)(item.content); })) {
                            colsToFixWidth.add(ic);
                            if (forLatex) {
                                tdOpen.meta.forceMultiFixedWidth = true;
                            }
                        }
                        try {
                            for (var _w = (e_3 = void 0, tslib_1.__values(multi.subTable)), _x = _w.next(); !_x.done; _x = _w.next()) {
                                var t = _x.value;
                                res.push(t);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_x && !_x.done && (_q = _w.return)) _q.call(_w);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                    else {
                        if (multi.content) {
                            if ((0, common_1.detectLocalBlock)(multi.content)) {
                                colsToFixWidth.add(ic);
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
                MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
                if (MR[ic] && MR[ic] > 0) {
                    if (forLatex) {
                        res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1,
                            latex: multi && multi.latex ? multi.latex : '' });
                    }
                    return "continue";
                }
                var parseMath = (0, sub_math_1.getMathTableContent)(cells[j], 0);
                var content = parseMath || (0, common_1.getContent)(cells[j]);
                var handleSubTable = function (subTable, vOverride) {
                    if (!colsToFixWidth.has(ic)
                        && subTable.some(function (item) { return (0, common_1.detectLocalBlock)(item.content); })) {
                        colsToFixWidth.add(ic);
                    }
                    return (0, tabular_td_1.AddTdSubTable)(subTable, { h: cAlign[ic], v: vOverride, w: cWidth[ic] }, {
                        left: cLeft,
                        right: cRight,
                        bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
                        top: i === 0 ? (CellsHLines[i] ? CellsHLines[i][ic] : 'none') : ''
                    }, skipVisual, tdMeta);
                };
                var parseSub = (0, sub_tabular_1.getSubTabular)(content, 0, true, forLatex);
                if (parseSub && parseSub.length > 0) {
                    var cellV = vAlign[ic];
                    // Diagbox always centers, ignoring outer bracket.
                    // getSubTabular returns a single wrapper; hasDiagbox is OR'd across all placeholders.
                    if ((_b = parseSub[0]) === null || _b === void 0 ? void 0 : _b.hasDiagbox) {
                        cellV = 'middle';
                        // colSpec may be 'p{2cm}'.
                    }
                    else if (!EXPLICIT_V_COL_SPEC.includes(((_c = colSpec[ic]) === null || _c === void 0 ? void 0 : _c[0]) || '')) {
                        // First nested tabular wins if a cell contains several.
                        var placeholder = (_d = content.match(consts_1.doubleAngleBracketUuidPattern)) === null || _d === void 0 ? void 0 : _d[0];
                        var cellBracket = placeholder ? (0, sub_tabular_1.getSubTabularBracket)(placeholder) : undefined;
                        if (cellBracket)
                            cellV = (0, common_1.bracketToVAlign)(cellBracket);
                    }
                    try {
                        for (var _y = (e_4 = void 0, tslib_1.__values(handleSubTable(parseSub, cellV))), _z = _y.next(); !_z.done; _z = _y.next()) {
                            var t = _z.value;
                            res.push(t);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_z && !_z.done && (_r = _y.return)) _r.call(_y);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    return "continue";
                }
                var data_3 = (0, tabular_td_1.AddTd)(content, { h: cAlign[ic], v: vAlign[ic], w: cWidth[ic] }, { left: cLeft, right: cRight, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
                    top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : '' }, CellsHLSpaces[i + 1][ic], decimal[ic], skipVisual, tdMeta);
                markColIfHasList(colsToFixWidth, ic, data_3.content);
                try {
                    for (var _0 = (e_5 = void 0, tslib_1.__values(data_3.res)), _1 = _0.next(); !_1.done; _1 = _0.next()) {
                        var t = _1.value;
                        res.push(t);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_1 && !_1.done && (_s = _0.return)) _s.call(_0);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
            else {
                MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
                if (MR[ic] && MR[ic] > 0) {
                    if (forLatex) {
                        res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1 });
                    }
                    return "continue";
                }
                var data_4 = (0, tabular_td_1.AddTd)('', { h: cAlign[ic], v: vAlign[ic], w: cWidth[ic] }, { left: cLeft, right: cRight, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
                    top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : '' }, CellsHLSpaces[i + 1][ic], null, skipVisual, tdMeta);
                markColIfHasList(colsToFixWidth, ic, data_4.content);
                try {
                    for (var _2 = (e_6 = void 0, tslib_1.__values(data_4.res)), _3 = _2.next(); !_3.done; _3 = _2.next()) {
                        var t = _3.value;
                        res.push(t);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_3 && !_3.done && (_t = _2.return)) _t.call(_2);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
        };
        for (var j = 0; j < numCol; j++) {
            var state_1 = _loop_2(j);
            if (state_1 === "break")
                break;
        }
        res.push(tabular_td_1.SHARED_TR_CLOSE);
    };
    for (var i = 0; i < rows.length; i++) {
        _loop_1(i);
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
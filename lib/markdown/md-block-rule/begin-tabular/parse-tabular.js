"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTabular = exports.separateByColumns = void 0;
var tabular_td_1 = require("./tabular-td");
var common_1 = require("./common");
var sub_math_1 = require("./sub-math");
var sub_tabular_1 = require("./sub-tabular");
var multi_column_row_1 = require("./multi-column-row");
var sub_cell_1 = require("./sub-cell");
var utils_1 = require("../../utils");
var consts_1 = require("../../common/consts");
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
    if (!consts_1.BEGIN_LIST_ENV_INLINE_RE.test(content)) {
        return;
    }
    if (!colsToFixWidth.includes(colIndex)) {
        colsToFixWidth.push(colIndex);
    }
};
var setTokensTabular = function (str, align, options, isSubTabular) {
    if (align === void 0) { align = ''; }
    if (options === void 0) { options = {}; }
    if (isSubTabular === void 0) { isSubTabular = false; }
    var res = [];
    var rows = getRows(str);
    var cellsAll = (0, common_1.getCellsAll)(rows);
    var numCol = getNumCol(cellsAll);
    var data = (0, common_1.getRowLines)(rows, numCol);
    var CellsHLines = data.cLines;
    var CellsHLSpaces = data.cSpaces;
    var colsToFixWidth = [];
    var dataAlign = (0, common_1.getVerticallyColumnAlign)(align, numCol);
    var cLines = (0, common_1.getColumnLines)(align, numCol);
    var cAlign = dataAlign.cAlign, vAlign = dataAlign.vAlign, cWidth = dataAlign.cWidth, colSpec = dataAlign.colSpec;
    var decimal = (0, common_1.getDecimal)(cAlign, cellsAll);
    var _a = options.forLatex, forLatex = _a === void 0 ? false : _a, _b = options.outMath, outMath = _b === void 0 ? {} : _b;
    res.push({ token: 'table_open', type: 'table_open', tag: 'table', n: 1,
        attrs: [['class', 'tabular']],
        latex: forLatex
            ? align
            : outMath.include_table_markdown
                ? cAlign.join('|')
                : ''
    });
    var tableOpen = res[0];
    if (options === null || options === void 0 ? void 0 : options.forPptx) {
        res.push({ token: 'tbody_open', type: 'tbody_open', tag: 'tbody', n: 1, attrs: [['data_num_col', numCol.toString()]] });
    }
    else {
        res.push({ token: 'tbody_open', type: 'tbody_open', tag: 'tbody', n: 1 });
    }
    var MR = new Array(numCol).fill(0);
    var _loop_1 = function (i) {
        if (!cellsAll[i] || cellsAll[i].length === 0) {
            if (i < cellsAll.length - 1) {
                res.push({ token: 'tr_open', type: 'tr_open', tag: 'tr', n: 1,
                    attrs: [['style', 'border-top: none !important; border-bottom: none !important;']],
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
                        top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : '' }, CellsHLSpaces[i + 1][k]);
                    markColIfHasList(colsToFixWidth, k, data_1.content);
                    res = res.concat(data_1.res);
                }
                res.push({ token: 'tr_close', type: 'tr_close', tag: 'tr', n: -1 });
            }
            return "continue";
        }
        res.push({ token: 'tr_open', type: 'tr_open', tag: 'tr', n: 1,
            attrs: [['style', 'border-top: none !important; border-bottom: none !important;']],
            latex: forLatex && data && data.sLines && data.sLines.length > i ? data.sLines[i] : ''
        });
        var cells = (0, exports.separateByColumns)(cellsAll[i]);
        var _loop_2 = function (j) {
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
                        top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : '' }, CellsHLSpaces[i + 1][k]);
                    markColIfHasList(colsToFixWidth, k, data_2.content);
                    res = res.concat(data_2.res);
                }
                return "break";
            }
            var cRight = ic === numCol - 1 ? cLines[cLines.length - 1] : cLines[ic + 1];
            var cLeft = ic === 0 ? cLines[0] : '';
            if (cells[j] && cells[j].trim().length > 0) {
                var multi = (0, multi_column_row_1.getMultiColumnMultiRow)(cells[j], { lLines: cLines[ic], align: cAlign[ic], rLines: cRight }, forLatex, options === null || options === void 0 ? void 0 : options.forPptx);
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
                        if (mr + i >= rows.length - 1) {
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
                    if (i === 0) {
                        multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[i] ? CellsHLines[i][ic] : 'none', 'top');
                    }
                    if (mr && mr > 0) {
                        multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[mr + i] ? CellsHLines[mr + i][ic] : 'none');
                    }
                    else {
                        multi.attrs = (0, tabular_td_1.addHLineIntoStyle)(multi.attrs, CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none');
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
                        tdOpen.meta = {
                            multi: multi.multi,
                            colCount: numCol,
                            colSpecs: colSpec,
                            currentColIndex: ic,
                            isSubTabular: isSubTabular
                        };
                    }
                    if (multi.subTable) {
                        if (multi.subTable.some(function (item) { return consts_1.BEGIN_LIST_ENV_INLINE_RE.test(item.content); })) {
                            if (!colsToFixWidth.includes(ic)) {
                                colsToFixWidth.push(ic);
                            }
                            if (forLatex) {
                                tdOpen.meta.forceMultiFixedWidth = true;
                            }
                        }
                        res = res.concat(multi.subTable);
                    }
                    else {
                        if (multi.content) {
                            if (consts_1.BEGIN_LIST_ENV_INLINE_RE.test(multi.content)) {
                                if (!colsToFixWidth.includes(ic)) {
                                    colsToFixWidth.push(ic);
                                }
                                if (forLatex) {
                                    tdOpen.meta.forceMultiFixedWidth = true;
                                }
                            }
                            res.push({ token: 'inline', type: 'inline', tag: '', n: 0, content: multi.content });
                        }
                    }
                    res.push({ token: 'td_close', type: 'td_close', tag: 'td', n: -1 });
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
                var handleSubTable = function (subTable) {
                    if (!colsToFixWidth.includes(ic)) {
                        if (subTable.some(function (item) { return consts_1.BEGIN_LIST_ENV_INLINE_RE.test(item.content); })) {
                            colsToFixWidth.push(ic);
                        }
                    }
                    return (0, tabular_td_1.AddTdSubTable)(subTable, { h: cAlign[ic], v: vAlign[ic], w: cWidth[ic] }, {
                        left: cLeft,
                        right: cRight,
                        bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
                        top: i === 0 ? (CellsHLines[i] ? CellsHLines[i][ic] : 'none') : ''
                    });
                };
                var parseSub = (0, sub_tabular_1.getSubTabular)(content, 0, true, forLatex);
                if (parseSub && parseSub.length > 0) {
                    res = res.concat(handleSubTable(parseSub));
                    return "continue";
                }
                var data_3 = (0, tabular_td_1.AddTd)(content, { h: cAlign[ic], v: vAlign[ic], w: cWidth[ic] }, { left: cLeft, right: cRight, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
                    top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : '' }, CellsHLSpaces[i + 1][ic], decimal[ic]);
                markColIfHasList(colsToFixWidth, ic, data_3.content);
                res = res.concat(data_3.res);
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
                    top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : '' }, CellsHLSpaces[i + 1][ic]);
                markColIfHasList(colsToFixWidth, ic, data_4.content);
                res = res.concat(data_4.res);
            }
        };
        for (var j = 0; j < numCol; j++) {
            var state_1 = _loop_2(j);
            if (state_1 === "break")
                break;
        }
        res.push({ token: 'tr_close', type: 'tr_close', tag: 'tr', n: -1 });
    };
    for (var i = 0; i < rows.length; i++) {
        _loop_1(i);
    }
    res.push({ token: 'tbody_close', type: 'tbody_close', tag: 'tbody', n: -1,
        latex: forLatex && data && data.sLines && data.sLines.length ? data.sLines[data.sLines.length - 1] : ''
    });
    res.push({ token: 'table_close', type: 'table_close', tag: 'table', n: -1 });
    if (forLatex) {
        tableOpen.meta = {
            colsToFixWidth: colsToFixWidth,
            colSpecs: colSpec,
            colCount: numCol,
            isSubTabular: isSubTabular,
            vLineSpec: cLines
        };
        if (colsToFixWidth === null || colsToFixWidth === void 0 ? void 0 : colsToFixWidth.length) {
            tableOpen.meta.shouldRewriteColSpec = (0, common_1.shouldRewriteColSpec)(colsToFixWidth, colSpec);
        }
    }
    return res;
};
var ParseTabular = function (str, i, align, options, isSubTabular) {
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
                str = (0, sub_tabular_1.pushSubTabular)(str, subT, [], posBegin, posEnd, i);
                res = (0, exports.ParseTabular)(str, 0, align, options, isSubTabular);
            }
            else {
                var match = str
                    .slice(posBegin)
                    .match(/(?:\\begin{tabular}\s{0,}\{([^}]*)\})/);
                var subT = str.slice(posBegin, posEnd + '\\end{tabular}'.length);
                str = (0, sub_tabular_1.pushSubTabular)(str, subT, [], posBegin + match.index, posEnd, i);
                res = (0, exports.ParseTabular)(str, 0, align, options, isSubTabular);
            }
        }
        else {
            var subT = str.slice(i, posEnd);
            var subRes = setTokensTabular(subT, align, options);
            str = (0, sub_tabular_1.pushSubTabular)(str, subT, subRes, 0, posEnd);
            res = (0, exports.ParseTabular)(str, 0, align, options, isSubTabular);
        }
    }
    else {
        res = setTokensTabular(str, align, options, isSubTabular);
    }
    return res;
};
exports.ParseTabular = ParseTabular;
//# sourceMappingURL=parse-tabular.js.map
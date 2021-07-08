"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTabular = exports.separateByColumns = void 0;
var tabular_td_1 = require("./tabular-td");
var common_1 = require("./common");
var sub_math_1 = require("./sub-math");
var sub_tabular_1 = require("./sub-tabular");
var multi_column_row_1 = require("./multi-column-row");
exports.separateByColumns = function (str) {
    var columns = [];
    var index = 0;
    for (var i = 0; i < str.length; i++) {
        var pos = str.indexOf('&', i);
        if (pos === -1) {
            columns.push(str.slice(index));
            break;
        }
        if (pos > 0 && str.charCodeAt(pos - 1) === 92) {
            i = pos;
            continue;
        }
        columns.push(str.slice(index, pos));
        index = pos + 1;
        i = pos;
    }
    return columns;
};
var getNumCol = function (cells) {
    var res = 0;
    for (var i = 0; i < cells.length; i++) {
        var columns = exports.separateByColumns(cells[i]);
        var col = columns.length;
        for (var j = 0; j < columns.length; j++) {
            col += multi_column_row_1.getMC(columns[j]);
        }
        res = col > res ? col : res;
    }
    return res;
};
var getRows = function (str) {
    str = sub_math_1.getSubMath(str);
    return str.split('\\\\');
};
var setTokensTabular = function (str, align, options) {
    if (align === void 0) { align = ''; }
    if (options === void 0) { options = {}; }
    var res = [];
    var rows = getRows(str);
    var cellsAll = common_1.getCellsAll(rows);
    var numCol = getNumCol(cellsAll);
    var data = common_1.getRowLines(rows, numCol);
    var CellsHLines = data.cLines;
    var CellsHLSpaces = data.cSpaces;
    var dataAlign = common_1.getVerticallyColumnAlign(align, numCol);
    var cLines = common_1.getColumnLines(align, numCol);
    var cAlign = dataAlign.cAlign, vAlign = dataAlign.vAlign, cWidth = dataAlign.cWidth;
    var decimal = common_1.getDecimal(cAlign, cellsAll);
    var _a = options.forLatex, forLatex = _a === void 0 ? false : _a, _b = options.outMath, outMath = _b === void 0 ? {} : _b;
    res.push({ token: 'table_open', type: 'table_open', tag: 'table', n: 1,
        attrs: [['id', 'tabular']],
        latex: forLatex
            ? align
            : outMath.include_table_markdown
                ? cAlign.join('|')
                : ''
    });
    res.push({ token: 'tbody_open', type: 'tbody_open', tag: 'tbody', n: 1 });
    var MR = new Array(numCol).fill(0);
    for (var i = 0; i < rows.length; i++) {
        if (!cellsAll[i] || cellsAll[i].length === 0) {
            if (i < cellsAll.length - 1) {
                res.push({ token: 'tr_open', type: 'tr_open', tag: 'tr', n: 1,
                    attrs: [['style', 'border-top: none !important; border-bottom: none !important;']],
                    latex: forLatex && data && data.sLines && data.sLines.length > i ? data.sLines[i] : ''
                });
                for (var k = 0; k < numCol; k++) {
                    var cRight = k === numCol - 1 ? cLines[cLines.length - 1] : cLines[k + 1];
                    var cLeft = k === 0 ? cLines[0] : '';
                    var data_1 = tabular_td_1.AddTd('', { h: cAlign[k], v: vAlign[k], w: cWidth[k] }, { left: cLeft, right: cRight, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][k] : 'none',
                        top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : '' }, CellsHLSpaces[i + 1][k]);
                    res = res.concat(data_1.res);
                }
                res.push({ token: 'tr_close', type: 'tr_close', tag: 'tr', n: -1 });
            }
            continue;
        }
        res.push({ token: 'tr_open', type: 'tr_open', tag: 'tr', n: 1,
            attrs: [['style', 'border-top: none !important; border-bottom: none !important;']],
            latex: forLatex && data && data.sLines && data.sLines.length > i ? data.sLines[i] : ''
        });
        var cells = exports.separateByColumns(cellsAll[i]);
        for (var j = 0; j < numCol; j++) {
            var ic = multi_column_row_1.getCurrentMC(cells, j);
            if (ic >= numCol) {
                break;
            }
            if (j >= (cells.length) && ic < numCol) {
                for (var k = ic; k < numCol; k++) {
                    if (MR[k] && MR[k] > 0) {
                        MR[k] = MR[k] > 0 ? MR[k] - 1 : 0;
                        continue;
                    }
                    var cRight_1 = k === numCol - 1 ? cLines[cLines.length - 1] : cLines[k + 1];
                    var cLeft_1 = k === 0 ? cLines[0] : '';
                    var data_2 = tabular_td_1.AddTd('', { h: cAlign[k], v: vAlign[k], w: cWidth[k] }, { left: cLeft_1, right: cRight_1, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][k] : 'none',
                        top: i === 0 ? CellsHLines[i] ? CellsHLines[i][k] : 'none' : '' }, CellsHLSpaces[i + 1][k]);
                    res = res.concat(data_2.res);
                }
                break;
            }
            var cRight = ic === numCol - 1 ? cLines[cLines.length - 1] : cLines[ic + 1];
            var cLeft = ic === 0 ? cLines[0] : '';
            if (cells[j] && cells[j].trim().length > 0) {
                var multi = multi_column_row_1.getMultiColumnMultiRow(cells[j], { lLines: cLines[ic], align: cAlign[ic], rLines: cRight });
                if (multi) {
                    var mr = multi.mr > rows.length ? rows.length : multi.mr;
                    var mc = multi.mc > numCol ? numCol : multi.mc;
                    if (mc && mc > 1) {
                        var d = ic - mc + 1;
                        if (MR[d] && MR[d] > 0) {
                            for (var k = 0; k < mc; k++) {
                                MR[d + k] = MR[d + k] > 0 ? MR[d + k] - 1 : 0;
                                if (MR[d + k] > 0) {
                                    mc -= 1;
                                }
                            }
                            if (mc < 1) {
                                continue;
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
                            continue;
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
                            multi.attrs = tabular_td_1.addHLineIntoStyle(multi.attrs, CellsHLines[mr + i] ? CellsHLines[mr + i][ic] : 'none');
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
                            continue;
                        }
                    }
                    if (i === 0) {
                        multi.attrs = tabular_td_1.addHLineIntoStyle(multi.attrs, CellsHLines[i] ? CellsHLines[i][ic] : 'none', 'top');
                    }
                    if (mr && mr > 0) {
                        multi.attrs = tabular_td_1.addHLineIntoStyle(multi.attrs, CellsHLines[mr + i] ? CellsHLines[mr + i][ic] : 'none');
                    }
                    else {
                        multi.attrs = tabular_td_1.addHLineIntoStyle(multi.attrs, CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none');
                    }
                    res.push({ token: 'td_open', type: 'td_open', tag: 'td', n: 1, attrs: multi.attrs,
                        latex: forLatex && multi && multi.latex ? multi.latex : '' });
                    if (multi.subTable) {
                        res = res.concat(multi.subTable);
                    }
                    else {
                        if (multi.content) {
                            res.push({ token: 'inline', type: 'inline', tag: '', n: 0, content: multi.content });
                        }
                    }
                    res.push({ token: 'td_close', type: 'td_close', tag: 'td', n: -1 });
                    continue;
                }
                MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
                if (MR[ic] && MR[ic] > 0) {
                    if (forLatex) {
                        res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1,
                            latex: multi && multi.latex ? multi.latex : '' });
                    }
                    continue;
                }
                var parseSub = sub_tabular_1.getSubTabular(cells[j], 0);
                if (parseSub && parseSub.length > 0) {
                    res = res.concat(tabular_td_1.AddTdSubTable(parseSub, { h: cAlign[ic], v: vAlign[ic], w: cWidth[ic] }, { left: cLeft, right: cRight, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
                        top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : '' }));
                    continue;
                }
                var parseMath = sub_math_1.getMathTableContent(cells[j], 0);
                var content = '';
                if (parseMath) {
                    content = parseMath;
                }
                else {
                    content = common_1.getContent(cells[j]);
                }
                var data_3 = tabular_td_1.AddTd(content, { h: cAlign[ic], v: vAlign[ic], w: cWidth[ic] }, { left: cLeft, right: cRight, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
                    top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : '' }, CellsHLSpaces[i + 1][ic], decimal[ic]);
                res = res.concat(data_3.res);
            }
            else {
                MR[ic] = MR[ic] > 0 ? MR[ic] - 1 : 0;
                if (MR[ic] && MR[ic] > 0) {
                    if (forLatex) {
                        res.push({ token: 'td_skip', type: 'td_skip', tag: 'td', n: -1 });
                    }
                    continue;
                }
                var data_4 = tabular_td_1.AddTd('', { h: cAlign[ic], v: vAlign[ic], w: cWidth[ic] }, { left: cLeft, right: cRight, bottom: CellsHLines[i + 1] ? CellsHLines[i + 1][ic] : 'none',
                    top: i === 0 ? CellsHLines[i] ? CellsHLines[i][ic] : 'none' : '' }, CellsHLSpaces[i + 1][ic]);
                res = res.concat(data_4.res);
            }
        }
        res.push({ token: 'tr_close', type: 'tr_close', tag: 'tr', n: -1 });
    }
    res.push({ token: 'tbody_close', type: 'tbody_close', tag: 'tbody', n: -1,
        latex: forLatex && data && data.sLines && data.sLines.length ? data.sLines[data.sLines.length - 1] : ''
    });
    res.push({ token: 'table_close', type: 'table_close', tag: 'table', n: -1 });
    return res;
};
exports.ParseTabular = function (str, i, align, options) {
    if (align === void 0) { align = ''; }
    if (options === void 0) { options = {}; }
    var res = [];
    var posEnd = str.indexOf('\\end{tabular}');
    if (posEnd > 0) {
        var posBegin = str.slice(i, posEnd).lastIndexOf('\\begin{tabular}');
        if (posBegin >= 0) {
            var params = common_1.getParams(str, posBegin + '\\begin{tabular}'.length);
            if (params) {
                var subT = str.slice(posBegin, posEnd + '\\end{tabular}'.length);
                str = sub_tabular_1.pushSubTabular(str, subT, posBegin, posEnd, i);
                res = exports.ParseTabular(str, 0, align, options);
            }
            else {
                var match = str
                    .slice(posBegin)
                    .match(/(?:\\begin{tabular}\s{0,}\{([^}]*)\})/);
                var subT = str.slice(posBegin, posEnd + '\\end{tabular}'.length);
                str = sub_tabular_1.pushSubTabular(str, subT, posBegin + match.index, posEnd, i);
                res = exports.ParseTabular(str, 0, align, options);
            }
        }
        else {
            var subT = str.slice(i, posEnd);
            var subRes = setTokensTabular(subT, align, options);
            str = sub_tabular_1.pushSubTabular(str, subRes, 0, posEnd);
            res = exports.ParseTabular(str, 0, align, options);
        }
    }
    else {
        res = setTokensTabular(str, align, options);
    }
    return res;
};
//# sourceMappingURL=parse-tabular.js.map
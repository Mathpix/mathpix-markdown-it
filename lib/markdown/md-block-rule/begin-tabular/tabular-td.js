"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTdSubTable = exports.AddTd = exports.addHLineIntoStyle = exports.addStyle = exports.setColumnLines = exports.clearColumnStyleCache = void 0;
var utils_1 = require("../../utils");
var sub_code_1 = require("./sub-code");
var consts_1 = require("../../common/consts");
// Interned cell-border style strings. `verticalCellLine`/`horizontalCellLine`
// are invoked once per border per <td> — for large tabulars this is millions
// of calls with only ~8 unique return values per orientation. Pre-building the
// strings lets V8 share a single instance instead of re-allocating identical
// ~70-byte strings for every cell (heap-snapshot on a 16 MB MMD showed the
// top retainer was 395 125 copies of one such string = 96 MB).
var V_LEFT_NONE = 'border-left: none !important; ';
var V_LEFT_SOLID = 'border-left-style: solid !important; border-left-width: 1px !important; ';
var V_LEFT_DOUBLE = 'border-left-style: double !important; border-left-width: 3px !important; ';
var V_LEFT_DASHED = 'border-left-style: dashed !important; border-left-width: 1px !important; ';
var V_RIGHT_NONE = 'border-right: none !important; ';
var V_RIGHT_SOLID = 'border-right-style: solid !important; border-right-width: 1px !important; ';
var V_RIGHT_DOUBLE = 'border-right-style: double !important; border-right-width: 3px !important; ';
var V_RIGHT_DASHED = 'border-right-style: dashed !important; border-right-width: 1px !important; ';
var H_TOP_NONE = 'border-top: none !important; ';
var H_TOP_SOLID = 'border-top-style: solid !important; border-top-width: 1px !important; ';
var H_TOP_DOUBLE = 'border-top-style: double !important; border-top-width: 3px !important; ';
var H_TOP_DASHED = 'border-top-style: dashed !important; border-top-width: 1px !important; ';
var H_BOTTOM_NONE = 'border-bottom: none !important; ';
var H_BOTTOM_SOLID = 'border-bottom-style: solid !important; border-bottom-width: 1px !important; ';
var H_BOTTOM_DOUBLE = 'border-bottom-style: double !important; border-bottom-width: 3px !important; ';
var H_BOTTOM_DASHED = 'border-bottom-style: dashed !important; border-bottom-width: 1px !important; ';
var verticalCellLine = function (line, pos) {
    if (pos === void 0) { pos = 'left'; }
    var lines = line.split(' ');
    var isLeft = pos === 'left';
    if (lines.length > 1) {
        return isLeft ? V_LEFT_DOUBLE : V_RIGHT_DOUBLE;
    }
    switch (lines[0]) {
        case '':
            return '';
        case 'none':
            return isLeft ? V_LEFT_NONE : V_RIGHT_NONE;
        case 'solid':
            return isLeft ? V_LEFT_SOLID : V_RIGHT_SOLID;
        case 'double':
            return isLeft ? V_LEFT_DOUBLE : V_RIGHT_DOUBLE;
        case 'dashed':
            return isLeft ? V_LEFT_DASHED : V_RIGHT_DASHED;
        default:
            return isLeft ? V_LEFT_SOLID : V_RIGHT_SOLID;
    }
};
var horizontalCellLine = function (line, pos) {
    if (pos === void 0) { pos = 'bottom'; }
    var lines = line.split(' ');
    var isTop = pos === 'top';
    if (lines.length > 1) {
        return isTop ? H_TOP_DOUBLE : H_BOTTOM_DOUBLE;
    }
    switch (lines[0]) {
        case 'none':
            return isTop ? H_TOP_NONE : H_BOTTOM_NONE;
        case 'hline':
            return isTop ? H_TOP_SOLID : H_BOTTOM_SOLID;
        case 'hhline':
            return isTop ? H_TOP_DOUBLE : H_BOTTOM_DOUBLE;
        case 'hdashline':
            return isTop ? H_TOP_DASHED : H_BOTTOM_DASHED;
        default:
            return isTop ? H_TOP_NONE : H_BOTTOM_NONE;
    }
};
// Per-parse dedup cache for the concatenated style attribute of tabular <td>
// cells. A 16 MB MMD document with 165 tabulars produced ~400K <td> tokens
// whose style strings only had a few hundred unique values — V8 retained ~80 MB
// of duplicate style strings. Interning via this Map collapses them to a
// single shared instance. Cleared at the start of every md.parse() via the
// `reset_tabular_state` core rule (see mdPluginTableTabular).
var columnStyleCache = new Map();
var clearColumnStyleCache = function () {
    columnStyleCache.clear();
};
exports.clearColumnStyleCache = clearColumnStyleCache;
var internStyle = function (style) {
    var cached = columnStyleCache.get(style);
    if (cached !== undefined)
        return cached;
    columnStyleCache.set(style, style);
    return style;
};
var setColumnLines = function (aligns, lines) {
    var _a = lines.left, left = _a === void 0 ? '' : _a, _b = lines.right, right = _b === void 0 ? '' : _b, _c = lines.bottom, bottom = _c === void 0 ? '' : _c, _d = lines.top, top = _d === void 0 ? '' : _d;
    if (!aligns) {
        aligns = { h: '', v: '', w: '' };
    }
    var _e = aligns.h, h = _e === void 0 ? '' : _e, _f = aligns.v, v = _f === void 0 ? '' : _f, _g = aligns.w, w = _g === void 0 ? '' : _g;
    var borderLeft = verticalCellLine(left, 'left');
    var borderRight = verticalCellLine(right, 'right');
    var borderBottom = horizontalCellLine(bottom, 'bottom');
    var borderTop = horizontalCellLine(top, 'top');
    var textAlign = "text-align: ".concat(h
        ? h === 'decimal' ? 'center' : h
        : 'center', "; ");
    var width = '';
    if (w) {
        width = (0, utils_1.getLatexTextWidth)(w, 1200);
        if (!width) {
            width = "width: ".concat(w, "; ");
        }
    }
    var vAlign = v ? "vertical-align: ".concat(v, "; ") : '';
    var style = textAlign + borderLeft + borderRight + borderBottom + borderTop + width + vAlign;
    return ['style', internStyle(style)];
};
exports.setColumnLines = setColumnLines;
var addStyle = function (attrs, style) {
    var index = attrs.findIndex(function (item) { return item[0] === 'style'; });
    if (index >= 0) {
        attrs[index][1] += style;
    }
    else {
        attrs.push(['style', style]);
    }
    return attrs;
};
exports.addStyle = addStyle;
var addHLineIntoStyle = function (attrs, line, pos) {
    if (line === void 0) { line = ''; }
    if (pos === void 0) { pos = 'bottom'; }
    var style = horizontalCellLine(line, pos);
    return (0, exports.addStyle)(attrs, style);
};
exports.addHLineIntoStyle = addHLineIntoStyle;
var AddTd = function (content, aligns, lines, space, decimal) {
    if (decimal === void 0) { decimal = null; }
    var res = [];
    var attrs = [];
    var slyleLines = (0, exports.setColumnLines)(aligns, lines);
    attrs.push(slyleLines);
    if (space && space !== 'none') {
        (0, exports.addStyle)(attrs, "padding-bottom: ".concat(space, " !important;"));
    }
    if (!content) {
        attrs.push(['class', '_empty']);
    }
    content = content.replace(consts_1.preserveNewlineUnlessDoubleAngleUuidRegex, ' ');
    content = (0, sub_code_1.getExtractedCodeBlockContent)(content, 0);
    res.push({ token: 'td_open', type: 'td_open', tag: 'td', n: 1, attrs: attrs });
    if (content) {
        if (decimal && parseFloat(content)) {
            var arr = content.split('.');
            var fr = (arr[1] ? new Array(decimal.r - arr[1].length).fill(0) : new Array(decimal.r).fill(0)).join('');
            var fl = (arr[0] ? new Array(decimal.l - arr[0].length).fill(0) : new Array(decimal.l).fill(0)).join('');
            if (arr[1]) {
                res.push({ token: 'inline_decimal', type: 'inline_decimal', tag: '', n: 0, content: "".concat(fl, ";").concat(content, ";").concat(fr),
                    ascii: content,
                    ascii_tsv: content,
                    ascii_csv: content,
                    ascii_md: content,
                    latex: content });
            }
            else {
                res.push({ token: 'inline_decimal', type: 'inline_decimal', tag: '', n: 0, content: "".concat(fl, ";").concat(content, ";.").concat(fr),
                    ascii: content,
                    ascii_tsv: content,
                    ascii_csv: content,
                    ascii_md: content,
                    latex: content });
            }
        }
        else {
            res.push({ token: 'inline', type: 'inline', tag: '', n: 0, content: content });
        }
    }
    res.push({ token: 'td_close', type: 'td_close', tag: 'td', n: -1 });
    return { res: res, content: content };
};
exports.AddTd = AddTd;
var AddTdSubTable = function (subTable, aligns, lines) {
    var res = [];
    var attrs = [];
    var slyleLines = (0, exports.setColumnLines)(aligns, lines);
    attrs.push(slyleLines);
    res.push({ token: 'td_open', type: 'td_open', tag: 'td', n: 1, attrs: attrs });
    res = res.concat(subTable);
    res.push({ token: 'td_close', type: 'td_close', tag: 'td', n: -1 });
    return res;
};
exports.AddTdSubTable = AddTdSubTable;
//# sourceMappingURL=tabular-td.js.map
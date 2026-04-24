"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTdSubTable = exports.AddTd = exports.addHLineIntoStyle = exports.addStyle = exports.setColumnLines = exports.SHARED_TBODY_CLOSE = exports.SHARED_TABLE_CLOSE = exports.SHARED_TR_CLOSE = exports.SHARED_TD_CLOSE = exports.getSharedTrOpenAttrs = exports.getSharedTbodyOpenAttrs = exports.getSharedTableOpenAttrs = exports.clearColumnStyleCache = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var sub_code_1 = require("./sub-code");
var consts_1 = require("../../common/consts");
// Pre-interned border styles — only ~8 unique values per orientation,
// share one instance across every <td> instead of reallocating per call.
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
// Per-parse dedup caches for style strings and <td> attrs arrays. Shared attrs
// are read-only; mutators clone via `attrsSharedMarker` (see tokenAttrSet).
var columnStyleCache = new Map();
var cellAttrsCache = new Map();
var markAttrsShared = function (attrs) {
    Object.defineProperty(attrs, consts_1.attrsSharedMarker, {
        value: true, enumerable: false, configurable: true, writable: true,
    });
    return attrs;
};
var clearColumnStyleCache = function () {
    columnStyleCache.clear();
    cellAttrsCache.clear();
    TABLE_OPEN_ATTRS_CACHE.clear();
    TBODY_OPEN_ATTRS_CACHE.clear();
    TR_OPEN_ATTRS_SHARED = null;
};
exports.clearColumnStyleCache = clearColumnStyleCache;
var internStyle = function (style) {
    var cached = columnStyleCache.get(style);
    if (cached !== undefined)
        return cached;
    columnStyleCache.set(style, style);
    return style;
};
var composeCellStyle = function (aligns, lines, space) {
    var _a = lines.left, left = _a === void 0 ? '' : _a, _b = lines.right, right = _b === void 0 ? '' : _b, _c = lines.bottom, bottom = _c === void 0 ? '' : _c, _d = lines.top, top = _d === void 0 ? '' : _d;
    if (!aligns)
        aligns = { h: '', v: '', w: '' };
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
        if (!width)
            width = "width: ".concat(w, "; ");
    }
    var vAlign = v ? "vertical-align: ".concat(v, "; ") : '';
    var padding = space && space !== 'none' ? "padding-bottom: ".concat(space, " !important;") : '';
    var style = textAlign + borderLeft + borderRight + borderBottom + borderTop + width + vAlign + padding;
    return internStyle(style);
};
/** Read-only shared attrs keyed by (style, isEmpty). Mutators must clone. */
var getSharedCellAttrs = function (style, isEmpty, skipVisual) {
    if (skipVisual === void 0) { skipVisual = false; }
    // Style and `_empty` class are HTML/CSS-only. XLSX reads style too but
    // doesn't set skipVisual, so that path is unaffected.
    if (skipVisual)
        return undefined;
    var key = isEmpty ? style + '\0E' : style;
    var cached = cellAttrsCache.get(key);
    if (cached)
        return cached;
    var attrs = isEmpty
        ? [['style', style], ['class', '_empty']]
        : [['style', style]];
    markAttrsShared(attrs);
    cellAttrsCache.set(key, attrs);
    return attrs;
};
// Shared attrs for structural tabular tokens — same values repeat thousands
// of times per doc.
var TABLE_OPEN_ATTRS_CACHE = new Map();
var TBODY_OPEN_ATTRS_CACHE = new Map();
var TR_OPEN_ATTRS_SHARED = null;
var TR_OPEN_STYLE = 'border-top: none !important; border-bottom: none !important;';
var getSharedTableOpenAttrs = function (extraClass, skipVisual) {
    if (skipVisual === void 0) { skipVisual = false; }
    // class='tabular' is HTML-only (used for table detection by DOCX/PPTX builders).
    // Under skipVisual, keep only data-type (non-visual subtable marker).
    if (skipVisual && !extraClass)
        return undefined;
    var key = (skipVisual ? 'v:' : '') + (extraClass || '');
    var cached = TABLE_OPEN_ATTRS_CACHE.get(key);
    if (cached)
        return cached;
    var attrs = skipVisual
        ? [['data-type', extraClass]]
        : (extraClass
            ? [['class', 'tabular'], ['data-type', extraClass]]
            : [['class', 'tabular']]);
    markAttrsShared(attrs);
    TABLE_OPEN_ATTRS_CACHE.set(key, attrs);
    return attrs;
};
exports.getSharedTableOpenAttrs = getSharedTableOpenAttrs;
var getSharedTbodyOpenAttrs = function (numCol) {
    var key = numCol.toString();
    var cached = TBODY_OPEN_ATTRS_CACHE.get(key);
    if (cached)
        return cached;
    var attrs = [['data_num_col', key]];
    markAttrsShared(attrs);
    TBODY_OPEN_ATTRS_CACHE.set(key, attrs);
    return attrs;
};
exports.getSharedTbodyOpenAttrs = getSharedTbodyOpenAttrs;
var getSharedTrOpenAttrs = function (skipVisual) {
    if (skipVisual === void 0) { skipVisual = false; }
    // tr_open.style is the HTML border-reset — no MD/LaTeX/XLSX consumer.
    if (skipVisual)
        return undefined;
    if (TR_OPEN_ATTRS_SHARED)
        return TR_OPEN_ATTRS_SHARED;
    var attrs = [['style', TR_OPEN_STYLE]];
    markAttrsShared(attrs);
    TR_OPEN_ATTRS_SHARED = attrs;
    return attrs;
};
exports.getSharedTrOpenAttrs = getSharedTrOpenAttrs;
// Frozen shared close-tokens. SHARED_TBODY_CLOSE only when !forLatex (forLatex carries per-table `latex` payload).
exports.SHARED_TD_CLOSE = Object.freeze({
    token: 'td_close', type: 'td_close', tag: 'td', n: -1,
});
exports.SHARED_TR_CLOSE = Object.freeze({
    token: 'tr_close', type: 'tr_close', tag: 'tr', n: -1,
});
exports.SHARED_TABLE_CLOSE = Object.freeze({
    token: 'table_close', type: 'table_close', tag: 'table', n: -1,
});
exports.SHARED_TBODY_CLOSE = Object.freeze({
    token: 'tbody_close', type: 'tbody_close', tag: 'tbody', n: -1,
});
// Legacy entry point: callers that build their own attrs array (AddTdSubTable,
// multi-column paths) still use this — hot <td> path uses getSharedCellAttrs.
var setColumnLines = function (aligns, lines) {
    var style = composeCellStyle(aligns, lines, '');
    return ['style', style];
};
exports.setColumnLines = setColumnLines;
var addStyle = function (attrs, style) {
    // Clone-on-write: shared attrs (from the per-parse cache) are read-only.
    // Clone the outer array AND each inner [name, value] tuple, because
    // `attrs[i][1] += style` below would otherwise mutate the cached tuple.
    // Array.isArray guard: legacy callers may pass mixed-shape attrs; preserve non-tuple items as-is.
    if (attrs && attrs[consts_1.attrsSharedMarker]) {
        attrs = attrs.map(function (pair) { return Array.isArray(pair) ? [pair[0], pair[1]] : pair; });
    }
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
var AddTd = function (content, aligns, lines, space, decimal, skipVisual) {
    if (decimal === void 0) { decimal = null; }
    if (skipVisual === void 0) { skipVisual = false; }
    var res = [];
    var style = skipVisual ? '' : composeCellStyle(aligns, lines, space);
    content = content.replace(consts_1.preserveNewlineUnlessDoubleAngleUuidRegex, ' ');
    content = (0, sub_code_1.getExtractedCodeBlockContent)(content, 0);
    var attrs = getSharedCellAttrs(style, !content, skipVisual);
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
    res.push(exports.SHARED_TD_CLOSE);
    return { res: res, content: content };
};
exports.AddTd = AddTd;
var AddTdSubTable = function (subTable, aligns, lines, skipVisual) {
    var e_1, _a;
    if (skipVisual === void 0) { skipVisual = false; }
    var res = [];
    var attrs;
    if (!skipVisual) {
        attrs = [(0, exports.setColumnLines)(aligns, lines)];
    }
    res.push({ token: 'td_open', type: 'td_open', tag: 'td', n: 1, attrs: attrs });
    try {
        for (var subTable_1 = tslib_1.__values(subTable), subTable_1_1 = subTable_1.next(); !subTable_1_1.done; subTable_1_1 = subTable_1.next()) {
            var t = subTable_1_1.value;
            res.push(t);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (subTable_1_1 && !subTable_1_1.done && (_a = subTable_1.return)) _a.call(subTable_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.push(exports.SHARED_TD_CLOSE);
    return res;
};
exports.AddTdSubTable = AddTdSubTable;
//# sourceMappingURL=tabular-td.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTdSubTable = exports.AddTd = exports.addHLineIntoStyle = exports.addStyle = exports.setColumnLines = exports.clearColumnStyleCache = exports.attrsSharedMarker = void 0;
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
// Per-parse intern cache for tabular-cell style strings and for the whole
// attrs array attached to `td_open` tokens.
//
// On a 16 MB MMD document the 479K AddTd() calls produced only ~38 distinct
// style strings — the top one alone was used 393K times. Each call still
// allocated its own outer attrs array `[['style', X]]`, inner tuple, and two
// array-backing stores. `attrsSharedMarker`/`cellAttrsCache` dedupe the whole
// attrs structure so cells with identical (style + isEmpty + latex?) share
// one attrs instance, saving ~1M array allocations on this doc.
//
// Shared attrs must be treated as read-only. `tokenAttrSet` /
// `tokenAttrGet` in `md-renderer-rules/render-tabular.ts` clone attrs on
// first write via the `attrsSharedMarker` property.
var columnStyleCache = new Map();
var cellAttrsCache = new Map();
/**
 * Non-enumerable marker set on cached shared `attrs` arrays so that code
 * paths that mutate attrs (highlight, diagbox overlays) can detach a private
 * copy instead of corrupting every cell that shares the instance.
 *
 * Consumers check the marker via `(attrs as any)[attrsSharedMarker] === true`.
 * The marker is defined with `configurable: true` so the clone can clear it.
 */
exports.attrsSharedMarker = Symbol.for('mathpix.tabular.attrsShared');
var markAttrsShared = function (attrs) {
    Object.defineProperty(attrs, exports.attrsSharedMarker, {
        value: true, enumerable: false, configurable: true, writable: true,
    });
    return attrs;
};
var clearColumnStyleCache = function () {
    columnStyleCache.clear();
    cellAttrsCache.clear();
};
exports.clearColumnStyleCache = clearColumnStyleCache;
var internStyle = function (style) {
    var cached = columnStyleCache.get(style);
    if (cached !== undefined)
        return cached;
    columnStyleCache.set(style, style);
    return style;
};
/**
 * Builds the final style string for a tabular cell from the aligns/lines
 * descriptor and optional padding-bottom space. Returned string is interned
 * per-parse.
 */
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
/**
 * Returns a read-only shared attrs array for a `<td>` cell. Tokens with the
 * same (style, isEmpty) pair reuse the same instance. Mutation paths must
 * clone first — see `attrsSharedMarker`.
 */
var getSharedCellAttrs = function (style, isEmpty) {
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
/**
 * Backward-compatible helper: returns a single `['style', X]` tuple.
 * Kept for callers (AddTdSubTable, other code paths) that still build
 * non-shared attrs arrays; prefer `composeCellStyle` + `getSharedCellAttrs`
 * for hot paths.
 */
var setColumnLines = function (aligns, lines) {
    var style = composeCellStyle(aligns, lines, '');
    return ['style', style];
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
    var style = composeCellStyle(aligns, lines, space);
    content = content.replace(consts_1.preserveNewlineUnlessDoubleAngleUuidRegex, ' ');
    content = (0, sub_code_1.getExtractedCodeBlockContent)(content, 0);
    var attrs = getSharedCellAttrs(style, !content);
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
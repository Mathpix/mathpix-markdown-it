"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTdSubTable = exports.AddTd = exports.addHLineIntoStyle = exports.addStyle = exports.setColumnLines = void 0;
var verticalCellLine = function (line, pos) {
    if (pos === void 0) { pos = 'left'; }
    var lines = line.split(' ');
    if (lines.length > 1) {
        return "border-" + pos + "-style: double !important; border-" + pos + "-width: 3px !important; ";
    }
    else {
        switch (lines[0]) {
            case '':
                return "";
            //return `border-${pos}: none !important; `;
            case 'none':
                return "border-" + pos + ": none !important; ";
            case 'solid':
                return "border-" + pos + "-style: solid !important; border-" + pos + "-width: 1px !important; ";
            case 'double':
                return "border-" + pos + "-style: double !important; border-" + pos + "-width: 3px !important; ";
            case 'dashed':
                return "border-" + pos + "-style: dashed !important; border-" + pos + "-width: 1px !important; ";
            default:
                return "border-" + pos + "-style: solid !important; border-" + pos + "-width: 1px !important; ";
        }
    }
};
var horizontalCellLine = function (line, pos) {
    if (pos === void 0) { pos = 'bottom'; }
    var lines = line.split(' ');
    if (lines.length > 1) {
        return "border-" + pos + "-style: double !important; border-" + pos + "-width: 3px !important; ";
    }
    else {
        switch (lines[0]) {
            case 'none':
                return "border-" + pos + ": none !important; ";
            case 'hline':
                return "border-" + pos + "-style: solid !important; border-" + pos + "-width: 1px !important; ";
            case 'hhline':
                return "border-" + pos + "-style: double !important; border-" + pos + "-width: 3px !important; ";
            case 'hdashline':
                return "border-" + pos + "-style: dashed !important; border-" + pos + "-width: 1px !important; ";
            default:
                return "border-" + pos + ": none !important; ";
        }
    }
};
exports.setColumnLines = function (aligns, lines) {
    var _a = lines.left, left = _a === void 0 ? '' : _a, _b = lines.right, right = _b === void 0 ? '' : _b, _c = lines.bottom, bottom = _c === void 0 ? '' : _c, _d = lines.top, top = _d === void 0 ? '' : _d;
    if (!aligns) {
        aligns = { h: '', v: '', w: '' };
    }
    var _e = aligns.h, h = _e === void 0 ? '' : _e, _f = aligns.v, v = _f === void 0 ? '' : _f, _g = aligns.w, w = _g === void 0 ? '' : _g;
    var borderLeft = verticalCellLine(left, 'left');
    var borderRight = verticalCellLine(right, 'right');
    var borderBottom = horizontalCellLine(bottom, 'bottom');
    var borderTop = horizontalCellLine(top, 'top');
    var textAlign = "text-align: " + (h
        ? h === 'decimal' ? 'center' : h
        : 'center') + "; ";
    var width = w ? "width: " + w + "; " : '';
    var vAlign = v ? "vertical-align: " + v + "; " : '';
    return ['style', textAlign + borderLeft + borderRight + borderBottom + borderTop + width + vAlign];
};
exports.addStyle = function (attrs, style) {
    var index = attrs.findIndex(function (item) { return item[0] === 'style'; });
    if (index >= 0) {
        attrs[index][1] += style;
    }
    else {
        attrs.push(['style', style]);
    }
    return attrs;
};
exports.addHLineIntoStyle = function (attrs, line, pos) {
    if (line === void 0) { line = ''; }
    if (pos === void 0) { pos = 'bottom'; }
    var style = horizontalCellLine(line, pos);
    return exports.addStyle(attrs, style);
};
exports.AddTd = function (content, aligns, lines, space, decimal) {
    if (decimal === void 0) { decimal = null; }
    var res = [];
    var attrs = [];
    var slyleLines = exports.setColumnLines(aligns, lines);
    attrs.push(slyleLines);
    if (space && space !== 'none') {
        exports.addStyle(attrs, "padding-bottom: " + space + " !important;");
    }
    if (!content) {
        attrs.push(['class', '_empty']);
    }
    content = content.split('\n').join(' ');
    res.push({ token: 'td_open', type: 'td_open', tag: 'td', n: 1, attrs: attrs });
    if (content) {
        if (decimal && parseFloat(content)) {
            var arr = content.split('.');
            var fr = (arr[1] ? new Array(decimal.r - arr[1].length).fill(0) : new Array(decimal.r).fill(0)).join('');
            var fl = (arr[0] ? new Array(decimal.l - arr[0].length).fill(0) : new Array(decimal.l).fill(0)).join('');
            if (arr[1]) {
                res.push({ token: 'inline_decimal', type: 'inline_decimal', tag: '', n: 0, content: fl + ";" + content + ";" + fr, ascii: content,
                    latex: content });
            }
            else {
                res.push({ token: 'inline_decimal', type: 'inline_decimal', tag: '', n: 0, content: fl + ";" + content + ";." + fr, ascii: content,
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
exports.AddTdSubTable = function (subTable, aligns, lines) {
    var res = [];
    var attrs = [];
    var slyleLines = exports.setColumnLines(aligns, lines);
    attrs.push(slyleLines);
    res.push({ token: 'td_open', type: 'td_open', tag: 'td', n: 1, attrs: attrs });
    res = res.concat(subTable);
    res.push({ token: 'td_close', type: 'td_close', tag: 'td', n: -1 });
    return res;
};
//# sourceMappingURL=tabular-td.js.map
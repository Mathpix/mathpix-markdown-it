"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRewriteColSpec = exports.getRowLines = exports.getCellsAll = exports.getDecimal = exports.getParams = exports.getVerticallyColumnAlign = exports.getColumnAlign = exports.getColumnLines = exports.generateUniqueId = exports.getContent = void 0;
var parse_tabular_1 = require("./parse-tabular");
var uuid_1 = require("uuid");
var consts_1 = require("../../common/consts");
var getContent = function (content, onlyOne, skipTrim) {
    if (onlyOne === void 0) { onlyOne = false; }
    if (skipTrim === void 0) { skipTrim = false; }
    if (!content) {
        return content;
    }
    if (!skipTrim) {
        content = content.trim();
    }
    if (content[0] === '{' && content[content.length - 1] === '}') {
        content = content.slice(1, content.length - 1);
        if (!onlyOne) {
            content = (0, exports.getContent)(content);
        }
    }
    return content;
};
exports.getContent = getContent;
var generateUniqueId = function (onlyUuid) {
    if (onlyUuid === void 0) { onlyUuid = false; }
    if (onlyUuid) {
        return (0, uuid_1.v4)();
    }
    else {
        return "f".concat((0, uuid_1.v4)());
    }
};
exports.generateUniqueId = generateUniqueId;
var getColumnLines = function (str, numCol) {
    if (numCol === void 0) { numCol = 0; }
    str = str
        .replace(/\{(.*?)\}/g, '')
        .replace(/[^clrSmpb|:]/g, '').split('').join('');
    var res = [];
    var cLines = str
        .replace(/l/g, ';')
        .replace(/r/g, ';')
        .replace(/c/g, ';')
        .replace(/S/g, ';')
        .replace(/m/g, ';')
        .replace(/p/g, ';')
        .replace(/b/g, ';')
        .split(';');
    numCol = Math.max(numCol, cLines.length);
    if (numCol > 0) {
        res = new Array(numCol).fill('none');
        for (var i = 0; i < cLines.length - 1; i++) {
            if (cLines[i].length === 0) {
                continue;
            }
            if (cLines[i].length > 1) {
                res[i] = 'double';
                continue;
            }
            res[i] = ((cLines[i].replace(/[^|: ]/g, 'none').replace(/:/g, 'dashed')
                .replace(/\|/g, 'solid')).trim());
        }
        if (cLines[cLines.length - 1].length > 1) {
            res[numCol - 1] = 'double';
        }
        else {
            res[numCol - 1] = ((cLines[cLines.length - 1].replace(/[^|: ]/g, 'none').replace(/:/g, 'dashed')
                .replace(/\|/g, 'solid')).trim());
        }
        return res;
    }
    for (var i = 0; i < cLines.length; i++) {
        if (cLines[i].length === 0) {
            res.push('none');
            continue;
        }
        if (cLines[i].length > 1) {
            res.push('double');
            continue;
        }
        res.push((cLines[i].replace(/[^|: ]/g, 'none').replace(/:/g, 'dashed')
            .replace(/\|/g, 'solid')).trim());
    }
    return res;
};
exports.getColumnLines = getColumnLines;
var getColumnAlign = function (align) {
    align = align.replace(/[^clrS|:]/g, '').split('').join('');
    align = align.replace(/[^clrS]/g, '').split('').join(' ');
    align = align
        .replace(/l/g, 'left')
        .replace(/r/g, 'right')
        .replace(/c/g, 'center')
        .replace(/S/g, 'decimal');
    return align ? align.split(' ') : [];
};
exports.getColumnAlign = getColumnAlign;
var arrayFillDef = function (arr, str, num) {
    if (arr.length < num) {
        return arr.concat(new Array(num - arr.length).fill(str));
    }
    else {
        return arr;
    }
};
var getVerticallyColumnAlign = function (align, numCol) {
    var aH = ['c', 'S', 'r', 'l'];
    var aV = ['m', 'p', 'b'];
    var hAlign = [];
    var vAlign = [];
    var cWidth = [];
    var colSpec = [];
    align = align.replace(/ /g, '').trim();
    for (var j = 0; j < align.length; j++) {
        var ch = align[j];
        if (aH.indexOf(ch) >= 0) {
            colSpec.push(ch);
            switch (align[j]) {
                case 'c':
                    hAlign.push('center');
                    vAlign.push('middle');
                    cWidth.push('auto');
                    break;
                case 'S':
                    hAlign.push('decimal');
                    vAlign.push('middle');
                    cWidth.push('auto');
                    break;
                case 'r':
                    hAlign.push('right');
                    vAlign.push('middle');
                    cWidth.push('auto');
                    break;
                case 'l':
                    hAlign.push('left');
                    vAlign.push('middle');
                    cWidth.push('auto');
                    break;
            }
        }
        if (aV.indexOf(ch) >= 0) {
            var spec = ch;
            var width = 'auto';
            switch (ch) {
                case 'm':
                    hAlign.push('left');
                    vAlign.push('middle');
                    break;
                case 'p':
                    hAlign.push('left');
                    vAlign.push('top');
                    break;
                case 'b':
                    hAlign.push('left');
                    vAlign.push('bottom');
                    break;
            }
            if (align[j + 1] === '{') {
                var end = align.indexOf('}', j + 1);
                var w = end >= 0 ? align.slice(j + 2, end) : '';
                width = w || 'auto';
                spec = end >= 0 ? "".concat(ch, "{").concat(w, "}") : ch;
                j += (end >= 0 ? (w.length + 2) : 0);
            }
            colSpec.push(spec);
            cWidth.push(width);
        }
    }
    hAlign = arrayFillDef(hAlign, 'center', numCol);
    vAlign = arrayFillDef(vAlign, 'middle', numCol);
    cWidth = arrayFillDef(cWidth, 'auto', numCol);
    colSpec = arrayFillDef(colSpec, 'c', numCol);
    return { cAlign: hAlign, vAlign: vAlign, cWidth: cWidth, colSpec: colSpec };
};
exports.getVerticallyColumnAlign = getVerticallyColumnAlign;
var getParams = function (str, i) {
    var index = str.indexOf('{', i);
    var res = '';
    var ires = 0;
    if (index < 0) {
        return null;
    }
    var iOpen = 1;
    for (var j = index + 1; j < str.length; j++) {
        ires = j;
        if (str[j] === '{') {
            iOpen++;
            res += str[j];
            continue;
        }
        if (str[j] === '}') {
            iOpen--;
            if (iOpen === 0) {
                ires += 1;
                break;
            }
        }
        res += str[j];
    }
    return { align: res, index: ires };
};
exports.getParams = getParams;
var getDecimal = function (cAlign, cellsAll) {
    var decimal = [];
    cAlign.map(function (item, index) {
        if (item === 'decimal') {
            decimal[index] = { l: 0, r: 0 };
        }
    });
    cellsAll.map(function (item, i) {
        var cells = (0, parse_tabular_1.separateByColumns)(cellsAll[i]);
        cells.map(function (cell, j) {
            if (decimal[j]) {
                var content = (0, exports.getContent)(cell);
                if (parseFloat(content)) {
                    var arr = content.split('.');
                    if (arr[0] && decimal[j].l < arr[0].length) {
                        decimal[j].l = arr[0].length;
                    }
                    if (arr[1] && decimal[j].r < arr[1].length) {
                        decimal[j].r = arr[1].length;
                    }
                }
            }
        });
    });
    return decimal;
};
exports.getDecimal = getDecimal;
var getCellsAll = function (rows) {
    var cellsAll = [];
    for (var i = 0; i < rows.length; i++) {
        cellsAll[i] = rows[i].trim().replace(consts_1.lineSpaceTag, '').trim();
    }
    return cellsAll;
};
exports.getCellsAll = getCellsAll;
var getRowLines = function (rows, numCol) {
    var res = [];
    var resSpace = [];
    var sLines = [];
    for (var i = 0; i < rows.length; i++) {
        var matchR = rows[i].split('\n').join('').trim().match(consts_1.lineSpaceTag);
        if (!matchR) {
            res[i] = new Array(numCol).fill('none');
            resSpace[i] = new Array(numCol).fill('none');
            sLines.push('');
            continue;
        }
        sLines.push(matchR.join(''));
        var str = matchR.join(' ');
        if (!consts_1.RE_CLINE.test(str)) {
            var mS = str.match(/\[(.*?)\]/);
            if (mS && mS[1]) {
                resSpace[i] = new Array(numCol).fill(mS[1]);
                str = str.replace(/\[(.*?)\]/g, '');
            }
            else {
                resSpace[i] = new Array(numCol).fill('none');
            }
            str = str.replace('\\n', '').replace(/\\/g, '');
            res[i] = new Array(numCol).fill(str);
            continue;
        }
        res[i] = new Array(numCol).fill('none');
        resSpace[i] = new Array(numCol).fill('none');
        for (var j = 0; j < matchR.length; j++) {
            var matchCS = matchR[j].match(consts_1.RE_TAG_WITH_CLINE);
            if (matchCS) {
                if (matchCS[2]) {
                    var ic = matchCS[2].trim().replace(/[^\d-]/g, '').split('-');
                    ic[0] = (Number(ic[0]) > 0 ? Number(ic[0]) - 1 : 0).toString();
                    var d = Number(ic[1]) - Number(ic[0]);
                    if (d > 0) {
                        res[i] = res[i].fill('hline', Number(ic[0]), Number(ic[1]));
                        if (matchCS[1]) {
                            resSpace[i] = resSpace[i].fill(matchCS[1], Number(ic[0]), Number(ic[1]));
                        }
                    }
                }
            }
            else {
                var matchC = matchR[j].match(consts_1.RE_CLINE);
                if (matchC && matchC[1]) {
                    var ic = matchC[1].trim().replace(/[^\d-]/g, '').split('-');
                    ic[0] = (Number(ic[0]) > 0 ? Number(ic[0]) - 1 : 0).toString();
                    var d = Number(ic[1]) - Number(ic[0]);
                    if (d > 0) {
                        res[i] = res[i].fill('hline', Number(ic[0]), Number(ic[1]));
                    }
                }
            }
        }
    }
    if (rows.length === res.length) {
        res[res.length] = new Array(numCol).fill('none');
    }
    resSpace[resSpace.length] = new Array(numCol).fill('none');
    return { cLines: res, cSpaces: resSpace, sLines: sLines };
};
exports.getRowLines = getRowLines;
/** Matches "unsafe" single-letter column specs that cannot host block content safely. */
var UNSAFE_COL_SPEC_RE = /^[lcrS]$/;
/**
 * Returns true if the given column spec is a single-letter "unsafe" spec (l/c/r/S).
 *
 * @param spec - Column spec string (e.g. "l", "p{0.3\\textwidth}", "L{...}")
 */
var isUnsafeColSpec = function (spec) { return UNSAFE_COL_SPEC_RE.test(spec); };
/**
 * Checks whether any column listed in `colsToFixWidth` uses an unsafe spec in `colSpec`.
 * Used to decide if tabular column specs must be rewritten to fixed-width paragraph columns.
 *
 * @param colsToFixWidth - Column indices that require fixed width (e.g., columns containing lists)
 * @param colSpec - Original column specs array (e.g., ["l","c","p{...}"])
 */
var shouldRewriteColSpec = function (colsToFixWidth, colSpec) {
    if (!(colsToFixWidth === null || colsToFixWidth === void 0 ? void 0 : colsToFixWidth.length) || !(colSpec === null || colSpec === void 0 ? void 0 : colSpec.length)) {
        return false;
    }
    return colsToFixWidth
        .filter(function (i) { return Number.isInteger(i) && i >= 0 && i < colSpec.length; })
        .some(function (i) { return isUnsafeColSpec(colSpec[i]); });
};
exports.shouldRewriteColSpec = shouldRewriteColSpec;
//# sourceMappingURL=common.js.map
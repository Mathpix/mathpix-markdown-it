"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRowLines = exports.getCellsAll = exports.getDecimal = exports.getParams = exports.getVerticallyColumnAlign = exports.getColumnAlign = exports.getColumnLines = exports.getContent = void 0;
var parse_tabular_1 = require("./parse-tabular");
var lineSpaceTag = /\[(.*?)\]\s{0,}\\hline|\[(.*?)\]\s{0,}\\hhline|\[(.*?)\]\s{0,}\\hdashline|\[(.*?)\]\s{0,}\\cline\s{0,}\{([^}]*)\}|\\hline|\\hhline|\\hdashline|\\cline\s{0,}\{([^}]*)\}|^\[(.*?)\]/g;
exports.getContent = function (content, onlyOne) {
    if (onlyOne === void 0) { onlyOne = false; }
    if (!content) {
        return content;
    }
    content = content.trim();
    if (content[0] === '{' && content[content.length - 1] === '}') {
        content = content.slice(1, content.length - 1);
        if (!onlyOne) {
            content = exports.getContent(content);
        }
    }
    return content;
};
exports.getColumnLines = function (str, numCol) {
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
exports.getColumnAlign = function (align) {
    align = align.replace(/[^clrS|:]/g, '').split('').join('');
    align = align.replace(/[^clrS]/g, '').split('').join(' ');
    align = align
        .replace(/l/g, 'left')
        .replace(/r/g, 'right')
        .replace(/c/g, 'center')
        .replace(/S/g, 'decimal');
    return align ? align.split(' ') : [];
};
var arrayFillDef = function (arr, str, num) {
    if (arr.length < num) {
        return arr.concat(new Array(num - arr.length).fill(str));
    }
    else {
        return arr;
    }
};
exports.getVerticallyColumnAlign = function (align, numCol) {
    var aH = ['c', 'S', 'r', 'l'];
    var aV = ['m', 'p', 'b'];
    var hAlign = [];
    var vAlign = [];
    var cWidth = [];
    align = align.replace(/ /g, '').trim();
    for (var j = 0; j < align.length; j++) {
        if (aH.indexOf(align[j]) >= 0) {
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
        if (aV.indexOf(align[j]) >= 0) {
            switch (align[j]) {
                case 'm':
                    hAlign.push('center');
                    vAlign.push('middle');
                    break;
                case 'p':
                    hAlign.push('left');
                    vAlign.push('top');
                    break;
                case 'b':
                    hAlign.push('center');
                    vAlign.push('bottom');
                    break;
            }
            if (align[j + 1] === '{') {
                var end = align.indexOf('}', j + 1);
                var w = align.slice(j + 2, end);
                cWidth.push(w);
                j += w.length + 2;
            }
        }
    }
    hAlign = arrayFillDef(hAlign, 'center', numCol);
    vAlign = arrayFillDef(vAlign, 'middle', numCol);
    cWidth = arrayFillDef(cWidth, 'auto', numCol);
    return { cAlign: hAlign, vAlign: vAlign, cWidth: cWidth };
};
exports.getParams = function (str, i) {
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
exports.getDecimal = function (cAlign, cellsAll) {
    var decimal = [];
    cAlign.map(function (item, index) {
        if (item === 'decimal') {
            decimal[index] = { l: 0, r: 0 };
        }
    });
    cellsAll.map(function (item, i) {
        var cells = parse_tabular_1.separateByColumns(cellsAll[i]);
        cells.map(function (cell, j) {
            if (decimal[j]) {
                var content = exports.getContent(cell);
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
exports.getCellsAll = function (rows) {
    var cellsAll = [];
    for (var i = 0; i < rows.length; i++) {
        cellsAll[i] = rows[i].trim().replace(lineSpaceTag, '').trim();
    }
    return cellsAll;
};
exports.getRowLines = function (rows, numCol) {
    var res = [];
    var resSpace = [];
    var clineTag = /\\cline\s{0,}\{([^}]*)\}/;
    var clineSpaceTag = /\[(.*?)\]\s{0,}\\cline\s{0,}\{([^}]*)\}/;
    var sLines = [];
    for (var i = 0; i < rows.length; i++) {
        var matchR = rows[i].split('\n').join('').trim().match(lineSpaceTag);
        if (!matchR) {
            res[i] = new Array(numCol).fill('none');
            resSpace[i] = new Array(numCol).fill('none');
            sLines.push('');
            continue;
        }
        sLines.push(matchR.join(''));
        var str = matchR.join(' ');
        if (!clineTag.test(str)) {
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
            var matchCS = matchR[j].match(clineSpaceTag);
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
                var matchC = matchR[j].match(clineTag);
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
//# sourceMappingURL=common.js.map
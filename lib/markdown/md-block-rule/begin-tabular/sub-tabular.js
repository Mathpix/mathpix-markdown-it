"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubTabular = exports.pushSubTabular = exports.ClearSubTableLists = void 0;
var common_1 = require("./common");
var subTabular = [];
exports.ClearSubTableLists = function () {
    subTabular = [];
};
exports.pushSubTabular = function (str, subRes, posBegin, posEnd, i) {
    if (posBegin === void 0) { posBegin = 0; }
    if (i === void 0) { i = 0; }
    var id = "f" + (+new Date + (Math.random() * 100000).toFixed()).toString();
    subTabular.push({ id: id, parsed: subRes });
    if (posBegin > 0) {
        return str.slice(i, posBegin) + ("<<" + id + ">>") + str.slice(posEnd + '\\end{tabular}'.length, str.length);
    }
    else {
        return "<<" + id + ">>" + str.slice(posEnd + '\\end{tabular}'.length, str.length);
    }
};
exports.getSubTabular = function (sub, i, isCell) {
    if (isCell === void 0) { isCell = true; }
    var res = [];
    var lastIndex = 0;
    sub = sub.trim();
    if (isCell) {
        sub = common_1.getContent(sub, true);
    }
    var index = subTabular.findIndex(function (item) { return item.id === sub; });
    if (index >= 0) {
        res = res.concat(subTabular[index].parsed);
        return res;
    }
    var cellM = sub.slice(i).match(/(?:<<([\w]*)>>)/g);
    cellM = cellM ? cellM : sub.slice(i).match(/(?:<([\w]*)>)/g);
    if (!cellM) {
        return null;
    }
    var _loop_1 = function (j) {
        var t = cellM[j].replace(/</g, '').replace(/>/g, '');
        if (!t) {
            return "continue";
        }
        var index_1 = subTabular.findIndex(function (item) { return item.id === t; });
        if (index_1 >= 0) {
            var iB = sub.indexOf(cellM[j]);
            var strB = sub.slice(0, iB).trim();
            lastIndex = iB + cellM[j].length;
            sub = sub.slice(lastIndex);
            var strE = '';
            if (j === cellM.length - 1) {
                strE = sub;
            }
            var st = strB + subTabular[index_1].parsed + strE;
            res.push({ token: 'inline', tag: '', n: 0, content: st, id: subTabular[index_1].id });
        }
    };
    for (var j = 0; j < cellM.length; j++) {
        _loop_1(j);
    }
    return res;
};
//# sourceMappingURL=sub-tabular.js.map
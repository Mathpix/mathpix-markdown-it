"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubTabular = exports.pushSubTabular = exports.ClearSubTableLists = void 0;
var common_1 = require("./common");
var subTabular = [];
var ClearSubTableLists = function () {
    subTabular = [];
};
exports.ClearSubTableLists = ClearSubTableLists;
var pushSubTabular = function (str, subRes, posBegin, posEnd, i, level) {
    if (posBegin === void 0) { posBegin = 0; }
    if (i === void 0) { i = 0; }
    if (level === void 0) { level = 0; }
    var id = "f".concat((+new Date + (Math.random() * 100000).toFixed()).toString());
    if (typeof subRes === 'string') {
        var match = subRes.match(/(?:<<([\w]*)>>)/g);
        match = match ? match : subRes.match(/(?:<([\w]*)>)/g);
        if (match) {
            var _loop_1 = function (j) {
                var idSubTable = match[j].replace(/</g, '').replace(/>/g, '');
                if (!idSubTable) {
                    return "continue";
                }
                var index = subTabular.findIndex(function (item) { return item.id === idSubTable; });
                if (index < 0) {
                    return "continue";
                }
                if (subTabular[index].parents) {
                    subTabular[index].parents.push(id);
                }
                else {
                    subTabular[index].parents = [id];
                }
            };
            for (var j = 0; j < match.length; j++) {
                _loop_1(j);
            }
        }
    }
    subTabular.push({ id: id, parsed: subRes });
    if (posBegin > 0) {
        return str.slice(i, posBegin) + "<<".concat(id, ">>") + str.slice(posEnd + '\\end{tabular}'.length, str.length);
    }
    else {
        return "<<".concat(id, ">>") + str.slice(posEnd + '\\end{tabular}'.length, str.length);
    }
};
exports.pushSubTabular = pushSubTabular;
var getSubTabular = function (sub, i, isCell, forLatex) {
    if (isCell === void 0) { isCell = true; }
    if (forLatex === void 0) { forLatex = false; }
    var res = [];
    var lastIndex = 0;
    sub = sub.trim();
    if (isCell) {
        sub = (0, common_1.getContent)(sub, true);
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
    var _loop_2 = function (j) {
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
            if (forLatex) {
                res.push({ token: 'inline', tag: '', n: 0, content: st, id: subTabular[index_1].id });
            }
            else {
                res.push({
                    token: 'inline',
                    tag: '',
                    n: 0,
                    content: st,
                    id: subTabular[index_1].id,
                    parents: subTabular[index_1].parents,
                    type: 'subTabular'
                });
            }
        }
    };
    for (var j = 0; j < cellM.length; j++) {
        _loop_2(j);
    }
    return res;
};
exports.getSubTabular = getSubTabular;
//# sourceMappingURL=sub-tabular.js.map
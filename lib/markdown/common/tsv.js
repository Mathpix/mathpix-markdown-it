"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inner_tsv = [];
exports.tsvPush = function (item) {
    inner_tsv.push(item);
};
exports.getTsv = function () {
    return inner_tsv;
};
exports.clearTsv = function () {
    inner_tsv = [];
};
var renderColl = function (coll, id, children) {
    try {
        var i = coll.indexOf(id);
        if (i > -1) {
            if (children.length > 0) {
                var str_1 = '';
                children.forEach(function (item) {
                    str_1 += str_1.length > 0 ? ' ' : '';
                    str_1 += item.type === 'tabular_inline' && item.tsvList ? item.tsvList.join(',') : item.content;
                });
                return coll.slice(0, i) + str_1 + coll.slice(i + id.length);
            }
            else {
                return coll.slice(0, i) + inner_tsv.join(',') + coll.slice(i + id.length);
            }
        }
        else {
            return coll;
        }
    }
    catch (e) {
        return coll;
    }
};
exports.MergeIneerTsvToTsv = function (inner_tsv, tsv, id, children) {
    try {
        return tsv.map(function (item) {
            return item.map(function (coll) { return renderColl(coll, id, children); });
        });
    }
    catch (e) {
        return tsv;
    }
};
exports.TsvJoin = function (tsv, options) {
    var _a = options.outMath.tsv_separators, tsv_separators = _a === void 0 ? {} : _a;
    var _b = tsv_separators.column, column = _b === void 0 ? '\t' : _b, _c = tsv_separators.row, row = _c === void 0 ? '\n' : _c;
    if (!tsv || tsv.length === 0) {
        return '';
    }
    return tsv.map(function (row) { return row.join(column); }).join(row);
};
//# sourceMappingURL=tsv.js.map
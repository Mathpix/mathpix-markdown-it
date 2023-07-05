"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsvJoin = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
var TsvJoin = function (tsv, options) {
    var _a = options.outMath.tsv_separators, tsv_separators = _a === void 0 ? tslib_1.__assign({}, consts_1.tsvSeparatorsDef) : _a;
    var column = tsv_separators.column, row = tsv_separators.row;
    if (!tsv || tsv.length === 0) {
        return '';
    }
    return tsv.map(function (row) { return row.join(column); }).join(row);
};
exports.TsvJoin = TsvJoin;
//# sourceMappingURL=tsv.js.map
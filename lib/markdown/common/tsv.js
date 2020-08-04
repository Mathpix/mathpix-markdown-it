"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsvJoin = void 0;
exports.TsvJoin = function (tsv, options) {
    var _a = options.outMath.tsv_separators, tsv_separators = _a === void 0 ? {} : _a;
    var _b = tsv_separators.column, column = _b === void 0 ? '\t' : _b, _c = tsv_separators.row, row = _c === void 0 ? '\n' : _c;
    if (!tsv || tsv.length === 0) {
        return '';
    }
    return tsv.map(function (row) { return row.join(column); }).join(row);
};
//# sourceMappingURL=tsv.js.map
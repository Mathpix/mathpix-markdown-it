"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapesCsvField = exports.CsvJoin = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
exports.CsvJoin = function (csv, options, isSub) {
    var _a = options.outMath.csv_separators, csv_separators = _a === void 0 ? tslib_1.__assign({}, consts_1.csvSeparatorsDef) : _a;
    var _b = csv_separators.column, column = _b === void 0 ? consts_1.csvSeparatorsDef.column : _b, _c = csv_separators.row, row = _c === void 0 ? consts_1.csvSeparatorsDef.row : _c;
    if (!csv || csv.length === 0) {
        return '';
    }
    if (isSub) {
        return csv.map(function (row) { return row.join(column); }).join(row);
    }
    else {
        return csv.map(function (row) {
            row = row.map(function (cell) { return exports.escapesCsvField(cell, options); });
            return row.join(column);
        }).join(row);
    }
};
exports.escapesCsvField = function (cell, options) {
    var _a = options.outMath.csv_separators, csv_separators = _a === void 0 ? tslib_1.__assign({}, consts_1.csvSeparatorsDef) : _a;
    var _b = csv_separators.toQuoteAllFields, toQuoteAllFields = _b === void 0 ? false : _b;
    var regExpDoubleQuotes = /(")/g;
    var regExpSymbolsShouldBeEnclosed = /("|,|\r\n|\n|\r)/g;
    if (!cell) {
        return '';
    }
    if (regExpSymbolsShouldBeEnclosed.test(cell)) {
        cell = cell.replace(regExpDoubleQuotes, '""');
        return '"' + cell + '"';
    }
    return toQuoteAllFields ? '"' + cell + '"' : cell;
};
//# sourceMappingURL=csv.js.map
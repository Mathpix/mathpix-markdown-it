"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInDiagboxTable = exports.extractNextBraceContent = exports.getSubDiagbox = exports.ClearDiagboxTable = void 0;
var tslib_1 = require("tslib");
var common_1 = require("./common");
var consts_1 = require("../../common/consts");
var common_2 = require("../../common");
var diagboxTable = new Map();
var diagboxById = new Map();
var ClearDiagboxTable = function () {
    diagboxTable.clear();
    diagboxById.clear();
};
exports.ClearDiagboxTable = ClearDiagboxTable;
var getSubDiagbox = function (str) {
    var result = '';
    var lastIndex = 0;
    var match;
    while ((match = consts_1.reDiagboxG.exec(str))) {
        var index = match.index;
        var _a = tslib_1.__read((0, exports.extractNextBraceContent)(str, index + match[0].length), 2), left = _a[0], newIndex = _a[1];
        var _b = tslib_1.__read((0, exports.extractNextBraceContent)(str, newIndex), 2), right = _b[0], endIndex = _b[1];
        var fullMatch = "".concat(match[0], "{").concat(left, "}{").concat(right, "}");
        var id = diagboxTable.get(fullMatch);
        if (!id) {
            id = (0, common_1.generateUniqueId)();
            diagboxTable.set(fullMatch, id);
            diagboxById.set(id, fullMatch);
        }
        result += str.slice(lastIndex, index) + "<<".concat(id, ">>");
        lastIndex = endIndex;
    }
    result += str.slice(lastIndex);
    return result;
};
exports.getSubDiagbox = getSubDiagbox;
// Through the shared matcher, so `\backslashbox{a \\}{b}` pairs by backslash parity like every other
// argument does: reading one `\` back made the `\\` shield the brace and cost both diagonal cells.
var extractNextBraceContent = function (str, startIndex) {
    if (str[startIndex] !== '{') {
        return ['', startIndex];
    }
    var codePositions = (0, common_2.buildInlineCodePositionSet)((0, common_2.getInlineCodeListFromString)(str));
    var found = (0, common_2.findEndMarker)(str, startIndex, '{', '}', false, 0, codePositions);
    return found.res ? [found.content, found.nextPos] : ['', startIndex];
};
exports.extractNextBraceContent = extractNextBraceContent;
var findInDiagboxTable = function (id) {
    return diagboxById.get(id);
};
exports.findInDiagboxTable = findInDiagboxTable;
//# sourceMappingURL=sub-cell.js.map
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
var extractNextBraceContent = function (str, startIndex) {
    var depth = 0, content = '', i = startIndex;
    var firstChar = str[startIndex];
    if (firstChar !== '{') {
        return ['', startIndex];
    }
    var beforeCharCode = 0;
    var codePositions = (0, common_2.buildInlineCodePositionSet)((0, common_2.getInlineCodeListFromString)(str));
    while (i < str.length) {
        var char = str[i];
        if (beforeCharCode !== 0x5c /* \ */ && !codePositions.has(i)) {
            if (char === '{' && depth++ === 0) {
                i++;
                continue;
            }
            if (char === '}' && --depth === 0)
                return [content, i + 1];
        }
        content += char;
        beforeCharCode = str.charCodeAt(i);
        i++;
    }
    return ['', startIndex];
};
exports.extractNextBraceContent = extractNextBraceContent;
var findInDiagboxTable = function (id) {
    return diagboxById.get(id);
};
exports.findInDiagboxTable = findInDiagboxTable;
//# sourceMappingURL=sub-cell.js.map
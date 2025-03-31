"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInDiagboxTable = exports.extractNextBraceContent = exports.getSubDiagbox = void 0;
var tslib_1 = require("tslib");
var common_1 = require("./common");
var consts_1 = require("../../common/consts");
var common_2 = require("../../common");
var diagboxTable = new Map();
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
    var inlineCodeList = (0, common_2.getInlineCodeListFromString)(str);
    while (i < str.length) {
        var char = str[i];
        var isCode = (inlineCodeList === null || inlineCodeList === void 0 ? void 0 : inlineCodeList.length)
            ? inlineCodeList.find(function (item) { return item.posStart <= i && item.posEnd >= i; })
            : null;
        if (beforeCharCode !== 0x5c /* \ */ && !isCode) {
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
    var e_1, _a;
    try {
        for (var diagboxTable_1 = tslib_1.__values(diagboxTable), diagboxTable_1_1 = diagboxTable_1.next(); !diagboxTable_1_1.done; diagboxTable_1_1 = diagboxTable_1.next()) {
            var _b = tslib_1.__read(diagboxTable_1_1.value, 2), key = _b[0], value = _b[1];
            if (value === id) {
                return key;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (diagboxTable_1_1 && !diagboxTable_1_1.done && (_a = diagboxTable_1.return)) _a.call(diagboxTable_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return undefined;
};
exports.findInDiagboxTable = findInDiagboxTable;
//# sourceMappingURL=sub-cell.js.map
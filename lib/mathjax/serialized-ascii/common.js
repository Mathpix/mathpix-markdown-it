"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.needFirstSpaceBeforeCurrentNode = exports.needSpaceBetweenLetters = exports.needFirstSpaceBeforeLetter = exports.getLastItemFromSerializedStack = exports.getLastSymbolFromSerializedStack = exports.clearSerializedChildStack = exports.pushToSerializedStack = exports.AddToAsciiData = exports.regW = exports.regLetter = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
exports.regLetter = /^[a-zA-Z]/;
exports.regW = /^\w/;
var AddToAsciiData = function (data, arr, serialize, node) {
    if (node === void 0) { node = null; }
    if ((arr === null || arr === void 0 ? void 0 : arr.length) > 3) {
        data.ascii += arr[0];
        data.ascii_tsv += arr[1];
        data.ascii_csv += arr[2];
        data.ascii_md += arr[3];
        (0, exports.pushToSerializedStack)(serialize, {
            ascii: arr[0],
            ascii_tsv: arr[1],
            ascii_csv: arr[2],
            ascii_md: arr[3],
        }, node);
        return data;
    }
    data.ascii += arr[0];
    data.ascii_tsv += arr[0];
    data.ascii_csv += arr[0];
    data.ascii_md += arr[0];
    (0, exports.pushToSerializedStack)(serialize, {
        ascii: arr[0],
        ascii_tsv: arr[0],
        ascii_csv: arr[0],
        ascii_md: arr[0],
    }, node);
    return data;
};
exports.AddToAsciiData = AddToAsciiData;
var pushToSerializedStack = function (serialize, data, node) {
    var _a, _b;
    if (node === void 0) { node = null; }
    if (serialize.notApplyToSerializedStack) {
        return;
    }
    if (!data.ascii && !data.ascii_tsv && !data.ascii_csv && !data.ascii_md) {
        return;
    }
    if (serialize.isSerializeChildStack) {
        if ((_a = serialize.serializedChildStack) === null || _a === void 0 ? void 0 : _a.length) {
            var lastItem = serialize.serializedChildStack[serialize.serializedChildStack.length - 1];
            if (lastItem.ascii === data.ascii
                && lastItem.ascii_tsv === data.ascii_tsv
                && lastItem.ascii_csv === data.ascii_csv
                && lastItem.ascii_md === data.ascii_md
                && (!node
                    || lastItem.texClass === node.texClass
                    || lastItem.kind === node.kind)) {
                return;
            }
            else {
                serialize.serializedChildStack.push(tslib_1.__assign(tslib_1.__assign({}, data), { kind: (node === null || node === void 0 ? void 0 : node.kind) ? node === null || node === void 0 ? void 0 : node.kind : '', texClass: node ? node === null || node === void 0 ? void 0 : node.texClass : -1 }));
            }
        }
        else {
            serialize.serializedChildStack.push(tslib_1.__assign(tslib_1.__assign({}, data), { kind: (node === null || node === void 0 ? void 0 : node.kind) ? node === null || node === void 0 ? void 0 : node.kind : '', texClass: node ? node === null || node === void 0 ? void 0 : node.texClass : -1 }));
        }
    }
    else {
        if ((_b = serialize.serializedStack) === null || _b === void 0 ? void 0 : _b.length) {
            var lastItem = serialize.serializedStack[serialize.serializedStack.length - 1];
            if (lastItem.ascii === data.ascii
                && lastItem.ascii_tsv === data.ascii_tsv
                && lastItem.ascii_csv === data.ascii_csv
                && lastItem.ascii_md === data.ascii_md
                && (!node
                    || lastItem.texClass === node.texClass
                    || lastItem.kind === node.kind)) {
                return;
            }
            else {
                serialize.serializedStack.push(tslib_1.__assign(tslib_1.__assign({}, data), { kind: (node === null || node === void 0 ? void 0 : node.kind) ? node === null || node === void 0 ? void 0 : node.kind : '', texClass: node ? node === null || node === void 0 ? void 0 : node.texClass : -1 }));
            }
        }
        else {
            serialize.serializedStack.push(tslib_1.__assign(tslib_1.__assign({}, data), { kind: (node === null || node === void 0 ? void 0 : node.kind) ? node === null || node === void 0 ? void 0 : node.kind : '', texClass: node ? node === null || node === void 0 ? void 0 : node.texClass : -1 }));
        }
    }
};
exports.pushToSerializedStack = pushToSerializedStack;
var clearSerializedChildStack = function (serialize) {
    serialize.serializedChildStack = [];
};
exports.clearSerializedChildStack = clearSerializedChildStack;
var getLastSymbolFromSerializedStack = function (serialize) {
    var _a, _b, _c;
    var lastResAscii = null;
    if (serialize.isSerializeChildStack) {
        lastResAscii = ((_a = serialize.serializedChildStack) === null || _a === void 0 ? void 0 : _a.length)
            ? serialize.serializedChildStack[serialize.serializedChildStack.length - 1]
            : null;
    }
    else {
        lastResAscii = ((_b = serialize.serializedStack) === null || _b === void 0 ? void 0 : _b.length)
            ? serialize.serializedStack[serialize.serializedStack.length - 1]
            : null;
    }
    return lastResAscii && ((_c = lastResAscii.ascii) === null || _c === void 0 ? void 0 : _c.length)
        ? lastResAscii.ascii[lastResAscii.ascii.length - 1]
        : '';
};
exports.getLastSymbolFromSerializedStack = getLastSymbolFromSerializedStack;
var getLastItemFromSerializedStack = function (serialize) {
    var _a, _b;
    var lastResAscii = null;
    if (serialize.isSerializeChildStack) {
        lastResAscii = ((_a = serialize.serializedChildStack) === null || _a === void 0 ? void 0 : _a.length)
            ? serialize.serializedChildStack[serialize.serializedChildStack.length - 1]
            : null;
    }
    else {
        lastResAscii = ((_b = serialize.serializedStack) === null || _b === void 0 ? void 0 : _b.length)
            ? serialize.serializedStack[serialize.serializedStack.length - 1]
            : null;
    }
    return lastResAscii;
};
exports.getLastItemFromSerializedStack = getLastItemFromSerializedStack;
var needFirstSpaceBeforeLetter = function (node, currentText, serialize) {
    var _a, _b, _c;
    try {
        var lastResAscii = (0, exports.getLastItemFromSerializedStack)(serialize);
        var lastSymbol = lastResAscii && ((_a = lastResAscii.ascii) === null || _a === void 0 ? void 0 : _a.length)
            ? lastResAscii.ascii[lastResAscii.ascii.length - 1]
            : '';
        if (!exports.regW.test(lastSymbol) || lastResAscii.kind === 'inferredMrow' || lastResAscii.kind === 'mtd') {
            return false;
        }
        if (lastResAscii.texClass === MmlNode_1.TEXCLASS.OP && exports.regW.test(currentText[0])) {
            return true;
        }
        if (lastResAscii.kind === 'TeXAtom' && lastResAscii.texClass !== MmlNode_1.TEXCLASS.OP) {
            return false;
        }
        if (exports.regLetter.test(lastSymbol)) {
            return (currentText === null || currentText === void 0 ? void 0 : currentText.length) && exports.regLetter.test(currentText[0])
                && ((currentText === null || currentText === void 0 ? void 0 : currentText.length) > 1 || ((_c = (_b = lastResAscii.ascii) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.length) > 1);
        }
        else {
            if (['mi', 'mo', 'mn'].includes(lastResAscii.kind)) {
                return (currentText === null || currentText === void 0 ? void 0 : currentText.length) > 1 && exports.regLetter.test(currentText[0])
                    && ((node.texClass === MmlNode_1.TEXCLASS.OP && node.kind === 'mi')
                        || (node.texClass === MmlNode_1.TEXCLASS.INNER && node.kind === 'mo'));
            }
            else {
                return (currentText === null || currentText === void 0 ? void 0 : currentText.length) > 1
                    && exports.regLetter.test(currentText[0]);
            }
        }
    }
    catch (e) {
        return false;
    }
};
exports.needFirstSpaceBeforeLetter = needFirstSpaceBeforeLetter;
var needSpaceBetweenLetters = function (strBefore, strAfter) {
    if ((strBefore === null || strBefore === void 0 ? void 0 : strBefore.length) && (strAfter === null || strAfter === void 0 ? void 0 : strAfter.length)) {
        return exports.regLetter.test(strBefore[strBefore.length - 1])
            && exports.regLetter.test(strAfter[0]);
    }
    return false;
};
exports.needSpaceBetweenLetters = needSpaceBetweenLetters;
var needFirstSpaceBeforeCurrentNode = function (node, serialize) {
    var _a;
    try {
        var isOperation = false;
        if (node.hasOwnProperty('texClass')) {
            isOperation = node.texClass === MmlNode_1.TEXCLASS.OP;
        }
        else {
            isOperation = ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.texClass) === MmlNode_1.TEXCLASS.OP;
        }
        var lastSymbol = (0, exports.getLastSymbolFromSerializedStack)(serialize);
        return isOperation && exports.regLetter.test(lastSymbol);
    }
    catch (e) {
        return false;
    }
};
exports.needFirstSpaceBeforeCurrentNode = needFirstSpaceBeforeCurrentNode;
//# sourceMappingURL=common.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsParens = exports.addToTypstData = exports.initTypstData = void 0;
var initTypstData = function () {
    return { typst: '' };
};
exports.initTypstData = initTypstData;
var addToTypstData = function (dataOutput, dataInput) {
    dataOutput.typst += dataInput.typst;
    return dataOutput;
};
exports.addToTypstData = addToTypstData;
var needsParens = function (s) {
    if (s.length <= 1) {
        return false;
    }
    if (/^\(.*\)$/.test(s) || /^\{.*\}$/.test(s) || /^\[.*\]$/.test(s)) {
        return false;
    }
    return true;
};
exports.needsParens = needsParens;
//# sourceMappingURL=common.js.map
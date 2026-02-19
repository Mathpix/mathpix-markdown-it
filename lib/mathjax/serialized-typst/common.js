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
    // In Typst, sub/superscript grouping always uses (): x^(content), x_(content)
    // Even if the content itself starts/ends with () — those are literal, not grouping.
    // e.g. f^{(n)} in LaTeX → f^((n)) in Typst (outer = grouping, inner = literal)
    if (s.length <= 1) {
        return false;
    }
    return true;
};
exports.needsParens = needsParens;
//# sourceMappingURL=common.js.map
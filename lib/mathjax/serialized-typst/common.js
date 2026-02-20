"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsParens = exports.addSpaceToTypstData = exports.addToTypstData = exports.initTypstData = void 0;
var initTypstData = function () {
    return { typst: '' };
};
exports.initTypstData = initTypstData;
var addToTypstData = function (dataOutput, dataInput) {
    var _a;
    dataOutput.typst += dataInput.typst;
    // Always propagate inline variant: use explicit typst_inline if set,
    // otherwise fall back to typst (inline == block for most nodes).
    dataOutput.typst_inline = ((_a = dataOutput.typst_inline) !== null && _a !== void 0 ? _a : '')
        + (dataInput.typst_inline !== undefined ? dataInput.typst_inline : dataInput.typst);
    return dataOutput;
};
exports.addToTypstData = addToTypstData;
/** Add a separator space to both typst and typst_inline fields. */
var addSpaceToTypstData = function (data) {
    data.typst += ' ';
    if (data.typst_inline !== undefined) {
        data.typst_inline += ' ';
    }
};
exports.addSpaceToTypstData = addSpaceToTypstData;
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
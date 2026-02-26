"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsParens = exports.needsTokenSeparator = exports.isThousandSepComma = exports.addSpaceToTypstData = exports.addToTypstData = exports.initTypstData = void 0;
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
/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(exactly 3 digits). Returns true if pattern matches. */
var isThousandSepComma = function (node, i) {
    var _a, _b, _c, _d;
    try {
        if (i + 2 >= node.childNodes.length)
            return false;
        var child = node.childNodes[i];
        var comma = node.childNodes[i + 1];
        var next = node.childNodes[i + 2];
        return (child === null || child === void 0 ? void 0 : child.kind) === 'mn'
            && (comma === null || comma === void 0 ? void 0 : comma.kind) === 'mo' && ((_b = (_a = comma === null || comma === void 0 ? void 0 : comma.childNodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) === ','
            && (next === null || next === void 0 ? void 0 : next.kind) === 'mn' && /^\d{3}$/.test(((_d = (_c = next === null || next === void 0 ? void 0 : next.childNodes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) || '');
    }
    catch (_e) {
        return false;
    }
};
exports.isThousandSepComma = isThousandSepComma;
/** Check if a space separator is needed between two adjacent Typst tokens.
 *  Returns true when `next` starts with a word/dot/quote character
 *  and `prev` doesn't end with a natural separator (whitespace, open paren, etc.). */
var needsTokenSeparator = function (prev, next) {
    return !!prev && !!next
        && /^[\w."\u0080-\uFFFF]/.test(next)
        && !/[\s({[,|]$/.test(prev);
};
exports.needsTokenSeparator = needsTokenSeparator;
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
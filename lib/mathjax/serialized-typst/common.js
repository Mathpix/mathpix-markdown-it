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
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
var isThousandSepComma = function (node, i) {
    var _a, _b, _c, _d, _f, _g, _h, _j;
    try {
        if (i + 2 >= node.childNodes.length)
            return false;
        var child = node.childNodes[i];
        var comma = node.childNodes[i + 1];
        var next = node.childNodes[i + 2];
        if ((child === null || child === void 0 ? void 0 : child.kind) !== 'mn')
            return false;
        if ((comma === null || comma === void 0 ? void 0 : comma.kind) !== 'mo' || ((_b = (_a = comma === null || comma === void 0 ? void 0 : comma.childNodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) !== ',')
            return false;
        if ((next === null || next === void 0 ? void 0 : next.kind) !== 'mn')
            return false;
        var nextText = ((_d = (_c = next === null || next === void 0 ? void 0 : next.childNodes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) || '';
        // Standard: exactly 3 digits after comma
        if (/^\d{3}$/.test(nextText))
            return true;
        // Indian numbering: exactly 2 digits — accept if the chain eventually reaches a 3-digit group
        if (/^\d{2}$/.test(nextText)) {
            var j = i + 2;
            while (j + 2 < node.childNodes.length) {
                var nc = node.childNodes[j + 1];
                var nn = node.childNodes[j + 2];
                if ((nc === null || nc === void 0 ? void 0 : nc.kind) !== 'mo' || ((_g = (_f = nc === null || nc === void 0 ? void 0 : nc.childNodes) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.text) !== ',')
                    break;
                if ((nn === null || nn === void 0 ? void 0 : nn.kind) !== 'mn')
                    break;
                var nt = ((_j = (_h = nn === null || nn === void 0 ? void 0 : nn.childNodes) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.text) || '';
                if (/^\d{3}$/.test(nt))
                    return true;
                if (!/^\d{2}$/.test(nt))
                    break;
                j += 2;
            }
        }
        return false;
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
    if (!prev || !next)
        return false;
    // No space before phantom subscript/superscript base (""_ or ""^)
    if (/^""[_^]/.test(next))
        return false;
    return /^[\w."\u0080-\uFFFF]/.test(next)
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
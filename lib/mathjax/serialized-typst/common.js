"use strict";
// --- Regex Constants ---
// Centralized regex patterns used across handlers.ts, index.ts, and common.ts.
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsParens = exports.needsTokenSeparator = exports.isThousandSepComma = exports.addSpaceToTypstData = exports.addToTypstData = exports.initTypstData = exports.RE_SEPARATOR_END = exports.RE_TOKEN_START = exports.RE_PHANTOM_BASE = exports.RE_TWO_DIGITS = exports.RE_THREE_DIGITS = exports.RE_TRAILING_SPACING = exports.RE_UNICODE_SPACES = exports.RE_BRACKET_CHARS = exports.RE_TAG_STRIP = exports.RE_TAG_EXTRACT = exports.RE_OP_WRAPPER = exports.RE_WORD_START = exports.RE_WORD_DOT_START = exports.RE_WORD_DOT_END = exports.RE_CONTENT_SPECIAL = exports.RE_NBSP = void 0;
/** Non-breaking space U+00A0 (global replacement) */
exports.RE_NBSP = /\u00A0/g;
/** Content-mode special characters: * _ ` @ # < (must be escaped in Typst [...]) */
exports.RE_CONTENT_SPECIAL = /[*_`@#<]/g;
/** Word char or dot at end of string */
exports.RE_WORD_DOT_END = /[\w.]$/;
/** Word char or dot at start of string */
exports.RE_WORD_DOT_START = /^[\w.]/;
/** Word char at start of string */
exports.RE_WORD_START = /^\w/;
/** Detects op() wrapper prefix */
exports.RE_OP_WRAPPER = /^op\(/;
/** Extracts \tag{...} content from mtext */
exports.RE_TAG_EXTRACT = /\\tag\{([^}]+)\}/;
/** Strips \tag{...} with optional leading whitespace (global) */
exports.RE_TAG_STRIP = /\s*\\tag\{[^}]+\}/g;
/** Any ASCII bracket character */
exports.RE_BRACKET_CHARS = /[\[\](){}]/;
/** Unicode thin/medium/narrow spaces and NBSP */
exports.RE_UNICODE_SPACES = /[\u2006\u2005\u2004\u2009\u200A\u00A0]/g;
/** Trailing Typst spacing keywords */
exports.RE_TRAILING_SPACING = /\s+(?:med|thin|thick|quad)$/;
/** Exactly 3 digits (thousand separator) */
exports.RE_THREE_DIGITS = /^\d{3}$/;
/** Exactly 2 digits (Indian numbering) */
exports.RE_TWO_DIGITS = /^\d{2}$/;
/** Phantom subscript/superscript base pattern */
exports.RE_PHANTOM_BASE = /^""[_^]/;
/** Token start: word char, dot, quote, or non-ASCII */
exports.RE_TOKEN_START = /^[\w."\u0080-\uFFFF]/;
/** Natural separator at end of string */
exports.RE_SEPARATOR_END = /[\s({[,|]$/;
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
        if (exports.RE_THREE_DIGITS.test(nextText))
            return true;
        // Indian numbering: exactly 2 digits — accept if the chain eventually reaches a 3-digit group
        if (exports.RE_TWO_DIGITS.test(nextText)) {
            var j = i + 2;
            while (j + 2 < node.childNodes.length) {
                var nc = node.childNodes[j + 1];
                var nn = node.childNodes[j + 2];
                if ((nc === null || nc === void 0 ? void 0 : nc.kind) !== 'mo' || ((_g = (_f = nc === null || nc === void 0 ? void 0 : nc.childNodes) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.text) !== ',')
                    break;
                if ((nn === null || nn === void 0 ? void 0 : nn.kind) !== 'mn')
                    break;
                var nt = ((_j = (_h = nn === null || nn === void 0 ? void 0 : nn.childNodes) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.text) || '';
                if (exports.RE_THREE_DIGITS.test(nt))
                    return true;
                if (!exports.RE_TWO_DIGITS.test(nt))
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
    if (exports.RE_PHANTOM_BASE.test(next))
        return false;
    return exports.RE_TOKEN_START.test(next)
        && !exports.RE_SEPARATOR_END.test(prev);
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
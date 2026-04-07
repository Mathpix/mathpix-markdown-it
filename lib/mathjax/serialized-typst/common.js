"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNegationOverlay = exports.getContentChildren = exports.getProp = exports.getAttrs = exports.getNodeText = exports.getChildText = exports.getSiblingIndex = exports.isFirstChild = exports.needsTokenSeparator = exports.isNonLatinText = exports.isThousandSepComma = void 0;
var tslib_1 = require("tslib");
var MmlNode_js_1 = require("mathjax-full/js/core/MmlTree/MmlNode.js");
var consts_1 = require("./consts");
var typst_symbol_map_1 = require("./typst-symbol-map");
/** Unicode negation slash used by MathJax for \not overlay (U+29F8) */
var NEGATION_SLASH = '\u29F8';
/** Any escaped bracket at start: \( \) \[ \] \{ \} */
var RE_ESCAPED_BRACKET_START = /^\\[()[\]{}]/;
/** Any escaped bracket at end: ...\( ...\) etc. — NOT a natural separator */
var RE_ESCAPED_BRACKET_END = /\\[()[\]{}]$/;
/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
var isThousandSepComma = function (node, i) {
    var children = node.childNodes;
    if (!children || i < 0 || i + 2 >= children.length) {
        return false;
    }
    var child = children[i];
    var comma = children[i + 1];
    var next = children[i + 2];
    if ((child === null || child === void 0 ? void 0 : child.kind) !== 'mn') {
        return false;
    }
    if ((comma === null || comma === void 0 ? void 0 : comma.kind) !== 'mo' || (0, exports.getChildText)(comma) !== ',') {
        return false;
    }
    if ((next === null || next === void 0 ? void 0 : next.kind) !== 'mn') {
        return false;
    }
    var nextText = (0, exports.getChildText)(next);
    // Standard: exactly 3 digits after comma
    if (consts_1.RE_THREE_DIGITS.test(nextText)) {
        return true;
    }
    // Indian numbering: exactly 2 digits — accept if the chain eventually reaches a 3-digit group
    if (!consts_1.RE_TWO_DIGITS.test(nextText)) {
        return false;
    }
    var j = i + 2;
    while (j + 2 < children.length) {
        var nextComma = children[j + 1];
        var nextNode = children[j + 2];
        if ((nextComma === null || nextComma === void 0 ? void 0 : nextComma.kind) !== 'mo' || (0, exports.getChildText)(nextComma) !== ',') {
            return false;
        }
        if ((nextNode === null || nextNode === void 0 ? void 0 : nextNode.kind) !== 'mn') {
            return false;
        }
        var nextDigits = (0, exports.getChildText)(nextNode);
        if (consts_1.RE_THREE_DIGITS.test(nextDigits)) {
            return true;
        }
        if (!consts_1.RE_TWO_DIGITS.test(nextDigits)) {
            return false;
        }
        j += 2;
    }
    return false;
};
exports.isThousandSepComma = isThousandSepComma;
/** Check if text is a non-Latin script character (Devanagari, Arabic, CJK, etc.)
 *  that is NOT a known math symbol with a Typst mapping. */
var isNonLatinText = function (text) {
    // Must consist of letters and combining marks only (not math symbols \p{S})
    if (!consts_1.RE_LETTERS_AND_MARKS.test(text)) {
        return false;
    }
    // Latin letters with combining marks (k̸, ñ, etc.) are NOT non-Latin
    if (consts_1.RE_LATIN_WITH_MARKS.test(text)) {
        return false;
    }
    // Must NOT be a known math symbol (∂→partial, ψ→psi, ∅→emptyset, etc.)
    if (typst_symbol_map_1.typstSymbolMap.has(text)) {
        return false;
    }
    return true;
};
exports.isNonLatinText = isNonLatinText;
/** Check if a space separator is needed between two adjacent Typst tokens. */
var needsTokenSeparator = function (prev, next) {
    if (!prev || !next) {
        return false;
    }
    if (consts_1.RE_PHANTOM_BASE.test(next)) {
        return false;
    }
    // Standard check: next starts with word/dot/quote, prev doesn't end with separator
    if (consts_1.RE_TOKEN_START.test(next)) {
        // Escaped bracket at end (\( \) \[ etc.) is NOT a separator
        var prevIsSeparator = consts_1.RE_SEPARATOR_END.test(prev) && !RE_ESCAPED_BRACKET_END.test(prev);
        return !prevIsSeparator;
    }
    // Any escaped bracket at start of next needs space after word/dot chars
    if (RE_ESCAPED_BRACKET_START.test(next)) {
        return consts_1.RE_WORD_DOT_END.test(prev);
    }
    return false;
};
exports.needsTokenSeparator = needsTokenSeparator;
/** Check if a node is the first child of its parent. */
var isFirstChild = function (node) {
    return !!node.parent && node.parent.childNodes[0] === node;
};
exports.isFirstChild = isFirstChild;
/** Find the index of a node among its parent's childNodes. Returns -1 if not found. */
var getSiblingIndex = function (node) {
    if (!node.parent || !node.parent.childNodes) {
        return -1;
    }
    return node.parent.childNodes.indexOf(node);
};
exports.getSiblingIndex = getSiblingIndex;
/** Get text content of a node's first child (TextNode).
 *  Safe: returns '' if node has no children or first child is not a TextNode. */
var getChildText = function (node) {
    var _a;
    var child = (_a = node === null || node === void 0 ? void 0 : node.childNodes) === null || _a === void 0 ? void 0 : _a[0];
    return child instanceof MmlNode_js_1.TextNode ? child.getText() : '';
};
exports.getChildText = getChildText;
/** Concatenate direct TextNode children of a node (non-recursive). */
var getNodeText = function (node) {
    var e_1, _a;
    if (!(node === null || node === void 0 ? void 0 : node.childNodes)) {
        return '';
    }
    var text = '';
    try {
        for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            if (child instanceof MmlNode_js_1.TextNode) {
                text += child.getText();
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return text;
};
exports.getNodeText = getNodeText;
/** Get typed attributes from a node. The single `as T` cast localises the any boundary. */
var getAttrs = function (node) {
    return node.attributes.getAllAttributes();
};
exports.getAttrs = getAttrs;
/** Get a typed property from a node. Accepts nullable node for convenience (returns undefined). */
var getProp = function (node, key) {
    return node === null || node === void 0 ? void 0 : node.getProperty(key);
};
exports.getProp = getProp;
/** Return child nodes excluding the first/last mo (delimiter fences from \left...\right). */
var getContentChildren = function (node) {
    return node.childNodes.filter(function (child, i) {
        return !(child.kind === 'mo' && (i === 0 || i === node.childNodes.length - 1));
    });
};
exports.getContentChildren = getContentChildren;
/** Check if a node is a \not negation overlay: mrow[REL] > mpadded[width=0] > mtext(⧸).
 *  When true, the next sibling should be wrapped in cancel(). */
var isNegationOverlay = function (node) {
    // MathJax represents \not as TeXAtom(REL) in the internal tree
    // (serialized as mrow in MathML output)
    if (node.kind !== consts_1.TEX_ATOM && node.kind !== 'mrow') {
        return false;
    }
    // Walk through inferred mrow wrappers to find the mpadded
    var target = node.childNodes;
    if (!target) {
        return false;
    }
    while (target.length === 1 && target[0].isInferred && target[0].childNodes) {
        target = target[0].childNodes;
    }
    if (target.length !== 1) {
        return false;
    }
    var mpadded = target[0];
    if (mpadded.kind !== 'mpadded') {
        return false;
    }
    var attrs = mpadded.attributes.getAllAttributes();
    if (attrs.width !== 0) {
        return false;
    }
    // Walk through inferred mrow inside mpadded
    var mpTarget = mpadded.childNodes;
    if (!mpTarget) {
        return false;
    }
    while (mpTarget.length === 1 && mpTarget[0].isInferred && mpTarget[0].childNodes) {
        mpTarget = mpTarget[0].childNodes;
    }
    if (mpTarget.length !== 1) {
        return false;
    }
    var mtext = mpTarget[0];
    if (mtext.kind !== 'mtext') {
        return false;
    }
    return (0, exports.getChildText)(mtext) === NEGATION_SLASH;
};
exports.isNegationOverlay = isNegationOverlay;
//# sourceMappingURL=common.js.map
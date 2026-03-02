"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAll = exports.getProp = exports.getAttrs = exports.getNodeText = exports.getChildText = exports.getSiblingIndex = exports.isLastChild = exports.isFirstChild = exports.formatScript = exports.needsParens = exports.needsTokenSeparator = exports.isThousandSepComma = exports.addSpaceToTypstData = exports.addToTypstData = exports.initTypstData = exports.typstPlaceholder = void 0;
var tslib_1 = require("tslib");
var MmlNode_js_1 = require("mathjax-full/js/core/MmlTree/MmlNode.js");
var consts_1 = require("./consts");
/** Return the expression if non-empty, otherwise the Typst empty placeholder '""'. */
var typstPlaceholder = function (s) { return s || consts_1.TYPST_PLACEHOLDER; };
exports.typstPlaceholder = typstPlaceholder;
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
    try {
        if (i + 2 >= node.childNodes.length)
            return false;
        var child = node.childNodes[i];
        var comma = node.childNodes[i + 1];
        var next = node.childNodes[i + 2];
        if ((child === null || child === void 0 ? void 0 : child.kind) !== 'mn')
            return false;
        if ((comma === null || comma === void 0 ? void 0 : comma.kind) !== 'mo' || (0, exports.getChildText)(comma) !== ',')
            return false;
        if ((next === null || next === void 0 ? void 0 : next.kind) !== 'mn')
            return false;
        var nextText = (0, exports.getChildText)(next);
        // Standard: exactly 3 digits after comma
        if (consts_1.RE_THREE_DIGITS.test(nextText))
            return true;
        // Indian numbering: exactly 2 digits — accept if the chain eventually reaches a 3-digit group
        if (consts_1.RE_TWO_DIGITS.test(nextText)) {
            var j = i + 2;
            while (j + 2 < node.childNodes.length) {
                var nextComma = node.childNodes[j + 1];
                var nextNode = node.childNodes[j + 2];
                if ((nextComma === null || nextComma === void 0 ? void 0 : nextComma.kind) !== 'mo' || (0, exports.getChildText)(nextComma) !== ',')
                    break;
                if ((nextNode === null || nextNode === void 0 ? void 0 : nextNode.kind) !== 'mn')
                    break;
                var nextDigits = (0, exports.getChildText)(nextNode);
                if (consts_1.RE_THREE_DIGITS.test(nextDigits))
                    return true;
                if (!consts_1.RE_TWO_DIGITS.test(nextDigits))
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
    if (consts_1.RE_PHANTOM_BASE.test(next))
        return false;
    return consts_1.RE_TOKEN_START.test(next)
        && !consts_1.RE_SEPARATOR_END.test(prev);
};
exports.needsTokenSeparator = needsTokenSeparator;
/** In Typst, multi-char sub/superscript content needs grouping parens: x^(a b), x_(i+1). */
var needsParens = function (s) { return s.length > 1; };
exports.needsParens = needsParens;
/** Format a subscript or superscript with proper Typst grouping.
 *  Returns e.g. '_x', '_(x + y)', '^n', '^(a b)', or '' if content is empty. */
var formatScript = function (prefix, content) {
    if (!content)
        return '';
    return prefix + ((0, exports.needsParens)(content) ? "(".concat(content, ")") : content);
};
exports.formatScript = formatScript;
/** Check if a node is the first child of its parent. */
var isFirstChild = function (node) {
    return !!node.parent && !!node.parent.childNodes[0] && node.parent.childNodes[0] === node;
};
exports.isFirstChild = isFirstChild;
/** Check if a node is the last child of its parent. */
var isLastChild = function (node) {
    return !!node.parent && !!node.parent.childNodes
        && node.parent.childNodes[node.parent.childNodes.length - 1] === node;
};
exports.isLastChild = isLastChild;
/** Find the index of a node among its parent's childNodes. Returns -1 if not found. */
var getSiblingIndex = function (node) {
    if (!node.parent || !node.parent.childNodes)
        return -1;
    return node.parent.childNodes.findIndex(function (item) { return item === node; });
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
/** Concatenate text content of all child nodes. */
var getNodeText = function (node) {
    var e_1, _a;
    if (!(node === null || node === void 0 ? void 0 : node.childNodes))
        return '';
    var text = '';
    try {
        for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            if (child instanceof MmlNode_js_1.TextNode)
                text += child.getText();
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
/** Serialize all children of a node by visiting each one and concatenating the results. */
var handleAll = function (node, serialize) {
    var e_2, _a;
    var res = (0, exports.initTypstData)();
    try {
        for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            var data = serialize.visitNode(child, '');
            res = (0, exports.addToTypstData)(res, data);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return res;
};
exports.handleAll = handleAll;
//# sourceMappingURL=common.js.map
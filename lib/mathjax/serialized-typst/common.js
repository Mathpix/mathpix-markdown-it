"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAll = exports.getCustomCmdTypstSymbol = exports.isNegationOverlay = exports.getContentChildren = exports.getProp = exports.getAttrs = exports.getNodeText = exports.getChildText = exports.getSiblingIndex = exports.isLastChild = exports.isFirstChild = exports.formatScript = exports.needsParens = exports.needsSpaceBetweenNodes = exports.needsTokenSeparator = exports.serializeCombiningMiChain = exports.serializeThousandSepChain = exports.isThousandSepComma = exports.addSpaceToTypstData = exports.addToTypstData = exports.initTypstData = exports.typstPlaceholder = exports.escapeTypstString = void 0;
var tslib_1 = require("tslib");
var MmlNode_js_1 = require("mathjax-full/js/core/MmlTree/MmlNode.js");
var consts_1 = require("./consts");
var typst_symbol_map_1 = require("./typst-symbol-map");
/** Unicode negation slash used by MathJax for \not overlay (U+29F8) */
var NEGATION_SLASH = '\u29F8';
/** Escape backslashes and quotes for Typst string literals ("...") */
var RE_BACKSLASH_GLOBAL = /\\/g;
var RE_QUOTE_GLOBAL = /"/g;
var escapeTypstString = function (s) {
    return s.replace(RE_BACKSLASH_GLOBAL, '\\\\').replace(RE_QUOTE_GLOBAL, '\\"');
};
exports.escapeTypstString = escapeTypstString;
/** Map mathvariant attribute values to Typst font function names. */
var FONT_FN_MAP = {
    'normal': 'upright',
    'bold': 'bold',
    'bold-italic': 'bold',
    'italic': 'italic',
    '-tex-mathit': 'italic',
    'double-struck': 'bb',
    'script': 'cal',
    '-tex-calligraphic': 'cal',
    'fraktur': 'frak',
    'bold-fraktur': 'frak',
    'sans-serif': 'sans',
    'bold-sans-serif': 'sans',
    'sans-serif-italic': 'sans',
    'monospace': 'mono',
};
/** Return the expression if non-empty, otherwise the Typst empty placeholder '""'. */
var typstPlaceholder = function (s) { return s || consts_1.TYPST_PLACEHOLDER; };
exports.typstPlaceholder = typstPlaceholder;
var initTypstData = function () { return ({ typst: '' }); };
exports.initTypstData = initTypstData;
/** Mutates dataOutput by appending dataInput fields. Returns dataOutput for chaining. */
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
/** Add a separator space to both typst and typst_inline fields.
 *  Does not create typst_inline if it hasn't been initialized yet. */
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
    var children = node.childNodes;
    if (!children || i < 0 || i + 2 >= children.length)
        return false;
    var child = children[i];
    var comma = children[i + 1];
    var next = children[i + 2];
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
    if (!consts_1.RE_TWO_DIGITS.test(nextText))
        return false;
    var j = i + 2;
    while (j + 2 < children.length) {
        var nextComma = children[j + 1];
        var nextNode = children[j + 2];
        if ((nextComma === null || nextComma === void 0 ? void 0 : nextComma.kind) !== 'mo' || (0, exports.getChildText)(nextComma) !== ',')
            return false;
        if ((nextNode === null || nextNode === void 0 ? void 0 : nextNode.kind) !== 'mn')
            return false;
        var nextDigits = (0, exports.getChildText)(nextNode);
        if (consts_1.RE_THREE_DIGITS.test(nextDigits))
            return true;
        if (!consts_1.RE_TWO_DIGITS.test(nextDigits))
            return false;
        j += 2;
    }
    return false;
};
exports.isThousandSepComma = isThousandSepComma;
/** Serialize a thousand-separator chain starting at index `start` in a node's childNodes.
 *  Returns { typst, nextIndex } where nextIndex is the first unconsumed child index,
 *  or null if no chain starts at `start`. */
var serializeThousandSepChain = function (node, start, serialize) {
    if (!(0, exports.isThousandSepComma)(node, start))
        return null;
    var numData = serialize.visitNode(node.childNodes[start], '');
    var chainTypst = numData.typst;
    var k = start;
    while ((0, exports.isThousandSepComma)(node, k)) {
        var nextData = serialize.visitNode(node.childNodes[k + 2], '');
        chainTypst += "\\,".concat(nextData.typst);
        k += 2;
    }
    return { typst: chainTypst, nextIndex: k + 1 };
};
exports.serializeThousandSepChain = serializeThousandSepChain;
/** Check if text is a non-Latin script character (Devanagari, Arabic, CJK, etc.)
 *  that is NOT a known math symbol with a Typst mapping. */
var isNonLatinText = function (text) {
    // Must consist of letters and combining marks only (not math symbols \p{S})
    if (!consts_1.RE_LETTERS_AND_MARKS.test(text))
        return false;
    // Latin letters with combining marks (k̸, ñ, etc.) are NOT non-Latin
    if (consts_1.RE_LATIN_WITH_MARKS.test(text))
        return false;
    // Must NOT be a known math symbol (∂→partial, ψ→psi, ∅→emptyset, etc.)
    if (typst_symbol_map_1.typstSymbolMap.has(text))
        return false;
    return true;
};
/** Detect one or more consecutive mi nodes containing non-Latin script text
 *  (Devanagari, Arabic, CJK, etc.) with the same mathvariant.
 *  MathJax splits \mathrm{टेक} into individual mi nodes per character,
 *  breaking combining sequences and word grouping.
 *  This function merges them into a single font-wrapped string.
 *  Skips known math symbols (∂, ψ, ∅, etc.) that have specific Typst mappings.
 *  Returns { typst, nextIndex } or null if node at `start` is not non-Latin mi. */
var serializeCombiningMiChain = function (node, start) {
    var _a, _b, _c, _d;
    var children = node.childNodes;
    if (!children || start >= children.length)
        return null;
    var first = children[start];
    if (first.kind !== 'mi')
        return null;
    var firstText = (0, exports.getNodeText)(first);
    if (!firstText || !isNonLatinText(firstText))
        return null;
    var variant = String((_b = (_a = first.attributes) === null || _a === void 0 ? void 0 : _a.get('mathvariant')) !== null && _b !== void 0 ? _b : '');
    // Collect consecutive mi nodes with the same mathvariant and non-Latin text
    var merged = firstText;
    var k = start + 1;
    while (k < children.length) {
        var sib = children[k];
        if (sib.kind !== 'mi')
            break;
        var sibVariant = String((_d = (_c = sib.attributes) === null || _c === void 0 ? void 0 : _c.get('mathvariant')) !== null && _d !== void 0 ? _d : '');
        if (sibVariant !== variant)
            break;
        var sibText = (0, exports.getNodeText)(sib);
        if (!sibText || !isNonLatinText(sibText))
            break;
        merged += sibText;
        k++;
    }
    // Build font-wrapped string
    var escaped = (0, exports.escapeTypstString)(merged);
    var fontFn = variant === 'bold' ? null : FONT_FN_MAP[variant];
    if (!fontFn) {
        // bold special case or unknown variant — just quote it
        if (variant === 'bold') {
            return { typst: "upright(bold(\"".concat(escaped, "\"))"), nextIndex: k };
        }
        return { typst: "\"".concat(escaped, "\""), nextIndex: k };
    }
    return { typst: "".concat(fontFn, "(\"").concat(escaped, "\")"), nextIndex: k };
};
exports.serializeCombiningMiChain = serializeCombiningMiChain;
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
/** Check if a scripted node represents a derivative pattern: f'(x), f''(x), f^{(n)}(a).
 *  These are msup with mi base and prime (mo with ′/″/‴) or parenthesized-group (TeXAtom) superscript. */
var isDerivativePattern = function (node) {
    var _a, _b, _c;
    if (node.kind !== 'msup')
        return false;
    if (((_b = (_a = node.childNodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.kind) !== 'mi')
        return false;
    var script = (_c = node.childNodes) === null || _c === void 0 ? void 0 : _c[1];
    // f'(x), f''(x) — superscript is mo with prime character (′ ″ ‴)
    if ((script === null || script === void 0 ? void 0 : script.kind) === 'mo') {
        var scriptText = (0, exports.getChildText)(script);
        return consts_1.PRIME_CHARS.has(scriptText);
    }
    // f^{(n)}(a) — superscript is TeXAtom (parenthesized group)
    if ((script === null || script === void 0 ? void 0 : script.kind) === consts_1.TEX_ATOM)
        return true;
    return false;
};
/** Extended spacing check for mrow/inferredMrow child concatenation.
 *  First applies the standard token separator heuristic, then checks whether
 *  a scripted node (msub, msup, …) is followed by (, [ or { — a space is needed
 *  to prevent Typst from parsing them as function call / content block / code block
 *  and to improve readability: q_j (chi, eta), P_l^n (cos chi), x^n [ln x].
 *  Exception: derivative patterns f'(x), f''(x), f^{(n)}(a) keep no space. */
var needsSpaceBetweenNodes = function (prevTypst, nextTypst, prevNode) {
    if ((0, exports.needsTokenSeparator)(prevTypst, nextTypst))
        return true;
    if (prevNode && consts_1.SCRIPT_NODE_KINDS.has(prevNode.kind) && nextTypst.length > 0) {
        var ch = nextTypst[0];
        if (ch === '[' || ch === '{')
            return true;
        if (ch === '(' && !isDerivativePattern(prevNode))
            return true;
    }
    // Prevent Typst from parsing symbol( as a function call: emptyset(i) → emptyset (i).
    // Multi-char Typst names (Greek, symbol names) followed by ( need a space.
    // Single-char identifiers (f, g, x) and built-in math operators (sin, cos, ln) don't.
    if (nextTypst[0] === '(' && consts_1.RE_ALPHA_END.test(prevTypst)) {
        var lastWord = prevTypst.match(consts_1.RE_TRAILING_IDENT);
        if (lastWord && lastWord[1].length > 1 && !consts_1.TYPST_BUILTIN_OPS.has(lastWord[1]))
            return true;
    }
    return false;
};
exports.needsSpaceBetweenNodes = needsSpaceBetweenNodes;
/** Simple heuristic for Typst sub/superscript grouping: multi-char content needs parens. */
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
    return !!node.parent && node.parent.childNodes[0] === node;
};
exports.isFirstChild = isFirstChild;
/** Check if a node is the last child of its parent. */
var isLastChild = function (node) {
    return !!node.parent && node.parent.childNodes[node.parent.childNodes.length - 1] === node;
};
exports.isLastChild = isLastChild;
/** Find the index of a node among its parent's childNodes. Returns -1 if not found. */
var getSiblingIndex = function (node) {
    if (!node.parent || !node.parent.childNodes)
        return -1;
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
    if (node.kind !== consts_1.TEX_ATOM && node.kind !== 'mrow')
        return false;
    // Walk through inferred mrow wrappers to find the mpadded
    var target = node.childNodes;
    if (!target)
        return false;
    while (target.length === 1 && target[0].isInferred && target[0].childNodes) {
        target = target[0].childNodes;
    }
    if (target.length !== 1)
        return false;
    var mpadded = target[0];
    if (mpadded.kind !== 'mpadded')
        return false;
    var attrs = mpadded.attributes.getAllAttributes();
    if (attrs.width !== 0)
        return false;
    // Walk through inferred mrow inside mpadded
    var mpTarget = mpadded.childNodes;
    if (!mpTarget)
        return false;
    while (mpTarget.length === 1 && mpTarget[0].isInferred && mpTarget[0].childNodes) {
        mpTarget = mpTarget[0].childNodes;
    }
    if (mpTarget.length !== 1)
        return false;
    var mtext = mpTarget[0];
    if (mtext.kind !== 'mtext')
        return false;
    return (0, exports.getChildText)(mtext) === NEGATION_SLASH;
};
exports.isNegationOverlay = isNegationOverlay;
var custom_cmd_map_1 = require("../custom-cmd-map");
/** Get Typst symbol for a custom-cmd node, or undefined if not a custom command. */
var getCustomCmdTypstSymbol = function (node) {
    var _a;
    var cmd = (_a = node.getProperty) === null || _a === void 0 ? void 0 : _a.call(node, 'data-custom-cmd');
    return cmd ? (0, custom_cmd_map_1.getCustomCmdTypst)(cmd) : undefined;
};
exports.getCustomCmdTypstSymbol = getCustomCmdTypstSymbol;
/** Serialize all children of a node by visiting each one and concatenating the results.
 *  Detects combining-mark chains in consecutive mi nodes (Devanagari, Arabic, etc.). */
var handleAll = function (node, serialize) {
    var _a;
    var res = (0, exports.initTypstData)();
    var children = (_a = node.childNodes) !== null && _a !== void 0 ? _a : [];
    for (var i = 0; i < children.length; i++) {
        var combChain = (0, exports.serializeCombiningMiChain)(node, i);
        if (combChain) {
            if ((0, exports.needsTokenSeparator)(res.typst, combChain.typst))
                (0, exports.addSpaceToTypstData)(res);
            res = (0, exports.addToTypstData)(res, { typst: combChain.typst });
            i = combChain.nextIndex - 1;
            continue;
        }
        var data = serialize.visitNode(children[i], '');
        if ((0, exports.needsTokenSeparator)(res.typst, data.typst))
            (0, exports.addSpaceToTypstData)(res);
        res = (0, exports.addToTypstData)(res, data);
    }
    return res;
};
exports.handleAll = handleAll;
//# sourceMappingURL=common.js.map
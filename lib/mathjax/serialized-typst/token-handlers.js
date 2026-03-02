"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mspace = exports.mtext = exports.mn = exports.mo = exports.mi = void 0;
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("./consts");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
var escape_utils_1 = require("./escape-utils");
var INVISIBLE_CHARS = new Set([
    consts_1.FUNC_APPLY, consts_1.INVISIBLE_TIMES, consts_1.INVISIBLE_SEP, consts_1.INVISIBLE_PLUS,
]);
// Built-in Typst math operators — should NOT be wrapped in upright()
var TYPST_MATH_OPERATORS = new Set([
    'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
    'arcsin', 'arccos', 'arctan',
    'sinh', 'cosh', 'tanh', 'coth',
    'exp', 'log', 'ln', 'lg',
    'det', 'dim', 'gcd', 'mod',
    'inf', 'sup', 'lim', 'liminf', 'limsup',
    'max', 'min', 'arg', 'deg', 'hom', 'ker',
    'Pr', 'tr',
]);
var BB_SHORTHAND_LETTERS = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
// Operators that should have spaces around them for readability
var SPACED_OPERATORS = new Set([
    '+', '-', '=', '<', '>', consts_1.MINUS_SIGN, consts_1.PLUS_MINUS, consts_1.MINUS_PLUS,
]);
// Multi-word MathJax operator names → Typst built-in operator names.
// MathJax uses thin space (U+2006) between words; we normalize before lookup.
var MATHJAX_MULTIWORD_OPS = new Map([
    ['lim sup', 'limsup'],
    ['lim inf', 'liminf'],
]);
// MathML spacing widths → Typst spacing keywords
var MSPACE_WIDTH_MAP = {
    '2em': ' wide ',
    '1em': ' quad ',
    '0.2778em': ' thick ',
    '0.278em': ' thick ',
    '0.2222em': ' med ',
    '0.222em': ' med ',
    '0.1667em': ' thin ',
    '0.167em': ' thin ',
    '-0.1667em': '',
    '-0.167em': '',
};
/** Extract the primary Typst symbol text from a node (mi/mo).
 *  Gets the first child's text and maps it through findTypstSymbol. */
var getNodeTypstSymbol = function (node) {
    var text = (0, common_1.getChildText)(node);
    if (!text)
        return '';
    return (0, typst_symbol_map_1.findTypstSymbol)(text);
};
var needsSpaceBefore = function (node) {
    try {
        if ((0, common_1.isFirstChild)(node))
            return false;
        var index = (0, common_1.getSiblingIndex)(node);
        if (index <= 0)
            return false;
        var prev = node.parent.childNodes[index - 1];
        if (prev.kind === 'mi' || prev.kind === 'mo') {
            return consts_1.RE_WORD_DOT_END.test(getNodeTypstSymbol(prev));
        }
        if (prev.kind === 'mn')
            return true;
        return false;
    }
    catch (e) {
        return false;
    }
};
var needsSpaceAfter = function (node) {
    var _a;
    try {
        if ((0, common_1.isLastChild)(node))
            return false;
        var parentKind = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind;
        if (parentKind === 'msub' || parentKind === 'msup' || parentKind === 'msubsup'
            || parentKind === 'munderover' || parentKind === 'munder' || parentKind === 'mover') {
            return false;
        }
        var index = (0, common_1.getSiblingIndex)(node);
        if (index < 0)
            return false;
        var next = node.parent.childNodes[index + 1];
        // Skip invisible function application (U+2061)
        if (next && (0, common_1.getChildText)(next) === consts_1.FUNC_APPLY && index + 2 < node.parent.childNodes.length) {
            next = node.parent.childNodes[index + 2];
        }
        if (next && (next.kind === 'mi' || next.kind === 'mo')) {
            return consts_1.RE_WORD_DOT_START.test(getNodeTypstSymbol(next));
        }
        if (next && next.kind === 'mn')
            return true;
        return false;
    }
    catch (e) {
        return false;
    }
};
var mi = function (node, _serialize) {
    var res = (0, common_1.initTypstData)();
    if (!node.childNodes || node.childNodes.length === 0) {
        return res;
    }
    var value = (0, common_1.getChildText)(node);
    if (!value) {
        return res;
    }
    var atr = (0, common_1.getAttrs)(node);
    var mathvariant = atr.mathvariant || '';
    var isKnownSymbol = typst_symbol_map_1.typstSymbolMap.has(value);
    var isKnownOperator = TYPST_MATH_OPERATORS.has(value);
    var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
    // \operatorname{name}: texClass=OP, multi-char, not built-in
    // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement.
    if (node.texClass === MmlNode_1.TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
        typstValue = "op(\"".concat(value, "\")");
    }
    // \mathrm{d} → dif (differential operator shorthand, single-char d only)
    else if (mathvariant === 'normal' && value === 'd' && !isKnownSymbol) {
        typstValue = 'dif';
    }
    // \mathbb{R} → RR (doubled letter shorthand for single uppercase)
    else if (mathvariant === 'double-struck' && value.length === 1 && BB_SHORTHAND_LETTERS.has(value)) {
        typstValue = value + value;
    }
    // Font wrapping: skip for known non-bold symbols, operators, and escape-form symbols (\#, \$)
    else if (mathvariant && mathvariant !== 'italic' && !isKnownOperator
        && (!isKnownSymbol || mathvariant === 'bold' || mathvariant === 'bold-italic')
        && !(isKnownSymbol && typstValue.startsWith('\\'))) {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            // Multi-letter text needs quotes in Typst math (e.g. italic("word"), bold("text"))
            var inner = value.length > 1 && !isKnownSymbol ? "\"".concat(value, "\"") : typstValue;
            // \mathbf produces mathvariant="bold" which is upright bold in LaTeX
            if (mathvariant === 'bold' && !isKnownSymbol) {
                typstValue = "upright(bold(".concat(inner, "))");
            }
            else {
                typstValue = "".concat(fontFn, "(").concat(inner, ")");
            }
        }
    }
    // Add spacing around multi-character Typst symbol names
    if (typstValue.length > 1 && consts_1.RE_WORD_START.test(typstValue)) {
        var spaceBefore = needsSpaceBefore(node) ? ' ' : '';
        var spaceAfter = needsSpaceAfter(node) ? ' ' : '';
        res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + typstValue + spaceAfter });
    }
    else {
        res = (0, common_1.addToTypstData)(res, { typst: typstValue });
    }
    return res;
};
exports.mi = mi;
var mo = function (node, _serialize) {
    var _a;
    var res = (0, common_1.initTypstData)();
    var value = (0, common_1.getNodeText)(node);
    var unpairedDir = node.getProperty(consts_1.UNPAIRED_BRACKET_PROP);
    if (unpairedDir && consts_1.UNPAIRED_BRACKET_TYPST[value]) {
        var spaceBefore = needsSpaceBefore(node) ? ' ' : '';
        var spaceAfter = needsSpaceAfter(node) ? ' ' : '';
        res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + consts_1.UNPAIRED_BRACKET_TYPST[value] + spaceAfter });
        return res;
    }
    if (INVISIBLE_CHARS.has(value)) {
        return res;
    }
    var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
    // Map multi-word MathJax operator names to Typst built-in equivalents
    // (e.g. \limsup → "lim⁠sup" with thin space → "limsup")
    var normalizedValue = value.replace(consts_1.RE_UNICODE_SPACES, ' ');
    var mappedOp = MATHJAX_MULTIWORD_OPS.get(normalizedValue);
    if (mappedOp) {
        var spaceBefore = needsSpaceBefore(node) ? ' ' : '';
        var spaceAfter = needsSpaceAfter(node) ? ' ' : '';
        res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + mappedOp + spaceAfter });
        return res;
    }
    // Detect custom named operators (e.g. \injlim → "inj lim", \projlim → "proj lim")
    // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement
    if (normalizedValue.length > 1 && consts_1.RE_WORD_START.test(normalizedValue) && !typst_symbol_map_1.typstSymbolMap.has(value) && !TYPST_MATH_OPERATORS.has(value)) {
        var opName = normalizedValue;
        res = (0, common_1.addToTypstData)(res, { typst: "op(\"".concat(opName, "\")") });
        return res;
    }
    // Check if this operator is inside sub/sup/munderover — no spacing there
    var parentKind = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind;
    var inScript = parentKind === 'msub' || parentKind === 'msup'
        || parentKind === 'msubsup' || parentKind === 'munderover';
    if (typstValue.length > 1 && consts_1.RE_WORD_START.test(typstValue)) {
        var spaceBefore = needsSpaceBefore(node) ? ' ' : '';
        var spaceAfter = needsSpaceAfter(node) ? ' ' : '';
        // Prevent Typst from interpreting "symbol(" as a function call
        // (e.g. "lt.eq(x)" would call lt.eq as a function)
        if (!spaceAfter && !inScript) {
            try {
                var idx = (0, common_1.getSiblingIndex)(node);
                var next = node.parent.childNodes[idx + 1];
                if (next && next.kind === 'mo') {
                    var nt = (0, common_1.getNodeText)(next);
                    if (nt === '(' || nt === '[')
                        spaceAfter = ' ';
                }
            }
            catch (_e) { /* ignore */ }
        }
        res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + typstValue + spaceAfter });
    }
    else if (!inScript && SPACED_OPERATORS.has(value)) {
        res = (0, common_1.addToTypstData)(res, { typst: ' ' + typstValue + ' ' });
    }
    else if (!inScript && value === ',') {
        res = (0, common_1.addToTypstData)(res, { typst: ', ' });
    }
    else if (value === '/') {
        // Escape slash: in Typst math, / creates a fraction; \/ is a literal slash
        res = (0, common_1.addToTypstData)(res, { typst: '\\/' });
    }
    else {
        res = (0, common_1.addToTypstData)(res, { typst: typstValue });
    }
    return res;
};
exports.mo = mo;
var mn = function (node, _serialize) {
    var res = (0, common_1.initTypstData)();
    var value = (0, common_1.getNodeText)(node);
    var atr = (0, common_1.getAttrs)(node);
    var mathvariant = atr.mathvariant || '';
    if (mathvariant && mathvariant !== 'normal') {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            var content = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(value));
            res = (0, common_1.addToTypstData)(res, { typst: "".concat(fontFn, "(").concat(content, ")") });
            return res;
        }
    }
    res = (0, common_1.addToTypstData)(res, { typst: value });
    return res;
};
exports.mn = mn;
var mtext = function (node, _serialize) {
    var res = (0, common_1.initTypstData)();
    if (!node.childNodes || node.childNodes.length === 0) {
        return res;
    }
    var value = (0, common_1.getChildText)(node);
    if (!value || !value.trim()) {
        return res;
    }
    value = value.replace(consts_1.RE_NBSP, ' ');
    if (value.length === 1 && typst_symbol_map_1.typstSymbolMap.has(value)) {
        var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
        var spaceBefore = needsSpaceBefore(node) ? ' ' : '';
        var spaceAfter = needsSpaceAfter(node) ? ' ' : '';
        res = (0, common_1.addToTypstData)(res, { typst: spaceBefore + typstValue + spaceAfter });
        return res;
    }
    var textContent = "\"".concat(value.replace(/"/g, '\\"'), "\"");
    var atr = (0, common_1.getAttrs)(node);
    var mathvariant = atr.mathvariant || '';
    if (mathvariant && mathvariant !== 'normal') {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            textContent = "".concat(fontFn, "(").concat(textContent, ")");
        }
    }
    res = (0, common_1.addToTypstData)(res, { typst: textContent });
    return res;
};
exports.mtext = mtext;
var mspace = function (node, _serialize) {
    var res = (0, common_1.initTypstData)();
    var atr = (0, common_1.getAttrs)(node);
    if (!atr.width) {
        return res;
    }
    var width = atr.width.toString();
    var mapped = MSPACE_WIDTH_MAP[width];
    if (mapped !== undefined) {
        if (mapped)
            res = (0, common_1.addToTypstData)(res, { typst: mapped });
        return res;
    }
    res = (0, common_1.addToTypstData)(res, { typst: ' ' });
    return res;
};
exports.mspace = mspace;
//# sourceMappingURL=token-handlers.js.map
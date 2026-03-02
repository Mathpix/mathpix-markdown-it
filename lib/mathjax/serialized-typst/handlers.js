"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("./consts");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
var escape_utils_1 = require("./escape-utils");
var bracket_utils_1 = require("./bracket-utils");
var table_handlers_1 = require("./table-handlers");
var SHALLOW_TREE_MAX_DEPTH = 5;
var ANCESTOR_MAX_DEPTH = 10;
var MATHJAX_INHERIT_SENTINEL = '_inherit_';
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
// Prime symbol → Typst ' shorthand mapping
var PRIME_SHORTHANDS = new Map([
    ['prime', "'"],
    ['prime.double', "''"],
    ['prime.triple', "'''"],
]);
// Regex to detect overbrace/overbracket/underbrace/underbracket as outermost call
var BRACE_ANNOTATION_RE = /^(overbrace|overbracket|underbrace|underbracket)\((.+)\)$/s;
var RE_SPECIAL_FN_CALL = /^(overbrace|underbrace|overline|underline|op)\(/;
var RE_TRAILING_PAREN = /\)$/;
// Multi-word MathJax operator names → Typst built-in operator names.
// MathJax uses thin space (U+2006) between words; we normalize before lookup.
var MATHJAX_MULTIWORD_OPS = new Map([
    ['lim sup', 'limsup'],
    ['lim inf', 'liminf'],
]);
// Operators that Typst places below/above in display mode by default.
// Used to detect \nolimits (when these appear in msubsup/msub/msup instead of munderover).
var TYPST_DISPLAY_LIMIT_OPS = new Set([
    // Named function operators with limits placement
    'lim', 'limsup', 'liminf', 'max', 'min', 'inf', 'sup',
    'det', 'gcd', 'Pr',
    // Large operators
    'sum', 'product', 'product.co',
    'union.big', 'inter.big',
    'dot.o.big', 'plus.o.big', 'times.o.big',
    'union.plus.big', 'union.sq.big',
    'or.big', 'and.big',
]);
// Extensible arrows/harpoons: use stretch() instead of limits() for \xrightarrow, \xleftarrow, etc.
var STRETCH_BASE_SYMBOLS = new Set([
    'arrow.r', 'arrow.l', 'arrow.l.r',
    'arrow.r.twohead', 'arrow.l.twohead',
    'arrow.r.bar',
    'arrow.r.hook', 'arrow.l.hook',
    'arrow.r.double', 'arrow.l.double', 'arrow.l.r.double',
    'harpoon.rt', 'harpoon.lb',
    'harpoons.rtlb', 'harpoons.ltrb',
    'arrows.rr',
    '=', // \xlongequal
]);
// Accent functions that have no under-variant in Typst.
// In munder context, these use attach(base, b: symbol) instead of accent function.
var MUNDER_ATTACH_SYMBOLS = new Map([
    ['arrow', 'arrow.r'],
    ['arrow.l', 'arrow.l'],
    ['arrow.l.r', 'arrow.l.r'],
    ['harpoon', 'harpoon'],
    ['harpoon.lt', 'harpoon.lt'], // ↼ below
]);
// Typst accent shorthand functions that can be called as fn(content).
// Accents NOT in this set must use the accent(content, symbol) form.
var TYPST_ACCENT_SHORTHANDS = new Set([
    'hat', 'tilde', 'acute', 'grave', 'macron', 'overline', 'underline',
    'breve', 'dot', 'diaer', 'caron', 'arrow', 'circle',
    'overbrace', 'underbrace', 'overbracket', 'underbracket',
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
/** Get all attributes from a node. Return type matches MathJax's PropertyList. */
var getAttributes = function (node) {
    return node.attributes.getAllAttributes();
};
/** Extract the primary Typst symbol text from a node (mi/mo).
 *  Gets the first child's text and maps it through findTypstSymbol. */
var getNodeTypstSymbol = function (node) {
    var text = (0, common_1.getChildText)(node);
    if (!text)
        return '';
    return (0, typst_symbol_map_1.findTypstSymbol)(text);
};
var defaultHandler = function (node, serialize) {
    return (0, common_1.handleAll)(node, serialize);
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
    var atr = getAttributes(node);
    var mathvariant = (atr === null || atr === void 0 ? void 0 : atr.mathvariant) || '';
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
var mn = function (node, _serialize) {
    var res = (0, common_1.initTypstData)();
    var value = (0, common_1.getNodeText)(node);
    var atr = getAttributes(node);
    var mathvariant = (atr === null || atr === void 0 ? void 0 : atr.mathvariant) || '';
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
    var atr = getAttributes(node);
    var mathvariant = (atr === null || atr === void 0 ? void 0 : atr.mathvariant) || '';
    if (mathvariant && mathvariant !== 'normal') {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            textContent = "".concat(fontFn, "(").concat(textContent, ")");
        }
    }
    res = (0, common_1.addToTypstData)(res, { typst: textContent });
    return res;
};
var mfrac = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
    var num = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(dataFirst.typst.trim()));
    var den = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(dataSecond.typst.trim()));
    // Check for linethickness=0 which indicates \binom (\choose)
    var atr = getAttributes(node);
    if (atr && (atr.linethickness === '0' || atr.linethickness === 0)) {
        res = (0, common_1.addToTypstData)(res, { typst: "binom(".concat(num, ", ").concat(den, ")") });
    }
    else {
        res = (0, common_1.addToTypstData)(res, { typst: "frac(".concat(num, ", ").concat(den, ")") });
    }
    return res;
};
/** Append ", limits: #true" inside an op() wrapper: op("name") → op("name", limits: #true) */
var addLimitsParam = function (opExpr) {
    return opExpr.replace(RE_TRAILING_PAREN, ', limits: #true)');
};
/** Match a brace annotation (overbrace/underbrace/etc.) and return it with annotation as second argument.
 *  Returns null if baseTrimmed doesn't match any of the specified kinds. */
var matchBraceAnnotation = function (baseTrimmed, annotation, kinds) {
    var m = BRACE_ANNOTATION_RE.exec(baseTrimmed);
    var kind = m === null || m === void 0 ? void 0 : m[1];
    if (!kind || !kinds.includes(kind))
        return null;
    var base = m[2];
    var ann = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(annotation));
    return { typst: "".concat(kind, "(").concat(base, ", ").concat(ann, ")") };
};
var msup = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
    var base = dataFirst.typst;
    var sup = dataSecond.typst.trim();
    var baseTrimmed = base.trim();
    // overbrace/overbracket annotation: insert as second argument instead of ^
    if (sup) {
        var braceRes = matchBraceAnnotation(baseTrimmed, sup, ['overbrace', 'overbracket']);
        if (braceRes) {
            res = (0, common_1.addToTypstData)(res, braceRes);
            return res;
        }
    }
    // All parts empty (e.g. mhchem phantom alignment msup) → skip entirely
    if (!baseTrimmed && !sup) {
        return res;
    }
    // \nolimits: wrap known limit-type operators in scripts() to force side placement
    if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
        res = (0, common_1.addToTypstData)(res, { typst: "scripts(".concat((0, escape_utils_1.escapeContentSeparators)(baseTrimmed), ")") });
    }
    else {
        // Empty base (e.g. LaTeX ^{x} with no preceding base): use empty placeholder
        res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed ? base : '""' });
    }
    // Skip empty superscript (e.g. LaTeX m^{} → just "m")
    if (sup) {
        // Optimize prime symbols to Typst ' shorthand
        var primeShorthand = PRIME_SHORTHANDS.get(sup);
        if (primeShorthand) {
            res = (0, common_1.addToTypstData)(res, { typst: primeShorthand });
        }
        else {
            res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('^', sup) });
        }
    }
    return res;
};
var msub = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
    var sub = dataSecond.typst.trim();
    var base = dataFirst.typst;
    var baseTrimmed = base.trim();
    // underbrace/underbracket annotation: insert as second argument instead of _
    if (sub) {
        var braceRes = matchBraceAnnotation(baseTrimmed, sub, ['underbrace', 'underbracket']);
        if (braceRes) {
            res = (0, common_1.addToTypstData)(res, braceRes);
            return res;
        }
    }
    // All parts empty (e.g. mhchem phantom alignment msub) → skip entirely
    if (!baseTrimmed && !sub) {
        return res;
    }
    // \nolimits: wrap known limit-type operators in scripts() to force side placement
    if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
        res = (0, common_1.addToTypstData)(res, { typst: "scripts(".concat((0, escape_utils_1.escapeContentSeparators)(baseTrimmed), ")") });
    }
    else {
        res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed ? base : '""' });
    }
    // Skip empty subscript (e.g. LaTeX m_{} → just "m")
    if (sub) {
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('_', sub) });
    }
    return res;
};
var msubsup = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var thirdChild = node.childNodes[2] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
    var dataThird = thirdChild ? serialize.visitNode(thirdChild, '') : (0, common_1.initTypstData)();
    var sub = dataSecond.typst.trim();
    var sup = dataThird.typst.trim();
    var base = dataFirst.typst;
    var baseTrimmed = base.trim();
    // All parts empty (e.g. mhchem phantom alignment msubsup) → skip entirely
    if (!baseTrimmed && !sub && !sup) {
        return res;
    }
    // \nolimits: wrap known limit-type operators in scripts() to force side placement
    if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
        res = (0, common_1.addToTypstData)(res, { typst: "scripts(".concat((0, escape_utils_1.escapeContentSeparators)(baseTrimmed), ")") });
    }
    else {
        res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed ? base : '""' });
    }
    // Skip empty subscript/superscript (e.g. LaTeX m_{}^{x} → just "m^x")
    if (sub) {
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('_', sub) });
    }
    if (sup) {
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('^', sup) });
    }
    return res;
};
var msqrt = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var content = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(dataFirst.typst.trim()));
    res = (0, common_1.addToTypstData)(res, { typst: "sqrt(".concat(content, ")") });
    return res;
};
var mroot = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    // MathML mroot: child[0] = radicand, child[1] = index
    var radicand = node.childNodes[0] || null;
    var index = node.childNodes[1] || null;
    var dataRadicand = radicand ? serialize.visitNode(radicand, '') : (0, common_1.initTypstData)();
    var dataIndex = index ? serialize.visitNode(index, '') : (0, common_1.initTypstData)();
    var radicandContent = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(dataRadicand.typst.trim()));
    var indexContent = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(dataIndex.typst.trim()));
    // Typst root: root(index, radicand)
    res = (0, common_1.addToTypstData)(res, {
        typst: "root(".concat(indexContent, ", ").concat(radicandContent, ")")
    });
    return res;
};
/** Get movablelimits attribute from a node (typically the base mo of munderover) */
var getMovablelimits = function (node) {
    if (!node || node.kind !== 'mo')
        return undefined;
    try {
        var atr = getAttributes(node);
        return atr === null || atr === void 0 ? void 0 : atr.movablelimits;
    }
    catch (e) {
        return undefined;
    }
};
/** Check if baseTrimmed is a custom op() wrapper (e.g. op("name")). */
var isCustomOp = function (baseTrimmed) {
    return consts_1.RE_OP_WRAPPER.test(baseTrimmed);
};
/** Check if baseTrimmed is a stretchy extensible symbol (\xrightarrow, \xleftarrow, etc.).
 *  Walks into firstChild to find the inner mo and check its stretchy attribute. */
var isStretchyBase = function (baseTrimmed, firstChild) {
    var _a;
    if (!STRETCH_BASE_SYMBOLS.has(baseTrimmed))
        return false;
    var moNode = firstChild;
    for (var i = 0; i < SHALLOW_TREE_MAX_DEPTH && moNode && moNode.kind !== 'mo'; i++) {
        if (((_a = moNode.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            moNode = moNode.childNodes[0];
        }
        else {
            break;
        }
    }
    if ((moNode === null || moNode === void 0 ? void 0 : moNode.kind) !== 'mo')
        return false;
    try {
        var atr = getAttributes(moNode);
        return (atr === null || atr === void 0 ? void 0 : atr.stretchy) === true;
    }
    catch (e) {
        return false;
    }
};
/** Check if baseTrimmed is a Typst operator that natively places limits
 *  above/below in display mode (e.g. sum, lim, max). */
var isNativeDisplayLimitOp = function (baseTrimmed) {
    return TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);
};
/** Check if baseTrimmed starts with a special function call
 *  (overbrace, underbrace, overline, underline, op). */
var isSpecialFnCall = function (baseTrimmed) {
    return RE_SPECIAL_FN_CALL.test(baseTrimmed);
};
/** Build limit-placement base, returns different block/inline bases for movablelimits.
 *  baseTrimmed is the raw trimmed value; empty bases get placeholder '""' inside wrappers. */
var buildLimitBase = function (firstChild, baseTrimmed, base) {
    var basePlaceholder = (0, common_1.typstPlaceholder)(baseTrimmed);
    var movablelimits = firstChild ? getMovablelimits(firstChild) : undefined;
    var wrapper = firstChild && isStretchyBase(baseTrimmed, firstChild) ? 'stretch' : 'limits';
    if (movablelimits === true) {
        if (isCustomOp(baseTrimmed)) {
            return { typst: addLimitsParam(baseTrimmed), typst_inline: base };
        }
        if (isNativeDisplayLimitOp(baseTrimmed)) {
            return { typst: base };
        }
        return { typst: "".concat(wrapper, "(").concat((0, escape_utils_1.escapeContentSeparators)(basePlaceholder), ")"), typst_inline: base };
    }
    else if (movablelimits === false) {
        return { typst: "".concat(wrapper, "(").concat((0, escape_utils_1.escapeContentSeparators)(basePlaceholder), ")") };
    }
    else {
        if (isCustomOp(baseTrimmed) && (firstChild === null || firstChild === void 0 ? void 0 : firstChild.texClass) === MmlNode_1.TEXCLASS.OP) {
            if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'TeXAtom') {
                return { typst: addLimitsParam(baseTrimmed), typst_inline: base };
            }
            return { typst: addLimitsParam(baseTrimmed) };
        }
        if (isNativeDisplayLimitOp(baseTrimmed) || isSpecialFnCall(baseTrimmed)) {
            return { typst: base };
        }
        return { typst: "".concat(wrapper, "(").concat((0, escape_utils_1.escapeContentSeparators)(basePlaceholder), ")") };
    }
};
/** Check if base should use scripts() wrapper (\nolimits in display mode) */
var needsScriptsWrapper = function (baseTrimmed) {
    return isNativeDisplayLimitOp(baseTrimmed);
};
var mover = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
    // Detect \varlimsup pattern: mover(mi("lim"), mo("―")) → op(overline(lim))
    if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'mi' && (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === 'mo') {
        var baseText = (0, common_1.getNodeText)(firstChild);
        var overChar = (0, common_1.getNodeText)(secondChild);
        if (baseText === 'lim' && overChar === consts_1.HORIZ_BAR) {
            res = (0, common_1.addToTypstData)(res, { typst: 'op(overline(lim))' });
            return res;
        }
    }
    if (secondChild && secondChild.kind === 'mo') {
        var accentChar = (0, common_1.getNodeText)(secondChild);
        var accentFn = typst_symbol_map_1.typstAccentMap.get(accentChar);
        if (accentFn) {
            var content = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(dataFirst.typst.trim()));
            if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
                res = (0, common_1.addToTypstData)(res, { typst: "".concat(accentFn, "(").concat(content, ")") });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: "accent(".concat(content, ", ").concat(accentFn, ")") });
            }
            return res;
        }
    }
    var rawBase = dataFirst.typst.trim();
    var over = dataSecond.typst.trim();
    if (over) {
        var braceRes = matchBraceAnnotation(rawBase, over, ['overbrace', 'overbracket']);
        if (braceRes) {
            res = (0, common_1.addToTypstData)(res, braceRes);
            return res;
        }
        var baseData = buildLimitBase(firstChild, rawBase, dataFirst.typst);
        res = (0, common_1.addToTypstData)(res, baseData);
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('^', over) });
    }
    else {
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.typstPlaceholder)(rawBase) });
    }
    return res;
};
var munder = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
    // Detect \varinjlim / \varprojlim / \varliminf patterns: munder(mi("lim"), mo(...))
    // Map to equivalent Typst operators (losing the visual decoration).
    if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'mi' && (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === 'mo') {
        var baseText = (0, common_1.getNodeText)(firstChild);
        var underChar = (0, common_1.getNodeText)(secondChild);
        if (baseText === 'lim' && underChar === consts_1.RIGHT_ARROW) { // \varinjlim
            res = (0, common_1.addToTypstData)(res, { typst: 'op("inj lim")' });
            return res;
        }
        if (baseText === 'lim' && underChar === consts_1.LEFT_ARROW) { // \varprojlim
            res = (0, common_1.addToTypstData)(res, { typst: 'op("proj lim")' });
            return res;
        }
        if (baseText === 'lim' && underChar === consts_1.HORIZ_BAR) { // \varliminf
            res = (0, common_1.addToTypstData)(res, { typst: 'op(underline(lim))' });
            return res;
        }
    }
    if (secondChild && secondChild.kind === 'mo') {
        var accentChar = (0, common_1.getNodeText)(secondChild);
        var accentFn = typst_symbol_map_1.typstAccentMap.get(accentChar);
        // Flip over-accents to under-accents when used in munder context
        if (accentFn === 'overline') {
            accentFn = 'underline';
        }
        if (accentFn === 'overbrace') {
            accentFn = 'underbrace';
        }
        if (accentFn) {
            var content = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(dataFirst.typst.trim()));
            // Arrows/harpoons have no under-variant in Typst — use attach(base, b: symbol)
            var underSymbol = MUNDER_ATTACH_SYMBOLS.get(accentFn);
            if (underSymbol) {
                res = (0, common_1.addToTypstData)(res, { typst: "attach(".concat(content, ", b: ").concat(underSymbol, ")") });
                return res;
            }
            if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
                res = (0, common_1.addToTypstData)(res, { typst: "".concat(accentFn, "(").concat(content, ")") });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: "accent(".concat(content, ", ").concat(accentFn, ")") });
            }
            return res;
        }
    }
    var rawBase = dataFirst.typst.trim();
    var under = dataSecond.typst.trim();
    if (under) {
        var braceRes = matchBraceAnnotation(rawBase, under, ['underbrace', 'underbracket']);
        if (braceRes) {
            res = (0, common_1.addToTypstData)(res, braceRes);
            return res;
        }
        var baseData = buildLimitBase(firstChild, rawBase, dataFirst.typst);
        res = (0, common_1.addToTypstData)(res, baseData);
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('_', under) });
    }
    else {
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.typstPlaceholder)(rawBase) });
    }
    return res;
};
var munderover = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var thirdChild = node.childNodes[2] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var dataSecond = secondChild ? serialize.visitNode(secondChild, '') : (0, common_1.initTypstData)();
    var dataThird = thirdChild ? serialize.visitNode(thirdChild, '') : (0, common_1.initTypstData)();
    var under = dataSecond.typst.trim();
    var over = dataThird.typst.trim();
    // Use movablelimits to decide between default placement and limits() wrapping
    var rawBase = dataFirst.typst.trim();
    var baseData = buildLimitBase(firstChild, rawBase, dataFirst.typst);
    res = (0, common_1.addToTypstData)(res, baseData);
    if (under) {
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('_', under) });
    }
    if (over) {
        res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('^', over) });
    }
    return res;
};
var mmultiscripts = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    if (!node.childNodes || node.childNodes.length === 0)
        return res;
    // Parse mmultiscripts structure:
    // child[0] = base
    // child[1..prescriptsIdx-1] = post-scripts (pairs of sub, sup)
    // child[prescriptsIdx] = mprescripts
    // child[prescriptsIdx+1..] = pre-scripts (pairs of sub, sup)
    var base = node.childNodes[0];
    var baseData = serialize.visitNode(base, '');
    var baseTrimmed = (0, common_1.typstPlaceholder)(baseData.typst.trim());
    var prescriptsIdx = -1;
    for (var i = 1; i < node.childNodes.length; i++) {
        if (node.childNodes[i].kind === 'mprescripts') {
            prescriptsIdx = i;
            break;
        }
    }
    // Collect post-scripts (pairs after base, before mprescripts).
    // NOTE: MathML allows multiple sub/sup pairs; in practice LaTeX produces at most one.
    // Typst attach() accepts only one value per position, so we keep the LAST non-empty value.
    var postEnd = prescriptsIdx >= 0 ? prescriptsIdx : node.childNodes.length;
    var lastPostSub = '';
    var lastPostSup = '';
    for (var i = 1; i < postEnd; i += 2) {
        var subNode = node.childNodes[i];
        var supNode = node.childNodes[i + 1] || null;
        if (subNode && subNode.kind !== 'none') {
            var d = serialize.visitNode(subNode, '');
            if (d.typst.trim())
                lastPostSub = d.typst.trim();
        }
        if (supNode && supNode.kind !== 'none') {
            var d = serialize.visitNode(supNode, '');
            if (d.typst.trim())
                lastPostSup = d.typst.trim();
        }
    }
    // Collect pre-scripts (pairs after mprescripts)
    var lastPreSub = '';
    var lastPreSup = '';
    if (prescriptsIdx >= 0) {
        for (var i = prescriptsIdx + 1; i < node.childNodes.length; i += 2) {
            var subNode = node.childNodes[i];
            var supNode = node.childNodes[i + 1] || null;
            if (subNode && subNode.kind !== 'none') {
                var d = serialize.visitNode(subNode, '');
                if (d.typst.trim())
                    lastPreSub = d.typst.trim();
            }
            if (supNode && supNode.kind !== 'none') {
                var d = serialize.visitNode(supNode, '');
                if (d.typst.trim())
                    lastPreSup = d.typst.trim();
            }
        }
    }
    var hasPrescripts = lastPreSub || lastPreSup;
    if (!hasPrescripts) {
        // No prescripts — use simple base_sub^sup syntax
        res = (0, common_1.addToTypstData)(res, { typst: baseTrimmed });
        if (lastPostSub) {
            res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('_', lastPostSub) });
        }
        if (lastPostSup) {
            res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('^', lastPostSup) });
        }
    }
    else {
        // Has prescripts — use attach(base, tl:, bl:, t:, b:)
        var parts = [];
        if (lastPreSup)
            parts.push('tl: ' + lastPreSup);
        if (lastPreSub)
            parts.push('bl: ' + lastPreSub);
        if (lastPostSup)
            parts.push('t: ' + lastPostSup);
        if (lastPostSub)
            parts.push('b: ' + lastPostSub);
        res = (0, common_1.addToTypstData)(res, {
            typst: "attach(".concat((0, escape_utils_1.escapeContentSeparators)(baseTrimmed), ", ").concat(parts.join(', '), ")")
        });
    }
    return res;
};
var mspace = function (node, _serialize) {
    var res = (0, common_1.initTypstData)();
    var atr = getAttributes(node);
    if (!atr || !atr.width) {
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
var mrow = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var openProp = node.getProperty('open');
    var closeProp = node.getProperty('close');
    var hasOpen = openProp !== undefined;
    var hasClose = closeProp !== undefined;
    var openDelim = hasOpen ? String(openProp) : '';
    var closeDelim = hasClose ? String(closeProp) : '';
    // Check if this mrow has \left...\right delimiters
    var isLeftRight = (hasOpen || hasClose)
        && node.getProperty('texClass') === MmlNode_1.TEXCLASS.INNER;
    // If this mrow wraps a matrix, let mtable handle the delimiters
    var hasTableChild = node.childNodes.some(function (child) { return child.kind === 'mtable'; });
    if (isLeftRight && !hasTableChild) {
        // Serialize inner children, skipping the delimiter mo nodes
        // (delimiters are reconstructed from the open/close properties)
        var content = '';
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            // Skip opening delimiter mo (first child matching open property)
            if (i === 0 && child.kind === 'mo') {
                var moText = (0, common_1.getNodeText)(child);
                if (moText === openDelim || (!moText && !openDelim)) {
                    continue;
                }
            }
            // Skip closing delimiter mo (last child matching close property)
            if (i === node.childNodes.length - 1 && child.kind === 'mo') {
                var moText = (0, common_1.getNodeText)(child);
                if (moText === closeDelim || (!moText && !closeDelim)) {
                    continue;
                }
            }
            var data = serialize.visitNode(child, '');
            if ((0, common_1.needsTokenSeparator)(content, data.typst)) {
                content += ' ';
            }
            content += data.typst;
        }
        var open_1 = openDelim ? (0, bracket_utils_1.mapDelimiter)(openDelim) : '';
        var close_1 = closeDelim ? (0, bracket_utils_1.mapDelimiter)(closeDelim) : '';
        var hasVisibleOpen = !!open_1;
        var hasVisibleClose = !!close_1;
        if (hasVisibleOpen && hasVisibleClose) {
            var trimmedContent = content.trim();
            // Optimize common delimiter pairs to Typst shorthand functions,
            // but fall back to lr() when content has top-level , or ;
            // (these would be parsed as argument/row separators inside a function call).
            var hasSep = (0, escape_utils_1.hasTopLevelSeparators)(trimmedContent);
            if (openDelim === '|' && closeDelim === '|') {
                var escaped = (0, escape_utils_1.escapeLrSemicolons)(trimmedContent);
                res = (0, common_1.addToTypstData)(res, { typst: hasSep
                        ? "lr(| ".concat(escaped, " |)") : "abs(".concat(trimmedContent, ")") });
            }
            else if (openDelim === consts_1.DOUBLE_VERT && closeDelim === consts_1.DOUBLE_VERT) {
                var escaped = (0, escape_utils_1.escapeLrSemicolons)(trimmedContent);
                res = (0, common_1.addToTypstData)(res, { typst: hasSep
                        ? "lr(\u2016 ".concat(escaped, " \u2016)") : "norm(".concat(trimmedContent, ")") });
            }
            else if (openDelim === consts_1.LEFT_FLOOR && closeDelim === consts_1.RIGHT_FLOOR) {
                var escaped = (0, escape_utils_1.escapeLrSemicolons)(trimmedContent);
                res = (0, common_1.addToTypstData)(res, { typst: hasSep
                        ? "lr(\u230A ".concat(escaped, " \u230B)") : "floor(".concat(trimmedContent, ")") });
            }
            else if (openDelim === consts_1.LEFT_CEIL && closeDelim === consts_1.RIGHT_CEIL) {
                var escaped = (0, escape_utils_1.escapeLrSemicolons)(trimmedContent);
                res = (0, common_1.addToTypstData)(res, { typst: hasSep
                        ? "lr(\u2308 ".concat(escaped, " \u2309)") : "ceil(".concat(trimmedContent, ")") });
            }
            else {
                // Mismatched ASCII brackets must be escaped: ( [ { start groups, ) closes lr()
                var escapedOpen = (openDelim in consts_1.OPEN_BRACKETS && consts_1.OPEN_BRACKETS[openDelim] !== closeDelim)
                    ? '\\' + openDelim : open_1;
                var escapedClose = (closeDelim in consts_1.CLOSE_BRACKETS && consts_1.CLOSE_BRACKETS[closeDelim] !== openDelim)
                    ? '\\' + closeDelim : close_1;
                res = (0, common_1.addToTypstData)(res, { typst: "lr(".concat(escapedOpen, " ").concat((0, escape_utils_1.escapeLrSemicolons)(trimmedContent), " ").concat(escapedClose, ")") });
            }
        }
        else {
            // One or both delimiters invisible: wrap visible side in lr()
            var trimmed = content.trim();
            var openEsc = openDelim ? (0, bracket_utils_1.escapeLrOpenDelimiter)(openDelim) : '';
            var closeEsc = closeDelim ? (0, bracket_utils_1.escapeLrOpenDelimiter)(closeDelim) : '';
            if (openEsc) {
                res = (0, common_1.addToTypstData)(res, { typst: "lr(".concat(openEsc, " ").concat((0, escape_utils_1.escapeLrSemicolons)(trimmed), ")") });
            }
            else if (closeEsc) {
                res = (0, common_1.addToTypstData)(res, { typst: "lr(".concat((0, escape_utils_1.escapeLrSemicolons)(trimmed), " ").concat(closeEsc, ")") });
            }
            else {
                res = (0, common_1.addToTypstData)(res, { typst: trimmed });
            }
        }
    }
    else if (isLeftRight && hasTableChild) {
        // Matrix/cases inside \left...\right: skip delimiter mo children
        // (the mtable handler uses the parent mrow's open/close properties for delimiters)
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            if (i === 0 && child.kind === 'mo') {
                var moText = (0, common_1.getNodeText)(child);
                if (moText === openDelim || (!moText && !openDelim)) {
                    continue;
                }
            }
            if (i === node.childNodes.length - 1 && child.kind === 'mo') {
                var moText = (0, common_1.getNodeText)(child);
                if (moText === closeDelim || (!moText && !closeDelim)) {
                    continue;
                }
            }
            var data = serialize.visitNode(child, '');
            res = (0, common_1.addToTypstData)(res, data);
        }
    }
    else {
        // Check for OPEN/CLOSE mrow pattern wrapping a binom
        // MathJax represents \binom{n}{k} as mrow(ORD) > [mrow(OPEN), mfrac(linethickness=0), mrow(CLOSE)]
        // Since binom() in Typst already includes parens, skip the delimiter mrows
        if (node.childNodes.length === 3) {
            var first = node.childNodes[0];
            var middle = node.childNodes[1];
            var last = node.childNodes[2];
            if (middle.kind === 'mfrac') {
                var midAtr = getAttributes(middle);
                if (midAtr && (midAtr.linethickness === '0' || midAtr.linethickness === 0)
                    && first.texClass === MmlNode_1.TEXCLASS.OPEN
                    && last.texClass === MmlNode_1.TEXCLASS.CLOSE) {
                    var data = serialize.visitNode(middle, '');
                    res = (0, common_1.addToTypstData)(res, data);
                    return res;
                }
            }
        }
        // Regular mrow: concatenate children with spacing to prevent merging
        for (var i = 0; i < node.childNodes.length; i++) {
            // Thousand-separator chain: mn","mn","mn... (handles 41,70,000 and 1,000,000)
            if ((0, common_1.isThousandSepComma)(node, i)) {
                var numData = serialize.visitNode(node.childNodes[i], '');
                if ((0, common_1.needsTokenSeparator)(res.typst, numData.typst)) {
                    (0, common_1.addSpaceToTypstData)(res);
                }
                var chainTypst = numData.typst;
                var j = i;
                while ((0, common_1.isThousandSepComma)(node, j)) {
                    var nextData = serialize.visitNode(node.childNodes[j + 2], '');
                    chainTypst += '\\,' + nextData.typst;
                    j += 2;
                }
                res = (0, common_1.addToTypstData)(res, { typst: chainTypst });
                i = j;
                continue;
            }
            var data = serialize.visitNode(node.childNodes[i], '');
            if ((0, common_1.needsTokenSeparator)(res.typst, data.typst)) {
                (0, common_1.addSpaceToTypstData)(res);
            }
            res = (0, common_1.addToTypstData)(res, data);
        }
    }
    return res;
};
/** Check if a node subtree contains an mphantom (shallow — up to 5 levels). */
var hasPhantomChild = function (node) {
    var check = function (n, depth) {
        var e_1, _a;
        if (!n || depth > SHALLOW_TREE_MAX_DEPTH)
            return false;
        if (n.kind === 'mphantom')
            return true;
        if (n.childNodes) {
            try {
                for (var _b = tslib_1.__values(n.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var c = _c.value;
                    if (check(c, depth + 1))
                        return true;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return false;
    };
    return check(node, 0);
};
/** Check if node has an msub/msup/msubsup/mmultiscripts ancestor (mhchem alignment pattern). */
var hasScriptAncestor = function (node) {
    var cur = node === null || node === void 0 ? void 0 : node.parent;
    while (cur) {
        var k = cur.kind;
        if (k === 'msub' || k === 'msup' || k === 'msubsup' || k === 'mmultiscripts')
            return true;
        cur = cur.parent;
    }
    return false;
};
var mpadded = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var atr = getAttributes(node);
    // mhchem alignment phantom: mpadded width=0 or height=0 containing mphantom
    // inside msub/msup/msubsup — zero-size alignment box, emit empty string.
    // Only skip inside script ancestors; standalone \hphantom/\vphantom must still produce #hide().
    if (((atr === null || atr === void 0 ? void 0 : atr.width) === 0 || (atr === null || atr === void 0 ? void 0 : atr.height) === 0) && hasPhantomChild(node) && hasScriptAncestor(node)) {
        return res;
    }
    var data = (0, common_1.handleAll)(node, serialize);
    var content = data.typst.trim();
    // Handle mathbackground attribute (\colorbox{color}{...})
    var rawBg = (atr === null || atr === void 0 ? void 0 : atr.mathbackground) || '';
    var mathbg = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
    if (mathbg && content) {
        var fillValue = mathbg.startsWith('#')
            ? "rgb(\"".concat(mathbg, "\")")
            : mathbg;
        res = (0, common_1.addToTypstData)(res, {
            typst: "#highlight(fill: ".concat(fillValue, ")[$").concat(content, "$]"),
            typst_inline: content
        });
        return res;
    }
    res = (0, common_1.addToTypstData)(res, data);
    return res;
};
var mphantom = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var data = (0, common_1.handleAll)(node, serialize);
    var content = data.typst.trim();
    if (content) {
        res = (0, common_1.addToTypstData)(res, { typst: "#hide($".concat(content, "$)") });
    }
    return res;
};
var menclose = function (node, serialize) {
    var _a;
    var res = (0, common_1.initTypstData)();
    var atr = getAttributes(node);
    var notation = ((_a = atr === null || atr === void 0 ? void 0 : atr.notation) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    var data = (0, common_1.handleAll)(node, serialize);
    var content = (0, common_1.typstPlaceholder)(data.typst.trim());
    if (notation.includes('box')) {
        // \boxed → #box with stroke
        res = (0, common_1.addToTypstData)(res, { typst: "#box(stroke: 0.5pt, inset: 3pt, $".concat(content, "$)"), typst_inline: content });
    }
    else if (notation.includes('updiagonalstrike') || notation.includes('downdiagonalstrike')) {
        // \cancel uses updiagonalstrike (lower-left to upper-right) → Typst cancel() default
        // \bcancel uses downdiagonalstrike (upper-left to lower-right) → Typst cancel(inverted: true)
        if (notation.includes('downdiagonalstrike') && !notation.includes('updiagonalstrike')) {
            res = (0, common_1.addToTypstData)(res, { typst: "cancel(inverted: #true, ".concat((0, escape_utils_1.escapeContentSeparators)(content), ")") });
        }
        else {
            res = (0, common_1.addToTypstData)(res, { typst: "cancel(".concat((0, escape_utils_1.escapeContentSeparators)(content), ")") });
        }
    }
    else if (notation.includes('horizontalstrike')) {
        res = (0, common_1.addToTypstData)(res, { typst: "cancel(".concat((0, escape_utils_1.escapeContentSeparators)(content), ")") });
    }
    else if (notation.includes('longdiv')) {
        // \longdiv / \enclose{longdiv} → overline(")" content)
        res = (0, common_1.addToTypstData)(res, { typst: "overline(\")\"".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(content)), ")") });
    }
    else if (notation.includes('circle')) {
        // \enclose{circle} → #circle with inset
        res = (0, common_1.addToTypstData)(res, { typst: "#circle(inset: 3pt, $".concat(content, "$)"), typst_inline: content });
    }
    else if (notation.includes('radical')) {
        // \enclose{radical} → sqrt()
        res = (0, common_1.addToTypstData)(res, { typst: "sqrt(".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(content)), ")") });
    }
    else if (notation.includes('top')) {
        // \enclose{top} → overline()
        res = (0, common_1.addToTypstData)(res, { typst: "overline(".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(content)), ")") });
    }
    else if (notation.includes('bottom')) {
        // \enclose{bottom} → underline()
        // Detect \smash{)} prefix (used in \lcm macro): strip leading ) or \), trailing spacing, no space
        if (content.startsWith(')') || content.startsWith('\\)')) {
            var skip = content.startsWith('\\)') ? 2 : 1;
            var inner = content.slice(skip).trim().replace(consts_1.RE_TRAILING_SPACING, '');
            res = (0, common_1.addToTypstData)(res, { typst: "underline(\")\"".concat((0, escape_utils_1.escapeContentSeparators)(inner), ")") });
        }
        else {
            res = (0, common_1.addToTypstData)(res, { typst: "underline(".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(content)), ")") });
        }
    }
    else {
        // Unknown notation: pass through content
        res = (0, common_1.addToTypstData)(res, data);
    }
    return res;
};
var handle = function (node, serialize) {
    var kind = node.kind;
    var handler = kind in handlers
        ? handlers[kind]
        : defaultHandler;
    try {
        return handler(node, serialize);
    }
    catch (e) {
        if (typeof console !== 'undefined' && console.warn) {
            console.warn("[typst-serializer] handler error for \"".concat(kind || 'unknown', "\":"), e);
        }
        return (0, common_1.initTypstData)();
    }
};
exports.handle = handle;
/** Check if mstyle contains only operator-internal mspace nodes (inside a TeXAtom chain).
 *  These represent spacing injected by MathJax for compound operators (e.g. \oint)
 *  and should be suppressed. Explicit user spacing (\, \quad) is preserved. */
var isOperatorInternalSpacing = function (node) {
    var children = node.childNodes || [];
    if (children.length !== 1 || !children[0].isInferred)
        return false;
    var innerChildren = children[0].childNodes || [];
    if (innerChildren.length === 0 || !innerChildren.every(function (child) { return child.kind === 'mspace'; })) {
        return false;
    }
    var p = node.parent;
    for (var d = 0; d < ANCESTOR_MAX_DEPTH && p; d++) {
        if (p.kind === 'math')
            break;
        if (p.kind === 'TeXAtom')
            return true;
        p = p.parent;
    }
    return false;
};
/** Wrap a Typst expression in #text(fill: color)[...].
 *  Hex colors (#D61F06) are converted to rgb("...") format. */
var wrapWithColor = function (content, mathcolor) {
    var fillValue = mathcolor.startsWith('#')
        ? "rgb(\"".concat(mathcolor, "\")")
        : mathcolor;
    return "#text(fill: ".concat(fillValue, ")[").concat(content, "]");
};
var mstyle = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    if (isOperatorInternalSpacing(node)) {
        return res;
    }
    var atr = getAttributes(node);
    var rawColor = (atr === null || atr === void 0 ? void 0 : atr.mathcolor) || '';
    var mathcolor = rawColor && rawColor !== MATHJAX_INHERIT_SENTINEL ? rawColor : '';
    var data = (0, common_1.handleAll)(node, serialize);
    if (mathcolor && data.typst.trim()) {
        res = (0, common_1.addToTypstData)(res, { typst: wrapWithColor(data.typst.trim(), mathcolor) });
        return res;
    }
    return data;
};
var handlers = {
    mi: mi,
    mo: mo,
    mn: mn,
    mfrac: mfrac,
    msup: msup,
    msub: msub,
    msubsup: msubsup,
    msqrt: msqrt,
    mover: mover,
    munder: munder,
    munderover: munderover,
    mmultiscripts: mmultiscripts,
    mspace: mspace,
    mtext: mtext,
    mtable: table_handlers_1.mtable,
    mrow: mrow,
    mtr: table_handlers_1.mtr,
    mpadded: mpadded,
    mroot: mroot,
    menclose: menclose,
    mstyle: mstyle,
    mphantom: mphantom,
};
//# sourceMappingURL=handlers.js.map
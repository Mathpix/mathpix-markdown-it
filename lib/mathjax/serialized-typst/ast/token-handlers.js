"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mtextAst = exports.moAst = exports.miAst = exports.mspaceAst = exports.mnAst = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("../consts");
var common_1 = require("../common");
var typst_symbol_map_1 = require("../typst-symbol-map");
var builders_1 = require("./builders");
var INVISIBLE_CHARS = new Set([
    consts_1.FUNC_APPLY, consts_1.INVISIBLE_TIMES, consts_1.INVISIBLE_SEP, consts_1.INVISIBLE_PLUS,
]);
var COMBINING_NOT_SLASH = '\u0338';
/** Precomposed characters with combining marks (ṭ, ñ, é) decompose into
 *  base + mark in NFD. Typst math can't shape them as single glyphs —
 *  they must be wrapped in text() ("ṭ") instead of bare symbol (ṭ). */
var hasCombiningMarks = function (s) {
    return s.normalize('NFD').length > s.length;
};
var stripCombiningNot = function (value) {
    if (value.endsWith(COMBINING_NOT_SLASH)) {
        return [value.slice(0, -1), true];
    }
    return [value, false];
};
var BB_SHORTHAND_LETTERS = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
var SPACED_OPERATORS = new Set([
    '+', '-', '=', '<', '>', consts_1.MINUS_SIGN, consts_1.PLUS_MINUS, consts_1.MINUS_PLUS,
]);
var MATHJAX_MULTIWORD_OPS = new Map([
    ['lim sup', 'limsup'],
    ['lim inf', 'liminf'],
]);
var MSPACE_WIDTH_MAP = new Map([
    ['2em', 'wide'],
    ['1em', 'quad'],
    ['0.2778em', 'thick'],
    ['0.278em', 'thick'],
    ['0.2222em', 'med'],
    ['0.222em', 'med'],
    ['0.1667em', 'thin'],
    ['0.167em', 'thin'],
    ['-0.1667em', null],
    ['-0.167em', null],
]);
var EMPTY_RESULT = { node: (0, builders_1.seq)([]) };
var singleResult = function (node) { return ({ node: node }); };
var isUnaryPrefix = function (node) {
    if ((0, common_1.isFirstChild)(node)) {
        return true;
    }
    var parent = node.parent;
    if (!parent) {
        return false;
    }
    var idx = (0, common_1.getSiblingIndex)(node);
    if (idx <= 0) {
        return false;
    }
    var prev = parent.childNodes[idx - 1];
    return !!prev && prev.kind === 'mo' && prev.texClass === MmlNode_1.TEXCLASS.OPEN;
};
var normalizeOperatorName = function (value) {
    return value.replace(consts_1.RE_UNICODE_SPACES, ' ').trim();
};
var isWordLikeToken = function (value) {
    return value.length > 1 && consts_1.RE_WORD_START.test(value);
};
var isInScriptContext = function (node) {
    return !!node.parent && consts_1.SCRIPT_NODE_KINDS.has(node.parent.kind);
};
var mnAst = function (node, _serialize) {
    var value = (0, common_1.getNodeText)(node);
    var attrs = (0, common_1.getAttrs)(node);
    var mathvariant = attrs.mathvariant || '';
    if (mathvariant && mathvariant !== 'normal') {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            return singleResult((0, builders_1.funcCall)(fontFn, [(0, builders_1.posArg)((0, builders_1.mathVal)(value ? (0, builders_1.num)(value) : (0, builders_1.placeholder)()))]));
        }
    }
    return singleResult((0, builders_1.num)(value));
};
exports.mnAst = mnAst;
var mspaceAst = function (node, _serialize) {
    var attrs = (0, common_1.getAttrs)(node);
    if (!attrs.width) {
        return EMPTY_RESULT;
    }
    var width = attrs.width.toString().trim();
    var mapped = MSPACE_WIDTH_MAP.get(width);
    if (mapped !== undefined) {
        if (mapped === null) {
            return EMPTY_RESULT;
        }
        return singleResult((0, builders_1.space)(mapped));
    }
    return singleResult((0, builders_1.space)(null));
};
exports.mspaceAst = mspaceAst;
var miAst = function (node, _serialize) {
    if (!node.childNodes || node.childNodes.length === 0) {
        return EMPTY_RESULT;
    }
    var rawValue = (0, common_1.getNodeText)(node);
    if (!rawValue) {
        return EMPTY_RESULT;
    }
    var _a = tslib_1.__read(stripCombiningNot(rawValue), 2), value = _a[0], hasNot = _a[1];
    if (!value) {
        return EMPTY_RESULT;
    }
    var attrs = (0, common_1.getAttrs)(node);
    var mathvariant = attrs.mathvariant || '';
    var isKnownSymbol = typst_symbol_map_1.typstSymbolMap.has(value);
    var isKnownOperator = consts_1.TYPST_MATH_OPERATORS.has(value);
    var typstSymbol = (0, typst_symbol_map_1.findTypstSymbol)(value);
    var result;
    // \operatorname{name}: texClass=OP, multi-char, not built-in
    if (node.texClass === MmlNode_1.TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
        result = (0, builders_1.funcCall)('op', [(0, builders_1.posArg)((0, builders_1.strVal)(value))]);
    }
    // \mathrm{d} → dif
    else if (mathvariant === 'normal' && value === 'd' && !isKnownSymbol) {
        result = (0, builders_1.symbol)('dif');
    }
    // \mathbb{R} → RR
    else if (mathvariant === 'double-struck' && value.length === 1 && BB_SHORTHAND_LETTERS.has(value)) {
        result = (0, builders_1.symbol)(value + value);
    }
    // Font wrapping: bold("text"), italic(symbol), upright(bold("text")), etc.
    else if (mathvariant
        && mathvariant !== 'italic'
        && !isKnownOperator
        && (!isKnownSymbol || mathvariant === 'bold' || mathvariant === 'bold-italic')
        && !(isKnownSymbol && typstSymbol.startsWith('\\'))) {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            var useText = !isKnownSymbol
                && (value.length > 1 || hasCombiningMarks(value));
            var innerNode = useText
                ? (0, builders_1.text)(value)
                : (0, builders_1.symbol)(typstSymbol);
            if (mathvariant === 'bold' && !isKnownSymbol) {
                result = (0, builders_1.funcCall)('upright', [(0, builders_1.posArg)((0, builders_1.mathVal)((0, builders_1.funcCall)('bold', [(0, builders_1.posArg)((0, builders_1.mathVal)(innerNode))])))]);
            }
            else {
                result = (0, builders_1.funcCall)(fontFn, [(0, builders_1.posArg)((0, builders_1.mathVal)(innerNode))]);
            }
        }
        else {
            result = !isKnownSymbol && hasCombiningMarks(value)
                ? (0, builders_1.text)(value)
                : (0, builders_1.symbol)(typstSymbol);
        }
    }
    else {
        result = !isKnownSymbol && hasCombiningMarks(value)
            ? (0, builders_1.text)(value)
            : (0, builders_1.symbol)(typstSymbol);
    }
    if (hasNot) {
        result = (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(result))]);
    }
    return singleResult(result);
};
exports.miAst = miAst;
var moAst = function (node, _serialize) {
    var rawValue = (0, common_1.getNodeText)(node);
    var _a = tslib_1.__read(stripCombiningNot(rawValue), 2), value = _a[0], hasNot = _a[1];
    // Unpaired bracket — use symbol names in mat() context, escaped forms elsewhere
    var unpairedDir = (0, common_1.getProp)(node, consts_1.UNPAIRED_BRACKET_PROP);
    if (unpairedDir) {
        var isTableContext = unpairedDir.startsWith('table-');
        var mapping = isTableContext ? consts_1.UNPAIRED_BRACKET_TABLE_TYPST : consts_1.UNPAIRED_BRACKET_TYPST;
        if (mapping[value]) {
            var bracketNode = (0, builders_1.symbol)(mapping[value]);
            if (hasNot) {
                bracketNode = (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(bracketNode))]);
            }
            return singleResult(bracketNode);
        }
    }
    if (INVISIBLE_CHARS.has(value))
        return EMPTY_RESULT;
    var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
    var normalizedName = normalizeOperatorName(value);
    // Multi-word operators: "lim sup" → "limsup"
    var mappedMultiword = MATHJAX_MULTIWORD_OPS.get(normalizedName);
    if (mappedMultiword) {
        var mwNode = (0, builders_1.symbol)(mappedMultiword);
        if (hasNot) {
            mwNode = (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(mwNode))]);
        }
        return singleResult(mwNode);
    }
    // Named operators: multi-char non-builtin → op("name")
    if (isWordLikeToken(normalizedName)
        && !typst_symbol_map_1.typstSymbolMap.has(value)
        && !consts_1.TYPST_MATH_OPERATORS.has(normalizedName)) {
        var opNode = (0, builders_1.funcCall)('op', [(0, builders_1.posArg)((0, builders_1.strVal)(normalizedName))]);
        if (hasNot) {
            opNode = (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(opNode))]);
        }
        return singleResult(opNode);
    }
    // Bare curly braces: \{ and \} produce mo({) and mo(}) without \left/\right.
    // Paired braces use escaped \{ \} so Typst treats them as delimiters (auto-scaling).
    // Unpaired braces use brace.l/brace.r (handled above via UNPAIRED_BRACKET_PROP).
    if (value === '{') {
        var braceNode = (0, builders_1.symbol)('\\{');
        if (hasNot) {
            braceNode = (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(braceNode))]);
        }
        return singleResult(braceNode);
    }
    if (value === '}') {
        var braceNode = (0, builders_1.symbol)('\\}');
        if (hasNot) {
            braceNode = (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(braceNode))]);
        }
        return singleResult(braceNode);
    }
    var result = (0, builders_1.symbol)(typstValue);
    if (hasNot) {
        result = (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(result))]);
    }
    var inScript = isInScriptContext(node);
    // Spaced binary/unary operators: +, -, =, <, >, etc.
    if (!inScript && SPACED_OPERATORS.has(value)) {
        if (isUnaryPrefix(node)) {
            return singleResult(result);
        }
        var spacedOp = (0, builders_1.operator)(typstValue, { spaced: true });
        return singleResult(hasNot ? (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(spacedOp))]) : spacedOp);
    }
    if (!inScript && value === ',') {
        return singleResult((0, builders_1.operator)(','));
    }
    // /, ;, " — OperatorNode, serializer escapes via OPERATOR_ESCAPE_MAP
    if (value === '/' || value === ';' || value === '"') {
        return singleResult((0, builders_1.operator)(value));
    }
    return singleResult(result);
};
exports.moAst = moAst;
var mtextAst = function (node, _serialize) {
    if (!node.childNodes || node.childNodes.length === 0) {
        return EMPTY_RESULT;
    }
    var value = (0, common_1.getChildText)(node);
    if (!value || !value.trim()) {
        return EMPTY_RESULT;
    }
    value = value.replace(consts_1.RE_NBSP, ' ');
    if (value.length === 1 && typst_symbol_map_1.typstSymbolMap.has(value)) {
        return singleResult((0, builders_1.symbol)((0, typst_symbol_map_1.findTypstSymbol)(value)));
    }
    var textNode = (0, builders_1.text)(value, { preserveBackslash: true });
    var attrs = (0, common_1.getAttrs)(node);
    var mathvariant = attrs.mathvariant || '';
    if (mathvariant && mathvariant !== 'normal') {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            return singleResult((0, builders_1.funcCall)(fontFn, [(0, builders_1.posArg)((0, builders_1.mathVal)(textNode))]));
        }
    }
    return singleResult(textNode);
};
exports.mtextAst = mtextAst;
//# sourceMappingURL=token-handlers.js.map
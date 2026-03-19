"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mspace = exports.mtext = exports.mn = exports.mo = exports.mi = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("./consts");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
var escape_utils_1 = require("./escape-utils");
var INVISIBLE_CHARS = new Set([
    consts_1.FUNC_APPLY, consts_1.INVISIBLE_TIMES, consts_1.INVISIBLE_SEP, consts_1.INVISIBLE_PLUS,
]);
/** Combining long solidus overlay (U+0338) — used by MathJax for \not on mi/mo/mtext */
var COMBINING_NOT_SLASH = '\u0338';
/** Strip trailing combining not slash and return [cleanValue, hasCancelSlash] */
var stripCombiningNot = function (value) {
    if (value.endsWith(COMBINING_NOT_SLASH)) {
        return [value.slice(0, -1), true];
    }
    return [value, false];
};
var BB_SHORTHAND_LETTERS = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
// Operators that get spaces around them in non-script contexts for readability
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
var MSPACE_WIDTH_MAP = new Map([
    ['2em', ' wide '],
    ['1em', ' quad '],
    ['0.2778em', ' thick '],
    ['0.278em', ' thick '],
    ['0.2222em', ' med '],
    ['0.222em', ' med '],
    ['0.1667em', ' thin '],
    ['0.167em', ' thin '],
    ['-0.1667em', ''],
    ['-0.167em', ''],
]);
/** Check if a +/- operator is in unary prefix position (after OPEN paren or at start).
 *  Unary: (-1), (+x). Binary: a - b, x + 1, )+ (end of group). */
var isUnaryPrefix = function (node) {
    if ((0, common_1.isFirstChild)(node))
        return true;
    var parent = node.parent;
    if (!parent)
        return false;
    var idx = (0, common_1.getSiblingIndex)(node);
    if (idx <= 0)
        return false;
    var prev = parent.childNodes[idx - 1];
    // After an opening bracket → unary
    if (prev.kind === 'mo' && prev.texClass === MmlNode_1.TEXCLASS.OPEN)
        return true;
    return false;
};
/** Normalize multi-word operator name (thin/non-breaking spaces → regular space) */
var normalizeOperatorName = function (value) {
    return value.replace(consts_1.RE_UNICODE_SPACES, ' ').trim();
};
/** True when the token looks like a word (multi-char, starts with letter/dot) */
var isWordLikeToken = function (value) {
    return value.length > 1 && consts_1.RE_WORD_START.test(value);
};
/** Check if a node is inside a sub/superscript context */
var isInScriptContext = function (node) {
    return !!node.parent && consts_1.SCRIPT_NODE_KINDS.has(node.parent.kind);
};
/** Shorthand: create ITypstData with a single typst string */
var singleTypst = function (typst) {
    return (0, common_1.addToTypstData)((0, common_1.initTypstData)(), { typst: typst });
};
/** Extract the primary Typst symbol text from a node (mi/mo).
 *  Gets the first child's text and maps it through findTypstSymbol. */
var getNodeTypstSymbol = function (node) {
    var text = (0, common_1.getChildText)(node);
    if (!text)
        return '';
    return (0, typst_symbol_map_1.findTypstSymbol)(text);
};
/** Wrap value with context-dependent spaces (before/after sibling-aware) */
var withContextSpaces = function (node, value) {
    var before = needsSpaceBefore(node) ? ' ' : '';
    var after = needsSpaceAfter(node) ? ' ' : '';
    return before + value + after;
};
var needsSpaceBefore = function (node) {
    var parent = node.parent;
    if (!parent || (0, common_1.isFirstChild)(node))
        return false;
    var index = (0, common_1.getSiblingIndex)(node);
    if (index <= 0)
        return false;
    var prev = parent.childNodes[index - 1];
    if (!prev)
        return false;
    if (prev.kind === 'mi' || prev.kind === 'mo') {
        return consts_1.RE_WORD_DOT_END.test(getNodeTypstSymbol(prev));
    }
    return prev.kind === 'mn';
};
var needsSpaceAfter = function (node) {
    var parent = node.parent;
    if (!parent || (0, common_1.isLastChild)(node))
        return false;
    if (isInScriptContext(node))
        return false;
    var index = (0, common_1.getSiblingIndex)(node);
    if (index < 0)
        return false;
    var next = parent.childNodes[index + 1];
    if (!next)
        return false;
    // Skip invisible function application (U+2061)
    if ((0, common_1.getChildText)(next) === consts_1.FUNC_APPLY && index + 2 < parent.childNodes.length) {
        next = parent.childNodes[index + 2];
    }
    if (!next)
        return false;
    if (next.kind === 'mi' || next.kind === 'mo') {
        return consts_1.RE_WORD_DOT_START.test(getNodeTypstSymbol(next));
    }
    return next.kind === 'mn';
};
/** Handle unpaired brackets like \left( ... \right. */
var trySerializeUnpairedBracket = function (node, value) {
    var unpairedDir = (0, common_1.getProp)(node, consts_1.UNPAIRED_BRACKET_PROP);
    if (!unpairedDir || !consts_1.UNPAIRED_BRACKET_TYPST[value])
        return null;
    return singleTypst(withContextSpaces(node, consts_1.UNPAIRED_BRACKET_TYPST[value]));
};
/** Handle multi-word MathJax operator names (e.g. "lim sup" → "limsup") */
var trySerializeMultiwordOp = function (node, normalizedName) {
    var mappedOp = MATHJAX_MULTIWORD_OPS.get(normalizedName);
    if (!mappedOp)
        return null;
    return singleTypst(withContextSpaces(node, mappedOp));
};
/** Handle custom named operators (e.g. \injlim → op("inj lim")) */
var trySerializeNamedOperator = function (node, value, normalizedName) {
    if (isWordLikeToken(normalizedName)
        && !typst_symbol_map_1.typstSymbolMap.has(value)
        && !consts_1.TYPST_MATH_OPERATORS.has(normalizedName)) {
        return singleTypst(withContextSpaces(node, "op(\"".concat((0, common_1.escapeTypstString)(normalizedName), "\")")));
    }
    return null;
};
/** True when the next sibling is ( or [ — needs a space to prevent
 *  Typst from interpreting "symbol(" as a function call */
var needsDisambiguatingSpaceAfter = function (node, inScript) {
    if (inScript)
        return false;
    var parent = node.parent;
    if (!parent)
        return false;
    var idx = (0, common_1.getSiblingIndex)(node);
    var next = idx >= 0 ? parent.childNodes[idx + 1] : undefined;
    if (!next || next.kind !== 'mo')
        return false;
    var nt = (0, common_1.getNodeText)(next);
    return nt === '(' || nt === '[';
};
/** Handle word-like Typst symbol names that need spacing and bracket disambiguation */
var trySerializeWordLikeOperator = function (node, typstValue, inScript) {
    if (!isWordLikeToken(typstValue))
        return null;
    var spaceBefore = needsSpaceBefore(node) ? ' ' : '';
    var spaceAfter = (needsSpaceAfter(node) || needsDisambiguatingSpaceAfter(node, inScript)) ? ' ' : '';
    return singleTypst(spaceBefore + typstValue + spaceAfter);
};
var mi = function (node, _serialize) {
    if (!node.childNodes || node.childNodes.length === 0) {
        return (0, common_1.initTypstData)();
    }
    // getNodeText (not getChildText) to capture combining chars like U+0338 (\not)
    var rawValue = (0, common_1.getNodeText)(node);
    if (!rawValue) {
        return (0, common_1.initTypstData)();
    }
    // \not on mi: combining long solidus overlay (U+0338) → cancel()
    var _a = tslib_1.__read(stripCombiningNot(rawValue), 2), value = _a[0], hasNot = _a[1];
    if (!value)
        return (0, common_1.initTypstData)();
    var attrs = (0, common_1.getAttrs)(node);
    var mathvariant = attrs.mathvariant || '';
    var isKnownSymbol = typst_symbol_map_1.typstSymbolMap.has(value);
    var isKnownOperator = consts_1.TYPST_MATH_OPERATORS.has(value);
    var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
    // \operatorname{name}: texClass=OP, multi-char, not built-in
    // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement.
    if (node.texClass === MmlNode_1.TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
        typstValue = "op(\"".concat((0, common_1.escapeTypstString)(value), "\")");
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
            var inner = value.length > 1 && !isKnownSymbol ? "\"".concat((0, common_1.escapeTypstString)(value), "\"") : typstValue;
            // \mathbf produces mathvariant="bold" which is upright bold in LaTeX
            if (mathvariant === 'bold' && !isKnownSymbol) {
                typstValue = "upright(bold(".concat(inner, "))");
            }
            else {
                typstValue = "".concat(fontFn, "(").concat(inner, ")");
            }
        }
    }
    if (hasNot)
        typstValue = "cancel(".concat(typstValue, ")");
    // Add spacing around multi-character word-like Typst symbol names
    if (isWordLikeToken(typstValue)) {
        return singleTypst(withContextSpaces(node, typstValue));
    }
    return singleTypst(typstValue);
};
exports.mi = mi;
var mo = function (node, _serialize) {
    var rawValue = (0, common_1.getNodeText)(node);
    // \not on mo: combining long solidus overlay (U+0338) → cancel()
    var _a = tslib_1.__read(stripCombiningNot(rawValue), 2), value = _a[0], hasNot = _a[1];
    var unpaired = trySerializeUnpairedBracket(node, value);
    if (unpaired)
        return hasNot ? singleTypst("cancel(".concat(unpaired.typst, ")")) : unpaired;
    if (INVISIBLE_CHARS.has(value))
        return (0, common_1.initTypstData)();
    var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
    var normalizedName = normalizeOperatorName(value);
    var multiword = trySerializeMultiwordOp(node, normalizedName);
    if (multiword)
        return hasNot ? singleTypst("cancel(".concat(multiword.typst.trim(), ")")) : multiword;
    // Don't add limits: #true here — parent handler decides placement.
    var namedOp = trySerializeNamedOperator(node, value, normalizedName);
    if (namedOp)
        return hasNot ? singleTypst("cancel(".concat(namedOp.typst.trim(), ")")) : namedOp;
    if (hasNot)
        typstValue = "cancel(".concat(typstValue, ")");
    var inScript = isInScriptContext(node);
    var wordLike = trySerializeWordLikeOperator(node, typstValue, inScript);
    if (wordLike)
        return wordLike;
    if (!inScript && SPACED_OPERATORS.has(value)) {
        // Unary prefix operators (after OPEN paren or at start) get no space after:
        // (-1) → (-1), not ( - 1). Binary/other contexts get spaces on both sides.
        if (isUnaryPrefix(node)) {
            return singleTypst(needsSpaceBefore(node) ? ' ' + typstValue : typstValue);
        }
        return singleTypst(' ' + typstValue + ' ');
    }
    if (!inScript && value === ',') {
        return singleTypst(', ');
    }
    // Escape slash: in Typst math, / creates a fraction; \/ is a literal slash
    if (value === '/') {
        return singleTypst('\\/');
    }
    return singleTypst(typstValue);
};
exports.mo = mo;
var mn = function (node, _serialize) {
    var value = (0, common_1.getNodeText)(node);
    var attrs = (0, common_1.getAttrs)(node);
    var mathvariant = attrs.mathvariant || '';
    if (mathvariant && mathvariant !== 'normal') {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            var content = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(value));
            return singleTypst("".concat(fontFn, "(").concat(content, ")"));
        }
    }
    return singleTypst(value);
};
exports.mn = mn;
var mtext = function (node, _serialize) {
    if (!node.childNodes || node.childNodes.length === 0) {
        return (0, common_1.initTypstData)();
    }
    var value = (0, common_1.getChildText)(node);
    if (!value || !value.trim()) {
        return (0, common_1.initTypstData)();
    }
    value = value.replace(consts_1.RE_NBSP, ' ');
    if (value.length === 1 && typst_symbol_map_1.typstSymbolMap.has(value)) {
        var typstValue = (0, typst_symbol_map_1.findTypstSymbol)(value);
        return singleTypst(withContextSpaces(node, typstValue));
    }
    // Only escape quotes here — backslashes in mtext content are intentional
    // (e.g. numcases text like "x \geq 0" should keep the backslash as-is)
    var textContent = "\"".concat(value.replace(/"/g, '\\"'), "\"");
    var attrs = (0, common_1.getAttrs)(node);
    var mathvariant = attrs.mathvariant || '';
    if (mathvariant && mathvariant !== 'normal') {
        var fontFn = typst_symbol_map_1.typstFontMap.get(mathvariant);
        if (fontFn) {
            textContent = "".concat(fontFn, "(").concat(textContent, ")");
        }
    }
    return singleTypst(textContent);
};
exports.mtext = mtext;
var mspace = function (node, _serialize) {
    var attrs = (0, common_1.getAttrs)(node);
    if (!attrs.width) {
        return (0, common_1.initTypstData)();
    }
    var width = attrs.width.toString().trim();
    var mapped = MSPACE_WIDTH_MAP.get(width);
    if (mapped !== undefined) {
        return mapped ? singleTypst(mapped) : (0, common_1.initTypstData)();
    }
    return singleTypst(' ');
};
exports.mspace = mspace;
//# sourceMappingURL=token-handlers.js.map
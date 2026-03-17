"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mmultiscripts = exports.munderover = exports.munder = exports.mover = exports.mroot = exports.msqrt = exports.msubsup = exports.msub = exports.msup = exports.mfrac = void 0;
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("./consts");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
var escape_utils_1 = require("./escape-utils");
// Prime symbol → Typst ' shorthand mapping
var PRIME_SHORTHANDS = new Map([
    ['prime', "'"],
    ['prime.double', "''"],
    ['prime.triple', "'''"],
]);
// Regex to detect overbrace/overbracket/underbrace/underbracket as outermost call
var BRACE_ANNOTATION_RE = /^(overbrace|overbracket|underbrace|underbracket)\(([\s\S]+?)\)$/;
var RE_SPECIAL_FN_CALL = /^(overbrace|underbrace|overbracket|underbracket|op)\(/;
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
/** Append ", limits: #true" inside an op() wrapper: op("name") → op("name", limits: #true) */
var addLimitsParam = function (opExpr) {
    return opExpr.endsWith(')') ? "".concat(opExpr.slice(0, -1), ", limits: #true)") : opExpr;
};
/** Match a brace annotation (overbrace/underbrace/etc.) and return it with annotation as second argument.
 *  Returns null if baseTrimmed doesn't match any of the specified kinds. */
var matchBraceAnnotation = function (baseTrimmed, annotation, kinds) {
    var m = BRACE_ANNOTATION_RE.exec(baseTrimmed);
    var kind = m === null || m === void 0 ? void 0 : m[1];
    if (!kind || !kinds.includes(kind))
        return null;
    var base = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(m[2]));
    var ann = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(annotation));
    return { typst: "".concat(kind, "(").concat(base, ", ").concat(ann, ")") };
};
/** Get movablelimits attribute from a node (typically the base mo of munderover) */
var getMovablelimits = function (node) {
    if (!node || node.kind !== 'mo')
        return undefined;
    try {
        var atr = (0, common_1.getAttrs)(node);
        return atr.movablelimits;
    }
    catch (_e) {
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
    for (var i = 0; i < consts_1.SHALLOW_TREE_MAX_DEPTH && moNode && moNode.kind !== 'mo'; i++) {
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
        var atr = (0, common_1.getAttrs)(moNode);
        return atr.stretchy === true;
    }
    catch (_e) {
        return false;
    }
};
/** Check if baseTrimmed is a Typst operator that natively places limits
 *  above/below in display mode (e.g. sum, lim, max). */
var isNativeDisplayLimitOp = function (baseTrimmed) {
    return TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);
};
/** Check if baseTrimmed starts with a special function call
 *  (overbrace, underbrace, overbracket, underbracket, op). */
var isSpecialFnCall = function (baseTrimmed) {
    return RE_SPECIAL_FN_CALL.test(baseTrimmed);
};
/** Build limit-placement base, returns different block/inline bases for movablelimits.
 *  baseTrimmed is the raw trimmed value; empty bases get placeholder '""' inside wrappers. */
var buildLimitBase = function (firstChild, baseTrimmed, base) {
    var baseEscaped = (0, escape_utils_1.escapeContentSeparators)((0, common_1.typstPlaceholder)(baseTrimmed));
    var movablelimits = firstChild ? getMovablelimits(firstChild) : undefined;
    var wrapper = firstChild && isStretchyBase(baseTrimmed, firstChild) ? 'stretch' : 'limits';
    if (movablelimits === true) {
        if (isCustomOp(baseTrimmed)) {
            return { typst: addLimitsParam(baseTrimmed), typst_inline: base };
        }
        if (isNativeDisplayLimitOp(baseTrimmed)) {
            return { typst: base };
        }
        return { typst: "".concat(wrapper, "(").concat(baseEscaped, ")"), typst_inline: base };
    }
    else if (movablelimits === false) {
        return { typst: "".concat(wrapper, "(").concat(baseEscaped, ")") };
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
        return { typst: "".concat(wrapper, "(").concat(baseEscaped, ")") };
    }
};
/** Check if base should use scripts() wrapper (\nolimits in display mode) */
var needsScriptsWrapper = function (baseTrimmed) {
    return isNativeDisplayLimitOp(baseTrimmed);
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
    var atr = (0, common_1.getAttrs)(node);
    if (atr.linethickness === '0' || atr.linethickness === 0) {
        res = (0, common_1.addToTypstData)(res, { typst: "binom(".concat(num, ", ").concat(den, ")") });
    }
    else {
        res = (0, common_1.addToTypstData)(res, { typst: "frac(".concat(num, ", ").concat(den, ")") });
    }
    return res;
};
exports.mfrac = mfrac;
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
exports.msup = msup;
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
exports.msub = msub;
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
exports.msubsup = msubsup;
var msqrt = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var firstChild = node.childNodes[0] || null;
    var dataFirst = firstChild ? serialize.visitNode(firstChild, '') : (0, common_1.initTypstData)();
    var content = (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(dataFirst.typst.trim()));
    res = (0, common_1.addToTypstData)(res, { typst: "sqrt(".concat(content, ")") });
    return res;
};
exports.msqrt = msqrt;
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
exports.mroot = mroot;
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
exports.mover = mover;
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
exports.munder = munder;
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
exports.munderover = munderover;
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
        // Has prescripts — use attach(base, tl:, bl:, tr:, br:)
        var esc = function (s) { return (0, common_1.typstPlaceholder)((0, escape_utils_1.escapeContentSeparators)(s)); };
        var parts = [];
        if (lastPreSup)
            parts.push("tl: ".concat(esc(lastPreSup)));
        if (lastPreSub)
            parts.push("bl: ".concat(esc(lastPreSub)));
        if (lastPostSup)
            parts.push("tr: ".concat(esc(lastPostSup)));
        if (lastPostSub)
            parts.push("br: ".concat(esc(lastPostSub)));
        res = (0, common_1.addToTypstData)(res, {
            typst: "attach(".concat(esc(baseTrimmed), ", ").concat(parts.join(', '), ")")
        });
    }
    return res;
};
exports.mmultiscripts = mmultiscripts;
//# sourceMappingURL=script-handlers.js.map
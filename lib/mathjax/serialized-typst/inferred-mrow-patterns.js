"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryThousandSepPattern = exports.tryIdotsintPattern = exports.tryBareDelimiterPattern = exports.tryBigDelimiterPattern = exports.isTaggedEqnArray = void 0;
/**
 * Pattern-matching helpers for inferred mrow nodes.
 * Extracted from index.ts so they can be reused by the AST dispatcher.
 *
 * Pattern functions return TypstMathNode (AST) instead of strings.
 */
var MmlNode_js_1 = require("mathjax-full/js/core/MmlTree/MmlNode.js");
var consts_1 = require("./consts");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
var builders_1 = require("./ast/builders");
var serialize_1 = require("./ast/serialize");
// Node kinds that carry sub/sup scripts (used in \idotsint pattern detection).
var IDOTSINT_SCRIPT_KINDS = new Set(['msubsup', 'msub', 'msup']);
/** Check that all brackets between positions [from, to) are balanced.
 *  Returns false if any opening bracket has no matching close, or vice versa.
 *  Used to validate bare delimiter pairing — rejects |...| when unmatched
 *  brackets (e.g. [, ⟩) sit between the two pipes. */
var isFenceBalanced = function (node, from, to) {
    var _a;
    var depth = 0;
    for (var k = from; k < to; k++) {
        var child = node.childNodes[k];
        // Skip brackets already marked as unpaired by markUnpairedBrackets() —
        // they'll be escaped (\[, \]) or replaced (bracket.l) in the serialized
        // output and won't affect Typst's delimiter matching inside lr().
        var mo = resolveDelimiterMo(child);
        if ((_a = mo === null || mo === void 0 ? void 0 : mo.getProperty) === null || _a === void 0 ? void 0 : _a.call(mo, consts_1.UNPAIRED_BRACKET_PROP)) {
            continue;
        }
        var ch = getDelimiterChar(child);
        if (!ch) {
            continue;
        }
        if (consts_1.FENCE_OPEN_CHARS.has(ch)) {
            depth++;
        }
        else if (consts_1.FENCE_CLOSE_CHARS.has(ch)) {
            depth--;
            if (depth < 0) {
                return false;
            } // unmatched close bracket
        }
    }
    return depth === 0;
};
/** Additional validation for ‖...‖ (DOUBLE_VERT) pairs.
 *  Rejects pairing when content contains PUNCT (set builder notation: {x ‖ P(x)})
 *  or REL when the pair spans the entire expression (a ‖ b is "parallel to"). */
var isDoubleVertContentValid = function (node, j, closeIdx, delimChar) {
    var _a;
    if (delimChar !== consts_1.DOUBLE_VERT) {
        return true;
    }
    for (var k = j + 1; k < closeIdx; k++) {
        var tc = (_a = node.childNodes[k]) === null || _a === void 0 ? void 0 : _a.texClass;
        if (tc === MmlNode_js_1.TEXCLASS.PUNCT) {
            return false;
        }
        if (j === 0 && closeIdx === node.childNodes.length - 1 && tc === MmlNode_js_1.TEXCLASS.REL) {
            return false;
        }
    }
    return true;
};
// Map of opening delimiter char -> expected close char + Typst output format.
// Note: |..| uses Lr (not Abs) in inferred mrow to produce lr(| ... |) form.
// The abs() shorthand is only used for \left|...\right| via mrow handler.
var BARE_DELIM_PAIRS = (_a = {
        '|': { close: '|', kind: "lr" /* DelimitedKind.Lr */, open: '|', closeChar: '|' }
    },
    _a[consts_1.LEFT_FLOOR] = { close: consts_1.RIGHT_FLOOR, kind: "floor" /* DelimitedKind.Floor */, open: consts_1.LEFT_FLOOR, closeChar: consts_1.RIGHT_FLOOR },
    _a[consts_1.LEFT_CEIL] = { close: consts_1.RIGHT_CEIL, kind: "ceil" /* DelimitedKind.Ceil */, open: consts_1.LEFT_CEIL, closeChar: consts_1.RIGHT_CEIL },
    _a[consts_1.DOUBLE_VERT] = { close: consts_1.DOUBLE_VERT, kind: "norm" /* DelimitedKind.Norm */, open: consts_1.DOUBLE_VERT, closeChar: consts_1.DOUBLE_VERT },
    _a[consts_1.LEFT_CHEVRON] = { close: consts_1.RIGHT_CHEVRON, kind: "lr" /* DelimitedKind.Lr */, open: consts_1.LEFT_CHEVRON, closeChar: consts_1.RIGHT_CHEVRON },
    _a[consts_1.LEFT_ANGLE_OLD] = { close: consts_1.RIGHT_ANGLE_OLD, kind: "lr" /* DelimitedKind.Lr */, open: consts_1.LEFT_ANGLE_OLD, closeChar: consts_1.RIGHT_ANGLE_OLD },
    _a);
// Extract big delimiter info from a TeXAtom node wrapping a sized mo.
var getBigDelimInfo = function (node) {
    var _a, _b, _c, _d, _f;
    try {
        if (node.kind !== consts_1.TEX_ATOM) {
            return null;
        }
        if ((_a = node.getProperty) === null || _a === void 0 ? void 0 : _a.call(node, 'data-custom-cmd')) {
            return null;
        }
        var inferred = (_b = node.childNodes) === null || _b === void 0 ? void 0 : _b[0];
        if (!inferred || !inferred.isInferred) {
            return null;
        }
        var mo = (_c = inferred.childNodes) === null || _c === void 0 ? void 0 : _c[0];
        if (!mo || mo.kind !== 'mo') {
            return null;
        }
        var atr = (0, common_1.getAttrs)(mo);
        if (!atr.minsize) {
            return null;
        }
        var tc = (_f = (_d = mo.texClass) !== null && _d !== void 0 ? _d : inferred.texClass) !== null && _f !== void 0 ? _f : node.texClass;
        if (tc !== MmlNode_js_1.TEXCLASS.OPEN && tc !== MmlNode_js_1.TEXCLASS.CLOSE) {
            return null;
        }
        var delim = (0, common_1.getChildText)(mo);
        return {
            delim: delim,
            size: String(atr.minsize),
            isOpen: tc === MmlNode_js_1.TEXCLASS.OPEN
        };
    }
    catch (_e) {
        return null;
    }
};
// Resolve the inner mo node from a bare mo, mrow, or TeXAtom wrapping one mo.
var resolveDelimiterMo = function (node) {
    var _a;
    try {
        if ((node === null || node === void 0 ? void 0 : node.kind) === 'mo') {
            return node;
        }
        if ((_a = node === null || node === void 0 ? void 0 : node.getProperty) === null || _a === void 0 ? void 0 : _a.call(node, 'data-custom-cmd')) {
            return null;
        }
        if ((node === null || node === void 0 ? void 0 : node.kind) === 'mrow' || (node === null || node === void 0 ? void 0 : node.kind) === consts_1.TEX_ATOM) {
            var children = node.childNodes;
            if ((children === null || children === void 0 ? void 0 : children.length) === 1 && children[0].isInferred) {
                children = children[0].childNodes;
            }
            if ((children === null || children === void 0 ? void 0 : children.length) === 1 && children[0].kind === 'mo') {
                return children[0];
            }
        }
        return null;
    }
    catch (_e) {
        return null;
    }
};
// Return the text content of a single-mo node.
var getDelimiterChar = function (node) {
    var mo = resolveDelimiterMo(node);
    return mo ? ((0, common_1.getChildText)(mo) || null) : null;
};
// Check if node is msub/msup/msubsup whose BASE is a closing delimiter.
var getScriptedDelimiterChar = function (node) {
    var _a;
    try {
        var k = node === null || node === void 0 ? void 0 : node.kind;
        if (k === 'msub' || k === 'msup' || k === 'msubsup') {
            return getDelimiterChar((_a = node.childNodes) === null || _a === void 0 ? void 0 : _a[0]);
        }
        return null;
    }
    catch (_e) {
        return null;
    }
};
/** Check if a child node is a tagged eqnArray mtable. */
var isTaggedEqnArray = function (child) {
    var _a;
    if (child.kind !== 'mtable')
        return false;
    var isEqnArray = child.childNodes.length > 0
        && ((_a = child.childNodes[0].attributes) === null || _a === void 0 ? void 0 : _a.get('displaystyle')) === true;
    return isEqnArray && child.childNodes.some(function (c) { return c.kind === consts_1.MLABELEDTR; });
};
exports.isTaggedEqnArray = isTaggedEqnArray;
/** Visit a range of children [from, to) and return them as TypstMathNode array. */
var visitRange = function (node, from, to, serialize) {
    var nodes = [];
    for (var k = from; k < to; k++) {
        nodes.push(serialize.visitNode(node.childNodes[k]));
    }
    return nodes;
};
/** Build script attachments from a scripted delimiter closer. */
var attachScriptsFromNode = function (baseNode, scriptMathNode, serialize) {
    var kind = scriptMathNode.kind;
    var opts = {};
    if ((kind === 'msub' || kind === 'msubsup') && scriptMathNode.childNodes[1]) {
        opts.sub = serialize.visitNode(scriptMathNode.childNodes[1]);
    }
    var supChild = kind === 'msup' ? scriptMathNode.childNodes[1]
        : kind === 'msubsup' ? scriptMathNode.childNodes[2] : null;
    if (supChild) {
        opts.sup = serialize.visitNode(supChild);
    }
    return (0, builders_1.scriptNode)(baseNode, opts);
};
/** Big delimiter pattern: TeXAtom(OPEN) ... TeXAtom(CLOSE) with sized mo */
var tryBigDelimiterPattern = function (node, j, serialize) {
    var openInfo = getBigDelimInfo(node.childNodes[j]);
    if (!openInfo || !openInfo.isOpen) {
        return null;
    }
    var closeIdx = -1;
    var closeInfo = null;
    var bigDepth = 0;
    for (var k = j + 1; k < node.childNodes.length; k++) {
        var candidate = getBigDelimInfo(node.childNodes[k]);
        if (!candidate) {
            continue;
        }
        if (candidate.isOpen) {
            bigDepth++;
        }
        else if (bigDepth > 0) {
            bigDepth--;
        }
        else {
            closeIdx = k;
            closeInfo = candidate;
            break;
        }
    }
    if (closeIdx < 0 || !closeInfo) {
        return null;
    }
    var openDelim = (0, typst_symbol_map_1.findTypstSymbol)(openInfo.delim);
    var closeDelim = (0, typst_symbol_map_1.findTypstSymbol)(closeInfo.delim);
    if (!openDelim || !closeDelim) {
        return null;
    }
    var contentNodes = visitRange(node, j + 1, closeIdx, serialize);
    var bodyNode = (0, builders_1.seq)(contentNodes);
    var contentStr = (0, serialize_1.serializeTypstMath)(bodyNode).trim();
    // lr(size: #Xem, open content close) — use rawVal for explicit delimiter spacing
    var lrNode = (0, builders_1.funcCall)('lr', [
        (0, builders_1.namedArg)('size', (0, builders_1.rawVal)('#' + openInfo.size)),
        (0, builders_1.posArg)((0, builders_1.rawVal)(openDelim + ' ' + contentStr + ' ' + closeDelim)),
    ]);
    return {
        node: lrNode,
        nextJ: closeIdx + 1
    };
};
exports.tryBigDelimiterPattern = tryBigDelimiterPattern;
/** Bare delimiter pairing: |...|, floor, ceil, norm, chevron.
 *  Groups content for correct subscript/superscript attachment and produces
 *  Typst shorthand functions (ceil, floor, norm) or lr() for matched pairs.
 *
 *  Key invariant: the content between opener and closer must have balanced
 *  brackets — ALL delimiter types ((), [], {}, ⟨⟩, ⌊⌋, ⌈⌉) are tracked.
 *  This prevents |...\rangle from being swallowed into a wrong |...| pair
 *  when ⟩ sits between the two pipes. */
var tryBareDelimiterPattern = function (node, j, serialize) {
    var _a;
    var delimChar = getDelimiterChar(node.childNodes[j]);
    var delimPair = delimChar ? BARE_DELIM_PAIRS[delimChar] : undefined;
    if (!delimPair) {
        return null;
    }
    if (delimChar === delimPair.close && ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind) === consts_1.TEX_ATOM) {
        return null;
    }
    var isSymmetric = delimChar === delimPair.close;
    if (isSymmetric) {
        var openerMo = resolveDelimiterMo(node.childNodes[j]);
        if (openerMo && openerMo.texClass === MmlNode_js_1.TEXCLASS.CLOSE) {
            return null;
        }
    }
    var closeIdx = -1;
    var closeIsScripted = false;
    var nestDepth = 0;
    for (var k = j + 1; k < node.childNodes.length; k++) {
        var ch = getDelimiterChar(node.childNodes[k]);
        // Track nesting for asymmetric pairs (chevron, floor, ceil)
        if (!isSymmetric && ch === delimChar) {
            nestDepth++;
            continue;
        }
        // Also check scripted opening delimiters (e.g. ⟨_1) for nesting
        if (!isSymmetric && !ch) {
            var scriptedOpener = getScriptedDelimiterChar(node.childNodes[k]);
            if (scriptedOpener === delimChar) {
                nestDepth++;
                continue;
            }
        }
        if (ch === delimPair.close) {
            if (nestDepth > 0) {
                nestDepth--;
                continue;
            }
            closeIdx = k;
            break;
        }
        var scriptedCh = getScriptedDelimiterChar(node.childNodes[k]);
        if (scriptedCh === delimPair.close) {
            if (nestDepth > 0) {
                nestDepth--;
                continue;
            }
            closeIdx = k;
            closeIsScripted = true;
            break;
        }
    }
    if (closeIdx <= j + 1) {
        return null;
    }
    // Validate: ALL bracket types must be balanced between opener and closer.
    // This prevents |ψ⟩ = ...[|↑↓⟩] from pairing the first | with a distant |
    // through an unmatched ⟩ or [.
    if (!isFenceBalanced(node, j + 1, closeIdx)) {
        return null;
    }
    // Additional ‖ validation
    if (!isDoubleVertContentValid(node, j, closeIdx, delimChar)) {
        return null;
    }
    var contentNodes = visitRange(node, j + 1, closeIdx, serialize);
    var bodyNode = (0, builders_1.seq)(contentNodes);
    var delimExpr = (0, builders_1.delimited)(delimPair.kind, bodyNode, delimPair.open, delimPair.closeChar);
    if (closeIsScripted) {
        delimExpr = attachScriptsFromNode(delimExpr, node.childNodes[closeIdx], serialize);
    }
    return {
        node: delimExpr,
        nextJ: closeIdx + 1
    };
};
exports.tryBareDelimiterPattern = tryBareDelimiterPattern;
/** \idotsint pattern: mo(integral) mo(dots) scripted(mo(integral)) */
var tryIdotsintPattern = function (node, j, serialize) {
    var _a;
    var child = node.childNodes[j];
    if ((child === null || child === void 0 ? void 0 : child.kind) !== 'mo' || (0, common_1.getChildText)(child) !== consts_1.INTEGRAL_SIGN) {
        return null;
    }
    var next1 = node.childNodes[j + 1];
    var next2 = node.childNodes[j + 2];
    if (!next1 || next1.kind !== 'mo' || (0, common_1.getChildText)(next1) !== consts_1.MIDLINE_ELLIPSIS || !next2) {
        return null;
    }
    var scriptBase = (_a = next2.childNodes) === null || _a === void 0 ? void 0 : _a[0];
    if (!IDOTSINT_SCRIPT_KINDS.has(next2.kind) || (scriptBase === null || scriptBase === void 0 ? void 0 : scriptBase.kind) !== 'mo' || (0, common_1.getChildText)(scriptBase) !== consts_1.INTEGRAL_SIGN) {
        return null;
    }
    var part1 = serialize.visitNode(child);
    var part2 = serialize.visitNode(next1);
    var part3Sym = (0, typst_symbol_map_1.findTypstSymbol)(consts_1.INTEGRAL_SIGN);
    // lr(integral dots.c integral)
    var lrBody = (0, builders_1.seq)([part1, part2, (0, builders_1.symbol)(part3Sym)]);
    var lrNode = (0, builders_1.funcCall)('lr', [(0, builders_1.posArg)((0, builders_1.mathVal)(lrBody))], { escapeContext: "lr-content" /* FuncEscapeContext.LrContent */ });
    // Attach scripts from next2
    var opts = {};
    var kind = next2.kind;
    if ((kind === 'msub' || kind === 'msubsup') && next2.childNodes[1]) {
        opts.sub = serialize.visitNode(next2.childNodes[1]);
    }
    var supChild = kind === 'msup' ? next2.childNodes[1]
        : kind === 'msubsup' ? next2.childNodes[2] : null;
    if (supChild) {
        opts.sup = serialize.visitNode(supChild);
    }
    var resultNode = (opts.sub || opts.sup) ? (0, builders_1.scriptNode)(lrNode, opts) : lrNode;
    return {
        node: resultNode,
        nextJ: j + 3
    };
};
exports.tryIdotsintPattern = tryIdotsintPattern;
/** Thousand separator chain: mn, mo(,), mn(3 digits) */
var tryThousandSepPattern = function (node, j, serialize) {
    if (!(0, common_1.isThousandSepComma)(node, j)) {
        return null;
    }
    var parts = [serialize.visitNode(node.childNodes[j])];
    var k = j;
    while ((0, common_1.isThousandSepComma)(node, k)) {
        parts.push((0, builders_1.symbol)('\\,'));
        parts.push(serialize.visitNode(node.childNodes[k + 2]));
        k += 2;
    }
    return {
        node: (0, builders_1.seq)(parts),
        nextJ: k + 1
    };
};
exports.tryThousandSepPattern = tryThousandSepPattern;
//# sourceMappingURL=inferred-mrow-patterns.js.map
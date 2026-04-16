"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mmultiscriptsAst = exports.munderoverAst = exports.munderAst = exports.moverAst = exports.mrootAst = exports.msqrtAst = exports.msubsupAst = exports.msubAst = exports.msupAst = exports.mfracAst = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("../consts");
var common_1 = require("../common");
var typst_symbol_map_1 = require("../typst-symbol-map");
var builders_1 = require("./builders");
var serialize_1 = require("./serialize");
var PRIME_SHORTHANDS = new Map([
    ['prime', "'"],
    ['prime.double', "''"],
    ['prime.triple', "'''"],
]);
var RE_SPECIAL_FN_CALL = /^(overbrace|underbrace|overbracket|underbracket|op)\(/;
var TYPST_DISPLAY_LIMIT_OPS = new Set([
    'lim', 'limsup', 'liminf', 'max', 'min', 'inf', 'sup',
    'det', 'gcd', 'Pr',
    'sum', 'product', 'product.co',
    'union.big', 'inter.big',
    'dot.o.big', 'plus.o.big', 'times.o.big',
    'union.plus.big', 'union.sq.big',
    'or.big', 'and.big',
]);
var STRETCH_BASE_SYMBOLS = new Set([
    'arrow.r', 'arrow.l', 'arrow.l.r',
    'arrow.r.twohead', 'arrow.l.twohead',
    'arrow.r.bar',
    'arrow.r.hook', 'arrow.l.hook',
    'arrow.r.double', 'arrow.l.double', 'arrow.l.r.double',
    'harpoon.rt', 'harpoon.lb',
    'harpoons.rtlb', 'harpoons.ltrb',
    'arrows.rl',
    '=',
]);
var MUNDER_ATTACH_SYMBOLS = new Map([
    ['arrow', 'arrow.r'],
    ['arrow.l', 'arrow.l'],
    ['arrow.l.r', 'arrow.l.r'],
    ['harpoon', 'harpoon'],
    ['harpoon.lt', 'harpoon.lt'],
]);
var CONSTRUCTED_LONG_ARROWS = new Map([
    ['harpoon.lb|harpoon.rt', 'harpoons.rtlb'],
    ['harpoon.rb|harpoon.lt', 'harpoons.ltrb'],
    ['arrow.l.long|arrow.r.long', 'arrows.lr'],
]);
var HIDE_PATTERN = /#hide(?:\(\$[^$]*\$\)|\[\$[^$]*\$\])/g;
var DASH_CHARS = /[\s\-\u2212\u2013\u2014\u2015\u23AF\u2500]/g;
var TYPST_ACCENT_SHORTHANDS = new Set([
    'hat', 'tilde', 'acute', 'grave', 'macron', 'overline', 'underline',
    'breve', 'dot', 'diaer', 'caron', 'arrow', 'circle',
    'overbrace', 'underbrace', 'overbracket', 'underbracket', 'overparen', 'underparen',
]);
var EMPTY_RESULT = { node: (0, builders_1.seq)([]) };
var stripDashes = function (s) {
    return s.replace(HIDE_PATTERN, '')
        .replace(DASH_CHARS, '');
};
var unwrapToMoText = function (node) {
    var _a;
    var cur = node;
    for (var d = 0; d < consts_1.SHALLOW_TREE_MAX_DEPTH && cur; d++) {
        if (cur.kind === 'mo') {
            return (0, common_1.getNodeText)(cur) || '';
        }
        if (((_a = cur.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            cur = cur.childNodes[0];
        }
        else {
            break;
        }
    }
    return '';
};
/** Unwrap single-child SeqNode to get the inner node. */
var unwrapSeq = function (node, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth < consts_1.UNWRAP_MAX_DEPTH && node.type === 'seq' && node.children.length === 1) {
        return unwrapSeq(node.children[0], depth + 1);
    }
    return node;
};
/** Add limits: #true to a FuncCallNode. With the AST dispatcher,
 *  custom op() bases always arrive as FuncCallNode from mi handler. */
var addLimitsToNode = function (baseNode) {
    var inner = unwrapSeq(baseNode);
    if (inner.type === 'func') {
        var limitedFunc = (0, builders_1.funcCall)(inner.name, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(inner.args), false), [(0, builders_1.namedArg)('limits', (0, builders_1.boolVal)(true))], false), {
            hash: inner.hash,
            body: inner.body ? tslib_1.__spreadArray([], tslib_1.__read(inner.body), false) : undefined,
        });
        return limitedFunc;
    }
    return baseNode;
};
/** If baseNode is a FuncCallNode matching overbrace/underbrace/etc. that has
 *  no annotation yet (1 positional arg = content only), add annotation as second
 *  argument. Returns null if no match or annotation already present.
 *  This prevents \underset{x}{\underbrace{y}_{z}} from producing underbrace(y, z, x). */
var matchBraceAnnotation = function (baseNode, annotationNode, kinds) {
    var inner = unwrapSeq(baseNode);
    if (inner.type === 'func' && kinds.indexOf(inner.name) >= 0) {
        var positionalCount = inner.args.filter(function (a) { return a.kind === "positional" /* FuncArgKind.Positional */; }).length;
        if (positionalCount >= 2) {
            return null;
        }
        return (0, builders_1.funcCall)(inner.name, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(inner.args), false), [(0, builders_1.posArg)((0, builders_1.mathVal)(annotationNode))], false));
    }
    return null;
};
var unwrapToScriptNode = function (node) {
    var _a;
    var n = node;
    for (var i = 0; i < consts_1.SHALLOW_TREE_MAX_DEPTH && n; i++) {
        if (n.kind === 'mover' || n.kind === 'munder' || n.kind === 'munderover')
            return n;
        if ((n.kind === consts_1.TEX_ATOM || n.isInferred) && ((_a = n.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            n = n.childNodes[0];
        }
        else {
            break;
        }
    }
    return n;
};
var getMovablelimits = function (node) {
    if (!node || node.kind !== 'mo') {
        return undefined;
    }
    try {
        return (0, common_1.getAttrs)(node).movablelimits;
    }
    catch (_e) {
        return undefined;
    }
};
var isCustomOp = function (baseTrimmed) {
    return consts_1.RE_OP_WRAPPER.test(baseTrimmed);
};
var isStretchyBase = function (baseTrimmed, firstChild) {
    var _a;
    if (!STRETCH_BASE_SYMBOLS.has(baseTrimmed)) {
        return false;
    }
    var moNode = firstChild;
    for (var i = 0; i < consts_1.SHALLOW_TREE_MAX_DEPTH && moNode && moNode.kind !== 'mo'; i++) {
        if (((_a = moNode.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            moNode = moNode.childNodes[0];
        }
        else {
            break;
        }
    }
    if ((moNode === null || moNode === void 0 ? void 0 : moNode.kind) !== 'mo') {
        return false;
    }
    try {
        return (0, common_1.getAttrs)(moNode).stretchy === true;
    }
    catch (_e) {
        return false;
    }
};
var isNativeDisplayLimitOp = function (baseTrimmed) {
    return TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);
};
var isSpecialFnCall = function (baseTrimmed) {
    return RE_SPECIAL_FN_CALL.test(baseTrimmed);
};
/** Unwrap inferred mrow / TEX_ATOM to find the actual content node. */
var unwrapFirstChild = function (node) {
    var _a;
    var cur = node;
    for (var d = 0; d < consts_1.SHALLOW_TREE_MAX_DEPTH && cur; d++) {
        if ((cur.isInferred || cur.kind === consts_1.TEX_ATOM) && ((_a = cur.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            cur = cur.childNodes[0];
        }
        else {
            return cur;
        }
    }
    return cur;
};
/** Build limit-placement base. Returns block node (possibly wrapped in limits/stretch)
 *  and optional different inline node. */
var buildLimitBase = function (firstChild, baseTrimmed, baseNode) {
    var movablelimits = firstChild ? getMovablelimits(firstChild) : undefined;
    var wrapper = firstChild && isStretchyBase(baseTrimmed, firstChild) ? 'stretch' : 'limits';
    var wrapBase = function () { return (0, builders_1.funcCall)(wrapper, [(0, builders_1.posArg)((0, builders_1.mathVal)(baseNode))]); };
    if (movablelimits === true) {
        if (isCustomOp(baseTrimmed)) {
            return {
                block: addLimitsToNode(baseNode),
                inline: baseNode
            };
        }
        // Native display-limit ops (sum, lim, max, etc.) already place limits
        // below/above in Typst display mode — no wrapper needed
        if (isNativeDisplayLimitOp(baseTrimmed)) {
            return {
                block: baseNode
            };
        }
        // Other ops (integral, etc.): wrap in limits() for block, bare for inline
        return {
            block: wrapBase(),
            inline: baseNode
        };
    }
    if (movablelimits === false) {
        return {
            block: wrapBase()
        };
    }
    // movablelimits undefined — custom op() needs limits in display mode:
    // Matches: \operatorname* (TEX_ATOM + texClass=OP),
    //          \varinjlim etc. (munder/mover wrapping → baseTrimmed starts with op())
    if (isCustomOp(baseTrimmed)) {
        // Unwrap inferred mrow / TeXAtom to find actual content node
        var unwrapped = unwrapFirstChild(firstChild);
        var hasOpContext = (firstChild === null || firstChild === void 0 ? void 0 : firstChild.texClass) === MmlNode_1.TEXCLASS.OP
            || (unwrapped === null || unwrapped === void 0 ? void 0 : unwrapped.kind) === 'munder' || (unwrapped === null || unwrapped === void 0 ? void 0 : unwrapped.kind) === 'mover';
        if (hasOpContext) {
            // Check for inner munder/mover → \varinjlim: different block/inline
            if ((unwrapped === null || unwrapped === void 0 ? void 0 : unwrapped.kind) === 'munder' || (unwrapped === null || unwrapped === void 0 ? void 0 : unwrapped.kind) === 'mover') {
                return {
                    block: addLimitsToNode(baseNode),
                    inline: baseNode
                };
            }
            // \operatorname*{} (TeXAtom OP) → limits in both
            return {
                block: addLimitsToNode(baseNode)
            };
        }
    }
    if (isNativeDisplayLimitOp(baseTrimmed)) {
        return {
            block: baseNode
        };
    }
    // Special fn calls (overbrace, underbrace, op) without annotation don't need limits —
    // they handle placement internally. But with annotation (2+ positional args),
    // they need limits() for \underset/\overset to place below/above.
    if (isSpecialFnCall(baseTrimmed)) {
        var inner = unwrapSeq(baseNode);
        if (inner.type === 'func') {
            var positionalCount = inner.args.filter(function (a) { return a.kind === "positional" /* FuncArgKind.Positional */; }).length;
            if (positionalCount < 2) {
                return {
                    block: baseNode
                };
            }
        }
        else {
            return {
                block: baseNode
            };
        }
    }
    return {
        block: wrapBase()
    };
};
var needsScriptsWrapper = function (baseTrimmed) {
    return isNativeDisplayLimitOp(baseTrimmed);
};
/** Check if a custom op() base in msub/msup/msubsup needs limits: #true.
 *  Only checks for \operatorname* (TeXAtom OP without inner munder/mover).
 *  The \varinjlim pattern is handled by munderoverAst/buildLimitBase instead —
 *  if we're in msubsup, it means \nolimits was used so we DON'T add limits. */
var needsLimitsMode = function (baseTrimmed, firstChild) {
    var _a, _b;
    if (!isCustomOp(baseTrimmed) || !firstChild) {
        return false;
    }
    // First pass: check if tree contains munder/mover (= \varinjlim pattern with \nolimits)
    var cur = firstChild;
    for (var d = 0; d < consts_1.SHALLOW_TREE_MAX_DEPTH && cur; d++) {
        if (cur.kind === 'munder' || cur.kind === 'mover' || cur.kind === 'munderover') {
            return false;
        }
        if ((cur.kind === consts_1.TEX_ATOM || cur.isInferred) && ((_a = cur.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            cur = cur.childNodes[0];
        }
        else
            break;
    }
    // Second pass: check for \operatorname* (TeXAtom OP without inner under/over)
    cur = firstChild;
    for (var d = 0; d < consts_1.SHALLOW_TREE_MAX_DEPTH && cur; d++) {
        if (cur.kind === consts_1.TEX_ATOM && cur.texClass === MmlNode_1.TEXCLASS.OP) {
            return 'both';
        }
        if ((cur.kind === consts_1.TEX_ATOM || cur.isInferred) && ((_b = cur.childNodes) === null || _b === void 0 ? void 0 : _b.length) === 1) {
            cur = cur.childNodes[0];
        }
        else
            break;
    }
    return false;
};
/** Check if a MathML node is a bare opening bracket mo (not \left/\right).
 *  In Typst, [^(x) would start auto-matching — need to separate bracket from script. */
var isOpeningBracketBase = function (child) {
    if (!child || child.kind !== 'mo') {
        return false;
    }
    var text = (0, common_1.getNodeText)(child);
    return !!text && !!consts_1.OPEN_BRACKETS[text];
};
/** Get child as TypstMathNode for use in FuncCallNode args */
var visitChildNode = function (serialize, child) {
    if (!child) {
        return (0, builders_1.placeholder)();
    }
    return serialize.visitNode(child);
};
var mfracAst = function (node, serialize) {
    var _a, _b;
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var numNode = visitChildNode(serialize, firstChild);
    var denNode = visitChildNode(serialize, secondChild);
    var attrs = (0, common_1.getAttrs)(node);
    if (attrs.linethickness === '0' || attrs.linethickness === 0) {
        var parent_1 = node.parent;
        var hasFenceParent = parent_1
            && parent_1.kind === 'mrow'
            && parent_1.childNodes.length === 3
            && ((_a = parent_1.childNodes[0]) === null || _a === void 0 ? void 0 : _a.texClass) === MmlNode_1.TEXCLASS.OPEN
            && ((_b = parent_1.childNodes[2]) === null || _b === void 0 ? void 0 : _b.texClass) === MmlNode_1.TEXCLASS.CLOSE;
        if (hasFenceParent) {
            var closeDelim = unwrapToMoText(parent_1.childNodes[2]);
            if (closeDelim === ')') {
                return {
                    node: (0, builders_1.funcCall)('binom', [(0, builders_1.posArg)((0, builders_1.mathVal)(numNode)), (0, builders_1.posArg)((0, builders_1.mathVal)(denNode))])
                };
            }
            var openDelim = unwrapToMoText(parent_1.childNodes[0]);
            var delimArg = openDelim
                ? (0, builders_1.namedArg)('delim', (0, builders_1.strVal)(openDelim))
                : (0, builders_1.namedArg)('delim', (0, builders_1.identVal)('#none'));
            return {
                node: (0, builders_1.funcCall)('mat', [delimArg, (0, builders_1.posArg)((0, builders_1.mathVal)(numNode)), (0, builders_1.posArg)((0, builders_1.mathVal)(denNode))], { semicolonSep: true, singleLine: true })
            };
        }
        return {
            node: (0, builders_1.funcCall)('mat', [(0, builders_1.namedArg)('delim', (0, builders_1.identVal)('#none')), (0, builders_1.posArg)((0, builders_1.mathVal)(numNode)), (0, builders_1.posArg)((0, builders_1.mathVal)(denNode))], { semicolonSep: true, singleLine: true })
        };
    }
    return {
        node: (0, builders_1.funcCall)('frac', [(0, builders_1.posArg)((0, builders_1.mathVal)(numNode)), (0, builders_1.posArg)((0, builders_1.mathVal)(denNode))])
    };
};
exports.mfracAst = mfracAst;
/** Common logic for msup, msub, msubsup — handles opening bracket base,
 *  brace annotations, scripts wrapper, prime shorthands, limits mode. */
var handleScriptAst = function (node, serialize, config) {
    var hasSub = config.hasSub, hasSup = config.hasSup;
    var subIdx = 1;
    var supIdx = hasSub && hasSup ? 2 : 1;
    // Opening bracket as script base: [^{\circ} → [ ""^(compose)
    if (isOpeningBracketBase(node.childNodes[0])) {
        var bracketNode = visitChildNode(serialize, node.childNodes[0]);
        var opts_1 = {};
        if (hasSub) {
            var sub = visitChildNode(serialize, node.childNodes[subIdx] || null);
            if (!(0, builders_1.isEmptyNode)(sub)) {
                opts_1.sub = sub;
            }
        }
        if (hasSup) {
            var sup = visitChildNode(serialize, node.childNodes[supIdx] || null);
            if (!(0, builders_1.isEmptyNode)(sup)) {
                opts_1.sup = sup;
            }
        }
        return {
            node: (0, builders_1.seq)([bracketNode, (0, builders_1.scriptNode)((0, builders_1.placeholder)(), opts_1)])
        };
    }
    var baseNode = visitChildNode(serialize, node.childNodes[0] || null);
    var subNode = hasSub ? visitChildNode(serialize, node.childNodes[subIdx] || null) : null;
    var supNode = hasSup ? visitChildNode(serialize, node.childNodes[supIdx] || null) : null;
    var baseEmpty = (0, builders_1.isEmptyNode)(baseNode);
    var subEmpty = !subNode || (0, builders_1.isEmptyNode)(subNode);
    var supEmpty = !supNode || (0, builders_1.isEmptyNode)(supNode);
    // Brace annotation: overbrace(content)^annotation / underbrace(content)_annotation
    if (hasSup && !supEmpty) {
        var braceStr = matchBraceAnnotation(baseNode, supNode, ['overbrace', 'overbracket']);
        if (braceStr) {
            return {
                node: braceStr
            };
        }
    }
    if (hasSub && !subEmpty) {
        var braceStr = matchBraceAnnotation(baseNode, subNode, ['underbrace', 'underbracket']);
        if (braceStr) {
            return {
                node: braceStr
            };
        }
    }
    if (baseEmpty && subEmpty && supEmpty) {
        return EMPTY_RESULT;
    }
    var baseTrimmed = baseEmpty ? '' : (0, serialize_1.serializeTypstMath)(baseNode).trim();
    // \nolimits: wrap known limit operators in scripts()
    if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
        var opts_2 = {};
        if (!subEmpty) {
            opts_2.sub = subNode;
        }
        if (!supEmpty) {
            opts_2.sup = supNode;
        }
        return {
            node: (0, builders_1.scriptNode)((0, builders_1.funcCall)('scripts', [(0, builders_1.posArg)((0, builders_1.mathVal)(baseNode))]), opts_2)
        };
    }
    // Prime shorthand: ′ → ', ″ → '', ‴ → ''' (sup-only)
    if (hasSup && !hasSub && !supEmpty) {
        var supSymbol = (0, builders_1.getSymbolValue)(supNode);
        if (supSymbol) {
            var primeShorthand = PRIME_SHORTHANDS.get(supSymbol);
            if (primeShorthand) {
                return {
                    node: (0, builders_1.seq)([baseNode, (0, builders_1.symbol)(primeShorthand)])
                };
            }
        }
    }
    var opts = {};
    if (!subEmpty) {
        opts.sub = subNode;
    }
    if (!supEmpty) {
        opts.sup = supNode;
    }
    // Custom op(): add limits: #true for block variant
    var firstChild = node.childNodes[0] || null;
    if (needsLimitsMode(baseTrimmed, firstChild)) {
        return {
            node: (0, builders_1.scriptNode)(addLimitsToNode(baseNode), opts)
        };
    }
    return {
        node: (0, builders_1.scriptNode)(baseNode, opts)
    };
};
var msupAst = function (node, serialize) {
    return handleScriptAst(node, serialize, {
        hasSub: false,
        hasSup: true
    });
};
exports.msupAst = msupAst;
var msubAst = function (node, serialize) {
    return handleScriptAst(node, serialize, {
        hasSub: true,
        hasSup: false
    });
};
exports.msubAst = msubAst;
var msubsupAst = function (node, serialize) {
    return handleScriptAst(node, serialize, {
        hasSub: true,
        hasSup: true
    });
};
exports.msubsupAst = msubsupAst;
var msqrtAst = function (node, serialize) {
    var contentNode = visitChildNode(serialize, node.childNodes[0] || null);
    return {
        node: (0, builders_1.funcCall)('sqrt', [(0, builders_1.posArg)((0, builders_1.mathVal)(contentNode))])
    };
};
exports.msqrtAst = msqrtAst;
var mrootAst = function (node, serialize) {
    var radicandNode = visitChildNode(serialize, node.childNodes[0] || null);
    var indexNode = visitChildNode(serialize, node.childNodes[1] || null);
    // Typst root(index, radicand) — note swapped order vs MathML mroot(radicand, index)
    return {
        node: (0, builders_1.funcCall)('root', [(0, builders_1.posArg)((0, builders_1.mathVal)(indexNode)), (0, builders_1.posArg)((0, builders_1.mathVal)(radicandNode))])
    };
};
exports.mrootAst = mrootAst;
var moverAst = function (node, serialize) {
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var baseNode = visitChildNode(serialize, firstChild);
    var overNode = visitChildNode(serialize, secondChild);
    var baseStr = (0, serialize_1.serializeTypstMath)(baseNode);
    var overStr = (0, serialize_1.serializeTypstMath)(overNode);
    // \varlimsup: mover(mi("lim"), mo("―"))
    if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'mi' && (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === 'mo') {
        var baseText = (0, common_1.getNodeText)(firstChild);
        var overChar = (0, common_1.getNodeText)(secondChild);
        if (baseText === 'lim' && overChar === consts_1.HORIZ_BAR) {
            return {
                node: (0, builders_1.funcCall)('op', [(0, builders_1.posArg)((0, builders_1.mathVal)((0, builders_1.funcCall)('overline', [(0, builders_1.posArg)((0, builders_1.mathVal)((0, builders_1.symbol)('lim')))])))])
            };
        }
    }
    // Accent → FuncCallNode (serializer handles Wrapper escaping)
    if (node.attributes.get('accent') && secondChild && secondChild.kind === 'mo') {
        var accentChar = (0, common_1.getNodeText)(secondChild);
        var accentFn = typst_symbol_map_1.typstAccentMap.get(accentChar);
        if (accentFn) {
            if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
                return {
                    node: (0, builders_1.funcCall)(accentFn, [(0, builders_1.posArg)((0, builders_1.mathVal)(baseNode))])
                };
            }
            return {
                node: (0, builders_1.funcCall)('accent', [(0, builders_1.posArg)((0, builders_1.mathVal)(baseNode)), (0, builders_1.posArg)((0, builders_1.mathVal)((0, builders_1.symbol)(accentFn)))])
            };
        }
    }
    var rawBase = baseStr.trim();
    var over = overStr.trim();
    // Constructed long arrows
    if (over) {
        var longArrow = CONSTRUCTED_LONG_ARROWS.get(stripDashes(rawBase) + '|' + stripDashes(over));
        if (longArrow)
            return {
                node: (0, builders_1.symbol)(longArrow)
            };
    }
    if (over) {
        var braceStr = matchBraceAnnotation(baseNode, overNode, ['overbrace', 'overbracket']);
        if (braceStr) {
            return {
                node: braceStr
            };
        }
        // Flatten mover(munder(...), over): attach over as superscript directly
        // (inner munder already resolved its own sub via limits/underbrace/etc.)
        var innerBase = unwrapToScriptNode(firstChild);
        if (innerBase && (innerBase.kind === 'munder' || innerBase.kind === 'munderover')) {
            return {
                node: (0, builders_1.scriptNode)(baseNode, { sup: overNode })
            };
        }
        var limitBase = buildLimitBase(firstChild, rawBase, baseNode);
        var blockResult = (0, builders_1.scriptNode)(limitBase.block, { sup: overNode });
        if (limitBase.inline) {
            return {
                node: blockResult,
                nodeInline: (0, builders_1.scriptNode)(limitBase.inline, { sup: overNode })
            };
        }
        return {
            node: blockResult
        };
    }
    return {
        node: baseStr.trim() ? baseNode : (0, builders_1.placeholder)()
    };
};
exports.moverAst = moverAst;
var munderAst = function (node, serialize) {
    var firstChild = node.childNodes[0] || null;
    var secondChild = node.childNodes[1] || null;
    var baseNode = visitChildNode(serialize, firstChild);
    var underNode = visitChildNode(serialize, secondChild);
    var baseStr = (0, serialize_1.serializeTypstMath)(baseNode);
    var underStr = (0, serialize_1.serializeTypstMath)(underNode);
    // \varinjlim / \varprojlim / \varliminf
    if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'mi' && (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === 'mo') {
        var baseText = (0, common_1.getNodeText)(firstChild);
        var underChar = (0, common_1.getNodeText)(secondChild);
        if (baseText === 'lim' && underChar === consts_1.RIGHT_ARROW) {
            return {
                node: (0, builders_1.funcCall)('op', [(0, builders_1.posArg)((0, builders_1.strVal)('inj lim'))])
            };
        }
        if (baseText === 'lim' && underChar === consts_1.LEFT_ARROW) {
            return {
                node: (0, builders_1.funcCall)('op', [(0, builders_1.posArg)((0, builders_1.strVal)('proj lim'))])
            };
        }
        if (baseText === 'lim' && underChar === consts_1.HORIZ_BAR) {
            return {
                node: (0, builders_1.funcCall)('op', [(0, builders_1.posArg)((0, builders_1.mathVal)((0, builders_1.funcCall)('underline', [(0, builders_1.posArg)((0, builders_1.mathVal)((0, builders_1.symbol)('lim')))])))])
            };
        }
    }
    // Accent under → FuncCallNode (serializer handles Wrapper escaping)
    if (node.attributes.get('accentunder') && secondChild && secondChild.kind === 'mo') {
        var accentChar = (0, common_1.getNodeText)(secondChild);
        var accentFn = typst_symbol_map_1.typstAccentMap.get(accentChar);
        if (accentFn === 'overline') {
            accentFn = 'underline';
        }
        if (accentFn === 'overbrace') {
            accentFn = 'underbrace';
        }
        if (accentFn === 'overparen') {
            accentFn = 'underparen';
        }
        if (accentFn) {
            // Arrows/harpoons have no under-variant — use limits(base)_symbol
            var underSymbol = MUNDER_ATTACH_SYMBOLS.get(accentFn);
            if (underSymbol) {
                var limitsNode = (0, builders_1.funcCall)('limits', [(0, builders_1.posArg)((0, builders_1.mathVal)(baseNode))]);
                return {
                    node: (0, builders_1.scriptNode)(limitsNode, { sub: (0, builders_1.symbol)(underSymbol), bareSub: true })
                };
            }
            if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
                return {
                    node: (0, builders_1.funcCall)(accentFn, [(0, builders_1.posArg)((0, builders_1.mathVal)(baseNode))])
                };
            }
            return {
                node: (0, builders_1.funcCall)('accent', [(0, builders_1.posArg)((0, builders_1.mathVal)(baseNode)), (0, builders_1.posArg)((0, builders_1.mathVal)((0, builders_1.symbol)(accentFn)))])
            };
        }
    }
    var rawBase = baseStr.trim();
    var under = underStr.trim();
    if (under) {
        var braceStr = matchBraceAnnotation(baseNode, underNode, ['underbrace', 'underbracket']);
        if (braceStr) {
            return {
                node: braceStr
            };
        }
        var limitBase = buildLimitBase(firstChild, rawBase, baseNode);
        var blockResult = (0, builders_1.scriptNode)(limitBase.block, { sub: underNode });
        if (limitBase.inline) {
            return {
                node: blockResult, nodeInline: (0, builders_1.scriptNode)(limitBase.inline, { sub: underNode })
            };
        }
        return {
            node: blockResult
        };
    }
    return {
        node: rawBase ? baseNode : (0, builders_1.placeholder)()
    };
};
exports.munderAst = munderAst;
var munderoverAst = function (node, serialize) {
    var firstChild = node.childNodes[0] || null;
    var baseNode = visitChildNode(serialize, firstChild);
    var underNode = visitChildNode(serialize, node.childNodes[1] || null);
    var overNode = visitChildNode(serialize, node.childNodes[2] || null);
    var rawBase = (0, builders_1.isEmptyNode)(baseNode) ? '' : (0, serialize_1.serializeTypstMath)(baseNode).trim();
    var limitBase = buildLimitBase(firstChild, rawBase, baseNode);
    var opts = {};
    if (!(0, builders_1.isEmptyNode)(underNode)) {
        opts.sub = underNode;
    }
    if (!(0, builders_1.isEmptyNode)(overNode)) {
        opts.sup = overNode;
    }
    var blockResult = (0, builders_1.scriptNode)(limitBase.block, opts);
    if (limitBase.inline) {
        return {
            node: blockResult,
            nodeInline: (0, builders_1.scriptNode)(limitBase.inline, opts)
        };
    }
    return {
        node: blockResult
    };
};
exports.munderoverAst = munderoverAst;
/** Visit a mmultiscripts child, returning its node only if non-empty and non-"none" kind */
var visitScriptChild = function (serialize, child) {
    if (!child || child.kind === 'none') {
        return null;
    }
    var node = serialize.visitNode(child);
    var str = (0, serialize_1.serializeTypstMath)(node).trim();
    return str ? node : null;
};
var mmultiscriptsAst = function (node, serialize) {
    if (!node.childNodes || node.childNodes.length === 0) {
        return EMPTY_RESULT;
    }
    var baseNode = visitChildNode(serialize, node.childNodes[0]);
    var prescriptsIdx = -1;
    for (var i = 1; i < node.childNodes.length; i++) {
        if (node.childNodes[i].kind === 'mprescripts') {
            prescriptsIdx = i;
            break;
        }
    }
    // Collect post-scripts (last non-empty of each position wins)
    var postEnd = prescriptsIdx >= 0 ? prescriptsIdx : node.childNodes.length;
    var lastPostSub = null;
    var lastPostSup = null;
    for (var i = 1; i < postEnd; i += 2) {
        var sub = visitScriptChild(serialize, node.childNodes[i]);
        var sup = visitScriptChild(serialize, node.childNodes[i + 1] || null);
        if (sub) {
            lastPostSub = sub;
        }
        if (sup) {
            lastPostSup = sup;
        }
    }
    // Collect pre-scripts
    var lastPreSub = null;
    var lastPreSup = null;
    if (prescriptsIdx >= 0) {
        for (var i = prescriptsIdx + 1; i < node.childNodes.length; i += 2) {
            var sub = visitScriptChild(serialize, node.childNodes[i]);
            var sup = visitScriptChild(serialize, node.childNodes[i + 1] || null);
            if (sub) {
                lastPreSub = sub;
            }
            if (sup) {
                lastPreSup = sup;
            }
        }
    }
    // ScriptNode — serializer handles attach() for prescripts, _/^ for simple case
    var opts = {};
    if (lastPostSub) {
        opts.sub = lastPostSub;
    }
    if (lastPostSup) {
        opts.sup = lastPostSup;
    }
    if (lastPreSub) {
        opts.preSub = lastPreSub;
    }
    if (lastPreSup) {
        opts.preSup = lastPreSup;
    }
    return {
        node: (0, builders_1.scriptNode)(baseNode, opts)
    };
};
exports.mmultiscriptsAst = mmultiscriptsAst;
//# sourceMappingURL=script-handlers.js.map
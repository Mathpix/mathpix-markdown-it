"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mstyleAst = exports.mencloseAst = exports.mphantomAst = exports.mpaddedAst = exports.mrowAst = exports.tryCombiningMiChainAst = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("../consts");
var common_1 = require("../common");
var typst_symbol_map_1 = require("../typst-symbol-map");
var bracket_utils_1 = require("../bracket-utils");
var builders_1 = require("./builders");
var serialize_1 = require("./serialize");
var code_mode_utils_1 = require("./code-mode-utils");
var ANCESTOR_MAX_DEPTH = 10;
var MATHJAX_INHERIT_SENTINEL = '_inherit_';
/** Map delimiter char pair to DelimitedKind */
var detectDelimitedKind = function (openDelim, closeDelim) {
    if (openDelim === '|' && closeDelim === '|')
        return "abs" /* DelimitedKind.Abs */;
    if (openDelim === consts_1.DOUBLE_VERT && closeDelim === consts_1.DOUBLE_VERT)
        return "norm" /* DelimitedKind.Norm */;
    if (openDelim === consts_1.LEFT_FLOOR && closeDelim === consts_1.RIGHT_FLOOR)
        return "floor" /* DelimitedKind.Floor */;
    if (openDelim === consts_1.LEFT_CEIL && closeDelim === consts_1.RIGHT_CEIL)
        return "ceil" /* DelimitedKind.Ceil */;
    return "lr" /* DelimitedKind.Lr */;
};
var hasPhantomChild = function (node) {
    var check = function (n, depth) {
        var e_1, _a;
        if (!n || depth > consts_1.SHALLOW_TREE_MAX_DEPTH) {
            return false;
        }
        if (n.kind === 'mphantom') {
            return true;
        }
        if (n.childNodes) {
            try {
                for (var _b = tslib_1.__values(n.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var c = _c.value;
                    if (check(c, depth + 1)) {
                        return true;
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
        }
        return false;
    };
    return check(node, 0);
};
var hasScriptAncestor = function (node) {
    var cur = node === null || node === void 0 ? void 0 : node.parent;
    for (var d = 0; d < ANCESTOR_MAX_DEPTH && cur; d++) {
        var k = cur.kind;
        if (k === 'msub' || k === 'msup' || k === 'msubsup' || k === 'mmultiscripts') {
            return true;
        }
        cur = cur.parent;
    }
    return false;
};
var isOperatorInternalSpacing = function (node) {
    var children = node.childNodes || [];
    if (children.length !== 1 || !children[0].isInferred) {
        return false;
    }
    var innerChildren = children[0].childNodes || [];
    if (innerChildren.length === 0 || !innerChildren.every(function (child) { return child.kind === 'mspace'; })) {
        return false;
    }
    var p = node.parent;
    for (var d = 0; d < ANCESTOR_MAX_DEPTH && p; d++) {
        if (p.kind === 'math') {
            break;
        }
        if (p.kind === consts_1.TEX_ATOM) {
            return true;
        }
        p = p.parent;
    }
    return false;
};
/** Build an ArgValue for a CSS color: hex → rgb("..."), named → ident */
var colorArgValue = function (color) {
    return color.startsWith('#')
        ? (0, builders_1.rawVal)('rgb("' + color + '")')
        : (0, builders_1.identVal)(color);
};
/** Wrap content in #text(fill: color)[...] */
var buildColorWrap = function (content, mathcolor) {
    return (0, builders_1.funcCall)('text', [(0, builders_1.namedArg)('fill', colorArgValue(mathcolor))], { hash: true, body: [content] });
};
var containsTable = function (child) {
    if (child.kind === 'mtable')
        return true;
    if (child.isInferred && child.childNodes) {
        return child.childNodes.some(function (c) { return c.kind === 'mtable'; });
    }
    return false;
};
/** Flatten deeply nested seq nodes into a single flat array of non-seq leaves. */
var flattenSeq = function (node) {
    var e_2, _a;
    if (node.type === 'seq') {
        var result = [];
        try {
            for (var _b = tslib_1.__values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                result.push.apply(result, tslib_1.__spreadArray([], tslib_1.__read(flattenSeq(child)), false));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return result;
    }
    return [node];
};
/** Strip leading ) or \) and trailing space nodes from a content node.
 *  Used for \lcm/smash patterns where the menclose body starts with ). */
var stripLeadingDelimAndTrailingSpace = function (contentNode) {
    var flat = flattenSeq(contentNode);
    // Strip leading ) or \)
    if (flat.length > 0) {
        var first = flat[0];
        var isCloseParen = (first.type === 'operator' && (first.value === ')' || first.value === '\\)'))
            || (first.type === 'symbol' && (first.value === ')' || first.value === '\\)'));
        if (isCloseParen) {
            flat.shift();
        }
    }
    // Strip trailing space nodes
    while (flat.length > 0 && flat[flat.length - 1].type === 'space') {
        flat.pop();
    }
    return (0, builders_1.seq)(flat);
};
/** Visit all children via AST dispatcher, return SeqNode (block only, no inline propagation). */
var visitAllChildren = function (node, serialize) {
    var e_3, _a;
    var _b;
    var children = [];
    try {
        for (var _c = tslib_1.__values(((_b = node.childNodes) !== null && _b !== void 0 ? _b : [])), _d = _c.next(); !_d.done; _d = _c.next()) {
            var child = _d.value;
            children.push(serialize.visitNode(child));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return (0, builders_1.seq)(children);
};
/** Detect consecutive non-Latin mi nodes and return typed AST node.
 *  Returns { node, nextIndex } or null. */
var tryCombiningMiChainAst = function (parentNode, start) {
    var _a, _b, _c, _d;
    var children = parentNode.childNodes;
    if (!children || start >= children.length) {
        return null;
    }
    var first = children[start];
    if (first.kind !== 'mi') {
        return null;
    }
    var firstText = (0, common_1.getNodeText)(first);
    if (!firstText || !(0, common_1.isNonLatinText)(firstText)) {
        return null;
    }
    var variant = String((_b = (_a = first.attributes) === null || _a === void 0 ? void 0 : _a.get('mathvariant')) !== null && _b !== void 0 ? _b : '');
    var merged = firstText;
    var k = start + 1;
    while (k < children.length) {
        var sib = children[k];
        if (sib.kind !== 'mi') {
            break;
        }
        if (String((_d = (_c = sib.attributes) === null || _c === void 0 ? void 0 : _c.get('mathvariant')) !== null && _d !== void 0 ? _d : '') !== variant) {
            break;
        }
        var sibText = (0, common_1.getNodeText)(sib);
        if (!sibText || !(0, common_1.isNonLatinText)(sibText)) {
            break;
        }
        merged += sibText;
        k++;
    }
    var textNode = (0, builders_1.text)(merged, { preserveBackslash: true });
    var fontFn = variant === 'bold' ? null : typst_symbol_map_1.typstFontMap.get(variant);
    var result;
    if (!fontFn) {
        if (variant === 'bold') {
            result = (0, builders_1.funcCall)('upright', [(0, builders_1.posArg)((0, builders_1.mathVal)((0, builders_1.funcCall)('bold', [(0, builders_1.posArg)((0, builders_1.mathVal)(textNode))])))]);
        }
        else {
            result = textNode;
        }
    }
    else {
        result = (0, builders_1.funcCall)(fontFn, [(0, builders_1.posArg)((0, builders_1.mathVal)(textNode))]);
    }
    return {
        node: result,
        nextIndex: k
    };
};
exports.tryCombiningMiChainAst = tryCombiningMiChainAst;
var mrowAst = function (node, serialize) {
    var _a, _b;
    var openProp = (0, common_1.getProp)(node, 'open');
    var closeProp = (0, common_1.getProp)(node, 'close');
    var hasOpen = openProp !== undefined;
    var hasClose = closeProp !== undefined;
    var openDelim = hasOpen ? String(openProp) : '';
    var closeDelim = hasClose ? String(closeProp) : '';
    var isLeftRight = (hasOpen || hasClose)
        && (0, common_1.getProp)(node, 'texClass') === MmlNode_1.TEXCLASS.INNER;
    var contentChildren = (0, common_1.getContentChildren)(node);
    var hasTableChild = contentChildren.length === 1 && containsTable(contentChildren[0]);
    var closeMapped = closeDelim ? (0, bracket_utils_1.mapDelimiter)(closeDelim) : '';
    var hasTableFirst = !hasTableChild && contentChildren.length > 1
        && containsTable(contentChildren[0]) && openDelim && !closeMapped;
    if (isLeftRight && !hasTableChild && !hasTableFirst) {
        // Build content as typed SeqNode, skipping delimiter mo's
        var blockChildren = [];
        var inlineChildren = [];
        var hasInlineDiff = false;
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
            var result = serialize.visitNodeFull(child);
            blockChildren.push(result.node);
            var inlineNode = (_a = result.nodeInline) !== null && _a !== void 0 ? _a : result.node;
            inlineChildren.push(inlineNode);
            if (result.nodeInline) {
                hasInlineDiff = true;
            }
        }
        var kind = detectDelimitedKind(openDelim, closeDelim);
        // If any child has a block-level code-mode function (#math.equation, #grid),
        // we cannot wrap it in lr() — those constructs break math flow inside delimiters.
        // Use inline variants for BOTH variants of the Delimited node.
        var hasBlockCode = blockChildren.some(code_mode_utils_1.containsBlockCodeFunc);
        if (hasBlockCode) {
            return {
                node: (0, builders_1.delimited)(kind, (0, builders_1.seq)(inlineChildren), openDelim, closeDelim)
            };
        }
        var blockNode = (0, builders_1.delimited)(kind, (0, builders_1.seq)(blockChildren), openDelim, closeDelim);
        if (hasInlineDiff) {
            return {
                node: blockNode,
                nodeInline: (0, builders_1.delimited)(kind, (0, builders_1.seq)(inlineChildren), openDelim, closeDelim)
            };
        }
        return {
            node: blockNode
        };
    }
    if (isLeftRight && (hasTableChild || hasTableFirst)) {
        var blockChildren = [];
        var inlineChildren = [];
        var hasInlineDiff = false;
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
            var result = serialize.visitNodeFull(child);
            blockChildren.push(result.node);
            var inlineNode = (_b = result.nodeInline) !== null && _b !== void 0 ? _b : result.node;
            inlineChildren.push(inlineNode);
            if (result.nodeInline) {
                hasInlineDiff = true;
            }
        }
        if (hasInlineDiff) {
            return {
                node: (0, builders_1.seq)(blockChildren),
                nodeInline: (0, builders_1.seq)(inlineChildren)
            };
        }
        return {
            node: (0, builders_1.seq)(blockChildren)
        };
    }
    // Binom pattern: mrow(ORD) > [mrow(OPEN), mfrac(linethickness=0), mrow(CLOSE)]
    if (node.childNodes.length === 3) {
        var first = node.childNodes[0];
        var middle = node.childNodes[1];
        var last = node.childNodes[2];
        if (middle.kind === 'mfrac') {
            var midAtr = (0, common_1.getAttrs)(middle);
            if ((midAtr.linethickness === '0' || midAtr.linethickness === 0)
                && first.texClass === MmlNode_1.TEXCLASS.OPEN
                && last.texClass === MmlNode_1.TEXCLASS.CLOSE) {
                return {
                    node: serialize.visitNode(middle)
                };
            }
        }
    }
    // Regular mrow: build SeqNode from children
    var children = [];
    for (var i = 0; i < node.childNodes.length; i++) {
        // Thousand separator chain: mn "," mn "," mn → num\,num\,num
        if ((0, common_1.isThousandSepComma)(node, i)) {
            var chainParts = [serialize.visitNode(node.childNodes[i])];
            var k = i;
            while ((0, common_1.isThousandSepComma)(node, k)) {
                chainParts.push((0, builders_1.symbol)('\\,'));
                chainParts.push(serialize.visitNode(node.childNodes[k + 2]));
                k += 2;
            }
            children.push((0, builders_1.seq)(chainParts));
            i = k;
            continue;
        }
        // Combining mark chain: consecutive non-Latin mi nodes → font("merged text")
        var combChain = (0, exports.tryCombiningMiChainAst)(node, i);
        if (combChain) {
            children.push(combChain.node);
            i = combChain.nextIndex - 1;
            continue;
        }
        var child = node.childNodes[i];
        if ((0, common_1.isNegationOverlay)(child) && i + 1 < node.childNodes.length) {
            var nextNode = serialize.visitNode(node.childNodes[i + 1]);
            children.push((0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(nextNode))]));
            i++;
            continue;
        }
        children.push(serialize.visitNode(child));
    }
    return {
        node: (0, builders_1.seq)(children)
    };
};
exports.mrowAst = mrowAst;
var mpaddedAst = function (node, serialize) {
    var attrs = (0, common_1.getAttrs)(node);
    var isZeroWidth = attrs.width === 0 || attrs.width === '0';
    var isZeroHeight = attrs.height === 0 || attrs.height === '0';
    if ((isZeroWidth || isZeroHeight) && hasPhantomChild(node)
        && (hasScriptAncestor(node) || hasAdjacentTripledashStyle(node))) {
        return {
            node: (0, builders_1.seq)([])
        };
    }
    var contentNode = visitAllChildren(node, serialize);
    var rawBg = attrs.mathbackground || '';
    var mathbg = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
    if (mathbg && (0, serialize_1.serializeTypstMath)(contentNode).trim()) {
        return {
            node: (0, builders_1.funcCall)('highlight', [(0, builders_1.namedArg)('fill', colorArgValue(mathbg))], { hash: true, body: [(0, builders_1.inlineMath)(contentNode)] }),
            nodeInline: contentNode,
        };
    }
    return {
        node: contentNode
    };
};
exports.mpaddedAst = mpaddedAst;
var mphantomAst = function (node, serialize) {
    var contentNode = visitAllChildren(node, serialize);
    if ((0, serialize_1.serializeTypstMath)(contentNode).trim()) {
        return {
            node: (0, builders_1.funcCall)('hide', [(0, builders_1.posArg)((0, builders_1.inlineMathVal)(contentNode))], { hash: true })
        };
    }
    return {
        node: (0, builders_1.seq)([])
    };
};
exports.mphantomAst = mphantomAst;
var parseNotation = function (notation) {
    return new Set(notation.split(/\s+/).filter(Boolean));
};
var hasNotation = function (words, keyword) {
    return words.has(keyword);
};
var BORDER_SIDES = ['top', 'bottom', 'left', 'right'];
var hasBorderNotation = function (words) {
    var e_4, _a;
    var count = 0;
    try {
        for (var BORDER_SIDES_1 = tslib_1.__values(BORDER_SIDES), BORDER_SIDES_1_1 = BORDER_SIDES_1.next(); !BORDER_SIDES_1_1.done; BORDER_SIDES_1_1 = BORDER_SIDES_1.next()) {
            var side = BORDER_SIDES_1_1.value;
            if (words.has(side)) {
                count++;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (BORDER_SIDES_1_1 && !BORDER_SIDES_1_1.done && (_a = BORDER_SIDES_1.return)) _a.call(BORDER_SIDES_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return count >= 2;
};
var buildStrokeSides = function (words) {
    return BORDER_SIDES.map(function (side) {
        return side + ': ' + (words.has(side) ? consts_1.BOX_STROKE : '0pt');
    }).join(', ');
};
var mencloseAst = function (node, serialize) {
    var _a;
    var attrs = (0, common_1.getAttrs)(node);
    var notation = ((_a = attrs.notation) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    var words = parseNotation(notation);
    var contentNode = visitAllChildren(node, serialize);
    var contentStr = (0, serialize_1.serializeTypstMath)(contentNode).trim();
    if (hasNotation(words, 'box')) {
        // #box() is inline-safe — keep frame in both variants.
        // Always use $ display $ math inside: it renders simple and multi-line
        // content correctly. $inline$ inside box breaks multi-line alignment (&, \\).
        var boxNode = (0, builders_1.funcCall)('box', [
            (0, builders_1.namedArg)('stroke', (0, builders_1.lengthVal)(consts_1.BOX_STROKE)),
            (0, builders_1.namedArg)('inset', (0, builders_1.lengthVal)(consts_1.BOX_INSET)),
            (0, builders_1.posArg)((0, builders_1.inlineMathVal)(contentNode, true)),
        ], { hash: true });
        return { node: boxNode };
    }
    // cancel variants → FuncCallNode (serializer applies Wrapper escaping)
    if (hasNotation(words, 'updiagonalstrike') || hasNotation(words, 'downdiagonalstrike')) {
        if (hasNotation(words, 'updiagonalstrike') && hasNotation(words, 'downdiagonalstrike')) {
            return {
                node: (0, builders_1.funcCall)('cancel', [(0, builders_1.namedArg)('cross', (0, builders_1.boolVal)(true)), (0, builders_1.posArg)((0, builders_1.mathVal)(contentNode))])
            };
        }
        if (hasNotation(words, 'downdiagonalstrike')) {
            return {
                node: (0, builders_1.funcCall)('cancel', [(0, builders_1.namedArg)('inverted', (0, builders_1.boolVal)(true)), (0, builders_1.posArg)((0, builders_1.mathVal)(contentNode))])
            };
        }
        return {
            node: (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(contentNode))])
        };
    }
    if (hasNotation(words, 'horizontalstrike')) {
        return {
            node: (0, builders_1.funcCall)('cancel', [(0, builders_1.posArg)((0, builders_1.mathVal)(contentNode))])
        };
    }
    if (hasNotation(words, 'longdiv')) {
        // overline(lr(\) content)) — \) is a sized delimiter inside lr
        var lrNode = (0, builders_1.delimited)("lr" /* DelimitedKind.Lr */, contentNode, ')', '');
        return {
            node: (0, builders_1.funcCall)('overline', [(0, builders_1.posArg)((0, builders_1.mathVal)(lrNode))])
        };
    }
    if (hasNotation(words, 'circle')) {
        // MathJax renders \enclose{circle} as an ellipse (stretched to content
        // width) — use #ellipse() for visual parity. #circle() would force 1:1
        // aspect ratio, producing oversized frames for long single-line content.
        // Neither #ellipse() nor #circle() auto-centers content — wrap in align().
        var centered = (0, builders_1.funcCall)('align', [
            (0, builders_1.posArg)((0, builders_1.rawVal)('center + horizon')),
            (0, builders_1.posArg)((0, builders_1.inlineMathVal)(contentNode, true)),
        ]);
        var ellipseNode = (0, builders_1.funcCall)('ellipse', [
            (0, builders_1.namedArg)('inset', (0, builders_1.lengthVal)(consts_1.BOX_INSET)),
            (0, builders_1.posArg)((0, builders_1.callVal)(centered)),
        ], { hash: true });
        return { node: ellipseNode };
    }
    if (hasNotation(words, 'radical')) {
        return {
            node: (0, builders_1.funcCall)('sqrt', [(0, builders_1.posArg)((0, builders_1.mathVal)(contentNode))])
        };
    }
    if (hasBorderNotation(words)) {
        // #box() with partial borders is inline-safe — keep frame in both variants.
        var sides = buildStrokeSides(words);
        var borderBoxNode = (0, builders_1.funcCall)('box', [
            (0, builders_1.namedArg)('stroke', (0, builders_1.rawVal)('(' + sides + ')')),
            (0, builders_1.namedArg)('inset', (0, builders_1.lengthVal)(consts_1.BOX_INSET)),
            (0, builders_1.posArg)((0, builders_1.inlineMathVal)(contentNode, true)),
        ], {
            hash: true
        });
        return {
            node: borderBoxNode
        };
    }
    if (hasNotation(words, 'top')) {
        return {
            node: (0, builders_1.funcCall)('overline', [(0, builders_1.posArg)((0, builders_1.mathVal)(contentNode))])
        };
    }
    if (hasNotation(words, 'bottom')) {
        // \smash{)} prefix for \lcm macro: strip leading ), trailing spacing, wrap in underline(lr(\) ...))
        if (contentStr.startsWith(')') || contentStr.startsWith('\\)')) {
            var innerBody = stripLeadingDelimAndTrailingSpace(contentNode);
            var lrNode = (0, builders_1.delimited)("lr" /* DelimitedKind.Lr */, innerBody, ')', '');
            return {
                node: (0, builders_1.funcCall)('underline', [(0, builders_1.posArg)((0, builders_1.mathVal)(lrNode))])
            };
        }
        return {
            node: (0, builders_1.funcCall)('underline', [(0, builders_1.posArg)((0, builders_1.mathVal)(contentNode))])
        };
    }
    return {
        node: contentNode
    };
};
exports.mencloseAst = mencloseAst;
var isTripledashStyle = function (node) {
    var e_5, _a;
    var _b, _c, _d, _e;
    var attrs = (0, common_1.getAttrs)(node);
    var ms = attrs.mathsize;
    if (!ms || (typeof ms === 'string' ? parseFloat(ms) >= 1 : ms >= 1)) {
        return false;
    }
    var children = (_e = (_d = (_c = (_b = node.childNodes) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.childNodes) !== null && _d !== void 0 ? _d : node.childNodes) !== null && _e !== void 0 ? _e : [];
    var dashCount = 0;
    try {
        for (var children_1 = tslib_1.__values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
            var child = children_1_1.value;
            if (child.kind === 'mspace') {
                continue;
            }
            if (child.kind === 'mtext') {
                dashCount++;
                continue;
            }
            return false;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return dashCount > 0;
};
var containsTripledashStyle = function (node, depth) {
    var e_6, _a;
    if (depth === void 0) { depth = 0; }
    if (depth > consts_1.SHALLOW_TREE_MAX_DEPTH) {
        return false;
    }
    if (node.kind === 'mstyle' && isTripledashStyle(node)) {
        return true;
    }
    if (node.childNodes) {
        try {
            for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (containsTripledashStyle(child, depth + 1)) {
                    return true;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    }
    return false;
};
var hasAdjacentTripledashStyle = function (node) {
    var e_7, _a;
    var cur = node;
    for (var depth = 0; depth < 3 && cur; depth++) {
        var parent_1 = cur.parent;
        if (!(parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.childNodes)) {
            cur = parent_1;
            continue;
        }
        try {
            for (var _b = (e_7 = void 0, tslib_1.__values(parent_1.childNodes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sibling = _c.value;
                if (sibling === cur) {
                    continue;
                }
                if (containsTripledashStyle(sibling)) {
                    return true;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        cur = parent_1;
    }
    return false;
};
/** Regex for replacing quoted dashes in raw strings (matches `"-"` pattern) */
var QUOTED_DASH_RE = /"-"/g;
/** Walk AST and replace TextNode("-") → SymbolNode("hyph") for mhchem tripledash. */
var replaceDashesWithHyph = function (node) {
    if (node.type === 'text' && node.value === '-') {
        return (0, builders_1.symbol)('hyph');
    }
    if (node.type === 'raw' && node.value.includes('"-"')) {
        var replaced = node.value.replace(QUOTED_DASH_RE, 'hyph');
        if (replaced !== node.value) {
            return {
                type: node.type,
                value: replaced
            };
        }
    }
    if (node.type === 'seq') {
        var changed_1 = false;
        var newChildren = node.children.map(function (child) {
            var replaced = replaceDashesWithHyph(child);
            if (replaced !== child) {
                changed_1 = true;
            }
            return replaced;
        });
        return changed_1 ? (0, builders_1.seq)(newChildren) : node;
    }
    return node;
};
var mstyleAst = function (node, serialize) {
    if (isOperatorInternalSpacing(node)) {
        return {
            node: (0, builders_1.seq)([])
        };
    }
    var contentNode = visitAllChildren(node, serialize);
    if (isTripledashStyle(node)) {
        var transformed = replaceDashesWithHyph(contentNode);
        if (transformed !== contentNode) {
            return {
                node: transformed
            };
        }
    }
    var attrs = (0, common_1.getAttrs)(node);
    var rawColor = attrs.mathcolor || '';
    var mathcolor = rawColor && rawColor !== MATHJAX_INHERIT_SENTINEL ? rawColor : '';
    var rawBg = attrs.mathbackground || '';
    var mathbg = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
    var content = (0, serialize_1.serializeTypstMath)(contentNode).trim();
    if (mathbg && content) {
        var styledNode = (0, builders_1.funcCall)('highlight', [(0, builders_1.namedArg)('fill', colorArgValue(mathbg))], {
            hash: true,
            body: [(0, builders_1.inlineMath)(contentNode)],
        });
        if (mathcolor) {
            styledNode = buildColorWrap(styledNode, mathcolor);
        }
        return {
            node: styledNode,
            nodeInline: contentNode
        };
    }
    if (mathcolor && content) {
        return {
            node: buildColorWrap(contentNode, mathcolor)
        };
    }
    return {
        node: contentNode
    };
};
exports.mstyleAst = mstyleAst;
//# sourceMappingURL=structural-handlers.js.map
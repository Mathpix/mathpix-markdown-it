"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mstyle = exports.menclose = exports.mphantom = exports.mpadded = exports.mrow = void 0;
var tslib_1 = require("tslib");
var MmlNode_1 = require("mathjax-full/js/core/MmlTree/MmlNode");
var consts_1 = require("./consts");
var common_1 = require("./common");
var escape_utils_1 = require("./escape-utils");
var bracket_utils_1 = require("./bracket-utils");
var ANCESTOR_MAX_DEPTH = 10;
var MATHJAX_INHERIT_SENTINEL = '_inherit_';
/** Check if a node subtree contains an mphantom (shallow — up to 5 levels). */
var hasPhantomChild = function (node) {
    var check = function (n, depth) {
        var e_1, _a;
        if (!n || depth > consts_1.SHALLOW_TREE_MAX_DEPTH)
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
    for (var d = 0; d < ANCESTOR_MAX_DEPTH && cur; d++) {
        var k = cur.kind;
        if (k === 'msub' || k === 'msup' || k === 'msubsup' || k === 'mmultiscripts')
            return true;
        cur = cur.parent;
    }
    return false;
};
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
var containsTable = function (child) {
    if (child.kind === 'mtable')
        return true;
    if (child.isInferred && child.childNodes) {
        return child.childNodes.some(function (c) { return c.kind === 'mtable'; });
    }
    return false;
};
var mrow = function (node, serialize) {
    var e_2, _a;
    var _b, _c, _d;
    var res = (0, common_1.initTypstData)();
    var openProp = (0, common_1.getProp)(node, 'open');
    var closeProp = (0, common_1.getProp)(node, 'close');
    var hasOpen = openProp !== undefined;
    var hasClose = closeProp !== undefined;
    var openDelim = hasOpen ? String(openProp) : '';
    var closeDelim = hasClose ? String(closeProp) : '';
    // Check if this mrow has \left...\right delimiters
    var isLeftRight = (hasOpen || hasClose)
        && (0, common_1.getProp)(node, 'texClass') === MmlNode_1.TEXCLASS.INNER;
    // If this mrow wraps ONLY a matrix (no other content besides delimiter mo's),
    // let mtable handle the delimiters.  When the mrow contains a matrix alongside
    // other nodes (e.g. \left. array \longrightarrow array \right]), we must use
    // the regular lr() path so all content stays inside one lr() call.
    var contentChildren = (0, common_1.getContentChildren)(node);
    var hasTableChild = contentChildren.length === 1 && containsTable(contentChildren[0]);
    // \left\{ table ... \right. with extra content after the table:
    // the table inherits { as its open delimiter (→ cases()), extra content follows.
    var close = closeDelim ? (0, bracket_utils_1.mapDelimiter)(closeDelim) : '';
    var hasTableFirst = !hasTableChild && contentChildren.length > 1
        && containsTable(contentChildren[0]) && openDelim && !close;
    if (isLeftRight && !hasTableChild && !hasTableFirst) {
        // Serialize inner children, skipping the delimiter mo nodes
        // (delimiters are reconstructed from the open/close properties)
        var content = '';
        var contentInline = '';
        var hasInlineDiff = false;
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
            var inlineTypst = (_b = data.typst_inline) !== null && _b !== void 0 ? _b : data.typst;
            if (inlineTypst !== data.typst)
                hasInlineDiff = true;
            // prevNode may be the skipped opening delimiter mo —
            // safe because mo is not in SCRIPT_NODE_KINDS.
            var prevNode = i > 0 ? node.childNodes[i - 1] : null;
            if ((0, common_1.needsSpaceBetweenNodes)(content, data.typst, prevNode)) {
                content += ' ';
            }
            if ((0, common_1.needsSpaceBetweenNodes)(contentInline, inlineTypst, prevNode)) {
                contentInline += ' ';
            }
            content += data.typst;
            contentInline += inlineTypst;
        }
        var open_1 = openDelim ? (0, bracket_utils_1.mapDelimiter)(openDelim) : '';
        var close_1 = closeDelim ? (0, bracket_utils_1.mapDelimiter)(closeDelim) : '';
        var hasVisibleOpen_1 = !!open_1;
        var hasVisibleClose_1 = !!close_1;
        // Build lr() expression from content string
        // Collect which ASCII bracket chars match the lr() delimiters —
        // only these need escaping inside lr() to prevent auto-scaling.
        var lrBracketChars_1 = new Set();
        try {
            for (var _e = tslib_1.__values([openDelim, closeDelim]), _f = _e.next(); !_f.done; _f = _e.next()) {
                var d = _f.value;
                if (d && (d in consts_1.OPEN_BRACKETS || d in consts_1.CLOSE_BRACKETS)) {
                    lrBracketChars_1.add(d);
                    var peer = (_c = consts_1.OPEN_BRACKETS[d]) !== null && _c !== void 0 ? _c : consts_1.CLOSE_BRACKETS[d];
                    if (peer)
                        lrBracketChars_1.add(peer);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var escBr_1 = function (s) {
            return lrBracketChars_1.size > 0 ? (0, escape_utils_1.escapeLrBrackets)(s, lrBracketChars_1) : s;
        };
        var buildLrExpr = function (cnt) {
            if (hasVisibleOpen_1 && hasVisibleClose_1) {
                var trimmed = cnt.trim();
                var hasSep = (0, escape_utils_1.hasTopLevelSeparators)(trimmed);
                if (openDelim === '|' && closeDelim === '|') {
                    var escaped = (0, escape_utils_1.escapeLrSemicolons)(escBr_1(trimmed));
                    return hasSep ? "lr(| ".concat(escaped, " |)") : "abs(".concat((0, escape_utils_1.escapeContentSeparators)(trimmed), ")");
                }
                else if (openDelim === consts_1.DOUBLE_VERT && closeDelim === consts_1.DOUBLE_VERT) {
                    var escaped = (0, escape_utils_1.escapeLrSemicolons)(escBr_1(trimmed));
                    return hasSep ? "lr(\u2016 ".concat(escaped, " \u2016)") : "norm(".concat((0, escape_utils_1.escapeContentSeparators)(trimmed), ")");
                }
                else if (openDelim === consts_1.LEFT_FLOOR && closeDelim === consts_1.RIGHT_FLOOR) {
                    var escaped = (0, escape_utils_1.escapeLrSemicolons)(escBr_1(trimmed));
                    return hasSep ? "lr(\u230A ".concat(escaped, " \u230B)") : "floor(".concat((0, escape_utils_1.escapeContentSeparators)(trimmed), ")");
                }
                else if (openDelim === consts_1.LEFT_CEIL && closeDelim === consts_1.RIGHT_CEIL) {
                    var escaped = (0, escape_utils_1.escapeLrSemicolons)(escBr_1(trimmed));
                    return hasSep ? "lr(\u2308 ".concat(escaped, " \u2309)") : "ceil(".concat((0, escape_utils_1.escapeContentSeparators)(trimmed), ")");
                }
                else {
                    var escapedOpen = (openDelim in consts_1.OPEN_BRACKETS && consts_1.OPEN_BRACKETS[openDelim] !== closeDelim)
                        ? '\\' + openDelim : open_1;
                    var escapedClose = (closeDelim in consts_1.CLOSE_BRACKETS && consts_1.CLOSE_BRACKETS[closeDelim] !== openDelim)
                        ? '\\' + closeDelim : close_1;
                    return "lr(".concat(escapedOpen, " ").concat((0, escape_utils_1.escapeLrSemicolons)(escBr_1(trimmed)), " ").concat(escapedClose, ")");
                }
            }
            else {
                var trimmed = cnt.trim();
                var openEsc = openDelim ? (0, bracket_utils_1.escapeLrDelimiter)(openDelim) : '';
                var closeEsc = closeDelim ? (0, bracket_utils_1.escapeLrDelimiter)(closeDelim) : '';
                if (openEsc) {
                    return "lr(".concat(openEsc, " ").concat((0, escape_utils_1.escapeLrSemicolons)(escBr_1(trimmed)), ")");
                }
                else if (closeEsc) {
                    return "lr(".concat((0, escape_utils_1.escapeLrSemicolons)(escBr_1(trimmed)), " ").concat(closeEsc, ")");
                }
                else {
                    return trimmed;
                }
            }
        };
        var lrTypst = buildLrExpr(content);
        if (hasInlineDiff) {
            res = (0, common_1.addToTypstData)(res, { typst: lrTypst, typst_inline: buildLrExpr(contentInline) });
        }
        else {
            res = (0, common_1.addToTypstData)(res, { typst: lrTypst });
        }
    }
    else if (isLeftRight && (hasTableChild || hasTableFirst)) {
        // Matrix/cases inside \left...\right: skip delimiter mo children
        // (the mtable handler uses the parent mrow's open/close properties for delimiters).
        // When hasTableFirst, the close delimiter is invisible (\right.) and extra
        // content follows the table — serialize it normally after the table.
        var contentInline = '';
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
            var data = serialize.visitNode(child, '');
            var inlineTypst = (_d = data.typst_inline) !== null && _d !== void 0 ? _d : data.typst;
            if (inlineTypst !== data.typst)
                hasInlineDiff = true;
            var prevNode = i > 0 ? node.childNodes[i - 1] : null;
            if ((0, common_1.needsSpaceBetweenNodes)(res.typst, data.typst, prevNode)) {
                (0, common_1.addSpaceToTypstData)(res);
            }
            if ((0, common_1.needsSpaceBetweenNodes)(contentInline, inlineTypst, prevNode)) {
                contentInline += ' ';
            }
            res = (0, common_1.addToTypstData)(res, data);
            contentInline += inlineTypst;
        }
        if (hasInlineDiff) {
            res.typst_inline = contentInline;
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
                var midAtr = (0, common_1.getAttrs)(middle);
                if ((midAtr.linethickness === '0' || midAtr.linethickness === 0)
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
            var chain = (0, common_1.serializeThousandSepChain)(node, i, serialize);
            if (chain) {
                if ((0, common_1.needsTokenSeparator)(res.typst, chain.typst)) {
                    (0, common_1.addSpaceToTypstData)(res);
                }
                res = (0, common_1.addToTypstData)(res, { typst: chain.typst });
                i = chain.nextIndex - 1; // -1 because the for-loop will i++
                continue;
            }
            // Combining-mark chain: consecutive mi nodes with combining chars (Devanagari, etc.)
            var combChain = (0, common_1.serializeCombiningMiChain)(node, i);
            if (combChain) {
                if ((0, common_1.needsTokenSeparator)(res.typst, combChain.typst)) {
                    (0, common_1.addSpaceToTypstData)(res);
                }
                res = (0, common_1.addToTypstData)(res, { typst: combChain.typst });
                i = combChain.nextIndex - 1;
                continue;
            }
            var child = node.childNodes[i];
            // \not negation overlay: wrap next sibling in cancel()
            if ((0, common_1.isNegationOverlay)(child) && i + 1 < node.childNodes.length) {
                var nextData = serialize.visitNode(node.childNodes[i + 1], '');
                var cancelTypst = "cancel(".concat(nextData.typst.trim(), ")");
                if ((0, common_1.needsSpaceBetweenNodes)(res.typst, cancelTypst, i > 0 ? node.childNodes[i - 1] : null)) {
                    (0, common_1.addSpaceToTypstData)(res);
                }
                res = (0, common_1.addToTypstData)(res, { typst: cancelTypst });
                i++; // skip the consumed sibling
                continue;
            }
            var data = serialize.visitNode(child, '');
            if ((0, common_1.needsSpaceBetweenNodes)(res.typst, data.typst, i > 0 ? node.childNodes[i - 1] : null)) {
                (0, common_1.addSpaceToTypstData)(res);
            }
            res = (0, common_1.addToTypstData)(res, data);
        }
    }
    return res;
};
exports.mrow = mrow;
var mpadded = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var atr = (0, common_1.getAttrs)(node);
    // mhchem alignment phantom: mpadded width=0 or height=0 containing mphantom
    // inside msub/msup/msubsup — zero-size alignment box, emit empty string.
    // Only skip inside script ancestors; standalone \hphantom/\vphantom must still produce #hide().
    if ((atr.width === 0 || atr.height === 0) && hasPhantomChild(node) && hasScriptAncestor(node)) {
        return res;
    }
    var data = (0, common_1.handleAll)(node, serialize);
    var content = data.typst.trim();
    // Handle mathbackground attribute (\colorbox{color}{...})
    var rawBg = atr.mathbackground || '';
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
exports.mpadded = mpadded;
var mphantom = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    var data = (0, common_1.handleAll)(node, serialize);
    var content = data.typst.trim();
    if (content) {
        res = (0, common_1.addToTypstData)(res, { typst: "#hide($".concat(content, "$)") });
    }
    return res;
};
exports.mphantom = mphantom;
var menclose = function (node, serialize) {
    var _a;
    var res = (0, common_1.initTypstData)();
    var atr = (0, common_1.getAttrs)(node);
    var notation = ((_a = atr.notation) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    var data = (0, common_1.handleAll)(node, serialize);
    var content = (0, common_1.typstPlaceholder)(data.typst.trim());
    if (notation.includes('box')) {
        // \boxed → #box with stroke
        res = (0, common_1.addToTypstData)(res, { typst: "#align(center, box(stroke: 0.5pt, inset: 3pt, $".concat(content, "$))"), typst_inline: content });
    }
    else if (notation.includes('updiagonalstrike') || notation.includes('downdiagonalstrike')) {
        // \cancel uses updiagonalstrike (lower-left to upper-right) → Typst cancel() default
        // \bcancel uses downdiagonalstrike (upper-left to lower-right) → Typst cancel(inverted: true)
        if (notation.includes('downdiagonalstrike') && !notation.includes('updiagonalstrike')) {
            res = (0, common_1.addToTypstData)(res, { typst: "cancel(inverted: #true, ".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(content)), ")") });
        }
        else {
            res = (0, common_1.addToTypstData)(res, { typst: "cancel(".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(content)), ")") });
        }
    }
    else if (notation.includes('horizontalstrike')) {
        res = (0, common_1.addToTypstData)(res, { typst: "cancel(".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(content)), ")") });
    }
    else if (notation.includes('longdiv')) {
        // \longdiv / \enclose{longdiv} → overline(lr(\) content))
        // lr(\) ...) makes the ) delimiter stretch to match content height
        res = (0, common_1.addToTypstData)(res, { typst: "overline(lr(\\) ".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(content)), "))") });
    }
    else if (notation.includes('circle')) {
        // \enclose{circle} → #circle with inset
        res = (0, common_1.addToTypstData)(res, { typst: "#align(center, circle(inset: 3pt, $".concat(content, "$))"), typst_inline: content });
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
        // Detect \smash{)} prefix (used in \lcm macro): strip leading ) or \), trailing spacing
        // lr(\) ...) makes the ) delimiter stretch to match content height
        if (content.startsWith(')') || content.startsWith('\\)')) {
            var skip = content.startsWith('\\)') ? 2 : 1;
            var inner = content.slice(skip).trim().replace(consts_1.RE_TRAILING_SPACING, '');
            res = (0, common_1.addToTypstData)(res, { typst: "underline(lr(\\) ".concat((0, escape_utils_1.escapeContentSeparators)(inner), "))") });
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
exports.menclose = menclose;
var mstyle = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    if (isOperatorInternalSpacing(node)) {
        return res;
    }
    var atr = (0, common_1.getAttrs)(node);
    var rawColor = atr.mathcolor || '';
    var mathcolor = rawColor && rawColor !== MATHJAX_INHERIT_SENTINEL ? rawColor : '';
    var rawBg = atr.mathbackground || '';
    var mathbg = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
    var data = (0, common_1.handleAll)(node, serialize);
    var content = data.typst.trim();
    // Handle mathbackground (same as mpadded colorbox)
    if (mathbg && content) {
        var fillValue = mathbg.startsWith('#') ? "rgb(\"".concat(mathbg, "\")") : mathbg;
        var typst = "#highlight(fill: ".concat(fillValue, ")[$").concat(content, "$]");
        if (mathcolor) {
            typst = wrapWithColor(typst, mathcolor);
        }
        res = (0, common_1.addToTypstData)(res, { typst: typst, typst_inline: content });
        return res;
    }
    if (mathcolor && content) {
        res = (0, common_1.addToTypstData)(res, { typst: wrapWithColor(content, mathcolor) });
        return res;
    }
    return data;
};
exports.mstyle = mstyle;
//# sourceMappingURL=structural-handlers.js.map
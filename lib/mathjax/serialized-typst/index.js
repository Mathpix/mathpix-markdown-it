"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedTypstVisitor = void 0;
var tslib_1 = require("tslib");
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var MmlNode_js_1 = require("mathjax-full/js/core/MmlTree/MmlNode.js");
var handlers_1 = require("./handlers");
var consts_1 = require("./consts");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
var escape_utils_1 = require("./escape-utils");
// Node kinds that carry sub/sup scripts (used in \idotsint pattern detection).
var IDOTSINT_SCRIPT_KINDS = new Set(['msubsup', 'msub', 'msup']);
// Map of opening delimiter char → expected close char + Typst output format.
// isFuncCall: true when content is placed inside a function-call argument
// (norm, floor, ceil) and needs separator escaping to prevent Typst from
// parsing commas/semicolons/colons as argument separators or named args.
var BARE_DELIM_PAIRS = (_a = {
        '|': { close: '|', typstOpen: 'lr(| ', typstClose: ' |)', isFuncCall: false }
    },
    _a[consts_1.LEFT_FLOOR] = { close: consts_1.RIGHT_FLOOR, typstOpen: 'floor(', typstClose: ')', isFuncCall: true },
    _a[consts_1.LEFT_CEIL] = { close: consts_1.RIGHT_CEIL, typstOpen: 'ceil(', typstClose: ')', isFuncCall: true },
    _a[consts_1.DOUBLE_VERT] = { close: consts_1.DOUBLE_VERT, typstOpen: 'norm(', typstClose: ')', isFuncCall: true },
    _a[consts_1.LEFT_CHEVRON] = { close: consts_1.RIGHT_CHEVRON, typstOpen: 'lr(chevron.l ', typstClose: ' chevron.r)', isFuncCall: false },
    _a[consts_1.LEFT_ANGLE_OLD] = { close: consts_1.RIGHT_ANGLE_OLD, typstOpen: 'lr(chevron.l ', typstClose: ' chevron.r)', isFuncCall: false },
    _a);
// Extract big delimiter info from a TeXAtom node wrapping a sized mo.
// The TeXAtom itself may have texClass=0 (ORD); the OPEN/CLOSE class
// is on the inner inferredMrow or mo node.
// Returns { delim, size, isOpen } if found, or null.
var getBigDelimInfo = function (node) {
    var _a, _b, _c, _d, _f;
    try {
        if (node.kind !== consts_1.TEX_ATOM)
            return null;
        // Custom-command TeXAtoms are not delimiters
        if ((_a = node.getProperty) === null || _a === void 0 ? void 0 : _a.call(node, 'data-custom-cmd'))
            return null;
        // TeXAtom > inferredMrow > mo(minsize/maxsize)
        var inferred = (_b = node.childNodes) === null || _b === void 0 ? void 0 : _b[0];
        if (!inferred || !inferred.isInferred)
            return null;
        var mo = (_c = inferred.childNodes) === null || _c === void 0 ? void 0 : _c[0];
        if (!mo || mo.kind !== 'mo')
            return null;
        var atr = (0, common_1.getAttrs)(mo);
        if (!atr.minsize)
            return null;
        // Check if this is OPEN or CLOSE via the mo or inferredMrow texClass
        var tc = (_f = (_d = mo.texClass) !== null && _d !== void 0 ? _d : inferred.texClass) !== null && _f !== void 0 ? _f : node.texClass;
        if (tc !== MmlNode_js_1.TEXCLASS.OPEN && tc !== MmlNode_js_1.TEXCLASS.CLOSE)
            return null;
        var delim = (0, common_1.getChildText)(mo);
        return { delim: delim, size: String(atr.minsize), isOpen: tc === MmlNode_js_1.TEXCLASS.OPEN };
    }
    catch (_e) {
        return null;
    }
};
// Resolve the inner mo node from a bare mo, mrow, or TeXAtom wrapping one mo.
// Returns the mo MathNode or null if the structure doesn't match.
var resolveDelimiterMo = function (node) {
    var _a;
    try {
        if ((node === null || node === void 0 ? void 0 : node.kind) === 'mo')
            return node;
        // Custom-command TeXAtoms should not be resolved as delimiters
        if ((_a = node === null || node === void 0 ? void 0 : node.getProperty) === null || _a === void 0 ? void 0 : _a.call(node, 'data-custom-cmd'))
            return null;
        if ((node === null || node === void 0 ? void 0 : node.kind) === 'mrow' || (node === null || node === void 0 ? void 0 : node.kind) === consts_1.TEX_ATOM) {
            var children = node.childNodes;
            if ((children === null || children === void 0 ? void 0 : children.length) === 1 && children[0].isInferred) {
                children = children[0].childNodes;
            }
            if ((children === null || children === void 0 ? void 0 : children.length) === 1 && children[0].kind === 'mo')
                return children[0];
        }
        return null;
    }
    catch (_e) {
        return null;
    }
};
// Return the text content of a single-mo node (bare mo, mrow or TeXAtom wrapping one mo).
// Used to detect delimiter characters like |, ⌊, ⌋, ⌈, ⌉, ‖, ⟨, ⟩.
var getDelimiterChar = function (node) {
    var mo = resolveDelimiterMo(node);
    return mo ? ((0, common_1.getChildText)(mo) || null) : null;
};
// Check if node is msub/msup/msubsup whose BASE is a closing delimiter.
// Returns the delimiter char if found, null otherwise.
// Used to detect \|x\|_2 where the closing ‖ is inside msub(‖, 2).
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
/** Serialize content between two sibling indices, joining with token separators. */
var serializeRange = function (node, from, to, space, serialize) {
    var content = '';
    for (var k = from; k < to; k++) {
        var innerData = serialize.visitNode(node.childNodes[k], space);
        var prevNode = k > from ? node.childNodes[k - 1] : null;
        if ((0, common_1.needsSpaceBetweenNodes)(content, innerData.typst, prevNode))
            content += ' ';
        content += innerData.typst;
    }
    return content;
};
/** Serialize and append sub/sup scripts from a script node (msub, msup, msubsup). */
var appendScripts = function (base, scriptNode, space, serialize) {
    var result = base;
    var kind = scriptNode.kind;
    if ((kind === 'msub' || kind === 'msubsup') && scriptNode.childNodes[1]) {
        var sub = serialize.visitNode(scriptNode.childNodes[1], space).typst.trim();
        if (sub)
            result += (0, common_1.formatScript)('_', sub);
    }
    var supNode = kind === 'msup' ? scriptNode.childNodes[1]
        : kind === 'msubsup' ? scriptNode.childNodes[2] : null;
    if (supNode) {
        var sup = serialize.visitNode(supNode, space).typst.trim();
        if (sup)
            result += (0, common_1.formatScript)('^', sup);
    }
    return result;
};
/** Big delimiter pattern: TeXAtom(OPEN) ... TeXAtom(CLOSE) with sized mo (\big, \Big, etc.) */
var tryBigDelimiterPattern = function (node, j, space, serialize) {
    var openInfo = getBigDelimInfo(node.childNodes[j]);
    if (!openInfo || !openInfo.isOpen)
        return null;
    var closeIdx = -1;
    var closeInfo = null;
    for (var k = j + 1; k < node.childNodes.length; k++) {
        var candidate = getBigDelimInfo(node.childNodes[k]);
        if (candidate && !candidate.isOpen) {
            closeIdx = k;
            closeInfo = candidate;
            break;
        }
    }
    if (closeIdx < 0 || !closeInfo)
        return null;
    var content = serializeRange(node, j + 1, closeIdx, space, serialize);
    var openDelim = (0, typst_symbol_map_1.findTypstSymbol)(openInfo.delim);
    var closeDelim = (0, typst_symbol_map_1.findTypstSymbol)(closeInfo.delim);
    if (!openDelim || !closeDelim)
        return null;
    return {
        typst: "lr(size: #".concat(openInfo.size, ", ").concat(openDelim, " ").concat(content.trim(), " ").concat(closeDelim, ")"),
        nextJ: closeIdx + 1,
    };
};
/** Bare delimiter pairing: |...|, ⌊...⌋, ⌈...⌉, ‖...‖, ⟨...⟩ without \left...\right.
 *  Also detects closing delimiters inside msub/msup/msubsup (e.g. \|x\|_2 → norm(x)_2). */
var tryBareDelimiterPattern = function (node, j, space, serialize) {
    var _a, _b;
    var delimChar = getDelimiterChar(node.childNodes[j]);
    var delimPair = delimChar ? BARE_DELIM_PAIRS[delimChar] : undefined;
    if (!delimPair)
        return null;
    // For symmetric delimiters, skip inside TeXAtom groups
    if (delimChar === delimPair.close && ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind) === consts_1.TEX_ATOM)
        return null;
    // For symmetric delimiters (| ‖), skip if the opener mo has CLOSE texClass —
    // it is actually a closing delimiter from a surrounding pair, not an opener.
    var isSymmetric = delimChar === delimPair.close;
    if (isSymmetric) {
        var openerMo = resolveDelimiterMo(node.childNodes[j]);
        if (openerMo && openerMo.texClass === MmlNode_js_1.TEXCLASS.CLOSE)
            return null;
    }
    var closeIdx = -1;
    var closeIsScripted = false;
    for (var k = j + 1; k < node.childNodes.length; k++) {
        if (getDelimiterChar(node.childNodes[k]) === delimPair.close) {
            closeIdx = k;
            break;
        }
        if (getScriptedDelimiterChar(node.childNodes[k]) === delimPair.close) {
            closeIdx = k;
            closeIsScripted = true;
            break;
        }
    }
    if (closeIdx <= j + 1)
        return null; // need at least one node between delimiters
    // Reject if content between delimiters contains unbalanced fence mo characters
    // ({, }, (, )) — this means the | symbols are not a matched pair.
    var fenceDepth = 0;
    var hasFenceImbalance = false;
    for (var k = j + 1; k < closeIdx; k++) {
        var ch = getDelimiterChar(node.childNodes[k]);
        if (ch === '(' || ch === '{')
            fenceDepth++;
        else if (ch === ')' || ch === '}') {
            fenceDepth--;
            if (fenceDepth < 0) {
                hasFenceImbalance = true;
                break;
            }
        }
    }
    if (fenceDepth !== 0 || hasFenceImbalance)
        return null;
    // For ‖…‖: reject if content between the delimiters contains a top-level
    // separator (PUNCT, e.g. comma) or if the pair spans the entire row and
    // contains a relational operator. Both patterns indicate the ‖ symbols are
    // standalone boundary delimiters, not a matched norm pair.
    if (delimChar === consts_1.DOUBLE_VERT) {
        for (var k = j + 1; k < closeIdx; k++) {
            var tc = (_b = node.childNodes[k]) === null || _b === void 0 ? void 0 : _b.texClass;
            if (tc === MmlNode_js_1.TEXCLASS.PUNCT)
                return null;
            if (j === 0 && closeIdx === node.childNodes.length - 1
                && tc === MmlNode_js_1.TEXCLASS.REL)
                return null;
        }
    }
    var rawContent = serializeRange(node, j + 1, closeIdx, space, serialize);
    var content = delimPair.isFuncCall
        ? (0, escape_utils_1.escapeContentSeparators)(rawContent.trim()) : (0, escape_utils_1.escapeLrSemicolons)(rawContent.trim());
    var delimExpr = "".concat(delimPair.typstOpen).concat(content).concat(delimPair.typstClose);
    // When the closing delimiter is inside a script node (e.g. ‖_2),
    // extract and append the script parts to the delimited expression.
    if (closeIsScripted) {
        delimExpr = appendScripts(delimExpr, node.childNodes[closeIdx], '', serialize);
    }
    return { typst: delimExpr, nextJ: closeIdx + 1 };
};
/** \idotsint pattern: mo(∫) mo(⋯) scripted(mo(∫)) → lr(integral dots.c integral)_sub^sup */
var tryIdotsintPattern = function (node, j, space, serialize) {
    var _a;
    var child = node.childNodes[j];
    if ((child === null || child === void 0 ? void 0 : child.kind) !== 'mo' || (0, common_1.getChildText)(child) !== consts_1.INTEGRAL_SIGN)
        return null;
    var next1 = node.childNodes[j + 1];
    var next2 = node.childNodes[j + 2];
    if (!next1 || next1.kind !== 'mo' || (0, common_1.getChildText)(next1) !== consts_1.MIDLINE_ELLIPSIS || !next2)
        return null;
    var scriptBase = (_a = next2.childNodes) === null || _a === void 0 ? void 0 : _a[0];
    if (!IDOTSINT_SCRIPT_KINDS.has(next2.kind) || (scriptBase === null || scriptBase === void 0 ? void 0 : scriptBase.kind) !== 'mo' || (0, common_1.getChildText)(scriptBase) !== consts_1.INTEGRAL_SIGN)
        return null;
    // Serialize the three base parts
    var part1 = serialize.visitNode(child, space);
    var part2 = serialize.visitNode(next1, space);
    var part3 = (0, typst_symbol_map_1.findTypstSymbol)(consts_1.INTEGRAL_SIGN);
    // Build base: "integral dots.c integral"
    var baseContent = part1.typst;
    if ((0, common_1.needsTokenSeparator)(baseContent, part2.typst))
        baseContent += ' ';
    baseContent += part2.typst;
    if ((0, common_1.needsTokenSeparator)(baseContent, part3))
        baseContent += ' ';
    baseContent += part3;
    var typst = appendScripts("lr(".concat(baseContent.trim(), ")"), next2, '', serialize);
    return { typst: typst, nextJ: j + 3 };
};
/** Thousand separator chain: mn, mo(,), mn(3 digits) → 1\,000\,000 */
var tryThousandSepPattern = function (node, j, _space, serialize) {
    var chain = (0, common_1.serializeThousandSepChain)(node, j, serialize);
    if (!chain)
        return null;
    return { typst: chain.typst, nextJ: chain.nextIndex };
};
var SerializedTypstVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SerializedTypstVisitor, _super);
    function SerializedTypstVisitor(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    SerializedTypstVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node, '');
    };
    // Parent AbstractVisitor forces ...args: any[] signature
    SerializedTypstVisitor.prototype.visitNode = function (node) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
        return handler.call.apply(handler, tslib_1.__spreadArray([this, node], tslib_1.__read(args), false));
    };
    SerializedTypstVisitor.prototype.visitTextNode = function (node, _space) {
        var res = (0, common_1.initTypstData)();
        try {
            var text = node.getText();
            res = (0, common_1.addToTypstData)(res, { typst: text });
            return res;
        }
        catch (_e) {
            return res;
        }
    };
    SerializedTypstVisitor.prototype.visitXMLNode = function (_node, _space) {
        return (0, common_1.initTypstData)();
    };
    SerializedTypstVisitor.prototype.visitInferredMrowNode = function (node, space) {
        var res = (0, common_1.initTypstData)();
        try {
            var children = node.childNodes;
            var j = 0;
            while (j < children.length) {
                var child = children[j];
                // Pattern 1: Big delimiter (\big, \Big, \bigg, \Bigg)
                var bigDelim = tryBigDelimiterPattern(node, j, space, this);
                if (bigDelim) {
                    if ((0, common_1.needsTokenSeparator)(res.typst, bigDelim.typst))
                        (0, common_1.addSpaceToTypstData)(res);
                    res = (0, common_1.addToTypstData)(res, { typst: bigDelim.typst });
                    j = bigDelim.nextJ;
                    continue;
                }
                // Pattern 2: Bare delimiter pairing (|...|, ⌊...⌋, ⌈...⌉, ‖...‖, ⟨...⟩)
                var bareDelim = tryBareDelimiterPattern(node, j, space, this);
                if (bareDelim) {
                    if ((0, common_1.needsTokenSeparator)(res.typst, bareDelim.typst))
                        (0, common_1.addSpaceToTypstData)(res);
                    res = (0, common_1.addToTypstData)(res, { typst: bareDelim.typst });
                    j = bareDelim.nextJ;
                    continue;
                }
                // Pattern 3: \idotsint (∫⋯∫ with scripts)
                var idotsint = tryIdotsintPattern(node, j, space, this);
                if (idotsint) {
                    if ((0, common_1.needsTokenSeparator)(res.typst, idotsint.typst))
                        (0, common_1.addSpaceToTypstData)(res);
                    res = (0, common_1.addToTypstData)(res, { typst: idotsint.typst });
                    j = idotsint.nextJ;
                    continue;
                }
                // Pattern 4: Thousand separator chain (1,000,000)
                var thousandSep = tryThousandSepPattern(node, j, space, this);
                if (thousandSep) {
                    if ((0, common_1.needsTokenSeparator)(res.typst, thousandSep.typst))
                        (0, common_1.addSpaceToTypstData)(res);
                    res = (0, common_1.addToTypstData)(res, { typst: thousandSep.typst });
                    j = thousandSep.nextJ;
                    continue;
                }
                // Pattern 5: Combining-mark chain (Devanagari, Arabic, etc.)
                var combChain = (0, common_1.serializeCombiningMiChain)(node, j);
                if (combChain) {
                    if ((0, common_1.needsTokenSeparator)(res.typst, combChain.typst))
                        (0, common_1.addSpaceToTypstData)(res);
                    res = (0, common_1.addToTypstData)(res, { typst: combChain.typst });
                    j = combChain.nextIndex;
                    continue;
                }
                // Pattern 6: Tagged eqnArray mtable with sibling content
                if (isTaggedEqnArray(child)) {
                    // Pre-content: accumulated prefix before the mtable
                    if (res.typst.trim()) {
                        child.setProperty(consts_1.DATA_PRE_CONTENT, res.typst.trim());
                        res = (0, common_1.initTypstData)();
                    }
                    // Post-content: serialize remaining siblings after the mtable
                    var postContent = '';
                    for (var k = j + 1; k < children.length; k++) {
                        var postData = this.visitNode(children[k], space);
                        if ((0, common_1.needsTokenSeparator)(postContent, postData.typst)) {
                            postContent += ' ';
                        }
                        postContent += postData.typst;
                    }
                    if (postContent.trim()) {
                        child.setProperty(consts_1.DATA_POST_CONTENT, postContent.trim());
                    }
                    // Process the mtable itself
                    var data_1 = this.visitNode(child, space);
                    if ((0, common_1.needsTokenSeparator)(res.typst, data_1.typst)) {
                        (0, common_1.addSpaceToTypstData)(res);
                    }
                    res = (0, common_1.addToTypstData)(res, data_1);
                    // Skip all remaining siblings (already serialized as post-content)
                    break;
                }
                // Pattern 7: \not negation overlay — mrow[REL] > mpadded[width=0] > mtext(⧸)
                // Consume the next sibling and wrap it in cancel()
                if ((0, common_1.isNegationOverlay)(child) && j + 1 < children.length) {
                    var nextData = this.visitNode(children[j + 1], space);
                    var cancelTypst = "cancel(".concat((0, escape_utils_1.escapeContentSeparators)((0, escape_utils_1.escapeUnbalancedParens)(nextData.typst.trim())), ")");
                    if ((0, common_1.needsSpaceBetweenNodes)(res.typst, cancelTypst, j > 0 ? children[j - 1] : null)) {
                        (0, common_1.addSpaceToTypstData)(res);
                    }
                    res = (0, common_1.addToTypstData)(res, { typst: cancelTypst });
                    j += 2;
                    continue;
                }
                // Normal processing
                var data = this.visitNode(child, space);
                if ((0, common_1.needsSpaceBetweenNodes)(res.typst, data.typst, j > 0 ? children[j - 1] : null)) {
                    (0, common_1.addSpaceToTypstData)(res);
                }
                res = (0, common_1.addToTypstData)(res, data);
                j++;
            }
            return res;
        }
        catch (_e) {
            return res;
        }
    };
    SerializedTypstVisitor.prototype.visitTeXAtomNode = function (node, _space) {
        var res = (0, common_1.initTypstData)();
        try {
            // Custom commands (e.g. \Varangle) — emit the Typst symbol from central map
            var customTypst = (0, common_1.getCustomCmdTypstSymbol)(node);
            if (customTypst) {
                return (0, common_1.addToTypstData)(res, { typst: customTypst });
            }
            var childData = this.childNodeMml(node);
            if (childData.typst.trim()) {
                res = (0, common_1.addToTypstData)(res, childData);
            }
            return res;
        }
        catch (_e) {
            return res;
        }
    };
    SerializedTypstVisitor.prototype.visitAnnotationNode = function (_node, _space) {
        return (0, common_1.initTypstData)();
    };
    SerializedTypstVisitor.prototype.visitDefault = function (node, _space) {
        return this.childNodeMml(node);
    };
    SerializedTypstVisitor.prototype.childNodeMml = function (node) {
        return (0, common_1.addToTypstData)((0, common_1.initTypstData)(), (0, handlers_1.handle)(node, this));
    };
    return SerializedTypstVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.SerializedTypstVisitor = SerializedTypstVisitor;
//# sourceMappingURL=index.js.map
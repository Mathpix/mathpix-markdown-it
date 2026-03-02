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
// Node kinds that carry sub/sup scripts (used in \idotsint pattern detection).
var SCRIPT_KINDS = new Set(['msubsup', 'msub', 'msup']);
// Map of opening delimiter char → expected close char + Typst output format.
var BARE_DELIM_PAIRS = (_a = {
        '|': { close: '|', typstOpen: 'lr(| ', typstClose: ' |)' }
    },
    _a[consts_1.LEFT_FLOOR] = { close: consts_1.RIGHT_FLOOR, typstOpen: 'floor(', typstClose: ')' },
    _a[consts_1.LEFT_CEIL] = { close: consts_1.RIGHT_CEIL, typstOpen: 'ceil(', typstClose: ')' },
    _a[consts_1.DOUBLE_VERT] = { close: consts_1.DOUBLE_VERT, typstOpen: 'norm(', typstClose: ')' },
    _a[consts_1.LEFT_CHEVRON] = { close: consts_1.RIGHT_CHEVRON, typstOpen: 'lr(chevron.l ', typstClose: ' chevron.r)' },
    _a[consts_1.LEFT_ANGLE_OLD] = { close: consts_1.RIGHT_ANGLE_OLD, typstOpen: 'lr(chevron.l ', typstClose: ' chevron.r)' },
    _a);
// Extract big delimiter info from a TeXAtom node wrapping a sized mo.
// The TeXAtom itself may have texClass=0 (ORD); the OPEN/CLOSE class
// is on the inner inferredMrow or mo node.
// Returns { delim, size, isOpen } if found, or null.
var getBigDelimInfo = function (node) {
    var _a, _b, _c, _d, _f;
    try {
        if (node.kind !== 'TeXAtom')
            return null;
        // TeXAtom > inferredMrow > mo(minsize/maxsize)
        var inferred = (_a = node.childNodes) === null || _a === void 0 ? void 0 : _a[0];
        if (!inferred || !inferred.isInferred)
            return null;
        var mo = (_b = inferred.childNodes) === null || _b === void 0 ? void 0 : _b[0];
        if (!mo || mo.kind !== 'mo')
            return null;
        var atr = ((_c = mo.attributes) === null || _c === void 0 ? void 0 : _c.getAllAttributes()) || {};
        if (!atr.minsize)
            return null;
        // Check if this is OPEN or CLOSE via the mo or inferredMrow texClass
        var tc = (_f = (_d = mo.texClass) !== null && _d !== void 0 ? _d : inferred.texClass) !== null && _f !== void 0 ? _f : node.texClass;
        if (tc !== MmlNode_js_1.TEXCLASS.OPEN && tc !== MmlNode_js_1.TEXCLASS.CLOSE)
            return null;
        var delim = (0, common_1.getChildText)(mo);
        return { delim: delim, size: String(atr.minsize), isOpen: tc === MmlNode_js_1.TEXCLASS.OPEN };
    }
    catch (e) {
        return null;
    }
};
// Return the text content of a single-mo node (bare mo, mrow or TeXAtom wrapping one mo).
// Used to detect delimiter characters like |, ⌊, ⌋, ⌈, ⌉, ‖, ⟨, ⟩.
var getDelimiterChar = function (node) {
    try {
        var moNode = null;
        if ((node === null || node === void 0 ? void 0 : node.kind) === 'mo') {
            moNode = node;
        }
        else if ((node === null || node === void 0 ? void 0 : node.kind) === 'mrow' || (node === null || node === void 0 ? void 0 : node.kind) === 'TeXAtom') {
            var children = node.childNodes;
            if ((children === null || children === void 0 ? void 0 : children.length) === 1 && children[0].isInferred) {
                children = children[0].childNodes;
            }
            if ((children === null || children === void 0 ? void 0 : children.length) === 1 && children[0].kind === 'mo') {
                moNode = children[0];
            }
        }
        return moNode ? ((0, common_1.getChildText)(moNode) || null) : null;
    }
    catch (_e) {
        return null;
    }
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
var SerializedTypstVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SerializedTypstVisitor, _super);
    function SerializedTypstVisitor(options) {
        var _this = _super.call(this) || this;
        _this.options = {};
        _this.options = options || {};
        return _this;
    }
    SerializedTypstVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node, '');
    };
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
        catch (e) {
            return res;
        }
    };
    SerializedTypstVisitor.prototype.visitXMLNode = function (_node, _space) {
        return (0, common_1.initTypstData)();
    };
    SerializedTypstVisitor.prototype.visitInferredMrowNode = function (node, space) {
        var _a, _b, _c;
        var res = (0, common_1.initTypstData)();
        try {
            var j = 0;
            while (j < node.childNodes.length) {
                var child = node.childNodes[j];
                // Detect big delimiter pattern: TeXAtom(OPEN) ... TeXAtom(CLOSE)
                // with sized mo (from \big, \Big, \bigg, \Bigg)
                var openInfo = getBigDelimInfo(child);
                if (openInfo && openInfo.isOpen) {
                    // Find matching CLOSE
                    var closeIdx = -1;
                    for (var k = j + 1; k < node.childNodes.length; k++) {
                        var closeCandidate = getBigDelimInfo(node.childNodes[k]);
                        if (closeCandidate && !closeCandidate.isOpen) {
                            closeIdx = k;
                            break;
                        }
                    }
                    if (closeIdx >= 0) {
                        var closeInfo = getBigDelimInfo(node.childNodes[closeIdx]);
                        // Serialize content between delimiters
                        var content = '';
                        for (var k = j + 1; k < closeIdx; k++) {
                            var innerData = this.visitNode(node.childNodes[k], space);
                            if ((0, common_1.needsTokenSeparator)(content, innerData.typst)) {
                                content += ' ';
                            }
                            content += innerData.typst;
                        }
                        var openDelim = (0, typst_symbol_map_1.findTypstSymbol)(openInfo.delim);
                        var closeDelim = (0, typst_symbol_map_1.findTypstSymbol)((closeInfo === null || closeInfo === void 0 ? void 0 : closeInfo.delim) || ')');
                        var lrContent = openDelim + ' ' + content.trim() + ' ' + closeDelim;
                        var lrExpr = 'lr(size: #' + openInfo.size + ', ' + lrContent + ')';
                        // Add spacing before lr if needed
                        if ((0, common_1.needsTokenSeparator)(res.typst, lrExpr)) {
                            (0, common_1.addSpaceToTypstData)(res);
                        }
                        res = (0, common_1.addToTypstData)(res, { typst: lrExpr });
                        j = closeIdx + 1;
                        continue;
                    }
                }
                // Detect paired delimiters without \left...\right:
                // |...| → lr(| ... |), ⌊...⌋ → floor(...), ⌈...⌉ → ceil(...), ‖...‖ → norm(...), ⟨...⟩ → lr(chevron.l ... chevron.r)
                // For symmetric delimiters (|, ‖), skip inside TeXAtom groups
                // (e.g. {|\alpha|} in superscripts) where content is already grouped.
                // Also detects closing delimiters inside msub/msup/msubsup (e.g. \|x\|_2 → norm(x)_2).
                var delimChar = getDelimiterChar(child);
                var delimPair = delimChar ? BARE_DELIM_PAIRS[delimChar] : null;
                if (delimPair && !(delimChar === delimPair.close && ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind) === 'TeXAtom')) {
                    var closeIdx = -1;
                    var closeIsScripted = false;
                    for (var k = j + 1; k < node.childNodes.length; k++) {
                        // First check bare delimiter
                        if (getDelimiterChar(node.childNodes[k]) === delimPair.close) {
                            closeIdx = k;
                            break;
                        }
                        // Then check delimiter inside msub/msup/msubsup base (e.g. ‖_2)
                        if (getScriptedDelimiterChar(node.childNodes[k]) === delimPair.close) {
                            closeIdx = k;
                            closeIsScripted = true;
                            break;
                        }
                    }
                    if (closeIdx > j + 1) {
                        var content = '';
                        for (var k = j + 1; k < closeIdx; k++) {
                            var innerData = this.visitNode(node.childNodes[k], space);
                            if ((0, common_1.needsTokenSeparator)(content, innerData.typst)) {
                                content += ' ';
                            }
                            content += innerData.typst;
                        }
                        var delimExpr = delimPair.typstOpen + content.trim() + delimPair.typstClose;
                        // When the closing delimiter is inside a script node (e.g. ‖_2),
                        // extract and append the script parts to the delimited expression.
                        if (closeIsScripted) {
                            var scriptNode = node.childNodes[closeIdx];
                            if (scriptNode.kind === 'msubsup') {
                                var sub = scriptNode.childNodes[1] ? this.visitNode(scriptNode.childNodes[1], '').typst.trim() : '';
                                var sup = scriptNode.childNodes[2] ? this.visitNode(scriptNode.childNodes[2], '').typst.trim() : '';
                                if (sub)
                                    delimExpr += (0, common_1.formatScript)('_', sub);
                                if (sup)
                                    delimExpr += (0, common_1.formatScript)('^', sup);
                            }
                            else if (scriptNode.kind === 'msub') {
                                var sub = scriptNode.childNodes[1] ? this.visitNode(scriptNode.childNodes[1], '').typst.trim() : '';
                                if (sub)
                                    delimExpr += (0, common_1.formatScript)('_', sub);
                            }
                            else if (scriptNode.kind === 'msup') {
                                var sup = scriptNode.childNodes[1] ? this.visitNode(scriptNode.childNodes[1], '').typst.trim() : '';
                                if (sup)
                                    delimExpr += (0, common_1.formatScript)('^', sup);
                            }
                        }
                        if ((0, common_1.needsTokenSeparator)(res.typst, delimExpr)) {
                            (0, common_1.addSpaceToTypstData)(res);
                        }
                        res = (0, common_1.addToTypstData)(res, { typst: delimExpr });
                        j = closeIdx + 1;
                        continue;
                    }
                }
                // Detect \idotsint pattern: mo(∫) mo(⋯) msubsup/msub/msup(mo(∫), ...)
                // Group as lr(integral dots.c integral)_(sub)^(sup)
                if ((child === null || child === void 0 ? void 0 : child.kind) === 'mo' && (0, common_1.getChildText)(child) === consts_1.INTEGRAL_SIGN) {
                    var next1 = node.childNodes[j + 1];
                    var next2 = node.childNodes[j + 2];
                    if ((next1 === null || next1 === void 0 ? void 0 : next1.kind) === 'mo' && (0, common_1.getChildText)(next1) === consts_1.MIDLINE_ELLIPSIS && next2) {
                        var scriptBase = (_b = next2.childNodes) === null || _b === void 0 ? void 0 : _b[0];
                        if (SCRIPT_KINDS.has(next2.kind)
                            && (scriptBase === null || scriptBase === void 0 ? void 0 : scriptBase.kind) === 'mo'
                            && (0, common_1.getChildText)(scriptBase) === consts_1.INTEGRAL_SIGN) {
                            // Serialize the three base parts
                            var part1 = this.visitNode(child, space);
                            var part2 = this.visitNode(next1, space);
                            var part3 = (0, typst_symbol_map_1.findTypstSymbol)(consts_1.INTEGRAL_SIGN);
                            // Build base: "integral dots.c integral"
                            var baseContent = part1.typst;
                            if ((0, common_1.needsTokenSeparator)(baseContent, part2.typst)) {
                                baseContent += ' ';
                            }
                            baseContent += part2.typst;
                            if ((0, common_1.needsTokenSeparator)(baseContent, part3)) {
                                baseContent += ' ';
                            }
                            baseContent += part3;
                            var lrExpr = 'lr(' + baseContent.trim() + ')';
                            // Add spacing before lr if needed
                            if ((0, common_1.needsTokenSeparator)(res.typst, lrExpr)) {
                                (0, common_1.addSpaceToTypstData)(res);
                            }
                            res = (0, common_1.addToTypstData)(res, { typst: lrExpr });
                            // Add scripts from the scripted node (sub at childNodes[1], sup at childNodes[2] for msubsup;
                            // single script at childNodes[1] for msub/msup)
                            var subChild = next2.kind !== 'msup' ? next2.childNodes[1] : null;
                            var supChild = next2.kind === 'msubsup' ? next2.childNodes[2]
                                : next2.kind === 'msup' ? next2.childNodes[1] : null;
                            if (subChild) {
                                var sub = this.visitNode(subChild, space).typst.trim();
                                if (sub) {
                                    res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('_', sub) });
                                }
                            }
                            if (supChild) {
                                var sup = this.visitNode(supChild, space).typst.trim();
                                if (sup) {
                                    res = (0, common_1.addToTypstData)(res, { typst: (0, common_1.formatScript)('^', sup) });
                                }
                            }
                            j += 3;
                            continue;
                        }
                    }
                }
                // Detect thousand-separator chain: mn, mo(,), mn(3 digits), ...
                // e.g. 1,000,000 → 1\,000\,000 (commas escaped so Typst doesn't treat them as separators)
                // Also handles Indian numbering: 41,70,000 → 41\,70\,000
                if ((0, common_1.isThousandSepComma)(node, j)) {
                    var numData = this.visitNode(child, space);
                    if ((0, common_1.needsTokenSeparator)(res.typst, numData.typst)) {
                        (0, common_1.addSpaceToTypstData)(res);
                    }
                    var chainTypst = numData.typst;
                    var k = j;
                    while ((0, common_1.isThousandSepComma)(node, k)) {
                        var nextData = this.visitNode(node.childNodes[k + 2], space);
                        chainTypst += '\\,' + nextData.typst;
                        k += 2;
                    }
                    res = (0, common_1.addToTypstData)(res, { typst: chainTypst });
                    j = k + 1;
                    continue;
                }
                // Check if this child is a tagged eqnArray mtable with sibling content.
                // When math content precedes or follows \begin{align*}/\begin{gather*} inside
                // the same $...$, it must be merged into the equation block.
                if (child.kind === 'mtable') {
                    var childIsEqnArray = child.childNodes.length > 0
                        && ((_c = child.childNodes[0].attributes) === null || _c === void 0 ? void 0 : _c.get('displaystyle'));
                    var childHasTag = childIsEqnArray
                        && child.childNodes.some(function (c) { return c.kind === 'mlabeledtr'; });
                    if (childHasTag) {
                        // Pre-content: accumulated prefix before the mtable
                        if (res.typst.trim()) {
                            child.setProperty(consts_1.DATA_PRE_CONTENT, res.typst.trim());
                            res = (0, common_1.initTypstData)();
                        }
                        // Post-content: serialize remaining siblings after the mtable
                        var postContent = '';
                        for (var k = j + 1; k < node.childNodes.length; k++) {
                            var postData = this.visitNode(node.childNodes[k], space);
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
                }
                // Normal processing
                var data = this.visitNode(child, space);
                if ((0, common_1.needsTokenSeparator)(res.typst, data.typst)) {
                    (0, common_1.addSpaceToTypstData)(res);
                }
                res = (0, common_1.addToTypstData)(res, data);
                j++;
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
    SerializedTypstVisitor.prototype.visitTeXAtomNode = function (node, space) {
        var _a;
        var res = (0, common_1.initTypstData)();
        try {
            var children = this.childNodeMml(node, space + '  ', '\n');
            if ((_a = children.typst) === null || _a === void 0 ? void 0 : _a.match(/\S/)) {
                res = (0, common_1.addToTypstData)(res, children);
            }
            return res;
        }
        catch (e) {
            return res;
        }
    };
    SerializedTypstVisitor.prototype.visitAnnotationNode = function (_node, _space) {
        return (0, common_1.initTypstData)();
    };
    SerializedTypstVisitor.prototype.visitDefault = function (node, _space) {
        return this.childNodeMml(node, '  ', '');
    };
    SerializedTypstVisitor.prototype.childNodeMml = function (node, _space, _nl) {
        var handleCh = handlers_1.handle.bind(this);
        var res = (0, common_1.initTypstData)();
        try {
            var data = handleCh(node, this);
            res = (0, common_1.addToTypstData)(res, data);
            return res;
        }
        catch (e) {
            return res;
        }
    };
    return SerializedTypstVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.SerializedTypstVisitor = SerializedTypstVisitor;
//# sourceMappingURL=index.js.map
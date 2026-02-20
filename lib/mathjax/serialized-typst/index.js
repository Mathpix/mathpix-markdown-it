"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedTypstVisitor = void 0;
var tslib_1 = require("tslib");
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var MmlNode_js_1 = require("mathjax-full/js/core/MmlTree/MmlNode.js");
var handlers_1 = require("./handlers");
var common_1 = require("./common");
var typst_symbol_map_1 = require("./typst-symbol-map");
// Extract big delimiter info from a TeXAtom node wrapping a sized mo.
// The TeXAtom itself may have texClass=0 (ORD); the OPEN/CLOSE class
// is on the inner inferredMrow or mo node.
// Returns { delim, size, isOpen } if found, or null.
var getBigDelimInfo = function (node) {
    var _a, _b, _c, _d, _f, _g, _h;
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
        var delim = ((_h = (_g = mo.childNodes) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.text) || '';
        return { delim: delim, size: atr.minsize.toString(), isOpen: tc === MmlNode_js_1.TEXCLASS.OPEN };
    }
    catch (e) {
        return null;
    }
};
// Return the text content of a single-mo node (bare mo, mrow or TeXAtom wrapping one mo).
// Used to detect delimiter characters like |, ⌊, ⌋, ⌈, ⌉, ‖.
var getDelimiterChar = function (node) {
    var _a, _b;
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
        return ((_b = (_a = moNode === null || moNode === void 0 ? void 0 : moNode.childNodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) || null;
    }
    catch (_e) {
        return null;
    }
};
// Map of opening delimiter char → expected close char + Typst output format.
var BARE_DELIM_PAIRS = {
    '|': { close: '|', typstOpen: 'lr(| ', typstClose: ' |)' },
    '\u230A': { close: '\u230B', typstOpen: 'floor(', typstClose: ')' },
    '\u2308': { close: '\u2309', typstOpen: 'ceil(', typstClose: ')' },
    '\u2016': { close: '\u2016', typstOpen: 'norm(', typstClose: ')' }, // ‖...‖
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
        var _a;
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
                            if (content && innerData.typst
                                && /^[\w."]/.test(innerData.typst)
                                && !/[\s({[,|]$/.test(content)) {
                                content += ' ';
                            }
                            content += innerData.typst;
                        }
                        var openDelim = (0, typst_symbol_map_1.findTypstSymbol)(openInfo.delim);
                        var closeDelim = (0, typst_symbol_map_1.findTypstSymbol)((closeInfo === null || closeInfo === void 0 ? void 0 : closeInfo.delim) || ')');
                        var lrContent = openDelim + ' ' + content.trim() + ' ' + closeDelim;
                        var lrExpr = 'lr(size: #' + openInfo.size + ', ' + lrContent + ')';
                        // Add spacing before lr if needed
                        if (res.typst && /^[\w.]/.test(lrExpr)
                            && !/[\s({[,|]$/.test(res.typst)) {
                            (0, common_1.addSpaceToTypstData)(res);
                        }
                        res = (0, common_1.addToTypstData)(res, { typst: lrExpr });
                        j = closeIdx + 1;
                        continue;
                    }
                }
                // Detect paired delimiters without \left...\right:
                // |...| → lr(| ... |), ⌊...⌋ → floor(...), ⌈...⌉ → ceil(...), ‖...‖ → norm(...)
                // For symmetric delimiters (|, ‖), skip inside TeXAtom groups
                // (e.g. {|\alpha|} in superscripts) where content is already grouped.
                var delimChar = getDelimiterChar(child);
                var delimPair = delimChar ? BARE_DELIM_PAIRS[delimChar] : null;
                if (delimPair && !(delimChar === delimPair.close && ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind) === 'TeXAtom')) {
                    var closeIdx = -1;
                    for (var k = j + 1; k < node.childNodes.length; k++) {
                        if (getDelimiterChar(node.childNodes[k]) === delimPair.close) {
                            closeIdx = k;
                            break;
                        }
                    }
                    if (closeIdx > j + 1) {
                        var content = '';
                        for (var k = j + 1; k < closeIdx; k++) {
                            var innerData = this.visitNode(node.childNodes[k], space);
                            if (content && innerData.typst
                                && /^[\w."]/.test(innerData.typst)
                                && !/[\s({[,|]$/.test(content)) {
                                content += ' ';
                            }
                            content += innerData.typst;
                        }
                        var delimExpr = delimPair.typstOpen + content.trim() + delimPair.typstClose;
                        if (res.typst && /^[\w."]/.test(delimExpr)
                            && !/[\s({[,|]$/.test(res.typst)) {
                            (0, common_1.addSpaceToTypstData)(res);
                        }
                        res = (0, common_1.addToTypstData)(res, { typst: delimExpr });
                        j = closeIdx + 1;
                        continue;
                    }
                }
                // Normal processing
                var data = this.visitNode(child, space);
                // Insert space between adjacent children when needed for Typst parsing:
                // word chars, dots, and quoted strings all need separation
                if (res.typst && data.typst
                    && /^[\w."]/.test(data.typst)
                    && !/[\s({[,|]$/.test(res.typst)) {
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
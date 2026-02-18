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
    var _a, _b, _c, _d, _e, _f, _g;
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
        var tc = (_e = (_d = mo.texClass) !== null && _d !== void 0 ? _d : inferred.texClass) !== null && _e !== void 0 ? _e : node.texClass;
        if (tc !== MmlNode_js_1.TEXCLASS.OPEN && tc !== MmlNode_js_1.TEXCLASS.CLOSE)
            return null;
        var delim = ((_g = (_f = mo.childNodes) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.text) || '';
        return { delim: delim, size: atr.minsize.toString(), isOpen: tc === MmlNode_js_1.TEXCLASS.OPEN };
    }
    catch (e) {
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
                                && !/[\s({[,]$/.test(content)) {
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
                            && !/[\s({[,]$/.test(res.typst)) {
                            res.typst += ' ';
                        }
                        res = (0, common_1.addToTypstData)(res, { typst: lrExpr });
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
                    && !/[\s({[,]$/.test(res.typst)) {
                    res.typst += ' ';
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
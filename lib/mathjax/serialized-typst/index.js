"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedTypstVisitor = void 0;
var tslib_1 = require("tslib");
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var handlers_1 = require("./handlers");
var common_1 = require("./common");
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
            for (var j = 0; j < node.childNodes.length; j++) {
                var child = node.childNodes[j];
                var data = this.visitNode(child, space);
                // Insert space between adjacent children when needed for Typst parsing:
                // if next child starts with a word char/dot, and previous output doesn't
                // end with whitespace or an opening bracket/comma, add a separator space
                if (res.typst && data.typst
                    && /^[\w.]/.test(data.typst)
                    && !/[\s({[,]$/.test(res.typst)) {
                    res.typst += ' ';
                }
                res = (0, common_1.addToTypstData)(res, data);
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
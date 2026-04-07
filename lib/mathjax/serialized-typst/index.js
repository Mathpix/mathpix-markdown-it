"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedTypstVisitor = void 0;
var tslib_1 = require("tslib");
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var dispatcher_1 = require("./ast/dispatcher");
var serialize_1 = require("./ast/serialize");
var SerializedTypstVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SerializedTypstVisitor, _super);
    function SerializedTypstVisitor(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.astSerializer = (0, dispatcher_1.createAstSerializer)();
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
        return {
            typst: node.getText()
        };
    };
    SerializedTypstVisitor.prototype.visitXMLNode = function (_node, _space) {
        return {
            typst: ''
        };
    };
    SerializedTypstVisitor.prototype.visitAnnotationNode = function (_node, _space) {
        return {
            typst: ''
        };
    };
    SerializedTypstVisitor.prototype.visitDefault = function (node, _space) {
        var result = (0, dispatcher_1.dispatchFull)(node, this.astSerializer);
        var typst = (0, serialize_1.serializeTypstMath)(result.node);
        var typstInline = result.nodeInline
            ? (0, serialize_1.serializeTypstMath)(result.nodeInline)
            : undefined;
        return {
            typst: typst,
            typst_inline: typstInline
        };
    };
    return SerializedTypstVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.SerializedTypstVisitor = SerializedTypstVisitor;
//# sourceMappingURL=index.js.map
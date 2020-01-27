"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var handlers_1 = require("./handlers");
var SerializedAsciiVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SerializedAsciiVisitor, _super);
    function SerializedAsciiVisitor(options) {
        var _this = _super.call(this) || this;
        _this.options = null;
        _this.options = options;
        return _this;
    }
    SerializedAsciiVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node, '');
    };
    SerializedAsciiVisitor.prototype.visitTextNode = function (node, space) {
        return node.getText();
    };
    SerializedAsciiVisitor.prototype.visitXMLNode = function (node, space) {
        return space + node.getSerializedXML();
    };
    SerializedAsciiVisitor.prototype.needsGrouping = function (element) {
        if (element.parent
            && (element.parent.kind === 'math' || element.parent.kind === 'mstyle'
                || element.parent.kind === 'mtable' || element.parent.kind === 'mtr' || element.parent.kind === 'mtd' || element.parent.kind === 'menclose')) {
            return false;
        }
        if (this.options.extraBrackets) {
            if (element.parent.parent && (element.parent.parent.kind === 'msup' || element.parent.parent.kind === 'msub' || element.parent.parent.kind === 'msubsup'
                || element.parent.parent.kind === 'mover' || element.parent.parent.kind === 'munder' || element.parent.parent.kind === 'munderover')) {
                return false;
            }
        }
        if (element.parent.kind === 'TeXAtom' && element.parent.parent.kind === 'inferredMrow') {
            return false;
        }
        if (element.childNodes && element.childNodes.length === 1) {
            if (element.childNodes[0].childNodes && element.childNodes[0].childNodes.length === 1) {
                return false;
            }
        }
        if (element.properties && element.properties.open === '(' && element.properties.close === ')') {
            return false;
        }
        var firstChild = element.childNodes[0];
        if (element.childNodes.length == 1 && firstChild.kind == 'mtext') {
            return false;
        }
        return true;
    };
    SerializedAsciiVisitor.prototype.needsGroupingStyle = function (element) {
        if (element.childNodes.length < 2) {
            return null;
        }
        var firstChild = element.childNodes[0];
        var firstAtr = this.getAttributes(firstChild);
        if (!firstAtr || !firstAtr.mathvariant || !firstAtr.hasOwnProperty('mathvariant')) {
            return null;
        }
        for (var i = 1; i < element.childNodes.length; i++) {
            var atr = this.getAttributes(element.childNodes[i]);
            if (!atr || atr.mathvariant !== firstAtr.mathvariant) {
                return null;
            }
        }
        return firstAtr;
    };
    SerializedAsciiVisitor.prototype.visitInferredMrowNode = function (node, space) {
        var mml = [];
        var addParens = this.needsGrouping(node);
        var group = addParens ? this.needsGroupingStyle(node) : null;
        if (addParens && !group) {
            mml.push('(');
        }
        for (var _i = 0, _a = node.childNodes; _i < _a.length; _i++) {
            var child = _a[_i];
            mml.push(this.visitNode(child, space));
        }
        if (addParens && !group) {
            mml.push(')');
        }
        return mml.join('');
    };
    SerializedAsciiVisitor.prototype.visitTeXAtomNode = function (node, space) {
        var children = this.childNodeMml(node, space + '  ', '\n');
        var mml = (children.match(/\S/) ? children : '');
        return mml;
    };
    SerializedAsciiVisitor.prototype.visitAnnotationNode = function (node, space) {
        return space + '<annotation' + this.getAttributes(node) + '>'
            + this.childNodeMml(node, '', '')
            + '</annotation>';
    };
    SerializedAsciiVisitor.prototype.visitDefault = function (node, space) {
        return this.childNodeMml(node, '  ', '');
    };
    SerializedAsciiVisitor.prototype.childNodeMml = function (node, space, nl) {
        var handleCh = handlers_1.handle.bind(this);
        var mml = '';
        if (node.kind === 'mover' && node.childNodes.length > 1 && node.childNodes[0].kind === 'TeXAtom' && node.childNodes[1].kind === 'TeXAtom') {
            var firstChild = node.childNodes[0];
            firstChild.properties.needBrackets = true;
            mml += handleCh(firstChild, this);
            mml += '^';
            mml += '(' + handleCh(node.childNodes[1], this) + ')';
        }
        else {
            mml += handleCh(node, this);
        }
        return mml;
    };
    SerializedAsciiVisitor.prototype.getAttributes = function (node) {
        return node.attributes.getAllAttributes();
    };
    return SerializedAsciiVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.SerializedAsciiVisitor = SerializedAsciiVisitor;
//# sourceMappingURL=index.js.map
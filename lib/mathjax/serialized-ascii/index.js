"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedAsciiVisitor = void 0;
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
        try {
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
        }
        catch (e) {
            return false;
        }
    };
    SerializedAsciiVisitor.prototype.needsGroupingStyle = function (element) {
        try {
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
        }
        catch (e) {
            return null;
        }
    };
    SerializedAsciiVisitor.prototype.visitInferredMrowNode = function (node, space) {
        var e_1, _a;
        var _this = this;
        var mml = [];
        try {
            var iclose = node.childNodes.findIndex(function (child) { return child.kind === 'menclose'; });
            var hasFunc = node.childNodes.find(function (child) { return (child.kind === 'msub'); });
            if (iclose > -1) {
                var mclose = node.childNodes[iclose];
                var atr = this.getAttributes(mclose);
                var atrDef = this.getAttributesDefaults(mclose);
                var longdiv_1 = '';
                if ((!atr.notation && atrDef.notation === "longdiv") ||
                    (atr.notation.toString().indexOf("longdiv") !== -1 ||
                        atr.notation.toString().indexOf("bottom") !== -1)) {
                    if (iclose === 0) {
                        longdiv_1 += '(()/(';
                        longdiv_1 += this.visitNode(mclose, '');
                        longdiv_1 += '))';
                    }
                    else {
                        var mnList = [];
                        var i = 1;
                        while (iclose - i >= 0) {
                            var child = node.childNodes[iclose - i];
                            mnList.unshift(child);
                            i++;
                        }
                        if (iclose - mnList.length > 0) {
                            for (var i_1 = 0; i_1 < iclose - mnList.length; i_1++) {
                                longdiv_1 += this.visitNode(node.childNodes[i_1], space);
                            }
                        }
                        longdiv_1 += '((';
                        mnList.forEach(function (item) {
                            longdiv_1 += _this.visitNode(item, '');
                        });
                        longdiv_1 += ')/(';
                        longdiv_1 += this.visitNode(mclose, '');
                        longdiv_1 += '))';
                        if (iclose < node.childNodes.length - 1) {
                            for (var i_2 = iclose + 1; i_2 < node.childNodes.length; i_2++) {
                                longdiv_1 += this.visitNode(node.childNodes[i_2], space);
                            }
                        }
                    }
                    mml.push(longdiv_1);
                    return mml.join('');
                }
            }
            var addParens = this.needsGrouping(node);
            var group = addParens ? this.needsGroupingStyle(node) : null;
            if (addParens && !group) {
                mml.push('(');
            }
            try {
                for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    mml.push(this.visitNode(child, space));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (addParens && !group) {
                mml.push(')');
            }
            //TeXAtom
            var needBranch = node.parent && node.parent.kind === 'TeXAtom'
                && node.parent.Parent && node.parent.Parent.kind === 'mtd'
                && node.childNodes.length > 1;
            var mmlContent = needBranch && hasFunc
                ? '{:'
                : '';
            mmlContent += mml.join('');
            mmlContent += needBranch && hasFunc
                ? ':}'
                : '';
            return mmlContent;
        }
        catch (e) {
            return '';
        }
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
        try {
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
        }
        catch (e) {
            return mml;
        }
    };
    SerializedAsciiVisitor.prototype.getAttributes = function (node) {
        return node.attributes.getAllAttributes();
    };
    SerializedAsciiVisitor.prototype.getAttributesDefaults = function (node) {
        return node.attributes.getAllDefaults();
    };
    return SerializedAsciiVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.SerializedAsciiVisitor = SerializedAsciiVisitor;
//# sourceMappingURL=index.js.map
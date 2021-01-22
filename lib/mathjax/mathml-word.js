"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathMLVisitorWord = void 0;
var tslib_1 = require("tslib");
var SerializedMmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");
var MathMLVisitorWord = /** @class */ (function (_super) {
    tslib_1.__extends(MathMLVisitorWord, _super);
    function MathMLVisitorWord(options) {
        var _this = _super.call(this) || this;
        _this.options = null;
        _this.isSubTable = function (node) {
            var res = false;
            while (node.Parent) {
                if (node.Parent.kind === 'mtable') {
                    res = true;
                    break;
                }
                node = node.Parent;
            }
            return res;
        };
        _this.needToAddRow = function (node) {
            if (node.parent && node.parent.childNodes.length > 0) {
                var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
                if (index < node.parent.childNodes.length) {
                    var next = node.parent.childNodes[index + 1];
                    if (next && next.kind //&& next.kind !== 'mrow'
                    ) {
                        next.needRow = true;
                    }
                }
            }
        };
        _this.needConvertToFenced = function (node) {
            var kind = node.kind;
            var properties = node.properties;
            return kind === "mrow" && properties && properties.texClass === 7;
        };
        _this.pasteNodeToNewRow = function (node, space) {
            var _a = tslib_1.__read((node.isToken || node.childNodes.length === 0 ? ['\n', ''] : ['\n', space]), 2), nl = _a[0], endspace = _a[1];
            node.needRow = false;
            return space + '<mrow>' + endspace
                + nl + _this.visitNode(node, space + '  ') + endspace
                + nl + space + '</mrow>' + endspace;
        };
        _this.convertToFenced = function (node, space) {
            var _a = tslib_1.__read((node.isToken || node.childNodes.length === 0 ? ['\n', ''] : ['\n', space]), 2), nl = _a[0], endspace = _a[1];
            if (node.needRow) {
                return _this.pasteNodeToNewRow(node, space);
            }
            var kind = node.kind;
            var properties = node.properties;
            var mml = space + '<mfenced';
            if (_this.options.forDocx) {
                mml += properties.open ? " open=\"" + properties.open + "\" branch_open=\"" + properties.open + "\"" : ' open="" branch_open=""';
                mml += properties.close ? " close=\"" + properties.close + "\" branch_close=\"" + properties.close + "\"" : ' close="" branch_close=""';
            }
            else {
                mml += properties.open ? " open=\"" + properties.open + "\"" : ' open=""';
                mml += properties.close ? " close=\"" + properties.close + "\"" : ' close=""';
            }
            mml += ' separators="|"';
            mml += '>';
            mml += nl + space + '  ' + '<' + kind + '>';
            for (var i = 0; i < node.childNodes.length; i++) {
                if (i === 0 && node.childNodes[i].kind === 'mo' && node.childNodes[i].texClass === 4) {
                    continue;
                }
                if (i === node.childNodes.length - 1 && node.childNodes[i].kind === 'mo' && node.childNodes[i].texClass === 5) {
                    continue;
                }
                var children = _this.visitNode(node.childNodes[i], space + '    ');
                mml += nl + children + endspace;
            }
            mml += nl + space + '  ' + '</' + kind + '>' + endspace;
            mml += nl + space + '</mfenced>';
            return mml;
        };
        _this.options = options;
        return _this;
    }
    MathMLVisitorWord.prototype.visitTextNode = function (node, space) {
        var _a = this.options.unicodeConvert, unicodeConvert = _a === void 0 ? false : _a;
        return this.quoteHTML(node.getText(), unicodeConvert);
    };
    MathMLVisitorWord.prototype.restructureMtrForAligned = function (node, space) {
        var _a = tslib_1.__read((node.isToken || node.childNodes.length === 0 ? ['\n', ''] : ['\n', space]), 1), nl = _a[0];
        var mml = '';
        var attributes = node.Parent && node.Parent.attributes
            ? node.Parent.attributes.getAllAttributes()
            : {};
        var _b = attributes.columnalign, columnalign = _b === void 0 ? '' : _b;
        if (!columnalign) {
            return mml;
        }
        if (columnalign.indexOf('center') >= 0) {
            return mml;
        }
        var space2 = space + '  ';
        var space3 = space2 + '  ';
        var space4 = space3 + '  ';
        var space5 = space4 + '  ';
        // [aligned, align*, align]: 'rlrlrlrlrlrl', - Align all in left side
        if (columnalign === "right left right left right left right left right left right left") {
            mml += space + '<mtr>';
            if (node.childNodes.length > 1) {
                mml += nl + space2 + '<mtd>';
                mml += nl + space3 + '<mrow>';
                for (var i = 0; i < node.childNodes.length; i++) {
                    mml += nl + space4 + '<mrow>';
                    mml += nl + space5 + '<maligngroup/>';
                    var child = this.childNodeMml(node.childNodes[i], space5, nl);
                    mml += child.trim()
                        ? nl + child
                        : nl;
                    mml += space4 + '</mrow>';
                }
                mml += nl + space3 + '</mrow>';
                mml += nl + space2 + '</mtd>';
            }
            else {
                mml += nl + space2 + '<mtd>';
                mml += nl + space3 + '<mrow>';
                mml += nl + space5 + '<maligngroup/>';
                mml += nl + this.childNodeMml(node.childNodes[0], space5, nl);
                mml += space3 + '</mrow>';
                mml += nl + space2 + '</mtd>';
            }
            mml += nl + space + '</mtr>';
            return mml;
        }
        if (node.childNodes.length === 1) {
            mml = space + '<mtr>';
            mml += nl + space2 + '<mtd>';
            mml += nl + space3 + '<mrow>';
            mml += nl + space5 + '<maligngroup/>';
            mml += nl + space5 + '<malignmark/>';
            mml += nl + this.childNodeMml(node.childNodes[0], space5, nl);
            mml += space3 + '</mrow>';
            mml += nl + space2 + '</mtd>';
            mml += nl + space + '</mtr>';
            return mml;
        }
        ;
        mml = space + '<mtr>';
        mml += nl + space2 + '<mtd>';
        mml += nl + space3 + '<mrow>';
        for (var i = 0; i < node.childNodes.length; i++) {
            mml += nl + space4 + '<maligngroup/>';
            mml += nl + space4 + '<malignmark/>';
            mml += nl + space4 + '<mrow>';
            var child = this.childNodeMml(node.childNodes[i], space5, nl);
            mml += child.trim()
                ? nl + child
                : nl;
            if (i < node.childNodes.length - 1) {
                mml += space5 + '<mo>'
                    + String.fromCharCode(8197)
                    + String.fromCharCode(8197)
                    + String.fromCharCode(8197)
                    + String.fromCharCode(8197)
                    + '</mo>' + nl;
            }
            mml += space4 + '</mrow>';
        }
        mml += nl + space3 + '</mrow>';
        mml += nl + space2 + '</mtd>';
        mml += nl + space + '</mtr>';
        return mml;
    };
    ;
    MathMLVisitorWord.prototype.visitDefault = function (node, space) {
        if (node.needRow) {
            return this.pasteNodeToNewRow(node, space);
        }
        if (node.kind === 'msubsup' || node.kind === 'msub' || node.kind === 'sup') {
            return this.visitMunderoverNode(node, space);
        }
        if (!this.options.forDocx
            && node.kind === 'mtr' && this.options.aligned
            && node.Parent && node.Parent.kind === 'mtable') {
            if (node.Parent.Parent && node.Parent.Parent.kind === 'math'
                || !this.isSubTable(node.Parent)) {
                var mml = this.restructureMtrForAligned(node, space);
                if (mml) {
                    return mml;
                }
            }
        }
        if (this.needConvertToFenced(node)) {
            return this.convertToFenced(node, space);
        }
        if (this.options.forDocx) {
            if (node.kind === 'mo') {
                if (node.properties && node.properties.hasOwnProperty('movablelimits')
                    && node.properties['movesupsub'] === true
                    && node.properties['texprimestyle'] === true
                    && node.properties['texClass'] === 1
                    && node.properties['movablelimits'] === false) {
                    if (node.attributes.attributes) {
                        node.attributes.attributes.movablelimits = false;
                    }
                    else {
                        node.attributes.attributes = { movablelimits: false };
                    }
                }
            }
        }
        return _super.prototype.visitDefault.call(this, node, space);
    };
    MathMLVisitorWord.prototype.visitMunderoverNode = function (node, space) {
        if (node.kind === "munder" || node.kind === "mover") {
            node.attributes.attributes.accent = true;
            node.attributes.attributes.accentunder = false;
        }
        var base = node.childNodes[node.base];
        if (node.kind !== 'msup' && node.kind !== 'msub' && base && base.kind !== 'TeXAtom'
            && (base.kind !== 'mrow' || this.needConvertToFenced(base))) {
            base.needRow = true;
        }
        var _a = tslib_1.__read((node.isToken || node.childNodes.length === 0 ? ['\n', ''] : ['\n', space]), 1), nl = _a[0];
        var space2 = space + '  ';
        var mml = _super.prototype.visitDefault.call(this, node, space);
        if (base.kind === 'mo' && base.properties.texClass === 1) {
            mml += nl + space + '<mrow>';
            mml += nl + space2 + '<mo>' + String.fromCharCode(8202) + '</mo>';
            mml += nl + space + '</mrow>';
        }
        return mml;
    };
    MathMLVisitorWord.prototype.visitMunderNode = function (node, space) {
        return this.visitMunderoverNode(node, space);
    };
    MathMLVisitorWord.prototype.visitMoverNode = function (node, space) {
        return this.visitMunderoverNode(node, space);
    };
    MathMLVisitorWord.prototype.quoteHTML = function (value, replaceAll) {
        if (replaceAll === void 0) { replaceAll = false; }
        var result = value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;');
        if (replaceAll) {
            result = result
                .replace(/([\uD800-\uDBFF].)/g, function (m, c) {
                return '&#x' + ((c.charCodeAt(0) - 0xD800) * 0x400 +
                    (c.charCodeAt(1) - 0xDC00) + 0x10000).toString(16).toUpperCase() + ';';
            })
                .replace(/([\u0080-\uD7FF\uE000-\uFFFF])/g, function (m, c) {
                return '&#x' + c.charCodeAt(0).toString(16).toUpperCase() + ';';
            });
        }
        return result;
    };
    return MathMLVisitorWord;
}(SerializedMmlVisitor_js_1.SerializedMmlVisitor));
exports.MathMLVisitorWord = MathMLVisitorWord;
//# sourceMappingURL=mathml-word.js.map
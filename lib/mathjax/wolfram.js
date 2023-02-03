"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WolframVisitor = void 0;
var tslib_1 = require("tslib");
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var handlers_1 = require("./serialized-wolfram/handlers");
var helperA_1 = require("./serialized-wolfram/helperA");
var regLogic = /\\vee|\\wedge/;
var WolframVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(WolframVisitor, _super);
    function WolframVisitor(options) {
        var _this = _super.call(this) || this;
        _this.options = null;
        _this.isLogic = false;
        _this.options = options;
        if (_this.options.inputLatex) {
            _this.isLogic = regLogic.test(_this.options.inputLatex);
        }
        return _this;
    }
    WolframVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node, '');
    };
    WolframVisitor.prototype.visitTextNode = function (node, space) {
        return node.getText();
    };
    WolframVisitor.prototype.visitXMLNode = function (node, space) {
        return space + node.getSerializedXML();
    };
    WolframVisitor.prototype.needsGrouping = function (element) {
        var _a;
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
                    return ((_a = element.parent) === null || _a === void 0 ? void 0 : _a.kind) === "msqrt";
                }
            }
            if (element.properties && element.properties.open === '(' && element.properties.close === ')') {
                return false;
            }
            var firstChild = element.childNodes[0];
            if (element.childNodes.length == 1 && firstChild.kind == 'mtext') {
                return false;
            }
            if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === "mover") {
                var t = (firstChild === null || firstChild === void 0 ? void 0 : firstChild.childNodes[1]) ? this.visitNode(firstChild === null || firstChild === void 0 ? void 0 : firstChild.childNodes[1], '') : '';
                var asc = t ? handlers_1.FindSymbolToAM('mover', t, {}) : '';
                return asc !== "dot";
            }
            return true;
        }
        catch (e) {
            return false;
        }
    };
    WolframVisitor.prototype.needsGroupingStyle = function (element) {
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
    WolframVisitor.prototype.visitInferredMrowNode = function (node, space) {
        var _this = this;
        var _a, _b;
        var mml = [];
        try {
            var iclose = node.childNodes.findIndex(function (child) { return child.kind === 'menclose'; });
            var hasFunc = node.childNodes.find(function (child) { return (child.kind === 'msub'); });
            //Check on interval
            if (iclose > -1) {
                var mclose = node.childNodes[iclose];
                var atr = this.getAttributes(mclose);
                var atrDef = this.getAttributesDefaults(mclose);
                var longdiv_1 = '';
                var divisor = '';
                var dividend_1 = '';
                /** \longdiv */
                if ((!atr.notation && atrDef.notation === "longdiv") ||
                    atr.notation.toString().indexOf("longdiv") !== -1) {
                    if (iclose === 0) {
                        divisor = this.visitNode(mclose, '');
                        dividend_1 = '';
                        longdiv_1 += "((" + divisor + ")/(" + dividend_1 + "))";
                    }
                    else {
                        var beforeLongdiv = "";
                        var afterLongdiv = "";
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
                                beforeLongdiv += longdiv_1;
                            }
                        }
                        divisor = this.visitNode(mclose, '');
                        dividend_1 = '';
                        mnList.forEach(function (item) {
                            dividend_1 += _this.visitNode(item, '');
                        });
                        longdiv_1 += "((" + divisor + ")/(" + dividend_1 + "))";
                        if (iclose < node.childNodes.length - 1) {
                            for (var i_2 = iclose + 1; i_2 < node.childNodes.length; i_2++) {
                                longdiv_1 += this.visitNode(node.childNodes[i_2], space);
                                afterLongdiv += longdiv_1;
                            }
                        }
                        if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind) === "math" && !beforeLongdiv && !afterLongdiv && (divisor === null || divisor === void 0 ? void 0 : divisor.trim()) && (dividend_1 === null || dividend_1 === void 0 ? void 0 : dividend_1.trim()) && (/[a-zA-Z]/.test(divisor === null || divisor === void 0 ? void 0 : divisor.trim()) || /[a-zA-Z]/.test(dividend_1 === null || dividend_1 === void 0 ? void 0 : dividend_1.trim()))) {
                            /** Divide a polynomial by another polynomial to find the quotient and remainder.
                             * Perform polynomial long division */
                            longdiv_1 = 'long division ' + longdiv_1;
                        }
                    }
                    mml.push(longdiv_1);
                    return mml.join('');
                }
                /** \lcm */
                if ((!atr.notation && atrDef.notation === "bottom")
                    || atr.notation.toString().indexOf("bottom") !== -1) {
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
                            for (var i_3 = 0; i_3 < iclose - mnList.length; i_3++) {
                                longdiv_1 += this.visitNode(node.childNodes[i_3], space);
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
                            for (var i_4 = iclose + 1; i_4 < node.childNodes.length; i_4++) {
                                longdiv_1 += this.visitNode(node.childNodes[i_4], space);
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
            var nOpenBranch = 0;
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                if (child.kind === "msqrt" && mml.length) {
                    var mmlContentBefore = mml.join('').trim();
                    if ((mmlContentBefore === null || mmlContentBefore === void 0 ? void 0 : mmlContentBefore.length) && !helperA_1.openBranches.includes(mmlContentBefore[mmlContentBefore.length - 1])
                        && (mml[mml.length - 1]
                            && !helperA_1.getFunction(mml[mml.length - 1].toLowerCase()))) {
                        mml.push(" ");
                    }
                }
                var contentBefore = mml.join('');
                var sVisitNode = this.visitNode(child, space);
                //iint
                if (child.kind === "mo" && (sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim()) === 'iint') {
                    mml.push("int int ");
                    continue;
                }
                //iiint
                if (child.kind === "mo" && (sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim()) === 'iiint') {
                    mml.push(" int int int ");
                    continue;
                }
                if (mml.length && ((_b = mml[mml.length - 1]) === null || _b === void 0 ? void 0 : _b.trim()) === "\u0394" && (sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim()) !== "(") {
                    mml.push(" ");
                    mml.push(sVisitNode);
                    continue;
                }
                var sFunction = (sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim()) ? helperA_1.getFunction(sVisitNode.trim()) : "";
                if (child.kind === "mo"
                    && i > 0
                    && (sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim())
                    && ![",", "/", "×", ")", "]", "}", ".", "("].includes(sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim())) {
                    if (child.kind === "mo"
                        && (sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim()) && nOpenBranch > 0) {
                        mml.push(")");
                        nOpenBranch -= 1;
                        if (nOpenBranch === 0) {
                            mml.push(" ");
                        }
                    }
                    else {
                        mml.push(" ");
                    }
                }
                if (child.kind === "mo" && (sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim()) && nOpenBranch > 0) {
                    mml.push(")");
                    nOpenBranch -= 1;
                }
                mml.push(sVisitNode);
                if (sFunction) {
                    var nextChild = i + 2 < node.childNodes.length
                        ? node.childNodes[i + 2]
                        : null;
                    var sNextChild = nextChild ? this.visitNode(nextChild, space) : '';
                    sNextChild = sNextChild === null || sNextChild === void 0 ? void 0 : sNextChild.trim();
                    if (sNextChild.length && sNextChild.indexOf("(") !== 0
                        && i + 1 < node.childNodes.length) {
                        mml.push("(");
                        nOpenBranch += 1;
                    }
                    sFunction = '';
                }
                contentBefore = mml.join('');
                var childNext = i + 1 < node.childNodes.length
                    ? node.childNodes[i + 1]
                    : null;
                if (((child.kind === "mn"
                    && sVisitNode !== "d"
                    && ((childNext === null || childNext === void 0 ? void 0 : childNext.kind) === "mi" || (childNext === null || childNext === void 0 ? void 0 : childNext.kind) === "msub"))
                    ||
                        (child.kind === "mo" && (sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim()) && i > 0
                            && !["/", "×", "(", "[", ")", "{"].includes(sVisitNode === null || sVisitNode === void 0 ? void 0 : sVisitNode.trim())))
                    && (contentBefore === null || contentBefore === void 0 ? void 0 : contentBefore.length) && (contentBefore[contentBefore.length - 1] !== " "
                    && contentBefore[contentBefore.length - 1] !== ".")) {
                    mml.push(" ");
                }
            }
            if (nOpenBranch > 0) {
                for (var i = 0; i < nOpenBranch; i++) {
                    mml.push(')');
                }
            }
            if (addParens && !group) {
                mml.push(')');
            }
            //TeXAtom
            var needBranch = node.parent && node.parent.kind === 'TeXAtom'
                && node.parent.Parent && node.parent.Parent.kind === 'mtd'
                && node.childNodes.length > 1;
            var mmlContent = needBranch && hasFunc
                ? '{'
                : '';
            mmlContent += mml.join('');
            mmlContent += needBranch && hasFunc
                ? '}'
                : '';
            mmlContent = mmlContent.replace(/  /g, ' ');
            mmlContent = mmlContent
                .replace(/ \)/g, ')')
                .replace(/\( /g, '(')
                .replace(/ }/g, '}')
                .replace(/{ /g, '{')
                .replace(/ ,/g, ',');
            mmlContent = mmlContent
                .replace(/ \|\||\|\| /g, '||')
                .replace(/ \||\| /g, '|');
            return mmlContent;
        }
        catch (e) {
            return '';
        }
    };
    WolframVisitor.prototype.visitTeXAtomNode = function (node, space) {
        var children = this.childNodeMml(node, space + '  ', '\n');
        var mml = (children.match(/\S/) ? children : '');
        return mml;
    };
    WolframVisitor.prototype.visitAnnotationNode = function (node, space) {
        return space + '<annotation' + this.getAttributes(node) + '>'
            + this.childNodeMml(node, '', '')
            + '</annotation>';
    };
    WolframVisitor.prototype.visitDefault = function (node, space) {
        return this.childNodeMml(node, '  ', '');
    };
    WolframVisitor.prototype.childNodeMml = function (node, space, nl) {
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
    WolframVisitor.prototype.getAttributes = function (node) {
        return node.attributes.getAllAttributes();
    };
    WolframVisitor.prototype.getAttributesDefaults = function (node) {
        return node.attributes.getAllDefaults();
    };
    return WolframVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.WolframVisitor = WolframVisitor;
//# sourceMappingURL=wolfram.js.map
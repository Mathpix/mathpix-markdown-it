"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedAsciiVisitor = void 0;
var tslib_1 = require("tslib");
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var handlers_1 = require("./handlers");
var common_1 = require("./common");
var helperA_1 = require("./helperA");
var helperLiner_1 = require("./helperLiner");
var SerializedAsciiVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SerializedAsciiVisitor, _super);
    function SerializedAsciiVisitor(options) {
        var _this = _super.call(this) || this;
        _this.options = null;
        /** Apply inherited attribute to all children */
        _this.setChildInheritedAttribute = function (node, attrName) {
            var e_1, _a;
            var _b;
            try {
                var inherited = (node === null || node === void 0 ? void 0 : node.attributes) ? (_b = node === null || node === void 0 ? void 0 : node.attributes) === null || _b === void 0 ? void 0 : _b.getAllInherited() : null;
                if (!inherited || !inherited.hasOwnProperty(attrName) || !node.childNodes || !node.childNodes.length) {
                    return;
                }
                try {
                    for (var _c = tslib_1.__values(node.childNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var child = _d.value;
                        if (child.attributes) {
                            child.attributes.setInherited(attrName, inherited[attrName]);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (e) {
                console.log("[MMD]=>error=>", e);
            }
        };
        _this.options = options;
        return _this;
    }
    SerializedAsciiVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node, '');
    };
    SerializedAsciiVisitor.prototype.visitNode = function (node) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.setChildInheritedAttribute(node, 'toTsv');
        this.setChildInheritedAttribute(node, 'toCsv');
        this.setChildInheritedAttribute(node, 'toMd');
        this.setChildInheritedAttribute(node, 'flattenSup');
        /** return super.visitNode(node, ...args); */
        var handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
        return handler.call.apply(handler, tslib_1.__spreadArray([this, node], tslib_1.__read(args), false));
    };
    SerializedAsciiVisitor.prototype.visitTextNode = function (node, space) {
        var res = (0, common_1.initAsciiData)();
        try {
            var text = node.getText();
            res = (0, common_1.AddToAsciiData)(res, { ascii: text, liner: text });
            return res;
        }
        catch (e) {
            console.error('mml => visitTextNode =>', e);
            return res;
        }
    };
    SerializedAsciiVisitor.prototype.visitXMLNode = function (node, space) {
        var res = (0, common_1.initAsciiData)();
        try {
            var str = space + node.getSerializedXML();
            res = (0, common_1.AddToAsciiData)(res, { ascii: str, liner: str });
            return res;
        }
        catch (e) {
            console.error('mml => visitXMLNode =>', e);
            return res;
        }
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
        var _this = this;
        var _a, _b;
        var res = (0, common_1.initAsciiData)();
        try {
            var iclose = node.childNodes.findIndex(function (child) { return child.kind === 'menclose'; });
            var hasFunc = node.childNodes.find(function (child) { return (child.kind === 'msub'); });
            if (iclose > -1) {
                var mclose = node.childNodes[iclose];
                var atr = this.getAttributes(mclose);
                var isFrame = mclose.attributes.get('isFrame');
                if (((_b = (_a = mclose.childNodes[0]) === null || _a === void 0 ? void 0 : _a.childNodes[0]) === null || _b === void 0 ? void 0 : _b.kind) === 'mtable') {
                    isFrame = true;
                }
                var atrDef = this.getAttributesDefaults(mclose);
                /** \longdiv */
                if ((!atr.notation && atrDef.notation === "longdiv") ||
                    atr.notation.toString().indexOf("longdiv") !== -1) {
                    if (iclose === 0) {
                        var data = this.visitNode(mclose, '');
                        res = (0, common_1.AddToAsciiData)(res, {
                            ascii: "((".concat(data.ascii, ")/())"),
                            liner: "((".concat(data.liner, ")/())"),
                            ascii_tsv: "((".concat(data.ascii_tsv, ")/())"),
                            ascii_csv: "((".concat(data.ascii_csv, ")/())"),
                            ascii_md: "((".concat(data.ascii_md, ")/())"),
                            liner_tsv: "((".concat(data.liner_tsv, ")/())"),
                        });
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
                                var data = this.visitNode(node.childNodes[i_1], space);
                                res = (0, common_1.AddToAsciiData)(res, {
                                    ascii: data.ascii,
                                    liner: data.liner,
                                    ascii_tsv: data.ascii_tsv,
                                    ascii_csv: data.ascii_csv,
                                    ascii_md: data.ascii_md,
                                    liner_tsv: data.liner_tsv,
                                });
                            }
                        }
                        var dataDivisor = this.visitNode(mclose, '');
                        res = (0, common_1.AddToAsciiData)(res, { ascii: "((", liner: "((" });
                        res = (0, common_1.AddToAsciiData)(res, {
                            ascii: dataDivisor.ascii,
                            liner: dataDivisor.liner,
                            ascii_tsv: dataDivisor.ascii_tsv,
                            ascii_csv: dataDivisor.ascii_csv,
                            ascii_md: dataDivisor.ascii_md,
                            liner_tsv: dataDivisor.liner_tsv,
                        });
                        res = (0, common_1.AddToAsciiData)(res, { ascii: ")/(", liner: ")/(" });
                        mnList.forEach(function (item) {
                            var dataDividend = _this.visitNode(item, '');
                            res = (0, common_1.AddToAsciiData)(res, {
                                ascii: dataDividend.ascii,
                                liner: dataDividend.liner,
                                ascii_tsv: dataDividend.ascii_tsv,
                                ascii_csv: dataDividend.ascii_csv,
                                ascii_md: dataDividend.ascii_md,
                                liner_tsv: dataDividend.liner_tsv,
                            });
                        });
                        res = (0, common_1.AddToAsciiData)(res, { ascii: "))", liner: "))" });
                        if (iclose < node.childNodes.length - 1) {
                            for (var i_2 = iclose + 1; i_2 < node.childNodes.length; i_2++) {
                                var data = this.visitNode(node.childNodes[i_2], space);
                                res = (0, common_1.AddToAsciiData)(res, {
                                    ascii: data.ascii,
                                    liner: data.liner,
                                    ascii_tsv: data.ascii_tsv,
                                    ascii_csv: data.ascii_csv,
                                    ascii_md: data.ascii_md,
                                    liner_tsv: data.liner_tsv,
                                });
                            }
                        }
                    }
                    return res;
                }
                /** \lcm */
                if (!isFrame && ((!atr.notation && atrDef.notation === "bottom")
                    || atr.notation.toString().indexOf("bottom") !== -1)) {
                    if (iclose === 0) {
                        var data = this.visitNode(mclose, '');
                        res = (0, common_1.AddToAsciiData)(res, { ascii: '(()/(', liner: '(()/(' });
                        res = (0, common_1.AddToAsciiData)(res, data);
                        res = (0, common_1.AddToAsciiData)(res, { ascii: '))', liner: '))' });
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
                                var data_1 = this.visitNode(node.childNodes[i_3], space);
                                res = (0, common_1.AddToAsciiData)(res, data_1);
                            }
                        }
                        res = (0, common_1.AddToAsciiData)(res, { ascii: '((', liner: '((' });
                        mnList.forEach(function (item) {
                            var data = _this.visitNode(item, '');
                            res = (0, common_1.AddToAsciiData)(res, data);
                        });
                        res = (0, common_1.AddToAsciiData)(res, { ascii: ')/(', liner: ')/(' });
                        var data = this.visitNode(mclose, '');
                        res = (0, common_1.AddToAsciiData)(res, data);
                        res = (0, common_1.AddToAsciiData)(res, { ascii: '))', liner: '))' });
                        if (iclose < node.childNodes.length - 1) {
                            for (var i_4 = iclose + 1; i_4 < node.childNodes.length; i_4++) {
                                var data_2 = this.visitNode(node.childNodes[i_4], space);
                                res = (0, common_1.AddToAsciiData)(res, data_2);
                            }
                        }
                    }
                    return res;
                }
            }
            var addParens = this.needsGrouping(node);
            var group = addParens ? this.needsGroupingStyle(node) : null;
            //TeXAtom
            var needBranch = node.parent && node.parent.kind === 'TeXAtom'
                && node.parent.Parent && node.parent.Parent.kind === 'mtd'
                && node.childNodes.length > 1;
            res = (0, common_1.AddToAsciiData)(res, {
                ascii: needBranch && hasFunc ? '{:' : '',
                liner: ''
            });
            if (addParens && !group) {
                res = (0, common_1.AddToAsciiData)(res, { ascii: '(', liner: '(' });
            }
            var beforeAscii = '';
            var beforeLiner = '';
            var childBefore = null;
            var parenthesisOpen = false;
            var parenthesisLinerOpen = false;
            for (var j = 0; j < node.childNodes.length; j++) {
                var child = node.childNodes[j];
                var data = this.visitNode(child, space);
                if (parenthesisOpen) {
                    var text = (0, common_1.getFunctionNameFromAscii)(data.ascii, child);
                    if (!text || helperA_1.regExpIsFunction.test(text)) {
                        res = (0, common_1.AddToAsciiData)(res, { ascii: ')', liner: ')' });
                        parenthesisOpen = false;
                    }
                }
                if (parenthesisLinerOpen) {
                    res = (0, common_1.AddToAsciiData)(res, { ascii: '', liner: ')' });
                    parenthesisLinerOpen = false;
                }
                if ((child === null || child === void 0 ? void 0 : child.kind) === "mfrac") {
                    if (beforeAscii === null || beforeAscii === void 0 ? void 0 : beforeAscii.trim()) {
                        var isFunction = childBefore.attributes.get('isFunction');
                        if (isFunction
                            || helperA_1.regExpIsFunction.test(beforeAscii.trim())
                            || ((childBefore === null || childBefore === void 0 ? void 0 : childBefore.kind) === 'mo' && (childBefore === null || childBefore === void 0 ? void 0 : childBefore.texClass) === -1)) {
                            res = (0, common_1.AddToAsciiData)(res, { ascii: '(', liner: '(' });
                            parenthesisOpen = true;
                            if ((0, helperLiner_1.needBrackets)(this, child, true)) {
                                res = (0, common_1.AddToAsciiData)(res, { ascii: '', liner: '(' });
                                parenthesisLinerOpen = true;
                            }
                        }
                        else {
                            if ((0, helperLiner_1.needsParensForFollowingDivision)(beforeLiner) || (0, helperLiner_1.needBrackets)(this, child)) {
                                res = (0, common_1.AddToAsciiData)(res, { ascii: '', liner: '(' });
                                parenthesisLinerOpen = true;
                            }
                        }
                    }
                    else {
                        if ((0, helperLiner_1.needBrackets)(this, child)) {
                            res = (0, common_1.AddToAsciiData)(res, { ascii: '', liner: '(' });
                            parenthesisLinerOpen = true;
                        }
                    }
                }
                res = (0, common_1.AddToAsciiData)(res, data);
                beforeAscii = res.ascii;
                beforeLiner = res.liner;
                childBefore = child;
            }
            if (parenthesisOpen) {
                res = (0, common_1.AddToAsciiData)(res, { ascii: ')', liner: ')' });
            }
            if (parenthesisLinerOpen) {
                res = (0, common_1.AddToAsciiData)(res, { ascii: '', liner: ')' });
            }
            if (addParens && !group) {
                res = (0, common_1.AddToAsciiData)(res, { ascii: ')', liner: ')' });
            }
            res = (0, common_1.AddToAsciiData)(res, {
                ascii: needBranch && hasFunc ? ':}' : '',
                liner: ''
            });
            return res;
        }
        catch (e) {
            return res;
        }
    };
    SerializedAsciiVisitor.prototype.visitTeXAtomNode = function (node, space) {
        var _a, _b, _c, _d, _e, _f;
        var res = (0, common_1.initAsciiData)();
        try {
            var children = this.childNodeMml(node, space + '  ', '\n');
            if ((0, handlers_1.needFirstSpaceBeforeTeXAtom)(node)) {
                res = (0, common_1.AddToAsciiData)(res, { ascii: ' ', liner: ' ' });
            }
            res = (0, common_1.AddToAsciiData)(res, {
                ascii: ((_a = children.ascii) === null || _a === void 0 ? void 0 : _a.match(/\S/)) ? children.ascii : '',
                liner: ((_b = children.liner) === null || _b === void 0 ? void 0 : _b.match(/\S/)) ? children.liner : '',
                ascii_tsv: ((_c = children.ascii_tsv) === null || _c === void 0 ? void 0 : _c.match(/\S/)) ? children.ascii_tsv : '',
                ascii_csv: ((_d = children.ascii_csv) === null || _d === void 0 ? void 0 : _d.match(/\S/)) ? children.ascii_csv : '',
                ascii_md: ((_e = children.ascii_md) === null || _e === void 0 ? void 0 : _e.match(/\S/)) ? children.ascii_md : '',
                liner_tsv: ((_f = children.liner_tsv) === null || _f === void 0 ? void 0 : _f.match(/\S/)) ? children.liner_tsv : '',
            });
            if ((0, handlers_1.needLastSpaceAfterTeXAtom)(node)) {
                res = (0, common_1.AddToAsciiData)(res, { ascii: ' ', liner: ' ' });
            }
            return res;
        }
        catch (e) {
            console.error('mml => visitTeXAtomNode =>', e);
            return res;
        }
    };
    SerializedAsciiVisitor.prototype.visitAnnotationNode = function (node, space) {
        var res = (0, common_1.initAsciiData)();
        try {
            var data = this.childNodeMml(node, '', '');
            res = (0, common_1.AddToAsciiData)(res, {
                ascii: space + '<annotation' + this.getAttributes(node) + '>' + data.ascii + '</annotation>',
                liner: space + '<annotation' + this.getAttributes(node) + '>' + data.ascii + '</annotation>',
                ascii_tsv: space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_tsv + '</annotation>',
                ascii_csv: space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_csv + '</annotation>',
                ascii_md: space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_md + '</annotation>',
                liner_tsv: space + '<annotation' + this.getAttributes(node) + '>' + data.liner_tsv + '</annotation>',
            });
            return res;
        }
        catch (e) {
            console.error('mml => visitAnnotationNode =>', e);
            return res;
        }
    };
    SerializedAsciiVisitor.prototype.visitDefault = function (node, space) {
        return this.childNodeMml(node, '  ', '');
    };
    SerializedAsciiVisitor.prototype.childNodeMml = function (node, space, nl) {
        var handleCh = handlers_1.handle.bind(this);
        var res = (0, common_1.initAsciiData)();
        try {
            if (node.kind === 'mover' && node.childNodes.length > 1 && node.childNodes[0].kind === 'TeXAtom' && node.childNodes[1].kind === 'TeXAtom') {
                var firstChild = node.childNodes[0];
                firstChild.properties.needBrackets = true;
                var dataFirstChild = handleCh(firstChild, this);
                var dataChildNodes = handleCh(node.childNodes[1], this);
                res = (0, common_1.AddToAsciiData)(res, dataFirstChild);
                res = (0, common_1.AddToAsciiData)(res, { ascii: '^', liner: '^' });
                res = (0, common_1.AddToAsciiData)(res, { ascii: '(', liner: '(' });
                res = (0, common_1.AddToAsciiData)(res, dataChildNodes);
                res = (0, common_1.AddToAsciiData)(res, { ascii: ')', liner: ')' });
            }
            else {
                var data = handleCh(node, this);
                res = (0, common_1.AddToAsciiData)(res, data);
            }
            return res;
        }
        catch (e) {
            return res;
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedAsciiVisitor = void 0;
var tslib_1 = require("tslib");
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var handlers_1 = require("./handlers");
var common_1 = require("./common");
var SerializedAsciiVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SerializedAsciiVisitor, _super);
    function SerializedAsciiVisitor(options) {
        var _this = _super.call(this) || this;
        _this.options = null;
        _this.isSerializeChildStack = false;
        _this.serializedStack = [];
        _this.serializedChildStack = [];
        _this.notApplyToSerializedStack = false;
        /** Apply inherited attribute to all children */
        _this.setChildInheritedAttribute = function (node, attrName) {
            var e_1, _a;
            try {
                var inherited = node.attributes.getAllInherited();
                if (!inherited.hasOwnProperty(attrName) || !node.childNodes || !node.childNodes.length) {
                    return;
                }
                try {
                    for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        if (child.attributes) {
                            child.attributes.setInherited(attrName, inherited[attrName]);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (e) {
                console.log("[MMD]=>error=>", e);
            }
        };
        _this.options = options;
        _this.isSerializeChildStack = false;
        _this.serializedStack = [];
        _this.serializedChildStack = [];
        _this.notApplyToSerializedStack = false;
        return _this;
    }
    SerializedAsciiVisitor.prototype.visitTree = function (node) {
        var res = this.visitNode(node, '');
        (0, common_1.pushToSerializedStack)(this, tslib_1.__assign({}, res), node);
        return res;
    };
    SerializedAsciiVisitor.prototype.visitNode = function (node) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.setChildInheritedAttribute(node, 'toTsv');
        this.setChildInheritedAttribute(node, 'toCsv');
        this.setChildInheritedAttribute(node, 'toMd');
        /** return super.visitNode(node, ...args); */
        var handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
        var res = handler.call.apply(handler, tslib_1.__spreadArray([this, node], tslib_1.__read(args), false));
        if (res === null || res === void 0 ? void 0 : res.ascii) {
            (0, common_1.pushToSerializedStack)(this, tslib_1.__assign({}, res), node);
        }
        node.serialized = tslib_1.__assign({}, res);
        return res;
    };
    SerializedAsciiVisitor.prototype.visitTextNode = function (node, space) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            res = (0, common_1.AddToAsciiData)(res, [node.getText()], this);
            return res;
        }
        catch (e) {
            console.error('mml => visitTextNode =>', e);
            return res;
        }
    };
    SerializedAsciiVisitor.prototype.visitXMLNode = function (node, space) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            res = (0, common_1.AddToAsciiData)(res, [space + node.getSerializedXML()], this);
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
        var e_2, _a;
        var _this = this;
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            var iclose = node.childNodes.findIndex(function (child) { return child.kind === 'menclose'; });
            var hasFunc = node.childNodes.find(function (child) { return (child.kind === 'msub'); });
            if (iclose > -1) {
                var mclose = node.childNodes[iclose];
                var atr = this.getAttributes(mclose);
                var isFrame = mclose.attributes.get('isFrame');
                var atrDef = this.getAttributesDefaults(mclose);
                /** \longdiv */
                if ((!atr.notation && atrDef.notation === "longdiv") ||
                    atr.notation.toString().indexOf("longdiv") !== -1) {
                    if (iclose === 0) {
                        var data = this.visitNode(mclose, '');
                        res = (0, common_1.AddToAsciiData)(res, [
                            "((".concat(data.ascii, ")/())"),
                            "((".concat(data.ascii_tsv, ")/())"),
                            "((".concat(data.ascii_csv, ")/())"),
                            "((".concat(data.ascii_md, ")/())"),
                        ], this);
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
                                res = (0, common_1.AddToAsciiData)(res, [
                                    data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md
                                ], this);
                            }
                        }
                        var dataDivisor = this.visitNode(mclose, '');
                        res = (0, common_1.AddToAsciiData)(res, ["(("], this);
                        res = (0, common_1.AddToAsciiData)(res, [dataDivisor.ascii, dataDivisor.ascii_tsv, dataDivisor.ascii_csv, dataDivisor.ascii_md], this);
                        res = (0, common_1.AddToAsciiData)(res, [")/("], this);
                        mnList.forEach(function (item) {
                            var dataDividend = _this.visitNode(item, '');
                            res = (0, common_1.AddToAsciiData)(res, [dataDividend.ascii, dataDividend.ascii_tsv, dataDividend.ascii_csv, dataDividend.ascii_md], _this);
                        });
                        res = (0, common_1.AddToAsciiData)(res, ["))"], this);
                        if (iclose < node.childNodes.length - 1) {
                            for (var i_2 = iclose + 1; i_2 < node.childNodes.length; i_2++) {
                                var data = this.visitNode(node.childNodes[i_2], space);
                                res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md], this);
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
                        res = (0, common_1.AddToAsciiData)(res, ['(()/('], this);
                        res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md], this);
                        res = (0, common_1.AddToAsciiData)(res, ['))'], this);
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
                                res = (0, common_1.AddToAsciiData)(res, [data_1.ascii, data_1.ascii_tsv, data_1.ascii_csv, data_1.ascii_md], this);
                            }
                        }
                        res = (0, common_1.AddToAsciiData)(res, ['(('], this);
                        mnList.forEach(function (item) {
                            var data = _this.visitNode(item, '');
                            res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md], _this);
                        });
                        res = (0, common_1.AddToAsciiData)(res, [')/('], this);
                        var data = this.visitNode(mclose, '');
                        res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md], this);
                        res = (0, common_1.AddToAsciiData)(res, ['))'], this);
                        if (iclose < node.childNodes.length - 1) {
                            for (var i_4 = iclose + 1; i_4 < node.childNodes.length; i_4++) {
                                var data_2 = this.visitNode(node.childNodes[i_4], space);
                                res = (0, common_1.AddToAsciiData)(res, [data_2.ascii, data_2.ascii_tsv, data_2.ascii_csv, data_2.ascii_md], this);
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
            res = (0, common_1.AddToAsciiData)(res, [needBranch && hasFunc ? '{:' : ''], this);
            if (addParens && !group) {
                res = (0, common_1.AddToAsciiData)(res, ['('], this);
            }
            try {
                for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    var data = this.visitNode(child, space);
                    res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md], this);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (addParens && !group) {
                res = (0, common_1.AddToAsciiData)(res, [')'], this);
            }
            res = (0, common_1.AddToAsciiData)(res, [needBranch && hasFunc ? ':}' : ''], this);
            return res;
        }
        catch (e) {
            return res;
        }
    };
    SerializedAsciiVisitor.prototype.visitTeXAtomNode = function (node, space) {
        var _a, _b, _c, _d, _e;
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: '',
        };
        try {
            var needFirstSpace = (0, common_1.needFirstSpaceBeforeCurrentNode)(node, this);
            var children = this.childNodeMml(node, space + '  ', '\n');
            if (needFirstSpace) {
                needFirstSpace = ((_a = children.ascii) === null || _a === void 0 ? void 0 : _a.length) && common_1.regLetter.test(children.ascii[0]);
            }
            res = (0, common_1.AddToAsciiData)(res, [needFirstSpace ? ' ' : ''], this);
            res = (0, common_1.AddToAsciiData)(res, [
                ((_b = children.ascii) === null || _b === void 0 ? void 0 : _b.match(/\S/)) ? children.ascii : '',
                ((_c = children.ascii_tsv) === null || _c === void 0 ? void 0 : _c.match(/\S/)) ? children.ascii_tsv : '',
                ((_d = children.ascii_csv) === null || _d === void 0 ? void 0 : _d.match(/\S/)) ? children.ascii_csv : '',
                ((_e = children.ascii_md) === null || _e === void 0 ? void 0 : _e.match(/\S/)) ? children.ascii_md : '',
            ], this, node);
            return res;
        }
        catch (e) {
            console.error('mml => visitTeXAtomNode =>', e);
            return res;
        }
    };
    SerializedAsciiVisitor.prototype.visitAnnotationNode = function (node, space) {
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: '',
        };
        try {
            var data = this.childNodeMml(node, '', '');
            res = (0, common_1.AddToAsciiData)(res, [
                space + '<annotation' + this.getAttributes(node) + '>' + data.ascii + '</annotation>',
                space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_tsv + '</annotation>',
                space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_csv + '</annotation>',
                space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_md + '</annotation>',
            ], this, node);
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
        var res = {
            ascii: '',
            ascii_tsv: '',
            ascii_csv: '',
            ascii_md: ''
        };
        try {
            if (node.kind === 'mover' && node.childNodes.length > 1 && node.childNodes[0].kind === 'TeXAtom' && node.childNodes[1].kind === 'TeXAtom') {
                var firstChild = node.childNodes[0];
                var secondChild = node.childNodes[1];
                firstChild.properties.needBrackets = true;
                var dataFirstChild = handleCh(firstChild, this);
                var dataChildNodes = handleCh(secondChild, this);
                res = (0, common_1.AddToAsciiData)(res, [dataFirstChild.ascii, dataFirstChild.ascii_tsv, dataFirstChild.ascii_csv, dataFirstChild.ascii_md], this, firstChild);
                res = (0, common_1.AddToAsciiData)(res, ['^'], this);
                res = (0, common_1.AddToAsciiData)(res, ['('], this);
                res = (0, common_1.AddToAsciiData)(res, [dataChildNodes.ascii, dataChildNodes.ascii_tsv, dataChildNodes.ascii_csv, dataChildNodes.ascii_md], this, secondChild);
                res = (0, common_1.AddToAsciiData)(res, [')'], this);
            }
            else {
                var data = handleCh(node, this);
                res = (0, common_1.AddToAsciiData)(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md], this, node);
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
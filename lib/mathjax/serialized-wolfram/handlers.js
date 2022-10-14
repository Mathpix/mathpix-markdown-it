"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.getAttributes = exports.FindSymbolToAM = exports.FindSymbolReplace = exports.SymbolToAM = void 0;
var tslib_1 = require("tslib");
var helperA_1 = require("./helperA");
var regW = /^\w/;
var regNumber = /^\d+$/;
var isFirstChild = function (node) {
    return node.parent && node.parent.childNodes[0] && node.parent.childNodes[0] === node;
};
var isLastChild = function (node) {
    return node.parent && node.parent.childNodes && node.parent.childNodes[node.parent.childNodes.length - 1] === node;
};
var needFirstSpase = function (node) {
    try {
        if (isFirstChild(node)) {
            return false;
        }
        else {
            var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
            var prev = node.parent.childNodes[index - 1];
            if (prev.kind === 'mi' || prev.kind === 'mo') {
                var text = prev.childNodes[0] ? prev.childNodes[0].text : '';
                return regW.test(text[0]);
            }
            else {
                return false;
            }
        }
    }
    catch (e) {
        return false;
    }
};
var needLastSpase = function (node) {
    var haveSpace = false;
    try {
        if (node.parent.kind === "msubsup") {
            return false;
        }
        if (isLastChild(node)) {
            return false;
        }
        else {
            var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
            var next = node.parent.childNodes[index + 1];
            if (next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061' && !isLastChild(next)) {
                next = node.parent.childNodes[index + 2];
                haveSpace = true;
            }
            if (next.kind === 'mi' || next.kind === 'mo') {
                var text = next.childNodes[0] ? next.childNodes[0].text : '';
                if (next.childNodes[0] && next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061') {
                    return true;
                }
                var abs = exports.SymbolToAM(next.kind, text);
                return regW.test(abs);
            }
            else {
                if (next.kind === 'mrow') {
                    return false;
                }
                return haveSpace;
            }
        }
    }
    catch (e) {
        return haveSpace;
    }
};
exports.SymbolToAM = function (tag, output, atr, showStyle, isLogic, unicode) {
    var e_1, _a;
    if (atr === void 0) { atr = null; }
    if (showStyle === void 0) { showStyle = false; }
    if (isLogic === void 0) { isLogic = false; }
    if (unicode === void 0) { unicode = false; }
    var tags = null;
    var atrsNames = atr ? Object.getOwnPropertyNames(atr) : [];
    output = tag !== 'mtext' ? output.split(' ').join('') : output;
    if (showStyle && atr && atrsNames.length > 0) {
        var _loop_1 = function (atname, atval) {
            tags = helperA_1.AMsymbols.find(function (item) { return (item.tag === "mstyle" && item.atname === atname && item.atval === atval); });
            if (tags) {
                return "break";
            }
        };
        try {
            for (var _b = tslib_1.__values(Object.entries(atr)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), atname = _d[0], atval = _d[1];
                var state_1 = _loop_1(atname, atval);
                if (state_1 === "break")
                    break;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (tags && tags.input) {
            return tags.input + '(' + output + ')';
        }
    }
    if (!tags) {
        tags = helperA_1.AMsymbols.find(function (item) {
            if (tag === 'mo' || tag === 'mi') {
                return (item.tag === 'mo' || item.tag === 'mi') && item.output === output;
            }
            else {
                return item.tag === tag && item.output === output;
            }
        });
    }
    //need split
    if (!tags && atr && atrsNames.length > 0 && Object.getOwnPropertyNames(atr) && atr.stretchy === false) {
        var sp_1 = output.split('');
        var res = '';
        var _loop_2 = function (i) {
            var tags_1 = helperA_1.AMsymbols.find(function (item) {
                if (tag === 'mo' || tag === 'mi') {
                    return (item.tag === 'mo' || item.tag === 'mi') && item.output === sp_1[i];
                }
                else {
                    return item.tag === tag && item.output === sp_1[i];
                }
            });
            res += i > 0 ? ' ' : '';
            res += tags_1 && tags_1.input ? tags_1.input : sp_1[i];
        };
        for (var i = 0; i < sp_1.length; i++) {
            _loop_2(i);
        }
        return res;
    }
    return isLogic && (tags === null || tags === void 0 ? void 0 : tags.text)
        ? tags === null || tags === void 0 ? void 0 : tags.text : unicode && (tags === null || tags === void 0 ? void 0 : tags.symbol) ? tags === null || tags === void 0 ? void 0 : tags.symbol : (tags === null || tags === void 0 ? void 0 : tags.input) ? tags.input : output;
};
exports.FindSymbolReplace = function (str) {
    return str.replace(/\u00A0/g, ' ');
};
exports.FindSymbolToAM = function (tag, output, atr) {
    if (atr === void 0) { atr = null; }
    output = output.split(' ').join('');
    var tags = null;
    if (atr && atr.stretchy) {
        tags = helperA_1.AMsymbols.find(function (item) {
            if (tag === 'mo' || tag === 'mi') {
                return (item.tag === 'mo' || item.tag === 'mi') && item.output === output && item.stretchy;
            }
            else {
                return item.tag === tag && item.output === output && item.stretchy;
            }
        });
    }
    if (!tags) {
        tags = helperA_1.AMsymbols.find(function (item) {
            if (tag === 'mo' || tag === 'mi') {
                return (item.tag === 'mo' || item.tag === 'mi') && item.output === output;
            }
            else {
                return item.tag === tag && item.output === output;
            }
        });
    }
    return tags ? tags.input : '';
};
var getChilrenText = function (node) {
    var text = '';
    try {
        node.childNodes.forEach(function (child) {
            text += child.text;
        });
        return text;
    }
    catch (e) {
        return text;
    }
};
var defHandle = function (node, serialize) {
    return handlerApi.handleAll(node, serialize);
};
exports.getAttributes = function (node) {
    return node.attributes.getAllAttributes();
};
var menclose = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        try {
            var atr = exports.getAttributes(node);
            var isLeft = false;
            var isRight = false;
            var isBottom = false;
            if (atr && atr.notation) {
                isLeft = atr.notation.toString().indexOf('left') > -1;
                isRight = atr.notation.toString().indexOf('right') > -1;
                isBottom = atr.notation.toString().indexOf('bottom') > -1;
            }
            mml += isLeft ? '[' : '';
            mml += handlerApi.handleAll(node, serialize);
            if (atr && atr.lcm) {
                mml += '';
            }
            else {
                mml += isBottom ? ',[hline]' : '';
            }
            mml += isRight ? ']' : '';
            return mml;
        }
        catch (e) {
            console.error('mml => menclose =>', e);
            return mml;
        }
    };
};
var mtable = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var parentIsMenclose = node.Parent && node.Parent.kind === 'menclose';
            var isHasBranchOpen = node.parent && node.parent.kind === 'mrow'
                && node.parent.properties
                && node.parent.properties.hasOwnProperty('open');
            var isHasBranchClose = node.parent && node.parent.kind === 'mrow'
                && node.parent.properties
                && node.parent.properties.hasOwnProperty('close');
            mml += isHasBranchOpen || parentIsMenclose
                ? ''
                : '{';
            // : '{:';
            for (var i = 0; i < node.childNodes.length; i++) {
                if (i > 0) {
                    mml += ',';
                }
                mml += serialize.visitNode(node.childNodes[i], '');
            }
            mml += isHasBranchClose || parentIsMenclose
                ? ''
                : '}';
            return mml;
        }
        catch (e) {
            console.error('mml => mtable =>', e);
            return mml;
        }
    };
};
var mrow = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var isTexClass7 = node.properties && node.properties.texClass === 7
                && node.parent && node.parent.kind === 'inferredMrow';
            var needBranchOpen = node.properties
                && node.properties.hasOwnProperty('open') && node.properties.open === '';
            var needBranchClose = node.properties
                && node.properties.hasOwnProperty('close') && node.properties.close === '';
            mml += isTexClass7 && needBranchOpen
                ? '{:'
                : '';
            for (var i = 0; i < node.childNodes.length; i++) {
                mml += serialize.visitNode(node.childNodes[i], '');
            }
            mml += isTexClass7 && needBranchClose
                ? ':}' : '';
            if (isTexClass7 && (needBranchClose || needBranchOpen)) {
            }
            return mml;
        }
        catch (e) {
            console.error('mml => mrow =>', e);
            return mml;
        }
    };
};
var mtr = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var needBranch = node.parent && node.parent.parent && node.parent.parent.texClass === 7;
            var display = node.attributes.get('displaystyle');
            var mtrContent = '';
            for (var i = 0; i < node.childNodes.length; i++) {
                if (i > 0) {
                    mtrContent += display
                        ? ''
                        : ',';
                }
                mtrContent += serialize.visitNode(node.childNodes[i], '');
            }
            mml += node.parent.childNodes.length > 1 || needBranch || (node.childNodes.length > 1 && !display)
                ? '{' + mtrContent + '}'
                : mtrContent;
            return mml;
        }
        catch (e) {
            console.error('mml => mtr =>', e);
            return mml;
        }
    };
};
var mpadded = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        try {
            var mmlAdd = handlerApi.handleAll(node, serialize, mml);
            if (node.Parent && node.Parent.kind === "menclose") {
                var atr = exports.getAttributes(node.Parent);
                if (atr && atr.notation === 'bottom' && atr.lcm) {
                    if (!mmlAdd) {
                        return '';
                    }
                }
            }
            mml += '"';
            mml += mmlAdd;
            mml += '"';
            return mml;
        }
        catch (e) {
            console.error('mml => mpadded =>', e);
            return mml;
        }
    };
};
var mover = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : '';
            var secondChild = node.childNodes[1] ? node.childNodes[1] : '';
            if (secondChild && secondChild.kind === 'mo') {
                var t = serialize.visitNode(secondChild, '');
                var asc = exports.FindSymbolToAM('mover', t, exports.getAttributes(secondChild));
                if (asc) {
                    var countDot = (asc.match(/\./g) || []).length;
                    /** \dot x
                     * x'[t]
                     * dx/dt
                     * */
                    if (countDot > 0) {
                        mml += countDot === 1
                            ? "(d/dt)" : "(d^" + countDot + "/dt^" + countDot + ")";
                        mml += serialize.visitNode(firstChild, '');
                        return mml;
                    }
                    mml += ' ' + asc + '(';
                    mml += serialize.visitNode(firstChild, '').trim();
                    mml += ')';
                }
                else {
                    mml += serialize.visitNode(firstChild, '');
                    mml += '^';
                    mml += serialize.options.extraBrackets ? '(' : '';
                    mml += serialize.visitNode(secondChild, '');
                    mml += serialize.options.extraBrackets ? ')' : '';
                }
            }
            else {
                mml += handlerApi.handleAll(node, serialize);
            }
            return mml;
        }
        catch (e) {
            console.error('mml => mover =>', e);
            return mml;
        }
    };
};
var munder = function (handlerApi) {
    return function (node, serialize) {
        var _a;
        var mml = '';
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var sFirstChild = firstChild ? serialize.visitNode(firstChild, '') : '';
            var sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
            if ((sFirstChild === null || sFirstChild === void 0 ? void 0 : sFirstChild.trim()) === 'sum') {
                if ((secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === "mi" || ((_a = sSecondChild === null || sSecondChild === void 0 ? void 0 : sSecondChild.trim()) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                    mml += 'sum';
                    mml += '_(' + sSecondChild + '=1)';
                    mml += '^n ';
                    return mml;
                }
            }
            if (secondChild && secondChild.kind === 'mo') {
                var t = serialize.visitNode(secondChild, '');
                var asc = exports.FindSymbolToAM(node.kind, t);
                if (asc) {
                    mml += asc + '(';
                    mml += serialize.visitNode(firstChild, '');
                    mml += ')';
                }
                else {
                    mml += handlerApi.handleAll(node, serialize);
                }
            }
            else {
                mml += firstChild ? serialize.visitNode(firstChild, '') : '';
                mml += '_';
                mml += serialize.options.extraBrackets ? '(' : '';
                mml += secondChild ? serialize.visitNode(secondChild, '') : '';
                mml += serialize.options.extraBrackets ? ')' : '';
            }
            return mml;
        }
        catch (e) {
            console.error('mml => munder =>', e);
            return mml;
        }
    };
};
var munderover = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
            mml += firstChild ? serialize.visitNode(firstChild, '') : null;
            mml += '_';
            mml += serialize.options.extraBrackets ? '(' : '';
            mml += secondChild ? serialize.visitNode(secondChild, '') : null;
            mml += serialize.options.extraBrackets ? ')' : '';
            mml += '^';
            mml += serialize.options.extraBrackets ? '(' : '';
            mml += thirdChild ? serialize.visitNode(thirdChild, '') : null;
            mml += serialize.options.extraBrackets ? ')' : '';
            mml += ' ';
            return mml;
        }
        catch (e) {
            console.error('mml => munderover =>', e);
            return mml;
        }
    };
};
var msub = function () {
    return function (node, serialize) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var mml = '';
        var child = null;
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === "TeXAtom" && ((_a = firstChild === null || firstChild === void 0 ? void 0 : firstChild.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                if (((_b = firstChild === null || firstChild === void 0 ? void 0 : firstChild.childNodes[0]) === null || _b === void 0 ? void 0 : _b.kind) === "inferredMrow"
                    && ((_c = firstChild === null || firstChild === void 0 ? void 0 : firstChild.childNodes[0].childNodes) === null || _c === void 0 ? void 0 : _c.length) === 1) {
                    child = firstChild === null || firstChild === void 0 ? void 0 : firstChild.childNodes[0].childNodes[0];
                }
            }
            if ((child === null || child === void 0 ? void 0 : child.kind) === "mover") {
                var firstChild_ = child.childNodes[0] ? child.childNodes[0] : '';
                var secondChild_ = child.childNodes[1] ? child.childNodes[1] : '';
                var t = serialize.visitNode(secondChild_, '');
                var asc = exports.FindSymbolToAM('mover', t, exports.getAttributes(secondChild_));
                var countDot = (asc.match(/\./g) || []).length;
                if (countDot > 0) {
                    mml += countDot === 1 ? "(d" : "(d^" + countDot;
                    mml += "(";
                    mml += serialize.visitNode(firstChild_, '');
                    mml += '_';
                    mml += serialize.options.extraBrackets || (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === "mi" ? '(' : '';
                    mml += secondChild ? serialize.visitNode(secondChild, '') : '';
                    mml += serialize.options.extraBrackets || (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === "mi" ? ')' : '';
                    mml += ")";
                    mml += countDot === 1 ? "/dt)" : "/dt^" + countDot + ")";
                    return mml;
                }
            }
            var sFirstChild = firstChild ? serialize.visitNode(firstChild, '') : '';
            mml += sFirstChild;
            var sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
            mml += '_';
            if (sFirstChild === "lim" && sSecondChild.indexOf("rightarrow") !== -1) {
                sSecondChild = sSecondChild.replace(/rightarrow/g, 'to');
            }
            if ((sSecondChild === null || sSecondChild === void 0 ? void 0 : sSecondChild.trim()) && ((_d = node.parent) === null || _d === void 0 ? void 0 : _d.kind) !== "mfrac"
                && (((_e = sFirstChild === null || sFirstChild === void 0 ? void 0 : sFirstChild.trim()) === null || _e === void 0 ? void 0 : _e.length) === 1 || (sFirstChild === null || sFirstChild === void 0 ? void 0 : sFirstChild.trim()) === "lim" || (sFirstChild === null || sFirstChild === void 0 ? void 0 : sFirstChild.trim()) === "log")
                && (regNumber.test(sSecondChild) ||
                    (["i", "j"].includes(sSecondChild.trim())
                        && ((_f = sFirstChild === null || sFirstChild === void 0 ? void 0 : sFirstChild.trim()) === null || _f === void 0 ? void 0 : _f.length) === 1))) {
                mml += sSecondChild;
                mml += " ";
            }
            else {
                mml += serialize.options.extraBrackets || (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === "mi"
                    || ((_g = node.parent) === null || _g === void 0 ? void 0 : _g.kind) === "mfrac"
                    || ((secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === "TeXAtom" && regW.test(sSecondChild)) ? '(' : '';
                mml += sSecondChild;
                mml += serialize.options.extraBrackets || (secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === "mi"
                    || ((_h = node.parent) === null || _h === void 0 ? void 0 : _h.kind) === "mfrac"
                    || ((secondChild === null || secondChild === void 0 ? void 0 : secondChild.kind) === "TeXAtom" && regW.test(sSecondChild)) ? ')' : '';
            }
            return mml;
        }
        catch (e) {
            console.error('mml => msub =>', e);
            return mml;
        }
    };
};
var msup = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var sFirstChild = firstChild ? serialize.visitNode(firstChild, '') : '';
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
            if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === "mi" && !regW.test(sFirstChild)) {
                mml += "(";
                mml += serialize.visitNode(firstChild, '');
                mml += ")";
            }
            else {
                mml += sFirstChild;
            }
            /** u^{\prime} should be u' */
            var countPrime = (sSecondChild.match(/'/g)
                || sSecondChild.match(/\u2032/g)
                || []).length;
            if (countPrime > 0) {
                for (var i = 0; i < countPrime; i++) {
                    mml += "'";
                }
                mml += ' ';
                return mml;
            }
            switch (sSecondChild) {
                case "\u2218":
                    mml += " ";
                    mml += "\u00B0"; //degrees °
                    mml += " ";
                    break;
                case "prime":
                    mml += "'";
                    break;
                default:
                    mml += '^';
                    mml += serialize.options.extraBrackets ? '(' : '';
                    mml += sSecondChild;
                    mml += serialize.options.extraBrackets ? ')' : '';
            }
            mml += ' ';
            return mml;
        }
        catch (e) {
            console.error('mml => msup =>', e);
            return mml;
        }
    };
};
var msubsup = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var thirdChild = node.childNodes[2] ? node.childNodes[2] : null;
            if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.kind) === 'mo') {
                var sFirstChild = serialize.visitNode(firstChild, '');
                if ((sFirstChild === null || sFirstChild === void 0 ? void 0 : sFirstChild.trim()) === 'int') {
                    mml += sFirstChild === null || sFirstChild === void 0 ? void 0 : sFirstChild.trim();
                    mml += '_';
                    mml += secondChild ? serialize.visitNode(secondChild, '') : '';
                    mml += '^';
                    mml += thirdChild ? serialize.visitNode(thirdChild, '') : '';
                    mml += ' ';
                    return mml;
                }
            }
            var sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
            mml += firstChild ? serialize.visitNode(firstChild, '') : '';
            mml += '_';
            if ((sSecondChild === null || sSecondChild === void 0 ? void 0 : sSecondChild.trim()) && ["i", "j"].includes(sSecondChild.trim())) {
                mml += sSecondChild;
            }
            else {
                mml += '(';
                mml += secondChild ? serialize.visitNode(secondChild, '') : '';
                mml += ')';
            }
            mml += '^';
            mml += '(';
            mml += thirdChild ? serialize.visitNode(thirdChild, '') : '';
            mml += ')';
            return mml;
        }
        catch (e) {
            console.error('mml => msubsup =>', e);
            return mml;
        }
    };
};
//\sqrt{expression}
var msqrt = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            mml += 'sqrt';
            mml += serialize.visitNode(firstChild, '');
            return mml;
        }
        catch (e) {
            console.error('mml => msqrt =>', e);
            return mml;
        }
    };
};
/** For latex: \sqrt[n]{x} it should be x^(1/n)
 *  For latex: \sqrt[n+i]{x+y} it should be (x+y)^(1/(n+i))
 * */
var mroot = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
            if (sSecondChild === "2") {
                mml += 'sqrt';
                mml += '(';
                mml += firstChild ? serialize.visitNode(firstChild, '') : '';
                mml += ')';
                return mml;
            }
            mml += '(';
            mml += firstChild ? serialize.visitNode(firstChild, '') : '';
            mml += ')';
            mml += '^';
            mml += '(1/';
            if (secondChild && secondChild.kind === "mrow" && secondChild.childNodes.length > 1) {
                mml += '(';
                mml += sSecondChild;
                mml += ')';
            }
            else {
                mml += sSecondChild;
            }
            mml += ')';
            return mml;
        }
        catch (e) {
            console.error('mml => mroot =>', e);
            return mml;
        }
    };
};
var mfrac = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var firstChild = node.childNodes[0] ? node.childNodes[0] : null;
            var sFirstChild = firstChild ? serialize.visitNode(firstChild, '') : '';
            var secondChild = node.childNodes[1] ? node.childNodes[1] : null;
            var sSecondChild = secondChild ? serialize.visitNode(secondChild, '') : '';
            if ((firstChild && firstChild.kind === "mrow" && firstChild.childNodes.length > 1) || serialize.options.extraBrackets) {
                mml += '(';
                mml += sFirstChild.trim();
                mml += ')';
            }
            else {
                mml += sFirstChild.trim();
            }
            mml += '/';
            if ((secondChild && secondChild.kind === "mrow" && secondChild.childNodes.length > 1) || serialize.options.extraBrackets) {
                mml += '(';
                mml += sSecondChild.trim();
                mml += ')';
            }
            else {
                mml += sSecondChild.trim();
            }
            return mml;
        }
        catch (e) {
            console.error('mml => mfrac =>', e);
            return mml;
        }
    };
};
var mtext = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            if (!node.childNodes || node.childNodes.length === 0) {
                return mml;
            }
            var firstChild = node.childNodes[0];
            var value = exports.FindSymbolReplace(firstChild.text);
            var asc = exports.FindSymbolToAM(node.kind, value);
            if (asc) {
                mml += asc;
                return mml;
            }
            if (value[0] === '(') {
                mml += value;
            }
            else {
                if (!value || (value && !value.trim())) {
                    mml += '';
                }
                else {
                    mml += value;
                }
            }
            return mml;
        }
        catch (e) {
            console.error('mml => mtext =>', e);
            return mml;
        }
    };
};
var mi = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            if (!node.childNodes || node.childNodes.length === 0) {
                return mml;
            }
            var firstChild = node.childNodes[0];
            var value = firstChild.text;
            var atr = serialize.options.showStyle
                ? exports.getAttributes(node)
                : null;
            var abs = exports.SymbolToAM(node.kind, value, atr, false, serialize.isLogic, serialize.options.unicode);
            if (abs && abs.length > 1 && regW.test(abs[0])) {
                var sFunction = (abs === null || abs === void 0 ? void 0 : abs.trim()) ? helperA_1.getFunction(abs.trim()) : "";
                mml += needFirstSpase(node) ? ' ' : '';
                mml += abs;
                mml += needLastSpase(node) && !sFunction ? ' ' : '';
            }
            else {
                mml += abs;
            }
            return mml;
        }
        catch (e) {
            console.error('mml => mi =>', e);
            return mml;
        }
    };
};
//<mo> -- operator, fence, separator or accent
var mo = function () {
    return function (node, serialize) {
        var mml = '';
        try {
            var value = getChilrenText(node);
            if (value === '\u2061') {
                return mml;
            }
            var atr = exports.getAttributes(node);
            var abs = exports.SymbolToAM(node.kind, value, atr, serialize.options.showStyle, serialize.isLogic, serialize.options.unicode);
            if (abs && abs.length > 1) {
                mml += regW.test(abs[0]) && needFirstSpase(node) ? ' ' : '';
                mml += abs;
                mml += regW.test(abs[abs.length - 1]) && needLastSpase(node) ? ' ' : '';
            }
            else {
                if (abs === ',' && node.Parent.kind === 'mtd') {
                    mml += '"' + abs + '"';
                }
                else {
                    mml += abs;
                }
            }
            if (node.Parent && node.Parent.kind === "mpadded" && node.Parent.Parent && node.Parent.Parent.kind === "menclose") {
                var atr_1 = exports.getAttributes(node.Parent.Parent);
                if (atr_1.notation && atr_1.notation.toString().indexOf("bottom") !== -1) {
                    node.Parent.Parent.attributes.attributes.lcm = true;
                    return '';
                }
            }
            if (abs === 'int') {
                mml += ' ';
            }
            return mml;
        }
        catch (e) {
            console.error('mml => mo =>', e);
            return mml;
        }
    };
};
var mspace = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        try {
            var atr = exports.getAttributes(node);
            if (atr && atr.width === "2em") {
                mml += ', ,';
                return mml;
            }
            if (atr && atr.width === "1em") {
                mml += ',';
                return mml;
            }
            mml += handlerApi.handleAll(node, serialize, mml);
            return mml;
        }
        catch (e) {
            console.error('mml => mspace =>', e);
            return mml;
        }
    };
};
exports.handle = function (node, serialize) {
    var handler = handlers[node.kind] || defHandle;
    return handler(node, serialize);
};
var handleAll = function (node, serialize, mml) {
    var e_2, _a;
    if (mml === void 0) { mml = ''; }
    try {
        for (var _b = tslib_1.__values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            mml += serialize.visitNode(child, '');
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return mml;
};
var handlerApi = {
    handle: exports.handle,
    handleAll: handleAll
};
var handlers = {
    mi: mi(),
    mo: mo(),
    mn: mo(),
    mfrac: mfrac(),
    msup: msup(),
    msub: msub(),
    msubsup: msubsup(),
    msqrt: msqrt(handlerApi),
    mover: mover(handlerApi),
    munder: munder(handlerApi),
    munderover: munderover(),
    mspace: mspace(handlerApi),
    mtext: mtext(),
    mtable: mtable(),
    mrow: mrow(),
    mtr: mtr(),
    mpadded: mpadded(handlerApi),
    mroot: mroot(),
    menclose: menclose(handlerApi),
};
//# sourceMappingURL=handlers.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helperA_1 = require("./helperA");
var regW = /^\w/;
var isFirstChild = function (node) {
    return node.parent.childNodes[0] === node;
};
var isLastChild = function (node) {
    return node.parent.childNodes[node.parent.childNodes.length - 1] === node;
};
var needFirstSpase = function (node) {
    if (isFirstChild(node)) {
        return false;
    }
    else {
        var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
        var prev = node.parent.childNodes[index - 1];
        if (prev.kind === 'mi' || prev.kind === 'mo') {
            var text = prev.childNodes[0].text;
            return regW.test(text[0]);
        }
        else {
            return false;
        }
    }
};
var needLastSpase = function (node) {
    var haveSpace = false;
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
            var text = next.childNodes[0].text;
            if (next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061') {
                return true;
            }
            var abs = exports.SymbolToAM(next.kind, text);
            return regW.test(abs);
        }
        else {
            return haveSpace;
        }
    }
};
exports.SymbolToAM = function (tag, output, atr, showStyle) {
    if (atr === void 0) { atr = null; }
    if (showStyle === void 0) { showStyle = false; }
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
        for (var _i = 0, _a = Object.entries(atr); _i < _a.length; _i++) {
            var _b = _a[_i], atname = _b[0], atval = _b[1];
            var state_1 = _loop_1(atname, atval);
            if (state_1 === "break")
                break;
        }
        if (tags && tags.input) {
            return tags.input + '(' + output + ')';
        }
    }
    if (!tags) {
        tags = helperA_1.AMsymbols.find(function (item) { return (item.tag === tag && item.output === output); });
    }
    //need split
    if (!tags && atr && atrsNames.length > 0 && Object.getOwnPropertyNames(atr) && atr.stretchy === false) {
        var sp_1 = output.split('');
        var res = '';
        var _loop_2 = function (i) {
            var tags_1 = helperA_1.AMsymbols.find(function (item) { return (item.tag === tag && item.output === sp_1[i]); });
            res += i > 0 ? ' ' : '';
            res += tags_1 && tags_1.input ? tags_1.input : sp_1[i];
        };
        for (var i = 0; i < sp_1.length; i++) {
            _loop_2(i);
        }
        return res;
    }
    return tags ? tags.input : output;
};
exports.FindSymbolToAM = function (tag, output, atr) {
    if (atr === void 0) { atr = null; }
    output = output.split(' ').join('');
    var tags = null;
    if (atr && atr.stretchy) {
        tags = helperA_1.AMsymbols.find(function (item) { return (item.tag === tag && item.output === output && item.stretchy); });
    }
    if (!tags) {
        tags = helperA_1.AMsymbols.find(function (item) { return (item.tag === tag && item.output === output); });
    }
    return tags ? tags.input : '';
};
var getChilrenText = function (node) {
    var text = '';
    node.childNodes.forEach(function (child) {
        text += child.text;
    });
    return text;
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
        mml += isBottom ? ',[hline]' : '';
        mml += isRight ? ']' : '';
        return mml;
    };
};
var mtable = function () {
    return function (node, serialize) {
        var mml = '';
        for (var i = 0; i < node.childNodes.length; i++) {
            if (i > 0) {
                mml += ',';
            }
            mml += serialize.visitNode(node.childNodes[i], '');
        }
        return mml;
    };
};
var mtr = function () {
    return function (node, serialize) {
        var mml = '';
        mml += node.parent.childNodes.length > 1 || serialize.options.extraBrackets ? '[' : '';
        for (var i = 0; i < node.childNodes.length; i++) {
            if (i > 0) {
                mml += ',';
            }
            mml += serialize.visitNode(node.childNodes[i], '');
        }
        mml += node.parent.childNodes.length > 1 || serialize.options.extraBrackets ? ']' : '';
        return mml;
    };
};
var mpadded = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        mml += '"';
        mml += handlerApi.handleAll(node, serialize, mml);
        mml += '"';
        return mml;
    };
};
var mover = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var secondChild = node.childNodes[1];
        if (secondChild.kind === 'mo') {
            var t = serialize.visitNode(secondChild, '');
            var asc = exports.FindSymbolToAM('mover', t, exports.getAttributes(secondChild));
            if (asc) {
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
    };
};
var munder = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var secondChild = node.childNodes[1];
        if (secondChild.kind === 'mo') {
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
            mml += serialize.visitNode(firstChild, '');
            mml += '_';
            mml += serialize.options.extraBrackets ? '(' : '';
            mml += serialize.visitNode(secondChild, '');
            mml += serialize.options.extraBrackets ? ')' : '';
        }
        return mml;
    };
};
var munderover = function () {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var secondChild = node.childNodes[1];
        var thirdChild = node.childNodes[2];
        mml += serialize.visitNode(firstChild, '');
        mml += '_';
        mml += serialize.options.extraBrackets ? '(' : '';
        mml += serialize.visitNode(secondChild, '');
        mml += serialize.options.extraBrackets ? ')' : '';
        mml += '^';
        mml += serialize.options.extraBrackets ? '(' : '';
        mml += serialize.visitNode(thirdChild, '');
        mml += serialize.options.extraBrackets ? ')' : '';
        return mml;
    };
};
var msub = function () {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var secondChild = node.childNodes[1];
        mml += serialize.visitNode(firstChild, '');
        mml += '_';
        mml += serialize.options.extraBrackets ? '(' : '';
        mml += serialize.visitNode(secondChild, '');
        mml += serialize.options.extraBrackets ? ')' : '';
        return mml;
    };
};
var msup = function () {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var secondChild = node.childNodes[1];
        mml += serialize.visitNode(firstChild, '');
        mml += '^';
        mml += serialize.options.extraBrackets ? '(' : '';
        mml += serialize.visitNode(secondChild, '');
        mml += serialize.options.extraBrackets ? ')' : '';
        return mml;
    };
};
var msubsup = function () {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var secondChild = node.childNodes[1];
        var thirdChild = node.childNodes[2];
        mml += serialize.visitNode(firstChild, '');
        mml += '_';
        mml += '(';
        mml += serialize.visitNode(secondChild, '');
        mml += ')';
        mml += '^';
        mml += '(';
        mml += serialize.visitNode(thirdChild, '');
        mml += ')';
        return mml;
    };
};
var msqrt = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        mml += 'sqrt(';
        mml += handlerApi.handleAll(node, serialize, mml);
        mml += ')';
        return mml;
    };
};
var mroot = function () {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var secondChild = node.childNodes[1];
        mml += 'root';
        mml += '(' + serialize.visitNode(firstChild, '') + ')';
        mml += '(' + serialize.visitNode(secondChild, '') + ')';
        return mml;
    };
};
var mfrac = function () {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var secondChild = node.childNodes[1];
        if ((firstChild.kind === "mrow" && firstChild.childNodes.length > 1) || serialize.options.extraBrackets) {
            mml += '(';
            mml += serialize.visitNode(firstChild, '');
            mml += ')';
        }
        else {
            mml += serialize.visitNode(firstChild, '');
        }
        mml += '/';
        if ((secondChild.kind === "mrow" && secondChild.childNodes.length > 1) || serialize.options.extraBrackets) {
            mml += '(';
            mml += serialize.visitNode(secondChild, '');
            mml += ')';
        }
        else {
            mml += serialize.visitNode(secondChild, '');
        }
        return mml;
    };
};
var mtext = function () {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var value = firstChild.text;
        var asc = exports.FindSymbolToAM(node.kind, value);
        if (asc) {
            mml += asc;
            return mml;
        }
        if (value[0] === '(') {
            mml += value;
        }
        else {
            mml += '"' + value + '"';
        }
        return mml;
    };
};
var mi = function () {
    return function (node, serialize) {
        var mml = '';
        var firstChild = node.childNodes[0];
        var value = firstChild.text;
        var atr = serialize.options.showStyle
            ? exports.getAttributes(node)
            : null;
        var abs = exports.SymbolToAM(node.kind, value, atr);
        if (abs.length > 1 && regW.test(abs[0])) {
            mml += needFirstSpase(node) ? ' ' : '';
            mml += abs;
            mml += needLastSpase(node) ? ' ' : '';
        }
        else {
            mml += abs;
        }
        return mml;
    };
};
var mo = function () {
    return function (node, serialize) {
        var mml = '';
        var value = getChilrenText(node);
        var atr = exports.getAttributes(node);
        if (atr && atr.hasOwnProperty('fence') && atr.fence) {
            mml += node.texClass === 4 ? '{:' : '';
            mml += node.texClass === 5 ? ':}' : '';
        }
        var abs = exports.SymbolToAM(node.kind, value, atr, serialize.options.showStyle);
        if (abs.length > 1) {
            mml += regW.test(abs[0]) && needFirstSpase(node) ? ' ' : '';
            mml += abs;
            mml += regW.test(abs[abs.length - 1]) && needLastSpase(node) ? ' ' : '';
        }
        else {
            mml += abs;
        }
        return mml;
    };
};
var mspace = function (handlerApi) {
    return function (node, serialize) {
        var mml = '';
        var atr = exports.getAttributes(node);
        if (atr && atr.width === "2em") {
            mml += 'qquad';
            return mml;
        }
        if (atr && atr.width === "1em") {
            mml += 'quad';
            return mml;
        }
        mml += handlerApi.handleAll(node, serialize, mml);
        return mml;
    };
};
exports.handle = function (node, serialize) {
    var handler = handlers[node.kind] || defHandle;
    return handler(node, serialize);
};
var handleAll = function (node, serialize, mml) {
    if (mml === void 0) { mml = ''; }
    for (var _i = 0, _a = node.childNodes; _i < _a.length; _i++) {
        var child = _a[_i];
        mml += serialize.visitNode(child, '');
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
    mtr: mtr(),
    mpadded: mpadded(handlerApi),
    mroot: mroot(),
    menclose: menclose(handlerApi),
};
//# sourceMappingURL=handlers.js.map
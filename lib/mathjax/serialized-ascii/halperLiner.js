"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWrappedWithParens = exports.needBrackets = exports.needsParensForFollowingDivision = exports.findRootSymbol = exports.findAmSymbolsToLiner = exports.rootSymbols = exports.amSymbolsToLiner = void 0;
var node_utils_1 = require("./node-utils");
var helperA_1 = require("./helperA");
var RE_NEED_PARENS_BEFORE_FRACTION = /([\p{L}\p{N}]|[)\]}]|[!′″‴%°])$/u;
var RE_NEED_PARENS_AFTER_FRACTION = /^([\p{L}\p{N}]|[\(\[\{]|[!′″‴%°])/u;
exports.amSymbolsToLiner = [
    { input: "\u005E", output: "\u0302" },
    { input: "\u007E", output: "\u0302" },
    { input: "~", output: "\u0303" },
    { input: "\u2192", output: "\u20D7" },
    { input: "―", output: "\u0304" }, //bar
];
exports.rootSymbols = [
    { val: 2, output: "\u221A" },
    { val: 3, output: "\u221B" },
    { val: 4, output: "\u221C" }, //∜
];
var findAmSymbolsToLiner = function (input) {
    var data = exports.amSymbolsToLiner.find(function (item) { return item.input === input; });
    return data ? data.output : '';
};
exports.findAmSymbolsToLiner = findAmSymbolsToLiner;
var findRootSymbol = function (val) {
    var data = exports.rootSymbols.find(function (item) { return item.val === val; });
    return data ? data.output : '';
};
exports.findRootSymbol = findRootSymbol;
var needsParensForFollowingDivision = function (s) {
    if (!s)
        return false;
    var last = Array.from(s.trimEnd()).pop(); // Unicode-безопасно
    if (!last)
        return false;
    return RE_NEED_PARENS_BEFORE_FRACTION.test(last);
};
exports.needsParensForFollowingDivision = needsParensForFollowingDivision;
var needBrackets = function (serialize, node, isFunction) {
    var _a, _b;
    if (isFunction === void 0) { isFunction = false; }
    var haveSpace = false;
    try {
        if ((0, node_utils_1.isLastChild)(node)) {
            return false;
        }
        var index = node.parent.childNodes.findIndex(function (item) { return item === node; });
        var nextNode = node.parent.childNodes[index + 1];
        var data = serialize.visitNode(nextNode, '');
        if (isFunction) {
            var isNextFunction = nextNode.attributes.get('isFunction');
            if (isNextFunction || helperA_1.regExpIsFunction.test(data.liner.trim())
                || ((nextNode === null || nextNode === void 0 ? void 0 : nextNode.kind) === 'mo' && (nextNode === null || nextNode === void 0 ? void 0 : nextNode.texClass) === -1)) {
                return false;
            }
        }
        if ((_a = data.liner) === null || _a === void 0 ? void 0 : _a.trim()) {
            var first = (_b = Array.from(data.liner.trimStart())[0]) !== null && _b !== void 0 ? _b : '';
            if (!first)
                return false;
            return RE_NEED_PARENS_AFTER_FRACTION.test(first);
        }
        return false;
    }
    catch (e) {
        return haveSpace;
    }
};
exports.needBrackets = needBrackets;
// The string is completely wrapped in outer ( ... ) and they are balanced
var isWrappedWithParens = function (s) {
    if (!s)
        return false;
    var t = s.trim();
    if (!(t.startsWith('(') && t.endsWith(')')))
        return false;
    // Let's check that the outer pair actually covers the entire string.
    var depth = 0;
    for (var i = 0; i < t.length; i++) {
        var ch = t[i];
        if (ch === '(')
            depth++;
        else if (ch === ')') {
            depth--;
            // if the depth becomes 0 before the end of the string, the outer pair does not cover everything
            if (depth === 0 && i !== t.length - 1)
                return false;
            if (depth < 0)
                return false;
        }
    }
    return depth === 0;
};
exports.isWrappedWithParens = isWrappedWithParens;
//# sourceMappingURL=halperLiner.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLinerFromAscii = exports.replaceUnicodeWhitespace = exports.hasAnyWhitespace = exports.isWrappedWithParens = exports.needBrackets = exports.needsParensForFollowingDivision = exports.findRootSymbol = exports.findAmSymbolsToLiner = exports.replaceScripts = exports.rootSymbols = exports.amSymbolsToLiner = void 0;
var tslib_1 = require("tslib");
var node_utils_1 = require("./node-utils");
var helperA_1 = require("./helperA");
var RE_NEED_PARENS_BEFORE_FRACTION = /([\p{L}\p{N}]|[)\]}]|[!′″‴%°])$/u;
var RE_NEED_PARENS_AFTER_FRACTION = /^([\p{L}\p{N}]|[\(\[\{]|[!′″‴%°])/u;
var RE_UNICODE_WHITESPACE = /\p{White_Space}/gu;
var RE_PLAIN_ROOT_DEGREE = /^\s*[234]\s*$/;
exports.amSymbolsToLiner = [
    { input: "hat", output: "\u0302", outputComplex: "ˆ" },
    { input: "widehat", output: "\u0302", outputComplex: "ˆ" },
    { input: "widetilde", output: "\u0303", outputComplex: " \u0303" },
    { input: "tilde", output: "\u0303", outputComplex: " \u0303" },
    { input: "vec", output: "\u20D7", outputComplex: " \u20D7" },
    { input: "bar", output: "\u0304", outputComplex: "\u00AF" },
    { input: "breve", output: "\u0306", outputComplex: " \u0306" },
    { input: "\u02d8", output: "\u0306", outputComplex: " \u0306" },
    { input: "‾", output: "\u0304", outputComplex: "\u00AF" },
    { input: "˙", output: "\u0307", outputComplex: " \u0307" },
    { input: "¨", output: "\u0308", outputComplex: " \u0308" },
    { input: "ˇ", output: "\u030C", outputComplex: " \u030C" },
    { input: "`", output: "\u0300", outputComplex: " \u0300" },
    { input: "´", output: "\u0301", outputComplex: " \u0301" },
    { input: "′", output: "′", outputComplex: "′" },
    { input: "′′", output: "′′", outputComplex: "′′" },
    { input: "\u2190", output: "\u20D6", outputComplex: " \u20D6" },
    { input: "harr", output: "\u20E1", outputComplex: " \u20E1", tag: 'mover' },
    { input: "↔", output: "\u20E1", outputComplex: " \u20E1", tag: 'mover' },
    { input: "⏞", output: "\u23DE", outputComplex: "\u23DE", isFirst: true },
    { input: "obrace", output: "\u23DE", outputComplex: "\u23DE", isFirst: true },
    { input: "\u23DF", output: "\u23DF", outputComplex: "\u23DF", isFirst: true },
    { input: "ubrace", output: "\u23DF", outputComplex: "\u23DF", isFirst: true },
    { input: "ul", output: "\u0332", outputComplex: "\u0332", isFirst: true },
    { input: "―", output: "▁", outputComplex: "▁", isFirst: true },
    { input: "\u2218", output: "\u00B0", outputComplex: "\u00B0", tag: 'msup' },
    { input: "˚", output: "\u030A", outputComplex: "\u030A", tag: 'mover' },
    { input: "\u20DB", output: "\u20DB", outputComplex: "\u20DB", tag: 'mover' }, //dddot //combining three dots above (U+20DB)
];
exports.rootSymbols = [
    { val: 2, output: "\u221A" },
    { val: 3, output: "\u221B" },
    { val: 4, output: "\u221C" }, //∜
];
var SUPER = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "−": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
    "i": "ⁱ", "n": "ⁿ", "a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "d": "ᵈ", "e": "ᵉ", "f": "ᶠ", "g": "ᵍ", "h": "ʰ",
    "j": "ʲ", "k": "ᵏ", "l": "ˡ", "m": "ᵐ", "o": "ᵒ", "p": "ᵖ", "r": "ʳ", "s": "ˢ", "t": "ᵗ", "u": "ᵘ",
    "v": "ᵛ", "w": "ʷ", "x": "ˣ", "y": "ʸ", "z": "ᶻ", "A": "ᴬ", "B": "ᴮ", "D": "ᴰ", "E": "ᴱ", "G": "ᴳ",
    "H": "ᴴ", "I": "ᴵ", "J": "ᴶ", "K": "ᴷ", "L": "ᴸ", "M": "ᴹ", "N": "ᴺ", "O": "ᴼ", "P": "ᴾ", "R": "ᴿ",
    "T": "ᵀ", "U": "ᵁ", "V": "ⱽ", "W": "ᵂ",
    "′": "′",
    " ": " "
};
var SUB = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "−": "₋", "=": "₌", "(": "₍", ")": "₎",
    "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ",
    "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ",
    " ": " "
};
var mapSeq = function (seq, table) {
    var e_1, _a;
    var out = "";
    try {
        for (var seq_1 = tslib_1.__values(seq), seq_1_1 = seq_1.next(); !seq_1_1.done; seq_1_1 = seq_1.next()) {
            var ch = seq_1_1.value;
            var mapped = table[ch];
            if (!mapped)
                return { ok: false, out: "" };
            out += mapped;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (seq_1_1 && !seq_1_1.done && (_a = seq_1.return)) _a.call(seq_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { ok: true, out: out };
};
var replaceScripts = function (text, type) {
    if (type === void 0) { type = 'sup'; }
    if (!text)
        return '';
    text = text.trim();
    if (!text)
        return '';
    var m = type === 'sup'
        ? mapSeq(text, SUPER)
        : mapSeq(text, SUB);
    if (m.ok && m.out)
        return m.out;
    return '';
};
exports.replaceScripts = replaceScripts;
var findAmSymbolsToLiner = function (input, tag) {
    if (tag === void 0) { tag = ''; }
    var linerData = null;
    if (tag) {
        linerData = exports.amSymbolsToLiner.find(function (item) { return item.tag === tag && item.input === input; });
        if (linerData) {
            return linerData;
        }
    }
    return exports.amSymbolsToLiner.find(function (item) { return item.input === input; });
};
exports.findAmSymbolsToLiner = findAmSymbolsToLiner;
var findRootSymbol = function (str) {
    if (!str)
        return '';
    if (RE_PLAIN_ROOT_DEGREE.test(str)) {
        var val_1 = Number(str);
        var data = exports.rootSymbols.find(function (item) { return item.val === val_1; });
        return data ? data.output : '';
    }
    var sup = (0, exports.replaceScripts)(str);
    if (!sup)
        return '';
    return ' ' + sup + exports.rootSymbols[0].output;
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
var hasAnyWhitespace = function (str) {
    return str
        .replace(RE_UNICODE_WHITESPACE, '')
        .length !== str.length;
};
exports.hasAnyWhitespace = hasAnyWhitespace;
var replaceUnicodeWhitespace = function (str) {
    return str.replace(RE_UNICODE_WHITESPACE, ' ');
};
exports.replaceUnicodeWhitespace = replaceUnicodeWhitespace;
var formatLinerFromAscii = function (ascii, childLiner, tag) {
    if (tag === void 0) { tag = ''; }
    var linerData = (0, exports.findAmSymbolsToLiner)(ascii, tag);
    if (!linerData)
        return '';
    var child = (childLiner !== null && childLiner !== void 0 ? childLiner : '').trim();
    var childWrapped = child.length > 1 ? "(".concat(child, ")") : child;
    if (linerData.isFirst) {
        return linerData.output + childWrapped;
    }
    else {
        return childWrapped + (child.length > 1 ? linerData.outputComplex : linerData.output);
    }
};
exports.formatLinerFromAscii = formatLinerFromAscii;
//# sourceMappingURL=helperLiner.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arraysCompare = exports.includesMultiMathTag = exports.includesMultiMathBeginTag = exports.includesSimpleMathTag = exports.isNotBackticked = exports.getTextWidth = exports.endTag = void 0;
exports.endTag = function (arg) {
    return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}');
};
exports.getTextWidth = function () {
    var el_container = document ? document.getElementById('container-ruller') : null;
    return el_container ? el_container.offsetWidth : 800;
};
exports.isNotBackticked = function (str, tag) {
    var pos = 0, max = str.length, ch, escapes = 0, backTicked = false, lastBackTick = 0;
    ch = str.charCodeAt(pos);
    var st = '';
    var st2 = '';
    var isIgnore = false;
    while (pos < max) {
        if (ch === 0x60 /* ` */) {
            if (backTicked) {
                backTicked = false;
                lastBackTick = pos;
                if (st.includes(tag)) {
                    isIgnore = true;
                    st = '';
                }
            }
            else if (escapes % 2 === 0) {
                backTicked = true;
                lastBackTick = pos;
            }
        }
        else {
            if (backTicked) {
                // isIgnore = false;
                st += str[pos];
            }
            else {
                st2 += str[pos];
            }
        }
        if (ch === 0x5c /* \ */
            && (pos + 1 < max && str.charCodeAt(pos + 1) === 0x60)) {
            escapes++;
        }
        else {
            escapes = 0;
        }
        pos++;
        // If there was an un-closed backtick, go back to just after
        // the last backtick, but as if it was a normal character
        if (pos === max && backTicked) {
            backTicked = false;
            pos = lastBackTick + 1;
        }
        ch = str.charCodeAt(pos);
    }
    return !isIgnore || st2.includes(tag);
};
exports.includesSimpleMathTag = function (str, tag) {
    if (tag === void 0) { tag = '$$'; }
    return str.includes(tag) && exports.isNotBackticked(str, tag);
};
exports.includesMultiMathBeginTag = function (str, tag) {
    var result = null;
    if (!tag.test(str)) {
        return result;
    }
    var match;
    for (var i = 0; i < str.length; i++) {
        result = null;
        var str1 = i < str.length ? str.slice(i) : '';
        match = str1 ? str1.match(tag) : null;
        if (!match) {
            break;
        }
        if (exports.isNotBackticked(str, match[0])) {
            result = null;
            if (match[0] === "\\[" || match[0] === "\[") {
                result = /\\\]/;
            }
            else if (match[0] === "\\(" || match[0] === "\(") {
                result = /\\\)/;
            }
            else if (match[1]) {
                result = new RegExp("end{" + match[1] + "}");
            }
            break;
        }
        else {
            i += match.index + match[0].length - 1;
        }
    }
    return result;
};
exports.includesMultiMathTag = function (str, tag) {
    var result = false;
    if (!tag.test(str)) {
        return result;
    }
    var match;
    for (var i = 0; i < str.length; i++) {
        result = false;
        var str1 = i < str.length ? str.slice(i) : '';
        match = str1 ? str1.match(tag) : null;
        if (!match) {
            break;
        }
        if (exports.isNotBackticked(str, match[0])) {
            result = true;
            break;
        }
        else {
            i += match.index + match[0].length;
        }
    }
    return result;
};
exports.arraysCompare = function (a1, a2) {
    return a1.length == a2.length && a1.every(function (v, i) { return v === a2[i]; });
};
//# sourceMappingURL=utils.js.map
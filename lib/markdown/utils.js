"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = exports.arrayResortFromElement = exports.arrayDelElement = exports.arraysCompare = exports.includesMultiMathTag = exports.includesMultiMathBeginTag = exports.includesSimpleMathTag = exports.isNotBackticked = exports.getWidthFromDocument = exports.getTextWidth = exports.endTag = void 0;
var tslib_1 = require("tslib");
exports.endTag = function (arg) {
    return new RegExp('\\\\end\s{0,}\{(' + arg + ')\}');
};
exports.getTextWidth = function () {
    var el_container = document ? document.getElementById('container-ruller') : null;
    return el_container ? el_container.offsetWidth : 800;
};
exports.getWidthFromDocument = function (cwidth) {
    if (cwidth === void 0) { cwidth = 1200; }
    try {
        var el_container = document.getElementById('container-ruller');
        return el_container ? el_container.offsetWidth : 1200;
    }
    catch (e) {
        return cwidth;
    }
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
    if (a1.length < 2 || a2.length < 2) {
        return false;
    }
    if (a1.length == a2.length) {
        return a1.every(function (v, i) { return v === a2[i]; });
    }
    else {
        if (a1.length < a2.length) {
            return a1.filter(function (item) { return a2.indexOf(item) === -1; }).length === 0;
        }
        else {
            return a2.filter(function (item) { return a1.indexOf(item) === -1; }).length === 0;
            // return a2.every((v,i)=>v === a1[i])
        }
    }
    // return a1.length == a2.length && a1.every((v,i)=>v === a2[i])
};
exports.arrayDelElement = function (arr, el) {
    var index = arr.indexOf(el);
    if (index === -1) {
        return arr;
    }
    return arr.splice(index, 1);
};
exports.arrayResortFromElement = function (arr, el, notReverse, nextEl) {
    if (notReverse === void 0) { notReverse = false; }
    if (nextEl === void 0) { nextEl = -1; }
    var index = arr.indexOf(el);
    var arrN1 = tslib_1.__spread(arr);
    var arrN2 = tslib_1.__spread(arr);
    if (index < arrN1.length - 1) {
        if (notReverse) {
            var arr1 = arrN1.splice(0, index);
            var arr2 = arrN2.splice(index + 1);
            if (nextEl !== -1) {
                if (arr1.indexOf(nextEl) !== -1) {
                    return [el].concat(arr1.reverse(), arr2.reverse());
                }
                if (arr2.indexOf(nextEl) !== -1) {
                    return [el].concat(arr2, arr1);
                }
            }
            return [el].concat(arr1.reverse(), arr2.reverse());
            // return [el].concat(arr2, arr1)
        }
        else {
            var arr1 = arrN1.splice(0, index);
            var arr2 = arrN2.splice(index + 1);
            return [el].concat(arr1.reverse(), arr2.reverse());
        }
    }
    else {
        var arr1 = arrN1.splice(0, index);
        if (notReverse) {
            return [el].concat(arr1);
        }
        else {
            return [el].concat(arr1.reverse());
        }
    }
};
exports.uid = function () {
    return Date.now().toString(36)
        + Math.random().toString(36).substr(2);
};
//# sourceMappingURL=utils.js.map
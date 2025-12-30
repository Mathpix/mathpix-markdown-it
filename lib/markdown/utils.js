"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEscapedAt = exports.applyAttrToInlineMath = exports.applyAttrToMathml = exports.isMathInText = exports.addAttributesToParentToken = exports.addAttributesToParentTokenByType = exports.getSpacesFromLeft = exports.canonicalMathPositions = exports.canonicalMath = exports.findOpenCloseTagsMathEnvironment = exports.findOpenCloseTags = exports.findBackTick = exports.attrSetToBegin = exports.uid = exports.arrayResortFromElement = exports.arrayDelElement = exports.arraysCompare = exports.includesMultiMathTag = exports.includesMultiMathBeginTag = exports.hasOddSimpleMathTag = exports.includesSimpleMathTag = exports.isNotBackticked = exports.getLatexTextWidth = exports.getWidthFromDocument = exports.beginTag = exports.endTag = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./common/consts");
var endTag = function (arg, shouldBeFirst) {
    if (shouldBeFirst === void 0) { shouldBeFirst = false; }
    try {
        if (arg.indexOf('*') !== -1) {
            /** The '*' character must be escaped in a regular expression */
            arg = arg.replace(/\*/, '\\*');
        }
        return shouldBeFirst
            ? new RegExp('^\\\\end\s{0,}\{(' + arg + ')\}')
            : new RegExp('\\\\end\s{0,}\{(' + arg + ')\}');
    }
    catch (e) {
        return null;
    }
};
exports.endTag = endTag;
var beginTag = function (arg, shouldBeFirst) {
    if (shouldBeFirst === void 0) { shouldBeFirst = false; }
    try {
        if (arg.indexOf('*') !== -1) {
            /** The '*' character must be escaped in a regular expression */
            arg = arg.replace(/\*/, '\\*');
        }
        return shouldBeFirst
            ? new RegExp('^\\\\begin\s{0,}\{(' + arg + ')\}')
            : new RegExp('\\\\begin\s{0,}\{(' + arg + ')\}');
    }
    catch (e) {
        return null;
    }
};
exports.beginTag = beginTag;
var getWidthFromDocument = function (cwidth) {
    if (cwidth === void 0) { cwidth = 1200; }
    try {
        var el_container = document.getElementById('container-ruller');
        return el_container ? el_container.offsetWidth : 1200;
    }
    catch (e) {
        return cwidth;
    }
};
exports.getWidthFromDocument = getWidthFromDocument;
var getLatexTextWidth = function (strWidth, cWidth) {
    if (cWidth === void 0) { cWidth = 1200; }
    var res = '';
    try {
        var reTextWidthTag = /\\textwidth/;
        var match = strWidth.match(reTextWidthTag);
        if (!match) {
            return res;
        }
        cWidth = (0, exports.getWidthFromDocument)(cWidth);
        var sWidth = strWidth.slice(0, match.index);
        sWidth = sWidth ? sWidth.trim() : '';
        var dWidth = parseFloat(sWidth);
        dWidth = !dWidth ? 1 : dWidth;
        res = "width: ".concat(dWidth * cWidth, "px; ");
        return res;
    }
    catch (e) {
        return res;
    }
};
exports.getLatexTextWidth = getLatexTextWidth;
var isNotBackticked = function (str, tag) {
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
exports.isNotBackticked = isNotBackticked;
var includesSimpleMathTag = function (str, tag) {
    if (tag === void 0) { tag = '$$'; }
    return str.includes(tag) && (0, exports.isNotBackticked)(str, tag);
};
exports.includesSimpleMathTag = includesSimpleMathTag;
/**
 * Returns true if the string contains an odd number of unescaped `$$` delimiters
 * (i.e. the line toggles the display-math open/close state).
 */
var hasOddSimpleMathTag = function (str, tag) {
    if (tag === void 0) { tag = '$$'; }
    if (!(0, exports.includesSimpleMathTag)(str, tag))
        return false;
    // Use a fresh RegExp instance to avoid shared lastIndex state.
    var re = new RegExp(consts_1.SIMPLE_MATH_DELIM_RE);
    var count = 0;
    while (re.exec(str) !== null) {
        count++;
    }
    return count % 2 === 1;
};
exports.hasOddSimpleMathTag = hasOddSimpleMathTag;
var includesMultiMathBeginTag = function (str, tag) {
    var result = null;
    try {
        if (!tag.test(str)) {
            return result;
        }
        var match = void 0;
        for (var i = 0; i < str.length; i++) {
            result = null;
            var str1 = i < str.length ? str.slice(i) : '';
            match = str1 ? str1.match(tag) : null;
            if (!match) {
                break;
            }
            if ((0, exports.isNotBackticked)(str, match[0])) {
                result = null;
                if (match[0] === "\\[" || match[0] === "\[") {
                    result = /\\\]/;
                }
                else if (match[0] === "\\(" || match[0] === "\(") {
                    result = /\\\)/;
                }
                else if (match[1]) {
                    result = (0, exports.endTag)(match[1]);
                }
                break;
            }
            else {
                i += match.index + match[0].length - 1;
            }
        }
        return result;
    }
    catch (e) {
        return null;
    }
};
exports.includesMultiMathBeginTag = includesMultiMathBeginTag;
var includesMultiMathTag = function (str, tag) {
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
        if ((0, exports.isNotBackticked)(str, match[0])) {
            result = true;
            break;
        }
        else {
            i += match.index + match[0].length;
        }
    }
    return result;
};
exports.includesMultiMathTag = includesMultiMathTag;
var arraysCompare = function (a1, a2) {
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
exports.arraysCompare = arraysCompare;
var arrayDelElement = function (arr, el) {
    var index = arr.indexOf(el);
    if (index === -1) {
        return arr;
    }
    return arr.splice(index, 1);
};
exports.arrayDelElement = arrayDelElement;
var arrayResortFromElement = function (arr, el, notReverse, nextEl) {
    if (notReverse === void 0) { notReverse = false; }
    if (nextEl === void 0) { nextEl = -1; }
    var index = arr.indexOf(el);
    var arrN1 = tslib_1.__spreadArray([], tslib_1.__read(arr), false);
    var arrN2 = tslib_1.__spreadArray([], tslib_1.__read(arr), false);
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
exports.arrayResortFromElement = arrayResortFromElement;
var uid = function () {
    return Date.now().toString(36)
        + Math.random().toString(36).substr(2);
};
exports.uid = uid;
/** Add attribute to begin of attribute list */
var attrSetToBegin = function (attrs, name, value) {
    var index = (attrs === null || attrs === void 0 ? void 0 : attrs.length)
        ? attrs.findIndex(function (item) { return item[0] === name; })
        : -1;
    if (index < 0) {
        attrs.unshift([name, value]);
    }
    else {
        attrs[index] = [name, value];
    }
};
exports.attrSetToBegin = attrSetToBegin;
var findBackTick = function (posStart, str, pending) {
    if (pending === void 0) { pending = ''; }
    var pos = posStart;
    var matchStart, matchEnd;
    var max = str.length;
    var ch = str.charCodeAt(pos);
    if (ch !== 0x60 /* ` */) {
        return null;
    }
    var start = pos;
    pos++;
    while (pos < max && str.charCodeAt(pos) === 0x60 /* ` */) {
        pos++;
    }
    var marker = str.slice(start, pos);
    if (pending === marker) {
        return {
            marker: marker,
            posEnd: pos
        };
    }
    matchStart = matchEnd = pos;
    while ((matchStart = str.indexOf('`', matchEnd)) !== -1) {
        matchEnd = matchStart + 1;
        while (matchEnd < max && str.charCodeAt(matchEnd) === 0x60 /* ` */) {
            matchEnd++;
        }
        if (matchEnd - matchStart === marker.length) {
            var content = str.slice(pos, matchStart)
                .replace(/\n/g, ' ')
                .replace(/^ (.+) $/, '$1');
            var posEnd_1 = matchEnd;
            return {
                marker: marker,
                content: content,
                posEnd: posEnd_1
            };
        }
    }
    var posEnd = posStart + marker.length;
    return {
        marker: marker,
        posEnd: posEnd,
        pending: marker
    };
};
exports.findBackTick = findBackTick;
var findOpenCloseTags = function (str, tagOpen, tagClose, pendingBackTick, noBreakBackTick) {
    if (pendingBackTick === void 0) { pendingBackTick = ''; }
    if (noBreakBackTick === void 0) { noBreakBackTick = false; }
    var max = str.length;
    var arrOpen = [];
    var arrClose = [];
    var pending = '';
    var posStart = 0;
    if (pendingBackTick) {
        var index = str.indexOf(pendingBackTick);
        if (index === -1) {
            return {
                arrOpen: arrOpen,
                arrClose: arrClose,
                pending: pendingBackTick
            };
        }
        posStart = index + pendingBackTick.length;
        pendingBackTick = '';
    }
    for (var pos = posStart; pos < max; pos++) {
        var ch = str.charCodeAt(pos);
        if (ch === 0x60 /* ` */) {
            var data = (0, exports.findBackTick)(pos, str, pendingBackTick);
            if (data) {
                if (data.pending) {
                    pending = data.pending;
                    if (!noBreakBackTick) {
                        break;
                    }
                }
                pos = noBreakBackTick ? data.posEnd - 1 : data.posEnd;
                continue;
            }
        }
        if (str.charCodeAt(pos) === 0x5c /* \ */) {
            var match = str
                .slice(pos)
                .match(tagOpen);
            if (match) {
                var posEnd = pos + match[0].length;
                arrOpen.push({
                    posStart: pos + match.index,
                    content: match[0],
                    posEnd: posEnd
                });
                pos = posEnd;
            }
            else {
                if (!tagClose) {
                    continue;
                }
                match = str
                    .slice(pos)
                    .match(tagClose);
                if (match) {
                    var posEnd = pos + match[0].length;
                    arrClose.push({
                        posStart: pos + match.index,
                        content: match[0],
                        posEnd: posEnd
                    });
                    pos = posEnd < max ? posEnd - 1 : posEnd;
                }
            }
        }
    }
    return {
        arrOpen: arrOpen,
        arrClose: arrClose,
        pending: pending
    };
};
exports.findOpenCloseTags = findOpenCloseTags;
/** To search for start and end markers in the entire string.
 * The search stops if the end of the string is reached
 * or if the number of end markers is equal to the number of start markers (for inline parser only isInline = true)
 * */
var findOpenCloseTagsMathEnvironment = function (str, tagOpen, tagClose, isInline) {
    if (isInline === void 0) { isInline = true; }
    var max = str.length;
    var arrOpen = [];
    var arrClose = [];
    var posStart = 0;
    for (var pos = posStart; pos < max; pos++) {
        if (str.charCodeAt(pos) === 0x5c /* \ */) {
            var match = str
                .slice(pos)
                .match(tagOpen);
            if (match) {
                var posEnd = pos + match[0].length;
                arrOpen.push({
                    posStart: pos + match.index,
                    content: match[0],
                    posEnd: posEnd
                });
                pos = posEnd - 1;
            }
            else {
                match = str
                    .slice(pos)
                    .match(tagClose);
                if (match) {
                    var posEnd = pos + match[0].length;
                    arrClose.push({
                        posStart: pos + match.index,
                        content: match[0],
                        posEnd: posEnd
                    });
                    if (isInline && arrClose.length === (arrOpen === null || arrOpen === void 0 ? void 0 : arrOpen.length)) {
                        break;
                    }
                    pos = posEnd - 1;
                }
            }
        }
    }
    return {
        arrOpen: arrOpen,
        arrClose: arrClose,
    };
};
exports.findOpenCloseTagsMathEnvironment = findOpenCloseTagsMathEnvironment;
/**
 * @return {string} Get and return a control-sequence name
 */
var GetCS = function (str, i) {
    var CS = str.slice(i).match(/^([a-z]+|.) ?/i);
    if (CS) {
        i += CS[1].length;
        return {
            cs: CS[1],
            next: i
        };
    }
    else {
        i++;
        return {
            cs: ' ',
            next: i
        };
    }
};
var getDigit = function (str, i) {
    var CS = str.slice(i).match(/^([0-9.,]+|) ?/i);
    if (CS) {
        i += CS[1].length;
        return {
            cs: CS[1],
            next: i
        };
    }
    else {
        i++;
        return {
            cs: '',
            next: i
        };
    }
};
var getLetter = function (str, i) {
    var CS = str.slice(i).match(/^([a-z]+|) ?/i);
    if (CS) {
        i += CS[1].length;
        return {
            cs: CS[1],
            next: i
        };
    }
    else {
        i++;
        return {
            cs: '',
            next: i
        };
    }
};
var nextIsSpace = function (str, i) {
    return str.charAt(i).match(/\s/);
};
// const GetNext = (str, i) => {
//   while (nextIsSpace(str, i)) {
//     i++;
//   }
//   return {
//     char: str.charAt(i),
//     next: i
//   };
// };
var canonicalMath = function (math) {
    if (!math || !math.trim()) {
        return [];
    }
    var arr = [];
    var i = 0;
    var c;
    var n;
    while (i < math.length) {
        if (nextIsSpace(math, i)) {
            i++;
        }
        c = math.charAt(i++);
        n = c.charCodeAt(0);
        if (n >= 0xD800 && n < 0xDC00) {
            c += math.charAt(i++);
        }
        /** command */
        if (/^\\/.test(c)) {
            var _a = GetCS(math, i), cs = _a.cs, next = _a.next;
            i = next;
            arr.push(c + cs);
            continue;
        }
        /** numbers */
        if (/[0-9.,]/.test(c)) {
            var _b = getDigit(math, i), cs = _b.cs, next = _b.next;
            i = next;
            arr.push(c + cs);
            continue;
        }
        /** letters */
        if (/[a-z]/i.test(c)) {
            var _c = getLetter(math, i), cs = _c.cs, next = _c.next;
            i = next;
            arr.push(c + cs);
            continue;
        }
        arr.push(c);
    }
    return arr;
};
exports.canonicalMath = canonicalMath;
var canonicalMathPositions = function (math) {
    if (!math || !math.trim()) {
        return [];
    }
    var arr = [];
    var i = 0;
    var c;
    var n;
    var startPos = 0;
    var isTextBlock = false;
    var textBlockOpen = 0;
    var fontControl = null;
    var braceOpen = 0;
    var braceOpenFont = 0;
    var parentCommand = '';
    var braceOpenParentCommand = 0;
    while (i < math.length) {
        if (nextIsSpace(math, i)) {
            i++;
        }
        startPos = i;
        c = math.charAt(i++);
        n = c.charCodeAt(0);
        if (n >= 0xD800 && n < 0xDC00) {
            c += math.charAt(i++);
        }
        /** command */
        if (/^\\/.test(c)) {
            if (braceOpen === braceOpenParentCommand) {
                parentCommand = '';
            }
            var _a = GetCS(math, i), cs = _a.cs, next = _a.next;
            var content = c + cs;
            if (isTextBlock && textBlockOpen === 0) {
                isTextBlock = false;
            }
            if (!isTextBlock) {
                arr.push({
                    content: content,
                    contentSlice: math.slice(startPos, next),
                    type: 'command',
                    positions: {
                        start: startPos,
                        end: next
                    },
                    fontControl: fontControl,
                    parentCommand: parentCommand
                });
            }
            i = next;
            if (braceOpen === braceOpenFont && (fontControl === null || fontControl === void 0 ? void 0 : fontControl.command) === '\\Bbb') {
                fontControl = null;
            }
            /** Text control */
            if (['\\text',
                '\\textsf', '\\textit', '\\textbf', '\\textrm', '\\texttt'].includes(content)) {
                isTextBlock = true;
            }
            /** Font control */
            if (['\\mit', '\\rm', '\\oldstyle', '\\cal', '\\it', '\\bf', '\\bbFont', '\\scr', '\\frak', '\\sf', '\\tt',
                '\\Bbb', '\\emph'].includes(content)) {
                fontControl = {
                    command: content,
                    includeIntoBraces: ['\\Bbb'].includes(content)
                };
                braceOpenFont = braceOpen;
            }
            braceOpenParentCommand = braceOpen;
            parentCommand = content;
            continue;
        }
        /** numbers */
        if (/[0-9.,]/.test(c)) {
            if (braceOpen === braceOpenParentCommand) {
                parentCommand = '';
            }
            var _b = getDigit(math, i), cs = _b.cs, next = _b.next;
            if (isTextBlock && textBlockOpen === 0) {
                isTextBlock = false;
            }
            if (!isTextBlock) {
                arr.push({
                    content: c + cs,
                    contentSlice: math.slice(startPos, next),
                    type: 'numbers',
                    positions: {
                        start: startPos,
                        end: next
                    },
                    fontControl: fontControl,
                    parentCommand: parentCommand
                });
            }
            i = next;
            if (braceOpen === braceOpenFont && (fontControl === null || fontControl === void 0 ? void 0 : fontControl.command) === '\\Bbb') {
                fontControl = null;
            }
            continue;
        }
        /** letters */
        if (/[a-z]/i.test(c)) {
            if (braceOpen === braceOpenParentCommand) {
                parentCommand = '';
            }
            var _c = getLetter(math, i), cs = _c.cs, next = _c.next;
            if (isTextBlock && textBlockOpen === 0) {
                isTextBlock = false;
            }
            if (!isTextBlock) {
                arr.push({
                    content: c + cs,
                    contentSlice: math.slice(startPos, next),
                    type: 'letters',
                    positions: {
                        start: startPos,
                        end: next
                    },
                    fontControl: fontControl,
                    parentCommand: parentCommand
                });
            }
            i = next;
            if (braceOpen === braceOpenFont && (fontControl === null || fontControl === void 0 ? void 0 : fontControl.command) === '\\Bbb') {
                fontControl = null;
            }
            continue;
        }
        if (c !== '{' && c !== '}') {
            if (braceOpen === braceOpenParentCommand) {
                parentCommand = '';
            }
            if (braceOpen === braceOpenFont && (fontControl === null || fontControl === void 0 ? void 0 : fontControl.command) === '\\Bbb') {
                fontControl = null;
            }
        }
        if (c === '{') {
            braceOpen++;
        }
        if (c === '}') {
            if (braceOpen === braceOpenFont) {
                fontControl = null;
            }
            braceOpen--;
            if (braceOpen === braceOpenParentCommand) {
                parentCommand = '';
            }
            braceOpen--;
        }
        if (isTextBlock) {
            if (c === '{') {
                textBlockOpen++;
            }
            if (c === '}') {
                textBlockOpen--;
            }
            if (textBlockOpen === 0) {
                var lastItem = arr[arr.length - 1];
                lastItem.positions.end = i;
                lastItem.content = math.slice(lastItem.positions.start, lastItem.positions.end);
                lastItem.contentSlice = math.slice(lastItem.positions.start, lastItem.positions.end);
                isTextBlock = false;
            }
        }
        else {
            arr.push({
                content: c,
                contentSlice: math.slice(startPos, startPos + c.length),
                type: 'other',
                positions: {
                    start: startPos,
                    end: i
                },
                fontControl: fontControl,
                parentCommand: parentCommand
            });
        }
    }
    return arr;
};
exports.canonicalMathPositions = canonicalMathPositions;
var getSpacesFromLeft = function (str) {
    var strTrimLeft = str ? str.trimLeft() : '';
    return str ? str.length - strTrimLeft.length : 0;
};
exports.getSpacesFromLeft = getSpacesFromLeft;
/** add additional attributes to the parent token */
var addAttributesToParentTokenByType = function (parentToken, token, tokenType, attrs, reTagFind) {
    var _a;
    if (reTagFind === void 0) { reTagFind = null; }
    try {
        if (!token.content || !(token === null || token === void 0 ? void 0 : token.children.length)) {
            return;
        }
        if (reTagFind && !reTagFind.test(token.content)) {
            return;
        }
        if (token.children.find(function (item) { return item.type === tokenType; })) {
            if ((_a = parentToken.attrs) === null || _a === void 0 ? void 0 : _a.length) {
                parentToken.attrs.push(attrs);
            }
            else {
                parentToken.attrs = [attrs];
            }
        }
    }
    catch (e) {
        console.log("[MMD]=>[addAttributesToParentTokenByType]=>ERROR=>", e);
    }
};
exports.addAttributesToParentTokenByType = addAttributesToParentTokenByType;
var addAttributesToParentToken = function (parentToken, token) {
    try {
        if (!token.content || !(token === null || token === void 0 ? void 0 : token.children.length)) {
            return;
        }
        (0, exports.addAttributesToParentTokenByType)(parentToken, token, "dotfill", ['data-has-dotfill', 'true'], /\\dotfill/);
    }
    catch (e) {
        console.log("[MMD]=>[addAttributesToParentToken]=>ERROR=>", e);
    }
};
exports.addAttributesToParentToken = addAttributesToParentToken;
var isMathInText = function (tokens, idx, options) {
    try {
        if (!options.forDocx || idx < 0 || idx >= tokens.length) {
            return false;
        }
        var token = tokens[idx];
        if (!["inline_math", "inline_mathML"].includes(token.type)) {
            return false;
        }
        if (token.attrGet("data-math-in-text")) {
            return true;
        }
        var tokenBefore = (idx > 0) ? tokens[idx - 1] : null;
        if ((tokenBefore === null || tokenBefore === void 0 ? void 0 : tokenBefore.type) && consts_1.INLINE_ELEMENT_TOKENS.includes(tokenBefore.type)) {
            return true;
        }
        for (var i = idx + 1; i < tokens.length; i++) {
            var nextToken = tokens[i];
            if (consts_1.CLOSING_STYLE_TOKENS.includes(nextToken.type)) {
                continue;
            }
            if (consts_1.OPENING_STYLE_TOKENS.includes(nextToken.type) || consts_1.INLINE_ELEMENT_TOKENS.includes(nextToken.type)) {
                return true;
            }
            break;
        }
        return false;
    }
    catch (err) {
        console.log("[MMD][isMathInText]=>[ERROR]=>", err);
        return false;
    }
};
exports.isMathInText = isMathInText;
var applyAttrToMathml = function (mathEquation, attr, options) {
    try {
        if (!options.forDocx || !attr) {
            return mathEquation;
        }
        return mathEquation
            .replace(/<mathmlword(\s|>)/g, "<mathmlword ".concat(attr, "$1"))
            .replace(/<mathml(\s|>)/g, "<mathml ".concat(attr, "$1"));
    }
    catch (e) {
        return mathEquation;
    }
};
exports.applyAttrToMathml = applyAttrToMathml;
var applyAttrToInlineMath = function (tokens, attrName, attrVal) {
    tokens.forEach(function (token) {
        if (["inline_math", "inline_mathML"].includes(token.type)) {
            token.attrSet(attrName, attrVal);
        }
    });
};
exports.applyAttrToInlineMath = applyAttrToInlineMath;
/**
 * Returns true if the character at `pos` is escaped by an odd number of backslashes directly before it.
 * Example:
 *   "\&"  -> '&' is escaped  (true)
 *   "\\&" -> '&' is NOT escaped (false), because there are 2 slashes
 */
var isEscapedAt = function (str, pos) {
    var slashCount = 0;
    for (var i = pos - 1; i >= 0 && str.charCodeAt(i) === 92 /* \ */; i--) {
        slashCount++;
    }
    return (slashCount % 2) === 1;
};
exports.isEscapedAt = isEscapedAt;
//# sourceMappingURL=utils.js.map
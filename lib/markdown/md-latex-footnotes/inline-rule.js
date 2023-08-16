"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latex_footnotetext = exports.latex_footnotemark = exports.latex_footnote = void 0;
var common_1 = require("../common");
var isSpace = require('markdown-it/lib/common/utils').isSpace;
var consts_1 = require("../common/consts");
var latex_footnote = function (state, silent) {
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var max = state.posMax;
    var nextPos = startPos;
    var match = state.src
        .slice(startPos)
        .match(consts_1.reFootNote);
    if (!match) {
        return false;
    }
    var latex = match[0];
    nextPos += match[0].length;
    // \footnote {text}
    //          ^^ skipping these spaces
    for (; nextPos < max; nextPos++) {
        var code = state.src.charCodeAt(nextPos);
        if (!isSpace(code) && code !== 0x0A) {
            break;
        }
        latex += state.src[nextPos];
    }
    if (nextPos >= max) {
        return false;
    }
    // \footnote{text} or \footnote[number]{text}
    //          ^^ should be {     ^^ should be [
    if (state.src.charCodeAt(nextPos) !== 123 /* { */
        && state.src.charCodeAt(nextPos) !== 0x5B /* [ */) {
        return false;
    }
    var data = null;
    var envText = '';
    var numbered = undefined;
    if (state.src.charCodeAt(nextPos) === 123 /* { */) {
        latex += state.src[nextPos];
        data = (0, common_1.findEndMarker)(state.src, nextPos);
    }
    else {
        data = null;
        var dataNumbered = (0, common_1.findEndMarker)(state.src, nextPos, "[", "]");
        if (!dataNumbered || !dataNumbered.res) {
            return false; /** can not find end marker */
        }
        numbered = dataNumbered.content;
        if ((numbered === null || numbered === void 0 ? void 0 : numbered.trim()) && !consts_1.reNumber.test(numbered)) {
            return false;
        }
        nextPos = dataNumbered.nextPos;
        if (nextPos < max) {
            // \footnote[numbered]  {text}
            //                    ^^ skipping these spaces
            for (; nextPos < max; nextPos++) {
                var code = state.src.charCodeAt(nextPos);
                if (!isSpace(code) && code !== 0x0A) {
                    break;
                }
            }
        }
        if (nextPos < max && state.src.charCodeAt(nextPos) === 123 /* { */) {
            // \footnote[numbered]{text}
            //                    ^^ get print
            data = (0, common_1.findEndMarker)(state.src, nextPos);
            if (!data || !data.res) {
                return false; /** can not find end marker */
            }
        }
    }
    if (!data || !data.res) {
        return false; /** can not find end marker */
    }
    nextPos = data.nextPos;
    if (silent) {
        state.pos = nextPos;
        return true;
    }
    envText = data.content;
    if (!state.env.footnotes) {
        state.env.footnotes = {};
    }
    if (!state.env.footnotes.list) {
        state.env.footnotes.list = [];
    }
    if (!state.env.footnotes.list_all) {
        state.env.footnotes.list_all = [];
    }
    var footnoteId = state.env.footnotes.list.length;
    var listNotNumbered = state.env.footnotes.list.filter(function (item) {
        return (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext");
    });
    var lastNumber = listNotNumbered.length;
    var tokens = [];
    state.md.inline.parse(envText, state.md, state.env, tokens);
    var token = state.push('footnote_ref', '', 0);
    token.latex = latex;
    token.meta = {
        id: footnoteId,
        numbered: numbered,
        type: 'footnote',
        lastNumber: lastNumber
    };
    state.env.footnotes.list[footnoteId] = {
        content: envText,
        tokens: tokens,
        numbered: numbered,
        type: 'footnote',
        lastNumber: lastNumber
    };
    state.pos = nextPos;
    return true;
};
exports.latex_footnote = latex_footnote;
var latex_footnotemark = function (state, silent) {
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var max = state.posMax;
    var nextPos = startPos;
    var match = state.src
        .slice(startPos)
        .match(consts_1.reFootNoteMark);
    if (!match) {
        return false;
    }
    nextPos += match[0].length;
    // \footnotemark {}
    //              ^^ skipping these spaces
    for (; nextPos < max; nextPos++) {
        var code = state.src.charCodeAt(nextPos);
        if (!isSpace(code) && code !== 0x0A) {
            break;
        }
    }
    if (nextPos >= max) {
        return false;
    }
    var data = null;
    var numbered = undefined;
    // \footnotemark{text} or \footnotemark[number]{text}
    //              ^^ should be {         ^^ should be [
    if (state.src.charCodeAt(nextPos) === 123 /* { */ || state.src.charCodeAt(nextPos) === 0x5B /* [ */) {
        if (state.src.charCodeAt(nextPos) === 123 /* { */) {
            data = (0, common_1.findEndMarker)(state.src, nextPos);
        }
        else {
            data = null;
            var dataNumbered = (0, common_1.findEndMarker)(state.src, nextPos, "[", "]");
            if (!dataNumbered || !dataNumbered.res) {
                return false; /** can not find end marker */
            }
            numbered = dataNumbered.content;
            if ((numbered === null || numbered === void 0 ? void 0 : numbered.trim()) && !consts_1.reNumber.test(numbered)) {
                return false;
            }
            nextPos = dataNumbered.nextPos;
            if (nextPos < max) {
                // \footnotemark[numbered]  {text}
                //                        ^^ skipping these spaces
                for (; nextPos < max; nextPos++) {
                    var code = state.src.charCodeAt(nextPos);
                    if (!isSpace(code) && code !== 0x0A) {
                        break;
                    }
                }
            }
            if (nextPos < max && state.src.charCodeAt(nextPos) === 123 /* { */) {
                // \footnotemark[numbered]{text}
                //                         ^^ get print
                data = (0, common_1.findEndMarker)(state.src, nextPos);
                if (!data || !data.res) {
                    return false; /** can not find end marker */
                }
            }
        }
    }
    if (data === null || data === void 0 ? void 0 : data.res) {
        nextPos = data.nextPos;
    }
    if (silent) {
        state.pos = nextPos;
        return true;
    }
    if (!state.env.footnotes) {
        state.env.footnotes = {};
    }
    if (!state.env.footnotes.list) {
        state.env.footnotes.list = [];
    }
    var footnoteId = state.env.footnotes.list.length;
    var listNotNumbered = state.env.footnotes.list.filter(function (item) {
        return (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext");
    });
    var lastNumber = listNotNumbered.length;
    var token = state.push('footnote_ref', '', 0);
    token.latex = state.src.slice(startPos, nextPos);
    token.meta = {
        id: footnoteId,
        numbered: numbered,
        type: 'footnotemark',
        lastNumber: lastNumber
    };
    state.env.footnotes.list[footnoteId] = {
        content: '',
        tokens: [],
        numbered: numbered,
        type: 'footnotemark',
        footnoteId: footnoteId,
        lastNumber: lastNumber
    };
    state.pos = nextPos;
    return true;
};
exports.latex_footnotemark = latex_footnotemark;
var latex_footnotetext = function (state, silent) {
    var _a, _b;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var max = state.posMax;
    var nextPos = startPos;
    var match = state.src
        .slice(startPos)
        .match(consts_1.reFootNoteText);
    if (!match) {
        return false;
    }
    nextPos += match[0].length;
    // \footnotetext {}
    //              ^^ skipping these spaces
    for (; nextPos < max; nextPos++) {
        var code = state.src.charCodeAt(nextPos);
        if (!isSpace(code) && code !== 0x0A) {
            break;
        }
    }
    if (nextPos >= max) {
        return false;
    }
    // \footnotetext{text} or \footnotetext[number]{text}
    //              ^^ should be {         ^^ should be [
    if (state.src.charCodeAt(nextPos) !== 123 /* { */
        && state.src.charCodeAt(nextPos) !== 0x5B /* [ */) {
        return false;
    }
    var data = null;
    var envText = '';
    var numbered = undefined;
    if (state.src.charCodeAt(nextPos) === 123 /* { */) {
        data = (0, common_1.findEndMarker)(state.src, nextPos);
    }
    else {
        data = null;
        var dataNumbered = (0, common_1.findEndMarker)(state.src, nextPos, "[", "]");
        if (!dataNumbered || !dataNumbered.res) {
            return false; /** can not find end marker */
        }
        numbered = dataNumbered.content;
        if ((numbered === null || numbered === void 0 ? void 0 : numbered.trim()) && !consts_1.reNumber.test(numbered)) {
            return false;
        }
        nextPos = dataNumbered.nextPos;
        if (nextPos < max) {
            // \footnotetext[numbered]  {text}
            //                        ^^ skipping these spaces
            for (; nextPos < max; nextPos++) {
                var code = state.src.charCodeAt(nextPos);
                if (!isSpace(code) && code !== 0x0A) {
                    break;
                }
            }
        }
        if (nextPos < max && state.src.charCodeAt(nextPos) === 123 /* { */) {
            // \footnotetext[numbered]{text}
            //                         ^^ get print
            data = (0, common_1.findEndMarker)(state.src, nextPos);
            if (!data || !data.res) {
                return false; /** can not find end marker */
            }
        }
    }
    if (!data || !data.res) {
        return false; /** can not find end marker */
    }
    envText = data.content;
    if (silent) {
        state.pos = nextPos;
        return true;
    }
    if (!state.env.footnotes) {
        state.env.footnotes = {};
    }
    if (!state.env.footnotes.list) {
        state.env.footnotes.list = [];
    }
    var listNotNumbered = state.env.footnotes.list.filter(function (item) {
        return (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext");
    });
    var lastNumber = listNotNumbered.length;
    var footnoteId = state.env.footnotes.list.length;
    var tokens = [];
    state.md.inline.parse(envText, state.md, state.env, tokens);
    var listFootnoteMark = ((_b = (_a = state.env.footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length)
        ? state.env.footnotes.list.filter(function (item) { return item.type === 'footnotemark'; })
        : [];
    var lastItem = null;
    if (listFootnoteMark === null || listFootnoteMark === void 0 ? void 0 : listFootnoteMark.length) {
        if (numbered) {
            var numberedList = listFootnoteMark.filter(function (item) { return item.numbered === numbered; });
            lastItem = (numberedList === null || numberedList === void 0 ? void 0 : numberedList.length) ? numberedList[numberedList.length - 1] : null;
        }
        else {
            var unNumberedList = listFootnoteMark.filter(function (item) { return item.numbered === undefined; });
            lastItem = (unNumberedList === null || unNumberedList === void 0 ? void 0 : unNumberedList.length) ? unNumberedList[unNumberedList.length - 1] : null;
        }
    }
    var token = state.push('footnotetext', '', 0);
    token.children = tokens;
    token.content = envText;
    token.meta = {
        numbered: numbered,
    };
    if (lastItem) {
        if (lastItem.hasContent) {
            state.env.footnotes.list[lastItem.footnoteId].arrContents.push({
                content: envText,
                tokens: tokens,
            });
        }
        else {
            state.env.footnotes.list[lastItem.footnoteId].content = envText;
            state.env.footnotes.list[lastItem.footnoteId].tokens = tokens;
            state.env.footnotes.list[lastItem.footnoteId].hasContent = true;
            state.env.footnotes.list[lastItem.footnoteId].arrContents = [{
                    content: envText,
                    tokens: tokens
                }];
            token.meta.footnoteId = lastItem.footnoteId;
            token.meta.id = lastItem.footnoteId;
        }
    }
    else {
        state.env.footnotes.list[footnoteId] = {
            content: envText,
            tokens: tokens,
            numbered: numbered,
            type: 'footnotetext',
            footnoteId: -1,
            lastNumber: lastNumber
        };
        token.meta.footnoteId = -1;
        token.meta.id = footnoteId;
    }
    nextPos = data.nextPos;
    state.pos = nextPos;
    return true;
};
exports.latex_footnotetext = latex_footnotetext;
//# sourceMappingURL=inline-rule.js.map
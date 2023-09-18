"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latex_footnotetext = exports.latex_footnotemark = exports.latex_footnote = void 0;
var common_1 = require("../common");
var isSpace = require('markdown-it/lib/common/utils').isSpace;
var consts_1 = require("../common/consts");
var utils_1 = require("./utils");
var latex_footnote = function (state, silent) {
    try {
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
                return false;
                /** can not find end marker */
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
                    return false;
                    /** can not find end marker */
                }
            }
        }
        if (!data || !data.res) {
            return false;
            /** can not find end marker */
        }
        nextPos = data.nextPos;
        if (silent) {
            state.pos = nextPos;
            return true;
        }
        envText = data.content;
        if (!state.env.mmd_footnotes) {
            state.env.mmd_footnotes = {};
        }
        if (!state.env.mmd_footnotes.list) {
            state.env.mmd_footnotes.list = [];
        }
        var tokens = [];
        state.md.inline.parse(envText, state.md, state.env, tokens);
        var token = state.push('mmd_footnote_ref', '', 0);
        token.latex = latex;
        (0, utils_1.addFootnoteToListForFootnote)(state, token, tokens, envText, numbered);
        state.pos = nextPos;
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.latex_footnote = latex_footnote;
var latex_footnotemark = function (state, silent) {
    try {
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
                    return false;
                    /** can not find end marker */
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
                        return false;
                        /** can not find end marker */
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
        if (!state.env.mmd_footnotes) {
            state.env.mmd_footnotes = {};
        }
        if (!state.env.mmd_footnotes.list) {
            state.env.mmd_footnotes.list = [];
        }
        var footnoteId = state.env.mmd_footnotes.list.length;
        var listNotNumbered = state.env.mmd_footnotes.list.filter(function (item) {
            return (!(item.hasOwnProperty('numbered') && item.numbered !== undefined)
                && item.type !== "footnotetext" && item.type !== "blfootnotetext");
        });
        var lastNumber = listNotNumbered.length;
        var token = state.push('mmd_footnote_ref', '', 0);
        token.latex = state.src.slice(startPos, nextPos);
        token.meta = {
            id: footnoteId,
            numbered: numbered,
            type: 'footnotemark',
            lastNumber: lastNumber
        };
        state.env.mmd_footnotes.list[footnoteId] = {
            content: '',
            tokens: [],
            numbered: numbered,
            type: 'footnotemark',
            footnoteId: footnoteId,
            lastNumber: lastNumber
        };
        state.pos = nextPos;
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.latex_footnotemark = latex_footnotemark;
var latex_footnotetext = function (state, silent) {
    try {
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
        var openTag = match[0];
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
                return false;
                /** can not find end marker */
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
                    return false;
                    /** can not find end marker */
                }
            }
        }
        if (!data || !data.res) {
            return false;
            /** can not find end marker */
        }
        envText = data.content;
        if (silent) {
            state.pos = nextPos;
            return true;
        }
        if (!state.env.mmd_footnotes) {
            state.env.mmd_footnotes = {};
        }
        if (!state.env.mmd_footnotes.list) {
            state.env.mmd_footnotes.list = [];
        }
        var tokens = [];
        state.md.inline.parse(envText, state.md, state.env, tokens);
        var token = openTag.indexOf('blfootnotetext') === -1
            ? state.push('footnotetext', '', 0)
            : state.push('blfootnotetext', '', 0);
        token.children = tokens;
        token.content = envText;
        (0, utils_1.addFootnoteToListForFootnotetext)(state, token, tokens, envText, numbered);
        nextPos = data.nextPos;
        state.pos = nextPos;
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.latex_footnotetext = latex_footnotetext;
//# sourceMappingURL=inline-rule.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latex_footnote = void 0;
var isSpace = require('markdown-it/lib/common/utils').isSpace;
var consts_1 = require("../common/consts");
var common_1 = require("../common");
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
    console.log("[MMD]=>footNote=>match=>", match);
    var latex = match[0];
    console.log("[MMD]=>footNote=>latex=>", latex);
    nextPos += match[0].length;
    debugger;
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
    console.log("[MMD]=>data=>", data);
    if (!data || !data.res) {
        return false; /** can not find end marker */
    }
    envText = data.content;
    if (!envText || !envText.trim()) {
        return false;
    }
    // const token = state.push("latex_footnote_open", "", 0);
    // token.latex = latex;
    // // token
    // token.inlinePos = {
    //   start: state.pos,
    //   end: nextPos
    // };
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
    console.log("[MMD]=>footnoteId=>", footnoteId);
    var tokens = [];
    state.md.inline.parse(envText, state.md, state.env, tokens);
    var token = state.push('footnote_ref', '', 0);
    token.meta = { id: footnoteId };
    state.env.footnotes.list[footnoteId] = {
        content: envText,
        tokens: tokens,
        numbered: numbered
    };
    nextPos = data.nextPos;
    console.log("[MMD]=>envText=>", envText);
    console.log("[MMD]=>state.env=>", state.env);
    console.log("[MMD]=>state=>", state);
    state.pos = nextPos;
    return true;
};
exports.latex_footnote = latex_footnote;
//# sourceMappingURL=inline-rule.js.map
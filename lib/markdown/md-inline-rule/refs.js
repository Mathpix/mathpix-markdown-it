"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refInsideMathDelimiter = exports.refsInline = void 0;
var isSpace = require('markdown-it/lib/common/utils').isSpace;
var refsInline = function (state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startMathPos)
        .match(/^(?:eqref\{(?<eqref>[^}]*)\}|ref\{(?<ref>[^}]*)\})/); // eslint-disable-line
    if (!match) {
        return false;
    }
    var type = 'reference_note';
    /** add parentheses so that instead of printing a plain number as 5, it will print (5). */
    var addParentheses = match[0].includes("eqref");
    var endMarker = '}';
    var endMarkerPos = state.src.indexOf(endMarker, startMathPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    if (!silent) {
        var token = state.push(type, "", 0);
        if (state.env.subTabular) {
            token.isSubTable = true;
        }
        if (state.md.options.forLatex) {
            token.markup = match[0];
        }
        token.content = (match === null || match === void 0 ? void 0 : match.groups)
            ? match.groups.eqref || match.groups.ref
            : "";
        token.attrSet("data-parentheses", addParentheses.toString());
        token.inputLatex = state.src.slice(state.pos, nextPos);
        token.inlinePos = {
            start: state.pos,
            end: nextPos,
            start_content: startMathPos,
            end_content: endMarkerPos
        };
    }
    state.pos = nextPos;
    return true;
};
exports.refsInline = refsInline;
var refInsideMathDelimiter = function (state, silent) {
    var _a;
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */
        && state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) {
        return false;
    }
    var match = state.src
        .slice(startMathPos)
        .match(/^(?:\\\[|\[|\\\(|\(|\$\$|\$)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startMathPos += match[0].length;
    var type, endMarker; // eslint-disable-line
    if (match[0] === "\\[") {
        type = "display_math";
        endMarker = "\\]";
    }
    else if (match[0] === "\[") {
        type = "display_math";
        endMarker = "\\]";
    }
    else if (match[0] === "$$") {
        type = "display_math";
        endMarker = "$$";
    }
    else if (match[0] === "\\(") {
        type = "inline_math";
        endMarker = "\\)";
    }
    else if (match[0] === "\(") {
        type = "inline_math";
        endMarker = "\\)";
    }
    else if (match[0] === "$") {
        type = "inline_math";
        endMarker = "$";
    }
    var endMarkerPos = state.src.indexOf(endMarker, startMathPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    var pos = startMathPos;
    for (; pos < endMarkerPos; pos++) {
        var code = state.src.charCodeAt(pos);
        if (!isSpace(code) && code !== 0x0A) {
            break;
        }
    }
    if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
        return false;
    }
    pos += 1;
    var refContent = state.src.slice(pos, endMarkerPos);
    var matchRef = refContent
        .match(/^(?:ref\{([^}]*)\})/);
    if (!matchRef) {
        return false;
    }
    var contentAfter = state.src.slice(pos + matchRef[0].length, endMarkerPos);
    if ((_a = contentAfter === null || contentAfter === void 0 ? void 0 : contentAfter.trim()) === null || _a === void 0 ? void 0 : _a.length) {
        return false;
    }
    if (!silent) {
        if (type === "display_math") {
            type = "reference_note_block";
        }
        else {
            type = "reference_note";
        }
        var token = state.push(type, "", 0);
        token.content = matchRef ? matchRef[1] : "";
        var children = [];
        state.md.inline.parse(token.content.trim(), state.md, state.env, children);
        token.children = children;
        token.inlinePos = {
            start: state.pos,
            end: nextPos
        };
    }
    state.pos = nextPos;
    return true;
};
exports.refInsideMathDelimiter = refInsideMathDelimiter;
//# sourceMappingURL=refs.js.map
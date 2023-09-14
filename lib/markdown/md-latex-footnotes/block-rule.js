"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latex_footnotetext_block = exports.latex_footnote_block = void 0;
var consts_1 = require("../common/consts");
var common_1 = require("../common");
var utils_1 = require("../utils");
var latex_footnote_block = function (state, startLine, endLine, silent) {
    var _a;
    try {
        var token = void 0, lineText = void 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        var nextLine = startLine + 1;
        var startPos = pos;
        var numbered = void 0;
        lineText = state.src.slice(pos, max);
        if (!consts_1.reOpenTagFootnote.test(lineText)) {
            return false;
        }
        var dataTags = (0, utils_1.findOpenCloseTags)(lineText, consts_1.reOpenTagFootnote, '}');
        if (!((_a = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _a === void 0 ? void 0 : _a.length)) {
            return false;
        }
        var matchNumbered = dataTags.arrOpen[dataTags.arrOpen.length - 1].content
            .match(consts_1.reOpenTagFootnoteNumbered);
        if (matchNumbered) {
            numbered = matchNumbered.groups.number;
        }
        var startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
        var startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;
        var content = lineText.slice(startContent);
        var data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
        if (data === null || data === void 0 ? void 0 : data.res) {
            return false;
        }
        var hasEnd = false;
        var nextLineContent = nextLine;
        for (; nextLine <= endLine; nextLine++) {
            pos = state.bMarks[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            var nextLineText = nextLine + 1 <= endLine
                ? state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
                : '';
            if (hasEnd && (!nextLineText || !nextLineText.trim())) {
                break;
            }
            if (hasEnd && (!lineText || !lineText.trim())) {
                break;
            }
            content += '\n';
            content += lineText;
            data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
            if (data.res) {
                hasEnd = true;
                nextLineContent = nextLine;
            }
        }
        if (!data || !data.res) {
            return false;
        }
        /** For validation mode we can terminate immediately */
        if (silent) {
            return true;
        }
        content = data.content;
        state.line = nextLine + 1;
        max = state.eMarks[nextLine];
        if (startFootnote > 0 || max > startPos + startContent + data.nextPos) {
            token = state.push('paragraph_open', 'div', 1);
            token.map = [startLine, state.line];
        }
        if (startFootnote > 0) {
            token = state.push('inline', '', 0);
            token.map = [startLine, startLine];
            token.content = state.src.slice(startPos, startPos + startFootnote);
            token.bMarks = 0;
            token.eMarks = token.bMarks + token.content.length;
            token.bMarksContent = token.bMarks;
            token.eMarksContent = token.eMarks;
            token.children = [];
        }
        token = state.push('footnote_latex', '', 0);
        token.numbered = numbered;
        var children = [];
        state.md.block.parse(content, state.md, state.env, children);
        token.children = children;
        if (max > startPos + startContent + data.nextPos) {
            token = state.push('inline', '', 0);
            token.map = [nextLineContent, nextLine + 1];
            token.content = state.src.slice(startPos + startContent + data.nextPos, max);
            token.children = [];
        }
        if (startFootnote > 0 || max > startPos + startContent + data.nextPos) {
            token = state.push('paragraph_close', 'div', -1);
        }
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.latex_footnote_block = latex_footnote_block;
var latex_footnotetext_block = function (state, startLine, endLine, silent) {
    var _a;
    try {
        var token = void 0, lineText = void 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        var nextLine = startLine + 1;
        var startPos = pos;
        var numbered = void 0;
        lineText = state.src.slice(pos, max);
        if (!consts_1.reOpenTagFootnotetext.test(lineText)) {
            return false;
        }
        var dataTags = (0, utils_1.findOpenCloseTags)(lineText, consts_1.reOpenTagFootnotetext, '}');
        if (!((_a = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _a === void 0 ? void 0 : _a.length)) {
            return false;
        }
        var openTag = dataTags.arrOpen[dataTags.arrOpen.length - 1].content;
        var matchNumbered = openTag
            .match(consts_1.reOpenTagFootnotetextNumbered);
        if (matchNumbered) {
            numbered = matchNumbered.groups.number;
        }
        var startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
        var startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;
        var content = lineText.slice(startContent);
        var data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
        if (data === null || data === void 0 ? void 0 : data.res) {
            return false;
        }
        var hasEnd = false;
        var nextLineContent = nextLine;
        for (; nextLine <= endLine; nextLine++) {
            pos = state.bMarks[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            var nextLineText = nextLine + 1 <= endLine
                ? state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
                : '';
            if (hasEnd && (!nextLineText || !nextLineText.trim())) {
                break;
            }
            if (hasEnd && (!lineText || !lineText.trim())) {
                break;
            }
            content += '\n';
            content += lineText;
            data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
            if (data.res) {
                hasEnd = true;
                nextLineContent = nextLine;
            }
        }
        if (!data || !data.res) {
            return false;
        }
        /** For validation mode we can terminate immediately */
        if (silent) {
            return true;
        }
        content = data.content;
        state.line = nextLine + 1;
        max = state.eMarks[nextLine];
        if (startFootnote > 0 || max > startPos + startContent + data.nextPos) {
            token = state.push('paragraph_open', 'div', 1);
            token.map = [startLine, state.line];
        }
        if (startFootnote > 0) {
            token = state.push('inline', '', 0);
            token.map = [startLine, startLine];
            token.content = state.src.slice(startPos, startPos + startFootnote);
            token.bMarks = 0;
            token.eMarks = token.bMarks + token.content.length;
            token.bMarksContent = token.bMarks;
            token.eMarksContent = token.eMarks;
            token.children = [];
        }
        token = openTag.indexOf('blfootnotetext') !== -1
            ? state.push('blfootnotetext_latex', '', 0)
            : state.push('footnotetext_latex', '', 0);
        token.numbered = numbered;
        var children = [];
        state.md.block.parse(content, state.md, state.env, children);
        token.children = children;
        if (max > startPos + startContent + data.nextPos) {
            token = state.push('inline', '', 0);
            token.map = [nextLineContent, nextLine + 1];
            token.content = state.src.slice(startPos + startContent + data.nextPos, max);
            token.children = [];
        }
        if (startFootnote > 0 || max > startPos + startContent + data.nextPos) {
            token = state.push('paragraph_close', 'div', -1);
        }
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.latex_footnotetext_block = latex_footnotetext_block;
//# sourceMappingURL=block-rule.js.map
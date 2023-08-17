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
        for (; nextLine <= endLine; nextLine++) {
            pos = state.bMarks[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (hasEnd && (!lineText || !lineText.trim())) {
                break;
            }
            content += '\n';
            content += lineText;
            data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
            if (data.res) {
                hasEnd = true;
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
        token = state.push('paragraph_open', 'div', 1);
        token.map = [startLine, state.line];
        if (startFootnote > 0) {
            token = state.push('inline', '', 0);
            token.content = state.src.slice(startPos, startPos + startFootnote);
            token.children = [];
        }
        token = state.push('footnote_latex', '', 0);
        token.numbered = numbered;
        var children = [];
        state.md.block.parse(content, state.md, state.env, children);
        token.children = children;
        max = state.eMarks[nextLine];
        if (max > startPos + startContent + data.nextPos) {
            token = state.push('inline', '', 0);
            token.content = state.src.slice(startPos + startContent + data.nextPos, max);
            token.children = [];
        }
        token = state.push('paragraph_close', 'div', -1);
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
        var matchNumbered = dataTags.arrOpen[dataTags.arrOpen.length - 1].content
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
        for (; nextLine <= endLine; nextLine++) {
            pos = state.bMarks[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (hasEnd && (!lineText || !lineText.trim())) {
                break;
            }
            content += '\n';
            content += lineText;
            data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
            if (data.res) {
                hasEnd = true;
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
        token = state.push('paragraph_open', 'div', 1);
        token.map = [startLine, state.line];
        if (startFootnote > 0) {
            token = state.push('inline', '', 0);
            token.content = state.src.slice(startPos, startPos + startFootnote);
            token.children = [];
        }
        token = state.push('footnotetext_latex', '', 0);
        token.numbered = numbered;
        var children = [];
        state.md.block.parse(content, state.md, state.env, children);
        token.children = children;
        max = state.eMarks[nextLine];
        if (max > startPos + startContent + data.nextPos) {
            token = state.push('inline', '', 0);
            token.content = state.src.slice(startPos + startContent + data.nextPos, max);
            token.children = [];
        }
        token = state.push('paragraph_close', 'div', -1);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.latex_footnotetext_block = latex_footnotetext_block;
//# sourceMappingURL=block-rule.js.map
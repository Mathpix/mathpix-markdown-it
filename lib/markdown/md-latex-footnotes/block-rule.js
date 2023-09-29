"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latex_footnotetext_block = exports.latex_footnote_block = void 0;
var consts_1 = require("../common/consts");
var common_1 = require("../common");
var utils_1 = require("../utils");
var fence = require("markdown-it/lib/rules_block/fence.js");
var latex_footnote_block = function (state, startLine, endLine, silent) {
    var _a, _b, _c;
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
        var inlineContentAfter = '';
        for (; nextLine <= endLine; nextLine++) {
            pos = state.bMarks[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (hasEnd) {
                if (!lineText || !lineText.trim()) {
                    break;
                }
                if (!(inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length)) {
                    nextLineContent = nextLine;
                }
                inlineContentAfter += (inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length) ? '\n' : '';
                inlineContentAfter += lineText;
                var nextLineText = nextLine + 1 <= endLine
                    ? state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
                    : '';
                if (!nextLineText || !nextLineText.trim()) {
                    break;
                }
            }
            content += '\n';
            content += lineText;
            data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
            if (data.res) {
                hasEnd = true;
                nextLineContent = nextLine;
                inlineContentAfter = state.src.slice(startPos + startContent + data.nextPos, state.eMarks[nextLine]);
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
        var inlineContentBefore = startFootnote > 0
            ? state.src.slice(startPos, startPos + startFootnote)
            : '';
        token = state.push('paragraph_open', 'div', 1);
        token.map = [startLine, state.line];
        if ((inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.length) && ((_b = inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.trim()) === null || _b === void 0 ? void 0 : _b.length)) {
            token = state.push('inline', '', 0);
            token.map = [startLine, startLine];
            token.content = inlineContentBefore;
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
        if ((inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length) && ((_c = inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.trim()) === null || _c === void 0 ? void 0 : _c.length)) {
            token = state.push('inline', '', 0);
            token.map = [nextLineContent, nextLine + 1];
            token.content = inlineContentAfter;
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
    var _a, _b, _c, _d, _e, _f;
    try {
        var token = void 0, lineText = void 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        var nextLine = startLine + 1;
        var startPos = pos;
        var numbered = void 0;
        lineText = state.src.slice(pos, max);
        var fullContent = lineText;
        var hasOpenTag = false;
        var pending = '';
        var terminate = false;
        if (!consts_1.reOpenTagFootnotetext.test(lineText)) {
            // jump line-by-line until empty one or EOF
            for (; nextLine < endLine; nextLine++) {
                if (fence(state, nextLine, endLine, true)) {
                    terminate = true;
                }
                if (terminate) {
                    break;
                }
                if (state.isEmpty(nextLine)) {
                    break;
                }
                pos = state.bMarks[nextLine];
                max = state.eMarks[nextLine];
                lineText = state.src.slice(pos, max);
                if (!lineText || !lineText.trim()) {
                    break;
                }
                fullContent += fullContent ? '\n' : '';
                fullContent += lineText;
                if (consts_1.reOpenTagFootnotetext.test(fullContent)) {
                    hasOpenTag = true;
                    nextLine += 1;
                    break;
                }
            }
            if (!hasOpenTag || nextLine > endLine) {
                return false;
            }
        }
        var dataTags = (0, utils_1.findOpenCloseTags)(fullContent, consts_1.reOpenTagFootnotetext, '}', '', true);
        if (!((_a = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _a === void 0 ? void 0 : _a.length)) {
            return false;
        }
        pending = dataTags.pending;
        var openTag = dataTags.arrOpen[dataTags.arrOpen.length - 1].content;
        var matchNumbered = openTag
            .match(consts_1.reOpenTagFootnotetextNumbered);
        if (matchNumbered) {
            numbered = matchNumbered.groups.number;
        }
        var startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
        var startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;
        var content = fullContent.slice(startContent);
        var data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
        if (data === null || data === void 0 ? void 0 : data.res) {
            return false;
        }
        var hasEnd = false;
        var nextLineContent = nextLine;
        var inlineContentAfter = '';
        for (; nextLine <= endLine; nextLine++) {
            if (fence(state, nextLine, endLine, true)) {
                terminate = true;
            }
            if (terminate) {
                break;
            }
            pos = state.bMarks[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (hasEnd) {
                if (!lineText || !lineText.trim()) {
                    break;
                }
                if (!(inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length)) {
                    nextLineContent = nextLine;
                }
                inlineContentAfter += (inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length) ? '\n' : '';
                inlineContentAfter += lineText;
                var nextLineText = nextLine + 1 <= endLine
                    ? state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
                    : '';
                if (!nextLineText || !nextLineText.trim()) {
                    break;
                }
            }
            content += '\n';
            content += lineText;
            fullContent += '\n';
            fullContent += lineText;
            if (!lineText || !lineText.trim()) {
                pending = '';
            }
            if (pending) {
                dataTags = (0, utils_1.findOpenCloseTags)(fullContent, consts_1.reOpenTagFootnotetext, '}');
                if (!((_b = dataTags === null || dataTags === void 0 ? void 0 : dataTags.arrOpen) === null || _b === void 0 ? void 0 : _b.length)) {
                    break;
                }
            }
            data = (0, common_1.findEndMarker)(content, -1, '{', '}', true);
            if (data.res) {
                hasEnd = true;
                nextLineContent = nextLine;
                inlineContentAfter = state.src.slice(startPos + startContent + data.nextPos, state.eMarks[nextLine]);
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
        var inlineContentBefore = startFootnote > 0
            ? state.src.slice(startPos, startPos + startFootnote)
            : '';
        var needToCreateParagraph = ((inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.length) && ((_c = inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.trim()) === null || _c === void 0 ? void 0 : _c.length))
            || ((inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length) && ((_d = inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.trim()) === null || _d === void 0 ? void 0 : _d.length));
        if (needToCreateParagraph) {
            token = state.push('paragraph_open', 'div', 1);
            token.map = [startLine, state.line];
        }
        if ((inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.length) && ((_e = inlineContentBefore === null || inlineContentBefore === void 0 ? void 0 : inlineContentBefore.trim()) === null || _e === void 0 ? void 0 : _e.length)) {
            token = state.push('inline', '', 0);
            token.map = [startLine, startLine];
            token.content = inlineContentBefore;
            token.bMarks = 0;
            token.eMarks = token.bMarks + token.content.length;
            token.bMarksContent = token.bMarks;
            token.eMarksContent = token.eMarks;
            token.lastBreakToSpace = true;
            token.children = [];
        }
        token = openTag.indexOf('blfootnotetext') === -1
            ? state.push('footnotetext_latex', '', 0)
            : state.push('blfootnotetext_latex', '', 0);
        token.numbered = numbered;
        var children = [];
        state.md.block.parse(content, state.md, state.env, children);
        token.children = children;
        if ((inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.length) && ((_f = inlineContentAfter === null || inlineContentAfter === void 0 ? void 0 : inlineContentAfter.trim()) === null || _f === void 0 ? void 0 : _f.length)) {
            token = state.push('inline', '', 0);
            token.map = [nextLineContent, nextLine + 1];
            token.content = inlineContentAfter;
            token.firstBreakToSpace = true;
            token.children = [];
        }
        if (needToCreateParagraph) {
            token = state.push('paragraph_close', 'div', -1);
        }
        return true;
    }
    catch (e) {
        console.log("[ERROR]=>[latex_footnotetext_block]=>", e);
        return false;
    }
};
exports.latex_footnotetext_block = latex_footnotetext_block;
//# sourceMappingURL=block-rule.js.map
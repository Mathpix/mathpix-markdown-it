"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mmdHtmlBlock = void 0;
var html_re_1 = require("../common/html-re");
var mmdHtmlBlock = function (state, startLine, endLine, silent) {
    var i, nextLine, token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
    }
    if (!state.md.options.html) {
        return false;
    }
    if (state.md.options.htmlDisableTagMatching) {
        return false;
    }
    if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
        return false;
    }
    lineText = state.src.slice(pos, max);
    var openTag;
    for (i = 0; i < html_re_1.HTML_SEQUENCES.length; i++) {
        openTag = html_re_1.HTML_SEQUENCES[i][0];
        if (openTag.test(lineText)) {
            break;
        }
    }
    if (i === html_re_1.HTML_SEQUENCES.length) {
        return false;
    }
    var match = lineText.match(openTag);
    if (!match) {
        return false;
    }
    nextLine = startLine + 1;
    if (((match === null || match === void 0 ? void 0 : match.length) > 2 && (match[2] === '/>' || match[2] === "/"))
        || html_re_1.selfClosingTags.includes(match[1])) {
        if (silent) {
            // true if this sequence can be a terminator, false otherwise
            return html_re_1.HTML_SEQUENCES[i][2];
        }
        state.line = nextLine;
        token = state.push('html_block', '', 0);
        token.map = [startLine, nextLine];
        token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
        return true;
    }
    var openTagNext = html_re_1.HTML_SEQUENCES[i][1]
        ? html_re_1.HTML_SEQUENCES[i][0]
        : new RegExp('^(?:<' + match[1] + '\\s*>)');
    // If we are here - we detected HTML block.
    // Let's roll down till block end.
    var closeTag = html_re_1.HTML_SEQUENCES[i][1]
        ? html_re_1.HTML_SEQUENCES[i][1]
        : new RegExp('^(?:<\\/' + match[1] + '\\s*>)');
    if (!closeTag) {
        return false;
    }
    /* TODO: Check nested tags */
    var hasCloseTag = false;
    var openTagCount = 1;
    if (!closeTag.test(lineText)) {
        for (; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
                break;
            }
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (openTagNext.test(lineText)) {
                openTagCount++;
                continue;
            }
            if (closeTag.test(lineText)) {
                if (lineText.length !== 0) {
                    nextLine++;
                }
                openTagCount--;
                if (openTagCount === 0) {
                    hasCloseTag = true;
                    break;
                }
            }
        }
    }
    if (!hasCloseTag) {
        return false;
    }
    if (silent) {
        // true if this sequence can be a terminator, false otherwise
        return html_re_1.HTML_SEQUENCES[i][2];
    }
    state.line = nextLine;
    token = state.push('html_block', '', 0);
    token.map = [startLine, nextLine];
    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
    return true;
};
exports.mmdHtmlBlock = mmdHtmlBlock;
//# sourceMappingURL=mmd-html-block.js.map
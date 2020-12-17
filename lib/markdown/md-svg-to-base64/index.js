"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var convert_scv_to_base64_1 = require("./convert-scv-to-base64");
var HTML_SEQUENCES = [
    [/^<(svg)(?=(\s|>|$))/i, /<\/(svg)>/i, true],
];
var openTag = /^<(svg)(?=(\s|>|$))/i;
var closeTag = /<\/(svg)>/i;
var svgToBase64Block = function (state, startLine, endLine, silent) {
    var i, nextLine, token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
    }
    if (!state.md.options.html) {
        return false;
    }
    if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
        return false;
    }
    lineText = state.src.slice(pos, max);
    for (i = 0; i < HTML_SEQUENCES.length; i++) {
        if (openTag.test(lineText)) {
            break;
        }
    }
    if (i === HTML_SEQUENCES.length) {
        return false;
    }
    if (silent) {
        // true if this sequence can be a terminator, false otherwise
        return HTML_SEQUENCES[i][2];
    }
    nextLine = startLine + 1;
    // If we are here - we detected HTML block.
    // Let's roll down till block end.
    if (!closeTag.test(lineText)) {
        for (; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
                break;
            }
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (closeTag.test(lineText)) {
                if (lineText.length !== 0) {
                    nextLine++;
                }
                break;
            }
        }
    }
    state.line = nextLine;
    token = state.push('html_inline', '', 0);
    var content = state.getLines(startLine, nextLine, state.blkIndent, true);
    token.content = convert_scv_to_base64_1.default(content);
    token.map = [startLine, nextLine];
    return true;
};
exports.default = (function (md, options) {
    Object.assign(md.options, options);
    md.block.ruler.before('html_block', 'svgToBase64Block', svgToBase64Block, {
        alt: ["paragraph", "reference", "blockquote", "list"]
    });
});
//# sourceMappingURL=index.js.map
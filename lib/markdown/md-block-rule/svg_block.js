"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svg_block = void 0;
// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//
var HTML_SEQUENCES = [
    [/^<(svg)(?=(\s|>|$))/i, /<\/(svg)>/i, true],
    // [ /^<(mol)(?=(\s|>|$))/i, /<\/(mol)>/i, false ],
];
var svg_block = function (state, startLine, endLine, silent) {
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
        var HTML_SEQUENCE_1 = HTML_SEQUENCES[i][0];
        if (HTML_SEQUENCE_1.test(lineText)) {
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
    var HTML_SEQUENCE = HTML_SEQUENCES[i][1];
    if (!HTML_SEQUENCE.test(lineText)) {
        for (; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
                break;
            }
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (HTML_SEQUENCE.test(lineText)) {
                if (lineText.length !== 0) {
                    nextLine++;
                }
                break;
            }
        }
    }
    state.line = nextLine;
    token = state.push('html_block', '', 0);
    token.map = [startLine, nextLine];
    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
    return true;
};
exports.svg_block = svg_block;
//# sourceMappingURL=svg_block.js.map
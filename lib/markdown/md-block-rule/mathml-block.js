"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mathMLBlock = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("../common/consts");
var consts_2 = require("../common/consts");
var mathMLBlock = function (state, startLine, endLine, silent) {
    try {
        var pos = state.bMarks[startLine] + state.tShift[startLine];
        var max = state.eMarks[startLine];
        var nextLine_1 = startLine + 1;
        var terminatorRules = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(state.md.block.ruler.getRules('paragraph')), false), tslib_1.__read(state.md.block.ruler.getRules('mathMLBlock')), false);
        // state.parentType = 'paragraph';
        // Early exit if the first character is not '<'
        if (state.src.charCodeAt(pos) !== 0x3C /* < */)
            return false;
        // Extract current line text and check for the opening tag
        var lineText = state.src.slice(pos, max);
        if (!consts_1.openTagMML.test(lineText))
            return false;
        var hasCloseTag = false;
        // Iterate through lines until the closing tag or end of file
        while (nextLine_1 < endLine) {
            pos = state.bMarks[nextLine_1] + state.tShift[nextLine_1];
            max = state.eMarks[nextLine_1];
            lineText = state.src.slice(pos, max);
            // Check for terminator rules
            if (terminatorRules.some(function (rule) { return rule(state, nextLine_1, endLine, true); }))
                break;
            // Check for closing tag
            if (consts_1.closeTagMML.test(lineText)) {
                if (lineText.length !== 0)
                    nextLine_1++;
                hasCloseTag = true;
                break;
            }
            nextLine_1++;
        }
        // If there is no closing tag, return false
        if (!hasCloseTag)
            return false;
        // Get the content between the matched lines
        var content = state.getLines(startLine, nextLine_1, state.blkIndent, false);
        // Validate content with MathML regex
        if (!consts_2.validMathMLRegex.test(content))
            return false;
        // If in validation mode, return true
        if (silent)
            return true;
        // Update the state line
        state.line = nextLine_1;
        // Create the tokens for the MathML block
        var token = state.push('paragraph_open', 'div', 1);
        token.map = [startLine, nextLine_1];
        token = state.push('inline', '', 0);
        token.content = content;
        token.map = [startLine, nextLine_1];
        token.children = [];
        token = state.push('paragraph_close', 'div', -1);
        return true;
    }
    catch (err) {
        console.error("[ERROR]=>[mathMLBlock]=>", err);
        return false;
    }
};
exports.mathMLBlock = mathMLBlock;
//# sourceMappingURL=mathml-block.js.map
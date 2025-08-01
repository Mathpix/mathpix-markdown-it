"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeginAlign = exports.getAlignByAlignEnvBlock = exports.SeparateInlineBlocksBeginAlign = void 0;
var begin_tabular_1 = require("./begin-tabular");
var includegraphics_1 = require("../md-inline-rule/includegraphics");
var consts_1 = require("../common/consts");
var endTag = function (arg) {
    if (arg === void 0) { arg = 'center'; }
    return new RegExp('\\end\s{0,}\{(' + arg + ')\}');
};
var SeparateInlineBlocksBeginAlign = function (state, startLine, nextLine, content, align) {
    var res = [];
    var match = content.match(consts_1.RE_ALIGN_ENV_BLOCK);
    if (match) {
        if (match.index > 0) {
            res.push({ content: content.slice(0, match.index), align: align });
        }
        res.push({ content: match[2], align: match[1] });
        content = content.slice(match.index + match[0].length);
        res = res.concat((0, exports.SeparateInlineBlocksBeginAlign)(state, startLine, nextLine, content, align));
    }
    else {
        res.push({ content: content, align: align });
    }
    return res;
};
exports.SeparateInlineBlocksBeginAlign = SeparateInlineBlocksBeginAlign;
var getAlignByAlignEnvBlock = function (content) {
    var _a;
    if (typeof content !== 'string' || !consts_1.RE_BEGIN_ALIGN_ENV.test(content)) {
        return '';
    }
    var match = content.match(consts_1.RE_ALIGN_ENV_BLOCK);
    return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : '';
};
exports.getAlignByAlignEnvBlock = getAlignByAlignEnvBlock;
var InlineBlockBeginAlign = function (state, startLine) {
    var token;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var lineText = state.src.slice(pos, max);
    var match = lineText.match(consts_1.RE_BEGIN_ALIGN_ENV);
    if (!match) {
        return false;
    }
    var align = match[1];
    var closeTag = endTag(align);
    var pB = match.index + match[0].length;
    var matchE = lineText.match(closeTag);
    var pE = matchE ? matchE.index : 0;
    //const dopDiv: string =  matchE ? lineText.slice(matchE.index + matchE[0].length) : '';
    token = state.push('paragraph_open', 'div', 1);
    token.attrs = [
        ['class', 'center'],
        ['style', "text-align: ".concat(align ? align : 'center')]
    ];
    if (state.md.options.forLatex) {
        if (align && ['left', 'right'].includes(align)) {
            token.latex = "\\begin{flush".concat(align, "}");
        }
        else {
            token.latex = "\\begin{".concat(align ? align : 'center', "}");
        }
    }
    token.map = [startLine, startLine + 1];
    if (pB > 0) {
        state.tShift[startLine] = pB;
    }
    if (pE > 0) {
        state.eMarks[startLine] = state.eMarks[startLine] - (lineText.length - pE + 1);
    }
    state.parentType = 'paragraph';
    state.env.align = align;
    var content = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine]);
    if (!(0, begin_tabular_1.StatePushTabularBlock)(state, startLine, startLine + 1, content, align)) {
        if (!(0, includegraphics_1.StatePushIncludeGraphics)(state, startLine, startLine + 1, content, align)) {
            (0, begin_tabular_1.StatePushDiv)(state, startLine, startLine + 1, content);
        }
    }
    token = state.push('paragraph_close', 'div', -1);
    if (state.md.options.forLatex) {
        if (align && ['left', 'right'].includes(align)) {
            token.latex = "\\end{flush".concat(align, "}");
        }
        else {
            token.latex = "\\end{".concat(align ? align : 'center', "}");
        }
    }
    state.line = startLine + 1;
    return true;
};
var BeginAlign = function (state, startLine, endLine, silent) {
    var token;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return false;
    }
    var resText = '';
    var isCloseTagExist = false;
    var match = lineText.match(consts_1.RE_BEGIN_ALIGN_ENV);
    if (!match) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    var align = match[1];
    var closeTag = endTag(align);
    var pB = 0;
    if (closeTag.test(lineText)) {
        if (InlineBlockBeginAlign(state, startLine)) {
            return true;
        }
    }
    if (match.index + match[0].length < lineText.trim().length) {
        pB = match.index + match[0].length;
        resText = lineText.slice(match.index + match[0].length);
    }
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (closeTag.test(lineText)) {
            isCloseTagExist = true;
            lineText += '\n';
            break;
            //if (state.isEmpty(nextLine+1)) { break }
        }
        if (resText && lineText) {
            resText += '\n' + lineText;
        }
        else {
            resText += lineText;
        }
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
        }
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) {
            continue;
        }
    }
    if (!isCloseTagExist) {
        return false;
    }
    var matchE = lineText.match(closeTag);
    var pE = 0;
    //let pE = matchE ? matchE.index: 0;
    if (matchE) {
        resText += lineText.slice(0, matchE.index - 1);
        pE = matchE.index;
    }
    token = state.push('paragraph_open', 'div', 1);
    token.attrs = [
        ['class', 'center'],
        ['style', "text-align: ".concat(align ? align : 'center')]
    ];
    if (state.md.options.forLatex) {
        if (align && ['left', 'right'].includes(align)) {
            token.latex = "\\begin{flush".concat(align, "}");
        }
        else {
            token.latex = "\\begin{".concat(align ? align : 'center', "}");
        }
    }
    token.map = [startLine, (pE > 0) ? nextLine : nextLine + 1];
    if (pB > 0) {
        state.tShift[startLine] = pB;
    }
    else {
        startLine += 1;
    }
    if (pE > 0) {
        state.eMarks[nextLine] = state.eMarks[nextLine] - (lineText.length - pE + 1);
    }
    else {
        nextLine += 1;
    }
    state.parentType = 'paragraph';
    state.env.align = align;
    var content = resText.trim();
    if (!(0, begin_tabular_1.StatePushTabularBlock)(state, startLine, nextLine, content, align)) {
        if (!(0, includegraphics_1.StatePushIncludeGraphics)(state, startLine, nextLine, content, align)) {
            (0, begin_tabular_1.StatePushDiv)(state, startLine, nextLine, content);
        }
    }
    token = state.push('paragraph_close', 'div', -1);
    if (state.md.options.forLatex) {
        if (align && ['left', 'right'].includes(align)) {
            token.latex = "\\end{flush".concat(align, "}");
        }
        else {
            token.latex = "\\end{".concat(align ? align : 'center', "}");
        }
    }
    state.line = nextLine;
    return true;
};
exports.BeginAlign = BeginAlign;
//# sourceMappingURL=begin-align.js.map
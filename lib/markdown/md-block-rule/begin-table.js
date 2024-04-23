"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeginTable = exports.ClearFigureNumbers = exports.ClearTableNumbers = exports.openTagH = exports.openTag = void 0;
var begin_tabular_1 = require("./begin-tabular");
var includegraphics_1 = require("../md-inline-rule/includegraphics");
var begin_align_1 = require("./begin-align");
var utils_1 = require("../utils");
var utils_2 = require("../md-inline-rule/utils");
var common_1 = require("../common");
var couterTables = 0;
var couterFigures = 0;
exports.openTag = /\\begin\s{0,}\{(table|figure)\}/;
exports.openTagH = /\\begin\s{0,}\{(table|figure)\}\s{0,}\[(H|\!H|H\!|h|\!h|h\!|t|\!t|b|\!b|p|\!p)\]/;
var captionTag = /\\caption\s{0,}\{([^}]*)\}/;
var captionTagG = /\s{0,}\\caption\s{0,}\{([^}]*)\}\s{0,}/g;
var captionTagBegin = /\\caption\s{0,}\{/;
var alignTagG = /\\centering/g;
var alignTagIncludeGraphicsG = /\\includegraphics\[((.*)(center|left|right))\]\s{0,}\{([^{}]*)\}/g;
var TBegin;
(function (TBegin) {
    TBegin["table"] = "table";
    TBegin["figure"] = "figure";
})(TBegin || (TBegin = {}));
;
var ClearTableNumbers = function () {
    couterTables = 0;
};
exports.ClearTableNumbers = ClearTableNumbers;
var ClearFigureNumbers = function () {
    couterFigures = 0;
};
exports.ClearFigureNumbers = ClearFigureNumbers;
var StatePushCaptionTable = function (state, type) {
    var _a, _b;
    var caption = state.env.caption;
    var captionPos = state.env.captionPos;
    if (!caption)
        return;
    var token;
    var num = type === TBegin.table ? couterTables : couterFigures;
    token = state.push('caption_table', '', 0);
    token.attrs = [["".concat(type, "-number"), num], ['class', "caption_".concat(type)]];
    token.children = [];
    if (captionPos === null || captionPos === void 0 ? void 0 : captionPos.hasOwnProperty('map')) {
        token.map = captionPos.map;
    }
    if (captionPos === null || captionPos === void 0 ? void 0 : captionPos.hasOwnProperty('bMarks')) {
        token.bMarks = captionPos.bMarks;
        token.bMarksContent = captionPos.start_content > captionPos.start
            ? captionPos.start_content - captionPos.start
            : captionPos.start_content;
        token.eMarksContent = token.bMarks + token.bMarksContent + captionPos.end_content - captionPos.start_content;
    }
    if (captionPos === null || captionPos === void 0 ? void 0 : captionPos.hasOwnProperty('eMarks')) {
        token.eMarks = captionPos.eMarks;
    }
    token.captionPos = captionPos;
    token.content = caption;
    token.print = ((_b = (_a = state.md) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.nonumbers)
        ? "".concat(type[0].toUpperCase()).concat(type.slice(1), ": ")
        : "".concat(type[0].toUpperCase()).concat(type.slice(1), " ").concat(num, ": ");
    token.caption = caption;
    if (state.md.options.forLatex) {
        token.latex = caption;
    }
};
var StatePushPatagraphOpenTable = function (state, startLine, nextLine, type, latex, hasAlignTagG) {
    if (hasAlignTagG === void 0) { hasAlignTagG = false; }
    var token;
    var align = state.env.align;
    var caption = state.env.caption;
    var currentNumber = 0;
    token = state.push('paragraph_open', 'div', 1);
    token.parentType = 'table';
    token.align = align;
    if (state.md.options.forLatex) {
        token.latex = latex;
    }
    if (!caption) {
        token.attrs = [['class', 'table ']];
    }
    else {
        if (type === TBegin.table) {
            couterTables += 1;
            currentNumber = couterTables;
        }
        else {
            couterFigures += 1;
            currentNumber = couterFigures;
        }
        token.attrs = [['class', 'table'],
            ['number', currentNumber.toString()]];
    }
    state.env.number = currentNumber;
    state.env.type = type;
    token.uuid = (0, utils_1.uid)();
    token.currentTag = {
        type: type,
        number: currentNumber,
        tokenUuidInParentBlock: token.uuid
    };
    if (align) {
        token.attrs.push(['style', "text-align: ".concat(align)]);
        if (!hasAlignTagG && state.md.options.forLatex) {
            if (type === TBegin.table && state.md.options.centerTables) {
                token.attrSet('data-type', 'table');
                token.attrSet('data-align', align);
            }
            if (type === TBegin.figure && state.md.options.centerImages) {
                token.attrSet('data-type', 'figure');
                token.attrSet('data-align', align);
            }
        }
    }
    token.map = [startLine, nextLine];
};
var StatePushContent = function (state, startLine, nextLine, content, align, type) {
    if (type === TBegin.table) {
        if (!(0, begin_tabular_1.StatePushTabularBlock)(state, startLine, nextLine, content, align)) {
            (0, begin_tabular_1.StatePushDiv)(state, startLine, nextLine, content);
        }
    }
    else {
        if (!(0, includegraphics_1.StatePushIncludeGraphics)(state, startLine, nextLine, content, align)) {
            (0, begin_tabular_1.StatePushDiv)(state, startLine, nextLine, content);
        }
    }
};
var StatePushTableContent = function (state, startLine, nextLine, content, align, type) {
    if (begin_align_1.openTag.test(content)) {
        var matchT = content.match(begin_tabular_1.openTag);
        var matchA = content.match(begin_align_1.openTag);
        if (matchT && matchT.index < matchA.index) {
            StatePushContent(state, startLine, nextLine, content, align, type);
            return;
        }
        var res = (0, begin_align_1.SeparateInlineBlocksBeginAlign)(state, startLine, nextLine, content, align);
        if (res && res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                StatePushContent(state, startLine, nextLine, res[i].content, res[i].align, type);
            }
        }
        else {
            StatePushContent(state, startLine, nextLine, content, align, type);
        }
    }
    else {
        StatePushContent(state, startLine, nextLine, content, align, type);
    }
};
var InlineBlockBeginTable = function (state, startLine) {
    var caption;
    var captionFirst = false;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var lineText = state.src.slice(pos, max);
    var token;
    var match = lineText.match(exports.openTagH);
    if (!match) {
        match = lineText.match(exports.openTag);
    }
    if (!match) {
        return false;
    }
    var type = match[1].trim() in TBegin ? match[1].trim() : null;
    if (!type) {
        return false;
    }
    var closeTag = (0, utils_1.endTag)(type);
    var matchE = lineText.match(closeTag);
    if (!matchE) {
        return false;
    }
    var align = (state.md.options.centerTables && type === TBegin.table)
        || (state.md.options.centerImages && type === TBegin.figure)
        ? 'center' : '';
    var content = lineText.slice(match.index + match[0].length, matchE.index);
    var hasAlignTagG = alignTagG.test(content);
    var hasAlignTagIncludeGraphicsG = type === TBegin.figure
        ? Boolean(content.match(alignTagIncludeGraphicsG)) : false;
    content = content.replace(alignTagG, '');
    var captionPos = {};
    if (!state.md.options.forLatex) {
        matchE = content.match(captionTag);
        if (matchE) {
            caption = matchE[1];
            captionPos.start = pos + matchE.index;
            captionPos.end = captionPos.start + matchE[0].length;
            captionPos.start_content = pos + lineText.indexOf(matchE[1]);
            captionPos.end_content = captionPos.start_content + matchE[1].length;
            captionPos.map = [startLine, startLine];
            captionPos.bMarks = matchE.index;
            captionPos.eMarks = matchE.index + matchE[0].length;
            var matchT = void 0;
            if (type === TBegin.table) {
                matchT = lineText.match(begin_tabular_1.openTag);
            }
            else {
                matchT = lineText.match(utils_2.includegraphicsTag);
            }
            if (matchT && matchE.index < matchT.index) {
                captionFirst = true;
            }
            content = content.replace(captionTagG, '');
        }
    }
    state.parentType = 'paragraph';
    state.env.caption = caption;
    state.env.captionPos = captionPos;
    state.env.envType = type;
    var contentAlign = align ? align
        : hasAlignTagG ? 'center' : '';
    state.env.align = contentAlign;
    var latex = match[1] === 'figure' || match[1] === 'table'
        ? "\\begin{".concat(match[1], "}[h]")
        : match[0];
    StatePushPatagraphOpenTable(state, startLine, startLine + 1, type, latex, hasAlignTagG || hasAlignTagIncludeGraphicsG);
    if (state.md.options.forLatex && hasAlignTagG) {
        token = state.push('latex_align', '', 0);
        token.latex = '\\centering';
    }
    if (captionFirst && !state.md.options.forLatex) {
        StatePushCaptionTable(state, type);
    }
    StatePushTableContent(state, startLine, startLine + 1, content, contentAlign, type);
    if (!captionFirst && !state.md.options.forLatex) {
        StatePushCaptionTable(state, type);
    }
    token = state.push('paragraph_close', 'div', -1);
    token.parentType = 'table';
    token.currentTag = state.env.lastTag ? state.env.lastTag : {};
    if (state.md.options.forLatex && match && match[1]) {
        token.latex = "\\end{".concat(match[1], "}");
    }
    if (!hasAlignTagG && !hasAlignTagIncludeGraphicsG && state.md.options.forLatex) {
        if (type === TBegin.table && state.md.options.centerTables) {
            token.attrSet('data-type', 'table');
            token.attrSet('data-align', align);
        }
        if (type === TBegin.figure && state.md.options.centerImages) {
            token.attrSet('data-type', 'figure');
            token.attrSet('data-align', align);
        }
    }
    state.line = startLine + 1;
    return true;
};
var BeginTable = function (state, startLine, endLine, silent) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var token;
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return false;
    }
    var content = '';
    var resText = '';
    var isCloseTagExist = false;
    var startTabular = 0;
    var match = lineText.match(exports.openTagH);
    if (!match) {
        match = lineText.match(exports.openTag);
    }
    if (!match) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    var type = match[1].trim() in TBegin ? match[1].trim() : null;
    if (!type) {
        return false;
    }
    var closeTag = (0, utils_1.endTag)(type);
    if (closeTag.test(lineText)) {
        if (InlineBlockBeginTable(state, startLine)) {
            return true;
        }
    }
    var captionPos = {};
    var matchCaption = lineText.match(captionTag);
    if (matchCaption) {
        captionPos.start = pos + matchCaption.index;
        captionPos.end = captionPos.start + matchCaption[0].length;
        captionPos.start_content = pos + lineText.indexOf(matchCaption[1]);
        captionPos.end_content = captionPos.start_content + matchCaption[1].length;
        captionPos.map = [startLine, startLine];
        captionPos.bMarks = matchCaption.index;
        captionPos.eMarks = captionPos.bMarks + matchCaption[0].length;
    }
    var align = (state.md.options.centerTables && type === TBegin.table)
        || (state.md.options.centerImages && type === TBegin.figure) ? 'center' : '';
    var caption;
    var captionFirst = false;
    var pB = 0;
    var pE = 0;
    if (match.index + match[0].length < lineText.trim().length) {
        pB = match.index + match[0].length;
        startTabular = startLine;
        resText = lineText.slice(match.index + match[0].length);
    }
    else {
        startTabular = startLine + 1;
    }
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (!matchCaption) {
            matchCaption = lineText.match(captionTag);
            var matchCaptionB = lineText.match(captionTagBegin);
            if (matchCaptionB) {
                var _a = (0, common_1.findEndMarker)(lineText, matchCaptionB.index + matchCaptionB[0].length - 1), _b = _a.res, res = _b === void 0 ? false : _b, _c = _a.nextPos, nextPos = _c === void 0 ? 0 : _c;
                if (res) {
                    captionPos.start = pos + matchCaptionB.index;
                    captionPos.end = pos + nextPos;
                    captionPos.start_content = pos + matchCaptionB.index + matchCaptionB[0].length;
                    captionPos.end_content = pos + nextPos - 1;
                    captionPos.map = [nextLine, nextLine];
                    captionPos.bMarks = matchCaptionB.index;
                    captionPos.eMarks = matchCaptionB.index + nextPos;
                }
            }
            else {
                if (matchCaption) {
                    captionPos.start = pos + matchCaption.index;
                    captionPos.end = captionPos.start + matchCaption[0].length;
                    captionPos.start_content = pos + lineText.indexOf(matchCaption[1]);
                    captionPos.end_content = captionPos.start_content + matchCaption[1].length;
                    captionPos.map = [nextLine, nextLine];
                    captionPos.bMarks = matchCaption.index;
                    captionPos.eMarks = matchCaption.index + matchCaption[0].length;
                }
            }
        }
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
    if (matchE) {
        resText += lineText.slice(0, matchE.index);
        pE = matchE.index;
    }
    var matchAlignTagG = resText.match(alignTagG);
    var hasAlignTagG = Boolean(matchAlignTagG);
    content = state.md.options.forLatex
        ? resText
        : resText.replace(alignTagG, '');
    var hasAlignTagIncludeGraphicsG = type === TBegin.figure
        ? Boolean(content.match(alignTagIncludeGraphicsG)) : false;
    if (!state.md.options.forLatex) {
        matchE = content.match(captionTag);
        var matchCaptionB = content.match(captionTagBegin);
        if (matchCaptionB) {
            var data = (0, common_1.findEndMarker)(content, matchCaptionB.index + matchCaptionB[0].length - 1);
            if (data.res) {
                caption = data.content;
                var matchT = void 0;
                if (type === TBegin.table) {
                    matchT = content.match(begin_tabular_1.openTag);
                }
                else {
                    matchT = content.match(utils_2.includegraphicsTag);
                }
                if (matchT && matchCaptionB.index < matchT.index) {
                    captionFirst = true;
                }
                while (captionTagBegin.test(content)) {
                    var contentData = (0, common_1.removeCaptionsFromTableAndFigure)(content);
                    content = contentData.content;
                    if (contentData.isNotCaption) {
                        break;
                    }
                }
            }
        }
        else {
            if (matchE) {
                caption = matchE[1];
                var matchT = void 0;
                if (type === TBegin.table) {
                    matchT = content.match(begin_tabular_1.openTag);
                }
                else {
                    matchT = content.match(utils_2.includegraphicsTag);
                }
                if (matchT && matchE.index < matchT.index) {
                    captionFirst = true;
                }
                content = content.replace(captionTagG, '');
            }
        }
    }
    state.parentType = 'paragraph';
    state.env.caption = caption;
    state.env.captionPos = captionPos;
    var contentAlign = align ? align
        : hasAlignTagG ? 'center' : '';
    state.env.align = contentAlign;
    var latex = match[1] === 'figure' || match[1] === 'table'
        ? "\\begin{".concat(match[1], "}[h]")
        : match[0];
    StatePushPatagraphOpenTable(state, startLine, (pE > 0) ? nextLine : nextLine + 1, type, latex, (hasAlignTagG || hasAlignTagIncludeGraphicsG));
    if (captionFirst && !state.md.options.forLatex) {
        StatePushCaptionTable(state, type);
    }
    if (pB > 0) {
        state.tShift[startTabular] = pB;
    }
    if (pE > 0) {
        state.eMarks[nextLine] = state.eMarks[nextLine] - (lineText.length - pE);
    }
    else {
        nextLine += 1;
    }
    content = content.trim();
    StatePushTableContent(state, startLine, nextLine, content, contentAlign, type);
    if (!captionFirst && !state.md.options.forLatex) {
        StatePushCaptionTable(state, type);
    }
    token = state.push('paragraph_close', 'div', -1);
    token.parentType = 'table';
    token.currentTag = state.env.lastTag ? state.env.lastTag : {};
    if (state.md.options.forLatex && match && match[1]) {
        token.latex = "\\end{".concat(match[1], "}");
    }
    if (!hasAlignTagG && !hasAlignTagIncludeGraphicsG && state.md.options.forLatex) {
        if (type === TBegin.table && state.md.options.centerTables) {
            token.attrSet('data-type', 'table');
            token.attrSet('data-align', align);
        }
        if (type === TBegin.figure && state.md.options.centerImages) {
            token.attrSet('data-type', 'figure');
            token.attrSet('data-align', align);
        }
    }
    state.line = nextLine;
    return true;
};
exports.BeginTable = BeginTable;
//# sourceMappingURL=begin-table.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var begin_tabular_1 = require("./begin-tabular");
var includegraphics_1 = require("../md-inline-rule/includegraphics");
var begin_align_1 = require("./begin-align");
var utils_1 = require("../utils");
var utils_2 = require("../md-inline-rule/utils");
var linkTables = [];
var couterTables = 0;
var linkFigures = [];
var couterFigures = 0;
var openTag = /\\begin\s{0,}\{(table|figure)\}/;
var openTagH = /\\begin\s{0,}\{(table|figure)\}\s{0,}\[(H|\!H|H\!|h|\!h|h\!|t|\!t|b|\!b|p|\!p)\]/;
var captionTag = /\\caption\s{0,}\{([^}]*)\}/;
var captionTagG = /\\caption\s{0,}\{([^}]*)\}/g;
var labelTag = /\\label\s{0,}\{([^}]*)\}/;
var labelTagG = /\\label\s{0,}\{([^}]*)\}/g;
var alignTagG = /\\centering/g;
var TBegin;
(function (TBegin) {
    TBegin["table"] = "table";
    TBegin["figure"] = "figure";
})(TBegin || (TBegin = {}));
;
var getLastTableNumber = function () {
    return couterTables;
};
var getLastFigureNumber = function () {
    return couterFigures;
};
exports.ClearTableNumbers = function () {
    linkTables = [];
    couterTables = 0;
};
exports.ClearFigureNumbers = function () {
    linkFigures = [];
    couterFigures = 0;
};
var StatePushCaptionTable = function (state, type) {
    var caption = state.env.caption;
    if (!caption)
        return;
    var token;
    var num = type === TBegin.table ? couterTables : couterFigures;
    token = state.push('caption_table', '', 0);
    token.attrs = [[type + "-number", num], ['class', "caption_" + type]];
    token.children = [];
    token.content = "" + type[0].toUpperCase() + type.slice(1) + " " + num + ": " + caption;
};
var StatePushPatagraphOpenTable = function (state, startLine, nextLine, type) {
    var token;
    var label = state.env.label;
    var align = state.env.align;
    var caption = state.env.caption;
    var tagRef = '';
    var currentNumber = 0;
    token = state.push('paragraph_open', 'div', 1);
    if (!caption) {
        token.attrs = [['class', 'table ']];
    }
    else {
        if (type === TBegin.table) {
            tagRef = (label && (label) !== '') ? "" + encodeURIComponent(label) : '';
            linkTables[tagRef] = getLastTableNumber() + 1;
            couterTables += 1;
            currentNumber = couterTables;
        }
        else {
            tagRef = (label && (label) !== '') ? "" + encodeURIComponent(label) : '';
            linkFigures[tagRef] = getLastFigureNumber() + 1;
            couterFigures += 1;
            currentNumber = couterFigures;
        }
        if (tagRef && tagRef.length > 0) {
            token.attrs = [['id', tagRef], ['class', type + " " + tagRef],
                ['number', currentNumber.toString()]];
        }
        else {
            token.attrs = [['class', 'table'],
                ['number', currentNumber.toString()]];
        }
    }
    token.attrs.push(['style', "text-align: " + (align ? align : 'center')]);
    token.map = [startLine, nextLine];
};
var StatePushContent = function (state, startLine, nextLine, content, align, type) {
    if (type === TBegin.table) {
        if (!begin_tabular_1.StatePushTabularBlock(state, startLine, nextLine, content, align)) {
            begin_tabular_1.StatePushDiv(state, startLine, nextLine, content);
        }
    }
    else {
        if (!includegraphics_1.StatePushIncludeGraphics(state, startLine, nextLine, content, align)) {
            begin_tabular_1.StatePushDiv(state, startLine, nextLine, content);
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
        var res = begin_align_1.SeparateInlineBlocksBeginAlign(state, startLine, nextLine, content, align);
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
    var align = 'center';
    var caption;
    var label = '';
    var captionFirst = false;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var lineText = state.src.slice(pos, max);
    var match = lineText.match(openTagH);
    if (!match) {
        match = lineText.match(openTag);
    }
    if (!match) {
        return false;
    }
    var type = match[1].trim() in TBegin ? match[1].trim() : null;
    if (!type) {
        return false;
    }
    var closeTag = utils_1.endTag(type);
    var matchE = lineText.match(closeTag);
    if (!matchE) {
        return false;
    }
    var content = lineText.slice(match.index + match[0].length, matchE.index);
    content = content.replace(alignTagG, '');
    matchE = content.match(captionTag);
    if (matchE) {
        caption = matchE[1];
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
    matchE = content.match(labelTag);
    if (matchE) {
        label = matchE[1];
        content = content.replace(labelTagG, '');
    }
    state.parentType = 'paragraph';
    state.env.label = label;
    state.env.caption = caption;
    state.env.align = align;
    StatePushPatagraphOpenTable(state, startLine, startLine, type);
    if (captionFirst) {
        StatePushCaptionTable(state, type);
    }
    StatePushTableContent(state, startLine, startLine + 1, content, align, type);
    if (!captionFirst) {
        StatePushCaptionTable(state, type);
    }
    state.push('paragraph_close', 'div', -1);
    state.line = startLine + 1;
    return true;
};
exports.BeginTable = function (state, startLine, endLine) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return false;
    }
    var content = '';
    var resText = '';
    var isCloseTagExist = false;
    var startTabular = 0;
    var match = lineText.match(openTagH);
    if (!match) {
        match = lineText.match(openTag);
    }
    if (!match) {
        return false;
    }
    var type = match[1].trim() in TBegin ? match[1].trim() : null;
    if (!type) {
        return false;
    }
    var closeTag = utils_1.endTag(type);
    //debugger
    if (closeTag.test(lineText)) {
        if (InlineBlockBeginTable(state, startLine)) {
            return true;
        }
    }
    var align = 'center';
    var caption;
    var label = '';
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
        if (closeTag.test(lineText)) {
            isCloseTagExist = true;
            if (state.isEmpty(nextLine + 1)) {
                break;
            }
        }
        resText += lineText;
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
    content = resText.replace(alignTagG, '');
    matchE = content.match(captionTag);
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
    matchE = content.match(labelTag);
    if (matchE) {
        label = matchE[1];
        content = content.replace(labelTagG, '');
    }
    state.parentType = 'paragraph';
    state.env.label = label;
    state.env.caption = caption;
    state.env.align = align;
    StatePushPatagraphOpenTable(state, startLine, nextLine, type);
    if (captionFirst) {
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
    StatePushTableContent(state, startLine, nextLine, content, align, type);
    if (!captionFirst) {
        StatePushCaptionTable(state, type);
    }
    state.push('paragraph_close', 'div', -1);
    state.line = nextLine + 1;
    return true;
};
//# sourceMappingURL=begin-table.js.map
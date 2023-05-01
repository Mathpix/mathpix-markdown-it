"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderInlineContent = exports.headingSection = exports.setTextCounterSection = exports.resetTextCounter = exports.resetCounter = exports.subSubCount = exports.subCount = exports.sectionCount = void 0;
var tslib_1 = require("tslib");
var isSpace = require('markdown-it/lib/common/utils').isSpace;
var render_tabular_1 = require("./md-renderer-rules/render-tabular");
var consts_1 = require("./common/consts");
var common_1 = require("./common");
var utils_1 = require("./utils");
var labels_1 = require("./common/labels");
exports.sectionCount = 0;
exports.subCount = 0;
exports.subSubCount = 0;
var isNewSect = false;
var isNewSubSection = false;
exports.resetCounter = function () {
    exports.resetTextCounter();
};
exports.resetTextCounter = function () {
    exports.sectionCount = 0;
    exports.subCount = 0;
    exports.subSubCount = 0;
};
exports.setTextCounterSection = function (envName, num) {
    switch (envName) {
        case "section":
            exports.sectionCount = num;
            break;
        case "subsection":
            exports.subCount = num;
            break;
        case "subsubsection":
            exports.subSubCount = num;
            break;
    }
};
var separatingSpan = function (state, startLine, endLine, silent) {
    var lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    var markerBegin = RegExp('^</?(span)(?=(\\s|>|$))', 'i');
    if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
        return false;
    }
    lineText = state.src.slice(pos, max);
    var sMatch = lineText.match(markerBegin);
    if (!sMatch) {
        return false;
    }
    var sMatchEnd = lineText.match(consts_1.closeTagSpan);
    if (!sMatchEnd) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    var nextPos = pos + sMatchEnd.index + sMatchEnd[0].length;
    if (nextPos < max) {
        while (nextPos < max) {
            var ch = state.src.charCodeAt(nextPos);
            if (ch !== 0x20 /* space */) {
                break;
            }
            nextPos++;
        }
    }
    var content = state.src.slice(pos, nextPos);
    var match = content.match(consts_1.reSpan);
    if (!match || match.length < 3) {
        return false;
    }
    state.tShift[startLine] += content.length;
    var token = state.push('inline', '', 0);
    token.content = content;
    token.children = [];
    // state.pos = nextPos;
    return true;
};
/**
 * To add an unnumbered section to the table of contents, use the \addcontentsline command like this:
 * \addcontentsline{toc}{section}{Unnumbered Section}
 * */
var addContentsLineBlock = function (state, startLine, endLine, silent) {
    var _a, _b;
    var token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    var startPos = 0;
    var nextLine = startLine + 1;
    var latex = '';
    lineText = state.src.slice(pos, max).trim();
    if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
        return false;
    }
    var match = lineText
        .slice(startPos)
        .match(consts_1.reAddContentsLine);
    if (!match) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    var envExp = ((_a = match.groups) === null || _a === void 0 ? void 0 : _a.exp) ? match.groups.exp : match[1];
    if (envExp !== 'toc') {
        return false;
    }
    var envUnit = ((_b = match.groups) === null || _b === void 0 ? void 0 : _b.unit) ? match.groups.unit : match[2];
    if (!['section', 'subsection', 'subsubsection'].includes(envUnit)) {
        return false;
    }
    startPos += match[0].length;
    latex = match[0];
    // nextPos += match[0].length;
    // \addcontentsline{toc}{section} {Unnumbered Section}
    //                               ^^ skipping these spaces
    for (; startPos < max; startPos++) {
        var code = lineText.charCodeAt(startPos);
        if (!isSpace(code) && code !== 0x0A) {
            break;
        }
    }
    if (startPos >= max) {
        return false;
    }
    // \addcontentsline{toc}{section}{Unnumbered Section}
    //                               ^^ should be { 
    if (lineText.charCodeAt(startPos) !== 123 /* { */) {
        return false;
    }
    var _c = common_1.findEndMarker(lineText, startPos), _d = _c.res, res = _d === void 0 ? false : _d, _e = _c.content, content = _e === void 0 ? '' : _e, _f = _c.nextPos, nextPos = _f === void 0 ? 0 : _f;
    var resString = content;
    var hasEndMarker = false;
    var last = nextLine;
    var inlineStr = '';
    if (!res) {
        for (; nextLine <= endLine; nextLine++) {
            if (lineText === '') {
                break;
            }
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            var _g = common_1.findEndMarker(lineText, -1, "{", "}", true), _h = _g.res, res_1 = _h === void 0 ? false : _h, _j = _g.content, content_1 = _j === void 0 ? '' : _j, _k = _g.nextPos, nextPos_1 = _k === void 0 ? 0 : _k;
            if (res_1) {
                resString += resString ? ' ' : '';
                resString += content_1;
                hasEndMarker = true;
                if (nextPos_1 && nextPos_1 < lineText.length) {
                    inlineStr = lineText.slice(nextPos_1);
                }
                break;
            }
            resString += resString ? ' ' : '';
            resString += lineText;
        }
        last = nextLine + 1;
    }
    else {
        hasEndMarker = true;
        last = nextLine;
        if (nextPos && nextPos < lineText.length) {
            inlineStr = lineText.slice(nextPos);
        }
    }
    if (!hasEndMarker) {
        return false;
    }
    var level;
    switch (envUnit) {
        case 'section':
            level = 2;
            break;
        case 'subsection':
            level = 3;
            break;
        case 'subsubsection':
            level = 4;
            break;
    }
    state.line = last;
    token = state.push('addcontentsline_open', 'div', 1);
    if (state.md.options.forLatex) {
        token.latex = latex + '{';
    }
    token.map = [startLine, state.line];
    token.envLevel = level;
    token.attrJoin('class', 'addcontentsline');
    token.attrSet('style', 'margin-top: 0; margin-bottom: 0;');
    token = state.push('inline', '', 0);
    token.content = resString;
    token.type = "addcontentsline";
    token.map = [startLine, state.line];
    if (state.md.options.forLatex) {
        token.latex = resString;
    }
    var children = [];
    state.md.inline.parse(token.content.trim(), state.md, state.env, children);
    token.children = children;
    token = state.push('addcontentsline_close', 'div', -1);
    token.envLevel = level;
    if (state.md.options.forLatex) {
        token.latex = '}';
    }
    if (inlineStr && inlineStr.trim()) {
        token = state.push('inline', '', 0);
        token.content = inlineStr;
        token.children = [];
    }
    return true;
};
exports.headingSection = function (state, startLine, endLine, silent) {
    var _a;
    var token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var startPos = 0, type, className = '', is_numerable = false, beginMarker = "{", level = 1;
    lineText = state.src.slice(pos, max).trim();
    if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
        return false;
    }
    var match = lineText
        .slice(++startPos)
        .match(/^(?:title|section\*|section|subsection\*|subsection|subsubsection\*|subsubsection)/);
    if (!match) {
        return false;
    }
    var attrStyle = '';
    var isUnNumbered = false;
    startPos += match[0].length;
    switch (match[0]) {
        case "title":
            level = 1;
            type = "title";
            className = "main-title";
            attrStyle = 'text-align: center; margin: 0 auto; line-height: 1.2; margin-bottom: 1em;';
            break;
        case "section":
            level = 2;
            type = "section";
            is_numerable = true;
            isNewSect = true;
            className = "section-title";
            attrStyle = 'margin-top: 1.5em;';
            break;
        case "subsection":
            isNewSubSection = true;
            level = 3;
            type = "subsection";
            className = "sub_section-title";
            break;
        case "subsubsection":
            level = 4;
            type = "subsubsection";
            className = "sub_sub_section-title";
            break;
        case "section*":
            isUnNumbered = true;
            level = 2;
            type = "section";
            className = "section-title";
            attrStyle = 'margin-top: 1.5em;';
            break;
        case "subsection*":
            isUnNumbered = true;
            level = 3;
            type = "subsection";
            className = "sub_section-title";
            break;
        case "subsubsection*":
            isUnNumbered = true;
            level = 4;
            type = "subsubsection";
            className = "sub_sub_section-title";
            break;
        default:
            break;
    }
    if (lineText[startPos] !== beginMarker) {
        return false;
    }
    var _b = common_1.findEndMarker(lineText, startPos), _c = _b.res, res = _c === void 0 ? false : _c, _d = _b.content, content = _d === void 0 ? '' : _d, _e = _b.nextPos, nextPos = _e === void 0 ? 0 : _e;
    var resString = content;
    resString = resString.split('\\\\').join('\n');
    var hasEndMarker = false;
    var last = nextLine;
    var inlineStr = '';
    if (!res) {
        for (; nextLine <= endLine; nextLine++) {
            if (lineText === '') {
                break;
            }
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            var _f = common_1.findEndMarker(lineText, -1, "{", "}", true), _g = _f.res, res_2 = _g === void 0 ? false : _g, _h = _f.content, content_2 = _h === void 0 ? '' : _h, _j = _f.nextPos, nextPos_2 = _j === void 0 ? 0 : _j;
            if (res_2) {
                resString += resString ? ' ' : '';
                content_2 = content_2.split('\\\\').join('\n');
                resString += content_2;
                hasEndMarker = true;
                if (nextPos_2 && nextPos_2 < lineText.length) {
                    inlineStr = lineText.slice(nextPos_2);
                }
                break;
            }
            resString += resString ? ' ' : '';
            lineText = lineText.split('\\\\').join('\n');
            resString += lineText;
        }
        last = nextLine + 1;
    }
    else {
        hasEndMarker = true;
        last = nextLine;
        if (nextPos && nextPos < lineText.length) {
            inlineStr = lineText.slice(nextPos);
        }
    }
    if (!hasEndMarker) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    state.line = last;
    token = state.push('heading_open', 'h' + String(level), 1);
    if (state.md.options.forLatex) {
        token.latex = type;
    }
    token.markup = '########'.slice(0, level);
    token.map = [startLine, state.line];
    token.attrJoin('type', type);
    token.isUnNumbered = isUnNumbered;
    if (isUnNumbered) {
        token.attrJoin('data-unnumbered', "true");
    }
    token.attrJoin('class', className);
    if (((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx) && attrStyle) {
        token.attrSet('style', attrStyle);
    }
    token = state.push('inline', '', 0);
    token.content = resString;
    token.type = type;
    token.is_numerable = is_numerable;
    token.isUnNumbered = isUnNumbered;
    token.map = [startLine, state.line];
    var children = [];
    state.md.inline.parse(token.content.trim(), state.md, state.env, children);
    token.children = children;
    if (type === "section" && !isUnNumbered) {
        exports.sectionCount = exports.sectionCount ? exports.sectionCount + 1 : 1;
        state.env.section = exports.sectionCount;
        token.section = exports.sectionCount;
        state.env.number = token.section;
    }
    if (type === "subsection" && !isUnNumbered) {
        token.isNewSect = isNewSect;
        isNewSect = false;
        exports.subCount = !token.isNewSect
            ? exports.subCount ? exports.subCount + 1 : 1 : 1;
        state.env.subsection = exports.subCount;
        token.section = exports.sectionCount;
        token.subsection = exports.subCount;
        state.env.number = token.section + '.' + token.subsection;
    }
    if (type === "subsubsection" && !isUnNumbered) {
        token.isNewSubSection = isNewSubSection;
        isNewSubSection = false;
        if (isNewSect) {
            token.isNewSect = isNewSect;
            isNewSect = false;
            if (state.env.hasOwnProperty('subsection') && state.env.subsection === exports.subCount) {
                exports.subCount = 0;
                state.env.subsection = exports.subCount;
            }
            exports.subSubCount = 1;
        }
        else {
            exports.subSubCount = !token.isNewSubSection
                ? exports.subSubCount ? exports.subSubCount + 1 : 1 : 1;
        }
        state.env.subsubsection = exports.subSubCount;
        token.section = exports.sectionCount;
        token.subsection = exports.subCount;
        token.subsubsection = exports.subSubCount;
        state.env.number = token.section + '.' + token.subsection + '.' + token.subsubsection;
    }
    if (!isUnNumbered) {
        token.uuid = utils_1.uid();
        token.currentTag = {
            type: type,
            number: state.env.number,
            tokenUuidInParentBlock: token.uuid
        };
        state.env.type = type;
        state.env.lastTag = tslib_1.__assign({}, token.currentTag);
    }
    token = state.push('heading_close', 'h' + String(level), -1);
    token.isUnNumbered = isUnNumbered;
    token.markup = '########'.slice(0, level);
    state.parentType = 'paragraph';
    if (state.md.options.forLatex) {
        token.latex = type;
    }
    if (inlineStr && inlineStr.trim()) {
        token = state.push('inline', '', 0);
        token.content = inlineStr;
        token.children = [];
    }
    return true;
};
var abstractBlock = function (state, startLine, endLine, silent) {
    var isBlockOpened = false;
    var token;
    var content;
    var terminate;
    var openTag = /\\begin{abstract}/;
    var closeTag = /\\end{abstract}/;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var terminatorRules = state.md.block.ruler.getRules('paragraph');
    var lineText = state.src.slice(pos, max);
    var isCloseTagExist = false;
    if (!openTag.test(lineText)) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    var resString = '';
    var abs = openTag.test(lineText);
    var inline = '';
    var lastLine = '';
    var match = lineText.match(openTag);
    if (match) {
        inline = lineText.slice(match.index + match[0].length);
    }
    for (; nextLine < endLine; nextLine++) {
        if (closeTag.test(lineText)) {
            lineText += '\\n';
            break;
        }
        isBlockOpened = true;
        if (lineText === '') {
            resString += '\n';
        }
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        lastLine = state.src.slice(pos, max);
        if (abs) {
            if (closeTag.test(lineText)) {
                isBlockOpened = false;
                abs = false;
                isCloseTagExist = true;
            }
            else {
                resString += resString ? ' ' : '';
                resString += lineText;
            }
        }
        else {
            if (state.isEmpty(nextLine)) {
                break;
            }
        }
        if (openTag.test(lineText)) {
            if (isBlockOpened) {
                return false;
            }
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
        // Some tags can terminate paragraph without empty line.
        terminate = false;
        for (var i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
            }
        }
        if (terminate) {
            break;
        }
    }
    if (!isCloseTagExist) {
        return false;
    }
    var strBeforeEnd = '';
    var strAfterEnd = '';
    if (lastLine) {
        var matchEnd = lastLine.match(closeTag);
        if (matchEnd) {
            strBeforeEnd = lastLine.slice(0, matchEnd.index);
            strAfterEnd = lastLine.slice(matchEnd.index + matchEnd[0].length);
        }
    }
    content = resString;
    if (inline && inline.trim()) {
        content = inline + content;
    }
    if (strBeforeEnd && strBeforeEnd.trim()) {
        content += strBeforeEnd;
    }
    var contentList = content.split('\n');
    var tokenContent = contentList.filter(function (item) {
        return item.trim().length > 0;
    });
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, nextLine];
    token.attrSet('class', 'abstract');
    token.attrSet('style', 'width: 80%; margin: 0 auto; margin-bottom: 1em; font-size: .9em;');
    token = state.push('heading_open', 'h4', 1);
    token.markup = '########'.slice(0, 4);
    token.attrSet('id', 'abstract_head');
    token.attrSet('class', 'abstract_head');
    token.attrSet('style', 'text-align: center;');
    token = state.push('text', '', 0);
    token.content = 'Abstract';
    token.children = [];
    token = state.push('heading_close', 'h4', -1);
    for (var i = 0; i < tokenContent.length; i++) {
        token = state.push('paragraph_open', 'p', 1);
        token.attrSet('style', 'text-indent: 1em;');
        token = state.push('inline', '', 0);
        token.content = tokenContent[i].trim();
        token.map = [startLine, state.line];
        token.children = [];
        token = state.push('paragraph_close', 'p', -1);
    }
    token = state.push('paragraph_close', 'div', -1);
    if (strAfterEnd && strAfterEnd.trim()) {
        token = state.push('inline', '', 0);
        token.content = strAfterEnd;
        token.children = [];
    }
    state.line = nextLine;
    return true;
};
var pageBreaksBlock = function (state, startLine, endLine, silent) {
    var token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var startPos = 0;
    lineText = state.src.slice(pos, max).trim();
    if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
        return false;
    }
    var match = lineText
        .slice(++startPos)
        .match(/^(?:pagebreak|clearpage|newpage)/);
    if (!match) {
        return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
        return true;
    }
    startPos += match[0].length;
    var strAfterEnd = '';
    if (lineText.length > startPos) {
        strAfterEnd = lineText.slice(startPos);
    }
    if (state.md.options.showPageBreaks || (strAfterEnd === null || strAfterEnd === void 0 ? void 0 : strAfterEnd.trim())) {
        token = state.push('paragraph_open', 'div', 1);
        token.map = [startLine, nextLine];
    }
    token = state.push("pagebreak", "", 0);
    token.content = '';
    if (state.md.options.forLatex) {
        token.latex = '\\' + match[0];
        if (!strAfterEnd || !strAfterEnd.trim()) {
            if (state.isEmpty(nextLine)) {
                token.latex += '\n\n';
            }
            else {
                token.latex += '\n';
            }
        }
    }
    token.children = [];
    if (strAfterEnd === null || strAfterEnd === void 0 ? void 0 : strAfterEnd.trim()) {
        token = state.push('inline', '', 0);
        token.content = strAfterEnd;
        token.children = [];
    }
    if (state.md.options.showPageBreaks || (strAfterEnd === null || strAfterEnd === void 0 ? void 0 : strAfterEnd.trim())) {
        state.push('paragraph_close', 'div', -1);
    }
    state.line = nextLine;
    return true;
};
var textAuthor = function (state) {
    var _a;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startPos)
        .match(/^(?:author)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startPos += match[0].length;
    var _b = common_1.findEndMarker(state.src, startPos), _c = _b.res, res = _c === void 0 ? false : _c, _d = _b.content, content = _d === void 0 ? '' : _d, _e = _b.nextPos, nextPos = _e === void 0 ? 0 : _e;
    if (!res) {
        return false;
    }
    var type = "author";
    var arrtStyle = 'text-align: center; margin: 0 auto; display: flex; justify-content: center; flex-wrap: wrap;';
    var token = state.push(type, "", 0);
    if (((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx) && arrtStyle) {
        token.attrSet('style', arrtStyle);
    }
    token.content = content;
    token.children = [];
    var columns = content.split('\\and');
    for (var i = 0; i < columns.length; i++) {
        var column = columns[i]
            ? columns[i].trim()
            : '';
        var tokenAuthorColumn = {};
        tokenAuthorColumn.type = 'author_column';
        tokenAuthorColumn.content = column;
        tokenAuthorColumn.children = [];
        var colArr = column.split('\\\\');
        if (colArr && colArr.length) {
            for (var j = 0; j < colArr.length; j++) {
                var item = colArr[j] ? colArr[j].trim() : '';
                var arrItem = item.split('\n');
                arrItem = arrItem.map(function (item) { return item.trim(); });
                item = arrItem.join(' ');
                var newToken = {};
                newToken.type = 'author_item';
                newToken.content = item;
                var children = [];
                state.md.inline.parse(item, state.md, state.env, children);
                newToken.children = children;
                tokenAuthorColumn.children.push(newToken);
            }
        }
        token.children.push(tokenAuthorColumn);
    }
    state.pos = nextPos;
    return true;
};
var textTypes = function (state) {
    var _a;
    var startPos = state.pos;
    var type = '';
    var arrtStyle = '';
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startPos)
        .match(/^(?:textit|textbf|texttt)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startPos += match[0].length;
    switch (match[0]) {
        case "textit":
            type = "textit";
            break;
        case "textbf":
            type = "textbf";
            break;
        case "texttt":
            type = "texttt";
            break;
        default:
            break;
    }
    if (!type || type === '') {
        return false;
    }
    var _b = common_1.findEndMarker(state.src, startPos), _c = _b.res, res = _c === void 0 ? false : _c, _d = _b.content, content = _d === void 0 ? '' : _d, _e = _b.nextPos, nextPos = _e === void 0 ? 0 : _e;
    if (!res) {
        return false;
    }
    state.push(type + '_open', "", 0);
    var token = state.push(type, "", 0);
    if (((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx) && arrtStyle) {
        token.attrSet('style', arrtStyle);
    }
    token.content = content;
    token.children = [];
    var children = [];
    state.md.inline.parse(token.content.trim(), state.md, state.env, children);
    token.children = children;
    state.push(type + '_close', "", 0);
    state.pos = nextPos;
    return true;
};
var pageBreaks = function (state) {
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startPos)
        .match(/^(?:pagebreak|clearpage|newpage)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    var nextPos = startPos + match[0].length;
    var token = state.push("pagebreak", "", 0);
    token.content = '';
    if (state.md.options.forLatex) {
        token.latex = '\\' + match[0];
    }
    token.children = [];
    state.pos = nextPos;
    return true;
};
var linkifyURL = function (state) {
    var urlTag = /(?:(www|http:|https:)+[^\s]+[\w])/;
    var startPos = state.pos;
    var beginMarker = "{", endMarker = "}";
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startPos)
        .match(/^(?:url)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startPos += match[0].length;
    if (state.src[startPos] !== beginMarker) {
        return false;
    }
    var endMarkerPos = state.src.indexOf(endMarker, startPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    var token;
    var text = state.src.slice(startPos + 1, nextPos - endMarker.length);
    if (!text || text.trim().length === 0) {
        state.pos = nextPos;
        return true;
    }
    if (!state.md.linkify.test(text) || !urlTag.test(text)) {
        token = state.push('textUrl', '', 0);
        token.content = text;
        state.pos = nextPos;
        return true;
    }
    var links = state.md.linkify.match(text);
    var level = 1;
    var lastPos = 0;
    var pos;
    state.md.options.linkify = false;
    for (var ln = 0; ln < links.length; ln++) {
        var url = links[ln].url;
        var fullUrl = state.md.normalizeLink(url);
        if (!state.md.validateLink(fullUrl)) {
            continue;
        }
        var urlText = links[ln].text;
        if (!urlTag.test(urlText)) {
            pos = links[ln].index;
            if (pos > lastPos) {
                token = state.push('textUrl', '', 0);
                token.content = text.slice(lastPos, pos);
                token.level = level;
            }
            token = state.push('textUrl', '', 0);
            lastPos = links[ln].lastIndex;
            token.content = text.slice(pos, lastPos);
            token.level = level;
            continue;
        }
        if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
        }
        else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
        }
        else {
            urlText = state.md.normalizeLinkText(urlText);
        }
        pos = links[ln].index;
        if (pos > lastPos) {
            token = state.push('textUrl', '', 0);
            token.content = text.slice(lastPos, pos);
            token.level = level;
        }
        token = state.push('link_open', 'a', 1);
        token.attrs = [['href', fullUrl]];
        token.level = level++;
        token.markup = 'linkify';
        token.info = 'auto';
        token = state.push('text', '', 0);
        token.content = urlText;
        token.level = level;
        token = state.push('link_close', 'a', -1);
        token.level = --level;
        token.markup = 'linkify';
        token.info = 'auto';
        lastPos = links[ln].lastIndex;
    }
    if (lastPos < text.length) {
        token = state.push('textUrl', '', 0);
        token.content = text.slice(lastPos);
        token.level = level;
    }
    state.pos = nextPos;
    return true;
};
var renderDocTitle = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    var content = exports.renderInlineContent(token, options, env, slf);
    return content;
};
exports.renderInlineContent = function (token, options, env, slf) {
    var sContent = '';
    var content = '';
    if (token.children && token.children.length) {
        for (var i = 0; i < token.children.length; i++) {
            var tok = token.children[i];
            if (tok.children && tok.children.length > 1) {
                if (tok.type === "tabular_inline") {
                    content = render_tabular_1.renderTabularInline(token.children, tok, options, env, slf);
                }
                else {
                    content = slf.renderInline(tok.children, options, env);
                }
            }
            else {
                content = slf.renderInline([tok], options, env);
            }
            sContent += content;
        }
        return sContent;
    }
    return token.content;
};
var renderSectionTitle = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    var content = exports.renderInlineContent(token, options, env, slf);
    if (token.isUnNumbered) {
        return content;
    }
    var label = token.uuid ? labels_1.getLabelByUuidFromLabelsList(token.uuid) : null;
    var sectionNumber = token.is_numerable
        ? label
            ? "<span id=\"" + label.id + "\" class=\"section-number\">" + token.section + ". </span>"
            : "<span class=\"section-number\">" + token.section + ". </span>"
        : "";
    return "" + sectionNumber + content;
};
var renderSubsectionTitle = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    var content = exports.renderInlineContent(token, options, env, slf);
    if (token.isUnNumbered) {
        return content;
    }
    var label = token.uuid ? labels_1.getLabelByUuidFromLabelsList(token.uuid) : null;
    return label
        ? "<span id=\"" + label.id + "\" class=\"section-number\">" + token.section + ".</span><span class=\"sub_section-number\">" + token.subsection + ".</span> " + content
        : "<span class=\"section-number\">" + token.section + ".</span><span class=\"sub_section-number\">" + token.subsection + ".</span> " + content;
};
var renderSubSubsectionTitle = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    var content = exports.renderInlineContent(token, options, env, slf);
    if (token.isUnNumbered) {
        return content;
    }
    var label = token.uuid ? labels_1.getLabelByUuidFromLabelsList(token.uuid) : null;
    return label
        ? "<span id=\"" + label.id + "\" class=\"section-number\">" + token.section + ".</span><span class=\"sub_section-number\">" + token.subsection + "." + token.subsubsection + ".</span> " + content
        : "<span class=\"section-number\">" + token.section + ".</span><span class=\"sub_section-number\">" + token.subsection + "." + token.subsubsection + ".</span> " + content;
};
var getAuthorItemToken = function (tokens, index, options, env, slf) {
    var res = '';
    var token = tokens[index];
    var content = exports.renderInlineContent(token, options, env, slf);
    var attrStyle = options.forDocx
        ? ' display: block; text-align: center;'
        : '';
    res += attrStyle
        ? "<span style=\"" + attrStyle + "\">" + content + "</span>"
        : "<span>" + content + "</span>";
    return res;
};
var getAuthorColumnToken = function (tokens, index, options, env, slf) {
    var res = '';
    var token = tokens[index];
    var attrStyle = options.forDocx
        ? 'min-width: 30%; max-width: 50%; padding: 0 7px;'
        : '';
    var content = token.children && token.children.length
        ? slf.renderInline(token.children, options)
        : exports.renderInlineContent(token, options, env, slf);
    if (attrStyle) {
        res += "<p style=\"" + attrStyle + "\">" + content + "</p>";
    }
    else {
        res += "<p>" + content + "</p>";
    }
    return res;
};
var renderAuthorToken = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    var divStyle = options.forDocx
        ? token.attrGet('style')
        : '';
    var res = token.children && token.children.length
        ? slf.renderInline(token.children, options)
        : exports.renderInlineContent(token, options, env, slf);
    if (divStyle) {
        return "<div class=\"author\" style=\"" + divStyle + "\">\n          " + res + "\n        </div>";
    }
    else {
        return "<div class=\"author\">\n          " + res + "\n        </div>";
    }
};
var renderBoldText = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var content = exports.renderInlineContent(token, options, env, slf);
    return content;
};
var renderItalicText = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var content = exports.renderInlineContent(token, options, env, slf);
    return content;
};
var renderCodeInlineOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    return '<code' + slf.renderAttrs(token) + '>';
};
var renderCodeInlineClose = function () {
    return '</code>';
};
var renderCodeInline = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    // return escapeHtml(token.content);
    var content = exports.renderInlineContent(token, options, env, slf);
    return content;
};
var renderUrl = function (token) { return "<a href=\"" + token.content + "\">" + token.content + "</a>"; };
var renderTextUrl = function (token) {
    return "<a href=\"#\" class=\"text-url\">" + token.content + "</a>";
};
var renderPageBreaks = function (tokens, idx, options, env, slf) {
    if (env === void 0) { env = {}; }
    if (options === null || options === void 0 ? void 0 : options.showPageBreaks) {
        var html = "<div class=\"page-break d-flex\" style=\"display:flex; font-size:0.9rem;\">";
        var hrEl = "<hr style=\"flex-grow:1; border:0; border-top:0.025rem solid #999; margin:auto\"/>";
        html += hrEl;
        html += '<span style="padding-left:0.5rem; padding-right:0.5rem; color:#999;">' + 'Page Break' + '</span>';
        html += hrEl;
        html += '</div>';
        return html;
    }
    return '';
};
var mappingTextStyles = {
    textbf: "TextBold",
    textbf_open: "TextBoldOpen",
    textbf_close: "TextBoldClose",
    textit: "TextIt",
    textit_open: "TextItOpen",
    textit_close: "TextItClose",
    texttt: "texttt",
    texttt_open: "texttt_open",
    texttt_close: "texttt_close",
};
var mapping = {
    section: "Section",
    title: "Title",
    author: "Author",
    author_column: "authorColumn",
    author_item: "authorItem",
    subsection: "Subsection",
    subsubsection: "Subsubsection",
    url: "Url",
    textUrl: "textUrl",
    addcontentsline: "addcontentsline"
};
exports.default = (function () {
    return function (md) {
        exports.resetCounter();
        md.block.ruler.before("heading", "headingSection", exports.headingSection, { alt: common_1.getTerminatedRules('headingSection') });
        md.block.ruler.before("heading", "addContentsLineBlock", addContentsLineBlock, { alt: common_1.getTerminatedRules('addContentsLineBlock') });
        md.block.ruler.before("headingSection", "separatingSpan", separatingSpan, { alt: common_1.getTerminatedRules('separatingSpan') });
        md.block.ruler.before("paragraphDiv", "abstractBlock", abstractBlock, { alt: common_1.getTerminatedRules('abstractBlock') });
        md.block.ruler.before("paragraphDiv", "pageBreaksBlock", pageBreaksBlock, { alt: common_1.getTerminatedRules('pageBreaksBlock') });
        md.inline.ruler.before("multiMath", "textTypes", textTypes);
        md.inline.ruler.before("textTypes", "textAuthor", textAuthor);
        md.inline.ruler.before('textTypes', 'linkifyURL', linkifyURL);
        md.inline.ruler.before('textTypes', 'pageBreaks', pageBreaks);
        Object.keys(mappingTextStyles).forEach(function (key) {
            md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
                switch (tokens[idx].type) {
                    case "textbf":
                        return renderBoldText(tokens, idx, options, env, slf);
                    case "textbf_open":
                        return '<strong>';
                    case "textbf_close":
                        return '</strong>';
                    case "textit":
                        return renderItalicText(tokens, idx, options, env, slf);
                    case "textit_open":
                        return '<em>';
                    case "textit_close":
                        return '</em>';
                    case "texttt":
                        return renderCodeInline(tokens, idx, options, env, slf);
                    case "texttt_open":
                        return renderCodeInlineOpen(tokens, idx, options, env, slf);
                    case "texttt_close":
                        return renderCodeInlineClose();
                    default:
                        return '';
                }
            };
        });
        Object.keys(mapping).forEach(function (key) {
            md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
                if (env === void 0) { env = {}; }
                switch (tokens[idx].type) {
                    case "section":
                        return renderSectionTitle(tokens, idx, options, env, slf);
                    case "subsection":
                        return renderSubsectionTitle(tokens, idx, options, env, slf);
                    case "subsubsection":
                        return renderSubSubsectionTitle(tokens, idx, options, env, slf);
                    case "title":
                        return renderDocTitle(tokens, idx, options, env, slf);
                    case "author":
                        return renderAuthorToken(tokens, idx, options, env, slf);
                    case "author_column":
                        return getAuthorColumnToken(tokens, idx, options, env, slf);
                    case "author_item":
                        return getAuthorItemToken(tokens, idx, options, env, slf);
                    case "url":
                        return renderUrl(tokens[idx]);
                    case "textUrl":
                        return renderTextUrl(tokens[idx]);
                    case "addcontentsline":
                        return '';
                    default:
                        return '';
                }
            };
        });
        md.renderer.rules.pagebreak = function (tokens, idx, options, env, slf) {
            if (env === void 0) { env = {}; }
            return renderPageBreaks(tokens, idx, options, env, slf);
        };
        md.renderer.rules.s_open = function (tokens, idx, options, env, self) {
            var i = 0;
            while ((idx + i) < tokens.length && tokens[idx + i].type !== 's_close') {
                var token = tokens[idx + i];
                token.attrSet('style', 'text-decoration: line-through; color: inherit;');
                i++;
            }
            return self.renderToken(tokens, idx, options);
        };
        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
            if (options.openLinkInNewWindow) {
                tokens[idx].attrPush(['target', '_blank']);
                tokens[idx].attrPush(['rel', 'noopener']);
            }
            else {
                tokens[idx].attrPush(['target', '_self']);
            }
            if (!tokens[idx + 1] || !tokens[idx + 1].content) {
                tokens[idx].attrPush([
                    'style', 'word-break: break-word'
                ]);
                return self.renderToken(tokens, idx, options);
            }
            if (tokens[idx + 1].content.length > 40 && !tokens[idx + 1].content.includes(' ')) {
                tokens[idx].attrPush([
                    'style', 'word-break: break-all'
                ]);
            }
            else if (!tokens[idx + 1].content.includes(' ')) {
                tokens[idx].attrPush([
                    'style', 'display: inline-block'
                ]);
            }
            else {
                tokens[idx].attrPush([
                    'style', 'word-break: break-word'
                ]);
            }
            return self.renderToken(tokens, idx, options);
        };
    };
});
//# sourceMappingURL=mdPluginText.js.map
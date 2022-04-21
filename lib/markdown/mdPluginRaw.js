"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEndMarkerPos = void 0;
var mathjax_1 = require("../mathjax/");
var tabular_1 = require("./md-inline-rule/tabular");
var render_tabular_1 = require("./md-renderer-rules/render-tabular");
var md_ascii_1 = require("./md-ascii");
var utils_1 = require("./utils");
var consts_1 = require("./common/consts");
var mathNumber = [];
function MathML(state, silent, pos, endMarker, type) {
    if (endMarker === void 0) { endMarker = ''; }
    if (type === void 0) { type = "inline_mathML"; }
    var markerBegin = RegExp('^</?(math)(?=(\\s|>|$))', 'i');
    var startMathPos = pos;
    var beginMathPos = pos;
    var endMathMlPos, endMarkerPos, nextPos, token, content, match;
    var endMathMl = "</math>";
    if (!markerBegin.test(state.src.slice(startMathPos))) {
        return false;
    }
    if (state.src.slice(startMathPos, state.src.indexOf('>', startMathPos)).indexOf('block') > -1) {
        type = "display_mathML";
    }
    match = state.src
        .slice(++startMathPos)
        .match(/^(?:math)/);
    if (!match) {
        return false;
    }
    startMathPos += match[0].length;
    endMathMlPos = state.src.indexOf(endMathMl, startMathPos);
    if (endMathMlPos === -1) {
        return false;
    }
    if (endMarker && endMarker !== '') {
        endMarkerPos = state.src.indexOf(endMarker, endMathMlPos);
        nextPos = endMarkerPos + endMarker.length;
        content = state.src.slice(beginMathPos, endMarkerPos);
    }
    else {
        nextPos = endMathMlPos + endMathMl.length;
        content = state.src.slice(beginMathPos, endMathMlPos);
    }
    if (!silent) {
        token = state.push(type, "", 0);
        token.content = content.trim();
    }
    state.pos = nextPos;
    return true;
}
function inlineMathML(state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x3C /* < */) {
        return false;
    }
    return MathML(state, silent, startMathPos);
}
// BLOCK
function mathMLBlock(state, startLine /*, endLine*/) {
    var markerBegin = RegExp('^</?(math)(?=(\\s|>|$))', 'i');
    var content, terminate, i, l, token, oldParentType, lineText, mml, nextLine = startLine + 1, terminatorRules = state.md.block.ruler.getRules('paragraph'), endLine = state.lineMax, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    oldParentType = state.parentType;
    state.parentType = 'paragraph';
    if (!state.md.options.html) {
        return false;
    }
    if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
        return false;
    }
    lineText = state.src.slice(pos, max);
    mml = consts_1.openTagMML.test(lineText);
    if (!markerBegin.test(lineText)) {
        return false;
    }
    // jump line-by-line until empty one or EOF
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (mml) {
            if (consts_1.closeTagMML.test(lineText)) {
                mml = false;
            }
        }
        else {
            if (state.isEmpty(nextLine)) {
                break;
            }
        }
        if (consts_1.openTagMML.test(lineText)) {
            mml = true;
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
        for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
            }
        }
        if (terminate) {
            break;
        }
    }
    content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
    state.line = nextLine;
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, state.line];
    token = state.push('inline', '', 0);
    token.content = content;
    token.map = [startLine, state.line];
    token.children = [];
    token = state.push('paragraph_close', 'div', -1);
    state.parentType = oldParentType;
    return true;
}
;
function multiMath(state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startMathPos)
        .match(/^(?:\\\[|\[|\\\(|\(|begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\})/); // eslint-disable-line
    if (!match) {
        return false;
    }
    if (match[1] && (match[1] === 'itemize' || match[1] === 'enumerate')) {
        return false;
    }
    startMathPos += match[0].length;
    var type, endMarker, includeMarkers; // eslint-disable-line
    if (match[0] === "\\[") {
        type = "display_math";
        endMarker = "\\\\]";
    }
    else if (match[0] === "\[") {
        type = "display_math";
        endMarker = "\\]";
    }
    else if (match[0] === "\\(") {
        type = "inline_math";
        endMarker = "\\\\)";
    }
    else if (match[0] === "\(") {
        type = "inline_math";
        endMarker = "\\)";
    }
    else if (match[0].includes("eqref")) {
        type = "reference_note";
        endMarker = "";
    }
    else if (match[0].includes("ref")) {
        type = "reference_note";
        endMarker = "";
    }
    else if (match[1] && match[1] !== 'abstract') {
        if (match[1].indexOf('*') > 0) {
            type = "equation_math_not_number";
        }
        else {
            type = "equation_math";
        }
        endMarker = "\\end{" + match[1] + "}";
        includeMarkers = true;
    }
    var endMarkerPos = state.src.indexOf(endMarker, startMathPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    if (state.src.slice(startMathPos, endMarkerPos).trim().indexOf('<math') === 0) {
        if (MathML(state, silent, state.src.indexOf('<math', startMathPos), endMarker, type === 'inline_math' ? "inline_mathML" : "display_mathML")) {
            return true;
        }
    }
    if (!silent) {
        var token = state.push(type, "", 0);
        if (state.md.options.forLatex) {
            if (match[1]) {
                token.markup = match[1];
            }
            else {
                token.markup = endMarker;
            }
        }
        if (includeMarkers) {
            token.content = state.src.slice(state.pos, nextPos);
        }
        else if (type === "reference_note") {
            if (state.md.options.forLatex) {
                token.markup = match[0];
            }
            token.content = match ? match[2] || match[3] : "";
        }
        else {
            token.content = state.src.slice(startMathPos, endMarkerPos);
        }
        if (state.env.tabulare) {
            token.return_asciimath = true;
        }
        if (state.md.options.outMath && state.md.options.outMath.include_table_markdown) {
            token.latex = '\\' + match.input;
        }
    }
    state.pos = nextPos;
    return true;
}
exports.findEndMarkerPos = function (str, endMarker, i) {
    var index;
    index = str.indexOf(endMarker, i);
    if (index > 0) {
        if (str.charCodeAt(index - 1) === 0x5c /* \ */) {
            index = exports.findEndMarkerPos(str, endMarker, index + 1);
        }
    }
    return index;
};
function refs(state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startMathPos)
        .match(/^(?:\\\[|\[|\\\(|\(|$|$$)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startMathPos += match[0].length;
    var type, endMarker; // eslint-disable-line
    if (match[0] === "\\[") {
        type = "display_math";
        endMarker = "\\\\]";
    }
    else if (match[0] === "\[") {
        type = "display_math";
        endMarker = "\\]";
    }
    else if (match[0] === "$$") {
        type = "display_math";
        endMarker = "$$";
    }
    else if (match[0] === "\\(") {
        type = "inline_math";
        endMarker = "\\\\)";
    }
    else if (match[0] === "\(") {
        type = "inline_math";
        endMarker = "\\)";
    }
    else if (match[0] === "$") {
        type = "inline_math";
        endMarker = "$";
    }
    var endMarkerPos = state.src.indexOf(endMarker, startMathPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    var matchRef = state.src.slice(startMathPos + 1, endMarkerPos)
        .match(/^(?:ref\{([^}]*)\})/);
    if (!matchRef) {
        return false;
    }
    if (!silent) {
        if (type === "display_math") {
            type = "reference_note_block";
        }
        else {
            type = "reference_note";
        }
        var token = state.push(type, "", 0);
        token.content = matchRef ? matchRef[1] : "";
    }
    state.pos = nextPos;
    return true;
}
function simpleMath(state, silent) {
    var pos, afterStartMarker, startMathPos = state.pos;
    var endMarker = "$";
    if (state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) {
        return false;
    }
    // Parse tex math according to http://pandoc.org/README.html#math
    pos = ++startMathPos;
    afterStartMarker = state.src.charCodeAt(pos); // eslint-disable-line
    if (afterStartMarker === 0x24 /* $ */) {
        endMarker = "$$";
        if (state.src.charCodeAt(++startMathPos) === 0x24 /* $ */) {
            // eslint-disable-line
            return false;
        }
    }
    else {
        // Skip if opening $ is succeeded by a space character
        if (afterStartMarker === 0x20 /* space */ ||
            afterStartMarker === 0x09 /* \t */ ||
            afterStartMarker === 0x0a /* \n */) {
            // eslint-disable-line
            return false;
        }
    }
    var endMarkerPos = exports.findEndMarkerPos(state.src, endMarker, startMathPos);
    if (endMarkerPos === -1) {
        return false;
    }
    if (state.src.charCodeAt(endMarkerPos - 1) === 0x5c /* \ */) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    if (endMarker.length === 1) {
        // Skip if $ is preceded by a space character
        var beforeEndMarker = state.src.charCodeAt(endMarkerPos - 1);
        if (beforeEndMarker === 0x20 /* space */ ||
            beforeEndMarker === 0x09 /* \t */ ||
            beforeEndMarker === 0x0a /* \n */) {
            return false;
        }
        // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
        var suffix = state.src.charCodeAt(nextPos);
        if (suffix >= 0x30 && suffix < 0x3a) {
            return false;
        }
    }
    if (state.src.slice(startMathPos, endMarkerPos).trim().indexOf('<math') === 0) {
        if (MathML(state, silent, state.src.indexOf('<math', startMathPos), endMarker, endMarker.length === 1 ? "inline_mathML" : "display_mathML")) {
            return true;
        }
    }
    if (!silent) {
        var token = state.push(endMarker.length === 1 ? "inline_math" : "display_math", "", 0);
        token.content = state.src.slice(startMathPos, endMarkerPos);
        if (state.env.tabulare) {
            token.return_asciimath = true;
        }
        if (state.md.options.forLatex) {
            token.markup = endMarker;
        }
        if (state.md.options.outMath && state.md.options.outMath.include_table_markdown) {
            token.latex = endMarker + token.content + endMarker;
        }
    }
    state.pos = nextPos;
    return true;
}
function usepackage(state, silent) {
    var str_usepackage = "usepackage";
    var str_geometry = "geometry";
    var beginMathPos = state.pos;
    if (state.src.charCodeAt(beginMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var startMathPos = state.src.indexOf(str_usepackage, beginMathPos);
    if (startMathPos < 0) {
        return false;
    }
    else {
        state.src = state.src.replace(/\s/g, '');
    }
    startMathPos += str_usepackage.length;
    var match = state.src
        .slice(startMathPos)
        .match(/^(?:\[)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startMathPos += match[0].length;
    var endMarker;
    if (match[0] === "[") {
        endMarker = "]";
    }
    var endContentPos = state.src.indexOf(endMarker, startMathPos);
    if (endContentPos === -1) {
        return false;
    }
    var content = state.src.slice(startMathPos, endContentPos);
    if (!content) {
        return false;
    }
    startMathPos = endContentPos + 1;
    match = state.src
        .slice(startMathPos)
        .match(/^(?:{)/); // eslint-disable-line
    if (!match) {
        return false;
    }
    startMathPos += match[0].length;
    endMarker = "}";
    var endMarkerPos = state.src.indexOf(endMarker, startMathPos);
    var usepackageName = state.src.slice(startMathPos, endMarkerPos);
    var type;
    if (usepackageName === str_geometry) {
        type = 'usepackage_geometry';
    }
    if (!type) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    if (!silent) {
        var token = state.push(type, "geometry", 0);
        token.content = content;
        token.hidden = true;
    }
    state.pos = nextPos;
    return true;
}
function extend(options, defaults) {
    return Object.keys(defaults).reduce(function (result, key) {
        if (result[key] === undefined) {
            result[key] = defaults[key];
        }
        return result;
    }, options);
}
var checkReference = function (data) {
    var match = data.match(/label\{([^}]*)\}/);
    return {
        tagId: match ? match[1] : "",
        math: data.replace(/\\label\{([^}]*)\}/, "")
    };
};
var renderMath = function (a, token, options) {
    var _a = checkReference(token.content), tagId = _a.tagId, math = _a.math;
    var isBlock = token.type !== 'inline_math';
    var mathEquation = null;
    var begin_number = mathjax_1.MathJax.GetLastEquationNumber() + 1;
    try {
        var cwidth = 1200;
        if (options && options.width && options.width > 0) {
            cwidth = options.width;
        }
        else {
            cwidth = utils_1.getWidthFromDocument(cwidth);
        }
        if (token.type === 'display_mathML' || token.type === 'inline_mathML') {
            mathEquation = mathjax_1.MathJax.TypesetMathML(math, {
                display: true,
                metric: { cwidth: cwidth },
                outMath: options.outMath,
                accessibility: options.accessibility
            });
        }
        else {
            if (token.return_asciimath) {
                var data = mathjax_1.MathJax.TypesetSvgAndAscii(math, {
                    display: isBlock,
                    metric: { cwidth: cwidth },
                    outMath: options.outMath,
                    mathJax: options.mathJax,
                    accessibility: options.accessibility
                });
                mathEquation = data.html;
                token.ascii = data.ascii;
            }
            else {
                mathEquation = mathjax_1.MathJax.Typeset(math, { display: isBlock, metric: { cwidth: cwidth },
                    outMath: options.outMath, mathJax: options.mathJax, forDocx: options.forDocx,
                    accessibility: options.accessibility
                });
            }
        }
    }
    catch (e) {
        console.error('ERROR MathJax =>', e.message, e);
        if (options.outMath && options.outMath.not_catch_errors) {
            throw ({
                message: e.message,
                error: e
            });
        }
        if (token.type === 'display_mathML' || token.type === 'inline_mathML') {
            mathEquation = "<span class=\"math-error\">" + math + "</span>";
        }
        else {
            mathEquation = math;
            return "<p class=\"math-error\">" + mathEquation + "</p>";
        }
    }
    if (token.type === "equation_math_not_number") {
        if (tagId) {
            mathNumber[tagId] = "[" + 0 + "]";
        }
    }
    else {
        if (token.type === "equation_math") {
            if (tagId) {
                mathNumber[tagId] = "[" + begin_number + "]";
            }
        }
    }
    var tagRef = (tagId && (tagId) !== '') ? "id=" + encodeURIComponent(tagId) : '';
    if (token.type === "equation_math") {
        var number = mathjax_1.MathJax.GetLastEquationNumber();
        if (begin_number === number) {
            return "<span " + tagRef + " class=\"math-block equation-number " + tagRef + "\" number=\"" + number + "\">" + mathEquation + "</span>";
        }
        else {
            return "<span " + tagRef + " class=\"math-block equation-number " + tagRef + "\" number=\"" + begin_number + "," + number + "\">" + mathEquation + "</span>";
        }
    }
    else {
        return token.type === "inline_math" || token.type === "inline_mathML"
            ? tagRef
                ? "<span " + tagRef + " class=\"math-inline " + tagRef + "\">" + mathEquation + "</span>"
                : "<span class=\"math-inline " + tagRef + "\">" + mathEquation + "</span>"
            : tagRef
                ? "<span " + tagRef + " class=\"math-block " + tagRef + "\">" + mathEquation + "</span>"
                : "<span class=\"math-block " + tagRef + "\">" + mathEquation + "</span>";
    }
};
var setStyle = function (str) {
    var arrStyle = str.replace('=', ':').replace(/\s/g, '').split(",");
    var newArr = [];
    arrStyle.map(function (item) {
        var newStr = '';
        //margin-bottom
        if (item.indexOf('top') >= 0) {
            newStr = item.replace('top', 'padding-top').replace('=', ':');
        }
        if (item.indexOf('bottom') >= 0) {
            newStr = item.replace('bottom', 'padding-bottom').replace('=', ':');
        }
        if (item.indexOf('left') >= 0) {
            newStr = item.replace('left', 'padding-left').replace('=', ':');
        }
        if (item.indexOf('right') >= 0) {
            newStr = item.replace('right', 'padding-right').replace('=', ':');
        }
        if (newStr) {
            newArr.push(newStr);
        }
        return newStr;
    });
    return newArr.join('; ');
};
var renderUsepackage = function (token, options) {
    if (token.type === "usepackage_geometry") {
        try {
            if (!document) {
                return '';
            }
        }
        catch (e) {
            return '';
        }
        var preview = document.getElementById('preview');
        if (options && options.renderElement && options.renderElement.preview) {
            preview = options.renderElement.preview;
        }
        if (!preview) {
            return '';
        }
        var content = token.content;
        var strStyle = setStyle(content);
        preview.removeAttribute("style");
        preview.setAttribute("style", strStyle);
        return "<span class=\"hidden\">" + strStyle + "</span>";
    }
    else {
        return '';
    }
};
var renderReference = function (token) {
    var id = encodeURIComponent(token.content);
    if (token.type === "reference_note_block") {
        return "<div class=\"math-block\"><a href=\"#" + id + "\"\n           style=\"cursor: pointer; text-decoration: none;\"\n           class=\"clickable-link\"\n           value=" + id + "\n        >" + (mathNumber[token.content] || '[' + token.content + ']') + " </a></div>";
    }
    else {
        return "<a href=\"#" + id + "\"\n           style=\"cursor: pointer; text-decoration: none;\"\n           class=\"clickable-link\"\n           value=" + id + "\n        >" + (mathNumber[token.content] || '[' + token.content + ']') + " </a>";
    }
};
var getCoutOpenCloseBranches = function (str, beginMarker, endMarker) {
    if (beginMarker === void 0) { beginMarker = '{'; }
    if (endMarker === void 0) { endMarker = '}'; }
    var openBrackets = 0;
    var openCode = 0;
    for (var i = 0; i < str.length; i++) {
        var chr = str[i];
        if (chr === '`') {
            if (openCode > 0) {
                openCode--;
            }
            else {
                openCode++;
            }
        }
        if (chr !== beginMarker && chr !== endMarker) {
            continue;
        }
        if (chr === beginMarker && openCode === 0) {
            openBrackets++;
            continue;
        }
        if (chr === endMarker && openCode === 0) {
            openBrackets--;
        }
    }
    return openBrackets;
};
function paragraphDiv(state, startLine /*, endLine*/) {
    var _a;
    // resetCounter();
    var isMathOpen = false;
    var openedAuthorBlock = false;
    var openBrackets = 0;
    // const pickStartTag: RegExp = /\\begin{(abstract|equation|equation\*|center|left|right|table|figure|tabular)}|\\\[/;
    // const pickEndTag: RegExp = /\\end{(abstract|equation|equation\*|center|left|right|table|figure|tabular)}|\\\]/;
    var pickStartTag = /\\begin{(abstract|center|left|right|table|figure|tabular)}/;
    var pickEndTag = /\\end{(abstract|center|left|right|table|figure|tabular)}/;
    var pickMathStartTag = /\\begin{(equation|equation\*)}|\\\[/;
    var pickMathEndTag = /\\end{(equation|equation\*)}|\\\]/;
    var mathStartTag = /\\begin{([^}]*)}|\\\[|\\\(/;
    var pickTag = /^\\(?:title|section|subsection)/;
    var listStartTag = /\\begin{(enumerate|itemize)}/;
    var content, terminate, i, l, token, oldParentType, lineText, mml, nextLine = startLine + 1, terminatorRules = state.md.block.ruler.getRules('paragraph'), endLine = state.lineMax, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    oldParentType = state.parentType;
    state.parentType = 'paragraph';
    lineText = state.src.slice(pos, max);
    mml = consts_1.openTagMML.test(lineText);
    if (lineText === '\\maketitle') {
        state.line = nextLine++;
        return true;
    }
    if (utils_1.includesSimpleMathTag(lineText)) {
        isMathOpen = true;
    }
    var listOpen = false;
    var isMath = false;
    var mathEndTag = null;
    // jump line-by-line until empty one or EOF
    for (; nextLine < endLine; nextLine++) {
        if (!isMathOpen && !isMath && mathStartTag.test(lineText) //&& !pickStartTag.test(lineText)
        ) {
            mathEndTag = utils_1.includesMultiMathBeginTag(lineText, mathStartTag);
            isMath = Boolean(mathEndTag);
        }
        if (isMath && mathEndTag && mathEndTag.test(lineText) //&& !pickEndTag.test(lineText)
        ) {
            if (utils_1.includesMultiMathTag(lineText, mathEndTag)) {
                isMath = false;
            }
        }
        var prewPos = state.bMarks[nextLine - 1] + state.tShift[nextLine - 1];
        var prewMax = state.eMarks[nextLine - 1];
        var prewLineText = state.src.slice(prewPos, prewMax);
        if (openedAuthorBlock
            && (prewLineText.indexOf('}') !== -1 || prewLineText.indexOf('{') !== -1)) {
            openBrackets += getCoutOpenCloseBranches(prewLineText);
            if (openBrackets === 0) {
                openedAuthorBlock = false;
                break;
            }
        }
        if (prewLineText.indexOf('\\author') !== -1) {
            openedAuthorBlock = true;
            openBrackets += getCoutOpenCloseBranches(prewLineText);
        }
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (listStartTag.test(prewLineText)) {
            listOpen = true;
        }
        if (utils_1.includesSimpleMathTag(lineText)) {
            isMathOpen = !isMathOpen;
        }
        if (mml) {
            if (consts_1.closeTagMML.test(lineText)) {
                mml = false;
            }
        }
        else {
            if (pickTag.test(prewLineText) || pickTag.test(lineText)) {
                break;
            }
            if (state.isEmpty(nextLine)
                || pickStartTag.test(lineText) || pickEndTag.test(prewLineText)
                || (!isMath && !openedAuthorBlock && (pickMathStartTag.test(lineText) || pickMathEndTag.test(prewLineText)))) {
                break;
            }
            if (listStartTag.test(lineText) && (prewLineText.indexOf('\\item') === -1 || !listOpen)) {
                break;
            }
            if (utils_1.includesSimpleMathTag(lineText) && isMathOpen || utils_1.includesSimpleMathTag(prewLineText) && !isMathOpen) {
                break;
            }
        }
        if (consts_1.openTagMML.test(lineText)) {
            mml = true;
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
        if (!isMath && !isMathOpen) {
            // Some tags can terminate paragraph without empty line.
            terminate = false;
            for (i = 0, l = terminatorRules.length; i < l; i++) {
                if (terminatorRules[i](state, nextLine, endLine, true)) {
                    terminate = true;
                    break;
                }
            }
            if (terminate) {
                break;
            }
        }
    }
    content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
    state.line = nextLine;
    token = state.push('paragraph_open', 'div', 1);
    if ((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx) {
        token.attrSet('style', 'margin-top: 0; margin-bottom: 1em;');
    }
    token.map = [startLine, state.line];
    token = state.push('inline', '', 0);
    token.content = content;
    token.map = [startLine, state.line];
    token.children = [];
    token = state.push('paragraph_close', 'div', -1);
    state.parentType = oldParentType;
    return true;
}
;
var latexCommands = [
    '\\title',
    '\\begin',
    '\\author',
    '\\section',
    '\\subsection',
    '\\url',
    '\\textit',
    '\\[',
    '\\abstract',
    '$$'
];
var codeBlock = function (state, startLine, endLine /*, silent*/) {
    var last;
    var token, lineText, nextLine = startLine + 1, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    if (state.sCount[startLine] - state.blkIndent < 4) {
        return false;
    }
    lineText = state.src.slice(pos, max);
    var findNotCodeTag = latexCommands.findIndex(function (item) {
        return (lineText.indexOf(item) === 0) || consts_1.openTagMML.test(lineText);
    });
    if (findNotCodeTag >= 0) {
        return false;
    }
    last = nextLine = startLine + 1;
    while (nextLine < endLine) {
        if (state.isEmpty(nextLine)) {
            nextLine++;
            continue;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
            nextLine++;
            last = nextLine;
            continue;
        }
        break;
    }
    state.line = last;
    token = state.push('code_block', 'code', 0);
    token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
    token.map = [startLine, state.line];
    return true;
};
var mapping = {
    math: "Math",
    inline_math: "InlineMath",
    display_math: "DisplayMath",
    equation_math: "EquationMath",
    equation_math_not_number: "EquationMathNotNumber",
    reference_note: "Reference_note",
    reference_note_block: "Reference_note block",
    tabular: "Tabular",
    tabular_inline: "Tabular_inline",
    // tsv: "TSV",
    usepackage_geometry: "Usepackage_geometry",
    display_mathML: "DisplayMathML",
    inline_mathML: "InlineMathML",
    ascii_math: "ascii_math"
};
exports.default = (function (options) {
    var defaults = {
        beforeMath: "",
        afterMath: "",
        beforeInlineMath: "\\(",
        afterInlineMath: "\\)",
        beforeDisplayMath: "\\[",
        afterDisplayMath: "\\]"
    };
    options = extend(options || {}, defaults);
    return function (md) {
        Object.assign(md.options, options);
        md.block.ruler.before("paragraph", "paragraphDiv", paragraphDiv);
        md.block.ruler.at("code", codeBlock);
        md.inline.ruler.before("escape", "usepackage", usepackage);
        md.block.ruler.before("html_block", "mathMLBlock", mathMLBlock);
        md.inline.ruler.before("html_inline", "mathML", inlineMathML);
        md.inline.ruler.before("escape", "refs", refs);
        md.inline.ruler.before("escape", "multiMath", multiMath);
        md.inline.ruler.before("multiMath", "inlineTabular", tabular_1.inlineTabular);
        md.inline.ruler.push("simpleMath", simpleMath);
        md.inline.ruler.before("multiMath", "asciiMath", md_ascii_1.asciiMath);
        md.inline.ruler.before("asciiMath", "backtickAsAsciiMath", md_ascii_1.backtickAsAsciiMath);
        Object.keys(mapping).forEach(function (key) {
            md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
                switch (tokens[idx].type) {
                    case "tabular":
                        return render_tabular_1.renderTabularInline(tokens, tokens[idx], options, env, slf);
                    case "tabular_inline":
                        return render_tabular_1.renderTabularInline(tokens, tokens[idx], options, env, slf);
                    // case "tsv":
                    //   return renderTSV(tokens, tokens[idx], options);
                    case "reference_note":
                        return renderReference(tokens[idx]);
                    case "reference_note_block":
                        return renderReference(tokens[idx]);
                    case "usepackage_geometry":
                        return renderUsepackage(tokens[idx], options);
                    case "ascii_math":
                        return md_ascii_1.renderAsciiMath(tokens, idx, options);
                    default:
                        return renderMath(tokens, tokens[idx], options);
                }
            };
        });
    };
});
//# sourceMappingURL=mdPluginRaw.js.map
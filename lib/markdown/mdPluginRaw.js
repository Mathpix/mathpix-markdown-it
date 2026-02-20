"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleMath = exports.findEndMarkerPos = exports.multiMath = void 0;
var tabular_1 = require("./md-inline-rule/tabular");
var render_tabular_1 = require("./md-renderer-rules/render-tabular");
var md_ascii_1 = require("./md-ascii");
var utils_1 = require("./utils");
var consts_1 = require("./common/consts");
var image_1 = require("./md-inline-rule/image");
var image_block_1 = require("./md-block-rule/image-block");
var setcounter_section_1 = require("./md-inline-rule/setcounter-section");
var md_theorem_1 = require("./md-theorem");
var helper_1 = require("./md-theorem/helper");
var block_rule_1 = require("./md-theorem/block-rule");
var inline_rule_1 = require("./md-theorem/inline-rule");
var core_inline_1 = require("./md-inline-rule/core-inline");
var refs_1 = require("./md-inline-rule/refs");
var breaks_1 = require("./md-renderer-rules/breaks");
var labels_1 = require("./common/labels");
var common_1 = require("./common");
var convert_math_to_html_1 = require("./common/convert-math-to-html");
var common_2 = require("./highlight/common");
var mathpix_markdown_model_1 = require("../mathpix-markdown-model");
var svg_block_1 = require("./md-block-rule/svg_block");
var mmdRules_1 = require("./common/mmdRules");
var mmdRulesToDisable_1 = require("./common/mmdRulesToDisable");
var mmd_fence_1 = require("./md-block-rule/mmd-fence");
var mmd_html_block_1 = require("./md-block-rule/mmd-html-block");
var mathml_block_1 = require("./md-block-rule/mathml-block");
var mathml_inline_1 = require("./md-inline-rule/mathml-inline");
var mmd_html_inline2_1 = require("./md-inline-rule2/mmd-html_inline2");
var html_inline_full_tag_1 = require("./md-inline-rule/html_inline_full_tag");
var mmd_icon_1 = require("./md-inline-rule/mmd-icon");
var diagbox_inline_1 = require("./md-inline-rule/diagbox-inline");
var render_diagbox_1 = require("./md-renderer-rules/render-diagbox");
var isSpace = require('markdown-it/lib/common/utils').isSpace;
var getMathEnvironment = function (str) {
    str = str.trim();
    if (!str) {
        return '';
    }
    var startPos = 0;
    // {\begin{array}{c}...
    // ^^ skipping first {
    if (str.charCodeAt(startPos) === 123 /* { */) {
        startPos++;
    }
    // {  \begin{array}{c}...
    //  ^^ skipping these spaces
    for (; startPos < str.length; startPos++) {
        var code = str.charCodeAt(startPos);
        if (!isSpace(code) && code !== 0x0A) {
            break;
        }
    }
    var match = str
        .slice(startPos)
        .match(/^\\begin\{([^}]*)\}/);
    return match && match[1] ? match[1].trim() : '';
};
var multiMath = function (state, silent) {
    var _a, _b, _c, _d;
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startMathPos)
        .match(/^(?:\\\[|\[|\\\(|\(|begin\{([^}]*)\})/); // eslint-disable-line
    if (!match) {
        return false;
    }
    if (match[1] && (consts_1.latexEnvironments.includes(match[1]))) {
        return false;
    }
    startMathPos += match[0].length;
    var type, endMarker, includeMarkers; // eslint-disable-line
    var math_env = '';
    var endMarkerPos = -1;
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
    else if (match[1] && match[1] !== 'abstract') {
        math_env = match[1].trim();
        if (match[1].indexOf('*') > 0) {
            type = "equation_math_not_number";
        }
        else {
            type = "equation_math";
        }
        endMarker = "\\end{".concat(match[1], "}");
        var environment = match[1].trim();
        var openTag = (0, utils_1.beginTag)(environment, true);
        if (!openTag) {
            return false;
        }
        var closeTag = (0, utils_1.endTag)(environment, true);
        if (!closeTag) {
            return false;
        }
        var data = (0, utils_1.findOpenCloseTagsMathEnvironment)(state.src.slice(state.pos), openTag, closeTag);
        if ((_a = data === null || data === void 0 ? void 0 : data.arrClose) === null || _a === void 0 ? void 0 : _a.length) {
            endMarkerPos = state.pos + ((_b = data.arrClose[data.arrClose.length - 1]) === null || _b === void 0 ? void 0 : _b.posStart);
        }
        includeMarkers = true;
    }
    if (!endMarker) {
        return false;
    }
    endMarkerPos = endMarkerPos !== -1
        ? endMarkerPos
        : state.src.indexOf(endMarker, startMathPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    if (!silent) {
        var token = state.push(type, "", 0);
        if (state.env.subTabular) {
            token.isSubTable = true;
        }
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
            token.math_env = math_env;
        }
        else {
            token.content = state.src.slice(startMathPos, endMarkerPos);
            token.math_env = getMathEnvironment(token.content);
        }
        if (state.env.tabulare) {
            token.return_asciimath = true;
        }
        if (state.md.options.outMath && state.md.options.outMath.include_table_markdown) {
            token.latex = '\\' + match.input;
        }
        token.inputLatex = state.src.slice(state.pos, nextPos);
        token.inlinePos = {
            start: state.pos,
            end: nextPos,
            start_content: type === "equation_math_not_number" || type === "equation_math"
                ? state.pos : startMathPos,
            end_content: type === "equation_math_not_number" || type === "equation_math"
                ? nextPos : endMarkerPos
        };
        if (state.md.options.addPositionsToTokens) {
            token.canonicalized = token.content ? (0, utils_1.canonicalMath)(token.content) : [];
        }
        if ((_c = state.md.options.highlights) === null || _c === void 0 ? void 0 : _c.length) {
            token.canonicalizedPositions = token.content ? (0, utils_1.canonicalMathPositions)(token.content) : [];
        }
        if (!state.md.options.forLatex || ((_d = state.md.options.outMath) === null || _d === void 0 ? void 0 : _d.include_typst)) {
            /** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
            (0, convert_math_to_html_1.convertMathToHtml)(state, token, state.md.options);
        }
    }
    state.pos = nextPos;
    return true;
};
exports.multiMath = multiMath;
var findEndMarkerPos = function (str, endMarker, i) {
    var index;
    index = str.indexOf(endMarker, i);
    if (index > 0) {
        if (str.charCodeAt(index - 1) === 0x5c /* \ */) {
            index = (0, exports.findEndMarkerPos)(str, endMarker, index + 1);
        }
    }
    return index;
};
exports.findEndMarkerPos = findEndMarkerPos;
var simpleMath = function (state, silent) {
    var _a, _b;
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
    var endMarkerPos = (0, exports.findEndMarkerPos)(state.src, endMarker, startMathPos);
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
    if (!silent) {
        var token = state.push(endMarker.length === 1 ? "inline_math" : "display_math", "", 0);
        token.inputLatex = state.src.slice(state.pos, nextPos);
        token.content = state.src.slice(startMathPos, endMarkerPos);
        token.math_env = getMathEnvironment(token.content);
        if (state.env.tabulare) {
            token.return_asciimath = true;
        }
        if (state.md.options.forLatex) {
            token.markup = endMarker;
        }
        if (state.md.options.outMath && state.md.options.outMath.include_table_markdown) {
            token.latex = endMarker + token.content + endMarker;
        }
        token.inlinePos = {
            start: state.pos,
            end: nextPos,
            start_content: startMathPos,
            end_content: endMarkerPos
        };
        if (state.md.options.addPositionsToTokens) {
            token.canonicalized = token.content ? (0, utils_1.canonicalMath)(token.content) : [];
        }
        if ((_a = state.md.options.highlights) === null || _a === void 0 ? void 0 : _a.length) {
            token.canonicalizedPositions = token.content ? (0, utils_1.canonicalMathPositions)(token.content) : [];
        }
        /** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
        if (!state.md.options.forLatex || ((_b = state.md.options.outMath) === null || _b === void 0 ? void 0 : _b.include_typst)) {
            (0, convert_math_to_html_1.convertMathToHtml)(state, token, state.md.options);
        }
    }
    state.pos = nextPos;
    return true;
};
exports.simpleMath = simpleMath;
var usepackage = function (state, silent) {
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
        token.inlinePos = {
            start: state.pos,
            end: nextPos
        };
    }
    state.pos = nextPos;
    return true;
};
function extend(options, defaults) {
    return Object.keys(defaults).reduce(function (result, key) {
        if (result[key] === undefined) {
            result[key] = defaults[key];
        }
        return result;
    }, options);
}
var renderMath = function (tokens, idx, options) {
    var _a, _b, _c;
    var token = tokens[idx];
    var mathEquation = token.mathEquation;
    if (options.forDocx && (0, utils_1.isMathInText)(tokens, idx, options)) {
        mathEquation = (0, utils_1.applyAttrToMathml)(mathEquation, 'data-math-in-text="true"', options);
    }
    var width = (_a = token === null || token === void 0 ? void 0 : token.mathData) === null || _a === void 0 ? void 0 : _a.width;
    var widthEx = (_b = token === null || token === void 0 ? void 0 : token.mathData) === null || _b === void 0 ? void 0 : _b.widthEx;
    var dataAttr = width === 'full' ? ' data-width="full"' : '';
    var dataAttrInline = widthEx < 2 ? ' data-overflow="visible"' : '';
    var className = token.type === "inline_math" || token.type === "inline_mathML"
        ? "math-inline"
        : "math-block";
    if (((_c = token.mathData) === null || _c === void 0 ? void 0 : _c.error) && options.parserErrors !== mathpix_markdown_model_1.ParserErrors.show) {
        var html = token.type === "inline_math" || token.type === "inline_mathML"
            ? "<span class=".concat(className).concat(dataAttrInline, ">")
            : options.forPptx ? "<div class=".concat(className).concat(dataAttr, ">") : "<span class=".concat(className).concat(dataAttr, ">");
        if (options.parserErrors === mathpix_markdown_model_1.ParserErrors.show_input) {
            html += token.inputLatex;
        }
        html += options.forPptx && className === "math-block" ? '</div>' : '</span>';
        return html;
    }
    var attrNumber = token.attrNumber;
    var idLabels = token.idLabels;
    var blockTag = options.forPptx ? 'div' : 'span';
    if (token.type === "equation_math") {
        return idLabels
            ? "<".concat(blockTag, " id=\"").concat(idLabels, "\" class=\"math-block equation-number id=").concat(idLabels, "\" number=\"").concat(attrNumber, "\"").concat(dataAttr, ">").concat(mathEquation, "</").concat(blockTag, ">")
            : "<".concat(blockTag, "  class=\"math-block equation-number \" number=\"").concat(attrNumber, "\"").concat(dataAttr, ">").concat(mathEquation, "</").concat(blockTag, ">");
    }
    else {
        return token.type === "inline_math" || token.type === "inline_mathML"
            ? idLabels
                ? "<span id=\"".concat(idLabels, "\" class=\"math-inline id=").concat(idLabels, "\"").concat(dataAttrInline, ">").concat(mathEquation, "</span>")
                : "<span class=\"math-inline ".concat(idLabels, "\"").concat(dataAttrInline, ">").concat(mathEquation, "</span>")
            : idLabels
                ? "<".concat(blockTag, " id=\"").concat(idLabels, "\" class=\"math-block id=").concat(idLabels, "\"").concat(dataAttr, ">").concat(mathEquation, "</").concat(blockTag, ">")
                : "<".concat(blockTag, " class=\"math-block ").concat(idLabels, "\"").concat(dataAttr, ">").concat(mathEquation, "</").concat(blockTag, ">");
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
        return "<span class=\"hidden\">".concat(strStyle, "</span>");
    }
    else {
        return '';
    }
};
var renderReference = function (token, options, env, slf) {
    var _a, _b, _c;
    var id = '';
    var reference = '';
    /** This attribute indicates that the reference should be enclosed in parentheses (the reference was declared as \eqref{}) */
    var dataParentheses = token.attrGet("data-parentheses");
    var label = (0, labels_1.getLabelByKeyFromLabelsList)(token.content);
    if (label) {
        id = label.id;
        reference = ((_a = label.tagChildrenTokens) === null || _a === void 0 ? void 0 : _a.length)
            ? slf.renderInline(label.tagChildrenTokens, options, env)
            : label.tag;
    }
    if (dataParentheses === "true" && reference) {
        reference = '(' + reference + ')';
    }
    if ((_b = token.highlights) === null || _b === void 0 ? void 0 : _b.length) {
        token.highlightAll = reference !== token.content;
    }
    if (!reference) {
        /** If the label could not be found in the list, then we display the content of this label */
        reference = '[' + token.content + ']';
    }
    var html = token.type === "reference_note_block"
        ? "<div class=\"math-block\">"
        : '';
    html += "<a href=\"#".concat(id, "\" style=\"cursor: pointer; text-decoration: none;\" class=\"clickable-link\" value=\"").concat(id, "\" data-parentheses=\"").concat(dataParentheses, "\">");
    html += ((_c = token.highlights) === null || _c === void 0 ? void 0 : _c.length)
        ? (0, common_2.highlightText)(token, reference) : reference;
    html += '</a>';
    html += token.type === "reference_note_block" ? '</div>' : '';
    return html;
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
    var _a, _b, _c;
    var isMathOpen = false;
    var openedAuthorBlock = false;
    var openBrackets = 0;
    var pickStartTag = /^\\begin{(abstract|center|left|right|table|figure|tabular)}/;
    var pickEndTag = /^\\end{(abstract|center|left|right|table|figure|tabular)}/;
    var pickMathStartTag = /\\begin{(equation|equation\*)}|\\\[/;
    var pickMathEndTag = /\\end{(equation|equation\*)}|\\\]/;
    var mathStartTag = /\\begin{([^}]*)}|\\\[|\\\(/;
    var pickTag = /^\\(?:title|section|subsection)/;
    var listStartTag = /^\\begin{(enumerate|itemize)}/;
    var content, terminate, i, l, token, oldParentType, lineText, //mml,
    nextLine = startLine + 1, terminatorRules = state.md.block.ruler.getRules('paragraph'), endLine = state.lineMax, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    oldParentType = state.parentType;
    state.parentType = 'paragraph';
    lineText = state.src.slice(pos, max);
    if (lineText === '\\maketitle') {
        state.line = nextLine++;
        return true;
    }
    var listOpen = false;
    var isMath = false;
    var mathEndTag = null;
    var terminatedLine = -1;
    // jump line-by-line until empty one or EOF
    for (; nextLine < endLine; nextLine++) {
        if (!isMathOpen && !isMath && mathStartTag.test(lineText) //&& !pickStartTag.test(lineText)
        ) {
            mathEndTag = (0, utils_1.includesMultiMathBeginTag)(lineText, mathStartTag);
            isMath = Boolean(mathEndTag);
        }
        if (isMath && mathEndTag && mathEndTag.test(lineText) //&& !pickEndTag.test(lineText)
        ) {
            if ((0, utils_1.includesMultiMathTag)(lineText, mathEndTag)) {
                isMath = false;
            }
        }
        var prewPos = state.bMarks[nextLine - 1] + state.tShift[nextLine - 1];
        var prewMax = state.eMarks[nextLine - 1];
        var prewLineText = state.src.slice(prewPos, prewMax);
        // Update isMathOpen based on the previous line (prewLineText)
        var prevTogglesMath = (0, utils_1.hasOddSimpleMathTag)(prewLineText);
        if (prevTogglesMath) {
            var wasMathOpen = isMathOpen;
            isMathOpen = !isMathOpen;
            // If we were inside $$ and just closed it, end the paragraph
            // The current nextLine points to the line after the closing $$.
            if (wasMathOpen && !isMathOpen) {
                break;
            }
        }
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
        if (pickTag.test(prewLineText) || pickTag.test(lineText)) {
            break;
        }
        if (state.isEmpty(nextLine)) {
            break;
        }
        if (pickStartTag.test(lineText) || pickEndTag.test(prewLineText)) {
            break;
        }
        if (!isMath && !openedAuthorBlock && !isMathOpen
            && (pickMathStartTag.test(lineText) || pickMathEndTag.test(prewLineText))) {
            var shouldBreak = (pickMathStartTag.test(lineText) && (0, common_1.checkTagOutsideInlineCode)(lineText, pickMathStartTag)) ||
                (pickMathEndTag.test(prewLineText) && (0, common_1.checkTagOutsideInlineCode)(prewLineText, pickMathEndTag));
            if (shouldBreak) {
                break;
            }
        }
        if (listStartTag.test(lineText) && (prewLineText.indexOf('\\item') === -1 || !listOpen)) {
            break;
        }
        // End paragraph when a $$ block starts on this line
        // or when the previous line contained a self-contained $$...$$ block.
        var startsDisplayMath = (0, utils_1.includesSimpleMathTag)(lineText);
        var prevIsSingleLineDisplayMath = (0, utils_1.includesSimpleMathTag)(prewLineText) && !prevTogglesMath;
        if (!isMathOpen && (startsDisplayMath || prevIsSingleLineDisplayMath)) {
            break;
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
                if (terminatedLine === -1) {
                    terminatedLine = nextLine;
                    terminate = true;
                    break;
                }
            }
        }
        if (!isMath && !isMathOpen) {
            if (terminate) {
                break;
            }
        }
    }
    if (isMath && mathEndTag && mathEndTag.test(lineText)) {
        if ((0, utils_1.includesMultiMathTag)(lineText, mathEndTag)) {
            isMath = false;
        }
    }
    if (isMath && terminatedLine !== -1) {
        nextLine = terminatedLine;
    }
    content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
    state.line = nextLine;
    token = state.push('paragraph_open', 'div', 1);
    if (((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx) && !((_b = state.md.options) === null || _b === void 0 ? void 0 : _b.forPptx)) {
        token.attrSet('style', 'margin-top: 0; margin-bottom: 1em;');
    }
    token.parentToken = (_c = state.env) === null || _c === void 0 ? void 0 : _c.parentToken;
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
    ascii_math: "ascii_math",
    slashbox: "slashbox",
    backslashbox: "backslashbox",
    diagbox_item: "diagbox_item",
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
        var isRenderElement = md.options.renderElement && md.options.renderElement.hasOwnProperty('startLine');
        /** Do not clear global lists for theorems if only one element is being rendered
         * and not all content is being rerendered */
        if (!isRenderElement) {
            (0, helper_1.resetTheoremEnvironments)();
            /** TODO: check it in vscode */
            (0, labels_1.clearLabelsList)(); /** Clean up the global list of all labels */
        }
        if (!md.options.htmlDisableTagMatching) {
            md.block.ruler.at("html_block", mmd_html_block_1.mmdHtmlBlock, { alt: ['paragraph', 'reference', 'blockquote'] });
        }
        md.block.ruler.before('html_block', 'svg_block', svg_block_1.svg_block, { alt: (0, common_1.getTerminatedRules)("svg_block") });
        if (options === null || options === void 0 ? void 0 : options.forPptx) {
            md.block.ruler.after("fence", 'image_with_size_block', image_block_1.imageWithSizeBlock, { alt: (0, common_1.getTerminatedRules)("image_with_size_block") });
        }
        md.block.ruler.before("paragraph", "paragraphDiv", paragraphDiv);
        if (!md.options.enableCodeBlockRuleForLatexCommands) {
            md.block.ruler.at("code", codeBlock);
        }
        if (md.options.previewUuid) {
            md.block.ruler.at("fence", mmd_fence_1.fenceBlock, { alt: (0, common_1.getTerminatedRules)("fence") });
        }
        md.block.ruler.before("ReNewCommand", "newTheoremBlock", block_rule_1.newTheoremBlock, { alt: (0, common_1.getTerminatedRules)("newTheoremBlock") });
        md.inline.ruler.before("escape", "usepackage", usepackage);
        md.block.ruler.before("html_block", "mathMLBlock", mathml_block_1.mathMLBlock, { alt: (0, common_1.getTerminatedRules)("mathMLBlock") });
        md.inline.ruler.before("html_inline", "mathML", mathml_inline_1.inlineMathML);
        md.inline.ruler.before("html_inline", "html_inline_full_tag", html_inline_full_tag_1.html_inline_full_tag);
        md.inline.ruler.before("escape", "multiMath", exports.multiMath);
        md.inline.ruler.before("multiMath", "refsInline", refs_1.refsInline);
        md.inline.ruler.before("multiMath", "inlineTabular", tabular_1.inlineTabular);
        md.inline.ruler.before("multiMath", "labelLatex", inline_rule_1.labelLatex);
        md.inline.ruler.before("multiMath", "captionLatex", inline_rule_1.captionLatex);
        md.inline.ruler.before("multiMath", "captionSetupLatex", inline_rule_1.captionSetupLatex);
        md.inline.ruler.before("multiMath", "centeringLatex", inline_rule_1.centeringLatex);
        md.inline.ruler.before("multiMath", "theoremStyle", inline_rule_1.theoremStyle); /** Parse \theoremstyle */
        md.inline.ruler.before("multiMath", "newTheorem", inline_rule_1.newTheorem); /** Parse \newtheorem */
        md.inline.ruler.before("multiMath", "setCounterTheorem", inline_rule_1.setCounterTheorem); /** Parse \newtheorem */
        md.inline.ruler.before("setCounterTheorem", "setCounterSection", setcounter_section_1.setCounterSection); /** Parse \setcounter{section} */
        md.inline.ruler.before("renewcommand_inline", "newCommandQedSymbol", inline_rule_1.newCommandQedSymbol); /** Parse \\renewcommand\qedsymbol{$\blacksquare$} */
        md.inline.ruler.push("simpleMath", exports.simpleMath);
        md.inline.ruler.before("escape", "inlineMmdIcon", mmd_icon_1.inlineMmdIcon);
        md.inline.ruler.before("escape", "inlineDiagbox", diagbox_inline_1.inlineDiagbox);
        md.inline.ruler.before("multiMath", "refs", refs_1.refInsideMathDelimiter);
        md.inline.ruler.before("multiMath", "asciiMath", md_ascii_1.asciiMath);
        md.inline.ruler.before("asciiMath", "backtickAsAsciiMath", md_ascii_1.backtickAsAsciiMath);
        /** Replace image inline rule */
        md.inline.ruler.at('image', image_1.imageWithSize);
        if (!md.options.htmlDisableTagMatching) {
            md.inline.ruler2.push('html_inline2', mmd_html_inline2_1.mmdHtmlInline2);
        }
        var disableRuleTypes = md.options.renderOptions
            ? (0, mmdRulesToDisable_1.getDisableRuleTypes)(md.options.renderOptions)
            : [];
        /** Replace inline core rule */
        if (!disableRuleTypes.includes(mmdRules_1.eMmdRuleType.latex)) {
            md.core.ruler.at('inline', core_inline_1.coreInline);
        }
        Object.keys(mapping).forEach(function (key) {
            md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
                switch (tokens[idx].type) {
                    case "tabular":
                        return (0, render_tabular_1.renderTabularInline)(tokens, tokens[idx], options, env, slf);
                    case "tabular_inline":
                        return (0, render_tabular_1.renderTabularInline)(tokens, tokens[idx], options, env, slf);
                    // case "tsv":
                    //   return renderTSV(tokens, tokens[idx], options);
                    case "reference_note":
                        return renderReference(tokens[idx], options, env, slf);
                    case "reference_note_block":
                        return renderReference(tokens[idx], options, env, slf);
                    case "usepackage_geometry":
                        return renderUsepackage(tokens[idx], options);
                    case "ascii_math":
                        return (0, md_ascii_1.renderAsciiMath)(tokens, idx, options);
                    case "slashbox":
                        return (0, render_diagbox_1.renderDiagbox)(tokens, idx, options, env, slf);
                    case "backslashbox":
                        return (0, render_diagbox_1.renderDiagbox)(tokens, idx, options, env, slf);
                    case "diagbox_item":
                        return (0, render_diagbox_1.renderDiagBoxItem)(tokens, idx, options, env, slf);
                    default:
                        return renderMath(tokens, idx, options);
                }
            };
        });
        /**
         * Replacing the default renderer rules(softbreak and hardbreak) to ignore insertion of line breaks after hidden tokens.
         * Hidden tokens do not participate in rendering
         * */
        md.renderer.rules.softbreak = breaks_1.softBreak;
        md.renderer.rules.hardbreak = breaks_1.hardBreak;
        md.renderer.rules.image = function (tokens, idx, options, env, slf) { return (0, image_1.renderRuleImage)(tokens, idx, options, env, slf); };
        md.renderer.rules.image_block = function (tokens, idx, options, env, slf) { return (0, image_block_1.renderRuleImageBlock)(tokens, idx, options, env, slf); };
        (0, md_theorem_1.renderTheorems)(md);
    };
});
//# sourceMappingURL=mdPluginRaw.js.map
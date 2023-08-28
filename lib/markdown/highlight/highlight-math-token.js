"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightMathToken = exports.addedHighlightMathjaxFunctions = exports.convertMathToHtmlWithHighlight = void 0;
var common_1 = require("./common");
var utils_1 = require("../utils");
var mathjax_1 = require("../../mathjax/");
var consts_1 = require("../common/consts");
/** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
var convertMathToHtmlWithHighlight = function (state, token, options) {
    var math_highlight = token.content_highlight;
    var isBlock = token.type !== 'inline_math';
    try {
        var cwidth = 1200;
        if (options && options.width && options.width > 0) {
            cwidth = options.width;
        }
        else {
            cwidth = (0, utils_1.getWidthFromDocument)(cwidth);
        }
        var begin_number = math_highlight && token.number
            ? token.number
            : mathjax_1.MathJax.GetLastEquationNumber() + 1;
        mathjax_1.MathJax.Reset(begin_number);
        var data = mathjax_1.MathJax.Typeset(math_highlight, { display: isBlock, metric: { cwidth: cwidth },
            outMath: {}, mathJax: options.mathJax, accessibility: options.accessibility,
            nonumbers: options.nonumbers
        }, true);
        token.mathData.svg = data.data.svg;
        token.mathData.height = data.data.height;
        token.mathData.heightAndDepth = data.data.heightAndDepth;
        return token;
    }
    catch (e) {
        // console.log('ERROR MathJax =>', e.message, e);
        // console.log('ERROR MathJax =>token=>', token);
        console.log('ERROR MathJax =>content_highlight=>', token.content_highlight);
        // console.error('ERROR MathJax =>', e.message, e);
        token.highlightAll = true;
        return token;
    }
};
exports.convertMathToHtmlWithHighlight = convertMathToHtmlWithHighlight;
var addedHighlightMathjaxFunctions = function (token, mathContent) {
    var mathStr = '';
    var mathStart = 0;
    mathContent.map(function (item) {
        var _a, _b, _c, _d, _e, _f;
        mathStr += token.content.slice(mathStart, item.positions.start);
        if (item.highlight.hasOwnProperty('text_color') || item.highlight.hasOwnProperty('highlight_color')) {
            mathStr += "{";
            if ((_a = item.highlight) === null || _a === void 0 ? void 0 : _a.text_color) {
                mathStr += "\\textcolor{".concat((_b = item.highlight) === null || _b === void 0 ? void 0 : _b.text_color, "}{");
            }
            if ((_c = item.highlight) === null || _c === void 0 ? void 0 : _c.highlight_color) {
                mathStr += "\\colorbox{".concat((_d = item.highlight) === null || _d === void 0 ? void 0 : _d.highlight_color, "}{$");
            }
            mathStr += item.content;
            if ((_e = item.highlight) === null || _e === void 0 ? void 0 : _e.highlight_color) {
                mathStr += '$}';
            }
            if ((_f = item.highlight) === null || _f === void 0 ? void 0 : _f.text_color) {
                mathStr += "}";
            }
            mathStr += "}";
        }
        else {
            mathStr += "{";
            mathStr += "\\textcolor{".concat(consts_1.HIGHLIGHT_TEXT_COLOR, "}{");
            mathStr += "\\colorbox{".concat(consts_1.HIGHLIGHT_COLOR, "}{$");
            mathStr += item.content;
            mathStr += '$}';
            mathStr += "}";
            mathStr += "}";
        }
        mathStart = item.positions.end;
    });
    mathStr += token.content.slice(mathStart);
    return mathStr;
};
exports.addedHighlightMathjaxFunctions = addedHighlightMathjaxFunctions;
var highlightMathToken = function (state, token) {
    var _a, _b, _c, _d, _e;
    try {
        var mathContent = [];
        token.highlights = (0, common_1.mergingHighlights)(token.highlights);
        var isBreak = false;
        var _loop_1 = function (j) {
            if (isBreak) {
                return "break";
            }
            var startMathPos = ((_b = token === null || token === void 0 ? void 0 : token.positions) === null || _b === void 0 ? void 0 : _b.hasOwnProperty('start_content'))
                ? token.highlights[j].start - token.positions.start_content
                : token.highlights[j].start - token.positions.start;
            var endMathPos = ((_c = token === null || token === void 0 ? void 0 : token.positions) === null || _c === void 0 ? void 0 : _c.hasOwnProperty('start_content'))
                ? token.highlights[j].end - token.positions.start_content
                : token.highlights[j].end - token.positions.start;
            if ((mathContent === null || mathContent === void 0 ? void 0 : mathContent.length)
                && mathContent.find(function (item) { return startMathPos >= item.positions.start && endMathPos <= item.positions.end; })) {
                return "continue";
            }
            for (var k = 0; k < ((_d = token.canonicalizedPositions) === null || _d === void 0 ? void 0 : _d.length); k++) {
                var nextItem = k + 1 < ((_e = token.canonicalizedPositions) === null || _e === void 0 ? void 0 : _e.length) ? token.canonicalizedPositions[k + 1] : null;
                if (startMathPos >= token.canonicalizedPositions[k].positions.start
                    && endMathPos <= token.canonicalizedPositions[k].positions.end) {
                    /** Highlight all equation */
                    if (['\\hline', '\\begin', '\\end', '\\label', '\\tag', '\\frac',
                        '\\limits', '\\nolimits',
                        '\\overset', '\\underset', '\\stackrel',
                        '\\left', '\\right'].includes(token.canonicalizedPositions[k].content)) {
                        mathContent = [];
                        isBreak = true;
                        break;
                    }
                    /** Highlight all equation */
                    if (['\\label', '\\tag', '\\operatorname'].includes(token.canonicalizedPositions[k].parentCommand)) {
                        mathContent = [];
                        isBreak = true;
                        break;
                    }
                    /** Highlight all equation */
                    if (consts_1.mathEnvironments.includes(token.canonicalizedPositions[k].content)) {
                        if (k - 2 >= 0
                            && (token.canonicalizedPositions[k - 2].content === '\\begin'
                                || token.canonicalizedPositions[k - 2].content === '\\end')) {
                            mathContent = [];
                            isBreak = true;
                            break;
                        }
                    }
                    if ((nextItem === null || nextItem === void 0 ? void 0 : nextItem.content) === '\\limits' || (nextItem === null || nextItem === void 0 ? void 0 : nextItem.content) === '\\nolimits') {
                        mathContent = [];
                        isBreak = true;
                        break;
                    }
                    /** Highlight part of equation */
                    if ((nextItem === null || nextItem === void 0 ? void 0 : nextItem.content) === '{') {
                        /** Find close branch */
                        var parens = 0;
                        var startPositions = token.canonicalizedPositions[k].positions;
                        var endPositions = null;
                        for (var i = k + 1; i < token.canonicalizedPositions.length; i++) {
                            if (token.canonicalizedPositions[i].content === '}') {
                                parens--;
                                if (parens === 0) {
                                    endPositions = token.canonicalizedPositions[i].positions;
                                    k = i;
                                    break;
                                }
                                continue;
                            }
                            if (token.canonicalizedPositions[i].content === '{') {
                                parens++;
                            }
                        }
                        if (startPositions && endPositions) {
                            mathContent.push({
                                positions: {
                                    start: startPositions.start,
                                    end: endPositions.end,
                                },
                                content: token.content.slice(startPositions.start, endPositions.end),
                                highlight: token.highlights[j]
                            });
                            continue;
                        }
                    }
                    /** Highlight part of equation */
                    if (token.canonicalizedPositions[k].content === '\\left') {
                        /** Find close branch */
                        var parens = 0;
                        var startPositions = token.canonicalizedPositions[k].positions;
                        var endPositions = null;
                        for (var i = k; i < token.canonicalizedPositions.length; i++) {
                            if (token.canonicalizedPositions[i].content === '\\right') {
                                parens--;
                                if (parens === 0) {
                                    endPositions = token.canonicalizedPositions[i + 1].positions;
                                    k = i + 1;
                                    break;
                                }
                                continue;
                            }
                            if (token.canonicalizedPositions[i].content === '\\left') {
                                parens++;
                            }
                        }
                        if (startPositions && endPositions) {
                            mathContent.push({
                                positions: {
                                    start: startPositions.start,
                                    end: endPositions.end,
                                },
                                content: token.content.slice(startPositions.start, endPositions.end),
                                highlight: token.highlights[j]
                            });
                            continue;
                        }
                    }
                    /** Highlight part of equation */
                    if (token.canonicalizedPositions[k].content === '\\right') {
                        /** Find open branch */
                        var parens = 0;
                        var endPositions = token.canonicalizedPositions[k + 1].positions;
                        var startPositions = null;
                        for (var i = k + 1; i >= 0; i--) {
                            if (token.canonicalizedPositions[i].content === '\\left') {
                                parens--;
                                if (parens === 0) {
                                    startPositions = token.canonicalizedPositions[i].positions;
                                    k = k + 1;
                                    break;
                                }
                                continue;
                            }
                            if (token.canonicalizedPositions[i].content === '\\right') {
                                parens++;
                            }
                        }
                        if (startPositions && endPositions) {
                            mathContent.push({
                                positions: {
                                    start: startPositions.start,
                                    end: endPositions.end,
                                },
                                content: token.content.slice(startPositions.start, endPositions.end),
                                highlight: token.highlights[j]
                            });
                            continue;
                        }
                    }
                    var content = token.content.slice(token.canonicalizedPositions[k].positions.start, token.canonicalizedPositions[k].positions.end);
                    var highlightIncludeIntoBraces = false;
                    if (token.canonicalizedPositions[k].fontControl) {
                        var includeIntoBraces = token.canonicalizedPositions[k].fontControl.includeIntoBraces && token.canonicalizedPositions[k].parentCommand;
                        highlightIncludeIntoBraces = !includeIntoBraces && token.canonicalizedPositions[k].fontControl.command === '\\Bbb';
                        content = includeIntoBraces
                            ? '{' + content + '}' :
                            ' ' + content;
                        content = token.canonicalizedPositions[k].fontControl.command + content;
                    }
                    mathContent.push({
                        positions: token.canonicalizedPositions[k].positions,
                        content: content,
                        highlight: token.highlights[j],
                        highlightIncludeIntoBraces: highlightIncludeIntoBraces
                    });
                }
            }
        };
        for (var j = 0; j < ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length); j++) {
            var state_1 = _loop_1(j);
            if (state_1 === "break")
                break;
        }
        if (!(mathContent === null || mathContent === void 0 ? void 0 : mathContent.length)) {
            token.highlightAll = true;
            return;
        }
        mathContent = (0, common_1.filteredHighlightContent)(mathContent);
        token.content_highlight = (0, exports.addedHighlightMathjaxFunctions)(token, mathContent);
        (0, exports.convertMathToHtmlWithHighlight)(state, token, state.md.options);
    }
    catch (err) {
        console.log("[MMD]=>ERROR=>highlight=>", err);
        token.highlightAll = true;
    }
};
exports.highlightMathToken = highlightMathToken;
//# sourceMappingURL=highlight-math-token.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captionTableHighlight = exports.renderMathHighlight = exports.renderTextUrlHighlight = exports.codeInlineHighlight = exports.textHighlight = void 0;
var common_1 = require("./common");
var mathjax_1 = require("../../mathjax");
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
var consts_1 = require("../common/consts");
var textHighlight = function (tokens, idx, options, env, self) {
    var token = tokens[idx];
    return (0, common_1.highlightText)(token);
};
exports.textHighlight = textHighlight;
var codeInlineHighlight = function (tokens, idx, options, env, slf) {
    var _a, _b, _c;
    var token = tokens[idx];
    if ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length) {
        token.highlights = (0, common_1.mergingHighlights)(token.highlights);
        var highlightContent_1 = [];
        for (var i = 0; i < token.highlights.length; i++) {
            if (token.highlights[i].start === token.positions.start && token.highlights[i].end === token.positions.end) {
                token.highlightAll = true;
                break;
            }
            var startPos = token.highlights[i].start <= token.positions.start
                ? 0 : token.highlights[i].start - token.positions.start - ((_b = token.markup) === null || _b === void 0 ? void 0 : _b.length);
            var endPos = token.highlights[i].end - token.positions.start - ((_c = token.markup) === null || _c === void 0 ? void 0 : _c.length);
            highlightContent_1.push({
                positions: {
                    start: startPos,
                    end: endPos
                },
                highlight: token.highlights[i],
                content: token.content.slice(startPos, endPos)
            });
        }
        var textStr_1 = '';
        if (token.highlightAll) {
            var style = token.attrGet('style');
            style = style
                ? 'background-color: transparent;' + style
                : 'background-color: transparent;';
            token.attrSet('style', style);
            textStr_1 += '<span class="mmd-highlight" style="' + (0, common_1.getStyleFromHighlight)(token.highlights[0]) + '">';
            textStr_1 += '<code' + slf.renderAttrs(token) + '>';
            textStr_1 += escapeHtml(token.content);
            textStr_1 += '</code>';
            textStr_1 += '</span>';
            return textStr_1;
        }
        var textStart_1 = 0;
        var newArr = [];
        var _loop_1 = function (i) {
            var index = (newArr === null || newArr === void 0 ? void 0 : newArr.length)
                ? newArr.findIndex(function (item) { return item.positions.start >= highlightContent_1[i].positions.start
                    && item.positions.end <= highlightContent_1[i].positions.end; })
                : -1;
            if (index === -1) {
                newArr.push(highlightContent_1[i]);
                return "continue";
            }
            newArr.splice(index, 1);
            newArr.push(highlightContent_1[i]);
        };
        /** Filtered */
        for (var i = 0; i < highlightContent_1.length; i++) {
            _loop_1(i);
        }
        newArr.map(function (item) {
            textStr_1 += escapeHtml(token.content.slice(textStart_1, item.positions.start));
            textStr_1 += '<span style="' + (0, common_1.getStyleFromHighlight)(item.highlight) + '">';
            textStr_1 += item.content;
            textStr_1 += '</span>';
            textStart_1 = item.positions.end;
        });
        textStr_1 += escapeHtml(token.content.slice(textStart_1));
        return '<code' + slf.renderAttrs(token) + '>' +
            textStr_1 +
            '</code>';
    }
    else {
        return '<code' + slf.renderAttrs(token) + '>' +
            escapeHtml(tokens[idx].content) +
            '</code>';
    }
};
exports.codeInlineHighlight = codeInlineHighlight;
var renderTextUrlHighlight = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    return "<a href=\"#\" class=\"text-url\">".concat((0, common_1.highlightText)(token), "</a>");
};
exports.renderTextUrlHighlight = renderTextUrlHighlight;
var renderMathHighlight = function (tokens, idx, options, env, slf) {
    var _a, _b, _c, _d, _e;
    var token = tokens[idx];
    var mathEquation = token.hasOwnProperty('mathData')
        ? (0, mathjax_1.OuterHTML)(token.mathData, options.outMath)
        : token.mathEquation;
    var attrNumber = token.attrNumber;
    var idLabels = token.idLabels;
    var html = '';
    var dataAttrs = '';
    var x_height = 0.442; // In MathJax font.params.x_height: 0.442
    var line_height = 1.0442;
    var isHeightExceedsLineHeight = ((_a = token.mathData) === null || _a === void 0 ? void 0 : _a.height) > line_height;
    if (!isHeightExceedsLineHeight && ((_b = token.mathData) === null || _b === void 0 ? void 0 : _b.heightAndDepth) > line_height
        && ((_c = token.mathData) === null || _c === void 0 ? void 0 : _c.heightAndDepth) - ((_d = token.mathData) === null || _d === void 0 ? void 0 : _d.height) > x_height) {
        isHeightExceedsLineHeight = true;
    }
    if (token.highlightAll) {
        var dataAttrsStyle = '';
        if (((_e = token.highlights) === null || _e === void 0 ? void 0 : _e.length) && (token.highlights[0].hasOwnProperty('highlight_color')
            || token.highlights[0].hasOwnProperty('text_color'))) {
            if (token.highlights[0].highlight_color) {
                if (token.type === "inline_math" && !isHeightExceedsLineHeight) {
                    dataAttrsStyle += "background-color: ".concat(token.highlights[0].highlight_color, ";");
                }
                else {
                    dataAttrs += ' data-highlight-color="true"';
                    dataAttrsStyle += "--mmd-highlight-color: ".concat(token.highlights[0].highlight_color, ";");
                }
            }
            if (token.highlights[0].text_color) {
                if (token.type === "inline_math" && !isHeightExceedsLineHeight) {
                    dataAttrsStyle += "color: ".concat(token.highlights[0].text_color, ";");
                }
                else {
                    dataAttrs += ' data-highlight-text-color="true"';
                    dataAttrsStyle += "--mmd-highlight-text-color: ".concat(token.highlights[0].text_color, ";");
                }
            }
        }
        else {
            if (token.type === "inline_math" && !isHeightExceedsLineHeight) {
                dataAttrsStyle += "background-color: ".concat(consts_1.HIGHLIGHT_TEXT_COLOR, ";");
                dataAttrsStyle += "color: ".concat(consts_1.HIGHLIGHT_COLOR, ";");
            }
            else {
                dataAttrs += ' data-highlight-color="true"';
                dataAttrs += ' data-highlight-text-color="true"';
                dataAttrsStyle += "--mmd-highlight-color: ".concat(consts_1.HIGHLIGHT_COLOR, ";");
                dataAttrsStyle += "--mmd-highlight-text-color: ".concat(consts_1.HIGHLIGHT_TEXT_COLOR, ";");
            }
        }
        dataAttrs += ' style="' + dataAttrsStyle + '"';
    }
    if (token.type === "equation_math") {
        html = idLabels
            ? "<span id=\"".concat(idLabels, "\" class=\"math-block equation-number id=").concat(idLabels, "\" number=\"").concat(attrNumber, "\"").concat(dataAttrs, ">").concat(mathEquation, "</span>")
            : "<span  class=\"math-block equation-number \" number=\"".concat(attrNumber, "\"").concat(dataAttrs, ">").concat(mathEquation, "</span>");
    }
    else {
        html = token.type === "inline_math" || token.type === "inline_mathML"
            ? idLabels
                ? "<span id=\"".concat(idLabels, "\" class=\"math-inline id=").concat(idLabels, "\"").concat(dataAttrs, ">").concat(mathEquation, "</span>")
                : "<span class=\"math-inline ".concat(idLabels, "\"").concat(dataAttrs, ">").concat(mathEquation, "</span>")
            : idLabels
                ? "<span id=\"".concat(idLabels, "\" class=\"math-block id=").concat(idLabels, "\"").concat(dataAttrs, ">").concat(mathEquation, "</span>")
                : "<span class=\"math-block ".concat(idLabels, "\"").concat(dataAttrs, ">").concat(mathEquation, "</span>");
    }
    return html;
};
exports.renderMathHighlight = renderMathHighlight;
var captionTableHighlight = function (tokens, idx, options, env, slf) {
    var _a;
    var token = tokens[idx];
    if ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length) {
        if ((0, common_1.needToHighlightAll)(token)) {
            return "<div class=".concat(token.attrGet('class')
                ? token.attrGet('class')
                : "caption_table", ">").concat((0, common_1.highlightText)(token, token.print + token.caption), "</div>");
        }
        return "<div class=".concat(token.attrGet('class')
            ? token.attrGet('class')
            : "caption_table", ">").concat(token.print).concat((0, common_1.highlightText)(token, token.caption), "</div>");
    }
    return "<div class=".concat(token.attrGet('class')
        ? token.attrGet('class')
        : "caption_table", ">").concat(token.content, "</div>");
};
exports.captionTableHighlight = captionTableHighlight;
//# sourceMappingURL=render-rule-highlights.js.map
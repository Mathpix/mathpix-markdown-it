"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render_enumerate_list_close = exports.render_itemize_list_close = exports.render_latex_list_item_close = exports.render_latex_list_item_open = exports.render_item_inline = exports.render_enumerate_list_open = exports.render_itemize_list_open = void 0;
var rules_1 = require("../rules");
var re_level_1 = require("../md-block-rule/lists/re-level");
var render_tabular_1 = require("./render-tabular");
var common_1 = require("../highlight/common");
var convert_scv_to_base64_1 = require("../md-svg-to-base64/convert-scv-to-base64");
var consts_1 = require("../common/consts");
var level_itemize = 0;
var level_enumerate = 0;
var list_injectLineNumbers = function (tokens, idx, className) {
    if (className === void 0) { className = ''; }
    var line, endLine, listLine;
    if (tokens[idx].map) {
        line = tokens[idx].map[0];
        endLine = tokens[idx].map[1];
        listLine = [];
        for (var i = line; i < endLine; i++) {
            listLine.push(i);
        }
        tokens[idx].attrJoin("class", className + ' ' + rules_1.PREVIEW_PARAGRAPH_PREFIX + String(line)
            + ' ' + rules_1.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
        tokens[idx].attrJoin("data_line_start", "".concat(String(line)));
        tokens[idx].attrJoin("data_line_end", "".concat(String(endLine - 1)));
        tokens[idx].attrJoin("data_line", "".concat(String([line, endLine])));
        tokens[idx].attrJoin("count_line", "".concat(String(endLine - line)));
        if (tokens[idx].hasOwnProperty('parentStart')) {
            tokens[idx].attrJoin("data_parent_line_start", "".concat(String(tokens[idx].parentStart)));
        }
    }
    else {
        tokens[idx].attrJoin("class", className);
    }
};
var render_itemize_list_open = function (tokens, index, options, env, renderer) {
    if (tokens[index].level === 0) {
        level_itemize = 0;
    }
    level_itemize++;
    var dataAttr = '';
    list_injectLineNumbers(tokens, index, "itemize");
    var dataPaddingInlineStart = tokens[index].attrGet('data-padding-inline-start');
    dataPaddingInlineStart = dataPaddingInlineStart
        ? "padding-inline-start: ".concat(dataPaddingInlineStart, "px; ")
        : '';
    if (options.forDocx) {
        var itemizeLevelTokens = (0, re_level_1.GetItemizeLevelTokens)(tokens[index].itemizeLevel);
        if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
            var data = isTextMarkerTokens(itemizeLevelTokens[level_itemize - 1], renderer, options);
            var itemizeLevel = (0, re_level_1.GetItemizeLevel)(tokens[index].itemizeLevelContents);
            if (itemizeLevel.length >= level_itemize) {
                dataAttr += " data-custom-marker-type=\"".concat(data.markerType, "\"");
                if (data.markerType === 'text') {
                    dataAttr += " data-custom-marker-content=\"".concat(encodeURI(data.textContent), "\"");
                }
                else {
                    dataAttr += " data-custom-marker-content=\"".concat(encodeURI(itemizeLevel[level_itemize - 1]), "\"");
                }
            }
        }
    }
    if (level_itemize > 1) {
        return "<li><ul".concat(renderer.renderAttrs(tokens[index])).concat(dataAttr, " style=\"list-style-type: none\">");
    }
    return "<ul".concat(renderer.renderAttrs(tokens[index])).concat(dataAttr, " style=\"").concat(dataPaddingInlineStart, "list-style-type: none\">");
};
exports.render_itemize_list_open = render_itemize_list_open;
var render_enumerate_list_open = function (tokens, index, options, env, renderer) {
    if (tokens[index].level === 0) {
        level_enumerate = 0;
    }
    level_enumerate++;
    var dataAttr = '';
    var itLevel = (0, re_level_1.GetEnumerateLevel)(tokens[index].enumerateLevel);
    var str = itLevel.length >= level_enumerate ? itLevel[level_enumerate - 1] : 'decimal';
    list_injectLineNumbers(tokens, index, "enumerate ".concat(str));
    var dataPaddingInlineStart = tokens[index].attrGet('data-padding-inline-start');
    dataPaddingInlineStart = dataPaddingInlineStart
        ? "padding-inline-start: ".concat(dataPaddingInlineStart, "px; ")
        : '';
    if (options.forDocx) {
        dataAttr = " data-list-style-type=\"".concat(str, "\"");
    }
    if (level_enumerate > 1) {
        return "<ol".concat(renderer.renderAttrs(tokens[index])).concat(dataAttr, " style=\" list-style-type: ").concat(str, "\">");
    }
    return "<ol".concat(renderer.renderAttrs(tokens[index])).concat(dataAttr, " style=\"").concat(dataPaddingInlineStart, " list-style-type: ").concat(str, "\">");
};
exports.render_enumerate_list_open = render_enumerate_list_open;
var generateHtmlForMarkerTokens = function (markerTokens, slf, options) {
    var htmlMarker = '';
    var markerType = 'text';
    var textContent = '';
    if (markerTokens.length === 1 && consts_1.mathTokenTypes.includes(markerTokens[0].type)) {
        markerType = 'math';
        if (markerTokens[0].mathEquation) {
            try {
                var svg = '';
                var svgStart = markerTokens[0].mathEquation.indexOf('<svg');
                var svgEnd = markerTokens[0].mathEquation.indexOf('</mjx-container>');
                svg = svgStart >= 0 && svgEnd > 0 ? markerTokens[0].mathEquation.slice(svgStart, svgEnd) : '';
                var resSvg = (0, convert_scv_to_base64_1.default)(svg);
                htmlMarker += resSvg;
            }
            catch (e) {
                htmlMarker += markerTokens[0].mathEquation;
            }
        }
        else {
            htmlMarker += slf.renderInline([markerTokens[0]], options);
        }
        return {
            htmlMarker: htmlMarker,
            markerType: markerType,
            textContent: ''
        };
    }
    for (var j = 0; j < markerTokens.length; j++) {
        if (markerTokens[j].type !== 'text') {
            markerType = 'multi';
        }
        if (markerTokens[j].mathEquation) {
            try {
                var svg = '';
                var svgStart = markerTokens[j].mathEquation.indexOf('<svg');
                var svgEnd = markerTokens[j].mathEquation.indexOf('</mjx-container>');
                svg = svgStart >= 0 && svgEnd > 0 ? markerTokens[j].mathEquation.slice(svgStart, svgEnd) : '';
                var resSvg = (0, convert_scv_to_base64_1.default)(svg);
                htmlMarker += resSvg;
            }
            catch (e) {
                htmlMarker += markerTokens[j].mathEquation;
            }
            continue;
        }
        var renderdToken = slf.renderInline([markerTokens[j]], options);
        if (markerType === 'text') {
            textContent += renderdToken;
        }
        else {
            textContent = '';
        }
        htmlMarker += renderdToken;
    }
    return {
        htmlMarker: htmlMarker,
        markerType: markerType,
        textContent: textContent
    };
};
var isTextMarkerTokens = function (markerTokens, slf, options) {
    var markerType = 'text';
    if (markerTokens.length === 1 && consts_1.mathTokenTypes.includes(markerTokens[0].type)) {
        markerType = 'math';
        return {
            markerType: markerType,
            textContent: ''
        };
    }
    var textContent = '';
    for (var j = 0; j < markerTokens.length; j++) {
        if (markerTokens[j].type !== 'text') {
            markerType = 'multi';
            break;
        }
        textContent += slf.renderInline([markerTokens[j]], options);
    }
    return {
        markerType: markerType,
        textContent: textContent
    };
};
var generateHtmlForCustomMarker = function (token, options, slf) {
    var htmlMarker = '';
    var markerType = 'text';
    var textContent = '';
    if (options.forDocx) {
        var data = generateHtmlForMarkerTokens(token.markerTokens, slf, options);
        htmlMarker = data.htmlMarker;
        markerType = data.markerType;
        textContent = data.textContent;
    }
    else {
        htmlMarker = token.marker && token.markerTokens.length
            ? slf.renderInline(token.markerTokens, options) : '';
    }
    return {
        htmlMarker: htmlMarker,
        markerType: markerType,
        textContent: textContent
    };
};
var render_item_inline = function (tokens, index, options, env, slf) {
    var _a;
    var token = tokens[index];
    var sContent = '';
    var content = '';
    for (var i = 0; i < token.children.length; i++) {
        var tok = token.children[i];
        if (tok.children) {
            if (tok.type = "tabular_inline") {
                content = (0, render_tabular_1.renderTabularInline)(token.children, tok, options, env, slf);
            }
            else {
                content = slf.renderInline(tok.children, options);
            }
        }
        else {
            content = slf.renderInline([tok], options);
        }
        sContent += content;
    }
    if ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length) {
        if ((0, common_1.needToHighlightAll)(token)) {
            sContent = (0, common_1.highlightText)(token, sContent);
        }
    }
    if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
        return "<li>".concat(sContent, "</li>");
    }
    if (!sContent) {
        sContent = '&nbsp';
    }
    var dataAttr = '';
    var htmlMarker = '';
    if (token.parentType === "enumerate") {
        if (token.hasOwnProperty('marker') && token.markerTokens) {
            list_injectLineNumbers(tokens, index, "li_enumerate not_number");
            dataAttr += ' data-custom-marker="true"';
            var data = generateHtmlForCustomMarker(token, options, slf);
            htmlMarker = data.htmlMarker;
            if (options.forDocx) {
                dataAttr += " data-custom-marker-type=\"".concat(data.markerType, "\"");
                if (data.markerType === 'text') {
                    dataAttr += " data-custom-marker-content=\"".concat(encodeURI(data.textContent), "\"");
                }
                else {
                    dataAttr += " data-custom-marker-content=\"".concat(encodeURI(token.marker), "\"");
                }
            }
            return "<li".concat(slf.renderAttrs(token)).concat(dataAttr, " style=\"display: block\"><span class=\"li_level\"").concat(dataAttr, ">").concat(htmlMarker, "</span>").concat(sContent, "</li>");
        }
        list_injectLineNumbers(tokens, index, "li_enumerate");
        return "<li".concat(slf.renderAttrs(token), ">").concat(sContent, "</li>");
    }
    else {
        var itemizeLevelTokens = (0, re_level_1.GetItemizeLevelTokens)(token.itemizeLevel);
        if (token.hasOwnProperty('marker') && token.markerTokens) {
            dataAttr += ' data-custom-marker="true"';
            var data = generateHtmlForCustomMarker(token, options, slf);
            htmlMarker = data.htmlMarker;
            if (options.forDocx) {
                dataAttr += " data-custom-marker-type=\"".concat(data.markerType, "\"");
                if (data.markerType === 'text') {
                    dataAttr += " data-custom-marker-content=\"".concat(encodeURI(data.textContent), "\"");
                }
                else {
                    dataAttr += " data-custom-marker-content=\"".concat(encodeURI(token.marker), "\"");
                }
            }
        }
        else {
            if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
                if (options.forDocx) {
                    var data = generateHtmlForMarkerTokens(itemizeLevelTokens[level_itemize - 1], slf, options);
                    htmlMarker = data.htmlMarker;
                    if (data.markerType === 'math') {
                        var itemizeLevel = (0, re_level_1.GetItemizeLevel)(tokens[index].itemizeLevelContents);
                        if (itemizeLevel.length >= level_itemize) {
                            dataAttr += " data-custom-marker-content=\"".concat(encodeURI(itemizeLevel[level_itemize - 1]), "\"");
                        }
                        dataAttr += ' data-custom-marker="true"';
                        dataAttr += " data-custom-marker-type=\"".concat(data.markerType, "\"");
                    }
                }
                else {
                    htmlMarker = slf.renderInline(itemizeLevelTokens[level_itemize - 1], options);
                }
            }
            else {
                htmlMarker = '.';
            }
        }
        list_injectLineNumbers(tokens, index, "li_itemize");
        return "<li".concat(slf.renderAttrs(token)).concat(dataAttr, "><span class=\"li_level\"").concat(dataAttr, ">").concat(htmlMarker, "</span>").concat(sContent, "</li>");
    }
};
exports.render_item_inline = render_item_inline;
var render_latex_list_item_open = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
        return "<li>";
    }
    if (token.parentType === "enumerate") {
        list_injectLineNumbers(tokens, index, "li_enumerate block");
        return "<li".concat(slf.renderAttrs(token), ">");
    }
    else {
        var itemizeLevelTokens = (0, re_level_1.GetItemizeLevelTokens)(token.itemizeLevel);
        var span = '.';
        if (token.marker && token.markerTokens) {
            span = slf.renderInline(token.markerTokens, options);
        }
        else {
            span = level_itemize > 0 && itemizeLevelTokens.length >= level_itemize
                ? slf.renderInline(itemizeLevelTokens[level_itemize - 1], options)
                : '.';
        }
        list_injectLineNumbers(tokens, index, "li_itemize block");
        return "<li".concat(slf.renderAttrs(token), "><span class=\"li_level\">").concat(span, "</span>");
    }
};
exports.render_latex_list_item_open = render_latex_list_item_open;
var render_latex_list_item_close = function () {
    return "</li>";
};
exports.render_latex_list_item_close = render_latex_list_item_close;
var render_itemize_list_close = function () {
    level_itemize--;
    if (level_itemize > 0) {
        return "</ul></li>";
    }
    return "</ul>";
};
exports.render_itemize_list_close = render_itemize_list_close;
var render_enumerate_list_close = function () {
    level_enumerate--;
    return "</ol>";
};
exports.render_enumerate_list_close = render_enumerate_list_close;
//# sourceMappingURL=render-lists.js.map
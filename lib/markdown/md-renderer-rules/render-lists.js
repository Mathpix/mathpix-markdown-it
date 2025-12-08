"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render_enumerate_list_close = exports.render_itemize_list_close = exports.render_latex_list_item_close = exports.render_latex_list_item_open = exports.render_item_inline = exports.render_enumerate_list_open = exports.render_itemize_list_open = void 0;
var rules_1 = require("../rules");
var re_level_1 = require("../md-block-rule/lists/re-level");
var render_tabular_1 = require("./render-tabular");
var common_1 = require("../highlight/common");
var convert_scv_to_base64_1 = require("../md-svg-to-base64/convert-scv-to-base64");
var consts_1 = require("../common/consts");
var utils_1 = require("../utils");
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
            var data = isTextMarkerTokens(itemizeLevelTokens[level_itemize - 1], renderer, options, env);
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
var generateHtmlForMarkerTokens = function (markerTokens, slf, options, env) {
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
            htmlMarker += slf.renderInline([markerTokens[0]], options, env);
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
        var renderdToken = slf.renderInline([markerTokens[j]], options, env);
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
var isTextMarkerTokens = function (markerTokens, slf, options, env) {
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
        textContent += slf.renderInline([markerTokens[j]], options, env);
    }
    return {
        markerType: markerType,
        textContent: textContent
    };
};
var generateHtmlForCustomMarker = function (token, options, slf, env) {
    var htmlMarker = '';
    var markerType = 'text';
    var textContent = '';
    if (options.forDocx) {
        var data = generateHtmlForMarkerTokens(token.markerTokens, slf, options, env);
        htmlMarker = data.htmlMarker;
        markerType = data.markerType;
        textContent = data.textContent;
    }
    else {
        htmlMarker = token.marker && token.markerTokens.length
            ? slf.renderInline(token.markerTokens, options, env) : '';
    }
    return {
        htmlMarker: htmlMarker,
        markerType: markerType,
        textContent: textContent
    };
};
/**
 * Builds HTML marker information for list items that define a custom marker.
 *
 * Extracts the rendered marker (HTML) and assembles the corresponding
 * `data-*` attributes used for HTML and DOCX export.
 */
var buildCustomMarkerInfo = function (token, options, slf, env) {
    var dataAttrs = ['data-custom-marker="true"'];
    var data = generateHtmlForCustomMarker(token, options, slf, env);
    var htmlMarker = data.htmlMarker;
    if (options.forDocx) {
        dataAttrs.push("data-custom-marker-type=\"".concat(data.markerType, "\""));
        var content = data.markerType === 'text'
            ? data.textContent
            : token.marker;
        dataAttrs.push("data-custom-marker-content=\"".concat(encodeURI(content), "\""));
    }
    var dataAttr = dataAttrs.length ? ' ' + dataAttrs.join(' ') : '';
    return { htmlMarker: htmlMarker, dataAttr: dataAttr };
};
/**
 * Builds marker information for LaTeX-style itemize list items.
 *
 * If the token defines a custom marker, delegates to `buildCustomMarkerInfo`.
 * Otherwise, derives the marker from the itemize level tokens and, when
 * exporting to DOCX, attaches appropriate `data-*` attributes (including
 * math markers and their raw LaTeX content).
 */
var buildItemizeMarkerInfo = function (token, options, env, slf, level_itemize) {
    var itemizeLevelTokens = (0, re_level_1.GetItemizeLevelTokens)(token.itemizeLevel);
    var dataAttr = '';
    var htmlMarker = '.';
    if (token.hasOwnProperty('marker') && token.markerTokens) {
        return buildCustomMarkerInfo(token, options, slf, env);
    }
    if (level_itemize > 0 && itemizeLevelTokens.length >= level_itemize) {
        if (options.forDocx) {
            var data = generateHtmlForMarkerTokens(itemizeLevelTokens[level_itemize - 1], slf, options, env);
            htmlMarker = data.htmlMarker;
            if (data.markerType === 'math') {
                var itemizeLevel = (0, re_level_1.GetItemizeLevel)(token.itemizeLevelContents);
                if (itemizeLevel.length >= level_itemize) {
                    dataAttr += " data-custom-marker-content=\"".concat(encodeURI(itemizeLevel[level_itemize - 1]), "\"");
                }
                dataAttr += ' data-custom-marker="true"';
                dataAttr += " data-custom-marker-type=\"".concat(data.markerType, "\"");
            }
        }
        else {
            htmlMarker = slf.renderInline(itemizeLevelTokens[level_itemize - 1], options, env);
        }
    }
    return { htmlMarker: htmlMarker, dataAttr: dataAttr };
};
/**
 * Renders the core HTML for a LaTeX-style list item (`<li>`), handling both
 * `enumerate` and `itemize` environments.
 *
 * Applies custom markers, DOCX-related `data-*` attributes, and line number
 * injection, and can either return an "open" `<li>...` prefix (no content)
 * or a fully closed `<li>...</li>` element depending on the mode.
 */
var renderLatexListItemCore = function (tokens, index, options, env, slf, sContent, mode) {
    var token = tokens[index];
    // if not a latex list at all
    if (token.parentType !== 'itemize' && token.parentType !== 'enumerate') {
        return mode === 'open' ? '<li>' : "<li>".concat(sContent, "</li>");
    }
    var dataAttr = '';
    var htmlMarker = '';
    var isEnumerate = token.parentType === 'enumerate';
    // ENUMERATE
    if (isEnumerate) {
        var hasCustomMarker = token.hasOwnProperty('marker') && token.markerTokens;
        if (hasCustomMarker) {
            // line numbers
            list_injectLineNumbers(tokens, index, 'li_enumerate not_number');
            var markerInfo = buildCustomMarkerInfo(token, options, slf, env);
            dataAttr += markerInfo.dataAttr;
            htmlMarker = markerInfo.htmlMarker;
            var prefix_1 = "<li".concat(slf.renderAttrs(token)).concat(dataAttr, " style=\"display: block\">") +
                "<span class=\"li_level\"".concat(dataAttr, ">").concat(htmlMarker, "</span>");
            if (mode === 'open') {
                return prefix_1;
            }
            return "".concat(prefix_1).concat(sContent, "</li>");
        }
        // regular numbered element
        list_injectLineNumbers(tokens, index, mode === 'open' ? 'li_enumerate block' : 'li_enumerate');
        var prefix_2 = "<li".concat(slf.renderAttrs(token), ">");
        if (mode === 'open') {
            return prefix_2;
        }
        return "".concat(prefix_2).concat(sContent, "</li>");
    }
    // ITEMIZE
    var _a = buildItemizeMarkerInfo(token, options, env, slf, level_itemize), itemizeMarker = _a.htmlMarker, itemizeDataAttr = _a.dataAttr;
    htmlMarker = itemizeMarker;
    dataAttr += itemizeDataAttr || '';
    list_injectLineNumbers(tokens, index, mode === 'open' ? 'li_itemize block' : 'li_itemize');
    var prefix = "<li".concat(slf.renderAttrs(token)).concat(dataAttr, ">") +
        "<span class=\"li_level\"".concat(dataAttr, ">").concat(htmlMarker, "</span>");
    if (mode === 'open') {
        return prefix;
    }
    return "".concat(prefix).concat(sContent, "</li>");
};
var render_item_inline = function (tokens, index, options, env, slf) {
    var _a;
    var token = tokens[index];
    var sContent = '';
    var content = '';
    for (var i = 0; i < token.children.length; i++) {
        var tok = token.children[i];
        if (tok.children) {
            if (tok.type === "tabular_inline") {
                content = (0, render_tabular_1.renderTabularInline)(token.children, tok, options, env, slf);
            }
            else {
                content = slf.renderInline(tok.children, options, env);
            }
        }
        else {
            if ((0, utils_1.isMathInText)(token.children, i, options)) {
                tok.attrSet('data-math-in-text', "true");
            }
            content = slf.renderInline([tok], options, env);
            if ((options === null || options === void 0 ? void 0 : options.forPptx) && i === 0 && ['equation_math', 'equation_math_not_number', 'display_math'].includes(tok.type)) {
                content = '<span>&nbsp</span>' + content;
            }
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
    return renderLatexListItemCore(tokens, index, options, env, slf, sContent, 'full');
};
exports.render_item_inline = render_item_inline;
var render_latex_list_item_open = function (tokens, index, options, env, slf) {
    return renderLatexListItemCore(tokens, index, options, env, slf, null, 'open');
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
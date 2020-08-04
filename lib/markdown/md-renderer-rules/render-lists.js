"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render_enumerate_list_close = exports.render_itemize_list_close = exports.render_latex_list_item_close = exports.render_latex_list_item_open = exports.render_item_inline = exports.render_enumerate_list_open = exports.render_itemize_list_open = void 0;
var rules_1 = require("../rules");
var re_level_1 = require("../md-block-rule/lists/re-level");
var render_tabular_1 = require("./render-tabular");
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
        tokens[idx].attrJoin("data_line_start", "" + String(line));
        tokens[idx].attrJoin("data_line_end", "" + String(endLine - 1));
        tokens[idx].attrJoin("data_line", "" + String([line, endLine]));
        tokens[idx].attrJoin("count_line", "" + String(endLine - line));
        if (tokens[idx].hasOwnProperty('parentStart')) {
            tokens[idx].attrJoin("data_parent_line_start", "" + String(tokens[idx].parentStart));
        }
    }
    else {
        tokens[idx].attrJoin("class", className);
    }
};
exports.render_itemize_list_open = function (tokens, index, renderer) {
    if (tokens[index].level === 0) {
        level_itemize = 0;
    }
    level_itemize++;
    list_injectLineNumbers(tokens, index, "itemize");
    return "<ul" + renderer.renderAttrs(tokens[index]) + " style=\"list-style-type: none\">";
};
exports.render_enumerate_list_open = function (tokens, index, renderer) {
    if (tokens[index].level === 0) {
        level_enumerate = 0;
    }
    level_enumerate++;
    var itLevel = re_level_1.GetEnumerateLevel(tokens[index].enumerateLevel);
    var str = itLevel.length >= level_enumerate ? itLevel[level_enumerate - 1] : 'decimal';
    list_injectLineNumbers(tokens, index, "enumerate " + str);
    return "<ol" + renderer.renderAttrs(tokens[index]) + " style=\" list-style-type: " + str + "\">";
};
exports.render_item_inline = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    var sContent = '';
    var content = '';
    for (var i = 0; i < token.children.length; i++) {
        var tok = token.children[i];
        if (tok.children) {
            if (tok.type = "tabular_inline") {
                content = render_tabular_1.renderTabularInline(token.children, tok, options, env, slf);
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
    if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
        return "<li>" + sContent + "</li>";
    }
    if (token.parentType === "enumerate") {
        list_injectLineNumbers(tokens, index, "li_enumerate");
        return "<li" + slf.renderAttrs(token) + ">" + sContent + "</li>";
    }
    else {
        var itemizeLevelTokens = re_level_1.GetItemizeLevelTokens(token.itemizeLevel);
        var span = '.';
        if (token.marker && token.markerTokens) {
            span = slf.renderInline(token.markerTokens, options);
        }
        else {
            span = level_itemize > 0 && itemizeLevelTokens.length >= level_itemize
                ? slf.renderInline(itemizeLevelTokens[level_itemize - 1], options)
                : '.';
        }
        list_injectLineNumbers(tokens, index, "li_itemize");
        return "<li" + slf.renderAttrs(token) + "><span class=\"li_level\">" + span + "</span>" + sContent + "</li>";
    }
};
exports.render_latex_list_item_open = function (tokens, index, options, env, slf) {
    var token = tokens[index];
    if (token.parentType !== "itemize" && token.parentType !== "enumerate") {
        return "<li>";
    }
    if (token.parentType === "enumerate") {
        list_injectLineNumbers(tokens, index, "li_enumerate block");
        return "<li" + slf.renderAttrs(token) + ">";
    }
    else {
        var itemizeLevelTokens = re_level_1.GetItemizeLevelTokens(token.itemizeLevel);
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
        return "<li" + slf.renderAttrs(token) + "><span class=\"li_level\">" + span + "</span>";
    }
};
exports.render_latex_list_item_close = function () {
    return "</li>";
};
exports.render_itemize_list_close = function () {
    level_itemize--;
    return "</ul>";
};
exports.render_enumerate_list_close = function () {
    level_enumerate--;
    return "</ol>";
};
//# sourceMappingURL=render-lists.js.map
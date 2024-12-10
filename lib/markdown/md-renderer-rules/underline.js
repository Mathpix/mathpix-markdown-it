"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderOutText = exports.renderOutOpen = exports.renderUnderlineClose = exports.renderUnderlineOpen = exports.renderUnderlineText = void 0;
var render_tabular_1 = require("./render-tabular");
var mdPluginText_1 = require("../mdPluginText");
var utils_1 = require("../utils");
var htmlUnderlineOpen = function (underlineLevel, underlineType, underlinePadding) {
    if (underlineType === void 0) { underlineType = 'underline'; }
    if (underlinePadding === void 0) { underlinePadding = 0; }
    if (underlineType === 'uwave') {
        var html_1 = "<span data-underline-level=\"".concat(underlineLevel, "\" ");
        html_1 += "data-underline-type=\"".concat(underlineType, "\" ");
        html_1 += 'style="';
        html_1 += 'text-decoration: underline; text-decoration-style: wavy;';
        html_1 += '">';
        return html_1;
    }
    var cssBackground = "border-bottom: 1px solid;";
    switch (underlineType) {
        case 'dashuline':
            cssBackground = "background-position: bottom; " +
                "background-size: 12px 1px; " +
                "background-repeat: repeat-x; " +
                "background-image: radial-gradient(circle, currentcolor 3px, transparent 1px);";
            break;
        case 'dotuline':
            cssBackground = "background-position: bottom; " +
                "background-size: 10px 2px; " +
                "background-repeat: repeat-x; " +
                "background-image: radial-gradient(circle, currentcolor 1px, transparent 1px);";
            break;
    }
    var cssLineHeight = "";
    var cssBackgroundPosition = '';
    var cssPaddingBottom = '';
    if (underlineLevel >= 1) {
        switch (underlineLevel) {
            case 1:
                cssBackgroundPosition = underlineType !== 'dotuline' && underlineType !== 'dashuline'
                    ? "background-position: 0 -1px;" : '';
                break;
            case 2:
                cssPaddingBottom = "padding-bottom: ".concat(underlinePadding, "px;");
                break;
            default:
                var lineHeight = underlineLevel >= 3 ? (underlineLevel - 2) * 4 + 1 : 5;
                cssPaddingBottom = "padding-bottom: ".concat(underlinePadding, "px;");
                cssLineHeight = "line-height: ".concat(28 + lineHeight, "px;");
                break;
        }
    }
    else {
        cssBackgroundPosition = "background-position: 0 -1px;";
    }
    var html = '<span ';
    html += "data-underline-level=\"".concat(underlineLevel, "\" ");
    html += "data-underline-type=\"".concat(underlineType, "\" ");
    html += "style=\"";
    html += cssBackground ? cssBackground : '';
    html += cssBackgroundPosition ? cssBackgroundPosition : '';
    html += cssPaddingBottom ? cssPaddingBottom : '';
    html += cssLineHeight ? cssLineHeight : '';
    html += '">';
    return html;
};
var renderUnderlineText = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var sContent = '';
    var content = '';
    token.underlineParentLevel = token.underlineParentLevel
        ? token.underlineParentLevel + 1 : 1;
    if (token.children && token.children.length) {
        for (var i = 0; i < token.children.length; i++) {
            var tok = token.children[i];
            if (tok.type === 'underline') {
                tok.underlineParentLevel = token.underlineParentLevel;
                if ((0, utils_1.isMathInText)(token.children, i, options)) {
                    tok.attrSet('data-math-in-text', "true");
                }
                content = slf.renderInline([tok], options, env);
            }
            else {
                if (tok.children && tok.children.length > 1) {
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
                }
            }
            sContent += content;
        }
    }
    else {
        sContent = token.content;
    }
    ;
    return sContent;
};
exports.renderUnderlineText = renderUnderlineText;
var renderUnderlineOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    if (token.underlineType === 'uuline') {
        return htmlUnderlineOpen(token.underlineLevel + 1, token.underlineType, token.underlinePadding)
            + htmlUnderlineOpen(token.underlineLevel, token.underlineType, token.underlinePadding > 3 ? token.underlinePadding - 3 : token.underlinePadding);
    }
    return htmlUnderlineOpen(token.underlineLevel, token.underlineType, token.underlinePadding);
};
exports.renderUnderlineOpen = renderUnderlineOpen;
var renderUnderlineClose = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var html = '</span>';
    if (token.underlineType === 'uuline') {
        html += '</span>';
    }
    if (!token.isSubUnderline && token.underlineLevel >= 3) {
        var lineHeight = token.underlineLevel >= 3 ? (token.underlineLevel - 2) * 4 + 1 : 5;
        /** zero-width space */
        return html + "<span style=\"height: ".concat(28 + lineHeight, "px; display: inline-block;\">&#8203;</span>");
    }
    return html;
};
exports.renderUnderlineClose = renderUnderlineClose;
var renderOutOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var html = "<span ";
    html += "data-out-type=\"".concat(token.underlineType, "\" ");
    html += 'style="';
    html += token.underlineType === 'xout'
        ? 'background: repeating-linear-gradient(-60deg, currentcolor, currentcolor, transparent 1px, transparent 6px);'
        : 'text-decoration: line-through; text-decoration-thickness: from-font;';
    html += '">';
    return html;
};
exports.renderOutOpen = renderOutOpen;
var renderOutText = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    return (0, mdPluginText_1.renderInlineContent)(token, options, env, slf);
};
exports.renderOutText = renderOutText;
//# sourceMappingURL=underline.js.map
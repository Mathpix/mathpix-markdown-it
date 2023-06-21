"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderUnderlineClose = exports.renderUnderlineOpen = exports.renderUnderlineText = void 0;
var render_tabular_1 = require("./render-tabular");
var htmlUnderlineOpen = function (underlineLevel, underlineType, underlinePadding) {
    if (underlineType === void 0) { underlineType = 'underline'; }
    if (underlinePadding === void 0) { underlinePadding = 0; }
    if (underlineType === 'uwave') {
        var html_1 = "<span data-underline=\"" + underlineLevel + "\" style=\"";
        html_1 += 'text-decoration: underline; text-decoration-style: wavy;';
        html_1 += '">';
        return html_1;
    }
    if (underlineType === 'sout') {
        var html_2 = "<span data-underline=\"" + underlineLevel + "\" style=\"";
        html_2 += 'text-decoration: line-through; text-decoration-thickness: from-font;';
        html_2 += '">';
        return html_2;
    }
    if (underlineType === 'xout') {
        var html_3 = "<span data-underline=\"" + underlineLevel + "\" style=\"";
        html_3 += 'background: repeating-linear-gradient(-60deg, currentcolor, currentcolor, transparent 1px, transparent 6px);';
        html_3 += '">';
        return html_3;
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
                cssPaddingBottom = "padding-bottom: " + underlinePadding + "px;";
                break;
            default:
                var lineHeight = underlineLevel >= 3 ? (underlineLevel - 2) * 4 + 1 : 5;
                cssPaddingBottom = "padding-bottom: " + underlinePadding + "px;";
                cssLineHeight = "line-height: " + (28 + lineHeight) + "px;";
                break;
        }
    }
    else {
        cssBackgroundPosition = "background-position: 0 -1px;";
    }
    var html = '<span ';
    html += "data-underline-level=\"" + underlineLevel + "\" ";
    html += "data-underline-type=\"" + underlineType + "\" ";
    html += "style=\"";
    html += cssBackground ? cssBackground : '';
    html += cssBackgroundPosition ? cssBackgroundPosition : '';
    html += cssPaddingBottom ? cssPaddingBottom : '';
    html += cssLineHeight ? cssLineHeight : '';
    html += '">';
    return html;
};
exports.renderUnderlineText = function (tokens, idx, options, env, slf) {
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
                content = slf.renderInline([tok], options, env);
            }
            else {
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
exports.renderUnderlineOpen = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    if (token.underlineType === 'uuline') {
        return htmlUnderlineOpen(token.underlineLevel + 1, token.underlineType, token.underlinePadding)
            + htmlUnderlineOpen(token.underlineLevel, token.underlineType, token.underlinePadding > 3 ? token.underlinePadding - 3 : token.underlinePadding);
    }
    return htmlUnderlineOpen(token.underlineLevel, token.underlineType, token.underlinePadding);
};
exports.renderUnderlineClose = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    var html = '</span>';
    if (token.underlineType === 'uuline') {
        html += '</span>';
    }
    if (!token.isSubUnderline && token.underlineLevel >= 3) {
        var lineHeight = token.underlineLevel >= 3 ? (token.underlineLevel - 2) * 4 + 1 : 5;
        /** zero-width space */
        return html + ("<span style=\"height: " + (28 + lineHeight) + "px; display: inline-block;\">&#8203;</span>");
    }
    return html;
};
//# sourceMappingURL=underline.js.map
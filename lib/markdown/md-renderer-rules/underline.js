"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderUnderlineClose = exports.renderUnderlineOpen = exports.renderUnderlineText = void 0;
var render_tabular_1 = require("./render-tabular");
var htmlUnderlineOpen = function (underlineLevel) {
    var cssBackground = "background: linear-gradient(0deg, currentcolor 1px, transparent 1px, transparent 1px);";
    var cssLineHeight = "";
    var cssBackgroundPosition = '';
    var cssPaddingBottom = '';
    if (underlineLevel >= 1) {
        switch (underlineLevel) {
            case 1:
                cssBackgroundPosition = "background-position: 0 -1px;";
                break;
            case 2:
                cssPaddingBottom = "padding-bottom: 2px;";
                break;
            default:
                var lineHeight = underlineLevel >= 3 ? (underlineLevel - 2) * 4 + 1 : 5;
                var paddingBottom = underlineLevel >= 3 ? (underlineLevel - 2) * 3 + 2 : 5;
                cssPaddingBottom = "padding-bottom: " + paddingBottom + "px;";
                cssLineHeight = "line-height: " + (28 + lineHeight) + "px;";
                break;
        }
    }
    else {
        cssBackgroundPosition = "background-position: 0 -1px;";
    }
    var html = "<span data-underline=\"" + underlineLevel + "\" style=\"";
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
    return htmlUnderlineOpen(token.underlineLevel);
};
exports.renderUnderlineClose = function (tokens, idx, options, env, slf) {
    return '</span>';
};
//# sourceMappingURL=underline.js.map
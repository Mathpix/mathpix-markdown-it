"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
exports.CaptionTable = function (a, token) {
    return "<div class=" + (token.attrs[token.attrIndex('class')]
        ? token.attrs[token.attrIndex('class')][1]
        : "caption_table") + ">" + token.content + "</div>";
};
exports.InlineDecimal = function (a, token) {
    if (!token.content) {
        return '';
    }
    var arr = token.content.split(';');
    return "<span class=\"f\">" + arr[0] + "</span><span class=\"decimal_left\">" + (arr[1] ? arr[1] : '') + "</span><span class=\"f\">." + (arr[2] ? arr[2] : '') + "</span>";
};
exports.IncludeGraphics = function (a, token, slf, width) {
    var textWidthTag = /\\textwidth|\\linewidth/;
    var style = "text-align: " + (token.attrs[token.attrIndex('align')] ? token.attrs[token.attrIndex('align')][1] : 'center') + "; ";
    var h = token.attrs[token.attrIndex('height')];
    var styleImg = h ? "height: " + h[1] + "; " : '';
    var w = token.attrs[token.attrIndex('width')];
    if (w) {
        if (textWidthTag.test(w[1])) {
            var match = w[1].match(textWidthTag);
            if (match) {
                var textWidth = width ? width : utils_1.getTextWidth();
                var dWidth = w[1].slice(0, match.index).trim();
                dWidth = parseFloat(dWidth);
                dWidth = !dWidth ? 1 : dWidth;
                styleImg += "width: " + dWidth * textWidth + "px; ";
            }
        }
        else {
            styleImg += "width: " + w[1] + "; ";
        }
    }
    if (!styleImg) {
        var textWidth = width ? width : utils_1.getTextWidth();
        styleImg += "width: " + 0.5 * textWidth + "px; ";
    }
    var src = token.attrs[token.attrIndex('src')] ? "src=" + token.attrs[token.attrIndex('src')][1] : '';
    var alt = '';
    styleImg = styleImg ? "style=\"" + styleImg + "\"" : '';
    style = style ? "style=\"" + style + "\"" : '';
    return "<div class=\"figure_img\" " + style + "><" + token.tag + " " + src + " " + alt + " " + styleImg + "></div>";
};
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncludeGraphics = exports.InlineDecimal = exports.CaptionTable = void 0;
var utils_1 = require("../utils");
exports.CaptionTable = function (a, token) {
    return "<div class=" + (token.attrGet('class')
        ? token.attrGet('class')
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
    var style = "text-align: " + (token.attrGet('align')
        ? token.attrGet('align')
        : 'center') + "; ";
    var h = token.attrGet('height');
    var styleImg = h ? "height: " + h + "; " : '';
    var w = token.attrGet('width');
    if (w) {
        if (textWidthTag.test(w)) {
            var match = w.match(textWidthTag);
            if (match) {
                var textWidth = width ? width : utils_1.getTextWidth();
                var dWidth = w.slice(0, match.index).trim();
                dWidth = parseFloat(dWidth);
                dWidth = !dWidth ? 1 : dWidth;
                styleImg += "width: " + dWidth * textWidth + "px; ";
            }
        }
        else {
            styleImg += "width: " + w + "; ";
        }
    }
    if (!styleImg) {
        var textWidth = width ? width : utils_1.getTextWidth();
        styleImg += "width: " + 0.5 * textWidth + "px; ";
    }
    var src = token.attrGet('src') ? "src=" + token.attrGet('src') : '';
    var alt = '';
    styleImg = styleImg ? "style=\"" + styleImg + "\"" : '';
    style = style ? "style=\"" + style + "\"" : '';
    return "<div class=\"figure_img\" " + style + "><" + token.tag + " " + src + " " + alt + " " + styleImg + "></div>";
};
//# sourceMappingURL=index.js.map
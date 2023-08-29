"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncludeGraphics = exports.InlineDecimal = exports.CaptionTable = void 0;
var utils_1 = require("../utils");
var CaptionTable = function (tokens, idx, options, env, slf) {
    var _a;
    var token = tokens[idx];
    var htmlPrint = token.print ? token.print : '';
    var htmlCaption = ((_a = token.children) === null || _a === void 0 ? void 0 : _a.length)
        ? slf.renderInline(token.children, options, env)
        : token.content;
    return "<div class=".concat(token.attrGet('class')
        ? token.attrGet('class')
        : "caption_table", ">").concat(htmlPrint).concat(htmlCaption, "</div>");
};
exports.CaptionTable = CaptionTable;
var InlineDecimal = function (a, token) {
    if (!token.content) {
        return '';
    }
    var arr = token.content.split(';');
    return "<span class=\"f\">".concat(arr[0], "</span><span class=\"decimal_left\">").concat(arr[1] ? arr[1] : '', "</span><span class=\"f\">.").concat(arr[2] ? arr[2] : '', "</span>");
};
exports.InlineDecimal = InlineDecimal;
var IncludeGraphics = function (a, token, slf, width, options) {
    var textWidthTag = /\\textwidth|\\linewidth/;
    var align = token.attrGet('align');
    if (!align && options.centerImages) {
        align = 'center';
    }
    var style = align ? "text-align: ".concat(align, "; ") : '';
    var h = token.attrGet('height');
    var styleImg = h ? "height: ".concat(h, "; ") : '';
    var w = token.attrGet('width');
    if (w) {
        if (textWidthTag.test(w)) {
            var match = w.match(textWidthTag);
            if (match) {
                var textWidth = width ? width : (0, utils_1.getTextWidth)();
                var dWidth = w.slice(0, match.index).trim();
                dWidth = parseFloat(dWidth);
                dWidth = !dWidth ? 1 : dWidth;
                styleImg += "width: ".concat(dWidth * textWidth, "px; ");
            }
        }
        else {
            styleImg += "width: ".concat(w, "; ");
        }
    }
    if (!styleImg) {
        var textWidth = width ? width : (0, utils_1.getTextWidth)();
        /** max-width - prevent small images from being stretched */
        styleImg += "max-width: ".concat(0.5 * textWidth, "px; ");
    }
    var src = token.attrGet('src') ? "src=".concat(token.attrGet('src')) : '';
    var alt = '';
    styleImg = styleImg ? "style=\"".concat(styleImg, "\"") : '';
    var data_mmd_highlight = token.attrGet('data-mmd-highlight');
    data_mmd_highlight = data_mmd_highlight ? data_mmd_highlight : '';
    style = style ? "style=\"".concat(style).concat(data_mmd_highlight, "\"") : '';
    return "<div class=\"figure_img\" ".concat(style, "><").concat(token.tag, " ").concat(src, " ").concat(alt, " ").concat(styleImg, "></div>");
};
exports.IncludeGraphics = IncludeGraphics;
//# sourceMappingURL=index.js.map
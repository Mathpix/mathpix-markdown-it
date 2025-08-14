"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncludeGraphics = exports.InlineDecimal = exports.CaptionTable = void 0;
var consts_1 = require("../common/consts");
var CaptionTable = function (tokens, idx, options, env, slf) {
    var _a, _b;
    var token = tokens[idx];
    var className = token.attrGet('class') || 'caption_table';
    var printText = (_a = token.print) !== null && _a !== void 0 ? _a : '';
    var htmlCaption = ((_b = token.children) === null || _b === void 0 ? void 0 : _b.length)
        ? slf.renderInline(token.children, options, env)
        : token.content;
    return "<div class=\"".concat(className, "\">").concat(printText).concat(htmlCaption, "</div>");
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
var IncludeGraphics = function (tokens, idx, options, env, slf) {
    var _a;
    var token = tokens[idx];
    var containerWidthPx = (options === null || options === void 0 ? void 0 : options.width) || 0;
    var RAW_WIDTH = token.attrGet('width') || '';
    var RAW_HEIGHT = token.attrGet('height') || '';
    var SRC = token.attrGet('src') || '';
    var ALT = token.attrGet('alt') || '';
    var HILITE = token.attrGet('data-mmd-highlight') || '';
    var TAG = token.tag || 'img';
    // wrapper styles (centering, highlighting)
    var wrapperStyles = [];
    var align = token.attrGet('align') || ((options === null || options === void 0 ? void 0 : options.centerImages) ? 'center' : '');
    if (align)
        wrapperStyles.push("text-align: ".concat(align, ";"));
    if (HILITE)
        wrapperStyles.push(HILITE);
    // ---- image styles ----
    var imgStyles = [];
    // height
    if (RAW_HEIGHT) {
        imgStyles.push("height: ".concat(RAW_HEIGHT, ";"));
    }
    // width
    // Support: 0.75\textwidth, \textwidth, 1\linewidth, etc.
    // Grab the factor (can be empty), then \textwidth|\linewidth
    var twMatch = RAW_WIDTH.match(consts_1.TEXTWIDTH_RE);
    if (twMatch) {
        var factor = Math.max(0, parseFloat((_a = twMatch[1]) !== null && _a !== void 0 ? _a : '1')) || 1;
        if (containerWidthPx && Number.isFinite(containerWidthPx)) {
            var px = Math.round(factor * containerWidthPx);
            imgStyles.push("width: ".concat(px, "px;"));
        }
        else {
            var pct = Math.min(100, factor * 100);
            imgStyles.push("width: ".concat(pct, "%;"));
        }
    }
    else if (RAW_WIDTH) {
        // Any other units (“300px”, “12cm”, “40%”, “10em”) — we give as is
        imgStyles.push("width: ".concat(RAW_WIDTH, ";"));
    }
    else {
        // Width not specified
        /** max-width - prevent small images from being stretched */
        if (containerWidthPx && Number.isFinite(containerWidthPx)) {
            imgStyles.push("max-width: ".concat(Math.round(containerWidthPx * 0.5), "px;"));
        }
        else {
            imgStyles.push('max-width: 50%;');
        }
    }
    var divStyleAttr = wrapperStyles.length ? " style=\"".concat(wrapperStyles.join(' '), "\"") : '';
    var imgStyleAttr = imgStyles.length ? " style=\"".concat(imgStyles.join(' '), "\"") : '';
    var srcAttr = SRC ? " src=\"".concat(SRC, "\"") : '';
    var altAttr = " alt=\"".concat(ALT.replace(/"/g, '&quot;'), "\"");
    return "<div class=\"figure_img\"".concat(divStyleAttr, "><").concat(TAG).concat(srcAttr).concat(altAttr).concat(imgStyleAttr).concat(TAG === 'img' ? '/' : '', ">").concat(TAG === 'img' ? '' : '</' + TAG + '>', "</div>");
};
exports.IncludeGraphics = IncludeGraphics;
//# sourceMappingURL=index.js.map
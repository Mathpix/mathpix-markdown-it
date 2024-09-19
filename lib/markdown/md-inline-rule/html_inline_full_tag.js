"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html_inline_full_tag = void 0;
var html_re_1 = require("../common/html-re");
var svgInlineRegex = /^<(svg)\b[^>]*>[\s\S]*<\/svg>/i;
var preInlineRegex = /^<(pre)\b[^>]*>[\s\S]*<\/pre>/i;
var codeInlineRegex = /^<(code)\b[^>]*>[\s\S]*<\/code>/i;
var scriptInlineRegex = /^<(script)\b[^>]*>[\s\S]*<\/script>/i;
var styleInlineRegex = /^<(style)\b[^>]*>[\s\S]*<\/style>/i;
var textareaInlineRegex = /^<(textarea)\b[^>]*>[\s\S]*<\/textarea>/i;
var optionInlineRegex = /^<(option)\b[^>]*>[\s\S]*<\/option>/i;
// Helper function to match regex against state source
var matchTagRegex = function (src, pos, options) {
    var _a;
    var remainder = src.slice(pos);
    var match = remainder.match(svgInlineRegex) ||
        remainder.match(preInlineRegex) ||
        remainder.match(codeInlineRegex);
    if (match) {
        return match;
    }
    if ((options === null || options === void 0 ? void 0 : options.htmlSanitize) === true || ((_a = options === null || options === void 0 ? void 0 : options.htmlSanitize) === null || _a === void 0 ? void 0 : _a.disallowedTagsMode) === 'discard') {
        return remainder.match(styleInlineRegex) ||
            remainder.match(scriptInlineRegex) ||
            remainder.match(textareaInlineRegex) ||
            remainder.match(optionInlineRegex);
    }
    return null;
};
var html_inline_full_tag = function (state, silent) {
    try {
        var pos = state.pos, src = state.src, posMax = state.posMax;
        if (!state.md.options.html || pos + 2 >= posMax || src.charCodeAt(pos) !== 0x3C /* < */) {
            return false;
        }
        var match = matchTagRegex(src, pos, state.md.options);
        if (!match) {
            return false;
        }
        var tag = match[1] ? match[1].toLowerCase() : '';
        if (!tag) {
            return false;
        }
        var matchedTagContent = (0, html_re_1.extractFullHtmlTagContent)(src.slice(pos), tag);
        if (!(matchedTagContent === null || matchedTagContent === void 0 ? void 0 : matchedTagContent.length)) {
            return false;
        }
        if (!silent) {
            var token = state.push('html_inline', '', 0);
            token.content = src.slice(pos, pos + matchedTagContent[0].length);
            token.isFullHtmlTagContent = true;
        }
        state.pos += matchedTagContent[0].length;
        return true;
    }
    catch (err) {
        console.error("[ERROR]=>[html_inline_full_tag]=>", err);
        return false;
    }
};
exports.html_inline_full_tag = html_inline_full_tag;
//# sourceMappingURL=html_inline_full_tag.js.map
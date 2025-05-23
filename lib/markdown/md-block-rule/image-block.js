"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRuleImageBlock = exports.imageWithSizeBlock = void 0;
var tslib_1 = require("tslib");
var image_1 = require("../md-inline-rule/image");
var imageMarkdownRegex = /^!\[([^\]]*)\]\(([^)]+)\)(\s*\{([^}]+)\})?/;
var linkAndTitleRegex = /^([^" ]+)\s+"(.+)"$/;
var imageWithSizeBlock = function (state, startLine, endLine, silent) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    if (state.src.charCodeAt(pos) !== 0x21 /* ! */)
        return false;
    if (state.src.charCodeAt(pos + 1) !== 0x5B /* [ */)
        return false;
    var line = state.src.slice(pos, max);
    var match = line.match(imageMarkdownRegex);
    if (!match)
        return false;
    if (silent)
        return true;
    var _a = tslib_1.__read(match, 5), alt = _a[1], linkAndTitle = _a[2], paramStr = _a[4];
    var href = '', title = '';
    var titleMatch = linkAndTitle.match(linkAndTitleRegex);
    if (titleMatch) {
        href = titleMatch[1];
        title = titleMatch[2];
    }
    else {
        href = linkAndTitle.trim();
    }
    var attrs = [];
    attrs = [['src', href], ['alt', '']];
    if (title)
        attrs.push(['title', title]);
    if (paramStr === null || paramStr === void 0 ? void 0 : paramStr.trim()) {
        var params = null;
        if (state.md.options.centerImages) {
            params = (0, image_1.parseImageParams)(paramStr, 'center');
        }
        else {
            params = (0, image_1.parseImageParams)(paramStr, '');
        }
        if (params) {
            attrs = attrs.concat(params.attr);
        }
    }
    var token = state.push('image_block', 'img', 0);
    token.block = true;
    token.attrs = attrs;
    token.content = alt;
    token.children = [];
    token.map = [startLine, startLine + 1];
    state.line = startLine + 1;
    return true;
};
exports.imageWithSizeBlock = imageWithSizeBlock;
var renderRuleImageBlock = function (tokens, idx, options, env, slf) {
    try {
        var token = tokens[idx];
        token.attrs[token.attrIndex('alt')][1] =
            slf.renderInlineAsText(token.children, options, env);
        var align = token.attrGet('data-align');
        if (!align && options.centerImages) {
            align = 'center';
            token.attrSet('data-align', align);
        }
        var res = align
            ? "<figure style=\"text-align: ".concat(align, "\">")
            : '<figure>';
        res += slf.renderToken(tokens, idx, options);
        res += res = '</figure>';
        return res;
    }
    catch (e) {
        console.log("[ERROR]=>[renderRuleImageBlock]=>e=>", e);
        return '';
    }
};
exports.renderRuleImageBlock = renderRuleImageBlock;
//# sourceMappingURL=image-block.js.map
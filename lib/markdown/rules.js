"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectRenderRules = exports.withLineNumbers = exports.PREVIEW_LINE_CLASS = exports.PREVIEW_PARAGRAPH_PREFIX = void 0;
var sanitize_1 = require("./sanitize");
var inline_styles_1 = require("./inline-styles");
exports.PREVIEW_PARAGRAPH_PREFIX = "preview-paragraph-";
exports.PREVIEW_LINE_CLASS = "preview-line";
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
/** custom rules to inject in the renderer pipeline (aka mini plugin) */
/** inspired from https://github.com/markdown-it/markdown-it.github.io/blob/master/index.js#L9929 */
function injectLineNumbers(tokens, idx, options, env, slf) {
    var line, endLine, listLine;
    if (tokens[idx].map && tokens[idx].level === 0) {
        line = options.startLine + tokens[idx].map[0];
        endLine = options.startLine + tokens[idx].map[1];
        listLine = [];
        for (var i = line; i < endLine; i++) {
            listLine.push(i);
        }
        tokens[idx].attrJoin("class", exports.PREVIEW_PARAGRAPH_PREFIX + String(line)
            + ' ' + exports.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
        tokens[idx].attrJoin("data_line_start", "" + String(line));
        tokens[idx].attrJoin("data_line_end", "" + String(endLine - 1));
        tokens[idx].attrJoin("data_line", "" + String([line, endLine]));
        tokens[idx].attrJoin("count_line", "" + String(endLine - line));
    }
    return slf.renderToken(tokens, idx, options, env, slf);
}
function html_block_injectLineNumbers(tokens, idx, options, env, slf) {
    var _a = options.htmlSanitize, htmlSanitize = _a === void 0 ? {} : _a, enableFileLinks = options.enableFileLinks;
    var line, endLine, listLine;
    if (htmlSanitize !== false) {
        if (tokens[idx] && tokens[idx].content) {
            var optionsSanitize = {
                enableFileLinks: enableFileLinks
            };
            tokens[idx].content = sanitize_1.sanitize(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize));
        }
    }
    if (tokens[idx].map && tokens[idx].level === 0) {
        line = options.startLine + tokens[idx].map[0];
        endLine = options.startLine + tokens[idx].map[1];
        listLine = [];
        for (var i = line; i < endLine; i++) {
            listLine.push(i);
        }
        tokens[idx].attrJoin("class", exports.PREVIEW_PARAGRAPH_PREFIX + String(line)
            + ' ' + exports.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
        tokens[idx].attrJoin("data_line_start", "" + String(line));
        tokens[idx].attrJoin("data_line_end", "" + String(endLine - 1));
        tokens[idx].attrJoin("data_line", "" + String([line, endLine]));
        tokens[idx].attrJoin("count_line", "" + String(endLine - line));
    }
    var token = tokens[idx];
    return '<div' + slf.renderAttrs(token) + '>' +
        tokens[idx].content +
        '</div>\n';
}
function html_block_Sanitize(tokens, idx, options, env, slf) {
    var _a = options.htmlSanitize, htmlSanitize = _a === void 0 ? {} : _a, _b = options.enableFileLinks, enableFileLinks = _b === void 0 ? false : _b;
    if (!tokens[idx].content) {
        return '';
    }
    var optionsSanitize = {
        enableFileLinks: enableFileLinks
    };
    return sanitize_1.sanitize(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize));
}
function html_inline_Sanitize(tokens, idx, options) {
    var _a = options.htmlSanitize, htmlSanitize = _a === void 0 ? {} : _a, _b = options.enableFileLinks, enableFileLinks = _b === void 0 ? false : _b;
    if (!tokens[idx].content) {
        return '';
    }
    var hasNotCloseTag = tokens[idx].content.indexOf('/>') === -1;
    var optionsSanitize = {
        skipCloseTag: hasNotCloseTag,
        enableFileLinks: enableFileLinks
    };
    return htmlSanitize && Object.keys(htmlSanitize).length > 0
        ? sanitize_1.sanitize(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize))
        : sanitize_1.sanitize(tokens[idx].content, optionsSanitize);
}
function code_block_injectLineNumbers(tokens, idx, options, env, slf) {
    var line, endLine, listLine;
    if (tokens[idx].map && tokens[idx].level === 0) {
        line = options.startLine + tokens[idx].map[0];
        endLine = options.startLine + tokens[idx].map[1];
        listLine = [];
        for (var i = line; i < endLine; i++) {
            listLine.push(i);
        }
        tokens[idx].attrJoin("class", exports.PREVIEW_PARAGRAPH_PREFIX + String(line)
            + ' ' + exports.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
        tokens[idx].attrJoin("data_line_start", "" + String(line));
        tokens[idx].attrJoin("data_line_end", "" + String(endLine - 1));
        tokens[idx].attrJoin("data_line", "" + String([line, endLine]));
        tokens[idx].attrJoin("count_line", "" + String(endLine - line));
    }
    var token = tokens[idx];
    return '<pre' + slf.renderAttrs(token) + '><code>' +
        escapeHtml(tokens[idx].content) +
        '</code></pre>\n';
}
/** overwrite paragraph_open and close rule to inject line number */
function withLineNumbers(renderer) {
    renderer.renderer.rules.paragraph_open
        = renderer.renderer.rules.heading_open
            = renderer.renderer.rules.ordered_list_open
                = renderer.renderer.rules.bullet_list_open
                    = renderer.renderer.rules.blockquote_open
                        = renderer.renderer.rules.dl_open
                            = injectLineNumbers;
    renderer.renderer.rules.code_block
        //   = renderer.renderer.rules.fence
        = code_block_injectLineNumbers;
    return renderer;
}
exports.withLineNumbers = withLineNumbers;
exports.injectRenderRules = function (renderer) {
    var _a = renderer.options, _b = _a.lineNumbering, lineNumbering = _b === void 0 ? false : _b, _c = _a.htmlSanitize, htmlSanitize = _c === void 0 ? {} : _c, _d = _a.html, html = _d === void 0 ? false : _d, _e = _a.forDocx, forDocx = _e === void 0 ? false : _e;
    if (forDocx) {
        inline_styles_1.injectInlineStyles(renderer);
    }
    if (lineNumbering) {
        withLineNumbers(renderer);
        if (html) {
            renderer.renderer.rules.html_block = html_block_injectLineNumbers;
            if (htmlSanitize !== false) {
                renderer.renderer.rules.html_inline = html_inline_Sanitize;
            }
        }
    }
    else {
        if (html && htmlSanitize !== false) {
            renderer.renderer.rules.html_block = html_block_Sanitize;
            renderer.renderer.rules.html_inline = html_inline_Sanitize;
        }
    }
    return renderer;
};
//# sourceMappingURL=rules.js.map
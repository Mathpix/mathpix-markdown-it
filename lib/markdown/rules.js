"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectRenderRules = exports.injectLabelIdToParagraph = exports.withLineNumbers = exports.code_block_injectLineNumbers = exports.PREVIEW_LINE_CLASS = exports.PREVIEW_PARAGRAPH_PREFIX = void 0;
var sanitize_1 = require("./sanitize");
var inline_styles_1 = require("./inline-styles");
var labels_1 = require("./common/labels");
var utils_1 = require("./utils");
var consts_1 = require("./common/consts");
exports.PREVIEW_PARAGRAPH_PREFIX = "preview-paragraph-";
exports.PREVIEW_LINE_CLASS = "preview-line";
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
/** custom rules to inject in the renderer pipeline (aka mini plugin) */
/** inspired from https://github.com/markdown-it/markdown-it.github.io/blob/master/index.js#L9929 */
function injectLineNumbers(tokens, idx, options, env, slf) {
    var _a;
    var line, endLine, listLine;
    if (((_a = tokens[idx + 1]) === null || _a === void 0 ? void 0 : _a.content) && consts_1.svgRegex.test(tokens[idx + 1].content)) {
        tokens[idx].attrJoin('style', 'text-align: center;');
    }
    if (tokens[idx].uuid) {
        var label = (0, labels_1.getLabelByUuidFromLabelsList)(tokens[idx].uuid);
        if (label) {
            (0, utils_1.attrSetToBegin)(tokens[idx].attrs, 'number', label.tag);
            (0, utils_1.attrSetToBegin)(tokens[idx].attrs, 'class', "".concat(label.type, " ") + label.id);
            (0, utils_1.attrSetToBegin)(tokens[idx].attrs, 'id', label.id);
        }
    }
    if (tokens[idx].map && tokens[idx].level === 0 && !tokens[idx].notInjectLineNumber) {
        line = options.startLine + tokens[idx].map[0];
        endLine = options.startLine + tokens[idx].map[1];
        listLine = [];
        for (var i = line; i < endLine; i++) {
            listLine.push(i);
        }
        tokens[idx].attrJoin("class", exports.PREVIEW_PARAGRAPH_PREFIX + String(line)
            + ' ' + exports.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
        tokens[idx].attrJoin("data_line_start", "".concat(String(line)));
        tokens[idx].attrJoin("data_line_end", "".concat(String(endLine - 1)));
        tokens[idx].attrJoin("data_line", "".concat(String([line, endLine])));
        tokens[idx].attrJoin("count_line", "".concat(String(endLine - line)));
    }
    return slf.renderToken(tokens, idx, options, env, slf);
}
function injectLabelIdToParagraphOPen(tokens, idx, options, env, slf) {
    var _a;
    if (((_a = tokens[idx + 1]) === null || _a === void 0 ? void 0 : _a.content) && consts_1.svgRegex.test(tokens[idx + 1].content)) {
        tokens[idx].attrJoin('style', 'text-align: center;');
    }
    if (tokens[idx].uuid) {
        var label = (0, labels_1.getLabelByUuidFromLabelsList)(tokens[idx].uuid);
        if (label) {
            (0, utils_1.attrSetToBegin)(tokens[idx].attrs, 'number', label.tag);
            (0, utils_1.attrSetToBegin)(tokens[idx].attrs, 'class', "".concat(label.type, " ") + label.id);
            (0, utils_1.attrSetToBegin)(tokens[idx].attrs, 'id', label.id);
        }
    }
    return slf.renderToken(tokens, idx, options, env, slf);
}
function injectCenterTables(tokens, idx, options, env, slf) {
    var token = tokens[idx];
    if (token.level === 0) {
        token.attrJoin("align", "center");
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
            tokens[idx].content = (0, sanitize_1.sanitize)(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize));
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
        tokens[idx].attrJoin("data_line_start", "".concat(String(line)));
        tokens[idx].attrJoin("data_line_end", "".concat(String(endLine - 1)));
        tokens[idx].attrJoin("data_line", "".concat(String([line, endLine])));
        tokens[idx].attrJoin("count_line", "".concat(String(endLine - line)));
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
    return (0, sanitize_1.sanitize)(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize));
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
        ? (0, sanitize_1.sanitize)(tokens[idx].content, Object.assign({}, optionsSanitize, htmlSanitize))
        : (0, sanitize_1.sanitize)(tokens[idx].content, optionsSanitize);
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
        tokens[idx].attrJoin("data_line_start", "".concat(String(line)));
        tokens[idx].attrJoin("data_line_end", "".concat(String(endLine - 1)));
        tokens[idx].attrJoin("data_line", "".concat(String([line, endLine])));
        tokens[idx].attrJoin("count_line", "".concat(String(endLine - line)));
    }
    var token = tokens[idx];
    var _a = options.codeHighlight, codeHighlight = _a === void 0 ? {} : _a;
    codeHighlight = Object.assign({}, consts_1.codeHighlightDef, codeHighlight);
    var _b = codeHighlight.code, code = _b === void 0 ? true : _b;
    var highlighted = code && options.highlight
        ? options.highlight(token.content, '') || escapeHtml(token.content)
        : escapeHtml(token.content);
    return '<pre' + slf.renderAttrs(token) + '><code>' +
        highlighted +
        '</code></pre>\n';
}
exports.code_block_injectLineNumbers = code_block_injectLineNumbers;
/** overwrite paragraph_open and close rule to inject line number */
function withLineNumbers(renderer) {
    renderer.renderer.rules.paragraph_open
        = renderer.renderer.rules.heading_open
            = renderer.renderer.rules.addcontentsline_open
                = renderer.renderer.rules.ordered_list_open
                    = renderer.renderer.rules.bullet_list_open
                        = renderer.renderer.rules.blockquote_open
                            = renderer.renderer.rules.dl_open
                                = injectLineNumbers;
    var _a = renderer.options.codeHighlight, codeHighlight = _a === void 0 ? {} : _a;
    codeHighlight = Object.assign({}, consts_1.codeHighlightDef, codeHighlight);
    var _b = codeHighlight.code, code = _b === void 0 ? true : _b;
    if (!code) {
        renderer.renderer.rules.code_block = code_block_injectLineNumbers;
    }
    return renderer;
}
exports.withLineNumbers = withLineNumbers;
function injectLabelIdToParagraph(renderer) {
    renderer.renderer.rules.paragraph_open
        = injectLabelIdToParagraphOPen;
    return renderer;
}
exports.injectLabelIdToParagraph = injectLabelIdToParagraph;
var injectRenderRules = function (renderer) {
    var _a = renderer.options, _b = _a.lineNumbering, lineNumbering = _b === void 0 ? false : _b, _c = _a.htmlSanitize, htmlSanitize = _c === void 0 ? {} : _c, _d = _a.html, html = _d === void 0 ? false : _d, _e = _a.forDocx, forDocx = _e === void 0 ? false : _e, _f = _a.centerTables, centerTables = _f === void 0 ? true : _f;
    if (centerTables) {
        renderer.renderer.rules.table_open = injectCenterTables;
    }
    if (forDocx) {
        (0, inline_styles_1.injectInlineStyles)(renderer);
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
        injectLabelIdToParagraph(renderer);
        if (html && htmlSanitize !== false) {
            renderer.renderer.rules.html_block = html_block_Sanitize;
            renderer.renderer.rules.html_inline = html_inline_Sanitize;
        }
    }
    return renderer;
};
exports.injectRenderRules = injectRenderRules;
//# sourceMappingURL=rules.js.map
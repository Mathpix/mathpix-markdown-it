"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var highlight_js_1 = require("highlight.js");
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
var rules_1 = require("./rules");
var consts_1 = require("./common/consts");
var clipboard_copy_element_1 = require("../copy-to-clipboard/clipboard-copy-element");
var separating_span_1 = require("./common/separating-span");
var maybe = function (f) {
    try {
        return f();
    }
    catch (e) {
        return false;
    }
};
// Highlight with given language.
var highlight = function (code, lang, originalHighlight) {
    // Looks up a language by name or alias.
    // Returns the language object if found, undefined otherwise.
    var langObj = highlight_js_1.default.getLanguage(lang);
    if (langObj === undefined) {
        return typeof originalHighlight === 'function' ? originalHighlight(code, lang) : '';
    }
    if (!lang)
        return '';
    if (lang.toLowerCase() === 'latex')
        lang = 'tex';
    return maybe(function () { return highlight_js_1.default.highlight(code, { language: lang, ignoreIllegals: true }).value; }) || '';
};
// Highlight with given language or automatically.
var highlightAuto = function (code, lang, originalHighlight) {
    // Looks up a language by name or alias.
    // Returns the language object if found, undefined otherwise.
    var langObj = highlight_js_1.default.getLanguage(lang);
    if (langObj === undefined) {
        return typeof originalHighlight === 'function' ? originalHighlight(code, lang) : '';
    }
    if (lang.toLowerCase() === 'latex')
        lang = 'tex';
    return lang
        ? highlight(code, lang)
        : maybe(function () { return highlight_js_1.default.highlightAuto(code).value; }) || '';
};
// Wrap a render function to add `hljs` class to code blocks.
// const wrap = render => (...args) => {
var wrapFence = function (render) { return function (tokens, idx, options, env, slf) {
    var _a;
    var html = render.apply(render, [tokens, idx, options, env, slf]);
    html = html
        .replace('<code class="', '<code class="hljs ')
        .replace('<code>', '<code class="hljs">');
    var htmlMol = '';
    if (tokens[idx].info === "mol" && ((_a = options === null || options === void 0 ? void 0 : options.outMath) === null || _a === void 0 ? void 0 : _a.include_mol)) {
        htmlMol = '<mol style="display: none">' + tokens[idx].content + '</mol>';
        html = html
            .replace('</pre>', htmlMol + '</pre>');
    }
    if (options === null || options === void 0 ? void 0 : options.lineNumbering) {
        var line = void 0, endLine = void 0, listLine = void 0;
        if (tokens[idx].map && tokens[idx].level === 0) {
            line = options.startLine + tokens[idx].map[0];
            endLine = options.startLine + tokens[idx].map[1];
            listLine = [];
            for (var i = line; i < endLine; i++) {
                listLine.push(i);
            }
            tokens[idx].attrJoin("class", rules_1.PREVIEW_PARAGRAPH_PREFIX + String(line)
                + ' ' + rules_1.PREVIEW_LINE_CLASS + ' ' + listLine.join(' '));
            tokens[idx].attrJoin("data_line_start", "".concat(String(line)));
            tokens[idx].attrJoin("data_line_end", "".concat(String(endLine - 1)));
            tokens[idx].attrJoin("data_line", "".concat(String([line, endLine])));
            tokens[idx].attrJoin("count_line", "".concat(String(endLine - line)));
            if (options.copyToClipboard) {
                tokens[idx].attrJoin("style", "overflow: auto; position: relative;");
                var htmlClipboardCopy = (0, clipboard_copy_element_1.clipboardCopyElement)(tokens[idx].content);
                html = '<div ' + slf.renderAttrs(tokens[idx]) + '>' + html + htmlClipboardCopy + '</div>';
            }
            else {
                html = html.replace('<pre>', '<pre' + slf.renderAttrs(tokens[idx]) + '>');
            }
            return html;
        }
    }
    if (options.copyToClipboard || options.previewUuid) {
        tokens[idx].attrJoin("style", "overflow: auto; position: relative;");
        var htmlClipboardCopy = options.copyToClipboard
            ? (0, clipboard_copy_element_1.clipboardCopyElement)(tokens[idx].content)
            : "";
        var htmlSeparatingSpan = options.previewUuid && tokens[idx].contentSpan
            ? (0, separating_span_1.getHtmlSeparatingSpanContainer)(tokens[idx].contentSpan)
            : "";
        html = '<div ' + slf.renderAttrs(tokens[idx]) + '>'
            + html
            + htmlSeparatingSpan
            + htmlClipboardCopy
            + '</div>';
    }
    return html;
}; };
var highlight_code_block = function (tokens, idx, options, env, slf) {
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
};
var wrap = function (render) { return function (tokens, idx, options, env, slf) { return (render.apply(render, [tokens, idx, options, env, slf])
    .replace('<code class="', '<code class="hljs ')
    .replace('<code>', '<code class="hljs">')); }; };
var highlightjs = function (md, opts) {
    var _a;
    opts = Object.assign({}, consts_1.codeHighlightDef, opts);
    var originalHighlight = md.options.highlight;
    md.options.highlight = function (code, lang) { return opts.auto
        ? highlightAuto(code, lang, originalHighlight)
        : highlight(code, lang, originalHighlight); };
    md.renderer.rules.fence = wrapFence(md.renderer.rules.fence);
    if (opts.code) {
        md.renderer.rules.code_block = ((_a = md.options) === null || _a === void 0 ? void 0 : _a.lineNumbering)
            ? wrap(rules_1.code_block_injectLineNumbers)
            : wrap(highlight_code_block);
    }
};
exports.default = highlightjs;
//# sourceMappingURL=mdHighlightCodePlugin.js.map
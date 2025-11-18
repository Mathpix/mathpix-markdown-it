"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLatexLstlistingEnvRendererWithMd = void 0;
var tslib_1 = require("tslib");
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
var renderCodeWithMathHighlighted = function (children, md, langName, options, env) {
    var e_1, _a;
    var _b;
    if (options === void 0) { options = {}; }
    if (env === void 0) { env = {}; }
    var html = '';
    try {
        for (var children_1 = tslib_1.__values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
            var ch = children_1_1.value;
            if (ch.type === 'text') {
                html += (((_b = md.options) === null || _b === void 0 ? void 0 : _b.highlight) && typeof md.options.highlight === 'function')
                    ? (md.options.highlight(ch.content, langName) || escapeHtml(ch.content)) // <-- raw code в highlight
                    : escapeHtml(ch.content);
            }
            else {
                html += md.renderer.renderInline([ch], options, env);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return html;
};
var makeLatexLstlistingEnvRendererWithMd = function (md, className) {
    if (className === void 0) { className = 'lstlisting'; }
    return function (tokens, idx, options, env, slf) {
        var _a, _b, _c, _d;
        if (options === void 0) { options = {}; }
        if (env === void 0) { env = {}; }
        var token = tokens[idx];
        var langName = (_c = (_b = (_a = token.meta) === null || _a === void 0 ? void 0 : _a.language) === null || _b === void 0 ? void 0 : _b.hlName) !== null && _c !== void 0 ? _c : '';
        var hasMath = token.children && token.children.length > 0;
        var highlighted = '';
        if (hasMath) {
            highlighted = renderCodeWithMathHighlighted(token.children, md, langName, options, env);
        }
        else {
            highlighted = (((_d = md.options) === null || _d === void 0 ? void 0 : _d.highlight) && typeof md.options.highlight === 'function')
                ? (md.options.highlight(token.content, langName) || escapeHtml(token.content)) // <-- raw code в highlight
                : escapeHtml(token.content);
        }
        if (highlighted.indexOf('<pre') === 0) {
            return highlighted + '\n';
        }
        // If language exists, inject class gently, without modifying original token.
        // May be, one day we will add .clone() for token and simplify this part, but
        // now we prefer to keep things local.
        if (langName) {
            var tmpToken = void 0;
            var tmpAttrs = [];
            var i = token.attrIndex('class');
            tmpAttrs = token.attrs ? token.attrs.slice() : [];
            if (i < 0) {
                tmpAttrs.push(['class', options.langPrefix + langName]);
            }
            else {
                tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
            }
            // Fake token just to render attributes
            tmpToken = {
                attrs: tmpAttrs
            };
            return '<pre><code' + slf.renderAttrs(tmpToken) + '>'
                + highlighted
                + '</code></pre>\n';
        }
        return '<pre><code' + slf.renderAttrs(token) + '>'
            + highlighted
            + '</code></pre>\n';
    };
};
exports.makeLatexLstlistingEnvRendererWithMd = makeLatexLstlistingEnvRendererWithMd;
//# sourceMappingURL=render-latex-lstlisting-env.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLatexLstlistingEnvRendererWithMd = void 0;
var tslib_1 = require("tslib");
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
/**
 * Render a code token (block or inline) with optional syntax highlighting and math-aware children.
 *
 * Behavior:
 * - If the token has `children`, iterates through them:
 *   - `text` children are highlighted with `md.options.highlight(langName)` when available,
 *     otherwise HTML-escaped.
 *   - non-`text` children are rendered via `md.renderer.renderInline` (e.g., math spans),
 *     while their plain-text projections are taken from `child.ascii*` fields.
 * - If the token has no `children`, highlights/escapes `token.content` as a single chunk.
 * - Builds plain-text TSV/CSV strings from the rendered pieces (newlines are replaced with spaces)
 *   and stores them into `token.tsv` / `token.csv` (arrays with a single string).
 *
 * Notes:
 * - The function mutates `token.tsv` and `token.csv`.
 * - If the highlighter throws or returns a falsy value, the raw text is HTML-escaped.
 *
 * @param token   Markdown-It token representing the code fragment.
 * @param md      Markdown-It instance (used for highlighting and rendering).
 * @param langName Language name passed to the highlighter (may be empty).
 * @param options  Renderer options forwarded to `renderInline` for non-text children.
 * @param env      Rendering environment forwarded to `renderInline`.
 * @returns HTML string produced from the token content (children-aware).
 */
var renderCodeWithMathHighlighted = function (token, md, langName, options, env) {
    var e_1, _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (options === void 0) { options = {}; }
    if (env === void 0) { env = {}; }
    var children = (_b = token.children) !== null && _b !== void 0 ? _b : [];
    var partsHtml = [];
    var partsTsv = [];
    var partsCsv = [];
    if (children.length > 0) {
        try {
            for (var children_1 = tslib_1.__values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                if (child.type === 'text') {
                    var raw = (_c = child.content) !== null && _c !== void 0 ? _c : '';
                    try {
                        var highlighted = (((_d = md.options) === null || _d === void 0 ? void 0 : _d.highlight) && typeof md.options.highlight === 'function')
                            ? (md.options.highlight(raw, langName) || escapeHtml(raw)) // <-- raw code в highlight
                            : escapeHtml(raw);
                        partsHtml.push(highlighted);
                    }
                    catch (_l) {
                        partsHtml.push(escapeHtml(raw));
                    }
                    partsTsv.push(raw);
                    partsCsv.push(raw);
                }
                else {
                    var mathHtml = md.renderer.renderInline([child], options, env);
                    if ((options === null || options === void 0 ? void 0 : options.forDocx) && mathHtml) {
                        mathHtml = mathHtml
                            .split(/\r?\n/)
                            .map(function (line) { return line.trim(); })
                            .join('');
                    }
                    partsHtml.push(mathHtml);
                    partsTsv.push((_f = (_e = child.ascii_tsv) !== null && _e !== void 0 ? _e : child.ascii) !== null && _f !== void 0 ? _f : '');
                    partsCsv.push((_h = (_g = child.ascii_csv) !== null && _g !== void 0 ? _g : child.ascii) !== null && _h !== void 0 ? _h : '');
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
    }
    else {
        var raw = (_j = token.content) !== null && _j !== void 0 ? _j : '';
        var highlighted = (((_k = md.options) === null || _k === void 0 ? void 0 : _k.highlight) && typeof md.options.highlight === 'function')
            ? (md.options.highlight(raw, langName) || escapeHtml(raw)) // <-- raw code в highlight
            : escapeHtml(raw);
        partsHtml.push(highlighted);
        partsTsv.push(raw);
        partsCsv.push(raw);
    }
    var tsv = partsTsv.join('').replace(/\r?\n/g, ' ');
    var csv = partsCsv.join('').replace(/\r?\n/g, ' ');
    token.tsv = [tsv];
    token.csv = [csv];
    return partsHtml.join('');
};
/**
 * Create a Markdown-It renderer for LaTeX `lstlisting` environments.
 *
 * Behavior:
 * - Always delegates rendering of the token content to `renderCodeWithMathHighlighted`
 *   (handles both plain code and tokens with math-aware children; also builds TSV/CSV).
 * - If the returned HTML starts with a full `<pre...>` block (e.g. provided by an external highlighter),
 *   it is returned as-is with a trailing newline.
 * - Otherwise, the result is wrapped into `<pre><code ...>` and a language class
 *   `options.langPrefix + langName` is gently injected by cloning token attrs (the original token is not mutated).
 *
 * @param md Markdown-It instance (used for highlighting and rendering).
 * @returns A renderer function `(tokens, idx, options, env, slf) => string` for `latex_lstlisting_env`.
 */
var makeLatexLstlistingEnvRendererWithMd = function (md) {
    return function (tokens, idx, options, env, slf) {
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        if (env === void 0) { env = {}; }
        var token = tokens[idx];
        var langName = (_c = (_b = (_a = token.meta) === null || _a === void 0 ? void 0 : _a.language) === null || _b === void 0 ? void 0 : _b.hlName) !== null && _c !== void 0 ? _c : '';
        var highlighted = renderCodeWithMathHighlighted(token, md, langName, options, env);
        if (highlighted.indexOf('<pre') === 0) {
            return highlighted + '\n';
        }
        var styleValue = 'text-align: left;';
        // If language exists, inject class gently, without modifying original token.
        // May be, one day we will add .clone() for token and simplify this part, but
        // now we prefer to keep things local.
        var classes = ['lstlisting-code'];
        if (langName) {
            classes.push(options.langPrefix + langName);
        }
        var attrs = token.attrs ? token.attrs.map(function (_a) {
            var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
            return [k, v];
        }) : [];
        // handle `class` attribute
        var classIndex = token.attrIndex('class');
        var className = classes.join(' ');
        if (classIndex < 0) {
            attrs.push(['class', className]);
        }
        else {
            attrs[classIndex][1] += ' ' + className;
        }
        // handle `style` attribute (if provided as value)
        if (styleValue) {
            var styleIndex = token.attrIndex('style');
            if (styleIndex < 0) {
                attrs.push(['style', styleValue]);
            }
            else {
                attrs[styleIndex][1] += '; ' + styleValue;
            }
        }
        // Fake token just to render attributes
        var fakeToken = { attrs: attrs };
        return '<pre><code'
            + slf.renderAttrs(fakeToken)
            + '>'
            + highlighted
            + '</code></pre>\n';
    };
};
exports.makeLatexLstlistingEnvRendererWithMd = makeLatexLstlistingEnvRendererWithMd;
//# sourceMappingURL=render-latex-lstlisting-env.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderInlineTokenBlock = function (tokens, options, renderer) {
    var _renderer = Object.getPrototypeOf(renderer);
    _renderer.rules = renderer.rules;
    var nextToken, result = '', needLf = false;
    for (var idx = 0; idx < tokens.length; idx++) {
        var token = tokens[idx];
        if (token.hidden) {
            return '';
        }
        if (token.n !== -1 && idx && tokens[idx - 1].hidden) {
            result += '\n';
        }
        if (token.token === 'inline') {
            var content = '';
            if (token.children) {
                content = _renderer.renderInline(token.children, options);
            }
            else {
                content = _renderer.renderInline([{ type: 'text', content: token.content }], options);
            }
            result += content;
            continue;
        }
        // Add token name, e.g. `<img`
        result += (token.n === -1 ? '</' : '<') + token.tag;
        // Encode attributes, e.g. `<img src="foo"`
        result += _renderer.renderAttrs(token);
        // Add a slash for self-closing tags, e.g. `<img src="foo" /`
        if (token.n === 0 && options.xhtmlOut) {
            result += ' /';
        }
        // Check if we need to add a newline after this tag
        needLf = true;
        if (token.n === 1) {
            if (idx + 1 < tokens.length) {
                nextToken = tokens[idx + 1];
                if (nextToken.token === 'inline' || nextToken.hidden) {
                    // Block-level tag containing an inline tag.
                    //
                    needLf = false;
                }
                else if (nextToken.n === -1 && nextToken.tag === token.tag) {
                    // Opening tag + closing tag of the same type. E.g. `<li></li>`.
                    //
                    needLf = false;
                }
            }
        }
        result += needLf ? '>\n' : '>';
    }
    return result;
};
exports.renderTabulare = function (a, token, options, renderer) {
    var _a = options.outMath.include_tsv, include_tsv = _a === void 0 ? false : _a;
    var tabulare = renderInlineTokenBlock(token.children, options, renderer);
    var tsv = include_tsv && token.tsv
        ? "<tsv style=\"display: none\">" + token.tsv + "</tsv>"
        : '';
    return "<div class=\"inline-tabulare\">" + tabulare + tsv + "</div>";
};
exports.renderTSV = function (a, token, options) {
    var _a = options.outMath.include_tsv, include_tsv = _a === void 0 ? false : _a;
    return include_tsv
        ? "<tsv style=\"display: none\">" + token.content + "</tsv>"
        : '';
};
//# sourceMappingURL=render-tabulare.js.map
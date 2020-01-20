"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var isLevelSelectedNumber = function (selection) { return function (level) { return level >= selection; }; };
var isLevelSelectedArray = function (selection) { return function (level) { return selection.includes(level); }; };
var types = [
    'section',
    'subsection',
    'subsubsection',
];
var anchor = function (md, opts) {
    opts = Object.assign({}, anchor.defaults, opts);
    md.core.ruler.push('anchor', function (state) {
        var slugs = {};
        var tokens = state.tokens;
        var isLevelSelected = Array.isArray(opts.level)
            ? isLevelSelectedArray(opts.level)
            : isLevelSelectedNumber(opts.level);
        tokens
            .filter(function (token) { return token.type === 'heading_open'; })
            .filter(function (token) { return isLevelSelected(Number(token.tag.substr(1))); })
            .forEach(function (token) {
            var tokenType = token.attrGet('type');
            var title = '';
            if (types.includes(tokenType)) {
                var t = tokens[tokens.indexOf(token) + 1];
                title = types.includes(t.type) ? t.content : '';
            }
            else {
                // Aggregate the next token children text.
                title = tokens[tokens.indexOf(token) + 1]
                    .children
                    .filter(function (token) { return token.type === 'text' || token.type === 'code_inline'; })
                    .reduce(function (acc, t) { return acc + t.content; }, '');
            }
            var slug = token.attrGet('id') || '';
            if (!slug || slug === '') {
                slug = common_1.uniqueSlug(common_1.slugify(title), slugs);
                token.attrPush(['id', slug]);
            }
        });
    });
};
anchor.defaults = {
    level: 1,
};
exports.default = anchor;
//# sourceMappingURL=mdPluginAnchor.js.map
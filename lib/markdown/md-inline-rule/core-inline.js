"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreInline = void 0;
var tslib_1 = require("tslib");
var begin_tabular_1 = require("../md-block-rule/begin-tabular");
/** Top-level inline rule executor
 * Replace inline core rule
 *
 * By default the state.env that is passed to the inline parser only has the latest values.
 * We add this rule to be able to pass the current variables (obtained during block parsing) to the inline parser.
 * This is necessary to match labels with the current block.
 * */
var coreInline = function (state) {
    var _a;
    var tokens = state.tokens;
    var token;
    var currentTag = {};
    var envToInline = {};
    // Parse inlines
    if (!state.env.footnotes) {
        state.env.footnotes = {};
    }
    for (var i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if (token.currentTag) {
            currentTag = token.currentTag;
        }
        if (token.envToInline) {
            envToInline = token.envToInline;
        }
        if (token.type === 'tabular' && ((_a = token.children) === null || _a === void 0 ? void 0 : _a.length)) {
            for (var j = 0; j < token.children.length; j++) {
                var tok = token.children[j];
                if (tok.token === "inline_decimal") {
                    tok = (0, begin_tabular_1.inlineDecimalParse)(tok);
                    continue;
                }
                if (tok.token === "inline") {
                    if (tok.envToInline) {
                        envToInline = tok.envToInline;
                    }
                    state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                        currentTag: currentTag,
                    }, tslib_1.__assign({}, envToInline));
                    state.md.inline.parse(tok.content, state.md, state.env, tok.children);
                }
            }
            continue;
        }
        if (token.type === 'inline'
            || ['title', 'section', 'subsection', 'subsubsection', 'addcontentsline',
                'item_inline', 'caption_table'
            ].includes(token.type)) {
            state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                currentTag: currentTag,
            }, tslib_1.__assign({}, envToInline));
            state.md.inline.parse(token.content, state.md, state.env, token.children);
        }
    }
};
exports.coreInline = coreInline;
//# sourceMappingURL=core-inline.js.map
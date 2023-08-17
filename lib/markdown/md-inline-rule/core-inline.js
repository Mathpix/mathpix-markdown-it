"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreInline = void 0;
var tslib_1 = require("tslib");
var begin_tabular_1 = require("../md-block-rule/begin-tabular");
var utils_1 = require("../md-latex-footnotes/utils");
/** Top-level inline rule executor
 * Replace inline core rule
 *
 * By default the state.env that is passed to the inline parser only has the latest values.
 * We add this rule to be able to pass the current variables (obtained during block parsing) to the inline parser.
 * This is necessary to match labels with the current block.
 * */
var coreInline = function (state) {
    var _a, _b, _c, _d;
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
        if (token.type === 'footnote_latex' || token.type === 'footnotetext_latex') {
            if ((_a = token.children) === null || _a === void 0 ? void 0 : _a.length) {
                for (var j = 0; j < ((_b = token.children) === null || _b === void 0 ? void 0 : _b.length); j++) {
                    if (token.children[j].type === 'inline') {
                        state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                            currentTag: currentTag,
                        }, tslib_1.__assign({}, envToInline));
                        state.md.inline.parse(token.children[j].content, state.md, state.env, token.children[j].children);
                    }
                    if (token.children[j].type === 'tabular' && ((_c = token.children[j].children) === null || _c === void 0 ? void 0 : _c.length)) {
                        for (var k = 0; k < token.children[j].children.length; k++) {
                            var tok = token.children[j].children[k];
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
                    }
                }
            }
            if (!state.env.footnotes.list) {
                state.env.footnotes.list = [];
            }
            if (token.type === 'footnotetext_latex') {
                (0, utils_1.addFootnoteToListForFootnotetext)(state, token, token.children, token.content, token.numbered, true);
                continue;
            }
            (0, utils_1.addFootnoteToListForFootnote)(state, token, token.children, token.content, token.numbered, true);
            continue;
        }
        if (token.currentTag) {
            currentTag = token.currentTag;
        }
        if (token.envToInline) {
            envToInline = token.envToInline;
        }
        if (token.type === 'tabular' && ((_d = token.children) === null || _d === void 0 ? void 0 : _d.length)) {
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
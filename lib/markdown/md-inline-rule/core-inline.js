"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreInline = void 0;
var tslib_1 = require("tslib");
var begin_tabular_1 = require("../md-block-rule/begin-tabular");
var utils_1 = require("../md-latex-footnotes/utils");
var utils_2 = require("../utils");
var counters_1 = require("../common/counters");
var textWidthByTokens_1 = require("../common/textWidthByTokens");
/** Top-level inline rule executor
 * Replace inline core rule
 *
 * By default the state.env that is passed to the inline parser only has the latest values.
 * We add this rule to be able to pass the current variables (obtained during block parsing) to the inline parser.
 * This is necessary to match labels with the current block.
 * */
var coreInline = function (state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var tokens = state.tokens;
    var token;
    var currentTag = {};
    var envToInline = {};
    // Parse inlines
    if (!state.env.footnotes) {
        state.env.footnotes = {};
    }
    state.env.mmd_footnotes = tslib_1.__assign({}, state.env.footnotes);
    if (!state.env.mmd_footnotes.list) {
        state.env.mmd_footnotes.list = [];
    }
    for (var i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if (token.type === 'footnote_latex' || token.type === 'footnotetext_latex' || token.type === 'blfootnotetext_latex') {
            if ((_a = token.children) === null || _a === void 0 ? void 0 : _a.length) {
                for (var j = 0; j < ((_b = token.children) === null || _b === void 0 ? void 0 : _b.length); j++) {
                    if (token.children[j].type === "paragraph_open") {
                        token.children[j].notInjectLineNumber = true;
                    }
                    if (token.children[j].type === 'inline'
                        || ['title', 'section', 'subsection', 'subsubsection', 'addcontentsline',
                            'item_inline', 'caption_table'
                        ].includes(token.children[j].type)) {
                        state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                            currentTag: currentTag,
                        }, tslib_1.__assign({}, envToInline));
                        state.md.inline.parse(token.children[j].content, state.md, state.env, token.children[j].children);
                        if (((_c = token.children[j].meta) === null || _c === void 0 ? void 0 : _c.isMathInText) && ((_d = token.children[j].children) === null || _d === void 0 ? void 0 : _d.length)) {
                            (0, utils_2.applyAttrToInlineMath)(token.children[j], "data-math-in-text", "true");
                        }
                        if (i > 0) {
                            (0, utils_2.addAttributesToParentToken)(tokens[i - 1], token);
                        }
                    }
                    if (token.children[j].type === 'tabular' && ((_e = token.children[j].children) === null || _e === void 0 ? void 0 : _e.length)) {
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
                                if (j > 0 && token.children[j - 1].type === 'td_open') {
                                    (0, utils_2.addAttributesToParentToken)(token.children[j - 1], tok);
                                }
                            }
                        }
                    }
                }
            }
            if (!state.env.footnotes.list) {
                state.env.footnotes.list = [];
            }
            if (!state.env.mmd_footnotes.list) {
                state.env.mmd_footnotes.list = [];
            }
            if (token.type === 'footnotetext_latex') {
                (0, utils_1.addFootnoteToListForFootnotetext)(state, token, token.children, token.content, token.numbered, true);
                continue;
            }
            if (token.type === 'blfootnotetext_latex') {
                (0, utils_1.addFootnoteToListForBlFootnotetext)(state, token, token.children, token.content, true);
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
        if (token.type === 'tabular' && ((_f = token.children) === null || _f === void 0 ? void 0 : _f.length)) {
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
                    if (j > 0 && token.children[j - 1].type === 'td_open') {
                        (0, utils_2.addAttributesToParentToken)(token.children[j - 1], tok);
                    }
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
            if (((_g = token.meta) === null || _g === void 0 ? void 0 : _g.isMathInText) && ((_h = token.children) === null || _h === void 0 ? void 0 : _h.length)) {
                (0, utils_2.applyAttrToInlineMath)(token.children, "data-math-in-text", "true");
            }
            if ((_j = state.md.options) === null || _j === void 0 ? void 0 : _j.enableSizeCalculation) {
                if (token.type === 'inline' && ((_k = token.children) === null || _k === void 0 ? void 0 : _k.length)) {
                    var data = (0, textWidthByTokens_1.getTextWidthByTokens)(token.children);
                    if (data) {
                        token.widthEx = data.widthEx;
                        token.heightEx = data.heightEx;
                        (0, counters_1.setSizeCounter)(data.widthEx, data.heightEx);
                    }
                }
            }
            if (token.type === 'inline' && ((_l = token.children) === null || _l === void 0 ? void 0 : _l.length)) {
                if (token.lastBreakToSpace && token.children[token.children.length - 1].type === 'softbreak') {
                    token.children[token.children.length - 1].hidden = true;
                    token.children[token.children.length - 1].showSpace = true;
                }
                if (token.firstBreakToSpace && token.children[0].type === 'softbreak') {
                    token.children[0].hidden = true;
                    token.children[0].showSpace = true;
                }
                if (i > 0) {
                    (0, utils_2.addAttributesToParentToken)(tokens[i - 1], token);
                }
            }
        }
    }
    state.env.footnotes = null;
};
exports.coreInline = coreInline;
//# sourceMappingURL=core-inline.js.map
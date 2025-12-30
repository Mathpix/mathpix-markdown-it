"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreInline = void 0;
var tslib_1 = require("tslib");
var begin_tabular_1 = require("../md-block-rule/begin-tabular");
var utils_1 = require("../md-latex-footnotes/utils");
var utils_2 = require("../utils");
var counters_1 = require("../common/counters");
var textWidthByTokens_1 = require("../common/textWidthByTokens");
var INLINE_LIKE_TYPES = new Set([
    'inline',
    'title', 'section', 'subsection', 'subsubsection',
    'addcontentsline', 'item_inline', 'caption_table'
]);
function isInlineLike(tok) {
    var t = tok === null || tok === void 0 ? void 0 : tok.type;
    var tk = tok === null || tok === void 0 ? void 0 : tok.token;
    return INLINE_LIKE_TYPES.has(t) || INLINE_LIKE_TYPES.has(tk);
}
/**
  * Recursively walk tokens and parse any inline-like tokens deeply.
  *
  * Important:
  * - respects tok.envToInline stacking (deepest overrides)
  * - supports tok.token vs tok.type (tabular children use tok.token)
  * - preserves td_open attribute injection behavior
  */
var walkInlineInTokens = function (list, state, getCurrentTag, getRootEnvToInline, envStack, parentList) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (envStack === void 0) { envStack = []; }
    if (!(list === null || list === void 0 ? void 0 : list.length))
        return;
    // base env for this level is: (root envToInline) then stack overrides
    var baseEnv = Object.assign.apply(Object, tslib_1.__spreadArray([{}, getRootEnvToInline()], tslib_1.__read(envStack), false));
    for (var i = 0; i < list.length; i++) {
        var tok = list[i];
        if ((tok === null || tok === void 0 ? void 0 : tok.token) === "inline_decimal") {
            (0, begin_tabular_1.inlineDecimalParse)(tok);
            continue;
        }
        var nextStack = (tok === null || tok === void 0 ? void 0 : tok.envToInline) ? tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(envStack), false), [tok.envToInline], false) : envStack;
        var mergedEnvToInline = (tok === null || tok === void 0 ? void 0 : tok.envToInline) ? Object.assign({}, baseEnv, tok.envToInline) : baseEnv;
        if (isInlineLike(tok)) {
            state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                currentTag: getCurrentTag(),
            }, mergedEnvToInline);
            if (!((_a = tok.children) === null || _a === void 0 ? void 0 : _a.length)) {
                state.md.inline.parse(tok.content, state.md, state.env, tok.children);
            }
            if (((_b = tok.meta) === null || _b === void 0 ? void 0 : _b.isMathInText) && ((_c = tok.children) === null || _c === void 0 ? void 0 : _c.length)) {
                (0, utils_2.applyAttrToInlineMath)(tok, "data-math-in-text", "true");
            }
            if ((_d = state.md.options) === null || _d === void 0 ? void 0 : _d.enableSizeCalculation) {
                if ((tok.type === 'inline' || tok.token === 'inline') && ((_e = tok.children) === null || _e === void 0 ? void 0 : _e.length)) {
                    var data = (0, textWidthByTokens_1.getTextWidthByTokens)(tok.children);
                    if (data) {
                        tok.widthEx = data.widthEx;
                        tok.heightEx = data.heightEx;
                        (0, counters_1.setSizeCounter)(data.widthEx, data.heightEx);
                    }
                }
            }
            if ((tok.type === 'inline' || tok.token === 'inline') && ((_f = tok.children) === null || _f === void 0 ? void 0 : _f.length)) {
                if (tok.lastBreakToSpace && ((_g = tok.children[tok.children.length - 1]) === null || _g === void 0 ? void 0 : _g.type) === 'softbreak') {
                    tok.children[tok.children.length - 1].hidden = true;
                    tok.children[tok.children.length - 1].showSpace = true;
                }
                if (tok.firstBreakToSpace && ((_h = tok.children[0]) === null || _h === void 0 ? void 0 : _h.type) === 'softbreak') {
                    tok.children[0].hidden = true;
                    tok.children[0].showSpace = true;
                }
            }
            if (i > 0 && ((_j = list[i - 1]) === null || _j === void 0 ? void 0 : _j.type) === 'td_open') {
                (0, utils_2.addAttributesToParentToken)(list[i - 1], tok);
            }
        }
        // recurse to children (tabular nesting can be arbitrary)
        if ((_k = tok === null || tok === void 0 ? void 0 : tok.children) === null || _k === void 0 ? void 0 : _k.length) {
            walkInlineInTokens(tok.children, state, getCurrentTag, getRootEnvToInline, nextStack, list);
        }
    }
};
/** Top-level inline rule executor
 * Replace inline core rule
 *
 * By default the state.env that is passed to the inline parser only has the latest values.
 * We add this rule to be able to pass the current variables (obtained during block parsing) to the inline parser.
 * This is necessary to match labels with the current block.
 * */
var coreInline = function (state) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
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
                // preserve notInjectLineNumber behavior
                for (var j = 0; j < token.children.length; j++) {
                    if (token.children[j].type === "paragraph_open") {
                        token.children[j].notInjectLineNumber = true;
                    }
                }
                // deep-walk all inlines/tabular nesting inside footnote token
                walkInlineInTokens(token.children, state, function () { return currentTag; }, function () { return envToInline; });
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
        if (token.type === 'tabular' && ((_b = token.children) === null || _b === void 0 ? void 0 : _b.length)) {
            // deep-walk tabular of any depth
            walkInlineInTokens(token.children, state, function () { return currentTag; }, function () { return envToInline; });
            continue;
        }
        if (token.type === 'inline'
            || ['title', 'section', 'subsection', 'subsubsection', 'addcontentsline',
                'item_inline', 'caption_table'
            ].includes(token.type)) {
            state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                currentTag: currentTag,
            }, tslib_1.__assign({}, envToInline));
            if (!((_c = token.children) === null || _c === void 0 ? void 0 : _c.length)) {
                state.md.inline.parse(token.content, state.md, state.env, token.children);
            }
            if (((_d = token.meta) === null || _d === void 0 ? void 0 : _d.isMathInText) && ((_e = token.children) === null || _e === void 0 ? void 0 : _e.length)) {
                (0, utils_2.applyAttrToInlineMath)(token.children, "data-math-in-text", "true");
            }
            if ((_f = state.md.options) === null || _f === void 0 ? void 0 : _f.enableSizeCalculation) {
                if (token.type === 'inline' && ((_g = token.children) === null || _g === void 0 ? void 0 : _g.length)) {
                    var data = (0, textWidthByTokens_1.getTextWidthByTokens)(token.children);
                    if (data) {
                        token.widthEx = data.widthEx;
                        token.heightEx = data.heightEx;
                        (0, counters_1.setSizeCounter)(data.widthEx, data.heightEx);
                    }
                }
            }
            if (token.type === 'inline' && ((_h = token.children) === null || _h === void 0 ? void 0 : _h.length)) {
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
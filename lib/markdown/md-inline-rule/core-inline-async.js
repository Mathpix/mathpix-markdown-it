"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreInlineAsync = void 0;
var tslib_1 = require("tslib");
var begin_tabular_1 = require("../md-block-rule/begin-tabular");
var utils_1 = require("../md-latex-footnotes/utils");
var utils_2 = require("../utils");
var counters_1 = require("../common/counters");
var textWidthByTokens_1 = require("../common/textWidthByTokens");
// вспомогательный массив для типов, которые парсим inline-подобно
var INLINE_LIKE_TYPES = [
    'title',
    'section',
    'subsection',
    'subsubsection',
    'addcontentsline',
    'item_inline',
    'caption_table'
];
function isInlineLikeType(type) {
    return type === 'inline' || INLINE_LIKE_TYPES.includes(type);
}
var coreInlineAsync = function (state, opts) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var tokens, currentTag, envToInline, sliceMs, lastYield, i, token, j, child, k, tok, j, tok, data, br, br0;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return tslib_1.__generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                console.log("[MMD]=>[coreInlineAsync]=>");
                tokens = state.tokens;
                currentTag = {};
                envToInline = {};
                sliceMs = (opts && opts.sliceMs) || 30;
                if (!state.env.footnotes) {
                    state.env.footnotes = {};
                }
                state.env.mmd_footnotes = tslib_1.__assign({}, state.env.footnotes);
                if (!state.env.mmd_footnotes.list) {
                    state.env.mmd_footnotes.list = [];
                }
                lastYield = Date.now();
                i = 0;
                _l.label = 1;
            case 1:
                if (!(i < tokens.length)) return [3 /*break*/, 20];
                token = tokens[i];
                if (!(Date.now() - lastYield > sliceMs)) return [3 /*break*/, 3];
                lastYield = Date.now();
                return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
            case 2:
                _l.sent();
                _l.label = 3;
            case 3:
                if (!(token.type === 'footnote_latex' ||
                    token.type === 'footnotetext_latex' ||
                    token.type === 'blfootnotetext_latex')) return [3 /*break*/, 12];
                if (!((_a = token.children) === null || _a === void 0 ? void 0 : _a.length)) return [3 /*break*/, 11];
                j = 0;
                _l.label = 4;
            case 4:
                if (!(j < token.children.length)) return [3 /*break*/, 11];
                child = token.children[j];
                if (child.type === "paragraph_open") {
                    child.notInjectLineNumber = true;
                }
                if (!isInlineLikeType(child.type)) return [3 /*break*/, 6];
                state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                    currentTag: currentTag,
                }, tslib_1.__assign({}, envToInline));
                return [4 /*yield*/, state.md.inline.parseAsync(child.content, state.md, state.env, child.children, { sliceMs: sliceMs })];
            case 5:
                _l.sent();
                if (((_b = child.meta) === null || _b === void 0 ? void 0 : _b.isMathInText) && ((_c = child.children) === null || _c === void 0 ? void 0 : _c.length)) {
                    (0, utils_2.applyAttrToInlineMath)(child, "data-math-in-text", "true");
                }
                if (i > 0) {
                    (0, utils_2.addAttributesToParentToken)(tokens[i - 1], token);
                }
                _l.label = 6;
            case 6:
                if (!(child.type === 'tabular' && ((_d = child.children) === null || _d === void 0 ? void 0 : _d.length))) return [3 /*break*/, 10];
                k = 0;
                _l.label = 7;
            case 7:
                if (!(k < child.children.length)) return [3 /*break*/, 10];
                tok = child.children[k];
                if (tok.token === "inline_decimal") {
                    tok = (0, begin_tabular_1.inlineDecimalParse)(tok);
                    return [3 /*break*/, 9];
                }
                if (!(tok.token === "inline")) return [3 /*break*/, 9];
                if (tok.envToInline) {
                    envToInline = tok.envToInline;
                }
                state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                    currentTag: currentTag,
                }, tslib_1.__assign({}, envToInline));
                return [4 /*yield*/, state.md.inline.parseAsync(tok.content, state.md, state.env, tok.children, { sliceMs: sliceMs })];
            case 8:
                _l.sent();
                if (j > 0 && token.children[j - 1].type === 'td_open') {
                    (0, utils_2.addAttributesToParentToken)(token.children[j - 1], tok);
                }
                _l.label = 9;
            case 9:
                k++;
                return [3 /*break*/, 7];
            case 10:
                j++;
                return [3 /*break*/, 4];
            case 11:
                if (!state.env.footnotes.list) {
                    state.env.footnotes.list = [];
                }
                if (!state.env.mmd_footnotes.list) {
                    state.env.mmd_footnotes.list = [];
                }
                if (token.type === 'footnotetext_latex') {
                    (0, utils_1.addFootnoteToListForFootnotetext)(state, token, token.children, token.content, token.numbered, true);
                    return [3 /*break*/, 19];
                }
                if (token.type === 'blfootnotetext_latex') {
                    (0, utils_1.addFootnoteToListForBlFootnotetext)(state, token, token.children, token.content, true);
                    return [3 /*break*/, 19];
                }
                (0, utils_1.addFootnoteToListForFootnote)(state, token, token.children, token.content, token.numbered, true);
                return [3 /*break*/, 19];
            case 12:
                if (token.currentTag) {
                    currentTag = token.currentTag;
                }
                if (token.envToInline) {
                    envToInline = token.envToInline;
                }
                if (!(token.type === 'tabular' && ((_e = token.children) === null || _e === void 0 ? void 0 : _e.length))) return [3 /*break*/, 17];
                j = 0;
                _l.label = 13;
            case 13:
                if (!(j < token.children.length)) return [3 /*break*/, 16];
                tok = token.children[j];
                if (tok.token === "inline_decimal") {
                    tok = (0, begin_tabular_1.inlineDecimalParse)(tok);
                    return [3 /*break*/, 15];
                }
                if (!(tok.token === "inline")) return [3 /*break*/, 15];
                if (tok.envToInline) {
                    envToInline = tok.envToInline;
                }
                state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                    currentTag: currentTag,
                }, tslib_1.__assign({}, envToInline));
                return [4 /*yield*/, state.md.inline.parseAsync(tok.content, state.md, state.env, tok.children, { sliceMs: sliceMs })];
            case 14:
                _l.sent();
                if (j > 0 && token.children[j - 1].type === 'td_open') {
                    (0, utils_2.addAttributesToParentToken)(token.children[j - 1], tok);
                }
                _l.label = 15;
            case 15:
                j++;
                return [3 /*break*/, 13];
            case 16: return [3 /*break*/, 19];
            case 17:
                if (!isInlineLikeType(token.type)) return [3 /*break*/, 19];
                state.env = Object.assign({}, tslib_1.__assign({}, state.env), {
                    currentTag: currentTag,
                }, tslib_1.__assign({}, envToInline));
                return [4 /*yield*/, state.md.inline.parseAsync(token.content, state.md, state.env, token.children, { sliceMs: sliceMs })];
            case 18:
                _l.sent();
                if (((_f = token.meta) === null || _f === void 0 ? void 0 : _f.isMathInText) && ((_g = token.children) === null || _g === void 0 ? void 0 : _g.length)) {
                    (0, utils_2.applyAttrToInlineMath)(token.children, "data-math-in-text", "true");
                }
                if ((_h = state.md.options) === null || _h === void 0 ? void 0 : _h.enableSizeCalculation) {
                    if (token.type === 'inline' && ((_j = token.children) === null || _j === void 0 ? void 0 : _j.length)) {
                        data = (0, textWidthByTokens_1.getTextWidthByTokens)(token.children);
                        if (data) {
                            token.widthEx = data.widthEx;
                            token.heightEx = data.heightEx;
                            (0, counters_1.setSizeCounter)(data.widthEx, data.heightEx);
                        }
                    }
                }
                if (token.type === 'inline' && ((_k = token.children) === null || _k === void 0 ? void 0 : _k.length)) {
                    if (token.lastBreakToSpace &&
                        token.children[token.children.length - 1].type === 'softbreak') {
                        br = token.children[token.children.length - 1];
                        br.hidden = true;
                        br.showSpace = true;
                    }
                    if (token.firstBreakToSpace &&
                        token.children[0].type === 'softbreak') {
                        br0 = token.children[0];
                        br0.hidden = true;
                        br0.showSpace = true;
                    }
                    if (i > 0) {
                        (0, utils_2.addAttributesToParentToken)(tokens[i - 1], token);
                    }
                }
                _l.label = 19;
            case 19:
                i++;
                return [3 /*break*/, 1];
            case 20:
                state.env.footnotes = null;
                return [2 /*return*/];
        }
    });
}); };
exports.coreInlineAsync = coreInlineAsync;
//# sourceMappingURL=core-inline-async.js.map
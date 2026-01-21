"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineTabular = void 0;
var begin_tabular_1 = require("../md-block-rule/begin-tabular");
var parse_tabular_1 = require("../md-block-rule/begin-tabular/parse-tabular");
var utils_1 = require("../utils");
var consts_1 = require("../common/consts");
var inlineTabular = function (state, silent) {
    var _a;
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var src = state.src.slice(startMathPos);
    var match = src
        .match(consts_1.openTagTabular);
    if (!match) {
        return false;
    }
    var block = (0, utils_1.findFirstTagContentWithNesting)(src, consts_1.BEGIN_TABULAR_INLINE_RE, consts_1.END_TABULAR_INLINE_RE).block;
    if (!block) {
        // there is no complete block
        return false;
    }
    var fullBlock = src.slice(block.open.posStart, block.close.posEnd);
    var nextPos = startMathPos + block.close.posEnd;
    if (!silent) {
        var token = state.push("tabular_inline", "", 0);
        token.content = fullBlock;
        token.children = [];
        var cTabular = (0, begin_tabular_1.parseInlineTabular)(token.content);
        if (!cTabular) {
            return false;
        }
        for (var i = 0; i < cTabular.length; i++) {
            if (cTabular[i].type === 'inline') {
                continue;
            }
            var res = (0, parse_tabular_1.ParseTabular)(cTabular[i].content, 0, cTabular[i].align, state.md.options, state.env.subTabular);
            for (var j = 0; j < res.length; j++) {
                var tok = res[j];
                if (tok.token === 'table_open' && ((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forDocx)) {
                    tok.attrs.push(['data-type', 'subtable']);
                }
                if (tok.token === 'inline') {
                    var children = [];
                    if (state.env.tabulare) {
                        state.md.inline.parse(tok.content, state.md, state.env, children);
                    }
                    else {
                        state.env.tabulare = state.md.options.outMath.include_tsv
                            || state.md.options.outMath.include_csv
                            || (state.md.options.outMath.include_table_markdown
                                && state.md.options.outMath.table_markdown && state.md.options.outMath.table_markdown.math_as_ascii);
                        state.md.inline.parse(tok.content, state.md, state.env, children);
                        state.env.tabulare = false;
                    }
                    tok.children = children;
                }
                else {
                    if (res[j].token === 'inline_decimal') {
                        tok = (0, begin_tabular_1.inlineDecimalParse)(tok);
                    }
                }
                token.children.push(tok);
            }
        }
    }
    state.pos = nextPos;
    return true;
};
exports.inlineTabular = inlineTabular;
//# sourceMappingURL=tabular.js.map
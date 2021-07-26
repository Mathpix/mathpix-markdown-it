"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineTabular = void 0;
var begin_tabular_1 = require("../md-block-rule/begin-tabular");
var parse_tabular_1 = require("../md-block-rule/begin-tabular/parse-tabular");
exports.inlineTabular = function (state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startMathPos)
        .match(/^(?:begin\s{0,}{tabular})/);
    if (!match) {
        return false;
    }
    var endMarker = '\\end{tabular}';
    var endMarkerPos = state.src.lastIndexOf(endMarker);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    if (!silent) {
        var token = state.push("tabular_inline", "", 0);
        token.content = state.src.slice(startMathPos - 1, endMarkerPos + '\\end{tabular}'.length);
        token.children = [];
        var cTabular = begin_tabular_1.parseInlineTabular(token.content);
        if (!cTabular) {
            return false;
        }
        for (var i = 0; i < cTabular.length; i++) {
            if (cTabular[i].type === 'inline') {
                continue;
            }
            var res = parse_tabular_1.ParseTabular(cTabular[i].content, 0, cTabular[i].align, state.md.options);
            for (var j = 0; j < res.length; j++) {
                var tok = res[j];
                if (tok.token === 'inline') {
                    var children = [];
                    state.env.tabulare = state.md.options.outMath.include_tsv
                        || (state.md.options.outMath.include_table_markdown
                            && state.md.options.outMath.table_markdown && state.md.options.outMath.table_markdown.math_as_ascii);
                    state.md.inline.parse(tok.content, state.md, state.env, children);
                    state.env.tabulare = false;
                    tok.children = children;
                }
                else {
                    if (res[j].token === 'inline_decimal') {
                        tok = begin_tabular_1.inlineDecimalParse(tok);
                    }
                }
                token.children.push(tok);
            }
        }
    }
    state.pos = nextPos;
    return true;
};
//# sourceMappingURL=tabular.js.map
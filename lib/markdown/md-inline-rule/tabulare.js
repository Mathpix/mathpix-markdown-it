"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var begin_tabular_1 = require("../md-block-rule/begin-tabular");
var parse_tabular_1 = require("../md-block-rule/begin-tabular/parse-tabular");
exports.inlineTabular = function (state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(++startMathPos)
        .match(/^(?:|begin\s{0,}{tabular})/);
    if (!match) {
        return false;
    }
    startMathPos += match[0].length;
    var endMarker = '\\end{tabular}';
    var endMarkerPos = state.src.lastIndexOf(endMarker);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    if (!silent) {
        var token = state.push("tabulare", "", 0);
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
            var res = parse_tabular_1.ParseTabular(cTabular[i].content, 0, cTabular[i].align);
            for (var i_1 = 0; i_1 < res.length; i_1++) {
                var tok = res[i_1];
                if (tok.token === 'inline') {
                    var children = [];
                    state.md.inline.parse(tok.content, state.md, state.env, children);
                    tok.children = children;
                }
                token.children.push(tok);
            }
        }
        var tsv = begin_tabular_1.getTsv();
        if (tsv && tsv.length > 0) {
            token.tsv = begin_tabular_1.TsvJoin(tsv, state.md.options);
        }
    }
    state.pos = nextPos;
    return true;
};
//# sourceMappingURL=tabulare.js.map
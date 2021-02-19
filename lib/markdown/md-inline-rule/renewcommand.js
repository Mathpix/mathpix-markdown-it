"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reNewCommandInLine = void 0;
var renewcommand_1 = require("../md-block-rule/renewcommand");
exports.reNewCommandInLine = function (state, silent) {
    var match;
    var startMathPos = state.pos;
    var reItem = /^(?:renewcommand)/;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    startMathPos += 1;
    match = state.src
        .slice(startMathPos)
        .match(reItem);
    if (!match) {
        return false;
    }
    var endPos = renewcommand_1.parseOneCommand(state, state.src.slice(startMathPos + match[0].length));
    if (state.md.options && state.md.options.forLatex) {
        var token = state.push("renewcommand", "", 0);
        token.latex = state.src.slice(startMathPos + match[0].length)
            .trim();
    }
    state.pos = startMathPos + match[0].length + endPos + 1;
    return true;
};
//# sourceMappingURL=renewcommand.js.map
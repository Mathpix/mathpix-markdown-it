"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reNewCommandInLine = void 0;
var renewcommand_1 = require("../md-block-rule/renewcommand");
var common_1 = require("../common");
var src_pos_cache_1 = require("../common/src-pos-cache");
var NAME = 'renewcommand';
// One index per source, or a paragraph of commands paid for its whole length on each.
var CODE_POSITIONS = Symbol('renewcommand-code-positions');
var codeIndexOf = function (state) {
    return (0, src_pos_cache_1.srcValueCached)(state, CODE_POSITIONS, function (src) { return (0, common_1.buildInlineCodePositionSet)((0, common_1.getInlineCodeListFromString)(src)); });
};
var reNewCommandInLine = function (state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    startMathPos += 1;
    // The name ends here, or `\renewcommandfoo` was taken and its arguments half-eaten.
    if (!(0, renewcommand_1.startsCommandAt)(state.src, state.pos)) {
        return false;
    }
    var endPos = (0, renewcommand_1.parseOneCommand)(state, state.src.slice(startMathPos + NAME.length));
    var end = startMathPos + NAME.length + endPos + 1;
    // Arguments not closing: the body ran to the end of the source and dropped every line after it.
    if ((0, common_1.renewCommandSpanEnd)(state.src, state.pos, codeIndexOf(state)) <= 0) {
        var lineEnd = state.src.indexOf('\n', state.pos);
        end = Math.min(end, state.posMax, lineEnd < 0 ? state.posMax : lineEnd);
    }
    if (state.md.options && state.md.options.forLatex) {
        var token = state.push("renewcommand", "", 0);
        // Without the name and to the end of the source: the converter reads this shape.
        token.latex = state.src.slice(startMathPos + NAME.length).trim();
    }
    state.pos = end;
    return true;
};
exports.reNewCommandInLine = reNewCommandInLine;
//# sourceMappingURL=renewcommand.js.map
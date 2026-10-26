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
    var bodyStart = startMathPos + NAME.length;
    var body = state.src.slice(bodyStart);
    // Arguments not closing end the command with its line, so the body is read no further.
    var lineEnd = (0, common_1.renewCommandSpanEnd)(state.src, state.pos, codeIndexOf(state)) <= 0
        ? state.src.indexOf('\n', state.pos)
        : -1;
    var endPos = lineEnd < 0
        ? (0, renewcommand_1.parseOneCommand)(state, body)
        : (0, renewcommand_1.parseOneCommandWithin)(state, body, lineEnd - bodyStart);
    var end = bodyStart + endPos + 1;
    if (lineEnd >= 0) {
        end = Math.min(end, lineEnd);
    }
    // `parseOneCommand` reads to the end of `src`, which is past `posMax` inside a link label or an
    // option: `state.pos` beyond it is what dropped the rest of the document above.
    end = Math.min(end, state.posMax);
    if (state.md.options && state.md.options.forLatex) {
        var token = state.push("renewcommand", "", 0);
        // Without the name and to the end of the source: the converter reads this shape.
        token.latex = body.trim();
    }
    state.pos = end;
    return true;
};
exports.reNewCommandInLine = reNewCommandInLine;
//# sourceMappingURL=renewcommand.js.map
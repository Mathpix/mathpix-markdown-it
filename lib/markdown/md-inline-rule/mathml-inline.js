"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineMathML = void 0;
var convert_math_to_html_1 = require("../common/convert-math-to-html");
var consts_1 = require("../common/consts");
var validate_mathML_1 = require("../common/validate-mathML");
var inlineMathML = function (state, silent) {
    var _a;
    try {
        var pos = state.pos, src = state.src, posMax = state.posMax;
        // Early exit if input is too short or does not start with '<'
        if (pos + 2 >= posMax || src.charCodeAt(pos) !== 0x3C /* < */) {
            return false;
        }
        // Attempt to match the MathML inline pattern
        var match = src.slice(pos).match(consts_1.mathMLInlineRegex);
        if (!match) {
            return false;
        }
        var validationMathML = (0, validate_mathML_1.validateMathMLShallow)(match[0]);
        if (!validationMathML.ok) {
            return false;
        }
        // Determine the type of MathML (inline or display)
        var type = ((_a = match[1]) === null || _a === void 0 ? void 0 : _a.indexOf('block')) !== -1 ? "display_mathML" : "inline_mathML";
        // Create and configure token if not in silent mode
        if (!silent) {
            var token = state.push(type, "", 0);
            token.content = src.slice(pos, pos + match[0].length);
            token.inlinePos = {
                start: state.pos,
                end: pos + match[0].length
            };
            // Convert MathML to HTML and obtain additional data using MathJax
            (0, convert_math_to_html_1.convertMathToHtml)(state, token, state.md.options);
        }
        // Advance the state position to the end of the matched content
        state.pos += match[0].length;
        return true;
    }
    catch (err) {
        console.error("[ERROR]=>[inlineMathML]=>", err);
        return false;
    }
};
exports.inlineMathML = inlineMathML;
//# sourceMappingURL=mathml-inline.js.map
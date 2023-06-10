"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var set_positions_1 = require("./md-core-rules/set-positions");
var render_rule_highlights_1 = require("./highlight/render-rule-highlights");
exports.default = (function (md, options) {
    var _a;
    Object.assign(md.options, options);
    /** Set positions to tokens */
    md.core.ruler.push('set_positions', set_positions_1.setPositions);
    if ((_a = md.options.highlights) === null || _a === void 0 ? void 0 : _a.length) {
        md.renderer.rules.text = render_rule_highlights_1.textHighlight;
        md.renderer.rules.code_inline = render_rule_highlights_1.codeInlineHighlight;
        md.renderer.rules.textUrl = render_rule_highlights_1.renderTextUrlHighlight;
        md.renderer.rules.inline_math
            = md.renderer.rules.display_math
                = md.renderer.rules.equation_math
                    = md.renderer.rules.equation_math_not_number
                        = render_rule_highlights_1.renderMathHighlight;
        md.renderer.rules.caption_table = render_rule_highlights_1.captionTableHighlight;
    }
});
//# sourceMappingURL=mdSetPositionsAndHighlight.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var begin_tabular_1 = require("./md-block-rule/begin-tabular");
var begin_align_1 = require("./md-block-rule/begin-align");
var begin_table_1 = require("./md-block-rule/begin-table");
var includegraphics_1 = require("./md-inline-rule/includegraphics");
var md_renderer_rules_1 = require("./md-renderer-rules");
var sub_tabular_1 = require("./md-block-rule/begin-tabular/sub-tabular");
var sub_math_1 = require("./md-block-rule/begin-tabular/sub-math");
var parse_error_1 = require("./md-block-rule/parse-error");
var block_rule_1 = require("./md-theorem/block-rule");
var common_1 = require("./common");
exports.default = (function (md, options) {
    (0, begin_table_1.ClearTableNumbers)();
    (0, begin_table_1.ClearFigureNumbers)();
    (0, sub_tabular_1.ClearSubTableLists)();
    (0, sub_math_1.ClearSubMathLists)();
    (0, parse_error_1.ClearParseError)();
    Object.assign(md.options, options);
    var width = md.options.width;
    md.block.ruler.after("fence", "BeginTabular", begin_tabular_1.BeginTabular, Object.assign({}, md.options, { alt: (0, common_1.getTerminatedRules)('BeginTabular') }));
    md.block.ruler.before("BeginTabular", "BeginAlign", begin_align_1.BeginAlign, { alt: (0, common_1.getTerminatedRules)('BeginAlign') });
    md.block.ruler.before("BeginAlign", "BeginTable", begin_table_1.BeginTable, { alt: (0, common_1.getTerminatedRules)('BeginTable') });
    md.block.ruler.after("BeginTabular", "BeginTheorem", block_rule_1.BeginTheorem, { alt: (0, common_1.getTerminatedRules)('BeginTheorem') });
    md.block.ruler.before("BeginTheorem", "BeginProof", block_rule_1.BeginProof, { alt: (0, common_1.getTerminatedRules)('BeginProof') });
    md.inline.ruler.before("escape", "InlineIncludeGraphics", includegraphics_1.InlineIncludeGraphics);
    md.renderer.rules.caption_table = function (tokens, idx, options, env, slf) {
        return (0, md_renderer_rules_1.CaptionTable)(tokens, idx, options, env, slf);
    };
    md.renderer.rules.inline_decimal = function (tokens, idx) {
        return (0, md_renderer_rules_1.InlineDecimal)(tokens, tokens[idx]);
    };
    md.renderer.rules.includegraphics = function (tokens, idx, options, env, slf) {
        return (0, md_renderer_rules_1.IncludeGraphics)(tokens, tokens[idx], slf, width, options);
    };
});
//# sourceMappingURL=mdPluginTableTabular.js.map
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
exports.default = (function (md, options) {
    begin_table_1.ClearTableNumbers();
    begin_table_1.ClearFigureNumbers();
    sub_tabular_1.ClearSubTableLists();
    sub_math_1.ClearSubMathLists();
    parse_error_1.ClearParseError();
    Object.assign(md.options, options);
    var width = md.options.width;
    md.block.ruler.after("fence", "BeginTabular", begin_tabular_1.BeginTabular, md.options);
    md.block.ruler.before("BeginTabular", "BeginAlign", begin_align_1.BeginAlign);
    md.block.ruler.before("BeginAlign", "BeginTable", begin_table_1.BeginTable);
    md.inline.ruler.before("escape", "InlineIncludeGraphics", includegraphics_1.InlineIncludeGraphics);
    md.renderer.rules.caption_table = function (tokens, idx) {
        return md_renderer_rules_1.CaptionTable(tokens, tokens[idx]);
    };
    md.renderer.rules.inline_decimal = function (tokens, idx) {
        return md_renderer_rules_1.InlineDecimal(tokens, tokens[idx]);
    };
    md.renderer.rules.includegraphics = function (tokens, idx, options, env, slf) {
        return md_renderer_rules_1.IncludeGraphics(tokens, tokens[idx], slf, width);
    };
});
//# sourceMappingURL=mdPluginTableTabular.js.map
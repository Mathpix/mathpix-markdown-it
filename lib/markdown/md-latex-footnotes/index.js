"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_rule_1 = require("./core-rule");
var render_rule_1 = require("./render-rule");
var block_rule_1 = require("./block-rule");
var inline_rule_1 = require("./inline-rule");
var inline_ruler2_1 = require("./inline-ruler2");
var utils_1 = require("./utils");
exports.default = (function (md, options) {
    Object.assign(md.options, options);
    (0, utils_1.rest_mmd_footnotes_list)();
    md.core.ruler.after('inline', 'mmd_footnote_tail', core_rule_1.mmd_footnote_tail);
    md.block.ruler.before('paragraphDiv', 'latex_footnote_block', block_rule_1.latex_footnote_block, { alt: ['paragraph', 'reference'] });
    md.block.ruler.after('latex_footnote_block', 'latex_footnotetext_block', block_rule_1.latex_footnotetext_block, { alt: ['paragraph', 'reference'] });
    md.inline.ruler.after("multiMath", "latex_footnote", inline_rule_1.latex_footnote);
    md.inline.ruler.after("latex_footnote", "latex_footnotemark", inline_rule_1.latex_footnotemark);
    md.inline.ruler.after("latex_footnotemark", "latex_footnotetext", inline_rule_1.latex_footnotetext);
    md.inline.ruler2.push("grab_footnote_ref", inline_ruler2_1.grab_footnote_ref);
    md.renderer.rules.footnotetext
        = md.renderer.rules.blfootnotetext
            = render_rule_1.render_footnotetext;
    md.renderer.rules.footnotetext_latex
        = md.renderer.rules.blfootnotetext_latex
            = render_rule_1.render_footnotetext;
    md.renderer.rules.footnote_latex = render_rule_1.render_footnote_ref;
    md.renderer.rules.mmd_footnote_ref = render_rule_1.render_footnote_ref;
    md.renderer.rules.mmd_footnote_block_open = render_rule_1.render_footnote_block_open;
    md.renderer.rules.mmd_footnote_block_close = render_rule_1.render_footnote_block_close;
    md.renderer.rules.mmd_footnote_list_open = render_rule_1.render_footnote_list_open;
    md.renderer.rules.mmd_footnote_list_close = render_rule_1.render_footnote_list_close;
    md.renderer.rules.mmd_footnote_open = render_rule_1.render_footnote_open;
    md.renderer.rules.mmd_footnote_close = render_rule_1.render_footnote_close;
    md.renderer.rules.mmd_footnote_anchor = render_rule_1.render_footnote_anchor;
    // helpers (only used in other rules, no tokens are attached to those)
    md.renderer.rules.mmd_footnote_caption = render_rule_1.render_footnote_caption;
    md.renderer.rules.mmd_footnote_anchor_name = render_rule_1.render_footnote_anchor_name;
});
//# sourceMappingURL=index.js.map
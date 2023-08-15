"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_rule_1 = require("./core-rule");
var render_rule_1 = require("./render-rule");
var inline_rule_1 = require("./inline-rule");
exports.default = (function (md, options) {
    Object.assign(md.options, options);
    var coreRuler = md.core.ruler;
    var coreRules = coreRuler.getRules('');
    var hasFootnoteRule = (coreRules === null || coreRules === void 0 ? void 0 : coreRules.length)
        ? coreRules.find(function (item) { return item.name === 'footnote_tail'; })
        : null;
    if (hasFootnoteRule) {
        md.core.ruler.at('footnote_tail', core_rule_1.footnote_tail);
    }
    else {
        md.core.ruler.after('inline', 'footnote_tail', core_rule_1.footnote_tail);
    }
    md.inline.ruler.after("multiMath", "latex_footnote", inline_rule_1.latex_footnote);
    md.inline.ruler.after("latex_footnote", "latex_footnotemark", inline_rule_1.latex_footnotemark);
    md.inline.ruler.after("latex_footnotemark", "latex_footnotetext", inline_rule_1.latex_footnotetext);
    md.renderer.rules.footnote_ref = render_rule_1.render_footnote_ref;
    md.renderer.rules.footnote_block_open = render_rule_1.render_footnote_block_open;
    md.renderer.rules.footnote_block_close = render_rule_1.render_footnote_block_close;
    md.renderer.rules.footnote_open = render_rule_1.render_footnote_open;
    md.renderer.rules.footnote_close = render_rule_1.render_footnote_close;
    md.renderer.rules.footnote_anchor = render_rule_1.render_footnote_anchor;
    md.renderer.rules.footnotetext = render_rule_1.render_footnotetext;
    // helpers (only used in other rules, no tokens are attached to those)
    md.renderer.rules.footnote_caption = render_rule_1.render_footnote_caption;
    md.renderer.rules.footnote_anchor_name = render_rule_1.render_footnote_anchor_name;
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lists_1 = require("./md-block-rule/lists");
var re_level_1 = require("./md-block-rule/lists/re-level");
var renewcommand_1 = require("./md-block-rule/renewcommand");
var lists_2 = require("./md-inline-rule/lists");
var renewcommand_2 = require("./md-inline-rule/renewcommand");
var text_mode_1 = require("./md-inline-rule/text-mode");
var render_lists_1 = require("./md-renderer-rules/render-lists");
var mapping = {
    itemize_list_open: "itemize_list_open",
    enumerate_list_open: "enumerate_list_open",
    itemize_list_close: "itemize_list_close",
    enumerate_list_close: "enumerate_list_close",
    item_inline: "item_inline",
    latex_list_item_open: "latex_list_item_open",
    latex_list_item_close: "latex_list_item_close",
    setcounter: "setcounter"
};
exports.default = (function (md, options) {
    Object.assign(md.options, options);
    re_level_1.SetDefaultItemizeLevel();
    re_level_1.SetDefaultEnumerateLevel();
    re_level_1.clearItemizeLevelTokens();
    md.block.ruler.after("list", "Lists", lists_1.Lists, md.options);
    if (md.options.renderElement && (md.options.renderElement.class === 'li_enumerate' ||
        md.options.renderElement.class === 'li_itemize')) {
        md.block.ruler.before("Lists", "ReRenderListsItem", lists_1.ReRenderListsItem, md.options);
    }
    md.block.ruler.before("Lists", "ReNewCommand", renewcommand_1.ReNewCommand);
    md.inline.ruler.before('escape', 'list_begin_inline', lists_2.listBeginInline);
    md.inline.ruler.before('list_begin_inline', 'renewcommand_inline', renewcommand_2.reNewCommandInLine);
    md.inline.ruler.after('list_begin_inline', 'list_setcounter_inline', lists_2.listSetCounterInline);
    md.inline.ruler.after('list_begin_inline', 'list_item_inline', lists_2.listItemInline);
    md.inline.ruler.after('list_item_inline', 'list_close_inline', lists_2.listCloseInline);
    md.inline.ruler.after('list_item_inline', 'textMode', text_mode_1.textMode);
    Object.keys(mapping).forEach(function (key) {
        md.renderer.rules[key] = function (tokens, idx, options, env, slf) {
            switch (tokens[idx].type) {
                case "itemize_list_open":
                    return render_lists_1.render_itemize_list_open(tokens, idx, slf);
                case "enumerate_list_open":
                    return render_lists_1.render_enumerate_list_open(tokens, idx, slf);
                case "item_inline":
                    return render_lists_1.render_item_inline(tokens, idx, options, env, slf);
                case "itemize_list_close":
                    return render_lists_1.render_itemize_list_close();
                case "enumerate_list_close":
                    return render_lists_1.render_enumerate_list_close();
                case "latex_list_item_open":
                    return render_lists_1.render_latex_list_item_open(tokens, idx, options, env, slf);
                case "latex_list_item_close":
                    return render_lists_1.render_latex_list_item_close();
                default:
                    return '';
            }
        };
    });
});
//# sourceMappingURL=mdPluginLists.js.map
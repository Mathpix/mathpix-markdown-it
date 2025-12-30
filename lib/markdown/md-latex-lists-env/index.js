"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var latex_list_env_block_1 = require("./latex-list-env-block");
var re_level_1 = require("./re-level");
var renewcommand_1 = require("../md-block-rule/renewcommand");
var latex_list_env_inline_1 = require("./latex-list-env-inline");
var renewcommand_2 = require("../md-inline-rule/renewcommand");
var render_latex_list_env_1 = require("./render-latex-list-env");
var list_state_1 = require("./list-state");
var common_1 = require("../common");
/**
 * Markdown-it plugin that adds full LaTeX-style list environment support:
 *   \begin{itemize} ... \end{itemize}
 *   \begin{enumerate} ... \end{enumerate}
 *   \item, \setcounter, nested lists, inline and block modes.
 *
 * The plugin:
 *  • registers custom block and inline rules for LaTeX list parsing,
 *  • manages internal list state (nesting, counters, markers),
 *  • injects dedicated renderers for itemize/enumerate tokens,
 *  • safely coexists with builtin markdown-it list rules.
 *
 * Should be loaded once per MarkdownIt instance.
 */
function pluginLatexListsEnv(md, options) {
    Object.assign(md.options, options);
    (0, list_state_1.resetListState)();
    (0, re_level_1.SetDefaultItemizeLevel)();
    (0, re_level_1.SetDefaultEnumerateLevel)();
    (0, re_level_1.clearItemizeLevelTokens)();
    var blockRuler = md.block.ruler;
    var inlineRuler = md.inline.ruler;
    blockRuler.after("list", "Lists", latex_list_env_block_1.Lists, { alt: (0, common_1.getTerminatedRules)("Lists") });
    blockRuler.before("Lists", "ReNewCommand", renewcommand_1.ReNewCommand);
    // 1) Aggregator: full list env (nested) — highest priority
    inlineRuler.before('escape', 'latex_list_env_inline', latex_list_env_inline_1.latexListEnvInline);
    // 2) Legacy rules (optional fallback for partial parsing)
    inlineRuler.after('latex_list_env_inline', 'list_begin_inline', latex_list_env_inline_1.listBeginInline);
    inlineRuler.before('latex_list_env_inline', 'renewcommand_inline', renewcommand_2.reNewCommandInLine);
    inlineRuler.after('latex_list_env_inline', 'list_setcounter_inline', latex_list_env_inline_1.listSetCounterInline);
    inlineRuler.after('list_begin_inline', 'list_item_inline', latex_list_env_inline_1.listItemInline);
    inlineRuler.after('list_item_inline', 'list_close_inline', latex_list_env_inline_1.listCloseInline);
    var listRenderers = {
        itemize_list_open: render_latex_list_env_1.render_itemize_list_open,
        enumerate_list_open: render_latex_list_env_1.render_enumerate_list_open,
        item_inline: render_latex_list_env_1.render_item_inline,
        itemize_list_close: render_latex_list_env_1.render_itemize_list_close,
        enumerate_list_close: render_latex_list_env_1.render_enumerate_list_close,
        latex_list_item_open: render_latex_list_env_1.render_latex_list_item_open,
        latex_list_item_close: render_latex_list_env_1.render_latex_list_item_close,
    };
    Object.entries(listRenderers).forEach(function (_a) {
        var _b = tslib_1.__read(_a, 2), type = _b[0], rule = _b[1];
        md.renderer.rules[type] = rule;
    });
}
exports.default = pluginLatexListsEnv;
//# sourceMappingURL=index.js.map
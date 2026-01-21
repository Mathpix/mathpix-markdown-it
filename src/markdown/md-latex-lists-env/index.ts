import { MarkdownIt } from 'markdown-it';
import type Ruler from 'markdown-it/lib/ruler';
import type Renderer from 'markdown-it/lib/renderer';
import { Lists } from './latex-list-env-block';
import {
  SetDefaultItemizeLevel,
  SetDefaultEnumerateLevel,
  clearItemizeLevelTokens
} from './re-level';
import { ReNewCommand } from "../md-block-rule/renewcommand";
import {
  listCloseInline,
  listBeginInline,
  listItemInline,
  listSetCounterInline,
  latexListEnvInline
} from "./latex-list-env-inline"
import { reNewCommandInLine } from "../md-inline-rule/renewcommand";
import {
  render_itemize_list_open,
  render_enumerate_list_open,
  render_item_inline,
  render_itemize_list_close,
  render_enumerate_list_close,
  render_latex_list_item_open,
  render_latex_list_item_close
} from "./render-latex-list-env";
import { resetListState } from "./list-state";
import { getTerminatedRules } from "../common";

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
export default function pluginLatexListsEnv (md: MarkdownIt, options): void {
  Object.assign(md.options, options);
  resetListState();
  SetDefaultItemizeLevel();
  SetDefaultEnumerateLevel();
  clearItemizeLevelTokens();
  const blockRuler: Ruler = md.block.ruler;
  const inlineRuler: Ruler = md.inline.ruler;
  blockRuler.after("list", "Lists", Lists, {alt: getTerminatedRules("Lists")});
  blockRuler.before("Lists", "ReNewCommand", ReNewCommand);
  // 1) Aggregator: full list env (nested) — highest priority
  inlineRuler.before('escape', 'latex_list_env_inline', latexListEnvInline);
  // 2) Legacy rules (optional fallback for partial parsing)
  inlineRuler.after('latex_list_env_inline', 'list_begin_inline', listBeginInline);
  inlineRuler.before('latex_list_env_inline', 'renewcommand_inline', reNewCommandInLine);
  inlineRuler.after('latex_list_env_inline', 'list_setcounter_inline', listSetCounterInline);
  inlineRuler.after('list_begin_inline', 'list_item_inline', listItemInline);
  inlineRuler.after('list_item_inline', 'list_close_inline', listCloseInline);
  const listRenderers: Record<string, Renderer.RenderRule> = {
    itemize_list_open: render_itemize_list_open,
    enumerate_list_open: render_enumerate_list_open,
    item_inline: render_item_inline,
    itemize_list_close: render_itemize_list_close,
    enumerate_list_close: render_enumerate_list_close,
    latex_list_item_open: render_latex_list_item_open,
    latex_list_item_close: render_latex_list_item_close,
  };
  Object.entries(listRenderers).forEach(([type, rule]) => {
    md.renderer.rules[type] = rule;
  });
}

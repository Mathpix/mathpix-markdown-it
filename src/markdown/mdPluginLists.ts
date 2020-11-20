import { MarkdownIt } from 'markdown-it';
import { Lists, ReRenderListsItem } from './md-block-rule/lists';
import {
  SetDefaultItemizeLevel,
  SetDefaultEnumerateLevel,
  clearItemizeLevelTokens
} from './md-block-rule/lists/re-level';
import { ReNewCommand } from "./md-block-rule/renewcommand";
import { listCloseInline, listBeginInline, listItemInline, listSetCounterInline } from "./md-inline-rule/lists"
import { reNewCommandInLine } from "./md-inline-rule/renewcommand";
import { textMode } from "./md-inline-rule/text-mode";

import {
  render_itemize_list_open,
  render_enumerate_list_open,
  render_item_inline,
  render_itemize_list_close,
  render_enumerate_list_close,
  render_latex_list_item_open,
  render_latex_list_item_close
} from "./md-renderer-rules/render-lists";

const mapping = {
  itemize_list_open: "itemize_list_open",
  enumerate_list_open: "enumerate_list_open",
  itemize_list_close: "itemize_list_close",
  enumerate_list_close: "enumerate_list_close",
  item_inline: "item_inline",
  latex_list_item_open: "latex_list_item_open",
  latex_list_item_close: "latex_list_item_close",
  setcounter: "setcounter"
};

export default (md: MarkdownIt, options) => {
  Object.assign(md.options, options);

  SetDefaultItemizeLevel();
  SetDefaultEnumerateLevel();
  clearItemizeLevelTokens();
  md.block.ruler.after("list","Lists", Lists, md.options);
  if (md.options.renderElement && (md.options.renderElement.class === 'li_enumerate' ||
    md.options.renderElement.class === 'li_itemize')) {
    md.block.ruler.before("Lists","ReRenderListsItem", ReRenderListsItem, md.options);
  }
  md.block.ruler.before("Lists", "ReNewCommand", ReNewCommand);
  md.inline.ruler.before('escape', 'list_begin_inline', listBeginInline);
  md.inline.ruler.before('list_begin_inline', 'renewcommand_inline', reNewCommandInLine);
  md.inline.ruler.after('list_begin_inline', 'list_setcounter_inline', listSetCounterInline);
  md.inline.ruler.after('list_begin_inline', 'list_item_inline', listItemInline);
  md.inline.ruler.after('list_item_inline', 'list_close_inline', listCloseInline);
  md.inline.ruler.after('list_item_inline', 'textMode', textMode);


  Object.keys(mapping).forEach(key => {
    md.renderer.rules[key] = (tokens, idx, options, env, slf) => {
      switch (tokens[idx].type) {
        case "itemize_list_open":
          return render_itemize_list_open(tokens, idx, slf);
        case "enumerate_list_open":
          return render_enumerate_list_open(tokens, idx, slf);
         case "item_inline":
           return render_item_inline(tokens, idx, options, env, slf);
        case "itemize_list_close":
          return render_itemize_list_close();
        case "enumerate_list_close":
          return render_enumerate_list_close();
        case "latex_list_item_open":
          return render_latex_list_item_open(tokens, idx, options, env, slf);
        case "latex_list_item_close":
          return render_latex_list_item_close();
        default:
          return '';
      }
    }
  });
}

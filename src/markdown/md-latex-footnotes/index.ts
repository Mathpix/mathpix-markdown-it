import { markdownit } from 'markdown-it';
import { mmd_footnote_tail } from "./core-rule";
import {
  render_footnote_ref,
  render_footnote_block_open,
  render_footnote_block_close,  
  render_footnote_list_open,
  render_footnote_list_close,
  render_footnote_open,
  render_footnote_close,
  render_footnote_anchor,
  render_footnote_caption,
  render_footnote_anchor_name,
  render_footnotetext
} from "./render-rule";
import { latex_footnote_block, latex_footnotetext_block } from "./block-rule";
import {
  latex_footnote,
  latex_footnotemark,
  latex_footnotetext
} from "./inline-rule";
import { grab_footnote_ref } from "./inline-ruler2";
import { rest_mmd_footnotes_list } from "./utils";

export default (md: markdownit | any, options) => {
  Object.assign(md.options, options);
  rest_mmd_footnotes_list();
  md.core.ruler.after('inline', 'mmd_footnote_tail', mmd_footnote_tail);
  md.block.ruler.before('paragraphDiv', 'latex_footnote_block', latex_footnote_block);
  md.block.ruler.after('latex_footnote_block', 'latex_footnotetext_block', latex_footnotetext_block);
  md.inline.ruler.after("multiMath", "latex_footnote", latex_footnote);
  md.inline.ruler.after("latex_footnote", "latex_footnotemark", latex_footnotemark);
  md.inline.ruler.after("latex_footnotemark", "latex_footnotetext", latex_footnotetext);
  md.inline.ruler2.push("grab_footnote_ref", grab_footnote_ref);

  md.renderer.rules.footnotetext 
    = md.renderer.rules.blfootnotetext 
    = render_footnotetext;
  md.renderer.rules.footnotetext_latex 
    = md.renderer.rules.blfootnotetext_latex 
    = render_footnotetext;
  md.renderer.rules.footnote_latex = render_footnote_ref;
  
  md.renderer.rules.mmd_footnote_ref = render_footnote_ref;
  md.renderer.rules.mmd_footnote_block_open = render_footnote_block_open;
  md.renderer.rules.mmd_footnote_block_close = render_footnote_block_close;  
  md.renderer.rules.mmd_footnote_list_open = render_footnote_list_open;
  md.renderer.rules.mmd_footnote_list_close = render_footnote_list_close;
  md.renderer.rules.mmd_footnote_open = render_footnote_open;
  md.renderer.rules.mmd_footnote_close = render_footnote_close;
  md.renderer.rules.mmd_footnote_anchor = render_footnote_anchor;
  // helpers (only used in other rules, no tokens are attached to those)
  md.renderer.rules.mmd_footnote_caption = render_footnote_caption;
  md.renderer.rules.mmd_footnote_anchor_name = render_footnote_anchor_name;
}

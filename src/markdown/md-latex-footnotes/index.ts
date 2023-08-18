import { MarkdownIt, Ruler } from 'markdown-it';
import {footnote_tail} from "./core-rule";
import {
  render_footnote_ref,
  render_footnote_block_open,
  render_footnote_block_close,
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

export default (md: MarkdownIt, options) => {
  Object.assign(md.options, options);
  const coreRuler: Ruler = md.core.ruler;
  const coreRules = coreRuler.getRules('');
  const hasFootnoteRule = coreRules?.length
    ? coreRules.find(item => item.name === 'footnote_tail')
    : null;
  if (hasFootnoteRule) {
    md.core.ruler.at('footnote_tail', footnote_tail);
  } else {
    md.core.ruler.after('inline', 'footnote_tail', footnote_tail);
  }
  md.block.ruler.before('paragraphDiv', 'latex_footnote_block', latex_footnote_block, { alt: [ 'paragraph', 'reference' ] });
  md.block.ruler.after('latex_footnote_block', 'latex_footnotetext_block', latex_footnotetext_block, { alt: [ 'paragraph', 'reference' ] });
  md.inline.ruler.after("multiMath", "latex_footnote", latex_footnote);
  md.inline.ruler.after("latex_footnote", "latex_footnotemark", latex_footnotemark);
  md.inline.ruler.after("latex_footnotemark", "latex_footnotetext", latex_footnotetext);

  md.renderer.rules.footnote_ref = render_footnote_ref;
  md.renderer.rules.footnote_latex = render_footnote_ref;
  md.renderer.rules.footnote_block_open = render_footnote_block_open;
  md.renderer.rules.footnote_block_close = render_footnote_block_close;
  md.renderer.rules.footnote_open = render_footnote_open;
  md.renderer.rules.footnote_close = render_footnote_close;
  md.renderer.rules.footnote_anchor = render_footnote_anchor;
  md.renderer.rules.footnotetext = render_footnotetext;
  md.renderer.rules.footnotetext_latex = render_footnotetext;

  // helpers (only used in other rules, no tokens are attached to those)
  md.renderer.rules.footnote_caption = render_footnote_caption;
  md.renderer.rules.footnote_anchor_name = render_footnote_anchor_name;
}

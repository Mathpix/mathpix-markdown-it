import { markdownit } from 'markdown-it';
import { setPositions } from "./md-core-rules/set-positions";
import {
  renderMathHighlight,
  textHighlight, 
  codeInlineHighlight, 
  renderTextUrlHighlight,
  captionTableHighlight
} from "./highlight/render-rule-highlights";

export default (md: markdownit, options) => {
  Object.assign(md.options, options);
  /** Set positions to tokens */
  md.core.ruler.push('set_positions', setPositions);
    
  if (md.options.highlights?.length) {
    md.renderer.rules.text = textHighlight;
    md.renderer.rules.code_inline = codeInlineHighlight;
    md.renderer.rules.textUrl = renderTextUrlHighlight;
    md.renderer.rules.inline_math
      = md.renderer.rules.display_math
      = md.renderer.rules.equation_math
      = md.renderer.rules.equation_math_not_number
      = renderMathHighlight;
    md.renderer.rules.caption_table = captionTableHighlight;
  }
}

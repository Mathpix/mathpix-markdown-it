import { markdownit } from 'markdown-it';

import { BeginTabular} from './md-block-rule/begin-tabular';
import { BeginAlign } from './md-block-rule/begin-align';
import { BeginTable, ClearTableNumbers, ClearFigureNumbers } from './md-block-rule/begin-table';
import { InlineIncludeGraphics } from './md-inline-rule/includegraphics';
import { CaptionTable, InlineDecimal, IncludeGraphics } from './md-renderer-rules';
import { ClearSubTableLists } from "./md-block-rule/begin-tabular/sub-tabular";
import { ClearSubMathLists } from "./md-block-rule/begin-tabular/sub-math";
import {ClearParseError} from "./md-block-rule/parse-error";
import { BeginTheorem, BeginProof } from "./md-theorem/block-rule";
import { getTerminatedRules } from "./common";

export default (md: markdownit  | any, options) => {
  ClearTableNumbers();
  ClearFigureNumbers();
  ClearSubTableLists();
  ClearSubMathLists();
  ClearParseError();
  Object.assign(md.options, options);
  const width = md.options.width;

  md.block.ruler.after("fence", "BeginTabular", BeginTabular, 
    Object.assign({}, md.options, {alt: getTerminatedRules('BeginTabular')}));
  md.block.ruler.before("BeginTabular", "BeginAlign", BeginAlign, 
    {alt: getTerminatedRules('BeginAlign')});
  md.block.ruler.before("BeginAlign", "BeginTable", BeginTable, 
    {alt: getTerminatedRules('BeginTable')});
  md.block.ruler.after("BeginTabular", "BeginTheorem", BeginTheorem, 
    {alt: getTerminatedRules('BeginTheorem')});
  md.block.ruler.before("BeginTheorem", "BeginProof", BeginProof, 
    {alt: getTerminatedRules('BeginProof')});
  md.inline.ruler.before("escape", "InlineIncludeGraphics", InlineIncludeGraphics);

  md.renderer.rules.caption_table = (tokens, idx, options, env, slf) => {
        return CaptionTable(tokens, idx, options, env, slf);
  };
  md.renderer.rules.inline_decimal = (tokens, idx) => {
    return InlineDecimal(tokens, tokens[idx]);
  };
  md.renderer.rules.includegraphics = (tokens, idx, options, env, slf) => {
    return IncludeGraphics(tokens, tokens[idx], slf, width, options);
  }

}

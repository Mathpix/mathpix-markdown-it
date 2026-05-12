import { MarkdownIt } from 'markdown-it';

import { BeginTabular} from './md-block-rule/begin-tabular';
import { BeginAlign } from './md-block-rule/begin-align';
import { BeginTable, ClearTableNumbers, ClearFigureNumbers } from './md-block-rule/begin-table';
import { InlineIncludeGraphics } from './md-inline-rule/includegraphics';
import { CaptionTable, InlineDecimal, IncludeGraphics } from './md-renderer-rules';
import { ClearSubTableLists } from "./md-block-rule/begin-tabular/sub-tabular";
import { ClearSubMathLists } from "./md-block-rule/begin-tabular/sub-math";
import { ClearDiagboxTable } from "./md-block-rule/begin-tabular/sub-cell";
import {ClearParseError} from "./md-block-rule/parse-error";
import { BeginTheorem, BeginProof } from "./md-theorem/block-rule";
import { getTerminatedRules } from "./common";
import { ClearExtractedCodeBlocks } from "./md-block-rule/begin-tabular/sub-code";
import { clearColumnStyleCache } from "./md-block-rule/begin-tabular/tabular-td";

const clearTabularState = () => {
  ClearTableNumbers();
  ClearFigureNumbers();
  ClearSubTableLists();
  ClearSubMathLists();
  ClearDiagboxTable();
  ClearParseError();
  ClearExtractedCodeBlocks();
  clearColumnStyleCache();
};

// Parse-only caches — never read during render; safe to drop post-parse.
const dropParseCaches = () => {
  ClearSubTableLists();
  ClearSubMathLists();
  ClearDiagboxTable();
  ClearExtractedCodeBlocks();
  clearColumnStyleCache();
};

export default (md: MarkdownIt, options) => {
  clearTabularState();
  Object.assign(md.options, options);
  const resetTabularHook = (state) => {
    const isPartial = state.md.options.renderElement
      && state.md.options.renderElement.hasOwnProperty('startLine');
    if (!isPartial) {
      clearTabularState();
    }
  };
  const hasHook = typeof md.core.ruler.__find__ === 'function'
    && md.core.ruler.__find__('reset_tabular_state') >= 0;
  if (hasHook) {
    md.core.ruler.at('reset_tabular_state', resetTabularHook);
  } else {
    md.core.ruler.before('normalize', 'reset_tabular_state', resetTabularHook);
  }
  const cleanupHook = (state) => {
    const isPartial = state.md.options.renderElement
      && state.md.options.renderElement.hasOwnProperty('startLine');
    if (!isPartial) {
      dropParseCaches();
    }
  };
  const hasCleanupHook = typeof md.core.ruler.__find__ === 'function'
    && md.core.ruler.__find__('cleanup_tabular_state') >= 0;
  if (hasCleanupHook) {
    md.core.ruler.at('cleanup_tabular_state', cleanupHook);
  } else {
    md.core.ruler.push('cleanup_tabular_state', cleanupHook);
  }
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
    return IncludeGraphics(tokens, idx, options, env, slf);
  }

}

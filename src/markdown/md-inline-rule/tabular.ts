import { RuleInline } from 'markdown-it';
import {parseInlineTabular, TTokenTabular, inlineDecimalParse} from "../md-block-rule/begin-tabular";
import { ParseTabular } from "../md-block-rule/begin-tabular/parse-tabular";
import { findFirstTagContentWithNesting } from "../utils";
import {
  BEGIN_TABULAR_INLINE_RE,
  END_TABULAR_INLINE_RE,
  openTagTabular
} from "../common/consts";

export const inlineTabular: RuleInline = (state, silent) => {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
    return false;
  }
  const src = state.src.slice(startMathPos);
  const match = src
    .match(openTagTabular);
  if (!match) {
    return false;
  }
  const { block } = findFirstTagContentWithNesting(src, BEGIN_TABULAR_INLINE_RE, END_TABULAR_INLINE_RE);
  if (!block) {
    // there is no complete block
    return false;
  }
  const fullBlock: string = src.slice(block.open.posStart, block.close.posEnd);
  const nextPos = startMathPos + block.close.posEnd;
  if (!silent) {
    const token = state.push("tabular_inline", "", 0);
    token.content = fullBlock;
    token.children =[];
    const cTabular =  parseInlineTabular(token.content);
    if (!cTabular) {
      return false
    }
    for (let i = 0; i < cTabular.length; i++) {
      if (cTabular[i].type === 'inline'){continue}
      const res: Array<TTokenTabular> | null = ParseTabular(cTabular[i].content, 0, cTabular[i].align, state.md.options, state.env.subTabular);

      for (let j = 0; j < res.length;  j++) {
        let tok = res[j];
        if (tok.token === 'table_open' && state.md.options?.forDocx ) {
          tok.attrs.push(['data-type', 'subtable'])
        }
        if (tok.token === 'inline') {
          let children = [];
          if (state.env.tabulare) {
            state.md.inline.parse(tok.content, state.md, state.env, children);
          } else {
            state.env.tabulare = state.md.options.outMath.include_tsv
              || state.md.options.outMath.include_csv
              || (state.md.options.outMath.include_table_markdown
                && state.md.options.outMath.table_markdown && state.md.options.outMath.table_markdown.math_as_ascii)
            ;
            state.md.inline.parse(tok.content, state.md, state.env, children);
            state.env.tabulare = false;
          }
          tok.children = children;
        } else {
          if (res[j].token === 'inline_decimal') {
            tok = inlineDecimalParse(tok);
          }
        }
        token.children.push(tok);
      }
    }
  }
  state.pos = nextPos;
  return true;
};

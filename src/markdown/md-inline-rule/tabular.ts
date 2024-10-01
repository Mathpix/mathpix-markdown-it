import { RuleInline } from 'markdown-it';
import {parseInlineTabular, TTokenTabular, inlineDecimalParse} from "../md-block-rule/begin-tabular";
import { ParseTabular } from "../md-block-rule/begin-tabular/parse-tabular";

export const inlineTabular: RuleInline = (state, silent) => {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startMathPos)
    .match(/^(?:begin\s{0,}{tabular})/);
  if (!match) {
    return false;
  }
  const endMarker= '\\end{tabular}';
  let endMarkerPos = state.src
          .slice(startMathPos)
          .lastIndexOf(endMarker);
  if (endMarkerPos === -1) {
    return false;
  }
  endMarkerPos += startMathPos;
  const nextPos = endMarkerPos + endMarker.length;
  if (!silent) {
    const token = state.push("tabular_inline", "", 0);
    token.content = state.src.slice(startMathPos-1, endMarkerPos + '\\end{tabular}'.length);
    token.children =[];
    const cTabular =  parseInlineTabular(token.content);
    if (!cTabular) {
      return false
    }
    for (let i = 0; i < cTabular.length; i++) {
      if (cTabular[i].type === 'inline'){continue}
      const res: Array<TTokenTabular> | null = ParseTabular(cTabular[i].content, 0, cTabular[i].align, state.md.options);

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

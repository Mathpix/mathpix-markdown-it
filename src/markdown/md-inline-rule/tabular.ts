import {parseInlineTabular, TTokenTabular, inlineDecimalParse} from "../md-block-rule/begin-tabular";
import { ParseTabular } from "../md-block-rule/begin-tabular/parse-tabular";
import { MergeIneerTsvToTsv, getTsv, clearTsv, TsvJoin} from "../common/tsv";

export const inlineTabular = (state, silent) => {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startMathPos)
    .match(/^(?:|begin\s{0,}{tabular})/);
  if (!match) {
    return false;
  }
  startMathPos += match[0].length;
  const endMarker= '\\end{tabular}';
  const endMarkerPos = state.src.lastIndexOf(endMarker);
  if (endMarkerPos === -1) {
    return false;
  }
  const nextPos = endMarkerPos + endMarker.length;
  if (!silent) {
    const token = state.push("tabular_inline", "", 0);
    token.content = state.src.slice(startMathPos-1, endMarkerPos + '\\end{tabular}'.length);
    token.children =[];
    const cTabular =  parseInlineTabular(token.content);
    if (!cTabular) {
      return false
    }
    const res_tsv = [].concat(getTsv());
    for (let i = 0; i < cTabular.length; i++) {
      if (cTabular[i].type === 'inline'){continue}
      clearTsv();
      const res: Array<TTokenTabular> | null = ParseTabular(cTabular[i].content, 0, cTabular[i].align);
      let tsv = [].concat(getTsv());

      for (let j = 0; j < res.length;  j++) {
        let tok = res[j];
        if (tok.token === 'inline') {
          let children = [];
          state.md.inline.parse(tok.content, state.md, state.env, children);
          tok.children = children;
          if (res[j].id && tsv.length > 0) {
            tsv = MergeIneerTsvToTsv(tsv, tsv, res[j].id, children);
            token.tsv = TsvJoin(tsv, state.md.options);
            token.tsvList = tsv;
          } else {
            token.tsv = TsvJoin(tsv, state.md.options);
            token.tsvList = tsv;
          }
        } else {
          if (res[j].token === 'inline_decimal') {
            tok = inlineDecimalParse(tok);
          }
        }
        token.children.push(tok);
      }
      res_tsv.push(tsv);
      tsv = [];
    }
  }
  state.pos = nextPos;
  return true;
};

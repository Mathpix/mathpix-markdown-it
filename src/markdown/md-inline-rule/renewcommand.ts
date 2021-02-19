import { RuleInline } from 'markdown-it';
import {parseOneCommand} from "../md-block-rule/renewcommand";


export const reNewCommandInLine: RuleInline = (state, silent) => {
  let match: RegExpExecArray;
  let startMathPos: number = state.pos;

  const reItem: RegExp = /^(?:renewcommand)/;

  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */ ) {
    return false;
  }
  if (silent) {
    return false;
  }

  startMathPos += 1;

  match = state.src
    .slice(startMathPos)
    .match(reItem);
  if (!match){ return false}

  const endPos = parseOneCommand(state, state.src.slice(startMathPos + match[0].length));
  if (state.md.options && state.md.options.forLatex) {
    let token = state.push("renewcommand", "", 0);
    token.latex = state.src.slice(startMathPos + match[0].length)
      .trim();
  }
  state.pos = startMathPos + match[0].length + endPos + 1;
  return true;
};

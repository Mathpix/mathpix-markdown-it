import { RuleInline } from 'markdown-it';
import {parseOneCommand, startsCommandAt} from "../md-block-rule/renewcommand";
import { renewCommandSpanEnd, buildInlineCodePositionSet, getInlineCodeListFromString } from "../common";
import { srcValueCached } from "../common/src-pos-cache";

const NAME: string = 'renewcommand';
// One index per source, or a paragraph of commands paid for its whole length on each.
const CODE_POSITIONS: symbol = Symbol('renewcommand-code-positions');
const codeIndexOf = (state): Set<number> =>
  srcValueCached(state, CODE_POSITIONS,
    (src: string) => buildInlineCodePositionSet(getInlineCodeListFromString(src)));

export const reNewCommandInLine: RuleInline = (state, silent) => {
  let startMathPos: number = state.pos;

  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */ ) {
    return false;
  }
  if (silent) {
    return false;
  }

  startMathPos += 1;

  // The name ends here, or `\renewcommandfoo` was taken and its arguments half-eaten.
  if (!startsCommandAt(state.src, state.pos)) {
    return false;
  }
  const endPos = parseOneCommand(state, state.src.slice(startMathPos + NAME.length));
  let end: number = startMathPos + NAME.length + endPos + 1;
  // Arguments not closing: the body ran to the end of the source and dropped every line after it.
  if (renewCommandSpanEnd(state.src, state.pos, codeIndexOf(state)) <= 0) {
    const lineEnd: number = state.src.indexOf('\n', state.pos);
    end = Math.min(end, state.posMax, lineEnd < 0 ? state.posMax : lineEnd);
  }
  if (state.md.options && state.md.options.forLatex) {
    let token = state.push("renewcommand", "", 0);
    // Without the name and to the end of the source: the converter reads this shape.
    token.latex = state.src.slice(startMathPos + NAME.length).trim();
  }
  state.pos = end;
  return true;
};

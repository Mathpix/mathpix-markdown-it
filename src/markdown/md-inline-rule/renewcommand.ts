import { RuleInline } from 'markdown-it';
import {parseOneCommand, parseOneCommandWithin, startsCommandAt} from "../md-block-rule/renewcommand";
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
  const bodyStart: number = startMathPos + NAME.length;
  const body: string = state.src.slice(bodyStart);
  // Arguments not closing end the command with its line, so the body is read no further.
  const lineEnd: number = renewCommandSpanEnd(state.src, state.pos, codeIndexOf(state)) <= 0
    ? state.src.indexOf('\n', state.pos)
    : -1;
  const endPos: number = lineEnd < 0
    ? parseOneCommand(state, body)
    : parseOneCommandWithin(state, body, lineEnd - bodyStart);
  let end: number = bodyStart + endPos + 1;
  if (lineEnd >= 0) {
    end = Math.min(end, lineEnd);
  }
  // `parseOneCommand` reads to the end of `src`, which is past `posMax` inside a link label or an
  // option: `state.pos` beyond it is what dropped the rest of the document above.
  end = Math.min(end, state.posMax);
  if (state.md.options && state.md.options.forLatex) {
    let token = state.push("renewcommand", "", 0);
    // Without the name and to the end of the source: the converter reads this shape.
    token.latex = body.trim();
  }
  state.pos = end;
  return true;
};

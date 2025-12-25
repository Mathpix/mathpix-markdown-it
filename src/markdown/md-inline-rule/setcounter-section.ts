import { RuleInline } from 'markdown-it';
import { reSetCounter, reNumber } from "../common/consts";
import { setTextCounterSection } from "../mdPluginText";

/** `\setcounter{section}{number}` 
 * Sets count for `section` to contain the value number.
 * *Note:* number can be positive or negative.
 * */
export const setCounterSection: RuleInline = (state, silent) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let envName: string = "";
  let numStr: string = "";
  let nextPos: number = startPos;
  let content: string = "";
  let match: RegExpMatchArray = state.src
    .slice(startPos)
    .match(reSetCounter);

  if (!match) {
    return false;
  }
  content = match[0];
  nextPos += match[0].length;
  if (!silent) {
    envName = match.groups?.name ? match.groups.name : match[1];
    if (!envName || !["section", "subsection", "subsubsection"].includes(envName)) {
      return false;
    }
    numStr = match.groups?.number ? match.groups.number : match[2];
    numStr = numStr ? numStr.trim() : '';
    const num = numStr && reNumber.test(numStr)
      ? Number(match[2].trim()) : 0;
    setTextCounterSection(envName, num);
    const token = state.push("section_setcounter", "", 0);
    token.content = "";
    token.children = [];
    token.hidden = true;
    token.inlinePos = {
      start: state.pos,
      end: nextPos
    };
    if (state.md.options.forLatex) {
      token.latex = content;
      token.hidden = false;
    }
  }
  state.pos = nextPos;
  return true;
};

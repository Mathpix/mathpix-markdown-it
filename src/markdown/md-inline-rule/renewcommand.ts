import { RuleInline } from 'markdown-it';
import {SetItemizeLevelTokens,
  enumerateLevel,
  itemizeLevel,
  AvailableStyles,
  LevelsEnum,
  LevelsItem
} from "../md-block-rule/lists/re-level";


export const reNewCommand: RuleInline = (state, silent) => {
  let match: RegExpExecArray;
  let startMathPos: number = state.pos;

  const reItem: RegExp = /^(?:renewcommand\s{0,}\{(\\labelenumi|\\labelenumii|\\labelenumiii|\\labelenumiv|\\labelitemi|\\labelitemii\\labelitemiii\\labelitemiv)\})/;

  const reEnum: RegExp = /(?:\\alph|\\Alph|\\arabic|\\roman|\\Roman\s{0,}\{(enumi|enumii|enumiii|enumiv)\})/;
  const reEnumL: RegExp = /^(?:alph|Alph|arabic|roman|Roman)/;

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
  if (!match[1] ){ return false}

  let indexLevel = LevelsEnum.indexOf(match[1].replace(/\\/g,'').trim())
  let isEnum = false;

  if (indexLevel === -1) {
    indexLevel = LevelsItem.indexOf(match[1].replace(/\\/g,'').trim())
    if (indexLevel === -1) { return false; }
  } else {
    isEnum = true;
  }

  let str = state.src.slice(startMathPos + match[0].length).trim();
  if (str[0] === '{') {
    if (isEnum) {
      const matchL = str.match(reEnum);
      if (matchL) {
        const matchE = matchL[0].slice(1).match(reEnumL);
        if (matchE) {
          const newStyle =  AvailableStyles[matchE[0]];
          enumerateLevel[indexLevel] = newStyle;
        }
      }
    } else {
      if (str[1] === '$') {

      } else {
        let iEnd = str.indexOf('}', 1);
        if (iEnd > -1) {
          let content = str.slice(1, iEnd);
          itemizeLevel[indexLevel] = content;
          SetItemizeLevelTokens(state);
          state.pos = startMathPos + match[0].length + iEnd + 1;
          return true
        }
      }
    }
  }
  return true
};

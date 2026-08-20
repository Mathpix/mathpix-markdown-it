import { RuleBlock } from 'markdown-it';
import { ChangeLevel } from "../md-latex-lists-env/re-level";
const reTag: RegExp = /\\renewcommand/;
const reTagG: RegExp = /\\renewcommand/g;

const parseCommand = (str: string):{command: string, params: string, endPos: number}  => {
  let command = '';
  let params = '';
  let s = '';
  let isOpen = 0;
  let endPos = str.length;

  // Space is skipped, not trimmed, so offsets stay in the coordinates of the string passed in.
  // `*` is not part of the name.
  let start = 0;
  while (start < str.length && (str[start] === ' ' || str[start] === '\t')) {
    start++;
  }
  if (str[start] === '*') {
    start++;
  }
  for (let i = start; i < str.length; i++) {
    if (!command && (str[i] === '{' || str.charCodeAt(i) === 0x5c /* \ */ || str[i] === '}' )) {
      if (s && s.trim().length > 0) {
        command = s;
        s = '';
        // `\renewcommand\x{a{b}c}`: this brace opens the body — uncounted, the first inner `}` ended it.
        if (str[i] === '{') {
          isOpen++;
        }
      }
      continue;
    }
    // `\renewcommand{\x}[1]{Z}`: the optional argument is not part of the body. Space between the two is
    // legal, so `s` may hold it — dropped with the argument, or the `{` after it read as body text.
    if (command && !s.trim() && !isOpen && str[i] === '[') {
      const close: number = str.indexOf(']', i);
      if (close > 0) {
        i = close;
        s = '';
        continue;
      }
    }
    if (command) {
      if (str[i] === '{' ) {
        isOpen++;
        if (!s) {
          continue;
        }
      }
      if (str[i] === '}') {
        isOpen--;
        if ( isOpen <= 0) {
          params = s;
          endPos = i;
          break;
        }
      }
    }
    s += str[i];
  }
  if (!params) {
    params = s;
  }
  return { command: command.trim(), params: params.trim(), endPos: endPos }
};

export const parseOneCommand = (state, str) => {
  const data = parseCommand(str);
  ChangeLevel(state, data);
  return data.endPos
};

export const reNewCommand = (state, lineText: string) => {
  if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
    return;
  }
  let match = lineText.match(reTagG);
  if (!match) {
    return
  }
  const arr = lineText.split(reTag);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].trim().length === 0) {
      continue
    }
    const str = arr[i];
    parseOneCommand(state, str);
  }
};

export const ReNewCommand:RuleBlock = (state, startLine: number) => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let nextLine: number = startLine + 1;

  let lineText: string = state.src.slice(pos, max);

  let match = lineText.match(reTag);
  if (!match) {
    return false
  }
  if (match.index > 0) {
    const strBefor = lineText.slice(0, match.index);
    if (strBefor.trim().length > 0) {
      return false;
    }
  }
  reNewCommand(state, lineText.slice(match.index).trim());
  if (state.md.options && state.md.options.forLatex) {
    let token = state.push("renewcommand", "", 0);
    token.latex = lineText.slice(match.index).trim();
  }
  state.line = nextLine;
  return true

};

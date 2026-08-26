import { RuleBlock } from 'markdown-it';
import { ChangeLevel } from "../md-latex-lists-env/re-level";
import { skipOptionalArg, renewCommandSpanEnd, buildInlineCodePositionSet,
  getInlineCodeListFromString, isAsciiLetter } from "../common";
const reTag: RegExp = /\\renewcommand/;
const reTagG: RegExp = /\\renewcommand/g;
const TAG: string = '\\renewcommand';
// Sticky, so it carries a lastIndex — set it before every `exec`.
const BLANKS_STICKY_RE: RegExp = /\s*/y;

/** Does a `\renewcommand` start at `at`? With the `\b` the span reader requires: the two disagreeing
 *  on `\renewcommandfoo` cost the line its text. */
export const startsCommandAt = (text: string, at: number): boolean => {
  if (!text.startsWith(TAG, at)) {
    return false;
  }
  const next: number = text.charCodeAt(at + TAG.length);
  return !isAsciiLetter(next) && !(next >= 0x30 && next <= 0x39) && next !== 0x5f /* _ */;
};

/** First non-blank at or after `from`, or -1 when only blanks follow. No slice: this runs per command. */
const skipBlanksFrom = (text: string, from: number): number => {
  BLANKS_STICKY_RE.lastIndex = from;
  BLANKS_STICKY_RE.exec(text);
  const at: number = BLANKS_STICKY_RE.lastIndex;
  return at < text.length ? at : -1;
};

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
      const past: number = skipOptionalArg(str, i, true);
      if (past > 0) {
        i = past - 1;
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

/** Where the text after every `\renewcommand` begins, or the line's length when they are all it holds.
 *  One code-span index for the whole line: built per command it cost 1215ms on 8000 of them against 3. */
const tailStartOnLine = (lineText: string, from: number): number => {
  const codeIndex: Set<number> = buildInlineCodePositionSet(getInlineCodeListFromString(lineText));
  let at: number = from;
  while (startsCommandAt(lineText, at)) {
    const span: number = renewCommandSpanEnd(lineText, at, codeIndex);
    // Arguments not closing on the line: the rest of it is the body, as this rule always read it.
    if (span <= 0) {
      return lineText.length;
    }
    at = span;
    const blank: number = skipBlanksFrom(lineText, at);
    if (blank < 0) {
      return lineText.length;
    }
    at = blank;
  }
  return at;
};

export const ReNewCommand:RuleBlock = (state, startLine: number, endLine: number, silent: boolean) => {
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
  // Same verdict, no macro: it writes marker state no rollback covers.
  if (silent) {
    return tailStartOnLine(lineText, match.index) >= lineText.length;
  }
  // Applied before the tail is read, and the rule declines after: a later list reads the marker this
  // set, as on 3.0.1.
  reNewCommand(state, lineText.slice(match.index).trim());
  // The line is not ours when something shares it: this rule renders to nothing, so claiming the line
  // dropped that text. The paragraph takes it, inline reads the command there.
  if (tailStartOnLine(lineText, match.index) < lineText.length) {
    return false;
  }
  if (state.md.options && state.md.options.forLatex) {
    let token = state.push("renewcommand", "", 0);
    token.latex = lineText.slice(match.index).trim();
  }
  state.line = nextLine;
  return true

};

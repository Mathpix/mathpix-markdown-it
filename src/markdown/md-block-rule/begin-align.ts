import { RuleBlock, Token } from 'markdown-it';
import {StatePushDiv, StatePushTabularBlock} from "./begin-tabular";
import { StatePushIncludeGraphics } from "../md-inline-rule/includegraphics";

export const openTag: RegExp = /\\begin\s{0,}\{(center|left|right)\}/;
const openCloseTag: RegExp = /\\begin\s{0,}\{(center|left|right)\}\s{0,}([\s\S]*?)\s{0,}\\end\s{0,}\{(center|left|right)\}/;
const endTag = (arg:string='center'): RegExp  => { return new RegExp('\\end\s{0,}\{(' + arg + ')\}')};

export const SeparateInlineBlocksBeginAlign = (state, startLine: number, nextLine: number, content: string, align: string): any[] => {
  let res = [];
  const match = content.match(openCloseTag);
  if (match) {
    if (match.index > 0) {
      res.push({content: content.slice(0, match.index), align: align});
    }
    res.push({content: match[2], align: match[1]});
    content = content.slice(match.index + match[0].length);
    res = res.concat(SeparateInlineBlocksBeginAlign(state, startLine, nextLine, content, align));
  } else {
    res.push({content: content, align: align});
  }
  return res;
};


const InlineBlockBeginAlign: RuleBlock = (state, startLine) => {
  let token: Token;

  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];

  let lineText: string = state.src.slice(pos, max);


  const match: RegExpMatchArray = lineText.match(openTag);
  if (!match) {
    return false;
  }

  let align = match[1];
  let closeTag = endTag(align);
  let pB = match.index + match[0].length;

  let matchE: RegExpMatchArray = lineText.match(closeTag);
  let pE = matchE ? matchE.index: 0;
  //const dopDiv: string =  matchE ? lineText.slice(matchE.index + matchE[0].length) : '';

  token = state.push('paragraph_open', 'div', 1);
  token.attrs = [
    [ 'class', 'center' ],
    [ 'style', `text-align: ${align ? align : 'center'}`]
  ];
  if (state.md.options.forLatex) {
    if (align && ['left', 'right'].includes(align)) {
      token.latex = `\\begin{flush${align}}`;
    } else {
      token.latex = `\\begin{${align ? align : 'center'}}`
    }
  }
  token.map    = [startLine, startLine + 1];
  if (pB > 0) {
    state.tShift[startLine] = pB;
  }
  if (pE > 0) {
    state.eMarks[startLine] = state.eMarks[startLine] - (lineText.length - pE+1);
  }


  state.parentType = 'paragraph';
  state.env.align = align;

  const content = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine]);
  if (!StatePushTabularBlock(state, startLine, startLine+1, content, align)) {
    if (!StatePushIncludeGraphics(state, startLine, startLine+1, content, align)) {
      StatePushDiv(state, startLine, startLine+1, content);
    }
  }
  token = state.push('paragraph_close', 'div', -1);
  if (state.md.options.forLatex) {
    if (align && ['left', 'right'].includes(align)) {
      token.latex = `\\end{flush${align}}`;
    } else {
      token.latex = `\\end{${align ? align : 'center'}}`
    }
  }

  state.line = startLine+1;
  return true;
};

export const BeginAlign: RuleBlock = (state, startLine, endLine) => {
  let token: Token;

  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];

  let nextLine: number = startLine + 1;
  let lineText: string = state.src.slice(pos, max);
  if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
    return false;
  }
  let resText: string = '';

  let isCloseTagExist = false;

  const match: RegExpMatchArray = lineText.match(openTag);
  if (!match) {
    return false;
  }

  let align = match[1];
  let closeTag = endTag(align);
  let  pB = 0;

  if (closeTag.test(lineText)) {
    if (InlineBlockBeginAlign(state, startLine)) {
      return true;
    }
  }

  if (match.index + match[0].length < lineText.trim().length) {
    pB = match.index + match[0].length;
    resText = lineText.slice(match.index + match[0].length)
  }

  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);

    if (closeTag.test(lineText)) {
      isCloseTagExist = true;
      lineText += '\n';
      break
      //if (state.isEmpty(nextLine+1)) { break }
    }

    if (resText && lineText) {
      resText += '\n' + lineText;
    } else {
      resText += lineText;
    }


    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }
  }

  if (!isCloseTagExist) {
    return false;
  }

  let matchE = lineText.match(closeTag);
  let pE = 0;
  //let pE = matchE ? matchE.index: 0;
  if (matchE) {
    resText += lineText.slice(0, matchE.index-1);
    pE = matchE.index
  }

  token = state.push('paragraph_open', 'div', 1);
  token.attrs = [
    [ 'class', 'center' ],
    [ 'style', `text-align: ${align ? align : 'center'}`]
  ];
  if (state.md.options.forLatex) {
    if (align && ['left', 'right'].includes(align)) {
      token.latex = `\\begin{flush${align}}`;
    } else {
      token.latex = `\\begin{${align ? align : 'center'}}`
    }
  }
  token.map    = [startLine, (pE > 0) ? nextLine : nextLine + 1];

  if (pB > 0) {
    state.tShift[startLine] = pB;
  } else {
    startLine += 1;
  }
  if (pE > 0) {
    state.eMarks[nextLine] = state.eMarks[nextLine] - (lineText.length - pE + 1);
  } else {
    nextLine += 1;
  }

  state.parentType = 'paragraph';
  state.env.align = align;

  const content = resText.trim();
  if (!StatePushTabularBlock(state, startLine, nextLine, content, align)) {
    if (!StatePushIncludeGraphics(state, startLine, nextLine, content, align)) {
      StatePushDiv(state, startLine, nextLine, content);
    }
  }

  token = state.push('paragraph_close', 'div', -1);
  if (state.md.options.forLatex) {
    if (align && ['left', 'right'].includes(align)) {
      token.latex = `\\end{flush${align}}`;
    } else {
      token.latex = `\\end{${align ? align : 'center'}}`
    }
  }
  state.line = nextLine;
  return true;
};

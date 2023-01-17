import { RuleBlock, Token } from 'markdown-it';
import { openTag as openTagTabular, StatePushTabularBlock, StatePushDiv } from './begin-tabular';
import { StatePushIncludeGraphics } from '../md-inline-rule/includegraphics';
import { openTag as openTagAlign, SeparateInlineBlocksBeginAlign } from './begin-align';
import { endTag, uid } from '../utils';
import {includegraphicsTag} from '../md-inline-rule/utils';

var couterTables = 0;
var couterFigures = 0;
export const openTag: RegExp = /\\begin\s{0,}\{(table|figure)\}/;
export const openTagH: RegExp = /\\begin\s{0,}\{(table|figure)\}\s{0,}\[(H|\!H|H\!|h|\!h|h\!|t|\!t|b|\!b|p|\!p)\]/;
const captionTag: RegExp = /\\caption\s{0,}\{([^}]*)\}/;
const captionTagG: RegExp = /\s{0,}\\caption\s{0,}\{([^}]*)\}\s{0,}/g;
const alignTagG: RegExp = /\\centering/g;
const alignTagIncludeGraphicsG: RegExp = /\\includegraphics\[((.*)(center|left|right))\]\s{0,}\{([^{}]*)\}/g;

enum TBegin {table = 'table', figure = 'figure'};

export const ClearTableNumbers = () => {
  couterTables = 0;
};

export const ClearFigureNumbers = () => {
  couterFigures = 0;
};

const StatePushCaptionTable = (state, type: string): void => {
  let caption = state.env.caption;
  if (!caption) return;

  let token: Token;
  const num: number = type === TBegin.table ? couterTables : couterFigures;
  token = state.push('caption_table', '', 0);
  token.attrs = [[`${type}-number`, num], ['class', `caption_${type}`]];
  token.children = [];
  token.content = state.md?.options?.nonumbers
    ? `${type[0].toUpperCase()}${type.slice(1)}: ` + caption
    : `${type[0].toUpperCase()}${type.slice(1)} ${num}: ` + caption;
  if (state.md.options.forLatex) {
    token.latex = caption;
  }
};

const StatePushPatagraphOpenTable = (state, startLine: number, nextLine: number, type: string, latex?:string, hasAlignTagG = false) => {
  let token: Token;
  let align = state.env.align;
  let caption = state.env.caption;
  let currentNumber: number = 0 ;
  token = state.push('paragraph_open', 'div', 1);
  if (state.md.options.forLatex) {
    token.latex = latex;
  }
  if (!caption) {
    token.attrs = [['class', 'table ']];
  } else {
    if (type === TBegin.table) {
      couterTables += 1;
      currentNumber = couterTables;
    } else {
      couterFigures += 1;
      currentNumber = couterFigures;
    }
    token.attrs = [['class', 'table'],
      ['number', currentNumber.toString()]];
  }
  state.env.number = currentNumber;
  state.env.type = type;
  token.uuid = uid();
  token.currentTag = {
    type: type,
    number: currentNumber,
    tokenUuidInParentBlock: token.uuid
  };
  
  if (align) {
    token.attrs.push(['style', `text-align: ${align}`]);
    if (!hasAlignTagG && state.md.options.forLatex) {
      if (type === TBegin.table && state.md.options.centerTables) {
        token.attrSet('data-type', 'table');
        token.attrSet('data-align', align);
      }
      if (type === TBegin.figure && state.md.options.centerImages) {
        token.attrSet('data-type', 'figure');
        token.attrSet('data-align', align);
      }
    }
  }
  
  token.map    = [startLine, nextLine];
};

const StatePushContent = (state, startLine: number, nextLine: number, content: string, align: string, type: string) => {
  if (type === TBegin.table) {
    if (!StatePushTabularBlock(state, startLine, nextLine, content, align)) {
      StatePushDiv(state, startLine, nextLine, content);
    }
  } else {
    if (!StatePushIncludeGraphics(state, startLine, nextLine, content, align)) {
      StatePushDiv(state, startLine, nextLine, content);
    }
  }
};

const StatePushTableContent = (state, startLine: number, nextLine: number, content: string, align: string, type: string) => {
  if (openTagAlign.test(content)) {
    const matchT = content.match(openTagTabular);
    const matchA = content.match(openTagAlign);
    if (matchT && matchT.index < matchA.index) {
      StatePushContent(state, startLine, nextLine, content, align, type);
      return;
    }
    let res = SeparateInlineBlocksBeginAlign(state, startLine, nextLine, content, align);
    if (res && res.length > 0) {
      for (let i=0; i < res.length; i++) {
        StatePushContent(state, startLine, nextLine, res[i].content, res[i].align, type);
      }
    } else {
      StatePushContent(state, startLine, nextLine, content, align, type);
    }
  } else {
    StatePushContent(state, startLine, nextLine, content, align, type);
  }
};

const InlineBlockBeginTable: RuleBlock = (state, startLine) => {
  let caption: string;
  let captionFirst: boolean = false;
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let lineText: string = state.src.slice(pos, max);
  let token;

  let match: RegExpMatchArray = lineText.match(openTagH);
  if (!match) {
    match = lineText.match(openTag);
  }
  if (!match) {
    return false;
  }
  const type: string = match[1].trim() in TBegin ? match[1].trim() : null;
  if (!type) {
    return false;
  }
  const closeTag = endTag(type);

  let matchE: RegExpMatchArray = lineText.match(closeTag);
  if (!matchE) {
    return false;
  }
  let align = (state.md.options.centerTables && type === TBegin.table) 
    || (state.md.options.centerImages && type === TBegin.figure)
      ? 'center' : '';
  let content = lineText.slice(match.index + match[0].length, matchE.index);
  let hasAlignTagG = alignTagG.test(content);
  const hasAlignTagIncludeGraphicsG = type === TBegin.figure
    ? Boolean(content.match(alignTagIncludeGraphicsG)) : false;
  content = content.replace(alignTagG,'');
  matchE = content.match(captionTag);
  if (matchE) {
    caption = matchE[1];
    let matchT: RegExpMatchArray;
    if (type === TBegin.table) {
      matchT = lineText.match(openTagTabular);
    } else {
      matchT = lineText.match(includegraphicsTag);
    }
    if (matchT && matchE.index < matchT.index) {
      captionFirst = true;
    }
    content = content.replace(captionTagG, '')
  }
  state.parentType = 'paragraph';
  state.env.caption = caption;
  const contentAlign = align ? align
    : hasAlignTagG ? 'center' : '';
  state.env.align = contentAlign;
  let latex = match[1] === 'figure' || match[1] === 'table'
    ? `\\begin{${match[1]}}[h]`
    : match[0];
  StatePushPatagraphOpenTable(state, startLine, startLine+1, type, latex, hasAlignTagG || hasAlignTagIncludeGraphicsG);
  if (state.md.options.forLatex && hasAlignTagG) {
    token = state.push('latex_align', '', 0);
    token.latex = '\\centering';
  }
  if (captionFirst) {
    StatePushCaptionTable(state, type);
  }

  StatePushTableContent(state, startLine, startLine + 1, content, contentAlign, type);

  if (!captionFirst) {
    StatePushCaptionTable(state, type);
  }
  token = state.push('paragraph_close', 'div', -1);
  token.currentTag = state.env.lastTag ? state.env.lastTag : {};
  if (state.md.options.forLatex && match && match[1]) {
    token.latex = `\\end{${match[1]}}`
  }
  if (!hasAlignTagG && !hasAlignTagIncludeGraphicsG && state.md.options.forLatex) {
    if (type === TBegin.table && state.md.options.centerTables) {
      token.attrSet('data-type', 'table');
      token.attrSet('data-align', align);
    }
    if (type === TBegin.figure && state.md.options.centerImages) {
      token.attrSet('data-type', 'figure');
      token.attrSet('data-align', align);
    }
  }
  state.line = startLine+1;
  return true;
};

export const BeginTable: RuleBlock = (state, startLine, endLine) => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let token;

  let nextLine: number = startLine + 1;
  let lineText: string = state.src.slice(pos, max);

  if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
    return false;
  }

  let content: string = '';
  let resText: string = '';
  let isCloseTagExist = false;
  let startTabular = 0;
  let match:RegExpMatchArray = lineText.match(openTagH);
  if (!match) {
    match = lineText.match(openTag);
  }
  if (!match) {
    return false;
  }

  const type: string = match[1].trim() in TBegin ? match[1].trim() : null;
  if (!type) {
    return false;
  }
  const closeTag = endTag(type);
  if (closeTag.test(lineText)) {
    if (InlineBlockBeginTable(state, startLine)) {
      return true;
    }
  }
  let align = (state.md.options.centerTables && type === TBegin.table)
    || (state.md.options.centerImages && type === TBegin.figure) ? 'center' : '';
  
  let caption: string;
  let captionFirst: boolean = false;

  let pB = 0;
  let pE = 0;

  if (match.index + match[0].length < lineText.trim().length) {
    pB = match.index + match[0].length;
    startTabular = startLine;
    resText = lineText.slice(match.index + match[0].length)
  } else {
    startTabular = startLine + 1;
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

  let matchE: RegExpMatchArray = lineText.match(closeTag);
  if (matchE) {
    resText += lineText.slice(0, matchE.index);
    pE = matchE.index
  }
  let hasAlignTagG = alignTagG.test(resText);
  content = resText.replace(alignTagG,'');
  const hasAlignTagIncludeGraphicsG = type === TBegin.figure 
    ? Boolean(content.match(alignTagIncludeGraphicsG)) : false;
  
  matchE = content.match(captionTag);
  if (matchE) {
    caption = matchE[1];
    let matchT: RegExpMatchArray;
    if (type === TBegin.table) {
       matchT = content.match(openTagTabular);
    } else {
       matchT = content.match(includegraphicsTag);
    }
    if (matchT && matchE.index < matchT.index) {
      captionFirst = true;
    }
    content = content.replace(captionTagG, '')
  }

  state.parentType = 'paragraph';
  state.env.caption = caption;
  const contentAlign = align ? align
    : hasAlignTagG ? 'center' : '';
  state.env.align = contentAlign;
  let latex = match[1] === 'figure' || match[1] === 'table'
    ? `\\begin{${match[1]}}[h]`
    : match[0];
  StatePushPatagraphOpenTable(state, startLine, (pE > 0) ? nextLine  : nextLine + 1, type, latex, 
    hasAlignTagG || hasAlignTagIncludeGraphicsG);
  if (state.md.options.forLatex && hasAlignTagG) {
    token = state.push('latex_align', '', 0);
    token.latex = '\\centering';
  }
  if (captionFirst) {
    StatePushCaptionTable(state, type);
  }
  if (pB > 0) {
    state.tShift[startTabular] = pB;
  }

  if (pE > 0) {
    state.eMarks[nextLine] = state.eMarks[nextLine]- (lineText.length - pE);
  } else {
    nextLine += 1;
  }
  content = content.trim();
  StatePushTableContent(state, startLine, nextLine, content, contentAlign, type);

  if (!captionFirst) {
    StatePushCaptionTable(state, type);
  }
  token = state.push('paragraph_close', 'div', -1);
  token.currentTag = state.env.lastTag ? state.env.lastTag : {};
  if (state.md.options.forLatex && match && match[1]) {
    token.latex = `\\end{${match[1]}}`
  }
  if (!hasAlignTagG && !hasAlignTagIncludeGraphicsG && state.md.options.forLatex) {
    if (type === TBegin.table && state.md.options.centerTables) {
      token.attrSet('data-type', 'table');
      token.attrSet('data-align', align);
    }
    if (type === TBegin.figure && state.md.options.centerImages) {
      token.attrSet('data-type', 'figure');
      token.attrSet('data-align', align);
    }
  }
  state.line = nextLine;
  return true;
};

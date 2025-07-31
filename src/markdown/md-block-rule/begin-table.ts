import { RuleBlock, Token } from 'markdown-it';
import { openTag as openTagTabular, StatePushTabularBlock, StatePushDiv } from './begin-tabular';
import { StatePushIncludeGraphics } from '../md-inline-rule/includegraphics';
import { openTag as openTagAlign, SeparateInlineBlocksBeginAlign } from './begin-align';
import { endTag, uid } from '../utils';
import {includegraphicsTag} from '../md-inline-rule/utils';
import { findEndMarker, removeCaptionsFromTableAndFigure, removeCaptionsSetupFromTableAndFigure } from "../common";

var couterTables = 0;
var couterFigures = 0;
export const openTag: RegExp = /\\begin\s{0,}\{(table|figure)\}/;
export const openTagH: RegExp = /\\begin\s{0,}\{(table|figure)\}\s{0,}\[(H|\!H|H\!|h|\!h|h\!|t|\!t|b|\!b|p|\!p)\]/;
const captionTag: RegExp = /\\caption\s{0,}\{([^}]*)\}/;
const captionTagG: RegExp = /\s{0,}\\caption\s{0,}\{([^}]*)\}\s{0,}/g;
const captionTagBegin: RegExp = /\\caption\s{0,}\{/;
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
  let captionPos = state.env.captionPos;
  let isLabelFormatEmpty = state.env.captionIsLabelFormatEmpty;
  if (!caption) return;

  let token: Token;
  const num: number = type === TBegin.table ? couterTables : couterFigures;
  token = state.push('caption_table', '', 0);
  token.attrs = [[`${type}-number`, num], ['class', `caption_${type}`]];
  token.children = [];
  if (captionPos?.hasOwnProperty('map')) {
    token.map = captionPos.map;
  }  
  if (captionPos?.hasOwnProperty('bMarks')) {
    token.bMarks = captionPos.bMarks;
    token.bMarksContent = captionPos.start_content > captionPos.start 
      ? captionPos.start_content - captionPos.start
      : captionPos.start_content;
    token.eMarksContent = token.bMarks + token.bMarksContent + captionPos.end_content - captionPos.start_content;
  }  
  if (captionPos?.hasOwnProperty('eMarks')) {
    token.eMarks = captionPos.eMarks;
  }
  token.captionPos = captionPos;
  token.content = caption;
  if (isLabelFormatEmpty) {
    token.print = '';
  } else {
    const capitalizedType: string = `${type[0].toUpperCase()}${type.slice(1)}`;
    token.print = state.md?.options?.nonumbers
      ? `${capitalizedType}: `
      : `${capitalizedType} ${num}: `;
  }
  token.caption = caption;
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
  token.parentType = 'table';
  token.align = align;
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
  if (state.md.options?.forPptx) {
    if (type === TBegin.table || type === TBegin.figure) {
      token.attrJoin("class", `latex-${type}`);
    }
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
    if (state.env.captionIsSingleLineCheck) {
      token.attrs.push(['style', `text-align: ${align}`]);
    }
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
  let captionPos: any = {};
  if (!state.md.options.forLatex) {
    matchE = content.match(captionTag);
    if (matchE) {
      caption = matchE[1];
      captionPos.start = pos + matchE.index;
      captionPos.end = captionPos.start + matchE[0].length;
      captionPos.start_content =  pos + lineText.indexOf(matchE[1]);
      captionPos.end_content = captionPos.start_content + matchE[1].length;
      captionPos.map = [startLine, startLine];
      captionPos.bMarks = matchE.index;
      captionPos.eMarks = matchE.index + matchE[0].length;
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
    const contentSetupData = removeCaptionsSetupFromTableAndFigure(content);
    content = contentSetupData.content;
    state.env.captionIsLabelFormatEmpty = contentSetupData.isLabelFormatEmpty;
    state.env.captionIsSingleLineCheck = contentSetupData.isSingleLineCheck;
  }
  state.parentType = 'paragraph';
  state.env.caption = caption;
  state.env.captionPos = captionPos;
  state.env.envType = type;
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
  if (captionFirst && !state.md.options.forLatex) {
    StatePushCaptionTable(state, type);
  }

  StatePushTableContent(state, startLine, startLine + 1, content, contentAlign, type);

  if (!captionFirst && !state.md.options.forLatex) {
    StatePushCaptionTable(state, type);
  }
  token = state.push('paragraph_close', 'div', -1);
  token.parentType = 'table';
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

export const BeginTable: RuleBlock = (state, startLine, endLine, silent) => {
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
  /** For validation mode we can terminate immediately */
  if (silent) {
    return true;
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
  let captionPos: any = {};
  let matchCaption = lineText.match(captionTag);
  if (matchCaption) {
    captionPos.start = pos + matchCaption.index;
    captionPos.end = captionPos.start + matchCaption[0].length;
    captionPos.start_content = pos + lineText.indexOf(matchCaption[1]);
    captionPos.end_content = captionPos.start_content + matchCaption[1].length;
    captionPos.map = [startLine, startLine];
    captionPos.bMarks = matchCaption.index;
    captionPos.eMarks = captionPos.bMarks + matchCaption[0].length;
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
    if (!matchCaption) {
      matchCaption = lineText.match(captionTag);
      let matchCaptionB = lineText.match(captionTagBegin);
      if (matchCaptionB) {
        let { res = false, nextPos = 0 } = findEndMarker(lineText, matchCaptionB.index + matchCaptionB[0].length - 1);
        if (res) {
          captionPos.start = pos + matchCaptionB.index;
          captionPos.end = pos + nextPos;
          captionPos.start_content =  pos + matchCaptionB.index + matchCaptionB[0].length;
          captionPos.end_content = pos + nextPos - 1;
          captionPos.map = [nextLine, nextLine];
          captionPos.bMarks = matchCaptionB.index;
          captionPos.eMarks = matchCaptionB.index + nextPos;
        }
      } else {
        if (matchCaption) {
          captionPos.start = pos + matchCaption.index;
          captionPos.end = captionPos.start + matchCaption[0].length;
          captionPos.start_content =  pos + lineText.indexOf(matchCaption[1]);
          captionPos.end_content = captionPos.start_content + matchCaption[1].length;
          captionPos.map = [nextLine, nextLine];
          captionPos.bMarks = matchCaption.index;
          captionPos.eMarks = matchCaption.index + matchCaption[0].length;
        }
      }
    }
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
  let matchAlignTagG = resText.match(alignTagG);
  const hasAlignTagG = Boolean(matchAlignTagG);
  content = state.md.options.forLatex 
    ? resText 
    : resText.replace(alignTagG,'');
  const hasAlignTagIncludeGraphicsG = type === TBegin.figure 
    ? Boolean(content.match(alignTagIncludeGraphicsG)) : false;
  
  if (!state.md.options.forLatex) {
    matchE = content.match(captionTag);
    let matchCaptionB = content.match(captionTagBegin);
    if (matchCaptionB) {
      let data = findEndMarker(content, matchCaptionB.index + matchCaptionB[0].length - 1);
      if (data.res) {
        caption = data.content;
        let matchT: RegExpMatchArray;
        if (type === TBegin.table) {
          matchT = content.match(openTagTabular);
        } else {
          matchT = content.match(includegraphicsTag);
        }
        if (matchT && matchCaptionB.index < matchT.index) {
          captionFirst = true;
        }

        while (captionTagBegin.test(content)) {
          const contentData = removeCaptionsFromTableAndFigure(content);
          content = contentData.content;
          if (contentData.isNotCaption) {
            break;
          }
        }
      }
    } else {
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
    }
    const contentSetupData = removeCaptionsSetupFromTableAndFigure(content);
    content = contentSetupData.content;
    state.env.captionIsLabelFormatEmpty = contentSetupData.isLabelFormatEmpty;
    state.env.captionIsSingleLineCheck = contentSetupData.isSingleLineCheck;
  }

  state.parentType = 'paragraph';
  state.env.caption = caption;
  state.env.captionPos = captionPos;
  const contentAlign = align ? align
    : hasAlignTagG ? 'center' : '';
  state.env.align = contentAlign;
  let latex = match[1] === 'figure' || match[1] === 'table'
    ? `\\begin{${match[1]}}[h]`
    : match[0];
  StatePushPatagraphOpenTable(state, startLine, (pE > 0) ? nextLine  : nextLine + 1, type, latex, 
    (hasAlignTagG || hasAlignTagIncludeGraphicsG));
  if (captionFirst && !state.md.options.forLatex) {
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

  if (!captionFirst && !state.md.options.forLatex) {
    StatePushCaptionTable(state, type);
  }
  token = state.push('paragraph_close', 'div', -1);
  token.parentType = 'table';
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

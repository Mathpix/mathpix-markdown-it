import { MarkdownIt, RuleBlock, RuleInline, Renderer, Token } from 'markdown-it';
const isSpace = require('markdown-it/lib/common/utils').isSpace;
import { renderTabularInline } from "./md-renderer-rules/render-tabular";
import { closeTagSpan, reSpan, reAddContentsLine } from "./common/consts";
import { findEndMarker, getTerminatedRules } from "./common";
import { uid , getSpacesFromLeft } from "./utils";
import { ILabel, getLabelByUuidFromLabelsList } from "./common/labels";
import { textCollapse } from "./md-inline-rule/text-collapse";
import { newlineToSpace } from "./md-inline-rule/new-line-to-space";

export let sectionCount: number = 0;
export let subCount: number = 0;
export let subSubCount: number = 0;
let isNewSect: boolean = false;
let isNewSubSection: boolean = false;

export const resetCounter: RuleInline = () => {
  resetTextCounter();
};

export const resetTextCounter: RuleInline = () => {
  sectionCount = 0;
  subCount = 0;
  subSubCount = 0;
};

export const setTextCounterSection = (envName: string, num: number) => {
  switch (envName) {
    case "section":
      sectionCount = num;
      break;    
    case "subsection":
      subCount = num;
      break;    
    case "subsubsection":
      subSubCount = num;
      break;
  }
};

const separatingSpan: RuleBlock = (state, startLine: number, endLine: number, silent) => {
  let lineText: string,
    pos: number = state.bMarks[startLine] + state.tShift[startLine],
    max: number = state.eMarks[startLine];

  const markerBegin = RegExp('^</?(span)(?=(\\s|>|$))', 'i');
  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { 
    return false; 
  }

  lineText = state.src.slice(pos, max);
  const sMatch = lineText.match(markerBegin);
  if (!sMatch) {
    return false;
  }

  const sMatchEnd = lineText.match(closeTagSpan);
  if (!sMatchEnd) {
    return false;
  }
  /** For validation mode we can terminate immediately */
  if (silent) {
    return true;
  }
  let nextPos = pos + sMatchEnd.index + sMatchEnd[0].length;

  if (nextPos < max) {
    while(nextPos < max) {
      const ch = state.src.charCodeAt(nextPos);
      if (ch !== 0x20 /* space */) {
        break;
      }
      nextPos++;
    }
  }
  
  const content = state.src.slice(pos, nextPos);
  const match = content.match(reSpan);
  if (!match || match.length < 3) {
    return false
  }
  
  state.tShift[startLine] += content.length;
  const token: Token = state.push('inline', '', 0);
  token.content = content;
  token.children = [];
  // state.pos = nextPos;
  return true;
};

/**
 * To add an unnumbered section to the table of contents, use the \addcontentsline command like this:
 * \addcontentsline{toc}{section}{Unnumbered Section}
 * */
const addContentsLineBlock: RuleBlock = (state, startLine: number, endLine: number, silent) => {
  let token: Token, lineText: string,
    pos: number = state.bMarks[startLine] + state.tShift[startLine],
    max: number = state.eMarks[startLine];
  let startPos: number = 0;
  let nextLine: number = startLine + 1;
  let latex: string = '';
  lineText = state.src.slice(pos, max).trim();
  if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
    return false;
  }
  let match: RegExpMatchArray = lineText
    .slice(startPos)
    .match(reAddContentsLine);
  if (!match) {
    return false;
  }
  /** For validation mode we can terminate immediately */
  if (silent) {
    return true;
  }
  let envExp = match.groups?.exp ? match.groups.exp : match[1];
  if (envExp !== 'toc') {
    return false;
  }
  let envUnit = match.groups?.unit ? match.groups.unit : match[2];
  if (!['section', 'subsection', 'subsubsection'].includes(envUnit)) {
    return false;
  }
  startPos += match[0].length;
  latex = match[0];
  // nextPos += match[0].length;
  // \addcontentsline{toc}{section} {Unnumbered Section}
  //                               ^^ skipping these spaces
  for (; startPos < max; startPos++) {
    const code = lineText.charCodeAt(startPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
  }
  if (startPos >= max) {
    return false;
  }
  // \addcontentsline{toc}{section}{Unnumbered Section}
  //                               ^^ should be { 
  if (lineText.charCodeAt(startPos) !== 123 /* { */) {
    return false;
  }
  let { res = false, content = '', nextPos = 0 } = findEndMarker(lineText, startPos);
  let resString = content;
  let hasEndMarker = false;
  let last = nextLine;
  let inlineStr = '';
  if (!res) {
    for (; nextLine <= endLine; nextLine++) {
      if (lineText === '') {
        break;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      let { res = false, content = '', nextPos = 0 } = findEndMarker(lineText, -1, "{", "}", true);
      if (res) {
        resString += resString ? ' ' : '';
        resString += content;
        hasEndMarker = true;
        if (nextPos && nextPos < lineText.length) {
          inlineStr = lineText.slice(nextPos);
        }
        break
      }
      resString += resString ? ' ' : '';
      resString += lineText;
    }
    last = nextLine + 1;
  } else {
    hasEndMarker = true;
    last = nextLine;
    if (nextPos && nextPos < lineText.length) {
      inlineStr = lineText.slice(nextPos);
    }
  }
  if (!hasEndMarker) {
    return false;
  }
  
  let level;
  switch (envUnit) {
    case 'section':
      level = 2;
      break;
    case 'subsection':
      level = 3;
      break;
    case 'subsubsection':
      level = 4;
      break;
  }

  state.line = last;
  token = state.push('addcontentsline_open', 'div', 1);
  if (state.md.options.forLatex) {
    token.latex = latex + '{';
  }
  token.map = [startLine, state.line];
  token.envLevel = level;
  token.attrJoin('class', 'addcontentsline');
  token.attrSet('style', 'margin-top: 0; margin-bottom: 0;');
  
  token = state.push('inline', '', 0);
  token.content = resString;
  token.type = "addcontentsline";
  token.map = [startLine, state.line];
  if (state.md.options.forLatex) {
    token.latex = resString;
  }
  let children = [];
  state.md.inline.parse(token.content.trim(), state.md, state.env, children);
  token.children = children;

  token = state.push('addcontentsline_close', 'div', -1);
  token.envLevel = level;
  if (state.md.options.forLatex) {
    token.latex = '}';
  }
  if (inlineStr && inlineStr.trim()) {
    token = state.push('inline', '', 0);
    token.content = inlineStr;
    token.children = [];
  }
  return true;
};

export const headingSection: RuleBlock = (state, startLine: number, endLine: number, silent) => {
  let token: Token, lineText: string,
    pos: number = state.bMarks[startLine] + state.tShift[startLine],
    max: number = state.eMarks[startLine];

  let nextLine: number = startLine + 1;

  let startPos: number = 0, type: string, className: string = '',
    is_numerable: boolean = false,
    beginMarker: string = "{",
    level = 1;

  lineText = state.src.slice(pos, max);
  /** line begin offsets */
  let bMarks = lineText.length - lineText.trimLeft().length;
  lineText = lineText.trimLeft();
  if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
    return false;
  }

  const match: RegExpMatchArray = lineText
    .slice(++startPos)
    .match(/^(?:title|section\*|section|subsection\*|subsection|subsubsection\*|subsubsection)/);

  if (!match) {
    return false;
  }

  /** For validation mode we can terminate immediately */
  if (silent) { return true; }

  let attrStyle = '';
  let isUnNumbered: boolean = false;

  startPos += match[0].length;
  switch (match[0]) {
    case "title":
      level = 1;
      type = "title";
      className = "main-title";
      attrStyle = 'text-align: center; margin: 0 auto; line-height: 1.2; margin-bottom: 1em;';
      break;
    case "section":
      level = 2;
      type = "section";
      is_numerable = true;
      isNewSect = true;
      className = "section-title";
      attrStyle = 'margin-top: 1.5em;';
      break;
    case "subsection":
      isNewSubSection = true;
      level = 3;
      type = "subsection";
      className = "sub_section-title";
      break;
    case "subsubsection":
      level = 4;
      type = "subsubsection";
      className = "sub_sub_section-title";
      break;    
    case "section*":
      isUnNumbered = true;
      level = 2;
      type = "section";
      className = "section-title";
      attrStyle = 'margin-top: 1.5em;';
      break;
    case "subsection*":
      isUnNumbered = true;
      level = 3;
      type = "subsection";
      className = "sub_section-title";
      break;
    case "subsubsection*":
      isUnNumbered = true;
      level = 4;
      type = "subsubsection";
      className = "sub_sub_section-title";
      break;
    default:
      break;
  }

  if (lineText[startPos] !== beginMarker) {
    return false;
  }

  let { res = false, content = '', nextPos = 0, endPos = 0 } = findEndMarker(lineText, startPos);
  let resString = content;
  // resString = resString.split('\\\\').join('\n');
  let hasEndMarker = false;
  let last = nextLine;
  let eMarks = 0; //line end offsets
  let bMarksContent = startPos;
  let inlineStr = '';
  if (!res) {
    // resString += resString ? ' ' : '';
    bMarksContent += content?.length ? 0 : 1;
    bMarksContent += state.tShift[nextLine];
    for (; nextLine <= endLine; nextLine++) {
      if (lineText === '') {
        break;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      let { res = false, content = '', nextPos = 0, endPos = 0 } = findEndMarker(lineText, -1, "{", "}", true);
      if (res) {
        eMarks = endPos + 1;
        resString += resString ? ' ' : '';

        // content = content.split('\\\\').join('\n');
        resString += content;
        hasEndMarker = true;
        if (nextPos && nextPos < lineText.length) {
          inlineStr = lineText.slice(nextPos);
        }
        break
      }
      resString += resString ? ' ' : '';
      // lineText = lineText.split('\\\\').join('\n');
      resString += lineText;
    }
    last = nextLine + 1;
  } else {
    eMarks = endPos;
    hasEndMarker = true;
    last = nextLine;
    if (nextPos && nextPos < lineText.length) {
      inlineStr = lineText.slice(nextPos);
    }
  }


  if ( !hasEndMarker ) {
    return false;
  }
  
  state.line = last;

  token = state.push('heading_open', 'h' + String(level), 1);
  if (state.md.options.forLatex) {
    token.latex = type;
  }
  token.markup = '########'.slice(0, level);
  token.map = [startLine, state.line];
  token.attrJoin('type', type);
  token.isUnNumbered = isUnNumbered;
  if (isUnNumbered) {
    token.attrJoin('data-unnumbered', "true");
  }
  token.attrJoin('class', className);
  if (state.md.options?.forDocx && attrStyle) {
    token.attrSet('style', attrStyle);
  }

  token = state.push('inline', '', 0);
  token.content = resString;
  token.content_id = resString.split('\\\\').join('\n');
  token.type = type;
  token.is_numerable = is_numerable;
  token.isUnNumbered = isUnNumbered;
  token.map = [startLine, state.line];
  token.bMarks = bMarks;
  token.eMarks = eMarks ? eMarks : token.bMarks + resString.length;
  token.bMarksContent = bMarks + bMarksContent + beginMarker.length;
  token.eMarksContent = token.eMarks;
  token.eMarks += 1;

  let children = [];
  state.env.doubleSlashToSoftBreak = true; /** for // - should be new line */
  state.md.inline.parse(token.content, state.md, state.env, children);
  state.env.doubleSlashToSoftBreak = false;
  token.children = children;

  if (type === "section" && !isUnNumbered) {
    sectionCount = sectionCount ? sectionCount + 1 : 1;
    state.env.section = sectionCount;
    token.section = sectionCount;
    state.env.number = token.section;
  }
  
  if (type === "subsection" && !isUnNumbered) {
    token.isNewSect = isNewSect;
    isNewSect = false;
    subCount = !token.isNewSect 
      ? subCount ? subCount + 1 : 1 : 1;
    state.env.subsection = subCount;
    token.section = sectionCount;
    token.subsection = subCount;
    state.env.number = token.section + '.' + token.subsection;
  }
  if (type === "subsubsection" && !isUnNumbered) {
    token.isNewSubSection = isNewSubSection;
    isNewSubSection = false;
    if (isNewSect) {
      token.isNewSect = isNewSect;
      isNewSect = false;
      if (state.env.hasOwnProperty('subsection') && state.env.subsection === subCount) {
        subCount = 0;
        state.env.subsection = subCount;
      }
      subSubCount = 1;
    } else {
      subSubCount = !token.isNewSubSection
      ? subSubCount ? subSubCount + 1 : 1 : 1;
    }
    state.env.subsubsection = subSubCount;
    token.section = sectionCount;
    token.subsection = subCount;
    token.subsubsection = subSubCount;
    state.env.number = token.section + '.' + token.subsection + '.' + token.subsubsection;
  }

  if (!isUnNumbered) {
    token.uuid = uid();
    token.currentTag = {
      type: type,
      number: state.env.number,
      tokenUuidInParentBlock: token.uuid
    };
    state.env.type = type;
    state.env.lastTag = {...token.currentTag};
  }
  token = state.push('heading_close', 'h' + String(level), -1);
  token.isUnNumbered = isUnNumbered;
  token.markup = '########'.slice(0, level);
  state.parentType = 'paragraph';
  if (state.md.options.forLatex) {
    token.latex = type;
  }
  if (inlineStr && inlineStr.trim()) {
    token = state.push('inline', '', 0);
    token.content = inlineStr;
    token.children = [];
  }
  return true;
};

/** TODO: Need to change this rule to separate rendering of the entire block abstract */
const abstractBlock: RuleBlock = (state, startLine, endLine, silent) => {
  let isBlockOpened = false;
  let token: Token;
  let content: string;
  let terminate: boolean;
  const openTag: RegExp = /\\begin{abstract}/;
  const closeTag: RegExp = /\\end{abstract}/;
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let nextLine: number = startLine + 1;
  const terminatorRules = state.md.block.ruler.getRules('paragraph');
  let lineText: string = state.src.slice(pos, max);
  let isCloseTagExist = false;
  let arrContent = [];

  if (!openTag.test(lineText)) {
    return false;
  }
  /** For validation mode we can terminate immediately */
  if (silent) {
    return true;
  }
  let resString = '';
  let abs = openTag.test(lineText);
  let inline = '';
  let lastLine = '';
  
  const match = lineText.match(openTag);
  if (match) {
    inline = lineText.slice(match.index + match[0].length);
  }
  if (inline && inline.trim()) {
    arrContent.push({
      line: startLine,
      bMarks:state.tShift[startLine] + match.index + match[0].length,
      eMarks: lineText.length,
      content: inline
    })
  }
  for (; nextLine < endLine; nextLine++) {

    if (closeTag.test(lineText)) {
      lineText += '\\n';
      break;
    }

    isBlockOpened = true;
    if (lineText === '') {
      resString += '\n'
    }
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    lastLine = state.src.slice(pos, max);

    if (!closeTag.test(lineText)) {
      arrContent.push({
        line: nextLine,
        bMarks: 0,
        eMarks: state.tShift[nextLine] + lineText.length,
        content: lineText
      });
    }
    if (abs) {
      if (closeTag.test(lineText)) {
        isBlockOpened = false;
        abs = false;
        isCloseTagExist = true;
      } else {
        resString += resString ? ' ' : '';
        resString += lineText;
      }
    } else {
      if (state.isEmpty(nextLine)) { break }
    }
    if (openTag.test(lineText)) {
      if (isBlockOpened) {
        return false;
      }
    }

    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  if (!isCloseTagExist) {
    return false;
  }

  let strBeforeEnd = '';
  let strAfterEnd = '';
  if (lastLine) {
    const matchEnd = lastLine.match(closeTag);
    if (matchEnd) {
      strBeforeEnd = lastLine.slice(0, matchEnd.index);
      strAfterEnd = lastLine.slice(matchEnd.index + matchEnd[0].length);
      if (strBeforeEnd) {
        arrContent.push({
          line: nextLine,
          eMarks: matchEnd.index + 1,
          content: strBeforeEnd
        });
      } else {
        if (arrContent?.length) {
          arrContent[arrContent.length-1].endLine = arrContent[arrContent.length-1].line + 1;
          arrContent[arrContent.length-1].eMarks += 1;
        }
      }
    }
  }
  content = resString;
  if (inline && inline.trim()) {
    content = inline + content;
  }
  if (strBeforeEnd && strBeforeEnd.trim()) {
    content += strBeforeEnd;
  }

  let contentItems = [];
  let start = null;
  for (let i = 0; i < arrContent.length; i++) {
    if (!start) {
      start = arrContent[i];
      continue;
    }
    if (arrContent[i].content?.trim()) {
      start.endLine = arrContent[i].hasOwnProperty('endLine') ? arrContent[i].endLine : arrContent[i].line;
      start.content += start.content ? ' ' : '';
      start.content += arrContent[i].content;
      start.eMarks = arrContent[i].eMarks ? arrContent[i].eMarks : 0;
    } else {
      start.endLine = arrContent[i].line;
      start.eMarks = arrContent[i].eMarks ? arrContent[i].eMarks : 0;
      contentItems.push(start);
      start = null;
    }
  };
  if (start) {
    contentItems.push(start);
  }
  const contentList = content.split('\n');
  const tokenContent = contentList.filter(item => {
    return item.trim().length > 0
  });

  token = state.push('paragraph_open', 'div', 1);
  token.map = [startLine, nextLine];
  token.attrSet('class', 'abstract');
  token.attrSet('style', 'width: 80%; margin: 0 auto; margin-bottom: 1em; font-size: .9em;');
  token.mmd_type = 'abstract';

  token = state.push('heading_open', 'h4', 1);
  token.markup = '########'.slice(0, 4);
  token.attrSet('id', 'abstract_head');
  token.attrSet('class', 'abstract_head');
  token.attrSet('style', 'text-align: center;');
  token.mmd_type = 'abstract_title';
  token = state.push('text', '', 0);
  token.content = 'Abstract';
  token.children = [];
  token = state.push('heading_close', 'h4', -1);

  for (let i = 0; i < tokenContent.length; i++) {
    token = state.push('paragraph_open', 'p', 1);
    token.attrSet('style', 'text-indent: 1em;');
    
    token = state.push('inline', '', 0);
    token.content = tokenContent[i].trim();
    if (contentItems[i]) {
      token.map = [contentItems[i].line,
        contentItems[i].line 
          ? contentItems[i].endLine 
          : contentItems[i].line];
      token.bMarks = contentItems[i].bMarks ? contentItems[i].bMarks : 0;
      token.eMarks = contentItems[i].eMarks ? contentItems[i].eMarks : 0;
    } else {
      token.map = [startLine, state.line];
    }
    token.children = [];
    token.mmd_type = 'abstract_content';
    token = state.push('paragraph_close', 'p', -1);
  }
  token = state.push('paragraph_close', 'div', -1);
  
  if (strAfterEnd && strAfterEnd.trim()) {
    token = state.push('inline', '', 0);
    token.content = strAfterEnd;
    token.children = [];    
  }
  state.line = nextLine;
  return true;
};

const pageBreaksBlock: RuleBlock = (state, startLine: number, endLine, silent) => {
  let token: Token, lineText: string,
    pos: number = state.bMarks[startLine] + state.tShift[startLine],
    max: number = state.eMarks[startLine];
  let nextLine: number = startLine + 1;
  let startPos: number = 0;
  lineText = state.src.slice(pos, max).trim();
  if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
    return false;
  }
  const match: RegExpMatchArray = lineText
    .slice(++startPos)
    .match(/^(?:pagebreak|clearpage|newpage)/);
  if (!match) {
    return false;
  }
  /** For validation mode we can terminate immediately */
  if (silent) {
    return true;
  }
  startPos += match[0].length;
  let strAfterEnd = '';
  if (lineText.length > startPos) {
    strAfterEnd = lineText.slice(startPos);
  }
  if (state.md.options.showPageBreaks || strAfterEnd?.trim()) {
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, nextLine];
  }
  token = state.push("pagebreak", "", 0);
  token.content = '';
  if (state.md.options.forLatex) {
    token.latex = '\\' + match[0];
    if (!strAfterEnd || !strAfterEnd.trim()) {
      if (state.isEmpty(nextLine)) {
        token.latex += '\n\n'
      } else {
        token.latex += '\n'
      }
    }
  }
  token.children = [];
  if (strAfterEnd?.trim()) {
    token = state.push('inline', '', 0);
    token.content = strAfterEnd;
    token.children = [];
  }
  if (state.md.options.showPageBreaks || strAfterEnd?.trim()) {
    state.push('paragraph_close', 'div', -1);
  }
  state.line = nextLine;
  return true;
};

const textAuthor: RuleInline = (state) => {
  let startPos = state.pos;

  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:author)/); // eslint-disable-line

  if (!match) {
    return false;
  }

  startPos += match[0].length;

  let {res = false, content = '', nextPos = 0 } = findEndMarker(state.src, startPos);

  if ( !res ) {
    return false;
  }

  const type = "author";
  const arrtStyle = 'text-align: center; margin: 0 auto; display: flex; justify-content: center; flex-wrap: wrap;';

  const token = state.push(type, "", 0);
  if (state.md.options?.forDocx && arrtStyle) {
    token.attrSet('style', arrtStyle);
  }
  token.content = content;
  token.children = [];
  token.inlinePos = {
    start: state.pos,
    end: nextPos,
    start_content: startPos + 1,
    end_content: nextPos - 1,
  };

  const columns = content.split('\\and');
  let pos = 0;
  for (let i = 0; i < columns.length; i++) {
    let column = columns[i]
      ? columns[i].trim()
      : '';

    const tokenAuthorColumn: Token = {};
    tokenAuthorColumn.type = 'author_column';
    tokenAuthorColumn.content = column;
    tokenAuthorColumn.children = [];
    
    pos = pos + columns[i].length;
    pos += i < columns.length - 1 ? '\\and'.length : 0;
    tokenAuthorColumn.nextPos = pos;

    let colArr = columns[i].split('\\\\');
    let posCol = 0;
    if (colArr && colArr.length) {
      for ( let j = 0; j < colArr.length; j++ ) {
        let item = colArr[j] ? colArr[j].trim() : '';

        const newToken: Token = {};
        newToken.type = 'author_item';
        newToken.content = item;
        newToken.offsetLeft = colArr[j].trim()?.length ? getSpacesFromLeft(colArr[j]) : 0;
        posCol = posCol + colArr[j].length;
        posCol += j < colArr.length - 1 ? '\\\\'.length : 0;
        newToken.nextPos = posCol;
        
        let children = [];
        state.env.newlineToSpace = true;
        state.md.inline.parse(item, state.md, state.env, children);
        state.env.newlineToSpace = true;
        newToken.children = children;

        tokenAuthorColumn.children.push(newToken);
      }
    }

    token.children.push(tokenAuthorColumn)
  }

  state.pos = nextPos;
  return true;
};

const textTypes: RuleInline = (state) => {
  let startPos = state.pos;
  let type: string = '';
  let arrtStyle: string = '';

  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:textit|textbf|texttt)/); // eslint-disable-line

  if (!match) {
    return false;
  }
  startPos += match[0].length;
  switch (match[0]) {
    case "textit":
      type = "textit";
      break;
    case "textbf":
      type = "textbf";
      break;
    case "texttt":
      type = "texttt";
      break;
    default:
      break;
  }

  if (!type || type === '') {
    return false;
  }

  let {res = false, content = '', nextPos = 0, endPos = 0 } = findEndMarker(state.src, startPos);

  if ( !res ) {
    return false;
  }

  let token = state.push(type + '_open', "", 0);
  token.inlinePos = {
    start: state.pos,
    end: startPos + 1
  };
  token.nextPos = startPos + 1;
  token = state.push(type, "", 0);
  if (state.md.options?.forDocx && arrtStyle) {
    token.attrSet('style', arrtStyle);
  }
  token.content = content;
  token.inlinePos = {
    start: startPos + 1,
    end: endPos,
  };
  token.nextPos = endPos;
  token.children = [];

  let children = [];
  state.md.inline.parse(token.content.trim(), state.md, state.env, children);
  token.children = children;

  state.push(type + '_close', "", 0);
  state.pos = nextPos;
  state.nextPos = nextPos;
  return true;
};

const pageBreaks: RuleInline = (state) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:pagebreak|clearpage|newpage)/); // eslint-disable-line
  if (!match) {
    return false;
  }
  const nextPos = startPos + match[0].length;
  const token = state.push("pagebreak", "", 0);
  token.content = '';
  if (state.md.options.forLatex) {
    token.latex = '\\' + match[0];
  } 
  token.children = [];
  state.pos = nextPos;
  return true;
};

const doubleSlashToSoftBreak: RuleInline = (state) => {
  let startPos = state.pos;
  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  let nextPos = startPos + 1;
  if (state.src.charCodeAt(nextPos) !== 0x5c /* \ */) {
    return false;
  }
  if (state.env.doubleSlashToSoftBreak) {
    const token = state.push('softbreak', 'br', 0);
    token.inlinePos = {
      start: startPos,
      end: nextPos
    };
    state.pos = nextPos + 1;
    return true;
  } else {
    return false;
  }
};

const linkifyURL: RuleInline = (state) => {
  const urlTag: RegExp = /(?:(www|http:|https:)+[^\s]+[\w])/;
  let startPos = state.pos;
  let
    beginMarker: string = "{",
    endMarker: string = "}";

  if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startPos)
    .match(/^(?:url)/); // eslint-disable-line

  if (!match) {
    return false;
  }
  startPos += match[0].length;

  if (state.src[startPos] !== beginMarker) {
    return false;
  }
  const endMarkerPos = state.src.indexOf(endMarker, startPos);
  if (endMarkerPos === -1) {
    return false;
  }

  const nextPos = endMarkerPos + endMarker.length;
  let token;
  const text = state.src.slice(startPos + 1, nextPos - endMarker.length);
  if (!text || text.trim().length === 0) {
    text.nextPos = nextPos;
    state.pos = nextPos;
    return true;
  }

  if (!state.md.linkify.test(text) || !urlTag.test(text)) {
    token         = state.push('textUrl', '', 0);
    token.content = text;
    token.nextPos = nextPos;
    state.pos = nextPos;
    return true;
  }

  const links = state.md.linkify.match(text);

  let level = 1;
  let lastPos = 0;
  let pos;

  state.md.options.linkify = false

  for (let ln = 0; ln < links.length; ln++) {
    const url = links[ln].url;
    const fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) { continue; }

    let urlText = links[ln].text;

    if (!urlTag.test(urlText)) {
      pos = links[ln].index;
      if (pos > lastPos) {
        token         = state.push('textUrl', '', 0);
        token.content = text.slice(lastPos, pos);
        token.level   = level;
      }
      token         = state.push('textUrl', '', 0);
      lastPos = links[ln].lastIndex;
      token.content = text.slice(pos, lastPos);
      token.level   = level;
      continue;
    }

    if (!links[ln].schema) {
      urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
    } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
      urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
    } else {
      urlText = state.md.normalizeLinkText(urlText);
    }

    pos = links[ln].index;

    if (pos > lastPos) {
      token         = state.push('textUrl', '', 0);
      token.content = text.slice(lastPos, pos);
      token.level   = level;
    }

    token         = state.push('link_open', 'a', 1);
    token.attrs   = [ [ 'href', fullUrl ] ];
    token.level   = level++;
    token.markup  = 'linkify';
    token.info    = 'auto';
    token.nextPos = startPos + 1;

    token         = state.push('text', '', 0);
    token.content = urlText;
    token.level   = level;
    token.nextPos = endMarkerPos;

    token         = state.push('link_close', 'a', -1);
    token.level   = --level;
    token.markup  = 'linkify';
    token.info    = 'auto';
    token.nextPos = nextPos;

    lastPos = links[ln].lastIndex;
  }

  if (lastPos < text.length) {
    token         = state.push('textUrl', '', 0);
    token.content = text.slice(lastPos);
    token.level   = level;
    state.nextPos = nextPos;
  }

  state.pos = nextPos;

  return true;
};

const renderDocTitle: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  const content = renderInlineContent(token, options, env, slf);
  return content;
};

export const renderInlineContent = (token, options, env, slf) => {
  let sContent = '';
  let content = '';
  if (token.children && token.children.length) {
    for (let i = 0; i < token.children.length; i++) {
      const tok = token.children[i];
      if (tok.children && tok.children.length > 1) {
        if (tok.type === "tabular_inline") {
          content = renderTabularInline(token.children, tok, options, env, slf)
        } else {
          content = slf.renderInline(tok.children, options, env);
        }
      } else {
        content = slf.renderInline([tok], options, env);
      }
      sContent +=  content
    }
    return sContent;
  }

  return token.content;
};

const renderSectionTitle: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  const content = renderInlineContent(token, options, env, slf);
  if (token.isUnNumbered) {
    return content;
  }
  const label: ILabel = token.uuid ? getLabelByUuidFromLabelsList(token.uuid) : null;
  const sectionNumber = token.is_numerable
    ? label 
      ? `<span id="${label.id}" class="section-number">${token.section}. </span>`
      : `<span class="section-number">${token.section}. </span>`
    : ``;
  return `${sectionNumber}${content}`
};

const renderSubsectionTitle: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  const content = renderInlineContent(token, options, env, slf);
  if (token.isUnNumbered) {
    return content;
  }
  const label: ILabel = token.uuid ? getLabelByUuidFromLabelsList(token.uuid) : null;
  return label 
    ? `<span id="${label.id}" class="section-number">${token.section}.</span><span class="sub_section-number">${token.subsection}.</span> ${content}`
    : `<span class="section-number">${token.section}.</span><span class="sub_section-number">${token.subsection}.</span> ${content}`;
};

const renderSubSubsectionTitle: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  const content = renderInlineContent(token, options, env, slf);
  if (token.isUnNumbered) {
    return content;
  }
  const label: ILabel = token.uuid ? getLabelByUuidFromLabelsList(token.uuid) : null;
  return label 
    ? `<span id="${label.id}" class="section-number">${token.section}.</span><span class="sub_section-number">${token.subsection}.${token.subsubsection}.</span> ${content}`
    : `<span class="section-number">${token.section}.</span><span class="sub_section-number">${token.subsection}.${token.subsubsection}.</span> ${content}`;
};

const getAuthorItemToken = (tokens, index, options, env, slf) => {
  let res = '';
  const token = tokens[index];
  const content = renderInlineContent(token, options, env, slf);

  let attrStyle = options.forDocx
    ? ' display: block; text-align: center;'
    : '';

  res += attrStyle
    ? `<span style="${attrStyle}">${content}</span>`
    : `<span>${content}</span>`;

  return res;
};

const getAuthorColumnToken = (tokens, index, options, env, slf) => {
  let res = '';
  const token = tokens[index];
  let attrStyle = options.forDocx
    ? 'min-width: 30%; max-width: 50%; padding: 0 7px;'
    : '';

  const content: string = token.children && token.children.length
    ? slf.renderInline(token.children, options)
    : renderInlineContent(token, options, env, slf);

  if (attrStyle) {
    res += `<p style="${attrStyle}">${content}</p>`
  } else {
    res += `<p>${content}</p>`
  }

  return res;
};

const renderAuthorToken: Renderer = (tokens, index, options, env, slf) => {
  const token = tokens[index];
  let divStyle: string = options.forDocx
    ? token.attrGet('style')
    : '';

  const res: string = token.children && token.children.length
    ? slf.renderInline(token.children, options)
    : renderInlineContent(token, options, env, slf);

  if (divStyle) {
    return `<div class="author" style="${divStyle}">
          ${res}
        </div>`;
  } else {
    return `<div class="author">
          ${res}
        </div>`;
  }
};

const renderBoldText = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const content = renderInlineContent(token, options, env, slf);

  return content;
};

const renderItalicText = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const content = renderInlineContent(token, options, env, slf);

  return content;
};

const renderCodeInlineOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  return  '<code' + slf.renderAttrs(token) + '>';
};

const renderCodeInlineClose = () => {
  return  '</code>';
};

const renderCodeInline = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  // return escapeHtml(token.content);
  const content = renderInlineContent(token, options, env, slf);

  return content;
};

const renderUrl = token => `<a href="${token.content}">${token.content}</a>`;

const renderTextUrl = token => {
  return `<a href="#" class="text-url">${token.content}</a>`
};

const renderPageBreaks = (tokens, idx, options, env = {}, slf) => {
  if (options?.showPageBreaks) {
    let html = `<div class="page-break d-flex" style="display:flex; font-size:0.9rem;">`;
    const hrEl = `<hr style="flex-grow:1; border:0; border-top:0.025rem solid #999; margin:auto"/>`;
    html += hrEl;
    html += '<span style="padding-left:0.5rem; padding-right:0.5rem; color:#999;">' + 'Page Break' + '</span>';
    html += hrEl;
    html += '</div>';
    return html;
  }
  return '';
};

const mappingTextStyles = {
  textbf: "TextBold",
  textbf_open: "TextBoldOpen",
  textbf_close: "TextBoldClose",

  textit: "TextIt",
  textit_open: "TextItOpen",
  textit_close: "TextItClose",

  texttt: "texttt",
  texttt_open: "texttt_open",
  texttt_close: "texttt_close",
};

const mapping = {
  section: "Section",
  title: "Title",
  author: "Author",
  author_column: "authorColumn",
  author_item: "authorItem",
  subsection: "Subsection",
  subsubsection: "Subsubsection",
  url: "Url",
  textUrl: "textUrl",
  addcontentsline: "addcontentsline"
};

export default () => {
  return (md: MarkdownIt) => {
    resetCounter();
    md.block.ruler.before("heading", "headingSection", headingSection, 
      {alt: getTerminatedRules('headingSection')});
    md.block.ruler.before("heading", "addContentsLineBlock", addContentsLineBlock, 
      {alt: getTerminatedRules('addContentsLineBlock')});
    md.block.ruler.before("headingSection", "separatingSpan", separatingSpan,
      {alt: getTerminatedRules('separatingSpan')});
    md.block.ruler.before("paragraphDiv", "abstractBlock", abstractBlock,
      {alt: getTerminatedRules('abstractBlock')});
    md.block.ruler.before("paragraphDiv", "pageBreaksBlock", pageBreaksBlock,
      {alt: getTerminatedRules('pageBreaksBlock')});

    md.inline.ruler.before("multiMath", "textTypes", textTypes);
    md.inline.ruler.before("textTypes", "textAuthor", textAuthor);
    md.inline.ruler.before('textTypes', 'linkifyURL', linkifyURL);
    md.inline.ruler.before('textTypes', 'pageBreaks', pageBreaks);
    md.inline.ruler.before('textTypes', 'doubleSlashToSoftBreak', doubleSlashToSoftBreak);
    md.inline.ruler.before('newline', 'newlineToSpace', newlineToSpace);
    /** ParserInline#ruler2 -> Ruler
     *[[Ruler]] instance. Second ruler used for post-processing **/
    md.inline.ruler2.at('text_collapse', textCollapse);

    Object.keys(mappingTextStyles).forEach(key => {
      md.renderer.rules[key] = (tokens, idx, options, env, slf) => {
        switch (tokens[idx].type) {
          case "textbf":
            return renderBoldText(tokens, idx, options, env, slf);
          case "textbf_open":
            return '<strong>';
          case "textbf_close":
            return '</strong>';
          case "textit":
            return renderItalicText(tokens, idx, options, env, slf);
          case "textit_open":
            return '<em>';
          case "textit_close":
            return '</em>';
          case "texttt":
            return renderCodeInline(tokens, idx, options, env, slf);
          case "texttt_open":
            return renderCodeInlineOpen(tokens, idx, options, env, slf);
          case "texttt_close":
            return renderCodeInlineClose();
          default:
            return '';
        }
      }
    });

    Object.keys(mapping).forEach(key => {
      md.renderer.rules[key] = (tokens, idx, options, env = {}, slf) => {
        switch (tokens[idx].type) {
          case "section":
            return renderSectionTitle(tokens, idx, options, env, slf);
          case "subsection":
            return renderSubsectionTitle(tokens, idx, options, env, slf);
          case "subsubsection":
            return renderSubSubsectionTitle(tokens, idx, options, env, slf);
          case "title":
            return renderDocTitle(tokens, idx, options, env, slf);
          case "author":
            return renderAuthorToken(tokens, idx, options, env, slf);
          case "author_column":
            return getAuthorColumnToken(tokens, idx, options, env, slf);
          case "author_item":
            return getAuthorItemToken(tokens, idx, options, env, slf);
          case "url":
            return renderUrl(tokens[idx]);
          case "textUrl":
            return renderTextUrl(tokens[idx]);
          case "addcontentsline":
            return '';
          default:
            return '';
        }
      }
    });
    
    md.renderer.rules.flatNewLine = () => {
      return ' '
    };
    
    md.renderer.rules.pagebreak = (tokens, idx, options, env = {}, slf) => {
      return renderPageBreaks(tokens, idx, options, env, slf)
    };

    md.renderer.rules.s_open = function (tokens, idx, options, env, self) {
      let i = 0;
      while ((idx + i) < tokens.length && tokens[idx + i].type !== 's_close') {
        const token = tokens[idx+i];
        token.attrSet('style', 'text-decoration: line-through; color: inherit;');
        i++;
      }
      return self.renderToken(tokens, idx, options)
    };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      if (options.openLinkInNewWindow) {
        tokens[idx].attrPush(['target', '_blank']);
        tokens[idx].attrPush(['rel', 'noopener']);
      } else {
        tokens[idx].attrPush(['target', '_self']);
      }

      if (!tokens[idx + 1] || !tokens[idx + 1].content) {
          tokens[idx].attrPush([
            'style', 'word-break: break-word'
          ]);
          return self.renderToken(tokens, idx, options)
      }

      if (tokens[idx + 1].content.length > 40 && !tokens[idx + 1].content.includes(' ')) {
        tokens[idx].attrPush([
          'style', 'word-break: break-all'
        ]);
      } else if (!tokens[idx + 1].content.includes(' ')) {
        tokens[idx].attrPush([
          'style', 'display: inline-block'
        ]);
      } else {
        tokens[idx].attrPush([
          'style', 'word-break: break-word'
        ]);
      }
      return self.renderToken(tokens, idx, options)
    }
  };
};

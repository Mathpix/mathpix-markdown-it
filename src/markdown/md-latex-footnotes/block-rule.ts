import { Token, RuleBlock } from 'markdown-it';
import { 
  reOpenTagFootnote, 
  reOpenTagFootnoteNumbered,
  reOpenTagFootnotetext,
  reOpenTagFootnotetextNumbered
} from "../common/consts";
import { findEndMarker } from "../common";
import { findOpenCloseTags } from "../utils";

export const latex_footnote_block: RuleBlock = (state, startLine, endLine, silent) => {
  try {
    let token: Token,
      lineText: string,
      pos: number = state.bMarks[startLine] + state.tShift[startLine],
      max: number = state.eMarks[startLine];

    let nextLine: number = startLine + 1;
    let startPos = pos;
    let numbered;
    lineText = state.src.slice(pos, max);

    if (!reOpenTagFootnote.test(lineText)) {
      return false;
    }
    let dataTags = findOpenCloseTags(lineText, reOpenTagFootnote, '}');
    if (!dataTags?.arrOpen?.length) {
      return false;
    }

    let matchNumbered = dataTags.arrOpen[dataTags.arrOpen.length - 1].content
      .match(reOpenTagFootnoteNumbered);
    if (matchNumbered) {
      numbered = matchNumbered.groups.number;
    }
    let startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
    let startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;
    
    let content = lineText.slice(startContent);

    let data = findEndMarker(content, -1, '{', '}', true);
    if (data?.res) {
      return false;
    }

    let hasEnd = false;
    let nextLineContent = nextLine;
    let inlineContentAfter = '';
    for (; nextLine <= endLine; nextLine++) {
      pos = state.bMarks[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (hasEnd) {
        if (!lineText || !lineText.trim()) {
          break;
        }
        if (!inlineContentAfter?.length) {
          nextLineContent = nextLine;
        }
        inlineContentAfter += inlineContentAfter?.length ? '\n' : '';
        inlineContentAfter += lineText;
        let nextLineText = nextLine + 1 <= endLine
          ?  state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
          : '';
        if (!nextLineText || !nextLineText.trim()) {
          break
        }
      }
      content += '\n';
      content += lineText;
      data = findEndMarker(content, -1, '{', '}', true);
      if (data.res) {
        hasEnd = true;
        nextLineContent = nextLine;
        inlineContentAfter = state.src.slice(startPos + startContent + data.nextPos, state.eMarks[nextLine]);
      }
    }
    if (!data || !data.res) {
      return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
      return true;
    }
    content = data.content;
    state.line = nextLine + 1;
    let inlineContentBefore = startFootnote > 0
      ? state.src.slice(startPos, startPos + startFootnote)
      : '';
    let needToCreateParagraph = (inlineContentBefore?.length && inlineContentBefore?.trim()?.length)
      || (inlineContentAfter?.length && inlineContentAfter?.trim()?.length);
    
    if (needToCreateParagraph) {
      token = state.push('paragraph_open', 'div', 1);
      token.map = [startLine, state.line];
    }

    if (inlineContentBefore?.length && inlineContentBefore?.trim()?.length) {
      token = state.push('inline', '', 0);
      token.map = [startLine, startLine];
      token.content = inlineContentBefore;
      token.bMarks = 0;
      token.eMarks = token.bMarks + token.content.length;
      token.bMarksContent = token.bMarks;
      token.eMarksContent = token.eMarks;
      token.children = [];
    }
    token = state.push('footnote_latex', '', 0);
    token.numbered = numbered;
    let children = [];
    state.md.block.parse(content, state.md, state.env, children);
    token.children = children;

    if (inlineContentAfter?.length && inlineContentAfter?.trim()?.length) {
      token = state.push('inline', '', 0);
      token.map = [nextLineContent, nextLine + 1];
      token.content = inlineContentAfter;
      token.children = [];
    }
    if (needToCreateParagraph) {
      token = state.push('paragraph_close', 'div', -1);
    }
    return true
  } catch (e) {
    return false;
  }
};

export const latex_footnotetext_block: RuleBlock = (state, startLine, endLine, silent) => {
  try {
    let token: Token,
      lineText: string,
      pos: number = state.bMarks[startLine] + state.tShift[startLine],
      max: number = state.eMarks[startLine];

    let nextLine: number = startLine + 1;
    let startPos = pos;
    let numbered;
    lineText = state.src.slice(pos, max);

    if (!reOpenTagFootnotetext.test(lineText)) {
      return false;
    }
    let dataTags = findOpenCloseTags(lineText, reOpenTagFootnotetext, '}');
    if (!dataTags?.arrOpen?.length) {
      return false;
    }

    let openTag = dataTags.arrOpen[dataTags.arrOpen.length - 1].content;
    let matchNumbered = openTag
      .match(reOpenTagFootnotetextNumbered);
    if (matchNumbered) {
      numbered = matchNumbered.groups.number;
    }
    let startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
    let startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;

    let content = lineText.slice(startContent);

    let data = findEndMarker(content, -1, '{', '}', true);
    if (data?.res) {
      return false;
    }
    let hasEnd = false;
    let nextLineContent = nextLine;
    let inlineContentAfter = '';
    for (; nextLine <= endLine; nextLine++) {
      pos = state.bMarks[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (hasEnd) {
        if (!lineText || !lineText.trim()) {
          break;
        }
        if (!inlineContentAfter?.length) {
          nextLineContent = nextLine;
        }
        inlineContentAfter += inlineContentAfter?.length ? '\n' : '';
        inlineContentAfter += lineText;
        let nextLineText = nextLine + 1 <= endLine
          ?  state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
          : '';
        if (!nextLineText || !nextLineText.trim()) {
          break
        }
      }
      content += '\n';
      content += lineText;
      data = findEndMarker(content, -1, '{', '}', true);
      if (data.res) {
        hasEnd = true;
        nextLineContent = nextLine;
        inlineContentAfter = state.src.slice(startPos + startContent + data.nextPos, state.eMarks[nextLine]);
      }
    }
    if (!data || !data.res) {
      return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
      return true;
    }
    content = data.content;
    state.line = nextLine + 1;
    let inlineContentBefore = startFootnote > 0 
      ? state.src.slice(startPos, startPos + startFootnote) 
      : '';
    let needToCreateParagraph = (inlineContentBefore?.length && inlineContentBefore?.trim()?.length) 
      || (inlineContentAfter?.length && inlineContentAfter?.trim()?.length);
    if (needToCreateParagraph) {
      token = state.push('paragraph_open', 'div', 1);
      token.map = [startLine, state.line];
    }
    if (inlineContentBefore?.length && inlineContentBefore?.trim()?.length) {
      token = state.push('inline', '', 0);
      token.map = [startLine, startLine];
      token.content = inlineContentBefore;
      token.bMarks = 0;
      token.eMarks = token.bMarks + token.content.length;
      token.bMarksContent = token.bMarks;
      token.eMarksContent = token.eMarks;
      token.children = [];
    }
    token = openTag.indexOf('blfootnotetext') !== -1
      ? state.push('blfootnotetext_latex', '', 0)
      : state.push('footnotetext_latex', '', 0)
    ;
    token.numbered = numbered;
    let children = [];
    state.md.block.parse(content, state.md, state.env, children);
    token.children = children;

    if (inlineContentAfter?.length && inlineContentAfter?.trim()?.length) {
      token = state.push('inline', '', 0);
      token.map = [nextLineContent, nextLine + 1];
      token.content = inlineContentAfter;
      token.children = [];
    }
    if (needToCreateParagraph) {
      token = state.push('paragraph_close', 'div', -1);
    }
    return true
  } catch (e) {
    return false;
  }
};

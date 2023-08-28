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
    for (; nextLine <= endLine; nextLine++) {
      pos = state.bMarks[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (hasEnd && (!lineText || !lineText.trim())) {
        break;
      } 
      content += '\n';
      content += lineText;
      data = findEndMarker(content, -1, '{', '}', true);
      if (data.res) {
        hasEnd = true;
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
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, state.line];

    if (startFootnote > 0) {
      token = state.push('inline', '', 0);
      token.content = state.src.slice(startPos, startPos + startFootnote);
      token.children = [];
    }
    token = state.push('footnote_latex', '', 0);
    token.numbered = numbered;
    let children = [];
    state.md.block.parse(content, state.md, state.env, children);
    token.children = children;

    max = state.eMarks[nextLine];
    if (max > startPos + startContent + data.nextPos) {
      token = state.push('inline', '', 0);
      token.content = state.src.slice(startPos + startContent + data.nextPos, max);
      token.children = [];
    }
    token = state.push('paragraph_close', 'div', -1);
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

    let matchNumbered = dataTags.arrOpen[dataTags.arrOpen.length - 1].content
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
    for (; nextLine <= endLine; nextLine++) {
      pos = state.bMarks[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (hasEnd && (!lineText || !lineText.trim())) {
        break;
      }
      content += '\n';
      content += lineText;
      data = findEndMarker(content, -1, '{', '}', true);
      if (data.res) {
        hasEnd = true;
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
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, state.line];

    if (startFootnote > 0) {
      token = state.push('inline', '', 0);
      token.content = state.src.slice(startPos, startPos + startFootnote);
      token.children = [];
    }
    token = state.push('footnotetext_latex', '', 0);
    token.numbered = numbered;
    let children = [];
    state.md.block.parse(content, state.md, state.env, children);
    token.children = children;

    max = state.eMarks[nextLine];
    if (max > startPos + startContent + data.nextPos) {
      token = state.push('inline', '', 0);
      token.content = state.src.slice(startPos + startContent + data.nextPos, max);
      token.children = [];
    }
    token = state.push('paragraph_close', 'div', -1);
    return true
  } catch (e) {
    return false;
  }
};

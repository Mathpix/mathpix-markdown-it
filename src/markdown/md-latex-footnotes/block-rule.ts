import { Token, RuleBlock } from 'markdown-it';
import { 
  reOpenTagFootnote,
  reOpenTagFootnoteG,
  reOpenTagFootnoteNumbered,
  reOpenTagFootnotetext,
  reOpenTagFootnotetextG,
  reOpenTagFootnotetextNumbered
} from "../common/consts";
import { findEndMarker } from "../common";
import { findOpenCloseTags } from "../utils";
import * as fence from 'markdown-it/lib/rules_block/fence.js'

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
    let fullContent = lineText;
    let hasOpenTag = false;
    let pending = '';
    let terminate = false;
    if (!reOpenTagFootnoteG.test(lineText)) {
      // jump line-by-line until empty one or EOF
      for (; nextLine < endLine; nextLine++) {
        if (fence(state, nextLine, endLine, true)) {
          terminate = true;
        }
        if (terminate) { break; }
        if (state.isEmpty(nextLine)) {
          break
        }
        pos = state.bMarks[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (!lineText || !lineText.trim()) {
          break;
        }
        fullContent += fullContent ? '\n' : '';
        fullContent += lineText;
        if (reOpenTagFootnoteG.test(fullContent)) {
          hasOpenTag = true;
          nextLine += 1;
          break;
        }
      }
      if (!hasOpenTag || nextLine > endLine) {
        return false;
      }
    }
    let dataTags = findOpenCloseTags(fullContent, reOpenTagFootnote, '', '', true);
    if (!dataTags?.arrOpen?.length) {
      return false;
    }
    pending = dataTags.pending;
    let matchNumbered = dataTags.arrOpen[dataTags.arrOpen.length - 1].content
      .match(reOpenTagFootnoteNumbered);
    if (matchNumbered) {
      numbered = matchNumbered.groups.number;
    }
    let startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
    let startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;

    let content = fullContent.slice(startContent);

    let data = findEndMarker(content, -1, '{', '}', true);
    if (data?.res) {
      return false;
    }

    let hasEnd = false;
    let nextLineContent = nextLine;
    let inlineContentAfter = '';
    let openBrackets = 0;
    let contentLength = content.length;
    for (; nextLine <= endLine; nextLine++) {
      if (fence(state, nextLine, endLine, true)) {
        terminate = true;
      }
      if (terminate) { break; }
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
        inlineContentAfter += '\n';
        inlineContentAfter += lineText;
        let nextLineText = nextLine + 1 <= endLine
          ?  state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
          : '';
        if (!nextLineText || !nextLineText.trim()) {
          break
        }
        continue;
      }
      fullContent += '\n';
      fullContent += lineText;
      if (!lineText || !lineText.trim()) {
        pending = '';
      }
      if (pending) {
        dataTags = findOpenCloseTags(fullContent, reOpenTagFootnotetext, '');
        if (!dataTags?.arrOpen?.length) {
          break;
        }
      }
      data = findEndMarker(lineText, -1, '{', '}', true, openBrackets);
      if (data.res) {
        hasEnd = true;
        nextLineContent = nextLine;
        inlineContentAfter = state.src.slice(startPos + startContent + contentLength + 1 + data.nextPos, state.eMarks[nextLine]);
        content += '\n';
        content += data.content;
        openBrackets = 0;
        continue;
      } else {
        if (data.openBrackets) {
          openBrackets = data.openBrackets;
        }
      }
      content += '\n';
      content += lineText;
      contentLength = content ? content.length : 0;
    }
    if (!data || !data.res) {
      return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
      return true;
    }
    state.line = nextLine + 1;
    let inlineContentBefore = startFootnote > 0
      ? state.src.slice(startPos, startPos + startFootnote)
      : '';
    token = state.push('paragraph_open', 'div', 1);
    token.map = [startLine, state.line];

    if (inlineContentBefore?.length && inlineContentBefore?.trim()?.length) {
      token = state.push('inline', '', 0);
      token.map = [startLine, startLine];
      token.content = inlineContentBefore;
      token.bMarks = 0;
      token.eMarks = token.bMarks + token.content.length;
      token.bMarksContent = token.bMarks;
      token.eMarksContent = token.eMarks;
      token.lastBreakToSpace = true;
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
      token.firstBreakToSpace = true;
      token.children = [];
    }
    token = state.push('paragraph_close', 'div', -1);
    return true
  } catch (e) {
    console.log("[ERROR]=>[latex_footnote_block]=>", e)
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
    let fullContent = lineText;
    let hasOpenTag = false;
    let pending = '';
    let terminate = false;
    if (!reOpenTagFootnotetextG.test(lineText)) {
      // jump line-by-line until empty one or EOF
      for (; nextLine < endLine; nextLine++) {
        if (fence(state, nextLine, endLine, true)) {
          terminate = true;
        }
        if (terminate) { break; }
        if (state.isEmpty(nextLine)) {
          break
        }
        pos = state.bMarks[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (!lineText || !lineText.trim()) {
          break;
        }
        fullContent += fullContent ? '\n' : '';
        fullContent += lineText;
        if (reOpenTagFootnotetextG.test(fullContent)) {
          hasOpenTag = true;
          nextLine += 1;
          break;
        }
      }
      if (!hasOpenTag || nextLine > endLine) {
        return false;
      }
    }
    let dataTags = findOpenCloseTags(fullContent, reOpenTagFootnotetext, '', '', true);
    if (!dataTags?.arrOpen?.length) {
      return false;
    }
    pending = dataTags.pending;
    let openTag = dataTags.arrOpen[dataTags.arrOpen.length - 1].content;
    let matchNumbered = openTag
      .match(reOpenTagFootnotetextNumbered);
    if (matchNumbered) {
      numbered = matchNumbered.groups.number;
    }
    let startFootnote = dataTags.arrOpen[dataTags.arrOpen.length - 1].posStart;
    let startContent = dataTags.arrOpen[dataTags.arrOpen.length - 1].posEnd;

    let content = fullContent.slice(startContent);

    let data = findEndMarker(content, -1, '{', '}', true);
    if (data?.res) {
      return false;
    }
    let hasEnd = false;
    let nextLineContent = nextLine;
    let inlineContentAfter = '';
    let openBrackets = 0;
    let contentLength = content.length;
    for (; nextLine <= endLine; nextLine++) {
      if (fence(state, nextLine, endLine, true)) {
        terminate = true;
      }
      if (terminate) { break; }
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
        inlineContentAfter += '\n';
        inlineContentAfter += lineText;
        let nextLineText = nextLine + 1 <= endLine
          ?  state.src.slice(state.bMarks[nextLine + 1], state.eMarks[nextLine + 1])
          : '';
        if (!nextLineText || !nextLineText.trim()) {
          break
        }
        continue;
      }
      fullContent += '\n';
      fullContent += lineText;
      if (!lineText || !lineText.trim()) {
        pending = '';
      }
      if (pending) {
        dataTags = findOpenCloseTags(fullContent, reOpenTagFootnotetext, '');
        if (!dataTags?.arrOpen?.length) {
          break;
        }
      }
      data = findEndMarker(lineText, -1, '{', '}', true, openBrackets);
      if (data.res) {
        hasEnd = true;
        nextLineContent = nextLine;
        inlineContentAfter = state.src.slice(startPos + startContent + contentLength + 1 + data.nextPos, state.eMarks[nextLine]);
        content += '\n';
        content += data.content;
        openBrackets = 0;
        continue;
      } else {
        if (data.openBrackets) {
          openBrackets = data.openBrackets;
        }
      }
      content += '\n';
      content += lineText;
      contentLength = content ? content.length : 0;
    }
    if (!data || !data.res) {
      return false;
    }
    /** For validation mode we can terminate immediately */
    if (silent) {
      return true;
    }
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
      token.lastBreakToSpace = true;
      token.children = [];
    }
    
    token = openTag.indexOf('blfootnotetext') === -1 
      ? state.push('footnotetext_latex', '', 0)
      : state.push('blfootnotetext_latex', '', 0);
    token.numbered = numbered;
    let children = [];
    state.md.block.parse(content, state.md, state.env, children);
    token.children = children;

    if (inlineContentAfter?.length && inlineContentAfter?.trim()?.length) {
      token = state.push('inline', '', 0);
      token.map = [nextLineContent, nextLine + 1];
      token.content = inlineContentAfter;
      token.firstBreakToSpace = true;
      token.children = [];
    }
    if (needToCreateParagraph) {
      token = state.push('paragraph_close', 'div', -1);
    }
    return true
  } catch (e) {
    console.log("[ERROR]=>[latex_footnotetext_block]=>", e)
    return false;
  }
};

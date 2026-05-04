import { Token, RuleBlock, Ruler, StateBlock } from 'markdown-it';
import {
  reFootnoteToken,
  reFootnotetextToken,
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

// Symbol keys: collision-free on StateBlock; invisible to JSON.stringify/Object.keys (use `Object.getOwnPropertySymbols` to inspect).
const FOOTNOTE_POS_KEY = Symbol('mmd.footnoteSrcPositions');
const FOOTNOTETEXT_POS_KEY = Symbol('mmd.footnotetextSrcPositions');
// Helper-owned /g sweeps. lastIndex is reset in the helper before each scan; sync-only.
const FOOTNOTE_TOKEN_SWEEP_G: RegExp = new RegExp(reFootnoteToken.source, 'g');
const FOOTNOTETEXT_TOKEN_SWEEP_G: RegExp = new RegExp(reFootnotetextToken.source, 'g');

type FootnoteCacheEntry = { src: string; lastPos: number };

// Per-state cache of the last match offset (-1 if none). `patternG` MUST be /g.
// Nested `state.md.block.parse(...)` builds a fresh StateBlock with its own src, so the Symbol-keyed cache on the outer state never leaks into nested parses.
const getCachedSrcPositions = (
  state: StateBlock,
  key: symbol,
  patternG: RegExp,
): number => {
  const slot = state as unknown as Record<symbol, FootnoteCacheEntry | undefined>;
  const cached = slot[key];
  // JS strings are immutable — identity check correctly invalidates on any reassignment of `state.src`.
  if (cached && cached.src === state.src) {
    return cached.lastPos;
  }
  patternG.lastIndex = 0;
  let lastPos = -1;
  let m: RegExpExecArray | null;
  while ((m = patternG.exec(state.src)) !== null) {
    lastPos = m.index;
    // Empty-match guard for future regex edits.
    if (m.index === patternG.lastIndex) {
      patternG.lastIndex++;
    }
  }
  patternG.lastIndex = 0;
  slot[key] = { src: state.src, lastPos };
  return lastPos;
};

const getTerminatorRulesForFootnotes = (ruler: Ruler) => {
  const rules = ruler.__rules__;
  let arr: string[] = [
    "table", "smilesDrawerBlock", "collapsible", "fence", "blockquote", "hr",
    "list", "footnote_def", "heading", "svg_block", "html_block", "pageBreaksBlock", "deflist",
    "BeginTable", "BeginAlign", "BeginTabular", "BeginProof",
    "BeginTheorem", "headingSection", "mathMLBlock", "pageBreaksBlock",
    "abstractBlock",
    "image_with_size_block"
  ];
  let res = [];
  if (rules?.length) {
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];
      if (rule.enabled && arr.includes(rule.name)) {
        res.push(rule.fn);
      }
    }
  }
  return res;
}

export const latex_footnote_block: RuleBlock = (state, startLine, endLine, silent) => {
  try {
    let token: Token,
      lineText: string,
      pos: number = state.bMarks[startLine] + state.tShift[startLine],
      max: number = state.eMarks[startLine];
    // Bail when the last `\footnote` literal is strictly before this block's start. Equality keeps the literal in scope (token starts on this block). `-1` from cache means no match anywhere.
    const lastFootnotePos = getCachedSrcPositions(state, FOOTNOTE_POS_KEY, FOOTNOTE_TOKEN_SWEEP_G);
    if (lastFootnotePos < state.bMarks[startLine]) {
      return false;
    }
    let nextLine: number = startLine + 1;
    let startPos = pos;
    let numbered;
    lineText = state.src.slice(pos, max);
    let fullContent = lineText;
    let hasOpenTag = false;
    let pending = '';
    let terminate = false;
    // Literal token can't span `\n` — gate the O(fullContent) regex on per-line presence.
    let sawFootnoteToken: boolean = reFootnoteToken.test(lineText);
    if (!sawFootnoteToken || !reOpenTagFootnoteG.test(lineText)) {
      // Only `fence` terminates here; footnotetext uses full terminator list (pre-existing).
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
        // Two cheap gates (token-seen, `{` present) both must hold before we run the heavy O(fullContent) regex; either gate's `continue` shortcuts to the next line.
        if (!sawFootnoteToken) {
          if (!reFootnoteToken.test(lineText)) {
            continue;
          }
          sawFootnoteToken = true;
        }
        // Opening tag requires `{` — every alternative of the open-tag regex ends with literal `{`.
        // Lines without `{` cannot complete the pattern, so `continue` defers the heavy regex run
        // until a line with `{` arrives. Soundness: `{` cannot straddle a `\n` (it's a single char),
        // so if the pattern matches in `fullContent` after this iteration appended `lineText`, the
        // closing `{` must be present in `lineText` and the gate doesn't lose a match.
        if (!lineText.includes('{')) {
          continue;
        }
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
    // Bail when the last `\footnotetext`/`\blfootnotetext` literal is strictly before this block's start. Equality keeps it in scope. `-1` means no match anywhere.
    const lastFootnotetextPos = getCachedSrcPositions(state, FOOTNOTETEXT_POS_KEY, FOOTNOTETEXT_TOKEN_SWEEP_G);
    if (lastFootnotetextPos < state.bMarks[startLine]) {
      return false;
    }
    let nextLine: number = startLine + 1;
    let startPos = pos;
    let numbered;
    lineText = state.src.slice(pos, max);
    let fullContent = lineText;
    let hasOpenTag = false;
    let pending = '';
    let terminate = false;
    const terminatorRules = getTerminatorRulesForFootnotes(state.md.block.ruler);
    // Literal token can't span `\n` — gate the O(fullContent) regex on per-line presence.
    let sawFootnotetextToken: boolean = reFootnotetextToken.test(lineText);
    if (!sawFootnotetextToken || !reOpenTagFootnotetextG.test(lineText)) {
      // jump line-by-line until empty one or EOF
      for (; nextLine < endLine; nextLine++) {
        for (let i = 0; i < terminatorRules.length; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
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
        // Two cheap gates (token-seen, `{` present) both must hold before we run the heavy O(fullContent) regex; either gate's `continue` shortcuts to the next line.
        if (!sawFootnotetextToken) {
          if (!reFootnotetextToken.test(lineText)) {
            continue;
          }
          sawFootnotetextToken = true;
        }
        // Opening tag requires `{` — skip lines without it (covers `\footnotetext\n…\n{` without rescanning fullContent).
        if (!lineText.includes('{')) {
          continue;
        }
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
    let terminatedLine: number = -1;

    for (; nextLine <= endLine; nextLine++) {
      pos = state.bMarks[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (hasEnd) {
        for (let i = 0; i < terminatorRules.length; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminatedLine = nextLine;
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }

        if (!lineText || !lineText.trim()) {
          terminatedLine = nextLine;
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

    state.line = terminatedLine !== -1
      ? nextLine
      : nextLine + 1;
    let inlineContentBefore = startFootnote > 0 ? state.src.slice(startPos, startPos + startFootnote) : '';
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

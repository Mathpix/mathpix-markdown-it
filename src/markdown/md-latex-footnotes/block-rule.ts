import { Token, RuleBlock, Ruler, StateBlock } from 'markdown-it';
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

// Symbol keys: collision-free namespace on the StateBlock instance — no risk of clashing with future plugins claiming a `__mmd_*` string property.
const FOOTNOTE_POS_KEY = Symbol('mmd.footnoteSrcPositions');
const FOOTNOTETEXT_POS_KEY = Symbol('mmd.footnotetextSrcPositions');
// `(?![a-zA-Z])` anchors the literal token so `\footnotemark` / `\footnotesize` / `\footnotetext` do not match.
const FOOTNOTE_TOKEN_RE: RegExp = /\\footnote(?![a-zA-Z])/;
const FOOTNOTETEXT_TOKEN_RE: RegExp = /\\(?:bl)?footnotetext(?![a-zA-Z])/;
// Owned by `getCachedSrcPositions` (helper resets `lastIndex` before each sweep). Do NOT use these /g constants for ad-hoc `.test()`.
const FOOTNOTE_TOKEN_SWEEP_G: RegExp = new RegExp(FOOTNOTE_TOKEN_RE.source, 'g');
const FOOTNOTETEXT_TOKEN_SWEEP_G: RegExp = new RegExp(FOOTNOTETEXT_TOKEN_RE.source, 'g');

// Per-state cache of `patternG` match positions in `state.src`. `patternG` MUST be a /g regex — without /g, `exec` ignores `lastIndex` and the loop below would never advance. Caller's contract: pass one of the module-local `*_SWEEP_G` constants (both built with /g via `new RegExp(..., 'g')`). Helper resets `lastIndex` on entry so a stale value cannot leak between calls.
const getCachedSrcPositions = (
  state: StateBlock,
  key: symbol,
  patternG: RegExp,
): number[] => {
  const cached = (state as unknown as Record<symbol, unknown>)[key];
  if (Array.isArray(cached)) {
    return cached as number[];
  }
  patternG.lastIndex = 0;
  const positions: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = patternG.exec(state.src)) !== null) {
    positions.push(m.index);
    if (m.index === patternG.lastIndex) {
      patternG.lastIndex++;
    }
  }
  (state as unknown as Record<symbol, number[]>)[key] = positions;
  return positions;
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
    // Skip when the last `\footnote` literal is strictly before this block's start (`<`, not `<=` — `==` keeps the token in scope).
    const positions = getCachedSrcPositions(state, FOOTNOTE_POS_KEY, FOOTNOTE_TOKEN_SWEEP_G);
    if (positions.length === 0 || positions[positions.length - 1] < state.bMarks[startLine]) {
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
    let sawFootnoteToken: boolean = FOOTNOTE_TOKEN_RE.test(lineText);
    if (!sawFootnoteToken || !reOpenTagFootnoteG.test(lineText)) {
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
        // Two cheap gates (token-seen, `{` present) both must hold before we run the heavy O(fullContent) regex; either gate's `continue` shortcuts to the next line.
        if (!sawFootnoteToken) {
          if (!FOOTNOTE_TOKEN_RE.test(lineText)) {
            continue;
          }
          sawFootnoteToken = true;
        }
        // Opening tag requires `{` — skip lines without it (covers `\footnote\n…\n{` without rescanning fullContent).
        if (lineText.indexOf('{') === -1) {
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
    // Skip when the last `\footnotetext`/`\blfootnotetext` literal is strictly before this block's start.
    const positions = getCachedSrcPositions(state, FOOTNOTETEXT_POS_KEY, FOOTNOTETEXT_TOKEN_SWEEP_G);
    if (positions.length === 0 || positions[positions.length - 1] < state.bMarks[startLine]) {
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
    let sawFootnotetextToken: boolean = FOOTNOTETEXT_TOKEN_RE.test(lineText);
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
          if (!FOOTNOTETEXT_TOKEN_RE.test(lineText)) {
            continue;
          }
          sawFootnotetextToken = true;
        }
        // Opening tag requires `{` — skip lines without it (covers `\footnotetext\n…\n{` without rescanning fullContent).
        if (lineText.indexOf('{') === -1) {
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

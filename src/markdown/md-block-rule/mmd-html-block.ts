import { RuleBlock } from "markdown-it";
import { HTML_SEQUENCES, selfClosingTags } from "../common/html-re";

const VOID_TAGS = new Set(selfClosingTags);

const makeTagRegexes = (tag: string) => ({
  OPEN_ANY:               new RegExp(`<${tag}\\b`, 'gi'),
  SELF_CLOSING_ONELINE:   new RegExp(`^<${tag}\\b[^>]*\\/\\s*>\\s*$`, 'i'),
  VOID_ONELINE:           new RegExp(`^<${tag}\\b[^>]*>\\s*$`, 'i'),
  CLOSE_ONELINE:          new RegExp(`^</${tag}\\s*>\\s*$`, 'i'),
  SELF_CLOSING_INLINE:    new RegExp(`<${tag}\\b[^>]*\\/\\s*>`, 'gi'),
  CLOSE_ANY:              new RegExp(`</${tag}\\s*>`, 'gi'),
});

const netDepthDelta = (line: string, rx: ReturnType<typeof makeTagRegexes>): number => {
  const opens       = (line.match(rx.OPEN_ANY) || []).length;
  const selfClosing = (line.match(rx.SELF_CLOSING_INLINE) || []).length;
  const closes      = (line.match(rx.CLOSE_ANY) || []).length;
  return (opens - selfClosing) - closes;
};

export const mmdHtmlBlock: RuleBlock = (state, startLine, endLine, silent): boolean => {
  var i, nextLine, token, lineText,
    pos = state.bMarks[startLine] + state.tShift[startLine],
    max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  // HTML is allowed and the line starts with '<'
  if (!state.md.options.html || state.md.options.htmlDisableTagMatching) return false;
  if (state.src.charCodeAt(pos) !== 0x3C /* < */) return false;

  lineText = state.src.slice(pos, max);
  // Find the matching sequence
  let openTag: RegExp | undefined;
  for (i = 0; i < HTML_SEQUENCES.length; i++) {
    openTag = HTML_SEQUENCES[i][0];
    if (openTag.test(lineText)) {
      break;
    }
  }
  if (i === HTML_SEQUENCES.length  || !openTag) return false;

  let match = lineText.match(openTag);
  if (!match) {
    return false;
  }

  // Tag name may be missing for comments/CDATA/PI
  const tagName = (match[1] || '').toLowerCase();
  nextLine = startLine + 1;

  // for "nameless" (comments/CDATA/PI)
  if (!tagName) {
    const closeTag = HTML_SEQUENCES[i][1] as RegExp | string;
    const closeRe = closeTag instanceof RegExp ? closeTag : null;

    if (closeRe) {
      // find the FIRST closing (--> or >) on the same line
      closeRe.lastIndex = 0;
      const m = closeRe.exec(lineText);
      if (m) {
        const after = lineText.slice(m.index + m[0].length);
        if (/\S/.test(after)) {
          // there is a non-empty tail we give to inline rules
          return false;
        }
        // otherwise - a single html_block in one line
        if (silent) return HTML_SEQUENCES[i][2];
        state.line = startLine + 1;
        const token = state.push('html_block', '', 0);
        token.map = [startLine, state.line];
        token.content = state.getLines(startLine, state.line, state.blkIndent, true);
        return true;
      }
    }

    // otherwise scan down to close
    let hasClose = false;
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) break;
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (closeRe && closeRe.test(lineText)) {
        hasClose = true;
        if (lineText.length !== 0) nextLine++;
        break;
      }
    }
    if (!hasClose) return false;
    if (silent) return HTML_SEQUENCES[i][2];

    state.line = nextLine;
    const token = state.push('html_block', '', 0);
    token.map = [startLine, nextLine];
    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
    return true;
  }

  const RX = makeTagRegexes(tagName);

  // - self-closing on line OR void tag one on line
  const isSelfClosingLine = RX.SELF_CLOSING_ONELINE.test(lineText);
  const isVoidAlone       = VOID_TAGS.has(tagName) && RX.VOID_ONELINE.test(lineText);

  if (isSelfClosingLine || isVoidAlone) {
    if (silent) return HTML_SEQUENCES[i][2];
    state.line = nextLine;
    const token = state.push('html_block', '', 0);
    token.map = [startLine, nextLine];
    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
    return true;
  }

  // pair <tag>…</tag> on one line → let it process the inline rule
  if (RX.CLOSE_ANY.test(lineText) && netDepthDelta(lineText, RX) <= 0) {
    return false;
  }

  let openDepth = netDepthDelta(lineText, RX);
  let hasCloseTag = false;
  if (!RX.CLOSE_ONELINE.test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) break;

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      openDepth += netDepthDelta(lineText, RX);

      if (openDepth <= 0) {
        hasCloseTag = true;
        if (lineText.length !== 0) nextLine++;
        break;
      }
    }
  } else {
    // closing on the same line, but there was more than one opening (nesting)
    hasCloseTag = openDepth <= 0;
  }

  if (!hasCloseTag) {
    return false;
  }
  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return HTML_SEQUENCES[i][2];
  }

  state.line = nextLine;
  token         = state.push('html_block', '', 0);
  token.map     = [ startLine, nextLine ];
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
  return true;
}

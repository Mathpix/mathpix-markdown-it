import { MarkdownIt, RuleBlock } from 'markdown-it';
import convertSvgToBase64 from "./convert-scv-to-base64";

const HTML_SEQUENCES = [
  [/^<(svg)(?=(\s|>|$))/i, /<\/(svg)>/i, true],
];
const openTag = /^<(svg)(?=(\s|>|$))/i;
const closeTag = /<\/(svg)>/i;

const svgToBase64Block: RuleBlock = (state, startLine, endLine, silent) => {
  let i, nextLine, token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (!state.md.options.html) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
    return false;
  }
  lineText = state.src.slice(pos, max);
  for (i = 0; i < HTML_SEQUENCES.length; i++) {
    if (openTag.test(lineText)) {
      break;
    }
  }
  if (i === HTML_SEQUENCES.length) {
    return false;
  }
  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return HTML_SEQUENCES[i][2];
  }
  nextLine = startLine + 1;
  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  if (!closeTag.test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (closeTag.test(lineText)) {
        if (lineText.length !== 0) {
          nextLine++;
        }
        break;
      }
    }
  }
  state.line = nextLine;
  token = state.push('html_inline', '', 0);
  const content = state.getLines(startLine, nextLine, state.blkIndent, true);
  token.content = convertSvgToBase64(content);
  token.map = [startLine, nextLine];
  return true;
};
export default (md: MarkdownIt, options) => {
  Object.assign(md.options, options);

  md.block.ruler.before('html_block', 'svgToBase64Block', svgToBase64Block, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });
};

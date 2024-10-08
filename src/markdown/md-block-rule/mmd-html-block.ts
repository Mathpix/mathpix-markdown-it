import { RuleBlock } from "markdown-it";
import {HTML_SEQUENCES, selfClosingTags} from "../common/html-re";

export const mmdHtmlBlock: RuleBlock = (state, startLine, endLine, silent): boolean => {
  var i, nextLine, token, lineText,
    pos = state.bMarks[startLine] + state.tShift[startLine],
    max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (!state.md.options.html ||
    state.md.options.htmlDisableTagMatching ||
    state.src.charCodeAt(pos) !== 0x3C/* < */
  ) {
    return false;
  }

  lineText = state.src.slice(pos, max);
  let openTag: any;
  for (i = 0; i < HTML_SEQUENCES.length; i++) {
    openTag = HTML_SEQUENCES[i][0];
    if (openTag.test(lineText)) {
      break;
    }
  }

  if (i === HTML_SEQUENCES.length) {
    return false;
  }

  let match = lineText.match(openTag);
  if (!match) {
    return false;
  }
  nextLine = startLine + 1;
  if ((match?.length > 2 && (match[2] === '/>' || match[2] === "/"))
    || selfClosingTags.includes(match[1])) {
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

  let openTagNext: any = HTML_SEQUENCES[i][1]
    ? HTML_SEQUENCES[i][0]
    : new RegExp('^(?:<' + match[1] + '\\s*>)');

  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  let closeTag: any = HTML_SEQUENCES[i][1]
    ? HTML_SEQUENCES[i][1]
    : new RegExp('^(?:<\\/' + match[1] + '\\s*>)');
  if (!closeTag) {
    return false;
  }
  /* TODO: Check nested tags */
  let hasCloseTag = false;
  let openTagCount = 1;
  if (!closeTag.test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (openTagNext.test(lineText)) {
        openTagCount++;
        continue;
      }
      if (closeTag.test(lineText)) {
        if (lineText.length !== 0) { nextLine++; }
        openTagCount--;
        if (openTagCount === 0) {
          hasCloseTag = true;
          break;
        }
      }
    }
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

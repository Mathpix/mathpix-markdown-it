import { HTML_SEQUENCES } from "../common/html-re";
export const mmdHtmlBlock = (state, startLine, endLine, silent) => {
  var i, nextLine, token, lineText,
    pos = state.bMarks[startLine] + state.tShift[startLine],
    max = state.eMarks[startLine];
  debugger

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (!state.md.options.html) {
    return false;
  }
  if (state.md.options.htmlDisableTagMatching) {
    return false;
  }

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) {
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
  if (match?.length > 2 && (match[2] === '/>' || match[2] === "/")) {
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
  if (!closeTag.test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (closeTag.test(lineText)) {
        if (lineText.length !== 0) { nextLine++; }
        hasCloseTag = true;
        break;
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

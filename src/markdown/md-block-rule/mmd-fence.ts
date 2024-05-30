import { RuleBlock, StateBlock, Token } from 'markdown-it';
import {
  getSeparatingSpanFromString,
  IContentAndSeparatingSpan,
  ISeparatingSpan,
  removeSeparatingSpanFromContent
} from "../common/separating-span";

// fences (``` lang, ~~~ lang)
export const fenceBlock: RuleBlock = (
  state: StateBlock,
  startLine: number,
  endLine: number,
  silent: boolean
): boolean => {
  let pos: number = state.bMarks[startLine] + state.tShift[startLine];
  let max: number = state.eMarks[startLine];
  let dataSeparatingSpan: ISeparatingSpan[] = [];
  const previewUuid: string = state.md.options?.previewUuid;

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (pos + 3 > max) {
    return false;
  }
  const marker: number = state.src.charCodeAt(pos);
  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
    return false;
  }
  // scan marker length
  let mem: number = pos;
  pos = state.skipChars(pos, marker);
  let len: number = pos - mem;
  if (len < 3) {
    return false;
  }
  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max);
  if (marker === 0x60 /* ` */) {
    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
      return false;
    }
  }
  // Since start is found, we can report success here in validation mode
  if (silent) {
    return true;
  }

  let nextLine: number = startLine;
  let haveEndMarker: boolean = false;
  // search end of block
  while (++nextLine < endLine) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }
    if (state.src.charCodeAt(pos) !== marker) {
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue;
    }
    pos = state.skipChars(pos, marker);
    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) {
      continue;
    }
    // make sure tail has spaces only
    pos = state.skipSpaces(pos);
    let strAfterCloseTag = state.src.slice(pos, max);
    if (strAfterCloseTag?.length > 0) {
      dataSeparatingSpan = getSeparatingSpanFromString(strAfterCloseTag, 0, [], previewUuid);
      if (dataSeparatingSpan?.length > 0) {
        pos += dataSeparatingSpan[dataSeparatingSpan.length - 1].nextPos;
      }
    }
    if (pos < max) {
      continue;
    }
    haveEndMarker = true;
    // found!
    break;
  }
  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine];
  state.line = nextLine + (haveEndMarker ? 1 : 0);
  let content: string = state.getLines(startLine + 1, nextLine, len, true);
  const dataContent: IContentAndSeparatingSpan = removeSeparatingSpanFromContent(content, previewUuid);

  let token: Token = state.push('fence', 'code', 0);
  token.info = params;
  token.content = dataContent.content;
  token.contentSpan = dataContent.contentSpan;
  token.contentFull = content;
  token.markup = markup;
  token.map = [ startLine, state.line ];

  if (dataSeparatingSpan?.length) {
    for (let i = 0; i < dataSeparatingSpan.length; i++) {
      token = state.push('inline', '', 0);
      token.content = dataSeparatingSpan[i].content;
      token.children = [];
    }
  }

  return true;
};
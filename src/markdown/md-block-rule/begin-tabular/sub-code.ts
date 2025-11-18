import { generateUniqueId, getContent } from "./common";
import { getMathTableContent, mathTablePush } from "./sub-math";
import {
  BEGIN_LST_RE,
  doubleAngleBracketUuidPattern, END_LST_RE,
  singleAngleBracketPattern
} from "../../common/consts";

type TExtractedCodeBlock = {id: string, content: string}
var extractedCodeBlocks: Array<TExtractedCodeBlock> = [];

/**
 * Clear all previously extracted code blocks.
 */
export const ClearExtractedCodeBlocks = (): void => {
  extractedCodeBlocks = [];
};

/**
 * Add a single extracted code block to the internal storage.
 */
export const addExtractedCodeBlock = (item: TExtractedCodeBlock) => {
  extractedCodeBlocks.push(item)
}

/**
 * Replace placeholder markers (e.g. <<uuid>> or <uuid>) in a string
 * with the corresponding extracted code block content.
 *
 * Returns the updated string with placeholders resolved and post-processed
 * by `getContent`.
 */
export const getExtractedCodeBlockContent = (inputStr: string, i: number): string => {
  let sub: string = inputStr;
  let resContent: string = sub;
  sub = sub.trim();
  let cellM: Array<string> =  sub.slice(i).match(doubleAngleBracketUuidPattern);
  cellM =  cellM ? cellM : sub.slice(i).match(singleAngleBracketPattern);
  if (!cellM) {
    return inputStr;
  }
  for (let j = 0; j < cellM.length; j++) {
    let content: string = cellM[j].replace(/</g, '').replace(/>/g, '');
    const index: number = extractedCodeBlocks.findIndex(item => item.id === content);
    if (index >= 0) {
      let iB: number = resContent.indexOf(cellM[j]);
      resContent = resContent.slice(0, iB) + extractedCodeBlocks[index].content + resContent.slice(iB + cellM[j].length);
    }
  }
  resContent = getContent(resContent);
  return resContent;
};

/**
 * Post-process inline code-like items in an array of results:
 * for items of the given `type` replace their content using
 * `getMathTableContent`.
 */
export const codeInlineContent = (res, type: string = 'inline') => {
  res
    .map(item => {
      if (item.type === type) {
        const code = getMathTableContent(item.content, 0);
        item.content = code ? code : item.content
      }
      return item
    });
  return res;
};

/**
 * Save a code block to the extracted table and return a unique
 * placeholder of the form `<<id>>` to be used in the text.
 */
const saveBlockAndPlaceholder = (blockText: string): string => {
  const id: string = generateUniqueId();
  addExtractedCodeBlock({ id, content: blockText });
  return `<<${id}>>`;
}

/**
 * Hide markdown fenced blocks and LaTeX `lstlisting` environments
 * by replacing them with unique placeholders.
 *
 * - Scans the input line-by-line.
 * - Respects Markdown fence rules (≤3 leading spaces).
 * - Supports nested `lstlisting` environments of the same name.
 */
const getSubCodeBlock = (input: string): string => {
  let result: string = '';
  let pos: number = 0;
  const len: number = input.length;

  // markdown fence state
  let inFenceBlock: boolean = false;
  let fenceChar: '`' | '~' | '' = '';
  let fenceLen: number = 0;
  let fenceIndent: number = 0;
  let fenceStart: number = 0;

  // lstlisting state (supports nesting of lstlisting only)
  let inLstlisting: boolean = false;
  let lstDepth: number = 0;
  let lstStart: number = 0;

  const nextLineEnd = (pos: number): number => {
    const nl: number = input.indexOf('\n', pos);
    return nl === -1 ? len : nl + 1;
  };

  // slice "core" of a line: strip leading spaces/tabs and trailing CR/LF only
  const sliceLineCore = (from: number, to: number) => {
    let r = to;
    if (r > from && input.charCodeAt(r - 1) === 0x0A) r--; // \n
    if (r > from && input.charCodeAt(r - 1) === 0x0D) r--; // \r
    let l = from;
    while (l < r) {
      const ch = input.charCodeAt(l);
      if (ch === 0x20 || ch === 0x09) l++; else break; // space/tab
    }
    return input.slice(l, r);
  };

  // fence-opening at the beginning of the line (taking into account ≤3 spaces)
  function matchFenceOpenAtBOL(lineStart: number, lineEnd: number) {
    let p: number = lineStart;
    let indent: number = 0;
    while (p < lineEnd && (input[p] === ' ' || input[p] === '\t')) { indent++; p++; }
    if (indent > 3) return null;

    const ch: string = input[p];
    if (ch !== '`' && ch !== '~') return null;

    let k: number = p;
    while (k < lineEnd && input[k] === ch) k++;
    const markerLen: number = k - p;
    if (markerLen < 3) return null;

    return { ch: ch as '`'|'~', len: markerLen, indent };
  }

  // fence-closing (line starts with ≤indent spaces + ≥len of the same character)
  function isFenceCloseAtBOL(lineStart: number, lineEnd: number): boolean {
    let p: number = lineStart;
    let indent: number = 0;
    while (p < lineEnd && (input[p] === ' ' || input[p] === '\t')) { indent++; p++; }
    if (indent > fenceIndent) return false;
    let k: number = p;
    let cnt: number = 0;
    while (k < lineEnd && input[k] === fenceChar) { cnt++; k++; }
    return cnt >= fenceLen;
  }

  // ONLY lstlisting begin/end (line-level)
  const isLstBeginLine = (lineStart: number, lineEnd: number): boolean => {
    const core: string = sliceLineCore(lineStart, lineEnd);
    return BEGIN_LST_RE.test(core);
  };

  const isLstEndLine = (lineStart: number, lineEnd: number): boolean => {
    const core: string = sliceLineCore(lineStart, lineEnd);
    return END_LST_RE.test(core);
  };

  while (pos < len) {
    const lineStart: number = pos;
    const lineEnd: number = nextLineEnd(pos);

    if (inFenceBlock) {
      if (isFenceCloseAtBOL(lineStart, lineEnd)) {
        const block: string = input.slice(fenceStart, lineEnd);
        result += saveBlockAndPlaceholder(block);
        pos = lineEnd;
        inFenceBlock = false;
        fenceChar = '';
        fenceLen = 0;
        fenceIndent = 0;
        continue;
      }
      pos = lineEnd;
      continue;
    }

    if (inLstlisting) {
      if (isLstBeginLine(lineStart, lineEnd)) {
        lstDepth++;
        pos = lineEnd;
        continue;
      }
      if (isLstEndLine(lineStart, lineEnd)) {
        lstDepth--;
        pos = lineEnd;
        if (lstDepth === 0) {
          const block: string = input.slice(lstStart, pos);
          result += saveBlockAndPlaceholder(block);
          inLstlisting = false;
          lstStart = 0;
        }
        continue;
      }
      pos = lineEnd;
      continue;
    }

    // outside blocks: check openings
    if (isLstBeginLine(lineStart, lineEnd)) {
      inLstlisting = true;
      lstDepth = 1;
      lstStart = lineStart;
      pos = lineEnd;
      continue;
    }

    const fenceOpen = matchFenceOpenAtBOL(lineStart, lineEnd);
    if (fenceOpen) {
      inFenceBlock = true;
      fenceChar = fenceOpen.ch;
      fenceLen = fenceOpen.len;
      fenceIndent = fenceOpen.indent;
      fenceStart = lineStart;
      pos = lineEnd;
      continue;
    }

    result += input.slice(lineStart, lineEnd);
    pos = lineEnd;
  }

  if (inFenceBlock) {
    result += input.slice(fenceStart);
  }
  if (inLstlisting) {
    result += input.slice(lstStart);
  }
  return result;
};

export const getSubCode = (str: string): string => {
  let c = '';
  let str2 = '';
  str = getSubCodeBlock(str);


  for (let ii = 0; ii< str.length; ii++) {
    if (str.charCodeAt(ii) === 0x60) {
      if (str.charCodeAt(ii+1) === 0x60) {
        ii += 1;
      }
      if (c.length === 0) {
        c += str[ii]
      } else {
        c += str[ii]
        const id: string = generateUniqueId();
        mathTablePush({id: id, content: c})
        str2 += `{${id}}`;
        c = ''
      }
    }
    if (c && str.charCodeAt(ii) !== 0x60) {
      c += str[ii]
    }
    if (c.length === 0 && str.charCodeAt(ii) !== 0x60) {
      str2 += str[ii];
    }
  }
  str2 += c;
  return str2;
};

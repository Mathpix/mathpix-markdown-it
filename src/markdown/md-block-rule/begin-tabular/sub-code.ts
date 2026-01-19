import { generateUniqueId } from "./common";
import { getInlineCodeListFromString, InlineCodeItem } from "../../common";
import {
  findPlaceholders,
  placeholderToId,
  getInlineContextAroundSpan,
  wrapWithNewlinesIfInline
} from "./placeholder-utils";
const CODE_FENCE = '```';
const CODE_FENCE_RE = /```/;

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
 * Replace placeholder markers (<<id>> / <id>) with extracted code block content.
 * Newline-wrapping is applied ONLY when injected content contains BEGIN_LIST_ENV_INLINE_RE.
 * Note: does NOT call getContent; callers should normalize once at the end.
 */
export const getExtractedCodeBlockContent = (inputStr: string, i: number): string => {
  let resContent: string = inputStr;
  const cellM: RegExpMatchArray = findPlaceholders(resContent, i);
  if (!cellM) {
    return inputStr;
  }
  for (let j = 0; j < cellM.length; j++) {
    const placeholder: string = cellM[j];
    const id: string = placeholderToId(placeholder);
    if (!id) {
      continue;
    }
    const index: number = extractedCodeBlocks.findIndex((item) => item.id === id);
    if (index < 0) {
      continue;
    }
    const start: number = resContent.indexOf(placeholder);
    if (start === -1) {
      continue;
    }
    const original: string = extractedCodeBlocks[index].content ?? "";
    const end: number = start + placeholder.length;
    // expand nested placeholders first
    let injected: string = getExtractedCodeBlockContent(original, 0);
    // decide wrapping based on inline neighbors
    const { beforeNonSpace, afterNonSpace } = getInlineContextAroundSpan(resContent, start, end);
    injected = wrapWithNewlinesIfInline(injected, beforeNonSpace, afterNonSpace);
    resContent = resContent.slice(0, start) + injected + resContent.slice(end);
  }
  return resContent;
};

/**
 * Post-process inline code-like items in an array of results:
 * for items of the given `type` replace their content using
 * `getExtractedCodeBlockContent`.
 */
export const codeInlineContent = (res, type: string = 'inline') => {
  res
    .map(item => {
      if (item.type === type) {
        const code = getExtractedCodeBlockContent(item.content, 0);
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
 * Replaces all top-level ```...``` code blocks in the string with placeholders,
 * storing the original blocks via saveBlockAndPlaceholder.
 *
 * @param str - Source string that may contain fenced code blocks.
 * @returns String with all fenced code blocks replaced by placeholders.
 */
const getSubCodeBlock = (str: string): string => {
  let result = str;
  while (true) {
    const match = CODE_FENCE_RE.exec(result);
    if (!match) {
      // no more opening fences
      break;
    }
    const start = match.index;
    const end = result.indexOf(CODE_FENCE, start + CODE_FENCE.length);
    // no closing fence – stop processing to avoid breaking the rest of the text
    if (end === -1) {
      break;
    }
    const block = result.slice(start, end + CODE_FENCE.length);
    const placeholder = saveBlockAndPlaceholder(block);
    result =
      result.slice(0, start) +
      placeholder +
      result.slice(end + CODE_FENCE.length);
    // reset lastIndex so that the search starts over again on the updated string
    CODE_FENCE_RE.lastIndex = 0;
  }
  return result;
};

/**
 * Replaces all inline code spans in the given string with `{id}` placeholders
 * and stores the original code in an external table via `mathTablePush`.
 *
 * Flow:
 *  1. First hides fenced/LaTeX code blocks via `getSubCodeBlock`.
 *  2. Then finds inline code spans (e.g. `...` or ``...``) with
 *     `getInlineCodeListFromString`.
 *  3. For each span: generates an id, pushes `{ id, content }` to math table,
 *     and replaces the span in the text with `{id}`.
 *
 * @param input - Original source string.
 * @returns String where inline code is replaced by `{id}` placeholders.
 */
export const getSubCode = (input: string): string => {
  const withBlocksHidden = getSubCodeBlock(input);
  const inlineCodes: InlineCodeItem[] = getInlineCodeListFromString(withBlocksHidden);
  if (!inlineCodes || inlineCodes.length === 0) {
    return withBlocksHidden;
  }
  inlineCodes.sort((a: InlineCodeItem, b: InlineCodeItem) => a.posStart - b.posStart);
  let result: string = '';
  let cursor: number = 0;
  for (const item of inlineCodes) {
    if (cursor < item.posStart) {
      result += withBlocksHidden.slice(cursor, item.posStart);
    }
    const codeContent = item.content;
    result += saveBlockAndPlaceholder(codeContent);
    cursor = item.posEnd;
  }
  if (cursor < withBlocksHidden.length) {
    result += withBlocksHidden.slice(cursor);
  }
  return result;
};

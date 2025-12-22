import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import {
  setTokenListItemOpenBlock,
  processListChildToken
} from "./latex-list-tokens";
import { SetTokensBlockParse } from "../md-block-rule/helper";
import { ListItemsResult, ParsedListItem, ListInlineContext } from "./latex-list-types";
import {
  END_LIST_ENV_INLINE_RE,
  LATEX_ITEM_COMMAND_RE,
  LATEX_BLOCK_ENV_OPEN_RE,
} from "../common/consts";

/**
 * Processes block-style LaTeX list items by parsing their content
 * using the block parser. This is used for items whose content
 * contains block environments (e.g., \begin{table}, \begin{figure}, etc.).
 *
 * @param state - Markdown-It processing state
 * @param items - Array of parsed list items
 */
export const ListItemsBlock = (
  state: any,
  items: ParsedListItem[] | null | undefined
): void => {
  if (!items || items.length === 0) {
    return;
  }
  for (const item of items) {
    const rawContent: string = item?.content ?? '';
    const itemContent: string = rawContent.trim();
    SetTokensBlockParse(state, itemContent, {
      startLine: item.startLine,
      endLine: item.endLine + 1,
      disableBlockRules: true
    });
  }
};

/**
 * Processes LaTeX list items and generates Markdown-It tokens
 * for both inline content and nested list structures.
 *
 * @param state - Markdown-It list processing state
 * @param items - Parsed list items from LaTeX environment
 * @param itemizeLevelTokens - Current itemize nesting level
 * @param enumerateLevelTypes - Current enumerate nesting level
 * @param li - Optional starting value for enumerate items
 * @param iOpen - Current count of open list environments
 * @param itemizeLevelContents - Itemize content depth level
 *
 * @returns {ListItemsResult} Updated open-list count and computed padding
 */
export const ListItems = (
  state: StateBlock | StateInline,
  items: ParsedListItem[],
  itemizeLevelTokens: Token[][],
  enumerateLevelTypes: string[],
  li: { value: number } | null,
  iOpen: number,
  itemizeLevelContents: string[]
): ListItemsResult => {
  let padding = 0;
  if (!items || items.length === 0) {
    return { iOpen, padding };
  }
  for (const listItem of items) {
    state.env.parentType = state.parentType;
    state.env.isBlock = true;
    state.env.prentLevel = state.prentLevel;
    listItem.content = listItem.content.trim();
    // Detect block-level item content
    if (LATEX_BLOCK_ENV_OPEN_RE.test(listItem.content) || (listItem.content.indexOf('`') > -1)) {
      let match: RegExpMatchArray = listItem.content.match(LATEX_ITEM_COMMAND_RE);
      if (match) {
        setTokenListItemOpenBlock(state, listItem.startLine, listItem.endLine + 1, match[1], li, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
        if (li && li.hasOwnProperty('value')) {
          li = null;
        }
        const rawContent: string = listItem?.content?.slice(match.index + match[0].length) ?? '';
        const blockContent: string = rawContent.trim();
        SetTokensBlockParse(state, blockContent, {disableBlockRules: true});
        continue;
      }
    }
    // Parse inline children
    let inlineChildren = [];
    state.md.inline.parse(listItem.content.trim(), state.md, state.env, inlineChildren);
    // Context shared across child token processing
    const ctx: ListInlineContext = { li, padding, iOpen, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents };
    // Process each inline child token
    for (const child of inlineChildren) {
      processListChildToken(state, listItem, child, ctx);
    }
    // Update context after processing children
    li = ctx.li;
    padding = ctx.padding;
    iOpen = ctx.iOpen;
    state.env.isBlock = false;
  }
  return {
    iOpen: iOpen,
    padding: padding
  };
};

/**
 * Splits a line of LaTeX list content into logical items based on `\item`
 * and appends them to the given `items` array.
 *
 * Special handling:
 * - If `\item` appears in the middle of the line and both the prefix and
 *   suffix contain backticks, the whole line is treated as a continuation
 *   of the previous item.
 * - Otherwise, text before `\item` is appended to the previous item
 *   (if any), and the rest is processed recursively as a new item segment.
 *
 * The function mutates and also returns the `items` array for convenience.
 *
 * @param items - Accumulator of parsed list items
 * @param content - Current line content
 * @param startLine - Line number where this piece starts
 * @param endLine - Line number where this piece ends
 * @returns The updated array of parsed list items
 */
export const ItemsListPush = (
  items: ParsedListItem[],
  content: string,
  startLine: number,
  endLine: number
): ParsedListItem[] => {
  const index: number = content.indexOf('\\item');
  // No "\item" in the line or at the very start: treat whole line as one chunk
  if (index <= 0) {
    items.push({ content, startLine, endLine });
    return items;
  }
  const before: string = content.slice(0, index);
  const after: string = content.slice(index);
  const hasBacktickBefore: boolean = before.includes("`");
  const hasBacktickAfter: boolean = after.includes("`");
  // Case 1: both parts contain backticks → treat as continuation of previous item
  if (hasBacktickBefore && hasBacktickAfter) {
    if (items.length > 0) {
      const lastIndex: number = items.length - 1;
      items[lastIndex].content += "\n" + content;
      items[lastIndex].endLine += 1;
    } else {
      items.push({ content, startLine, endLine });
    }
    return items;
  }
  // Case 2: normal case with "\item" in the middle
  if (items.length > 0) {
    // Append prefix to previous item
    const lastIndex: number = items.length - 1;
    items[lastIndex].content += "\n" + before;
    items[lastIndex].endLine += 1;
  } else if (before.trim().length > 0) {
    // No previous items: keep prefix as a separate item
    items.push({ content: before, startLine, endLine });
  }
  // Recursively process the remaining part starting from "\item"
  return ItemsListPush(items, after, startLine, endLine);
};

/**
 * Appends the given line to the previous parsed list item if it exists,
 * or creates a new list item from the line if the list is empty and
 * the line is not an inline list environment closing command.
 *
 * This is used to merge continuation lines into the last list item.
 *
 * @param items - Accumulated list of parsed items
 * @param lineText - Current line text to append or add as a new item
 * @param nextLine - Line number of the current line
 * @returns The updated list of parsed items
 */
export const ItemsAddToPrev = (
  items: ParsedListItem[],
  lineText: string,
  nextLine: number
): ParsedListItem[] => {
  if (items.length > 0) {
    const lastIndex = items.length - 1;
    items[lastIndex].content += "\n" + lineText;
    items[lastIndex].endLine = nextLine;
    return items;
  }
  // No previous items: optionally create a new item,
  // but skip pure inline end-of-list commands.
  if (!END_LIST_ENV_INLINE_RE.test(lineText)) {
    ItemsListPush(items, lineText, nextLine, nextLine);
  }
  return items;
};

export const finalizeListItems = (
  state: StateBlock | StateInline,
  items: ParsedListItem[],
  itemizeLevelTokens: Token[][],
  enumerateLevelTypes: string[],
  li: { value: number } | null,
  iOpen: number,
  itemizeLevelContents: string[],
  tokenStart: Token | null
) =>  {
  const dataItems: ListItemsResult = ListItems(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents);
  if (tokenStart) {
    const p = tokenStart;
    if (!p.padding || p.padding < dataItems.padding) {
      p.padding = dataItems.padding;
      if (p.padding > 3) {
        p.attrSet("data-padding-inline-start", String(dataItems.padding * 14));
      }
    }
  }
  return {
    iOpen: dataItems.iOpen,
    items: [],
    li: null,
  };
}

export const splitInlineListEnv = (
  lineText: string,
  match
) => {
  const sB: string = match.index! > 0 ? lineText.slice(0, match.index).trim() : "";
  const sE: string = match.index! + match[0].length < lineText.length
    ? lineText.slice(match.index! + match[0].length).trim()
    : "";
  const isBacktickEscapedPair: boolean = sB.includes("`") && sE.includes("`");
  return { sB, sE, isBacktickEscapedPair };
}

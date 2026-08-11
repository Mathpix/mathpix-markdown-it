import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import {
  setTokenListItemOpenBlock,
  wrapLooseRun,
  processListChildToken,
  computeMarkerPadding
} from "./latex-list-tokens";
import { SetTokensBlockParse } from "../md-block-rule/helper";
import {
  LIST_DEFAULT_INDENT_EM,
  LIST_MAX_INDENT_EM,
  END_LIST_ENV_INLINE_RE,
  LATEX_ITEM_COMMAND_RE,
  LATEX_ITEM_SPLIT_RE,
  LATEX_BLOCK_ENV_OPEN_RE,
} from "../common/consts";
import { getCurrentListLevelState } from "./list-state";
import { ListItemsResult, ParsedListItem, ListInlineContext } from "./latex-list-types";
import { warnDistinct } from "../common/warn-distinct";

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
  itemizeLevelContents: string[],
  openTokens: Token[],
  allListTokens: Token[]
): ListItemsResult => {
  if (!items || items.length === 0) {
    return { iOpen };
  }
  for (const listItem of items) {
    state.env.parentType = state.parentType;
    state.env.isBlock = true;
    state.env.prentLevel = state.prentLevel;
    state.env.inheritedListType = state.parentType;
    listItem.content = listItem.content.trim();
    // A chunk with no `\item` of its own, before the first one: its tokens went straight into the
    // `<ul>`. Wrapped after they are emitted, below — a chunk that emits nothing gets no `<li>`.
    const looseFrom: number = openTokens.length > 0
      && !LATEX_ITEM_COMMAND_RE.test(listItem.content)
      && !getCurrentListLevelState()?.openItems
      ? state.tokens.length
      : -1;
    // Detect block-level item content: a LaTeX block env, a backtick (code span/fence), or a tilde fence.
    if (LATEX_BLOCK_ENV_OPEN_RE.test(listItem.content) || listItem.content.indexOf('`') > -1 || listItem.content.indexOf('~~~') > -1) {
      let match: RegExpMatchArray = listItem.content.match(LATEX_ITEM_COMMAND_RE);
      if (match) {
        const itemToken = setTokenListItemOpenBlock(state, listItem.startLine, listItem.endLine + 1, match[1], li, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
        // Block items skip the inline path, so measure the marker here too — attribute to the
        // innermost open list (this item's list), not always the outer one.
        if (itemToken.hasOwnProperty('marker')) {
          const paddingChild: number = computeMarkerPadding(itemToken.markerTokens);
          const top: Token = openTokens[openTokens.length - 1];
          if (top && (!top.padding || top.padding < paddingChild)) {
            top.padding = paddingChild;
          }
        }
        if (li && li.hasOwnProperty('value')) {
          li = null;
        }
        const rawContent: string = listItem?.content?.slice(match.index + match[0].length) ?? '';
        const blockContent: string = rawContent.trim();
        SetTokensBlockParse(state, blockContent, {disableBlockRules: true});
        // Clears isBlock after the *last* block item; for earlier ones the next iteration sets it
        // back. The Lists rule's finally is the actual guarantee — do not drop it for this line.
        state.env.isBlock = false;
        continue;
      }
      // No marker here — the chunk follows a closed nested list, or precedes the first `\item`.
      // Same path as the marker case above, so a block env renders alike wherever it sits.
      if (LATEX_BLOCK_ENV_OPEN_RE.test(listItem.content)) {
        SetTokensBlockParse(state, listItem.content, { disableBlockRules: true });
        if (looseFrom >= 0) {
          wrapLooseRun(state, looseFrom);
        }
        state.env.isBlock = false;
        continue;
      }
    }
    // Parse inline children
    let inlineChildren = [];
    state.md.inline.parse(listItem.content.trim(), state.md, state.env, inlineChildren);
    // Context shared across child token processing
    const ctx: ListInlineContext = { li, iOpen, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents, openTokens, allListTokens };
    // Process each inline child token
    for (const child of inlineChildren) {
      processListChildToken(state, listItem, child, ctx);
    }
    if (looseFrom >= 0) {
      wrapLooseRun(state, looseFrom);
    }
    // Update context after processing children
    li = ctx.li;
    iOpen = ctx.iOpen;
    state.env.isBlock = false;
  }
  return { iOpen };
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
  const index: number = content.search(LATEX_ITEM_SPLIT_RE);
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
  nextLine: number,
  keepLineBreak: boolean = true
): ParsedListItem[] => {
  if (items.length > 0) {
    const lastIndex = items.length - 1;
    // Without the break for a line that renders to nothing: the softbreak would outlive it as `<br>`.
    items[lastIndex].content += (keepLineBreak ? "\n" : "") + lineText;
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
  openTokens: Token[],
  allListTokens: Token[]
) =>  {
  // ListItems records each marker's width on its innermost open list (openTokens[last]) — both
  // block items here and inline-opened nested lists — so the indent is resolved later, top-down,
  // once every list's final width is known (see resolveListPadding), independent of item order.
  const dataItems: ListItemsResult = ListItems(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, openTokens, allListTokens);
  return {
    iOpen: dataItems.iOpen,
    items: [],
    li: null,
  };
}

/**
 * Resolve per-list padding top-down (doc order) once every list's width is recorded. A list keeps
 * the default unless its marker overflows the ancestor indent + default, then reserves the
 * shortfall; the total (ancestor + own) is clamped to LIST_MAX_INDENT_EM. Depth = prentLevel.
 */
export const resolveListPadding = (listTokens: Token[]): void => {
  if (!listTokens.length) return;
  // No marker wider than the default can produce an attribute, so the arithmetic below is skipped.
  let overflows = false;
  for (let i = 0; i < listTokens.length; i++) {
    if ((listTokens[i].padding || 0) > LIST_DEFAULT_INDENT_EM) {
      overflows = true;
      break;
    }
  }
  if (!overflows) return;
  const baseDepth: number = listTokens[0].prentLevel || 0;
  // prefix[d] = indent summed over the levels above d; after a token of depth d it is d+2 long.
  const prefix: number[] = [0];
  for (const token of listTokens) {
    // Clamp depth to >= 0 (a negative would throw on prefix.length below).
    const depth: number = Math.max(0, (token.prentLevel || 0) - baseDepth);
    // Fill any skipped level with the default FIRST, so the ancestor sum has no holes (no NaN).
    for (let d = prefix.length; d <= depth; d++) {
      prefix[d] = prefix[d - 1] + LIST_DEFAULT_INDENT_EM;
    }
    // Ancestor indent counts toward the marker's room: it sits at `right: 100%` of the item, so it
    // grows leftwards into what the ancestors already reserved (see .li_level in styles-lists.ts).
    const ancestorSum: number = prefix[depth];
    const total: number = Math.min(token.padding || 0, LIST_MAX_INDENT_EM);
    // Ceil, never round: the reserve must not fall below the need — float noise can add one
    // hundredth on top, which is the safe direction. Negative past the clamp.
    const em: number = Math.ceil((total - ancestorSum) * 100) / 100;
    // Own indent for this level: the reserved em when the marker overflows, else the default.
    const indentEm: number = em > LIST_DEFAULT_INDENT_EM ? em : LIST_DEFAULT_INDENT_EM;
    if ((token.padding || 0) > LIST_MAX_INDENT_EM) {
      // Clamped: this level gets the clamp itself, the levels under it the default, so a marker may overlap.
      warnDistinct('padding-clamped:' + depth,
        '[list] marker indent hit the ' + LIST_MAX_INDENT_EM + 'em clamp; markers may overlap their text',
        { depth });
    }
    if (em > LIST_DEFAULT_INDENT_EM) {
      // Matches PADDING_EM_RE by construction: clamped to (default, LIST_MAX_INDENT_EM] and ceiled
      // to two decimals, so never exponential or negative. The renderer drops a miss silently.
      token.attrSet("data-padding-inline-start", String(em) + "em");
    }
    prefix.length = depth + 1;
    prefix[depth + 1] = ancestorSum + indentEm;
  }
};

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

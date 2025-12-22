import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import { incrementItemCount } from "./list-state";
import {
  ListType,
  ListInlineContext,
  ParsedListItem,
  ListOpenResult,
  isListType
} from "./latex-list-types";
import { SetItemizeLevelTokens } from "./re-level";
import {
  getListTokenTypes,
  applyListOpenState,
  applyListCloseState,
  closeOpenListItemIfNeeded,
} from "./latex-list-common";
import { BEGIN_LIST_ENV_RE } from "../common/consts";

/**
 * Creates an opening list-item token (<li>) for block-style LaTeX list items.
 * Handles marker parsing, enumeration start values, nesting metadata,
 * and updates the internal list-level state (item counters).
 *
 * @param state - Markdown-It state object
 * @param startLine - Starting line number of the list item
 * @param endLine - Ending line number of the list item
 * @param marker - Optional raw \item[...] marker string
 * @param li - Optional enumeration start value (e.g., \setcounter)
 * @param itemizeLevelTokens - Pre-parsed bullet tokens for itemize levels
 * @param enumerateLevelTypes - Current enumerate list-style types
 * @param itemizeLevelContents - Raw bullet text for each itemize level
 */
export const setTokenListItemOpenBlock = (
  state: any,
  startLine: number,
  endLine: number,
  marker: string | undefined,
  li: { value: number } | null,
  itemizeLevelTokens: Token[][],
  enumerateLevelTypes: string[],
  itemizeLevelContents: string[]
): void => {
  // Check current list depth and close previous item if needed
  closeOpenListItemIfNeeded(state);
  // Create opening <li> token
  let token: Token = state.push('latex_list_item_open', 'li', 1);
  incrementItemCount();
  token.meta = { isBlock: true };
  token.parentType = state.types?.length > 0
    ? state.types[state.types.length - 1]
    : '';
  // Parse marker (e.g., \item[abc])
  if (marker !== undefined) {
    token.marker = marker.trim();
    const parsedMarkerTokens: Token[] = [];
    state.md.inline.parse(marker, state.md, state.env, parsedMarkerTokens);
    token.markerTokens = parsedMarkerTokens;
  }
  // Apply enumeration start value
  if (li?.value !== undefined) {
    token.startValue = li.value;
    token.attrSet("value", String(li.value));
    li = null;
  }
  // Parent metadata
  token.parentStart = state.startLine;
  token.map = [startLine, endLine ];
  token.prentLevel = state.prentLevel;
  // Assign list-type metadata
  token.itemizeLevel = itemizeLevelTokens;
  token.itemizeLevelContents = itemizeLevelContents;
  token.enumerateLevel = enumerateLevelTypes;
};

/**
 * Creates an opening token for LaTeX list environments (\begin{itemize}, \begin{enumerate}).
 * Updates list nesting state, parent tracking, and attaches itemize/enumerate
 * styling metadata used for rendering markers and list formatting.
 *
 * @param state - Markdown-It processing state
 * @param startLine - Line number where the list begins
 * @param endLine - Line number where the list ends
 * @param type - List type ("itemize" or "enumerate")
 * @param itemizeLevelTokens - Pre-parsed itemize bullet tokens
 * @param enumerateLevelTypes - List-style types for enumerate levels
 * @param itemizeLevelContents - Raw bullet text for each itemize level
 */
export const setTokenOpenList = (
  state: StateBlock,
  startLine: number,
  endLine: number,
  type: ListType,
  itemizeLevelTokens: Token[][],
  enumerateLevelTypes: string[],
  itemizeLevelContents: string[]
): Token => {
  // Determine token type and HTML tag
  const { openType, htmlTag } = getListTokenTypes(type);
  // itemize_list_open or enumerate_list_open
  const token: Token = state.push(openType, htmlTag, 1);
  applyListOpenState(state as any, type, token);
  // Attach styling metadata
  token.itemizeLevel = itemizeLevelTokens;
  token.itemizeLevelContents = itemizeLevelContents;
  token.enumerateLevel = enumerateLevelTypes;
  token.prentLevel = state.prentLevel;
  // Map source lines
  if (startLine > -1 && endLine > -1) {
    state.startLine = startLine;
    token.map = [startLine, endLine];
  }
  return token;
};

/**
 * Parses a LaTeX list environment beginning on the current line
 * (e.g., \begin{itemize} or \begin{enumerate}), opens the
 * corresponding list token, and processes any inline content
 * that appears on the same line after \begin{...}.
 *
 * Returns:
 *  - iOpen: how many list environments were opened
 *  - tokenStart: the created *_list_open token, if any
 *  - li: optional enumerate start value extracted via \setcounter
 */
export const ListOpen = (
  state: StateBlock,
  startLine: number,
  lineText: string,
  itemizeLevelTokens: Token[][],
  enumerateLevelTypes: string[],
  itemizeLevelContents: string[]
): ListOpenResult => {
  let tokenStart: Token | null = null;
  let iOpen: number = 0;
  let padding: number = 0;
  let li: { value: number } | null = null;
  // Line must start with '\' to be a LaTeX command
  if (lineText.charCodeAt(0) !== 0x5c /* '\' */) {
    return { iOpen, tokenStart, li };
  }
  const match: RegExpMatchArray = lineText.match(BEGIN_LIST_ENV_RE);
  // If we are not already inside a list and no \begin{itemize/enumerate} found
  if (!match && state.parentType !== "itemize" && state.parentType !== "enumerate") {
    return { iOpen, tokenStart, li };
  }
  // Ensure itemize level tokens are prepared
  SetItemizeLevelTokens(state);
  if (!match) {
    // Already in a list, but no new begin here — nothing more to do
    return { iOpen, tokenStart, li };
  }
  const strAfter: string = lineText.slice(match.index! + match[0].length);
  const rawType: string = match[1].trim();
  if (!isListType(rawType)) {
    return { iOpen, tokenStart, li };
  }
  const listType: ListType = rawType;
  tokenStart = setTokenOpenList(
    state,
    startLine,
    startLine+1,
    listType,
    itemizeLevelTokens,
    enumerateLevelTypes,
    itemizeLevelContents
  );
  iOpen++;
  // Process inline content after \begin{...}
  if (strAfter && strAfter.trim().length > 0) {
    let children: Token = [];
    state.env.parentType = state.parentType;
    state.env.isBlock = true;
    state.env.prentLevel = state.prentLevel;
    state.md.inline.parse(strAfter, state.md, state.env, children);
    // Context shared across child token processing
    const ctx: ListInlineContext = {
      li,
      padding,
      iOpen,
      itemizeLevelTokens,
      enumerateLevelTypes,
      itemizeLevelContents
    };
    // Process each inline child token
    for (const child of children) {
      processListChildToken(state, {
        startLine,
        endLine: startLine,
        content: ''
      }, child, ctx);
    }
    // Update context after processing children
    li = ctx.li;
    padding = ctx.padding;
    iOpen = ctx.iOpen;
    state.env.isBlock = false;
  }
  return { iOpen, tokenStart, li };
};

/**
 * Closes the current LaTeX list environment (\end{itemize} / \end{enumerate}).
 *
 * - Closes any still-open list item if needed
 * - Emits the appropriate *_list_close token
 * - Updates list nesting levels and internal list-level state
 *
 * @param state - Markdown-It processing state
 * @param startLine - Line where the list block starts
 * @param endLine - Line where the list block ends
 * @returns The created closing list token
 */
export const setTokenCloseList = (
  state: StateBlock,
  startLine: number,
  endLine: number
) => {
  // Close an open <li> if there is one
  closeOpenListItemIfNeeded(state);
  const currentListType = state.types?.[state.types.length - 1];
  const isItemize: boolean = currentListType === ListType.itemize;
  const { closeType, htmlTag } = getListTokenTypes(
    isItemize ? ListType.itemize : ListType.enumerate
  );
  // itemize_list_close or enumerate_list_close
  const token: Token = state.push(closeType, htmlTag, -1);
  if (startLine > -1 && endLine > -1) {
    token.map = [startLine, endLine];
  }
  applyListCloseState(state, token);
  if (state.types && state.types.length > 0) {
    state.types.pop();
  }
};

/**
 * Processes a single inline token inside a LaTeX list item.
 *
 * This function:
 *  - Applies \setcounter values to list items (\item)
 *  - Handles custom list markers and computes marker padding
 *  - Updates parent metadata (type, nesting level, line map)
 *  - Adjusts list nesting state for itemize/enumerate environments
 *  - Attaches itemize/enumerate level styling metadata
 *
 * @param state - The Markdown-It state object
 * @param item - Parsed list item metadata (start/end line and content)
 * @param child - Inline token to process
 * @param ctx - Shared context for updating list state (padding, counters, levels)
 */
export const processListChildToken = (
  state: any,
  item: ParsedListItem,
  child: Token,
  ctx: ListInlineContext
): void => {
  // 1. Handle \setcounter
  if (child.type === 'setcounter') {
    ctx.li = { value: child.content };
    if (state.md.options?.forLatex && child.latex) {
      let token = state.push("setcounter", "", 0);
      token.latex = child.latex;
    }
    return;
  }
  // 2. Push token to state
  state.tokens.push(child);
  const token: Token = child;
  // 3. Apply enumerate start value for list item
  if (token.type === 'latex_list_item_open' && ctx.li?.hasOwnProperty('value')) {
    token.startValue = ctx.li.value;
    token.attrSet('value', ctx.li.value.toString());
    ctx.li = null;
  }
  // 4. Handle custom marker and compute padding
  if ((token as any).hasOwnProperty('marker')) {
    let paddingChild: number = 0;
    const markerTokens = (token as any).markerTokens ?? [];
    for (let i = 0; i < markerTokens.length; i++) {
      if (markerTokens[i].type === 'text') {
        paddingChild += markerTokens[i].content.length;
      }
    }
    if (paddingChild > ctx.padding) {
      ctx.padding = paddingChild;
    }
  }
  // 5. Parent metadata
  token.parentType = state.types && state.types.length > 0
    ? state.types[state.types.length - 1]
    : '';
  token.parentStart = state.startLine;
  token.map = [item.startLine, item.endLine + 1];
  if ((token as any).hasOwnProperty('inlinePos')) {
    token.bMarks = (token as any).inlinePos.start_content;
  }
  // 6. Logical nesting level for this token
  token.prentLevel = token.type === "latex_list_item_open"
    ? state.prentLevel + 1
    : state.prentLevel;
  // 7. Open / close list environments
  if (token.type === 'enumerate_list_open' || token.type === 'itemize_list_open') {
    state.prentLevel++;
    if (token.type === 'itemize_list_open') {
      state.types.push('itemize');
    } else {
      state.types.push('enumerate');
    }
    ctx.iOpen++;
  } else {
    if (token.type === 'enumerate_list_close' || token.type === 'itemize_list_close') {
      state.prentLevel--;
      if (state.types && state.types.length > 0) {
        state.types.pop();
      }
      ctx.iOpen--;
    }
  }
  // 8. Attach list-level styling metadata
  (token as any).itemizeLevel = ctx.itemizeLevelTokens;
  (token as any).itemizeLevelContents = ctx.itemizeLevelContents;
  (token as any).enumerateLevel = ctx.enumerateLevelTypes;
}

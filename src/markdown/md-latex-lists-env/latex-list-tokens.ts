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
import { BEGIN_LIST_ENV_RE, MARKER_GAP_EM } from "../common/consts";
import { tokenMarkerWidth } from "../common/display-width";

/**
 * Marker reservation for a custom `\item[...]` in `em`: sum of per-token widths (text by
 * glyph class, math by `widthEx`) plus one marker→content gap. Shared by the inline and
 * block item paths in `ListItems`.
 *
 * @param markerTokens - Parsed inline tokens of the marker
 * @returns Total marker reservation in em
 */
export const computeMarkerPadding = (markerTokens: Token[] | undefined): number => {
  let em = 0;
  const tokens: Token[] = markerTokens ?? [];
  for (let i = 0; i < tokens.length; i++) {
    em += tokenMarkerWidth(tokens[i]);
  }
  return em > 0 ? em + MARKER_GAP_EM : 0;
};

// A token that ends the loose run: it carries its own `<li>`, or it closes the list the run sits in.
const LIST_STRUCTURE_TYPES: ReadonlySet<string> = new Set([
  'latex_list_item_open', 'latex_list_item_close',
  'itemize_list_open', 'enumerate_list_open',
  'itemize_list_close', 'enumerate_list_close',
]);
const LIST_OPEN_TYPES: ReadonlySet<string> = new Set(['itemize_list_open', 'enumerate_list_open']);
const LIST_CLOSE_TYPES: ReadonlySet<string> = new Set(['itemize_list_close', 'enumerate_list_close']);

// Where the loose run ends: a sublist written in the chunk belongs inside its `<li>`, so a balanced
// open…close pair is taken whole. An unbalanced closer is the enclosing list's — stop before it.
const looseRunEnd = (tokens: Token[], from: number, limit: number): number => {
  let depth = 0;
  for (let i = from; i < limit; i++) {
    const type: string = tokens[i].type;
    if (LIST_OPEN_TYPES.has(type)) {
      depth++;
      continue;
    }
    if (depth > 0) {
      if (LIST_CLOSE_TYPES.has(type)) {
        depth--;
      }
      continue;
    }
    if (LIST_STRUCTURE_TYPES.has(type)) {
      return i;
    }
  }
  // An unclosed sublist would cross the tags: keep what precedes it.
  return depth > 0 ? looseRunEndBeforeOpen(tokens, from, limit) : limit;
};

// Falls back to the first list open, the run then holding no list at all.
const looseRunEndBeforeOpen = (tokens: Token[], from: number, limit: number): number => {
  for (let i = from; i < limit; i++) {
    if (LIST_STRUCTURE_TYPES.has(tokens[i].type)) {
      return i;
    }
  }
  return limit;
};

// The open token of the item this close belongs to, or null.
const matchingItemOpen = (tokens: Token[], closeIndex: number): Token | null => {
  let depth = 0;
  for (let i = closeIndex; i >= 0; i--) {
    const type: string = tokens[i].type;
    if (type === 'latex_list_item_close') {
      depth++;
    } else if (type === 'latex_list_item_open') {
      depth--;
      if (depth === 0) {
        return tokens[i];
      }
    }
  }
  return null;
};

// Index of the close that balances the list opened at `openIndex`, or -1.
const matchingListClose = (tokens: Token[], openIndex: number): number => {
  let depth = 0;
  for (let i = openIndex; i < tokens.length; i++) {
    const type: string = tokens[i].type;
    if (LIST_OPEN_TYPES.has(type)) {
      depth++;
    } else if (LIST_CLOSE_TYPES.has(type)) {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
};

// A sublist emitted after a marker-less wrapper has closed is a bare `<ul>` inside `<ul>`. Moves that
// close past the sublist, so it sits in the `<li>` — done on tokens, the exports walking those.
export const absorbSublistIntoWrapper = (tokens: Token[], from: number): void => {
  for (let i = Math.max(from, 1); i < tokens.length; i++) {
    if (!LIST_OPEN_TYPES.has(tokens[i].type)) {
      continue;
    }
    const close: Token = tokens[i - 1];
    if (close?.type !== 'latex_list_item_close' || !matchingItemOpen(tokens, i - 1)?.meta?.markerEmpty) {
      continue;
    }
    const end: number = matchingListClose(tokens, i);
    if (end < 0) {
      continue;
    }
    tokens.splice(i - 1, 1);
    tokens.splice(end, 0, close);
    i = end;
  }
};

// Wraps the tokens emitted in `[from, to)` in a marker-less `<li>` — `<ul>` admits nothing else.
// After the fact: a run that emitted nothing leaves nothing to wrap.
export const wrapLooseRun = (state: any, from: number, to?: number): void => {
  const limit: number = Math.min(to ?? state.tokens.length, state.tokens.length);
  const end: number = looseRunEnd(state.tokens, from, limit);
  const run: Token[] = state.tokens.slice(from, end);
  // Whitespace alone is not content: the same run reaches here trimmed from the block path.
  if (!run.some((t: Token) => t.type !== 'text' || (t.content || '').trim())) {
    return;
  }
  // Without the constructor the run stays where it is: a loose child renders, a thrown rule does not.
  if (typeof state.Token !== 'function') {
    return;
  }
  const open: Token = new state.Token('latex_list_item_open', 'li', 1);
  open.block = true;
  open.level = state.level;
  // `block` marks an item holding block markup, as the written-item path does for the same content.
  const holdsBlock: boolean = run.some((t: Token) => t.block);
  open.meta = { markerEmpty: true, isBlock: holdsBlock };
  open.parentType = state.types?.length > 0
    ? state.types[state.types.length - 1]
    : state.parentType;
  // Line span of what it wraps, so line numbering has the same anchor as a written item.
  const mapped: Token[] = run.filter((t: Token) => t.map);
  if (mapped.length) {
    open.map = [mapped[0].map[0], mapped[mapped.length - 1].map[1]];
  }
  const close: Token = new state.Token('latex_list_item_close', 'li', -1);
  close.block = true;
  close.level = state.level;
  // Spliced, not pushed, so `state.level` stays where the caller left it — the wrapped run keeps its own.
  state.tokens.splice(from, 0, open);
  state.tokens.splice(end + 1, 0, close);
};

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
): Token => {
  // Check current list depth and close previous item if needed
  closeOpenListItemIfNeeded(state);
  // Create opening <li> token
  const token: Token = state.push('latex_list_item_open', 'li', 1);
  incrementItemCount();
  token.meta = { isBlock: true };
  token.parentType = state.types?.length > 0
    ? state.types[state.types.length - 1]
    : '';
  // Parse marker (e.g., \item[abc])
  if (marker !== undefined) {
    // Parse the trimmed marker so markerTokens (used for width and rendering)
    // don't carry edge whitespace that inflates the padding.
    const trimmedMarker: string = marker.trim();
    token.marker = trimmedMarker;
    const parsedMarkerTokens: Token[] = [];
    state.md.inline.parse(trimmedMarker, state.md, state.env, parsedMarkerTokens);
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
  return token;
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
  itemizeLevelContents: string[],
  openTokens: Token[],
  allListTokens: Token[]
): ListOpenResult => {
  let tokenStart: Token | null = null;
  let iOpen: number = 0;
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
  // Register the new list so its marker padding is attributed here (same registry the block
  // path uses), covering same-line/single-line lists that never reach the block loop.
  openTokens.push(tokenStart);
  allListTokens.push(tokenStart);
  // Process inline content after \begin{...}
  if (strAfter && strAfter.trim().length > 0) {
    // Same-line content before the first `\item` lands in the `<ul>` like a chunk does.
    const looseFrom: number = state.tokens.length;
    let children: Token = [];
    state.env.parentType = state.parentType;
    state.env.isBlock = true;
    state.env.prentLevel = state.prentLevel;
    state.env.inheritedListType = state.parentType;
    state.md.inline.parse(strAfter, state.md, state.env, children);
    // Context shared across child token processing
    const ctx: ListInlineContext = {
      li,
      iOpen,
      itemizeLevelTokens,
      enumerateLevelTypes,
      itemizeLevelContents,
      openTokens,
      allListTokens
    };
    // Process each inline child token
    for (const child of children) {
      processListChildToken(state, {
        startLine,
        endLine: startLine,
        content: ''
      }, child, ctx);
    }
    wrapLooseRun(state, looseFrom);
    // Update context after processing children
    li = ctx.li;
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
    // A number, as the block path stores it: the two agreed only because consumers stringify it.
    const parsed: number = parseInt(child.content, 10);
    ctx.li = { value: Number.isNaN(parsed) ? 1 : parsed };
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
  // 4. Marker width → attribute to the innermost open list (not always the outer one).
  if (token.hasOwnProperty('marker')) {
    const paddingChild: number = computeMarkerPadding(token.markerTokens);
    const top: Token = ctx.openTokens[ctx.openTokens.length - 1];
    if (top && (!top.padding || top.padding < paddingChild)) {
      top.padding = paddingChild;
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
    // Seeded like the close branch checks it: an inline state built by a foreign rule may have none.
    if (!state.types) {
      state.types = [];
    }
    state.types.push(token.type === 'itemize_list_open' ? 'itemize' : 'enumerate');
    ctx.iOpen++;
    // Register in the shared registry so resolveListPadding sees inline-opened nested lists.
    token.prentLevel = state.prentLevel; // depth after entering, matching the block path
    ctx.openTokens.push(token);
    ctx.allListTokens.push(token);
  } else {
    if (token.type === 'enumerate_list_close' || token.type === 'itemize_list_close') {
      // Clamped like the block path: an unpaired close would make the level key negative.
      state.prentLevel = Math.max(0, state.prentLevel - 1);
      if (state.types && state.types.length > 0) {
        state.types.pop();
      }
      ctx.iOpen--;
      // Pop only a list of the matching kind. Weaker than the block path, which compares the
      // token itself: an unpaired close of the *same* kind still pops an outer list here, since
      // a close token carries no link to its opener in the inline stream.
      const openType: string = token.type === 'itemize_list_close' ? 'itemize_list_open' : 'enumerate_list_open';
      if (ctx.openTokens[ctx.openTokens.length - 1]?.type === openType) {
        ctx.openTokens.pop();
      }
    }
  }
  // 8. Attach list-level styling metadata
  (token as any).itemizeLevel = ctx.itemizeLevelTokens;
  (token as any).itemizeLevelContents = ctx.itemizeLevelContents;
  (token as any).enumerateLevel = ctx.enumerateLevelTypes;
}

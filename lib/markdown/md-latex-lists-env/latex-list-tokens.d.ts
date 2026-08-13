import type Token from 'markdown-it/lib/token';
import { ListType, ListInlineContext, ParsedListItem, ListOpenResult } from "./latex-list-types";
/**
 * Marker reservation for a custom `\item[...]` in `em`: sum of per-token widths (text by
 * glyph class, math by `widthEx`) plus one marker→content gap. Shared by the inline and
 * block item paths in `ListItems`.
 *
 * @param markerTokens - Parsed inline tokens of the marker
 * @returns Total marker reservation in em
 */
export declare const computeMarkerPadding: (markerTokens: Token[] | undefined) => number;
export declare const LIST_OPEN_TYPES: ReadonlySet<string>;
export declare const LIST_CLOSE_TYPES: ReadonlySet<string>;
/** Per list open, and copied onto its matching close: 0 needs no host, 1 sits in an `itemize`, 2 in an
 *  `enumerate`. A list is hosted when the container it opens in is a list rather than an item — reading
 *  only the token before it missed a list opening after a sibling's close, which then had no `<li>`. */
export declare const listHostFlags: (tokens: Token[]) => Int8Array;
export declare const absorbSublistIntoWrapper: (tokens: Token[], from: number) => void;
/** What wrapping a run needs. `types` is the list stack these rules keep beside markdown-it's own, and
 *  `Token` is optional because a hand-built state may not carry the constructor. */
type LooseRunState = {
    tokens: Token[];
    level: number;
    parentType: string;
    types?: string[];
    Token?: new (type: string, tag: string, nesting: number) => Token;
};
export declare const wrapLooseRun: (state: LooseRunState, from: number, to?: number) => void;
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
export declare const setTokenListItemOpenBlock: (state: any, startLine: number, endLine: number, marker: string | undefined, li: {
    value: number;
} | null, itemizeLevelTokens: Token[][], enumerateLevelTypes: string[], itemizeLevelContents: string[]) => Token;
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
export declare const setTokenOpenList: (state: StateBlock, startLine: number, endLine: number, type: ListType, itemizeLevelTokens: Token[][], enumerateLevelTypes: string[], itemizeLevelContents: string[]) => Token;
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
export declare const ListOpen: (state: StateBlock, startLine: number, lineText: string, itemizeLevelTokens: Token[][], enumerateLevelTypes: string[], itemizeLevelContents: string[], openTokens: Token[], allListTokens: Token[]) => ListOpenResult;
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
export declare const setTokenCloseList: (state: StateBlock, startLine: number, endLine: number, opener?: Token) => void;
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
export declare const processListChildToken: (state: any, item: ParsedListItem, child: Token, ctx: ListInlineContext) => void;
export {};

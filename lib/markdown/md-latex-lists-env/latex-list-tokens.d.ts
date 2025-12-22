import type Token from 'markdown-it/lib/token';
import { ListType, ListInlineContext, ParsedListItem, ListOpenResult } from "./latex-list-types";
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
} | null, itemizeLevelTokens: Token[][], enumerateLevelTypes: string[], itemizeLevelContents: string[]) => void;
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
export declare const ListOpen: (state: StateBlock, startLine: number, lineText: string, itemizeLevelTokens: Token[][], enumerateLevelTypes: string[], itemizeLevelContents: string[]) => ListOpenResult;
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
export declare const setTokenCloseList: (state: StateBlock, startLine: number, endLine: number) => void;
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

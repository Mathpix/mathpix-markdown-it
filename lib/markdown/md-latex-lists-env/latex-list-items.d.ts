import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type Token from 'markdown-it/lib/token';
import { ListItemsResult, ParsedListItem } from "./latex-list-types";
/**
 * Processes block-style LaTeX list items by parsing their content
 * using the block parser. This is used for items whose content
 * contains block environments (e.g., \begin{table}, \begin{figure}, etc.).
 *
 * @param state - Markdown-It processing state
 * @param items - Array of parsed list items
 */
export declare const ListItemsBlock: (state: any, items: ParsedListItem[] | null | undefined) => void;
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
export declare const ListItems: (state: StateBlock | StateInline, items: ParsedListItem[], itemizeLevelTokens: Token[][], enumerateLevelTypes: string[], li: {
    value: number;
} | null, iOpen: number, itemizeLevelContents: string[]) => ListItemsResult;
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
export declare const ItemsListPush: (items: ParsedListItem[], content: string, startLine: number, endLine: number) => ParsedListItem[];
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
export declare const ItemsAddToPrev: (items: ParsedListItem[], lineText: string, nextLine: number) => ParsedListItem[];
export declare const finalizeListItems: (state: StateBlock | StateInline, items: ParsedListItem[], itemizeLevelTokens: Token[][], enumerateLevelTypes: string[], li: {
    value: number;
} | null, iOpen: number, itemizeLevelContents: string[], tokenStart: Token | null) => {
    iOpen: number;
    items: any[];
    li: any;
};
export declare const splitInlineListEnv: (lineText: string, match: any) => {
    sB: string;
    sE: string;
    isBacktickEscapedPair: boolean;
};

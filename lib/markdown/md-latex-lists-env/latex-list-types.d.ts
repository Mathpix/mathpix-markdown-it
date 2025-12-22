import type Token from 'markdown-it/lib/token';
export declare enum ListType {
    itemize = "itemize",
    enumerate = "enumerate"
}
export interface ListInlineContext {
    li: {
        value: any;
    } | null;
    padding: number;
    iOpen: number;
    itemizeLevelTokens: Token[][];
    enumerateLevelTypes: string[];
    itemizeLevelContents: string[];
}
export interface ParsedListItem {
    startLine: number;
    endLine: number;
    content: string;
}
export interface ListItemsResult {
    iOpen: number;
    padding: number;
}
export interface ListOpenResult {
    iOpen: number;
    tokenStart: Token | null;
    li?: {
        value: number;
    } | null;
}
/**
 * Result of handling a potential inline `\begin{lstlisting}` occurrence.
 *
 * @property handled  Whether the current line was handled (matched a begin).
 * @property envDepth Updated lstlisting environment depth after handling.
 * @property items    Aggregated items list (possibly updated).
 * @property lineText The (unchanged) original line text.
 */
export interface LstEndResult {
    handled: boolean;
    envDepth: number;
    items: any[];
    lineText: string;
}
export declare const isListType: (value: string) => value is ListType;

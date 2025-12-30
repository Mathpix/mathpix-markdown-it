import type Token from 'markdown-it/lib/token';
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
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
 * @property stack Updated lstlisting/tabular environment depth after handling.
 * @property items    Aggregated items list (possibly updated).
 * @property lineText The (unchanged) original line text.
 */
export interface LstEndResult {
    handled: boolean;
    stack: OpaqueStack;
    items: any[];
    lineText: string;
}
export declare const isListType: (value: string) => value is ListType;
export interface CustomMarkerHtmlResult {
    htmlMarker: string;
    markerType: string;
    textContent: string;
    isMarkerEmpty: boolean;
}
/**
 * Minimal "BlockState-like" contract used by list environment parser.
 * This allows reusing the same core logic for:
 * - real markdown-it StateBlock (block rule)
 * - synthetic block state (inline rule wrapper)
 */
export type StateBlockLike = Pick<StateBlock, 'md' | 'src' | 'env' | 'bMarks' | 'eMarks' | 'tShift' | 'line' | 'startLine' | 'parentType' | 'level' | 'prentLevel' | 'push'>;
/** Token push signature used by markdown-it. */
export type PushFn<TTok extends Token = Token> = (type: string, tag: string, nesting: number) => TTok;
/**
 * A lightweight buffered version of markdown-it StateBlock.
 * It shares most fields via prototype inheritance but isolates:
 * - tokens (local buffer)
 * - env (shallow-cloned)
 * - push() (writes into the local buffer)
 */
export type BufferedBlockState = StateBlock & {
    tokens: Token[];
    push: PushFn<Token>;
};
/** Result for a fully matched LaTeX list environment. */
export type EnvMatch = {
    type: ListType;
    start: number;
    end: number;
    raw: string;
};
export type ParseListEnvResult = {
    ok: boolean;
    tokens: Token[];
    /** Optional diagnostics for debugging/telemetry. */
    error?: string;
};
export type OpaqueEnvType = "lstlisting" | "tabular";
export type OpaqueStack = OpaqueEnvType[];
